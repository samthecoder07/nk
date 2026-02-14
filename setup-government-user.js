const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient({
  log: ['query'],
})

async function setupGovernmentUser() {
  try {
    // Check if government user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'govoff123@gmail.com' }
    })

    if (existingUser) {
      console.log('✓ Government user already exists')
      console.log('  Email: govoff123@gmail.com')
      console.log('  Role: government')
      return
    }

    // Create government user
    const hashedPassword = await bcrypt.hash('admin123', 10)

    const user = await prisma.user.create({
      data: {
        email: 'govoff123@gmail.com',
        password: hashedPassword,
        name: 'Government Official',
        role: 'government',
        isApproved: true
      }
    })

    console.log('✓ Government user created successfully!')
    console.log('  Email: govoff123@gmail.com')
    console.log('  Password: admin123')
    console.log('  Role: government')

  } catch (error) {
    console.error('Error creating government user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupGovernmentUser()
