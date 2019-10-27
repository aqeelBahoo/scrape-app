import axios from 'axios'
const BASE_URL = 'http://localhost:3333'

// const BASE_URL = 'http://18.130.205.163:3333'
export const login = (email, password) => {
  const url = `${BASE_URL}/api/user/login`
  return axios.post(url, { email, password })
    .then(response => response.data)
    .catch(err => {
      console.log(err)
    })
}

export const register = (name, email, password) => {
  const url = `${BASE_URL}/api/user`
  return axios.post(url, { name, email, password })
    .then(response => response.data)
    .catch(err => {
      console.log(err)
    })
}

export const getUsers = () => {
  const url = `${BASE_URL}/api/user`
  const token = localStorage.getItem('jwt')
  return axios.get(url, { headers: { Authorization: token } })
    .then(response => response.data.data)
    .catch(err => {
      console.log(err)
    })
}

export const deleteUser = (userID) => {
  console.log(userID)
  const url = `${BASE_URL}/api/user/id/${userID}`
  const token = localStorage.getItem('jwt')
  return axios.delete(url, { headers: { Authorization: token } })
    .then(response => response)
    .catch(err => {
      console.log(err)
    })
}

export const getListsByUser = () => {
  let user = localStorage.getItem('user')
  user = JSON.parse(user)
  const url = `${BASE_URL}/api/list/user/${user.id}`
  const token = localStorage.getItem('jwt')
  return axios.get(url, { headers: { Authorization: token } })
    .then(response => {
      return response.data.data
    })
    .catch(err => {
      console.log(err)
    })
}
export const getItemList = () => {
  const url = `${BASE_URL}/api/list`
  const token = localStorage.getItem('jwt')
  return axios.get(url, { headers: { Authorization: token } })
    .then(response => response.data)
    .catch(err => {
      console.log(err)
    })
}
export const deleteItem = (itemId) => {
  const url = `${BASE_URL}/api/list/${itemId}`
  const token = localStorage.getItem('jwt')
  return axios.delete(url, { headers: { Authorization: token } })
    .then(response => response.data)
    .catch(err => {
      console.log(err)
    })
}

export const saveItemWithAssignUsers = (user, list) => {
  const url = `${BASE_URL}/api/list`
  const token = localStorage.getItem('jwt')
  return axios.post(url, { user, list }, { headers: { Authorization: token } })
    .then(response => response.data)
    .catch(err => {
      console.log(err)
    })
}
