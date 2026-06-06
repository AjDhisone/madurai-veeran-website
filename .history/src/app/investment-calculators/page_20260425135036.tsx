"use client";

import { useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/sections';

type CalculatorKey = 'sip' | 'lumpsum' | 'goalSip' | 'fd' | 'swp' | 'ppf';
type SliderUnit = 'inr' | 'percent' | 'years' | 'count';

type SummaryView = {
  centerLabel: string;
  centerValue: number;
  investedLabel: string;
  investedValue: number;
  gainLabel: string;
  gainValue: number;
  finalLabel: string;
  finalValue: number;
  note?: string;
};

const tabs: Array<{
  key: CalculatorKey;
  label: string;
  title: string;
  description: string;
  centerLabel: string;
  finalLabel: string;
}> = [
  {
    key: 'sip',
    label: 'SIP',
    title: 'SIP Calculator',
    description: 'See how a monthly SIP can grow over time.',
    centerLabel: 'MATURITY',
    finalLabel: 'Maturity value',
  },
  {
    key: 'lumpsum',
    label: 'Lumpsum',
    title: 'Lumpsum Calculator',
    description: 'Estimate the future value of your one-time investment.',
    centerLabel: 'MATURITY',
    finalLabel: 'Maturity value',
  },
  {
    key: 'goalSip',
    label: 'Goal SIP',
    title: 'Goal SIP Calculator',
    description: 'Find the monthly SIP needed to reach your target corpus.',
    centerLabel: 'TARGET',
    finalLabel: 'Target corpus',
  },
  {
    key: 'fd',
    label: 'FD',
    title: 'FD Calculator',
    description: 'Project fixed deposit maturity with compounding assumptions.',
    centerLabel: 'MATURITY',
    finalLabel: 'Maturity value',
  },
  {
    key: 'swp',
    label: 'SWP',
    title: 'SWP Calculator',
    description: 'Estimate corpus sustainability under monthly withdrawals.',
    centerLabel: 'TOTAL VALUE',
    finalLabel: 'Projected total value',
  },
  {
    key: 'ppf',
    label: 'PPF',
    title: 'PPF Calculator',
    description: 'Project long-term value of yearly PPF contributions.',
    centerLabel: 'MATURITY',
    finalLabel: 'Maturity value',
  },
];

const formatINR = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? Math.max(value, 0) : 0);

const safeNumber = (value: number, min = 0) =>
  Number.isFinite(value) ? Math.max(value, min) : min;

const clampValue = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const parseNumericInput = (value: string, fallback: number) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const formatScale = (value: number, unit: SliderUnit) => {
  if (unit === 'inr') return formatINR(value);
  if (unit === 'percent') return `${value}%`;
  if (unit === 'years') return `${value} Yr`;
  return `${value}`;
};

const formatSuffix = (unit: SliderUnit) => {
  if (unit === 'inr') return 'INR';
  if (unit === 'percent') return '%';
  if (unit === 'years') return 'Yr';
  return '';
};

const SliderControl = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit: SliderUnit;
}) => {
  const suffix = formatSuffix(unit);

  return (
    <div className="investment-control">
      <div className="investment-control-head">
        <p className="investment-control-label">{label}</p>

        <div className="investment-control-box" role="group" aria-label={`${label} value`}>
          {unit === 'inr' ? <span className="investment-control-prefix">INR</span> : null}
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(event) =>
              onChange(clampValue(parseNumericInput(event.target.value, value), min, max))
            }
            className="investment-control-input"
          />
          {unit !== 'inr' && suffix ? <span className="investment-control-suffix">{suffix}</span> : null}
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number.parseFloat(event.target.value))}
        className="investment-control-range"
      />

      <div className="investment-control-scale">
        <span>{formatScale(min, unit)}</span>
        <span>{formatScale(max, unit)}</span>
      </div>
    </div>
  );
};

