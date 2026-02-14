const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient({
  log: ['query'],
})

async function setupTestTeacher() {
  try {
    // Check if teacher already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'teacher@test.com' }
    })

    if (existingUser) {
      console.log('✓ Test teacher already exists')
      console.log('  Email: teacher@test.com')
      console.log('  Password: teacher123')
      console.log('  Role: teacher')
      return
    }

    // Create test teacher
    const hashedPassword = await bcrypt.hash('teacher123', 10)

    const user = await prisma.user.create({
      data: {
        email: 'teacher@test.com',
        password: hashedPassword,
        name: 'Test Teacher',
        phone: '1234567890',
        role: 'teacher',
        schoolName: 'Test School',
        isApproved: true
      }
    })

    console.log('✓ Test teacher created successfully!')
    console.log('  Email: teacher@test.com')
    console.log('  Password: teacher123')
    console.log('  Role: teacher')

  } catch (error) {
    console.error('Error creating test teacher:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupTestTeacher()
