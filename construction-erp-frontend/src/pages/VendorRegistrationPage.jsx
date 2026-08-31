import { useMemo, useState } from 'react'
import {
  canEditRegistration,
  emptyRegistration,
  getStatusLabel,
  initialVendorRegistrations,
  licenseKinds,
  progressStatuses,
  tradeCatalog,
} from '../data/vendorRegistrations'

const clone = (value) => JSON.parse(JSON.stringify(value))
const today = new Date().toISOString().slice(0, 10)
const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'xlsx', 'docx']
const maxFileSize = 10 * 1024 * 1024

const formatNumber = (value) => {
  if (value === '' || value === null || value === undefined) return '-'
  return Number(value).toLocaleString('ko-KR')
}

const formatFileSize = (bytes) => {
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const normalizeFileName = (name) => name
  .normalize('NFKC')
  .replace(/[^0-9A-Za-z가-힣._()-]/g, '_')
  .replace(/_+/g, '_')

function Field({ label, required = false, readOnly = false, wide = false, children }) {
  return (
    <label className={`vendor-field ${wide ? 'vendor-field-wide' : ''} ${readOnly ? 'vendor-readonly' : ''}`}>
      <span>{label}{required && <em>*</em>}</span>
      {children}
    </label>
  )
}

function VendorRegistrationPage() {
  const [registrations, setRegistrations] = useState(() => clone(initialVendorRegistrations))
  const [filters, setFilters] = useState({ vendor: '', dateFrom: '2026-01-01', dateTo: today, status: '', finalReviewYn: '' })
  const [results, setResults] = useState(() => clone(initialVendorRegistrations))
  const [selectedId, setSelectedId] = useState(initialVendorRegistrations[0].id)
  const [draft, setDraft] = useState(() => clone(initialVendorRegistrations[0]))
  const [activeTab, setActiveTab] = useState('general')
  const [isNew, setIsNew] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [queryStale, setQueryStale] = useState(false)
  const [message, setMessage] = useState({ type: 'info', text: '조회 결과에서 협력업체를 선택하면 상세 정보가 표시됩니다.' })
  const [attachmentOpen, setAttachmentOpen] = useState(false)
  const [lookupTradeId, setLookupTradeId] = useState(null)

  const editable = canEditRegistration(draft)
  const statusLabel = draft ? getStatusLabel(draft.progressStatus) : ''
  const businessKey = draft
    ? `${draft.businessNumber || '사업자번호 미지정'} / ${draft.registrationDate || '-'} / ${draft.registrationSeq || '-'}`
    : '-'

  const resultSummary = useMemo(() => {
    const writing = results.filter((item) => item.progressStatus === '1010').length
    const completed = results.filter((item) => item.finalReviewYn === 'Y').length
    return { total: results.length, writing, completed }
  }, [results])

  const changeFilter = (event) => {
    const { name, value } = event.target
    setFilters((current) => ({ ...current, [name]: value }))
    setQueryStale(true)
    setResults([])
    setSelectedId(null)
    setDraft(null)
    setIsNew(false)
    setIsDirty(false)
    setMessage({ type: 'warning', text: '조회 조건이 변경되었습니다. 조회 버튼을 눌러 결과를 갱신해 주세요.' })
  }

  const search = (event) => {
    event.preventDefault()
    if (!filters.dateTo) {
      setMessage({ type: 'error', text: '등록일 종료일(To)은 필수입니다.' })
      return
    }
    if (filters.dateFrom && filters.dateFrom > filters.dateTo) {
      setMessage({ type: 'error', text: '등록일 시작일은 종료일보다 늦을 수 없습니다.' })
      return
    }

    const keyword = filters.vendor.trim().toLowerCase()
    const nextResults = registrations.filter((item) => {
      const vendorMatched = !keyword
        || item.vendorName.toLowerCase().includes(keyword)
        || item.vendorCode.toLowerCase().includes(keyword)
        || item.businessNumber.includes(keyword)
      const fromMatched = !filters.dateFrom || item.registrationDate >= filters.dateFrom
      const toMatched = item.registrationDate <= filters.dateTo
      const statusMatched = !filters.status || item.progressStatus === filters.status
      const reviewMatched = !filters.finalReviewYn || item.finalReviewYn === filters.finalReviewYn
      return vendorMatched && fromMatched && toMatched && statusMatched && reviewMatched
    })

    setResults(nextResults)
    setQueryStale(false)
    setIsDirty(false)
    setIsNew(false)
    if (nextResults.length > 0) {
      setSelectedId(nextResults[0].id)
      setDraft(clone(nextResults[0]))
      setMessage({ type: 'success', text: `${nextResults.length}건을 조회했습니다.` })
    } else {
      setSelectedId(null)
      setDraft(null)
      setMessage({ type: 'info', text: '조건에 맞는 협력업체 등록원이 없습니다.' })
    }
  }

  const selectRegistration = (registration) => {
    setSelectedId(registration.id)
    setDraft(clone(registration))
    setIsNew(false)
    setIsDirty(false)
    setActiveTab('general')
    setMessage({
      type: registration.progressStatus === '1010' ? 'success' : 'info',
      text: registration.progressStatus === '1010'
        ? '작성중인 등록원입니다. 저장 권한이 있어 수정할 수 있습니다.'
        : `${getStatusLabel(registration.progressStatus)} 단계이므로 조회 전용으로 표시됩니다.`,
    })
  }

  const startNew = () => {
    const next = emptyRegistration()
    setDraft(next)
    setSelectedId(null)
    setIsNew(true)
    setIsDirty(false)
    setActiveTab('general')
    setMessage({ type: 'info', text: '신규 등록원은 작성중(1010) 상태로 생성됩니다. 업무 키를 입력한 뒤 저장하세요.' })
  }

  const updateDraft = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }))
    setIsDirty(true)
  }

  const validateDraft = () => {
    if (!draft.businessNumber.trim() || !draft.registrationDate || !draft.registrationSeq.trim()) {
      return '사업자번호, 등록일, 등록순번은 필수입니다.'
    }
    if (!draft.vendorName.trim()) return '업체명은 필수입니다.'
    const invalidTrade = draft.trades.find((trade) => !trade.tradeName.trim())
    if (invalidTrade) return '모든 발주공종의 공종명을 선택해야 합니다.'
    const duplicate = registrations.some((item) => item.id !== draft.id
      && item.businessNumber.replace(/-/g, '') === draft.businessNumber.replace(/-/g, '')
      && item.registrationDate === draft.registrationDate
      && item.registrationSeq === draft.registrationSeq)
    if (duplicate) return '사업자번호 + 등록일 + 등록순번이 같은 등록원이 이미 있습니다.'
    return ''
  }

  const save = () => {
    if (!editable) {
      setMessage({ type: 'error', text: '작성중 상태이면서 저장 권한이 있는 등록원만 저장할 수 있습니다.' })
      return
    }
    const validationMessage = validateDraft()
    if (validationMessage) {
      setMessage({ type: 'error', text: validationMessage })
      return
    }

    const saved = clone({
      ...draft,
      id: isNew ? `VR-${draft.registrationDate.replaceAll('-', '')}-${draft.registrationSeq}` : draft.id,
      vendorCode: draft.vendorCode || `BP-${String(registrations.length + 1).padStart(4, '0')}`,
    })
    const nextRegistrations = isNew
      ? [saved, ...registrations]
      : registrations.map((item) => item.id === saved.id ? saved : item)

    setRegistrations(nextRegistrations)
    setResults((current) => {
      if (isNew) return [saved, ...current]
      return current.map((item) => item.id === saved.id ? saved : item)
    })
    setDraft(clone(saved))
    setSelectedId(saved.id)
    setIsNew(false)
    setIsDirty(false)
    setMessage({ type: 'success', text: `협력업체 등록원 ${saved.vendorName}을(를) 저장했습니다.` })
  }

  const addTrade = () => {
    if (!editable) return
    const id = `TR-NEW-${Date.now()}`
    setDraft((current) => ({
      ...current,
      trades: [...current.trades, {
        id,
        majorCode: '', majorName: '', tradeCode: '', tradeName: '', licenseKind: '',
        licenseNumber: '', acquiredDate: '', representativeYn: 'N', performanceAmount: '',
      }],
    }))
    setIsDirty(true)
    setLookupTradeId(id)
  }

  const updateTrade = (id, field, value) => {
    setDraft((current) => ({
      ...current,
      trades: current.trades.map((trade) => trade.id === id ? { ...trade, [field]: value } : trade),
    }))
    setIsDirty(true)
  }

  const chooseTrade = (catalogTrade) => {
    setDraft((current) => ({
      ...current,
      trades: current.trades.map((trade) => trade.id === lookupTradeId ? { ...trade, ...catalogTrade } : trade),
    }))
    setLookupTradeId(null)
    setIsDirty(true)
  }

  const deleteTrade = (id) => {
    if (!editable) return
    setDraft((current) => ({ ...current, trades: current.trades.filter((trade) => trade.id !== id) }))
    setIsDirty(true)
    setMessage({ type: 'warning', text: '발주공종 삭제가 저장 대기 중입니다. 저장해야 반영됩니다.' })
  }

  const uploadAttachment = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !editable) return
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!allowedExtensions.includes(extension)) {
      setMessage({ type: 'error', text: `허용되지 않는 파일 형식입니다. 허용 형식: ${allowedExtensions.join(', ')}` })
      return
    }
    if (file.size > maxFileSize) {
      setMessage({ type: 'error', text: '첨부파일은 10MB 이하만 등록할 수 있습니다.' })
      return
    }
    const attachment = {
      id: `AT-NEW-${Date.now()}`,
      fileName: normalizeFileName(file.name),
      size: file.size,
      mimeType: file.type || 'application/octet-stream',
      registeredBy: '김ERP',
      registeredAt: new Date().toLocaleString('sv-SE').slice(0, 16),
    }
    setDraft((current) => ({ ...current, attachments: [...current.attachments, attachment] }))
    setIsDirty(true)
    setMessage({ type: 'success', text: `${attachment.fileName} 파일을 저장 대기 목록에 추가했습니다.` })
  }

  const deleteAttachment = (id) => {
    if (!editable) return
    setDraft((current) => ({ ...current, attachments: current.attachments.filter((file) => file.id !== id) }))
    setIsDirty(true)
    setMessage({ type: 'warning', text: '첨부파일 삭제가 저장 대기 중입니다.' })
  }

  const showDownloadNotice = (fileName) => {
    setMessage({ type: 'info', text: `${fileName} 다운로드 요청을 확인했습니다. 실제 Oracle 연동 단계에서는 파일 API가 호출됩니다.` })
  }

  return (
    <section className="vendor-registration-page" style={{ '--module-accent': '#7b6249' }}>
      <div className="page-heading vendor-heading">
        <div>
          <p className="breadcrumb">SUBCONTRACT / PARTNER REGISTRATION</p>
          <h2>협력업체 등록원 관리</h2>
          <p>협력업체의 기본 정보, 심사 상태, 발주공종과 증빙자료를 한 화면에서 관리합니다.</p>
        </div>
        <div className="heading-actions">
          <button className="button button-secondary" type="button" onClick={startNew}>+ 신규 등록</button>
          <button className="button button-secondary" type="button" disabled={!draft} onClick={() => setAttachmentOpen(true)}>
            첨부파일 {draft ? `(${draft.attachments.length})` : ''}
          </button>
          <button className="button button-primary" type="button" disabled={!editable || !isDirty} onClick={save}>저장</button>
        </div>
      </div>

      <form className="panel vendor-query-panel" onSubmit={search}>
        <div className="vendor-query-heading">
          <div>
            <strong>조회 조건</strong>
            <span>등록일 종료일은 필수입니다.</span>
          </div>
          {queryStale && <b>재조회 필요</b>}
        </div>
        <div className="vendor-query-grid">
          <label>거래처
            <input name="vendor" value={filters.vendor} onChange={changeFilter} placeholder="업체명 · 코드 · 사업자번호" />
          </label>
          <label>등록일 From
            <input type="date" name="dateFrom" value={filters.dateFrom} onChange={changeFilter} />
          </label>
          <label>등록일 To <em>*</em>
            <input type="date" name="dateTo" value={filters.dateTo} onChange={changeFilter} required />
          </label>
          <label>심사진행상태
            <select name="status" value={filters.status} onChange={changeFilter}>
              <option value="">전체</option>
              {progressStatuses.map((status) => <option key={status.code} value={status.code}>{status.code} · {status.label}</option>)}
            </select>
          </label>
          <label>최종심사 여부
            <select name="finalReviewYn" value={filters.finalReviewYn} onChange={changeFilter}>
              <option value="">전체</option>
              <option value="Y">Y · 완료</option>
              <option value="N">N · 미완료</option>
            </select>
          </label>
          <button className="button button-primary vendor-search-button" type="submit">조회</button>
        </div>
      </form>

      {message.text && <div className={`vendor-message ${message.type}`} role="status">{message.text}</div>}

      <div className="vendor-stat-grid">
        <div><span>조회 건수</span><strong>{resultSummary.total}</strong><small>현재 조건 기준</small></div>
        <div><span>작성중</span><strong>{resultSummary.writing}</strong><small>수정 가능한 상태</small></div>
        <div><span>최종심사 완료</span><strong>{resultSummary.completed}</strong><small>조회 전용</small></div>
        <div className="vendor-policy-stat"><span>편집 정책</span><strong>1010 + 권한</strong><small>두 조건을 모두 충족</small></div>
      </div>

      <div className="vendor-master-detail">
        <aside className="panel vendor-master-panel">
          <div className="vendor-panel-title">
            <div><strong>협력업체 등록원</strong><span>{queryStale ? '조회 조건을 갱신하세요.' : `${results.length}건`}</span></div>
          </div>
          <div className="vendor-master-list">
            {results.map((registration) => (
              <button
                className={`vendor-master-item ${selectedId === registration.id ? 'selected' : ''}`}
                key={registration.id}
                type="button"
                onClick={() => selectRegistration(registration)}
              >
                <span className={`vendor-status status-${registration.progressStatus}`}>{getStatusLabel(registration.progressStatus)}</span>
                <strong>{registration.vendorName}</strong>
                <small>{registration.vendorCode} · {registration.businessNumber}</small>
                <small>{registration.registrationDate} / 순번 {registration.registrationSeq}</small>
                <i>최종심사 {registration.finalReviewYn}</i>
              </button>
            ))}
            {!results.length && (
              <div className="vendor-list-empty">
                <span>⌕</span>
                <strong>{queryStale ? '재조회가 필요합니다.' : '조회 결과가 없습니다.'}</strong>
                <small>조회 조건을 확인한 뒤 조회해 주세요.</small>
              </div>
            )}
          </div>
        </aside>

        <article className="panel vendor-detail-panel">
          {!draft ? (
            <div className="vendor-detail-empty">
              <span>BP</span>
              <h3>등록원을 선택해 주세요.</h3>
              <p>목록에서 협력업체를 선택하거나 신규 등록을 시작할 수 있습니다.</p>
            </div>
          ) : (
            <>
              <header className="vendor-detail-header">
                <div>
                  <div className="vendor-detail-title">
                    <span className={`vendor-status status-${draft.progressStatus}`}>{draft.progressStatus} · {statusLabel}</span>
                    {isDirty && <b>저장 대기</b>}
                  </div>
                  <h3>{draft.vendorName || '신규 협력업체'}</h3>
                  <p>업무 키: {businessKey}</p>
                </div>
                <div className={`vendor-permission ${editable ? 'editable' : 'readonly'}`}>
                  <strong>{editable ? '편집 가능' : '조회 전용'}</strong>
                  <small>{editable ? '작성중 · 저장권한 보유' : statusLabel === '작성중' ? '저장권한 없음' : `${statusLabel} 상태`}</small>
                </div>
              </header>

              <div className="vendor-tabs" role="tablist">
                <button type="button" className={activeTab === 'general' ? 'active' : ''} onClick={() => setActiveTab('general')}>일반정보</button>
                <button type="button" className={activeTab === 'trades' ? 'active' : ''} onClick={() => setActiveTab('trades')}>발주공종 <span>{draft.trades.length}</span></button>
              </div>

              {activeTab === 'general' ? (
                <div className="vendor-detail-body">
                  <section className="vendor-form-section">
                    <div className="vendor-section-title"><span>01</span><div><h4>등록 기본정보</h4><p>저장 후 업무 키와 거래처 식별 정보는 변경할 수 없습니다.</p></div></div>
                    <div className="vendor-form-grid three">
                      <Field label="사업자번호" required readOnly={!isNew}>
                        <input value={draft.businessNumber} disabled={!isNew} onChange={(event) => updateDraft('businessNumber', event.target.value)} placeholder="000-00-00000" />
                      </Field>
                      <Field label="등록일" required readOnly={!isNew}>
                        <input type="date" value={draft.registrationDate} disabled={!isNew} onChange={(event) => updateDraft('registrationDate', event.target.value)} />
                      </Field>
                      <Field label="등록순번" required readOnly={!isNew}>
                        <input value={draft.registrationSeq} disabled={!isNew} onChange={(event) => updateDraft('registrationSeq', event.target.value)} />
                      </Field>
                      <Field label="거래처 코드" readOnly>
                        <input value={draft.vendorCode || '저장 시 자동 부여'} disabled />
                      </Field>
                      <Field label="업체명" required readOnly={!isNew}>
                        <input value={draft.vendorName} disabled={!isNew} onChange={(event) => updateDraft('vendorName', event.target.value)} />
                      </Field>
                      <Field label="업체 구분" readOnly={!isNew}>
                        <select value={draft.vendorType} disabled={!isNew} onChange={(event) => updateDraft('vendorType', event.target.value)}>
                          <option>법인사업자</option><option>개인사업자</option><option>비영리법인</option>
                        </select>
                      </Field>
                    </div>
                  </section>

                  <section className="vendor-form-section">
                    <div className="vendor-section-title"><span>02</span><div><h4>업체 일반정보</h4><p>작성중 상태에서만 담당자가 수정할 수 있습니다.</p></div></div>
                    <div className="vendor-form-grid three">
                      <Field label="대표자명"><input value={draft.representativeName} disabled={!editable} onChange={(event) => updateDraft('representativeName', event.target.value)} /></Field>
                      <Field label="전화번호"><input value={draft.phone} disabled={!editable} onChange={(event) => updateDraft('phone', event.target.value)} /></Field>
                      <Field label="이메일"><input type="email" value={draft.email} disabled={!editable} onChange={(event) => updateDraft('email', event.target.value)} /></Field>
                      <Field label="주소" wide><input value={draft.address} disabled={!editable} onChange={(event) => updateDraft('address', event.target.value)} /></Field>
                      <Field label="설립일"><input type="date" value={draft.establishedDate} disabled={!editable} onChange={(event) => updateDraft('establishedDate', event.target.value)} /></Field>
                      <Field label="자본금(원)"><input type="number" min="0" value={draft.capital} disabled={!editable} onChange={(event) => updateDraft('capital', event.target.value)} /></Field>
                      <Field label="신용등급"><input value={draft.creditRating} disabled={!editable} onChange={(event) => updateDraft('creditRating', event.target.value)} /></Field>
                      <Field label="임직원 수"><input type="number" min="0" value={draft.employeeCount} disabled={!editable} onChange={(event) => updateDraft('employeeCount', event.target.value)} /></Field>
                      <Field label="기술인 수"><input type="number" min="0" value={draft.engineerCount} disabled={!editable} onChange={(event) => updateDraft('engineerCount', event.target.value)} /></Field>
                      <Field label="안전교육 이수"><select value={draft.safetyTrainingYn} disabled={!editable} onChange={(event) => updateDraft('safetyTrainingYn', event.target.value)}><option value="Y">Y</option><option value="N">N</option></select></Field>
                    </div>
                  </section>

                  <section className="vendor-form-section review-section">
                    <div className="vendor-section-title"><span>03</span><div><h4>심사 결과</h4><p>심사 담당 업무에서 반영되는 조회 전용 정보입니다.</p></div></div>
                    <div className="vendor-form-grid three">
                      <Field label="심사진행상태" readOnly><input value={`${draft.progressStatus} · ${statusLabel}`} disabled /></Field>
                      <Field label="최종심사 여부" readOnly><input value={draft.finalReviewYn} disabled /></Field>
                      <Field label="평가점수" readOnly><input value={draft.reviewScore ? `${draft.reviewScore}점` : '-'} disabled /></Field>
                      <Field label="평가등급" readOnly><input value={draft.reviewGrade || '-'} disabled /></Field>
                      <Field label="심사의견" readOnly wide><textarea rows="3" value={draft.reviewOpinion || '-'} disabled /></Field>
                    </div>
                  </section>
                </div>
              ) : (
                <div className="vendor-trade-area">
                  <div className="vendor-trade-toolbar">
                    <div><strong>발주공종 및 면허</strong><span>공종 선택 시 대공종이 자동으로 연결됩니다.</span></div>
                    <button className="button button-secondary" type="button" disabled={!editable} onClick={addTrade}>+ 공종 추가</button>
                  </div>
                  <div className="table-wrap">
                    <table className="vendor-trade-table">
                      <thead><tr><th>대공종</th><th>발주공종 <em>*</em></th><th>면허종류</th><th>면허번호</th><th>취득일</th><th>대표</th><th>실적금액(원)</th><th></th></tr></thead>
                      <tbody>
                        {draft.trades.map((trade) => (
                          <tr key={trade.id}>
                            <td><input value={trade.majorName ? `${trade.majorCode} · ${trade.majorName}` : ''} disabled placeholder="자동 연결" /></td>
                            <td><div className="trade-lookup-field"><input value={trade.tradeName ? `${trade.tradeCode} · ${trade.tradeName}` : ''} disabled placeholder="공종 선택 필수" /><button type="button" disabled={!editable} onClick={() => setLookupTradeId(trade.id)}>찾기</button></div></td>
                            <td><select value={trade.licenseKind} disabled={!editable} onChange={(event) => updateTrade(trade.id, 'licenseKind', event.target.value)}><option value="">선택</option>{licenseKinds.map((kind) => <option key={kind}>{kind}</option>)}</select></td>
                            <td><input value={trade.licenseNumber} disabled={!editable} onChange={(event) => updateTrade(trade.id, 'licenseNumber', event.target.value)} /></td>
                            <td><input type="date" value={trade.acquiredDate} disabled={!editable} onChange={(event) => updateTrade(trade.id, 'acquiredDate', event.target.value)} /></td>
                            <td><select value={trade.representativeYn} disabled={!editable} onChange={(event) => updateTrade(trade.id, 'representativeYn', event.target.value)}><option value="Y">Y</option><option value="N">N</option></select></td>
                            <td className="readonly-amount">{formatNumber(trade.performanceAmount)}</td>
                            <td><button className="trade-delete" type="button" disabled={!editable} onClick={() => deleteTrade(trade.id)}>삭제</button></td>
                          </tr>
                        ))}
                        {!draft.trades.length && <tr><td className="no-data" colSpan="8">등록된 발주공종이 없습니다.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                  <div className="vendor-grid-guide"><strong>저장 정책</strong><span>추가·수정·삭제 내용은 상세 저장 버튼을 눌렀을 때 함께 반영됩니다. 대공종과 실적금액은 조회 전용입니다.</span></div>
                </div>
              )}
            </>
          )}
        </article>
      </div>

      {attachmentOpen && draft && (
        <div className="vendor-modal-layer" role="dialog" aria-modal="true" aria-labelledby="attachment-title">
          <button className="vendor-modal-backdrop" type="button" onClick={() => setAttachmentOpen(false)} aria-label="첨부파일 창 닫기" />
          <div className="vendor-modal attachment-modal">
            <header><div><p>DOCUMENTS</p><h3 id="attachment-title">첨부파일 관리</h3><span>{draft.vendorName || '신규 협력업체'} · {draft.attachments.length}개</span></div><button type="button" onClick={() => setAttachmentOpen(false)}>×</button></header>
            <div className="attachment-upload-row">
              <div><strong>증빙자료 업로드</strong><span>PDF, JPG, PNG, XLSX, DOCX · 파일당 최대 10MB</span></div>
              <label className={`button button-primary ${!editable ? 'disabled' : ''}`}>파일 선택<input type="file" disabled={!editable} accept=".pdf,.jpg,.jpeg,.png,.xlsx,.docx" onChange={uploadAttachment} /></label>
            </div>
            <div className="attachment-list">
              {draft.attachments.map((file) => (
                <div className="attachment-item" key={file.id}>
                  <span className="file-icon">{file.fileName.split('.').pop()?.toUpperCase()}</span>
                  <div><strong>{file.fileName}</strong><small>{formatFileSize(file.size)} · {file.mimeType}</small><small>{file.registeredBy} · {file.registeredAt}</small></div>
                  <button type="button" onClick={() => showDownloadNotice(file.fileName)}>보기</button>
                  <button className="delete" type="button" disabled={!editable} onClick={() => deleteAttachment(file.id)}>삭제</button>
                </div>
              ))}
              {!draft.attachments.length && <div className="attachment-empty">등록된 첨부파일이 없습니다.</div>}
            </div>
            {!editable && <p className="modal-policy-note">조회 전용 상태에서는 파일 보기만 가능하며 업로드와 삭제는 제한됩니다.</p>}
          </div>
        </div>
      )}

      {lookupTradeId && (
        <div className="vendor-modal-layer" role="dialog" aria-modal="true" aria-labelledby="trade-lookup-title">
          <button className="vendor-modal-backdrop" type="button" onClick={() => setLookupTradeId(null)} aria-label="공종 찾기 창 닫기" />
          <div className="vendor-modal trade-modal">
            <header><div><p>TRADE LOOKUP</p><h3 id="trade-lookup-title">발주공종 찾기</h3><span>공종을 선택하면 대공종 코드와 명칭이 함께 입력됩니다.</span></div><button type="button" onClick={() => setLookupTradeId(null)}>×</button></header>
            <div className="trade-catalog-list">
              {tradeCatalog.map((trade) => (
                <button type="button" key={trade.tradeCode} onClick={() => chooseTrade(trade)}>
                  <span>{trade.majorCode}<small>{trade.majorName}</small></span>
                  <strong>{trade.tradeCode} · {trade.tradeName}</strong>
                  <i>선택 →</i>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default VendorRegistrationPage
