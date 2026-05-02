import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Briefcase, Plus, Calendar, MapPin } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

export function JobseekerExperience() {
  const [isOpen, setIsOpen] = useState(false);
  const [experiences, setExperiences] = useState([
    {
      id: 1,
      position: 'Senior UI/UX Designer',
      company: 'JOBSAE',
      location: 'New York, USA',
      startDate: '2022-01',
      endDate: 'Present',
      current: true,
      description: '<p>Leading the design team in creating the next generation of job seeker platforms.</p>'
    }
  ]);

  const [newExp, setNewExp] = useState({
    position: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  const handleAdd = () => {
    setExperiences([...experiences, { ...newExp, id: Date.now() }]);
    setIsOpen(false);
    setNewExp({ position: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Experience</CardTitle>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
          <Plus className="size-4 mr-2" /> Add Experience
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {experiences.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground italic">
            No experience added yet. Click the button above to add one.
          </div>
        ) : (
          experiences.map((exp) => (
            <div key={exp.id} className="relative pl-8 border-l-2 border-primary/20 pb-6 last:pb-0">
              <div className="absolute left-[-9px] top-0 size-4 bg-primary rounded-full ring-4 ring-background" />
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-base leading-tight">{exp.position}</h3>
                <p className="text-sm font-semibold text-primary">{exp.company}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground font-medium mt-1 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Calendar className="size-3" /> {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                  <span className="flex items-center gap-1"><MapPin className="size-3" /> {exp.location}</span>
                </div>
                <div className="mt-3 text-sm text-secondary-foreground rich-text-content" dangerouslySetInnerHTML={{ __html: exp.description }} />
              </div>
            </div>
          ))
        )}
      </CardContent>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Experience</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pos">Job Position</Label>
                <Input id="pos" value={newExp.position} onChange={(e) => setNewExp({...newExp, position: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comp">Company Name</Label>
                <Input id="comp" value={newExp.company} onChange={(e) => setNewExp({...newExp, company: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="loc">Location</Label>
                <Input id="loc" value={newExp.location} onChange={(e) => setNewExp({...newExp, location: e.target.value})} />
              </div>
              <div className="flex items-end pb-2 gap-2">
                <Checkbox id="curr" checked={newExp.current} onCheckedChange={(val) => setNewExp({...newExp, current: val})} />
                <Label htmlFor="curr" className="font-bold cursor-pointer">I am currently working here</Label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start">Start Date</Label>
                <Input id="start" type="month" value={newExp.startDate} onChange={(e) => setNewExp({...newExp, startDate: e.target.value})} />
              </div>
              {!newExp.current && (
                <div className="space-y-2">
                  <Label htmlFor="end">End Date</Label>
                  <Input id="end" type="month" value={newExp.endDate} onChange={(e) => setNewExp({...newExp, endDate: e.target.value})} />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <RichTextEditor initialValue={newExp.description} onChange={(val) => setNewExp({...newExp, description: val})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Save Experience</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
