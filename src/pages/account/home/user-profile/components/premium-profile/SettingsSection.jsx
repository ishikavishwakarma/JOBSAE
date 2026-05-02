import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Shield, Image, Phone, Mail, User, MapPin, Send, Upload, X, Lock, Trash2, AlertTriangle, ChevronRight, CheckCircle2, Globe, Bell, Eye } from 'lucide-react';
import { useState } from 'react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

const EmailChangeForm = () => {
  const [step, setStep] = useState(1);
  return (
    <div className="grid gap-6 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="curr-email" className="font-bold">Current Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="curr-email" defaultValue="jason.tatum@example.com" disabled={step > 1} className="pl-10 h-11 bg-muted/50 border-border/50" />
        </div>
      </div>
      {step === 1 ? (
        <Button onClick={() => setStep(2)} className="w-full h-11 font-bold shadow-lg shadow-primary/20">Continue to Update</Button>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="space-y-2">
            <Label htmlFor="new-email" className="font-bold">New Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input id="new-email" placeholder="Enter new email" className="pl-10 h-11" />
            </div>
          </div>
          <div className="space-y-3 bg-primary/5 p-4 rounded-xl border border-primary/10">
            <Label htmlFor="otp" className="font-bold text-primary">OTP Verification</Label>
            <Input id="otp" placeholder="••••••" maxLength={6} className="h-12 text-center tracking-[1em] font-black text-xl" />
            <p className="text-[10px] text-primary/70 uppercase font-black tracking-widest text-center">A verification code has been sent to your new email.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-11 font-bold">Cancel</Button>
            <Button onClick={() => setStep(1)} className="flex-[2] h-11 font-bold shadow-lg shadow-primary/20">Verify & Update</Button>
          </div>
        </div>
      )}
    </div>
  );
};

