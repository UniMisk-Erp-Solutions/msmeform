import { useEffect, useMemo, useState } from 'react';
import districts from './talukas.json';
import { calcMsme, classify, SIZE_LABEL, money, fmt } from './calc.js';
import { Hero, Definition, Incentives, Ceilings, Examples, Compare, Support, Process, Faq, Sources } from './Sections.jsx';

const WHATSAPP_BASE = 'https://wa.me/919426049084';

const ALL = districts
  .flatMap((d) => [
    ...d.A.map((t) => ({ taluka: t, district: d.district, category: 'A' })),
    ...d.B.map((t) => ({ taluka: t, district: d.district, category: 'B' })),
  ])
  .sort((a, b) => a.taluka.localeCompare(b.taluka));

const norm = (s) => s.toLowerCase().replace(/[^a-z]/g, '');
function searchTalukas(q, limit = 12) {
  const n = norm(q);
  if (!n) return [];
  const first = [], second = [];
  for (const r of ALL) {
    const t = norm(r.taluka), d = norm(r.district);
    if (t.startsWith(n)) first.push(r);
    else if (t.includes(n) || d.startsWith(n)) second.push(r);
  }
  return [...first, ...second].slice(0, limit);
}

function NumberField({ label, value, onChange, suffix, hint, step = 1 }) {
  // Keep the typed text locally so the field can be emptied with backspace; an empty field counts as 0.
  const [text, setText] = useState(String(value));
  useEffect(() => {
    setText((t) => (Number(t === '' ? 0 : t) === value ? t : String(value)));
  }, [value]);
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <div className="field-box">
        <input
          type="number" inputMode="decimal" min={0} step={step} value={text}
          onChange={(e) => {
            const v = e.target.value.replace(/^0+(?=d)/, '');
            setText(v);
            const n = v === '' ? 0 : Number(v);
            onChange(Number.isFinite(n) ? n : 0);
          }}
        />
        <span className="suffix">{suffix}</span>
      </div>
      {hint && <span className="hint">{hint}</span>}
    </label>
  );
}

function Toggle({ on, onChange, label, hint }) {
  return (
    <button type="button" aria-pressed={on} className={`toggle ${on ? 'on' : ''}`} onClick={() => onChange(!on)}>
      <div className="toggle-title">{on && <span className="tick">✓</span>}{label}</div>
      <div className="hint">{hint}</div>
    </button>
  );
}

function notesFor(r, input) {
  const n = [];
  const s = r.slab;
  const annualBinds = r.rows.filter((x) => x.binding === 'annual').length;
  if (annualBinds) {
    if (r.size === 'micro') {
      n.push(`The year-1 ceiling of ${s.micro1}% of EFCI leaves ${s.micro1 - s.capital}% for interest and power alongside the ${s.capital}% capital subsidy, and years 2 to 5 are capped at ${s.microN}% each; the ceiling binds in ${annualBinds} of 5 years and nothing carries forward (para 4.2 d, e).`);
    } else {
      n.push(`The annual ceiling of ${s.annualSm}% of EFCI binds in ${annualBinds} of 5 years. Capital subsidy alone is ${(s.capital / 5).toFixed(0)}% a year, so interest and power tariff together can add at most ${(s.annualSm - s.capital / 5).toFixed(0)}% a year; the ${s.interestCap}% interest and ${s.powerCap}% power caps are rarely reached, and nothing carries forward (para 4.2 c, e).`);
    }
  }
  if (r.rows.some((x) => x.binding === 'overall')) n.push(`The overall ceiling of ${r.overallPct}% of EFCI (${money(r.overallCap)}) is reached before year 5.`);
  if (r.loan === 0) n.push('No term loan entered. Capital subsidy and power tariff still apply for a self-financed project (para 2.3). Interest subsidy needs a bank or RBI-recognised FI term loan; NBFC loans are excluded (para 1.8).');
  if (r.loan > 0 && input.loanRatePct - 2 < 7 + (r.plusOne ? 1 : 0)) n.push(`Interest subsidy is limited to ${Math.max(0, r.subsidyRate).toFixed(1)}% because the unit must bear at least 2% of the lender's ${input.loanRatePct}% rate (para 5.2 f).`);
  if (r.loan > r.efci) n.push('Term loan exceeds EFCI; only the amount disbursed against eligible fixed capital investment earns interest subsidy (para 5.2 b, c).');
  if (r.plusOne) n.push('The additional 1% interest subsidy is applied, within the overall ceiling (para 4.2 b). It is one 1%, not cumulative.');
  if (input.scst) n.push('The 5-point SC/ST addition comes from the policy document, not this GR, and is claimed under separate schemes.');
  if (r.totals.uncapped > r.totals.combined + 0.005) n.push(`Without ceilings the three components would total ${money(r.totals.uncapped)}; the GR caps them at ${money(r.totals.combined)}.`);
  return n;
}

