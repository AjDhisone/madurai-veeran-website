import Navbar from '@/components/Navbar';
import { Footer } from '@/components/sections';

const MediaPage = () => {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-wrapper">
        <section className="section_media" style={{ paddingTop: '150px', paddingBottom: '100px' }}>
          <div className="padding-global">
            <div className="container-large">
              <div className="padding-section-large">
                <div className="text-align-center margin-bottom margin-xxlarge">
                  <h1 className="heading-style-h1">Media &amp; Interviews</h1>
                  <p className="text-size-large margin-top margin-small">
                    Watch my latest interviews and check out my YouTube channel for more financial education.
                  </p>
                  <div className="margin-top margin-medium">
                    <a 
                      href="https://www.youtube.com/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="button w-button"
                      style={{ backgroundColor: '#ff0000', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}
                    >
                      Visit My YouTube Channel
                    </a>
                  </div>
                </div>

                {/* Videos Grid */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                  gap: '2rem',
                  marginTop: '4rem' 
                }}>
                  {/* Placeholder for Video 1 */}
                  <div style={{ aspectRatio: '16/9', backgroundColor: '#333', borderRadius: '12px', overflow: 'hidden' }}>
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src="https://www.youtube.com/embed/placeholder1" 
                      title="YouTube video player" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  {/* Placeholder for Video 2 */}
                  <div style={{ aspectRatio: '16/9', backgroundColor: '#333', borderRadius: '12px', overflow: 'hidden' }}>
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src="https://www.youtube.com/embed/placeholder2" 
                      title="YouTube video player" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>

                  {/* Placeholder for Video 3 */}
                  <div style={{ aspectRatio: '16/9', backgroundColor: '#333', borderRadius: '12px', overflow: 'hidden' }}>
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src="https://www.youtube.com/embed/placeholder3" 
                      title="YouTube video player" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MediaPage;
