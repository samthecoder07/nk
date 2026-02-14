import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const subject = searchParams.get('subject')
    const classNumber = searchParams.get('class')
    const stream = searchParams.get('stream')

    // Build where clause
    const whereClause: any = {}
    if (subject) whereClause.subject = subject
    if (classNumber) whereClause.class = parseInt(classNumber)
    if (stream) whereClause.stream = stream

    // Fetch questions
    const questions = await db.question.findMany({
      where: whereClause,
      orderBy: { createdAt: 'asc' }
    })

    // Group by subject for better organization
    const groupedQuestions = questions.reduce((acc: any, q) => {
      const key = q.subject
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(q)
      return acc
    }, {})

    return NextResponse.json({
      questions,
      grouped: groupedQuestions,
      total: questions.length
    })

  } catch (error) {
    console.error('Error fetching MCQs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch MCQ questions' },
      { status: 500 }
    )
  }
}
