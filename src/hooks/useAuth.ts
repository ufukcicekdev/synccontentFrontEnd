import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI, LoginData, RegisterData } from '@/lib/api'

interface User {
  id: number
  email: string
  full_name: string
  subscription_tier: string
  is_verified: boolean
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (data: LoginData) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (data: LoginData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authAPI.login(data)
          
          // Store tokens
          localStorage.setItem('access_token', response.access)
          localStorage.setItem('refresh_token', response.refresh)
          
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error: unknown) {
          const err = error as { response?: { data?: { detail?: string; message?: string } } }
          const errorMessage = err.response?.data?.detail || 
                              err.response?.data?.message || 
                              'Login failed. Please try again.'
          set({
            error: errorMessage,
            isLoading: false,
          })
          throw error
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authAPI.register(data)
          
          // Store tokens
          localStorage.setItem('access_token', response.access)
          localStorage.setItem('refresh_token', response.refresh)
          
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error: unknown) {
          const err = error as { response?: { data?: { detail?: string; message?: string } } }
          const errorMessage = err.response?.data?.detail || 
                              err.response?.data?.message || 
                              'Registration failed. Please try again.'
          set({
            error: errorMessage,
            isLoading: false,
          })
          throw error
        }
      },

      logout: () => {
        authAPI.logout().catch(console.error)
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        })
      },

      checkAuth: async () => {
        const token = localStorage.getItem('access_token')
        if (!token) {
          set({ isAuthenticated: false, user: null, isLoading: false })
          return
        }

        set({ isLoading: true })
        try {
          const isValid = await authAPI.verifyToken(token)
          if (isValid) {
            const user = await authAPI.getProfile()
            set({
              user,
              isAuthenticated: true,
              isLoading: false
            })
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false
            })
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
          }
        } catch {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false
          })
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)