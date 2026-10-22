import { calcMsme, money, fmt } from './calc.js';

export const NAV = [
  ['overview', 'Overview'], ['definition', 'Who qualifies'], ['incentives', 'Incentives'], ['ceilings', 'Annual ceilings'],
  ['estimator', 'Estimator'], ['examples', 'Examples'], ['compare', '2020 vs 2026'], ['support', 'Support schemes'],
  ['process', 'Claim process'], ['faq', 'FAQ'], ['sources', 'Sources'],
];

export const EXAMPLES = [
  { title: '₹3 Cr micro unit, Category A', blurb: 'Food processing, Dhandhuka. ₹2 Cr machinery, ₹3 Cr EFCI, ₹2 Cr loan at 10%, 5 lakh units, 12 staff.',
    input: { category: 'A', sector: 'general', plantMachineryCr: 2, efciCr: 3, termLoanCr: 2, loanRatePct: 10, loanTenureYears: 5, moratoriumYears: 1, annualPowerLakhUnits: 5, employeesMale: 9, employeesFemale: 3, employeesDisabled: 0, avgBasicDA: 14000, womanOwned: false, firstGenOrStartup: false, scst: false } },
  { title: '₹15 Cr small unit, Category B', blurb: 'Engineering parts, Sanand. ₹10 Cr machinery, ₹15 Cr EFCI, ₹10 Cr loan at 9.5%, 40 lakh units, 60 staff.',
    input: { category: 'B', sector: 'general', plantMachineryCr: 10, efciCr: 15, termLoanCr: 10, loanRatePct: 9.5, loanTenureYears: 7, moratoriumYears: 1, annualPowerLakhUnits: 40, employeesMale: 48, employeesFemale: 12, employeesDisabled: 0, avgBasicDA: 16000, womanOwned: false, firstGenOrStartup: false, scst: false } },
  { title: '₹90 Cr medium unit, Category A, self-financed', blurb: 'Technical textiles, Palitana. ₹70 Cr machinery, ₹90 Cr EFCI, no loan, 250 lakh units, 300 staff.',
    input: { category: 'A', sector: 'general', plantMachineryCr: 70, efciCr: 90, termLoanCr: 0, loanRatePct: 9, loanTenureYears: 8, moratoriumYears: 1, annualPowerLakhUnits: 250, employeesMale: 240, employeesFemale: 60, employeesDisabled: 0, avgBasicDA: 17000, womanOwned: false, firstGenOrStartup: false, scst: false } },
];

const Table = ({ head, rows, className = '' }) => (
  <div className={`tablewrap ${className}`}>
    <table>
      <thead><tr>{head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className={j === 0 ? 'strong' : ''}>{c}</td>)}</tr>)}</tbody>
    </table>
  </div>
);

const Block = ({ id, title, intro, children }) => (
  <section id={id} className="block">
    <h2>{title}</h2>
    {intro && <p className="sub wide">{intro}</p>}
    {children}
  </section>
);

