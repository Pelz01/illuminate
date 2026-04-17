import SiteLayout from "@/components/site/SiteLayout";
import Hero from "@/components/site/Hero";
import Problem from "@/components/site/Problem";
import Features from "@/components/site/Features";
import SimulatorPreview from "@/components/site/SimulatorPreview";
import Comparison from "@/components/site/Comparison";
import CallToAction from "@/components/site/CallToAction";

const Index = () => (
  <SiteLayout>
    <Hero />
    <Problem />
    <Features />
    <SimulatorPreview />
    <Comparison />
    <CallToAction />
  </SiteLayout>
);

export default Index;
