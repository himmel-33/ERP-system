function PlaceholderPage({ title }) {
  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="breadcrumb">ERP / {title}</p>
          <h2>{title}</h2>
        </div>
      </div>
      <div className="empty-state">
        <span className="empty-icon">⌁</span>
        <h3>추후 구현 예정</h3>
        <p>{title} 기능은 다음 개발 단계에서 제공됩니다.</p>
      </div>
    </section>
  )
}

export default PlaceholderPage
