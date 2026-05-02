import React, { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogBody 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, RotateCw, RefreshCw, X, Check, Image as ImageIcon, ChevronRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toAbsoluteUrl } from '@/lib/helpers';

// Helper to create the cropped image on a canvas
export const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0, flip = { horizontal: false, vertical: false }) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  const rotRad = (rotation * Math.PI) / 180;

  // Calculate bounding box of the rotated image
  const { width: bWidth, height: bHeight } = rotateSize(image.width, image.height, rotation);

  // Set canvas size to match the bounding box
  canvas.width = bWidth;
  canvas.height = bHeight;

  // Translate canvas context to a central point and draw image from center
  ctx.translate(bWidth / 2, bHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  ctx.drawImage(image, 0, 0);

  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);

  // Set canvas width to final desired crop size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.putImageData(data, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      resolve(URL.createObjectURL(file));
    }, 'image/jpeg');
  });
};

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

const rotateSize = (width, height, rotation) => {
  const rotRad = (rotation * Math.PI) / 180;
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
};

export function ImageUploadModal({ 
  isOpen, 
  onClose, 
  onUpload, 
  aspect = 1, 
  type = 'profile', 
  existingImages = [] 
}) {
  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flip, setFlip] = useState({ horizontal: false, vertical: false });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const fileInputRef = useRef(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectExisting = (url) => {
    setImage(url);
    setStep(2);
  };

  const handleSave = async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation, flip);
      onUpload(croppedImage);
      handleClose();
    } catch (e) {
      console.error(e);
    }
  };

  const handleClose = () => {
    setStep(1);
    setImage(null);
    setZoom(1);
    setRotation(0);
    setFlip({ horizontal: false, vertical: false });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-[2rem]">
        <DialogHeader className="p-6 border-b border-border/50 bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <ImageIcon className="size-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black">
                {step === 1 ? `Update ${type === 'profile' ? 'Profile' : 'Banner'} Image` : 'Edit & Crop Image'}
              </DialogTitle>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Step {step} of 2</p>
            </div>
          </div>
        </DialogHeader>

        <DialogBody className="p-0">
          {step === 1 ? (
            <div className="p-8 space-y-8">
              {/* Device Upload */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group border-2 border-dashed border-primary/20 hover:border-primary/50 hover:bg-primary/5 rounded-[2rem] p-12 flex flex-col items-center justify-center cursor-pointer transition-all"
              >
                <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="size-8 text-primary" />
                </div>
                <h3 className="text-lg font-black">Choose file from device</h3>
                <p className="text-sm text-muted-foreground font-medium mt-1">PNG, JPG or GIF up to 10MB</p>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>

              {/* Recent Uploads */}
              {existingImages.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-black text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <RefreshCw className="size-3" /> Recent Uploads
                  </h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {existingImages.map((src, i) => (
                      <div 
                        key={i} 
                        onClick={() => handleSelectExisting(src)}
                        className={cn(
                          "group relative cursor-pointer rounded-2xl overflow-hidden border border-border hover:ring-4 hover:ring-primary/20 transition-all shadow-sm",
                          type === 'banner' ? "aspect-video" : "aspect-square"
                        )}
                      >
                        <img src={src} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Check className="size-6 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col h-[60vh] md:h-[70vh]">
              {/* Cropper Area */}
              <div className="relative flex-1 bg-black overflow-hidden">
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={aspect}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  onRotationChange={setRotation}
                  style={{
                    containerStyle: { background: '#000' },
                    cropAreaStyle: { border: '2px solid white', boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)' }
                  }}
                />
              </div>

              {/* Controls */}
              <div className="p-6 bg-background border-t border-border/50">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Zoom Slider */}
                  <div className="flex-1 w-full space-y-2">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-muted-foreground">
                      <span>Zoom</span>
                      <span>{Math.round(zoom * 100)}%</span>
                    </div>
                    <input 
                      type="range" 
                      value={zoom} 
                      min={1} 
                      max={3} 
                      step={0.1} 
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  {/* Transformation Controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setRotation(r => (r + 90) % 360)}
                      className="rounded-xl"
                      title="Rotate 90°"
                    >
                      <RotateCw className="size-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setFlip(f => ({ ...f, horizontal: !f.horizontal }))}
                      className="rounded-xl"
                      title="Flip Horizontal"
                    >
                      <RefreshCw className="size-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setFlip(f => ({ ...f, vertical: !f.vertical }))}
                      className="rounded-xl rotate-90"
                      title="Flip Vertical"
                    >
                      <RefreshCw className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogBody>

        <DialogFooter className="p-6 bg-muted/10 border-t border-border/50">
          <div className="flex items-center justify-between w-full">
            {step === 1 ? (
              <Button variant="ghost" onClick={handleClose} className="font-bold">Cancel</Button>
            ) : (
              <Button variant="ghost" onClick={() => setStep(1)} className="font-bold">
                <ArrowLeft className="size-4 mr-2" /> Back to Selection
              </Button>
            )}

            {step === 2 && (
              <Button onClick={handleSave} className="px-10 h-12 font-black rounded-xl shadow-xl shadow-primary/20 group">
                Apply & Upload <ChevronRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
