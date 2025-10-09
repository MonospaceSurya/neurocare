'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Play, 
  Download, 
  TrendingUp, 
  AlertCircle, 
  BarChart3, 
  Clock,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  MapPin,
  Star,
  Eye,
  X,
  CheckCircle,
  AlertTriangle,
  Info,
  Volume2,
  Pause,
  SkipForward,
  SkipBack,
  ArrowUpDown,
  MoreVertical,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  DownloadCloud,
  Upload,
  Settings,
  Bell,
  UserPlus,
  CalendarDays,
  TrendingDown,
  ActivitySquare,
  Radio,
  Waves,
  Headphones,
  FileAudio,
  MessageSquare,
  Zap,
  Target,
  Award,
  Shield,
  Stethoscope,
  Clipboard,
  FileCheck,
  UserCheck,
  Clock3,
  ScanLine,
  RadioIcon,
  Cloud
} from 'lucide-react';

interface Patient {
  id: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  emergencyContact?: string;
  medicalHistory?: string;
  createdAt: string;
  appointments: Appointment[];
  voiceRecordings: VoiceRecording[];
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  reason?: string;
  status: string;
  notes?: string;
  voiceRecording?: VoiceRecording;
}

interface VoiceRecording {
  id: string;
  audioUrl: string;
  transcript?: string;
  analysisResult?: string;
  recordingDate: string;
  duration?: number;
  speechRate?: number;
  pauseCount?: number;
  fillerWords?: number;
  pitchVariation?: number;
  volumeLevel?: number;
  clarityScore?: number;
  emotionalTone?: string;
  stressLevel?: string;
  confidenceLevel?: number;
  respiratoryRate?: number;
  voiceStability?: number;
  articulationClearness?: number;
  cognitiveLoadIndicator?: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [expandedPatients, setExpandedPatients] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('userInfo');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'admin') {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('isAuthenticated');
        router.push('/auth/login');
        return;
      }
      setUser(parsedUser);
      fetchPatients();
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  useEffect(() => {
    filterAndSortPatients();
  }, [patients, searchTerm, filterStatus, filterRisk, sortBy, sortOrder]);

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/admin/patients');
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      }
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortPatients = () => {
    let filtered = [...patients];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(patient =>
        patient.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.user.phone.includes(searchTerm) ||
        patient.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(patient => {
        const hasRecentAppointment = patient.appointments.some(apt => 
          new Date(apt.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        );
        return filterStatus === 'active' ? hasRecentAppointment : !hasRecentAppointment;
      });
    }

    // Risk filter
    if (filterRisk !== 'all') {
      filtered = filtered.filter(patient => {
        const riskLevel = getPatientRiskLevel(patient);
        return riskLevel === filterRisk;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.user.name.localeCompare(b.user.name);
          break;
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'appointments':
          comparison = a.appointments.length - b.appointments.length;
          break;
        case 'recordings':
          comparison = a.voiceRecordings.length - b.voiceRecordings.length;
          break;
        case 'risk':
          const riskOrder = { 'high': 3, 'medium': 2, 'low': 1, 'no-data': 0 };
          comparison = riskOrder[getPatientRiskLevel(a) as keyof typeof riskOrder] - riskOrder[getPatientRiskLevel(b) as keyof typeof riskOrder];
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredPatients(filtered);
  };

  const getPatientRiskLevel = (patient: Patient): string => {
    if (patient.voiceRecordings.length === 0) return 'no-data';
    
    const highRiskRecordings = patient.voiceRecordings.filter(v => 
      v.analysisResult?.includes('High') || v.cognitiveLoadIndicator === 'High'
    );
    
    if (highRiskRecordings.length > 0) return 'high';
    
    const mediumRiskRecordings = patient.voiceRecordings.filter(v => 
      v.analysisResult?.includes('Medium') || v.cognitiveLoadIndicator === 'Medium'
    );
    
    if (mediumRiskRecordings.length > 0) return 'medium';
    
    return 'low';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return <AlertTriangle className="h-3 w-3" />;
      case 'medium': return <AlertCircle className="h-3 w-3" />;
      case 'low': return <CheckCircle className="h-3 w-3" />;
      default: return <Info className="h-3 w-3" />;
    }
  };

  const togglePatientExpansion = (patientId: string) => {
    const newExpanded = new Set(expandedPatients);
    if (newExpanded.has(patientId)) {
      newExpanded.delete(patientId);
    } else {
      newExpanded.add(patientId);
    }
    setExpandedPatients(newExpanded);
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('isAuthenticated');
    router.push('/');
  };

  const playAudio = (audioUrl: string, recordingId: string) => {
    if (isPlaying === recordingId) {
      // Stop playing
      const audio = document.getElementById(`audio-${recordingId}`) as HTMLAudioElement;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      setIsPlaying(null);
    } else {
      // Start playing
      const audio = document.getElementById(`audio-${recordingId}`) as HTMLAudioElement;
      if (audio) {
        // Stop any currently playing audio
        if (isPlaying) {
          const currentAudio = document.getElementById(`audio-${isPlaying}`) as HTMLAudioElement;
          if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
          }
        }
        
        audio.play();
        setIsPlaying(recordingId);
        
        audio.onended = () => {
          setIsPlaying(null);
        };
      }
    }
  };

  const downloadAudio = (audioUrl: string, patientName: string, recordingDate: string) => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `${patientName.replace(/\s+/g, '_')}_${recordingDate}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLatestVoiceRecording = (patient: Patient): VoiceRecording | null => {
    if (patient.voiceRecordings.length === 0) return null;
    return patient.voiceRecordings.reduce((latest, current) => 
      new Date(current.recordingDate) > new Date(latest.recordingDate) ? current : latest
    );
  };

  const getAverageVoiceMetrics = (patient: Patient) => {
    const recordings = patient.voiceRecordings;
    if (recordings.length === 0) return null;
    
    return {
      avgSpeechRate: recordings.reduce((sum, r) => sum + (r.speechRate || 0), 0) / recordings.length,
      avgClarity: recordings.reduce((sum, r) => sum + (r.clarityScore || 0), 0) / recordings.length,
      avgConfidence: recordings.reduce((sum, r) => sum + (r.confidenceLevel || 0), 0) / recordings.length,
      avgPitchVariation: recordings.reduce((sum, r) => sum + (r.pitchVariation || 0), 0) / recordings.length,
    };
  };

  const totalPatients = patients.length;
  const totalAppointments = patients.reduce((sum, p) => sum + p.appointments.length, 0);
  const totalVoiceRecordings = patients.reduce((sum, p) => sum + p.voiceRecordings.length, 0);
  const scheduledAppointments = patients.reduce((sum, p) => 
    sum + p.appointments.filter(a => a.status === 'SCHEDULED').length, 0);
  
  const riskDistribution = {
    high: patients.filter(p => getPatientRiskLevel(p) === 'high').length,
    medium: patients.filter(p => getPatientRiskLevel(p) === 'medium').length,
    low: patients.filter(p => getPatientRiskLevel(p) === 'low').length,
    noData: patients.filter(p => getPatientRiskLevel(p) === 'no-data').length,
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
            <span className="text-2xl font-bold text-slate-900">NeuroCare Admin</span>
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
              <Badge variant="secondary">Administrator</Badge>
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
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Clinical Analytics Dashboard
              </h1>
              <p className="text-slate-600">
                Comprehensive patient monitoring and voice analysis for cognitive health assessment
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={fetchPatients}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Patient
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
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
              <p className="text-2xl font-bold text-slate-900">{totalPatients}</p>
              <p className="text-sm text-slate-600">Active monitoring</p>
              <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-600 rounded-full" style={{width: '75%'}}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <Activity className="h-4 w-4 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">{totalAppointments}</p>
              <p className="text-sm text-slate-600">{scheduledAppointments} scheduled</p>
              <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{width: `${(scheduledAppointments / Math.max(totalAppointments, 1)) * 100}%`}}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Mic className="h-5 w-5 text-purple-600" />
                </div>
                <Heart className="h-4 w-4 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Voice Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">{totalVoiceRecordings}</p>
              <p className="text-sm text-slate-600">Audio samples analyzed</p>
              <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{width: `${Math.min((totalVoiceRecordings / 10) * 100, 100)}%`}}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
              <CardTitle className="text-lg">Risk Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">{riskDistribution.high + riskDistribution.medium}</p>
              <p className="text-sm text-slate-600">Require attention</p>
              <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-600 rounded-full" style={{width: `${((riskDistribution.high + riskDistribution.medium) / Math.max(totalPatients, 1)) * 100}%`}}></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Distribution Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Patient Risk Distribution
            </CardTitle>
            <CardDescription>
              Cognitive health risk assessment across all patients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-green-900">Low Risk</span>
                  <span className="text-2xl font-bold text-green-600">{riskDistribution.low}</span>
                </div>
                <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600 rounded-full" style={{width: `${(riskDistribution.low / Math.max(totalPatients, 1)) * 100}%`}}></div>
                </div>
                <p className="text-sm text-green-700 mt-2">Normal cognitive patterns</p>
              </div>
              
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-yellow-900">Medium Risk</span>
                  <span className="text-2xl font-bold text-yellow-600">{riskDistribution.medium}</span>
                </div>
                <div className="h-2 bg-yellow-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-600 rounded-full" style={{width: `${(riskDistribution.medium / Math.max(totalPatients, 1)) * 100}%`}}></div>
                </div>
                <p className="text-sm text-yellow-700 mt-2">Requires closer monitoring</p>
              </div>
              
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-red-900">High Risk</span>
                  <span className="text-2xl font-bold text-red-600">{riskDistribution.high}</span>
                </div>
                <div className="h-2 bg-red-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 rounded-full" style={{width: `${(riskDistribution.high / Math.max(totalPatients, 1)) * 100}%`}}></div>
                </div>
                <p className="text-sm text-red-700 mt-2">Requires immediate attention</p>
              </div>
              
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">No Data</span>
                  <span className="text-2xl font-bold text-gray-600">{riskDistribution.noData}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-600 rounded-full" style={{width: `${(riskDistribution.noData / Math.max(totalPatients, 1)) * 100}%`}}></div>
                </div>
                <p className="text-sm text-gray-700 mt-2">Awaiting voice analysis</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="patients" className="space-y-6">
          <TabsList>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div>
                    <CardTitle>Patients Overview</CardTitle>
                    <CardDescription>
                      View and manage all registered patients
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="h-4 w-4" />
                    {filteredPatients.length} of {totalPatients} patients
                  </div>
                </div>
                
                {/* Search and Filters */}
                <div className="flex flex-col lg:flex-row gap-4 mt-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search patients by name, email, phone, or address..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Patients</SelectItem>
                      <SelectItem value="active">Active (Last 30 days)</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterRisk} onValueChange={setFilterRisk}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="Filter by risk" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Risk Levels</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="no-data">No Data</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center gap-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full lg:w-48">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="date">Join Date</SelectItem>
                        <SelectItem value="appointments">Appointments</SelectItem>
                        <SelectItem value="recordings">Voice Recordings</SelectItem>
                        <SelectItem value="risk">Risk Level</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading patients...</div>
                ) : filteredPatients.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">No patients found matching your criteria</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredPatients.map((patient) => {
                      const riskLevel = getPatientRiskLevel(patient);
                      const latestRecording = getLatestVoiceRecording(patient);
                      const hasRecentAppointment = patient.appointments.some(apt => 
                        new Date(apt.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                      );
                      const isExpanded = expandedPatients.has(patient.id);
                      const avgMetrics = getAverageVoiceMetrics(patient);
                      
                      return (
                        <Card key={patient.id} className="border hover:shadow-md transition-all duration-200">
                          <CardContent className="p-6">
                            {/* Patient Header */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg flex items-center justify-center">
                                  <User className="h-6 w-6 text-rose-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-1">
                                    <p className="font-semibold text-slate-900 text-lg">{patient.user.name}</p>
                                    <Badge className={getRiskColor(riskLevel)} variant="outline">
                                      {getRiskIcon(riskLevel)}
                                      <span className="ml-1 capitalize">{riskLevel.replace('-', ' ')}</span>
                                    </Badge>
                                    {hasRecentAppointment && (
                                      <Badge className="bg-green-100 text-green-800">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Active
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-slate-600">
                                    <div className="flex items-center gap-1">
                                      <Mail className="h-3 w-3" />
                                      {patient.user.email}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Phone className="h-3 w-3" />
                                      {patient.user.phone}
                                    </div>
                                    {patient.address && (
                                      <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {patient.address}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      {patient.appointments.length} appointments
                                    </Badge>
                                    {patient.voiceRecordings.length > 0 && (
                                      <Badge className="bg-purple-100 text-purple-800">
                                        <Mic className="h-3 w-3 mr-1" />
                                        {patient.voiceRecordings.length} recordings
                                      </Badge>
                                    )}
                                  </div>
                                  {latestRecording && (
                                    <div className="text-xs text-slate-500">
                                      Latest: {new Date(latestRecording.recordingDate).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => togglePatientExpansion(patient.id)}
                                >
                                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </Button>
                              </div>
                            </div>

                            {/* Expanded Content */}
                            {isExpanded && (
                              <div className="border-t pt-4 mt-4">
                                <Tabs defaultValue="overview" className="w-full">
                                  <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="appointments">Appointments</TabsTrigger>
                                    <TabsTrigger value="voice">Voice Analysis</TabsTrigger>
                                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                                  </TabsList>

                                  <TabsContent value="overview" className="mt-4">
                                    <div className="grid md:grid-cols-2 gap-6">
                                      <div>
                                        <h4 className="font-semibold text-slate-900 mb-3">Patient Information</h4>
                                        <div className="space-y-2 text-sm">
                                          {patient.dateOfBirth && (
                                            <div className="flex justify-between">
                                              <span className="text-slate-600">Date of Birth:</span>
                                              <span className="font-medium">{patient.dateOfBirth}</span>
                                            </div>
                                          )}
                                          {patient.gender && (
                                            <div className="flex justify-between">
                                              <span className="text-slate-600">Gender:</span>
                                              <span className="font-medium">{patient.gender}</span>
                                            </div>
                                          )}
                                          {patient.emergencyContact && (
                                            <div className="flex justify-between">
                                              <span className="text-slate-600">Emergency Contact:</span>
                                              <span className="font-medium">{patient.emergencyContact}</span>
                                            </div>
                                          )}
                                          <div className="flex justify-between">
                                            <span className="text-slate-600">Member Since:</span>
                                            <span className="font-medium">{new Date(patient.createdAt).toLocaleDateString()}</span>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {avgMetrics && (
                                        <div>
                                          <h4 className="font-semibold text-slate-900 mb-3">Voice Metrics Average</h4>
                                          <div className="grid grid-cols-2 gap-3">
                                            <div className="text-center p-3 bg-slate-50 rounded-lg">
                                              <p className="text-lg font-bold text-blue-600">{Math.round(avgMetrics.avgSpeechRate)}</p>
                                              <p className="text-xs text-slate-600">Speech Rate (wpm)</p>
                                            </div>
                                            <div className="text-center p-3 bg-slate-50 rounded-lg">
                                              <p className="text-lg font-bold text-green-600">{Math.round(avgMetrics.avgClarity)}%</p>
                                              <p className="text-xs text-slate-600">Clarity Score</p>
                                            </div>
                                            <div className="text-center p-3 bg-slate-50 rounded-lg">
                                              <p className="text-lg font-bold text-purple-600">{Math.round(avgMetrics.avgPitchVariation)}%</p>
                                              <p className="text-xs text-slate-600">Pitch Variation</p>
                                            </div>
                                            <div className="text-center p-3 bg-slate-50 rounded-lg">
                                              <p className="text-lg font-bold text-teal-600">{Math.round(avgMetrics.avgConfidence)}%</p>
                                              <p className="text-xs text-slate-600">Confidence Level</p>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </TabsContent>

                                  <TabsContent value="appointments" className="mt-4">
                                    <div className="space-y-3">
                                      {patient.appointments.length === 0 ? (
                                        <div className="text-center py-4">
                                          <Calendar className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                                          <p className="text-slate-600">No appointments scheduled</p>
                                        </div>
                                      ) : (
                                        patient.appointments.map(appointment => (
                                          <div key={appointment.id} className="border rounded-lg p-3">
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                  <Calendar className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div>
                                                  <p className="font-medium text-slate-900">
                                                    {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                                                  </p>
                                                  {appointment.reason && (
                                                    <p className="text-sm text-slate-600">{appointment.reason}</p>
                                                  )}
                                                </div>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                {appointment.voiceRecording && (
                                                  <Badge className="bg-purple-100 text-purple-800">
                                                    <Mic className="h-3 w-3 mr-1" />
                                                    Voice Recorded
                                                  </Badge>
                                                )}
                                                <Badge className={getStatusColor(appointment.status)}>
                                                  {appointment.status}
                                                </Badge>
                                              </div>
                                            </div>
                                            {appointment.notes && (
                                              <div className="mt-2 p-2 bg-slate-50 rounded text-sm text-slate-600">
                                                {appointment.notes}
                                              </div>
                                            )}
                                          </div>
                                        ))
                                      )}
                                    </div>
                                  </TabsContent>

                                  <TabsContent value="voice" className="mt-4">
                                    <div className="space-y-4">
                                      {patient.voiceRecordings.length === 0 ? (
                                        <div className="text-center py-4">
                                          <Mic className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                                          <p className="text-slate-600">No voice recordings available</p>
                                        </div>
                                      ) : (
                                        patient.voiceRecordings.map(recording => (
                                          <Card key={recording.id} className="border">
                                            <CardContent className="p-4">
                                              <div className="flex items-center justify-between mb-3">
                                                <div>
                                                  <h4 className="font-medium text-slate-900">
                                                    {new Date(recording.recordingDate).toLocaleDateString()} at {new Date(recording.recordingDate).toLocaleTimeString()}
                                                  </h4>
                                                  {recording.duration && (
                                                    <p className="text-sm text-slate-600">Duration: {recording.duration}s</p>
                                                  )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => playAudio(recording.audioUrl, recording.id)}
                                                  >
                                                    {isPlaying === recording.id ? (
                                                      <Pause className="h-4 w-4" />
                                                    ) : (
                                                      <Play className="h-4 w-4" />
                                                    )}
                                                  </Button>
                                                  <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => downloadAudio(recording.audioUrl, patient.user.name, recording.recordingDate)}
                                                  >
                                                    <Download className="h-4 w-4" />
                                                  </Button>
                                                </div>
                                              </div>
                                              <audio
                                                id={`audio-${recording.id}`}
                                                src={recording.audioUrl}
                                                className="hidden"
                                              />
                                              
                                              {recording.transcript && (
                                                <div className="mb-3">
                                                  <h5 className="font-medium text-slate-900 mb-1">Transcript</h5>
                                                  <div className="p-2 bg-slate-50 rounded text-sm text-slate-700">
                                                    {recording.transcript}
                                                  </div>
                                                </div>
                                              )}
                                              
                                              {recording.analysisResult && (
                                                <div className="mb-3">
                                                  <h5 className="font-medium text-slate-900 mb-1">Analysis Result</h5>
                                                  <div className="p-2 bg-blue-50 rounded text-sm text-blue-800">
                                                    {recording.analysisResult}
                                                  </div>
                                                </div>
                                              )}
                                              
                                              {/* Voice Parameters Grid */}
                                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                {recording.speechRate && (
                                                  <div className="text-center p-2 bg-slate-50 rounded">
                                                    <p className="text-lg font-bold text-blue-600">{recording.speechRate}</p>
                                                    <p className="text-xs text-slate-600">Speech Rate</p>
                                                  </div>
                                                )}
                                                {recording.clarityScore && (
                                                  <div className="text-center p-2 bg-slate-50 rounded">
                                                    <p className="text-lg font-bold text-green-600">{recording.clarityScore}%</p>
                                                    <p className="text-xs text-slate-600">Clarity</p>
                                                  </div>
                                                )}
                                                {recording.pitchVariation && (
                                                  <div className="text-center p-2 bg-slate-50 rounded">
                                                    <p className="text-lg font-bold text-purple-600">{recording.pitchVariation}%</p>
                                                    <p className="text-xs text-slate-600">Pitch</p>
                                                  </div>
                                                )}
                                                {recording.confidenceLevel && (
                                                  <div className="text-center p-2 bg-slate-50 rounded">
                                                    <p className="text-lg font-bold text-teal-600">{recording.confidenceLevel}%</p>
                                                    <p className="text-xs text-slate-600">Confidence</p>
                                                  </div>
                                                )}
                                              </div>
                                            </CardContent>
                                          </Card>
                                        ))
                                      )}
                                    </div>
                                  </TabsContent>

                                  <TabsContent value="analytics" className="mt-4">
                                    {patient.voiceRecordings.length === 0 ? (
                                      <div className="text-center py-4">
                                        <BarChart3 className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                                        <p className="text-slate-600">No voice data available for analysis</p>
                                      </div>
                                    ) : (
                                      <div className="space-y-4">
                                        {/* Cognitive Health Trend */}
                                        <Card>
                                          <CardHeader>
                                            <CardTitle className="text-lg">Cognitive Health Trend</CardTitle>
                                            <CardDescription>
                                              Track cognitive health indicators over time
                                            </CardDescription>
                                          </CardHeader>
                                          <CardContent>
                                            <div className="space-y-3">
                                              {patient.voiceRecordings.map((recording, index) => {
                                                const riskLevel = recording.cognitiveLoadIndicator || 'Low';
                                                const getRiskColor = (level: string) => {
                                                  switch (level) {
                                                    case 'High': return 'bg-red-500';
                                                    case 'Medium': return 'bg-yellow-500';
                                                    default: return 'bg-green-500';
                                                  }
                                                };
                                                
                                                return (
                                                  <div key={recording.id} className="flex items-center gap-4">
                                                    <div className="text-sm text-slate-600 min-w-28">
                                                      {new Date(recording.recordingDate).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                                                      <div 
                                                        className={`h-full ${getRiskColor(riskLevel)} rounded-full transition-all duration-300`}
                                                        style={{width: `${(index + 1) / patient.voiceRecordings.length * 100}%`}}
                                                      />
                                                    </div>
                                                    <Badge className={getRiskColor(riskLevel).replace('bg-', 'bg-opacity-20 text-').replace('-500', '-800')}>
                                                      {riskLevel} Risk
                                                    </Badge>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </CardContent>
                                        </Card>

                                        {/* Risk Assessment Summary */}
                                        <Card>
                                          <CardHeader>
                                            <CardTitle className="text-lg">Risk Assessment Summary</CardTitle>
                                            <CardDescription>
                                              Comprehensive risk analysis based on voice patterns
                                            </CardDescription>
                                          </CardHeader>
                                          <CardContent>
                                            <div className="grid md:grid-cols-3 gap-4">
                                              <div className="text-center p-4 bg-green-50 rounded-lg">
                                                <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                                                <p className="font-semibold text-green-900">Normal</p>
                                                <p className="text-xl font-bold text-green-600">
                                                  {patient.voiceRecordings.filter(r => 
                                                    r.cognitiveLoadIndicator === 'Low' || !r.cognitiveLoadIndicator
                                                  ).length}
                                                </p>
                                                <p className="text-sm text-green-700">Recordings</p>
                                              </div>
                                              
                                              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                                <AlertCircle className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                                                <p className="font-semibold text-yellow-900">Monitor</p>
                                                <p className="text-xl font-bold text-yellow-600">
                                                  {patient.voiceRecordings.filter(r => 
                                                    r.cognitiveLoadIndicator === 'Medium'
                                                  ).length}
                                                </p>
                                                <p className="text-sm text-yellow-700">Recordings</p>
                                              </div>
                                              
                                              <div className="text-center p-4 bg-red-50 rounded-lg">
                                                <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                                                <p className="font-semibold text-red-900">Attention</p>
                                                <p className="text-xl font-bold text-red-600">
                                                  {patient.voiceRecordings.filter(r => 
                                                    r.cognitiveLoadIndicator === 'High'
                                                  ).length}
                                                </p>
                                                <p className="text-sm text-red-700">Recordings</p>
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      </div>
                                    )}
                                  </TabsContent>
                                </Tabs>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>All Appointments</CardTitle>
                <CardDescription>
                  View and manage all patient appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patients.flatMap(patient => 
                    patient.appointments.map(appointment => (
                      <div key={appointment.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{patient.user.name}</p>
                              <p className="text-sm text-slate-600">
                                {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                              </p>
                              {appointment.reason && (
                                <p className="text-sm text-slate-500">{appointment.reason}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {appointment.voiceRecording && (
                              <Badge className="bg-purple-100 text-purple-800">
                                <Mic className="h-3 w-3 mr-1" />
                                Voice Recorded
                              </Badge>
                            )}
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Voice Analysis Summary</CardTitle>
                  <CardDescription>
                    Overview of voice recordings and analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Total Recordings</span>
                      <span className="font-bold text-slate-900">{totalVoiceRecordings}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Analyzed</span>
                      <span className="font-bold text-green-600">
                        {patients.reduce((sum, p) => 
                          sum + p.voiceRecordings.filter(v => v.analysisResult).length, 0
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Pending Analysis</span>
                      <span className="font-bold text-yellow-600">
                        {patients.reduce((sum, p) => 
                          sum + p.voiceRecordings.filter(v => !v.analysisResult).length, 0
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest patient activities and appointments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {patients.slice(0, 5).map(patient => (
                      <div key={patient.id} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">{patient.user.name}</p>
                          <p className="text-xs text-slate-500">
                            Joined {new Date(patient.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}