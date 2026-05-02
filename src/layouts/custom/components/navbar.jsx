import { Container } from '@/components/common/container';
import { NavbarMenu } from '@/layouts/demo2/components/navbar-menu';
import { NavbarLinks } from '@/layouts/demo2/components/navbar-links';

export function Navbar({ width }) {
  return (
    <div className="border-b w-full border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-16 z-50">
      <Container width={width} className="flex flex-wrap justify-between items-center gap-2">
        <NavbarMenu />
        <div className="hidden lg:block">
          <NavbarLinks />
        </div>
      </Container>
    </div>
  );
}
