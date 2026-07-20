import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

export function getApiErrorMessage(error) {
  if (error.response?.data?.message) return error.response.data.message
  if (error.code === 'ECONNABORTED') return '요청 시간이 초과되었습니다.'
  if (!error.response) return '서버에 연결할 수 없습니다. 백엔드 실행 상태를 확인해 주세요.'
  return '요청 처리 중 오류가 발생했습니다.'
}

export default apiClient
