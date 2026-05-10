import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/marketing/Hero";
import { Services } from "@/components/marketing/Services";
import { About } from "@/components/marketing/About";
import { WhyChooseUs } from "@/components/marketing/WhyChooseUs";
import { Projects } from "@/components/marketing/Projects";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Hero />
      <Services />
      <About />
      <WhyChooseUs />
      <Projects />
    </main>
  );
}
