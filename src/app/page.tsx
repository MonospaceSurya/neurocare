'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Heart, 
  Users, 
  User,
  Calendar, 
  Mic, 
  Shield, 
  Activity,
  CheckCircle,
  ArrowRight,
  Star,
  Phone,
  Mail,
  MapPin,
  Play,
  Stethoscope,
  FileText,
  Clock,
  TrendingUp,
  Zap,
  Target,
  BarChart3,
  Globe,
  Video,
  MessageCircle,
  Download,
  Smartphone,
  Headphones,
  Eye,
  Lock,
  HeartHandshake,
  Sparkles,
  Waves,
  Brain,
  UserCheck,
  Hospital,
  Ambulance
} from 'lucide-react';

export default function NeuroCareAILanding() {
  const [appointments, setAppointments] = useState([
    { id: 1, date: '2024-01-15', time: '10:00 AM', doctor: 'Dr. Sarah Chen', status: 'PENDING', reason: 'General checkup' },
    { id: 2, date: '2024-01-20', time: '2:00 PM', doctor: 'Dr. Michael Roberts', status: 'APPROVED', reason: 'Follow-up consultation' }
  ]);

  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleAppointmentRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const newAppointment = {
      id: appointments.length + 1,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      doctor: formData.get('doctor') as string,
      reason: formData.get('reason') as string,
      status: 'PENDING'
    };
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAppointments([...appointments, newAppointment]);
      alert('Appointment request submitted successfully! Your request will be reviewed by our medical team.');
      form.reset();
    } catch (error) {
      alert('Error submitting appointment. Please try again.');
    }
  };

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    } catch (error) {
      alert('Error subscribing to newsletter. Please try again.');
    }
  };

  const faqItems = [
    {
      question: "How does NeuroCare AI work?",
      answer: "NeuroCare AI uses advanced voice analysis technology to detect early signs of cognitive decline. Our system analyzes speech patterns, vocal biomarkers, and linguistic indicators to provide comprehensive brain health assessments."
    },
    {
      question: "Is the voice analysis accurate?",
      answer: "Our AI technology has been validated through extensive clinical trials with over 10,000 patients, achieving 92% accuracy in detecting early cognitive changes. However, it's designed to complement, not replace, medical diagnosis."
    },
    {
      question: "How long does a voice analysis take?",
      answer: "A typical voice recording session takes just 3-5 minutes. Our AI analyzes the recording in real-time and provides results within minutes, making it convenient for regular monitoring."
    },
    {
      question: "Is my health data secure?",
      answer: "Absolutely. We use bank-level encryption and comply with HIPAA regulations. Your health data is stored securely and is only accessible to authorized healthcare providers."
    },
    {
      question: "Do I need special equipment?",
      answer: "No special equipment is needed. You can use your smartphone's microphone or any standard microphone. The quality is sufficient for our advanced analysis."
    },
    {
      question: "How often should I test?",
      answer: "We recommend monthly voice analysis for optimal monitoring of cognitive health changes. Regular testing helps establish baseline patterns and detect subtle changes over time."
    },
    {
      question: "What conditions can you detect?",
      answer: "Our technology can help identify early signs of various cognitive conditions including Alzheimer's, dementia, mild cognitive impairment, and other neurodegenerative disorders."
    },
    {
      question: "Is this covered by insurance?",
      answer: "Coverage varies by insurance provider and plan. We provide detailed receipts that can be submitted for reimbursement. Many plans cover preventive cognitive screenings."
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Create Your Account",
      description: "Sign up in minutes and complete your health profile to get personalized care.",
      icon: UserCheck,
      color: "bg-blue-500"
    },
    {
      step: "2", 
      title: "Record Your Voice",
      description: "Speak naturally for 3-5 minutes while our system captures your voice patterns.",
      icon: Mic,
      color: "bg-purple-500"
    },
    {
      step: "3",
      title: "AI Analysis",
      description: "Our advanced AI analyzes over 100 vocal biomarkers and speech patterns.",
      icon: Brain,
      color: "bg-green-500"
    },
    {
      step: "4",
      title: "Get Results",
      description: "Receive comprehensive insights about your cognitive health within minutes.",
      icon: FileText,
      color: "bg-orange-500"
    },
    {
      step: "5",
      title: "Expert Consultation",
      description: "Review results with healthcare professionals for personalized care plans.",
      icon: Users,
      color: "bg-rose-500"
    }
  ];

  const features = [
    {
      icon: Mic,
      title: "Voice Analysis",
      description: "Advanced AI analyzes over 100 vocal biomarkers to detect subtle changes in cognitive function",
      color: "bg-blue-100 text-blue-600",
      delay: "0"
    },
    {
      icon: Brain,
      title: "Cognitive Assessment",
      description: "Comprehensive evaluation of memory, attention, executive function, and language processing",
      color: "bg-purple-100 text-purple-600",
      delay: "100"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor changes over time with detailed analytics and trend analysis",
      color: "bg-green-100 text-green-600",
      delay: "200"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Bank-level encryption and HIPAA compliance ensure your health data remains confidential",
      color: "bg-orange-100 text-orange-600",
      delay: "300"
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Access to neurologists and cognitive health specialists for consultation",
      color: "bg-rose-100 text-rose-600",
      delay: "400"
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description: "Complete assessments from anywhere using your smartphone or tablet",
      color: "bg-cyan-100 text-cyan-600",
      delay: "500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient, 65",
      content: "NeuroCare AI detected early changes that helped me get timely medical attention. The peace of mind is invaluable. The voice analysis is so simple and non-invasive.",
      rating: 5,
      avatar: "👵"
    },
    {
      name: "Dr. Michael Chen",
      role: "Neurologist, Johns Hopkins",
      content: "This technology revolutionizes how we monitor cognitive health. It's non-invasive, accurate, and incredibly helpful for early detection and intervention.",
      rating: 5,
      avatar: "👨‍⚕️"
    },
    {
      name: "Robert Williams",
      role: "Caregiver & Son",
      content: "I can monitor my father's cognitive health from anywhere. The regular updates give me confidence in his care and help me coordinate with his doctors.",
      rating: 5,
      avatar: "👨"
    },
    {
      name: "Emily Davis",
      role: "Patient, 58",
      content: "The monthly voice assessments have become part of my routine. It's reassuring to know I'm monitoring my cognitive health proactively.",
      rating: 5,
      avatar: "👩"
    },
    {
      name: "Dr. Lisa Thompson",
      role: "Geriatric Specialist",
      content: "NeuroCare AI provides objective data that complements traditional cognitive assessments. It's become an essential tool in my practice.",
      rating: 5,
      avatar: "👩‍⚕️"
    },
    {
      name: "James Martinez",
      role: "Family Caregiver",
      content: "The app is so user-friendly. My elderly parents can use it independently, and I get detailed reports to share with their healthcare team.",
      rating: 5,
      avatar: "👨‍💼"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Patients Monitored", icon: Users },
    { number: "92%", label: "Accuracy Rate", icon: Target },
    { number: "5 minutes", label: "Assessment Time", icon: Clock },
    { number: "24/7", label: "Monitoring Available", icon: Activity },
    { number: "50+", label: "Expert Doctors", icon: Stethoscope },
    { number: "99.9%", label: "Uptime", icon: Shield }
  ];

  const partners = [
    "Mayo Clinic", "Johns Hopkins", "Cleveland Clinic", "Stanford Medicine", 
    "Harvard Medical", "UCLA Health", "Mount Sinai", "Cedars-Sinai"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-slate-50">
      {/* Announcement Bar */}
      <div className="bg-rose-600 text-white py-2 px-4 text-center text-sm">
        <span className="inline-flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          New: FDA-cleared AI technology now available for early cognitive detection
          <Button variant="ghost" size="sm" className="text-white hover:bg-rose-700 ml-2">
            Learn More <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </span>
      </div>

      {/* Navigation */}
      <nav className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-r from-rose-600 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900">NeuroCare AI</span>
                <p className="text-xs text-slate-600">Cognitive Health Monitoring</p>
              </div>
            </Link>
            
            <div className="hidden lg:flex items-center gap-8">
              <a href="#features" className="text-slate-600 hover:text-rose-600 transition-colors font-medium scroll-smooth">Features</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-rose-600 transition-colors font-medium scroll-smooth">How It Works</a>
              <a href="#testimonials" className="text-slate-600 hover:text-rose-600 transition-colors font-medium scroll-smooth">Success Stories</a>
              <a href="#pricing" className="text-slate-600 hover:text-rose-600 transition-colors font-medium scroll-smooth">Pricing</a>
              <a href="#doctors" className="text-slate-600 hover:text-rose-600 transition-colors font-medium scroll-smooth">Our Doctors</a>
              <a href="#faq" className="text-slate-600 hover:text-rose-600 transition-colors font-medium scroll-smooth">FAQ</a>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-slate-700 hover:text-rose-600">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-rose-600 hover:bg-rose-700 text-white px-6">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100/20 via-transparent to-purple-100/20"></div>
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-4 py-2 text-sm">
                  <Zap className="h-3 w-3 mr-2" />
                  AI-Powered Cognitive Health Monitoring
                </Badge>
                <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-tight">
                  Protect Your Brain
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600"> Health</span>
                  <br />
                  With Your Voice
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
                  Revolutionary AI technology that analyzes your voice to detect early signs of cognitive decline. 
                  Non-invasive, accurate, and available from the comfort of your home. Take control of your cognitive health today.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-rose-600 hover:bg-rose-700 text-lg px-8 py-6 h-16">
                      <Calendar className="h-5 w-5 mr-2" />
                      Book Free Consultation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Book Your Free Consultation</DialogTitle>
                      <DialogDescription>
                        Schedule your cognitive health assessment today
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAppointmentRequest} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="date">Preferred Date</Label>
                          <Input id="date" name="date" type="date" required />
                        </div>
                        <div>
                          <Label htmlFor="time">Preferred Time</Label>
                          <Input id="time" name="time" type="time" required />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="doctor">Select Specialist</Label>
                        <Select name="doctor" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a specialist" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Dr. Sarah Chen">Dr. Sarah Chen - Neurologist</SelectItem>
                            <SelectItem value="Dr. Michael Roberts">Dr. Michael Roberts - Cognitive Specialist</SelectItem>
                            <SelectItem value="Dr. Emily Johnson">Dr. Emily Johnson - Geriatric Medicine</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="reason">Reason for Visit</Label>
                        <Textarea id="reason" name="reason" placeholder="Tell us about your concerns or what you'd like to discuss..." required />
                      </div>
                      <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700">
                        Submit Consultation Request
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
                
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-16 border-2">
                  <Play className="h-5 w-5 mr-2" />
                  Watch 2-Min Demo
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-6 pt-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">92% Accuracy</p>
                    <p className="text-sm text-slate-600">Clinically validated</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">5-Min Test</p>
                    <p className="text-sm text-slate-600">Quick & easy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">HIPAA Secure</p>
                    <p className="text-sm text-slate-600">Your data protected</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                    alt="Professional doctor with patient" 
                    className="rounded-3xl shadow-2xl w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
                </div>
                
                {/* Floating Cards */}
                <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">FDA Cleared</p>
                      <p className="text-sm text-slate-600">Medical Device</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                      <Heart className="h-6 w-6 text-rose-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">10,000+</p>
                      <p className="text-sm text-slate-600">Patients Helped</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Background Effects */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-rose-400 to-pink-400 rounded-full opacity-20 blur-2xl"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className="h-8 w-8 text-rose-600" />
                </div>
                <p className="text-3xl font-bold text-slate-900">{stat.number}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-rose-100 text-rose-800 border-rose-200">Features</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Comprehensive Cognitive Health
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600"> Monitoring</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI technology with medical expertise to provide the most 
              advanced cognitive health monitoring available, all from the comfort of your home.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                <CardHeader>
                  <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="text-rose-600 hover:text-rose-700 p-0 h-auto">
                    Learn More <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">Process</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              How NeuroCare AI
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Works</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Get started in minutes with our simple 5-step process. No special equipment needed - 
              just your voice and a smartphone or computer.
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 via-purple-200 to-rose-200 hidden lg:block transform -translate-x-1/2"></div>
            
            <div className="space-y-12">
              {howItWorks.map((step, index) => (
                <div key={index} className={`flex items-center gap-8 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className="flex-1">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                          {step.step}
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">{step.title}</h3>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 relative z-10">
                    <div className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                      <step.icon className="h-10 w-10" />
                    </div>
                  </div>
                  
                  <div className="flex-1 hidden lg:block"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800 border-green-200">Success Stories</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Trusted by Thousands of
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600"> Patients</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Hear from patients and doctors who have experienced the life-changing benefits of 
              early cognitive detection with NeuroCare AI.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center text-2xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{testimonial.name}</p>
                      <p className="text-sm text-slate-600">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 px-4 bg-gradient-to-r from-slate-50 to-slate-100 overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Trusted by Leading Healthcare Institutions</h3>
            <p className="text-slate-600">Partnered with top medical centers and research institutions worldwide</p>
          </div>
          
          {/* Marquee Container */}
          <div className="relative">
            <div className="flex overflow-hidden">
              <div className="flex animate-marquee">
                {/* First set of logos */}
                {partners.map((partner, index) => (
                  <div key={`first-${index}`} className="flex-shrink-0 mx-8 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 min-w-[200px] h-[80px] flex items-center justify-center">
                      <span className="text-lg font-bold text-slate-700 text-center">{partner}</span>
                    </div>
                  </div>
                ))}
                {/* Duplicate set for seamless loop */}
                {partners.map((partner, index) => (
                  <div key={`second-${index}`} className="flex-shrink-0 mx-8 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 min-w-[200px] h-[80px] flex items-center justify-center">
                      <span className="text-lg font-bold text-slate-700 text-center">{partner}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-rose-600 to-pink-600">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Heart className="h-16 w-16 text-white mx-auto mb-6" />
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Take Control of Your Cognitive Health Today
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join thousands of patients who are proactively monitoring their cognitive health. 
              Early detection is key to maintaining brain health and quality of life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-rose-600 hover:bg-slate-100 px-8 py-6 h-16">
                Start Free Assessment
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-rose-600 px-8 py-6 h-16">
                <Phone className="h-5 w-5 mr-2" />
                Call (800) NEURO-CARE
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-800 border-purple-200">FAQ</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Frequently Asked
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"> Questions</span>
            </h2>
            <p className="text-xl text-slate-600">
              Everything you need to know about NeuroCare AI and cognitive health monitoring
            </p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-slate-200 rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold text-slate-900">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <Mail className="h-12 w-12 text-rose-600 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              Stay Updated on Cognitive Health
            </h3>
            <p className="text-slate-600 mb-8">
              Get the latest research, tips, and updates on cognitive health monitoring delivered to your inbox.
            </p>
            
            <form onSubmit={handleNewsletterSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" className="bg-rose-600 hover:bg-rose-700">
                Subscribe
              </Button>
            </form>
            
            {isSubscribed && (
              <p className="text-green-600 mt-4 flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Successfully subscribed!
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-rose-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">NeuroCare AI</span>
              </div>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Revolutionizing cognitive health monitoring through advanced AI technology. 
                Early detection for better outcomes and peace of mind.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" size="sm" className="border-slate-700 text-slate-400 hover:text-white">
                  <Globe className="h-4 w-4 mr-2" />
                  Website
                </Button>
                <Button variant="outline" size="sm" className="border-slate-700 text-slate-400 hover:text-white">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Live Chat
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#doctors" className="hover:text-white transition-colors">Our Doctors</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Press</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="#faq" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-400">
                © 2024 NeuroCare AI. All rights reserved. FDA-cleared medical device.
              </p>
              <div className="flex items-center gap-6 text-slate-400">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span className="text-sm">HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm">256-bit Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span className="text-sm">FDA Cleared</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}