export function Hero() {
  const stats = [
    ['45% / 35%', 'Combined ceiling, Category A / B'],
    ['35% / 25%', 'Capital subsidy on EFCI, A / B'],
    ['9% / 7%', 'Yearly cap, Small and Medium, A / B'],
    ['25 Mar 2027', 'PEC deadline for units already producing'],
  ];
  return (
    <section id="overview" className="block hero">
      <img className="king" src="/theme/Group-16-1.png" alt="" aria-hidden="true" />
      <div className="badge">Scheme GR dated 25 September 2026</div>
      <h1>Gujarat MSME incentives under <span className="red">Viksit Gujarat</span> Industrial Policy 2026</h1>
      <p className="lead">
        Micro, small and medium manufacturers can claim a capital subsidy, an interest subsidy and a power tariff subsidy, bounded by a
        combined ceiling of 45% of eligible fixed capital investment (35% in Category B), or 50% / 45% in five selected sectors. EPF
        reimbursement, electricity duty exemption and a list of capped support schemes sit on top. Figures here follow the Industries and
        Mines Department resolution No. IMD/WRT/e-file/9/2026/2630/CH, with paragraph numbers given so you can check each one.
      </p>
      <div className="stats">{stats.map(([a, b]) => <div key={a} className="stat"><div className="stat-n">{a}</div><div className="hint">{b}</div></div>)}</div>

      <div className="card timeline">
        <h3>Where things stand</h3>
        <ul>
          <li><b>15 June 2026</b> – Policy announced with headline MSME ceilings; support schemes named without amounts.</li>
          <li><b>8 September 2026</b> – Taluka list (Category A / B) notified. The MSME resolution adopts it in para 1.14 and adds a tie-break: a site spanning two talukas takes the one holding most of its land.</li>
          <li><b>8 September 2026</b> – Separate resolution for Large, Mega and Ultra Mega units (machinery above ₹125 Cr).</li>
          <li><b>25 September 2026</b> – MSME scheme resolution issued, effective 1 June 2026 to 31 May 2031. It fixes slabs, yearly ceilings, investment rules, deadlines and every support amount.</li>
          <li><b>9 October 2026</b> – Public announcement by the department, with the same figures. Each incentive has its own six-month claim window.</li>
        </ul>
      </div>
    </section>
  );
}

export function Definition() {
  return (
    <Block id="definition" title="Who counts as an MSME" intro="Para 1.2 uses the revised thresholds, which are 2.5 times the old micro limit and 2.5 times the old small and medium limits. The test is gross investment in plant and machinery across every unit the enterprise owns in India, not turnover or total project cost. Status is fixed on the date the project is completed (para 3.3).">
      <Table head={['Class', 'Plant and machinery', '2020 limit']} rows={[
        ['Micro', 'Up to ₹2.5 Cr', 'Up to ₹1 Cr'],
        ['Small', 'Above ₹2.5 Cr, up to ₹25 Cr', 'Up to ₹10 Cr'],
        ['Medium', 'Above ₹25 Cr, up to ₹125 Cr', 'Up to ₹50 Cr'],
        ['Large', 'Above ₹125 Cr', 'Separate resolution and calculator'],
      ]} />
    </Block>
  );
}

export function Incentives() {
  return (
    <Block id="incentives" title="The three incentive components" intro="Para 4.2 lets a unit claim any one component or any mix, each within its own cap and an overall ceiling set by the taluka. All are percentages of eligible fixed capital investment (EFCI): new building, plant and machinery, utilities and half of project infrastructure, excluding land and working capital.">
      <div className="three">
        <div className="card"><h3>Capital subsidy</h3><p className="sub">35% of EFCI in Category A, 25% in B. Micro units get it in year 1; small and medium units in five yearly instalments. It is based on EFCI, not on a loan, so self-financed projects qualify (paras 2.3, 5.1).</p></div>
        <div className="card"><h3>Interest subsidy</h3><p className="sub">7% a year on a term loan from a bank or approved financial institution for 5 years, up to 10% of EFCI. Women, registered manufacturing startups and first-generation entrepreneurs get +1%. The unit must bear at least 2% (paras 4.2 b, 5.2 f).</p></div>
        <div className="card"><h3>Power tariff</h3><p className="sub">₹2 per unit in Category A and ₹1 in B for 5 years, up to 25% of EFCI. Applies to DISCOM supply or open-access renewable power; captive power is excluded (para 5.3).</p></div>
      </div>

      <h3 className="mt">Standard slab (para 4.2)</h3>
      <p className="sub">Paid over 5 years from the date of commercial production.</p>
      <Table head={['Taluka', 'Capital subsidy', 'Interest subsidy', 'Power tariff', '5-year ceiling']} rows={[
        ['Category A', 'Micro: 35% in year 1. Small / Medium: 35% over 5 years', '7% for 5 years, up to 10% of EFCI (+1% for eligible promoters)', '₹2 / unit, up to 25% of EFCI', '45% of EFCI'],
        ['Category B', 'Micro: 25% in year 1. Small / Medium: 25% over 5 years', '7% for 5 years, up to 10% of EFCI (+1% for eligible promoters)', '₹1 / unit, up to 25% of EFCI', '35% of EFCI'],
      ]} />

      <h3 className="mt">Selected thrust sectors (para 4.3)</h3>
      <p className="sub">Sports goods, toys, footwear, robots and drones. This is the only sector uplift for MSMEs. It also brings 100% stamp duty and registration reimbursement and the extras in para 19.</p>
      <Table head={['Taluka', 'Capital subsidy', 'Interest subsidy', 'Power tariff', '5-year ceiling']} rows={[
        ['Category A', 'Micro: 35% in year 1. Small / Medium: 35% over 5 years', '7% for 5 years, up to 20% of EFCI', '₹2 / unit, up to 20% of EFCI', '50% of EFCI'],
        ['Category B', 'Micro: 30% in year 1. Small / Medium: 30% over 5 years', '7% for 5 years, up to 20% of EFCI', '₹1 / unit, up to 20% of EFCI', '45% of EFCI'],
      ]} />
    </Block>
  );
}

