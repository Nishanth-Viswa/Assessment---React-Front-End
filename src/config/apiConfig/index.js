import axios from 'axios'
import { createHashHistory } from "history";
const history = createHashHistory();
export var call;


// BASE URL
export const APIURL = 'http://localhost:30005';

export const apiConfig = (method) => {
  let root = APIURL;
  if (method === 'no-base') {
    root = APIURL
  } else {
    root = APIURL + '/api/service'
  }
  let headers = { "Content-Type": "application/json" }
  let token = localStorage.getItem('token')
  if (token && method !== 'no-base') {
    Object.assign(headers, { 'Authorization': `Bearer ${token}` })
  }
  call = axios.CancelToken.source()
  let instance = axios.create({
    baseURL: `${root}/`,
    headers: headers,
    cancelToken: call.token
  });

  instance.interceptors.request.use(config => {
    return config
  }, error => {
    return Promise.reject(error);
  })

  instance.interceptors.response.use(config => {
    return config
  }, error => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.clear()
        sessionStorage.clear()
        history.push('/')
      }
    } else {
      console.log(call)
    }

    return Promise.reject(error)
  })

  return instance
}
