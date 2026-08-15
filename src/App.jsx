import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import RequireAuth from './components/RequireAuth'

// Lazy-loaded pages — each becomes its own JS chunk, loaded on demand
const FeedPage = lazy(() => import('./pages/FeedPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignupPage = lazy(() => import('./pages/SignupPage'))
const PostDetailPage = lazy(() => import('./pages/PostDetailPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const DashboardLayout = lazy(() => import('./pages/dashboard/DashboardLayout'))
const DashboardHome = lazy(() => import('./pages/dashboard/DashboardHome'))
const PostsDashboard = lazy(() => import('./pages/dashboard/PostsDashboard'))
const CreatePost = lazy(() => import('./pages/dashboard/CreatePost'))
const EditPost = lazy(() => import('./pages/dashboard/EditPost'))
const ProfileSettings = lazy(() => import('./pages/dashboard/ProfileSettings'))
const Notifications = lazy(() => import('./pages/dashboard/Notifications'))
const MessagesPage = lazy(() => import('./pages/MessagesPage'))

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <Navbar />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<FeedPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/posts/:postId" element={<PostDetailPage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          
          {/* Protected messaging routes */}
          <Route
            path="/messages"
            element={
              <RequireAuth>
                <MessagesPage />
              </RequireAuth>
            }
          />
          <Route
            path="/messages/:userId"
            element={
              <RequireAuth>
                <MessagesPage />
              </RequireAuth>
            }
          />

          {/* Protected dashboard routes */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="posts" element={<PostsDashboard />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="create" element={<CreatePost />} />
            <Route path="edit/:postId" element={<EditPost />} />
            <Route path="settings" element={<ProfileSettings />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App