import WorkstationHero from '../components/workstation3d/WorkstationHero';
import TrustBar from '../components/sections/TrustBar';
import About from '../components/sections/About';
import Skills from '../components/sections/Skills';
import Projects from '../components/sections/Projects';
import Services from '../components/sections/Services';
import Process from '../components/sections/Process';
import Certificates from '../components/sections/Certificates';
import Contact from '../components/sections/Contact';
import FinalCTA from '../components/sections/FinalCTA';

export default function Home() {
  return (
    <>
      <WorkstationHero />
      <TrustBar />
      <About />
      <Skills />
      <Projects />
      <Services />
      <Process />
      <Certificates />
      <Contact />
      <FinalCTA />
    </>
  );
}
