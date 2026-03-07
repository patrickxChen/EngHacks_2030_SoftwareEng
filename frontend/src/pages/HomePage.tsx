import { useEffect, useMemo, useState } from "react";
import { notificationItems, templateMyths } from "../data/mockData";
import { PostCard } from "../components/PostCard";
import { fetchMyths } from "../lib/api";
import type { Myth } from "../types";

const radarColors = ["#90f2e6", "#8fb7ff", "#7f88ff", "#9adf9f", "#ffb3d0"];

interface HomePageProps {
  loggedInEmail: string;
}

export function HomePage({ loggedInEmail }: HomePageProps): JSX.Element {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [digestView, setDigestView] = useState<"debunked" | "hot" | "true">("debunked");
  const [myths, setMyths] = useState<Myth[]>(templateMyths);

  useEffect(() => {
    let active = true;
    const run = async (): Promise<void> => {
      try {
        const rows = await fetchMyths({ limit: 12 });
        if (active) {
          setMyths(rows.length ? rows : templateMyths);
        }
      } catch {
        if (active) {
          setMyths(templateMyths);
        }
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, []);

  const mostDebunked = useMemo(() => {
    return [...myths]
      .sort((a, b) => {
        const rateA = a.votesUp + a.votesDown ? a.votesDown / (a.votesUp + a.votesDown) : 0.5;
        const rateB = b.votesUp + b.votesDown ? b.votesDown / (b.votesUp + b.votesDown) : 0.5;
        return rateB - rateA;
      })
      .slice(0, 3);
  }, [myths]);

  const mostHot = useMemo(() => {
    return [...myths]
      .sort((a, b) => b.votesUp + b.votesDown - (a.votesUp + a.votesDown))
      .slice(0, 3);
  }, [myths]);

  const mostTrue = useMemo(() => {
    return [...myths]
      .sort((a, b) => {
        const trueA = a.votesUp + a.votesDown ? a.votesUp / (a.votesUp + a.votesDown) : 0.5;
        const trueB = b.votesUp + b.votesDown ? b.votesUp / (b.votesUp + b.votesDown) : 0.5;
        return trueB - trueA;
      })
      .slice(0, 3);
  }, [myths]);

  const digestViewMeta =
    digestView === "debunked"
      ? { title: "Most debunked right now", rows: mostDebunked }
      : digestView === "hot"
        ? { title: "Most hot", rows: mostHot }
        : { title: "Most true", rows: mostTrue };

  const myPosts = useMemo(() => myths.slice(0, 5), [myths]);
  const replyNotifications = useMemo(
    () => notificationItems.filter((note) => note.message.toLowerCase().includes("replied")),
    []
  );

  const digestStats = useMemo(() => {
    const total = myths.length;
    const avgMythRate =
      myths.length > 0
        ? Math.round(
            (myths.reduce((sum, myth) => {
              const votes = myth.votesUp + myth.votesDown;
              const mythRate = votes ? myth.votesDown / votes : 0.5;
              return sum + mythRate;
            }, 0) /
              myths.length) *
              100
          )
        : 50;

    const profMentions = myths.filter((myth) => myth.scopeType === "prof").length;

    return {
      total,
      avgMythRate,
      profMentions
    };
  }, [myths]);

  const ghostRadar = useMemo(() => {
    const bucket = new Map<string, number>();
    for (const myth of myths) {
      const zone = (myth.buildingCode || myth.scopeKey || "Unknown").toUpperCase().trim() || "Unknown";
      bucket.set(zone, (bucket.get(zone) ?? 0) + 1);
    }

    const ranked = Array.from(bucket.entries())
      .map(([zone, count]) => ({ zone, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const total = ranked.reduce((sum, row) => sum + row.count, 0);
    if (!total) {
      return {
        total: 0,
        hotspot: "No myth data yet",
        gradient: "conic-gradient(#2f3f65 0deg 360deg)",
        rows: [] as Array<{ zone: string; count: number; percent: number; color: string }>
      };
    }

    const rows = ranked.map((row, index) => ({
      ...row,
      percent: Math.round((row.count / total) * 100),
      color: radarColors[index % radarColors.length]
    }));

    let cursor = 0;
    const parts = rows.map((row) => {
      const sweep = (row.count / total) * 360;
      const start = cursor;
      const end = cursor + sweep;
      cursor = end;
      return `${row.color} ${start}deg ${end}deg`;
    });

    return {
      total,
      hotspot: rows[0] ? `${rows[0].zone} (${rows[0].percent}%)` : "No myth data yet",
      gradient: `conic-gradient(${parts.join(", ")})`,
      rows
    };
  }, [myths]);

  return (
    <section className="page-enter concept-home">
      <span className="digest-ghost" aria-hidden="true" />

      <header className="digest-head">
        <div>
          <p className="brand-kicker">Daily Digest</p>
          <h2>Welcome back, {loggedInEmail.replace("@uwaterloo.ca", "")}</h2>
          <p className="digest-subtitle">Today's pulse across professor, course, and building myths.</p>
        </div>
        <button
          className="menu-dot-btn"
          aria-label="Open activity panel"
          type="button"
          onClick={() => setDrawerOpen((value) => !value)}
        >
          =
        </button>
      </header>

      <section className="digest-kpis" aria-label="Digest metrics">
        <article className="digest-kpi">
          <p className="muted-text">Myths in feed</p>
          <b>{digestStats.total}</b>
        </article>
        <article className="digest-kpi">
          <p className="muted-text">Average myth rate</p>
          <b>{digestStats.avgMythRate}%</b>
        </article>
        <article className="digest-kpi">
          <p className="muted-text">Professor-tagged myths</p>
          <b>{digestStats.profMentions}</b>
        </article>
      </section>

      <div className="concept-board">
        <section className="digest-feed">
          <header className="dashboard-panel-head digest-feed-head">
            <div>
              <p className="brand-kicker">EngBusters</p>
              <h3>{digestViewMeta.title}</h3>
            </div>
            <label className="digest-picker-label">
              View
              <select
                value={digestView}
                onChange={(event) =>
                  setDigestView(event.target.value as "debunked" | "hot" | "true")
                }
                aria-label="Choose Daily Digest ranking view"
              >
                <option value="debunked">Most debunked right now</option>
                <option value="hot">Most hot</option>
                <option value="true">Most true</option>
              </select>
            </label>
          </header>

          <div className="dashboard-grid digest-feed-grid">
            {digestViewMeta.rows.map((myth) => (
              <PostCard key={`${digestView}-${myth.id}`} myth={myth} />
            ))}
          </div>
        </section>

        <aside className="digest-side">
          <section className="ghost-radar-card" aria-label="Ghost Radar concentration">
            <p className="brand-kicker">Ghost Radar</p>
            <h4>Spectral concentration map</h4>
            <p className="muted-text">Hottest zone: {ghostRadar.hotspot}</p>

            <div className="ghost-radar-wrap">
              <div className="ghost-radar-ring" style={{ backgroundImage: ghostRadar.gradient }}>
                <span className="ghost-radar-sweep" aria-hidden="true" />
                <span className="ghost-radar-sigil" aria-hidden="true" />
                <div className="ghost-radar-core">
                  <b>{ghostRadar.total}</b>
                  <span>myths</span>
                </div>
              </div>
            </div>

            {ghostRadar.rows.length ? (
              <ul className="ghost-radar-list">
                {ghostRadar.rows.map((row) => (
                  <li key={row.zone}>
                    <span className="ghost-radar-dot" style={{ backgroundColor: row.color }} aria-hidden="true" />
                    <span>{row.zone}</span>
                    <b>{row.percent}%</b>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>

          <section className={drawerOpen ? "open-panel" : "open-panel open-panel-hidden"}>
            <h3>Activity</h3>
            <p className="muted-text">Replies and your latest myth posts.</p>

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
          </section>
        </aside>
      </div>

    </section>
  );
}
