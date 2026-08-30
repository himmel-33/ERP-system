import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { erpModules } from '../data/erpModules'

const blankRecord = (fields) => Object.fromEntries(fields.map((field) => [field, '']))

function ErpModuleWorkspace({ moduleKey }) {
  const module = erpModules[moduleKey] || erpModules.common
  const [activeTab, setActiveTab] = useState(0)
  const [rows, setRows] = useState(module.rows)
  const [query, setQuery] = useState('')
  const [site, setSite] = useState('전체 현장')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [record, setRecord] = useState(blankRecord(module.fields))
  const [notice, setNotice] = useState('')

  const filteredRows = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return rows
    return rows.filter((row) => row.some((cell) => String(cell).toLowerCase().includes(keyword)))
  }, [query, rows])

  const openCreate = () => {
    setEditingIndex(null)
    setRecord(blankRecord(module.fields))
    setDrawerOpen(true)
  }

  const openEdit = (index) => {
    setEditingIndex(index)
    setRecord(Object.fromEntries(module.fields.map((field, fieldIndex) => [field, rows[index][fieldIndex]])))
    setDrawerOpen(true)
  }

  const saveRecord = (event) => {
    event.preventDefault()
    const nextRow = module.fields.map((field) => record[field] || '-')
    setRows((current) => editingIndex === null
      ? [nextRow, ...current]
      : current.map((row, index) => index === editingIndex ? nextRow : row))
    setNotice(editingIndex === null ? '신규 항목을 임시 등록했습니다.' : '변경사항을 임시 저장했습니다.')
    setDrawerOpen(false)
  }

  const removeRow = (index) => {
    if (!window.confirm('선택한 항목을 삭제하시겠습니까?')) return
    setRows((current) => current.filter((_, rowIndex) => rowIndex !== index))
    setNotice('선택한 항목을 삭제했습니다.')
  }

  const changeTab = (index) => {
    setActiveTab(index)
    setNotice(`${module.tabs[index]} 화면으로 전환했습니다. 현재는 학습용 공통 Grid를 사용합니다.`)
  }

  return (
    <section className="erp-module" style={{ '--module-accent': module.accent }}>
      <div className="page-heading erp-page-heading">
        <div>
          <p className="breadcrumb">CONSTRUCTION ERP / {module.title}</p>
          <h2>{module.title} 관리</h2>
          <p>{module.description}</p>
        </div>
        <div className="heading-actions">
          <button className="button button-secondary" type="button" onClick={() => setNotice('현재 조회 결과를 엑셀로 내보내는 기능은 백엔드 연동 단계에서 구현합니다.')}>엑셀 다운로드</button>
          <button className="button button-primary" type="button" onClick={openCreate}>+ 신규 등록</button>
        </div>
      </div>

      <div className="module-tabbar" role="tablist" aria-label={`${module.title} 업무 메뉴`}>
        {module.tabs.map((tab, index) => (
          <button key={tab} type="button" role="tab" aria-selected={activeTab === index} className={activeTab === index ? 'active' : ''} onClick={() => changeTab(index)}>
            {tab}
          </button>
        ))}
      </div>

      <div className="metric-grid module-metrics">
        {module.metrics.map(([label, value, note], index) => (
          <article className={`metric-card ${index === 0 ? 'module-highlight' : ''}`} key={label}>
            <span>{label}</span><strong>{value}</strong><small>{note}</small>
          </article>
        ))}
      </div>

      {notice && <div className="alert module-notice"><span>{notice}</span><button type="button" onClick={() => setNotice('')}>닫기</button></div>}

      <div className="panel erp-work-panel">
        <div className="erp-query-area">
          <div className="query-heading">
            <div><h3>{module.tabs[activeTab]}</h3><p>조회 조건을 입력하고 업무 데이터를 확인하세요.</p></div>
            <span className="result-count">{filteredRows.length}건</span>
          </div>
          <div className="query-grid">
            <label>기준 기간<input type="month" defaultValue="2026-08" /></label>
            <label>현장<select value={site} onChange={(event) => setSite(event.target.value)}><option>전체 현장</option><option>세종 스마트시티</option><option>인천 물류센터</option><option>부산 해안도로</option></select></label>
            <label className="query-search">통합 검색<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="코드, 명칭, 상태 검색" /></label>
            <button className="button button-primary query-button" type="button">조회</button>
          </div>
        </div>

        <div className="grid-toolbar">
          <div><strong>{module.tabs[activeTab]} 목록</strong><span>마지막 조회 2026-08-30 09:30</span></div>
          <div className="grid-toolbar-actions"><button type="button" onClick={() => setQuery('')}>조건 초기화</button><button type="button" onClick={openCreate}>행 추가</button></div>
        </div>
        <div className="table-wrap erp-grid-wrap">
          <table className="erp-grid">
            <thead><tr><th className="check-column"><input type="checkbox" aria-label="전체 선택" /></th>{module.columns.map((column) => <th key={column}>{column}</th>)}<th>관리</th></tr></thead>
            <tbody>
              {filteredRows.map((row, index) => (
                <tr key={`${row[0]}-${index}`}>
                  <td className="check-column"><input type="checkbox" aria-label={`${row[0]} 선택`} /></td>
                  {row.map((cell, cellIndex) => <td key={`${cellIndex}-${cell}`} className={cellIndex === row.length - 1 ? 'status-cell' : ''}>{cell}</td>)}
                  <td><div className="table-actions"><button type="button" onClick={() => openEdit(rows.indexOf(row))}>수정</button><button type="button" onClick={() => removeRow(rows.indexOf(row))}>삭제</button></div></td>
                </tr>
              ))}
              {!filteredRows.length && <tr><td colSpan={module.columns.length + 2} className="no-data">조회 조건에 해당하는 데이터가 없습니다.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="grid-footer"><span>총 {filteredRows.length}건 · 화면 표시 {filteredRows.length}건</span><div className="pagination"><button disabled>‹</button><button className="active">1</button><button disabled>›</button></div></div>
      </div>

      {drawerOpen && (
        <div className="drawer-layer" role="presentation">
          <button className="drawer-backdrop" type="button" onClick={() => setDrawerOpen(false)} aria-label="등록 화면 닫기" />
          <aside className="record-drawer" role="dialog" aria-modal="true" aria-label={`${module.title} 항목 등록`}>
            <div className="drawer-header"><div><p>{module.title} / {module.tabs[activeTab]}</p><h3>{editingIndex === null ? '신규 항목 등록' : '항목 수정'}</h3></div><button type="button" onClick={() => setDrawerOpen(false)}>×</button></div>
            <form onSubmit={saveRecord}>
              <div className="drawer-fields">
                {module.fields.map((field, index) => <label key={field}>{field}{index < 2 && <em>*</em>}<input value={record[field]} required={index < 2} onChange={(event) => setRecord((current) => ({ ...current, [field]: event.target.value }))} placeholder={`${field} 입력`} /></label>)}
              </div>
              <div className="drawer-guide"><strong>학습용 화면 안내</strong><p>현재 입력 내용은 브라우저 메모리에만 반영됩니다. 각 도메인 백엔드가 추가되면 동일 UI를 REST API와 연결합니다.</p></div>
              <div className="drawer-actions"><button className="button button-secondary" type="button" onClick={() => setDrawerOpen(false)}>취소</button><button className="button button-primary" type="submit">{editingIndex === null ? '등록' : '저장'}</button></div>
            </form>
          </aside>
        </div>
      )}
    </section>
  )
}

function ErpModulePage() {
  const { moduleKey } = useParams()
  return <ErpModuleWorkspace key={moduleKey} moduleKey={moduleKey} />
}

export default ErpModulePage
