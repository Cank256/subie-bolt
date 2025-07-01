'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Navbar } from '@/components/ui/navbar';
import { PhoneInput } from '@/components/ui/phone-input';
import { useAuth } from '@/hooks/use-auth';
import { Mail, Smartphone, Facebook, Chrome, Apple, ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function SignupPage() {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });

  const router = useRouter();
  const { user, signUp, signInWithOAuth } = useAuth();

  // Redirect if already authenticated
  if (user) {
    router.push('/subscriptions');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      phone: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (loginMethod === 'email') {
        await signUp(formData.email, formData.password, {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone || undefined,
        });
        
        // Show success message and redirect to login
        router.push('/login?message=Check your email to confirm your account');
      } else {
        setError('Phone signup not implemented yet. Please use email.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignup = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      setLoading(true);
      await signInWithOAuth(provider);
      // Redirect will be handled by the auth callback
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OAuth signup failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-purple-600 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Link>
          </div>

          <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
              <CardDescription>
                No credit card required.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {/* Benefits */}
              <div className="bg-purple-50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-purple-900">What you'll get:</h4>
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-purple-700">
                    <CheckCircle className="w-4 h-4 mr-2 text-purple-500" />
                    Track unlimited subscriptions
                  </div>
                  <div className="flex items-center text-sm text-purple-700">
                    <CheckCircle className="w-4 h-4 mr-2 text-purple-500" />
                    Smart payment reminders
                  </div>
                  <div className="flex items-center text-sm text-purple-700">
                    <CheckCircle className="w-4 h-4 mr-2 text-purple-500" />
                    Spending analytics & insights
                  </div>
                </div>
              </div>

              {/* Social Signup Buttons */}
              <div className="grid grid-cols-1 gap-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleOAuthSignup('google')}
                  disabled={loading}
                >
                  <Chrome className="mr-2 h-4 w-4" />
                  Continue with Google
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleOAuthSignup('apple')}
                  disabled={loading}
                >
                  <Apple className="mr-2 h-4 w-4" />
                  Continue with Apple
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleOAuthSignup('facebook')}
                  disabled={loading}
                >
                  <Facebook className="mr-2 h-4 w-4" />
                  Continue with Facebook
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or sign up with</span>
                </div>
              </div>

              {/* Method Selection */}
              <div className="flex rounded-lg bg-gray-100 p-1">
                <button
                  type="button"
                  onClick={() => setLoginMethod('email')}
                  className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    loginMethod === 'email'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('phone')}
                  className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    loginMethod === 'phone'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Smartphone className="mr-2 h-4 w-4" />
                  Phone
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="h-11"
                      required
                    />
                  </div>
                </div>

                {loginMethod === 'email' ? (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="h-11"
                      required
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone number</Label>
                    <PhoneInput
                      id="phone"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className="h-11"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="h-11 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Must contain at least 8 characters with numbers and letters
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{' '}
                    <Link href="/terms" className="text-purple-600 hover:text-purple-500">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-purple-600 hover:text-purple-500">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button 
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" 
                  disabled={!agreed || loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/login" className="text-purple-600 hover:text-purple-500 font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}