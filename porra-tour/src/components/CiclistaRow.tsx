import { Link } from 'react-router-dom';
import type { Ciclista, Config, Logros, Participante } from '../data/types';
import { getFlagEmojiFromNacionalidad } from '../data/flagEmoji';
import { computeCiclistaPuntos } from '../data/scoring';

export function renderLogrosSummary(logros: Logros) {
  const items: string[] = [];
  if (logros.victorias_etapa > 0) items.push(`Victorias etapas: ${logros.victorias_etapa}`);
  if (logros.etapa_reina) items.push('Etapa reina');
  if (logros.posicion_general != null) items.push(`CG: ${logros.posicion_general}º`);
  if (logros.farolillo_rojo) items.push('Farolillo rojo');
  return items;
}

export default function CiclistaRow({
  ciclista,
  participante,
  config,
  enGrupetaInicial = false,
}: {
  ciclista: Ciclista;
  participante?: Participante;
  config: Config;
  enGrupetaInicial?: boolean;
}) {
  const flagEmoji = getFlagEmojiFromNacionalidad(ciclista.nacionalidad);
  const puntos = computeCiclistaPuntos(ciclista, config);

  return (
    <tr style={enGrupetaInicial ? { background: 'rgba(255, 193, 7, 0.12)' } : undefined}>
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
        {flagEmoji ? (
          <span aria-label={ciclista.nacionalidad} title={ciclista.nacionalidad}>
            {flagEmoji}
          </span>
        ) : null}
      </td>
      <td style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
        {participante ? (
          <Link
            to={`/participante/${participante.id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 10px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.14)',
              background: 'rgba(255,255,255,0.04)',
              color: 'rgba(255,255,255,0.95)',
            }}
          >
            <span>{participante.avatar}</span>
            <span>{participante.nombre}</span>
          </Link>
        ) : (
          <span className="muted">—</span>
        )}
      </td>
      <td style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
        <div style={{ fontWeight: 850 }}>{puntos}</div>
      </td>
    </tr>
  );
}

