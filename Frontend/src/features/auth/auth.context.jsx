import { createContext, useState, useEffect } from "react";


export const AuthContext = createContext()


export const AuthProvider = ({ children }) => { 

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check if user is logged in from localStorage or token
        const token = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user')
        
        if(token && savedUser) {
            setUser(JSON.parse(savedUser))
        }
        
        setLoading(false)
    }, [])

    return (
        <AuthContext.Provider value={{user,setUser,loading,setLoading}} >
            {children}
        </AuthContext.Provider>
    )

    
}