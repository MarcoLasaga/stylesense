import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Luggage, MapPin, CalendarRange, Cloud, Sun, Snowflake, CloudRain, Sparkles,
  Shirt, Footprints, Glasses, ShowerHead, Check
} from 'lucide-react';
import { motion } from 'framer-motion';

type Climate = 'warm' | 'mild' | 'cold' | 'rainy';

const CLIMATES: { value: Climate; label: string; Icon: typeof Sun }[] = [
  { value: 'warm', label: 'Warm', Icon: Sun },
  { value: 'mild', label: 'Mild', Icon: Cloud },
  { value: 'cold', label: 'Cold', Icon: Snowflake },
  { value: 'rainy', label: 'Rainy', Icon: CloudRain },
];

interface PackItem { name: string; qty: number; group: string; Icon: typeof Shirt; }

function buildList(days: number, climate: Climate): PackItem[] {
  const tops = climate === 'cold' ? Math.ceil(days * 0.8) : days;
  const bottoms = Math.ceil(days / 2);
  const underwear = days + 1;
  const socks = days + 1;
  const shoes = days >= 4 ? 2 : 1;

  const base: PackItem[] = [
    { name: climate === 'cold' ? 'Long-sleeve tops' : 'T-shirts', qty: tops, group: 'Clothing', Icon: Shirt },
    { name: 'Pants / Bottoms', qty: bottoms, group: 'Clothing', Icon: Shirt },
    { name: 'Underwear', qty: underwear, group: 'Clothing', Icon: Shirt },
    { name: 'Socks', qty: socks, group: 'Clothing', Icon: Shirt },
    { name: 'Pajamas', qty: Math.min(2, Math.ceil(days / 4)), group: 'Clothing', Icon: Shirt },
    { name: 'Shoes', qty: shoes, group: 'Footwear', Icon: Footprints },
    { name: 'Toothbrush & toiletries kit', qty: 1, group: 'Essentials', Icon: ShowerHead },
    { name: 'Sunglasses', qty: 1, group: 'Accessories', Icon: Glasses },
  ];

  if (climate === 'warm') {
    base.push({ name: 'Swimwear', qty: 1, group: 'Clothing', Icon: Shirt });
    base.push({ name: 'Sunscreen', qty: 1, group: 'Essentials', Icon: ShowerHead });
    base.push({ name: 'Sandals', qty: 1, group: 'Footwear', Icon: Footprints });
  }
  if (climate === 'cold') {
    base.push({ name: 'Warm jacket / coat', qty: 1, group: 'Outerwear', Icon: Shirt });
    base.push({ name: 'Thermal layer', qty: 2, group: 'Clothing', Icon: Shirt });
    base.push({ name: 'Beanie & gloves', qty: 1, group: 'Accessories', Icon: Glasses });
  }
  if (climate === 'rainy') {
    base.push({ name: 'Rain jacket', qty: 1, group: 'Outerwear', Icon: Shirt });
    base.push({ name: 'Compact umbrella', qty: 1, group: 'Essentials', Icon: ShowerHead });
    base.push({ name: 'Waterproof shoes', qty: 1, group: 'Footwear', Icon: Footprints });
  }
  if (climate === 'mild') {
    base.push({ name: 'Light jacket', qty: 1, group: 'Outerwear', Icon: Shirt });
  }
  return base;
}

export default function PackingAssistant() {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(5);
  const [climate, setClimate] = useState<Climate>('mild');
  const [showList, setShowList] = useState(false);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const list = buildList(days, climate);
  const groups = Array.from(new Set(list.map(i => i.group)));

  const toggleCheck = (name: string) => {
    const next = new Set(checked);
    next.has(name) ? next.delete(name) : next.add(name);
    setChecked(next);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
        <div className="flex items-center gap-3 mb-1">
          <Luggage className="h-7 w-7 text-accent" />
          <h1 className="text-3xl font-display font-bold">Packing Assistant</h1>
        </div>
        <p className="text-muted-foreground text-sm mb-8">Build a smart packing list tailored to your trip.</p>

        {/* Form */}
        <div className="bg-card border border-border rounded-2xl p-6 grid sm:grid-cols-3 gap-4 mb-8">
          <div className="sm:col-span-1">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <MapPin className="h-3 w-3" /> Destination
            </Label>
            <Input placeholder="Tokyo, Paris…" value={destination} onChange={e => setDestination(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <CalendarRange className="h-3 w-3" /> Days
            </Label>
            <Input type="number" min={1} max={60} value={days} onChange={e => setDays(Math.max(1, parseInt(e.target.value) || 1))} />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <Cloud className="h-3 w-3" /> Expected Weather
            </Label>
            <div className="flex gap-1.5 flex-wrap">
              {CLIMATES.map(c => {
                const active = climate === c.value;
                return (
                  <button
                    key={c.value}
                    onClick={() => setClimate(c.value)}
                    className={`text-xs px-2.5 py-1.5 rounded-full border flex items-center gap-1 transition-colors ${
                      active ? 'bg-accent text-accent-foreground border-accent' : 'border-border hover:bg-secondary'
                    }`}
                  >
                    <c.Icon className="h-3 w-3" /> {c.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="sm:col-span-3 flex justify-end">
            <Button onClick={() => { setShowList(true); setChecked(new Set()); }} className="gap-2">
              <Sparkles className="h-4 w-4" /> Generate Packing List
            </Button>
          </div>
        </div>

        {/* List */}
        {showList && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-2xl">
                  {destination ? `Trip to ${destination}` : 'Your Packing List'}
                </h2>
                <p className="text-xs text-muted-foreground">{days} day{days !== 1 ? 's' : ''} · {climate} weather · {checked.size}/{list.length} packed</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {groups.map(g => (
                <div key={g} className="bg-card border border-border rounded-2xl p-5">
                  <h3 className="font-display text-lg mb-3">{g}</h3>
                  <ul className="space-y-2">
                    {list.filter(i => i.group === g).map(i => {
                      const isChecked = checked.has(i.name);
                      return (
                        <li key={i.name}>
                          <button
                            onClick={() => toggleCheck(i.name)}
                            className="w-full flex items-center gap-3 text-left p-2 rounded-lg hover:bg-secondary"
                          >
                            <span className={`h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${
                              isChecked ? 'bg-accent border-accent text-accent-foreground' : 'border-border'
                            }`}>
                              {isChecked && <Check className="h-3.5 w-3.5" />}
                            </span>
                            <i.Icon className="h-4 w-4 text-muted-foreground" />
                            <span className={`flex-1 text-sm ${isChecked ? 'line-through text-muted-foreground' : ''}`}>{i.name}</span>
                            <span className="text-xs font-medium bg-secondary px-2 py-0.5 rounded-full">×{i.qty}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
