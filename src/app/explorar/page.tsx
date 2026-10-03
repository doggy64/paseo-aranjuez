"use client";
import { DirectoryView } from "@/modules/directory/views/directory-view";
import { useStore } from "@/providers/store-provider";
export default function ExplorarPage() {
  const { setSelectedShop, setModal } = useStore();
  return <DirectoryView setSelectedShop={setSelectedShop} setModal={setModal} />;
}
