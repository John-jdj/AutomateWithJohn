import { Hero } from "@/components/sections/home/Hero";
import { ServicePreviewGrid } from "@/components/sections/home/ServicePreviewGrid";
import { ProcessSteps } from "@/components/sections/home/ProcessSteps";
import { TechStackRow } from "@/components/sections/home/TechStackRow";
import { FeaturedProjects } from "@/components/sections/home/FeaturedProjects";
import { TestimonialCarousel } from "@/components/sections/home/TestimonialCarousel";
import { FinalCtaBanner } from "@/components/sections/home/FinalCtaBanner";

export default function Home() {
  return (
    <>
      <Hero />
      <TechStackRow />
      <ServicePreviewGrid />
      <ProcessSteps />
      <FeaturedProjects />
      <TestimonialCarousel />
      <FinalCtaBanner />
    </>
  );
}
