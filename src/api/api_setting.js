import axios from "axios";
import authStore from "../store/authStore";

export let API_URL = 'http://skipper_backend:8000'

let $api = axios.create({
    baseURL: API_URL
})

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config
})

$api.interceptors.response.use((config) => {
    return config
}, (error => {
    let originalRequest = error.config
    if (error.response.status === 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true
        try {
            let r = axios.get(`${API_URL}/refresh-token`, {withCredentials: true})
            localStorage.setItem('token', r.data.token)
            return $api.request(originalRequest)
        }
        catch (e) {
            authStore.logout()
        }
    }
    throw error
}))

export default $api
