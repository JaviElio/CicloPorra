import { loadDataModel } from '../data/loader';
import TablaPremios from '../components/TablaPremios';

const model = loadDataModel();

export function PremiosPage() {
  return (
    <section>
      <div>
        <h1 style={{ margin: '6px 0 6px', fontSize: 26, letterSpacing: -0.3 }}>Tabla de premios</h1>
        <div className="muted" style={{ fontSize: 13 }}>
          Sistema de puntuación - Edición {model.config.edicion}
        </div>
      </div>

      <TablaPremios config={model.config} />
    </section>
  );
}
