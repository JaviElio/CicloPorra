import { Link } from 'react-router-dom';
import type { Participante } from '../data/types';

export default function ClasificacionCard({
  participante,
  posicion,
}: {
  participante: Participante;
  posicion: number;
}) {
  return (
    <Link
      to={`/participante/${participante.id}`}
      style={{
        display: 'block',
        padding: 16,
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(255,255,255,0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            aria-hidden
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.14)',
              background:
                posicion === 1
                  ? 'rgba(255,193,7,0.18)'
                  : posicion === 2
                    ? 'rgba(255,255,255,0.12)'
                    : posicion === 3
                      ? 'rgba(229,57,53,0.12)'
                      : 'rgba(255,255,255,0.05)',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 900,
            }}
          >
            {posicion}
          </div>
          <div>
            <div style={{ fontWeight: 900, letterSpacing: -0.2 }}>
              <span style={{ marginRight: 8 }}>{participante.avatar}</span>
              {participante.nombre}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div className="muted" style={{ fontSize: 13 }}>
            Puntos
          </div>
          <div style={{ fontWeight: 950, fontSize: 22 }}>{participante.puntos_total}</div>
        </div>
      </div>
    </Link>
  );
}

