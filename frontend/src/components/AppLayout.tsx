import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface AppLayoutProps {
  children: ReactNode;
  loggedInEmail: string;
  onLogout: () => void;
}

const navItems = [
  { label: "Home", href: "/" },
  { label: "Submit", href: "/submit" },
  { label: "Myths", href: "/myths" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Map", href: "/map" }
];

export function AppLayout({ children, loggedInEmail, onLogout }: AppLayoutProps): JSX.Element {
  return (
    <div className="app-shell">
      <header className="top-nav page-enter">
        <div className="brand-block">
          <p className="brand-kicker">Waterloo Engineering</p>
          <h1>Myth Buster</h1>
        </div>

        <nav aria-label="Main navigation" className="nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              className={({ isActive }) =>
                isActive ? "nav-link nav-link-active" : "nav-link"
              }
              to={item.href}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="session-controls">
          <span className="session-email">{loggedInEmail}</span>
          <button type="button" className="btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>
      <main className="main-content">{children}</main>
    </div>
  );
}
