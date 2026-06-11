import { loadDataModel } from '../data/loader';
import { computeParticipantePuntos } from '../data/scoring';
import ClasificacionCard from '../components/ClasificacionCard';

const model = loadDataModel();

export function ClasificacionPage() {
  const participantesOrdenados = [...model.participantes]
    .map((p) => ({
      ...p,
      puntos_total: computeParticipantePuntos(p, model.ciclistas, model.config),
    }))
    .sort((a, b) => (b.puntos_total - a.puntos_total) || a.nombre.localeCompare(b.nombre));

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: '6px 0 6px', fontSize: 26, letterSpacing: -0.3 }}>Clasificación general</h1>
          <div className="muted" style={{ fontSize: 13 }}>
            Edición {model.config.edicion} · Etapa {model.config.etapa_actual}/{model.config.total_etapas}
          </div>
        </div>
        <div className="muted" style={{ fontSize: 13 }}>
          Última actualización: {new Date(model.config.ultima_actualizacion).toLocaleString()}
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 12,
        }}
      >
        {participantesOrdenados.map((p, idx) => (
          <ClasificacionCard key={p.id} participante={p} posicion={idx + 1} />
        ))}
      </div>
    </section>
  );
}

