import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Quote, Plus, User } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

export function JobseekerReferences() {
  const [isOpen, setIsOpen] = useState(false);
  const [references, setReferences] = useState([
    {
      id: 1,
      name: 'Sarah Connor',
      role: 'CEO at TechFuture',
      description: '<p>Jason is an exceptional designer with a keen eye for detail. Highly recommended!</p>'
    }
  ]);

  const [newRef, setNewRef] = useState({ name: '', role: '', description: '' });

  const handleAdd = () => {
    setReferences([...references, { ...newRef, id: Date.now() }]);
    setIsOpen(false);
    setNewRef({ name: '', role: '', description: '' });
  };

  return (
    <Card className="mb-10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">References</CardTitle>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
          <Plus className="size-4 mr-2" /> Add Reference
        </Button>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {references.length === 0 ? (
          <div className="col-span-full text-center py-10 text-muted-foreground italic">
            No references added yet.
          </div>
        ) : (
          references.map((ref) => (
            <div key={ref.id} className="p-5 bg-muted rounded-xl border border-border relative">
              <Quote className="absolute right-4 top-4 size-10 text-primary/5" />
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="size-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-sm">{ref.name}</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{ref.role}</p>
                </div>
              </div>
              <div className="text-sm text-secondary-foreground italic leading-relaxed rich-text-content" dangerouslySetInnerHTML={{ __html: ref.description }} />
            </div>
          ))
        )}
      </CardContent>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add Reference</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ref-name">Full Name</Label>
                <Input id="ref-name" value={newRef.name} onChange={(e) => setNewRef({...newRef, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ref-role">Role / Position</Label>
                <Input id="ref-role" value={newRef.role} onChange={(e) => setNewRef({...newRef, role: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <RichTextEditor initialValue={newRef.description} onChange={(val) => setNewRef({...newRef, description: val})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Save Reference</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
