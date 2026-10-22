// MSME incentive calculation (Viksit Gujarat Industrial Policy 2026, MSME scheme GR of 25 Sep 2026).
// Money in Rs crore. Verified against the reference estimator by compare.js.

export const SLABS = {
  'general-A': { capital: 35, interestCap: 10, powerCap: 25, overall: 45, annualSm: 9, micro1: 37, microN: 2, powerPerUnit: 2 },
  'general-B': { capital: 25, interestCap: 10, powerCap: 25, overall: 35, annualSm: 7, micro1: 27, microN: 2, powerPerUnit: 1 },
  'selected-A': { capital: 35, interestCap: 20, powerCap: 20, overall: 50, annualSm: 10, micro1: 38, microN: 3, powerPerUnit: 2 },
  'selected-B': { capital: 30, interestCap: 20, powerCap: 20, overall: 45, annualSm: 9, micro1: 33, microN: 3, powerPerUnit: 1 },
};
export const YEARS = 5;
const BASE_INTEREST_PCT = 7;
const MIN_UNIT_BEARS_PCT = 2;
export const EPF_CAP = { male: 1800, female: 2500, disabled: 3000 }; // Rs per employee per month

export const classify = (pm) => (pm <= 2.5 ? 'micro' : pm <= 25 ? 'small' : pm <= 125 ? 'medium' : 'large');

export const SIZE_LABEL = { micro: 'Micro enterprise', small: 'Small enterprise', medium: 'Medium enterprise' };

export function calcMsme(i) {
  const size = classify(i.plantMachineryCr);
  if (size === 'large') return { size, eligible: false };
  const s = SLABS[`${i.sector}-${i.category}`];
  const efci = Math.max(0, i.efciCr);

  const overallPct = s.overall + (i.scst ? 5 : 0);
  const overallCap = (overallPct / 100) * efci;
  const interestCap = (s.interestCap / 100) * efci;
  const powerCap = (s.powerCap / 100) * efci;
  const capitalTotal = (s.capital / 100) * efci;
  const capYears = size === 'micro' ? 1 : YEARS;
  const plusOne = !!(i.womanOwned || i.firstGenOrStartup);
  const ratePct = BASE_INTEREST_PCT + (plusOne ? 1 : 0);
  const subsidyRate = Math.max(0, Math.min(ratePct, i.loanRatePct - MIN_UNIT_BEARS_PCT));
  const powerPerYear = (i.annualPowerLakhUnits * s.powerPerUnit) / 100;
  const annualPct = (y) => (size === 'micro' ? (y === 1 ? s.micro1 : s.microN) : s.annualSm);

  const loan = Math.max(0, i.termLoanCr);
  const tenure = Math.max(1, i.loanTenureYears);
  const morat = Math.max(0, i.moratoriumYears);

  const rows = [];
  let cumInterest = 0, cumPower = 0, cumAllowed = 0, rawTotal = 0;
  for (let y = 1; y <= YEARS; y++) {
    const open = loan * Math.max(0, 1 - Math.max(0, y - 1 - morat) / tenure);
    const close = loan * Math.max(0, 1 - Math.max(0, y - morat) / tenure);
    const interest = Math.min(((open + close) / 2) * (subsidyRate / 100), Math.max(0, interestCap - cumInterest));
    const power = Math.min(powerPerYear, Math.max(0, powerCap - cumPower));
    const capital = y <= capYears ? capitalTotal / capYears : 0;
    const raw = capital + interest + power;
    rawTotal += raw;

    const pct = annualPct(y);
    const annualCap = (pct / 100) * efci;
    const overallLeft = Math.max(0, overallCap - cumAllowed);
    const room = Math.min(annualCap, overallLeft);
    const aCap = Math.min(capital, room);
    const aInt = Math.min(interest, room - aCap);
    const aPow = Math.min(power, room - aCap - aInt);
    const allowed = aCap + aInt + aPow;
    cumInterest += aInt; cumPower += aPow; cumAllowed += allowed;
    const binding = allowed + 1e-12 < raw ? (overallLeft < annualCap ? 'overall' : 'annual') : 'none';
    rows.push({ year: y, capital: aCap, interest: aInt, power: aPow, raw, annualCap, annualPct: pct, allowed, cumulative: cumAllowed, binding });
  }

  const epfPer = {
    male: Math.min(0.12 * i.avgBasicDA, EPF_CAP.male),
    female: Math.min(0.12 * i.avgBasicDA, EPF_CAP.female),
    disabled: Math.min(0.12 * i.avgBasicDA, EPF_CAP.disabled),
  };
  const epfAnnual = ((epfPer.male * i.employeesMale + epfPer.female * i.employeesFemale + epfPer.disabled * i.employeesDisabled) * 12) / 1e7;
  const sum = (k) => rows.reduce((a, r) => a + r[k], 0);
  const totals = { capital: sum('capital'), interest: sum('interest'), power: sum('power'), combined: cumAllowed, uncapped: rawTotal };

  return {
    size, eligible: true, slab: s, rows, totals, overallPct, overallCap, interestCap, powerCap, subsidyRate, plusOne, loan, efci,
    epf: { annual: epfAnnual, total: epfAnnual * YEARS, perEmployeeMonthly: epfPer },
    grandTotal: cumAllowed + epfAnnual * YEARS,
    effectivePct: efci > 0 ? (cumAllowed / efci) * 100 : 0,
    lost: rawTotal - cumAllowed,
  };
}

// ---- formatting (Indian digit grouping; Cr / lakh / rupee scale)
export const fmt = (n, d = 0) => n.toLocaleString('en-IN', { maximumFractionDigits: d, minimumFractionDigits: d });
export function money(cr) {
  if (!isFinite(cr) || cr === 0) return '₹0';
  if (Math.abs(cr) < 0.01) return `₹${fmt(cr * 1e7, 0)}`;
  if (Math.abs(cr) < 1) return `₹${fmt(cr * 100, 1)} L`;
  return `₹${fmt(cr, 2)} Cr`;
}
