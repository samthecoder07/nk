import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch all classrooms for a teacher
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const teacherId = searchParams.get('teacherId')

    if (!teacherId) {
      return NextResponse.json(
        { error: 'Teacher ID is required' },
        { status: 400 }
      )
    }

    const classrooms = await db.classroom.findMany({
      where: { teacherId },
      include: {
        students: true,
        _count: {
          select: {
            students: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ classrooms })

  } catch (error) {
    console.error('Error fetching classrooms:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new classroom
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { teacherId, schoolName, class: className, stream, students } = body

    // Validate required fields
    if (!teacherId || !schoolName || !className || !stream) {
      return NextResponse.json(
        { error: 'Teacher ID, school name, class, and stream are required' },
        { status: 400 }
      )
    }

    // Validate class
    if (![10, 11, 12].includes(className)) {
      return NextResponse.json(
        { error: 'Class must be 10, 11, or 12' },
        { status: 400 }
      )
    }

    // Validate stream
    const validStreams = ['CSC Maths', 'Bio Maths', 'Accounts/Commerce']
    if (!validStreams.includes(stream)) {
      return NextResponse.json(
        { error: 'Invalid stream' },
        { status: 400 }
      )
    }

    // Create classroom
    const classroom = await db.classroom.create({
      data: {
        name: `Class ${className} - ${stream}`,
        schoolName,
        class: className,
        stream,
        teacherId,
        studentCount: students ? students.length : 0
      }
    })

    // Create students if provided
    if (students && Array.isArray(students) && students.length > 0) {
      for (const student of students) {
        // Check if user already exists
        const existingUser = await db.user.findUnique({
          where: { email: student.email }
        })

        if (!existingUser) {
          // Create user
          const hashedPassword = await import('bcryptjs').then(bcrypt =>
            bcrypt.default.hash(student.password || 'default123', 10)
          )

          const user = await db.user.create({
            data: {
              email: student.email,
              password: hashedPassword,
              name: student.name,
              role: 'student',
              class: className,
              stream,
              isApproved: true // Auto-approve for teacher-created students
            }
          })

          // Create student record
          await db.student.create({
            data: {
              userId: user.id,
              email: user.email,
              name: user.name || '',
              parentEmail: student.parentEmail || '',
              stream,
              classroomId: classroom.id,
              teacherId
            }
          })
        } else if (existingUser.role === 'student') {
          // Update existing student with classroom
          await db.student.update({
            where: { userId: existingUser.id },
            data: {
              classroomId: classroom.id,
              teacherId
            }
          })

          // Update user if needed
          await db.user.update({
            where: { id: existingUser.id },
            data: {
              class: className,
              stream,
              isApproved: true
            }
          })
        }
      }
    }

    return NextResponse.json({
      message: 'Classroom created successfully',
      classroom
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating classroom:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