export function Ceilings() {
  return (
    <Block id="ceilings" title="Yearly ceilings: the limit that bites first" intro="Paras 4.2 (c)–(e) and 4.3 (c)–(e) cap what a unit can receive in any single year across all three components. Whatever exceeds the cap in a year is lost; nothing carries forward.">
      <Table head={['Cap as % of EFCI', 'General, A', 'General, B', 'Selected, A', 'Selected, B']} rows={[
        ['Small and Medium, every year', '9%', '7%', '10%', '9%'],
        ['Micro, year 1', '37%', '27%', '38%', '33%'],
        ['Micro, years 2–5 (each)', '2%', '2%', '3%', '3%'],
      ]} />
      <div className="card callout">
        <h3>Why it matters in practice</h3>
        <p className="sub">A small or medium unit in Category A already uses 7% of EFCI a year on capital subsidy (5% in Category B), against a 9% (7%) cap. That leaves only 2% a year for interest and power together, however large the 10% and 25% component caps look. Heavy borrowing and heavy power use therefore mostly forfeit value. Micro units take the whole capital subsidy in year 1, which leaves 2% a year for the rest. Because capital subsidy needs no loan and NBFC loans do not count (para 1.8), borrow only if the interest subsidy fits inside that headroom.</p>
      </div>
    </Block>
  );
}

export function Examples({ onLoad }) {
  return (
    <Block id="examples" title="Three worked examples" intro="Each is computed live by the same engine as the estimator. The third has no loan, to show that capital subsidy does not depend on one.">
      <div className="three">
        {EXAMPLES.map((ex) => {
          const r = calcMsme(ex.input);
          return (
            <div key={ex.title} className="card example">
              <h3>{ex.title}</h3>
              <p className="sub">{ex.blurb}</p>
              <dl className="lines">
                <div><dt>Capital subsidy</dt><dd>{money(r.totals.capital)}</dd></div>
                <div><dt>Interest subsidy</dt><dd>{money(r.totals.interest)}</dd></div>
                <div><dt>Power tariff</dt><dd>{money(r.totals.power)}</dd></div>
                <div><dt>Before ceilings</dt><dd>{money(r.totals.uncapped)}</dd></div>
                <div><dt>Within ceilings ({r.overallPct}%)</dt><dd>{money(r.totals.combined)}</dd></div>
                <div><dt>EPF, 5 years</dt><dd>{money(r.epf.total)}</dd></div>
                <div className="total"><dt>Total</dt><dd>{money(r.grandTotal)}</dd></div>
              </dl>
              <button type="button" className="btn" onClick={() => onLoad(ex.input)}>Load into estimator</button>
            </div>
          );
        })}
      </div>
    </Block>
  );
}

