import { NavLink } from 'react-router-dom';
import logo from '../../assets/CicloPorra_blanco.svg';

export default function Header() {
  return (
    <header
      className="card app-header"
      style={{
        position: 'sticky',
        top: 12,
        zIndex: 10,
        width: 'min(1100px, calc(100% - 32px))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img className="header-logo" src={logo} alt="CicloPorra" />
      </div>

      <nav className="app-nav" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        <NavLink
          to="/"
          aria-label="Clasificación"
          className={({ isActive }) => `nav-link${isActive ? ' activeNav' : ''}`}
          style={({ isActive }) => ({
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
          className="nav-link"
          style={({ isActive }) => ({
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
          className="nav-link"
          style={({ isActive }) => ({
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

