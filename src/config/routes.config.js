import { HomePage } from '@/pages/home';
import { JobsNearMePage } from '@/pages/jobs-near-me/JobsNearMePage';
import { AllCompaniesPage } from '@/pages/companies/AllCompaniesPage';
import { AllCategoriesPage } from '@/pages/categories/AllCategoriesPage';
import { AllLocationsPage } from '@/pages/locations/AllLocationsPage';
import { JobSearchPage, JobDetailsStandalonePage } from '@/pages/jobs';
import { AccountUserProfilePage, AccountSettingsPage } from '@/pages/account';
import { JobseekerProfilePage } from '@/pages/account/home';
import { PurchaseOptionsPage } from '@/pages/purchase-options';
import { CartPage } from '@/pages/purchase-options/CartPage';

// Custom Layout Routes (Mainly for Job Search)
export const CUSTOM_LAYOUT_ROUTES = [
  { path: '/', element: HomePage },
  { path: '/jobsnearme', element: JobsNearMePage },
  { path: '/jobsnearme/keyword', element: AllCategoriesPage },
  { path: '/jobsnearme/company', element: AllCompaniesPage },
  { path: '/jobsnearme/industry', element: AllCategoriesPage },
  { path: '/jobsnearme/location', element: AllLocationsPage },
  { path: '/jobsnearme/keyword/:keyword', element: JobSearchPage },
  { path: '/jobsnearme/keyword/:keyword/:page', element: JobSearchPage },
  { path: '/jobsnearme/company/:company', element: JobSearchPage },
  { path: '/jobsnearme/industry/:industry', element: JobSearchPage },
  { path: '/jobsnearme/location/:country', element: JobSearchPage },
  { path: '/jobsnearme/location/:country/:state', element: JobSearchPage },
  { path: '/jobsnearme/location/:country/:state/:city', element: JobSearchPage },
  { path: '/jobsnearme/keyword/:keyword/company/:company', element: JobSearchPage },
  { path: '/jobsnearme/company/:company/keyword/:keyword', element: JobSearchPage },
  { path: '/jobsnearme/keyword/:keyword/industry/:industry', element: JobSearchPage },
  { path: '/jobsnearme/industry/:industry/keyword/:keyword', element: JobSearchPage },
  { path: '/jobsnearme/company/:company/industry/:industry', element: JobSearchPage },
  { path: '/jobsnearme/industry/:industry/company/:company', element: JobSearchPage },
  { path: '/jobsnearme/company/:company/location/:country/:state/:city/job-ad/:jobSlug', element: JobDetailsStandalonePage },
  { path: '/jobsnearme/company/:company/industry/:industry/keyword/:keyword/location/:country/:state/:city', element: JobSearchPage },
  { path: '/jobsnearme/keyword/:keyword/industry/:industry/location/:country/:state/:city', element: JobSearchPage },
  { path: '/jobsnearme/keyword/:keyword/location/:country/:state/:city', element: JobSearchPage },
  { path: '/jobsnearme/keyword/:keyword/location/:country/:state', element: JobSearchPage },
  { path: '/jobsnearme/keyword/:keyword/location/:country', element: JobSearchPage },
  { path: '/jobsnearme/company/:company/+/:country/:state/:city', element: JobSearchPage },
  { path: '/jobsnearme/industry/:industry/location/:country/:state/:city', element: JobSearchPage },
  { path: '/jobsnearme/industry/:industry/location/:country', element: JobSearchPage },
  { path: '/jobsnearme/company/:company/location/:country', element: JobSearchPage },
  { path: '/jobsnearme/page/:pageNo', element: JobSearchPage },
  { path: '/jobs/search', element: JobSearchPage },                
  { path: '/jobs/details/:id', element: JobDetailsStandalonePage },   
  { path: '/company-profile', element: AccountUserProfilePage },      
  { path: '/settings/account-settings', element: AccountSettingsPage },
  { path: '/profile', element: JobseekerProfilePage },                
  { path: '/purchase-plan-listing', element: PurchaseOptionsPage },    
  { path: '/cart', element: CartPage },
];
