import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const AVAILABLE_SKILLS = [
  'UI Design', 'UX Research', 'Figma', 'React', 'TypeScript', 
  'Node.js', 'Python', 'Tailwind CSS', 'Project Management',
  'SQL', 'Machine Learning', 'Docker', 'AWS', 'Firebase'
];

export function JobseekerSkills() {
  const [isOpen, setIsOpen] = useState(false);
  const [skills, setSkills] = useState(['UI Design', 'UX Research', 'Figma', 'React']);

  const toggleSkill = (skill) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter(s => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Skills</CardTitle>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
          <Plus className="size-4 mr-2" /> Add Skills
        </Button>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {skills.map(skill => (
          <div key={skill} className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold border border-primary/20">
            {skill}
            <button onClick={() => toggleSkill(skill)}>
              <X className="size-3" />
            </button>
          </div>
        ))}
      </CardContent>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add Skills</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p className="text-sm text-muted-foreground">Select the skills you want to highlight on your profile.</p>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SKILLS.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={cn(
                    "px-4 py-2 rounded-lg border-2 text-sm font-bold transition-all flex items-center gap-2",
                    skills.includes(skill)
                      ? "border-primary bg-primary text-white"
                      : "border-border hover:border-primary/50 text-muted-foreground"
                  )}
                >
                  {skills.includes(skill) && <Check className="size-4" />}
                  {skill}
                </button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
