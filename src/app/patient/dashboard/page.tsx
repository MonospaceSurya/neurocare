'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Calendar as CalendarIcon, Clock, Mic, MicOff, Play, Pause, Activity, FileText, BarChart3, User, LogOut, Home, Bell, Menu, Settings, Users, CheckCircle, TrendingUp, Pill, Plus, X, Volume2, Download, AlertCircle, Video, Phone, ChevronRight, Upload, FileAudio, Brain, Target, Zap, Award, Lightbulb, MapPin, Lock, Shield, Smartphone } from 'lucide-react';
import AppointmentBookingPopup from '@/components/appointment-booking-popup';

interface Appointment {
  id: string;
  doctor: string;
  date: string;
  time: string;
  duration: string;
  reason: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  type: 'in-person' | 'video' | 'phone';
  location?: string;
  videoLink?: string;
  phoneNumber?: string;
  notes?: string;
  audioRecording?: string;
  preparation?: string[];
  followUp?: string;
}

interface HealthMetric {
  label: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  icon: any;
}

interface VoiceRecording {
  id: string;
  date: string;
  duration: number;
  transcript: string;
  analysis: {
    clarityScore: number;
    confidenceLevel: number;
    riskAssessment: string;
    recommendations: string[];
  };
  audioUrl: string;
}

interface AppointmentData {
  date: string;
  time: string;
  doctor: string;
  reason: string;
  symptoms: string;
  medicalHistory: string;
}

interface VoiceAnalysis {
  duration: number;
  transcript: string;
  speechRate: number;
  clarityScore: number;
  confidenceLevel: number;
  cognitiveLoadIndicator: string;
  riskAssessment: string;
  recommendations: string[];
}

