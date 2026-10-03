# 👁️ GUÍA UNIVERSAL DE CONEXIÓN DE CÁMARAS — PROYECTO "OJO DEL JUEZ"

Esta guía explica en detalle cómo conectar **cualquier modelo, marca o compañía de cámara** al centralizador de video **Ojo del Juez**, utilizando el servidor de medios **MediaMTX** y streaming **WebRTC (WHEP)** de latencia cero (< 200 ms).

---

## 1. Fundamentos: ¿Por qué WebRTC y no WebSockets o HLS?

| Protocolo | Latencia Típica | Consumo de CPU | Calidad / Fluidez | Idoneidad para Seguridad |
| :--- | :--- | :--- | :--- | :--- |
| **WebRTC (WHEP)** | **80 ms - 200 ms** | **Muy Bajo (Hardware nativo)** | **60/30 FPS fluido con H.264** | ⭐⭐⭐⭐⭐ **Ideal ("Ojo de Dios")** |
| **WebSockets (MJPEG)**| 800 ms - 2.5 s | Alto (Re-codifica JPEG por frame) | Afectado por bitrate y drop | ⭐⭐ Regular |
| **HLS (HTTP Live)** | 4 s - 12 s | Bajo | Alta calidad pero con buffer | ⭐ Inviable para tiempo real |
| **RTSP nativo** | 150 ms - 400 ms | Requiere plugin o VLC en navegador | No soportado directamente en web | ⭐⭐ Incompatible con web |

**MediaMTX** resuelve este problema: ingiere el flujo **RTSP** estándar de las cámaras y lo transforma al vuelo en **WebRTC (WHEP)** sin recodificar (pass-through H.264), entregando video en milisegundos directamente a las etiquetas `<video>` del navegador web.

---

## 2. Cómo Conectar Cualquier Marca de Cámara (Formatos RTSP Oficiales)

El 99% de las cámaras de seguridad del mercado soportan **RTSP (Real-Time Streaming Protocol)** en el puerto `554`. 
Basta con configurar la URL RTSP en MediaMTX o mediante la interfaz de **Ojo del Juez**:

### A. Hikvision / HiLook / EZVIZ
- **Stream Principal (Alta Resolución):**
  ```
  rtsp://usuario:contraseña@IP_CAMARA:554/Streaming/Channels/101
  ```
- **Substream (Baja Resolución / Matriz Multi-cámara):**
  ```
  rtsp://usuario:contraseña@IP_CAMARA:554/Streaming/Channels/102
  ```
- **Habilitación requerida:**
  En la interfaz web de la cámara o NVR Hikvision:
  1. Ve a `Configuración` -> `Red` -> `Ajustes avanzados` -> `Protocolo de integración`.
  2. Activa la casilla **Habilitar ONVIF** y agrega un usuario con rol de Administrador.

---

### B. Dahua / IMOU
- **Stream Principal:**
  ```
  rtsp://usuario:contraseña@IP_CAMARA:554/cam/realmonitor?channel=1&subtype=0
  ```
- **Substream:**
  ```
  rtsp://usuario:contraseña@IP_CAMARA:554/cam/realmonitor?channel=1&subtype=1
  ```
- **Para grabadores NVR Dahua multi-canal:**
  Cambia `channel=1`, `channel=2`, `channel=3`, etc., para acceder a cada cámara del centro comercial.

---

### C. TP-Link Tapo (C100, C200, C310, C500, etc.)
1. Abre la aplicación móvil **Tapo** en tu celular.
2. Selecciona la cámara -> Icono de engranaje (Ajustes) -> `Ajustes avanzados` -> `Cuenta de la cámara`.
3. Crea un nombre de usuario y contraseña específicos para acceso local.
4. Conéctala mediante:
   ```
   rtsp://usuario:contraseña@IP_CAMARA:554/stream1   (Stream HD)
   rtsp://usuario:contraseña@IP_CAMARA:554/stream2   (Substream fluido)
   ```

---

### D. Uniview (UNV)
- **Stream Principal:**
  ```
  rtsp://usuario:contraseña@IP_CAMARA:554/unicast/c1/s0/live
  ```
