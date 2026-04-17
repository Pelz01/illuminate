import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import SiteLayout from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <SiteLayout>
      <section className="container py-32 md:py-44 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-primary font-mono">Error 404</p>
        <h1 className="mt-6 font-serif-display text-7xl md:text-9xl text-gradient-amber">Lost in the dark.</h1>
        <p className="mt-6 mx-auto max-w-md text-muted-foreground">
          The page you're looking for doesn't exist — or got rebalanced into another pool.
        </p>
        <Button variant="luminous" size="lg" className="mt-10" asChild>
          <Link to="/">Back to home</Link>
        </Button>
      </section>
    </SiteLayout>
  );
};

export default NotFound;
