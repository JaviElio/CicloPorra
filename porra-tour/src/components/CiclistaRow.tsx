import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Ciclista, Config, Logros, Participante } from '../data/types';
import { getFlagEmojiFromNacionalidad } from '../data/flagEmoji';
import { computeCiclistaPuntos, getPuntosVictoriasEtapa, getPuntosPosicionGeneral } from '../data/scoring';
import MaillotBadge, { getMaillotBadgesFromLogros } from './MaillotBadge';

export function renderLogrosSummary(logros: Logros, config: Config) {
  const items: string[] = [];
  if (logros.victorias_etapa > 0 && getPuntosVictoriasEtapa(logros, config) > 0) {
    items.push(`Victorias etapas: ${logros.victorias_etapa}`);
  }
  if (logros.etapa_reina && config.puntuacion.victoria_etapa_reina > 0) {
    items.push(config.etapa_reina ? `Etapa reina (etapa ${config.etapa_reina})` : 'Etapa reina');
  }
  if (logros.posicion_general != null && getPuntosPosicionGeneral(logros.posicion_general, config) > 0) {
    items.push(`CG: ${logros.posicion_general}º`);
  }
  if (logros.farolillo_rojo && config.puntuacion.farolillo_rojo > 0) items.push('Farolillo rojo');
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
  const [expanded, setExpanded] = useState(false);
  const maillotKeys = getMaillotBadgesFromLogros(ciclista.logros);
  const logrosItems = renderLogrosSummary(ciclista.logros, config);

  return (
    <>
      <tr
        className="row-clickable"
        onClick={() => setExpanded((v) => !v)}
        style={enGrupetaInicial ? { background: 'rgba(255, 193, 7, 0.12)' } : undefined}
      >
        <td className="tbl-cell" style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
          {ciclista.dorsal}
        </td>
        <td className="tbl-cell" style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
          <div style={{ fontWeight: 750, display: 'flex', alignItems: 'center' }}>
            {ciclista.logros.abandono ? '☠️ ' : ''}
            <span style={{ textDecoration: ciclista.logros.abandono ? 'line-through' : undefined }}>
              {ciclista.nombre}
            </span>
            <span className="show-mobile muted" style={{ marginLeft: 8, fontSize: 12 }}>
              {expanded ? '▾' : '▸'}
            </span>
            {ciclista.link ? (
              <span className="hide-mobile">
                <a
                  href={ciclista.link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    marginLeft: 10,
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '4px 10px',
                    borderRadius: 999,
                    border: '1px solid rgba(255,255,255,0.14)',
                    background: 'rgba(255,255,255,0.04)',
                    color: 'rgba(255,255,255,0.95)',
                    fontSize: 12.5,
                    fontWeight: 600,
                  }}
                >
                  Ver ficha →
                </a>
              </span>
            ) : null}
          </div>
          <div className="muted hide-mobile" style={{ fontSize: 13 }}>
            {ciclista.equipo}
          </div>
        </td>
        <td className="hide-mobile tbl-cell" style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
          {flagEmoji ? (
            <span aria-label={ciclista.nacionalidad} title={ciclista.nacionalidad}>
              {flagEmoji}
            </span>
          ) : null}
        </td>
        <td className="hide-mobile tbl-cell" style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {maillotKeys.length === 0 ? <span className="muted">—</span> : null}
            {maillotKeys.map((k) => (
              <MaillotBadge key={k} maillot={k} />
            ))}
          </div>
        </td>
        <td className="hide-mobile tbl-cell" style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
          <div className="muted" style={{ fontSize: 13 }}>
            {logrosItems.length === 0 ? '—' : logrosItems.join(' · ')}
          </div>
        </td>
        <td className="tbl-cell" style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
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
              <span className="hide-mobile">{participante.avatar}</span>
              <span>{participante.nombre}</span>
            </Link>
          ) : (
            <span className="muted">—</span>
          )}
        </td>
        <td className="tbl-cell" style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
          <div style={{ fontWeight: 850 }}>{puntos}</div>
        </td>
      </tr>
      {expanded ? (
        <tr className="mobile-detail-row is-expanded">
          <td className="tbl-cell" colSpan={7} style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 8 }}>
              {flagEmoji ? `${flagEmoji} ` : ''}
              {ciclista.nacionalidad}
            </div>
            <div className="muted" style={{ fontSize: 13, marginBottom: 8 }}>
              Equipo: {ciclista.equipo}
            </div>
            <div className="muted" style={{ fontSize: 13, marginBottom: 8 }}>
              Maillots:{' '}
              <span style={{ display: 'inline-flex', gap: 8, flexWrap: 'wrap' }}>
                {maillotKeys.length === 0 ? '—' : null}
                {maillotKeys.map((k) => (
                  <MaillotBadge key={k} maillot={k} />
                ))}
              </span>
            </div>
            <div className="muted" style={{ fontSize: 13, marginBottom: 8 }}>
              Logros: {logrosItems.length === 0 ? '—' : logrosItems.join(' · ')}
            </div>
            {ciclista.link ? (
              <a
                href={ciclista.link}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '8px 10px',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.14)',
                  background: 'rgba(255,255,255,0.04)',
                  color: 'rgba(255,255,255,0.95)',
                }}
              >
                Ver ficha del corredor →
              </a>
            ) : null}
          </td>
        </tr>
      ) : null}
    </>
  );
}

