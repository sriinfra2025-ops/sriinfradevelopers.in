import React from 'react';
import {
  ShieldCheck,
  Award,
  BadgeCheck,
  CheckCircle,
  FileText,
  Gem,
  Clock,
  Compass,
  Plane,
  Home,
  Zap,
  TrendingUp,
  CreditCard,
  Building
} from 'lucide-react';
import { COMPANY_INFO, BROCHURE_PILLARS } from '../data/properties';

interface WhyChooseUsProps {
  language: 'te' | 'en';
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ language }) => {
  const pillars = [
    {
      icon: <TrendingUp className="w-6 h-6 text-amber-400" />,
      titleTelugu: 'అత్యధిక లాభాలు & అప్రిషియేషన్',
      titleEn: 'Highest Capital Appreciation',
      descTelugu: 'ఖమ్మం - వరంగల్ నేషనల్ హైవే ప్రక్కన ఉండటంతో వేగవంతమైన భూమి విలువ పెరుగుదల మరియు పెట్టుబడికి రెట్టింపు లాభాలు.',
      descEn: 'Located right beside the Khammam to Warangal National Highway corridor ensuring multifold asset growth.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      titleTelugu: 'భద్రత మైన పెట్టుబడి (100% Secure)',
      titleEn: '100% Safe & Secure Investment',
      descTelugu: 'ప్రభుత్వ నిబంధనల ప్రకారం స్పష్టమైన డాక్యుమెంట్స్, కంచె మరియు 24/7 సెక్యూరిటీ పర్యవేక్షణ.',
      descEn: 'Fully secured plotted layout with 30-year link document legal vetting and 24/7 security watch.',
    },
    {
      icon: <Plane className="w-6 h-6 text-blue-400" />,
      titleTelugu: 'నూతన మామ్మూర్ ఎయిర్ పోర్ట్ కి 1 గంట ప్రయాణం',
      titleEn: '1 Hour to Mamnoor International Airport',
      descTelugu: 'వరంగల్ / మామ్మూర్ ఇంటర్నేషనల్ ఎయిర్ పోర్ట్ కి అత్యంత సమీపంలో ఉండటం వలన భవిష్యత్తులో డిమాండ్ పెరుగుతుంది.',
      descEn: 'Strategic high-connectivity zone within 1 hour commute to the upcoming Mamnoor International Airport.',
    },
    {
      icon: <Home className="w-6 h-6 text-purple-400" />,
      titleTelugu: 'వీకెండ్ హోమ్స్ & గృహ నిర్మాణాలు',
      titleEn: 'Weekend Homes & Custom Villa Construction',
      descTelugu: 'మేమే స్వయంగా మీ కోరిక మేరకు అందమైన వీకెండ్ గెస్ట్ హౌస్ లేదా లగ్జరీ ఇండిపెండెంట్ ఇళ్ళు నిర్మించి ఇస్తాము.',
      descEn: 'Turnkey architectural and civil construction services for weekend getaway guest houses and villas.',
    },
    {
      icon: <CreditCard className="w-6 h-6 text-rose-400" />,
      titleTelugu: 'బ్యాంకు లోన్ సౌకర్యం & తక్షణ రిజిస్ట్రేషన్',
      titleEn: 'Bank Loan Assistance & Spot Registration',
      descTelugu: 'ప్రముఖ బ్యాంకుల ద్వారా సులభ రుణ సహాయం మరియు సబ్-రిజిస్ట్రార్ ఆఫీసు వద్ద తక్షణ స్పాట్ రిజిస్ట్రేషన్.',
      descEn: 'Hassle-free housing and plot loan processing with immediate spot registration and passbook delivery.',
    },
    {
      icon: <Zap className="w-6 h-6 text-cyan-400" />,
      titleTelugu: '40ft & 33ft రోడ్లు, డ్రైనేజ్ & సెంట్రల్ లైటింగ్',
      titleEn: '40ft & 33ft Roads, Drainage & Central Lights',
      descTelugu: 'పూర్తి మౌలిక సదుపాయాలతో తక్షణమే గృహ నిర్మాణం చేసుకొనుటకు 4 గ్రామాల మధ్యలో సిద్ధంగా ఉన్న వెంచర్.',
      descEn: 'Complete civic infrastructure with underground drainage, tree avenues, central lighting, ready for instant home living.',
    },
  ];

  return (
    <section id="why-us" className="py-16 bg-slate-900 border-t border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" /> {COMPANY_INFO.name}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {language === 'te' ? 'మన వెంచర్ ని ఎందుకు ఎంచుకోవాలి?' : `Why Choose ${COMPANY_INFO.name}`}
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            {language === 'te'
              ? 'మీ యొక్క స్వల్ప పెట్టుబడి మీ భవిష్యత్తుకు బంగారు బాటగా మార్చే అత్యుత్తమ నేషనల్ హైవే వెంచర్.'
              : 'Over 10+ years of infrastructure trust with Proposed DTCP layouts, highway connectivity, and clear titles.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className="bg-slate-950/80 p-6 rounded-3xl border border-slate-800 hover:border-amber-500/40 transition flex flex-col justify-between space-y-4 shadow-lg group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:bg-amber-500/10 transition">
                  {pillar.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {language === 'te' ? pillar.titleTelugu : pillar.titleEn}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {language === 'te' ? pillar.descTelugu : pillar.descEn}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-900 flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
                <CheckCircle className="w-3 h-3" /> Proposed DTCP & Clear Title
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