export function Compare() {
  return (
    <Block id="compare" title="What changed from the 2020 scheme" intro="2020 figures are from the MSME scheme in force 7 August 2020 to 6 August 2025. 2026 figures are from the 25 September 2026 resolution.">
      <Table head={['Item', '2020 scheme', '2026 scheme']} rows={[
        ['Taluka tiers', 'Three (I, II, III) over 251 talukas', 'Two (A, B) over 268 talukas; two-taluka sites take the larger land share'],
        ['MSME definition', 'Micro ₹1 Cr, Small ₹10 Cr, Medium ₹50 Cr', 'Micro ₹2.5 Cr, Small ₹25 Cr, Medium ₹125 Cr, across all units in India'],
        ['Capital subsidy', '25% / 20% / 10% of term loan, capped ₹35 L / ₹30 L / ₹10 L (plus ₹10 L / ₹7.5 L / ₹5 L above ₹10 Cr EFCI)', '35% (A) / 25% (B) of EFCI, no rupee cap; self-financed projects eligible'],
        ['Yearly ceiling', 'None', '9% (A) / 7% (B) for Small and Medium; Micro 37% / 27% in year 1, then 2%; no carry forward'],
        ['Interest subsidy', '7% / 6% / 5% for 7 / 6 / 5 years, capped ₹35 L / ₹30 L / ₹25 L a year', '7% for 5 years up to 10% of EFCI (20% in selected sectors); +1% for women, registered startups, first-generation'],
        ['Power tariff', 'None for MSMEs', '₹2 (A) / ₹1 (B) per unit for 5 years, up to 25% of EFCI; open-access renewable allowed'],
        ['Combined ceiling', 'Component caps only', '45% (A) / 35% (B); 50% / 45% in selected sectors'],
        ['Investment window', 'Term loan disbursed after 7 August 2020', 'Assets from 1 January 2026, plus 12 months after production (machinery up to ₹50 Cr) or 18 months (₹50–125 Cr)'],
        ['Application', 'Within one year of first disbursement or production', 'PEC within 6 months of production or of the resolution; up to 2 years late is cut proportionately, later is not entertained'],
        ['SC/ST promoters', '+1% interest subsidy', 'Not in this resolution; the policy names separate Ambedkar and Birsa Munda schemes'],
        ['Women promoters', '+1% interest subsidy', '+1% interest subsidy; rent aid 75% (from 65%) when 100% women-owned'],
        ['Young entrepreneurs', '+1% for under-35s', 'Replaced by +1% for first-generation entrepreneurs and registered manufacturing startups'],
        ['EPF reimbursement', 'Not in MSME scheme', '100% of employer contribution for 5 years, capped ₹1,800 / ₹2,500 / ₹3,000 a month'],
        ['Minimum interest borne', '2%', '2% (para 5.2 f)'],
      ]} />
      <p className="sub wide mt">In rupees: a ₹10 Cr project in a top-tier taluka could draw at most ₹35 lakh of capital subsidy under the 2020 scheme, and only against a loan. The 2026 slab allows 35% of EFCI, or ₹3.5 Cr, loan or no loan, at ₹70 lakh a year for a small or medium unit, inside a ₹90 lakh yearly cap shared with interest and power.</p>
    </Block>
  );
}

