import { Fragment, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { loadDataModel } from '../data/loader';
import { computeParticipantePuntos, computeCiclistaPuntos } from '../data/scoring';
import MaillotBadge, { getMaillotBadgesFromLogros } from '../components/MaillotBadge';
import { getFlagEmojiFromNacionalidad } from '../data/flagEmoji';
import grupetasJson from '../data/grupetas.json';

const model = loadDataModel();

const grupetaInicialDorsales = new Map<string, Set<number>>(
  grupetasJson.grupetas.map((g) => [g.participante_id, new Set(g.dorsales)]),
);

export function ParticipantePage() {
  const { id } = useParams<'id'>();
  const [expandedDorsales, setExpandedDorsales] = useState<Set<number>>(new Set());
  if (!id) return null;

  const participante = model.participanteById.get(id);
  const ciclistasByDorsal = model.ciclistasByDorsal;

  if (!participante) {
    return (
      <section>
        <h1 style={{ margin: '6px 0 10px', fontSize: 22 }}>Participante no encontrado</h1>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            padding: '10px 12px',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.14)',
            background: 'rgba(255,255,255,0.04)',
          }}
        >
          Volver a Clasificación
        </Link>
      </section>
    );
  }

  const puntosTotales = computeParticipantePuntos(participante, model.ciclistas, model.config);

  const ciclistasSeleccionados = participante.ciclistas_dorsales
    .map((dorsal) => ciclistasByDorsal.get(dorsal))
    .filter((x): x is NonNullable<typeof x> => Boolean(x))
    .sort((a, b) => a.dorsal - b.dorsal);

  const dorsalesGrupetaInicial = grupetaInicialDorsales.get(participante.id) ?? new Set<number>();

  function toggleExpanded(dorsal: number) {
    setExpandedDorsales((prev) => {
      const next = new Set(prev);
      if (next.has(dorsal)) next.delete(dorsal);
      else next.add(dorsal);
      return next;
    });
  }

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: '6px 0 6px', fontSize: 26, letterSpacing: -0.3 }}>
            {participante.avatar} {participante.nombre}
          </h1>
          <div className="muted" style={{ fontSize: 13 }}>
            Puntos totales: <b style={{ color: 'rgba(255,255,255,0.95)' }}>{puntosTotales}</b>
          </div>
        </div>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            padding: '10px 12px',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.14)',
            background: 'rgba(255,255,255,0.04)',
          }}
        >
          ← Volver a Clasificación
        </Link>
      </div>

      <div className="card" style={{ padding: 16, marginTop: 14 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
            <thead>
              <tr style={{ textAlign: 'left' }}>
                <th className="tbl-cell" style={{ borderBottom: '1px solid rgba(255,255,255,0.10)', fontSize: 13, fontWeight: 750 }}>
                  #
                </th>
                <th className="tbl-cell" style={{ borderBottom: '1px solid rgba(255,255,255,0.10)', fontSize: 13, fontWeight: 750 }}>
                  Ciclista
                </th>
                <th className="hide-mobile tbl-cell" style={{ borderBottom: '1px solid rgba(255,255,255,0.10)', fontSize: 13, fontWeight: 750 }}>
                  Maillots
                </th>
                <th className="tbl-cell" style={{ borderBottom: '1px solid rgba(255,255,255,0.10)', fontSize: 13, fontWeight: 750 }}>
                  Puntos
                </th>
                <th className="hide-mobile tbl-cell" style={{ borderBottom: '1px solid rgba(255,255,255,0.10)', fontSize: 13, fontWeight: 750 }}>
                  Logros (resumen)
                </th>
              </tr>
            </thead>
            <tbody>
              {ciclistasSeleccionados.map((c) => {
                const maillotKeys = getMaillotBadgesFromLogros(c.logros);
                const puntos = computeCiclistaPuntos(c, model.config);
                const esDeGrupetaInicial = dorsalesGrupetaInicial.has(c.dorsal);
                const isExpanded = expandedDorsales.has(c.dorsal);
                const flagEmoji = getFlagEmojiFromNacionalidad(c.nacionalidad);
                const logrosResumen = (
                  <>
                    {c.logros.victorias_etapa > 0 ? `Victorias (${c.logros.victorias_etapa})` : '—'}
                    {c.logros.etapa_reina ? ' · Etapa reina' : ''}
                    {c.logros.posicion_general != null ? ` · CG ${c.logros.posicion_general}º` : ''}
                    {c.logros.farolillo_rojo ? ' · Farolillo' : ''}
                  </>
                );
                return (
                  <Fragment key={c.dorsal}>
                    <tr
                      className="row-clickable"
                      onClick={() => toggleExpanded(c.dorsal)}
                      style={esDeGrupetaInicial ? { background: 'rgba(255, 193, 7, 0.12)' } : undefined}
                    >
                      <td className="tbl-cell" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{c.dorsal}</td>
                      <td className="tbl-cell" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ fontWeight: 800 }}>
                          {c.nombre}
                          <span className="show-mobile muted" style={{ marginLeft: 8, fontSize: 12 }}>
                            {isExpanded ? '▾' : '▸'}
                          </span>
                        </div>
                        <div className="muted hide-mobile" style={{ fontSize: 13 }}>
                          {c.equipo}
                        </div>
                        <div className="muted hide-mobile" style={{ fontSize: 13 }}>
                          {c.nacionalidad}
                        </div>
                      </td>
                      <td className="hide-mobile tbl-cell" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {maillotKeys.length === 0 ? <span className="muted">—</span> : null}
                          {maillotKeys.map((k) => (
                            <MaillotBadge key={k} maillot={k} />
                          ))}
                        </div>
                      </td>
                      <td className="tbl-cell" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ fontWeight: 900 }}>{puntos}</div>
                      </td>
                      <td className="hide-mobile tbl-cell" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="muted" style={{ fontSize: 13 }}>
                          {logrosResumen}
                        </div>
                      </td>
                    </tr>
                    {isExpanded ? (
                      <tr className="mobile-detail-row is-expanded">
                        <td className="tbl-cell" colSpan={5} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                          <div className="muted" style={{ fontSize: 13, marginBottom: 8 }}>
                            {flagEmoji ? `${flagEmoji} ` : ''}
                            {c.nacionalidad}
                          </div>
                          <div className="muted" style={{ fontSize: 13, marginBottom: 8 }}>
                            Equipo: {c.equipo}
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
                            Logros: {logrosResumen}
                          </div>
                          {c.link ? (
                            <a
                              href={c.link}
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
                  </Fragment>
                );
              })}
              {ciclistasSeleccionados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="muted" style={{ padding: 14 }}>
                    No hay ciclistas asignados.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

