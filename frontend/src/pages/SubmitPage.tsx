import { useMemo, useState, type FormEvent } from "react";
import { buildings } from "../data/buildings";
import { createMyth } from "../lib/api";

interface FormState {
  text: string;
  buildingCode: string;
  programTag: string;
  courseTag: string;
  tone: "funny" | "serious";
}

const initialState: FormState = {
  text: "",
  buildingCode: "",
  programTag: "",
  courseTag: "",
  tone: "funny"
};

export function SubmitPage(): JSX.Element {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const textError = useMemo(() => {
    if (!form.text.trim()) {
      return "Myth text is required.";
    }
    if (form.text.trim().length < 12) {
      return "Try a bit more detail so verdicts have context.";
    }
    return "";
  }, [form.text]);

  const buildingError = form.buildingCode ? "" : "Building is required.";

  const canSubmit = !textError && !buildingError;

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setSubmitted(true);
    setResultMessage("");
    setSubmitError("");

    if (!canSubmit) {
      return;
    }

    try {
      setSubmitting(true);
      await createMyth({
        text: form.text.trim(),
        scopeType: "building",
        scopeKey: form.buildingCode,
        buildingCode: form.buildingCode,
        programTag: form.programTag.trim(),
        courseTag: form.courseTag.trim(),
        tone: form.tone
      });
      setForm(initialState);
      setSubmitted(false);
      setResultMessage("Myth submitted. Verdict generated and saved.");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to submit myth.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page-enter">
      <h2>Submit a Myth</h2>
      <p className="muted-text">Keep it specific, building-aware, and shareable.</p>

      <form className="myth-form" onSubmit={onSubmit} noValidate>
        <label>
          Myth text
          <textarea
            value={form.text}
            onChange={(event) => setForm({ ...form, text: event.target.value })}
            placeholder="Example: E7 labs always eat at least six hours."
            rows={4}
          />
          {submitted && textError ? <span className="form-error">{textError}</span> : null}
        </label>

        <label>
          Building
          <select
            value={form.buildingCode}
            onChange={(event) => setForm({ ...form, buildingCode: event.target.value })}
          >
            <option value="">Select a building</option>
            {buildings.map((building) => (
              <option key={building} value={building}>
                {building}
              </option>
            ))}
          </select>
          {submitted && buildingError ? <span className="form-error">{buildingError}</span> : null}
        </label>

        <div className="form-row">
          <label>
            Program
            <input
              value={form.programTag}
              onChange={(event) => setForm({ ...form, programTag: event.target.value })}
              placeholder="ECE"
            />
          </label>

          <label>
            Course code
            <input
              value={form.courseTag}
              onChange={(event) => setForm({ ...form, courseTag: event.target.value })}
              placeholder="ECE 198"
            />
          </label>
        </div>

        <fieldset>
          <legend>Tone preference</legend>
          <div className="tone-options">
            <label>
              <input
                type="radio"
                checked={form.tone === "funny"}
                onChange={() => setForm({ ...form, tone: "funny" })}
              />
              Funny
            </label>
            <label>
              <input
                type="radio"
                checked={form.tone === "serious"}
                onChange={() => setForm({ ...form, tone: "serious" })}
              />
              Serious
            </label>
          </div>
        </fieldset>

        <button className="btn btn-primary" type="submit">
          {submitting ? "Submitting..." : "Submit Myth"}
        </button>

        {resultMessage ? <p className="muted-text">{resultMessage}</p> : null}
        {submitError ? <p className="form-error">{submitError}</p> : null}
      </form>
    </section>
  );
}
