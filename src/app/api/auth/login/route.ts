import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { sendLoginNotification } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, role } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // For government portal, check if email is authorized
    if (role === 'government') {
      if (email !== 'govoff123@gmail.com') {
        return NextResponse.json(
          { error: 'Unauthorized government email' },
          { status: 403 }
        )
      }
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if role matches
    if (user.role !== role) {
      return NextResponse.json(
        { error: 'This account does not have permission to access this portal' },
        { status: 403 }
      )
    }

    // Check if student is approved
    if (user.role === 'student' && !user.isApproved) {
      return NextResponse.json(
        { error: 'Your account is pending teacher approval' },
        { status: 403 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create login log
    const loginLog = await db.loginLog.create({
      data: {
        userId: user.id,
        email: user.email,
        role: user.role,
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
      }
    })

    // Send email notification for students
    if (user.role === 'student') {
      // Get student details
      const student = await db.student.findUnique({
        where: { userId: user.id }
      })

      if (student) {
        console.log('Student login details:', {
          studentName: student.name,
          studentEmail: student.email,
          parentEmail: student.parentEmail,
          hasParentEmail: !!student.parentEmail
        })

        // Get teacher email
        let teacherEmail = ''
        if (student.teacherId) {
          const teacher = await db.user.findUnique({
            where: { id: student.teacherId }
          })
          if (teacher) {
            teacherEmail = teacher.email
          }
        }

        // Send login notification asynchronously (don't wait for it)
        sendLoginNotification(
          user.name || 'Student',
          user.schoolName || 'School',
          user.class || 10,
          loginLog.loginTime,
          teacherEmail,
          student.parentEmail
        ).catch(err => {
          console.error('Failed to send login notification:', err)
        })
      }
    }

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
