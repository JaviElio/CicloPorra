import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header
      className="card"
      style={{
        position: 'sticky',
        top: 12,
        zIndex: 10,
        padding: '14px 16px',
        margin: '12px auto 0',
        width: 'min(1100px, calc(100% - 32px))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 14,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          aria-hidden
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(255,193,7,0.35), rgba(229,57,53,0.25))',
            border: '1px solid rgba(255,255,255,0.16)',
            display: 'grid',
            placeItems: 'center',
            fontSize: 18,
          }}
        >
          🏆
        </div>
        <div>
          <div style={{ fontWeight: 800, letterSpacing: -0.2 }}>CicloPorra</div>
          <div className="muted" style={{ fontSize: 13 }}>
            Porra Tour de Francia
          </div>
        </div>
      </div>

      <nav style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'activeNav' : undefined)}
          style={({ isActive }) => ({
            padding: '8px 12px',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.14)',
            background: isActive ? 'rgba(255,193,7,0.18)' : 'rgba(255,255,255,0.04)',
          })}
        >
          🏆 Clasificación
        </NavLink>
        <NavLink
          to="/ciclistas"
          style={({ isActive }) => ({
            padding: '8px 12px',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.14)',
            background: isActive ? 'rgba(229,57,53,0.16)' : 'rgba(255,255,255,0.04)',
          })}
        >
          🚴 Ciclistas
        </NavLink>
        <NavLink
          to="/premios"
          style={({ isActive }) => ({
            padding: '8px 12px',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.14)',
            background: isActive ? 'rgba(76,175,80,0.16)' : 'rgba(255,255,255,0.04)',
          })}
        >
          🎖️ Premios
        </NavLink>
      </nav>
    </header>
  );
}

