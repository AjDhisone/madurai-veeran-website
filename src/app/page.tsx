import PageWipeLoader from '@/components/PageWipeLoader';
import Navbar from '@/components/Navbar';
import ConsultationForm from '@/components/ConsultationForm';
import {
  HeroSection,
  PressSection,
  NastyGalSection,
  BookSection,
  NetflixSection,
  SocialSection,
  Footer,
} from '@/components/sections';

export default function Home() {
  return (
    <>
      <div suppressHydrationWarning>
        <div className="page_wrapper">
          <PageWipeLoader />
          <Navbar />

          <div className="content_wrapper">
            <HeroSection />
            <ConsultationForm variant={1} />
            <PressSection />
            <NastyGalSection />
            <BookSection />
            <NetflixSection />
            <SocialSection />
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
    </>
  );
}
