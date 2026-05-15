import { useEffect, useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { getSigninSchema } from '@/auth/forms/signin-schema';
import { decryptResponse, formatSocialData } from '@/utils/helpers/apiHelper';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  LoaderCircleIcon,
  Lock,
  Mail,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { toast } from 'sonner';
import { useCheckUserExist, useLogin } from '@/services/redux/apis/userApi';
import {
  authSuccess,
  setVerifyData,
  updateUserData,
} from '@/services/redux/slice/authSlice';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/common/icons';
import { decodeAppleToken } from '../../../lib/helpers';
import { SocialStep } from '../signup/components/social-step';

export function SignInPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { checkUserExist } = useCheckUserExist();
  const { login: loginApi } = useLogin();
  const { verifyData } = useSelector((state) => state.auth);

  const [activeStep, setActiveStep] = useState(1);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSocialLoading, setIsSocialLoading] = useState({
    google: false,
    facebook: false,
    apple: false,
  });

  const appId = import.meta.env.VITE_FACEBOOK_AUTH_APP_ID;
  const locationQuery = useLocation();
  useEffect(() => {
    const queryParams = new URLSearchParams(locationQuery.search);
    const allParams = Object.fromEntries(queryParams.entries());
    if (allParams?.id_token) {
      try {
        const decodedToken = decodeAppleToken(allParams?.id_token);
        console.log('Decoded Token', decodedToken,allParams);
        const mergedAppleData = {
          ...allParams,
          ...decodedToken,
        };
        dispatch(
          authSuccess({
            userData: { appleData: mergedAppleData },
            token: allParams.id_token,
            loginType: 'Apple',
          }),
        );

        handleSocialLogin(mergedAppleData, allParams.id_token, 'Apple');
      } catch (err) {
        dispatch(appleAuth.failure(err));
      }
    }
  }, [dispatch, locationQuery.search]);
  // Check for success message from password reset or error messages
  useEffect(() => {
    const pwdReset = searchParams.get('pwd_reset');
    const errorParam = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (pwdReset === 'success') {
      setSuccessMessage(
        'Your password has been successfully reset. You can now sign in with your new password.',
      );
    }

    if (errorParam) {
      switch (errorParam) {
        case 'auth_callback_failed':
          setError(
            errorDescription || 'Authentication failed. Please try again.',
          );
          break;
        case 'auth_callback_error':
          setError(
            errorDescription ||
              'An error occurred during authentication. Please try again.',
          );
          break;
        case 'auth_token_error':
          setError(
            errorDescription ||
              'Failed to set authentication session. Please try again.',
          );
          break;
        default:
          setError(
            errorDescription || 'Authentication error. Please try again.',
          );
          break;
      }
    }
  }, [searchParams]);

  const form = useForm({
    resolver: zodResolver(getSigninSchema()),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const handleSocialLogin = async (userInfo, token, type) => {
    try {
      setIsProcessing(true);
      setError(null);

      const email = userInfo.email || userInfo.userID; // For Facebook fallback
      if (!email) {
        toast.error(`${type} login failed: No email received.`);
        return;
      }

      // Format social data
      const formattedData = formatSocialData(userInfo, token, type);

      // Update form state and Redux for persistence
      form.setValue('email', email);
      dispatch(updateUserData({ email, loginType: type }));

      // Check if user exists
      const checkRes = await checkUserExist(email);
      dispatch(setVerifyData(checkRes)); // Persist for temporary use

      const decryptedCheck = await decryptResponse(checkRes);
      const userObj = decryptedCheck?.Return?.User?.tblUser?.[0];
      const userId = userObj?.User_Id;
      // console.log(userObj, "userObj",userId)
      if (userId && userId !== 0) {
        // User exists, perform login
        const loginPayload = {
          email,
          loginType: type,
          userId,
          googleJson: type === 'Google' ? formattedData : null,
          facebookJson: type === 'Facebook' ? formattedData : null,
          appleJson: type === 'Apple' ? formattedData : null,
          Salutation_Cd: userObj.Salutation_Cd,
          First_Name: userObj.First_Name,
          Middle_Name: userObj.Middle_Name,
          Last_Name: userObj.Last_Name,
          Full_Name: userObj.Full_Name,
        };

        const loginRes = await loginApi(loginPayload);
        const decryptedLogin = await decryptResponse(loginRes);
        console.log('Decrypted Login', decryptedLogin);
        const message = decryptedLogin?.[0]?.Message;

        if (message?.Body === 'Login Successful') {
          console.log('first');
          const statusId =
            decryptedLogin?.[0]?.Return?.User?.tblUser?.[0]?.Status_Id;
          console.log('statusId', statusId);
          if (statusId === 12) {
            toast.success('Please verify your account');
            navigate('/auth/signup-verification', { state: { email } });
          } else {
            toast.success(message.Body);
            dispatch(
              authSuccess({
                userData: loginRes,
                token: decryptedLogin?.[0]?.Return?.Token || token,
                loginType: type,
              }),
            );
            const path =
              userObj.User_Type === 'Jobseeker' ||
              userObj.User_Type === 'Employee'
                ? '/profile'
                : '/company-profile';
            navigate(path);
          }
        } else {
          setError(message?.Body || 'Login failed');
        }
      } else {
        // New user, redirect to signup
        toast.warning('Account not found. Please create an account.');
        dispatch(
          authSuccess({
            userData: { [`${type.toLowerCase()}Data`]: formattedData },
            loginType: type,
          }),
        );
        navigate('/auth/signup', { state: { email, isSocialSignup: true } });
      }
    } catch (err) {
      console.error(`${type} login error:`, err);
      setError(`Failed to sign in with ${type}.`);
    } finally {
      setIsProcessing(false);
    }
  };

  async function handleContinue() {
    const email = form.getValues('email');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      form.setError('email', {
        type: 'manual',
        message: 'Please enter a valid email address',
      });
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Update Redux for persistence
      dispatch(updateUserData({ email, loginType: 'EMail' }));

      const res = await checkUserExist(email);
      dispatch(setVerifyData(res)); // Save to Redux verifyData for Step 2 or other flows

      // const decryptedCheck = await decryptResponse(res);
      const userObj = res?.Return?.User?.tblUser?.[0];
      const userId = userObj?.User_Id;
      if (userId && userId !== 0) {
        setActiveStep(2);
      } else {
        toast.warning('Account not found. Please sign up.');
        navigate('/auth/signup', { state: { email } });
      }
    } catch (err) {
      setError('Failed to check user account.');
    } finally {
      setIsProcessing(false);
    }
  }

  async function onSubmit(values) {
    if (activeStep === 1) {
      handleContinue();
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Use persisted checkUserExist data from Redux instead of re-fetching
      const userObj = verifyData?.Return?.User?.tblUser?.[0];
      if (!userObj || userObj.EMail_Address !== values.email) {
        // Fallback if data is missing or mismatched (though unlikely in this flow)
        const freshRes = await checkUserExist(values.email);
        dispatch(setVerifyData(freshRes));
        const freshDecrypted = await decryptResponse(freshRes);
        var finalUserObj = freshDecrypted?.[0]?.Return?.User?.tblUser?.[0];
      } else {
        var finalUserObj = userObj;
      }

      const loginPayload = {
        email: values.email,
        password: values.password,
        loginType: 'EMail',
        userId: finalUserObj?.User_Id,
        Salutation_Cd: finalUserObj?.Salutation_Cd,
        First_Name: finalUserObj?.First_Name,
        Middle_Name: finalUserObj?.Middle_Name,
        Last_Name: finalUserObj?.Last_Name,
        Full_Name: finalUserObj?.Full_Name,
      };

      const loginRes = await loginApi(loginPayload);
      const decryptedLogin = await decryptResponse(loginRes);
      console.log('decryptedLogin', decryptedLogin);
      const message = decryptedLogin?.[0]?.Message;
      const response = decryptedLogin?.[0]?.Return?.User?.tblUser?.[0];
      if (message?.Body === 'Login Successful') {
        console.log(message, 'ajhdhd');
        const statusId = response?.Status_Id;
        console.log(statusId, 'statusId');

        if (statusId === 12) {
          // Save RAW encrypted response for security
          dispatch(
            authSuccess({
              userData: loginRes,
              loginType: 'EMail',
            }),
          );
          navigate('/auth/signup-verification', {
            state: { email: values.email },
          });
        } else {
          // Completely replace step-data with RAW login response
          dispatch(
            authSuccess({
              userData: loginRes,
              token: decryptedLogin?.[0]?.Return?.Token,
              loginType: 'EMail',
            }),
          );
          const path =
            response?.User_Type === 'Jobseeker' ||
            response?.User_Type === 'Employee'
              ? '/profile'
              : '/company-profile';
          navigate(path);
        }
      } else {
        setError(message?.Body || 'Invalid credentials');
      }
    } catch (err) {
      console.log(err);
      setError('Sign-in failed. Please check your credentials.');
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="block w-full space-y-5"
      >
        <div className="text-center space-y-1 pb-3">
          <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
          <p className="text-sm text-muted-foreground">
            {activeStep === 1
              ? 'Welcome back! Log in with your account.'
              : 'Please enter your password to continue.'}
          </p>
        </div>

        {error && (
          <Alert
            variant="destructive"
            appearance="light"
            onClose={() => setError(null)}
          >
            <AlertIcon>
              <AlertCircle />
            </AlertIcon>
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}

        {successMessage && (
          <Alert appearance="light" onClose={() => setSuccessMessage(null)}>
            <AlertIcon>
              <Check />
            </AlertIcon>
            <AlertTitle>{successMessage}</AlertTitle>
          </Alert>
        )}

        {activeStep === 1 ? (
          <>
            <SocialStep
              form={form}
              onSuccess={handleSocialLogin}
              config={{
                title: '', // StepHeader handles title
                subtitle: '',
              }}
            />

            <div className="max-w-sm xl:max-w-md flex justify-end mx-auto">
              <Button
                type="button"
                onClick={handleContinue}
                className="w-fit h-8 text-base min-w-[140px] font-semibold"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <LoaderCircleIcon className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Continue <ChevronRight className="size-4" />
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4 max-w-md mx-auto">
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <Mail className="size-5 text-hw-blue-dark dark:text-blue-400" />
                <span className="text-sm font-medium">
                  {form.getValues('email')}
                </span>
              </div>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                        <Input
                          placeholder="Password"
                          type={passwordVisible ? 'text' : 'password'}
                          className="pl-10 h-12"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setPasswordVisible(!passwordVisible)}
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        >
                          {passwordVisible ? (
                            <EyeOff className="size-5 text-muted-foreground" />
                          ) : (
                            <Eye className="size-5 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label className="text-sm font-normal cursor-pointer">
                        Remember me
                      </label>
                    </div>
                  )}
                />
                <Link
                  to="/auth/reset-password"
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="flex max-w-md mx-auto text-base justify-between items-center pt-5 ">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveStep(1)}
                  className="gap-2 border-hw-blue-dark text-hw-blue-dark hover:bg-transparent hover:text-hw-blue-dark dark:border-white dark:text-white dark:hover:bg-transparent dark:hover:text-white transition-none"
                >
                  <ChevronLeft className="size-4" /> Back
                </Button>

                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="gap-2 px-8 min-w-[100px]"
                >
                  {isProcessing ? (
                    <LoaderCircleIcon className="size-4 animate-spin" />
                  ) : (
                    'Login'
                  )}
                </Button>
              </div>
              
            </div>
          </>
        )}

        <div className="text-center text-sm text-muted-foreground pt-4">
          Don't have an account?{' '}
          <Link
            to="/auth/signup"
            className="font-semibold text-primary hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </form>
    </Form>
  );
}
