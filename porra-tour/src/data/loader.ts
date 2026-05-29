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
};

export function loadDataModel(): DataModel {
  const ciclistas = ciclistasJson as unknown as Ciclista[];
  const participantes = participantesJson as unknown as Participante[];
  const config = configJson as unknown as Config;

  const ciclistasByDorsal = new Map<number, Ciclista>();
  for (const c of ciclistas) ciclistasByDorsal.set(c.dorsal, c);

  const ciclistasByParticipante = new Map<string, Ciclista[]>();
  for (const c of ciclistas) {
    const list = ciclistasByParticipante.get(c.participante_id) ?? [];
    list.push(c);
    ciclistasByParticipante.set(c.participante_id, list);
  }
  for (const [k, list] of ciclistasByParticipante.entries()) {
    list.sort((a, b) => a.dorsal - b.dorsal);
    ciclistasByParticipante.set(k, list);
  }

  const participanteById = new Map<string, Participante>();
  for (const p of participantes) participanteById.set(p.id, p);

  return {
    ciclistas,
    participantes,
    config,
    ciclistasByDorsal,
    ciclistasByParticipante,
    participanteById,
  };
}

