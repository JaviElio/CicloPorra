const flagByCountryNameEs: Record<string, string> = {
  España: '🇪🇸',
  Eslovenia: '🇸🇮',
  Dinamarca: '🇩🇰',
  Bélgica: '🇧🇪',
  Francia: '🇫🇷',
  Italia: '🇮🇹',
  PaísesBajos: '🇳🇱',
  'Países Bajos': '🇳🇱',
  Alemania: '🇩🇪',
  ReinoUnido: '🇬🇧',
  'Reino Unido': '🇬🇧',
  Portugal: '🇵🇹',
  EstadosUnidos: '🇺🇸',
  'Estados Unidos': '🇺🇸',
};

export function getFlagEmojiFromNacionalidad(nacionalidad: string): string {
  const trimmed = nacionalidad.trim();
  return flagByCountryNameEs[trimmed] ?? '🏳️';
}

