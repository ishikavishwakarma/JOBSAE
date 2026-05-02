import { useState } from 'react';
import { Camera, MapPin, Briefcase, Calendar, Edit, Mail, Phone, ExternalLink, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogBody 
} from '@/components/ui/dialog';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Container } from '@/components/common/container';
import { ImageUploadModal } from '@/components/common/ImageUploadModal';

export function JobseekerHero({ data, onUpdate }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState(data);
  const [profileImg, setProfileImg] = useState(toAbsoluteUrl('/media/avatars/300-2.png'));
  const [bannerImg, setBannerImg] = useState(toAbsoluteUrl('/media/images/600x600/2.jpg'));
  const [uploadModal, setUploadModal] = useState({ isOpen: false, type: 'profile', aspect: 1 });

  const handleSave = () => {
    onUpdate(formData);
    setIsEditModalOpen(false);
  };

  const openUpload = (type) => {
    setUploadModal({
      isOpen: true,
      type,
      aspect: type === 'profile' ? 1 : 4
    });
  };

  const handleUploadComplete = (croppedUrl) => {
    if (uploadModal.type === 'profile') {
      setProfileImg(croppedUrl);
    } else {
      setBannerImg(croppedUrl);
    }
  };

  const recentUploads = [
    toAbsoluteUrl('/media/images/600x600/1.jpg'),
    toAbsoluteUrl('/media/images/600x600/2.jpg'),
    toAbsoluteUrl('/media/avatars/300-1.png'),
    toAbsoluteUrl('/media/avatars/300-2.png'),
  ];

  return (
    <div className="relative mb-6">
      <Container>
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          {/* Banner */}
          <div className="h-48 md:h-64 bg-linear-to-r from-blue-600 to-blue-400 relative group">
            <img 
              src={bannerImg} 
              className="w-full h-full object-cover opacity-80" 
              alt="Banner" 
            />
            <Button 
              variant="secondary" 
              size="icon" 
              onClick={() => openUpload('banner')}
              className="absolute top-4 right-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera className="size-4" />
            </Button>
          </div>

          {/* Intro Section */}
          <div className="px-6 md:px-10 pb-8 relative">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar - Absolute/Overlapping */}
              <div className="relative shrink-0  h-fit -mt-16 md:-mt-24">
                <div className="size-32 md:size-40 rounded-full border-4 border-card overflow-hidden bg-white shadow-lg">
                  <img src={profileImg} alt="Avatar" className="size-full object-cover" />
                </div>
                <button 
                  onClick={() => openUpload('profile')}
                  className="absolute bottom-2 right-2 bg-muted hover:bg-muted-foreground/20 p-2 rounded-full border border-border shadow-sm transition-all hover:scale-110"
                >
                  <Camera className="size-4 text-primary" />
                </button>
              </div>

              {/* Info Content */}
              <div className="flex-1 pt-4 md:pt-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold text-foreground leading-tight">{data.name}</h1>
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">Pro</span>
                    </div>
                    <p className="text-lg font-medium text-foreground/80 leading-tight max-w-[500px]">
                      {data.tagline}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground font-medium">
                      <div className="flex items-center gap-1">
                        <MapPin className="size-4" />
                        <span>{data.cityState}, {data.country}</span>
                      </div>
                      <button className="text-primary hover:underline font-bold">Contact info</button>
                    </div>
                    
                    <div className="mt-6 flex flex-wrap gap-2">
                      <Button size="sm" className="rounded-full px-6 font-bold">Open to</Button>
                      <Button variant="outline" size="sm" className="rounded-full px-6 font-bold border-primary text-primary hover:bg-primary/5">Add profile section</Button>
                      <Button variant="outline" size="sm" className="rounded-full px-6 font-bold">More</Button>
                    </div>
                  </div>

                  {/* Right Sidebar Info (Companies/Uni) */}
                  <div className="flex flex-col gap-4 min-w-[200px]">
                    <div className="flex items-center gap-3 text-sm font-bold hover:text-primary cursor-pointer transition-colors group">
                      <img src={toAbsoluteUrl('/media/brand-logos/github.svg')} className="size-8 rounded border border-border p-1 bg-white" alt="" />
                      <span className="group-hover:underline">TechFlow Systems</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold hover:text-primary cursor-pointer transition-colors group">
                      <img src={toAbsoluteUrl('/media/brand-logos/google.svg')} className="size-8 rounded border border-border p-1 bg-white" alt="" />
                      <span className="group-hover:underline">Stanford University</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Trigger */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-6 right-6 rounded-full hover:bg-muted"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      </Container>

      {/* Edit Intro Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Intro</DialogTitle>
          </DialogHeader>
          <DialogBody className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Full Name</label>
                <input 
                  className="w-full bg-muted border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">City, State</label>
                <input 
                  className="w-full bg-muted border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary" 
                  value={formData.cityState}
                  onChange={e => setFormData({...formData, cityState: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Country</label>
                <input 
                  className="w-full bg-muted border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary" 
                  value={formData.country}
                  onChange={e => setFormData({...formData, country: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Headline</label>
              <textarea 
                className="w-full bg-muted border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary min-h-[80px]" 
                value={formData.tagline}
                onChange={e => setFormData({...formData, tagline: e.target.value})}
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reusable Upload Modal */}
      <ImageUploadModal 
        isOpen={uploadModal.isOpen}
        onClose={() => setUploadModal({ ...uploadModal, isOpen: false })}
        onUpload={handleUploadComplete}
        type={uploadModal.type}
        aspect={uploadModal.aspect}
        existingImages={recentUploads}
      />
    </div>
  );
}
