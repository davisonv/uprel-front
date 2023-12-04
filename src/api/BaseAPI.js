import axios from 'axios'

const BaseAPI = axios.create({
    baseURL: 'https://api.globomktcorretora.com/api/v1/',
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