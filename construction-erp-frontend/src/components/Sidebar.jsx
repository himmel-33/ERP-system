import { NavLink } from 'react-router-dom'
import { moduleNavigation } from '../data/erpModules'

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
        <nav className="sidebar-nav">
          {moduleNavigation.map((group) => <div className="nav-group" key={group.section}>
            <p className="menu-label">{group.section}</p>
            {group.items.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={onClose} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <span className="nav-icon">{item.icon}</span>{item.label}
              </NavLink>
            ))}
          </div>)}
        </nav>
        <div className="sidebar-footer">
          <span>CONSTRUCTION ERP</span>
          <strong>STUDY</strong>
        </div>
      </aside>
      {open && <button className="sidebar-overlay" type="button" onClick={onClose} aria-label="메뉴 닫기" />}
    </>
  )
}

export default Sidebar
