import { useState } from "react";
import { openReports } from "../data/mockData";

export function AdminPage(): JSX.Element {
  const [reports, setReports] = useState(openReports);

  const resolveReport = (id: string): void => {
    setReports((prev) => prev.filter((report) => report.id !== id));
  };

  return (
    <section className="page-enter">
      <h2>Admin Queue</h2>
      <p className="muted-text">Open reports with moderator actions.</p>

      {!reports.length ? (
        <p className="empty-state">No open reports. Nice work, mods.</p>
      ) : (
        <ul className="report-list">
          {reports.map((report) => (
            <li key={report.id} className="report-card">
              <div>
                <p>
                  <b>{report.targetType}</b> #{report.targetId}
                </p>
                <p>{report.reason}</p>
                <small>
                  Reported by {report.reportedBy} on {new Date(report.createdAt).toLocaleDateString()}
                </small>
              </div>
              <div className="report-actions">
                <button type="button" className="btn" onClick={() => resolveReport(report.id)}>
                  Dismiss
                </button>
                <button type="button" className="btn btn-primary" onClick={() => resolveReport(report.id)}>
                  Remove
                </button>
                <button type="button" className="btn" onClick={() => resolveReport(report.id)}>
                  Warn
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}