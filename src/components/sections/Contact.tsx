'use client';
import React, { useState } from 'react';
import { CinematicSection } from '@/components/motion/CinematicSection';
import { Reveal, Line } from '@/components/motion/Reveal';
import { contact, project, socials } from '@/content/project';

const info = [
  { label: 'Visit us', value: project.address },
  { label: 'Direct line', value: project.phone, href: project.phoneHref },
  { label: 'Email', value: project.email, href: `mailto:${project.email}` },
];

/**
 * Ground floor: the end of the descent and the one place the visitor is
 * asked for something. Underlined fields, no card, so the form reads as
 * part of the page rather than a widget dropped into it.
 *
 * The submit handler is a local placeholder — there is no enquiry backend
 * in this project yet, and none is invented here.
 */
export const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1100);
  };

  return (
    <CinematicSection id="contact" tone="bone" scale="tall">
      <div className="wrap">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-16 items-start">
          <div className="lg:col-span-5">
            <Reveal variant="text"><p className="t-eyebrow">{contact.kicker}</p></Reveal>
            <Reveal variant="lines" delay={0.1} className="t-display mt-4" style={{ maxWidth: '9ch' }}>
              {contact.headline.map((l) => <Line key={l}>{l}</Line>)}
            </Reveal>
            <Reveal variant="text" delay={0.2}>
              <p className="t-body muted mt-10" style={{ maxWidth: '38ch' }}>{contact.body}</p>
            </Reveal>

            <Reveal variant="stat" delay={0.1}>
              <ul className="rule-strong mt-12">
                {info.map((item) => (
                  <li key={item.label} data-stat className="rule py-5 first:border-t-0 grid sm:grid-cols-[9rem_1fr] gap-1 sm:gap-4">
                    <span className="t-ui-sm muted">{item.label}</span>
                    {item.href
                      ? <a href={item.href} className="t-ui link-u" style={{ whiteSpace: 'pre-line', justifySelf: 'start' }}>{item.value}</a>
                      : <span className="t-ui" style={{ whiteSpace: 'pre-line' }}>{item.value}</span>}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal variant="text" delay={0.2}>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 mt-10">
                {socials.map((s) => (
                  <li key={s.label}><a href={s.href} className="t-ui link-u muted">{s.label}</a></li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal variant="text" delay={0.15} className="lg:col-span-6 lg:col-start-7">
            {submitted ? (
              <div className="rule-strong pt-10" aria-live="polite">
                <h3 className="t-h3">{contact.successTitle}</h3>
                <p className="t-body-sm muted mt-3" style={{ maxWidth: '40ch' }}>{contact.successBody}</p>
              </div>
            ) : (
              <>
                <h3 className="t-h3">{contact.formTitle}</h3>
                <p className="t-body-sm muted mt-2">{contact.formNote}</p>

                <form className="grid gap-8 mt-12" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="field">
                      <label htmlFor="ctc-name">Full name (required)</label>
                      <input id="ctc-name" name="name" type="text" placeholder="Your name" required autoComplete="name" />
                    </div>
                    <div className="field">
                      <label htmlFor="ctc-email">Email address</label>
                      <input id="ctc-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="ctc-phone">Mobile number (required)</label>
                    <div className="flex items-end gap-3">
                      <span className="t-ui pb-2 muted" style={{ borderBottom: '1px solid var(--line-strong)' }}>+91</span>
                      <input id="ctc-phone" name="phone" type="tel" placeholder="98765 43210" required
                        autoComplete="tel-national" inputMode="numeric" />
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="ctc-msg">Message</label>
                    <textarea id="ctc-msg" name="message" rows={3} placeholder="Tell us about your requirements" />
                  </div>

                  <label className="flex items-start gap-3 t-ui-sm muted cursor-pointer">
                    <input type="checkbox" required className="mt-1 flex-shrink-0" style={{ accentColor: 'var(--brand)' }} />
                    <span>{contact.consent}</span>
                  </label>

                  <button type="submit" className="btn btn-primary justify-self-start" disabled={loading}>
                    {loading ? 'Sending' : 'Submit enquiry'}
                  </button>
                </form>
              </>
            )}
          </Reveal>
        </div>
      </div>
    </CinematicSection>
  );
};
