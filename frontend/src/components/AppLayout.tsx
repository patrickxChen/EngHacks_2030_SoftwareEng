import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import ghostImg from "../assets/ghost.png";
import githubImg from "../assets/github.png";

interface AppLayoutProps {
  children: ReactNode;
  loggedInEmail: string;
  onLogout: () => void;
}

const navItems = [
  { label: "Daily Digest", href: "/home" },
  { label: "Submit", href: "/submit" },
  { label: "Search", href: "/search" }
];

export function AppLayout({ children, loggedInEmail, onLogout }: AppLayoutProps): JSX.Element {
  return (
    <div className="app-shell">
      <header className="top-nav page-enter">
        <div className="brand-block">
          <div className="brand-identity">
            <img src={ghostImg} alt="Ghost mascot" className="brand-ghost" />
            <div>
              <p className="brand-kicker">Waterloo Engineering</p>
              <h1>EngBusters</h1>
            </div>
          </div>
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
      <footer className="site-footer">
        <a
          href="https://github.com/patrickxChen/EngHacks_2030_SoftwareEng"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
          aria-label="View on GitHub"
        >
          <img src={githubImg} alt="GitHub" className="github-icon" />
          <span>View on GitHub</span>
        </a>
      </footer>
    </div>
  );
}
