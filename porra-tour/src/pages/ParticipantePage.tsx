import { Link, useParams } from 'react-router-dom';
import { loadDataModel } from '../data/loader';
import { computeParticipantePuntos, computeCiclistaPuntos } from '../data/scoring';
import MaillotBadge, { getMaillotBadgesFromLogros } from '../components/MaillotBadge';

const model = loadDataModel();

export function ParticipantePage() {
  const { id } = useParams<'id'>();
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
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
            <thead>
              <tr style={{ textAlign: 'left' }}>
                <th style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)', fontSize: 13, fontWeight: 750 }}>
                  Dorsal
                </th>
                <th style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)', fontSize: 13, fontWeight: 750 }}>
                  Ciclista
                </th>
                <th style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)', fontSize: 13, fontWeight: 750 }}>
                  Maillots
                </th>
                <th style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)', fontSize: 13, fontWeight: 750 }}>
                  Puntos
                </th>
                <th style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)', fontSize: 13, fontWeight: 750 }}>
                  Logros (resumen)
                </th>
              </tr>
            </thead>
            <tbody>
              {ciclistasSeleccionados.map((c) => {
                const maillotKeys = getMaillotBadgesFromLogros(c.logros);
                const puntos = computeCiclistaPuntos(c, model.config);
                return (
                  <tr key={c.dorsal}>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{c.dorsal}</td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontWeight: 800 }}>{c.nombre}</div>
                      <div className="muted" style={{ fontSize: 13 }}>
                        {c.equipo}
                      </div>
                      <div className="muted" style={{ fontSize: 13 }}>
                        {c.nacionalidad}
                      </div>
                    </td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {maillotKeys.length === 0 ? <span className="muted">—</span> : null}
                        {maillotKeys.map((k) => (
                          <MaillotBadge key={k} maillot={k} />
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ fontWeight: 900 }}>{puntos}</div>
                    </td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <div className="muted" style={{ fontSize: 13 }}>
                        {c.logros.victorias_etapa > 0 ? `Victorias (${c.logros.victorias_etapa})` : '—'}
                        {c.logros.etapa_reina ? ' · Etapa reina' : ''}
                        {c.logros.clasificacion_general ? ' · CG' : ''}
                      </div>
                    </td>
                  </tr>
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

