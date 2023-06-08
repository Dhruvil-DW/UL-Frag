import Login from "./components/login/login";
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Redirect } from "./config/routes";
import Context from "./context";
import Dashboard from "./components/dashboard/dashboard";
import AddProfile from "./components/profile/addProfile";
import Logout from "./components/login/logout";
import AddApplication from "./components/application/addApplication";
import FragranceBrief from './components/fragranceBrief/fragranceBrief'
import SubmitApplication from "./components/application/submitApplication";
import ViewApplication from "./components/application/viewApplication";
import DraftApplication from "./components/application/draftApplication";
import Prompt from "./assets/prompt/prompt";

const queryClient = new QueryClient();

export default function App() {
  return (
    <Context>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Redirect />} />
            <Route path="/*" element={<Navigate to="/" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/profile" element={<AddProfile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/application">
              <Route index element={<FragranceBrief />} />
              <Route path="new" element={<AddApplication />} />
              <Route path="summary" element={<SubmitApplication />} />
              <Route path="drafted" element={<DraftApplication />} />
              <Route path="view/:appId" element={<ViewApplication />} />
              <Route path="edit/:appId" element={<AddApplication />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Prompt />
      </QueryClientProvider>
    </Context>

  );
}

