"use client";

import { CalendarDays, Clock3, MapPin, Check, ArrowRight } from "lucide-react";
import { useStore } from "@/providers/store-provider";
import { useSaved } from "@/hooks/use-saved";
import { events } from "../utils/mock";

export function EventsView({
  setModal,
}: {
  setModal: (modal: string) => void;
}) {
  const { notify } = useStore();
  const [reservations, setReservations] = useSaved<string[]>("paseo-reservations-v1", []);

  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">EL PASEO SE VIVE</span>
        <h2>Ven por un plan. Quédate por la experiencia.</h2>
        <p>Gastronomía, cultura y diversión para compartir. Siempre hay una nueva razón para volver.</p>
      </div>

      <div className="info-strip">
        <CalendarDays size={18} />
        Agenda ilustrativa del mockup. Confirma eventos y fechas con Paseo Aranjuez.
      </div>

      <div className="events-grid">
        {events.map((e) => (
          <div className="event-card" key={e.id}>
            <div className="event-photo">
              <img src={e.image} alt={e.type} />
              <span className="date-tile">
                <strong>{e.date.split(" ")[0]}</strong>
                <span>{e.date.split(" ")[1]}</span>
              </span>
            </div>
            <div className="shop-info">
              <span className="eyebrow">{e.type}</span>
              <h3>{e.title}</h3>
              <p>
                <Clock3 size={14} />
                {e.time}
              </p>
              <p>
                <MapPin size={14} />
                {e.place}
              </p>
              <button
                className={`button full ${reservations.includes(e.id) ? "outline" : "primary"}`}
                onClick={() => {
                  setReservations((prev) =>
                    prev.includes(e.id) ? prev.filter((r) => r !== e.id) : [...prev, e.id]
                  );
                  notify(
                    reservations.includes(e.id)
                      ? "Reserva de ejemplo cancelada."
                      : "¡Plan guardado! Tu reserva de demostración está en Mi actividad."
                  );
                }}
              >
                {reservations.includes(e.id) ? (
                  <>
                    <Check size={16} /> Reservado · Cancelar
                  </>
                ) : (
                  <>
                    Quiero vivirlo <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="office-feature">
        <img src="/assets/paseo-building.jpg" alt="Cowork" />
        <div>
          <span className="eyebrow">TAMBIÉN HAY LUGAR PARA TUS IDEAS</span>
          <h2>Trabaja, conecta, crece.</h2>
          <p>Descubre el cowork y las oficinas de las torres empresariales. Flexibilidad, equipamiento y una vista que inspira.</p>
          <button className="button primary" onClick={() => setModal("cowork")}>
            Conocer los espacios <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
