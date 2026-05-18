import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

// Adjunta el token JWT en cada petición
http.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Manejo global de errores: 401, 403, 422, 500 y errores de red
http.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      return Promise.reject({ message: 'Error de red. Verifica tu conexión.', status: 0 })
    }

    const { status, data } = error.response

    if (status === 401) {
      localStorage.removeItem('token')
      // Importación dinámica para evitar dependencia circular con router
      import('@/router').then(({ default: router }) => router.push('/login'))
      return Promise.reject({ message: 'Sesión expirada. Inicia sesión nuevamente.', status })
    }

    if (status === 403) {
      return Promise.reject({ message: 'No tienes permisos para realizar esta acción.', status })
    }

    if (status === 422) {
      const errors = data.errors
        ? Object.values(data.errors).flat().join(' ')
        : data.message || 'Error de validación.'
      return Promise.reject({ message: errors, status, errors: data.errors })
    }

    if (status === 500) {
      return Promise.reject({ message: 'Error interno del servidor. Intenta más tarde.', status })
    }

    return Promise.reject({ message: data?.message || `Error ${status}`, status })
  }
)

export default http
