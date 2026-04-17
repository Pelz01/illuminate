import { ReactNode } from "react";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";

export const SiteLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      {/* Ambient aurora background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl animate-float-slow" />
        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-accent/10 blur-3xl animate-float-slow" style={{ animationDelay: "-7s" }} />
        <div className="absolute bottom-0 left-0 h-[400px] w-[600px] rounded-full bg-primary-deep/10 blur-3xl animate-float-slow" style={{ animationDelay: "-3s" }} />
      </div>

      <SiteNav />
      <main className="pt-16">{children}</main>
      <SiteFooter />
    </div>
  );
};

export default SiteLayout;
