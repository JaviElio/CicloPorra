import { NavLink } from 'react-router-dom';
import logo from '../../assets/CicloPorra_blanco.svg';

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
        <img src={logo} alt="CicloPorra" style={{ height: 32, width: 'auto' }} />
      </div>

      <nav style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        <NavLink
          to="/"
          aria-label="Clasificación"
          className={({ isActive }) => (isActive ? 'activeNav' : undefined)}
          style={({ isActive }) => ({
            padding: '8px 12px',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.14)',
            background: isActive ? 'rgba(255,193,7,0.18)' : 'rgba(255,255,255,0.04)',
          })}
        >
          <span aria-hidden="true">🏆</span>
          <span className="hide-mobile"> Clasificación</span>
        </NavLink>
        <NavLink
          to="/ciclistas"
          aria-label="Ciclistas"
          style={({ isActive }) => ({
            padding: '8px 12px',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.14)',
            background: isActive ? 'rgba(229,57,53,0.16)' : 'rgba(255,255,255,0.04)',
          })}
        >
          <span aria-hidden="true">🚴</span>
          <span className="hide-mobile"> Ciclistas</span>
        </NavLink>
        <NavLink
          to="/premios"
          aria-label="Premios"
          style={({ isActive }) => ({
            padding: '8px 12px',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.14)',
            background: isActive ? 'rgba(76,175,80,0.16)' : 'rgba(255,255,255,0.04)',
          })}
        >
          <span aria-hidden="true">🎖️</span>
          <span className="hide-mobile"> Premios</span>
        </NavLink>
      </nav>
    </header>
  );
}

