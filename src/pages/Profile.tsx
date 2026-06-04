import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { getProfile, saveProfile, isLoggedIn, logout } from '@/lib/store';
import { getWardrobeStats } from '@/lib/recommendation';
import { getWardrobe, getSavedOutfits } from '@/lib/store';
import { UserProfile, StyleType, OccasionType, BodyType, Gender, ALL_SIZES } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { inferUserSize } from '@/lib/sizeAdaptation';
import { pushLocalProfileToCloud } from '@/lib/socialStore';
import { frequencyStats } from '@/lib/frequency';
import { Camera, Trash2, Shirt, Heart, Sparkles, CalendarDays, LogOut } from 'lucide-react';

const styles: StyleType[] = ['casual', 'formal', 'sporty', 'streetwear', 'minimalist', 'bohemian', 'vintage', 'classic'];
const occasions: OccasionType[] = ['school', 'work', 'gym', 'party', 'date', 'outdoor', 'everyday'];
const colorOptions = ['Black', 'White', 'Blue', 'Navy', 'Cream', 'Olive', 'Rose', 'Gray', 'Brown', 'Beige', 'Red', 'Green'];
const bodyTypes: BodyType[] = ['slim', 'athletic', 'average', 'curvy', 'plus-size'];
const genders: Gender[] = ['male', 'female', 'non-binary', 'prefer-not-to-say'];

function MultiSelect({ label, options, selected, onChange }: {
  label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) => onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt]);
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button key={opt} type="button" onClick={() => toggle(opt)}
            className={`text-sm px-4 py-2 rounded-full capitalize transition-colors ${
              selected.includes(opt) ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}>{opt}</button>
        ))}
      </div>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>(getProfile());
  const wardrobe = getWardrobe();
  const stats = getWardrobeStats(wardrobe);
  const saved = getSavedOutfits();
  const freq = frequencyStats();
  const [sizeSuggestion, setSizeSuggestion] = useState(inferUserSize(profile.currentSize));
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSizeSuggestion(inferUserSize(profile.currentSize));
  }, [profile.currentSize]);

  const handleAvatarUpload = (file: File) => {
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      toast.error('Please upload a JPG, PNG, or WEBP image');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error('Image must be under 3MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const updated = { ...profile, avatarUrl: reader.result as string };
      setProfile(updated);
      saveProfile(updated);
      await pushLocalProfileToCloud();
      toast.success('Profile picture updated');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = async () => {
    const updated = { ...profile, avatarUrl: undefined };
    setProfile(updated);
    saveProfile(updated);
    await pushLocalProfileToCloud();
    toast.success('Profile picture removed');
  };

  const handleSave = async () => {
    saveProfile(profile);
    await pushLocalProfileToCloud();
    toast.success('Profile saved! Outfit suggestions updated.');
  };

  const acceptSizeSuggestion = async () => {
    if (!sizeSuggestion) return;
    const updated = { ...profile, currentSize: sizeSuggestion.suggested };
    setProfile(updated);
    saveProfile(updated);
    await pushLocalProfileToCloud();
    toast.success(`Size updated to ${sizeSuggestion.suggested}`);
    setSizeSuggestion(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out');
  };

  const memberSince = new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
        {/* Profile header card */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative group">
              <Avatar className="h-28 w-28 ring-2 ring-border">
                {profile.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={profile.name} />}
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-display">
                  {profile.avatarInitial}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-0 right-0 bg-accent text-accent-foreground rounded-full h-9 w-9 flex items-center justify-center shadow-md hover:scale-105 transition"
                aria-label="Upload avatar"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleAvatarUpload(f); e.target.value=''; }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="font-display text-3xl sm:text-4xl mb-1">{profile.name || 'Your Profile'}</h1>
              <p className="text-muted-foreground text-sm mb-3">
                {profile.email || 'No email set'} · Member since {memberSince}
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.preferredStyles.slice(0, 3).map(s => (
                  <span key={s} className="text-xs px-3 py-1 bg-secondary rounded-full capitalize">{s}</span>
                ))}
                <span className="text-xs px-3 py-1 bg-accent/10 text-accent rounded-full">Size {profile.currentSize}</span>
              </div>
              {profile.avatarUrl && (
                <button
                  onClick={handleRemoveAvatar}
                  className="text-xs text-muted-foreground hover:text-destructive mt-3 inline-flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" /> Remove photo
                </button>
              )}
            </div>

            {isLoggedIn() && (
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" /> Log Out
              </Button>
            )}
          </div>
        </div>

        {sizeSuggestion && (
          <div className="bg-accent/10 border border-accent/30 rounded-2xl p-5 mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-accent mb-1 font-semibold">Size Suggestion</p>
              <p className="text-sm font-semibold">Update your size from {profile.currentSize} → {sizeSuggestion.suggested}?</p>
              <p className="text-xs text-muted-foreground mt-1">{sizeSuggestion.reason}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="outline" onClick={() => setSizeSuggestion(null)}>Dismiss</Button>
              <Button size="sm" onClick={acceptSizeSuggestion}>Accept</Button>
            </div>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Clothes', value: stats.totalItems, icon: Shirt },
            { label: 'Saved Outfits', value: saved.length, icon: Heart },
            { label: 'Wears (14d)', value: freq.recentWears, icon: CalendarDays },
            { label: 'Style Matches', value: profile.preferredStyles.length, icon: Sparkles },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</p>
                <s.icon className="h-4 w-4 text-accent" />
              </div>
              <p className="text-3xl font-display">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="font-display text-2xl">Preferences</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Name</label>
              <Input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="h-11 rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Age</label>
              <Input type="number" value={profile.age} onChange={e => setProfile({ ...profile, age: +e.target.value })} className="h-11 rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Gender</p>
              <div className="flex flex-wrap gap-2">
                {genders.map(g => (
                  <button key={g} type="button" onClick={() => setProfile({ ...profile, gender: g })}
                    className={`text-sm px-4 py-2 rounded-full capitalize transition-colors ${
                      profile.gender === g ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    }`}>{g}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Body Type</p>
              <div className="flex flex-wrap gap-2">
                {bodyTypes.map(b => (
                  <button key={b} type="button" onClick={() => setProfile({ ...profile, bodyType: b })}
                    className={`text-sm px-4 py-2 rounded-full capitalize transition-colors ${
                      profile.bodyType === b ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    }`}>{b}</button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Current Size</p>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map(sz => (
                <button key={sz} type="button" onClick={() => setProfile({ ...profile, currentSize: sz })}
                  className={`text-sm px-4 py-2 rounded-full transition-colors ${
                    profile.currentSize === sz ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                  }`}>{sz}</button>
              ))}
            </div>
          </div>

          <MultiSelect label="Preferred Styles" options={styles} selected={profile.preferredStyles}
            onChange={v => setProfile({ ...profile, preferredStyles: v as StyleType[] })} />
          <MultiSelect label="Favorite Colors" options={colorOptions} selected={profile.favoriteColors}
            onChange={v => setProfile({ ...profile, favoriteColors: v })} />
          <MultiSelect label="Occasion Preferences" options={occasions} selected={profile.occasionPreference}
            onChange={v => setProfile({ ...profile, occasionPreference: v as OccasionType[] })} />

          <Button onClick={handleSave} size="lg" className="w-full h-12 rounded-full">
            Save Profile &amp; Update Recommendations
          </Button>
        </div>
      </div>
    </div>
  );
}
