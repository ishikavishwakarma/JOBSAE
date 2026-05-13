import { useEffect, useState } from 'react';
import { decryptResponse } from '@/utils/helpers/apiHelper';
import {
  AlertCircle,
  ArrowRight,
  Check,
  LoaderCircleIcon,
  ShieldCheck,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useVerifyUserAction } from '@/services/redux/apis/userApi';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StepHeader } from './components/form-fields';

export function SignUpVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your email';

  const { userData } = useSelector((state) => state.auth);
  const decryptData = decryptResponse(userData);
  // The User object might be nested under tblUser depending on the API response structure
  const userObj = decryptData?.[0]?.Return?.User?.tblUser?.[0];

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  console.log(userObj);

  const { verifyUserAction } = useVerifyUserAction();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleResend = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      const res = await verifyUserAction({
        Action: 'Resend_OTP',
        EMail: email,
      });
      const decrypted = await decryptResponse(res);
      if (decrypted?.[0]?.Message?.Body === 'OTP Sent Successfully') {
        toast.success('Verification code resent');
        setTimer(60);
        setCanResend(false);
      } else {
        setError(decrypted?.[0]?.Message?.Body || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('Failed to resend verification code.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length < 6) return;

    try {
      setIsProcessing(true);
      setError(null);

      const res = await verifyUserAction({
        Action: 'Verify_OTP',
        UserId: userObj?.User_Id || null,
        EMail: userObj?.EMail_Address || email || null,
        ActiveCd: otpString,
      });

      // Based on previous patterns, the result might need decryption
      const decrypted = await decryptResponse(res);
      const message = decrypted?.[0]?.Message || decrypted?.Message;
      const result = decrypted?.[0]?.Result || decrypted?.Result;

      if (
        message?.Body === 'User Activated' ||
        result?.Answer === 1
      ) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/auth/signup-onboarding');
        }, 1500);
      } else {
        setError(message?.Body || 'Invalid verification code.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <StepHeader
        title="Verify Your Account"
        subtitle={`We've sent a 6-digit verification code to ${email}`}
        icon={ShieldCheck}
      />
      <div className="absolute -top-12 left-0 right-0 z-50 flex justify-center">
        {error && (
          <Alert
            variant="destructive"
            className="shadow-lg animate-in fade-in slide-in-from-top-2 duration-300"
          >
            <AlertIcon>
              <AlertCircle />
            </AlertIcon>
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}

        {success && (
          <Alert className="shadow-lg animate-in fade-in slide-in-from-top-2 duration-300 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
            <AlertIcon>
              <Check className="text-green-600" />
            </AlertIcon>
            <AlertTitle className="text-green-800 dark:text-green-400">
              Verification successful!
            </AlertTitle>
          </Alert>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex justify-between gap-2 max-w-[320px] mx-auto">
          {otp.map((digit, idx) => (
            <Input
              key={idx}
              id={`otp-${idx}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="size-12 md:size-14 text-center text-xl font-bold bg-slate-50 dark:bg-slate-900 border-slate-400 dark:border-slate-600 focus-visible:ring-0 focus-visible:border-hw-blue-dark dark:focus-visible:border-blue-400"
            />
          ))}
        </div>

        <div className="space-y-4">
          <Button
            type="submit"
            className="w-full h-12 text-lg font-bold gap-2"
            disabled={isProcessing || otp.join('').length < 6 || success}
          >
            {isProcessing ? (
              <LoaderCircleIcon className="size-5 animate-spin" />
            ) : (
              <>
                Verify Account <ArrowRight className="size-5" />
              </>
            )}
          </Button>

          <div className="text-center">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="text-sm font-bold text-blue-600 hover:underline"
              >
                Resend code
              </button>
            ) : (
              <p className="text-sm text-slate-500">
                Resend code in{' '}
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {timer}s
                </span>
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