- **Substream:**
  ```
  rtsp://usuario:contraseña@IP_CAMARA:554/unicast/c1/s1/live
  ```

---

### E. Axis Communications
- **Stream Principal:**
  ```
  rtsp://usuario:contraseña@IP_CAMARA:554/axis-media/media.amp
  ```
- Con perfil específico:
  ```
  rtsp://usuario:contraseña@IP_CAMARA:554/axis-media/media.amp?videocodec=h264
  ```

---

### F. Reolink
- **Stream Principal:**
  ```
  rtsp://usuario:contraseña@IP_CAMARA:554/h264Preview_01_main
  ```
- **Substream:**
  ```
  rtsp://usuario:contraseña@IP_CAMARA:554/h264Preview_01_sub
  ```

---

### G. Cámaras Genéricas Chinas / ONVIF / V380 / Yoosee / Tuya
Muchas cámaras económicas usan una de las siguientes rutas estándar:
- `rtsp://admin:admin@IP_CAMARA:554/onvif1`
- `rtsp://admin:admin@IP_CAMARA:554/live/ch0`
- `rtsp://admin:admin@IP_CAMARA:554/live/ch1`
- `rtsp://admin:admin@IP_CAMARA:554/mpeg4/ch0`
- `rtsp://admin:admin@IP_CAMARA:8554/live`

---

## 3. Convertir un Celular Smartphone en Cámara de Seguridad (en 30 Segundos)

Para demostraciones, hackathons o pruebas rápidas:

### En Android:
1. Instala la app gratuita **"IP Webcam"** (de Pavel Khlebovich) desde Google Play Store.
2. Abre la app, desliza hasta el final y toca **"Iniciar servidor"** (Start server).
3. Tu celular mostrará una IP local en pantalla (ejemplo: `http://192.168.1.45:8080`).
4. En **Ojo del Juez**, agrega la cámara con:
   ```
   rtsp://192.168.1.45:8080/h264_pcm.sdp
   ```
   ¡Listo! Tu celular se convertirá inmediatamente en un ojo de vigilancia WebRTC en tiempo real.

### En iOS (iPhone / iPad):
1. Instala la app **"RTSP Camera"** o **"Larix Broadcaster"**.
2. Configura el puerto en 8554 o el servidor RTSP interno.
3. Copia la URL RTSP generada en el Ojo del Juez.

---

## 4. Transmitir Webcam USB o Laptop vía FFmpeg

Puedes empujar el video de cualquier webcam conectada por USB a MediaMTX con un solo comando:

```bash
ffmpeg -f v4l2 -i /dev/video0 -c:v libx264 -preset ultrafast -tune zerolatency -pix_fmt yuv420p -b:v 1500k -f rtsp rtsp://localhost:8554/webcam
```

Al instante, el stream estará disponible para el frontend en:
`http://localhost:8889/webcam/whep`

---

## 5. Descubrimiento Automático ONVIF (WS-Discovery)

El backend de **Ojo del Juez** incluye un motor de descubrimiento por difusión UDP (`239.255.255.250:3702`).
Al pulsar **"Escanear ONVIF"** en el panel:
1. El backend emite una sonda `Probe` WS-Discovery en la red local.
2. Todas las cámaras compatibles en la LAN responden con sus direcciones IP y URLs de servicio.
3. El usuario puede seleccionar la cámara descubierta y conectarla con 1 clic.

---

## 6. Flujo de Datos Arquitectónico

```
[ Cámara IP / Celular / NVR / DVR ]
         │ (RTSP sobre TCP/UDP puerto 554)
         ▼
[ MediaMTX - Servidor Multimedia ]
         │ (Transcodificación Cero / Pass-Through H.264)
         │ (Señalización WHEP en puerto 8889)
         │ (Streaming RTP/SRTP UDP en puerto 8189)
         ▼
[ Frontend Ojo del Juez (WebRTC PeerConnection) ]
         │ (<video srcObject={remoteStream}>)
         ▼
[ Pantalla del Operador (< 150ms Latencia) ]
```

---

## 7. Conexión mediante Escaneo de Código QR (Explicación y Uso)

