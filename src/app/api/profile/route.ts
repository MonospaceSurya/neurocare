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

    // Get user information
    const user = await db.user.findUnique({
      where: { id: patientId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get patient profile information
    const profile = await db.patientProfile.findUnique({
      where: { patientId }
    })

    return NextResponse.json({
      user,
      dateOfBirth: profile?.dateOfBirth,
      gender: profile?.gender,
      address: profile?.address,
      emergencyContact: profile?.emergencyContact,
      emergencyPhone: profile?.emergencyPhone,
      bloodType: profile?.bloodType,
      allergies: profile?.allergies,
      medications: profile?.medications,
      medicalHistory: profile?.medicalHistory
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { patientId, profileData } = body

    if (!patientId || !profileData) {
      return NextResponse.json(
        { error: 'Patient ID and profile data are required' },
        { status: 400 }
      )
    }

    // Update user information
    await db.user.update({
      where: { id: patientId },
      data: {
        name: profileData.fullName,
        phone: profileData.phone,
        email: profileData.email
      }
    })

    // Upsert patient profile
    const profile = await db.patientProfile.upsert({
      where: { patientId },
      update: {
        dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : undefined,
        gender: profileData.gender,
        address: profileData.address,
        emergencyContact: profileData.emergencyContact,
        emergencyPhone: profileData.emergencyPhone,
        bloodType: profileData.bloodType,
        allergies: profileData.allergies,
        medications: profileData.medications,
        medicalHistory: profileData.medicalHistory
      },
      create: {
        patientId,
        dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : undefined,
        gender: profileData.gender,
        address: profileData.address,
        emergencyContact: profileData.emergencyContact,
        emergencyPhone: profileData.emergencyPhone,
        bloodType: profileData.bloodType,
        allergies: profileData.allergies,
        medications: profileData.medications,
        medicalHistory: profileData.medicalHistory
      }
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}