export default function PatientDashboard() {
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [voiceRecordings, setVoiceRecordings] = useState<VoiceRecording[]>([]);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'appointment',
      title: 'Appointment Confirmed',
      message: 'Your appointment with Dr. Sarah Smith has been confirmed for January 15th at 3:00 PM',
      time: '2 hours ago',
      read: false,
      icon: CalendarIcon,
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    {
      id: '2',
      type: 'voice_analysis',
      title: 'Voice Analysis Complete',
      message: 'Your latest voice analysis shows improvement in clarity scores. View detailed results.',
      time: '1 day ago',
      read: false,
      icon: Mic,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      id: '3',
      type: 'report',
      title: 'Medical Report Available',
      message: 'Dr. Emily Davis has uploaded your cognitive assessment report.',
      time: '2 days ago',
      read: true,
      icon: FileText,
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      id: '4',
      type: 'reminder',
      title: 'Medication Reminder',
      message: 'Reminder: Take your blood pressure medication as prescribed.',
      time: '3 days ago',
      read: true,
      icon: Pill,
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      id: '5',
      type: 'appointment',
      title: 'Appointment Rescheduled',
      message: 'Your appointment with Dr. Michael Johnson has been rescheduled to January 22nd.',
      time: '1 week ago',
      read: true,
      icon: CalendarIcon,
      color: 'bg-rose-50 text-rose-700 border-rose-200'
    }
  ]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAppointmentBooking, setShowAppointmentBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const router = useRouter();

  // Appointment booking form state
  const [appointmentForm, setAppointmentForm] = useState({
    doctor: '',
    date: '',
    time: '',
    reason: '',
    type: 'in-person' as 'in-person' | 'video' | 'phone',
    notes: ''
  });

  // Cognitive health insights data
  const [cognitiveInsights] = useState([
    { 
      title: 'Voice Clarity', 
      value: '85%', 
      status: 'good', 
      trend: 'up', 
      icon: Mic, 
      description: 'Your voice clarity has improved by 5% this month',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    { 
      title: 'Memory Recall', 
      value: '92%', 
      status: 'excellent', 
      trend: 'stable', 
      icon: Brain, 
      description: 'Consistent performance in memory tests',
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    { 
      title: 'Speech Pattern', 
      value: '78%', 
      status: 'good', 
      trend: 'up', 
      icon: Activity, 
      description: 'Speech patterns show positive progression',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    { 
      title: 'Cognitive Score', 
      value: '88%', 
      status: 'excellent', 
      trend: 'up', 
      icon: Target, 
      description: 'Overall cognitive health is excellent',
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    }
  ]);

  const menuItems = [
    { icon: Home, label: 'Overview', id: 'overview', color: 'bg-rose-600' },
    { icon: CalendarIcon, label: 'Appointments', id: 'appointments', color: 'bg-purple-600' },
    { icon: Mic, label: 'Voice Analysis', id: 'voice', color: 'bg-green-600' },
    { icon: FileText, label: 'Medical Reports', id: 'reports', color: 'bg-orange-600' },
    { icon: BarChart3, label: 'Progress', id: 'progress', color: 'bg-pink-600' },
    { icon: Bell, label: 'Notifications', id: 'notifications', color: 'bg-blue-600' },
    { icon: User, label: 'Profile', id: 'profile', color: 'bg-slate-600' },
    { icon: Users, label: 'Care Team', id: 'care-team', color: 'bg-slate-600' },
    { icon: Settings, label: 'Settings', id: 'settings', color: 'bg-slate-600' }
  ];

  const doctors = [
    { id: '1', name: 'Dr. Sarah Smith', specialty: 'Neurologist', available: true },
    { id: '2', name: 'Dr. Michael Johnson', specialty: 'Cardiologist', available: true },
    { id: '3', name: 'Dr. Emily Davis', specialty: 'General Practitioner', available: false },
    { id: '4', name: 'Dr. Robert Wilson', specialty: 'Psychiatrist', available: true }
  ];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('userInfo');
    if (!userData) {
      router.push('/auth/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Mock appointments data
    setAppointments([
      {
        id: '1',
        doctor: 'Dr. Sarah Smith',
        date: '2024-01-15',
        time: '3:00 PM',
        duration: '45 minutes',
        reason: 'Regular neurological checkup',
        status: 'confirmed',
        type: 'in-person',
        location: 'NeuroCare Medical Center, Room 302',
        notes: 'Patient reports occasional headaches. Bring previous MRI scans.',
        audioRecording: 'recording_1',
        preparation: ['Bring list of current medications', 'Prepare questions about symptoms', 'Arrive 15 minutes early'],
        followUp: 'Schedule follow-up in 3 months if symptoms persist'
      },
      {
        id: '2',
        doctor: 'Dr. Michael Johnson',
        date: '2024-01-22',
        time: '10:00 AM',
        duration: '30 minutes',
        reason: 'Cardiovascular follow-up',
        status: 'pending',
        type: 'video',
        videoLink: 'https://meet.neurocare.ai/join/abc123',
        notes: 'Review blood pressure medication effectiveness',
        preparation: ['Check blood pressure before call', 'Have medication list ready', 'Test video connection'],
        followUp: 'Adjust medication based on readings'
      },
      {
        id: '3',
        doctor: 'Dr. Emily Davis',
        date: '2024-01-08',
        time: '2:30 PM',
        duration: '60 minutes',
        reason: 'Cognitive assessment',
        status: 'completed',
        type: 'phone',
        phoneNumber: '+1 (555) 123-4567',
        notes: 'Comprehensive cognitive evaluation completed',
        audioRecording: 'recording_2',
        preparation: ['Ensure quiet environment', 'Have water available', 'Complete pre-assessment forms'],
        followUp: 'Results discussed, next assessment in 6 months'
      }
    ]);

    // Mock voice recordings
    setVoiceRecordings([
      {
        id: 'recording_1',
        date: '2024-01-10',
        duration: 45,
        transcript: 'The patient speaks clearly with good articulation. Speech rate is normal. No significant dysarthria detected.',
        analysis: {
          clarityScore: 85,
          confidenceLevel: 92,
          riskAssessment: 'Low risk - normal cognitive patterns detected',
          recommendations: ['Continue regular monitoring', 'Maintain healthy lifestyle', 'Follow up in 3 months']
        },
        audioUrl: '/api/mock-audio-1'
      },
      {
        id: 'recording_2',
        date: '2024-01-05',
        duration: 38,
        transcript: 'Patient demonstrates slight hesitation in speech but overall coherence is maintained. Memory recall appears intact.',
        analysis: {
          clarityScore: 78,
          confidenceLevel: 88,
          riskAssessment: 'Mild cognitive changes - monitor closely',
          recommendations: ['Increase monitoring frequency', 'Consider cognitive exercises', 'Schedule follow-up in 1 month']
        },
        audioUrl: '/api/mock-audio-2'
      }
    ]);
  }, [router]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('isAuthenticated');
    router.push('/');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const playAudio = (audioUrl: string, recordingId: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    audio.addEventListener('loadedmetadata', () => {
      setAudioDuration(audio.duration);
    });
    
    audio.addEventListener('timeupdate', () => {
      setAudioProgress((audio.currentTime / audio.duration) * 100);
    });
    
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentlyPlaying(null);
      setAudioProgress(0);
    });
    
    audio.addEventListener('error', (e) => {
      console.error('Audio playback error:', e);
      setIsPlaying(false);
      setCurrentlyPlaying(null);
      alert('Error playing audio. Please try again.');
    });
    
    audio.play();
    setIsPlaying(true);
    setCurrentlyPlaying(recordingId);
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentlyPlaying(null);
    setAudioProgress(0);
  };

  const togglePlayPause = (audioUrl: string, recordingId: string) => {
    if (isPlaying && currentlyPlaying === recordingId) {
      stopAudio();
    } else {
      playAudio(audioUrl, recordingId);
    }
  };

  const submitAppointment = () => {
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      doctor: doctors.find(d => d.id === appointmentForm.doctor)?.name || '',
      date: appointmentForm.date,
      time: appointmentForm.time,
      duration: '30 minutes',
      reason: appointmentForm.reason,
      status: 'pending',
      type: appointmentForm.type,
      notes: appointmentForm.notes
    };

    setAppointments([...appointments, newAppointment]);
    setShowAppointmentBooking(false);
    setBookingStep(1);
    setAppointmentForm({
      doctor: '',
      date: '',
      time: '',
      reason: '',
      type: 'in-person',
      notes: ''
    });
    
    alert('Appointment booked successfully! You will receive a confirmation shortly.');
  };

  const handlePopupAppointmentSubmit = (appointmentData: AppointmentData, voiceAnalysis: VoiceAnalysis) => {
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      doctor: appointmentData.doctor,
      date: appointmentData.date,
      time: appointmentData.time,
      duration: '45 minutes',
      reason: appointmentData.reason,
      status: 'pending',
      type: 'in-person',
      notes: `Symptoms: ${appointmentData.symptoms}\nMedical History: ${appointmentData.medicalHistory}\nVoice Analysis: Clarity ${voiceAnalysis.clarityScore}%, Confidence ${voiceAnalysis.confidenceLevel}%\nRisk Assessment: ${voiceAnalysis.riskAssessment}`,
      audioRecording: `voice_analysis_${Date.now()}`
    };

    setAppointments([...appointments, newAppointment]);
    alert('Appointment booked successfully! Your voice analysis has been included for the medical team to review. You will receive a confirmation shortly.');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      default: return <CalendarIcon className="h-4 w-4" />;
    }
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`bg-white border-r border-slate-200 fixed left-0 top-0 h-screen z-30 flex flex-col transition-all duration-300 ease-in-out shadow-xl ${
        sidebarOpen ? 'w-72' : 'w-0 lg:w-20'
      } overflow-hidden`}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-200 flex-shrink-0 bg-gradient-to-r from-rose-50 to-pink-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-rose-600 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div className={`transition-all duration-300 ${
              sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 lg:opacity-100 lg:translate-x-0'
            }`}>
              <h1 className="text-xl font-bold text-slate-800">NeuroCare</h1>
              <p className="text-xs text-slate-500">Patient Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left group ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 border border-rose-200 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                activeTab === item.id ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
              }`}>
                <item.icon className="h-4 w-4" />
              </div>
              <span className={`font-medium transition-all duration-300 ${
                sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 lg:opacity-100 lg:translate-x-0'
              }`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/api/placeholder/40/40" alt="Patient" />
              <AvatarFallback className="bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold">
                {user?.name?.charAt(0) || 'P'}
              </AvatarFallback>
            </Avatar>
            <div className={`flex-1 transition-all duration-300 ${
              sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 lg:opacity-100 lg:translate-x-0'
            }`}>
              <p className="font-medium text-slate-800 text-sm">{user?.name || 'Patient'}</p>
              <p className="text-xs text-slate-500">Patient Account</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'
      } ml-0`}>
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 backdrop-blur-sm bg-white/90">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    {menuItems.find(item => item.id === activeTab)?.label || 'Overview'}
                  </h2>
                  <p className="text-sm text-slate-500">Welcome back, {user?.name || 'Patient'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800 hover:bg-slate-100">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={() => setShowAppointmentBooking(true)}
                  className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-500">Next Appointment</p>
                        <p className="text-2xl font-bold text-slate-800">Today</p>
                        <p className="text-sm text-slate-500">3:00 PM</p>
                      </div>
                      <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                        <CalendarIcon className="h-6 w-6 text-rose-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-500">Voice Score</p>
                        <p className="text-2xl font-bold text-slate-800">85%</p>
                        <p className="text-sm text-green-600">Good</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Mic className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-500">Medications</p>
                        <p className="text-2xl font-bold text-slate-800">4</p>
                        <p className="text-sm text-slate-500">Active</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Pill className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-500">Reports</p>
                        <p className="text-2xl font-bold text-slate-800">12</p>
                        <p className="text-sm text-slate-500">Total</p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                        <FileText className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Cognitive Health Insights */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-rose-600" />
                    Cognitive Health Insights
                  </CardTitle>
                  <CardDescription>
                    Your cognitive health metrics and trends based on voice analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {cognitiveInsights.map((insight, index) => (
                      <div key={index} className={`p-4 border rounded-xl hover:shadow-sm transition-all duration-200 ${insight.color}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/80 rounded-lg flex items-center justify-center">
                              <insight.icon className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-medium">{insight.title}</span>
                          </div>
                          <div className={`flex items-center gap-1 text-xs ${
                            insight.trend === 'up' ? 'text-green-600' : 'text-slate-500'
                          }`}>
                            {insight.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                            {insight.trend === 'stable' && <div className="w-3 h-3 bg-slate-400 rounded-full" />}
                            <span>{insight.trend}</span>
                          </div>
                        </div>
                        <div className="flex items-end justify-between mb-2">
                          <span className="text-2xl font-bold">{insight.value}</span>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            insight.status === 'excellent' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
                          }`}>
                            {insight.status}
                          </div>
                        </div>
                        <p className="text-xs opacity-80">{insight.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Calendar */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-purple-600" />
                    Health Calendar
                  </CardTitle>
                  <CardDescription>
                    Your upcoming appointments and health reminders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-xs font-medium text-slate-500 py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 35 }, (_, i) => {
                      const day = i - 2; // Start from current week
                      const isToday = day === 15;
                      const hasAppointment = [5, 12, 15, 22, 28].includes(day);
                      const isCurrentMonth = day >= 1 && day <= 31;
                      
                      return (
                        <div
                          key={i}
                          className={`
                            aspect-square flex items-center justify-center rounded-lg text-sm cursor-pointer transition-colors
                            ${isToday ? 'bg-rose-600 text-white font-bold' : ''}
                            ${hasAppointment && !isToday ? 'bg-purple-100 text-purple-700 font-medium' : ''}
                            ${!isToday && !hasAppointment && isCurrentMonth ? 'hover:bg-slate-100' : ''}
                            ${!isCurrentMonth ? 'text-slate-300' : ''}
                          `}
                        >
                          {isCurrentMonth ? day : ''}
                          {hasAppointment && !isToday && (
                            <div className="absolute w-1 h-1 bg-purple-600 rounded-full mt-4 ml-4"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-rose-600 rounded"></div>
                      <span>Today</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-100 rounded"></div>
                      <span>Appointment</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Appointments */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-purple-600" />
                    Recent Appointments
                  </CardTitle>
                  <CardDescription>
                    Your latest appointments and consultations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointments.slice(0, 3).map((appointment) => (
                      <div key={appointment.id} className="p-4 border border-slate-200 rounded-xl hover:shadow-sm transition-shadow duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                              {getStatusIcon(appointment.type)}
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{appointment.doctor}</p>
                              <p className="text-sm text-slate-500">{appointment.date} at {appointment.time}</p>
                              <p className="text-sm text-slate-500">{appointment.reason}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-purple-600" />
                    All Appointments
                  </CardTitle>
                  <CardDescription>
                    Your scheduled appointments and consultation history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointments.length > 0 ? appointments.map((appointment) => (
                      <div key={appointment.id} className="border border-slate-200 rounded-xl hover:shadow-sm transition-all duration-200 overflow-hidden">
                        {/* Appointment Header */}
                        <div className="p-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                {getStatusIcon(appointment.type)}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800 text-lg">{appointment.doctor}</p>
                                <div className="flex items-center gap-3 text-sm text-slate-600 mt-1">
                                  <span className="flex items-center gap-1">
                                    <CalendarIcon className="h-3 w-3" />
                                    {appointment.date}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {appointment.time}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Activity className="h-3 w-3" />
                                    {appointment.duration}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge className={getStatusColor(appointment.status)}>
                                {appointment.status}
                              </Badge>
                              <div className="flex items-center gap-1 text-xs text-slate-500">
                                {appointment.type === 'in-person' && <MapPin className="h-3 w-3" />}
                                {appointment.type === 'video' && <Video className="h-3 w-3" />}
                                {appointment.type === 'phone' && <Phone className="h-3 w-3" />}
                                <span className="capitalize">{appointment.type.replace('-', ' ')}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Appointment Details */}
                        <div className="p-4 space-y-4">
                          {/* Reason and Location */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-slate-700 mb-1">Reason for Visit</p>
                              <p className="text-sm text-slate-600">{appointment.reason}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-700 mb-1">Location/Contact</p>
                              {appointment.location && (
                                <p className="text-sm text-slate-600 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {appointment.location}
                                </p>
                              )}
                              {appointment.videoLink && (
                                <a href={appointment.videoLink} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                  <Video className="h-3 w-3" />
                                  Join Video Call
                                </a>
                              )}
                              {appointment.phoneNumber && (
                                <p className="text-sm text-slate-600 flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {appointment.phoneNumber}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Preparation Instructions */}
                          {appointment.preparation && appointment.preparation.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-slate-700 mb-2">Preparation Instructions</p>
                              <ul className="space-y-1">
                                {appointment.preparation.map((prep, index) => (
                                  <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                                    <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                    {prep}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Notes */}
                          {appointment.notes && (
                            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                              <p className="text-sm font-medium text-amber-800 mb-1">Notes</p>
                              <p className="text-sm text-amber-700">{appointment.notes}</p>
                            </div>
                          )}

                          {/* Follow-up */}
                          {appointment.followUp && (
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <p className="text-sm font-medium text-blue-800 mb-1">Follow-up Plan</p>
                              <p className="text-sm text-blue-700">{appointment.followUp}</p>
                            </div>
                          )}

                          {/* Audio Recording */}
                          {appointment.audioRecording && (
                            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <FileAudio className="h-4 w-4 text-green-600" />
                                  <span className="text-sm text-green-800">Voice recording available</span>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const recording = voiceRecordings.find(r => r.id === appointment.audioRecording);
                                    if (recording) {
                                      togglePlayPause(recording.audioUrl, recording.id);
                                    }
                                  }}
                                >
                                  {isPlaying && currentlyPlaying === appointment.audioRecording ? (
                                    <><Pause className="h-3 w-3 mr-1" /> Pause</>
                                  ) : (
                                    <><Play className="h-3 w-3 mr-1" /> Play</>
                                  )}
                                </Button>
                              </div>
                              {isPlaying && currentlyPlaying === appointment.audioRecording && (
                                <div className="mt-3">
                                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                                    <span>0:00</span>
                                    <div className="flex-1 bg-slate-200 rounded-full h-1">
                                      <div 
                                        className="bg-rose-600 h-1 rounded-full transition-all duration-100"
                                        style={{ width: `${audioProgress}%` }}
                                      />
                                    </div>
                                    <span>{formatTime(Math.floor(audioDuration))}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-2">
                            {appointment.status === 'confirmed' && appointment.type === 'video' && (
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                <Video className="h-3 w-3 mr-1" />
                                Join Call
                              </Button>
                            )}
                            {appointment.status === 'confirmed' && appointment.type === 'in-person' && (
                              <Button size="sm" variant="outline">
                                <CalendarIcon className="h-3 w-3 mr-1" />
                                Add to Calendar
                              </Button>
                            )}
                            {appointment.status === 'pending' && (
                              <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                                Cancel Appointment
                              </Button>
                            )}
                            {appointment.status === 'completed' && (
                              <Button size="sm" variant="outline">
                                <FileText className="h-3 w-3 mr-1" />
                                View Report
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8">
                        <CalendarIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">No appointments scheduled</p>
                        <Button 
                          onClick={() => setShowAppointmentBooking(true)}
                          className="mt-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Schedule Appointment
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Voice Analysis Tab */}
          {activeTab === 'voice' && (
            <div className="space-y-6">
              {/* Voice Recording Section */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="h-5 w-5 text-green-600" />
                    Voice Recording
                  </CardTitle>
                  <CardDescription>
                    Record your voice for cognitive analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 rounded-xl">
                      {isRecording ? (
                        <div className="text-center">
                          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                            <Mic className="h-10 w-10 text-red-600" />
                          </div>
                          <p className="text-lg font-medium text-slate-800 mb-2">Recording...</p>
                          <p className="text-2xl font-bold text-red-600 mb-4">{formatTime(recordingTime)}</p>
                          <Button onClick={stopRecording} variant="destructive" size="lg">
                            <MicOff className="h-4 w-4 mr-2" />
                            Stop Recording
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <Mic className="h-10 w-10 text-green-600" />
                          </div>
                          <p className="text-lg font-medium text-slate-800 mb-2">Ready to Record</p>
                          <p className="text-sm text-slate-500 mb-4">Click the button below to start recording your voice</p>
                          <Button onClick={startRecording} className="bg-green-600 hover:bg-green-700" size="lg">
                            <Mic className="h-4 w-4 mr-2" />
                            Start Recording
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {audioUrl && (
                      <div className="p-4 bg-green-50 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileAudio className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">Recording saved</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => togglePlayPause(audioUrl, 'current')}
                              disabled={!audioUrl}
                            >
                              {isPlaying && currentlyPlaying === 'current' ? (
                                <><Pause className="h-3 w-3 mr-1" /> Pause</>
                              ) : (
                                <><Play className="h-3 w-3 mr-1" /> Play</>
                              )}
                            </Button>
                            <Button variant="outline" size="sm" disabled={!audioUrl}>
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                          {isPlaying && currentlyPlaying === 'current' && (
                            <div className="mt-3">
                              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                                <span>0:00</span>
                                <div className="flex-1 bg-slate-200 rounded-full h-1">
                                  <div 
                                    className="bg-rose-600 h-1 rounded-full transition-all duration-100"
                                    style={{ width: `${audioProgress}%` }}
                                  />
                                </div>
                                <span>{formatTime(Math.floor(audioDuration))}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Voice Recordings History */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileAudio className="h-5 w-5 text-green-600" />
                    Voice Recordings History
                  </CardTitle>
                  <CardDescription>
                    Your previous voice recordings and analysis results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {voiceRecordings.map((recording) => (
                      <div key={recording.id} className="p-4 border border-slate-200 rounded-xl hover:shadow-sm transition-shadow duration-200">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium text-slate-800">{recording.date}</p>
                            <p className="text-sm text-slate-500">Duration: {formatTime(recording.duration)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => togglePlayPause(recording.audioUrl, recording.id)}
                            >
                              {isPlaying && currentlyPlaying === recording.id ? (
                                <><Pause className="h-3 w-3 mr-1" /> Pause</>
                              ) : (
                                <><Play className="h-3 w-3 mr-1" /> Play</>
                              )}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                        
                        {isPlaying && currentlyPlaying === recording.id && (
                          <div className="mb-3">
                            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                              <span>0:00</span>
                              <div className="flex-1 bg-slate-200 rounded-full h-1">
                                <div 
                                  className="bg-rose-600 h-1 rounded-full transition-all duration-100"
                                  style={{ width: `${audioProgress}%` }}
                                />
                              </div>
                              <span>{formatTime(Math.floor(audioDuration))}</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs text-blue-600 font-medium">Clarity Score</p>
                            <p className="text-lg font-bold text-blue-800">{recording.analysis.clarityScore}%</p>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <p className="text-xs text-green-600 font-medium">Confidence Level</p>
                            <p className="text-lg font-bold text-green-800">{recording.analysis.confidenceLevel}%</p>
                          </div>
                          <div className="p-3 bg-purple-50 rounded-lg">
                            <p className="text-xs text-purple-600 font-medium">Risk Assessment</p>
                            <p className="text-sm font-bold text-purple-800">{recording.analysis.riskAssessment}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm text-slate-600">
                            <span className="font-medium">Transcript:</span> {recording.transcript}
                          </p>
                          <div>
                            <p className="text-sm font-medium text-slate-700 mb-1">Recommendations:</p>
                            <ul className="text-sm text-slate-600 space-y-1">
                              {recording.analysis.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <ChevronRight className="h-3 w-3 text-green-600" />
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Other tabs - placeholder content */}
          {activeTab !== 'overview' && activeTab !== 'appointments' && activeTab !== 'voice' && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  {(() => {
                    const item = menuItems.find(item => item.id === activeTab);
                    return item?.icon ? <item.icon className="h-8 w-8 text-slate-400" /> : null;
                  })()}
                </div>
                <h3 className="text-lg font-medium text-slate-800 mb-2">
                  {menuItems.find(item => item.id === activeTab)?.label}
                </h3>
                <p className="text-slate-500">
                  This section is under development. Check back soon for updates.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-blue-600" />
                    Notifications & Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Stay updated with your latest appointments, results, and health reminders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`p-4 border rounded-xl hover:shadow-sm transition-all duration-200 ${
                        !notification.read ? 'bg-blue-50/50 border-blue-200' : 'bg-white border-slate-200'
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            notification.color
                          }`}>
                            <notification.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium text-slate-800">{notification.title}</p>
                              <span className="text-xs text-slate-500">{notification.time}</span>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{notification.message}</p>
                            <div className="flex items-center gap-2">
                              {!notification.read && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  New
                                </span>
                              )}
                              <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                View Details
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs text-slate-500 hover:text-slate-700"
                                onClick={() => {
                                  setNotifications(notifications.map(n => 
                                    n.id === notification.id ? { ...n, read: true } : n
                                  ));
                                }}
                              >
                                Mark as read
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Notification Settings */}
                  <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                    <h4 className="font-medium text-slate-800 mb-3">Notification Preferences</h4>
                    <div className="space-y-3">
                      {[
                        { label: 'Appointment reminders', enabled: true },
                        { label: 'Voice analysis results', enabled: true },
                        { label: 'Medical reports', enabled: true },
                        { label: 'Medication reminders', enabled: false },
                        { label: 'Health tips', enabled: false }
                      ].map((setting, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-slate-700">{setting.label}</span>
                          <button
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              setting.enabled ? 'bg-blue-600' : 'bg-slate-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                setting.enabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-slate-600" />
                    Account Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Profile Information */}
                    <div>
                      <h4 className="text-lg font-medium text-slate-800 mb-4">Profile Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" defaultValue={user?.name?.split(' ')[0] || ''} />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" defaultValue={user?.name?.split(' ')[1] || ''} />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" defaultValue={user?.email || ''} />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" placeholder="Tell us about yourself..." rows={3} />
                      </div>
                      <Button className="mt-4 bg-rose-600 hover:bg-rose-700">
                        Update Profile
                      </Button>
                    </div>

                    {/* Privacy Settings */}
                    <div className="border-t pt-6">
                      <h4 className="text-lg font-medium text-slate-800 mb-4">Privacy Settings</h4>
                      <div className="space-y-4">
                        {[
                          { label: 'Share data with healthcare providers', description: 'Allow your doctors to access your health data', enabled: true },
                          { label: 'Anonymous data sharing', description: 'Help improve our services by sharing anonymous data', enabled: false },
                          { label: 'Email notifications', description: 'Receive updates about your health via email', enabled: true },
                          { label: 'SMS notifications', description: 'Get important alerts via text message', enabled: false }
                        ].map((setting, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                            <div>
                              <p className="font-medium text-slate-800">{setting.label}</p>
                              <p className="text-sm text-slate-500">{setting.description}</p>
                            </div>
                            <button
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                setting.enabled ? 'bg-blue-600' : 'bg-slate-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  setting.enabled ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Security */}
                    <div className="border-t pt-6">
                      <h4 className="text-lg font-medium text-slate-800 mb-4">Security</h4>
                      <div className="space-y-4">
                        <Button variant="outline" className="w-full justify-start">
                          <Lock className="h-4 w-4 mr-2" />
                          Change Password
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Shield className="h-4 w-4 mr-2" />
                          Enable Two-Factor Authentication
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Smartphone className="h-4 w-4 mr-2" />
                          Manage Connected Devices
                        </Button>
                      </div>
                    </div>

                    {/* Data Management */}
                    <div className="border-t pt-6">
                      <h4 className="text-lg font-medium text-slate-800 mb-4">Data Management</h4>
                      <div className="space-y-4">
                        <Button variant="outline" className="w-full justify-start">
                          <Download className="h-4 w-4 mr-2" />
                          Download My Data
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-amber-600 border-amber-200 hover:bg-amber-50">
                          <FileText className="h-4 w-4 mr-2" />
                          Request Data Export
                        </Button>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="border-t pt-6">
                      <h4 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h4>
                      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                        <div className="space-y-4">
                          <div>
                            <h5 className="font-medium text-red-800 mb-2">Delete Account</h5>
                            <p className="text-sm text-red-700 mb-4">
                              Once you delete your account, there is no going back. Please be certain.
                            </p>
                            <div className="space-y-3">
                              <div className="p-3 bg-white rounded border border-red-200">
                                <p className="text-sm text-slate-700 mb-2">
                                  <strong>Warning:</strong> This action cannot be undone. All your data including:
                                </p>
                                <ul className="text-sm text-slate-600 space-y-1 ml-4">
                                  <li>• Voice recordings and analysis results</li>
                                  <li>• Appointment history</li>
                                  <li>• Medical reports and documents</li>
                                  <li>• Personal health information</li>
                                  <li>• Account settings and preferences</li>
                                </ul>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="checkbox" id="confirmDelete" className="rounded" />
                                <Label htmlFor="confirmDelete" className="text-sm text-slate-700">
                                  I understand that this action cannot be undone
                                </Label>
                              </div>
                              <Button 
                                variant="destructive" 
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => {
                                  const checkbox = document.getElementById('confirmDelete') as HTMLInputElement;
                                  if (checkbox?.checked) {
                                    if (confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
                                      alert('Account deletion requested. You will receive a confirmation email shortly.');
                                      // In a real app, this would call an API to delete the account
                                    }
                                  } else {
                                    alert('Please confirm that you understand this action cannot be undone.');
                                  }
                                }}
                              >
                                Delete My Account
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
      
      {/* Appointment Booking Popup */}
      <AppointmentBookingPopup
        isOpen={showAppointmentBooking}
        onClose={() => setShowAppointmentBooking(false)}
        onSubmit={handlePopupAppointmentSubmit}
      />
    </div>
  );
}
