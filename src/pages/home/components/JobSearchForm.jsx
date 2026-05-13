import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Globe, 
  ChevronDown 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  useGetKeywordSuggestionList, 
  useGetLocationSuggestions 
} from '@/services/redux/apis/jobApi';
import { debounce } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { locationData } from '@/services/redux/slice/authSlice';
import { resolveCurrentLocation } from '@/lib/location';
import { useGeoLocationGet } from '@/services/redux/apis/jobApi';
import { searchJob, selectKeywordData, SearchJobList } from '@/services/redux/slice/jobSlice';

const JobSearchForm = ({ variant = 'home', popularKeywords = [], onNavigate }) => {
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);

  const [search, setSearch] = useState(() => {
    const saved = localStorage.getItem("search_keyword_data");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return {
          keyword: data.keyword || '',
          cityState: data.location || '',
          country: data.country || '',
          countryCode: data.countryCode || ''
        };
      } catch (e) {
        console.error("Failed to parse saved search data", e);
      }
    }
    return {
      keyword: '',
      cityState: '',
      country: '',
      countryCode: ''
    };
  });

  const [suggestions, setSuggestions] = useState({
    keywords: [],
    locations: [],
    countries: []
  });
  const [activeDropdown, setActiveDropdown] = useState(null); // 'keyword', 'cityState', 'country'
  const [selectedCountryId, setSelectedCountryId] = useState(() => {
    const saved = localStorage.getItem("search_keyword_data");
    if (saved) {
      try {
        return JSON.parse(saved).countryId || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [selectedCountryFlag, setSelectedCountryFlag] = useState(() => {
    const saved = localStorage.getItem("search_keyword_data");
    if (saved) {
      try {
        return JSON.parse(saved).countryCode || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [allCountries, setAllCountries] = useState([]);
  const [isFetchingCurrentLocation, setIsFetchingCurrentLocation] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const fetchStarted = useRef(false);
  const dispatch = useDispatch();
  const keywordData = useSelector(selectKeywordData);
  const [geoPermission, setGeoPermission] = useState('prompt'); // 'prompt', 'granted', 'denied'

  const { getKeywordSuggestions, isLoading: isLoadingKeywords } = useGetKeywordSuggestionList();
  const { getLocationSuggestions, isLoading: isLoadingLocations } = useGetLocationSuggestions();
  const { getGeoLocation } = useGeoLocationGet();

  const handleUseCurrentLocation = async () => {
    setIsFetchingCurrentLocation(true);
    try {
      const geoLocation = await resolveCurrentLocation({
        dispatch,
        locationDataAction: locationData,
        geoLocationGetAction: getGeoLocation,
      });
      
      if (geoLocation) {
        setSearch((prev) => ({
          ...prev,
          cityState: geoLocation.mapLocation || geoLocation.City || '',
          country: geoLocation.Country || prev.country,
          countryCode: geoLocation.Country_Cd || prev.countryCode,
        }));
        if (geoLocation.Country_Id) setSelectedCountryId(geoLocation.Country_Id);
        if (geoLocation.Country_Cd) setSelectedCountryFlag(geoLocation.Country_Cd);
      }
    } catch (err) {
      console.error("Failed to use current location", err);
    } finally {
      setIsFetchingCurrentLocation(false);
    }
  };

  // Combine loading states for general UI if needed, but better to use specific ones
  const isGlobalLoading = isLoadingKeywords || isLoadingLocations;

  // Debounced fetchers
  const fetchKeywordSuggestions = useCallback(
    debounce(async (val) => {
      if (!val) {
        setSuggestions(prev => ({ ...prev, keywords: [] }));
        return;
      }
      try {
        const res = await getKeywordSuggestions({
          action: "Suggest",
          caller: "Web",
          type: "Keyword",
          like: val,
          where: "Beginning",
        });
        const keywordItems = res?.Return?.Keywords?.tblKeyword || [];
        setSuggestions(prev => ({ ...prev, keywords: keywordItems }));
      } catch (err) {
        console.error("Keyword suggestions failed", err);
      }
    }, 300),
    [getKeywordSuggestions]
  );

  const fetchAllCountries = useCallback(async () => {
    try {
      // Fetch initial geo location (detected location)
      // getGeoLocation({ Action: "Get" }).then(res => {
      //   const geo = res?.Return?.Geo_Location;
      
        const geo = localStorage.getItem("user_location") ;
      
        if (geo) setDetectedLocation(geo);
      // }).catch(err => console.error("Initial geo fetch failed", err));

      const res = await getLocationSuggestions({
        listType: "Country_Lst",
        locationString: "",
      });
      const items = res?.Return?.Location?.tblLocation || [];
      setAllCountries(items);
      setSuggestions(prev => ({ ...prev, countries: items }));
      
      // Default to US if found
      const us = items.find(c => c.Flag_Cd === 'US' || c.Country === 'United States');
      if (us) {
        setSearch(prev => ({ ...prev, country: us.Country, countryCode: us.Flag_Cd }));
        setSelectedCountryId(us.Country_Id);
        setSelectedCountryFlag(us.Flag_Cd);
      }
    } catch (err) {
      console.error("Initial countries fetch failed", err);
    }
  }, [getLocationSuggestions]);

  useEffect(() => {
    if (fetchStarted.current) return;
    fetchStarted.current = true;
    fetchAllCountries();

    // Check geolocation permission
    if ("permissions" in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        setGeoPermission(result.state);
        result.onchange = () => setGeoPermission(result.state);
      });
    }
  }, [fetchAllCountries]);

  const fetchLocationSuggestions = useCallback(
    debounce(async (val, cId) => {
      if (!val) {
        setSuggestions(prev => ({ ...prev, locations: [] }));
        return;
      }
      try {
        const res = await getLocationSuggestions({
          listType: "Location_Suggest",
          locationString: val,
          countryIds: cId,
        });
        const items = res?.Return?.Location?.tblLocation || [];
        setSuggestions(prev => ({ ...prev, locations: items }));
      } catch (err) {
        console.error("Location suggestions failed", err);
      }
    }, 300),
    [getLocationSuggestions]
  );

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const { keyword, cityState: location, country, countryCode } = search;
     setFormError("");
    if (!keyword?.trim() && !location?.trim()) {
      setFormError("Please enter a job keyword or location to start search.");
      return;
    }

    try {
      dispatch(searchJob.request());
      setSearchLoading(true);
      
      let locKey = null; // We can expand this if we have a selected location object from suggestions

      if (!locKey && location?.trim()) {
        const parts = location.split(",").map((p) => p.trim());
        const city = parts[0] || "";
        const state = parts.length >= 2 ? parts[1] : "";
        const cCode = countryCode || (parts.length === 3 ? parts[2] : country?.substring(0, 2) || "US");

        const normalize = (str) => encodeURIComponent(str.toLowerCase().replace(/\s+/g, "-"));
        const cityKey = normalize(city);
        const stateKey = normalize(state);
        const countryKey = normalize(cCode);

        if (cityKey) {
          locKey = `/location/${countryKey}${stateKey ? `/${stateKey}` : ""}/${cityKey}`;
        } else {
          locKey = `/location/${countryKey}`;
        }
      }

      const searchTerm = keyword;
      const formatted = encodeURIComponent(
        searchTerm?.trim()?.toLowerCase().replace(/\s+/g, "-") || "",
      );

      let callerPath = "/jobsnearme";
      if (searchTerm && locKey) {
        callerPath = `/jobsnearme/keyword/${formatted}${locKey}`;
      } else if (searchTerm) {
        callerPath = `/jobsnearme/keyword/${formatted}`;
      } else if (locKey) {
        callerPath = `/jobsnearme${locKey}`;
      }

      const requestData = {
        method: "Search",
        keyword: searchTerm,
        location,
        callerUrl: "/jobsnearme/jobsearch",
      };

      if (variant === 'home' && onNavigate) {
        onNavigate(callerPath);
      } else {
        navigate(callerPath, { state: { method: "Search" } });
      }

      // Save to Redux and Local Storage
      const searchState = {
        keyword: searchTerm,
        locKey,
        location,
        country,
        countryId: selectedCountryId,
      };

      if (variant === "home") {
        const data = await dispatch(SearchJobList(requestData)).unwrap();
        dispatch(searchJob.success({
            ...searchState,
            ...data
        }));
      } else {
        dispatch(searchJob.success(searchState));
      }

    } catch (err) {
      console.error("Search failed:", err);
      dispatch(searchJob.failure(err));
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  if (variant === 'header') {
    return (
      <div 
        ref={searchContainerRef}
        className="hidden lg:flex items-center bg-muted/50 dark:bg-slate-900/50 border border-border rounded-xl px-1 py-1 w-full max-w-[580px] group focus-within:ring-2 focus-within:ring-primary/20 transition-all"
      >
        <div className="relative flex-1 flex items-center px-3 border-r border-border/50">
          <Search className="size-4 text-muted-foreground shrink-0" />
          <input 
            type="text" 
            placeholder="Jobs, companies..." 
            className="w-full bg-transparent border-none py-1.5 pl-2 pr-2 text-sm focus:ring-0 placeholder:text-muted-foreground/70 outline-none"
            value={search.keyword}
            onChange={(e) => {
              setSearch({ ...search, keyword: e.target.value });
              fetchKeywordSuggestions(e.target.value);
              setActiveDropdown('keyword');
            }}
            onFocus={() => {
              if (suggestions.keywords.length > 0) setActiveDropdown('keyword');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          {activeDropdown === 'keyword' && (suggestions.keywords.length > 0 || isLoadingKeywords) && (
            <SuggestionDropdown 
              items={suggestions.keywords} 
              type="keyword" 
              variant="header"
              isLoading={isLoadingKeywords}
              onSelect={(item) => {
                setSearch({ ...search, keyword: item.Keyword });
                setActiveDropdown(null);
              }} 
            />
          )}
        </div>

        <div className="relative w-16 flex items-center px-2 border-r border-border/50">
          <input 
            type="text" 
            placeholder="IN" 
            className="w-full bg-transparent border-none py-1.5 px-1 text-sm text-center font-bold uppercase focus:ring-0 placeholder:text-muted-foreground/70 outline-none"
            value={search.countryCode}
            onChange={(e) => {
              const val = e.target.value.toUpperCase().slice(0, 2);
              setSearch({ ...search, countryCode: val });
              
              // Local filtering
              const filtered = allCountries.filter(c => 
                c.Country.toLowerCase().includes(val.toLowerCase()) || 
                (c.Flag_Cd && c.Flag_Cd.toLowerCase().includes(val.toLowerCase()))
              );
              setSuggestions(prev => ({ ...prev, countries: filtered }));
              setActiveDropdown('country');
            }}
            onFocus={() => {
              setSuggestions(prev => ({ ...prev, countries: allCountries }));
              setActiveDropdown('country');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          {activeDropdown === 'country' && suggestions.countries.length > 0 && (
            <SuggestionDropdown 
              items={suggestions.countries} 
              type="country" 
              variant="header"
              onSelect={(item) => {
                setSearch({ ...search, country: item.Country, countryCode: item.Flag_Cd || item.Country.slice(0, 2).toUpperCase() });
                setSelectedCountryId(item.Country_Id);
                setActiveDropdown(null);
              }} 
            />
          )}
        </div>

        <div className="relative flex-1 flex items-center px-3">
          <MapPin className="size-4 text-muted-foreground shrink-0" />
          <input 
            type="text" 
            placeholder="City, state..." 
            className="w-full bg-transparent border-none py-1.5 pl-2 pr-2 text-sm focus:ring-0 placeholder:text-muted-foreground/70 outline-none"
            value={search.cityState}
            onChange={(e) => {
              setSearch({ ...search, cityState: e.target.value });
              fetchLocationSuggestions(e.target.value, selectedCountryId);
              setActiveDropdown('location');
            }}
            onFocus={() => {
              if (suggestions.locations.length > 0) setActiveDropdown('location');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          {activeDropdown === 'location' && (suggestions.locations.length > 0 || isLoadingLocations || isFetchingCurrentLocation) && (
            <SuggestionDropdown 
              items={suggestions.locations} 
              type="location" 
              variant="header"
              isLoading={isLoadingLocations || isFetchingCurrentLocation}
              showUseCurrentLocation={true}
              detectedLocation={detectedLocation}
              geoPermission={geoPermission}
              onUseCurrentLocation={handleUseCurrentLocation}
              onSelect={(item) => {
                setSearch({ 
                  ...search, 
                  cityState: item.Location,
                  country: item.Country || search.country,
                  countryCode: item.Country_Cd || item.Flag_Cd || search.countryCode
                });
                if (item.Country_Id) setSelectedCountryId(item.Country_Id);
                if (item.Country_Cd || item.Flag_Cd) setSelectedCountryFlag(item.Country_Cd || item.Flag_Cd);
                setActiveDropdown(null);
              }} 
            />
          )}
        </div>

        <Button 
          onClick={handleSearch}
          size="icon" 
          className="size-8 rounded-lg shrink-0 ml-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-70"
          disabled={searchLoading}
        >
          {searchLoading ? (
            <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search className="size-4" />
          )}
        </Button>
      </div>
    );
  }

  // Home Page Variant
  return (
    <div className="relative  w-full" ref={searchContainerRef}>
      <div className="bg-white h-52 md:h-fit py-1 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]  flex flex-col md:flex-row items-center gap-0 group transition-all hover:border-blue-500 dark:hover:border-blue-400">
        
        <SearchInput 
          id="keyword"
          icon={Search}
          placeholder="Job title, keywords, or company"
          value={search.keyword}
          suggestions={suggestions.keywords}
          type="keyword"
          className="rounded-l-xl"
          activeDropdown={activeDropdown}
          setActiveDropdown={setActiveDropdown}
          isLoading={isLoadingKeywords}
          onChange={val => {
            setFormError("");
            setSearch({...search, keyword: val});
            fetchKeywordSuggestions(val);
          }}
          onSelect={item => {
            setSearch({...search, keyword: item.Keyword});
            setActiveDropdown(null);
          }}
        />
        
        <div className="hidden md:block w-px h-10 bg-slate-200 dark:bg-slate-700" />

        <SearchInput 
          id="cityState"
          icon={MapPin}
          placeholder="City, state, or zip"
          value={search.cityState}
          suggestions={suggestions.locations}
          type="location"
          activeDropdown={activeDropdown}
          setActiveDropdown={setActiveDropdown}
          isLoading={isLoadingLocations || isFetchingCurrentLocation}
          showUseCurrentLocation={true}
          detectedLocation={detectedLocation}
          onUseCurrentLocation={handleUseCurrentLocation}
          onChange={val => {
            setFormError("");
            setSearch({...search, cityState: val});
            fetchLocationSuggestions(val, selectedCountryId);
          }}
          onSelect={item => {
            setSearch({ 
              ...search, 
              cityState: item.Location,
              country: item.Country || search.country,
              countryCode: item.Country_Cd || item.Flag_Cd || search.countryCode
            });
            if (item.Country_Id) setSelectedCountryId(item.Country_Id);
            if (item.Country_Cd || item.Flag_Cd) setSelectedCountryFlag(item.Country_Cd || item.Flag_Cd);
            setActiveDropdown(null);
          }}
        />

        <div className="hidden md:block w-px h-10 bg-slate-200 dark:bg-slate-700" />

        <SearchInput 
          id="country"
          icon={Globe}
          placeholder="Code"
          value={search.countryCode}
          suggestions={suggestions.countries}
          flagCd={selectedCountryFlag}
          type="country" 
          className="md:w-40 h-12 flex-none"
          activeDropdown={activeDropdown} 
          setActiveDropdown={setActiveDropdown}
          isLoading={isLoadingLocations}
          onChange={val => {
            setFormError("");
            setSearch({...search, country: val, countryCode: val});
            const filtered = allCountries.filter(c => 
              c.Country.toLowerCase().includes(val.toLowerCase()) || 
              (c.Flag_Cd && c.Flag_Cd.toLowerCase().includes(val.toLowerCase()))
            );
            setSuggestions(prev => ({ ...prev, countries: filtered }));
          }}
          onFocus={() => {
            setSuggestions(prev => ({ ...prev, countries: allCountries }));
          }}
          onSelect={item => {
            setSearch({...search, country: item.Country, countryCode: item.Flag_Cd});
            setSelectedCountryId(item.Country_Id);
            setSelectedCountryFlag(item.Flag_Cd);
            setActiveDropdown(null);
          }}
        />

        <div className="w-full md:w-auto p-1">
          <Button 
            className="w-full md:w-auto h-10 px-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95 disabled:opacity-70"
            onClick={handleSearch}
            disabled={searchLoading}
          >
            {searchLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Searching...</span>
              </div>
            ) : (
              "Find Jobs"
            )}
          </Button>
        </div>
      </div>

      {formError && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-200 text-center">
          {formError}
        </div>
      )}

      {/* Popular Searches */}
      <div className="mt-10 text-center">
        <span className="text-lg font-semibold text-slate-900 dark:text-slate-200 block md:inline mb-3 md:mb-0 mr-4">
          Popular searches:
        </span>
        <div className="inline-flex flex-wrap justify-center gap-x-6 gap-y-3">
          {popularKeywords.map((keyword, index) => {
            const path = `/jobsnearme${keyword.URL || keyword.mapKey}`;
            return (
              <Link 
                key={index} 
                to={path}
                onClick={(e) => {
                  if (variant === 'home' && onNavigate) {
                    e.preventDefault();
                    onNavigate(path);
                  }
                }}
                className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors border-b-2 border-transparent hover:border-blue-600 dark:hover:border-blue-400 pb-0.5"
              >
                {keyword.Title || keyword}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JobSearchForm;

// Helper Sub-components
const SearchInput = ({ 
  icon: Icon, 
  placeholder, 
  value, 
  onChange, 
  onSelect, 
  suggestions, 
  type, 
  id,
  className,
  flagCd,
  activeDropdown,
  setActiveDropdown,
  isLoading,
  onUseCurrentLocation,
  showUseCurrentLocation,
  geoPermission,
  detectedLocation
}) => (
  <div className={cn("flex-1 relative flex items-center px-6 w-full md:w-auto h-10 transition-colors", className)}>
    <div className="flex items-center gap-2 shrink-0">
      {flagCd ? (
        <img 
          src={`https://flagcdn.com/w40/${flagCd.toLowerCase()}.png`} 
          alt="flag"
          className="w-6 h-4.5 object-cover rounded-sm shadow-sm"
        />
      ) : (
        <Icon className="w-6 h-6 text-slate-400 dark:text-slate-500" />
      )}
    </div>
    <input 
      placeholder={placeholder} 
      className="w-full bg-transparent border-none focus:ring-0 md:text-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 outline-none font-medium"
      value={value}
      onFocus={() => {
        if (id === 'country' || (suggestions && suggestions.length > 0)) {
          setActiveDropdown(id);
        }
      }}
      onChange={e => {
        const val = e.target.value;
        onChange(val);
        if (val.trim().length > 0 || id === 'country') {
          setActiveDropdown(id);
        } else {
          setActiveDropdown(null);
        }
      }}
    />
    <ChevronDown className={cn("w-5 h-5 text-slate-400 dark:text-slate-500 transition-transform duration-200", activeDropdown === id && "rotate-180")} />
    {activeDropdown === id && (
      <SuggestionDropdown 
        items={suggestions} 
        type={type}
        isLoading={isLoading}
        showUseCurrentLocation={id === 'cityState' || id === 'location'}
        detectedLocation={detectedLocation}
        geoPermission={geoPermission}
        onUseCurrentLocation={onUseCurrentLocation}
        onSelect={(item) => {
          onSelect(item);
        }}
      />
    )}
  </div>
);

const SuggestionDropdown = ({ items, type, onSelect, isLoading, variant = 'home', showUseCurrentLocation, onUseCurrentLocation, detectedLocation, geoPermission }) => {
  return (
    <div 
      className={cn(
        "absolute top-full left-0 w-full mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200",
        variant === 'header' && "w-64"
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="max-h-[280px]  overflow-y-auto no-scrollbar py-2">
        {showUseCurrentLocation && geoPermission !== 'denied' && detectedLocation && (
          <button
            onClick={() => {
              onSelect({ 
                Location: detectedLocation.mapLocation || detectedLocation.City, 
                Country: detectedLocation.Country,
                Country_Cd: detectedLocation.Country_Cd,
                Country_Id: detectedLocation.Country_Id,
                ...detectedLocation 
              });
            }}
            className="w-full px-6 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-3 transition-colors group border-b border-slate-100 dark:border-slate-800"
          >
            <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
              <MapPin className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Current: {detectedLocation.mapLocation || detectedLocation.City}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Your detected location</span>
            </div>
          </button>
        )}

        {showUseCurrentLocation && geoPermission !== 'denied' && !detectedLocation && (
          <button
            onClick={() => onUseCurrentLocation()}
            className="w-full px-6 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-3 transition-colors group border-b border-slate-100 dark:border-slate-800 mb-1"
          >
            <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
              <Globe className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">Use my current location</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Detect your city automatically</span>
            </div>
          </button>
        )}

        {isLoading ? (
          <div className="px-6 py-4 text-center text-slate-500 dark:text-slate-400 flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Fetching suggestions...</span>
          </div>
        ) : items.length > 0 ? (
          items.map((item, idx) => {
            const label = type === 'keyword' ? item.Keyword : (type === 'country' ? (item.Flag_Cd || item.Country_Cd || item.Country) : (item.Location || item.Country || item.Name));
            const subLabel = type === 'keyword' ? null : (type === 'country' ? null : `${item.City ? item.City + ', ' : ''}${item.State ? item.State + ', ' : ''}${item.Country || ''}`.replace(/, $/, ''));
            
            return (
              <button
                key={idx}
                onClick={() => onSelect(item)}
                className="w-full px-6 py-2 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-3 transition-colors group"
              >
                {type === 'country' && item.Flag_Cd && (
                  <img 
                    src={`https://flagcdn.com/w40/${item.Flag_Cd.toLowerCase()}.png`} 
                    alt="flag"
                    className="w-5 h-3.5 object-cover rounded-sm shadow-sm shrink-0"
                  />
                )}
                <div className="flex flex-col gap-0.5">
                  <span className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {label}
                  </span>
                  {subLabel && (
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {subLabel}
                    </span>
                  )}
                </div>
              </button>
            );
          })
        ) : (
          !showUseCurrentLocation && (
            <div className="px-6 py-4 text-center text-slate-500 dark:text-slate-400">
              No suggestions found
            </div>
          )
        )}
      </div>
    </div>
  );
};
