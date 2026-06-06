"use client";

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/sections';
import { calculatorsConfig, SliderUnit, SummaryView } from '@/utils/calculatorsConfig';

const formatINR = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.max(0, value));

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
          background: `conic-gradient(#000000 0deg ${gainDegrees}deg, var(--investment-ring-rest) ${gainDegrees}deg 360deg)`,
        }}
      >
        <div className="investment-gauge-center">
          <p>{summary.centerLabel}</p>
          <strong>
            {summary.centerLabel.toLowerCase().includes('rate') 
              ? `${summary.centerValue.toFixed(2)}%` 
              : formatINR(summary.centerValue)}
          </strong>
        </div>
      </div>

      <div className="investment-summary-rows">
        {summary.rows.map((row, index) => (
          <div key={index} className={`investment-summary-row ${index === summary.rows.length - 1 ? 'is-total' : ''}`}>
            <p>
              {index === 0 && <span className="investment-dot is-light" />}
              {index === 1 && <span className="investment-dot is-dark" />}
              {row.label}
            </p>
            <strong>{row.value}</strong>
          </div>
        ))}
      </div>

      {summary.note ? <p className="investment-inline-note">{summary.note}</p> : null}
    </aside>
  );
};

const CalculatorClient = ({ slug }: { slug: string }) => {
  const router = useRouter();

  const calc = calculatorsConfig[slug];

  // Initialize form state dynamically from config defaultValues
  const [formValues, setFormValues] = useState<Record<string, number>>(() => {
    if (!calc) return {};
    const defaults: Record<string, number> = {};
    calc.inputs.forEach((input) => {
      defaults[input.key] = input.defaultValue;
    });
    return defaults;
  });

  const handleValueChange = (key: string, val: number) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const summary = useMemo(() => {
    if (!calc) return null;
    return calc.calculate(formValues);
  }, [calc, formValues]);

  if (!calc || !summary) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <main className="main-wrapper investment-main" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
          <h1 className="display_xl-class" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            Calculator Not Found
          </h1>
          <p style={{ color: '#666666', marginBottom: '2rem' }}>
            The financial calculator you are looking for does not exist or has been moved.
          </p>
          <button
            onClick={() => router.push('/investment-calculators')}
            className="investment-tab is-active"
            style={{ padding: '0.75rem 1.5rem', cursor: 'pointer' }}
          >
            Back to Calculators
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="main-wrapper investment-main">
        <section className="padding-global">
          <div className="container-large investment-shell">
            
            {/* Back Button Navigation */}
            <div style={{ marginBottom: '2rem' }}>
              <Link
                href="/investment-calculators"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  color: '#000000',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  border: '1px solid #000000',
                  padding: '0.45rem 1rem',
                  borderRadius: '999px',
                  transition: 'all 180ms ease'
                }}
                className="calculator-back-btn"
              >
                ← Back to Calculators
              </Link>
            </div>

            <div className="investment-card">
              <div className="investment-content">
                <div className="investment-left-panel">
                  <h1 className="investment-title">{calc.title}</h1>
                  <p className="investment-subtitle">{calc.description}</p>

                  <div className="investment-controls-stack">
                    {calc.inputs.map((input) => (
                      <SliderControl
                        key={input.key}
                        label={input.label}
                        value={formValues[input.key] ?? input.defaultValue}
                        min={input.min}
                        max={input.max}
                        step={input.step}
                        unit={input.unit}
                        onChange={(val) => handleValueChange(input.key, val)}
                      />
                    ))}
                  </div>
                </div>

                <SummaryCard summary={summary} />
              </div>

              <div className="investment-disclaimer-bar">
                <span className="investment-disclaimer-icon">i</span>
                <p>
                  These are indicative calculations based on standard parameters for the Indian market. Actual returns, taxes, charges, and regulations can differ.
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

export default CalculatorClient;
