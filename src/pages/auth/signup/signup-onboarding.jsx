import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  ChevronLeft, 
  ChevronRight, 
  LoaderCircleIcon,
  Sparkles,
  MapPin,
  Compass
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useDispatch, useSelector } from 'react-redux';
import { updateOnboardingData } from '@/services/redux/slice/authSlice';
import { getSignupSchema } from '@/auth/forms/signup-schema';
import { useGetKeywordSuggestionList } from '@/services/redux/apis/jobApi';
import { useUpdateProfile, useUpdateCompanyProfile } from '@/services/redux/apis/profileApi';
import { decryptResponse } from '@/utils/helpers/apiHelper';
import { toast } from 'sonner';
import { useEffect } from 'react';

// Step Components
import { KeywordsStep } from './components/keywords-step';
import { SubKeywordsStep } from './components/sub-keywords-step';
import { LocationStep } from './components/location-step';

export function SignUpOnboardingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  const [activeStep, setActiveStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [availableKeywords, setAvailableKeywords] = useState([]);
  const [availableSubKeywords, setAvailableSubKeywords] = useState([]);
  
  const { getKeywordSuggestions, isLoading: loadingKeywords } = useGetKeywordSuggestionList();
  const { updateProfile } = useUpdateProfile();
  const { updateCompanyProfile } = useUpdateCompanyProfile();

  const decrypted = decryptResponse(userData);
  const userObj =decrypted?.[0]?.Return?.User?.tblUser?.[0] || userData;
  const userType = userObj?.User_Type || userData?.selectedRole;
  const form = useForm({
    resolver: zodResolver(getSignupSchema()),
    defaultValues: {
      keywords: [],
      subKeywords: [],
      stateCity: '',
      country: '',
      terms: false,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    fetchKeywords();
  }, []);

  const fetchKeywords = async () => {
    try {
      const res = await getKeywordSuggestions({
        action: "List",
        caller: "Registration",
        type: "Keyword",
        like: "",
        where: "Beginning",
      });
      const decrypted = await decryptResponse(res);
      const keywords = decrypted?.Return?.Keywords?.tblKeyword || [];
      const formatted = keywords.map((item) => ({
        id: item.Keyword_Id,
        name: item.Keyword,
        groupId: item.Keyword_Group_Id
      }));
      setAvailableKeywords(formatted);
      return true;
    } catch (err) {
      console.error("Error fetching keywords:", err);
      return false;
    }
  };

  const fetchSubKeywords = async (selectedKeywords) => {
    try {
      setIsProcessing(true);
      const selectedIds = selectedKeywords.map(k => typeof k === 'string' ? k : k.id);
      const res = await getKeywordSuggestions({
        action: "List",
        caller: "Registration",
        type: "SubKeyword",
        like: "",
        where: "Beginning",
        group: selectedIds || [],
      });
      const decrypted = await decryptResponse(res);
      const subKeywords = decrypted?.Return?.Keywords?.tblKeyword || [];
      const formatted = subKeywords.map((item) => ({
        id: item.Keyword_Id,
        name: item.Keyword,
        groupId: item.Keyword_Group_Id
      }));
      setAvailableSubKeywords(formatted);
      return true;
    } catch (err) {
      console.error("Error fetching sub-keywords:", err);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const saveKeywords = async () => {
    try {
      setIsProcessing(true);
      const subKeywords = form.getValues('subKeywords');
      const subKeywordNames = subKeywords.map(k => typeof k === 'string' ? k : k.name);
      
      const payload = {
        Action: "Add",
        Profile_Section_Type: "KeywordDefault",
        Profile_Section: subKeywordNames,
        Entry_No: null
      };

      let res;
      if (userType === "Employer" || userType === "Company") {
        res = await updateCompanyProfile(payload);
      } else {
        res = await updateProfile(payload);
      }

      const decrypted = await decryptResponse(res);
      return !!decrypted?.Return?.User_Profile?.tblUserProfile?.[0]?.User_Id;
    } catch (err) {
      console.error("Error saving keywords:", err);
      toast.error("Failed to save keywords");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { id: 1, title: 'Keywords', icon: Sparkles },
    { id: 2, title: 'Sub-keywords', icon: Compass },
    { id: 3, title: 'Location', icon: MapPin },
  ];

  const handleNext = async () => {
    const fields = activeStep === 1 ? ['keywords'] : activeStep === 2 ? ['subKeywords'] : ['stateCity', 'country', 'terms'];
    const isValid = await form.trigger(fields);
    if (isValid) {
      const stepValues = form.getValues(fields);
      dispatch(updateOnboardingData(stepValues));

      if (activeStep === 1) {
        const success = await fetchSubKeywords(form.getValues('keywords'));
        if (success !== false) setActiveStep(2);
      } else if (activeStep === 2) {
        const saved = await saveKeywords();
        setActiveStep(3);
      } else if (activeStep === steps.length) {
        onSubmit(form.getValues());
      }
    } else {
      toast.error("Please complete the required fields");
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 1));
  };

  async function onSubmit(values) {
    try {
      setIsProcessing(true);
      
      const payload = {
        Action: "Add",
        Profile_Section_Type: "LocationDefault",
        Entry_No: null,
        Profile_Section: [values.stateCity, values.country],
      };

      let res;
      if (userType === "Employer" || userType === "Company") {
        res = await updateCompanyProfile(payload);
      } else {
        res = await updateProfile(payload);
      }

      const decrypted = await decryptResponse(res);
      if (decrypted) {
        const path = (userType === "Jobseeker" || userType === "Employee") ? "/profile" : "/company-profile";
        navigate(path);
      } else {
        toast.error(decrypted?.Message?.Body || "Failed to save location");
      }
    } catch (err) {
      console.error('Onboarding error:', err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }

  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return <KeywordsStep form={form} options={availableKeywords} />;
      case 2:
        return <SubKeywordsStep form={form} options={availableSubKeywords} parentOptions={availableKeywords} />;
      case 3:
        return <LocationStep form={form} />;
      default:
        return null;
    }
  };

  const ActiveIcon = steps[activeStep - 1].icon;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
            <Form {...form}>
        <form className="space-y-1">
          <div className="xl:min-h-[450px] lg:min-h-[350px] flex flex-col justify-center items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderStep()}
          </div>

          <div className="flex max-w-md mx-auto justify-between items-center pt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={activeStep === 1 || isProcessing}
              className="gap-2 border-hw-blue-dark text-hw-blue-dark hover:bg-transparent hover:text-hw-blue-dark dark:border-white dark:text-white dark:hover:bg-transparent dark:hover:text-white transition-none"
            >
              <ChevronLeft className="size-4" /> Back
            </Button>

            <Button
              type="button"
              onClick={handleNext}
              className="gap-2 px-8 min-w-[140px]"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <LoaderCircleIcon className="size-4 animate-spin" />
              ) : activeStep === steps.length ? (
                'Finish Setup'
              ) : (
                <>Continue <ChevronRight className="size-4" /></>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
