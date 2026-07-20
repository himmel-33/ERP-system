import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteProject, getProjects } from '../api/projects'
import { getApiErrorMessage } from '../api/client'
import LoadingState from '../components/LoadingState'

const currencyFormatter = new Intl.NumberFormat('ko-KR', {
  style: 'currency',
  currency: 'KRW',
  maximumFractionDigits: 0,
})

function ProjectListPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const loadProjects = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setProjects(await getProjects())
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  const filteredProjects = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return projects
    return projects.filter((project) =>
      [project.name, project.location, project.status].some((value) =>
        value?.toLowerCase().includes(keyword),
      ),
    )
  }, [projects, search])

  const totalBudget = useMemo(
    () => projects.reduce((sum, project) => sum + Number(project.budget || 0), 0),
    [projects],
  )

  const handleDelete = async (project) => {
    if (!window.confirm(`“${project.name}” 프로젝트를 삭제하시겠습니까?`)) return
    setDeletingId(project.id)
    setError('')
    try {
      await deleteProject(project.id)
      setProjects((current) => current.filter((item) => item.id !== project.id))
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return <LoadingState message="프로젝트 목록을 불러오는 중입니다." />

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="breadcrumb">ERP / 프로젝트 관리</p>
          <h2>프로젝트 관리</h2>
          <p>현장별 일정과 예산, 진행 상태를 한곳에서 관리합니다.</p>
        </div>
        <Link className="button button-primary" to="/projects/new">+ 새 프로젝트</Link>
      </div>

      <div className="metric-grid">
        <article className="metric-card">
          <span>전체 프로젝트</span>
          <strong>{projects.length}</strong>
          <small>등록된 건설 프로젝트</small>
        </article>
        <article className="metric-card accent">
          <span>진행 중</span>
          <strong>{projects.filter((project) => project.status === 'IN_PROGRESS').length}</strong>
          <small>현재 수행 중인 현장</small>
        </article>
        <article className="metric-card">
          <span>총 계획 예산</span>
          <strong className="budget-value">{currencyFormatter.format(totalBudget)}</strong>
          <small>전체 프로젝트 합산</small>
        </article>
      </div>

      <div className="panel">
        <div className="panel-toolbar">
          <div>
            <h3>프로젝트 목록</h3>
            <p>총 {filteredProjects.length}개 항목</p>
          </div>
          <input
            className="search-input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="프로젝트명, 위치, 상태 검색"
            aria-label="프로젝트 검색"
          />
        </div>
        {error && <div className="alert error-alert">{error}<button onClick={loadProjects}>다시 시도</button></div>}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>프로젝트명</th><th>위치</th><th>시작일</th><th>종료일</th><th>예산</th><th>상태</th><th>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id}>
                  <td><strong>{project.name}</strong><small className="table-subtext">{project.id.slice(0, 8)}</small></td>
                  <td>{project.location || '-'}</td>
                  <td>{project.startDate || '-'}</td>
                  <td>{project.endDate || '-'}</td>
                  <td>{project.budget == null ? '-' : currencyFormatter.format(project.budget)}</td>
                  <td><span className={`status-badge status-${project.status?.toLowerCase()}`}>{project.status || 'PLANNING'}</span></td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/projects/${project.id}`}>상세</Link>
                      <Link to={`/projects/${project.id}/edit`}>수정</Link>
                      <button type="button" onClick={() => handleDelete(project)} disabled={deletingId === project.id}>
                        {deletingId === project.id ? '삭제 중' : '삭제'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filteredProjects.length && (
                <tr><td colSpan="7" className="no-data">표시할 프로젝트가 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default ProjectListPage
