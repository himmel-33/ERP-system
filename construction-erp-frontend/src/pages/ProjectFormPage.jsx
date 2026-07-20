import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createProject, getProject, updateProject } from '../api/projects'
import { getApiErrorMessage } from '../api/client'
import LoadingState from '../components/LoadingState'

const initialForm = {
  name: '', description: '', location: '', startDate: '', endDate: '',
  budget: '', status: 'PLANNING', projectManagerId: '',
}

function ProjectFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editing = Boolean(id)
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(editing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!editing) return
    const load = async () => {
      try {
        const project = await getProject(id)
        setForm({
          name: project.name || '', description: project.description || '', location: project.location || '',
          startDate: project.startDate || '', endDate: project.endDate || '', budget: project.budget ?? '',
          status: project.status || 'PLANNING', projectManagerId: project.projectManagerId || '',
        })
      } catch (requestError) {
        setError(getApiErrorMessage(requestError))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [editing, id])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (form.endDate && form.startDate && form.endDate < form.startDate) {
      setError('종료일은 시작일보다 빠를 수 없습니다.')
      return
    }
    setSaving(true)
    const payload = {
      ...form,
      budget: form.budget === '' ? null : Number(form.budget),
      projectManagerId: form.projectManagerId || null,
      startDate: form.startDate || null,
      endDate: form.endDate || null,
    }
    try {
      const saved = editing ? await updateProject(id, payload) : await createProject(payload)
      navigate(`/projects/${saved.id}`, { replace: true })
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingState message="프로젝트 정보를 불러오는 중입니다." />

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="breadcrumb">프로젝트 관리 / {editing ? '프로젝트 수정' : '프로젝트 등록'}</p>
          <h2>{editing ? '프로젝트 수정' : '새 프로젝트 등록'}</h2>
          <p>현장 운영에 필요한 기본 정보와 예산을 입력합니다.</p>
        </div>
        <Link className="button button-secondary" to={editing ? `/projects/${id}` : '/projects'}>취소</Link>
      </div>

      <form className="panel project-form" onSubmit={handleSubmit}>
        {error && <div className="alert error-alert form-alert">{error}</div>}
        <div className="form-section-title"><span>01</span><div><h3>기본 정보</h3><p>프로젝트 식별에 필요한 정보를 입력하세요.</p></div></div>
        <div className="form-grid">
          <label className="field field-wide">프로젝트명 <em>*</em>
            <input name="name" value={form.name} onChange={handleChange} required maxLength="255" placeholder="예: 강남 복합문화센터 신축" />
          </label>
          <label className="field">위치
            <input name="location" value={form.location} onChange={handleChange} maxLength="255" placeholder="서울특별시 강남구" />
          </label>
          <label className="field">상태
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="PLANNING">PLANNING · 계획</option>
              <option value="IN_PROGRESS">IN_PROGRESS · 진행 중</option>
              <option value="ON_HOLD">ON_HOLD · 보류</option>
              <option value="COMPLETED">COMPLETED · 완료</option>
            </select>
          </label>
          <label className="field field-wide">설명
            <textarea name="description" value={form.description} onChange={handleChange} rows="4" placeholder="프로젝트 목적과 주요 공사 범위를 입력하세요." />
          </label>
        </div>

        <div className="form-section-title"><span>02</span><div><h3>일정 및 예산</h3><p>계획 기간과 총예산을 설정하세요.</p></div></div>
        <div className="form-grid form-grid-three">
          <label className="field">시작일<input type="date" name="startDate" value={form.startDate} onChange={handleChange} /></label>
          <label className="field">종료일<input type="date" name="endDate" value={form.endDate} onChange={handleChange} /></label>
          <label className="field">예산 (KRW)<input type="number" name="budget" min="0" step="0.01" value={form.budget} onChange={handleChange} placeholder="0" /></label>
          <label className="field field-wide">프로젝트 관리자 ID
            <input name="projectManagerId" value={form.projectManagerId} onChange={handleChange} pattern="[0-9a-fA-F-]{36}" placeholder="UUID 형식 (선택)" />
          </label>
        </div>
        <div className="form-actions">
          <Link className="button button-secondary" to="/projects">목록으로</Link>
          <button className="button button-primary" type="submit" disabled={saving}>{saving ? '저장 중...' : editing ? '변경사항 저장' : '프로젝트 등록'}</button>
        </div>
      </form>
    </section>
  )
}

export default ProjectFormPage
