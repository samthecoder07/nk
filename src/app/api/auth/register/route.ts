import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, name, phone, schoolName, role, parentEmail } = body

    console.log('Registration attempt:', { email, role, name, schoolName, phone })

    // Validate required fields
    if (!email || !password) {
      console.log('Missing email or password')
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('User already exists:', email)
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log('Password hashed')

    // Create user based on role
    let userData: any = {
      email,
      password: hashedPassword,
      role
    }

    // Add role-specific fields
    if (role === 'teacher') {
      console.log('Creating teacher user')
      if (!name || !schoolName || !phone) {
        console.log('Missing teacher fields:', { name, schoolName, phone })
        return NextResponse.json(
          { error: 'Name, school name, and phone are required for teacher registration' },
          { status: 400 }
        )
      }
      userData.name = name
      userData.schoolName = schoolName
      userData.phone = phone
      userData.isApproved = true // Teachers are auto-approved
    } else if (role === 'student') {
      console.log('Creating student user')
      if (!name || !parentEmail) {
        console.log('Missing student fields:', { name, parentEmail })
        return NextResponse.json(
          { error: 'Name and parent email are required for student registration' },
          { status: 400 }
        )
      }
      userData.name = name
      userData.isApproved = false // Students need teacher approval
    }

    console.log('Creating user with data:', { email, role, name, schoolName })
    // Create user
    const user = await db.user.create({
      data: userData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        schoolName: true,
        isApproved: true,
        createdAt: true
      }
    })

    console.log('User created successfully:', user.id)

    // Create student record if role is student
    if (role === 'student') {
      await db.student.create({
        data: {
          userId: user.id,
          email: user.email,
          name: user.name || '',
          parentEmail,
          stream: 'CSC Maths' // Default stream, will be updated by teacher
        }
      })
      console.log('Student record created')
    }

    return NextResponse.json({
      message: 'Registration successful',
      user
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
