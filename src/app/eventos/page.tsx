"use client";
import { EventsView } from "@/modules/events/views/events-view";
import { useStore } from "@/providers/store-provider";
export default function EventosPage() {
  const { setModal } = useStore();
  return <EventsView setModal={setModal} />;
}
