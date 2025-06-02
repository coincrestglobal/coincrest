// AppRouter.jsx
import { createBrowserRouter, RouterProvider } from "react-router";
import AppLayout from "../layouts/AppLayout";
import Error from "../pages/Error";
import Home from "../pages/Home";
import ContactUs from "../pages/ContactUs";
import AboutUs from "../pages/AboutUs";
import Earnings from "../pages/Earnings";
import SignUp from "../components/authentication/SignupForm";
import Login from "../components/authentication/LoginForm";
// import BeforeEmailVerify from "../components/authentication/BeforeEmailVerify";
import EmailVerifyingScreen from "../components/authentication/EmailVerificationPage";
import TermsAndCondition from "../pages/TermsAndConditions";
import ResetPassword from "../components/authentication/ResetPassword";
import MainPrivacyPolicy from "../pages/PrivacyPolicy";
import Notifications from "../components/dashboard/accounts/user/Notifications";

//user
import UserDashboard from "../components/dashboard/accounts/user/DashBoard";
import Settings from "../components/dashboard/accounts/Settings";
import UserPortfolio from "../components/dashboard/accounts/user/UserPortfolio";
import Investments from "../components/dashboard/accounts/user/Investments";
import Withdraws from "../components/dashboard/accounts/user/Withdraws";
import Deposits from "../components/dashboard/accounts/user/Deposit";
import BonusHistory from "../components/dashboard/accounts/user/BonusHistory";

//admin
import AdminDashBoard from "../components/dashboard/accounts/admin/DashBoard";
import Stats from "../components/dashboard/accounts/owner/Stats";
import Users from "../components/dashboard/accounts/admin/Users";
import UserDetails from "../components/dashboard/accounts/admin/UserDetails";
import WithdrawalRequests from "../components/dashboard/accounts/admin/WithdrawRequests";
import HelpSupport from "../components/dashboard/accounts/user/HelpAndSupport";
import ControlPanel from "../components/dashboard/accounts/admin/ControlPanel";
import TeamTree from "../components/dashboard/accounts/user/TeamTree";
import DepositHistory from "../components/dashboard/accounts/admin/DepositHistory";
import Reviews from "../components/dashboard/accounts/admin/Reviews";
import ReviewDetails from "../components/dashboard/accounts/admin/ReviewDetail";
import Feedbacks from "../components/dashboard/accounts/admin/Feedbakcs";
import FAQs from "../components/dashboard/accounts/admin/FAQs";
import TermsAndConditions from "../components/dashboard/accounts/admin/TermsAndConditions";
import PrivacyPolicy from "../components/dashboard/accounts/admin/PrivacyPolicy";
import InvestmentPlansCloseManagement from "../components/dashboard/accounts/admin/InvestmentPlansCloseManagement";

// owner
import ManageAdmins from "../components/dashboard/accounts/owner/ManageAdmins";
import OwnerDashboard from "../components/dashboard/accounts/owner/DashBoard";
import AddNewAdmin from "../components/dashboard/accounts/owner/AddNewAdmin";
import Announcements from "../components/common/Announcements";
import WalletForm from "../components/dashboard/accounts/user/Wallets";

const router = createBrowserRouter([
  {
    Component: AppLayout,
    errorElement: <Error />,
    children: [
      { path: "/", Component: Home },
      { path: "/contactus", Component: ContactUs },
      { path: "/aboutus", Component: AboutUs },
      { path: "/earnings", Component: Earnings },
      { path: "/signup", Component: SignUp },
      { path: "/login", Component: Login },
      { path: "/notifications", Component: Notifications },
      // { path: "/before-verify-email", Component: BeforeEmailVerify },
      { path: "/verify-email/:token", Component: EmailVerifyingScreen },
      { path: "/reset-password/:token", Component: ResetPassword },
      { path: "/terms-and-conditions", Component: TermsAndCondition },
      { path: "/privacy-policy", Component: MainPrivacyPolicy },

      //user
      {
        path: "/dashboard/user",
        Component: UserDashboard,
        children: [
          // user
          { index: true, Component: UserPortfolio },
          { path: "settings", Component: Settings },
          { path: "investments", Component: Investments },
          { path: "deposits", Component: Deposits },
          { path: "withdraws", Component: Withdraws },
          { path: "bonus-history", Component: BonusHistory },
          { path: "wallets", Component: WalletForm },
          { path: "team", Component: TeamTree },
          { path: "help-and-support", Component: HelpSupport },
        ],
      },

      //admin
      {
        path: "/dashboard/admin",
        Component: AdminDashBoard, // Ensure this renders <Outlet />
        children: [
          {
            index: true,
            Component: ControlPanel,
          },
          {
            children: [
              {
                path: "users",
                children: [
                  { index: true, Component: Users },
                  { path: ":id", Component: UserDetails },
                ],
              },
              {
                path: "withdraw-requests",
                children: [
                  { index: true, Component: WithdrawalRequests },
                  { path: ":id", Component: UserDetails },
                ],
              },
              {
                path: "investment-closure-requests",
                children: [
                  {
                    index: true,
                    Component: InvestmentPlansCloseManagement,
                  },
                ],
              },
              {
                path: "deposit-history",
                children: [{ index: true, Component: DepositHistory }],
              },
              {
                path: "reviews",
                children: [
                  { index: true, Component: Reviews },
                  { path: ":id", Component: ReviewDetails },
                ],
              },

              {
                path: "feedbacks",
                Component: Feedbacks,
              },
              {
                path: "faq-management",
                Component: FAQs,
              },
              {
                path: "terms-and-conditions",
                Component: TermsAndConditions,
              },
              {
                path: "privacy-policy",
                Component: PrivacyPolicy,
              },
            ],
          },
          {
            path: "announcements",
            Component: Announcements,
          },
          {
            path: "settings",
            Component: Settings,
          },
        ],
      },

      //owner
      {
        path: "/dashboard/owner",
        Component: OwnerDashboard,
        children: [
          { index: true, Component: Stats },
          {
            path: "control-pannel",
            children: [
              {
                children: [
                  { index: true, Component: ControlPanel },
                  {
                    path: "users",
                    children: [
                      { index: true, Component: Users },
                      { path: ":id", Component: UserDetails },
                    ],
                  },
                  {
                    path: "withdraw-requests",
                    children: [{ index: true, Component: WithdrawalRequests }],
                  },
                  {
                    path: "investment-closure-requests",
                    children: [
                      {
                        index: true,
                        Component: InvestmentPlansCloseManagement,
                      },
                    ],
                  },
                  {
                    path: "deposit-history",
                    children: [{ index: true, Component: DepositHistory }],
                  },
                  {
                    path: "reviews",
                    children: [
                      { index: true, Component: Reviews },
                      { path: ":id", Component: ReviewDetails },
                    ],
                  },

                  {
                    path: "feedbacks",
                    Component: Feedbacks,
                  },
                  {
                    path: "faq-management",
                    Component: FAQs,
                  },
                  {
                    path: "terms-and-conditions",
                    Component: TermsAndConditions,
                  },
                  {
                    path: "privacy-policy",
                    Component: PrivacyPolicy,
                  },
                  {
                    path: "manage-admins",
                    children: [
                      { index: true, Component: ManageAdmins },
                      { path: "add-admin", Component: AddNewAdmin },
                    ],
                  },
                ],
              },
            ],
          },

          { path: "settings", Component: Settings },
          { path: "announcements", Component: Announcements },
        ],
      },
    ],
  },
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
