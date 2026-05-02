import { ProfileHero } from './ProfileHero';
import { OverviewSection } from './OverviewSection';
import { Container } from '@/components/common/container';

export function PremiumProfileContent() {
  return (
    <div className="pb-10">
      <ProfileHero />
      
      <Container className="mt-8">
        <OverviewSection />
      </Container>
    </div>
  );
}
