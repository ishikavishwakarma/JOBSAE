import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { useDispatch } from 'react-redux';
import { authRequest, authSuccess, authFailure } from '@/services/redux/slice/authSlice';
import { googleAuthApi } from '@/services/api/socialAuth';
import { toast } from 'sonner';
import { Icons } from '@/components/common/icons';
import { Button } from '@/components/ui/button';
import { LoaderCircleIcon, Mail } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FormIconInput, StepHeader } from './form-fields';

export function SocialStep({ form, config, onSuccess }) {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [isSocialLoading, setIsSocialLoading] = useState({
    google: false,
    facebook: false,
    apple: false,
  });

  const appId = import.meta.env.VITE_FACEBOOK_AUTH_APP_ID;

  // Google Login Hook
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        dispatch(authRequest());
        setIsSocialLoading(prev => ({ ...prev, google: true }));
        const userInfo = await googleAuthApi(tokenResponse.access_token);
        
        if (!userInfo?.email) {
          const errMsg = "Google login failed or email not received.";
          dispatch(authFailure(errMsg));
          toast.error(errMsg);
          return;
        }

        if (onSuccess) {
          await onSuccess(userInfo, tokenResponse, "Google");
          return;
        }

        const mergedGoogleData = {
          ...userInfo,
          ...tokenResponse,
        };

        dispatch(authSuccess({
          userData: mergedGoogleData,
          token: tokenResponse.access_token,
          loginType: "Google",
        }));
        
        toast.success("Signed in with Google");
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : "Google login failed";
        dispatch(authFailure(errMsg));
        toast.error(errMsg);
      } finally {
        setIsSocialLoading(prev => ({ ...prev, google: false }));
      }
    },
    onError: () => {
      const errMsg = "Google login error";
      dispatch(authFailure(errMsg));
      toast.error(errMsg);
      setIsSocialLoading(prev => ({ ...prev, google: false }));
    },
  });

  // Facebook Login Handler
  const handleFacebookResponse = async (response) => {
    try {
      dispatch(authRequest());
      setIsSocialLoading(prev => ({ ...prev, facebook: true }));
      
      if (response?.status === "not_authorized" || response?.error) {
        const errMsg = "Facebook login failed or unauthorized.";
        dispatch(authFailure(errMsg));
        toast.error(errMsg);
        return;
      }

      if (onSuccess) {
        await onSuccess(response, response.accessToken, "Facebook");
        return;
      }

      dispatch(authSuccess({
        userData: response,
        token: response.accessToken,
        loginType: "Facebook",
      }));
      
      toast.success("Signed in with Facebook");
    } catch (error) {
      const errMsg = "Facebook login failed";
      dispatch(authFailure(errMsg));
      toast.error(errMsg);
    } finally {
      setIsSocialLoading(prev => ({ ...prev, facebook: false }));
    }
  };

  // Apple Login Redirect
  const handleAppleLogin = () => {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: "com.wantola.helpwantedweb",
      redirect_uri: "https://dapi.helpwantedus.com/auth/apple/callback",
      scope: "name email",
      response_mode: "form_post",
    });
    window.location.href = `https://appleid.apple.com/auth/authorize?${params}`;
  };

  const GoogleIcon = Icons?.googleColorful || (() => <span className="size-5">G</span>);
  const FacebookIcon = Icons?.facebook || (() => <span className="size-5">F</span>);
  const AppleIcon = Icons?.apple || (() => <span className="size-5">A</span>);

  return (
    <div className="space-y-6 flex flex-col items-center w-full">
      <StepHeader 
        title={config?.title} 
        subtitle={config?.subtitle} 
      />

      <div className="flex flex-col gap-3.5 w-full max-w-md">
        {/* Google Button */}
        <Button
          variant="outline"
          type="button"
          className="w-full justify-start gap-4 h-12 px-2 bg-hw-blue-dark hover:bg-hw-blue-dark/90 border-transparent transition-all group shadow-md"
          onClick={() => googleLogin()}
          disabled={Object.values(isSocialLoading).some(Boolean)}
        >
          <div className="bg-white p-1.5 rounded-md shadow-sm group-hover:scale-105 transition-transform">
            {isSocialLoading.google ? (
              <LoaderCircleIcon className="size-5 animate-spin text-primary" />
            ) : (
              <GoogleIcon className="size-5" />
            )}
          </div>
          <span className="font-semibold text-white">Sign Up with Google</span>
        </Button>

        {/* Facebook Button (using render props) */}
        <FacebookLogin
          appId={appId}
          autoLoad={false}
          fields="name,email,picture"
          callback={handleFacebookResponse}
          render={(renderProps) => (
            <Button
              variant="outline"
              type="button"
              className="w-full justify-start gap-4 h-12 px-2 bg-hw-blue-dark hover:bg-hw-blue-dark/90 border-transparent transition-all group shadow-md"
              onClick={renderProps.onClick}
              disabled={Object.values(isSocialLoading).some(Boolean)}
            >
              <div className="bg-white p-1.5 rounded-md shadow-sm group-hover:scale-105 transition-transform">
                {isSocialLoading.facebook ? (
                  <LoaderCircleIcon className="size-5 animate-spin text-primary" />
                ) : (
                  <FacebookIcon className="size-5 text-[#1877F2]" />
                )}
              </div>
              <span className="font-semibold text-white">Sign Up with Facebook</span>
            </Button>
          )}
        />

        {/* Apple Button */}
        <Button
          variant="outline"
          type="button"
          className="w-full justify-start gap-4 h-12 px-2 bg-hw-blue-dark hover:bg-hw-blue-dark/90 border-transparent transition-all group shadow-md"
          onClick={handleAppleLogin}
          disabled={Object.values(isSocialLoading).some(Boolean)}
        >
          <div className="bg-white p-1.5 rounded-md shadow-sm group-hover:scale-105 transition-transform">
            {isSocialLoading.apple ? (
              <LoaderCircleIcon className="size-5 animate-spin text-primary" />
            ) : (
              <AppleIcon className="size-5 text-black" />
            )}
          </div>
          <span className="font-semibold text-white">Sign Up with Apple</span>
        </Button>
      </div>

      <div className="mt-4 mb-6 relative flex items-center justify-center w-full max-w-md">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted-foreground/20" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-4 text-muted-foreground font-medium">or</span>
        </div>
      </div>

      <div className="w-full  max-w-md">
        <FormIconInput 
          form={form} 
          name="email" 
          placeholder="Email Address" 
          icon={Mail}
          required 
          hideLabel
        />
      </div>
    </div>
  );
}
