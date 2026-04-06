import { createContext, useState, useEffect } from "react";
import { login, register, logout, getMe } from "./services/auth.api";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => { 
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getMe()
                if (data?.user) {
                    setUser(data.user)
                }
            } catch (err) {
                console.error("Auth check failed:", err)
            } finally {
                setLoading(false)
            }
        }
        
        fetchUser()
    }, [])

    const handleLogin = async (credentials) => {
        setLoading(true)
        setError(null)
        try {
            const data = await login(credentials)
            if (!data?.user) {
                setError('Login failed. Please check your credentials.')
                return false
            }
            setUser(data.user)
            return true
        } catch (err) {
            setError('Login failed. Please check your credentials.')
            return false
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async (credentials) => {
        setLoading(true)
        setError(null)
        try {
            const data = await register(credentials)
            if (!data?.user) {
                setError('Registration failed. Please try again.')
                return false
            }
            setUser(data.user)
            return true
        } catch (err) {
            setError('Registration failed. Please try again.')
            return false
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
        } catch (err) {
            console.error("Logout error", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthContext.Provider value={{user, loading, error, setError, handleLogin, handleRegister, handleLogout}} >
            {children}
        </AuthContext.Provider>
    )
}