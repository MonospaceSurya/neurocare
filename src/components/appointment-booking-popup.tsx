'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Calendar from '@/components/ui/calendar';
import { 
  Heart, 
  Calendar as CalendarIcon, 
  Mic, 
  ArrowLeft, 
  Play, 
  Pause, 
  Square, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Volume2,
  Brain,
  Activity,
  BarChart3,
  FileText,
  X
} from 'lucide-react';

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

interface AppointmentBookingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (appointmentData: AppointmentData, voiceAnalysis: VoiceAnalysis) => void;
}

export default function AppointmentBookingPopup({ isOpen, onClose, onSubmit }: AppointmentBookingPopupProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    date: '',
    time: '',
    doctor: '',
    reason: '',
    symptoms: '',
    medicalHistory: ''
  });
  
  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [voiceAnalysis, setVoiceAnalysis] = useState<VoiceAnalysis | null>(null);
  const [recordingComplete, setRecordingComplete] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const readingParagraph = `The sun rises over the peaceful mountains, painting the sky with shades of orange and pink. 
  Birds begin their morning songs while dew glistens on the grass. In the distance, a gentle stream flows 
  through the valley, carrying memories of yesterday and promises of tomorrow. Life moves forward with each 
  passing moment, bringing new opportunities and challenges. We navigate through our days with hope and determination, 
  finding strength in the connections we share with others. Time teaches us valuable lessons about patience, 
  resilience, and the importance of cherishing each experience.`;

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

  useEffect(() => {
    if (!isOpen) {
      // Reset form when popup closes
      setCurrentStep(1);
      setAppointmentData({
        date: '',
        time: '',
        doctor: '',
        reason: '',
        symptoms: '',
        medicalHistory: ''
      });
      setRecordingComplete(false);
      setVoiceAnalysis(null);
      setAudioBlob(null);
      setAudioUrl('');
      setRecordingTime(0);
    }
  }, [isOpen]);

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
        setRecordingComplete(true);
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
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
      setIsPaused(!isPaused);
    }
  };

  const analyzeVoice = async () => {
    if (!audioBlob) return;

    setIsAnalyzing(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockAnalysis: VoiceAnalysis = {
        duration: recordingTime,
        transcript: "The sun rises over the peaceful mountains, painting the sky with shades of orange and pink...",
        speechRate: 145 + Math.floor(Math.random() * 20),
        clarityScore: 80 + Math.floor(Math.random() * 15),
        confidenceLevel: 85 + Math.floor(Math.random() * 10),
        cognitiveLoadIndicator: Math.random() > 0.7 ? 'Medium' : 'Low',
        riskAssessment: 'Based on the voice analysis, cognitive patterns appear within normal range. No immediate concerns detected.',
        recommendations: [
          'Continue regular voice monitoring',
          'Maintain healthy sleep schedule',
          'Engage in mentally stimulating activities',
          'Follow up in 3 months for reassessment'
        ]
      };
      
      setVoiceAnalysis(mockAnalysis);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Voice analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voiceAnalysis) {
      alert('Please complete voice analysis before submitting appointment request.');
      return;
    }

    onSubmit(appointmentData, voiceAnalysis);
    onClose();
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <CalendarIcon className="h-6 w-6 text-rose-600" />
                Book Appointment with Voice Analysis
              </DialogTitle>
              <DialogDescription className="text-slate-600 mt-2">
                Schedule your consultation and complete AI-powered cognitive assessment
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="mb-6">
          <div className="flex justify-between mb-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex-1">
                <div className={`text-center p-3 rounded-lg transition-all duration-300 ${
                  currentStep === step 
                    ? 'bg-rose-100 border-2 border-rose-300 shadow-md' 
                    : currentStep > step 
                    ? 'bg-green-50 border-2 border-green-200' 
                    : 'bg-slate-50 border-2 border-slate-200'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    currentStep === step 
                      ? 'bg-rose-600 text-white shadow-lg scale-110' 
                      : currentStep > step 
                      ? 'bg-green-600 text-white' 
                      : 'bg-slate-300 text-slate-600'
                  }`}>
                    {currentStep > step ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="font-bold">{step}</span>
                    )}
                  </div>
                  <p className={`text-xs font-medium ${
                    currentStep === step 
                      ? 'text-rose-800' 
                      : currentStep > step 
                      ? 'text-green-800' 
                      : 'text-slate-600'
                  }`}>
                    {step === 1 && 'Details'}
                    {step === 2 && 'Voice'}
                    {step === 3 && 'Review'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Appointment Details */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-rose-600" />
                Appointment Information
              </CardTitle>
              <CardDescription>
                Please provide your appointment details and medical information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); setCurrentStep(2); }} className="space-y-4">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2">
                    <Label htmlFor="date">Select Date</Label>
                    <Calendar 
                      selectedDate={appointmentData.date}
                      onDateSelect={(date) => setAppointmentData({...appointmentData, date})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Preferred Time</Label>
                    <Input 
                      id="time" 
                      type="time" 
                      required
                      value={appointmentData.time}
                      onChange={(e) => setAppointmentData({...appointmentData, time: e.target.value})}
                    />
                    <div className="mt-4">
                      <Label className="text-xs text-slate-600">Quick Time Slots</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(time => (
                          <Button
                            key={time}
                            variant="outline"
                            size="sm"
                            onClick={() => setAppointmentData({...appointmentData, time})}
                            className={appointmentData.time === time ? 'bg-rose-100 border-rose-300' : ''}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="doctor">Select Doctor</Label>
                  <Select 
                    value={appointmentData.doctor} 
                    onValueChange={(value) => setAppointmentData({...appointmentData, doctor: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dr. Sarah Chen">Dr. Sarah Chen - Neurologist</SelectItem>
                      <SelectItem value="Dr. Michael Roberts">Dr. Michael Roberts - Cognitive Specialist</SelectItem>
                      <SelectItem value="Dr. Emily Johnson">Dr. Emily Johnson - Geriatric Medicine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="reason">Primary Reason for Visit</Label>
                  <Textarea 
                    id="reason" 
                    placeholder="Describe your main concerns or reason for this appointment..."
                    required
                    value={appointmentData.reason}
                    onChange={(e) => setAppointmentData({...appointmentData, reason: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="symptoms">Current Symptoms</Label>
                  <Textarea 
                    id="symptoms" 
                    placeholder="Please describe any symptoms you're experiencing..."
                    value={appointmentData.symptoms}
                    onChange={(e) => setAppointmentData({...appointmentData, symptoms: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="medicalHistory">Relevant Medical History</Label>
                  <Textarea 
                    id="medicalHistory" 
                    placeholder="Any relevant medical history, medications, or previous treatments..."
                    value={appointmentData.medicalHistory}
                    onChange={(e) => setAppointmentData({...appointmentData, medicalHistory: e.target.value})}
                  />
                </div>

                <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700">
                  Continue to Voice Recording
                  <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Voice Recording */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-purple-600" />
                  Voice Analysis for Cognitive Assessment
                </CardTitle>
                <CardDescription>
                  Please read the following paragraph clearly and naturally. This helps our AI analyze your cognitive patterns.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4 bg-blue-50 border-blue-200">
                  <Heart className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    Find a quiet place and ensure your microphone is working. Speak clearly and at your normal pace.
                  </AlertDescription>
                </Alert>

                <div className="bg-slate-50 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-slate-900 mb-2">Please read this paragraph:</h3>
                  <p className="text-slate-700 leading-relaxed text-sm">
                    {readingParagraph}
                  </p>
                </div>

                {/* Recording Interface */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-mono text-slate-900 mb-2">
                      {formatTime(recordingTime)}
                    </div>
                    {isRecording && (
                      <div className="flex items-center justify-center gap-2 text-red-600">
                        <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                        <span className="text-sm">{isPaused ? 'Paused' : 'Recording...'}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {!isRecording && !recordingComplete && (
                      <Button 
                        onClick={startRecording}
                        size="lg"
                        className="bg-red-600 hover:bg-red-700 h-14 w-14 rounded-full"
                      >
                        <Mic className="h-5 w-5" />
                      </Button>
                    )}

                    {isRecording && (
                      <>
                        <Button 
                          onClick={pauseRecording}
                          size="lg"
                          variant="outline"
                          className="h-10 w-10 rounded-full"
                        >
                          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                        </Button>
                        <Button 
                          onClick={stopRecording}
                          size="lg"
                          className="bg-red-600 hover:bg-red-700 h-14 w-14 rounded-full"
                        >
                          <Square className="h-5 w-5" />
                        </Button>
                      </>
                    )}
                  </div>

                  {recordingComplete && audioUrl && (
                    <div className="w-full space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-green-800 font-medium text-sm">Recording completed!</span>
                        </div>
                        <span className="text-slate-600 text-sm">Duration: {formatTime(recordingTime)}</span>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <audio 
                          ref={audioRef}
                          controls 
                          src={audioUrl}
                          className="flex-1"
                        />
                        <Button 
                          onClick={() => {
                            setRecordingComplete(false);
                            setAudioBlob(null);
                            setAudioUrl('');
                            setRecordingTime(0);
                            setVoiceAnalysis(null);
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Re-record
                        </Button>
                      </div>

                      <Button 
                        onClick={analyzeVoice}
                        disabled={isAnalyzing}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        {isAnalyzing ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing Voice Patterns...
                          </>
                        ) : (
                          <>
                            <Heart className="h-4 w-4 mr-2" />
                            Analyze Voice with AI
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {voiceAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    Voice Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-slate-600">Speech Rate</Label>
                        <div className="flex items-center gap-2">
                          <span className={`text-xl font-bold ${getScoreColor(voiceAnalysis.speechRate)}`}>
                            {voiceAnalysis.speechRate}
                          </span>
                          <span className="text-slate-600 text-sm">wpm</span>
                        </div>
                        <Progress value={voiceAnalysis.speechRate} max={200} className="mt-1" />
                      </div>

                      <div>
                        <Label className="text-xs text-slate-600">Clarity Score</Label>
                        <div className="flex items-center gap-2">
                          <span className={`text-xl font-bold ${getScoreColor(voiceAnalysis.clarityScore)}`}>
                            {voiceAnalysis.clarityScore}%
                          </span>
                        </div>
                        <Progress value={voiceAnalysis.clarityScore} className="mt-1" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-slate-600">Confidence Level</Label>
                        <div className="flex items-center gap-2">
                          <span className={`text-xl font-bold ${getScoreColor(voiceAnalysis.confidenceLevel)}`}>
                            {voiceAnalysis.confidenceLevel}%
                          </span>
                        </div>
                        <Progress value={voiceAnalysis.confidenceLevel} className="mt-1" />
                      </div>

                      <div>
                        <Label className="text-xs text-slate-600">Cognitive Load</Label>
                        <Badge className={getRiskColor(voiceAnalysis.cognitiveLoadIndicator)}>
                          {voiceAnalysis.cognitiveLoadIndicator}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-slate-600">Risk Assessment</Label>
                    <p className="text-slate-700 text-sm mt-1">{voiceAnalysis.riskAssessment}</p>
                  </div>

                  <Button 
                    onClick={() => setCurrentStep(3)}
                    className="w-full bg-rose-600 hover:bg-rose-700"
                  >
                    Continue to Review
                    <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                  </Button>
                </CardContent>
              </Card>
            )}

            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(1)}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Details
            </Button>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Review Your Appointment Request
                </CardTitle>
                <CardDescription>
                  Please review all information before submitting your appointment request
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Appointment Summary */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-slate-900 mb-3">Appointment Details</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-slate-600">Date & Time:</span>
                      <p className="font-medium text-sm">{appointmentData.date} at {appointmentData.time}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-600">Doctor:</span>
                      <p className="font-medium text-sm">{appointmentData.doctor}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-xs text-slate-600">Reason for Visit:</span>
                      <p className="font-medium text-sm">{appointmentData.reason}</p>
                    </div>
                  </div>
                </div>

                {/* Voice Analysis Summary */}
                {voiceAnalysis && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-3">Voice Analysis Summary</h3>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="text-center">
                        <div className={`text-xl font-bold ${getScoreColor(voiceAnalysis.clarityScore)}`}>
                          {voiceAnalysis.clarityScore}%
                        </div>
                        <div className="text-xs text-slate-600">Clarity</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-xl font-bold ${getScoreColor(voiceAnalysis.confidenceLevel)}`}>
                          {voiceAnalysis.confidenceLevel}%
                        </div>
                        <div className="text-xs text-slate-600">Confidence</div>
                      </div>
                      <div className="text-center">
                        <Badge className={getRiskColor(voiceAnalysis.cognitiveLoadIndicator)}>
                          {voiceAnalysis.cognitiveLoadIndicator}
                        </Badge>
                        <div className="text-xs text-slate-600 mt-1">Risk</div>
                      </div>
                    </div>
                    <p className="text-slate-700 text-xs">{voiceAnalysis.riskAssessment}</p>
                  </div>
                )}

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Your voice analysis will be reviewed by our medical team before your appointment.
                  </AlertDescription>
                </Alert>

                <form onSubmit={handleAppointmentSubmit} className="space-y-3">
                  <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700">
                    Submit Appointment Request
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(2)} className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Voice Analysis
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}