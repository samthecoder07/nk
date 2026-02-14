import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendLogoutNotification } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId } = body

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Find the most recent login log without logout time
    const loginLog = await db.loginLog.findFirst({
      where: {
        userId,
        logoutTime: null
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (loginLog) {
      // Update the login log with logout time
      const updatedLog = await db.loginLog.update({
        where: { id: loginLog.id },
        data: {
          logoutTime: new Date()
        }
      })

      // Send email notification for students
      if (loginLog.role === 'student') {
        // Get user details
        const user = await db.user.findUnique({
          where: { id: userId }
        })

        if (user) {
          // Get student details
          const student = await db.student.findUnique({
            where: { userId: user.id }
          })

          if (student) {
            console.log('Student logout details:', {
              studentName: student.name,
              studentEmail: student.email,
              parentEmail: student.parentEmail,
              hasParentEmail: !!student.parentEmail,
              loginTime: loginLog.loginTime,
              logoutTime: updatedLog.logoutTime
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

            // Send logout notification asynchronously (don't wait for it)
            sendLogoutNotification(
              user.name || 'Student',
              user.schoolName || 'School',
              user.class || 10,
              loginLog.loginTime,
              updatedLog.logoutTime,
              teacherEmail,
              student.parentEmail
            ).catch(err => {
              console.error('Failed to send logout notification:', err)
            })
          }
        }
      }
    }

    return NextResponse.json({
      message: 'Logout successful'
    })

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
