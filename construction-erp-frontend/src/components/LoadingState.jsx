function LoadingState({ message = '데이터를 불러오는 중입니다.' }) {
  return (
    <div className="state-panel" role="status">
      <span className="spinner" />
      <p>{message}</p>
    </div>
  )
}

export default LoadingState
