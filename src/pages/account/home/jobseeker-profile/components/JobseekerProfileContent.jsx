import { useState } from 'react';
import { Container } from '@/components/common/container';
import { JobseekerHero } from './JobseekerHero';
import { JobseekerAbout } from './JobseekerAbout';
import { JobseekerResume } from './JobseekerResume';
import { JobseekerExperience } from './JobseekerExperience';
import { JobseekerEducation } from './JobseekerEducation';
import { JobseekerSkills } from './JobseekerSkills';
import { JobseekerReferences } from './JobseekerReferences';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Eye, BarChart2, Plus, ChevronRight, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toAbsoluteUrl } from '@/lib/helpers';
export function JobseekerProfileContent() {
  const [profileData, setProfileData] = useState({
    name: 'Jason Tatum',
    location: 'New York, USA',
    tagline: 'Senior UI/UX Designer | Building the future of job hunting',
    experience: '8 Years',
    aboutMe: '<h3>Professional Summary</h3><p>Passionate UI/UX Designer with over 8 years of experience in crafting high-impact digital experiences. I specialize in <strong>user-centric design</strong>, design systems, and rapid prototyping.</p><ul><li>8+ years of industry experience</li><li>Expert in Figma and Adobe Creative Suite</li><li>Strong background in React and Frontend technologies</li></ul>'
  });

  return (
    <div className="pb-20 bg-muted/20 min-h-screen">
      <JobseekerHero data={profileData} onUpdate={setProfileData} />
      
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Analytics Card (LinkedIn Style) */}
            <Card className="rounded-xl border-border shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 border-b border-border">
                  <h3 className="text-xl font-bold">Analytics</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <Eye className="size-4" />
                    <span>Private to you</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 divide-x divide-border">
                  <div className="p-6 hover:bg-muted/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="size-5 text-foreground/70" />
                      <span className="font-bold text-lg">1,245</span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">Profile views</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">Discover who viewed your profile.</p>
                  </div>
                  <div className="p-6 hover:bg-muted/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart2 className="size-5 text-foreground/70" />
                      <span className="font-bold text-lg">452</span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">Post impressions</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">Check out who is engaging with your posts.</p>
                  </div>
                  <div className="p-6 hover:bg-muted/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart2 className="size-5 text-foreground/70" />
                      <span className="font-bold text-lg">89</span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">Search appearances</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">See how often you appear in search results.</p>
                  </div>
                </div>
                <div className="p-4 bg-muted/10 border-t border-border text-center">
                  <Button variant="ghost" size="sm" className="w-full font-bold text-muted-foreground hover:text-primary">
                    Show all analytics <ChevronRight className="size-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <JobseekerAbout content={profileData.aboutMe} />
            <JobseekerExperience />
            <JobseekerEducation />
            <JobseekerReferences />
          </div>
          
          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Profile Language & URL */}
            <Card className="rounded-xl border-border shadow-sm">
              <CardContent className="p-6 space-y-4 divide-y divide-border">
                <div className="pb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold">Profile Language</h4>
                    <Edit className="size-4 text-muted-foreground cursor-pointer" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium mt-1">English</p>
                </div>
                <div className="pt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold">Public profile & URL</h4>
                    <Edit className="size-4 text-muted-foreground cursor-pointer" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium mt-1">www.jobsae.com/in/jasontatum</p>
                </div>
              </CardContent>
            </Card>

            <JobseekerResume />
            <JobseekerSkills />

            {/* People you may know */}
            <Card className="rounded-xl border-border shadow-sm">
              <CardContent className="p-6">
                <h4 className="font-bold mb-4">People you may know</h4>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-3">
                      <img src={toAbsoluteUrl(`/media/avatars/300-${i+10}.png`)} className="size-12 rounded-full border border-border" alt="" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">Alex Rivera</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">Principal Product Designer at Adobe</p>
                        <Button variant="outline" size="sm" className="mt-2 h-7 rounded-full text-xs font-bold border-primary text-primary hover:bg-primary/5">
                          <Plus className="size-3 mr-1" /> Connect
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-6 font-bold text-muted-foreground hover:text-primary border-t pt-4">
                  Show more
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
