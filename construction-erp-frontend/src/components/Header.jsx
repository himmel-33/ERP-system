import { useLocation } from 'react-router-dom'
import { erpModules } from '../data/erpModules'

function Header({ onMenuClick }) {
  const location = useLocation()
  const moduleKey = location.pathname.split('/')[2]
  const title = location.pathname.startsWith('/projects')
    ? '프로젝트 운영 센터'
    : location.pathname === '/dashboard'
      ? '통합 업무 센터'
      : erpModules[moduleKey]
        ? `${erpModules[moduleKey].title} 업무 센터`
        : 'Construction ERP'
  return (
    <header className="top-header">
      <button className="menu-toggle" type="button" onClick={onMenuClick} aria-label="메뉴 열기">
        ☰
      </button>
      <div>
        <p className="header-eyebrow">CONSTRUCTION ERP</p>
        <h1>{title}</h1>
      </div>
      <div className="header-profile">
        <span className="status-dot" />
        <div>
          <strong>ERP 관리자</strong>
          <small>시스템 정상</small>
        </div>
      </div>
    </header>
  )
}

export default Header