export default function App() {
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState(null);
  const [override, setOverride] = useState(null);
  const [selected, setSelected] = useState(false);
  const [pm, setPm] = useState(8);
  const [efci, setEfci] = useState(12);
  const [loan, setLoan] = useState(8);
  const [rate, setRate] = useState(10);
  const [tenure, setTenure] = useState(6);
  const [morat, setMorat] = useState(1);
  const [power, setPower] = useState(20);
  const [male, setMale] = useState(40);
  const [female, setFemale] = useState(10);
  const [disabled, setDisabled] = useState(0);
  const [basic, setBasic] = useState(15000);
  const [woman, setWoman] = useState(false);
  const [firstGen, setFirstGen] = useState(false);
  const [scst, setScst] = useState(false);

  const matches = useMemo(() => searchTalukas(query), [query]);
  const category = override ?? picked?.category ?? 'A';
  const input = {
    category, sector: selected ? 'selected' : 'general', plantMachineryCr: pm, efciCr: efci, termLoanCr: loan, loanRatePct: rate,
    loanTenureYears: tenure, moratoriumYears: morat, annualPowerLakhUnits: power, employeesMale: male, employeesFemale: female,
    employeesDisabled: disabled, avgBasicDA: basic, womanOwned: woman, firstGenOrStartup: firstGen, scst,
  };
  const r = useMemo(() => calcMsme(input), [category, selected, pm, efci, loan, rate, tenure, morat, power, male, female, disabled, basic, woman, firstGen, scst]);
  const size = classify(pm);
  const notes = r.eligible ? notesFor(r, input) : [];

  const loadExample = (x) => {
    setQuery(''); setPicked(null); setOverride(x.category); setSelected(x.sector === 'selected');
    setPm(x.plantMachineryCr); setEfci(x.efciCr); setLoan(x.termLoanCr); setRate(x.loanRatePct); setTenure(x.loanTenureYears);
    setMorat(x.moratoriumYears); setPower(x.annualPowerLakhUnits); setMale(x.employeesMale); setFemale(x.employeesFemale);
    setDisabled(x.employeesDisabled); setBasic(x.avgBasicDA); setWoman(x.womanOwned); setFirstGen(x.firstGenOrStartup); setScst(x.scst);
    document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth' });
  };
  const whatsappUrl = () => {
    if (!r.eligible) return WHATSAPP_BASE;
    const lines = [
      'Hi Mistry & Shah, I used the MSME subsidy estimator (Viksit Gujarat Industrial Policy 2026) and would like a CA to review my eligibility.',
      '',
      '*Inputs*',
      `Taluka category: ${category}${picked ? ` (${picked.taluka}, ${picked.district})` : ''}`,
      `Sector: ${selected ? 'Selected thrust sector' : 'General manufacturing'}`,
      `Enterprise: ${SIZE_LABEL[size]} (plant and machinery ₹${fmt(pm, 2)} Cr)`,
      `Eligible fixed capital investment: ₹${fmt(efci, 2)} Cr`,
      `Term loan: ₹${fmt(loan, 2)} Cr at ${rate}% for ${tenure} yrs (moratorium ${morat} yr)`,
      `Power: ${fmt(power, 1)} lakh units/yr`,
      `New employees: ${male} male, ${female} female, ${disabled} specially-abled; avg basic + DA ₹${fmt(basic)}`,
      `Promoter: ${[woman && 'woman', firstGen && 'first-generation/startup', scst && 'SC/ST'].filter(Boolean).join(', ') || 'none of the special categories'}`,
      '',
      '*Estimate over 5 years*',
      `Capital subsidy: ${money(r.totals.capital)}`,
      `Interest subsidy: ${money(r.totals.interest)}`,
      `Power tariff: ${money(r.totals.power)}`,
      `Combined within ceilings: ${money(r.totals.combined)} (${r.effectivePct.toFixed(1)}% of EFCI, ceiling ${r.overallPct}%)`,
      `EPF reimbursement: ${money(r.epf.total)}`,
      `*Total quantified: ${money(r.grandTotal)}*`,
    ];
    return `${WHATSAPP_BASE}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  return (
    <>
    <main className="page">
      <Hero />
      <Definition />
      <Incentives />
      <Ceilings />

      <section id="estimator" className="block">
        <h2>MSME Subsidy Estimator</h2>
        <p className="sub wide">
          Applies the percentages, periods, component caps, yearly ceilings and overall ceiling of the scheme to your numbers. An estimate
          for planning only; the sanctioning authority's assessment decides the claim.
        </p>
      <div className="grid">
        <div className="col-main">
          <section className="card">
            <h3>1. Taluka</h3>
            <p className="sub">Search any of the 268 notified talukas. The same name can sit in two districts with different categories, so pick the district.</p>
            <input
              type="text" className="search" aria-label="Search taluka" value={query}
              placeholder="Type a taluka or district, e.g. Sanand, Dhandhuka, Morbi"
              onChange={(e) => { setQuery(e.target.value); setPicked(null); setOverride(null); }}
            />
            {query && !picked && (
              <ul className="results">
                {matches.length === 0 && <li className="empty">No match. Try the district name.</li>}
                {matches.map((m) => (
                  <li key={`${m.district}-${m.taluka}`}>
                    <button type="button" onClick={() => { setPicked(m); setQuery(m.taluka); }}>
                      <span><b>{m.taluka}</b> <span className="muted">· {m.district}</span></span>
                      <span className={`pill ${m.category === 'A' ? 'a' : ''}`}>Category {m.category}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {picked && (
              <div className="picked">
                <span className="chip">✓ {picked.taluka}, {picked.district}</span> is <b>Category {picked.category}</b>
              </div>
            )}
            <div className="direct">
              <span>Or set it directly:</span>
              {['A', 'B'].map((c) => (
                <button key={c} type="button" className={`cat ${category === c ? 'on' : ''}`} aria-pressed={category === c} onClick={() => setOverride(c)}>
                  Category {c}
                </button>
              ))}
            </div>
          </section>

          <section className="card">
            <h3>2. Unit and promoter</h3>
            <p className="sub">Plant and machinery sets Micro, Small or Medium. Promoter category changes the interest rate.</p>
            <div className="toggles">
              <Toggle on={selected} onChange={setSelected} label="Selected thrust sector" hint="Sports goods, toys, footwear, robots or drones (para 4.3)" />
              <Toggle on={woman} onChange={setWoman} label="Woman entrepreneur" hint="+1% interest subsidy (para 4.2 b); rent at 75% if 100% women-owned (para 17)" />
              <Toggle on={firstGen} onChange={setFirstGen} label="First-generation or registered startup" hint="+1% interest subsidy (para 4.2 b); the 1% is not cumulative" />
              <Toggle on={scst} onChange={setScst} label="SC/ST entrepreneur" hint="+5 points on the ceiling per the policy document; not in this GR" />
            </div>
            <div className="sizebox">
              <div className="size-title">{size === 'large' ? 'Above the MSME band' : SIZE_LABEL[size]}</div>
              <div className="hint">from ₹{fmt(pm, 1)} Cr plant and machinery across all units</div>
            </div>
            <div className="two">
              <NumberField label="Plant and machinery" value={pm} onChange={setPm} suffix="₹ Cr" step={0.5} hint="Up to ₹2.5 Cr Micro, ₹25 Cr Small, ₹125 Cr Medium (para 1.2)." />
              <NumberField label="Eligible fixed capital investment" value={efci} onChange={setEfci} suffix="₹ Cr" step={0.5} hint="Building, plant and machinery, utilities, 50% of project infrastructure; excludes land (para 1.10)." />
            </div>
          </section>

          <section className="card">
            <h3>3. Loan, power and people</h3>
            <p className="sub">Leave the term loan at zero for a self-financed project; capital subsidy and power tariff still apply.</p>
            <div className="two">
              <NumberField label="Term loan" value={loan} onChange={setLoan} suffix="₹ Cr" step={0.5} hint="Bank or RBI-recognised FI, not NBFC (para 1.8)." />
              <NumberField label="Interest rate" value={rate} onChange={setRate} suffix="% p.a." step={0.25} hint="Unit bears at least 2% (para 5.2 f)." />
              <NumberField label="Tenure" value={tenure} onChange={setTenure} suffix="years" />
              <NumberField label="Moratorium" value={morat} onChange={setMorat} suffix="years" />
              <NumberField label="Power consumption" value={power} onChange={setPower} suffix="lakh units/yr" step={1} hint="1 lakh units = 1,00,000 kWh. DISCOM or open-access renewable." />
              <NumberField label="New employees (male)" value={male} onChange={setMale} suffix="persons" />
              <NumberField label="New employees (female)" value={female} onChange={setFemale} suffix="persons" />
              <NumberField label="Specially-abled" value={disabled} onChange={setDisabled} suffix="persons" />
              <NumberField label="Average monthly basic + DA" value={basic} onChange={setBasic} suffix="₹" step={500} hint="EPF reimbursement is 12% of this, capped at ₹1,800 / ₹2,500 / ₹3,000 (para 7.2)." />
            </div>
          </section>
        </div>

        <aside className="col-side">
          {!r.eligible ? (
            <div className="card result">
              <div className="eyebrow">Above the MSME band</div>
              <p>Plant and machinery above ₹125 Cr falls under the Large, Mega and Ultra Mega scheme, which this estimator does not cover.</p>
            </div>
          ) : (
            <div className="card result">
              <div className="eyebrow">Estimated over 5 years</div>
              <div className="big">{money(r.totals.combined)}</div>
              <div className="sub">
                {r.effectivePct.toFixed(1)}% of EFCI · ceiling {r.overallPct}%{r.lost > 0.005 ? ` · ${money(r.lost)} lost to ceilings` : ''}
              </div>
              <dl className="lines">
                <div><dt>Capital subsidy ({r.slab.capital}% of EFCI, {size === 'micro' ? 'year 1' : '5 instalments'})</dt><dd>{money(r.totals.capital)}</dd></div>
                <div><dt>Interest subsidy ({r.subsidyRate.toFixed(0) === String(r.subsidyRate) ? r.subsidyRate : r.subsidyRate.toFixed(1)}% on loan, up to {r.slab.interestCap}%)</dt><dd>{money(r.totals.interest)}</dd></div>
                <div><dt>Power tariff (₹{r.slab.powerPerUnit}/unit, up to {r.slab.powerCap}%)</dt><dd>{money(r.totals.power)}</dd></div>
                <div><dt>EPF reimbursement (5 years, outside the ceiling)</dt><dd>{money(r.epf.total)}</dd></div>
                <div className="total"><dt>Total quantified</dt><dd>{money(r.grandTotal)}</dd></div>
              </dl>
              {notes.map((t, i) => <p key={i} className="note">{t}</p>)}
              <div className="actions">
                <a className="btn wa" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">Send this estimate to us</a>
              </div>
            </div>
          )}
        </aside>
      </div>

      {r.eligible && (
        <section className="card tablecard">
          <h3>Year by year</h3>
          <div className="tablewrap">
            <table>
              <thead>
                <tr><th>Year</th><th>Capital</th><th>Interest</th><th>Power</th><th>Before ceiling</th><th>Annual ceiling</th><th>Paid</th><th>Cumulative</th></tr>
              </thead>
              <tbody>
                {r.rows.map((x) => (
                  <tr key={x.year}>
                    <td>{x.year}</td>
                    <td>{money(x.capital)}</td>
                    <td>{money(x.interest)}</td>
                    <td>{money(x.power)}</td>
                    <td>{money(x.raw)}</td>
                    <td>{money(x.annualCap)} ({x.annualPct}%)</td>
                    <td>{money(x.allowed)}</td>
                    <td>{money(x.cumulative)}{x.binding !== 'none' && <div className="flag">{x.binding} ceiling binds</div>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      </section>

      <Examples onLoad={loadExample} />
      <Compare />
      <Support />
      <Process />
      <Faq />
      <Sources />
    </main>
    </>
  );
}
