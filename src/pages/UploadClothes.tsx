import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { addWardrobeItem, getProfile } from '@/lib/store';
import { WardrobeItem, ClothingCategory, StyleType, OccasionType, FabricType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, Upload, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const categories: ClothingCategory[] = ['top', 'bottom', 'shoes', 'outerwear', 'accessories'];
const styles: StyleType[] = ['casual', 'formal', 'sporty', 'streetwear', 'minimalist', 'bohemian', 'vintage', 'classic'];
const occasions: OccasionType[] = ['school', 'work', 'gym', 'party', 'date', 'outdoor', 'everyday'];
const fabrics: FabricType[] = ['cotton', 'denim', 'polyester', 'wool', 'silk', 'linen', 'leather', 'knit', 'nylon', 'other'];
const colorOptions = [
  { name: 'Black', hex: '#1a1a1a' }, { name: 'White', hex: '#FFFFFF' }, { name: 'Gray', hex: '#808080' },
  { name: 'Navy', hex: '#1B2A4A' }, { name: 'Blue', hex: '#3B5998' }, { name: 'Red', hex: '#DC3545' },
  { name: 'Green', hex: '#28A745' }, { name: 'Brown', hex: '#8B4513' }, { name: 'Beige', hex: '#D2B48C' },
  { name: 'Pink', hex: '#E8A0BF' }, { name: 'Cream', hex: '#F5F0E8' }, { name: 'Olive', hex: '#556B2F' },
  { name: 'Burgundy', hex: '#800020' }, { name: 'Khaki', hex: '#C3B091' }, { name: 'Orange', hex: '#FF8C00' },
];

export default function UploadClothes() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string>('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ClothingCategory>('top');
  const [color, setColor] = useState(colorOptions[0]);
  const [fabric, setFabric] = useState<FabricType>('cotton');
  const [style, setStyle] = useState<StyleType>('casual');
  const [occasion, setOccasion] = useState<OccasionType>('everyday');

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) { toast.error('Please enter a name'); return; }

    const profile = getProfile();
    const item: WardrobeItem = {
      id: 'item_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      userId: profile.id,
      name,
      category,
      color: color.name,
      colorHex: color.hex,
      fabric,
      style,
      occasion,
      image: imagePreview,
      addedAt: Date.now(),
      wornCount: 0,
    };

    addWardrobeItem(item);
    toast.success(`"${name}" added to your wardrobe!`);

    // Reset form
    setName('');
    setImagePreview('');
    setCategory('top');
    setColor(colorOptions[0]);
    setFabric('cotton');
    setStyle('casual');
    setOccasion('everyday');
  };

  const ChipSelect = ({ label, options, value, onChange }: {
    label: string; options: string[]; value: string; onChange: (v: string) => void;
  }) => (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`text-xs px-3 py-1.5 rounded-sm capitalize transition-colors ${
              value === opt ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-2xl">
        <h1 className="text-3xl font-display font-bold mb-1">Add Clothing</h1>
        <p className="text-muted-foreground text-sm mb-8">Upload or snap a photo, then label your item</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image upload area */}
          <div className="border-2 border-dashed border-border rounded-sm p-6 text-center">
            {imagePreview ? (
              <div className="relative inline-block">
                <img src={imagePreview} alt="Preview" className="max-h-48 rounded-sm mx-auto" />
                <button
                  type="button"
                  onClick={() => setImagePreview('')}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Upload a photo of your clothing</p>
                <div className="flex gap-3 justify-center">
                  <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4" /> Upload File
                  </Button>
                  <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => cameraInputRef.current?.click()}>
                    <Camera className="h-4 w-4" /> Take Photo
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground">Photo is optional — you can add items without images</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageSelect} />
          </div>

          {/* Name */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Item Name *</p>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Black Hoodie" required />
          </div>

          {/* Category */}
          <ChipSelect label="Category *" options={categories as unknown as string[]} value={category} onChange={v => setCategory(v as ClothingCategory)} />

          {/* Color */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Color</p>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map(c => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-sm transition-colors ${
                    color.name === c.name ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  <div className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: c.hex }} />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Fabric, Style, Occasion */}
          <ChipSelect label="Fabric" options={fabrics as unknown as string[]} value={fabric} onChange={v => setFabric(v as FabricType)} />
          <ChipSelect label="Style" options={styles as unknown as string[]} value={style} onChange={v => setStyle(v as StyleType)} />
          <ChipSelect label="Occasion" options={occasions as unknown as string[]} value={occasion} onChange={v => setOccasion(v as OccasionType)} />

          {/* Submit */}
          <div className="flex gap-3">
            <Button type="submit" size="lg" className="flex-1 gap-2">
              <Check className="h-4 w-4" /> Add to Wardrobe
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => navigate('/wardrobe')}>
              View Wardrobe
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