export function Support() {
  return (
    <Block id="support" title="Benefits outside the ceiling, and support schemes" intro="Paras 7, 15, 17 and 18 sit outside the combined ceiling. Paras 8–16 are capped support schemes, each claimed within six months of the expense, certificate or listing.">
      <div className="three">
        <div className="card"><h3>EPF (para 7)</h3><p className="sub">100% of the employer contribution for new employees without a prior UAN, for 5 years, limited to 12% of basic + DA or ₹1,800 (men) / ₹2,500 (women) / ₹3,000 (specially-abled) a month. Paid quarterly; only incremental headcount for expansions.</p></div>
        <div className="card"><h3>Electricity duty (para 18)</h3><p className="sub">Full exemption under the Gujarat Electricity Duty Act, 1958.</p></div>
        <div className="card"><h3>Rent and guarantee fee (paras 15, 17)</h3><p className="sub">Micro and small units: 65% of shed rent (75% if 100% women-owned) up to ₹3 lakh a year for 5 years, and 100% of the CGTMSE guarantee fee on a collateral-free term loan for 5 years.</p></div>
      </div>
      <Table className="mt" head={['Support (para)', 'Assistance', 'Cap']} rows={[
        ['ERP software (8.1)', '65% of cost; SaaS counts, hardware does not', '₹1 lakh'],
        ['Quality certification (8.2)', '50% of fees and testing equipment; not statutory or renewals', '₹10 lakh'],
        ['ZED certification (9)', '50% of charges after central assistance', '₹50,000'],
        ['ICT and Industry 4.0 (10)', '65% of spend on cloud, networking and AI equipment', '₹5 lakh'],
        ['Technology acquisition (11)', '65% of cost, including two years of royalty', '₹50 lakh'],
        ['Patent registration (12)', '75% of cost; attorney fee ≤ ₹50,000 domestic, ₹2 lakh per country abroad; half on publication, half on grant', '₹25 lakh'],
        ['Energy and water audit (13)', '75% of each audit, once; 25% of recommended equipment if savings reach 10%', '₹50,000 each; ₹20 lakh'],
        ['SME exchange listing (14)', '25% of issue expenses after listing, one time', '₹5 lakh'],
        ['Power connection (16)', '35% of LT/HT service-line charges outside GIDC and approved estates', '₹5 lakh'],
      ]} />
      <div className="card callout mt">
        <h3>Extra for selected thrust sectors (para 19)</h3>
        <p className="sub">Sports goods, toys, footwear, robots and drones: 100% stamp duty and registration on project land (apply within six months of production); IPR 75% up to ₹1 Cr; technology acquisition 65% up to ₹1 Cr; international certification 100% up to ₹5 Cr; training ₹8,000 per Gujarat-domiciled employee per month for 12 months, once; creative design studio 50% up to ₹5 Cr; and, for micro units and artisans, AI subscriptions at 80% up to ₹1 lakh a year for 3 years.</p>
      </div>
      <div className="card callout mt">
        <h3>Not in this resolution</h3>
        <p className="sub">The policy document also promises SC/ST add-ons, disability incentives, cleaner-production and zero-liquid-discharge support, relocation aid, a startup package (₹25,000 a month sustenance for a year, seed support to ₹50 lakh) and women-leadership initiatives. Each awaits its own notification. A registered manufacturing startup gets only the extra 1% interest subsidy for now.</p>
      </div>
    </Block>
  );
}

