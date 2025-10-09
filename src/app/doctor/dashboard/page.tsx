'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Users, 
  Calendar, 
  Mic, 
  LogOut, 
  User, 
  FileText, 
  Activity, 
  Brain, 
  TrendingUp, 
  AlertCircle, 
  BarChart3, 
  Clock,
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle,
  Settings,
  Bell,
  Stethoscope,
  Zap,
  Shield,
  Volume2
} from 'lucide-react';

interface Appointment {
  id: string;
  date: string;
  time: string;
  patient: string;
  reason?: string;
  status: string;
  notes?: string;
}

interface VoiceAnalysis {
  id: string;
  patientId: string;
  patientName: string;
  audioUrl: string;
  transcript?: string;
  analysisResult?: string;
  recordingDate: string;
  duration?: number;
  speechRate?: number;
  clarityScore?: number;
  confidenceLevel?: number;
  cognitiveLoadIndicator?: string;
  riskLevel?: string;
}

export default function DoctorDashboard() {
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', date: '2024-01-15', time: '10:00 AM', patient: 'John Doe', status: 'SCHEDULED', reason: 'Regular checkup' },
    { id: '2', date: '2024-01-20', time: '2:00 PM', patient: 'Jane Smith', status: 'COMPLETED', reason: 'Follow-up consultation' }
  ]);
  const [voiceAnalyses, setVoiceAnalyses] = useState<VoiceAnalysis[]>([
    {
      id: '1',
      patientId: '3',
      patientName: 'John Doe',
      audioUrl: '/api/voice/sample',
      transcript: 'Today I feel good and energetic. I had a good night sleep and woke up refreshed.',
      analysisResult: 'Normal cognitive patterns detected. No signs of cognitive decline.',
      recordingDate: '2024-01-10',
      duration: 180,
      speechRate: 150,
      clarityScore: 85,
      confidenceLevel: 92,
      cognitiveLoadIndicator: 'Low',
      riskLevel: 'Low'
    }
  ]);
  const router = useRouter();

  useEffect(() => {
    // Check for existing user session - only run once on mount
    const userData = localStorage.getItem('userInfo');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.role === 'doctor') {
          setUser(parsedUser);
        } else {
          // Clear invalid session and redirect to login
          localStorage.removeItem('userInfo');
          localStorage.removeItem('isAuthenticated');
          router.replace('/auth/login');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('userInfo');
        localStorage.removeItem('isAuthenticated');
        router.replace('/auth/login');
      }
    } else {
      // No user data, redirect to login
      router.replace('/auth/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('isAuthenticated');
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-rose-600" />
            <span className="text-2xl font-bold text-slate-900">NeuroCare AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-slate-600" />
              <span className="text-slate-700">{user.name}</span>
              <Badge variant="secondary">Doctor</Badge>
            </div>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, Dr. {user.name}!
          </h1>
          <p className="text-slate-600">
            Manage your patients and review AI-powered cognitive assessments
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-rose-600" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <CardTitle className="text-lg">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">47</p>
              <p className="text-sm text-slate-600">Under your care</p>
              <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-600 rounded-full" style={{width: '75%'}}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Today's Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">6</p>
              <p className="text-sm text-slate-600">Scheduled today</p>
              <div className="mt-2">
                <Badge className="bg-blue-100 text-blue-800">
                  2 pending reviews
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-purple-600" />
                </div>
                <Activity className="h-4 w-4 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Voice Analyses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">124</p>
              <p className="text-sm text-slate-600">This month</p>
              <div className="mt-2">
                <Badge className="bg-purple-100 text-purple-800">
                  +12% from last month
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <CardTitle className="text-lg">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">94%</p>
              <p className="text-sm text-slate-600">Detection accuracy</p>
              <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-600 rounded-full" style={{width: '94%'}}></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="patients" className="space-y-6">
          <TabsList>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="analyses">Voice Analyses</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Patient Analyses</CardTitle>
                <CardDescription>
                  Review latest AI-powered cognitive assessments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {voiceAnalyses.map(analysis => (
                    <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Brain className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {analysis.patientName}
                          </p>
                          <p className="text-sm text-slate-600">
                            Analysis on {new Date(analysis.recordingDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRiskColor(analysis.riskLevel || 'Low')}>
                          {analysis.riskLevel || 'Low'} Risk
                        </Badge>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analyses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Voice Analysis Review</CardTitle>
                <CardDescription>
                  Detailed cognitive assessment results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">No analyses to review at this time.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>
                  Your patient appointments for today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map(appointment => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {appointment.patient}
                          </p>
                          <p className="text-sm text-slate-600">
                            {appointment.time} - {appointment.reason}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          Join Call
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
                <CardDescription>
                  Manage your availability and appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">Schedule management coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}