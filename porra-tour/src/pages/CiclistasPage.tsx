import { useMemo, useState } from 'react';
import { loadDataModel } from '../data/loader';
import type { Ciclista } from '../data/types';
import CiclistaRow from '../components/CiclistaRow';

const model = loadDataModel();

type SortKey = 'dorsal' | 'puntos' | 'nombre';

function includesLoose(haystack: string, needle: string) {
  return haystack.toLowerCase().includes(needle.toLowerCase().trim());
}

export function CiclistasPage() {
  const [query, setQuery] = useState('');
  const [participanteId, setParticipanteId] = useState<string>('all');
  const [nacionalidad, setNacionalidad] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('dorsal');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const participantsById = model.participanteById;

  const nationalidades = useMemo(() => {
    const set = new Set<string>();
    for (const c of model.ciclistas) set.add(c.nacionalidad);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim();
    let list: Ciclista[] = [...model.ciclistas];

    if (q) {
      list = list.filter((c) => includesLoose(c.nombre, q) || includesLoose(c.equipo, q));
    }
    if (participanteId !== 'all') {
      list = list.filter((c) => c.participante_id === participanteId);
    }
    if (nacionalidad !== 'all') {
      list = list.filter((c) => c.nacionalidad === nacionalidad);
    }

    const dir = sortDir === 'asc' ? 1 : -1;
    list.sort((a, b) => {
      if (sortKey === 'dorsal') return dir * (a.dorsal - b.dorsal);
      if (sortKey === 'puntos') return dir * (a.puntos - b.puntos);
      return dir * a.nombre.localeCompare(b.nombre);
    });

    return list;
  }, [nacionalidad, participanteId, query, sortDir, sortKey]);

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: '6px 0 6px', fontSize: 26, letterSpacing: -0.3 }}>Listado de ciclistas</h1>
          <div className="muted" style={{ fontSize: 13 }}>
            Total: {filtered.length} ciclistas
          </div>
        </div>
        <div className="muted" style={{ fontSize: 13 }}>
          Última actualización: {new Date(model.config.ultima_actualizacion).toLocaleString()}
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginTop: 14 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 12,
          }}
        >
          <div>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>
              Buscar (nombre / equipo)
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej: Pogačar, Visma…"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.14)',
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.95)',
              }}
            />
          </div>

          <div>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>
              Participante
            </div>
            <select
              value={participanteId}
              onChange={(e) => setParticipanteId(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.14)',
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.95)',
              }}
            >
              <option value="all">Todos</option>
              {Array.from(participantsById.values())
                .sort((a, b) => a.nombre.localeCompare(b.nombre))
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.avatar} {p.nombre}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>
              Nacionalidad
            </div>
            <select
              value={nacionalidad}
              onChange={(e) => setNacionalidad(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.14)',
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.95)',
              }}
            >
              <option value="all">Todas</option>
              {nationalidades.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>
              Ordenar por
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.14)',
                  background: 'rgba(255,255,255,0.04)',
                  color: 'rgba(255,255,255,0.95)',
                }}
              >
                <option value="dorsal">Dorsal</option>
                <option value="puntos">Puntos</option>
                <option value="nombre">Nombre</option>
              </select>
              <button
                onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
                style={{
                  flex: '0 0 auto',
                  padding: '10px 12px',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.14)',
                  background: 'rgba(255,255,255,0.04)',
                  color: 'rgba(255,255,255,0.95)',
                  cursor: 'pointer',
                }}
                aria-label="Cambiar dirección de orden"
              >
                {sortDir === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginTop: 14 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 860 }}>
            <thead>
              <tr style={{ textAlign: 'left' }}>
                <th style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)', fontSize: 13, fontWeight: 750 }}>
                  Dorsal
                </th>
                <th style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)', fontSize: 13, fontWeight: 750 }}>
                  Ciclista
                </th>
                <th style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)', fontSize: 13, fontWeight: 750 }}>
                  Nacionalidad
                </th>
                <th style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)', fontSize: 13, fontWeight: 750 }}>
                  Maillots
                </th>
                <th style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)', fontSize: 13, fontWeight: 750 }}>
                  Puntos
                </th>
                <th style={{ padding: '10px 8px', borderBottom: '1px solid rgba(255,255,255,0.10)', fontSize: 13, fontWeight: 750 }}>
                  Porra
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <CiclistaRow key={c.dorsal} ciclista={c} />
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="muted" style={{ padding: 14 }}>
                    Sin resultados.
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

