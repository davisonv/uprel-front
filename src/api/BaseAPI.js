import axios from 'axios'

const urls =  {
  prod: 'https://api.globomktcorretora.com/api/v1/',
  local: 'http://localhost:8000/api/v1/',
}

const BaseAPI = axios.create({
    baseURL: urls.prod,
    withCredentials: true,
    headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
    
})

const access = JSON.parse(localStorage.getItem('access'))

  if (access) {
    BaseAPI.defaults.headers.common['Authorization'] = `Bearer ${access}`
  }

export default BaseAPI
