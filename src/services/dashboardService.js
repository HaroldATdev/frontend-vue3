import http from '@/api/http'

export const dashboardService = {
  getSummary: () => http.get('/dashboard')
}
