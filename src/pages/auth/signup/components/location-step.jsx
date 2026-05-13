import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Globe, Loader2, MapPin } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { debounce } from '@/lib/helpers';
import { resolveCurrentLocation } from '@/lib/location';
import { cn } from '@/lib/utils';
import {
  useGeoLocationGet,
  useGetLocationSuggestions,
} from '@/services/redux/apis/jobApi';
import { locationData } from '@/services/redux/slice/authSlice';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { StepHeader } from './form-fields';

export function LocationStep({ form }) {
  const dispatch = useDispatch();
  const [activeDropdown, setActiveDropdown] = useState(null); // 'cityState' or 'country'
  const [suggestions, setSuggestions] = useState({
    locations: [],
    countries: [],
  });
  const [allCountries, setAllCountries] = useState([]);
  const [isFetchingCurrentLocation, setIsFetchingCurrentLocation] =
    useState(false);
  const [detectedLocation, setDetectedLocation] = useState(null);
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const containerRef = useRef(null);

  const { getLocationSuggestions, isLoading: isLoadingLocations } =
    useGetLocationSuggestions();
  const { getGeoLocation } = useGeoLocationGet();

  // Handle outside click to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch initial countries and detect location
  useEffect(() => {
    const init = async () => {
      try {
        // First, try to load from geo_location_persistent
        const persistent = localStorage.getItem('geo_location_persistent');
        let initialCountry = '';
        let initialLocation = '';

        if (persistent) {
          try {
            const data = JSON.parse(persistent);
            initialLocation = data.mapLocation || data.City || '';
            initialCountry = data.Country || '';
            
            if (initialLocation) form.setValue('stateCity', initialLocation);
            if (initialCountry) form.setValue('country', initialCountry);
          } catch (e) {
            console.error("Failed to parse geo_location_persistent", e);
          }
        }

        const res = await getLocationSuggestions({
          listType: 'Country_Lst',
          locationString: '',
        });
        const items = res?.Return?.Location?.tblLocation || [];
        setAllCountries(items);
        setSuggestions((prev) => ({ ...prev, countries: items }));

        // Default to US if no country detected/found and not already set
        if (!form.getValues('country')) {
          const us = items.find(
            (c) => c.Flag_Cd === 'US' || c.Country === 'United States',
          );
          if (us) {
            form.setValue('country', us.Country);
            setSelectedCountryId(us.Country_Id);
          }
        } else if (initialCountry) {
          // Find ID for the initial country
          const matched = items.find(c => c.Country === initialCountry);
          if (matched) setSelectedCountryId(matched.Country_Id);
        }
      } catch (err) {
        console.error('Failed to fetch initial countries', err);
      }
    };
    init();
  }, [getLocationSuggestions, form]);

  const handleUseCurrentLocation = async () => {
    setIsFetchingCurrentLocation(true);
    try {
      const geoLocation = await resolveCurrentLocation({
        dispatch,
        locationDataAction: locationData,
        geoLocationGetAction: getGeoLocation,
      });

      if (geoLocation) {
        form.setValue(
          'stateCity',
          geoLocation.mapLocation || geoLocation.City || '',
        );
        form.setValue(
          'country',
          geoLocation.Country || form.getValues('country'),
        );
        if (geoLocation.Country_Id)
          setSelectedCountryId(geoLocation.Country_Id);
        setActiveDropdown(null);
      }
    } catch (err) {
      console.error('Failed to use current location', err);
    } finally {
      setIsFetchingCurrentLocation(false);
    }
  };

  const fetchLocationSuggestions = useCallback(
    debounce(async (val, cId) => {
      if (!val) {
        setSuggestions((prev) => ({ ...prev, locations: [] }));
        return;
      }
      try {
        const res = await getLocationSuggestions({
          listType: 'Location_Suggest',
          locationString: val,
          countryIds: cId,
        });
        const items = res?.Return?.Location?.tblLocation || [];
        setSuggestions((prev) => ({ ...prev, locations: items }));
      } catch (err) {
        console.error('Location suggestions failed', err);
      }
    }, 300),
    [getLocationSuggestions],
  );

  return (
    <div
      className="space-y-6 flex flex-col items-center w-full"
      ref={containerRef}
    >
      <StepHeader
        title="Your Location"
        subtitle="Almost there! Just a few more details to find local opportunities."
        // icon={MapPin}
      />

      <div className="w-full max-w-md space-y-6">
        {/* Country Selector */}
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel className="text-sm font-semibold">Country</FormLabel>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Globe className="size-5" />
                </div>
                <FormControl>
                  <input
                    {...field}
                    placeholder="Search Country"
                    autoComplete="off"
                    onFocus={() => {
                      setSuggestions((prev) => ({
                        ...prev,
                        countries: allCountries,
                      }));
                      setActiveDropdown('country');
                    }}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      const filtered = allCountries.filter(
                        (c) =>
                          c.Country.toLowerCase().includes(
                            e.target.value.toLowerCase(),
                          ) ||
                          (c.Flag_Cd &&
                            c.Flag_Cd.toLowerCase().includes(
                              e.target.value.toLowerCase(),
                            )),
                      );
                      setSuggestions((prev) => ({
                        ...prev,
                        countries: filtered,
                      }));
                      setActiveDropdown('country');
                    }}
                    className="flex h-11 w-full rounded-md border border-slate-400 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-10 py-2 text-sm md:text-base outline-none transition-all focus:border-hw-blue-dark dark:focus:border-blue-400"
                  />
                </FormControl>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <ChevronDown
                    className={cn(
                      'size-4 transition-transform',
                      activeDropdown === 'country' && 'rotate-180',
                    )}
                  />
                </div>
              </div>
              <FormMessage />

              {activeDropdown === 'country' &&
                suggestions.countries.length > 0 && (
                  <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                    {suggestions.countries.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          form.setValue('country', item.Country);
                          setSelectedCountryId(item.Country_Id);
                          setActiveDropdown(null);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3"
                      >
                        {item.Flag_Cd && (
                          <img
                            src={`https://flagcdn.com/w40/${item.Flag_Cd.toLowerCase()}.png`}
                            alt="flag"
                            className="w-5 h-3.5 object-cover rounded-sm shadow-sm"
                          />
                        )}
                        <span className="text-sm font-medium">
                          {item.Country}
                        </span>
                        {field.value === item.Country && (
                          <Check className="size-4 ml-auto text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
            </FormItem>
          )}
        />

        {/* State / City Selector */}
        <FormField
          control={form.control}
          name="stateCity"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel className="text-sm font-semibold">
                City / State
              </FormLabel>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <MapPin className="size-5" />
                </div>
                <FormControl>
                  <input
                    {...field}
                    placeholder="Enter city or state"
                    autoComplete="off"
                    onFocus={() => {
                      if (field.value) setActiveDropdown('cityState');
                    }}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      fetchLocationSuggestions(
                        e.target.value,
                        selectedCountryId,
                      );
                      setActiveDropdown('cityState');
                    }}
                    className="flex h-11 w-full rounded-md border border-slate-400 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-10 py-2 text-sm md:text-base outline-none transition-all focus:border-hw-blue-dark dark:focus:border-blue-400"
                  />
                </FormControl>
                {isLoadingLocations && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="size-4 animate-spin text-slate-400" />
                  </div>
                )}
              </div>
              <FormMessage />

              {activeDropdown === 'cityState' &&
                (suggestions.locations.length > 0 || !field.value) && (
                  <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="max-h-60 overflow-y-auto">
                      {/* Current Location Option */}
                      <button
                        type="button"
                        onClick={handleUseCurrentLocation}
                        disabled={isFetchingCurrentLocation}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 transition-colors"
                      >
                        <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
                          {isFetchingCurrentLocation ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <MapPin className="size-4" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                            Use my current location
                          </span>
                          <span className="text-xs text-slate-500">
                            Detect your city automatically
                          </span>
                        </div>
                      </button>

                      {suggestions.locations.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            form.setValue('stateCity', item.Location);
                            if (item.Country)
                              form.setValue('country', item.Country);
                            if (item.Country_Id)
                              setSelectedCountryId(item.Country_Id);
                            setActiveDropdown(null);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 flex flex-col"
                        >
                          <span className="text-sm font-semibold">
                            {item.Location}
                          </span>
                          <span className="text-xs text-slate-500">
                            {`${item.City ? item.City + ', ' : ''}${item.State ? item.State + ', ' : ''}${item.Country || ''}`}
                          </span>
                        </button>
                      ))}

                      {field.value &&
                        suggestions.locations.length === 0 &&
                        !isLoadingLocations && (
                          <div className="px-4 py-3 text-sm text-slate-500 italic">
                            No suggestions found
                          </div>
                        )}
                    </div>
                  </div>
                )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/50">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium cursor-pointer">
                  I agree to the{' '}
                  <Link
                    to="/terms"
                    className="text-hw-blue-dark dark:text-blue-400 hover:underline font-bold transition-all"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    to="/privacy"
                    className="text-hw-blue-dark dark:text-blue-400 hover:underline font-bold transition-all"
                  >
                    Privacy Policy
                  </Link>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
