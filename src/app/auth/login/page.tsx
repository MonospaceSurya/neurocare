'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, Mail, Lock, ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';

interface FormData {
  email: string;
  password: string;
  role: string;
}

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    role: 'patient'
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.role) newErrors.role = 'Please select your role';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Fixed demo passwords for different roles
      const demoPasswords = {
        patient: 'Patient@123',
        doctor: 'Doctor@123',
        admin: 'Admin@123'
      };

      // Check if it's a demo account
      const isDemoAccount = formData.email.includes('@neurocare.ai');
      let isValidLogin = false;

      if (isDemoAccount) {
        // For demo accounts, check the fixed password
        const expectedPassword = demoPasswords[formData.role];
        isValidLogin = formData.password === expectedPassword;
      } else {
        // For non-demo accounts, accept any password for demo purposes
        isValidLogin = formData.password.length >= 6;
      }

      if (!isValidLogin) {
        if (isDemoAccount) {
          setErrors({ password: `Invalid password. Use: ${demoPasswords[formData.role]}` });
        } else {
          setErrors({ password: 'Password must be at least 6 characters' });
        }
        setIsLoading(false);
        return;
      }

      // Store user info in localStorage
      const userInfo = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email: formData.email,
        role: formData.role,
        phone: '+1 (555) 123-4567',
        dateOfBirth: '1985-06-15'
      };
      
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      localStorage.setItem('isAuthenticated', 'true');

      setLoginSuccess(true);
      
      // Redirect to appropriate dashboard after 2 seconds
      setTimeout(() => {
        if (formData.role === 'patient') {
          router.push('/patient/dashboard');
        } else if (formData.role === 'doctor') {
          router.push('/doctor/dashboard');
        } else if (formData.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/');
        }
      }, 2000);

    } catch (error) {
      console.error('Login error:', error);
      setErrors({ email: 'Login failed. Please check your credentials.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (loginSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Login Successful!</h2>
              <p className="text-slate-600 mb-4">
                Welcome back to NeuroCare AI!
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
            <CardTitle className="text-2xl font-bold text-slate-900">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your NeuroCare AI account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.email && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.email}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="role">Account Type</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="doctor">Healthcare Provider</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-red-500 mt-1">{errors.role}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Enter your password"
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
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="remember" className="text-sm text-slate-600">
                    Remember me
                  </Label>
                </div>
                <Link href="/auth/forgot-password" className="text-sm text-rose-600 hover:text-rose-700">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{' '}
                <Link href="/auth/register" className="text-rose-600 hover:text-rose-700 font-medium">
                  Sign up
                </Link>
              </p>
            </div>

            {/* Demo Accounts */}
            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-2">Demo Accounts:</h4>
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
                  <p className="text-xs font-semibold text-rose-700">Passwords:</p>
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