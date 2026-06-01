import { setRequestLocale } from "next-intl/server";
import { HeroSlider } from "@/components/marketing/HeroSlider";
import { Services } from "@/components/marketing/Services";
import { About } from "@/components/marketing/About";
import { WhyChooseUs } from "@/components/marketing/WhyChooseUs";
import { Projects } from "@/components/marketing/Projects";
import { CompanyCarousel } from "@/components/marketing/CompanyCarousel";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <HeroSlider />
      <CompanyCarousel />
      <Services />
      <About />
      <WhyChooseUs />
      <Projects />
    </main>
  );
}
