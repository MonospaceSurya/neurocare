import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId')
    
    if (!patientId) {
      return NextResponse.json(
        { error: 'Patient ID is required' },
        { status: 400 }
      )
    }

    const reports = await db.medicalRecord.findMany({
      where: {
        patientId: patientId
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    })

    return NextResponse.json(reports)
  } catch (error) {
    console.error('Error fetching medical reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch medical reports' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const patientId = formData.get('patientId') as string
    const file = formData.get('file') as File
    const reportName = formData.get('reportName') as string
    const uploadDate = formData.get('uploadDate') as string

    if (!patientId || !file || !reportName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // In a real implementation, you would upload the file to a storage service
    // For now, we'll just store the file metadata
    const report = await db.medicalRecord.create({
      data: {
        patientId,
        title: reportName,
        fileName: reportName,
        fileType: file.type,
        fileSize: file.size,
        uploadedAt: uploadDate ? new Date(uploadDate) : new Date(),
        // In production, store the actual file URL from your storage service
        fileUrl: `/uploads/${reportName}`,
        status: 'UPLOADED'
      }
    })

    return NextResponse.json(report, { status: 201 })
  } catch (error) {
    console.error('Error uploading medical report:', error)
    return NextResponse.json(
      { error: 'Failed to upload medical report' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reportId = searchParams.get('reportId')
    
    if (!reportId) {
      return NextResponse.json(
        { error: 'Report ID is required' },
        { status: 400 }
      )
    }

    // Delete the report from database
    await db.medicalRecord.delete({
      where: {
        id: reportId
      }
    })

    return NextResponse.json({ message: 'Report deleted successfully' })
  } catch (error) {
    console.error('Error deleting medical report:', error)
    return NextResponse.json(
      { error: 'Failed to delete medical report' },
      { status: 500 }
    )
  }
}