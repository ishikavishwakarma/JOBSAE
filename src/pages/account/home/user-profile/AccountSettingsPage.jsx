import { Fragment } from 'react';
import { SettingsSection } from './components/premium-profile/SettingsSection';
import { Container } from '@/components/common/container';
import { Badge } from '@/components/ui/badge';
import { Settings, Shield, Bell, User } from 'lucide-react';

export function AccountSettingsPage() {
  return (
    <div className="bg-muted/30 min-h-screen py-10">
      <Container>
        {/* Page Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <Settings className="size-6 text-primary" />
              </div>
              <h1 className="text-3xl font-black text-foreground tracking-tight">Settings</h1>
            </div>
            <p className="text-muted-foreground mt-2 font-medium text-lg">
              Manage your professional identity and account security.
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-background border border-border p-2 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-600 rounded-xl border border-green-500/20">
              <Shield className="size-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Account Secure</span>
            </div>
            <div className="h-6 w-px bg-border" />
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="size-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="" className="size-full object-cover" />
                </div>
              ))}
              <div className="size-8 rounded-full border-2 border-background bg-primary text-white flex items-center justify-center text-[10px] font-black">
                +12
              </div>
            </div>
          </div>
        </div>

        {/* Settings Component */}
        <SettingsSection />
      </Container>
    </div>
  );
}