const PROCESS = [
  ['New unit, expansion or diversification (1.3–1.6, 2.1)', 'A new enterprise with Udyam registration and IEM, letter of intent or MCA21 evidence, or an existing one expanding or diversifying, starting production between 1 June 2026 and 31 May 2031. Expansion needs at least 50% more gross fixed investment excluding land, 60% of it in machinery, and 50% more capacity, after 75% utilisation in one of the last three years; claims open a year after completion. Diversification needs 25% more investment (micro, small) or 50% (medium). Expanding at another premises counts as a new project.'],
  ['Eligible fixed capital investment (1.10, 1.11)', 'Counts: buildings at the lower of actual cost or the R&B schedule; other construction; new plant and machinery including captive power, in-plant vehicles and handling, desalination, pollution control, technology, designs and patents up to 10% of machinery, DG sets up to 50% of load or 5 MW; and 50% of project infrastructure. Does not count: land, working capital, goodwill, royalty, pre-operative costs, second-hand machinery, capitalised interest, rented or leased assets, non-captive power plants, consultancy without technology transfer.'],
  ['Eligible investment period (3)', 'Assets acquired and paid for from 1 January 2026 count, plus 12 months after commercial production for machinery up to ₹50 Cr and 18 months up to ₹125 Cr, even past the operative period, provided production began inside it.'],
  ['Self-financed or bank-financed (1.8, 2.3)', 'Eligibility is the lowest of project investment, the bank completion certificate and the asset verification report. Self-financed projects use an auditor, CA, chartered engineer or company secretary certificate or asset verification, whichever is lower. Term loans come from RBI-recognised banks or FIs, ECBs, NDDB, GSFS, HUDCO, REC or PFC; NBFCs are excluded and only amounts disbursed within the investment period count.'],
  ['Provisional and Final Eligibility Certificate (6)', 'The PEC is due within six months of commercial production or of the resolution, whichever is later, and covers up to 40% of EFCI. The FEC comes directly if investment is complete at production, otherwise within six months of completion or of the end of the investment period. Interest and power claims begin after the PEC or FEC.'],
  ['Late-filing rule (21)', 'An FEC application up to two years late is sanctioned with a proportionate cut; later than that is not entertained. Authorities must process complete files in the prescribed time, and missing documents forfeit the claim.'],
  ['Workforce, pollution board and overlap (2.2, 5.4)', 'At least 85% of staff and 60% of managerial and supervisory staff must be domiciled in Gujarat, and a GPCB certificate is filed with the DIC or Commissioner. No other state incentive on the same investment; central schemes can stack, but state plus central cannot exceed EFCI. Renovation and rationalisation spending does not count.'],
  ['Keep producing, or repay (22.3, 22.4)', 'Production must continue through the incentive period, with stoppages beyond management control condonable by the sanctioning authority. A breach makes incentives recoverable as land-revenue arrears with 18% annual interest from first availment.'],
  ['Who sanctions (23)', 'Micro and small: the General Manager of the District Industries Centre. Medium: the MSME Commissioner, who also sanctions quality certification, technology acquisition, patents, SME exchange and all selected-sector extras. A State Level Empowered Committee chaired by the Commissioner monitors the scheme and settles doubts.'],
  ['Opting for the 2022 scheme (4.1)', 'A unit not yet in production on 1 June 2026 may irrevocably choose the 5 October 2022 Aatmanirbhar Gujarat MSME scheme within six months of the resolution (by 25 March 2027), but only if production starts by 4 October 2027. After that window all applications fall under the 2026 scheme.'],
];

