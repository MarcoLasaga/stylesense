import { useState } from 'react';
import { Button } from '@/components/ui/button';

const goals = [
  {
    id: 'inspiration',
    label: 'Outfit inspiration',
    picks: ['Mix & Match outfit generator', 'Community outfit discovery', 'Trend-aware suggestions'],
  },
  {
    id: 'organize',
    label: 'Wardrobe organization',
    picks: ['Digital wardrobe with photos', 'Smart clothing recognition', 'Wear frequency tracking'],
  },
  {
    id: 'daily',
    label: 'Better daily outfit choices',
    picks: ['Weather-aware outfits', 'Occasion-based styling', 'Outfit planner for the week'],
  },
  {
    id: 'all',
    label: 'All of the above',
    picks: ['Everything in StyleSense, tuned to you', 'Personalized recommendations that learn', 'No New Clothes mode'],
  },
];

export default function OnboardingQuiz() {
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState<typeof goals[number] | null>(null);

  return (
    <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${i <= step ? 'bg-accent w-10' : 'bg-border w-5'}`}
          />
        ))}
        <span className="ml-auto text-xs text-muted-foreground">Step {step + 1} of 3</span>
      </div>

      {step === 0 && (
        <div>
          <h3 className="font-display text-2xl sm:text-3xl mb-2">What are you looking for?</h3>
          <p className="text-muted-foreground mb-6">Pick one and we'll show you where StyleSense helps most.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {goals.map(g => (
              <button
                key={g.id}
                onClick={() => { setChoice(g); setStep(1); }}
                className="text-left px-5 py-4 rounded-2xl border border-border bg-background hover:border-primary hover:bg-secondary transition-colors font-medium"
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && choice && (
        <div>
          <h3 className="font-display text-2xl sm:text-3xl mb-2">Great pick — here's what you'll use most</h3>
          <p className="text-muted-foreground mb-6">Based on "{choice.label}".</p>
          <ul className="space-y-3 mb-8">
            {choice.picks.map(p => (
              <li key={p} className="flex items-start gap-3 bg-background border border-border rounded-2xl px-4 py-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent shrink-0" />
                <span className="text-sm">{p}</span>
              </li>
            ))}
          </ul>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-full" onClick={() => setStep(0)}>Back</Button>
            <Button className="rounded-full" onClick={() => setStep(2)}>Continue</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="font-display text-2xl sm:text-3xl mb-2">Everything lives in the app</h3>
          <p className="text-muted-foreground mb-6">
            Add your clothes, set your preferences, and StyleSense starts building outfits from what you
            already own. Setup takes a few minutes and gets better the more you use it.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="#get-the-app"><Button className="rounded-full px-7 w-full sm:w-auto">Start with StyleSense</Button></a>
            <Button variant="outline" className="rounded-full" onClick={() => { setStep(0); setChoice(null); }}>
              Start over
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
