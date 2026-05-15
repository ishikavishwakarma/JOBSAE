import { useEffect, useRef, useState } from 'react';
import {
  Check,
  Globe,
  MapPin as MapPinIcon,
  Monitor,
  Play,
  Share2,
  Smartphone,
  Target,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { findByKey } from '@/lib/helpers';
import { resolveCurrentLocation, getGeoPermissionState } from '@/lib/location';
import { useGeoLocationGet, useGetLocationSuggestions } from '@/services/redux/apis/jobApi';
import { useHomeList } from '@/services/redux/apis/profileApi';
import { locationData } from '@/services/redux/slice/authSlice';
import { setHomeData } from '@/services/redux/slice/profileSlice';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Container } from '@/components/common/container';
// Components
import CategorySection from './components/CategorySection';
import CompanySection from './components/CompanySection';
import JobSearchForm from './components/JobSearchForm';
import LocationSection from './components/LocationSection';
import SectionSkeleton from './components/SectionSkeleton';

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fetchStarted = useRef(false);
  const { getHomeList, isLoading: isHomeLoading } = useHomeList();
  const { getGeoLocation } = useGeoLocationGet();
  const [isResolvingLocation, setIsResolvingLocation] = useState(false);

  const sections =
    useSelector((state) => state.profile?.HomeData?.Return?.Home?.Sections) ||
    [];
  const companies =
    findByKey(sections, 'Object', 'Companies')?.Data?.List || [];
  const locations =
    findByKey(sections, 'Object', 'Locations')?.Data?.List || [];
  const industries =
    findByKey(sections, 'Object', 'Industries')?.Data?.List || [];
  const TopJobCategories =
    findByKey(sections, 'Object', 'Keywords')?.Data?.List || [];

  useEffect(() => {
    document.title = 'JOBSAE | Find Your Next Job';

    // Only fetch if we don't have sections already
    if (sections && sections.length > 0) {
      return;
    }

    if (fetchStarted.current) return;
    fetchStarted.current = true;

    const fetchHomeData = async () => {
      try {
        const res = await getHomeList({
          company: 1,
          industry: 1,
          keyword: 1,
          location: 1,
        });
        dispatch(setHomeData(res));
      } catch (err) {
        console.error('Home data fetch failed', err);
      }
    };

    fetchHomeData();
  }, [dispatch, getHomeList, sections]);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  const handleNavigationGuard = async (destination) => {
    const state = await getGeoPermissionState();
    console.log(state)
    if (state === 'prompt') {
      setPendingNavigation(destination);
      setShowLocationModal(true);
      return;
    }

    // If granted or denied, proceed directly
    navigate(destination);
  };

  const handleAllowLocation = async () => {
    if ('geolocation' in navigator) {
      setIsResolvingLocation(true);
      try {
        await resolveCurrentLocation({
          dispatch,
          locationDataAction: locationData,
          geoLocationGetAction: getGeoLocation,
        });

        localStorage.setItem('location_permission_granted', 'true');
        setShowLocationModal(false);
        if (pendingNavigation) navigate(pendingNavigation);
      } catch (error) {
        console.error('Location error:', error);
        // Even if resolution fails, we navigate but mark as attempted
        setShowLocationModal(false);
        if (pendingNavigation) navigate(pendingNavigation);
      } finally {
        setIsResolvingLocation(false);
      }
    } else {
      setShowLocationModal(false);
      if (pendingNavigation) navigate(pendingNavigation);
    }
  };

  const handleCancelLocation = () => {
    setShowLocationModal(false);
    if (pendingNavigation) navigate(pendingNavigation);
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-10  bg-linear-to-b from-hw-blue-dark/70 via-white to-white">
        {/* Background decorations with separate overflow control */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-blue-400/10 dark:bg-blue-400/15 blur-[160px] rounded-full" />
          <div className="absolute -top-24 -right-24 size-96 bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
        </div>

        <Container className="relative z-20">
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-black text-hw-blue-dark leading-[1.1] mb-6 tracking-tight drop-shadow-sm">
              Discover your next{' '}
              {/* <span className="bg-linear-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent drop-shadow-md"> */}
                career milestone
              {/* </span> */}
            </h1>
            <p className="md:text-lg text-base text-hw-blue-light mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              Access millions of opportunities and expert insights to find the
              role that truly fits your life and ambition.
            </p>
          </div>

          {/* Unified Search Component */}
          <div className="relative z-10 max-w-5xl mx-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <JobSearchForm
              popularKeywords={TopJobCategories}
              variant="home"
              onNavigate={handleNavigationGuard}
            />
          </div>
        </Container>
      </section>

      {/* 2. Categories Section */}
      {isHomeLoading ? (
        <section className="py-4 bg-slate-50 dark:bg-slate-950">
          <Container>
            <SectionSkeleton items={6} columns={3} />
          </Container>
        </section>
      ) : (
        <CategorySection
          industries={industries}
          onNavigate={handleNavigationGuard}
        />
      )}

      {/* 3. Companies Section */}
      {isHomeLoading ? (
        <section className="py-20 bg-white dark:bg-slate-900">
          <Container>
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-1/4 mb-16 animate-pulse" />
            <SectionSkeleton items={4} columns={4} />
          </Container>
        </section>
      ) : (
        <CompanySection
          companies={companies}
          onNavigate={handleNavigationGuard}
        />
      )}

      {/* 4. Popular Locations Section */}
      {isHomeLoading ? (
        <section className="py-24 bg-white dark:bg-slate-900">
          <Container>
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-1/4 mb-16 animate-pulse" />
            <SectionSkeleton items={4} columns={4} />
          </Container>
        </section>
      ) : (
        <LocationSection
          locations={locations}
          onNavigate={handleNavigationGuard}
        />
      )}

      {/* Features Section - Dark Brand Section */}
      <section className="py-24 bg-hw-blue-dark text-white border-y border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05),transparent)] pointer-events-none" />
        <Container className="relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-semibold text-white mb-6">
              Empowering your hiring journey
            </h2>
            <p className="text-xl text-blue-100/70 max-w-2xl mx-auto font-normal">
              From online distribution to social media reach, JOBSAE provides a
              complete recruitment ecosystem.
            </p>
          </div>

          <div className="space-y-32">
            {/* JOBSAE Online */}
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              <div className="flex-1 order-2 lg:order-1">
                <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-semibold mb-6">
                  JOBSAE Online
                </div>
                <h3 className="text-4xl font-semibold text-white mb-6 leading-tight">
                  Publish jobs online, <br />
                  reach candidates instantly
                </h3>
                <p className="text-xl text-blue-100/70 mb-8 leading-relaxed font-normal">
                  Our advanced distribution network ensures your job listings
                  appear on top search engines and job boards the moment you hit
                  publish.
                </p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-start text-lg text-blue-50 font-normal">
                    <Check className="w-6 h-6 text-blue-400 mr-4 shrink-0 mt-0.5" />{' '}
                    Unified multi-platform reach
                  </li>
                  <li className="flex items-start text-lg text-blue-50 font-normal">
                    <Check className="w-6 h-6 text-blue-400 mr-4 shrink-0 mt-0.5" />{' '}
                    AI-optimized candidate matching
                  </li>
                  <li className="flex items-start text-lg text-blue-50 font-normal">
                    <Check className="w-6 h-6 text-blue-400 mr-4 shrink-0 mt-0.5" />{' '}
                    Smart applicant tracking dashboard
                  </li>
                </ul>
                <Button className="h-14 px-10 bg-white text-hw-blue-dark hover:bg-blue-50 font-semibold text-lg rounded-xl shadow-lg border-none">
                  Get Started
                </Button>
              </div>
              <div className="flex-1 order-1 lg:order-2 w-full">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl aspect-video overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xl flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-70 mix-blend-multiply dark:mix-blend-overlay scale-110" />
                  <div className="relative z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white dark:border-slate-700 max-w-sm w-full mx-4 transform -rotate-2">
                    <div className="flex items-center gap-5 mb-6">
                      <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                        <Monitor className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="text-lg font-semibold dark:text-white">
                          Senior Product Designer
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          Design Studio • Remote
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full mb-3"></div>
                    <div className="w-3/4 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                    <Button
                      className="w-full mt-6 h-11 text-sm font-semibold"
                      variant="outline"
                    >
                      View Listing
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* JOBSAE Social */}
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              <div className="flex-1 w-full">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl aspect-video overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xl flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-70 mix-blend-multiply dark:mix-blend-overlay scale-110" />
                  <div className="relative z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white dark:border-slate-700 max-w-xs w-full mx-4 transform rotate-2">
                    <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3 text-pink-600 dark:text-pink-400 font-bold text-lg">
                        <Share2 className="w-6 h-6" /> Instagram
                      </div>
                      <div className="text-xs font-bold uppercase tracking-wider bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 px-3 py-1.5 rounded-full">
                        Boosted
                      </div>
                    </div>
                    <div className="w-full aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl mb-6 flex items-center justify-center">
                      <Play className="w-12 h-12 text-white dark:text-slate-500 fill-slate-300 dark:fill-slate-600" />
                    </div>
                    <div className="font-semibold text-base dark:text-white">
                      Growing our engineering team!
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="inline-block px-4 py-1.5 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 text-sm font-semibold mb-6">
                  JOBSAE Social
                </div>
                <h3 className="text-4xl font-semibold text-white mb-6 leading-tight">
                  Leverage the power of <br />
                  social networks
                </h3>
                <p className="text-xl text-blue-100/70 mb-8 leading-relaxed font-normal">
                  Turn your job listings into engaging social content. Reach
                  passive candidates where they spend their time—on Instagram,
                  TikTok, and Facebook.
                </p>
                <div className="grid sm:grid-cols-2 gap-8 mb-10">
                  <div>
                    <Smartphone className="w-8 h-8 text-pink-400 mb-3" />
                    <h4 className="font-semibold text-lg text-white">
                      Mobile Optimized
                    </h4>
                    <p className="text-base text-blue-100/70 mt-2 font-normal">
                      Perfectly formatted for vertical scrolling and mobile
                      browsing.
                    </p>
                  </div>
                  <div>
                    <Target className="w-8 h-8 text-pink-400 mb-3" />
                    <h4 className="font-semibold text-lg text-white">
                      Hyper-Local Targeting
                    </h4>
                    <p className="text-base text-blue-100/70 mt-2 font-normal">
                      Pinpoint candidates in specific neighborhoods and cities.
                    </p>
                  </div>
                </div>
                <Button className="h-14 px-10 bg-pink-600 hover:bg-pink-700 text-white font-semibold text-lg rounded-xl shadow-lg">
                  Explore Social Hiring
                </Button>
              </div>
            </div>

            {/* JOBSAE Signs */}
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              <div className="flex-1 order-2 lg:order-1">
                <div className="inline-block px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-sm font-semibold mb-6">
                  JOBSAE Signs
                </div>
                <h3 className="text-4xl font-semibold text-white mb-6 leading-tight">
                  Traditional hiring, <br />
                  modern execution
                </h3>
                <p className="text-xl text-blue-100/70 mb-8 leading-relaxed font-normal">
                  Bridge the gap between physical storefronts and digital
                  applications with professional print templates and integrated
                  QR technology.
                </p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-start text-lg text-blue-50 font-normal">
                    <Check className="w-6 h-6 text-orange-400 mr-4 shrink-0 mt-0.5" />{' '}
                    High-impact storefront displays
                  </li>
                  <li className="flex items-start text-lg text-blue-50 font-normal">
                    <Check className="w-6 h-6 text-orange-400 mr-4 shrink-0 mt-0.5" />{' '}
                    Scan-to-apply QR code integration
                  </li>
                  <li className="flex items-start text-lg text-blue-50 font-normal">
                    <Check className="w-6 h-6 text-orange-400 mr-4 shrink-0 mt-0.5" />{' '}
                    Custom vehicle and banner formats
                  </li>
                </ul>
                <Button className="h-14 px-10 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-lg rounded-xl shadow-lg">
                  Browse Templates
                </Button>
              </div>
              <div className="flex-1 order-1 lg:order-2 w-full">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl aspect-video overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xl flex items-center justify-center p-12 relative">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-70 mix-blend-multiply dark:mix-blend-overlay scale-110" />
                  <div className="relative z-10 w-full max-w-xs aspect-[3/4] bg-white rounded-xl shadow-2xl border-[12px] border-white flex flex-col items-center justify-center p-8 text-center transform -rotate-2">
                    <div className="text-red-600 font-bold text-5xl mb-4 tracking-tighter uppercase leading-none">
                      HELP
                      <br />
                      WANTED
                    </div>
                    <div className="w-20 h-1.5 bg-red-600 mb-6"></div>
                    <div className="font-semibold text-2xl mb-8 text-slate-900 leading-tight">
                      Apply Inside
                      <br />
                      or Scan Now
                    </div>
                    <div className="w-40 h-40 bg-slate-900 rounded-lg p-3">
                      <div className="w-full h-full bg-white flex items-center justify-center">
                        <div className="w-3/4 h-3/4 grid grid-cols-4 grid-rows-4 gap-1.5">
                          {Array.from({ length: 16 }).map((_, i) => (
                            <div
                              key={i}
                              className={`bg-slate-900 ${Math.random() > 0.4 ? 'opacity-100' : 'opacity-0'}`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600 dark:bg-blue-700 text-white text-center relative overflow-hidden mb-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
        <Container className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 leading-tight">
            Elevate your professional <br />
            journey today
          </h2>
          <p className="text-blue-100 mb-12 max-w-2xl mx-auto text-xl font-normal opacity-90">
            Join thousands of professionals and companies who have found their
            perfect match through JOBSAE.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button className="h-16 px-12 bg-white text-blue-600 hover:bg-slate-50 font-bold text-xl border-none rounded-xl shadow-xl hover:shadow-2xl transition-all">
              Create Account
            </Button>
            <Button
              variant="outline"
              className="h-16 px-12 border-white/40 text-white hover:bg-white/10 font-bold text-xl rounded-xl backdrop-blur-sm"
            >
              Post a Job
            </Button>
          </div>
        </Container>
      </section>

      {/* Location Guard Modal */}
      <Dialog open={showLocationModal} onOpenChange={setShowLocationModal}>
        <DialogContent className="max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-linear-to-br from-blue-600 to-indigo-700 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
            <div className="size-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/20 relative z-10">
              <MapPinIcon className="size-10 text-white" />
            </div>
            <DialogTitle className="text-2xl font-black text-white mb-2 relative z-10">
              Enable Location Access
            </DialogTitle>
            <DialogDescription className="text-blue-100 font-medium relative z-10">
              To provide better job search results near you, please allow access
              to your location.
            </DialogDescription>
          </div>
          <div className="p-8 bg-white dark:bg-slate-900">
            <DialogFooter className="flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                variant="outline"
                onClick={handleCancelLocation}
                className="flex-1 h-12 rounded-xl font-bold border-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAllowLocation}
                disabled={isResolvingLocation}
                className="flex-1 h-12 rounded-xl font-black bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-70"
              >
                {isResolvingLocation ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Locating...</span>
                  </div>
                ) : (
                  'Allow Location'
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { HomePage };