const SummaryCard = ({ summary }: { summary: SummaryView }) => {
  const totalBase = Math.max(
    summary.finalValue,
    summary.investedValue + summary.gainValue,
    1,
  );
  const gainRatio = clampValue(summary.gainValue / totalBase, 0, 1);
  const gainDegrees = gainRatio * 360;

  return (
    <aside className="investment-summary-panel" aria-live="polite">
      <div
        className="investment-gauge-ring"
        style={{
          background: `conic-gradient(var(--investment-navy) 0deg ${gainDegrees}deg, var(--investment-ring-rest) ${gainDegrees}deg 360deg)`,
        }}
      >
        <div className="investment-gauge-center">
          <p>{summary.centerLabel}</p>
          <strong>{formatINR(summary.centerValue)}</strong>
        </div>
      </div>

      <div className="investment-summary-rows">
        <div className="investment-summary-row">
          <p>
            <span className="investment-dot is-light" />
            {summary.investedLabel}
          </p>
          <strong>{formatINR(summary.investedValue)}</strong>
        </div>

        <div className="investment-summary-row">
          <p>
            <span className="investment-dot is-dark" />
            {summary.gainLabel}
          </p>
          <strong>{formatINR(summary.gainValue)}</strong>
        </div>

        <div className="investment-summary-row is-total">
          <p>{summary.finalLabel}</p>
          <strong>{formatINR(summary.finalValue)}</strong>
        </div>
      </div>

      {summary.note ? <p className="investment-inline-note">{summary.note}</p> : null}
    </aside>
  );
};

