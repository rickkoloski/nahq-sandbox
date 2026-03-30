import Assessment from './pages/Assessment';
import DemoLogin from './pages/DemoLogin';
import Framework from './pages/Framework';
import IndividualCompetencyDetail from './pages/IndividualCompetencyDetail';
import IndividualDashboard from './pages/IndividualDashboard';
import IndividualDomainDetail from './pages/IndividualDomainDetail';
import IndividualHome from './pages/IndividualHome';
import IndividualUpskillPlan from './pages/IndividualUpskillPlan';
import InvitationEmail from './pages/InvitationEmail';
import Processing from './pages/Processing';
import Profile from './pages/Profile';
import __Layout from './Layout.jsx';

export const PAGES = {
    "IndividualHome": IndividualHome,
    "Framework": Framework,
    "Assessment": Assessment,
    "Processing": Processing,
    "IndividualDashboard": IndividualDashboard,
    "IndividualDomainDetail": IndividualDomainDetail,
    "IndividualCompetencyDetail": IndividualCompetencyDetail,
    "IndividualUpskillPlan": IndividualUpskillPlan,
    "Profile": Profile,
    "DemoLogin": DemoLogin,
    "InvitationEmail": InvitationEmail,
}

export const pagesConfig = {
    mainPage: "IndividualHome",
    Pages: PAGES,
    Layout: __Layout,
};