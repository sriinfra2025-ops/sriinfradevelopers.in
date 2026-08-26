import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Building, CheckCircle2, ShieldCheck, Award, FileText, User } from 'lucide-react';
import { COMPANY_INFO } from '../data/properties';
import { getLocalSettings, subscribeToSettings, CompanySettings } from '../utils/companyStorage';

interface ContactSectionProps {
  language: 'te' | 'en';
}

export const ContactSection: React.FC<ContactSectionProps> = ({ language }) => {
  const [settings, setSettings] = useState<CompanySettings>(() => getLocalSettings());

  useEffect(() => {
    const unsubscribe = subscribeToSettings((updated) => {
      setSettings(updated);
    });
    return unsubscribe;
  }, []);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 3000);
  };

  return (
    <section id="contact" className="py-16 bg-slate-950 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <MessageSquare className="w-3.5 h-3.5" /> Direct Venture Consultation
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {language === 'te' ? 'సంప్రదించండి (Contact Details)' : `Contact ${settings.name || COMPANY_INFO.name}`}
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            {language === 'te'
              ? `${settings.managingDirectorNameTelugu || COMPANY_INFO.managingDirector.nameTelugu} (మేనేజింగ్ డైరెక్టర్) గారిని నేరుగా సంప్రదించండి లేదా ఉచిత ఏసీ క్యాబ్ సైట్ విజిట్ బుక్ చేసుకోండి.`
              : `Direct consultation with Managing Director ${settings.managingDirectorName || COMPANY_INFO.managingDirector.name} and venture booking advisors.`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Info Card */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold mb-2">
                  <Award className="w-3.5 h-3.5" /> 10+ Years Trust • Proposed DTCP Layout
                </div>
                <h3 className="text-xl font-bold text-white mb-0.5">{settings.name || COMPANY_INFO.name}</h3>
                <div className="text-xs text-amber-300 font-semibold">{settings.nameTelugu || COMPANY_INFO.nameTelugu}</div>
              </div>

              {/* MD Box */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Managing Director</div>
                  <div className="font-bold text-white text-sm">
                    {settings.managingDirectorName || COMPANY_INFO.managingDirector.name} ({settings.managingDirectorNameTelugu || COMPANY_INFO.managingDirector.nameTelugu})
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3 text-slate-300">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white mb-0.5">Venture & Office Location:</strong>
                    {COMPANY_INFO.address}
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-300">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white mb-0.5">Contact Numbers:</strong>
                    <div className="font-mono text-amber-300 font-bold">{settings.phone || COMPANY_INFO.phone}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-300">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white mb-0.5">Email:</strong>
                    <div className="font-mono text-slate-300">{settings.email || COMPANY_INFO.email}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-300">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white mb-0.5">Consultation & Site Visits:</strong>
                    Monday – Sunday: 8:30 AM – 7:30 PM IST
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Direct Action */}
            <div className="bg-emerald-950/40 border border-emerald-800/50 p-4 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-400">WhatsApp Instant Connect</div>
                  <div className="text-[11px] text-slate-400">Get Brochure & Plot Map on WhatsApp</div>
                </div>
                <a
                  href={`https://wa.me/${settings.whatsapp || COMPANY_INFO.whatsapp}?text=Hello%20${encodeURIComponent(settings.managingDirectorName || 'Srinivas Bhoga')}%20garu,%20please%20send%20me%20the%20Sri%20Infra%20Brochure%20and%20plot%20details%20for%20the%20Pindiprolu%20Venture.`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Chat Now
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-1">Book Free Site Visit / Request Callback</h3>
            <p className="text-slate-400 text-xs mb-6">
              Our site managers provide pickup & drop service from Khammam / Warangal in AC Cab.
            </p>

            {sent ? (
              <div className="p-6 rounded-2xl bg-emerald-950/50 border border-emerald-500/50 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-base">Request Received Successfully!</h4>
                <p className="text-xs text-slate-300">
                  Sri Infra team will call you within 15 minutes to confirm your site visit.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98490 00000"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ramesh@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Your Plot Requirement / Visit Date</label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. Interested in 150/200 sq.yds East facing plot in Highway County. Requesting Sunday site visit."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" /> Submit Booking Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
