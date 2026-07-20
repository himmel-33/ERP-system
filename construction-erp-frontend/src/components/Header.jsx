function Header({ onMenuClick }) {
  return (
    <header className="top-header">
      <button className="menu-toggle" type="button" onClick={onMenuClick} aria-label="메뉴 열기">
        ☰
      </button>
      <div>
        <p className="header-eyebrow">CONSTRUCTION ERP</p>
        <h1>프로젝트 운영 센터</h1>
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
