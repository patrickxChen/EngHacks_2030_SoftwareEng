interface EngBustersSplashProps {
  onEnter: () => void;
}

export function EngBustersSplash({ onEnter }: EngBustersSplashProps): JSX.Element {
  return (
    <button
      type="button"
      className="engbusters-splash"
      aria-label="Enter EngBusters"
      onClick={onEnter}
    >
      <span className="ghost-orb ghost-orb-left" aria-hidden="true" />
      <span className="ghost-orb ghost-orb-right" aria-hidden="true" />

      <div className="engbusters-splash-content">
        <p className="splash-kicker">Waterloo Engineering</p>
        <h1>EngBusters</h1>
        <p className="splash-description">
          Crowd-verify engineering myths with votes, real student rationale, and fast discussion threads.
        </p>
        <div className="splash-highlights" aria-hidden="true">
          <span>Vote True or False</span>
          <span>Share Your Rationale</span>
          <span>Spot Trending Myths</span>
        </div>
        <p className="splash-cta">Click anywhere to enter</p>
      </div>
    </button>
  );
}
