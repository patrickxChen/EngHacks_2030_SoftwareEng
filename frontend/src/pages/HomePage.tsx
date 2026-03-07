import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { notificationItems } from "../data/mockData";
import { PostCard } from "../components/PostCard";
import { fetchMyths } from "../lib/api";
import type { Myth } from "../types";

interface HomePageProps {
  loggedInEmail: string;
}

export function HomePage({ loggedInEmail }: HomePageProps): JSX.Element {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [myths, setMyths] = useState<Myth[]>([]);

  useEffect(() => {
    let active = true;
    const run = async (): Promise<void> => {
      try {
        const rows = await fetchMyths({ limit: 12 });
        if (active) {
          setMyths(rows);
        }
      } catch {
        if (active) {
          setMyths([]);
        }
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, []);

  const dashboardPosts = myths.slice(0, 4);
  const myPosts = useMemo(() => myths.slice(0, 5), [myths]);
  const replyNotifications = useMemo(
    () => notificationItems.filter((note) => note.message.toLowerCase().includes("replied")),
    []
  );

  const onSearch = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const q = search.trim();
    navigate(q ? `/results?q=${encodeURIComponent(q)}` : "/results");
  };

  return (
    <section className="page-enter concept-home">
      <div className="concept-board">
        <section className="dashboard-panel">
          <header className="dashboard-panel-head">
            <p className="brand-kicker">Dashboard</p>
            <button
              className="menu-dot-btn"
              aria-label="Open notification and post history panel"
              type="button"
              onClick={() => setDrawerOpen((value) => !value)}
            >
              =
            </button>
          </header>
          <div className="dashboard-user">
            <b>{loggedInEmail.replace("@uwaterloo.ca", "")}</b>
            <span>Find myths by course or building</span>
          </div>
          <form className="search-form" onSubmit={onSearch}>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search course or building"
              aria-label="Search myths by course or building"
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
          <div className="dashboard-grid">
            {dashboardPosts.map((myth) => (
              <PostCard key={myth.id} myth={myth} />
            ))}
          </div>
        </section>

        <aside className={drawerOpen ? "open-panel" : "open-panel open-panel-hidden"}>
          <h3>Open</h3>
          <p className="muted-text">Notifications and your past posts</p>

          <h4>Replies</h4>
          <ul className="drawer-list">
            {replyNotifications.map((note) => (
              <li key={note.id}>
                <b>{note.fromUser}</b> {note.message}
              </li>
            ))}
          </ul>

          <h4>Your Posts</h4>
          <ul className="drawer-list">
            {myPosts.map((myth) => (
              <li key={`mypost-${myth.id}`}>{myth.text}</li>
            ))}
          </ul>
        </aside>
      </div>

    </section>
  );
}
