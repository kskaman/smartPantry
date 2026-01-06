import { AddItemsSection } from "../components/AddItemsSection";
import { InventoryStats } from "./components/InventoryStats";

export default function Home() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-title">Dashboard</h1>
      </div>

      <AddItemsSection />

      {/* Inventory Stats */}
      <InventoryStats />
    </div>
  );
}
