import React, { useState } from 'react';
import {
  MapPin,
  ShieldCheck,
  Maximize2,
  CheckCircle2,
  Calendar,
  Download,
  PhoneCall,
  Sparkles,
  ArrowUpRight,
  Compass
} from 'lucide-react';
import { PROPERTY_PROJECTS } from '../data/properties';
import { PropertyProject } from '../types';

interface ProjectGalleryProps {
  onSelectProjectForSiteVisit: (project: PropertyProject) => void;
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({
  onSelectProjectForSiteVisit,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Villa Plots', 'Gated Community', 'Farmlands', 'Commercial'];

  const filteredProjects =
    activeCategory === 'All'
      ? PROPERTY_PROJECTS
      : PROPERTY_PROJECTS.filter((p) => p.category === activeCategory);

  const handleDownloadBrochure = (projectName: string) => {
    alert(`Downloading Official Brochure & DTCP / RERA Documents for "${projectName}".`);
  };

  const handleScrollToMasterLayout = () => {
    const el = document.getElementById('master-plan');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="projects" className="py-16 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> DTCP & RERA Approved Layouts
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Our Prime Residential & Commercial Ventures
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            100% legally vetted ventures with DTCP final approvals, RERA registration, and complete infrastructure.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-slate-700 transition flex flex-col group"
            >
              {/* Image Banner */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Badge tags */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-amber-500 text-slate-950 text-xs font-bold rounded-lg shadow-md">
                    {project.category}
                  </span>
                  <span className="px-3 py-1 bg-slate-900/90 text-amber-300 text-xs font-semibold rounded-lg backdrop-blur-sm border border-slate-700">
                    RERA: {project.reraNumber}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white drop-shadow-md">{project.title}</h3>
                    <p className="text-xs text-amber-300 flex items-center gap-1 drop-shadow">
                      <MapPin className="w-3.5 h-3.5" /> {project.location}
                    </p>
                  </div>
                  <div className="text-right bg-slate-950/80 px-3 py-1.5 rounded-lg backdrop-blur-md border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Starts from</div>
                    <div className="text-base font-extrabold text-amber-400">{project.pricePerSqYd}<span className="text-[11px] font-normal text-slate-400">/sq.yd</span></div>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <div className="text-xs font-semibold text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800 mb-4 flex items-center justify-between">
                    <span>Plot Sizes: <strong>{project.sizeRange}</strong></span>
                    <span className="text-emerald-400 font-bold">Available: {project.availablePlots} of {project.totalPlots}</span>
                  </div>

                  {/* Approvals */}
                  <div className="mb-4">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Legal Approvals & Title
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {project.approvals.map((appr) => (
                        <span
                          key={appr}
                          className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 font-medium"
                        >
                          <ShieldCheck className="w-3 h-3 text-emerald-400" /> {appr}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Highlights / Amenities */}
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Infrastructure On-Site
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300">
                      {project.features.map((feat) => (
                        <li key={feat} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleScrollToMasterLayout}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 py-2 px-3 rounded-xl bg-amber-500/10 border border-amber-500/30 transition cursor-pointer"
                    >
                      <Compass className="w-3.5 h-3.5" /> View Master Layout
                    </button>

                    <button
                      onClick={() => handleDownloadBrochure(project.title)}
                      className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Brochure
                    </button>
                  </div>

                  <button
                    onClick={() => onSelectProjectForSiteVisit(project)}
                    className="text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 py-2 px-4 rounded-xl transition shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" /> Free Site Visit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
