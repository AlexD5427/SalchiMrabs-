'use client';

import { useState } from 'react';

interface Item {
  q: string;
  a: string;
}

export function Accordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="accordion">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div className="accordion__row" key={item.q} data-open={isOpen ? 'true' : 'false'}>
            <button
              type="button"
              className="accordion__head"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : index)}
            >
              <span className="accordion__index num">{String(index + 1).padStart(2, '0')}</span>
              <span className="accordion__q">{item.q}</span>
              <span className="accordion__sign" aria-hidden="true" />
            </button>
            <div className="accordion__panel">
              <p className="accordion__a">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
