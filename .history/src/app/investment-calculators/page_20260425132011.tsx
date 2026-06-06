"use client";

import { useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/sections';

type CalculatorKey = 'sip' | 'lumpsum' | 'goalSip' | 'fd' | 'swp' | 'ppf';

const formatINR = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? Math.max(value, 0) : 0);

const safeNumber = (value: number, min = 0) =>
  Number.isFinite(value) ? Math.max(value, min) : min;

const parseNumericInput = (value: string, fallback: number) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const NumericField = ({
  label,
  value,
  onChange,
  min = 0,
  step = 1,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: number;
  suffix?: string;
}) => (
  <label className="investment-field">
    <span className="investment-field-label">{label}</span>
    <div className="investment-field-input-wrap">
      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(event) => onChange(parseNumericInput(event.target.value, min))}
        className="investment-field-input"
      />
      {suffix ? <span className="investment-field-suffix">{suffix}</span> : null}
    </div>
  </label>
);

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
    };
  }, [goalSipForm]);

  const fdResult = useMemo(() => {
    const principal = safeNumber(fdForm.principal);
    const annualRate = safeNumber(fdForm.annualRate);
    const years = safeNumber(fdForm.years);
    const compoundsPerYear = Math.max(1, Math.round(safeNumber(fdForm.compoundsPerYear, 1)));

    const maturity = principal * (1 + annualRate / 100 / compoundsPerYear) ** (compoundsPerYear * years);

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

    return {
      finalCorpus: corpus,
      totalWithdrawn,
      depletedAtMonth,
      projectionMonths: months,
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

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="main-wrapper investment-main">
        <section className="padding-global">
          <div className="container-large">
            <div className="investment-hero">
              <p className="investment-kicker">India Investment Lab</p>
              <h1 className="investment-title">Investment Calculators for Indian Investors</h1>
              <p className="investment-subtitle">
                Estimate SIP growth, plan goal-based investments, and project FD, SWP, and PPF outcomes in one place.
              </p>
            </div>

            <div className="investment-layout">
              <aside className="investment-tabs" aria-label="Calculator tabs">
                <button
                  type="button"
                  className={`investment-tab ${activeCalculator === 'sip' ? 'is-active' : ''}`}
                  onClick={() => setActiveCalculator('sip')}
                >
                  SIP
                </button>
                <button
                  type="button"
                  className={`investment-tab ${activeCalculator === 'lumpsum' ? 'is-active' : ''}`}
                  onClick={() => setActiveCalculator('lumpsum')}
                >
                  Lumpsum
                </button>
                <button
                  type="button"
                  className={`investment-tab ${activeCalculator === 'goalSip' ? 'is-active' : ''}`}
                  onClick={() => setActiveCalculator('goalSip')}
                >
                  Goal SIP
                </button>
                <button
                  type="button"
                  className={`investment-tab ${activeCalculator === 'fd' ? 'is-active' : ''}`}
                  onClick={() => setActiveCalculator('fd')}
                >
                  FD
                </button>
                <button
                  type="button"
                  className={`investment-tab ${activeCalculator === 'swp' ? 'is-active' : ''}`}
                  onClick={() => setActiveCalculator('swp')}
                >
                  SWP
                </button>
                <button
                  type="button"
                  className={`investment-tab ${activeCalculator === 'ppf' ? 'is-active' : ''}`}
                  onClick={() => setActiveCalculator('ppf')}
                >
                  PPF
                </button>
              </aside>

              <div className="investment-panel">
                {activeCalculator === 'sip' ? (
                  <>
                    <h2 className="investment-panel-title">SIP Calculator</h2>
                    <p className="investment-panel-copy">Monthly investment growth with annual compounding assumptions.</p>

                    <div className="investment-form-grid">
                      <NumericField
                        label="Monthly investment"
                        value={sipForm.monthlyInvestment}
                        onChange={(value) => setSipForm((prev) => ({ ...prev, monthlyInvestment: value }))}
                        suffix="INR"
                      />
                      <NumericField
                        label="Expected annual return"
                        value={sipForm.annualReturn}
                        onChange={(value) => setSipForm((prev) => ({ ...prev, annualReturn: value }))}
                        step={0.1}
                        suffix="%"
                      />
                      <NumericField
                        label="Investment period"
                        value={sipForm.years}
                        onChange={(value) => setSipForm((prev) => ({ ...prev, years: value }))}
                        step={1}
                        suffix="Years"
                      />
                    </div>

                    <div className="investment-results-grid">
                      <div className="investment-stat">
                        <span>Total Invested</span>
                        <strong>{formatINR(sipResult.totalInvested)}</strong>
                      </div>
                      <div className="investment-stat">
                        <span>Estimated Wealth Gain</span>
                        <strong>{formatINR(sipResult.wealthGained)}</strong>
                      </div>
                      <div className="investment-stat">
                        <span>Estimated Maturity</span>
                        <strong>{formatINR(sipResult.maturity)}</strong>
                      </div>
                    </div>
                  </>
                ) : null}

                {activeCalculator === 'lumpsum' ? (
                  <>
                    <h2 className="investment-panel-title">Lumpsum Calculator</h2>
                    <p className="investment-panel-copy">Project one-time investment growth over time.</p>

                    <div className="investment-form-grid">
                      <NumericField
                        label="One-time investment"
                        value={lumpsumForm.amount}
                        onChange={(value) => setLumpsumForm((prev) => ({ ...prev, amount: value }))}
                        suffix="INR"
                      />
                      <NumericField
                        label="Expected annual return"
                        value={lumpsumForm.annualReturn}
                        onChange={(value) => setLumpsumForm((prev) => ({ ...prev, annualReturn: value }))}
                        step={0.1}
                        suffix="%"
                      />
                      <NumericField
                        label="Investment period"
                        value={lumpsumForm.years}
                        onChange={(value) => setLumpsumForm((prev) => ({ ...prev, years: value }))}
                        suffix="Years"
                      />
                    </div>

                    <div className="investment-results-grid">
                      <div className="investment-stat">
                        <span>Invested Amount</span>
                        <strong>{formatINR(lumpsumResult.investedAmount)}</strong>
                      </div>
                      <div className="investment-stat">
                        <span>Estimated Wealth Gain</span>
                        <strong>{formatINR(lumpsumResult.wealthGained)}</strong>
                      </div>
                      <div className="investment-stat">
                        <span>Estimated Maturity</span>
                        <strong>{formatINR(lumpsumResult.maturity)}</strong>
                      </div>
                    </div>
                  </>
                ) : null}

                {activeCalculator === 'goalSip' ? (
                  <>
                    <h2 className="investment-panel-title">Goal SIP Calculator</h2>
                    <p className="investment-panel-copy">Find monthly SIP needed to reach your target corpus.</p>

                    <div className="investment-form-grid">
                      <NumericField
                        label="Target amount"
                        value={goalSipForm.targetAmount}
                        onChange={(value) => setGoalSipForm((prev) => ({ ...prev, targetAmount: value }))}
                        suffix="INR"
                      />
                      <NumericField
                        label="Expected annual return"
                        value={goalSipForm.annualReturn}
                        onChange={(value) => setGoalSipForm((prev) => ({ ...prev, annualReturn: value }))}
                        step={0.1}
                        suffix="%"
                      />
                      <NumericField
                        label="Years to goal"
                        value={goalSipForm.years}
                        onChange={(value) => setGoalSipForm((prev) => ({ ...prev, years: value }))}
                        suffix="Years"
                      />
                    </div>

                    <div className="investment-results-grid">
                      <div className="investment-stat">
                        <span>Required Monthly SIP</span>
                        <strong>{formatINR(goalSipResult.requiredMonthlySIP)}</strong>
                      </div>
                      <div className="investment-stat">
                        <span>Total Invested Through SIP</span>
                        <strong>{formatINR(goalSipResult.investedAmount)}</strong>
                      </div>
                      <div className="investment-stat">
                        <span>Target Corpus</span>
                        <strong>{formatINR(goalSipResult.targetAmount)}</strong>
                      </div>
                    </div>
                  </>
                ) : null}

                {activeCalculator === 'fd' ? (
                  <>
                    <h2 className="investment-panel-title">FD Calculator</h2>
                    <p className="investment-panel-copy">Estimate maturity value with custom compounding frequency.</p>

                    <div className="investment-form-grid">
                      <NumericField
                        label="Principal"
                        value={fdForm.principal}
                        onChange={(value) => setFdForm((prev) => ({ ...prev, principal: value }))}
                        suffix="INR"
                      />
                      <NumericField
                        label="Annual interest rate"
                        value={fdForm.annualRate}
                        onChange={(value) => setFdForm((prev) => ({ ...prev, annualRate: value }))}
                        step={0.1}
                        suffix="%"
                      />
                      <NumericField
                        label="FD period"
                        value={fdForm.years}
                        onChange={(value) => setFdForm((prev) => ({ ...prev, years: value }))}
                        suffix="Years"
                      />
                      <NumericField
                        label="Compounds per year"
                        value={fdForm.compoundsPerYear}
                        onChange={(value) => setFdForm((prev) => ({ ...prev, compoundsPerYear: value }))}
                        min={1}
                      />
                    </div>

                    <div className="investment-results-grid">
                      <div className="investment-stat">
                        <span>Principal</span>
                        <strong>{formatINR(fdResult.principal)}</strong>
                      </div>
                      <div className="investment-stat">
                        <span>Interest Earned</span>
                        <strong>{formatINR(fdResult.interestEarned)}</strong>
                      </div>
                      <div className="investment-stat">
                        <span>Maturity Value</span>
                        <strong>{formatINR(fdResult.maturity)}</strong>
                      </div>
                    </div>
                  </>
                ) : null}

                {activeCalculator === 'swp' ? (
                  <>
                    <h2 className="investment-panel-title">SWP Calculator</h2>
                    <p className="investment-panel-copy">Project monthly withdrawals and the remaining corpus.</p>

                    <div className="investment-form-grid">
                      <NumericField
                        label="Initial corpus"
                        value={swpForm.corpus}
                        onChange={(value) => setSwpForm((prev) => ({ ...prev, corpus: value }))}
                        suffix="INR"
                      />
                      <NumericField
                        label="Expected annual return"
                        value={swpForm.annualReturn}
                        onChange={(value) => setSwpForm((prev) => ({ ...prev, annualReturn: value }))}
                        step={0.1}
                        suffix="%"
                      />
                      <NumericField
                        label="Monthly withdrawal"
                        value={swpForm.monthlyWithdrawal}
                        onChange={(value) => setSwpForm((prev) => ({ ...prev, monthlyWithdrawal: value }))}
                        suffix="INR"
                      />
                      <NumericField
                        label="Projection period"
                        value={swpForm.years}
                        onChange={(value) => setSwpForm((prev) => ({ ...prev, years: value }))}
                        suffix="Years"
                      />
                    </div>

                    <div className="investment-results-grid">
                      <div className="investment-stat">
                        <span>Total Withdrawn</span>
                        <strong>{formatINR(swpResult.totalWithdrawn)}</strong>
                      </div>
                      <div className="investment-stat">
                        <span>Remaining Corpus</span>
                        <strong>{formatINR(swpResult.finalCorpus)}</strong>
                      </div>
                      <div className="investment-stat">
                        <span>Status</span>
                        <strong>
                          {swpResult.depletedAtMonth
                            ? `Corpus depletes in month ${swpResult.depletedAtMonth}`
                            : `Corpus lasts ${swpResult.projectionMonths} months`}
                        </strong>
                      </div>
                    </div>
                  </>
                ) : null}

                {activeCalculator === 'ppf' ? (
                  <>
                    <h2 className="investment-panel-title">PPF Calculator</h2>
                    <p className="investment-panel-copy">Estimate Public Provident Fund growth with yearly contributions.</p>

                    <div className="investment-form-grid">
                      <NumericField
                        label="Yearly contribution"
                        value={ppfForm.yearlyContribution}
                        onChange={(value) => setPpfForm((prev) => ({ ...prev, yearlyContribution: value }))}
                        suffix="INR"
                      />
                      <NumericField
                        label="Expected annual return"
                        value={ppfForm.annualReturn}
                        onChange={(value) => setPpfForm((prev) => ({ ...prev, annualReturn: value }))}
                        step={0.1}
                        suffix="%"
                      />
                      <NumericField
                        label="Duration"
                        value={ppfForm.years}
                        onChange={(value) => setPpfForm((prev) => ({ ...prev, years: value }))}
                        min={1}
                        suffix="Years"
                      />
                    </div>

                    {ppfResult.isContributionCapped ? (
                      <p className="investment-note">PPF yearly contribution is capped at INR 1,50,000 per financial year.</p>
                    ) : null}

                    <div className="investment-results-grid">
                      <div className="investment-stat">
                        <span>Total Invested</span>
                        <strong>{formatINR(ppfResult.investedAmount)}</strong>
                      </div>
                      <div className="investment-stat">
                        <span>Estimated Wealth Gain</span>
                        <strong>{formatINR(ppfResult.wealthGained)}</strong>
                      </div>
                      <div className="investment-stat">
                        <span>Maturity Value</span>
                        <strong>{formatINR(ppfResult.maturity)}</strong>
                      </div>
                    </div>
                  </>
                ) : null}

                <p className="investment-disclaimer">
                  Calculations are indicative and based on fixed return assumptions. Actual returns, taxes, and scheme rules may vary.
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
