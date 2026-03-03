import { create } from 'zustand'
import { authService } from '../services/authService'

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,

  setUser: (user) => set({ user, loading: false }),

  login: async (email, password) => {
    try {
      const data = await authService.signIn(email, password)
      set({ user: data.user, loading: false })
      return data
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  signup: async (email, password, userData) => {
    try {
      const data = await authService.signUp(email, password, userData)
      set({ user: data.user, loading: false })
      return data
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  logout: async () => {
    try {
      await authService.signOut()
      set({ user: null, loading: false })
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  checkAuth: async () => {
    try {
      set({ loading: true })
      const user = await authService.getCurrentUser()
      set({ user, loading: false })
    } catch (error) {
      set({ user: null, loading: false })
    }
  }
}))
