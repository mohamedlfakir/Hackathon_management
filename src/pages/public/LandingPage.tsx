import Hero from "../../components/landing/Hero";
import Stats from "../../components/landing/Stats";
import UpcomingHackathons from "../../components/landing/UpcomingHackathons";
import HowItWorks from "../../components/landing/HowItWorks";
import Testimonial from "../../components/landing/Testimonial";
import ProjectTeaser from "../../components/landing/ProjectTeaser";
import ClosingCTA from "../../components/landing/ClosingCTA";
import type { HackathonEvent } from "../../types/hackathon";

export default function LandingPage() {
  const handleAction = (event: HackathonEvent) => {
    // TODO: navigate to /hackathons/:id or open the registration flow
    console.log("Selected hackathon:", event.title);
  };

  return (
    <>
      <Hero />
      <Stats />
      <UpcomingHackathons onAction={handleAction} />
      <HowItWorks />
      <Testimonial />
      <ProjectTeaser />
      <ClosingCTA />
    </>
  );
}
