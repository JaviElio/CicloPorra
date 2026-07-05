import ciclistasJson from './ciclistas.json';
import participantesJson from './participantes.json';
import configJson from './config.json';
import type { Ciclista, Config, Participante } from './types';

export type DataModel = {
  ciclistas: Ciclista[];
  participantes: Participante[];
  config: Config;
  ciclistasByDorsal: Map<number, Ciclista>;
  ciclistasByParticipante: Map<string, Ciclista[]>;
  participanteById: Map<string, Participante>;
  participanteIdByDorsal: Map<number, string>;
};

export function loadDataModel(): DataModel {
  const ciclistas = ciclistasJson as unknown as Ciclista[];
  const participantes = participantesJson as unknown as Participante[];
  const config = configJson as unknown as Config;

  const ciclistasByDorsal = new Map<number, Ciclista>();
  for (const c of ciclistas) ciclistasByDorsal.set(c.dorsal, c);

  const participanteById = new Map<string, Participante>();
  for (const p of participantes) participanteById.set(p.id, p);

  // La asignación real vive en participantes[].ciclistas_dorsales; el campo
  // ciclista.participante_id no está poblado en los datos.
  const participanteIdByDorsal = new Map<number, string>();
  for (const p of participantes) {
    for (const dorsal of p.ciclistas_dorsales) participanteIdByDorsal.set(dorsal, p.id);
  }

  const ciclistasByParticipante = new Map<string, Ciclista[]>();
  for (const c of ciclistas) {
    const participanteId = participanteIdByDorsal.get(c.dorsal);
    if (!participanteId) continue;
    const list = ciclistasByParticipante.get(participanteId) ?? [];
    list.push(c);
    ciclistasByParticipante.set(participanteId, list);
  }
  for (const [k, list] of ciclistasByParticipante.entries()) {
    list.sort((a, b) => a.dorsal - b.dorsal);
    ciclistasByParticipante.set(k, list);
  }

  return {
    ciclistas,
    participantes,
    config,
    ciclistasByDorsal,
    ciclistasByParticipante,
    participanteById,
    participanteIdByDorsal,
  };
}

