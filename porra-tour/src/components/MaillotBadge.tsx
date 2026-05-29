import type { Ciclista } from '../data/types';

type MaillotKey = 'maillot_amarillo' | 'maillot_verde' | 'maillot_polka' | 'maillot_blanco';

const maillotMeta: Record<
  MaillotKey,
  { label: string; emoji: string; background: string; border: string }
> = {
  maillot_amarillo: {
    label: 'Maillot Amarillo',
    emoji: '💛',
    background: 'rgba(255, 193, 7, 0.18)',
    border: 'rgba(255, 193, 7, 0.35)',
  },
  maillot_verde: {
    label: 'Maillot Verde',
    emoji: '💚',
    background: 'rgba(76, 175, 80, 0.16)',
    border: 'rgba(76, 175, 80, 0.33)',
  },
  maillot_polka: {
    label: 'Maillot Polka',
    emoji: '🤍',
    background: 'rgba(156, 39, 176, 0.15)',
    border: 'rgba(156, 39, 176, 0.33)',
  },
  maillot_blanco: {
    label: 'Maillot Blanco',
    emoji: '🤍',
    background: 'rgba(255, 255, 255, 0.10)',
    border: 'rgba(255, 255, 255, 0.22)',
  },
};

export default function MaillotBadge({ maillot }: { maillot: MaillotKey }) {
  const meta = maillotMeta[maillot];
  return (
    <span
      title={meta.label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 10px',
        borderRadius: 999,
        background: meta.background,
        border: `1px solid ${meta.border}`,
        fontSize: 12.5,
        whiteSpace: 'nowrap',
      }}
    >
      <span aria-hidden>{meta.emoji}</span>
      {maillot === 'maillot_polka' ? 'Montaña' : meta.label.replace('Maillot ', '')}
    </span>
  );
}

export function getMaillotBadgesFromLogros(logros: Ciclista['logros']): MaillotKey[] {
  const keys: MaillotKey[] = [];
  if (logros.maillot_amarillo) keys.push('maillot_amarillo');
  if (logros.maillot_verde) keys.push('maillot_verde');
  if (logros.maillot_polka) keys.push('maillot_polka');
  if (logros.maillot_blanco) keys.push('maillot_blanco');
  return keys;
}

