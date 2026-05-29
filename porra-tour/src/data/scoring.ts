import type { Config, Ciclista, Participante } from './types';

export function getMaillotKeysFromLogros(logros: Ciclista['logros']): Array<'maillot_amarillo' | 'maillot_verde' | 'maillot_polka' | 'maillot_blanco'> {
  const keys: Array<'maillot_amarillo' | 'maillot_verde' | 'maillot_polka' | 'maillot_blanco'> = [];
  if (logros.maillot_amarillo) keys.push('maillot_amarillo');
  if (logros.maillot_verde) keys.push('maillot_verde');
  if (logros.maillot_polka) keys.push('maillot_polka');
  if (logros.maillot_blanco) keys.push('maillot_blanco');
  return keys;
}

export function computeCiclistaPuntos(ciclista: Ciclista, config: Config): number {
  const p = ciclista.puntos;

  const logros = ciclista.logros;
  const puntuacion = config.puntuacion;

  const calculado =
    logros.victorias_etapa * puntuacion.victoria_etapa +
    (logros.etapa_reina ? puntuacion.etapa_reina : 0) +
    (logros.clasificacion_general ? puntuacion.clasificacion_general : 0) +
    (logros.maillot_amarillo ? puntuacion.maillot_amarillo_dia : 0) +
    (logros.maillot_verde ? puntuacion.maillot_verde_dia : 0) +
    (logros.maillot_polka ? puntuacion.maillot_polka_dia : 0) +
    (logros.maillot_blanco ? puntuacion.maillot_blanco_dia : 0);

  // Si el JSON trae una cifra explícita, suele ser el “resultado final”;
  // aun así, por transparencia preferimos usar el cálculo cuando exista `logros`.
  return Number.isFinite(calculado) ? calculado : p;
}

export function computeParticipantePuntos(participante: Participante, ciclistas: Ciclista[], config: Config): number {
  const selected = new Set(participante.ciclistas_dorsales);
  let total = 0;
  for (const c of ciclistas) {
    if (selected.has(c.dorsal)) total += computeCiclistaPuntos(c, config);
  }
  return total;
}

