'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Loader2, Shield, Mail, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { AuthService } from '@/services/auth.service';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function AdminVerify2FAForm() {
  const router = useRouter();
  const { adminVerify, isLoading: authLoading } = useAuth();
  
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Get email and session token from session storage (set during login)
  useEffect(() => {
    const storedEmail = sessionStorage.getItem('2fa_email');
    const storedSessionToken = sessionStorage.getItem('2fa_session_token');
    
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setError('Missing email information. Please login again.');
    }

    if (storedSessionToken) {
      setSessionToken(storedSessionToken);
    } else {
      setError('Missing session token. Please login again.');
    }
  }, []);

  // Start countdown timer
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      timerRef.current = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [countdown, canResend]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    if (!email || !sessionToken) {
      setError('Missing verification information. Please login again.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Verifying 2FA with:', { email, code: otp, session_token: sessionToken });
      
      await adminVerify({
        email,
        code: otp,
        session_token: sessionToken,
      });
      
      // Clear session storage on success
      sessionStorage.removeItem('2fa_email');
      sessionStorage.removeItem('2fa_session_token');
      
      console.log('Verification successful, redirecting...');
      
    } catch (error: any) {
      console.error('Verification error:', error);
      setError(error.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email || !sessionToken) {
      setError('Missing verification information');
      return;
    }

    setIsResending(true);
    setError(null);

    try {
      const response = await AuthService.resendAdminVerify2fa({ 
        email,
        session_token: sessionToken 
      });
      
      if (response.success) {
        toast.success('New verification code sent to your email');
        setCountdown(60);
        setCanResend(false);
      } else {
        setError(response.message || 'Failed to resend code');
      }
    } catch (error: any) {
      console.error('Resend error:', error);
      setError(error.response?.data?.message || 'Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToLogin = () => {
    sessionStorage.removeItem('2fa_email');
    sessionStorage.removeItem('2fa_session_token');
    router.push('/admin/login');
  };

  if (!email || !sessionToken) {
    return (
      <Card className="w-full shadow-lg border-0">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
            <p className="text-red-500 font-medium mb-2">Verification Failed</p>
            <p className="text-sm text-muted-foreground text-center mb-4">
              {error || 'Missing verification information. Please login again.'}
            </p>
            <Button onClick={handleBackToLogin} variant="outline">
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg border-0">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-xl">Admin Verification</CardTitle>
            <CardDescription>
              {email ? (
                <>Code sent to <span className="font-medium">{email}</span></>
              ) : (
                'Enter the verification code from your email'
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {/* OTP Input */}
          <div className="space-y-2 flex flex-col items-center">
            <Label>Verification Code</Label>
            <InputOTP
              value={otp}
              onChange={setOtp}
              maxLength={6}
              disabled={isLoading || authLoading}
              className="justify-center"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <p className="text-xs text-muted-foreground text-center">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          {/* Timer and Resend */}
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {canResend ? (
                  'Code expired'
                ) : (
                  `Resend available in ${countdown}s`
                )}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResendCode}
              disabled={!canResend || isResending}
              className="text-blue-600 hover:text-blue-800"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-3 w-3" />
                  Resend
                </>
              )}
            </Button>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-2">
            <p className="text-sm font-medium text-blue-800 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security Information
            </p>
            <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
              <li>Code expires in 10 minutes</li>
              <li>You have 5 attempts before temporary lockout</li>
              <li>2FA is mandatory for admin accounts</li>
              <li>Never share your verification code</li>
            </ul>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3">
        <Button
          onClick={handleVerify}
          className="w-full h-11 text-base bg-blue-600 hover:bg-blue-700"
          disabled={isLoading || authLoading || otp.length !== 6}
        >
          {isLoading || authLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify & Continue'
          )}
        </Button>

        <Button
          variant="link"
          onClick={handleBackToLogin}
          className="text-sm text-muted-foreground"
        >
          ← Back to login
        </Button>
      </CardFooter>
    </Card>
  );
}