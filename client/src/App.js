import Login from "./components/login/login";
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Redirect } from "./config/routes";
import Context from "./context";
import Dashboard from "./components/dashboard/dashboard";

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
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </Context>

  );
}

