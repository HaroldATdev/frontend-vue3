import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

// Adjunta el token Bearer en cada peticion si existe y es valido.
http.interceptors.request.use(config => {
  const token = String(localStorage.getItem('token') || '').trim()
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`
  } else {
    delete config.headers.Authorization
    delete config.headers.authorization
  }
  return config
})

// Manejo global de errores: 401, 403, 422, 500 y errores de red
http.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      return Promise.reject({ message: 'Error de red. Verifica tu conexion.', status: 0 })
    }

    const { status, data } = error.response

    if (status === 401) {
      localStorage.removeItem('token')
      // Importacion dinamica para evitar dependencia circular con router
      import('@/router').then(({ default: router }) => router.push('/login'))
      return Promise.reject({ message: 'Sesion expirada. Inicia sesion nuevamente.', status })
    }

    if (status === 403) {
      return Promise.reject({ message: 'No tienes permisos para realizar esta accion.', status })
    }

    if (status === 422) {
      const errors = data.errors
        ? Object.values(data.errors).flat().join(' ')
        : data.message || 'Error de validacion.'
      return Promise.reject({ message: errors, status, errors: data.errors })
    }

    if (status === 500) {
      return Promise.reject({ message: 'Error interno del servidor. Intenta mas tarde.', status })
    }

    return Promise.reject({ message: data?.message || `Error ${status}`, status })
  }
)

export default http
