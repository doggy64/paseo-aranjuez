import { Sparkles, Trophy, ArrowRight, QrCode } from "lucide-react";

export function PointsCard({
  points,
  large = false,
  onGoToPoints,
  onShowQR,
}: {
  points: number;
  large?: boolean;
  onGoToPoints: () => void;
  onShowQR: () => void;
}) {
  return (
    <div className={`points-card ${large ? "large" : ""}`}>
      <div className="points-card-top">
        <span className="points-brand">
          <Sparkles size={16} />
          PASEO POINTS
        </span>
        <span className="gold-badge">
          <Trophy size={12} />
          Nivel Oro
        </span>
      </div>
      <p>Disfrutar tiene su recompensa</p>
      <div className="points-number">
        {points.toLocaleString("es-BO")}
        <span>puntos disponibles</span>
      </div>
      <div className="level-track">
        <div style={{ width: `${Math.min(100, points / 20)}%` }} />
      </div>
      <div className="points-caption">
        <span>{Math.max(0, 2000 - points)} puntos para Platinum</span>
        <span>2.000 pts</span>
      </div>
      <div className="points-actions">
        <button className="button" onClick={onGoToPoints}>
          Ver beneficios
          <ArrowRight size={15} />
        </button>
        <button
          className="button qr-button"
          aria-label="Mostrar mi QR"
          onClick={onShowQR}
        >
          <QrCode size={20} />
        </button>
      </div>
    </div>
  );
}