En **Ojo del Juez**, puedes vincular cámaras escaneando un código QR desde la cámara de tu laptop/celular o subiendo una foto/captura. 

### ¿Qué contiene el código QR de una cámara?
Dependiendo del tipo de cámara, el código QR contiene:
1. **Flujo RTSP Directo o JSON:**
   - Contenido: `rtsp://admin:1234@192.168.1.50:554/live` o `{"ip":"192.168.1.50","user":"admin","pass":"..."}`.
   - El decodificador de Ojo del Juez lo reconoce al instante y conecta el stream sin escribir nada.
2. **Etiqueta Física de Fabricante (EZVIZ / Hikvision / IMOU):**
   - Las cámaras EZVIZ y Hikvision traen una pegatina con un QR que incluye el **Número de Serie** y el **Verification Code** (ej. `Verification Code: ABCDEF`).
   - Al escanearlo, Ojo del Juez extrae automáticamente la clave de cifrado local (`ABCDEF`), la coloca como contraseña del RTSP y solo te pide la IP local de la cámara.
3. **QR de Apps Móviles (IP Webcam / RTSP Camera):**
   - Cuando conviertes un celular en cámara de seguridad con una app como "IP Webcam", la app genera un QR con su dirección IP local. Escanéalo desde Ojo del Juez y la cámara del teléfono se vincula en un segundo.

---

## 8. Conexión a través de Grabadores DVR / NVR (Multi-Canal)

En centros comerciales como **Paseo Aranjuez**, las cámaras de seguridad (tanto analógicas HD-TVI/coaxial como digitales IP) usualmente no se conectan una por una a la red, sino que convergen en uno o varios **DVRs / XVRs / NVRs** (grabadores de 8, 16 o 32 canales).

### ¿Se puede conectar a través de un DVR?
**¡Sí, totalmente!** Un DVR o NVR actúa como un concentrador RTSP. Con **una sola dirección IP y una sola contraseña**, puedes acceder a todos los canales individuales.

### Mapeo de Canales por Marca:

#### A. DVR / NVR Hikvision (o HiLook)
Para un grabador de 16 canales:
- **Canal 1 HD (Mainstream):** `rtsp://admin:clave@IP_DVR:554/Streaming/Channels/101`
- **Canal 1 Fluido (Substream):** `rtsp://admin:clave@IP_DVR:554/Streaming/Channels/102`
- **Canal 2 HD:** `rtsp://admin:clave@IP_DVR:554/Streaming/Channels/201`
- **Canal 8 HD:** `rtsp://admin:clave@IP_DVR:554/Streaming/Channels/801`
- **Canal 16 HD:** `rtsp://admin:clave@IP_DVR:554/Streaming/Channels/1601`

#### B. DVR / XVR / NVR Dahua (o IMOU)
- **Canal 1 HD:** `rtsp://admin:clave@IP_DVR:554/cam/realmonitor?channel=1&subtype=0`
- **Canal 1 Substream:** `rtsp://admin:clave@IP_DVR:554/cam/realmonitor?channel=1&subtype=1`
- **Canal 2 HD:** `rtsp://admin:clave@IP_DVR:554/cam/realmonitor?channel=2&subtype=0`
- **Canal N HD:** `rtsp://admin:clave@IP_DVR:554/cam/realmonitor?channel=N&subtype=0`

#### C. NVR Uniview (UNV)
- **Canal 1:** `rtsp://admin:clave@IP_DVR:554/unicast/c1/s0/live`
- **Canal 2:** `rtsp://admin:clave@IP_DVR:554/unicast/c2/s0/live`

### ⚡ Importador Masivo en 1 Clic en Ojo del Juez
En el panel web de **Ojo del Juez**, haz clic en el botón superior **"Importar DVR/NVR"**:
1. Elige la marca (Hikvision, Dahua, Uniview o Genérico).
2. Ingresa la IP, usuario y contraseña del DVR.
3. Selecciona la cantidad de canales (4, 8, 16 o 32).
4. Elige si deseas el Stream Principal (HD) o Substream (optimizado para matriz).
5. Pulsa **"Importar Todos los Canales"**.
MediaMTX mapeará y levantará todos los canales concurrentemente en segundo plano de manera instantánea.
