import { NavLink } from 'react-router-dom'

const menuItems = [
  { to: '/dashboard', icon: '⌂', label: '대시보드' },
  { to: '/projects', icon: '▤', label: '프로젝트 관리' },
  { to: '/resources', icon: '◇', label: '자원/재료 관리' },
  { to: '/workforce', icon: '♙', label: '인력 관리' },
  { to: '/finance', icon: '₩', label: '재무/회계' },
]

function Sidebar({ open, onClose }) {
  return (
    <>
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <span className="brand-mark">CE</span>
          <div>
            <strong>CONSTRUCT</strong>
            <small>Enterprise Resource Planning</small>
          </div>
        </div>
        <p className="menu-label">WORKSPACE</p>
        <nav>
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span>PROJECT SERVICE</span>
          <strong>v1.0</strong>
        </div>
      </aside>
      {open && <button className="sidebar-overlay" type="button" onClick={onClose} aria-label="메뉴 닫기" />}
    </>
  )
}

export default Sidebar
