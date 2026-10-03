// ==============================================================================
// OJO DEL JUEZ - Backend Centralizador de Cámaras
// Servidor de Control, Gestión de Cámaras, Integración MediaMTX y Descubrimiento
// ==============================================================================

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import dgram from 'node:dgram';
import { exec, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5050;
const MEDIAMTX_API = process.env.MEDIAMTX_API || 'http://127.0.0.1:9997';
const MEDIAMTX_WHEP = process.env.MEDIAMTX_WHEP || 'http://127.0.0.1:8889';
const MEDIAMTX_RTSP = process.env.MEDIAMTX_RTSP || 'rtsp://127.0.0.1:8554';
const DB_FILE = path.join(__dirname, 'cameras.json');
const FRONTEND_DIR = path.join(__dirname, '../frontend');

// Cámaras iniciales por defecto (Simulación del Paseo Aranjuez)
const DEFAULT_CAMERAS = [
  {
    id: 'cam_acceso_principal',
    name: 'Acceso Principal (Av. América)',
    zone: 'Exterior / Entrada',
    brand: 'Dahua IPC-HFW (Simulada)',
    rtspSource: 'rtsp://localhost:8554/cam_acceso_principal',
    streamName: 'cam_acceso_principal',
    resolution: '1280x720',
    fps: 25,
    type: 'simulated',
    status: 'online',
    createdAt: new Date().toISOString()
  },
  {
    id: 'cam_patio_comidas',
    name: 'Patio de Comidas Nivel 2',
    zone: 'Piso 2 - Gastronomía',
    brand: 'Hikvision DS-2CD (Simulada)',
    rtspSource: 'rtsp://localhost:8554/cam_patio_comidas',
    streamName: 'cam_patio_comidas',
    resolution: '1280x720',
    fps: 25,
    type: 'simulated',
    status: 'online',
    createdAt: new Date().toISOString()
  },
  {
    id: 'cam_parqueo',
    name: 'Parqueo Subterráneo E-01',
    zone: 'Subsuelo 1 - Estacionamiento',
    brand: 'Uniview UNV (Simulada)',
    rtspSource: 'rtsp://localhost:8554/cam_parqueo',
    streamName: 'cam_parqueo',
    resolution: '1280x720',
    fps: 25,
    type: 'simulated',
    status: 'online',
    createdAt: new Date().toISOString()
  },
  {
    id: 'cam_pasillo_central',
    name: 'Pasillo Central & Tiendas',
    zone: 'Piso 1 - Pasarela Comercial',
    brand: 'TP-Link Tapo C310 (Simulada)',
    rtspSource: 'rtsp://localhost:8554/cam_pasillo_central',
    streamName: 'cam_pasillo_central',
    resolution: '1280x720',
    fps: 25,
    type: 'simulated',
    status: 'online',
    createdAt: new Date().toISOString()
  }
];

// Cargar o inicializar la base de datos de cámaras
function loadCameras() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_CAMERAS, null, 2));
      return DEFAULT_CAMERAS;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error al leer cameras.json:', err);
    return DEFAULT_CAMERAS;
  }
}

function saveCameras(cameras) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(cameras, null, 2));
  } catch (err) {
    console.error('Error al guardar cameras.json:', err);
  }
}

// Consultar estado de streams en MediaMTX
async function getMediaMtxPaths() {
  try {
    const res = await fetch(`${MEDIAMTX_API}/v3/paths/list`, { signal: AbortSignal.timeout(1500) });
    if (!res.ok) return {};
    const data = await res.json();
    const map = {};
    if (data.items) {
      for (const item of data.items) {
        map[item.name] = item;
      }
    }
    return map;
  } catch {
    return {};
  }
}

