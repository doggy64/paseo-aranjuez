#!/usr/bin/env bash
# ==============================================================================
# OJO DEL JUEZ - Script de Parada Limpia
# ==============================================================================

echo "[-] Deteniendo componentes de Ojo del Juez..."

# Detener Backend
pkill -f "node.*server.mjs" && echo "[✓] Backend detenido." || echo "[-] Backend no estaba en ejecución."

# Detener MediaMTX y encoders
killall mediamtx 2>/dev/null && echo "[✓] MediaMTX detenido." || echo "[-] MediaMTX no estaba en ejecución."
pkill -f "ffmpeg.*mediamtx" 2>/dev/null && echo "[✓] Streams FFmpeg cerrados." || true

echo "[✓] Todo el sistema Ojo del Juez se ha detenido correctamente."
