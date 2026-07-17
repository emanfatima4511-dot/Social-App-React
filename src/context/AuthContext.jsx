import { createContext, useState } from 'react'
import { storage } from '../utils/storage'
import { generateId } from '../utils/helpers'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Initialise from localStorage so a page refresh keeps the user logged in
  const [currentUser, setCurrentUser] = useState(() => storage.getCurrentUser())

  // Create a new account
  function signup({ name, email, password }) {
    const users = storage.getUsers()

    const emailExists = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    )
    if (emailExists) {
      throw new Error('Email already registered')
    }

    const newUser = {
      id: generateId('usr'),
      name,
      email,
      password,
      bio: '',
      location: '',
      avatar: null,
      coverImage: null,
      joinedAt: new Date().toISOString(),
    }

    storage.setUsers([...users, newUser])
    // Note: we don't log the user in automatically here —
    // the assignment says Signup redirects to /login after creating the account
    return newUser
  }

  // Log in an existing user
  function login(email, password) {
    const users = storage.getUsers()
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )

    if (!found) {
      throw new Error('Invalid email or password')
    }

    // Strip password before storing as "current user" / exposing to the rest of the app
    const { password: _password, ...safeUser } = found
    setCurrentUser(safeUser)
    storage.setCurrentUser(safeUser)
    return safeUser
  }

  // Log out
  function logout() {
    setCurrentUser(null)
    storage.clearCurrentUser()
  }

  // Update the logged-in user's profile
  function updateCurrentUser(updatedData) {
    const merged = { ...currentUser, ...updatedData }

    // Update state + session
    setCurrentUser(merged)
    storage.setCurrentUser(merged)

    // Also update this user inside the main users array so changes persist
    const users = storage.getUsers()
    const updatedUsers = users.map((u) =>
      u.id === merged.id ? { ...u, ...updatedData } : u
    )
    storage.setUsers(updatedUsers)
  }

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    signup,
    login,
    logout,
    updateCurrentUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}