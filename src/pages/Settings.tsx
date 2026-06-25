import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Bell, Palette, Shield, Eye, Globe, Sun, Moon, Monitor, KeyRound,
  Smartphone, History, LogOut, Sparkles, Languages, Clock, CalendarDays,
} from 'lucide-react';
import { toast } from 'sonner';

type Theme = 'light' | 'dark' | 'system';
type Density = 'compact' | 'comfortable';
type Visibility = 'public' | 'friends' | 'private';

function SectionCard({
  icon: Icon, title, description, children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="transition-all duration-200 hover:border-[#FF8C00]/50 hover:shadow-md">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#FF8C00]/10 text-[#FF8C00] flex items-center justify-center shrink-0">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-display">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function ToggleRow({
  label, hint, checked, onCheckedChange,
}: { label: string; hint?: string; checked: boolean; onCheckedChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg p-3 -mx-3 transition-colors hover:bg-[#FF8C00]/5">
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export default function Settings() {
  // Notifications
  const [notif, setNotif] = useState({
    outfitReminders: true,
    plannerReminders: true,
    weatherAlerts: true,
    communityActivity: false,
    styleRecs: true,
    email: false,
    push: true,
  });

  // Theme
  const [theme, setTheme] = useState<Theme>('system');
  useEffect(() => {
    const root = document.documentElement;
    const apply = (t: Theme) => {
      const dark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      root.classList.toggle('dark', dark);
    };
    apply(theme);
  }, [theme]);

  // Appearance
  const [density, setDensity] = useState<Density>('comfortable');
  const [animations, setAnimations] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Privacy
  const [profileVisibility, setProfileVisibility] = useState<Visibility>('public');
  const [communityVisible, setCommunityVisible] = useState(true);
  const [activityVisible, setActivityVisible] = useState(true);

  // Security
  const [twoFactor, setTwoFactor] = useState(false);

  // General
  const [language, setLanguage] = useState('en');
  const [region, setRegion] = useState('US');
  const [timezone, setTimezone] = useState('UTC');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');

  const themeOptions: { id: Theme; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'light', label: 'Light Mode', icon: Sun },
    { id: 'dark', label: 'Dark Mode', icon: Moon },
    { id: 'system', label: 'System Default', icon: Monitor },
  ];

  const accents = ['#FF8C00', '#E11D48', '#10B981', '#6366F1', '#A855F7', '#0EA5E9'];
  const [accent, setAccent] = useState('#FF8C00');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 md:px-6 pt-24 pb-16 max-w-5xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure notifications, appearance, privacy, and account preferences.
          </p>
        </header>

        <div className="grid gap-6">
          {/* Notifications */}
          <SectionCard
            icon={Bell}
            title="Notifications"
            description="Choose what StyleSense lets you know about."
          >
            <ToggleRow label="Outfit reminders" hint="Daily nudges to plan your look."
              checked={notif.outfitReminders} onCheckedChange={v => setNotif({ ...notif, outfitReminders: v })} />
            <ToggleRow label="Planner reminders" hint="Get pinged about your scheduled outfits."
              checked={notif.plannerReminders} onCheckedChange={v => setNotif({ ...notif, plannerReminders: v })} />
            <ToggleRow label="Weather alerts" hint="Heads up when conditions change."
              checked={notif.weatherAlerts} onCheckedChange={v => setNotif({ ...notif, weatherAlerts: v })} />
            <ToggleRow label="New community activity" hint="Likes, ratings and comments on your shared outfits."
              checked={notif.communityActivity} onCheckedChange={v => setNotif({ ...notif, communityActivity: v })} />
            <ToggleRow label="Style recommendations" hint="Fresh AI-powered outfit ideas."
              checked={notif.styleRecs} onCheckedChange={v => setNotif({ ...notif, styleRecs: v })} />
            <Separator />
            <ToggleRow label="Email notifications" checked={notif.email}
              onCheckedChange={v => setNotif({ ...notif, email: v })} />
            <ToggleRow label="Push notifications" checked={notif.push}
              onCheckedChange={v => setNotif({ ...notif, push: v })} />
          </SectionCard>

          {/* Theme */}
          <SectionCard icon={Palette} title="Theme" description="Pick how StyleSense looks on your device.">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {themeOptions.map(opt => {
                const active = theme === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setTheme(opt.id)}
                    className={`group rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                      active
                        ? 'border-[#FF8C00] bg-[#FF8C00]/5 shadow-sm'
                        : 'border-border hover:border-[#FF8C00]/60 hover:bg-[#FF8C00]/5'
                    }`}
                  >
                    <opt.icon className={`h-5 w-5 mb-3 transition-colors ${active ? 'text-[#FF8C00]' : 'text-muted-foreground group-hover:text-[#FF8C00]'}`} />
                    <p className="font-medium text-sm">{opt.label}</p>
                    <div className="mt-3 h-12 rounded-md border bg-gradient-to-br from-background to-secondary" />
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Accent color</p>
              <div className="flex flex-wrap gap-2">
                {accents.map(c => (
                  <button
                    key={c}
                    onClick={() => setAccent(c)}
                    aria-label={`Accent ${c}`}
                    className={`h-9 w-9 rounded-full border-2 transition-transform hover:scale-110 ${
                      accent === c ? 'border-foreground' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </SectionCard>

          {/* Appearance */}
          <SectionCard icon={Sparkles} title="Appearance" description="Density and motion preferences.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(['comfortable', 'compact'] as Density[]).map(d => {
                const active = density === d;
                return (
                  <button
                    key={d}
                    onClick={() => setDensity(d)}
                    className={`rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                      active ? 'border-[#FF8C00] bg-[#FF8C00]/5' : 'border-border hover:border-[#FF8C00]/60 hover:bg-[#FF8C00]/5'
                    }`}
                  >
                    <p className="font-medium text-sm capitalize">{d} view</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {d === 'comfortable' ? 'Spacious layout with breathing room.' : 'Denser layout — see more at once.'}
                    </p>
                  </button>
                );
              })}
            </div>
            <Separator />
            <ToggleRow label="Enable animations" hint="Subtle transitions throughout the app."
              checked={animations} onCheckedChange={setAnimations} />
            <ToggleRow label="Reduced motion" hint="Minimize non-essential animation."
              checked={reducedMotion} onCheckedChange={setReducedMotion} />
          </SectionCard>

          {/* Security */}
          <SectionCard icon={Shield} title="Security" description="Protect your account and sessions.">
            <div className="grid sm:grid-cols-2 gap-3">
              <Button variant="outline" className="justify-start gap-2 h-auto py-3 hover:border-[#FF8C00] hover:text-[#FF8C00]"
                onClick={() => toast.info('Change password flow coming soon.')}>
                <KeyRound className="h-4 w-4" /> Change password
              </Button>
              <Button variant="outline" className="justify-start gap-2 h-auto py-3 hover:border-[#FF8C00] hover:text-[#FF8C00]"
                onClick={() => toast.info('Login activity preview.')}>
                <History className="h-4 w-4" /> Login activity
              </Button>
              <Button variant="outline" className="justify-start gap-2 h-auto py-3 hover:border-[#FF8C00] hover:text-[#FF8C00]"
                onClick={() => toast.info('Active sessions preview.')}>
                <Smartphone className="h-4 w-4" /> Active sessions
              </Button>
              <Button variant="outline" className="justify-start gap-2 h-auto py-3 hover:border-[#FF8C00] hover:text-[#FF8C00]"
                onClick={() => toast.info('Device management preview.')}>
                <Smartphone className="h-4 w-4" /> Device management
              </Button>
            </div>
            <Separator />
            <ToggleRow label="Two-factor authentication" hint="Extra layer of security at sign-in."
              checked={twoFactor} onCheckedChange={setTwoFactor} />
            <Button variant="ghost" className="text-destructive justify-start gap-2 hover:bg-destructive/10"
              onClick={() => toast.info('Sign out from the navigation bar.')}>
              <LogOut className="h-4 w-4" /> Sign out of all devices
            </Button>
          </SectionCard>

          {/* Privacy */}
          <SectionCard icon={Eye} title="Privacy" description="Control what others can see about you.">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Profile visibility</p>
              <div className="grid grid-cols-3 gap-2">
                {(['public', 'friends', 'private'] as Visibility[]).map(v => {
                  const active = profileVisibility === v;
                  return (
                    <button
                      key={v}
                      onClick={() => setProfileVisibility(v)}
                      className={`rounded-lg border-2 p-3 text-sm font-medium capitalize transition-all duration-200 ${
                        active ? 'border-[#FF8C00] bg-[#FF8C00]/5 text-[#FF8C00]' : 'border-border hover:border-[#FF8C00]/60'
                      }`}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>
            <Separator />
            <ToggleRow label="Show me in the community feed" checked={communityVisible}
              onCheckedChange={setCommunityVisible} />
            <ToggleRow label="Share activity (wears, plans)" checked={activityVisible}
              onCheckedChange={setActivityVisible} />
          </SectionCard>

          {/* General */}
          <SectionCard icon={Globe} title="General" description="Language, region and formatting.">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                  <Languages className="h-3.5 w-3.5" /> Language
                </Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                  <Globe className="h-3.5 w-3.5" /> Region
                </Label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="GB">United Kingdom</SelectItem>
                    <SelectItem value="PH">Philippines</SelectItem>
                    <SelectItem value="JP">Japan</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> Timezone
                </Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific (US)</SelectItem>
                    <SelectItem value="America/New_York">Eastern (US)</SelectItem>
                    <SelectItem value="Europe/London">London</SelectItem>
                    <SelectItem value="Asia/Manila">Manila</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" /> Date format
                </Label>
                <Select value={dateFormat} onValueChange={setDateFormat}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SectionCard>

          {/* Save bar */}
          <div className="flex justify-end pt-2">
            <Button
              className="rounded-full px-8 bg-[#FF8C00] text-white hover:bg-[#FF8C00]/90 transition-colors"
              onClick={() => toast.success('Settings saved.')}
            >
              Save changes
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
