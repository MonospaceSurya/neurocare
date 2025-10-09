import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const appointments = await db.appointment.findMany({
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        doctor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { patientId, doctorId, date, time, reason } = body

    if (!patientId || !date || !time || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const appointment = await db.appointment.create({
      data: {
        patientId,
        doctorId,
        date: new Date(date),
        time,
        reason,
        status: 'PENDING'
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        doctor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
}