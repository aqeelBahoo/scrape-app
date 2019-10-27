import axios from 'axios'

const BASE_URL = 'http://localhost:3333'

// const BASE_URL = 'http://18.130.205.163:3333'
export const getDarazProductsInfo = (search, category, searchTerms) => {
  const query = search.split(' ').join('+')
  // const query =search
  console.log(query)
  const url = `${BASE_URL}/api/search/daraz`
  return axios.post(url, { searchTerm: query, category: category, searchTerms })
    .then(response => response.data)
}

export const getQneProductsInfo = (search, category, searchTerms) => {
  const query = search.split(' ').join('+')
  const url = `${BASE_URL}/api/search/qne`
  return axios.post(url, { searchTerm: query, category: category, searchTerms })
    .then(response => response.data)
}

export const getYayvoProductsInfo = (search, category, searchTerms) => {
  const query = search.split(' ').join('+')
  const url = `${BASE_URL}/api/search/yayvo`
  return axios.post(url, { searchTerm: query, category: category, searchTerms })
    .then(response => response.data)
}

export const getHumMartProductsInfo = (search, category, searchTerms) => {
  const query = search.split(' ').join('+')
  const url = `${BASE_URL}/api/search/hummart`
  return axios.post(url, { searchTerm: query, category: category, searchTerms })
    .then(response => response.data)
}

export const getTazaMartProductsInfo = (search, category, searchTerms) => {
  const query = search.split(' ').join('+')
  const url = `${BASE_URL}/api/search/tazamart`
  return axios.post(url, { searchTerm: query, category: category, searchTerms })
    .then(response => response.data)
}

export const getMyCartProductsInfo = (search, category, searchTerms) => {
  const query = search.split(' ').join('+')
  const url = `${BASE_URL}/api/search/mycart`
  return axios.post(url, { searchTerm: query, category: category, searchTerms })
    .then(response => response.data)
}

export const refreshItem = (itemId) => {
  const url = `${BASE_URL}/api/list/refresh-item/${itemId}`
  const token = localStorage.getItem('jwt')
  return axios.post(url, { headers: { Authorization: token } })
    .then(response => response.data)
    .catch(err => {
      console.log(err)
    })
}
