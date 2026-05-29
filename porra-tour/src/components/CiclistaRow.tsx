import { Link } from 'react-router-dom';
import type { Ciclista, Logros } from '../data/types';
import MaillotBadge, { getMaillotBadgesFromLogros } from './MaillotBadge';
import { getFlagEmojiFromNacionalidad } from '../data/flagEmoji';

export function renderLogrosSummary(logros: Logros) {
  const items: string[] = [];
  if (logros.victorias_etapa > 0) items.push(`Victorias etapas: ${logros.victorias_etapa}`);
  if (logros.etapa_reina) items.push('Etapa reina');
  if (logros.clasificacion_general) items.push('Clasificación general');
  return items;
}

export default function CiclistaRow({
  ciclista,
  showParticipantLink = true,
}: {
  ciclista: Ciclista;
  showParticipantLink?: boolean;
}) {
  const maillotKeys = getMaillotBadgesFromLogros(ciclista.logros);
  return (
    <tr>
      <td style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
        {ciclista.dorsal}
      </td>
      <td style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
        <div style={{ fontWeight: 750 }}>{ciclista.nombre}</div>
        <div className="muted" style={{ fontSize: 13 }}>
          {ciclista.equipo}
        </div>
      </td>
      <td style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
        <span aria-label={ciclista.nacionalidad}>
          {getFlagEmojiFromNacionalidad(ciclista.nacionalidad)}
        </span>{' '}
        <span className="muted">{ciclista.nacionalidad}</span>
      </td>
      <td style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {maillotKeys.length === 0 ? <span className="muted">—</span> : null}
          {maillotKeys.map((k) => (
            <MaillotBadge key={k} maillot={k} />
          ))}
        </div>
      </td>
      <td style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
        <div style={{ fontWeight: 850 }}>{ciclista.puntos}</div>
      </td>
      <td style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
        {showParticipantLink && ciclista.participante_id ? (
          <Link
            to={`/participante/${ciclista.participante_id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 10px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.14)',
              background: 'rgba(255,255,255,0.04)',
            }}
          >
            Ver participante
          </Link>
        ) : null}
      </td>
    </tr>
  );
}

