import { useReveal } from './hooks/useReveal';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Events } from './components/Events';
import { Packages } from './components/Packages';
import { Gallery } from './components/Gallery';
import { About } from './components/About';
import { Testimonials } from './components/Testimonials';
import { Faq } from './components/Faq';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export default function App() {
  useReveal();
  return (
    <>
      <Nav />
      <a id="top" />
      <Hero />
      <Features />
      <Events />
      <Packages />
      <Gallery />
      <About />
      <Testimonials />
      <Faq />
      <Contact />
      <Footer />
    </>
  );
}
