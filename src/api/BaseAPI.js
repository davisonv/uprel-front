import axios from 'axios'

const BaseAPI = axios.create({
    baseURL: '//localhost:8000/api/v1/',
    
})

const access = JSON.parse(localStorage.getItem('access'))

  if (access) {
    BaseAPI.defaults.headers.common['Authorization'] = `Bearer ${access}`
  }

export default BaseAPI