export type RedesSociales = {
  twitter?: string;
  instagram?: string;
};

export type Logros = {
  victorias_etapa: number;
  etapa_reina: boolean;
  posicion_general: number | null;
  farolillo_rojo: boolean;
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
    victoria_etapa_reina: number;
    maillot_verde: number;
    maillot_montana: number;
    maillot_joven: number;
    farolillo_rojo: number;
    clasificacion_general: Record<string, number>;
  };
};
