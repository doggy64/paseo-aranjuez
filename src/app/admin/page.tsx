"use client";
import { AdminView } from "@/modules/admin/views/admin-view";
import { useStore } from "@/providers/store-provider";
export default function AdminPage() {
  const { setModal } = useStore();
  return <AdminView isAdmin={true} setModal={setModal} />;
}