const DeleteAccountForm = () => {
  return (
    <div className="space-y-8 max-w-xl">
      <div className="p-5 bg-red-500/5 border border-red-500/20 rounded-2xl flex gap-4">
        <div className="p-3 bg-red-500/10 rounded-xl h-fit">
          <AlertTriangle className="size-6 text-red-500 shrink-0" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-red-600">Warning: Permanent Action</h4>
          <p className="text-sm text-red-600/70 mt-1 leading-relaxed font-medium">
            Deleting your account associated with <strong>jason.tatum@example.com</strong> is permanent. 
            All your data, including profile info, uploaded images, and settings, will be erased forever.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <h5 className="text-lg font-bold">Why are you deleting your account?</h5>
        <RadioGroup defaultValue="not-useful" className="grid gap-3">
          {[
            { id: 'r1', value: 'not-useful', label: "I don't find this platform useful" },
            { id: 'r2', value: 'better-alt', label: "I found a better alternative" },
            { id: 'r3', value: 'privacy', label: "I have privacy concerns" },
            { id: 'r4', value: 'mistake', label: "I created this account by mistake" },
            { id: 'r5', value: 'other', label: "Other" },
          ].map((item) => (
            <label 
              key={item.id}
              htmlFor={item.id} 
              className="flex items-center space-x-3 p-4 border border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <RadioGroupItem value={item.value} id={item.id} />
              <span className="font-bold text-sm">{item.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <Label htmlFor="delete-feedback" className="font-bold text-lg">Tell us more (optional)</Label>
        <Textarea id="delete-feedback" placeholder="Your feedback helps us improve..." className="min-h-[120px] rounded-xl focus:ring-red-500/20" />
      </div>

      <div className="flex items-start space-x-3 bg-muted/50 p-5 rounded-2xl border border-border/50">
        <Checkbox id="confirm-delete" className="mt-1 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500" />
        <Label htmlFor="confirm-delete" className="text-sm font-bold text-muted-foreground leading-relaxed cursor-pointer">
          I understand that deleting my account is permanent and all my data will be erased.
        </Label>
      </div>

      <Button variant="destructive" className="w-full sm:w-auto h-12 px-8 font-bold shadow-lg shadow-red-500/20">
        <Trash2 className="size-5 mr-2" /> Delete My Account
      </Button>
    </div>
  );
};

export function SettingsSection() {
  const [contactImages, setContactImages] = useState([]);

  const handleImageUpload = (e) => {
    if (contactImages.length >= 3) return;
    const file = e.target.files[0];
    if (file) {
      setContactImages([...contactImages, URL.createObjectURL(file)]);
    }
  };

  const removeImage = (index) => {
    setContactImages(contactImages.filter((_, i) => i !== index));
  };

  const navItems = [
    { id: 'account', label: 'Account Settings', icon: User, desc: 'Profile, Email, Password' },
    { id: 'payment', label: 'Payment Method', icon: CreditCard, desc: 'Manage cards and billing' },
    { id: 'images', label: 'Uploaded Images', icon: Image, desc: 'Banners and avatars' },
    { id: 'privacy', label: 'Privacy & Terms', icon: Shield, desc: 'Security and policies' },
    // { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Alerts and updates' },
    { id: 'contact', label: 'Contact Us', icon: Send, desc: 'Support and feedback' },
  ];

  return (
    <Tabs defaultValue="account" className="w-full">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Navigation */}
        <TabsList className="flex flex-col h-auto bg-transparent border-none p-0 gap-3 w-full lg:w-72 shrink-0">
          {navItems.map((item) => (
            <TabsTrigger 
              key={item.id}
              value={item.id} 
              className={cn(
                "group relative flex items-center justify-between w-full px-5 py-4 rounded-2xl border border-border/50 bg-background transition-all duration-300",
                "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-xl data-[state=active]:shadow-primary/20",
                "hover:border-primary/50 hover:bg-muted/50 text-start"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-2.5 rounded-xl transition-colors",
                  "group-data-[state=active]:bg-white/20 bg-primary/5"
                )}>
                  <item.icon className="size-5" />
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <span className="font-bold text-sm">{item.label}</span>
                  <span className={cn(
                    "text-[10px] font-medium opacity-70 line-clamp-1",
                    "group-data-[state=active]:text-white/80"
                  )}>
                    {item.desc}
                  </span>
                </div>
              </div>
              <ChevronRight className="size-4 opacity-0 group-data-[state=active]:opacity-100 transition-opacity" />
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <TabsContent value="account" className="m-0 focus-visible:ring-0 animate-in fade-in slide-in-from-right-4 duration-500">
            <Card className="rounded-[2rem] border-border/50 shadow-2xl shadow-black/5 overflow-hidden">
              <CardHeader className="bg-muted/30 p-8 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-black">Account Settings</CardTitle>
                    <CardDescription className="text-base mt-1 font-medium text-muted-foreground">Manage your professional identity and account security.</CardDescription>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-2xl border border-green-500/20">
                    <CheckCircle2 className="size-4" />
                    <span className="text-xs font-black uppercase tracking-widest">Verified</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <Tabs defaultValue="account-info" className="w-full">
                  <TabsList className="mb-8 h-auto p-1.5 bg-muted rounded-2xl gap-2 justify-start w-fit">
                    <TabsTrigger value="account-info" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:shadow-sm">Information</TabsTrigger>
                    <TabsTrigger value="change-email" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:shadow-sm">Email</TabsTrigger>
                    <TabsTrigger value="change-password" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:shadow-sm">Password</TabsTrigger>
                    <TabsTrigger value="delete-account" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:text-red-500 data-[state=active]:shadow-sm text-red-500/70">Delete Account</TabsTrigger>
                  </TabsList>

                  <TabsContent value="account-info" className="space-y-8 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2.5">
                        <Label htmlFor="fullname" className="font-bold px-1">Full Name</Label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input id="fullname" defaultValue="Jason Tatum" className="pl-11 h-12 rounded-xl bg-muted/20 border-border/50 focus:bg-background transition-all" />
                        </div>
                      </div>
                      <div className="space-y-2.5">
                        <Label htmlFor="phone" className="font-bold px-1">Phone Number</Label>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input id="phone" defaultValue="+1 (555) 000-0000" className="pl-11 h-12 rounded-xl bg-muted/20 border-border/50 focus:bg-background transition-all" />
                        </div>
                      </div>
                      <div className="space-y-2.5">
                        <Label htmlFor="city-state" className="font-bold px-1">City, State</Label>
                        <div className="relative group">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input id="city-state" defaultValue="New York, NY" className="pl-11 h-12 rounded-xl bg-muted/20 border-border/50 focus:bg-background transition-all" />
                        </div>
                      </div>
                      <div className="space-y-2.5">
                        <Label htmlFor="country" className="font-bold px-1">Country</Label>
                        <div className="relative group">
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input id="country" defaultValue="United States" className="pl-11 h-12 rounded-xl bg-muted/20 border-border/50 focus:bg-background transition-all" />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-border/50">
                      <Button className="px-8 h-12 font-bold rounded-xl shadow-lg shadow-primary/20">Save Profile Changes</Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="change-email" className="animate-in fade-in duration-300">
                    <EmailChangeForm />
                  </TabsContent>

                  <TabsContent value="change-password" className="animate-in fade-in duration-300">
                    <div className="grid gap-6 max-w-md">
                      <div className="space-y-2">
                        <Label htmlFor="old-pass" className="font-bold px-1">Old Password</Label>
                        <Input id="old-pass" type="password" placeholder="Enter current password" className="h-11 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-pass" className="font-bold px-1">New Password</Label>
                        <Input id="new-pass" type="password" placeholder="Enter new password" className="h-11 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="conf-pass" className="font-bold px-1">Confirm New Password</Label>
                        <Input id="conf-pass" type="password" placeholder="Confirm new password" className="h-11 rounded-xl" />
                      </div>
                      <Button className="w-full h-12 font-bold shadow-lg shadow-primary/20 mt-4 rounded-xl">Update Password</Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="delete-account" className="animate-in fade-in duration-300">
                    <DeleteAccountForm />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Method Content */}
          <TabsContent value="payment" className="m-0 focus-visible:ring-0 animate-in fade-in slide-in-from-right-4 duration-500">
            <Card className="rounded-[2rem] border-border/50 shadow-2xl shadow-black/5 overflow-hidden">
              <CardHeader className="bg-muted/30 p-8 border-b border-border/50">
                <CardTitle className="text-2xl font-black">Payment Method</CardTitle>
                <CardDescription className="text-base mt-1 font-medium text-muted-foreground">Manage your billing details and secure payment cards.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="p-6 border border-primary/20 bg-primary/5 rounded-3xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-5">
                    <div className="bg-white p-3 rounded-2xl border border-border shadow-md">
                      <img src={toAbsoluteUrl('/media/brand-logos/visa.svg')} className="w-12 h-8 object-contain" alt="Visa" />
                    </div>
                    <div>
                      <p className="font-black text-lg">Visa ending in 4242</p>
                      <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.2em] mt-1">Expires 12/26</p>
                    </div>
                  </div>
                  <Badge variant="success">Primary</Badge>
                </div>
                <Button variant="outline" className="w-full h-32 rounded-3xl border-2 border-dashed border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all flex flex-col gap-2">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Plus className="size-6 text-primary" />
                  </div>
                  <span className="font-bold text-primary">Add New Payment Method</span>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Uploaded Images Content */}
          <TabsContent value="images" className="m-0 focus-visible:ring-0 animate-in fade-in slide-in-from-right-4 duration-500">
            <Card className="rounded-[2rem] border-border/50 shadow-2xl shadow-black/5 overflow-hidden">
              <CardHeader className="bg-muted/30 p-8 border-b border-border/50">
                <CardTitle className="text-2xl font-black">Uploaded Images</CardTitle>
                <CardDescription className="text-base mt-1 font-medium text-muted-foreground">View and manage your professional profile and banner images.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <Tabs defaultValue="all-images">
                  <TabsList className="mb-8 bg-muted p-1 rounded-2xl gap-2 w-fit">
                    <TabsTrigger value="all-images" className="rounded-xl px-6 py-2 font-bold">All Media</TabsTrigger>
                    <TabsTrigger value="profile-images" className="rounded-xl px-6 py-2 font-bold">Profiles</TabsTrigger>
                    <TabsTrigger value="banner-images" className="rounded-xl px-6 py-2 font-bold">Banners</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all-images" className="animate-in fade-in duration-300">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                      {[1, 2, 3, 4].map(i => (
                        <div key={`profile-${i}`} className="group relative aspect-square bg-muted rounded-3xl overflow-hidden border border-border/50 hover:ring-4 hover:ring-primary/20 transition-all cursor-pointer shadow-sm">
                          <img src={toAbsoluteUrl(`/media/avatars/300-${i+10}.png`)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={`Profile ${i}`} />
                          <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full backdrop-blur-sm">Profile</div>
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                             <Button size="icon" variant="secondary" className="size-8 rounded-full"><Eye className="size-4" /></Button>
                             <Button size="icon" variant="destructive" className="size-8 rounded-full"><Trash2 className="size-4" /></Button>
                          </div>
                        </div>
                      ))}
                      {[1, 2].map(i => (
                        <div key={`banner-${i}`} className="col-span-2 group relative aspect-video bg-muted rounded-3xl overflow-hidden border border-border/50 hover:ring-4 hover:ring-primary/20 transition-all cursor-pointer shadow-sm">
                          <img src={toAbsoluteUrl(`/media/images/600x600/${i}.jpg`)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={`Banner ${i}`} />
                          <div className="absolute top-3 left-3 bg-primary/80 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full backdrop-blur-sm">Banner</div>
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                             <Button size="icon" variant="secondary" className="size-8 rounded-full"><Eye className="size-4" /></Button>
                             <Button size="icon" variant="destructive" className="size-8 rounded-full"><Trash2 className="size-4" /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="profile-images" className="animate-in fade-in duration-300">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="group relative aspect-square bg-muted rounded-3xl overflow-hidden border border-border/50 hover:ring-4 hover:ring-primary/20 transition-all cursor-pointer shadow-sm">
                          <img src={toAbsoluteUrl(`/media/avatars/300-${i+15}.png`)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={`Profile ${i}`} />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                             <Button size="icon" variant="secondary" className="size-8 rounded-full"><Eye className="size-4" /></Button>
                             <Button size="icon" variant="destructive" className="size-8 rounded-full"><Trash2 className="size-4" /></Button>
                          </div>
                        </div>
                      ))}
                      <label className="aspect-square border-2 border-dashed border-primary/20 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 hover:border-primary/40 transition-all">
                        <Upload className="size-8 text-primary/40 mb-2" />
                        <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">New Profile</span>
                        <input type="file" className="hidden" />
                      </label>
                    </div>
                  </TabsContent>

                  <TabsContent value="banner-images" className="animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="group relative aspect-[21/9] bg-muted rounded-[2rem] overflow-hidden border border-border/50 hover:ring-4 hover:ring-primary/20 transition-all cursor-pointer shadow-md">
                          <img src={toAbsoluteUrl(`/media/images/600x600/${i+5}.jpg`)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={`Banner ${i}`} />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                             <Button variant="secondary" className="rounded-full font-bold"><Eye className="size-4 mr-2" /> Preview</Button>
                             <Button variant="destructive" className="rounded-full font-bold"><Trash2 className="size-4 mr-2" /> Delete</Button>
                          </div>
                        </div>
                      ))}
                      <label className="aspect-[21/9] border-2 border-dashed border-primary/20 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 hover:border-primary/40 transition-all">
                        <Upload className="size-10 text-primary/40 mb-2" />
                        <span className="text-sm font-black text-muted-foreground uppercase tracking-widest">Upload New Banner</span>
                        <input type="file" className="hidden" />
                      </label>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy & Legal Content */}
          <TabsContent value="privacy" className="m-0 focus-visible:ring-0 animate-in fade-in slide-in-from-right-4 duration-500">
            <Card className="rounded-[2rem] border-border/50 shadow-2xl shadow-black/5 overflow-hidden">
              <CardHeader className="bg-muted/30 p-8 border-b border-border/50">
                <CardTitle className="text-2xl font-black">Privacy & Legal</CardTitle>
                <CardDescription className="text-base mt-1 font-medium text-muted-foreground">Read our comprehensive policies and platform terms of service.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                {[
                  { label: "Privacy Policy", icon: Shield },
                  { label: "Terms of Use", icon: Globe },
                  { label: "Cookie Policy", icon: Bell },
                  { label: "GDPR Compliance", icon: Lock },
                ].map((item, i) => (
                  <Button key={i} variant="ghost" className="w-full h-16 justify-between hover:bg-muted p-6 rounded-2xl group border border-transparent hover:border-border transition-all">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-muted rounded-xl group-hover:bg-background transition-colors">
                        <item.icon className="size-5 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <span className="font-bold text-lg">{item.label}</span>
                    </div>
                    <ChevronRight className="size-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </Button>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Us Content */}
          <TabsContent value="contact" className="m-0 focus-visible:ring-0 animate-in fade-in slide-in-from-right-4 duration-500">
            <Card className="rounded-[2rem] border-border/50 shadow-2xl shadow-black/5 overflow-hidden">
              <CardHeader className="bg-muted/30 p-8 border-b border-border/50">
                <CardTitle className="text-2xl font-black">Contact Us</CardTitle>
                <CardDescription className="text-base mt-1 font-medium text-muted-foreground">Have a question or feedback? We're here to help our community thrive.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2.5">
                    <Label className="font-bold px-1">Ticket Type</Label>
                    <Select defaultValue="support">
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="support">Support Request</SelectItem>
                        <SelectItem value="billing">Billing Issue</SelectItem>
                        <SelectItem value="feedback">Product Feedback</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="feedback" className="font-bold px-1">Your Message</Label>
                  <Textarea id="feedback" placeholder="Describe your issue or share your feedback..." className="min-h-[140px] rounded-2xl p-4" />
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col gap-2.5">
                    <Label className="font-bold px-1">Attachments (Max 3)</Label>
                    <div className="flex flex-wrap gap-4 mt-2">
                      {contactImages.map((src, i) => (
                        <div key={i} className="relative size-24 border border-border rounded-2xl overflow-hidden group shadow-sm">
                          <img src={src} className="w-full h-full object-cover" alt="Upload" />
                          <button 
                            onClick={() => removeImage(i)}
                            className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <X className="size-6" />
                          </button>
                        </div>
                      ))}
                      {contactImages.length < 3 && (
                        <label className="size-24 border-2 border-dashed border-primary/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 hover:border-primary/40 transition-all">
                          <Upload className="size-6 text-primary/40 mb-1" />
                          <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Add</span>
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-border/50">
                  <Button className="w-full h-12 font-bold rounded-xl shadow-lg shadow-primary/20">Submit Support Ticket</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
}

function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-muted text-muted-foreground',
    success: 'bg-green-500/10 text-green-600 border border-green-500/20',
  };
  return (
    <span className={cn("px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest", variants[variant])}>
      {children}
    </span>
  );
}

const Plus = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);
