"use client";
import { LoyaltyView } from "@/modules/loyalty/views/loyalty-view";
import { useStore } from "@/providers/store-provider";
import { useRouter } from "next/navigation";
export default function PuntosPage() {
  const { setModal, profile } = useStore();
  const router = useRouter();
  const go = (path: string) => router.push(path);
  const setActivityTab = (tab: string) => {}; // Will be handled better via query params eventually
  return <LoyaltyView setModal={setModal} go={go} setActivityTab={setActivityTab} profile={profile} />;
}
