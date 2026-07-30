import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { figures, timeline } from '@/lib/data/editorial';
import { pick } from '@/lib/utils/format';
import { PageHead } from '@/components/sections/PageHead';
import { Process } from '@/components/sections/Process';
import { Reveal } from '@/components/motion/Reveal';
import { Parallax } from '@/components/motion/Parallax';
import { SceneArt } from '@/components/art/SceneArt';
import { CountUp } from '@/components/motion/CountUp';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return { title: dict.workshop.title, description: dict.workshop.lede };
}

export default async function WorkshopPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHead
        eyebrow={dict.home.processEyebrow}
        title={dict.workshop.title}
        lede={dict.workshop.lede}
        hue={38}
        variant="oven"
      />

      <section className="section timeline-section">
        <div className="wrap">
          <span className="eyebrow">{dict.workshop.timelineTitle}</span>
          <ol className="timeline">
            {timeline.map((item, index) => (
              <Reveal key={item.year} delay={index * 0.06} from="up" distance={26}>
                <li className="timeline__row">
                  <span className="timeline__year num">{item.year}</span>
                  <div>
                    <h3>{pick(item.title, locale)}</h3>
                    <p>{pick(item.body, locale)}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section figures-section" data-tone="ink">
        <div className="wrap figures__grid">
          <div className="figures__art" aria-hidden="true">
            <Parallax amount={70} scale>
              <SceneArt hue={38} variant="chamber" />
            </Parallax>
          </div>
          <div>
            <span className="eyebrow">{dict.workshop.numbersTitle}</span>
            <dl className="figures">
              {figures.map((figure) => (
                <div key={figure.value}>
                  <dt className="num">
                    <CountUp to={Number(figure.value)} />
                  </dt>
                  <dd>{pick(figure.label, locale)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <Process locale={locale} dict={dict} />
    </>
  );
}
