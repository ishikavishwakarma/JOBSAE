import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Briefcase, Globe, Info, Tag } from 'lucide-react';
import { useState } from 'react';

export function OverviewSection() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">About Me</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="about">About Us</Label>
                <Textarea 
                  id="about" 
                  placeholder="Tell us about yourself..." 
                  defaultValue="Passionate UI/UX Designer with 8+ years of experience in creating beautiful and functional digital products."
                  className="min-h-[120px]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" defaultValue="JOBSAE" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" defaultValue="New York, USA" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="industries">Industries</Label>
                <Input id="industries" defaultValue="Technology, E-commerce, FinTech" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button size="sm" onClick={() => setIsEditing(false)}>Save Changes</Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Passionate UI/UX Designer with 8+ years of experience in creating beautiful and functional digital products. 
                I specialize in user-centric design, prototyping, and design systems. Currently focused on building JOBSAE, 
                a next-generation platform for job seekers and employers.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <Briefcase className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Company</p>
                    <p className="text-sm font-semibold">JOBSAE</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <MapPin className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Location</p>
                    <p className="text-sm font-semibold">New York, USA</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <Tag className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Industries</p>
                    <p className="text-sm font-semibold">Technology, E-commerce</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <Globe className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Website</p>
                    <p className="text-sm font-semibold text-primary">jasontatum.design</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Followers</span>
                <span className="font-bold">12.5k</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Projects</span>
                <span className="font-bold">48</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Experience</span>
                <span className="font-bold">8+ Yrs</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Top Skills</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {['UI/UX Design', 'Figma', 'React', 'Tailwind CSS', 'Next.js', 'Prototyping', 'Design Systems'].map(skill => (
              <div key={skill} className="px-3  min-w-32 flex justify-center items-center py-1 bg-muted rounded-full text-xs font-semibold text-secondary-foreground border border-border">
                {skill}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
