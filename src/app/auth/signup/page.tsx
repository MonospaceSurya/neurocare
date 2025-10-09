'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Eye, EyeOff, Mail, Lock, User, Phone, Calendar, CheckCircle } from 'lucide-react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    role: 'PATIENT',
    gender: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fixed demo passwords for different roles
      const demoPasswords = {
        PATIENT: 'Patient@123',
        DOCTOR: 'Doctor@123',
        ADMIN: 'Admin@123'
      };

      // Check if it's a demo account
      const isDemoAccount = formData.email.includes('@neurocare.ai');
      let isValidPassword = false;

      if (isDemoAccount) {
        // For demo accounts, check the fixed password
        const expectedPassword = demoPasswords[formData.role];
        isValidPassword = formData.password === expectedPassword;
      } else {
        // For non-demo accounts, accept any password with minimum requirements
        isValidPassword = formData.password.length >= 6;
      }

      if (!isValidPassword) {
        if (isDemoAccount) {
          setError(`For demo accounts, use password: ${demoPasswords[formData.role]}`);
        } else {
          setError('Password must be at least 6 characters');
        }
        setIsLoading(false);
        return;
      }
      
      // Store user info in localStorage
      const userInfo = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        role: formData.role.toLowerCase()
      };
      
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      localStorage.setItem('isAuthenticated', 'true');

      setSignupSuccess(true);
      
      // Redirect to appropriate dashboard after 2 seconds
      setTimeout(() => {
        if (formData.role === 'PATIENT') {
          router.push('/patient/dashboard');
        } else if (formData.role === 'DOCTOR') {
          router.push('/doctor/dashboard');
        } else if (formData.role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else {
          router.push('/');
        }
      }, 2000);
      
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (signupSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Registration Successful!</h2>
              <p className="text-slate-600 mb-4">
                Welcome to NeuroCare AI! Your account has been created successfully.
              </p>
              <p className="text-sm text-slate-500">
                Redirecting to your dashboard...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-rose-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">NeuroCare AI</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-slate-900">Create Account</CardTitle>
            <CardDescription>
              Join NeuroCare AI for cognitive health monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="role">Account Type</Label>
                <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PATIENT">Patient</SelectItem>
                    <SelectItem value="DOCTOR">Healthcare Provider</SelectItem>
                    <SelectItem value="ADMIN">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-rose-600 hover:text-rose-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-slate-500">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-rose-600 hover:text-rose-700">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-rose-600 hover:text-rose-700">
                  Privacy Policy
                </Link>
              </p>
            </div>

            {/* Demo Accounts */}
            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-2">Quick Demo Access:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Patient:</span>
                  <code className="bg-white px-2 py-1 rounded text-xs">patient@neurocare.ai</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Doctor:</span>
                  <code className="bg-white px-2 py-1 rounded text-xs">doctor@neurocare.ai</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Admin:</span>
                  <code className="bg-white px-2 py-1 rounded text-xs">admin@neurocare.ai</code>
                </div>
                <div className="mt-3 p-2 bg-rose-50 rounded border border-rose-200">
                  <p className="text-xs font-semibold text-rose-700">Demo Passwords:</p>
                  <p className="text-xs text-rose-600">Patient: <code>Patient@123</code></p>
                  <p className="text-xs text-rose-600">Doctor: <code>Doctor@123</code></p>
                  <p className="text-xs text-rose-600">Admin: <code>Admin@123</code></p>
                </div>
                <p className="text-xs text-slate-500 mt-2 italic">Other emails: Any password (min 6 chars)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}