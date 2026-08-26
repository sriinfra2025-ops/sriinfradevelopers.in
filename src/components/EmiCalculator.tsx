import React, { useState } from 'react';
import { Calculator, IndianRupee, Percent, Calendar, Sparkles, Building, CheckCircle2 } from 'lucide-react';

export const EmiCalculator: React.FC = () => {
  const [plotValue, setPlotValue] = useState<number>(3500000); // 35 Lakhs default
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(10);

  const downPaymentAmount = (plotValue * downPaymentPercent) / 100;
  const loanAmount = plotValue - downPaymentAmount;

  // Monthly EMI Calculation: [P x R x (1+R)^N]/[(1+R)^N-1]
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;
  const emi =
    loanAmount > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : 0;

  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - loanAmount;

  const principalRatio = totalPayment > 0 ? (loanAmount / totalPayment) * 100 : 50;
  const interestRatio = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 50;

  return (
    <section id="emi-calc" className="py-16 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5" /> Investment Planning
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Smart Plot Loan & EMI Calculator
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Calculate your monthly instalments with approved partner banks (SBI, HDFC, ICICI, Axis Bank) offering up to 80% funding.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* Plot Value Slider */}
            <div>
              <div className="flex justify-between items-center text-sm font-semibold mb-2">
                <span className="text-slate-300">Total Plot Value</span>
                <span className="text-amber-400 font-mono text-base font-bold">
                  ₹{(plotValue / 100000).toFixed(2)} Lakhs
                </span>
              </div>
              <input
                type="range"
                min="1000000"
                max="15000000"
                step="50000"
                value={plotValue}
                onChange={(e) => setPlotValue(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>₹10 Lakhs</span>
                <span>₹1.5 Crores</span>
              </div>
            </div>

            {/* Down Payment Slider */}
            <div>
              <div className="flex justify-between items-center text-sm font-semibold mb-2">
                <span className="text-slate-300">Down Payment ({downPaymentPercent}%)</span>
                <span className="text-slate-200 font-mono text-xs">
                  ₹{Math.round(downPaymentAmount).toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>10% (Min)</span>
                <span>60%</span>
              </div>
            </div>

            {/* Interest Rate & Tenure Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center text-sm font-semibold mb-2">
                  <span className="text-slate-300">Interest Rate</span>
                  <span className="text-amber-400 font-mono font-bold">{interestRate}% p.a.</span>
                </div>
                <input
                  type="range"
                  min="7.0"
                  max="14.0"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-sm font-semibold mb-2">
                  <span className="text-slate-300">Loan Tenure</span>
                  <span className="text-amber-400 font-mono font-bold">{tenureYears} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="1"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>

            {/* Bank Logos / Badges */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Approved Loan Partners:</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200">SBI Home Loans</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200">HDFC Bank</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200">ICICI Bank</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200">Axis Bank</span>
            </div>
          </div>

          {/* EMI Output Card */}
          <div className="lg:col-span-5 bg-slate-950 p-6 sm:p-8 rounded-2xl border border-amber-500/30 text-center space-y-6">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Estimated Monthly EMI
              </span>
              <div className="text-4xl font-black text-amber-400 font-mono mt-1">
                ₹{Math.round(emi).toLocaleString()}
                <span className="text-xs font-normal text-slate-400">/mo</span>
              </div>
            </div>

            {/* Distribution Bar */}
            <div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${principalRatio}%` }}
                  className="bg-amber-500 h-full transition-all"
                  title="Principal Loan Amount"
                />
                <div
                  style={{ width: `${interestRatio}%` }}
                  className="bg-blue-500 h-full transition-all"
                  title="Total Interest"
                />
              </div>
              <div className="flex justify-between text-[11px] mt-2">
                <span className="text-amber-400 flex items-center gap-1">
                  ● Principal: ₹{Math.round(loanAmount).toLocaleString()}
                </span>
                <span className="text-blue-400 flex items-center gap-1">
                  ● Interest: ₹{Math.round(totalInterest).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1 text-left">
              <div className="flex justify-between text-slate-400">
                <span>Total Amount Payable:</span>
                <span className="font-semibold text-white font-mono">
                  ₹{Math.round(totalPayment).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Spot Booking Discount:</span>
                <span className="font-semibold text-emerald-400">Up to ₹50,000 Off</span>
              </div>
            </div>

            <a
              href="#contact"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer inline-block"
            >
              Apply for Bank Loan Assistance
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
