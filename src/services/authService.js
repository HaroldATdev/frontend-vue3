import http from '@/api/http'

export const authService = {
  login: (credentials) => http.post('/login', credentials),
  logout: () => http.post('/logout'),
  me: () => http.get('/me')
}
