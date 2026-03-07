import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { MythsPage } from "./pages/MythsPage";
import { ResultsPage } from "./pages/ResultsPage";
import { SubmitPage } from "./pages/SubmitPage";

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
  const [loggedInEmail, setLoggedInEmail] = useState<string>(() => {
    return localStorage.getItem(LOGIN_KEY) ?? "";
  });

  const isLoggedIn = Boolean(loggedInEmail);

  useEffect(() => {
    if (loggedInEmail) {
      localStorage.setItem(LOGIN_KEY, loggedInEmail);
    } else {
      localStorage.removeItem(LOGIN_KEY);
    }
  }, [loggedInEmail]);

  const hideLayout = location.pathname === "/login";

  const routes = (
    <Routes>
      <Route
        path="/login"
        element={
          isLoggedIn ? <Navigate to="/" replace /> : <LoginPage onLogin={(email) => setLoggedInEmail(email)} />
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <HomePage loggedInEmail={loggedInEmail} />
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
        path="/myths"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <MythsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
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