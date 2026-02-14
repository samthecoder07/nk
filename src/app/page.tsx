'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, GraduationCap, Building2, Mail, Lock, User, Phone, ArrowRight, Users, BarChart3, LogOut, Plus, CheckCircle, XCircle, Trash2, Edit, PlayCircle, MessageCircle } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface User {
  id: string
  email: string
  name: string | null
  role: string
  schoolName: string | null
  isApproved: boolean
}

export default function Home() {
  const [showAnimation, setShowAnimation] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [authType, setAuthType] = useState<'login' | 'register'>('login')
  const [portal, setPortal] = useState<'teacher' | 'student' | 'government'>('teacher')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    schoolName: '',
    parentEmail: ''
  })

  // Classroom creation state
  const [showClassroomForm, setShowClassroomForm] = useState(false)
  const [classroomStudents, setClassroomStudents] = useState<Array<{ name: string; email: string; parentEmail: string; password: string }>>([])
  const [classroomFormData, setClassroomFormData] = useState({
    name: '',
    class: '',
    stream: ''
  })
  const [classrooms, setClassrooms] = useState<any[]>([])

  // MCQ creation state
  const [showMCQForm, setShowMCQForm] = useState(false)
  const [mcqQuestions, setMcqQuestions] = useState<any[]>([])
  const [currentMCQ, setCurrentMCQ] = useState({
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOption: 1
  })

  // Video learning state
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [showVideoPlayer, setShowVideoPlayer] = useState(false)
  const [videoCompleted, setVideoCompleted] = useState(false)

  // MCQ Test taking state
  const [showTest, setShowTest] = useState(false)
  const [testQuestions, setTestQuestions] = useState<any[]>([])
  const [testAnswers, setTestAnswers] = useState<Record<number, number>>({})
  const [testSubmitted, setTestSubmitted] = useState(false)

  // AI Doubt clarification state
  const [showAIChat, setShowAIChat] = useState(false)
  const [aiMessages, setAiMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [aiInput, setAiInput] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  const handlePortalSelect = (selectedPortal: 'teacher' | 'student' | 'government') => {
    setPortal(selectedPortal)
    setShowAuth(true)
    setError('')
    setSuccess('')
  }

  const handleBackToPortal = () => {
    setShowAuth(false)
    setShowDashboard(false)
    setError('')
    setSuccess('')
    setCurrentUser(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    console.log('Auth submit:', { authType, portal, email: formData.email })

    try {
      if (authType === 'login') {
        console.log('Attempting login for:', formData.email, portal)
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            role: portal
          })
        })

        const data = await response.json()
        console.log('Login response:', data, response.status)

        if (!response.ok) {
          throw new Error(data.error || 'Login failed')
        }

        setCurrentUser(data.user)
        setSuccess('Login successful!')
        setTimeout(() => {
          setShowDashboard(true)
          setShowAuth(false)
          setSuccess('')
          // Load classrooms for teacher
          if (data.user.role === 'teacher') {
            loadClassrooms(data.user.id)
          }
        }, 1000)
      } else {
        console.log('Attempting registration for:', formData.email, portal)
        const requestBody = {
          ...formData,
          role: portal
        }
        console.log('Registration request body:', requestBody)

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        })

        const data = await response.json()
        console.log('Registration response:', data, response.status)

        if (!response.ok) {
          throw new Error(data.error || 'Registration failed')
        }

        setSuccess('Registration successful! Please login to continue.')
        setAuthType('login')
      }
    } catch (err: any) {
      console.error('Auth error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    if (currentUser) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUser.id })
        })
      } catch (err) {
        console.error('Logout error:', err)
      }
    }

    setCurrentUser(null)
    setShowDashboard(false)
    setShowAuth(false)
    setFormData({ email: '', password: '', name: '', phone: '', schoolName: '', parentEmail: '' })
  }

  const loadClassrooms = async (teacherId: string) => {
    try {
      const response = await fetch(`/api/classrooms?teacherId=${teacherId}`)
      const data = await response.json()
      if (response.ok) {
        setClassrooms(data.classrooms)
      }
    } catch (err) {
      console.error('Error loading classrooms:', err)
    }
  }

  const addStudent = () => {
    setClassroomStudents([
      ...classroomStudents,
      { name: '', email: '', parentEmail: '', password: '' }
    ])
  }

  const removeStudent = (index: number) => {
    const newStudents = classroomStudents.filter((_, i) => i !== index)
    setClassroomStudents(newStudents)
  }

  const updateStudent = (index: number, field: string, value: string) => {
    const newStudents = [...classroomStudents]
    newStudents[index] = { ...newStudents[index], [field]: value }
    setClassroomStudents(newStudents)
  }

  const createClassroom = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/classrooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: currentUser?.id,
          schoolName: currentUser?.schoolName || '',
          class: parseInt(classroomFormData.class),
          stream: classroomFormData.stream,
          students: classroomStudents
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create classroom')
      }

      setSuccess('Classroom created successfully!')
      setShowClassroomForm(false)
      setClassroomFormData({ name: '', class: '', stream: '' })
      setClassroomStudents([])
      loadClassrooms(currentUser?.id || '')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addMCQQuestion = () => {
    if (!currentMCQ.question || !currentMCQ.optionA || !currentMCQ.optionB || !currentMCQ.optionC || !currentMCQ.optionD) {
      setError('Please fill all fields')
      return
    }
    setMcqQuestions([...mcqQuestions, { ...currentMCQ, id: mcqQuestions.length + 1 }])
    setCurrentMCQ({
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctOption: 1
    })
  }

  const removeMCQQuestion = (index: number) => {
    setMcqQuestions(mcqQuestions.filter((_, i) => i !== index))
  }

  const createMCQTest = async () => {
    // This would call an API to create the test
    setSuccess('MCQ Test created successfully!')
    setShowMCQForm(false)
    setMcqQuestions([])
  }

  const startTest = async () => {
    setLoading(true)
    try {
      // Fetch MCQ questions from database based on video subject and class
      const response = await fetch(`/api/mcqs?subject=${encodeURIComponent(selectedVideo?.subject || '')}&class=${selectedVideo?.class || ''}`)
      const data = await response.json()

      if (response.ok && data.questions && data.questions.length > 0) {
        // Shuffle and take 20 questions
        const shuffled = [...data.questions].sort(() => Math.random() - 0.5)
        setTestQuestions(shuffled.slice(0, 20))
        setShowTest(true)
        setTestAnswers({})
        setTestSubmitted(false)
        setError('')
      } else {
        setError('No MCQ questions available for this subject. Please try a different subject or contact your teacher.')
      }
    } catch (err) {
      console.error('Error fetching MCQ questions:', err)
      setError('Failed to load MCQ questions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const submitTest = () => {
    setTestSubmitted(true)
    let score = 0
    testQuestions.forEach((q, index) => {
      if (testAnswers[index] === q.correctOption) {
        score++
      }
    })
    setSuccess(`Test submitted! Your score: ${score}/${testQuestions.length}`)
  }

  const sendAIMessage = async () => {
    if (!aiInput.trim()) return

    const userMessage = aiInput
    setAiInput('')
    setAiMessages([...aiMessages, { role: 'user', content: userMessage }])

    try {
      const response = await fetch('/api/ai/doubt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage })
      })

      const data = await response.json()

      if (response.ok) {
        setAiMessages([...aiMessages, { role: 'user', content: userMessage }, { role: 'assistant', content: data.answer }])
      } else {
        setAiMessages([...aiMessages, { role: 'user', content: userMessage }, { role: 'assistant', content: 'Sorry, I could not process your request.' }])
      }
    } catch (err) {
      setAiMessages([...aiMessages, { role: 'user', content: userMessage }, { role: 'assistant', content: 'Sorry, an error occurred.' }])
    }
  }

  // Opening Animation
  if (showAnimation) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 z-50">
        <div className="text-center">
          <h1 className="text-8xl md:text-9xl font-bold text-white animate-pulse tracking-wider">
            Aram
          </h1>
          <p className="text-white/80 text-xl md:text-2xl mt-4 font-light">
            Empowering Education
          </p>
        </div>
      </div>
    )
  }

  // Dashboard Views
  if (showDashboard && currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col">
        {/* Dashboard Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-emerald-800 tracking-wider">Aram</h1>
              <span className="text-sm text-gray-600">|</span>
              <span className="text-lg font-medium text-gray-800">
                {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)} Portal
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{currentUser.name || 'User'}</p>
                <p className="text-xs text-gray-500">{currentUser.email}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 sm:p-8">
          {currentUser.role === 'teacher' && (
            <TeacherDashboard
              user={currentUser}
              classrooms={classrooms}
              showClassroomForm={showClassroomForm}
              setShowClassroomForm={setShowClassroomForm}
              classroomFormData={classroomFormData}
              setClassroomFormData={setClassroomFormData}
              classroomStudents={classroomStudents}
              setClassroomStudents={setClassroomStudents}
              addStudent={addStudent}
              removeStudent={removeStudent}
              updateStudent={updateStudent}
              createClassroom={createClassroom}
              loading={loading}
              showMCQForm={showMCQForm}
              setShowMCQForm={setShowMCQForm}
              mcqQuestions={mcqQuestions}
              currentMCQ={currentMCQ}
              setCurrentMCQ={setCurrentMCQ}
              addMCQQuestion={addMCQQuestion}
              removeMCQQuestion={removeMCQQuestion}
              createMCQTest={createMCQTest}
              error={error}
              success={success}
              setError={setError}
              setSuccess={setSuccess}
            />
          )}
          {currentUser.role === 'student' && (
            <StudentDashboard
              user={currentUser}
              selectedVideo={selectedVideo}
              setSelectedVideo={setSelectedVideo}
              showVideoPlayer={showVideoPlayer}
              setShowVideoPlayer={setShowVideoPlayer}
              videoCompleted={videoCompleted}
              setVideoCompleted={setVideoCompleted}
              showTest={showTest}
              setShowTest={setShowTest}
              testQuestions={testQuestions}
              testAnswers={testAnswers}
              setTestAnswers={setTestAnswers}
              testSubmitted={testSubmitted}
              setTestSubmitted={setTestSubmitted}
              submitTest={submitTest}
              startTest={startTest}
              showAIChat={showAIChat}
              setShowAIChat={setShowAIChat}
              aiMessages={aiMessages}
              setAiMessages={setAiMessages}
              aiInput={aiInput}
              setAiInput={setAiInput}
              sendAIMessage={sendAIMessage}
              error={error}
              success={success}
              setError={setError}
              setSuccess={setSuccess}
              loading={loading}
            />
          )}
          {currentUser.role === 'government' && <GovernmentDashboard user={currentUser} />}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-sm text-gray-600">
              © 2026 ARAM Education Platform. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    )
  }

  // Authentication Forms
  if (showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2">
            <button
              onClick={handleBackToPortal}
              className="flex items-center text-sm text-emerald-600 hover:text-emerald-700 mb-2"
            >
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Back to Portal Selection
            </button>
            <CardTitle className="text-2xl text-emerald-800">
              {portal.charAt(0).toUpperCase() + portal.slice(1)} Portal
            </CardTitle>
            <CardDescription>
              {portal === 'government'
                ? 'Sign in to access government dashboard'
                : (authType === 'login' ? 'Sign in to your account' : 'Create a new account')
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-800">{success}</p>
              </div>
            )}
            <form onSubmit={handleAuth} className="space-y-4">
              {/* Teacher Registration Fields */}
              {authType === 'register' && portal === 'teacher' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">School Name</label>
                    <input
                      type="text"
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Enter school name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Student Registration Fields */}
              {authType === 'register' && portal === 'student' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Parent Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="parentEmail"
                        value={formData.parentEmail}
                        onChange={handleInputChange}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Enter parent email"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email Field - Shows for ALL portals */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Field - Shows for ALL portals */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {/* Government Warning */}
              {portal === 'government' && authType === 'login' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-800">
                    Only authorized government officials can access this portal
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? 'Processing...' : (authType === 'login' ? 'Sign In' : 'Register')}
              </Button>

              {portal !== 'government' && (
                <p className="text-center text-sm text-gray-600">
                  {authType === 'login' ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => setAuthType(authType === 'login' ? 'register' : 'login')}
                    className="text-emerald-600 hover:underline font-medium"
                  >
                    {authType === 'login' ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Portal Selection Landing Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-emerald-800 tracking-wider">Aram</h1>
          <p className="text-gray-600 hidden sm:block">Education Platform for Classes 10, 11 & 12</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-7xl mx-auto w-full">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Welcome to ARAM
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive education platform empowering teachers, students, and government officials
              to monitor and enhance learning outcomes.
            </p>
          </div>

          {/* Portal Selection Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Teacher Portal */}
            <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-emerald-500 cursor-pointer group">
              <CardHeader>
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                  <GraduationCap className="w-8 h-8 text-emerald-700" />
                </div>
                <CardTitle className="text-xl text-emerald-800">Teacher Portal</CardTitle>
                <CardDescription>
                  Create classrooms, manage students, design MCQ tests, and monitor performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handlePortalSelect('teacher')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  Access Portal
                </Button>
              </CardContent>
            </Card>

            {/* Student Portal */}
            <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-teal-500 cursor-pointer group">
              <CardHeader>
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                  <BookOpen className="w-8 h-8 text-teal-700" />
                </div>
                <CardTitle className="text-xl text-teal-800">Student Portal</CardTitle>
                <CardDescription>
                  Access video lessons, complete MCQ tests, get AI doubt clarification, and track progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handlePortalSelect('student')}
                  className="w-full bg-teal-600 hover:bg-teal-700"
                >
                  Access Portal
                </Button>
              </CardContent>
            </Card>

            {/* Government Portal */}
            <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-cyan-500 cursor-pointer group">
              <CardHeader>
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-cyan-200 transition-colors">
                  <Building2 className="w-8 h-8 text-cyan-700" />
                </div>
                <CardTitle className="text-xl text-cyan-800">Government Portal</CardTitle>
                <CardDescription>
                  Monitor school progress, view analytics, and access educational performance data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handlePortalSelect('government')}
                  className="w-full bg-cyan-600 hover:bg-cyan-700"
                >
                  Access Portal
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-emerald-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Video Learning</h3>
              <p className="text-sm text-gray-600">YouTube-style embedded video lessons with interactive features</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <GraduationCap className="w-6 h-6 text-teal-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">MCQ Tests</h3>
              <p className="text-sm text-gray-600">Auto-evaluated tests after video completion with instant results</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Building2 className="w-6 h-6 text-cyan-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Support</h3>
              <p className="text-sm text-gray-600">Get instant doubt clarification through AI assistance</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Real-time Updates</h3>
              <p className="text-sm text-gray-600">Email notifications for login/logout activities</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © 2026 ARAM Education Platform. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm">
              Empowering Education for Classes 10, 11 & 12
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Teacher Dashboard Component
function TeacherDashboard({
  user,
  classrooms,
  showClassroomForm,
  setShowClassroomForm,
  classroomFormData,
  setClassroomFormData,
  classroomStudents,
  setClassroomStudents,
  addStudent,
  removeStudent,
  updateStudent,
  createClassroom,
  loading,
  showMCQForm,
  setShowMCQForm,
  mcqQuestions,
  currentMCQ,
  setCurrentMCQ,
  addMCQQuestion,
  removeMCQQuestion,
  createMCQTest,
  error,
  success,
  setError,
  setSuccess
}: any) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Welcome, {user.name}!</h2>
        <p className="text-gray-600 mt-1">School: {user.schoolName}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classrooms</CardTitle>
            <GraduationCap className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{classrooms.length}</div>
            <p className="text-xs text-gray-500">Active classrooms</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">
              {classrooms.reduce((sum: number, c: any) => sum + (c.studentCount || 0), 0)}
            </div>
            <p className="text-xs text-gray-500">Enrolled students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MCQ Tests</CardTitle>
            <BarChart3 className="h-4 w-4 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-600">0</div>
            <p className="text-xs text-gray-500">Created tests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Test Attempts</CardTitle>
            <CheckCircle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">0</div>
            <p className="text-xs text-gray-500">Student attempts</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="classrooms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="classrooms">Classrooms</TabsTrigger>
          <TabsTrigger value="tests">MCQ Tests</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="classrooms">
          <div className="space-y-4">
            {/* Create Classroom Button */}
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">My Classrooms</h3>
              <Dialog open={showClassroomForm} onOpenChange={setShowClassroomForm}>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Classroom
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Classroom</DialogTitle>
                    <DialogDescription>Enter classroom details and add students</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={createClassroom} className="space-y-4">
                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                        {success}
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Class</Label>
                        <Select
                          value={classroomFormData.class}
                          onValueChange={(value) => setClassroomFormData({ ...classroomFormData, class: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">Class 10</SelectItem>
                            <SelectItem value="11">Class 11</SelectItem>
                            <SelectItem value="12">Class 12</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Stream</Label>
                        <Select
                          value={classroomFormData.stream}
                          onValueChange={(value) => setClassroomFormData({ ...classroomFormData, stream: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select stream" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CSC Maths">CSC Maths</SelectItem>
                            <SelectItem value="Bio Maths">Bio Maths</SelectItem>
                            <SelectItem value="Accounts/Commerce">Accounts/Commerce</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Students</Label>
                        <Button type="button" size="sm" onClick={addStudent} variant="outline">
                          <Plus className="w-4 h-4 mr-1" />
                          Add Student
                        </Button>
                      </div>
                      {classroomStudents.map((student, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs">Student Name</Label>
                                <Input
                                  value={student.name}
                                  onChange={(e) => updateStudent(index, 'name', e.target.value)}
                                  placeholder="Name"
                                  required
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Email</Label>
                                <Input
                                  type="email"
                                  value={student.email}
                                  onChange={(e) => updateStudent(index, 'email', e.target.value)}
                                  placeholder="Email"
                                  required
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Parent Email</Label>
                                <Input
                                  type="email"
                                  value={student.parentEmail}
                                  onChange={(e) => updateStudent(index, 'parentEmail', e.target.value)}
                                  placeholder="Parent Email"
                                />
                              </div>
                              <div className="flex gap-2">
                                <div className="flex-1">
                                  <Label className="text-xs">Password</Label>
                                  <Input
                                    type="password"
                                    value={student.password}
                                    onChange={(e) => updateStudent(index, 'password', e.target.value)}
                                    placeholder="Password"
                                  />
                                </div>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => removeStudent(index)}
                                  className="mt-5"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button type="button" variant="outline" onClick={() => setShowClassroomForm(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                        {loading ? 'Creating...' : 'Create Classroom'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Classrooms List */}
            {classrooms.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>No classrooms created yet</p>
                  <p className="text-sm mt-2">Click "Create Classroom" to get started</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classrooms.map((classroom: any) => (
                  <Card key={classroom.id} className="hover:shadow-lg transition-all">
                    <CardHeader>
                      <CardTitle className="text-lg">{classroom.name}</CardTitle>
                      <CardDescription>
                        {classroom.class} - {classroom.stream}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Students:</span>
                          <span className="font-semibold">{classroom.studentCount || 0}</span>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Users className="w-3 h-3 mr-1" />
                            View Students
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tests">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">MCQ Tests</h3>
              <Dialog open={showMCQForm} onOpenChange={setShowMCQForm}>
                <DialogTrigger asChild>
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create MCQ Test
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create MCQ Test</DialogTitle>
                    <DialogDescription>Add questions for your MCQ test</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                        {success}
                      </div>
                    )}

                    {/* Add Question Form */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Add New Question</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>Question</Label>
                          <Textarea
                            value={currentMCQ.question}
                            onChange={(e) => setCurrentMCQ({ ...currentMCQ, question: e.target.value })}
                            placeholder="Enter question"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Option A</Label>
                            <Input
                              value={currentMCQ.optionA}
                              onChange={(e) => setCurrentMCQ({ ...currentMCQ, optionA: e.target.value })}
                              placeholder="Option A"
                            />
                          </div>
                          <div>
                            <Label>Option B</Label>
                            <Input
                              value={currentMCQ.optionB}
                              onChange={(e) => setCurrentMCQ({ ...currentMCQ, optionB: e.target.value })}
                              placeholder="Option B"
                            />
                          </div>
                          <div>
                            <Label>Option C</Label>
                            <Input
                              value={currentMCQ.optionC}
                              onChange={(e) => setCurrentMCQ({ ...currentMCQ, optionC: e.target.value })}
                              placeholder="Option C"
                            />
                          </div>
                          <div>
                            <Label>Option D</Label>
                            <Input
                              value={currentMCQ.optionD}
                              onChange={(e) => setCurrentMCQ({ ...currentMCQ, optionD: e.target.value })}
                              placeholder="Option D"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Correct Option</Label>
                          <Select
                            value={currentMCQ.correctOption.toString()}
                            onValueChange={(value) => setCurrentMCQ({ ...currentMCQ, correctOption: parseInt(value) })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Option A</SelectItem>
                              <SelectItem value="2">Option B</SelectItem>
                              <SelectItem value="3">Option C</SelectItem>
                              <SelectItem value="4">Option D</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={addMCQQuestion} className="w-full bg-emerald-600 hover:bg-emerald-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Question to Test
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Questions List */}
                    <div className="space-y-4">
                      <h4 className="font-semibold">Questions Added ({mcqQuestions.length})</h4>
                      {mcqQuestions.map((q: any, index: number) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-medium mb-2">Q{index + 1}: {q.question}</p>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <span className={q.correctOption === 1 ? 'text-emerald-600 font-semibold' : 'text-gray-600'}>
                                    A: {q.optionA}
                                  </span>
                                  <span className={q.correctOption === 2 ? 'text-emerald-600 font-semibold' : 'text-gray-600'}>
                                    B: {q.optionB}
                                  </span>
                                  <span className={q.correctOption === 3 ? 'text-emerald-600 font-semibold' : 'text-gray-600'}>
                                    C: {q.optionC}
                                  </span>
                                  <span className={q.correctOption === 4 ? 'text-emerald-600 font-semibold' : 'text-gray-600'}>
                                    D: {q.optionD}
                                  </span>
                                </div>
                              </div>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => removeMCQQuestion(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setShowMCQForm(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={createMCQTest}
                        disabled={mcqQuestions.length === 0}
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        Create Test ({mcqQuestions.length} questions)
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>No tests created yet</p>
                <p className="text-sm mt-2">Click "Create MCQ Test" to get started</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Performance Reports</CardTitle>
              <CardDescription>View student performance and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>No performance data available yet</p>
                <p className="text-sm mt-2">Data will appear here as students take tests</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Login/Logout Activity</CardTitle>
              <CardDescription>Monitor student login activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>No activity logged yet</p>
                <p className="text-sm mt-2">Login activity will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Student Dashboard Component
function StudentDashboard({
  user,
  selectedVideo,
  setSelectedVideo,
  showVideoPlayer,
  setShowVideoPlayer,
  videoCompleted,
  setVideoCompleted,
  showTest,
  setShowTest,
  testQuestions,
  testAnswers,
  setTestAnswers,
  testSubmitted,
  setTestSubmitted,
  submitTest,
  startTest,
  showAIChat,
  setShowAIChat,
  aiMessages,
  setAiMessages,
  aiInput,
  setAiInput,
  sendAIMessage,
  error,
  success,
  setError,
  setSuccess,
  loading
}: any) {
  const videos = [
    // Class 10
    { id: 1, title: 'Class 10 - Video 1', youtubeId: '3aX4hbPWlHo', class: 10, subject: 'General Knowledge' },
    { id: 2, title: 'Class 10 - Video 2', youtubeId: 'bWZ3_ugaA9o', class: 10, subject: 'General Knowledge' },
    { id: 3, title: 'Class 10 - Video 3', youtubeId: 'xbN290n6I-M', class: 10, subject: 'Science' },
    { id: 4, title: 'Class 10 - Video 4', youtubeId: 'tixMF3HF3ks', class: 10, subject: 'Science' },
    // Class 11
    { id: 5, title: 'Class 11 - Physics Unit 2', youtubeId: 'ynT7jfk_VlY', class: 11, subject: 'Physics' },
    { id: 6, title: 'Class 11 - Commerce Unit 1', youtubeId: 'iqNRTQ7WsYA', class: 11, subject: 'Commerce' },
    { id: 7, title: 'Class 11 - Botany Unit 1', youtubeId: 'oEHbUBiDtIw', class: 11, subject: 'Botany' },
    { id: 8, title: 'Class 11 - Computer Application Unit 1', youtubeId: 'd_cri7wV-W4', class: 11, subject: 'Computer Application' },
    // Class 12
    { id: 9, title: 'Class 12 - Physics', youtubeId: 'tmkgFTOxf4g', class: 12, subject: 'Physics' },
    { id: 10, title: 'Class 12 - Chemistry', youtubeId: 'G0PE49XERXo', class: 12, subject: 'Chemistry' },
    { id: 11, title: 'Class 12 - Computer Application', youtubeId: 'WAqc3GVMTgI', class: 12, subject: 'Computer Application' },
    { id: 12, title: 'Class 12 - Commerce', youtubeId: 'ySNdkVRC5wk', class: 12, subject: 'Commerce' },
  ]

  const watchVideo = (video: any) => {
    setSelectedVideo(video)
    setShowVideoPlayer(true)
    setVideoCompleted(false)
  }

  const getSubjectsByStream = () => {
    const streams: Record<string, string[]> = {
      'CSC Maths': ['Physics', 'Chemistry', 'Mathematics', 'Computer Science', 'Tamil', 'English'],
      'Bio Maths': ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Tamil', 'English'],
      'Accounts/Commerce': ['Tamil', 'English', 'Accountancy', 'Commerce', 'Economics', 'Computer Applications or Business Mathematics & Statistics']
    }
    return streams['CSC Maths']
  }

  const subjects = getSubjectsByStream()

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Welcome, {user.name}!</h2>
        <p className="text-gray-600 mt-1">Start learning with video lessons and tests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Videos Watched</CardTitle>
            <BookOpen className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">0</div>
            <p className="text-xs text-gray-500">Completed videos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Taken</CardTitle>
            <BarChart3 className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">0</div>
            <p className="text-xs text-gray-500">MCQ tests completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <CheckCircle className="h-4 w-4 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-600">0%</div>
            <p className="text-xs text-gray-500">Across all tests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Doubts Asked</CardTitle>
            <Users className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">0</div>
            <p className="text-xs text-gray-500">Doubts clarified</p>
          </CardContent>
        </Card>
      </div>

      {/* Video Player */}
      {showVideoPlayer && selectedVideo && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{selectedVideo.title}</CardTitle>
                <CardDescription>{selectedVideo.class} - {selectedVideo.subject}</CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setShowVideoPlayer(false)
                  setShowTest(false)
                  setVideoCompleted(false)
                  setSelectedVideo(null)
                }}
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {!videoCompleted ? (
              <div className="text-center">
                <p className="text-gray-600 mb-4">Watch the full video to unlock the MCQ test</p>
                <Button
                  onClick={() => setVideoCompleted(true)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Completed
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <p className="text-emerald-800 font-semibold">✓ Video Completed!</p>
                  <p className="text-emerald-600 text-sm">You can now take the MCQ test</p>
                </div>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                    {error}
                  </div>
                )}
                {!showTest ? (
                  <Button
                    onClick={startTest}
                    disabled={loading}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    {loading ? 'Loading Questions...' : 'Start MCQ Test (20 Questions)'}
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => setShowTest(false)}>
                    Back to Video
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* MCQ Test */}
      {showTest && !testSubmitted && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>MCQ Test - {selectedVideo?.title}</CardTitle>
            <CardDescription>Answer all questions and submit to see your results</CardDescription>
          </CardHeader>
          <CardContent>
            {testQuestions.length > 0 ? (
              <div className="space-y-6">
                {testQuestions.slice(0, 20).map((q: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <p className="font-semibold mb-4">Q{index + 1}: {q.question || 'Sample question'}</p>
                      <div className="space-y-2">
                        {['A', 'B', 'C', 'D'].map((option, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`question-${index}`}
                              id={`q${index}-opt${i + 1}`}
                              checked={testAnswers[index] === i + 1}
                              onChange={() => setTestAnswers({ ...testAnswers, [index]: i + 1 })}
                              className="w-4 h-4"
                            />
                            <label htmlFor={`q${index}-opt${i + 1}`} className="text-sm">
                              {q[`option${option}` as keyof typeof q] || `Option ${option}`}
                            </label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button onClick={submitTest} className="w-full bg-teal-600 hover:bg-teal-700">
                  Submit Test
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No questions available for this test</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Test Results */}
      {testSubmitted && success && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-emerald-600" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Test Completed!</h3>
              <p className="text-gray-600">{success}</p>
              <Button
                onClick={() => {
                  setTestSubmitted(false)
                  setShowTest(false)
                  setSuccess('')
                }}
                className="mt-4 bg-emerald-600 hover:bg-emerald-700"
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Chat */}
      {showAIChat && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>AI Doubt Clarification</CardTitle>
                <CardDescription>Ask questions and get instant answers</CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowAIChat(false)}
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
              {aiMessages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Ask any question about the video content</p>
                  <p className="text-sm mt-2">AI will help clarify your doubts</p>
                </div>
              )}
              {aiMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendAIMessage()}
                placeholder="Type your question..."
              />
              <Button onClick={sendAIMessage} className="bg-emerald-600 hover:bg-emerald-700">
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subjects Grid */}
      {!showVideoPlayer && !showTest && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Your Subjects</CardTitle>
                <CardDescription>Click on a subject to start learning</CardDescription>
              </div>
              <Button onClick={() => setShowAIChat(true)} className="bg-cyan-600 hover:bg-cyan-700">
                <MessageCircle className="w-4 h-4 mr-2" />
                Ask AI
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="videos" className="space-y-4">
              <TabsList>
                <TabsTrigger value="videos">Video Lessons</TabsTrigger>
                <TabsTrigger value="subjects">Subjects</TabsTrigger>
              </TabsList>

              <TabsContent value="videos">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videos.map((video) => (
                    <Card key={video.id} className="hover:shadow-lg cursor-pointer transition-all">
                      <CardHeader>
                        <CardTitle className="text-lg">{video.title}</CardTitle>
                        <CardDescription>
                          Class {video.class} - {video.subject}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
                          <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${video.youtubeId}`}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                        <Button onClick={() => watchVideo(video)} className="w-full bg-emerald-600 hover:bg-emerald-700">
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Watch & Take Test
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="subjects">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subjects.map((subject, index) => (
                    <Card key={index} className="hover:shadow-lg cursor-pointer transition-all">
                      <CardHeader>
                        <CardTitle className="text-lg">{subject}</CardTitle>
                        <CardDescription>
                          Available videos and tests
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                          Start Learning
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Government Dashboard Component
function GovernmentDashboard({ user }: { user: User }) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Government Dashboard</h2>
        <p className="text-gray-600 mt-1">Monitor educational performance across schools</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <Building2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">0</div>
            <p className="text-xs text-gray-500">Registered schools</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">0</div>
            <p className="text-xs text-gray-500">Across all classes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
            <BarChart3 className="h-4 w-4 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-600">0</div>
            <p className="text-xs text-gray-500">Total test attempts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <CheckCircle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">0%</div>
            <p className="text-xs text-gray-500">Across all tests</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics by Class */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Class 10</CardTitle>
            <CardDescription>Performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Students</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tests Taken</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Score</span>
                <span className="font-semibold text-emerald-600">0%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Class 11</CardTitle>
            <CardDescription>Performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Students</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tests Taken</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Score</span>
                <span className="font-semibold text-teal-600">0%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Class 12</CardTitle>
            <CardDescription>Performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Students</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tests Taken</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Score</span>
                <span className="font-semibold text-cyan-600">0%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Data */}
      <Card>
        <CardHeader>
          <CardTitle>Student Engagement Data</CardTitle>
          <CardDescription>Real-time engagement metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No engagement data available yet</p>
            <p className="text-sm mt-2">Data will appear here as students use the platform</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
