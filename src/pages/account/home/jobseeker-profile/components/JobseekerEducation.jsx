import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { GraduationCap, Plus, Calendar, MapPin, Check } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { cn } from '@/lib/utils';

const DEGREES = ['Bachelor', 'Master', 'PhD', 'Diploma', 'Certification', 'High School'];

export function JobseekerEducation() {
  const [isOpen, setIsOpen] = useState(false);
  const [education, setEducation] = useState([
    {
      id: 1,
      degree: 'Master',
      institution: 'Design Institute of America',
      location: 'Boston, MA',
      startDate: '2018-09',
      endDate: '2020-06',
      current: false,
      description: '<p>Focused on Advanced UX Research and Interaction Design.</p>'
    }
  ]);

  const [newEdu, setNewEdu] = useState({
    degree: '',
    institution: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  const handleAdd = () => {
    setEducation([...education, { ...newEdu, id: Date.now() }]);
    setIsOpen(false);
    setNewEdu({ degree: '', institution: '', location: '', startDate: '', endDate: '', current: false, description: '' });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Education</CardTitle>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
          <Plus className="size-4 mr-2" /> Add Education
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {education.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground italic">
            No education added yet. Click the button above to add one.
          </div>
        ) : (
          education.map((edu) => (
            <div key={edu.id} className="relative pl-8 border-l-2 border-primary/20 pb-6 last:pb-0">
              <div className="absolute left-[-9px] top-0 size-4 bg-primary rounded-full ring-4 ring-background" />
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-base leading-tight">{edu.degree} in Design</h3>
                <p className="text-sm font-semibold text-primary">{edu.institution}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground font-medium mt-1 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Calendar className="size-3" /> {edu.startDate} - {edu.current ? 'Present' : edu.endDate}</span>
                  <span className="flex items-center gap-1"><MapPin className="size-3" /> {edu.location}</span>
                </div>
                <div className="mt-3 text-sm text-secondary-foreground rich-text-content" dangerouslySetInnerHTML={{ __html: edu.description }} />
              </div>
            </div>
          ))
        )}
      </CardContent>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Education</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-3">
              <Label>Select Degree</Label>
              <div className="flex flex-wrap gap-2">
                {DEGREES.map(deg => (
                  <button
                    key={deg}
                    type="button"
                    onClick={() => setNewEdu({...newEdu, degree: deg})}
                    className={cn(
                      "px-4 py-2 rounded-lg border-2 text-sm font-bold transition-all flex items-center gap-2",
                      newEdu.degree === deg 
                        ? "border-primary bg-primary/5 text-primary" 
                        : "border-border hover:border-primary/50 text-muted-foreground"
                    )}
                  >
                    {newEdu.degree === deg && <Check className="size-4" />}
                    {deg}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inst">Institution Name</Label>
                <Input id="inst" value={newEdu.institution} onChange={(e) => setNewEdu({...newEdu, institution: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edu-loc">Location</Label>
                <Input id="edu-loc" value={newEdu.location} onChange={(e) => setNewEdu({...newEdu, location: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edu-start">Start Date</Label>
                <Input id="edu-start" type="month" value={newEdu.startDate} onChange={(e) => setNewEdu({...newEdu, startDate: e.target.value})} />
              </div>
              {!newEdu.current && (
                <div className="space-y-2">
                  <Label htmlFor="edu-end">End Date</Label>
                  <Input id="edu-end" type="month" value={newEdu.endDate} onChange={(e) => setNewEdu({...newEdu, endDate: e.target.value})} />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="edu-curr" checked={newEdu.current} onCheckedChange={(val) => setNewEdu({...newEdu, current: val})} />
              <Label htmlFor="edu-curr" className="font-bold cursor-pointer">I am currently enrolled here</Label>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <RichTextEditor initialValue={newEdu.description} onChange={(val) => setNewEdu({...newEdu, description: val})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Save Education</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
