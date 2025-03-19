import { createHashRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import LoginPage from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage";
import { SidebarProvider } from "./components/ui/sidebar";
import { Provider } from "react-redux";
import store from "./components/plugins/redux/Store";
import Header from "./components/ui/header";
import Revalidator from "./components/Revalidator";
import AppSidebar from "./components/AppSideBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DashboardPage from "./pages/DashboardPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfilePage from "./pages/ProfilePage";
import UploadDocumentPage from "./pages/UploadDocumentPage";
import StaffOnlyPage from "./components/StaffOnlyPage";
import StaffDocumentsPage from "./pages/StaffDocumentsPage";
import DocumentRequestsPage from "./pages/ClientDocumentRequestsPage";
import HeadOnlyPage from "./components/HeadOnlyPage";
import HeadDocumentRequestsPage from "./pages/HeadDocumentRequestsPage";
import RegisterPage from "./pages/RegisterPage";
import ActivationPage from "./pages/ActivationPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ResetPasswordConfirmPage from "./pages/ResetPasswordConfirmPage";
import CreateDocumentRequestPage from "./pages/CreateDocumentRequestPage";
import SubmitQuestionnairePage from "./pages/SubmitQuestionnairePage";
import StaffDocumentRequestsPage from "./pages/StaffDocumentRequestsPage";
import ExportCRS03Page from "./pages/ExportCRS03Page";
import ExportCRS01Page from "./pages/ExportCRS01Page";
import Export0061Page from "./pages/Export0061Page";
import PlanningOnlyPage from "./components/PlanningOnlyPage";
import HeadDocumentsPage from "./pages/HeadDocumentsPage";
import PlanningQuestionnairesPage from "./pages/PlanningQuestionnairesPage";
import CreateAuthorizationRequestPage from "./pages/CreateAuthorizationRequestPage";
import HeadAuthorizationRequestsPage from "./pages/HeadAuthorizationRequestsPage";
import StaffAuthorizationRequestsPage from "./pages/StaffAuthorizationRequestsPage";
import ClientAuthorizationRequestsPage from "./pages/ClientAuthorizationRequestsPage";
import AdminOnlyPage from "./components/AdminOnlyPage";
import AdminUsersPage from "./pages/AdminUsersPage";
const queryClient = new QueryClient();

const router = createHashRouter([
  {
    path: "/",
    element: (
      <>
        <Revalidator />
        <LoginPage />
      </>
    ),
  },
  {
    path: "/register/",
    element: <RegisterPage />,
  },
  {
    path: "/reset_password/",
    element: <ResetPasswordPage />,
  },
  {
    path: "/reset_password/confirm/:uid/:token/",
    element: <ResetPasswordConfirmPage />,
  },
  {
    path: "/activation/:uid/:token/",
    element: <ActivationPage />,
  },
  {
    path: "/dashboard/",
    element: (
      <>
        <Header />
        <AppSidebar />
        <Revalidator />
        <DashboardPage />
      </>
    ),
  },
  {
    path: "/profile/",
    element: (
      <>
        <Header />
        <AppSidebar />
        <Revalidator />
        <ProfilePage />
      </>
    ),
  },
  {
    path: "/requests/create/",
    element: (
      <>
        <Header />
        <AppSidebar />
        <Revalidator />
        <CreateDocumentRequestPage />
      </>
    ),
  },
  {
    path: "/authorization_requests/create/",
    element: (
      <>
        <Header />
        <AppSidebar />
        <Revalidator />
        <CreateAuthorizationRequestPage />
      </>
    ),
  },
  {
    path: "/documents/list/staff/",
    element: (
      <>
        <Header />
        <AppSidebar />
        <Revalidator />
        <StaffOnlyPage>
          <StaffDocumentsPage />
        </StaffOnlyPage>
      </>
    ),
  },
  {
    path: "/documents/list/head/",
    element: (
      <>
        <Header />
        <AppSidebar />
        <Revalidator />
        <HeadOnlyPage>
          <HeadDocumentsPage />
        </HeadOnlyPage>
      </>
    ),
  },
  {
    path: "/requests/list/",
    element: (
      <>
        <Header />
        <AppSidebar />
        <Revalidator />
        <DocumentRequestsPage />
      </>
    ),
  },
  {
    path: "/authorization_requests/list/",
    element: (
      <>
        <Header />
        <AppSidebar />
        <Revalidator />
        <ClientAuthorizationRequestsPage />
      </>
    ),
  },
  {
    path: "/requests/list/staff/",
    element: (
      <>
        <Header />
        <AppSidebar />
        <Revalidator />
        <StaffOnlyPage>
          <StaffDocumentRequestsPage />
        </StaffOnlyPage>
      </>
    ),
  },
  {
    path: "/authorization_requests/list/staff/",
    element: (
      <>
        <Header />
        <AppSidebar />
        <Revalidator />
        <StaffOnlyPage>
          <StaffAuthorizationRequestsPage />
        </StaffOnlyPage>
      </>
    ),
  },
  {
    path: "/requests/list/head/",
    element: (
      <>
        <Header />
        <AppSidebar />
        <Revalidator />
        <HeadOnlyPage>
          <HeadDocumentRequestsPage />
        </HeadOnlyPage>
      </>
    ),
  },
  {
    path: "/users/list/",
    element: (
      <>
        <Header />
        <AppSidebar />
        <Revalidator />
        <AdminOnlyPage>
          <AdminUsersPage />
        </AdminOnlyPage>
      </>
    ),
  },
  {
    path: "/authorization_requests/list/head/",
    element: (
      <>
        <Header />
        <AppSidebar />
        <Revalidator />
        <HeadOnlyPage>
          <HeadAuthorizationRequestsPage />
        </HeadOnlyPage>
      </>
    ),
  },

  {
    path: "/documents/upload",
    element: (
      <>
        <Header />
        <AppSidebar />
        <Revalidator />
        <StaffOnlyPage>
          <UploadDocumentPage />
        </StaffOnlyPage>
      </>
    ),
  },
  {
    path: "/questionnaires/create/:document_request_id?",
    element: (
      <>
        <Header />
        <AppSidebar />
        <Revalidator />
        <SubmitQuestionnairePage />
      </>
    ),
  },
  {
    path: "/questionnaires/list/",
    element: (
      <>
        <Header />
        <AppSidebar />
        <Revalidator />
        <PlanningOnlyPage>
          <PlanningQuestionnairesPage />
        </PlanningOnlyPage>
      </>
    ),
  },
  {
    path: "/export/CRS03/",
    element: (
      <>
        <Header />
        <AppSidebar />
        <Revalidator />
        <StaffOnlyPage>
          <ExportCRS03Page />
        </StaffOnlyPage>
      </>
    ),
  },
  {
    path: "/export/CRS01/",
    element: (
      <>
        <Header />
        <AppSidebar />
        <Revalidator />
        <StaffOnlyPage>
          <ExportCRS01Page />
        </StaffOnlyPage>
      </>
    ),
  },
  {
    path: "/export/0061/",
    element: (
      <>
        <Header />
        <AppSidebar />
        <Revalidator />
        <PlanningOnlyPage>
          <Export0061Page />
        </PlanningOnlyPage>
      </>
    ),
  },
  {
    path: "*",
    element: <ErrorPage statusCode={404} errorMessage={"Page not found"} />,
  },
]);
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <SidebarProvider>
          <RouterProvider router={router} />
          <ToastContainer
            position={"top-right"}
            autoClose={1500}
            closeOnClick
            pauseOnHover
            draggable
            theme={"light"}
            limit={3}
          />
        </SidebarProvider>
      </Provider>
    </QueryClientProvider>
  );
}
