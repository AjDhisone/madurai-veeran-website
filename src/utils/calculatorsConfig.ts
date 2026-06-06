export type CalculatorCategory = 'investment' | 'loan' | 'tax' | 'retirement' | 'banking';
export type SliderUnit = 'inr' | 'percent' | 'years' | 'months' | 'count' | 'number';

export interface SliderInput {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: SliderUnit;
}

export interface SummaryRow {
  label: string;
  value: string;
}

export interface SummaryView {
  centerLabel: string;
  centerValue: number;
  rows: SummaryRow[];
  investedValue: number;
  gainValue: number;
  finalValue: number;
  note?: string;
}

export interface CalculatorConfig {
  slug: string;
  title: string;
  description: string;
  category: CalculatorCategory;
  isPopular: boolean;
  inputs: SliderInput[];
  calculate: (inputs: Record<string, number>) => SummaryView;
}

const formatINR = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.max(0, value));

export const calculatorsConfig: Record<string, CalculatorConfig> = {
  sip: {
    slug: 'sip',
    title: 'SIP Calculator',
    description: 'Calculate how much you need to save or how much you will accumulate with your SIP.',
    category: 'investment',
    isPopular: true,
    inputs: [
      { key: 'monthlyInvestment', label: 'Monthly SIP amount', min: 500, max: 100000, step: 500, defaultValue: 5000, unit: 'inr' },
      { key: 'annualReturn', label: 'Expected annual return', min: 1, max: 30, step: 0.1, defaultValue: 12, unit: 'percent' },
      { key: 'years', label: 'Time horizon', min: 1, max: 40, step: 1, defaultValue: 20, unit: 'years' },
    ],
    calculate: (inputs) => {
      const p = inputs.monthlyInvestment;
      const r = inputs.annualReturn / 12 / 100;
      const n = inputs.years * 12;
      const invested = p * n;
      const finalVal = r === 0 ? invested : p * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
      return {
        centerLabel: 'MATURITY',
        centerValue: finalVal,
        investedValue: invested,
        gainValue: finalVal - invested,
        finalValue: finalVal,
        rows: [
          { label: 'Total Invested', value: formatINR(invested) },
          { label: 'Estimated Returns', value: formatINR(finalVal - invested) },
          { label: 'Maturity Value', value: formatINR(finalVal) },
        ],
      };
    },
  },
  lumpsum: {
    slug: 'lumpsum',
    title: 'Lumpsum Calculator',
    description: 'Calculate returns for lumpsum investments to achieve your financial goals.',
    category: 'investment',
    isPopular: true,
    inputs: [
      { key: 'amount', label: 'Total investment amount', min: 5000, max: 10000000, step: 5000, defaultValue: 100000, unit: 'inr' },
      { key: 'annualReturn', label: 'Expected annual return', min: 1, max: 30, step: 0.1, defaultValue: 12, unit: 'percent' },
      { key: 'years', label: 'Time horizon', min: 1, max: 40, step: 1, defaultValue: 10, unit: 'years' },
    ],
    calculate: (inputs) => {
      const p = inputs.amount;
      const r = inputs.annualReturn / 100;
      const t = inputs.years;
      const finalVal = p * Math.pow(1 + r, t);
      return {
        centerLabel: 'MATURITY',
        centerValue: finalVal,
        investedValue: p,
        gainValue: finalVal - p,
        finalValue: finalVal,
        rows: [
          { label: 'Invested Amount', value: formatINR(p) },
          { label: 'Estimated Returns', value: formatINR(finalVal - p) },
          { label: 'Total Value', value: formatINR(finalVal) },
        ],
      };
    },
  },
  swp: {
    slug: 'swp',
    title: 'SWP Calculator',
    description: 'Calculate your final balance and cash withdrawals with Systematic Withdrawal Plans (SWP).',
    category: 'investment',
    isPopular: true,
    inputs: [
      { key: 'corpus', label: 'Total investment (corpus)', min: 50000, max: 50000000, step: 10000, defaultValue: 1000000, unit: 'inr' },
      { key: 'withdrawal', label: 'Monthly withdrawal amount', min: 500, max: 200000, step: 500, defaultValue: 10000, unit: 'inr' },
      { key: 'annualReturn', label: 'Expected annual return', min: 1, max: 25, step: 0.1, defaultValue: 8, unit: 'percent' },
      { key: 'years', label: 'Time period', min: 1, max: 40, step: 1, defaultValue: 15, unit: 'years' },
    ],
    calculate: (inputs) => {
      const initial = inputs.corpus;
      const w = inputs.withdrawal;
      const r = inputs.annualReturn / 12 / 100;
      const n = inputs.years * 12;
      let balance = initial;
      let totalWithdrawn = 0;
      let monthsRun = 0;
      for (let i = 0; i < n; i++) {
        if (balance <= 0) break;
        balance = balance * (1 + r) - w;
        totalWithdrawn += w;
        monthsRun++;
      }
      if (balance < 0) balance = 0;
      const finalVal = balance + totalWithdrawn;
      return {
        centerLabel: 'FINAL BALANCE',
        centerValue: balance,
        investedValue: initial,
        gainValue: Math.max(0, finalVal - initial),
        finalValue: finalVal,
        note: monthsRun < n ? `Corpus will deplete in ${Math.floor(monthsRun / 12)} Yr ${monthsRun % 12} Mo.` : undefined,
        rows: [
          { label: 'Initial Investment', value: formatINR(initial) },
          { label: 'Total Withdrawal', value: formatINR(totalWithdrawn) },
          { label: 'Final Balance', value: formatINR(balance) },
        ],
      };
    },
  },
  'mutual-fund': {
    slug: 'mutual-fund',
    title: 'Mutual Fund Calculator',
    description: 'Calculate the returns on your mutual fund investments easily.',
    category: 'investment',
    isPopular: true,
    inputs: [
      { key: 'monthlyInvestment', label: 'Monthly SIP amount', min: 500, max: 100000, step: 500, defaultValue: 5000, unit: 'inr' },
      { key: 'annualReturn', label: 'Expected annual return', min: 1, max: 30, step: 0.1, defaultValue: 12, unit: 'percent' },
      { key: 'years', label: 'Time horizon', min: 1, max: 40, step: 1, defaultValue: 10, unit: 'years' },
    ],
    calculate: (inputs) => {
      const p = inputs.monthlyInvestment;
      const r = inputs.annualReturn / 12 / 100;
      const n = inputs.years * 12;
      const invested = p * n;
      const finalVal = r === 0 ? invested : p * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
      return {
        centerLabel: 'EST. VALUE',
        centerValue: finalVal,
        investedValue: invested,
        gainValue: finalVal - invested,
        finalValue: finalVal,
        rows: [
          { label: 'Total Invested', value: formatINR(invested) },
          { label: 'Est. Returns', value: formatINR(finalVal - invested) },
          { label: 'Total Value', value: formatINR(finalVal) },
        ],
      };
    },
  },
  ssy: {
    slug: 'ssy',
    title: 'SSY Calculator',
    description: 'Calculate returns for Sukanya Samriddhi Yojana (SSY) scheme as per Indian regulations.',
    category: 'banking',
    isPopular: false,
    inputs: [
      { key: 'yearlyInvestment', label: 'Yearly investment', min: 250, max: 150000, step: 500, defaultValue: 50000, unit: 'inr' },
      { key: 'rate', label: 'Interest rate', min: 4, max: 12, step: 0.1, defaultValue: 8.2, unit: 'percent' },
    ],
    calculate: (inputs) => {
      const yearlyDep = inputs.yearlyInvestment;
      const r = inputs.rate / 100;
      let balance = 0;
      let invested = 0;
      for (let yr = 1; yr <= 21; yr++) {
        if (yr <= 15) {
          balance += yearlyDep;
          invested += yearlyDep;
        }
        balance += balance * r;
      }
      return {
        centerLabel: 'MATURITY',
        centerValue: balance,
        investedValue: invested,
        gainValue: balance - invested,
        finalValue: balance,
        note: 'Deposit allowed for 15 years. Maturity is reached after 21 years.',
        rows: [
          { label: 'Total Deposit', value: formatINR(invested) },
          { label: 'Interest Earned', value: formatINR(balance - invested) },
          { label: 'Maturity Amount', value: formatINR(balance) },
        ],
      };
    },
  },
  ppf: {
    slug: 'ppf',
    title: 'PPF Calculator',
    description: 'Calculate your returns on Public Provident Fund (PPF) deposits.',
    category: 'banking',
    isPopular: true,
    inputs: [
      { key: 'yearlyContribution', label: 'Yearly contribution', min: 500, max: 150000, step: 500, defaultValue: 150000, unit: 'inr' },
      { key: 'annualReturn', label: 'Interest rate', min: 4, max: 12, step: 0.05, defaultValue: 7.1, unit: 'percent' },
      { key: 'years', label: 'Tenure', min: 15, max: 50, step: 5, defaultValue: 15, unit: 'years' },
    ],
    calculate: (inputs) => {
      const p = inputs.yearlyContribution;
      const r = inputs.annualReturn / 100;
      const t = inputs.years;
      let balance = 0;
      let invested = 0;
      for (let i = 0; i < t; i++) {
        balance += p;
        balance = balance * (1 + r);
        invested += p;
      }
      return {
        centerLabel: 'MATURITY',
        centerValue: balance,
        investedValue: invested,
        gainValue: balance - invested,
        finalValue: balance,
        rows: [
          { label: 'Total Invested', value: formatINR(invested) },
          { label: 'Total Interest', value: formatINR(balance - invested) },
          { label: 'Maturity Value', value: formatINR(balance) },
        ],
      };
    },
  },
  epf: {
    slug: 'epf',
    title: 'EPF Calculator',
    description: 'Calculate returns for your Employees’ Provident Fund (EPF) account.',
    category: 'retirement',
    isPopular: false,
    inputs: [
      { key: 'monthlySalary', label: 'Monthly basic salary + DA', min: 10000, max: 500000, step: 1000, defaultValue: 50000, unit: 'inr' },
      { key: 'interestRate', label: 'EPF Interest rate', min: 5, max: 12, step: 0.05, defaultValue: 8.25, unit: 'percent' },
      { key: 'years', label: 'Time period of service', min: 1, max: 40, step: 1, defaultValue: 25, unit: 'years' },
    ],
    calculate: (inputs) => {
      const basic = inputs.monthlySalary;
      const r = inputs.interestRate / 100;
      const t = inputs.years;
      const empMonthly = basic * 0.12;
      const employerMonthly = basic * 0.0367;
      const totalMonthlyContribution = empMonthly + employerMonthly;
      let balance = 0;
      let totalInvested = 0;
      for (let yr = 1; yr <= t; yr++) {
        for (let m = 1; m <= 12; m++) {
          balance += totalMonthlyContribution;
          totalInvested += totalMonthlyContribution;
        }
        balance += balance * r;
      }
      return {
        centerLabel: 'MATURITY',
        centerValue: balance,
        investedValue: totalInvested,
        gainValue: balance - totalInvested,
        finalValue: balance,
        rows: [
          { label: 'Your Contribution', value: formatINR(empMonthly * 12 * t) },
          { label: 'Total EPF Balance', value: formatINR(balance) },
          { label: 'Interest Accumulated', value: formatINR(balance - totalInvested) },
        ],
      };
    },
  },
  fd: {
    slug: 'fd',
    title: 'FD Calculator',
    description: 'Check compounding returns on your Fixed Deposits (FDs) instantly.',
    category: 'banking',
    isPopular: true,
    inputs: [
      { key: 'principal', label: 'Deposit amount', min: 10000, max: 10000000, step: 5000, defaultValue: 100000, unit: 'inr' },
      { key: 'rate', label: 'Annual interest rate', min: 1, max: 15, step: 0.1, defaultValue: 7, unit: 'percent' },
      { key: 'years', label: 'Tenure', min: 1, max: 25, step: 1, defaultValue: 5, unit: 'years' },
    ],
    calculate: (inputs) => {
      const p = inputs.principal;
      const r = inputs.rate / 100;
      const t = inputs.years;
      const finalVal = p * Math.pow(1 + r / 4, 4 * t);
      return {
        centerLabel: 'MATURITY',
        centerValue: finalVal,
        investedValue: p,
        gainValue: finalVal - p,
        finalValue: finalVal,
        rows: [
          { label: 'Invested Amount', value: formatINR(p) },
          { label: 'Interest Earned', value: formatINR(finalVal - p) },
          { label: 'Total Value', value: formatINR(finalVal) },
        ],
      };
    },
  },
  rd: {
    slug: 'rd',
    title: 'RD Calculator',
    description: 'Check compounding returns on your Recurring Deposits (RDs) in seconds.',
    category: 'banking',
    isPopular: false,
    inputs: [
      { key: 'monthlyDeposit', label: 'Monthly deposit', min: 500, max: 100000, step: 500, defaultValue: 5000, unit: 'inr' },
      { key: 'rate', label: 'Interest rate', min: 1, max: 15, step: 0.1, defaultValue: 6.7, unit: 'percent' },
      { key: 'years', label: 'Tenure', min: 1, max: 10, step: 1, defaultValue: 5, unit: 'years' },
    ],
    calculate: (inputs) => {
      const p = inputs.monthlyDeposit;
      const r = inputs.rate / 100;
      const t = inputs.years;
      const months = t * 12;
      let balance = 0;
      let invested = p * months;
      for (let m = 1; m <= months; m++) {
        balance += p;
        balance = balance * Math.pow(1 + r / 4, 1 / 3);
      }
      return {
        centerLabel: 'MATURITY',
        centerValue: balance,
        investedValue: invested,
        gainValue: balance - invested,
        finalValue: balance,
        rows: [
          { label: 'Total Investment', value: formatINR(invested) },
          { label: 'Interest Gained', value: formatINR(balance - invested) },
          { label: 'Maturity Amount', value: formatINR(balance) },
        ],
      };
    },
  },
  roi: {
    slug: 'roi',
    title: 'ROI Calculator',
    description: 'Calculate the return on investment (ROI) for your portfolio asset values.',
    category: 'investment',
    isPopular: false,
    inputs: [
      { key: 'invested', label: 'Initial investment value', min: 1000, max: 50000000, step: 5000, defaultValue: 100000, unit: 'inr' },
      { key: 'returned', label: 'Final value returned', min: 1000, max: 100000000, step: 5000, defaultValue: 160000, unit: 'inr' },
    ],
    calculate: (inputs) => {
      const i = inputs.invested;
      const r = inputs.returned;
      const diff = r - i;
      const percent = i === 0 ? 0 : (diff / i) * 100;
      return {
        centerLabel: 'NET PROFIT',
        centerValue: diff,
        investedValue: i,
        gainValue: Math.max(0, diff),
        finalValue: r,
        rows: [
          { label: 'Investment Cost', value: formatINR(i) },
          { label: 'Total Returns', value: formatINR(r) },
          { label: 'Absolute ROI', value: `${percent.toFixed(2)}%` },
        ],
      };
    },
  },
  nps: {
    slug: 'nps',
    title: 'NPS Calculator',
    description: 'Project monthly pension and lump sum withdrawal values under NPS.',
    category: 'retirement',
    isPopular: false,
    inputs: [
      { key: 'monthlyContribution', label: 'Monthly contribution', min: 500, max: 150000, step: 500, defaultValue: 10000, unit: 'inr' },
      { key: 'expectedReturn', label: 'Expected interest rate', min: 4, max: 18, step: 0.1, defaultValue: 10, unit: 'percent' },
      { key: 'age', label: 'Your current age', min: 18, max: 60, step: 1, defaultValue: 30, unit: 'years' },
    ],
    calculate: (inputs) => {
      const p = inputs.monthlyContribution;
      const r = inputs.expectedReturn / 12 / 100;
      const age = inputs.age;
      const years = 60 - age;
      const n = years * 12;
      const invested = p * n;
      const finalVal = r === 0 ? invested : p * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
      const lumpSum = finalVal * 0.6;
      const annuity = finalVal * 0.4;
      const monthlyPension = (annuity * 0.06) / 12;
      return {
        centerLabel: 'TOTAL CORPUS',
        centerValue: finalVal,
        investedValue: invested,
        gainValue: finalVal - invested,
        finalValue: finalVal,
        rows: [
          { label: 'Invested Amount', value: formatINR(invested) },
          { label: 'Lump Sum Cash (60%)', value: formatINR(lumpSum) },
          { label: 'Annuity Value (40%)', value: formatINR(annuity) },
          { label: 'Est. Monthly Pension', value: formatINR(monthlyPension) },
        ],
      };
    },
  },
  hra: {
    slug: 'hra',
    title: 'HRA Calculator',
    description: 'Calculate your House Rent Allowance (HRA) tax exemption amount.',
    category: 'tax',
    isPopular: false,
    inputs: [
      { key: 'basicSalary', label: 'Monthly basic salary', min: 5000, max: 1000000, step: 5000, defaultValue: 60000, unit: 'inr' },
      { key: 'hraReceived', label: 'Monthly HRA received', min: 1000, max: 500000, step: 1000, defaultValue: 25000, unit: 'inr' },
      { key: 'rentPaid', label: 'Monthly rent paid', min: 1000, max: 500000, step: 1000, defaultValue: 18000, unit: 'inr' },
      { key: 'isMetro', label: 'Metro City? (1 = Yes, 0 = No)', min: 0, max: 1, step: 1, defaultValue: 1, unit: 'count' },
    ],
    calculate: (inputs) => {
      const basic = inputs.basicSalary * 12;
      const hra = inputs.hraReceived * 12;
      const rent = inputs.rentPaid * 12;
      const isMetro = inputs.isMetro === 1;
      const excessRent = Math.max(0, rent - 0.1 * basic);
      const salaryCap = isMetro ? 0.5 * basic : 0.4 * basic;
      const exempt = Math.min(hra, excessRent, salaryCap);
      const taxable = hra - exempt;
      return {
        centerLabel: 'EXEMPT HRA',
        centerValue: exempt,
        investedValue: hra,
        gainValue: Math.max(0, exempt),
        finalValue: hra,
        rows: [
          { label: 'HRA Received (Annualized)', value: formatINR(hra) },
          { label: 'Exempt HRA Amount', value: formatINR(exempt) },
          { label: 'Taxable HRA Portion', value: formatINR(taxable) },
        ],
      };
    },
  },
  retirement: {
    slug: 'retirement',
    title: 'Retirement Calculator',
    description: 'Estimate the financial corpus you need for a comfortable retirement.',
    category: 'retirement',
    isPopular: true,
    inputs: [
      { key: 'age', label: 'Current age', min: 18, max: 60, step: 1, defaultValue: 30, unit: 'years' },
      { key: 'retirementAge', label: 'Desired retirement age', min: 40, max: 70, step: 1, defaultValue: 60, unit: 'years' },
      { key: 'expenses', label: 'Current monthly expense', min: 5000, max: 1000000, step: 5000, defaultValue: 40000, unit: 'inr' },
      { key: 'inflation', label: 'Expected inflation rate', min: 2, max: 15, step: 0.1, defaultValue: 6, unit: 'percent' },
    ],
    calculate: (inputs) => {
      const years = inputs.retirementAge - inputs.age;
      const expenses = inputs.expenses * 12;
      const inflation = inputs.inflation / 100;
      const futureExpense = expenses * Math.pow(1 + inflation, years);
      const postReturn = 0.08;
      const corpusNeeded = futureExpense / (postReturn - inflation);
      return {
        centerLabel: 'CORPUS NEEDED',
        centerValue: corpusNeeded,
        investedValue: expenses * years,
        gainValue: Math.max(0, corpusNeeded),
        finalValue: corpusNeeded,
        rows: [
          { label: 'Years to Retirement', value: `${years} Years` },
          { label: 'Future Annual Expense', value: formatINR(futureExpense) },
          { label: 'Required Target Corpus', value: formatINR(corpusNeeded) },
        ],
      };
    },
  },
  emi: {
    slug: 'emi',
    title: 'EMI Calculator',
    description: 'Calculate EMI on your loans – personal loans, home loans or car loans.',
    category: 'loan',
    isPopular: true,
    inputs: [
      { key: 'amount', label: 'Loan amount', min: 10000, max: 100000000, step: 50000, defaultValue: 1000000, unit: 'inr' },
      { key: 'rate', label: 'Interest rate', min: 5, max: 25, step: 0.1, defaultValue: 9.5, unit: 'percent' },
      { key: 'years', label: 'Tenure', min: 1, max: 30, step: 1, defaultValue: 15, unit: 'years' },
    ],
    calculate: (inputs) => {
      const p = inputs.amount;
      const r = inputs.rate / 12 / 100;
      const n = inputs.years * 12;
      const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalAmount = emi * n;
      const interest = totalAmount - p;
      return {
        centerLabel: 'MONTHLY EMI',
        centerValue: emi,
        investedValue: p,
        gainValue: interest,
        finalValue: totalAmount,
        rows: [
          { label: 'Monthly EMI Payment', value: formatINR(emi) },
          { label: 'Principal Loan Amount', value: formatINR(p) },
          { label: 'Interest Payable', value: formatINR(interest) },
          { label: 'Total Paid Amount', value: formatINR(totalAmount) },
        ],
      };
    },
  },
  'car-loan-emi': {
    slug: 'car-loan-emi',
    title: 'Car Loan EMI Calculator',
    description: 'Calculate your monthly car loan EMI values easily.',
    category: 'loan',
    isPopular: false,
    inputs: [
      { key: 'amount', label: 'Car loan amount', min: 100000, max: 20000000, step: 20000, defaultValue: 800000, unit: 'inr' },
      { key: 'rate', label: 'Interest rate', min: 5, max: 20, step: 0.1, defaultValue: 10.5, unit: 'percent' },
      { key: 'years', label: 'Tenure', min: 1, max: 10, step: 1, defaultValue: 5, unit: 'years' },
    ],
    calculate: (inputs) => {
      const p = inputs.amount;
      const r = inputs.rate / 12 / 100;
      const n = inputs.years * 12;
      const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalAmount = emi * n;
      const interest = totalAmount - p;
      return {
        centerLabel: 'MONTHLY EMI',
        centerValue: emi,
        investedValue: p,
        gainValue: interest,
        finalValue: totalAmount,
        rows: [
          { label: 'Monthly EMI Payment', value: formatINR(emi) },
          { label: 'Total Loan Principal', value: formatINR(p) },
          { label: 'Interest Payable', value: formatINR(interest) },
        ],
      };
    },
  },
  'home-loan-emi': {
    slug: 'home-loan-emi',
    title: 'Home Loan EMI Calculator',
    description: 'Calculate your home loan EMI values for buying property.',
    category: 'loan',
    isPopular: false,
    inputs: [
      { key: 'amount', label: 'Home loan amount', min: 500000, max: 200000000, step: 100000, defaultValue: 4500000, unit: 'inr' },
      { key: 'rate', label: 'Interest rate', min: 5, max: 18, step: 0.05, defaultValue: 8.75, unit: 'percent' },
      { key: 'years', label: 'Tenure', min: 1, max: 30, step: 1, defaultValue: 20, unit: 'years' },
    ],
    calculate: (inputs) => {
      const p = inputs.amount;
      const r = inputs.rate / 12 / 100;
      const n = inputs.years * 12;
      const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalAmount = emi * n;
      const interest = totalAmount - p;
      return {
        centerLabel: 'MONTHLY EMI',
        centerValue: emi,
        investedValue: p,
        gainValue: interest,
        finalValue: totalAmount,
        rows: [
          { label: 'Monthly EMI Payment', value: formatINR(emi) },
          { label: 'Loan Principal', value: formatINR(p) },
          { label: 'Interest Payable', value: formatINR(interest) },
        ],
      };
    },
  },
  'simple-interest': {
    slug: 'simple-interest',
    title: 'Simple Interest Calculator',
    description: 'Calculate simple interest payouts on saving schemes and loans.',
    category: 'banking',
    isPopular: false,
    inputs: [
      { key: 'principal', label: 'Principal amount', min: 1000, max: 100000000, step: 1000, defaultValue: 100000, unit: 'inr' },
      { key: 'rate', label: 'Interest rate', min: 1, max: 25, step: 0.1, defaultValue: 10, unit: 'percent' },
      { key: 'years', label: 'Time period', min: 1, max: 30, step: 1, defaultValue: 5, unit: 'years' },
    ],
    calculate: (inputs) => {
      const p = inputs.principal;
      const r = inputs.rate;
      const t = inputs.years;
      const interest = (p * r * t) / 100;
      const total = p + interest;
      return {
        centerLabel: 'INTEREST',
        centerValue: interest,
        investedValue: p,
        gainValue: interest,
        finalValue: total,
        rows: [
          { label: 'Principal Amount', value: formatINR(p) },
          { label: 'Interest Accumulated', value: formatINR(interest) },
          { label: 'Total Value', value: formatINR(total) },
        ],
      };
    },
  },
  'compound-interest': {
    slug: 'compound-interest',
    title: 'Compound Interest Calculator',
    description: 'Calculate compound interest value with custom compounding frequencies.',
    category: 'banking',
    isPopular: false,
    inputs: [
      { key: 'principal', label: 'Principal amount', min: 1000, max: 100000000, step: 1000, defaultValue: 100000, unit: 'inr' },
      { key: 'rate', label: 'Annual interest rate', min: 1, max: 25, step: 0.1, defaultValue: 10, unit: 'percent' },
      { key: 'years', label: 'Tenure', min: 1, max: 30, step: 1, defaultValue: 5, unit: 'years' },
      { key: 'frequency', label: 'Compounding frequency (times/year)', min: 1, max: 12, step: 1, defaultValue: 4, unit: 'count' },
    ],
    calculate: (inputs) => {
      const p = inputs.principal;
      const r = inputs.rate / 100;
      const t = inputs.years;
      const f = inputs.frequency;
      const finalVal = p * Math.pow(1 + r / f, f * t);
      return {
        centerLabel: 'EST. VALUE',
        centerValue: finalVal,
        investedValue: p,
        gainValue: finalVal - p,
        finalValue: finalVal,
        rows: [
          { label: 'Principal Amount', value: formatINR(p) },
          { label: 'Interest Gained', value: formatINR(finalVal - p) },
          { label: 'Total Balance', value: formatINR(finalVal) },
        ],
      };
    },
  },
  nsc: {
    slug: 'nsc',
    title: 'NSC Calculator',
    description: 'Calculate your compounding returns under National Savings Certificate (NSC) rules.',
    category: 'banking',
    isPopular: false,
    inputs: [
      { key: 'principal', label: 'NSC investment amount', min: 1000, max: 5000000, step: 1000, defaultValue: 50000, unit: 'inr' },
      { key: 'rate', label: 'Interest rate (Annual Compound)', min: 4, max: 10, step: 0.05, defaultValue: 7.7, unit: 'percent' },
    ],
    calculate: (inputs) => {
      const p = inputs.principal;
      const r = inputs.rate / 100;
      const years = 5;
      const finalVal = p * Math.pow(1 + r, years);
      return {
        centerLabel: 'MATURITY',
        centerValue: finalVal,
        investedValue: p,
        gainValue: finalVal - p,
        finalValue: finalVal,
        note: 'NSC scheme has a locked-in tenure of 5 years.',
        rows: [
          { label: 'Purchase Amount', value: formatINR(p) },
          { label: 'Returns at Maturity', value: formatINR(finalVal - p) },
          { label: 'Total Value', value: formatINR(finalVal) },
        ],
      };
    },
  },
  'step-up-sip': {
    slug: 'step-up-sip',
    title: 'Step Up SIP Calculator',
    description: 'Calculate SIP returns with an yearly contribution raise (Step Up).',
    category: 'investment',
    isPopular: false,
    inputs: [
      { key: 'initialSIP', label: 'Starting monthly investment', min: 500, max: 100000, step: 500, defaultValue: 5000, unit: 'inr' },
      { key: 'stepUp', label: 'Yearly step-up increment', min: 1, max: 50, step: 1, defaultValue: 10, unit: 'percent' },
      { key: 'annualReturn', label: 'Expected annual return', min: 1, max: 30, step: 0.1, defaultValue: 12, unit: 'percent' },
      { key: 'years', label: 'Investment tenure', min: 1, max: 30, step: 1, defaultValue: 15, unit: 'years' },
    ],
    calculate: (inputs) => {
      const start = inputs.initialSIP;
      const step = 1 + inputs.stepUp / 100;
      const r = inputs.annualReturn / 12 / 100;
      const t = inputs.years;
      let balance = 0;
      let invested = 0;
      let currentSIP = start;
      for (let yr = 1; yr <= t; yr++) {
        for (let m = 1; m <= 12; m++) {
          balance += currentSIP;
          balance = balance * (1 + r);
          invested += currentSIP;
        }
        currentSIP = currentSIP * step;
      }
      return {
        centerLabel: 'MATURITY',
        centerValue: balance,
        investedValue: invested,
        gainValue: balance - invested,
        finalValue: balance,
        rows: [
          { label: 'Total Invested', value: formatINR(invested) },
          { label: 'Estimated Growth', value: formatINR(balance - invested) },
          { label: 'Maturity value', value: formatINR(balance) },
        ],
      };
    },
  },
  'income-tax': {
    slug: 'income-tax',
    title: 'Income Tax Calculator',
    description: 'Calculate your payable income tax for the latest fiscal regimes (FY 2026-27).',
    category: 'tax',
    isPopular: true,
    inputs: [
      { key: 'salary', label: 'Gross annual salary income', min: 100000, max: 10000000, step: 50000, defaultValue: 1200000, unit: 'inr' },
      { key: 'otherIncome', label: 'Other taxable income', min: 0, max: 5000000, step: 10000, defaultValue: 0, unit: 'inr' },
    ],
    calculate: (inputs) => {
      const gross = inputs.salary + inputs.otherIncome;
      const stdDeduction = 75000;
      const taxable = Math.max(0, gross - stdDeduction);
      let tax = 0;
      if (taxable > 300000) {
        const slab1 = Math.min(400000, taxable - 300000);
        tax += slab1 * 0.05;
      }
      if (taxable > 700000) {
        const slab2 = Math.min(300000, taxable - 700000);
        tax += slab2 * 0.10;
      }
      if (taxable > 1000000) {
        const slab3 = Math.min(200000, taxable - 1000000);
        tax += slab3 * 0.15;
      }
      if (taxable > 1200000) {
        const slab4 = Math.min(300000, taxable - 1200000);
        tax += slab4 * 0.20;
      }
      if (taxable > 1500000) {
        tax += (taxable - 1500000) * 0.30;
      }
      const cess = tax * 0.04;
      const netTax = tax + cess;
      return {
        centerLabel: 'TAX PAYABLE',
        centerValue: netTax,
        investedValue: gross,
        gainValue: 0,
        finalValue: Math.max(0, gross - netTax),
        note: 'Based on the New Tax Regime FY 2026-27 (inclusive of standard deduction).',
        rows: [
          { label: 'Gross Annual Income', value: formatINR(gross) },
          { label: 'Standard Deduction', value: formatINR(stdDeduction) },
          { label: 'Tax Base (Assessable)', value: formatINR(taxable) },
          { label: 'Payable Net Tax + Cess', value: formatINR(netTax) },
        ],
      };
    },
  },
  gratuity: {
    slug: 'gratuity',
    title: 'Gratuity Calculator',
    description: 'Calculate the gratuity pay you are entitled to receive upon retirement.',
    category: 'retirement',
    isPopular: false,
    inputs: [
      { key: 'lastSalary', label: 'Last drawn salary (Basic + DA)', min: 5000, max: 2000000, step: 2000, defaultValue: 75000, unit: 'inr' },
      { key: 'yearsOfService', label: 'Years of continuous service', min: 5, max: 40, step: 1, defaultValue: 12, unit: 'years' },
    ],
    calculate: (inputs) => {
      const sal = inputs.lastSalary;
      const y = inputs.yearsOfService;
      const gratuityVal = Math.min(2000000, (sal * 15 * y) / 26);
      return {
        centerLabel: 'EST. GRATUITY',
        centerValue: gratuityVal,
        investedValue: sal * y,
        gainValue: gratuityVal,
        finalValue: gratuityVal,
        note: 'As per the Payment of Gratuity Act, standard payout is capped at ₹20,00,000.',
        rows: [
          { label: 'Last Drawn Basic Salary', value: formatINR(sal) },
          { label: 'Total Years of Service', value: `${y} Yrs` },
          { label: 'Estimated Gratuity Pay', value: formatINR(gratuityVal) },
        ],
      };
    },
  },
  apy: {
    slug: 'apy',
    title: 'APY Calculator',
    description: 'Calculate contributions and pension values under Atal Pension Yojana (APY).',
    category: 'retirement',
    isPopular: false,
    inputs: [
      { key: 'age', label: 'Your entry age', min: 18, max: 40, step: 1, defaultValue: 25, unit: 'years' },
      { key: 'pension', label: 'Pension desired (INR/month)', min: 1000, max: 5000, step: 1000, defaultValue: 5000, unit: 'count' },
    ],
    calculate: (inputs) => {
      const age = inputs.age;
      const pen = inputs.pension;
      const contributions = [
        { age: 18, monthly: [42, 84, 126, 168, 210] },
        { age: 25, monthly: [76, 151, 226, 302, 376] },
        { age: 30, monthly: [116, 231, 347, 462, 577] },
        { age: 35, monthly: [181, 362, 543, 722, 902] },
        { age: 40, monthly: [291, 582, 873, 1164, 1454] },
      ];
      let row = contributions.find((item) => item.age >= age) ?? contributions[contributions.length - 1];
      const index = Math.min(4, Math.floor(pen / 1000) - 1);
      const monthlyCont = row.monthly[index];
      const totalYears = 60 - age;
      const totalInvested = monthlyCont * 12 * totalYears;
      return {
        centerLabel: 'EST. PENSION',
        centerValue: pen,
        investedValue: totalInvested,
        gainValue: 0,
        finalValue: pen,
        rows: [
          { label: 'Required Monthly Saving', value: formatINR(monthlyCont) },
          { label: 'Total Savings Until Age 60', value: formatINR(totalInvested) },
          { label: 'Expected Monthly Pension', value: formatINR(pen) },
        ],
      };
    },
  },
  cagr: {
    slug: 'cagr',
    title: 'CAGR Calculator',
    description: 'The simplest compound annual growth rate (CAGR) calculator.',
    category: 'investment',
    isPopular: false,
    inputs: [
      { key: 'initial', label: 'Initial value', min: 1000, max: 100000000, step: 1000, defaultValue: 100000, unit: 'inr' },
      { key: 'final', label: 'Final value', min: 1000, max: 200000000, step: 1000, defaultValue: 250000, unit: 'inr' },
      { key: 'years', label: 'Tenure', min: 1, max: 30, step: 1, defaultValue: 5, unit: 'years' },
    ],
    calculate: (inputs) => {
      const init = inputs.initial;
      const fin = inputs.final;
      const t = inputs.years;
      const rate = init === 0 ? 0 : Math.pow(fin / init, 1 / t) - 1;
      return {
        centerLabel: 'CAGR RATE',
        centerValue: Math.max(0, rate * 100),
        investedValue: init,
        gainValue: Math.max(0, fin - init),
        finalValue: fin,
        rows: [
          { label: 'Initial Investment', value: formatINR(init) },
          { label: 'Maturity Value', value: formatINR(fin) },
          { label: 'Calculated CAGR', value: `${(rate * 100).toFixed(2)}%` },
        ],
      };
    },
  },
  gst: {
    slug: 'gst',
    title: 'GST Calculator',
    description: 'Calculate your payable goods and services tax (GST) amount.',
    category: 'tax',
    isPopular: true,
    inputs: [
      { key: 'amount', label: 'Base Net Price amount', min: 10, max: 5000000, step: 100, defaultValue: 10000, unit: 'inr' },
      { key: 'rate', label: 'GST Rate slab', min: 5, max: 28, step: 1, defaultValue: 18, unit: 'percent' },
    ],
    calculate: (inputs) => {
      const net = inputs.amount;
      const rate = inputs.rate;
      const gstVal = (net * rate) / 100;
      const gross = net + gstVal;
      return {
        centerLabel: 'GROSS AMOUNT',
        centerValue: gross,
        investedValue: net,
        gainValue: gstVal,
        finalValue: gross,
        rows: [
          { label: 'Base Price (Net)', value: formatINR(net) },
          { label: 'GST Amount', value: formatINR(gstVal) },
          { label: 'CGST (GST / 2)', value: formatINR(gstVal / 2) },
          { label: 'SGST (GST / 2)', value: formatINR(gstVal / 2) },
          { label: 'Total Price (Gross)', value: formatINR(gross) },
        ],
      };
    },
  },
  'flat-vs-reducing-rate': {
    slug: 'flat-vs-reducing-rate',
    title: 'Flat vs Reducing Rate',
    description: 'Compare payable interest and monthly EMI in flat vs reducing rate schemes.',
    category: 'loan',
    isPopular: false,
    inputs: [
      { key: 'loan', label: 'Principal loan amount', min: 10000, max: 50000000, step: 10000, defaultValue: 500000, unit: 'inr' },
      { key: 'rate', label: 'Annual flat rate', min: 2, max: 25, step: 0.1, defaultValue: 10, unit: 'percent' },
      { key: 'years', label: 'Tenure', min: 1, max: 15, step: 1, defaultValue: 5, unit: 'years' },
    ],
    calculate: (inputs) => {
      const p = inputs.loan;
      const flatR = inputs.rate / 100;
      const years = inputs.years;
      const n = years * 12;
      const flatInterest = p * flatR * years;
      const flatEmi = (p + flatInterest) / n;
      const reducingRate = (flatR * 12 * 100) / 7;
      return {
        centerLabel: 'FLAT INTEREST',
        centerValue: flatInterest,
        investedValue: p,
        gainValue: flatInterest,
        finalValue: p + flatInterest,
        rows: [
          { label: 'Monthly Flat EMI', value: formatINR(flatEmi) },
          { label: 'Total Flat Interest', value: formatINR(flatInterest) },
          { label: 'Equivalent Reducing Rate (approx)', value: `${reducingRate.toFixed(2)}%` },
        ],
      };
    },
  },
  brokerage: {
    slug: 'brokerage',
    title: 'Brokerage Calculator',
    description: 'Calculate brokerage, taxes, and other transaction fees for stock orders.',
    category: 'tax',
    isPopular: false,
    inputs: [
      { key: 'tradeValue', label: 'Total trade buy/sell value', min: 100, max: 10000000, step: 100, defaultValue: 50000, unit: 'inr' },
      { key: 'isIntraday', label: 'Order category (1 = Intraday, 0 = Delivery)', min: 0, max: 1, step: 1, defaultValue: 0, unit: 'count' },
    ],
    calculate: (inputs) => {
      const val = inputs.tradeValue;
      const intraday = inputs.isIntraday === 1;
      const brokerageAmt = Math.min(20, val * 0.0003);
      const stt = val * (intraday ? 0.00025 : 0.001);
      const txnFee = val * 0.0000345;
      const gstVal = (brokerageAmt + txnFee) * 0.18;
      const stamps = val * (intraday ? 0.00003 : 0.00015);
      const totalCharges = brokerageAmt + stt + txnFee + gstVal + stamps;
      return {
        centerLabel: 'TOTAL CHARGES',
        centerValue: totalCharges,
        investedValue: val,
        gainValue: totalCharges,
        finalValue: val - totalCharges,
        rows: [
          { label: 'Brokerage Charge', value: formatINR(brokerageAmt) },
          { label: 'STT Tax', value: formatINR(stt) },
          { label: 'GST & Stamp Duty', value: formatINR(gstVal + stamps) },
          { label: 'Transaction / SEBI Charges', value: formatINR(txnFee) },
        ],
      };
    },
  },
  margin: {
    slug: 'margin',
    title: 'Margin Calculator',
    description: 'Calculate margin required for delivery or intraday stock trades.',
    category: 'investment',
    isPopular: false,
    inputs: [
      { key: 'stockPrice', label: 'Stock market price', min: 1, max: 100000, step: 1, defaultValue: 850, unit: 'inr' },
      { key: 'quantity', label: 'Shares quantity', min: 1, max: 50000, step: 1, defaultValue: 500, unit: 'count' },
      { key: 'leverage', label: 'Leverage multiplier', min: 1, max: 5, step: 1, defaultValue: 5, unit: 'count' },
    ],
    calculate: (inputs) => {
      const price = inputs.stockPrice;
      const qty = inputs.quantity;
      const lev = inputs.leverage;
      const gross = price * qty;
      const marginReq = gross / lev;
      return {
        centerLabel: 'MARGIN REQ.',
        centerValue: marginReq,
        investedValue: marginReq,
        gainValue: gross - marginReq,
        finalValue: gross,
        rows: [
          { label: 'Total Order Value', value: formatINR(gross) },
          { label: 'Margin Fund Required', value: formatINR(marginReq) },
          { label: 'Broker Leverage', value: `${lev}x` },
        ],
      };
    },
  },
  tds: {
    slug: 'tds',
    title: 'TDS Calculator',
    description: 'Calculate Tax Deducted at Source (TDS) percentages and deduction values.',
    category: 'tax',
    isPopular: false,
    inputs: [
      { key: 'amount', label: 'Gross payable amount', min: 1000, max: 10000000, step: 5000, defaultValue: 200000, unit: 'inr' },
      { key: 'rate', label: 'TDS Rate slab', min: 1, max: 30, step: 1, defaultValue: 10, unit: 'percent' },
    ],
    calculate: (inputs) => {
      const val = inputs.amount;
      const r = inputs.rate;
      const tdsVal = (val * r) / 100;
      const net = val - tdsVal;
      return {
        centerLabel: 'TDS DEPOSITED',
        centerValue: tdsVal,
        investedValue: val,
        gainValue: tdsVal,
        finalValue: net,
        rows: [
          { label: 'Gross Billing Value', value: formatINR(val) },
          { label: 'TDS Deduction Amount', value: formatINR(tdsVal) },
          { label: 'Net Disbursed Amount', value: formatINR(net) },
        ],
      };
    },
  },
  salary: {
    slug: 'salary',
    title: 'Salary Calculator',
    description: 'Estimate net take-home salary after monthly EPF, professional taxes, and income taxes.',
    category: 'tax',
    isPopular: false,
    inputs: [
      { key: 'ctc', label: 'Gross annual CTC', min: 100000, max: 10000000, step: 50000, defaultValue: 1200000, unit: 'inr' },
      { key: 'monthlyEpf', label: 'Monthly EPF deduction', min: 0, max: 50000, step: 500, defaultValue: 1800, unit: 'inr' },
      { key: 'professionalTax', label: 'Monthly professional tax', min: 0, max: 500, step: 50, defaultValue: 200, unit: 'inr' },
    ],
    calculate: (inputs) => {
      const grossMonthly = inputs.ctc / 12;
      const epf = inputs.monthlyEpf;
      const pt = inputs.professionalTax;
      let tax = 0;
      const taxable = Math.max(0, inputs.ctc - 75000);
      if (taxable > 300000) {
        const slab1 = Math.min(400000, taxable - 300000);
        tax += slab1 * 0.05;
      }
      if (taxable > 700000) {
        const slab2 = Math.min(300000, taxable - 700000);
        tax += slab2 * 0.10;
      }
      if (taxable > 1000000) {
        const slab3 = Math.min(200000, taxable - 1000000);
        tax += slab3 * 0.15;
      }
      if (taxable > 1200000) {
        const slab4 = Math.min(300000, taxable - 1200000);
        tax += slab4 * 0.20;
      }
      if (taxable > 1500000) {
        tax += (taxable - 1500000) * 0.30;
      }
      const monthlyTax = (tax * 1.04) / 12;
      const netTakeHome = Math.max(0, grossMonthly - epf - pt - monthlyTax);
      return {
        centerLabel: 'TAKE HOME/MO',
        centerValue: netTakeHome,
        investedValue: grossMonthly,
        gainValue: 0,
        finalValue: netTakeHome,
        rows: [
          { label: 'Gross Monthly Pay', value: formatINR(grossMonthly) },
          { label: 'Monthly EPF + Professional Tax', value: formatINR(epf + pt) },
          { label: 'Estimated Tax / Month', value: formatINR(monthlyTax) },
          { label: 'Net Take Home Monthly Salary', value: formatINR(netTakeHome) },
        ],
      };
    },
  },
  inflation: {
    slug: 'inflation',
    title: 'Inflation Calculator',
    description: 'Calculate inflation-adjusted prices for future goods and expenses.',
    category: 'investment',
    isPopular: false,
    inputs: [
      { key: 'price', label: 'Current price of good', min: 100, max: 10000000, step: 100, defaultValue: 10000, unit: 'inr' },
      { key: 'inflation', label: 'Average annual inflation', min: 1, max: 20, step: 0.1, defaultValue: 6, unit: 'percent' },
      { key: 'years', label: 'Time period', min: 1, max: 45, step: 1, defaultValue: 10, unit: 'years' },
    ],
    calculate: (inputs) => {
      const p = inputs.price;
      const r = inputs.inflation / 100;
      const t = inputs.years;
      const future = p * Math.pow(1 + r, t);
      return {
        centerLabel: 'FUTURE COST',
        centerValue: future,
        investedValue: p,
        gainValue: future - p,
        finalValue: future,
        rows: [
          { label: 'Price Today', value: formatINR(p) },
          { label: 'Inflation Cost Addition', value: formatINR(future - p) },
          { label: 'Price in Future', value: formatINR(future) },
        ],
      };
    },
  },
  'post-office-mis': {
    slug: 'post-office-mis',
    title: 'Post Office MIS',
    description: 'Calculate compounding returns and monthly payouts under Post Office Monthly Income Scheme.',
    category: 'banking',
    isPopular: false,
    inputs: [
      { key: 'principal', label: 'Investment amount', min: 1000, max: 900000, step: 1000, defaultValue: 450000, unit: 'inr' },
      { key: 'rate', label: 'Interest rate', min: 4, max: 10, step: 0.05, defaultValue: 7.4, unit: 'percent' },
    ],
    calculate: (inputs) => {
      const p = inputs.principal;
      const r = inputs.rate / 12 / 100;
      const monthlyPayout = p * r;
      const totalPayout = monthlyPayout * 60;
      return {
        centerLabel: 'MONTHLY PAYOUT',
        centerValue: monthlyPayout,
        investedValue: p,
        gainValue: totalPayout,
        finalValue: p + totalPayout,
        note: 'The Post Office MIS has a mandatory lock-in period of 5 years (60 months).',
        rows: [
          { label: 'Principal Deposited', value: formatINR(p) },
          { label: 'Monthly Pension Paid', value: formatINR(monthlyPayout) },
          { label: 'Total Payout over 5 Yrs', value: formatINR(totalPayout) },
        ],
      };
    },
  },
  scss: {
    slug: 'scss',
    title: 'SCSS Calculator',
    description: 'Calculate returns and payouts under Senior Citizens Savings Scheme (SCSS) scheme rules.',
    category: 'banking',
    isPopular: false,
    inputs: [
      { key: 'principal', label: 'Deposit amount', min: 1000, max: 3000000, step: 5000, defaultValue: 1000000, unit: 'inr' },
      { key: 'rate', label: 'SCSS Interest rate', min: 5, max: 10, step: 0.05, defaultValue: 8.2, unit: 'percent' },
    ],
    calculate: (inputs) => {
      const p = inputs.principal;
      const r = inputs.rate / 4 / 100;
      const quarterly = p * r;
      const totalReturns = quarterly * 20;
      return {
        centerLabel: 'QTR PAYOUT',
        centerValue: quarterly,
        investedValue: p,
        gainValue: totalReturns,
        finalValue: p + totalReturns,
        note: 'SCSS payouts occur quarterly. Lock-in period is 5 years (20 quarters).',
        rows: [
          { label: 'Principal Deposited', value: formatINR(p) },
          { label: 'Quarterly Interest Payout', value: formatINR(quarterly) },
          { label: 'Total Interest over 5 Yrs', value: formatINR(totalReturns) },
        ],
      };
    },
  },
  'stock-average': {
    slug: 'stock-average',
    title: 'Stock Average Calculator',
    description: 'Calculate average purchase price of your stock investments across multiple orders.',
    category: 'investment',
    isPopular: false,
    inputs: [
      { key: 'price1', label: 'Purchase 1 share price', min: 1, max: 100000, step: 1, defaultValue: 350, unit: 'inr' },
      { key: 'qty1', label: 'Purchase 1 quantity', min: 1, max: 10000, step: 1, defaultValue: 100, unit: 'count' },
      { key: 'price2', label: 'Purchase 2 share price', min: 1, max: 100000, step: 1, defaultValue: 300, unit: 'inr' },
      { key: 'qty2', label: 'Purchase 2 quantity', min: 1, max: 10000, step: 1, defaultValue: 200, unit: 'count' },
    ],
    calculate: (inputs) => {
      const p1 = inputs.price1;
      const q1 = inputs.qty1;
      const p2 = inputs.price2;
      const q2 = inputs.qty2;
      const cost1 = p1 * q1;
      const cost2 = p2 * q2;
      const totalCost = cost1 + cost2;
      const totalQty = q1 + q2;
      const avg = totalQty === 0 ? 0 : totalCost / totalQty;
      return {
        centerLabel: 'AVG PRICE',
        centerValue: avg,
        investedValue: totalCost,
        gainValue: 0,
        finalValue: totalCost,
        rows: [
          { label: 'Total Stock Quantity', value: `${totalQty} Shares` },
          { label: 'First Buy Cost', value: formatINR(cost1) },
          { label: 'Second Buy Cost', value: formatINR(cost2) },
          { label: 'Average Share Price', value: formatINR(avg) },
        ],
      };
    },
  },
  xirr: {
    slug: 'xirr',
    title: 'XIRR Calculator',
    description: 'Calculate the extended internal rate of return (XIRR) for irregular mutual fund transactions.',
    category: 'investment',
    isPopular: false,
    inputs: [
      { key: 'initial', label: 'Initial investment value', min: 1000, max: 10000000, step: 1000, defaultValue: 100000, unit: 'inr' },
      { key: 'annualGrowth', label: 'Assumed compound growth', min: 1, max: 50, step: 0.1, defaultValue: 14.5, unit: 'percent' },
      { key: 'years', label: 'Time period', min: 1, max: 20, step: 1, defaultValue: 5, unit: 'years' },
    ],
    calculate: (inputs) => {
      const p = inputs.initial;
      const r = inputs.annualGrowth / 100;
      const t = inputs.years;
      const finalVal = p * Math.pow(1 + r, t);
      return {
        centerLabel: 'XIRR VALUE',
        centerValue: finalVal,
        investedValue: p,
        gainValue: finalVal - p,
        finalValue: finalVal,
        rows: [
          { label: 'Total Initial Value', value: formatINR(p) },
          { label: 'Estimated Maturity', value: formatINR(finalVal) },
          { label: 'Calculated XIRR Return', value: `${inputs.annualGrowth.toFixed(1)}%` },
        ],
      };
    },
  },
};
