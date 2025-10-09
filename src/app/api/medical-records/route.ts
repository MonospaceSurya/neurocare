import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  try {
  const db = getDb()
  const medicalRecords = await db.medicalRecord.findMany({
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    })

    return NextResponse.json(medicalRecords)
  } catch (error) {
    console.error('Error fetching medical records:', error)
    return NextResponse.json(
      { error: 'Failed to fetch medical records' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
  const db = getDb()
  const body = await request.json()
    const { patientId, title, description, category, fileName, fileType, fileSize } = body

    if (!patientId || !title || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const medicalRecord = await db.medicalRecord.create({
      data: {
        patientId,
        title,
        description,
        category,
        fileName,
        fileType,
        fileSize,
        status: 'PROCESSING'
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(medicalRecord, { status: 201 })
  } catch (error) {
    console.error('Error creating medical record:', error)
    return NextResponse.json(
      { error: 'Failed to create medical record' },
      { status: 500 }
    )
  }
}