export function Process() {
  return (
    <Block id="process" title="Eligibility and claim process" intro="Paras 1–3, 5, 6, 21 and 22 of the resolution. Open each item for the detail.">
      <div className="acc">{PROCESS.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
    </Block>
  );
}

const FAQ = [
  ['How much can an MSME get?', 'Capital subsidy of 35% of EFCI in Category A or 25% in B; interest subsidy of 7% a year on a term loan for 5 years up to 10% of EFCI; power tariff support of ₹2 (A) or ₹1 (B) per unit for 5 years up to 25% of EFCI. Together they are capped at 45% (A) or 35% (B) of EFCI over 5 years, or 50% and 45% in the five selected sectors, with yearly caps and no carry forward. EPF reimbursement and electricity duty exemption come on top.'],
  ['Has the MSME resolution been issued?', 'Yes. Resolution No. IMD/WRT/e-file/9/2026/2630/CH of the Industries and Mines Department, dated 25 September 2026 with Finance Department concurrence, notifies the scheme for 1 June 2026 to 31 May 2031. It follows the taluka and Large/Mega resolutions of 8 September 2026.'],
  ['Do I need a term loan for the capital subsidy?', 'No. Para 5.1 grants it on EFCI, and para 2.3 explicitly covers self-financed projects. A bank or FI term loan is needed only for the interest subsidy, and NBFC loans are excluded (para 1.8).'],
  ['Which units are MSMEs?', 'By plant and machinery across all your units in India: Micro up to ₹2.5 Cr, Small up to ₹25 Cr, Medium up to ₹125 Cr (para 1.2). Status is fixed at project completion (para 3.3). Above ₹125 Cr is a Large undertaking under a separate resolution.'],
  ['Why does the yearly cap matter more than the headline percentage?', 'It binds first. A small or medium Category A unit uses 7% of EFCI a year on capital subsidy against a 9% cap, leaving 2% for interest and power together. A micro unit takes its full 35% in year 1 against a 37% cap, then 2% a year. Nothing carries forward (para 4.2 e).'],
  ['What extra do women, startups, first-generation and SC/ST promoters get?', 'Women, registered manufacturing startups and first-generation entrepreneurs get +1% interest subsidy (8% in total), within the overall ceiling (para 4.2 b). Rent aid for micro and small units is 75% instead of 65% when 100% women-owned (para 17). The 5-point SC/ST ceiling addition is not in this resolution and belongs to separate schemes.'],
  ['What are the deadlines?', 'PEC: within six months of commercial production or of the resolution (25 March 2027), whichever is later, covering up to 40% of EFCI (para 6.1). FEC: within six months of completing the investment or of the end of the eligible period (paras 6.3, 6.4). Up to two years late is cut proportionately; later is not entertained (para 21). Each support scheme has its own six-month window.'],
  ['Can I still choose the 2022 scheme?', 'Only if production had not begun before 1 June 2026. You then have until 25 March 2027 to opt, irrevocably, and production must start by 4 October 2027. Units already producing before 1 June 2026 stay on the earlier scheme (para 4.1).'],
  ['How does it compare with 2020?', 'Capital subsidy moves from a capped share of the loan to 35% or 25% of EFCI with no rupee cap and no loan requirement. Interest subsidy becomes a flat 7% for 5 years. Power tariff support, EPF reimbursement and yearly and combined ceilings are new for MSMEs. On a ₹10 Cr project, the 2020 capital subsidy topped out at ₹35 lakh, against up to ₹3.5 Cr now.'],
  ['What should I do first?', 'Confirm your taluka category against the district; classify machinery across all units against the ₹2.5, ₹25 and ₹125 Cr lines; decide whether a term loan is worth it for the interest subsidy alone; model the yearly cap against your draw-down; line up Udyam registration, GPCB consent and the EFCI working; and diarise the PEC deadline.'],
];

export function Faq() {
  return (
    <Block id="faq" title="Frequently asked questions">
      <div className="acc">{FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
    </Block>
  );
}

export function Sources() {
  return (
    <Block id="sources" title="Sources">
      <ul className="sources">
        <li><b>Scheme for assistance to MSMEs</b> – Resolution No. IMD/WRT/e-file/9/2026/2630/CH, Industries and Mines Department, 25 September 2026. The source for every MSME figure here.</li>
        <li><b>Viksit Gujarat Industrial Policy 2026</b> – Policy document, 15 June 2026. Used only for items the resolution does not cover.</li>
        <li><b>Taluka classification</b> – Resolution No. IMD/HMR/e-file/9/2026/2211/I, 8 September 2026, adopted by para 1.14.</li>
        <li><b>Large, Mega and Ultra Mega scheme</b> – Resolution No. IMD/WRT/e-file/9/2026/2320/I, 8 September 2026, for machinery above ₹125 Cr.</li>
      </ul>
      <p className="sub wide mt">2020 comparison figures come from the MSME scheme under Gujarat Industrial Policy 2020 as published by the MSME Commissionerate. This page is an independent planning aid, not an official publication. Confirm every figure against the resolution before relying on it, because the sanctioning authority's assessment decides any claim.</p>
    </Block>
  );
}