// Agregar path en caliente a MediaMTX
async function addMediaMtxPath(streamName, rtspUrl) {
  try {
    const res = await fetch(`${MEDIAMTX_API}/v3/config/paths/add/${streamName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: rtspUrl,
        sourceOnDemand: false,
        rtspTransport: 'automatic'
      })
    });
    return res.ok;
  } catch (err) {
    console.warn(`No se pudo agregar path a MediaMTX API (${err.message}). Se usará wildcard.`);
    return false;
  }
}

// Eliminar path en caliente de MediaMTX
async function removeMediaMtxPath(streamName) {
  try {
    const res = await fetch(`${MEDIAMTX_API}/v3/config/paths/delete/${streamName}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

// Descubrimiento ONVIF (WS-Discovery)
function discoverOnvifDevices(timeoutMs = 2500) {
  return new Promise((resolve) => {
    const socket = dgram.createSocket('udp4');
    const devices = [];

    const probeMessage = `<?xml version="1.0" encoding="utf-8"?>
<Envelope xmlns="http://www.w3.org/2003/05/soap-envelope" xmlns:dn="http://www.onvif.org/ver10/network/wsdl">
  <Header>
    <wsa:MessageID xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing">uuid:${Math.random().toString(36).substring(2)}</wsa:MessageID>
    <wsa:To xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing">urn:schemas-xmlsoap-org:ws:2005:04:discovery</wsa:To>
    <wsa:Action xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2005/04/discovery/Probe</wsa:Action>
  </Header>
  <Body>
    <Probe xmlns="http://schemas.xmlsoap.org/ws/2005/04/discovery">
      <Types>dn:NetworkVideoTransmitter</Types>
    </Probe>
  </Body>
</Envelope>`;

    socket.on('message', (msg, rinfo) => {
      const text = msg.toString();
      const xAddrsMatch = text.match(/<d:XAddrs>(.*?)<\/d:XAddrs>/i) || text.match(/<[^>]*XAddrs[^>]*>(.*?)<\/[^>]*XAddrs>/i);
      const scopesMatch = text.match(/<d:Scopes>(.*?)<\/d:Scopes>/i) || text.match(/<[^>]*Scopes[^>]*>(.*?)<\/[^>]*Scopes>/i);

      devices.push({
        ip: rinfo.address,
        port: rinfo.port,
        xAddrs: xAddrsMatch ? xAddrsMatch[1].split(' ') : [`http://${rinfo.address}/onvif/device_service`],
        scopes: scopesMatch ? scopesMatch[1] : ''
      });
    });

    socket.on('error', (err) => {
      console.warn('ONVIF discovery error:', err.message);
      socket.close();
      resolve(devices);
    });

    socket.bind(() => {
      try {
        socket.setBroadcast(true);
        socket.send(probeMessage, 0, probeMessage.length, 3702, '239.255.255.250');
      } catch (e) {
        console.warn('Error sending WS-Discovery:', e.message);
      }
    });

    setTimeout(() => {
      try { socket.close(); } catch {}
      resolve(devices);
    }, timeoutMs);
  });
}

// Servir archivos estáticos
function serveStatic(req, res, filePath) {
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 No Encontrado');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error interno del servidor');
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });
      res.end(content);
    }
  });
}

