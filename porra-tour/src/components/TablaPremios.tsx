import type { Config } from '../data/types';

type PremioRow = {
  categoria: string;
  puntos: number;
  nota?: string;
};

function buildPremios(config: Config): { etapas: PremioRow[]; final: PremioRow[] } {
  const p = config.puntuacion;
  const cg = p.clasificacion_general;
  const etapaReinaLabel = config.etapa_reina ? `Victoria etapa reina (etapa ${config.etapa_reina})` : 'Victoria etapa reina';

  const posiciones = Object.keys(cg)
    .map(Number)
    .sort((a, b) => a - b)
    .map((pos) => ({
      categoria: pos === 1 ? '1º general' : `${pos}º general`,
      puntos: cg[String(pos)],
    }));

  return {
    etapas: [
      { categoria: 'Victoria de etapa', puntos: p.victoria_etapa },
      { categoria: etapaReinaLabel, puntos: p.victoria_etapa_reina, nota: 'Puntúa doble' },
    ].filter((row) => row.puntos !== 0),
    final: [
      ...posiciones,
      { categoria: 'Maillot verde', puntos: p.maillot_verde, nota: 'No acumulable con el podio' },
      { categoria: 'Maillot montaña', puntos: p.maillot_montana, nota: 'No acumulable con el podio' },
      { categoria: 'Maillot joven', puntos: p.maillot_joven, nota: 'No acumulable con el podio' },
      { categoria: 'Farolillo rojo', puntos: p.farolillo_rojo, nota: 'Último clasificado' },
    ].filter((row) => row.puntos !== 0),
  };
}

function PremiosTable({ titulo, subtitulo, rows }: { titulo: string; subtitulo: string; rows: PremioRow[] }) {
  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontWeight: 800, fontSize: 15 }}>{titulo}</div>
        <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>
          {subtitulo}
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left' }}>
            <th
              style={{
                padding: '8px 10px',
                borderBottom: '1px solid rgba(255,255,255,0.10)',
                fontSize: 12.5,
                fontWeight: 750,
              }}
            >
              Categoría
            </th>
            <th
              style={{
                padding: '8px 10px',
                borderBottom: '1px solid rgba(255,255,255,0.10)',
                fontSize: 12.5,
                fontWeight: 750,
                textAlign: 'right',
                width: 72,
              }}
            >
              Puntos
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.categoria}>
              <td style={{ padding: '9px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 13.5 }}>
                {row.categoria}
                {row.nota ? (
                  <span className="muted" style={{ fontSize: 12, marginLeft: 6 }}>
                    · {row.nota}
                  </span>
                ) : null}
              </td>
              <td
                style={{
                  padding: '9px 10px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  fontSize: 13.5,
                  fontWeight: 850,
                  textAlign: 'right',
                }}
              >
                {row.puntos}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function TablaPremios({ config }: { config: Config }) {
  const { etapas, final } = buildPremios(config);

  return (
    <section className="card" style={{ padding: 16, marginTop: 20 }}>
      <h2 style={{ margin: '0 0 4px', fontSize: 18, letterSpacing: -0.2 }}>Tabla de premios</h2>
      <p className="muted" style={{ margin: '0 0 16px', fontSize: 13, lineHeight: 1.45 }}>
        Las victorias de etapa suman puntos a medida que se disputan. Maillots, clasificación general y farolillo rojo
        se aplican al terminar el tour.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
        }}
      >
        <PremiosTable titulo="Etapas" subtitulo="Durante el tour" rows={etapas} />
        <PremiosTable titulo="Al final del tour" subtitulo="Clasificación, maillots y farolillo" rows={final} />
      </div>

      <p className="muted" style={{ margin: '12px 0 0', fontSize: 12.5, lineHeight: 1.45 }}>
        Si el líder de un maillot (verde, montaña o joven) también ocupa el podio de la general (1º-3º), el premio de
        ese maillot no se otorga y pasa al siguiente clasificado de ese maillot que no esté en el podio.
      </p>
    </section>
  );
}
