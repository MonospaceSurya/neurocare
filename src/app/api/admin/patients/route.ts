import { NextRequest, NextResponse } from 'next/server';

// Mock data - in a real app, this would come from a database
const mockPatients = [
  {
    id: '1',
    user: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567'
    },
    dateOfBirth: '1980-05-15',
    gender: 'Male',
    address: '123 Main St, New York, NY 10001',
    emergencyContact: 'Jane Doe - +1 (555) 987-6543',
    medicalHistory: 'Hypertension, Type 2 Diabetes',
    createdAt: '2024-01-01T00:00:00Z',
    appointments: [
      {
        id: '1',
        date: '2024-01-15',
        time: '10:00 AM',
        doctor: 'Dr. Sarah Chen',
        reason: 'Regular checkup',
        status: 'SCHEDULED',
        notes: 'Patient reports feeling well, no new symptoms'
      },
      {
        id: '2',
        date: '2024-01-10',
        time: '2:00 PM',
        doctor: 'Dr. Michael Roberts',
        reason: 'Follow-up consultation',
        status: 'COMPLETED',
        notes: 'Blood pressure controlled, medication adjusted'
      }
    ],
    voiceRecordings: [
      {
        id: '1',
        audioUrl: '/api/voice/recording1',
        transcript: 'Today I feel good and energetic. I had a good night sleep and woke up refreshed.',
        analysisResult: 'Normal cognitive patterns detected. No signs of cognitive decline.',
        recordingDate: '2024-01-10',
        duration: 180,
        speechRate: 150,
        pauseCount: 5,
        fillerWords: 2,
        pitchVariation: 85,
        volumeLevel: 75,
        clarityScore: 85,
        emotionalTone: 'Positive',
        stressLevel: 'Low',
        confidenceLevel: 92,
        respiratoryRate: 16,
        voiceStability: 88,
        articulationClearness: 90,
        cognitiveLoadIndicator: 'Low'
      },
      {
        id: '2',
        audioUrl: '/api/voice/recording2',
        transcript: 'I been having some trouble remembering things lately. Sometimes I forget where I put my keys.',
        analysisResult: 'Mild cognitive changes detected. Recommend further evaluation.',
        recordingDate: '2024-01-05',
        duration: 165,
        speechRate: 140,
        pauseCount: 8,
        fillerWords: 5,
        pitchVariation: 70,
        volumeLevel: 68,
        clarityScore: 75,
        emotionalTone: 'Concerned',
        stressLevel: 'Medium',
        confidenceLevel: 85,
        respiratoryRate: 18,
        voiceStability: 75,
        articulationClearness: 80,
        cognitiveLoadIndicator: 'Medium'
      }
    ]
  },
  {
    id: '2',
    user: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 (555) 234-5678'
    },
    dateOfBirth: '1975-08-22',
    gender: 'Female',
    address: '456 Oak Ave, Los Angeles, CA 90001',
    emergencyContact: 'Bob Smith - +1 (555) 876-5432',
    medicalHistory: 'Migraines, Anxiety',
    createdAt: '2024-01-05T00:00:00Z',
    appointments: [
      {
        id: '3',
        date: '2024-01-20',
        time: '11:00 AM',
        doctor: 'Dr. Emily Johnson',
        reason: 'Initial consultation',
        status: 'SCHEDULED',
        notes: 'New patient seeking cognitive health assessment'
      }
    ],
    voiceRecordings: [
      {
        id: '3',
        audioUrl: '/api/voice/recording3',
        transcript: 'I am concerned about my memory. My mother had Alzheimer disease and I want to be proactive.',
        analysisResult: 'Normal cognitive patterns for age. No immediate concerns detected.',
        recordingDate: '2024-01-08',
        duration: 195,
        speechRate: 145,
        pauseCount: 6,
        fillerWords: 3,
        pitchVariation: 80,
        volumeLevel: 72,
        clarityScore: 88,
        emotionalTone: 'Concerned but stable',
        stressLevel: 'Low',
        confidenceLevel: 90,
        respiratoryRate: 15,
        voiceStability: 85,
        articulationClearness: 92,
        cognitiveLoadIndicator: 'Low'
      }
    ]
  },
  {
    id: '3',
    user: {
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      phone: '+1 (555) 345-6789'
    },
    dateOfBirth: '1968-12-03',
    gender: 'Male',
    address: '789 Pine St, Chicago, IL 60601',
    emergencyContact: 'Mary Johnson - +1 (555) 765-4321',
    medicalHistory: 'High cholesterol, Arthritis',
    createdAt: '2024-01-10T00:00:00Z',
    appointments: [],
    voiceRecordings: []
  }
];

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would:
    // 1. Verify the user is authenticated and has admin privileges
    // 2. Connect to your database
    // 3. Fetch patients data
    
    // For now, return mock data
    return NextResponse.json(mockPatients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // In a real app, you would:
    // 1. Validate the input data
    // 2. Verify the user is authenticated and has admin privileges
    // 3. Create a new patient in the database
    
    const newPatient = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      appointments: [],
      voiceRecordings: []
    };
    
    return NextResponse.json(newPatient, { status: 201 });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json(
      { error: 'Failed to create patient' },
      { status: 500 }
    );
  }
}