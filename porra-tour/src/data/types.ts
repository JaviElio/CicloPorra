export type RedesSociales = {
  twitter?: string;
  instagram?: string;
};

export type Logros = {
  victorias_etapa: number;
  etapa_reina: boolean;
  clasificacion_general: boolean;
  maillot_amarillo: boolean;
  maillot_verde: boolean;
  maillot_polka: boolean;
  maillot_blanco: boolean;
};

export type Ciclista = {
  dorsal: number;
  nombre: string;
  equipo: string;
  nacionalidad: string;
  participante_id: string;
  redes_sociales?: RedesSociales;
  puntos: number;
  logros: Logros;
};

export type Participante = {
  id: string;
  nombre: string;
  avatar: string;
  ciclistas_dorsales: number[];
  puntos_total: number;
};

export type Config = {
  edicion: number;
  etapa_actual: number;
  total_etapas: number;
  ultima_actualizacion: string;
  puntuacion: {
    victoria_etapa: number;
    etapa_reina: number;
    top3_etapa: number;
    clasificacion_general: number;
    maillot_amarillo_dia: number;
    maillot_verde_dia: number;
    maillot_polka_dia: number;
    maillot_blanco_dia: number;
  };
};

