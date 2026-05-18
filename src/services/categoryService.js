import http from '@/api/http'

export const categoryService = {
  list: (params) => http.get('/categories', { params }),
  get: (id) => http.get(`/categories/${id}`),
  create: (data) => http.post('/categories', data),
  update: (id, data) => http.put(`/categories/${id}`, data),
  remove: (id) => http.delete(`/categories/${id}`)
}
