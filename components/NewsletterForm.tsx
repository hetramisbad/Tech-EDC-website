"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import clsx from "clsx";
import { site } from "@/content/site";
import { Button } from "./Button";
import { Icon } from "./Icon";

type Status = "idle" | "submitting" | "error" | "success";
type Fields = { firstName: string; lastName: string; email: string };
type FieldErrors = Partial<Record<keyof Fields, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(f: Fields): FieldErrors {
  const e: FieldErrors = {};
  if (!f.firstName.trim()) e.firstName = "Enter your first name.";
  if (!f.lastName.trim()) e.lastName = "Enter your last name.";
  if (!f.email.trim()) e.email = "Enter your email address.";
  else if (!EMAIL_RE.test(f.email.trim())) e.email = "Enter a valid email address, like name@example.com.";
  return e;
}

export type NewsletterFormProps = {
  /** Override the endpoint (defaults to site.newsletter.endpoint; empty = stub mode). */
  endpoint?: string;
  className?: string;
};

/**
 * Newsletter signup: first name, last name, email. Client-side validation,
 * aria-live status. Empty endpoint = stub (console.info + success).
 */
export function NewsletterForm({ endpoint = site.newsletter.endpoint, className }: NewsletterFormProps) {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const successRef = useRef<HTMLDivElement>(null);

  // After a successful submit the form unmounts; move focus to the confirmation
  // so keyboard and screen-reader users are not dropped at the top of the page.
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const fields: Fields = {
      firstName: String(data.get("firstName") ?? ""),
      lastName: String(data.get("lastName") ?? ""),
      email: String(data.get("email") ?? ""),
    };
    const errs = validate(fields);
    setErrors(errs);
    const firstBad = (Object.keys(errs) as (keyof Fields)[])[0];
    if (firstBad) {
      setStatus("error");
      setMessage("Please fix the highlighted fields.");
      form.querySelector<HTMLInputElement>(`[name="${firstBad}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    setMessage("");
    try {
      if (!endpoint) {
        console.info("[newsletter] stub mode, no endpoint configured. Payload:", fields);
        await new Promise((r) => setTimeout(r, 700));
      } else {
        const res = await fetch(endpoint, { method: "POST", body: data });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      }
      setStatus("success");
      setMessage(`Thanks, ${fields.firstName.trim()}. You're on the list.`);
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Something went wrong on our end. Please try again in a moment.");
    }
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className={clsx("flex items-start gap-3 border-l border-border-hover py-1 pl-4", className)}
      >
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-control border border-border-strong text-success">
          <Icon name="check" size={14} />
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-fg">{message}</p>
          <p className="text-sm text-fg-muted">We send a short note when programs open and before big events.</p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="link mt-1 self-start text-sm"
          >
            Add another email
          </button>
        </div>
      </div>
    );
  }

  const inputCls = (err?: string) =>
    clsx(
      "h-11 w-full rounded-control border bg-bg-plain/60 px-3 font-mono text-sm text-fg placeholder:text-fg-subtle",
      "transition-[border-color,box-shadow] duration-150 hover:border-border-hover",
      "focus-visible:border-accent focus-visible:shadow-[0_0_0_1px_var(--accent)] focus-visible:outline-none",
      "disabled:opacity-60",
      err ? "border-danger" : "border-border-hover",
    );

  const field = (name: keyof Fields, label: string, type: string, autoComplete: string, trailing?: ReactNode) => {
    const err = errors[name];
    const inputId = `${id}-${name}`;
    const errId = `${inputId}-err`;
    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={inputId} className="label-mono text-fg-secondary">
          {label}
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id={inputId}
            name={name}
            type={type}
            autoComplete={autoComplete}
            required
            aria-invalid={err ? true : undefined}
            aria-describedby={err ? errId : undefined}
            disabled={status === "submitting"}
            onChange={() => err && setErrors((p) => ({ ...p, [name]: undefined }))}
            className={inputCls(err)}
          />
          {trailing}
        </div>
        {err && (
          <p id={errId} className="font-mono text-xs text-danger">
            {err}
          </p>
        )}
      </div>
    );
  };

  return (
    <form noValidate onSubmit={onSubmit} className={clsx("flex flex-col gap-5", className)} aria-describedby={`${id}-status`}>
      <div className="grid gap-5 sm:grid-cols-2">
        {field("firstName", "First Name", "text", "given-name")}
        {field("lastName", "Last Name", "text", "family-name")}
      </div>
      {field(
        "email",
        "Email Address",
        "email",
        "email",
        <Button type="submit" size="md" className="h-11 shrink-0" disabled={status === "submitting"}>
          {status === "submitting" ? "Subscribing…" : "Subscribe"}
        </Button>,
      )}
      <p id={`${id}-status`} aria-live="polite" className={clsx("font-mono text-xs empty:-mt-5", status === "error" ? "text-danger" : "text-fg-muted")}>
        {message}
      </p>
    </form>
  );
}
