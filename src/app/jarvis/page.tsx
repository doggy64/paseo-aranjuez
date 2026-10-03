"use client";
import { AssistantView } from "@/modules/assistant/views/assistant-view";
import { useRouter } from "next/navigation";
export default function JarvisPage() {
  const router = useRouter();
  return <AssistantView go={(path) => router.push(path)} setMapView={() => {}} />;
}
