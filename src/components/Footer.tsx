import React, { useState, useEffect } from 'react';
import { Building2, Wrench, ShieldCheck, Mail, Phone, Camera, Lock } from 'lucide-react';
import { COMPANY_INFO } from '../data/properties';
import { getLocalSettings, subscribeToSettings, CompanySettings } from '../utils/companyStorage';

interface FooterProps {
  onOpenDnsDoctor: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDnsDoctor }) => {
  const [settings, setSettings] = useState<CompanySettings>(() => getLocalSettings());

  useEffect(() => {
    const unsubscribe = subscribeToSettings((updated) => {
      setSettings(updated);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const phoneDisplay = settings.phone || COMPANY_INFO.phone;
  const emailDisplay = settings.email || COMPANY_INFO.email;
  const addressDisplay = settings.address || COMPANY_INFO.address;

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <Building2 className="w-5 h-5 text-amber-400" /> {settings.name || COMPANY_INFO.name}
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Leading infrastructure and gated township developer with 10+ years of delivering clear-title DTCP and RERA approved open plots on Khammam-Warangal Highway.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-amber-400 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% DTCP & RERA Approved
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Ventures & Plots</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#projects" className="hover:text-amber-400 transition">Sri Infra Highway County</a></li>
              <li><a href="#projects" className="hover:text-amber-400 transition">Pindiprolu Venture Plots</a></li>
              <li><a href="#projects" className="hover:text-amber-400 transition">Guest House Villa Plots</a></li>
              <li><a href="#projects" className="hover:text-amber-400 transition">Commercial Highway Plots</a></li>
            </ul>
          </div>

          {/* Tools & Updates */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Features & Management</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#master-plan" className="hover:text-amber-400 transition">Updated Master Layout</a></li>
              <li>
                <a href="#daily-updates" className="hover:text-amber-400 transition flex items-center gap-1.5 text-amber-400">
                  <Camera className="w-3.5 h-3.5" /> Daily Site Progress Feed
                </a>
              </li>
              <li>
                <button
                  onClick={() => {
                    window.location.hash = '#admin';
                    window.dispatchEvent(new CustomEvent('sri_infra_open_admin_portal'));
                  }}
                  className="hover:text-amber-400 transition flex items-center gap-1.5 cursor-pointer text-slate-400 font-medium text-left"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" /> Sri Infra Admin Portal (/admin)
                </button>
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
              {addressDisplay}
            </p>
            <div className="space-y-1 text-xs">
              <div>Phone: <a href={`tel:${phoneDisplay.split('/')[0].trim()}`} className="text-slate-300 hover:text-white">{phoneDisplay}</a></div>
              <div>Email: <a href={`mailto:${emailDisplay}`} className="text-slate-300 hover:text-white">{emailDisplay}</a></div>
              <div className="text-amber-400 pt-1 font-semibold">MD: Srinivas Bhoga</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} {settings.name || COMPANY_INFO.name}. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <a href={`https://${COMPANY_INFO.customDomain}`} target="_blank" rel="noreferrer" className="hover:text-slate-300">
              {COMPANY_INFO.customDomain}
            </a>
            <span>•</span>
            <button
              onClick={() => {
                window.location.hash = '#admin';
                window.dispatchEvent(new CustomEvent('sri_infra_open_admin_portal'));
              }}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-bold"
            >
              <Lock className="w-3 h-3" /> Admin Login
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
