import SiteLayout from "@/components/site/SiteLayout";
import Features from "@/components/site/Features";
import Comparison from "@/components/site/Comparison";
import CallToAction from "@/components/site/CallToAction";
import { Section } from "@/components/site/Section";

const FeaturesPage = () => (
  <SiteLayout>
    <Section
      eyebrow="Features"
      title={<>Everything ILuminate <em className="italic text-primary/90">does for your LPs.</em></>}
      description="Five purpose-built tools that take you from blind to clear, and from clear to acting — without ever leaving the app."
    />
    <Features />
    <Comparison />
    <CallToAction />
  </SiteLayout>
);

export default FeaturesPage;
