import http from '@/api/http'

export const productService = {
  list: (params) => http.get('/products', { params }),
  get: (id) => http.get(`/products/${id}`),
  create: (data) => http.post('/products', data),
  update: (id, data) => http.put(`/products/${id}`, data),
  remove: (id) => http.delete(`/products/${id}`)
}
