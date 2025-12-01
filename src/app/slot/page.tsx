import { getCredits } from "./actions";
import SlotMachine from "./slot-machine";
import { type Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Slots — Slotovski",
  description: "Spin the slot machines and win big on Slotovski.",
  openGraph: {
    title: "Slots — Slotovski",
    description: "Spin the slot machines and win big on Slotovski.",
    images: [{ url: `${siteUrl}/api/og?title=Slots` }],
  },
};

export default async function SlotPage() {
  const credits = await getCredits();
  return <SlotMachine initialCredits={credits} />;
}
