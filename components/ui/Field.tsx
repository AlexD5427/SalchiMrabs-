'use client';

import type { ReactNode } from 'react';

interface Shared {
  label: string;
  name: string;
  hint?: string;
  error?: string;
  required?: boolean;
}

export function Field({
  label,
  name,
  hint,
  error,
  required,
  ...rest
}: Shared & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="field" data-invalid={error ? 'true' : 'false'}>
      <span className="field__label">
        {label}
        {required ? <em aria-hidden="true">*</em> : null}
      </span>
      <input className="field__input" name={name} required={required} {...rest} />
      {error ? <span className="field__msg field__msg--error">{error}</span> : null}
      {!error && hint ? <span className="field__msg">{hint}</span> : null}
    </label>
  );
}

export function TextArea({
  label,
  name,
  hint,
  error,
  required,
  ...rest
}: Shared & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="field" data-invalid={error ? 'true' : 'false'}>
      <span className="field__label">
        {label}
        {required ? <em aria-hidden="true">*</em> : null}
      </span>
      <textarea className="field__input field__input--area" name={name} rows={4} required={required} {...rest} />
      {error ? <span className="field__msg field__msg--error">{error}</span> : null}
      {!error && hint ? <span className="field__msg">{hint}</span> : null}
    </label>
  );
}

export function Select({
  label,
  name,
  hint,
  error,
  required,
  children,
  ...rest
}: Shared & { children: ReactNode } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="field" data-invalid={error ? 'true' : 'false'}>
      <span className="field__label">
        {label}
        {required ? <em aria-hidden="true">*</em> : null}
      </span>
      <span className="field__select">
        <select className="field__input" name={name} required={required} {...rest}>
          {children}
        </select>
      </span>
      {error ? <span className="field__msg field__msg--error">{error}</span> : null}
      {!error && hint ? <span className="field__msg">{hint}</span> : null}
    </label>
  );
}

export function Choice({
  label,
  name,
  value,
  checked,
  onChange,
  description,
  meta,
}: {
  label: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  description?: string;
  meta?: string;
}) {
  return (
    <label className="choice" data-checked={checked ? 'true' : 'false'}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <span className="choice__mark" aria-hidden="true" />
      <span className="choice__text">
        <span className="choice__label">{label}</span>
        {description ? <span className="choice__desc">{description}</span> : null}
      </span>
      {meta ? <span className="choice__meta num">{meta}</span> : null}
    </label>
  );
}
