import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Terminal,
  ExternalLink,
  ShieldCheck,
  FileCode,
  BookOpen,
  ArrowRight,
  Sparkles,
  Server,
  Layers,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import {
  GITHUB_A_RECORDS,
  GITHUB_CNAME_RECORDS,
  GITHUB_AAAA_RECORDS,
  REGISTRAR_GUIDES,
  TROUBLESHOOTING_CHECKLIST
} from '../data/dnsRecords';
import { COMPANY_INFO } from '../data/properties';
import { LiveDnsChecker } from './LiveDnsChecker';

export const DnsTroubleshooter: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeRegistrar, setActiveRegistrar] = useState<string>('godaddy');
  const [showIpv6, setShowIpv6] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const downloadCnameFile = () => {
    const element = document.createElement('a');
    const file = new Blob([COMPANY_INFO.customDomain + '\n'], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'CNAME';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadGithubActionsWorkflow = () => {
    const workflowContent = `name: Deploy Sri Infra Developers to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci || npm install

      - name: Build static site
        run: npm run build

      - name: Create CNAME file in output
        run: echo "${COMPANY_INFO.customDomain}" > dist/CNAME

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;

    const element = document.createElement('a');
    const file = new Blob([workflowContent], { type: 'text/yaml' });
    element.href = URL.createObjectURL(file);
    element.download = 'deploy.yml';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const selectedGuide = REGISTRAR_GUIDES.find((g) => g.id === activeRegistrar) || REGISTRAR_GUIDES[0];

  return (
    <div id="dns-troubleshooter-section" className="space-y-10">
      {/* Live Checker Component */}
      <LiveDnsChecker />

      {/* Quick 3-Step Solution Card */}
      <div id="quick-fix-guide" className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">
          <Sparkles className="w-4 h-4" /> The Exact 3-Step Fix for InvalidDNSError
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">
          How to connect <span className="text-amber-400">sriinfradevlopers.in</span> to GitHub Pages
        </h3>
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          The error occurs because your domain registrar (GoDaddy, Hostinger, BigRock, etc.) doesn&apos;t have GitHub&apos;s DNS records yet. Follow these 3 steps to fix it in under 3 minutes:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 relative flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm mb-3">
                1
              </div>
              <h4 className="text-base font-semibold text-white mb-2">Add 4 DNS A-Records</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Open your domain registrar (GoDaddy / Hostinger / BigRock) DNS settings. Add four <strong>A Records</strong> pointing host <code>@</code> to GitHub IP addresses.
              </p>
            </div>
            <button
              onClick={() => {
                const text = GITHUB_A_RECORDS.map((r) => `${r.type}\t@\t${r.value}`).join('\n');
                copyText(text, 'all-a-records');
              }}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition"
            >
              {copiedKey === 'all-a-records' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'all-a-records' ? 'Copied 4 IPs!' : 'Copy All 4 IPs'}
            </button>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 relative flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm mb-3">
                2
              </div>
              <h4 className="text-base font-semibold text-white mb-2">Add 1 CNAME Record</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                In the same DNS settings, add a <strong>CNAME Record</strong> with Host: <code>www</code> and Points to: <code>{COMPANY_INFO.githubPagesUrl}</code>.
              </p>
            </div>
            <button
              onClick={() => copyText(`${COMPANY_INFO.githubPagesUrl}`, 'cname-val')}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition"
            >
              {copiedKey === 'cname-val' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'cname-val' ? 'Copied CNAME!' : 'Copy CNAME Target'}
            </button>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 relative flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm mb-3">
                3
              </div>
              <h4 className="text-base font-semibold text-white mb-2">Commit CNAME File</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Ensure a file named <code>CNAME</code> exists in your repository root with content <code>{COMPANY_INFO.customDomain}</code>.
              </p>
            </div>
            <button
              onClick={downloadCnameFile}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition shadow-md shadow-amber-500/20"
            >
              <Download className="w-3.5 h-3.5" /> Download CNAME File
            </button>
          </div>
        </div>
      </div>

      {/* Official DNS Records Copyable Table */}
      <div id="dns-records-table" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-amber-400" /> Required DNS Records for sriinfradevlopers.in
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Add these exact records in your domain registrar DNS zone file.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowIpv6(!showIpv6)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
            >
              {showIpv6 ? 'Hide IPv6 AAAA Records' : 'Show IPv6 AAAA Records (Optional)'}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400 bg-slate-950/50">
                <th className="py-3 px-4">Record Type</th>
                <th className="py-3 px-4">Host / Name</th>
                <th className="py-3 px-4">Points To / Value</th>
                <th className="py-3 px-4">TTL</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-xs">
              {/* 4 A-Records */}
              {GITHUB_A_RECORDS.map((rec, index) => (
                <tr key={rec.value} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-bold text-amber-400">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                      {rec.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">@</td>
                  <td className="py-3.5 px-4 text-white font-semibold flex items-center gap-2">
                    <span>{rec.value}</span>
                    <span className="text-[10px] font-sans text-slate-500 font-normal">Node #{index + 1}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">3600 (1 Hour)</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => copyText(rec.value, `a-rec-${index}`)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-sans transition"
                    >
                      {copiedKey === `a-rec-${index}` ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      {copiedKey === `a-rec-${index}` ? 'Copied' : 'Copy'}
                    </button>
                  </td>
                </tr>
              ))}

              {/* CNAME */}
              {GITHUB_CNAME_RECORDS.map((rec) => (
                <tr key={rec.value} className="hover:bg-slate-800/40 transition bg-blue-950/20">
                  <td className="py-3.5 px-4 font-bold text-blue-400">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                      {rec.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">www</td>
                  <td className="py-3.5 px-4 text-white font-semibold">
                    {rec.value}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">3600 (1 Hour)</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => copyText(rec.value, 'cname-table')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-sans transition"
                    >
                      {copiedKey === 'cname-table' ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      {copiedKey === 'cname-table' ? 'Copied' : 'Copy'}
                    </button>
                  </td>
                </tr>
              ))}

              {/* Optional IPv6 */}
              {showIpv6 &&
                GITHUB_AAAA_RECORDS.map((rec, index) => (
                  <tr key={rec.value} className="hover:bg-slate-800/40 transition text-purple-300">
                    <td className="py-3.5 px-4 font-bold text-purple-400">
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                        {rec.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">@</td>
                    <td className="py-3.5 px-4 font-semibold">{rec.value}</td>
                    <td className="py-3.5 px-4 text-slate-400">3600</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => copyText(rec.value, `aaaa-rec-${index}`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-sans transition"
                      >
                        {copiedKey === `aaaa-rec-${index}` ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        {copiedKey === `aaaa-rec-${index}` ? 'Copied' : 'Copy'}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registrar Specific Visual Walkthrough */}
      <div id="registrar-guides" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-medium mb-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Registrar Step-by-Step
            </div>
            <h3 className="text-xl font-bold text-white">Select Your Domain Registrar</h3>
          </div>

          {/* Registrar Tabs */}
          <div className="flex flex-wrap gap-2">
            {REGISTRAR_GUIDES.map((guide) => (
              <button
                key={guide.id}
                onClick={() => setActiveRegistrar(guide.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                  activeRegistrar === guide.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {guide.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Guide Walkthrough */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-6">
            <div>
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                {selectedGuide.name} DNS Configuration Guide
              </h4>
              <p className="text-xs text-amber-400/90 mt-0.5">{selectedGuide.popularIn}</p>
            </div>
            {selectedGuide.notes && (
              <div className="text-xs text-slate-400 max-w-md bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="font-semibold text-slate-300">Pro-Tip: </span>
                {selectedGuide.notes}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {selectedGuide.instructions.map((step) => (
              <div key={step.stepNumber} className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 text-amber-400 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  {step.stepNumber}
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-semibold text-white">{step.title}</h5>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{step.description}</p>
                  {step.actionTip && (
                    <p className="text-xs text-rose-400 font-medium mt-1 bg-rose-950/30 px-2.5 py-1 rounded border border-rose-900/40 inline-block">
                      ⚠️ {step.actionTip}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Deployment Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" /> Verification Checklist
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Track your setup progress step by step to eliminate the InvalidDNSError error.
        </p>

        <div className="space-y-3">
          {TROUBLESHOOTING_CHECKLIST.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleStep(item.id)}
              className={`p-4 rounded-xl border transition cursor-pointer flex items-start gap-3.5 ${
                completedSteps[item.id]
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                  completedSteps[item.id]
                    ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                    : 'border-slate-700 bg-slate-900'
                }`}
              >
                {completedSteps[item.id] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GitHub Repository Quick Tools & File Generators */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <FileCode className="w-5 h-5 text-blue-400" /> GitHub Repo Asset Generators
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Download the pre-configured deployment files ready to push into your GitHub repository (<code>sriinfra2025-ops.github.io</code>).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm font-bold text-amber-400">/CNAME</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">Root File</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Required by GitHub Pages to bind <code>{COMPANY_INFO.customDomain}</code> to your site automatically without getting overwritten on rebuilds.
              </p>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800 font-mono text-xs text-emerald-400 mb-4">
                {COMPANY_INFO.customDomain}
              </div>
            </div>
            <button
              onClick={downloadCnameFile}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download CNAME File
            </button>
          </div>

          <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm font-bold text-blue-400">.github/workflows/deploy.yml</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">GitHub Actions</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Automated continuous deployment workflow that compiles Vite/React and deploys straight to GitHub Pages on every git push.
              </p>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800 font-mono text-[11px] text-slate-300 mb-4 overflow-hidden h-14 relative">
                <code>{`name: Deploy Sri Infra Developers\non: [push]\njobs: build-and-deploy...`}</code>
                <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-slate-900 to-transparent" />
              </div>
            </div>
            <button
              onClick={downloadGithubActionsWorkflow}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg transition flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download deploy.yml
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
