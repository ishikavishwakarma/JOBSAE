import { useState } from 'react';
import { Briefcase, Camera, MapPin } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogBody 
} from '@/components/ui/dialog';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { ImageUploadModal } from '@/components/common/ImageUploadModal';

export function ProfileHero() {
  const [profileImg, setProfileImg] = useState(toAbsoluteUrl('/media/avatars/300-1.png'));
  const [bannerImg, setBannerImg] = useState(toAbsoluteUrl('/media/images/600x600/1.jpg'));
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'profile',
    aspect: 1
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Jason Tatum',
    headline: 'Senior UI/UX Designer at JOBSAE',
    cityState: 'New York, NY',
    country: 'United States'
  });

  const handleSaveInfo = () => {
    // Logic to save data would go here
    setIsEditModalOpen(false);
  };

  const openUploadModal = (type) => {
    setModalConfig({
      isOpen: true,
      type,
      aspect: type === 'profile' ? 1 : 4 // 2.33 is approx 21:9
    });
  };

  const handleUpload = (croppedUrl) => {
    if (modalConfig.type === 'profile') {
      setProfileImg(croppedUrl);
    } else {
      setBannerImg(croppedUrl);
    }
  };

  // Mock existing images for the selection step
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
          <div
            className="h-48 md:h-64 w-full bg-cover bg-center relative group"
            style={{
              backgroundImage: `url(${bannerImg})`,
            }}
          >
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openUploadModal('banner')}
                className="bg-white/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/30"
              >
                <Camera className="size-4 mr-2" />
                Change Banner
              </Button>
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="px-6 md:px-10 pb-8 relative">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="relative shrink-0 h-fit -mt-16 md:-mt-24">
                <div className="size-32 md:size-40 rounded-full border-4 border-card overflow-hidden shadow-lg bg-muted">
                  <img
                    src={profileImg}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button 
                  onClick={() => openUploadModal('profile')}
                  className="absolute bottom-2 right-2 p-2 bg-primary text-primary-foreground rounded-full shadow-md hover:scale-110 transition-transform border-4 border-card"
                >
                  <Camera className="size-4" />
                </button>
              </div>

              {/* Info Content */}
              <div className="flex-1 pt-4 md:pt-6">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {formData.name}
                </h1>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 text-sm text-muted-foreground font-medium">
                  <div className="flex items-center gap-2">
                    <Briefcase className="size-4 text-primary" />
                    <span className="text-foreground font-semibold">
                      {formData.headline}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4" />
                    <span>{formData.cityState}, {formData.country}</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <Button 
                    size="sm" 
                    className="rounded-full px-6 font-bold"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full px-6 font-bold"
                  >
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Reusable Upload Modal */}
      <ImageUploadModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onUpload={handleUpload}
        type={modalConfig.type}
        aspect={modalConfig.aspect}
        existingImages={recentUploads}
      />

      {/* Edit Info Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl rounded-[2rem]">
          <DialogHeader className="p-6 border-b border-border/50 bg-muted/30">
            <DialogTitle className="text-xl font-black">Edit Profile Info</DialogTitle>
          </DialogHeader>
          <DialogBody className="p-8 space-y-6 overflow-y-auto max-h-[60vh]">
            <div className="space-y-2">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest px-1">Full Name</label>
              <input 
                className="w-full bg-muted/50 border border-border/50 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-primary transition-all" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest px-1">Headline</label>
              <textarea 
                className="w-full bg-muted/50 border border-border/50 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-primary min-h-[100px] transition-all" 
                value={formData.headline}
                onChange={e => setFormData({...formData, headline: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest px-1">City, State</label>
                <input 
                  className="w-full bg-muted/50 border border-border/50 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-primary transition-all" 
                  value={formData.cityState}
                  onChange={e => setFormData({...formData, cityState: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest px-1">Country</label>
                <input 
                  className="w-full bg-muted/50 border border-border/50 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-primary transition-all" 
                  value={formData.country}
                  onChange={e => setFormData({...formData, country: e.target.value})}
                />
              </div>
            </div>
          </DialogBody>
          <DialogFooter className="p-6 bg-muted/10 border-t border-border/50">
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)} className="font-bold">Cancel</Button>
            <Button onClick={handleSaveInfo} className="px-10 h-12 font-black rounded-xl shadow-xl shadow-primary/20">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
