"use client";

import { useEffect, useRef, useState } from "react";

interface CameraConfig {
  id: string;
  name: string;
  zone: string;
  streamName: string;
  brand: string;
}

const CAMERAS: CameraConfig[] = [
  {
    id: "cam1",
    name: "Acceso Principal (Av. América)",
    zone: "Exterior / Entrada",
    streamName: "cam_acceso_principal",
    brand: "Dahua IPC"
  },
  {
    id: "cam2",
    name: "Patio de Comidas Nivel 2",
    zone: "Piso 2 - Gastronomía",
    streamName: "cam_patio_comidas",
    brand: "Hikvision"
  },
  {
    id: "cam3",
    name: "Parqueo Subterráneo E-01",
    zone: "Subsuelo 1",
    streamName: "cam_parqueo",
    brand: "Uniview UNV"
  },
  {
    id: "cam4",
    name: "Pasillo Central & Tiendas",
    zone: "Piso 1 - Pasarela",
    streamName: "cam_pasillo_central",
    brand: "Tapo C310"
  }
];

function WebRTCStreamCard({ camera, isSingle }: { camera: CameraConfig; isSingle: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<"connecting" | "live" | "error">("connecting");
  const [latency, setLatency] = useState<number>(0);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    let pc: RTCPeerConnection | null = null;
    let isSubscribed = true;

    async function startWhep() {
      try {
        setStatus("connecting");
        pc = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" }
          ],
          bundlePolicy: "max-bundle"
        });

        pc.ontrack = (event) => {
          if (videoRef.current && isSubscribed) {
            videoRef.current.srcObject = event.streams[0];
            setStatus("live");
          }
        };

        pc.addTransceiver("video", { direction: "recvonly" });
        pc.addTransceiver("audio", { direction: "recvonly" });

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        // Espera de ICE rápida
        await new Promise<void>((resolve) => {
          if (pc?.iceGatheringState === "complete") {
            resolve();
          } else {
            const check = () => {
              if (pc?.iceGatheringState === "complete") {
                pc?.removeEventListener("icegatheringstatechange", check);
                resolve();
              }
            };
            pc?.addEventListener("icegatheringstatechange", check);
            setTimeout(resolve, 600);
          }
        });

        const host = typeof window !== "undefined" ? window.location.hostname : "localhost";
        const whepUrl = `http://${host}:8889/${camera.streamName}/whep`;

        const t0 = performance.now();
        const res = await fetch(whepUrl, {
          method: "POST",
          headers: { "Content-Type": "application/sdp" },
          body: pc.localDescription?.sdp
        });

        if (!res.ok) throw new Error(`MediaMTX respondió ${res.status}`);

        const answerSdp = await res.text();
        if (isSubscribed && pc) {
          await pc.setRemoteDescription(new RTCSessionDescription({ type: "answer", sdp: answerSdp }));
          setLatency(Math.round(performance.now() - t0));
        }
      } catch (err) {
        if (isSubscribed) {
          console.warn(`Error al conectar WebRTC para ${camera.name}:`, err);
          setStatus("error");
        }
      }
    }

    startWhep();

    return () => {
      isSubscribed = false;
      if (pc) {
        pc.close();
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [camera.streamName]);

  const captureSnapshot = () => {
    if (!videoRef.current || !videoRef.current.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `snapshot_${camera.streamName}_${Date.now()}.png`;
      a.click();
    }
  };

  return (
    <div className={`relative flex flex-col bg-slate-900 border border-cyan-900/60 rounded-xl overflow-hidden shadow-2xl ${isSingle ? "h-[75vh]" : "min-h-[320px]"}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-950/90 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${status === "live" ? "bg-emerald-400 animate-pulse" : status === "connecting" ? "bg-amber-400 animate-spin" : "bg-rose-500"}`} />
          <span className="font-bold text-cyan-400">{camera.name}</span>
          <span className="text-slate-500 hidden sm:inline">({camera.zone})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/40 text-[10px]">
            {camera.brand}
          </span>
          {status === "live" && (
            <span className="text-emerald-400 font-bold text-[11px]">
              {latency > 0 ? `~${latency}ms` : "WebRTC"}
            </span>
          )}
        </div>
      </div>

      {/* Video display */}
      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isMuted}
          className="w-full h-full object-contain"
        />

        {/* Loading overlay */}
        {status === "connecting" && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono text-cyan-300">Conectando WHEP Latencia Cero...</span>
          </div>
        )}

        {/* Error overlay */}
        {status === "error" && (
          <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-2 text-center p-4">
            <span className="text-amber-400 font-mono text-xs">⚠️ Flujo no disponible en MediaMTX</span>
            <p className="text-[11px] text-slate-500 max-w-xs">
              Asegúrate de que MediaMTX esté en ejecución en el puerto 8889 con la URL RTSP configurada.
            </p>
          </div>
        )}

        {/* REC overlay */}
        <div className="absolute top-3 left-3 bg-black/60 px-2 py-0.5 rounded text-[11px] font-mono text-red-400 flex items-center gap-1.5 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
          <span className="font-bold">LIVE WEBRTC</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-950/90 border-t border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={captureSnapshot}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded font-mono text-[11px] transition"
          >
            📸 Foto HD
          </button>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition"
          >
            {isMuted ? "🔇 Silenciado" : "🔊 Audio"}
          </button>
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          WHEP: :8889/{camera.streamName}
        </span>
      </div>
    </div>
  );
}

export default function OjoDelJuezPage() {
  const [selectedCam, setSelectedCam] = useState<string>("all");

  const displayedCameras = selectedCam === "all" 
    ? CAMERAS 
    : CAMERAS.filter(c => c.id === selectedCam);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 p-4 sm:p-6 font-sans">
      {/* Header */}
      <header className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-cyan-950">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">👁️</span>
            <h1 className="text-xl sm:text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 font-mono">
              OJO DEL JUEZ
            </h1>
            <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
              PASEO ARANJUEZ
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Prototipo de Latencia Cero &bull; MediaMTX + WebRTC (WHEP)
          </p>
        </div>

        {/* View selector */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-lg text-xs font-mono">
          <button
            onClick={() => setSelectedCam("all")}
            className={`px-3 py-1.5 rounded transition ${selectedCam === "all" ? "bg-cyan-600 text-white font-bold" : "text-slate-400 hover:text-white"}`}
          >
            Matriz 2x2
          </button>
          {CAMERAS.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setSelectedCam(c.id)}
              className={`px-3 py-1.5 rounded transition ${selectedCam === c.id ? "bg-cyan-600 text-white font-bold" : "text-slate-400 hover:text-white"}`}
            >
              CAM {i + 1}
            </button>
          ))}
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto mt-6">
        <div className={`grid gap-4 ${selectedCam === "all" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
          {displayedCameras.map((cam) => (
            <WebRTCStreamCard
              key={cam.id}
              camera={cam}
              isSingle={selectedCam !== "all"}
            />
          ))}
        </div>

        {/* Help Banner */}
        <div className="mt-8 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-400 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-cyan-400 font-bold">💡 Servidor Multimedia:</span> MediaMTX está procesando las entradas RTSP y transmitiendo directamente vía WebRTC (puerto 8889).
          </div>
          <div className="text-slate-500">
            Panel dedicado independiente disponible en: <a href="http://localhost:5050" target="_blank" className="text-cyan-400 underline">http://localhost:5050</a>
          </div>
        </div>
      </main>
    </div>
  );
}
