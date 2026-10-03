# 👁️ OJO DEL JUEZ — Centralizador de Cámaras en Tiempo Real

> **Subproyecto Prototipo para Paseo Aranjuez**  
> Basado en **MediaMTX + WebRTC (WHEP)** con **Latencia Cero (< 150 ms)** para emular el efecto "Ojo de Dios" sobre cualquier cámara de seguridad, smartphone o webcam sin importar marca o modelo.

---

## 🚀 Inicio Rápido (1 Clic)

Para iniciar todo el sistema (MediaMTX + 4 flujos CCTV simulados de Paseo Aranjuez + Backend API + Dashboard Web):

```bash
cd /home/marvin/paseAranjuez/ojo-del-juez
./start.sh
```

Abre tu navegador en:
👉 **[http://localhost:5050](http://localhost:5050)**

Para detener todos los servicios:
```bash
./stop.sh
```

---

## 🛠️ Arquitectura y Puertos

| Servicio | Puerto | Descripción |
| :--- | :--- | :--- |
| **Dashboard Ojo del Juez** | `:5050` | Panel de control web estilo central de seguridad / CCTV |
| **MediaMTX WebRTC (WHEP)** | `:8889` | Entrega de video de ultra baja latencia directamente a `<video>` |
| **MediaMTX RTSP** | `:8554` | Ingesta universal para cámaras Hikvision, Dahua, Tapo, celulares |
| **MediaMTX REST API** | `:9997` | Control dinámico para registrar y remover cámaras en caliente |
| **MediaMTX HLS** | `:8888` | Fallback para navegadores antiguos |

---

## 📹 Cámaras Preconfiguradas (Paseo Aranjuez)

El prototipo incluye 4 streams sintéticos con telemetría en tiempo real y marcas horarias exactas para verificar la latencia nula:
1. **CAM 01:** Acceso Principal (Av. América)
2. **CAM 02:** Patio de Comidas Nivel 2
3. **CAM 03:** Parqueo Subterráneo E-01 (Detección de movimiento simulada)
4. **CAM 04:** Pasillo Central & Tiendas

---

## 🌐 Conectar Cámaras Reales (Universal)

Consulta la guía completa en [`docs/GUIA_CAMARAS_UNIVERSAL.md`](docs/GUIA_CAMARAS_UNIVERSAL.md) para ver la sintaxis exacta de:
- **Hikvision / EZVIZ:** `rtsp://admin:pass@IP:554/Streaming/Channels/101`
- **Dahua / IMOU:** `rtsp://admin:pass@IP:554/cam/realmonitor?channel=1&subtype=0`
- **TP-Link Tapo:** `rtsp://admin:pass@IP:554/stream1`
- **Uniview:** `rtsp://admin:pass@IP:554/unicast/c1/s0/live`
- **Celular Android / iOS:** `rtsp://IP_CELULAR:8080/h264_pcm.sdp`
- **Webcam USB:** `ffmpeg -f v4l2 -i /dev/video0 -c:v libx264 -preset ultrafast -f rtsp rtsp://localhost:8554/webcam`
- **Escaneo Automático ONVIF:** Disponible directamente desde el botón **"Escanear ONVIF"** en el Dashboard.

---

## 💻 Integración en el Proyecto Principal (Next.js)

Un componente React reutilizable para insertar cualquier cámara WebRTC en tu aplicación Next.js o React:

```tsx
import { useEffect, useRef } from 'react';

export function WebRTCPlayer({ streamName }: { streamName: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    pc.ontrack = (event) => {
      if (videoRef.current) {
        videoRef.current.srcObject = event.streams[0];
      }
    };

    pc.addTransceiver('video', { direction: 'recvonly' });
    pc.addTransceiver('audio', { direction: 'recvonly' });

    (async () => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const res = await fetch(`http://localhost:8889/${streamName}/whep`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/sdp' },
        body: offer.sdp
      });

      const answerSdp = await res.text();
      await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });
    })();

    return () => {
      pc.close();
    };
  }, [streamName]);

  return <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />;
}
```
