import { useId, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { ApplyDef } from '../lib/pages';
import { isTypeformId, typeformUrl } from '../lib/typeform';

/**
 * Application block for recruitment pages. With a Typeform ID it embeds the form; without one it
 * shows a readiness self-check that stays in the browser (nothing is collected or sent).
 */
export default function ApplyBlock({ apply, formId }: { apply: ApplyDef; formId?: string }) {
  const headingId = useId();
  const [ticked, setTicked] = useState<boolean[]>(() => apply.checklist.map(() => false));
  const ready = ticked.filter(Boolean).length;
  const all = ready === apply.checklist.length;

  return (
    <section id="apply" aria-labelledby={headingId} className="mt-12 rounded-3xl border border-[#cbd9ce] bg-white p-6 sm:p-10">
      <h2 id={headingId} className="font-display text-3xl font-bold tracking-tight">{apply.heading}</h2>
      <p className="mt-3 max-w-2xl leading-7 text-slate-700">{apply.body}</p>

      {isTypeformId(formId) ? (
        <iframe
          title={apply.heading}
          src={typeformUrl(formId)}
          className="mt-6 h-[560px] w-full rounded-2xl border border-[#e4eae2]"
          allow="camera; microphone; autoplay; encrypted-media;"
        />
      ) : (
        <div className="mt-6 max-w-2xl">
          <p className="text-sm font-semibold text-[#26382d]">Check you are ready before your zone opens</p>
          <ul className="mt-3 space-y-2">
            {apply.checklist.map((item, i) => (
              <li key={item}>
                <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-[#e4eae2] px-4 py-2 text-slate-700 has-[:checked]:border-[#278052] has-[:checked]:bg-[#f2f8f2]">
                  <input
                    type="checkbox"
                    checked={ticked[i]}
                    onChange={(e) => setTicked((t) => t.map((v, j) => (j === i ? e.target.checked : v)))}
                    className="h-5 w-5 accent-[#176b45]"
                  />
                  {item}
                </label>
              </li>
            ))}
          </ul>
          <p role="status" className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#176b45]">
            {all ? <><CheckCircle2 size={16} aria-hidden /> You have everything verification asks for.</> : `${ready} of ${apply.checklist.length} ready`}
          </p>
          <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
            Applications are not open in this demo build. This check stays in your browser: nothing is saved or sent.
          </p>
        </div>
      )}
    </section>
  );
}
