import type { Config, Ciclista, Logros, Participante } from './types';

export function getPuntosVictoriasEtapa(logros: Logros, config: Config): number {
  const victoriasReina = logros.etapa_reina ? 1 : 0;
  const victoriasNormales = Math.max(0, logros.victorias_etapa - victoriasReina);
  const p = config.puntuacion;
  return victoriasNormales * p.victoria_etapa + victoriasReina * p.victoria_etapa_reina;
}

export function getPuntosPosicionGeneral(posicion: number | null, config: Config): number {
  if (posicion == null) return 0;
  return config.puntuacion.clasificacion_general[String(posicion)] ?? 0;
}

export function computeCiclistaPuntos(ciclista: Ciclista, config: Config): number {
  const logros = ciclista.logros;
  const p = config.puntuacion;

  const calculado =
    getPuntosVictoriasEtapa(logros, config) +
    getPuntosPosicionGeneral(logros.posicion_general, config) +
    (logros.maillot_verde ? p.maillot_verde : 0) +
    (logros.maillot_polka ? p.maillot_montana : 0) +
    (logros.maillot_blanco ? p.maillot_joven : 0) +
    (logros.farolillo_rojo ? p.farolillo_rojo : 0);

  return Number.isFinite(calculado) ? calculado : 0;
}

export function computeParticipantePuntos(participante: Participante, ciclistas: Ciclista[], config: Config): number {
  const selected = new Set(participante.ciclistas_dorsales);
  let total = 0;
  for (const c of ciclistas) {
    if (selected.has(c.dorsal)) total += computeCiclistaPuntos(c, config);
  }
  return total;
}
