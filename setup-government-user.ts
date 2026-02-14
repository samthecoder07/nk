import { db } from './src/lib/db'
import bcrypt from 'bcryptjs'

async function setupGovernmentUser() {
  try {
    // Check if government user already exists
    const existingUser = await db.user.findUnique({
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

    const user = await db.user.create({
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
    await db.$disconnect()
  }
}

setupGovernmentUser()
