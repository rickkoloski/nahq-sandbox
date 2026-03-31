/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Assessment from './pages/Assessment';
import AssessmentTracking from './pages/AssessmentTracking';
import CompetencyDetail from './pages/CompetencyDetail';
import DomainDetail from './pages/DomainDetail';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import ExecutiveOverview from './pages/ExecutiveOverview';
import Home from './pages/Home';
import ManageUsers from './pages/ManageUsers';
import OrganizationalFramework from './pages/OrganizationalFramework';
import Profile from './pages/Profile';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Assessment": Assessment,
    "AssessmentTracking": AssessmentTracking,
    "CompetencyDetail": CompetencyDetail,
    "DomainDetail": DomainDetail,
    "ExecutiveDashboard": ExecutiveDashboard,
    "ExecutiveOverview": ExecutiveOverview,
    "Home": Home,
    "ManageUsers": ManageUsers,
    "OrganizationalFramework": OrganizationalFramework,
    "Profile": Profile,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};