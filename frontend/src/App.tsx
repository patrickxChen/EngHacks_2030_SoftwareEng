import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { EngBustersSplash } from "./components/EngBustersSplash";
import { AdminPage } from "./pages/AdminPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { MythDiscussionPage } from "./pages/MythDiscussionPage";
import { MythsPage } from "./pages/MythsPage";
import { ResultsPage } from "./pages/ResultsPage";
import { SubmitPage } from "./pages/SubmitPage";
import { fetchMyths } from "./lib/api";
import { templateMyths } from "./data/mockData";
import type { Myth } from "./types";

const LOGIN_KEY = "uw.loggedInEmail";

function ProtectedRoute({
  isLoggedIn,
  children
}: {
  isLoggedIn: boolean;
  children: JSX.Element;
}): JSX.Element {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const [loggedInEmail, setLoggedInEmail] = useState<string>(() => {
    return localStorage.getItem(LOGIN_KEY) ?? "";
  });
  const [myths, setMyths] = useState<Myth[]>([]);

  const isLoggedIn = Boolean(loggedInEmail);

  // Keep shared myths state aligned with backend data in logged-in flows.
  useEffect(() => {
    if (!isLoggedIn) return;
    let active = true;
    const run = async (): Promise<void> => {
      try {
        const rows = await fetchMyths({ limit: 50 });
        if (active) {
          setMyths([...rows, ...templateMyths]);
        }
      } catch {
        if (active) {
          setMyths(templateMyths);
        }
      }
    };
    void run();
    return () => { active = false; };
  }, [isLoggedIn, location.pathname]);

  useEffect(() => {
    if (loggedInEmail) {
      localStorage.setItem(LOGIN_KEY, loggedInEmail);
    } else {
      localStorage.removeItem(LOGIN_KEY);
    }
  }, [loggedInEmail]);

  const hideLayout = location.pathname === "/login" || location.pathname === "/";

  const routes = (
    <Routes>
      <Route
        path="/login"
        element={
          isLoggedIn ? <Navigate to="/home" replace /> : <LoginPage onLogin={(email) => setLoggedInEmail(email)} />
        }
      />
      <Route
        path="/"
        element={<EngBustersSplash onEnter={() => navigate("/home")} />}
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <HomePage loggedInEmail={loggedInEmail ?? ""} myths={myths} setMyths={setMyths} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/results"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <ResultsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/submit"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <SubmitPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <MythsPage myths={myths} setMyths={setMyths} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/myth/:mythId"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <MythDiscussionPage myths={myths} setMyths={setMyths} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={isLoggedIn ? "/home" : "/"} replace />} />
    </Routes>
  );

  if (hideLayout) {
    return routes;
  }

  return (
    <AppLayout loggedInEmail={loggedInEmail} onLogout={() => setLoggedInEmail("")}>
      {routes}
    </AppLayout>
  );
}

export default App;