const CalculatorPage = () => {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorKey>('sip');

  const [sipForm, setSipForm] = useState({
    monthlyInvestment: 5000,
    annualReturn: 12,
    years: 20,
  });

  const [lumpsumForm, setLumpsumForm] = useState({
    amount: 100000,
    annualReturn: 12,
    years: 10,
  });

  const [goalSipForm, setGoalSipForm] = useState({
    targetAmount: 10000000,
    annualReturn: 12,
    years: 20,
  });

  const [fdForm, setFdForm] = useState({
    principal: 500000,
    annualRate: 7,
    years: 5,
    compoundsPerYear: 4,
  });

  const [swpForm, setSwpForm] = useState({
    corpus: 5000000,
    annualReturn: 8,
    monthlyWithdrawal: 30000,
    years: 20,
  });

  const [ppfForm, setPpfForm] = useState({
    yearlyContribution: 150000,
    annualReturn: 7.1,
    years: 15,
  });

  const sipResult = useMemo(() => {
    const monthlyInvestment = safeNumber(sipForm.monthlyInvestment);
    const annualReturn = safeNumber(sipForm.annualReturn);
    const years = safeNumber(sipForm.years);

    const monthlyRate = annualReturn / 12 / 100;
    const months = Math.round(years * 12);
    const totalInvested = monthlyInvestment * months;

    const maturity =
      monthlyRate === 0
        ? totalInvested
        : monthlyInvestment *
          ((((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate));

    return {
      totalInvested,
      maturity,
      wealthGained: maturity - totalInvested,
    };
  }, [sipForm]);

  const lumpsumResult = useMemo(() => {
    const amount = safeNumber(lumpsumForm.amount);
    const annualReturn = safeNumber(lumpsumForm.annualReturn);
    const years = safeNumber(lumpsumForm.years);

    const maturity = amount * (1 + annualReturn / 100) ** years;

    return {
      investedAmount: amount,
      maturity,
      wealthGained: maturity - amount,
    };
  }, [lumpsumForm]);

  const goalSipResult = useMemo(() => {
    const targetAmount = safeNumber(goalSipForm.targetAmount);
    const annualReturn = safeNumber(goalSipForm.annualReturn);
    const years = safeNumber(goalSipForm.years);

    const monthlyRate = annualReturn / 12 / 100;
    const months = Math.round(years * 12);

    const sipFactor =
      monthlyRate === 0
        ? months
        : (((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate);

    const requiredMonthlySIP = sipFactor > 0 ? targetAmount / sipFactor : 0;
    const investedAmount = requiredMonthlySIP * months;

    return {
      requiredMonthlySIP,
      investedAmount,
      targetAmount,
      wealthGained: targetAmount - investedAmount,
    };
  }, [goalSipForm]);

  const fdResult = useMemo(() => {
    const principal = safeNumber(fdForm.principal);
    const annualRate = safeNumber(fdForm.annualRate);
    const years = safeNumber(fdForm.years);
    const compoundsPerYear = Math.max(
      1,
      Math.round(safeNumber(fdForm.compoundsPerYear, 1)),
    );

    const maturity =
      principal *
      (1 + annualRate / 100 / compoundsPerYear) ** (compoundsPerYear * years);

    return {
      principal,
      maturity,
      interestEarned: maturity - principal,
    };
  }, [fdForm]);

  const swpResult = useMemo(() => {
    const initialCorpus = safeNumber(swpForm.corpus);
    const annualReturn = safeNumber(swpForm.annualReturn);
    const monthlyWithdrawal = safeNumber(swpForm.monthlyWithdrawal);
    const years = safeNumber(swpForm.years);

    const months = Math.round(years * 12);
    const monthlyRate = annualReturn / 12 / 100;

    let corpus = initialCorpus;
    let depletedAtMonth: number | null = null;

    for (let month = 1; month <= months; month += 1) {
      corpus = corpus * (1 + monthlyRate) - monthlyWithdrawal;
      if (corpus <= 0) {
        depletedAtMonth = month;
        corpus = 0;
        break;
      }
    }

    const totalWithdrawn = monthlyWithdrawal * (depletedAtMonth ?? months);
    const projectedTotalValue = totalWithdrawn + corpus;

    return {
      finalCorpus: corpus,
      totalWithdrawn,
      projectedTotalValue,
      gainValue: projectedTotalValue - initialCorpus,
      depletedAtMonth,
    };
  }, [swpForm]);

  const ppfResult = useMemo(() => {
    const yearlyContribution = safeNumber(ppfForm.yearlyContribution);
    const annualReturn = safeNumber(ppfForm.annualReturn);
    const years = Math.max(1, Math.round(safeNumber(ppfForm.years, 1)));

    const cappedContribution = Math.min(yearlyContribution, 150000);
    const rate = annualReturn / 100;

    const maturity =
      rate === 0
        ? cappedContribution * years
        : cappedContribution * ((((1 + rate) ** years - 1) / rate) * (1 + rate));

    const investedAmount = cappedContribution * years;

    return {
      cappedContribution,
      investedAmount,
      maturity,
      wealthGained: maturity - investedAmount,
      isContributionCapped: yearlyContribution > 150000,
    };
  }, [ppfForm]);

  const activeTab = tabs.find((tab) => tab.key === activeCalculator) ?? tabs[0];

  const summary: SummaryView = useMemo(() => {
    if (activeCalculator === 'sip') {
      return {
        centerLabel: activeTab.centerLabel,
        centerValue: sipResult.maturity,
        investedLabel: 'Total invested',
        investedValue: sipResult.totalInvested,
        gainLabel: 'Wealth gain',
        gainValue: sipResult.wealthGained,
        finalLabel: activeTab.finalLabel,
        finalValue: sipResult.maturity,
      };
    }

    if (activeCalculator === 'lumpsum') {
      return {
        centerLabel: activeTab.centerLabel,
        centerValue: lumpsumResult.maturity,
        investedLabel: 'Total invested',
        investedValue: lumpsumResult.investedAmount,
        gainLabel: 'Wealth gain',
        gainValue: lumpsumResult.wealthGained,
        finalLabel: activeTab.finalLabel,
        finalValue: lumpsumResult.maturity,
      };
    }

    if (activeCalculator === 'goalSip') {
      return {
        centerLabel: activeTab.centerLabel,
        centerValue: goalSipResult.targetAmount,
        investedLabel: 'SIP invested',
        investedValue: goalSipResult.investedAmount,
        gainLabel: 'Expected growth',
        gainValue: goalSipResult.wealthGained,
        finalLabel: activeTab.finalLabel,
        finalValue: goalSipResult.targetAmount,
      };
    }

    if (activeCalculator === 'fd') {
      return {
        centerLabel: activeTab.centerLabel,
        centerValue: fdResult.maturity,
        investedLabel: 'Principal',
        investedValue: fdResult.principal,
        gainLabel: 'Interest earned',
        gainValue: fdResult.interestEarned,
        finalLabel: activeTab.finalLabel,
        finalValue: fdResult.maturity,
      };
    }

    if (activeCalculator === 'swp') {
      return {
        centerLabel: activeTab.centerLabel,
        centerValue: swpResult.projectedTotalValue,
        investedLabel: 'Initial corpus',
        investedValue: swpForm.corpus,
        gainLabel: 'Net growth',
        gainValue: swpResult.gainValue,
        finalLabel: activeTab.finalLabel,
        finalValue: swpResult.projectedTotalValue,
        note: swpResult.depletedAtMonth
          ? `Corpus may deplete in month ${swpResult.depletedAtMonth}.`
          : undefined,
      };
    }

    return {
      centerLabel: activeTab.centerLabel,
      centerValue: ppfResult.maturity,
      investedLabel: 'Total invested',
      investedValue: ppfResult.investedAmount,
      gainLabel: 'Wealth gain',
      gainValue: ppfResult.wealthGained,
      finalLabel: activeTab.finalLabel,
      finalValue: ppfResult.maturity,
      note: ppfResult.isContributionCapped
        ? 'PPF yearly contribution is capped at INR 1,50,000.'
        : undefined,
    };
  }, [
    activeCalculator,
    activeTab.centerLabel,
    activeTab.finalLabel,
    fdResult.interestEarned,
    fdResult.maturity,
    fdResult.principal,
    goalSipResult.investedAmount,
    goalSipResult.targetAmount,
    goalSipResult.wealthGained,
    lumpsumResult.investedAmount,
    lumpsumResult.maturity,
    lumpsumResult.wealthGained,
    ppfResult.investedAmount,
    ppfResult.isContributionCapped,
    ppfResult.maturity,
    ppfResult.wealthGained,
    sipResult.maturity,
    sipResult.totalInvested,
    sipResult.wealthGained,
    swpForm.corpus,
    swpResult.depletedAtMonth,
    swpResult.gainValue,
    swpResult.projectedTotalValue,
  ]);

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="main-wrapper investment-main">
        <section className="padding-global">
          <div className="container-large investment-shell">
            <div className="investment-card">
              <div className="investment-tab-row" role="tablist" aria-label="Investment calculators">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    role="tab"
                    aria-selected={tab.key === activeCalculator}
                    className={`investment-tab ${tab.key === activeCalculator ? 'is-active' : ''}`}
                    onClick={() => setActiveCalculator(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="investment-content">
                <div className="investment-left-panel">
                  <h1 className="investment-title">{activeTab.title}</h1>
                  <p className="investment-subtitle">{activeTab.description}</p>

                  <div className="investment-controls-stack">
                    {activeCalculator === 'sip' ? (
                      <>
                        <SliderControl
                          label="Monthly SIP amount"
                          value={sipForm.monthlyInvestment}
                          onChange={(value) =>
                            setSipForm((prev) => ({ ...prev, monthlyInvestment: value }))
                          }
                          min={500}
                          max={100000}
                          step={500}
                          unit="inr"
                        />
                        <SliderControl
                          label="Expected annual return"
                          value={sipForm.annualReturn}
                          onChange={(value) =>
                            setSipForm((prev) => ({ ...prev, annualReturn: value }))
                          }
                          min={1}
                          max={30}
                          step={0.1}
                          unit="percent"
                        />
                        <SliderControl
                          label="Time horizon"
                          value={sipForm.years}
                          onChange={(value) => setSipForm((prev) => ({ ...prev, years: value }))}
                          min={1}
                          max={40}
                          step={1}
                          unit="years"
                        />
                      </>
                    ) : null}

                    {activeCalculator === 'lumpsum' ? (
                      <>
                        <SliderControl
                          label="Lumpsum amount"
                          value={lumpsumForm.amount}
                          onChange={(value) =>
                            setLumpsumForm((prev) => ({ ...prev, amount: value }))
                          }
                          min={10000}
                          max={50000000}
                          step={5000}
                          unit="inr"
                        />
                        <SliderControl
                          label="Expected annual return"
                          value={lumpsumForm.annualReturn}
                          onChange={(value) =>
                            setLumpsumForm((prev) => ({ ...prev, annualReturn: value }))
                          }
                          min={1}
                          max={30}
                          step={0.1}
                          unit="percent"
                        />
                        <SliderControl
                          label="Time horizon"
                          value={lumpsumForm.years}
                          onChange={(value) =>
                            setLumpsumForm((prev) => ({ ...prev, years: value }))
                          }
                          min={1}
                          max={40}
                          step={1}
                          unit="years"
                        />
                      </>
                    ) : null}

                    {activeCalculator === 'goalSip' ? (
                      <>
                        <SliderControl
                          label="Target corpus"
                          value={goalSipForm.targetAmount}
                          onChange={(value) =>
                            setGoalSipForm((prev) => ({ ...prev, targetAmount: value }))
                          }
                          min={100000}
                          max={100000000}
                          step={10000}
                          unit="inr"
                        />
                        <SliderControl
                          label="Expected annual return"
                          value={goalSipForm.annualReturn}
                          onChange={(value) =>
                            setGoalSipForm((prev) => ({ ...prev, annualReturn: value }))
                          }
                          min={1}
                          max={30}
                          step={0.1}
                          unit="percent"
                        />
                        <SliderControl
                          label="Time to target"
                          value={goalSipForm.years}
                          onChange={(value) =>
                            setGoalSipForm((prev) => ({ ...prev, years: value }))
                          }
                          min={1}
                          max={40}
                          step={1}
                          unit="years"
                        />
                      </>
                    ) : null}

                    {activeCalculator === 'fd' ? (
                      <>
                        <SliderControl
                          label="Principal"
                          value={fdForm.principal}
                          onChange={(value) => setFdForm((prev) => ({ ...prev, principal: value }))}
                          min={10000}
                          max={50000000}
                          step={5000}
                          unit="inr"
                        />
                        <SliderControl
                          label="Annual interest rate"
                          value={fdForm.annualRate}
                          onChange={(value) => setFdForm((prev) => ({ ...prev, annualRate: value }))}
                          min={1}
                          max={12}
                          step={0.1}
                          unit="percent"
                        />
                        <SliderControl
                          label="FD tenure"
                          value={fdForm.years}
                          onChange={(value) => setFdForm((prev) => ({ ...prev, years: value }))}
                          min={1}
                          max={30}
                          step={1}
                          unit="years"
                        />
                        <SliderControl
                          label="Compounding / year"
                          value={fdForm.compoundsPerYear}
                          onChange={(value) =>
                            setFdForm((prev) => ({ ...prev, compoundsPerYear: Math.round(value) }))
                          }
                          min={1}
                          max={12}
                          step={1}
                          unit="count"
                        />
                      </>
                    ) : null}

                    {activeCalculator === 'swp' ? (
                      <>
                        <SliderControl
                          label="Initial corpus"
                          value={swpForm.corpus}
                          onChange={(value) => setSwpForm((prev) => ({ ...prev, corpus: value }))}
                          min={100000}
                          max={100000000}
                          step={10000}
                          unit="inr"
                        />
                        <SliderControl
                          label="Expected annual return"
                          value={swpForm.annualReturn}
                          onChange={(value) =>
                            setSwpForm((prev) => ({ ...prev, annualReturn: value }))
                          }
                          min={1}
                          max={20}
                          step={0.1}
                          unit="percent"
                        />
                        <SliderControl
                          label="Monthly withdrawal"
                          value={swpForm.monthlyWithdrawal}
                          onChange={(value) =>
                            setSwpForm((prev) => ({ ...prev, monthlyWithdrawal: value }))
                          }
                          min={1000}
                          max={500000}
                          step={500}
                          unit="inr"
                        />
                        <SliderControl
                          label="Withdrawal period"
                          value={swpForm.years}
                          onChange={(value) => setSwpForm((prev) => ({ ...prev, years: value }))}
                          min={1}
                          max={40}
                          step={1}
                          unit="years"
                        />
                      </>
                    ) : null}

                    {activeCalculator === 'ppf' ? (
                      <>
                        <SliderControl
                          label="Yearly contribution"
                          value={ppfForm.yearlyContribution}
                          onChange={(value) =>
                            setPpfForm((prev) => ({ ...prev, yearlyContribution: value }))
                          }
                          min={500}
                          max={150000}
                          step={500}
                          unit="inr"
                        />
                        <SliderControl
                          label="Expected annual return"
                          value={ppfForm.annualReturn}
                          onChange={(value) => setPpfForm((prev) => ({ ...prev, annualReturn: value }))}
                          min={1}
                          max={12}
                          step={0.1}
                          unit="percent"
                        />
                        <SliderControl
                          label="PPF tenure"
                          value={ppfForm.years}
                          onChange={(value) => setPpfForm((prev) => ({ ...prev, years: value }))}
                          min={1}
                          max={30}
                          step={1}
                          unit="years"
                        />
                      </>
                    ) : null}
                  </div>
                </div>

                <SummaryCard summary={summary} />
              </div>

              <div className="investment-disclaimer-bar">
                <span className="investment-disclaimer-icon">i</span>
                <p>
                  These are indicative projections based on fixed return assumptions. Actual returns,
                  taxes, charges, and scheme rules can differ.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CalculatorPage;
