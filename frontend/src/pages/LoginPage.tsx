import { useState, type FormEvent } from "react";

interface LoginPageProps {
  onLogin: (email: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps): JSX.Element {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const cleanedEmail = email.trim().toLowerCase();
    if (!cleanedEmail.endsWith("@uwaterloo.ca")) {
      setError("Please use your UW email account (@uwaterloo.ca).");
      return;
    }

    setError("");
    onLogin(cleanedEmail);
  };

  return (
    <section className="login-page page-enter">
      <div className="login-card">
        <p className="brand-kicker">EngBusters</p>
        <h2>Login</h2>
        <p className="muted-text">Limit access to UW students.</p>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <label>
            UW Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@uwaterloo.ca"
              autoComplete="email"
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button className="btn btn-primary" type="submit">
            Continue
          </button>
        </form>
      </div>
    </section>
  );
}
