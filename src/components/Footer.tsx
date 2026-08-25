import React from 'react';
import { Building2, Globe, Wrench, ShieldCheck, Mail, Phone, Camera } from 'lucide-react';
import { COMPANY_INFO } from '../data/properties';

interface FooterProps {
  onOpenDnsDoctor: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDnsDoctor }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <Building2 className="w-5 h-5 text-amber-400" /> {COMPANY_INFO.name}
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Leading infrastructure and gated township developer with 10+ years of delivering clear-title DTCP and RERA approved open plots.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-amber-400 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% DTCP & RERA Approved
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Ventures & Plots</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#projects" className="hover:text-amber-400 transition">Sri Emerald County</a></li>
              <li><a href="#projects" className="hover:text-amber-400 transition">Sri Sai Grandeur Enclave</a></li>
              <li><a href="#projects" className="hover:text-amber-400 transition">Sri Green Meadows Farmlands</a></li>
              <li><a href="#projects" className="hover:text-amber-400 transition">Commercial Highway Plots</a></li>
            </ul>
          </div>

          {/* Tools & Updates */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Features & Updates</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#master-plan" className="hover:text-amber-400 transition">Updated Master Layout</a></li>
              <li>
                <a href="#daily-updates" className="hover:text-amber-400 transition flex items-center gap-1.5 text-amber-400">
                  <Camera className="w-3.5 h-3.5" /> Daily Site Progress Feed
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenDnsDoctor}
                  className="hover:text-amber-400 transition text-left flex items-center gap-1.5 cursor-pointer text-slate-400 font-medium"
                >
                  <Wrench className="w-3.5 h-3.5 text-amber-400" /> DNS Domain Status ({COMPANY_INFO.customDomain})
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Head Office (10+ Yrs)</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              {COMPANY_INFO.address}
            </p>
            <div className="space-y-1 text-xs">
              <div>Phone: <a href={`tel:${COMPANY_INFO.phone.split('/')[0].trim()}`} className="text-slate-300 hover:text-white">{COMPANY_INFO.phone}</a></div>
              <div>Email: <a href={`mailto:${COMPANY_INFO.email}`} className="text-slate-300 hover:text-white">{COMPANY_INFO.email}</a></div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved. 10+ Years in Real Estate Development.
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-slate-300">
              Configured for <code>{COMPANY_INFO.customDomain}</code> & GitHub Pages
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
