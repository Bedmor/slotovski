import { getCredits } from "./actions";
import SlotMachine from "./slot-machine";

export default async function SlotPage() {
  const credits = await getCredits();
  return <SlotMachine initialCredits={credits} />;
}
