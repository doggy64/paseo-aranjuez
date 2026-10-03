#!/usr/bin/env bash
# ==============================================================================
# OJO DEL JUEZ - Script de Inicio del Centralizador de Cámaras
# Inicia MediaMTX (WebRTC/RTSP) y el Servidor de Control Node.js
# ==============================================================================

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MEDIAMTX_DIR="$DIR/mediamtx"
BACKEND_DIR="$DIR/backend"

echo "========================================================"
echo "👁️  INICIANDO PROYECTO OJO DEL JUEZ (PASEO ARANJUEZ)"
echo "    Centralizador de Cámaras de Latencia Cero (WebRTC)"
echo "========================================================"

# Iniciar MediaMTX si no está corriendo
if pgrep -x "mediamtx" > /dev/null; then
    echo "[✓] MediaMTX ya está en ejecución (PID: $(pgrep -x mediamtx))."
else
    echo "[+] Iniciando MediaMTX (RTSP: 8554, WebRTC: 8889, API: 9997)..."
    cd "$MEDIAMTX_DIR"
    setsid ./mediamtx > "$MEDIAMTX_DIR/mediamtx.log" 2>&1 < /dev/null &
    sleep 2
    if pgrep -x "mediamtx" > /dev/null; then
        echo "[✓] MediaMTX iniciado correctamente (PID: $(pgrep -x mediamtx))."
    else
        echo "[!] Error al iniciar MediaMTX. Revisa $MEDIAMTX_DIR/mediamtx.log"
        exit 1
    fi
fi

# Iniciar Backend Node.js si no está corriendo
if pgrep -f "node.*server.mjs" > /dev/null; then
    echo "[✓] El backend ya está en ejecución (PID: $(pgrep -f "node.*server.mjs"))."
else
    echo "[+] Iniciando Servidor Backend y Dashboard Web (Puerto: 5050)..."
    cd "$BACKEND_DIR"
    setsid node server.mjs > "$BACKEND_DIR/server.log" 2>&1 < /dev/null &
    sleep 1
    echo "[✓] Backend iniciado correctamente (PID: $(pgrep -f "node.*server.mjs"))."
fi

echo ""
echo "========================================================"
echo "🎉 SISTEMA OJO DEL JUEZ EN LÍNEA Y OPERATIVO:"
echo "--------------------------------------------------------"
echo "🌐 Dashboard Web:   http://localhost:5050"
echo "⚡ WebRTC WHEP:     http://localhost:8889/<cam>/whep"
echo "🎥 Ingesta RTSP:    rtsp://localhost:8554/<cam>"
echo "⚙️  API Control:     http://localhost:9997"
echo "========================================================"
echo "Para detener el sistema, ejecuta: ./stop.sh"
