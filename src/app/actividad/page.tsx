"use client";
import { ActivityView } from "@/modules/activity/views/activity-view";
import { useStore } from "@/providers/store-provider";
import { useRouter } from "next/navigation";
export default function ActividadPage() {
  const { setModal } = useStore();
  const router = useRouter();
  return <ActivityView go={(path) => router.push(path)} setModal={setModal} initialTab="Pedidos" />;
}
