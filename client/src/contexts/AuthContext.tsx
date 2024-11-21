import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { LoginFormData, TUser } from '@/types'
import { login as loginApi, tokenValidate } from '@/service/api/auth'
import Cookies from 'js-cookie'
import { useLocation, useNavigate } from 'react-router-dom'
import { routes } from '@/data/routes'

interface AuthContextType {
  user: TUser | null
  login: (data: LoginFormData) => Promise<void>
  logout: () => void
  register: (email: string, password: string) => Promise<void>
  isAuthenticated: boolean,
  isLoading: boolean
}

const allProtechedRoutes = ["users", "music", "artists", ""]

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    const token = Cookies.get('Authorization')
    if (token && allProtechedRoutes.includes(location.pathname.split('/')[1])) {
      validateToken()
    } else {
      setIsLoading(false)
      if(location.pathname !== "/register"){
        navigate("/login")
      }
    }
  }, [])

  const validateToken = async () => {
    try {
      const response = await tokenValidate()
      setUser(response?.user)
      setIsAuthenticated(true)
    } catch (error) {
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (data: LoginFormData) => {
    const response = await loginApi(data);
    console.log("reached here", response)
    if (response?.success) {
      Cookies.set("Authorization", response?.accessToken ?? "");
      setIsAuthenticated(true);
      const allowedRoutes = routes[response?.user.role as keyof typeof routes].map((route) => route.path)
      window.location.href = allowedRoutes[0];
      // navigate(allowedRoutes[0]);
    }
  };

  const logout = () => {
    Cookies.remove('Authorization')
    localStorage.clear()
    setUser(null)
    setIsAuthenticated(false)
  }

  const register = async (email: string, password: string) => {
    try {
      await axios.post('/api/register', { email, password })
    } catch (error) {
      throw new Error('Registration failed')
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}