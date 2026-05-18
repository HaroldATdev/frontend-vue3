import http from '@/api/http'

export const stockService = {
  list: (productId, params) => http.get(`/products/${productId}/stock-movements`, { params }),
  create: (productId, data) => http.post(`/products/${productId}/stock-movements`, data)
}
