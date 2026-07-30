'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/es';
import { wholesaleTiers } from '@/lib/data/editorial';
import { pick } from '@/lib/utils/format';
import { Field, Select, TextArea } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { useUi } from '@/lib/store/ui';

export function WholesaleForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { toast } = useUi();
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Record<string, string> = {};
    for (const key of ['business', 'name', 'email']) {
      if (!String(data.get(key) ?? '').trim()) next[key] = dict.common.required;
    }
    const email = String(data.get('email') ?? '');
    if (email && !email.includes('@')) next.email = dict.common.required;

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setState('sending');
    window.setTimeout(() => {
      setState('done');
      toast(dict.clients.sent);
    }, 900);
  };

  if (state === 'done') {
    return (
      <div className="formdone">
        <h3>{dict.clients.sent}</h3>
        <Button variant="outline" size="sm" onClick={() => setState('idle')}>
          {dict.common.back}
        </Button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit} noValidate>
      <div className="form__grid">
        <Field label={dict.clients.fields.business} name="business" required error={errors.business} />
        <Field label={dict.clients.fields.name} name="name" required error={errors.name} />
        <Field label={dict.clients.fields.email} name="email" type="email" required error={errors.email} />
        <Field label={dict.clients.fields.phone} name="phone" type="tel" />
        <Select label={dict.clients.fields.volume} name="volume">
          {wholesaleTiers.map((tier) => (
            <option key={tier.from} value={tier.from}>
              {pick(tier.name, locale)} · {tier.from}+ {dict.clients.tierUnit}
            </option>
          ))}
        </Select>
      </div>
      <TextArea label={dict.clients.fields.message} name="message" />
      <Button type="submit" size="lg" disabled={state === 'sending'}>
        {state === 'sending' ? dict.common.sending : dict.common.submit}
      </Button>
    </form>
  );
}
