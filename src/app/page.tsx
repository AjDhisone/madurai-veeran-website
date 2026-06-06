import PageWipeLoader from '@/components/PageWipeLoader';
import Navbar from '@/components/Navbar';
import {
  HeroSection,
  PressSection,
  PortfolioJourneySection,
  AudienceImpactSection,
  Footer,
} from '@/components/sections';

export default function Home() {
  return (
    <div suppressHydrationWarning>
      <div className="page_wrapper">
        <PageWipeLoader />
        <Navbar />

        <div className="content_wrapper">
          <HeroSection />
          <PressSection />
          <PortfolioJourneySection />
          <AudienceImpactSection />
          <Footer />
        </div>
      </div>

      {/* Google Tag Manager (noscript) */}
      <noscript
        dangerouslySetInnerHTML={{
          __html:
            '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-K3DLNXC" height="0" width="0" style="display:none;visibility:hidden"></iframe>',
        }}
      />
    </div>
  );
}
