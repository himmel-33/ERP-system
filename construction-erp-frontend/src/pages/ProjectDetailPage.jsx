import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteProject, getProject } from '../api/projects'
import { getApiErrorMessage } from '../api/client'
import LoadingState from '../components/LoadingState'

const formatCurrency = (value) => value == null ? '-' : new Intl.NumberFormat('ko-KR', {
  style: 'currency', currency: 'KRW', maximumFractionDigits: 0,
}).format(value)

const formatDateTime = (value) => value ? new Intl.DateTimeFormat('ko-KR', {
  dateStyle: 'medium', timeStyle: 'short',
}).format(new Date(value)) : '-'

function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setProject(await getProject(id))
      } catch (requestError) {
        setError(getApiErrorMessage(requestError))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm(`“${project.name}” 프로젝트를 삭제하시겠습니까?`)) return
    setDeleting(true)
    try {
      await deleteProject(id)
      navigate('/projects', { replace: true })
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
      setDeleting(false)
    }
  }

  if (loading) return <LoadingState message="프로젝트 상세 정보를 불러오는 중입니다." />
  if (!project) return <div className="alert error-alert">{error || '프로젝트를 찾을 수 없습니다.'} <Link to="/projects">목록으로</Link></div>

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="breadcrumb">프로젝트 관리 / 상세</p>
          <div className="title-with-status"><h2>{project.name}</h2><span className={`status-badge status-${project.status?.toLowerCase()}`}>{project.status}</span></div>
          <p>{project.location || '위치 미지정'} · 프로젝트 ID {project.id}</p>
        </div>
        <div className="heading-actions">
          <Link className="button button-secondary" to="/projects">목록</Link>
          <Link className="button button-primary" to={`/projects/${id}/edit`}>수정</Link>
          <button className="button button-danger" type="button" onClick={handleDelete} disabled={deleting}>{deleting ? '삭제 중' : '삭제'}</button>
        </div>
      </div>
      {error && <div className="alert error-alert">{error}</div>}

      <div className="detail-layout">
        <article className="panel detail-main">
          <div className="detail-section">
            <p className="detail-label">프로젝트 설명</p>
            <p className="description-text">{project.description || '등록된 설명이 없습니다.'}</p>
          </div>
          <div className="detail-grid">
            <div><p className="detail-label">현장 위치</p><strong>{project.location || '-'}</strong></div>
            <div><p className="detail-label">총 계획 예산</p><strong>{formatCurrency(project.budget)}</strong></div>
            <div><p className="detail-label">프로젝트 시작일</p><strong>{project.startDate || '-'}</strong></div>
            <div><p className="detail-label">프로젝트 종료일</p><strong>{project.endDate || '-'}</strong></div>
          </div>
        </article>
        <aside className="panel detail-side">
          <h3>관리 정보</h3>
          <div><p className="detail-label">프로젝트 관리자 ID</p><strong className="break-text">{project.projectManagerId || '미지정'}</strong></div>
          <div><p className="detail-label">등록 일시</p><strong>{formatDateTime(project.createdAt)}</strong></div>
          <div><p className="detail-label">최근 수정</p><strong>{formatDateTime(project.updatedAt)}</strong></div>
        </aside>
      </div>
    </section>
  )
}

export default ProjectDetailPage
