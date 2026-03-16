import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { getProfile, saveProfile } from '@/lib/store';
import { UserProfile, StyleType, ClothingCategory, OccasionType, BodyType, Gender } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { logout, isLoggedIn } from '@/lib/store';
import { useNavigate } from 'react-router-dom';

const styles: StyleType[] = ['casual', 'formal', 'streetwear', 'minimalist', 'bohemian', 'sporty', 'vintage', 'classic'];
const categoryOptions: ClothingCategory[] = ['tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories', 'activewear'];
const occasions: OccasionType[] = ['casual', 'formal', 'sports', 'party', 'work', 'date', 'outdoor'];
const colorOptions = ['Black', 'White', 'Blue', 'Navy', 'Cream', 'Olive', 'Rose', 'Gray', 'Brown', 'Camel', 'Multi', 'Sage'];
const bodyTypes: BodyType[] = ['slim', 'athletic', 'average', 'curvy', 'plus-size'];
const genders: Gender[] = ['male', 'female', 'non-binary', 'prefer-not-to-say'];

function MultiSelect({ label, options, selected, onChange }: {
  label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) => {
    onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt]);
  };
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`text-xs px-3 py-1.5 rounded-sm capitalize transition-colors ${
              selected.includes(opt)
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>(getProfile());

  const handleSave = () => {
    saveProfile(profile);
    toast.success('Profile saved! Recommendations updated.');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-2xl">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Your Profile</h1>
            <p className="text-muted-foreground">Your preferences shape your recommendations</p>
          </div>
          {isLoggedIn() && (
            <Button variant="ghost" size="sm" onClick={handleLogout}>Log Out</Button>
          )}
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Name</label>
              <Input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">Age</label>
              <Input type="number" value={profile.age} onChange={e => setProfile({ ...profile, age: +e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Gender</p>
              <div className="flex flex-wrap gap-2">
                {genders.map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setProfile({ ...profile, gender: g })}
                    className={`text-xs px-3 py-1.5 rounded-sm capitalize transition-colors ${
                      profile.gender === g ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Body Type</p>
              <div className="flex flex-wrap gap-2">
                {bodyTypes.map(b => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setProfile({ ...profile, bodyType: b })}
                    className={`text-xs px-3 py-1.5 rounded-sm capitalize transition-colors ${
                      profile.bodyType === b ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <MultiSelect
            label="Preferred Styles"
            options={styles}
            selected={profile.preferredStyles}
            onChange={v => setProfile({ ...profile, preferredStyles: v as StyleType[] })}
          />
          <MultiSelect
            label="Favorite Colors"
            options={colorOptions}
            selected={profile.favoriteColors}
            onChange={v => setProfile({ ...profile, favoriteColors: v })}
          />
          <MultiSelect
            label="Favorite Categories"
            options={categoryOptions}
            selected={profile.favoriteCategories}
            onChange={v => setProfile({ ...profile, favoriteCategories: v as ClothingCategory[] })}
          />
          <MultiSelect
            label="Occasion Preferences"
            options={occasions}
            selected={profile.occasionPreference}
            onChange={v => setProfile({ ...profile, occasionPreference: v as OccasionType[] })}
          />

          <Button onClick={handleSave} size="lg" className="w-full">
            Save Profile & Update Recommendations
          </Button>
        </div>
      </div>
    </div>
  );
}
