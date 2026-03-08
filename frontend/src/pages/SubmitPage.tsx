import { useMemo, useState, type FormEvent } from "react";
import { buildings } from "../data/buildings";
import { createMyth } from "../lib/api";

interface FormState {
  text: string;
  scopeType: "building" | "course" | "prof";
  buildingCode: string;
  programTag: string;
  courseTag: string;
  profTag: string;
  tone: "funny" | "serious";
}

const initialState: FormState = {
  text: "",
  scopeType: "building",
  buildingCode: "",
  programTag: "",
  courseTag: "",
  profTag: "",
  tone: "funny"
};

const scopeOptions: Array<{ value: FormState["scopeType"]; label: string }> = [
  { value: "building", label: "Building" },
  { value: "course", label: "Course" },
  { value: "prof", label: "Professor" }
];

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

  const scopeError =
    form.scopeType === "building"
      ? form.buildingCode
        ? ""
        : "Building is required for building myths."
      : form.scopeType === "course"
      ? form.courseTag.trim()
        ? ""
        : "Course code is required for course myths."
      : form.scopeType === "prof"
        ? form.profTag.trim()
          ? ""
          : "Professor name is required for professor myths."
        : "";

  const canSubmit = !textError && !scopeError;

  const handleScopeChange = (scopeType: FormState["scopeType"]): void => {
    setForm((prev) => {
      if (scopeType === prev.scopeType) {
        return prev;
      }

      return {
        ...prev,
        scopeType,
        buildingCode: scopeType === "building" ? prev.buildingCode : "",
        courseTag: scopeType === "course" ? prev.courseTag : "",
        profTag: scopeType === "prof" ? prev.profTag : ""
      };
    });
  };

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
        scopeType: form.scopeType,
        scopeKey:
          form.scopeType === "course"
            ? form.courseTag.trim()
            : form.scopeType === "prof"
              ? form.profTag.trim()
              : form.buildingCode,
        buildingCode: form.scopeType === "building" ? form.buildingCode : undefined,
        programTag: form.programTag.trim(),
        courseTag: form.scopeType === "course" ? form.courseTag.trim() : "",
        profTag: form.scopeType === "prof" ? form.profTag.trim() : "",
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

        <div className="scope-tag-group" role="radiogroup" aria-label="Myth category">
          <p className="scope-tag-label">Myth category</p>
          <div className="scope-tag-list">
            {scopeOptions.map((option) => {
              const active = form.scopeType === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  className={active ? "scope-tag scope-tag-active" : "scope-tag"}
                  onClick={() => handleScopeChange(option.value)}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <label>
          Building
          <select
            value={form.buildingCode}
            onChange={(event) => setForm({ ...form, buildingCode: event.target.value })}
            disabled={form.scopeType !== "building"}
          >
            <option value="">Select a building</option>
            {buildings.map((building) => (
              <option key={building} value={building}>
                {building}
              </option>
            ))}
          </select>
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
              disabled={form.scopeType !== "course"}
            />
          </label>

          <label>
            Professor
            <input
              value={form.profTag}
              onChange={(event) => setForm({ ...form, profTag: event.target.value })}
              placeholder="Prof. Name"
              disabled={form.scopeType !== "prof"}
            />
          </label>
        </div>

        {submitted && scopeError ? <p className="form-error">{scopeError}</p> : null}

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
