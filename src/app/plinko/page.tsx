import PlinkoGame from "./plinko-game";
import { getCredits } from "./actions";
import { type Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Plinko — Slotovski",
  description: "Drop balls, chase the center, and win on Plinko at Slotovski.",
  openGraph: {
    title: "Plinko — Slotovski",
    description:
      "Drop balls, chase the center, and win on Plinko at Slotovski.",
    images: [{ url: `${siteUrl}/api/og?title=Plinko` }],
  },
};

export default async function Page() {
  const credits = await getCredits();
  return <PlinkoGame initialCredits={credits} />;
}
