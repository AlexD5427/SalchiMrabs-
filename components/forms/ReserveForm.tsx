'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/es';
import { useAuth } from '@/lib/store/auth';
import { useUi } from '@/lib/store/ui';
import { orderCode } from '@/lib/utils/format';
import { Button } from '@/components/ui/Button';
import { Choice, Field, Select, TextArea } from '@/components/ui/Field';

const SLOTS = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];

export function ReserveForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { addReservation } = useAuth();
  const { toast } = useUi();
  const [type, setType] = useState<'pickup' | 'tasting' | 'catering'>('pickup');
  const [date, setDate] = useState('');
  const [time, setTime] = useState(SLOTS[2]);
  const [people, setPeople] = useState(2);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  if (done) {
    return (
      <div className="formdone formdone--panel">
        <span className="eyebrow">{dict.reserve.done}</span>
        <h3 className="subtitle">{done}</h3>
        <p>{dict.reserve.doneBody}</p>
        <Button
          variant="outline"
          onClick={() => {
            setDone(null);
            setNotes('');
          }}
        >
          {dict.reserve.another}
        </Button>
      </div>
    );
  }

  return (
    <form
      className="form form--panel"
      onSubmit={(event) => {
        event.preventDefault();
        const next: Record<string, string> = {};
        if (!date) next.date = dict.common.required;
        setErrors(next);
        if (Object.keys(next).length > 0) return;

        const id = orderCode();
        addReservation({ id, createdAt: Date.now(), type, date, time, people, notes });
        toast(dict.reserve.done);
        setDone(id);
      }}
      noValidate
    >
      <fieldset className="form__fieldset">
        <legend className="eyebrow">{dict.reserve.type}</legend>
        <div className="form__choices">
          {(['pickup', 'tasting', 'catering'] as const).map((option) => (
            <Choice
              key={option}
              name="reserve-type"
              value={option}
              label={dict.reserve.types[option]}
              checked={type === option}
              onChange={(value) => setType(value as typeof type)}
            />
          ))}
        </div>
      </fieldset>

      <div className="form__grid">
        <Field
          label={dict.reserve.date}
          name="date"
          type="date"
          min={today}
          value={date}
          onChange={(event) => setDate(event.target.value)}
          required
          error={errors.date}
        />
        <Select label={dict.reserve.time} name="time" value={time} onChange={(event) => setTime(event.target.value)}>
          {SLOTS.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </Select>
        <Field
          label={dict.reserve.people}
          name="people"
          type="number"
          min={1}
          max={40}
          value={people}
          onChange={(event) => setPeople(Number(event.target.value))}
        />
      </div>

      <TextArea
        label={dict.reserve.notes}
        name="notes"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
      />

      <Button type="submit" size="lg" full magnetic>
        {dict.reserve.confirm}
      </Button>
    </form>
  );
}