// Router HTTP
const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // ==========================================
  // API: Listar Cámaras con Estado en Vivo
  // ==========================================
  if (pathname === '/api/cameras' && req.method === 'GET') {
    const cameras = loadCameras();
    const mtxPaths = await getMediaMtxPaths();

    const host = req.headers.host ? req.headers.host.split(':')[0] : 'localhost';

    const enriched = cameras.map(cam => {
      const pathInfo = mtxPaths[cam.streamName];
      const isOnline = !!(pathInfo && pathInfo.ready && pathInfo.online);

      return {
        ...cam,
        status: isOnline ? 'online' : (cam.type === 'simulated' ? 'online' : 'offline'),
        whepUrl: `http://${host}:8889/${cam.streamName}/whep`,
        rtspUrl: `rtsp://${host}:8554/${cam.streamName}`,
        hlsUrl: `http://${host}:8888/${cam.streamName}/index.m3u8`,
        metrics: pathInfo ? {
          readersCount: pathInfo.readers?.length || 0,
          bytesReceived: pathInfo.bytesReceived || 0,
          tracks: pathInfo.tracks || ['H264']
        } : null
      };
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(enriched));
    return;
  }

  // ==========================================
  // API: Agregar Nueva Cámara
  // ==========================================
  if (pathname === '/api/cameras' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        if (!payload.name || !payload.rtspSource) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Nombre y URL RTSP son obligatorios' }));
          return;
        }

        // Sanitizar identificador de stream para MediaMTX
        const streamName = (payload.streamName || payload.name)
          .toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9_-]/g, '_');

        const cameras = loadCameras();
        const id = 'cam_' + Date.now();

        const newCam = {
          id,
          name: payload.name,
          zone: payload.zone || 'Paseo Aranjuez',
          brand: payload.brand || 'Universal RTSP',
          rtspSource: payload.rtspSource,
          streamName,
          resolution: payload.resolution || 'Auto / 1080p',
          fps: payload.fps || 25,
          type: 'real',
          status: 'connecting',
          createdAt: new Date().toISOString()
        };

        // Registrar en MediaMTX para que comience a ingerir automáticamente
        await addMediaMtxPath(streamName, payload.rtspSource);

        cameras.push(newCam);
        saveCameras(cameras);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newCam));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error al procesar la cámara: ' + err.message }));
      }
    });
    return;
  }

  // ==========================================
  // API: Importación Masiva por DVR / NVR
  // ==========================================
  if (pathname === '/api/cameras/import-dvr' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        const {
          brand = 'hikvision',
          ip,
          port = 554,
          user = 'admin',
          password = '',
          channels = 4,
          quality = 'main',
          dvrName = 'DVR Paseo Aranjuez',
          zone = 'General'
        } = payload;

        if (!ip || !user) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'IP y usuario del DVR son requeridos' }));
          return;
        }

        const channelCount = Math.min(Math.max(parseInt(channels, 10) || 4, 1), 32);
        const cameras = loadCameras();
        const added = [];

        for (let i = 1; i <= channelCount; i++) {
          let rtspSource = '';
          const b = brand.toLowerCase();

          if (b.includes('hikvision') || b.includes('hilook') || b.includes('ezviz')) {
            const chId = quality === 'main' ? `${i}01` : `${i}02`;
            rtspSource = `rtsp://${user}:${password}@${ip}:${port}/Streaming/Channels/${chId}`;
          } else if (b.includes('dahua') || b.includes('imou')) {
            const sub = quality === 'main' ? 0 : 1;
            rtspSource = `rtsp://${user}:${password}@${ip}:${port}/cam/realmonitor?channel=${i}&subtype=${sub}`;
          } else if (b.includes('uniview')) {
            const sub = quality === 'main' ? 's0' : 's1';
            rtspSource = `rtsp://${user}:${password}@${ip}:${port}/unicast/c${i}/${sub}/live`;
          } else {
            rtspSource = `rtsp://${user}:${password}@${ip}:${port}/live/ch${i}`;
          }

          const streamName = `${dvrName}_ch${i}`
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9_-]/g, '_');

          const newCam = {
            id: `dvr_${Date.now()}_ch${i}`,
            name: `${dvrName} - Canal ${i}`,
            zone: `${zone} (CH ${i})`,
            brand: `DVR ${brand.toUpperCase()} (${quality === 'main' ? 'HD' : 'Sub'})`,
            rtspSource,
            streamName,
            resolution: quality === 'main' ? '1080p / 720p' : 'Substream',
            fps: 25,
            type: 'dvr',
            status: 'connecting',
            createdAt: new Date().toISOString()
          };

          await addMediaMtxPath(streamName, rtspSource);
          cameras.push(newCam);
          added.push(newCam);
        }

        saveCameras(cameras);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          count: added.length,
          message: `Se importaron ${added.length} canales del DVR ${dvrName} exitosamente`,
          cameras: added
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error importando canales del DVR: ' + err.message }));
      }
    });
    return;
  }

  // ==========================================
  // API: Decodificador / Parser de Código QR
  // ==========================================
  if (pathname === '/api/cameras/parse-qr' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { qrData } = JSON.parse(body);
        if (!qrData) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Dato QR requerido' }));
          return;
        }

        const raw = qrData.trim();
        let result = {
          type: 'unknown',
          raw,
          name: '',
          rtspSource: '',
          brand: 'Universal',
          zone: 'Sector QR'
        };

        if (raw.startsWith('rtsp://')) {
          result.type = 'rtsp_url';
          result.rtspSource = raw;
          result.name = 'Cámara RTSP (QR)';
        } else if (raw.startsWith('{') && raw.endsWith('}')) {
          try {
            const parsed = JSON.parse(raw);
            result.type = 'json_config';
            result.name = parsed.name || 'Cámara Escaneada';
            result.zone = parsed.zone || 'Zona QR';
            result.brand = parsed.brand || 'Universal';
            if (parsed.rtsp) {
              result.rtspSource = parsed.rtsp;
            } else if (parsed.ip) {
              const u = parsed.user || 'admin';
              const p = parsed.pass || parsed.password || 'admin';
              const port = parsed.port || 554;
              result.rtspSource = `rtsp://${u}:${p}@${parsed.ip}:${port}/live`;
            }
          } catch {}
        } else if (raw.includes('Verification Code') || raw.includes('SN:') || raw.includes('CS-')) {
          result.type = 'ezviz_sticker';
          const matchCode = raw.match(/Verification Code:?\s*([A-Za-z0-9]+)/i) || raw.match(/([A-Z0-9]{6})/);
          const matchSN = raw.match(/SN:?\s*([A-Za-z0-9]+)/i);
          result.verificationCode = matchCode ? matchCode[1] : '';
          result.serialNumber = matchSN ? matchSN[1] : '';
          result.brand = 'Hikvision / EZVIZ';
          result.name = `EZVIZ (${result.serialNumber || 'QR'})`;
          result.instructions = `Código de verificación: "${result.verificationCode}". Usa este código como contraseña en el RTSP local.`;
        } else if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(raw)) {
          result.type = 'ip_address';
          result.name = `Cámara (${raw})`;
          result.rtspSource = `rtsp://admin:admin@${raw}:554/live`;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // ==========================================
  // API: Eliminar Cámara
  // ==========================================
  if (pathname.startsWith('/api/cameras/') && req.method === 'DELETE') {
    const id = pathname.replace('/api/cameras/', '');
    let cameras = loadCameras();
    const cam = cameras.find(c => c.id === id);

    if (cam) {
      await removeMediaMtxPath(cam.streamName);
      cameras = cameras.filter(c => c.id !== id);
      saveCameras(cameras);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: `Cámara ${cam.name} eliminada` }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Cámara no encontrada' }));
    }
    return;
  }

  // ==========================================
  // API: Presets y Plantillas de Marcas de Cámaras
  // ==========================================
  if (pathname === '/api/cameras/presets' && req.method === 'GET') {
    const presets = [
      {
        brand: 'Hikvision / EZVIZ',
        protocol: 'RTSP',
        port: 554,
        urlTemplate: 'rtsp://{user}:{password}@{ip}:554/Streaming/Channels/101',
        substreamTemplate: 'rtsp://{user}:{password}@{ip}:554/Streaming/Channels/102',
        instructions: '101 es el canal principal (Alta Resolución), 102 es el substream (Baja Resolución para matriz). Asegúrate de habilitar ONVIF/RTSP en la interfaz web de Hikvision (Configuración -> Red -> Ajustes avanzados -> Protocolo de integración).'
      },
      {
        brand: 'Dahua / IMOU',
        protocol: 'RTSP',
        port: 554,
        urlTemplate: 'rtsp://{user}:{password}@{ip}:554/cam/realmonitor?channel=1&subtype=0',
        substreamTemplate: 'rtsp://{user}:{password}@{ip}:554/cam/realmonitor?channel=1&subtype=1',
        instructions: 'channel=1 indica el lente o canal NVR. subtype=0 es el flujo primario, subtype=1 es el secundario.'
      },
      {
        brand: 'TP-Link Tapo',
        protocol: 'RTSP',
        port: 554,
        urlTemplate: 'rtsp://{user}:{password}@{ip}:554/stream1',
        substreamTemplate: 'rtsp://{user}:{password}@{ip}:554/stream2',
        instructions: 'En la app Tapo: Configuración de la cámara -> Ajustes avanzados -> Cuenta de la cámara (crea un usuario y contraseña exclusivo para RTSP).'
      },
      {
        brand: 'Uniview (UNV)',
        protocol: 'RTSP',
        port: 554,
        urlTemplate: 'rtsp://{user}:{password}@{ip}:554/unicast/c1/s0/live',
        substreamTemplate: 'rtsp://{user}:{password}@{ip}:554/unicast/c1/s1/live',
        instructions: 'c1 representa la cámara 1, s0 es el stream principal y s1 el substream.'
      },
      {
        brand: 'Smartphone (Android / iPhone)',
        protocol: 'RTSP / HTTP',
        port: 8080,
        urlTemplate: 'rtsp://{ip}:8080/h264_pcm.sdp',
        instructions: 'Instala la app gratuita "IP Webcam" en Android o "RTSP Camera" en iOS. Presiona "Start Server" e introduce la IP de tu teléfono que aparece en la pantalla.'
      },
      {
        brand: 'Cámara USB / Laptop (FFmpeg Push)',
        protocol: 'RTSP Push',
        port: 8554,
        urlTemplate: 'rtsp://localhost:8554/{streamName}',
        instructions: 'Transmite directamente la webcam local ejecutando: ffmpeg -f v4l2 -i /dev/video0 -c:v libx264 -preset ultrafast -tune zerolatency -b:v 1500k -f rtsp rtsp://localhost:8554/webcam'
      },
      {
        brand: 'ONVIF Genérica / Marcas Chinas',
        protocol: 'RTSP / ONVIF',
        port: 554,
        urlTemplate: 'rtsp://{user}:{password}@{ip}:554/onvif1',
        instructions: 'La mayoría de cámaras genéricas usan /onvif1, /live/ch0, /h264Preview_01_main o el descubrimiento automático ONVIF.'
      }
    ];

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(presets));
    return;
  }

  // ==========================================
  // API: Probar Conexión RTSP
  // ==========================================
  if (pathname === '/api/test-rtsp' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { rtspUrl } = JSON.parse(body);
        if (!rtspUrl) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: 'URL RTSP requerida' }));
          return;
        }

        // Ejecutar ffprobe rápido (1.5 segundos timeout)
        const cmd = `ffprobe -v error -rtsp_transport tcp -stimeout 2000000 -select_streams v:0 -show_entries stream=codec_name,width,height -of json "${rtspUrl}"`;
        exec(cmd, { timeout: 4000 }, (error, stdout) => {
          if (error) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: false, message: 'No se pudo conectar a la cámara RTSP: ' + error.message }));
          } else {
            try {
              const probe = JSON.parse(stdout);
              const stream = probe.streams && probe.streams[0];
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                ok: true,
                message: 'Conexión RTSP exitosa',
                codec: stream ? stream.codec_name : 'H264',
                resolution: stream ? `${stream.width}x${stream.height}` : 'Detectada'
              }));
            } catch {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ ok: true, message: 'Flujo RTSP respondió correctamente' }));
            }
          }
        });
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      }
    });
    return;
  }

  // ==========================================
  // API: Descubrimiento Automático ONVIF en LAN
  // ==========================================
  if (pathname === '/api/discover-onvif' && req.method === 'GET') {
    const devices = await discoverOnvifDevices(2500);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ count: devices.length, devices }));
    return;
  }

  // ==========================================
  // API: Estado del Sistema & MediaMTX Health
  // ==========================================
  if (pathname === '/api/status' && req.method === 'GET') {
    let mediamtxOnline = false;
    let pathsCount = 0;
    try {
      const resMtx = await fetch(`${MEDIAMTX_API}/v3/paths/list`, { signal: AbortSignal.timeout(1000) });
      if (resMtx.ok) {
        const json = await resMtx.json();
        mediamtxOnline = true;
        pathsCount = json.itemCount || 0;
      }
    } catch {}

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'operational',
      system: 'Ojo del Juez v1.0',
      mediamtx: {
        online: mediamtxOnline,
        apiPort: 9997,
        rtspPort: 8554,
        webrtcPort: 8889,
        activeStreams: pathsCount
      },
      uptime: process.uptime()
    }));
    return;
  }

  // ==========================================
  // Frontend Estático
  // ==========================================
  let reqPath = pathname === '/' ? '/index.html' : pathname;
  let fullPath = path.join(FRONTEND_DIR, reqPath);

  // Seguridad: evitar path traversal
  if (!fullPath.startsWith(FRONTEND_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Acceso denegado');
    return;
  }

  serveStatic(req, res, fullPath);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`👁️ OJO DEL JUEZ - Centralizador de Cámaras WebRTC`);
  console.log(`Dashboard Web:  http://localhost:${PORT}`);
  console.log(`MediaMTX WHEP:  ${MEDIAMTX_WHEP}`);
  console.log(`MediaMTX RTSP:  ${MEDIAMTX_RTSP}`);
  console.log(`MediaMTX API:   ${MEDIAMTX_API}`);
  console.log(`=======================================================`);
});
