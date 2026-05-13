import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  LoaderCircleIcon,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { getSignupSchema } from '@/auth/forms/signup-schema';
import { updateUserData, authSuccess } from '@/services/redux/slice/authSlice';
import { useRegister, useCheckUserExist } from '@/services/redux/apis/userApi';

// Step Components
import { SocialStep } from './components/social-step';
import { RoleStep } from './components/role-step';
import { DetailsStep } from './components/details-step';
import { PasswordStep } from './components/password-step';
import { decryptResponse } from '../../../utils/helpers/apiHelper';

export function SignUpPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const userData = useSelector((state) => state.auth.userData);
  const loginType = useSelector((state) => state.auth.loginType);
  
  const { register: registerUser, isLoading: isRegistering } = useRegister();
  const { checkUserExist } = useCheckUserExist();

  const [activeStep, setActiveStep] = useState(1);
  const [isSocialSignup, setIsSocialSignup] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const form = useForm({
    resolver: zodResolver(getSignupSchema('signup')),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      role: 'jobseeker',
      salutation: '',
      firstName: '',
      lastName: '',
      middleName: '',
      companyName: '',
      suffix: '',
      terms: false,
    },
    mode: 'onBlur',
  });

  // Sync social data when it changes in Redux
  useEffect(() => {
    if (userData && (loginType === 'Google' || loginType === 'Facebook' || loginType === 'Apple')) {
      setIsSocialSignup(true);
      const email = userData.email || '';
      const firstName = userData.given_name || userData.first_name || userData.full_name?.given_name || '';
      const lastName = userData.family_name || userData.last_name || userData.full_name?.family_name || '';
      
      form.reset({
        ...form.getValues(),
        email: email,
        firstName: firstName,
        lastName: lastName,
      });

      if (activeStep === 1) {
        setActiveStep(2);
      }
    }
  }, [userData, loginType, form]);

  const steps = [
    { 
      id: 1, 
      title: 'Get Started',
      subtitle: 'Join thousands of professionals finding their dream careers today.'
    },
    { 
      id: 2, 
      title: 'Select Your Path',
      subtitle: 'Are you looking to hire top talent or find your next big opportunity?'
    },
    { 
      id: 3, 
      title: 'Secure Your Account',
      subtitle: 'Create a robust password to keep your professional data safe.'
    },
    { 
      id: 4, 
      title: 'Personal Profile',
      subtitle: 'Provide your basic information to complete your professional profile.'
    },
  ];

  const getStepFields = (step) => {
    switch (step) {
      case 1: return ['email'];
      case 2: return ['role'];
      case 3: return ['password', 'confirmPassword'];
      case 4: 
        const basicFields = ['firstName', 'lastName'];
        const role = form.getValues('role');
        if (role === 'employer') {
          return [...basicFields, 'companyName'];
        }
        return basicFields;
      default: return [];
    }
  };

  const handleNext = async () => {
    setError("");
    const fields = getStepFields(activeStep);
    
    // For password step, we need extra manual check if they match before moving
    if (activeStep === 3) {
      const password = form.getValues('password');
      const confirmPassword = form.getValues('confirmPassword');
      if (password !== confirmPassword) {
        form.setError('confirmPassword', { type: 'manual', message: 'Passwords do not match' });
        return;
      }
    }

    const isValid = await form.trigger(fields);
    
    if (isValid) {
      // Save data for current step to Redux
      const stepValues = form.getValues(fields);
      dispatch(updateUserData(stepValues));

      if (activeStep === 1 && !isSocialSignup) {
        try {
          setIsProcessing(true);
          const email = form.getValues('email');
          const res = await checkUserExist(email);
          const userId = res?.Return?.User?.tblUser?.[0]?.User_Id;
          
          if (userId && userId !== 0) {
            setError("This email is already registered. Please try signing in instead.");
            return;
          }
          
          dispatch(updateUserData({ loginType: 'EMail' }));
          form.clearErrors();
          setActiveStep(2);
        } catch (err) {
          setError("Connection error. Please check your internet and try again.");
        } finally {
          setIsProcessing(false);
        }
      } else if (activeStep === 2 && isSocialSignup) {
        form.clearErrors();
        setActiveStep(4);
      } else {
        form.clearErrors();
        setTimeout(() => setActiveStep((prev) => Math.min(prev + 1, steps.length)), 0);
      }
    }
  };

  const handleBack = () => {
    setError("");
    form.clearErrors();
    if (activeStep === 4 && isSocialSignup) {
      setActiveStep(2);
    } else {
      setActiveStep((prev) => Math.max(prev - 1, 1));
    }
  };

  const normalize = (val) => val?.trim() || null;

  const buildPayload = (values) => {
    const regularUser = {
      EMail_Address: normalize(values.email),
      Password: isSocialSignup ? null : normalize(values.password),
      Salutation_Cd: normalize(values.salutation),
      First_Name: normalize(values.firstName),
      Middle_Name: normalize(values.middleName),
      Last_Name: normalize(values.lastName),
      Suffix_Cd: normalize(values.suffix),
      Full_Name: normalize(`${values.firstName} ${values.lastName}`),
    };

    return {
      UserType: values.role.charAt(0).toUpperCase() + values.role.slice(1),
      CompanyNm: values.role === 'employer' ? normalize(values.companyName) : null,
      loginType: loginType || "EMail",
      userJson: regularUser,
      googleJson: loginType === 'Google' ? userData : {},
      facebookJson: loginType === 'Facebook' ? userData : {},
      appleJson: loginType === 'Apple' ? userData : {},
    };
  };

  async function onSubmit(values) {
    try {
      console.log("hello")
      setIsProcessing(true);
      setError(null);

      const payload = buildPayload(values);
      console.log(payload);
      
      const res = await registerUser(payload);
      console.log(res);
      const decryptedData = await decryptResponse(res)
      console.log("decryptedData",decryptedData);
      const resultObj = decryptedData?.[0]?.Result || {};
      const { Answer, Action } = resultObj;

      if (Answer === 12 || (Answer === 1 && Action === "User Registered")) {
        // Success: Replace temporary step-wise data with RAW response from API
        dispatch(authSuccess({ 
          userData: res,
          token: decryptedData?.[0]?.Return?.Token || null,
          loginType: loginType || 'EMail'
        }));

        setSuccessMessage('Welcome! Your account has been created. Redirecting to verification...');
        setTimeout(() => {
          navigate('/auth/signup-verification', { state: { email: values.email } });
        }, 1500);
      } else {
        setError(res?.Message?.Display || "We couldn't create your account right now. Please try again later.");
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err?.data?.error || err.message || 'A server error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }

  const renderStep = () => {
    const currentStepConfig = steps.find(s => s.id === activeStep);
    switch (activeStep) {
      case 1: return <SocialStep form={form} config={currentStepConfig} />;
      case 2: return <RoleStep form={form} config={currentStepConfig} />;
      case 3: return <PasswordStep form={form} config={currentStepConfig} />;
      case 4: return <DetailsStep form={form} config={currentStepConfig} />;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 relative">
      <div className="absolute top-0 left-0 right-0 z-50 flex justify-center">
        {error && (
          <Alert variant="destructive" className="shadow-lg max-w-md p-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertIcon>
              <AlertCircle />
            </AlertIcon>
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}

        {successMessage && (
          <Alert className="shadow-lg animate-in max-w-md p-2 fade-in slide-in-from-top-2 duration-300 border-green-200 bg-green-50 dark:bg-green-900/20">
            <AlertIcon>
              <Check className="text-green-600" />
            </AlertIcon>
            <AlertTitle className="text-green-800 dark:text-green-400">{successMessage}</AlertTitle>
          </Alert>
        )}
      </div>

      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="space-y-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && activeStep < steps.length) {
              e.preventDefault();
              handleNext();
            }
          }}
        >
          <div className="min-h-[500px] flex flex-col justify-center items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderStep()}
          </div>

          <div className="flex max-w-md mx-auto justify-between items-center pt-0 ">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={activeStep === 1 || isProcessing}
              className="gap-2 border-hw-blue-dark text-hw-blue-dark hover:bg-transparent hover:text-hw-blue-dark dark:border-white dark:text-white dark:hover:bg-transparent dark:hover:text-white transition-none"
            >
              <ChevronLeft className="size-4" /> Back
            </Button>

            {activeStep < steps.length ? (
              <Button
                type="button"
                onClick={handleNext}
                className="gap-2 px-8 min-w-[140px]"
                disabled={isProcessing}
              >
                {isProcessing ? (
                   <LoaderCircleIcon className="size-4 animate-spin" />
                ) : (
                  <>Continue <ChevronRight className="size-4" /></>
                )}
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isProcessing}
                className="gap-2 px-8 min-w-[160px]"
              >
                {isProcessing ? (
                  <LoaderCircleIcon className="size-4 animate-spin" />
                ) : (
                  'Complete Signup'
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="text-center text-sm text-muted-foreground pt-0">
        Already have an account?{' '}
        <Link
          to="/auth/signin"
          className="font-semibold text-primary hover:underline"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
