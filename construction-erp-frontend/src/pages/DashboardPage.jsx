import { Link } from 'react-router-dom'
import { erpModules } from '../data/erpModules'

const quickModules = ['construction', 'material', 'accounting', 'hr', 'safety', 'treasury']
const tasks = [
  ['지급 요청 승인', '자금', '7건', '오늘'],
  ['외주 기성 검토', '외주', '4건', 'D-1'],
  ['안전 점검 조치', '안전보건', '6건', '긴급'],
  ['자재 부족 확인', '자재', '14건', '이번 주'],
]

function DashboardPage() {
  return (
    <section className="dashboard-page">
      <div className="page-heading dashboard-heading">
        <div><p className="breadcrumb">CONSTRUCTION ERP / OVERVIEW</p><h2>통합 대시보드</h2><p>프로젝트와 전사 업무 현황을 한눈에 확인하세요.</p></div>
        <div className="dashboard-date"><span>업무 기준일</span><strong>2026. 08. 30</strong></div>
      </div>

      <div className="dashboard-kpis">
        <article className="dashboard-kpi dark"><span>운영 프로젝트</span><strong>18</strong><small>정상 15 · 지연 3</small><i>PROJECT</i></article>
        <article className="dashboard-kpi"><span>누적 수주액</span><strong>3,041억</strong><small className="positive">목표 달성률 72.4%</small><i>SALES</i></article>
        <article className="dashboard-kpi"><span>금월 집행액</span><strong>284억</strong><small>예산 대비 66.8%</small><i>COST</i></article>
        <article className="dashboard-kpi"><span>오늘 현장 인원</span><strong>642명</strong><small className="positive">전일 대비 +18명</small><i>LABOR</i></article>
      </div>

      <div className="dashboard-layout">
        <article className="panel dashboard-progress">
          <div className="dashboard-panel-title"><div><h3>주요 현장 공정 현황</h3><p>계획 대비 실제 공정률</p></div><Link to="/erp/construction">전체 현장</Link></div>
          <div className="progress-list">
            {[['세종 스마트시티 복합센터', 34.2, 36.0, '정상'], ['부산 해안도로 정비', 71.8, 78.5, '지연'], ['강남 복합문화센터', 100, 100, '완료'], ['인천 물류센터 증축', 8.5, 9.2, '정상']].map(([name, actual, plan, status]) => (
              <div className="progress-item" key={name}><div className="progress-info"><strong>{name}</strong><span className={`mini-status ${status}`}>{status}</span></div><div className="progress-numbers"><span>실적 <b>{actual}%</b></span><span>계획 {plan}%</span></div><div className="progress-track"><i style={{ width: `${actual}%` }} /></div></div>
            ))}
          </div>
        </article>

        <article className="panel dashboard-tasks">
          <div className="dashboard-panel-title"><div><h3>나의 처리 업무</h3><p>승인 및 확인이 필요한 항목</p></div><span className="task-total">31</span></div>
          <div className="task-list">{tasks.map(([name, module, count, due]) => <div className="task-item" key={name}><span className="task-check">○</span><div><strong>{name}</strong><small>{module} 모듈</small></div><b>{count}</b><em>{due}</em></div>)}</div>
        </article>
      </div>

      <article className="panel quick-menu-panel">
        <div className="dashboard-panel-title"><div><h3>빠른 업무 메뉴</h3><p>자주 사용하는 ERP 업무로 바로 이동합니다.</p></div></div>
        <div className="quick-menu-grid">{quickModules.map((key) => { const module = erpModules[key]; return <Link to={`/erp/${key}`} key={key} style={{ '--quick-accent': module.accent }}><span>{module.title.slice(0, 1)}</span><div><strong>{module.title} 관리</strong><small>{module.tabs[0]} · {module.tabs[1]}</small></div><b>→</b></Link> })}</div>
      </article>
    </section>
  )
}

export default DashboardPage
