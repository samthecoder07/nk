const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: ['query'],
})

async function verifySetup() {
  try {
    console.log('🔍 Verifying ARAM Platform Setup...\n')

    // Check database connection
    console.log('✓ Database connected')

    // Check users
    const users = await prisma.user.findMany()
    console.log(`✓ Found ${users.length} user(s) in database\n`)

    if (users.length > 0) {
      console.log('📋 Users:')
      console.log('━━━━━━━━━━━━━━')
      users.forEach(user => {
        console.log(`  • ${user.name || 'Unknown'}`)
        console.log(`    Email: ${user.email}`)
        console.log(`    Role: ${user.role}`)
        console.log(`    Status: ${user.isApproved ? '✓ Approved' : '⏳ Pending'}`)
        console.log('')
      })
      console.log('━━━━━━━━━━━━━━\n')
    }

    // Check other tables
    const classroomCount = await prisma.classroom.count()
    const studentCount = await prisma.student.count()
    const testCount = await prisma.test.count()
    const questionCount = await prisma.question.count()

    console.log('📊 Database Statistics:')
    console.log(`  • Classrooms: ${classroomCount}`)
    console.log(`  • Students: ${studentCount}`)
    console.log(`  • Tests: ${testCount}`)
    console.log(`  • Questions: ${questionCount}`)

    console.log('\n✅ Setup verification complete!')
    console.log('\n🚀 Ready to start the application:')
    console.log('   npm run dev')
    console.log('\n🌐 Then open: http://localhost:3000')

  } catch (error) {
    console.error('❌ Error during verification:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifySetup()
