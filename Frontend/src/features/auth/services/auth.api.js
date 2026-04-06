import axios from "axios"


const api = axios.create({
    baseURL: import.meta.env.DEV ? "http://localhost:3000" : (import.meta.env.VITE_API_URL || "http://localhost:3000"),
    withCredentials: true
})

export async function register({ username, email, password }) {
    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        })
        return response.data
    } catch (err) {
        throw new Error(err.response?.data?.message || "Registration failed")
    }
}

export async function login({ email, password }) {
    try {
        const response = await api.post("/api/auth/login", {
            email, password
        })
        return response.data
    } catch (err) {
        throw new Error(err.response?.data?.message || "Login failed")
    }
}

export async function logout() {
    try {

        const response = await api.get("/api/auth/logout")

        return response.data

    } catch (err) {

    }
}

export async function getMe() {
    try {
        const response = await api.get("/api/auth/get-me", {
            validateStatus: status => (status >= 200 && status < 300) || status === 401
        });
        if (response.status === 401) return null;
        return response.data;
    } catch (err) {
        console.error("Error fetching user data:", err);
        return null;
    }
}