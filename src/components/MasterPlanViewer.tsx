import React, { useState } from 'react';
import {
  Compass,
  CheckCircle,
  Eye,
  Tag,
  Info,
  CalendarCheck,
  Filter,
  Sparkles,
  Download,
  Layers,
  Map,
  ShieldCheck,
  Trees,
  Car,
  Home,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { COMPANY_INFO } from '../data/properties';

export interface MasterPlotData {
  id: number;
  plotNumber: string;
  sizeSqYd: number;
  facing: 'East' | 'West' | 'North' | 'Corner (NE)' | 'Corner (NW)' | 'North-East Corner';
  dimensions: string;
  status: 'available' | 'booked' | 'reserved';
  ratePerSqYd: number;
  sector: 'Sector A: Villa Plots (₹5,999)' | 'Sector B: Weekend Homes (₹5,999)' | 'Commercial Highway Frontage';
}

const MASTER_LAYOUT_PLOTS: MasterPlotData[] = [
  // Sector A: Villa Plots (Special Launch Offer ₹5,999)
  { id: 1, plotNumber: 'P-01', sizeSqYd: 200, facing: 'Corner (NE)', dimensions: '36 x 50 ft', status: 'available', ratePerSqYd: 5999, sector: 'Sector A: Villa Plots (₹5,999)' },
  { id: 2, plotNumber: 'P-02', sizeSqYd: 165, facing: 'East', dimensions: '33 x 45 ft', status: 'reserved', ratePerSqYd: 5999, sector: 'Sector A: Villa Plots (₹5,999)' },
  { id: 3, plotNumber: 'P-03', sizeSqYd: 165, facing: 'East', dimensions: '33 x 45 ft', status: 'booked', ratePerSqYd: 5999, sector: 'Sector A: Villa Plots (₹5,999)' },
  { id: 4, plotNumber: 'P-04', sizeSqYd: 150, facing: 'East', dimensions: '30 x 45 ft', status: 'available', ratePerSqYd: 5999, sector: 'Sector A: Villa Plots (₹5,999)' },
  { id: 5, plotNumber: 'P-05', sizeSqYd: 150, facing: 'East', dimensions: '30 x 45 ft', status: 'available', ratePerSqYd: 5999, sector: 'Sector A: Villa Plots (₹5,999)' },
  { id: 6, plotNumber: 'P-06', sizeSqYd: 200, facing: 'Corner (NW)', dimensions: '36 x 50 ft', status: 'booked', ratePerSqYd: 5999, sector: 'Sector A: Villa Plots (₹5,999)' },

  { id: 7, plotNumber: 'P-07', sizeSqYd: 220, facing: 'Corner (NE)', dimensions: '38 x 52 ft', status: 'available', ratePerSqYd: 5999, sector: 'Sector A: Villa Plots (₹5,999)' },
  { id: 8, plotNumber: 'P-08', sizeSqYd: 165, facing: 'West', dimensions: '33 x 45 ft', status: 'booked', ratePerSqYd: 5999, sector: 'Sector A: Villa Plots (₹5,999)' },
  { id: 9, plotNumber: 'P-09', sizeSqYd: 165, facing: 'West', dimensions: '33 x 45 ft', status: 'available', ratePerSqYd: 5999, sector: 'Sector A: Villa Plots (₹5,999)' },
  { id: 10, plotNumber: 'P-10', sizeSqYd: 180, facing: 'West', dimensions: '36 x 45 ft', status: 'available', ratePerSqYd: 5999, sector: 'Sector A: Villa Plots (₹5,999)' },
  { id: 11, plotNumber: 'P-11', sizeSqYd: 180, facing: 'West', dimensions: '36 x 45 ft', status: 'reserved', ratePerSqYd: 5999, sector: 'Sector A: Villa Plots (₹5,999)' },
  { id: 12, plotNumber: 'P-12', sizeSqYd: 220, facing: 'Corner (NW)', dimensions: '38 x 52 ft', status: 'available', ratePerSqYd: 5999, sector: 'Sector A: Villa Plots (₹5,999)' },

  // Sector B: Weekend Homes
  { id: 13, plotNumber: 'W-01', sizeSqYd: 250, facing: 'Corner (NE)', dimensions: '40 x 56 ft', status: 'available', ratePerSqYd: 5999, sector: 'Sector B: Weekend Homes (₹5,999)' },
  { id: 14, plotNumber: 'W-02', sizeSqYd: 200, facing: 'North', dimensions: '36 x 50 ft', status: 'booked', ratePerSqYd: 5999, sector: 'Sector B: Weekend Homes (₹5,999)' },
  { id: 15, plotNumber: 'W-03', sizeSqYd: 200, facing: 'North', dimensions: '36 x 50 ft', status: 'available', ratePerSqYd: 5999, sector: 'Sector B: Weekend Homes (₹5,999)' },
  { id: 16, plotNumber: 'W-04', sizeSqYd: 220, facing: 'North', dimensions: '38 x 52 ft', status: 'available', ratePerSqYd: 5999, sector: 'Sector B: Weekend Homes (₹5,999)' },
  { id: 17, plotNumber: 'W-05', sizeSqYd: 220, facing: 'North', dimensions: '38 x 52 ft', status: 'reserved', ratePerSqYd: 5999, sector: 'Sector B: Weekend Homes (₹5,999)' },
  { id: 18, plotNumber: 'W-06', sizeSqYd: 250, facing: 'Corner (NW)', dimensions: '40 x 56 ft', status: 'available', ratePerSqYd: 5999, sector: 'Sector B: Weekend Homes (₹5,999)' },

  // Commercial Highway Frontage
  { id: 19, plotNumber: 'C-01', sizeSqYd: 350, facing: 'North-East Corner', dimensions: '45 x 70 ft', status: 'available', ratePerSqYd: 8999, sector: 'Commercial Highway Frontage' },
  { id: 20, plotNumber: 'C-02', sizeSqYd: 300, facing: 'East', dimensions: '40 x 67 ft', status: 'reserved', ratePerSqYd: 8999, sector: 'Commercial Highway Frontage' },
  { id: 21, plotNumber: 'C-03', sizeSqYd: 300, facing: 'East', dimensions: '40 x 67 ft', status: 'booked', ratePerSqYd: 8999, sector: 'Commercial Highway Frontage' },
  { id: 22, plotNumber: 'C-04', sizeSqYd: 400, facing: 'Corner (NE)', dimensions: '50 x 72 ft', status: 'available', ratePerSqYd: 8999, sector: 'Commercial Highway Frontage' },
];

interface MasterPlanViewerProps {
  onSelectPlot: (plot: MasterPlotData) => void;
  language: 'te' | 'en';
}

export const MasterPlanViewer: React.FC<MasterPlanViewerProps> = ({ onSelectPlot, language }) => {
  const [activeSector, setActiveSector] = useState<string>('Sector A: Villa Plots (₹5,999)');
  const [selectedPlot, setSelectedPlot] = useState<MasterPlotData | null>(MASTER_LAYOUT_PLOTS[0]);
  const [filterFacing, setFilterFacing] = useState<string>('All');
  const [downloadNote, setDownloadNote] = useState<string | null>(null);

  const sectors = [
    'Sector A: Villa Plots (₹5,999)',
    'Sector B: Weekend Homes (₹5,999)',
    'Commercial Highway Frontage',
  ];

  const sectorPlots = MASTER_LAYOUT_PLOTS.filter((p) => p.sector === activeSector);

  const filteredPlots = sectorPlots.filter((plot) => {
    if (filterFacing !== 'All' && !plot.facing.includes(filterFacing)) return false;
    return true;
  });

  const availableCount = sectorPlots.filter((p) => p.status === 'available').length;
  const reservedCount = sectorPlots.filter((p) => p.status === 'reserved').length;
  const bookedCount = sectorPlots.filter((p) => p.status === 'booked').length;

  const handleDownloadMap = () => {
    setDownloadNote(`Master Layout Map PDF downloaded for ${selectedPlot?.sector || 'Sri Infra Highway County'}`);
    setTimeout(() => setDownloadNote(null), 4000);
  };

  return (
    <section id="master-plan" className="py-16 bg-slate-950 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" /> Proposed DTCP Approved Layout
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            {language === 'te' ? 'మాస్టర్ లేఅవుట్ ప్లాన్ (ఇంటరాక్టివ్)' : 'Interactive Master Layout Map'}
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            {language === 'te'
              ? '40 మరియు 33 అడుగుల బ్లాక్ టాప్ రోడ్లు, అండర్ గ్రౌండ్ డ్రైనేజ్, మరియు సెంట్రల్ లైటింగ్ తో కూడిన వెంచర్ లేఅవుట్.'
              : 'Proposed DTCP layout with 40ft & 33ft BT roads, underground drainage, central street lighting, and children park.'}
          </p>
        </div>

        {/* Sector Selection Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {sectors.map((sec) => (
            <button
              key={sec}
              onClick={() => {
                setActiveSector(sec);
                const first = MASTER_LAYOUT_PLOTS.find((p) => p.sector === sec);
                if (first) setSelectedPlot(first);
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                activeSector === sec
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 font-black'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" /> {sec}
            </button>
          ))}
        </div>

        {/* Legend & Filter Bar */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-emerald-500 inline-block shadow-sm" />
              <span className="text-slate-300 font-bold">Available ({availableCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-amber-500 inline-block shadow-sm" />
              <span className="text-slate-300 font-bold">Reserved ({reservedCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-slate-700 inline-block" />
              <span className="text-slate-400">Sold / Booked ({bookedCount})</span>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-slate-400 font-medium">
              <Filter className="w-3.5 h-3.5 text-amber-400" /> Vaastu Facing:
            </div>
            {['All', 'East', 'West', 'North', 'Corner'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterFacing(f)}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${
                  filterFacing === f ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Master Layout Visualization Grid & Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Visual Layout Map */}
          <div className="lg:col-span-8 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-2xl">
            {/* Top 40-Feet Road Banner */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-300 mb-5">
              <span className="flex items-center gap-2 font-black text-amber-400">
                <Car className="w-4 h-4 text-amber-400" /> 40-FEET MAIN BLACK TOP CORRIDOR ROAD (NORTH)
              </span>
              <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Proposed DTCP Approved
              </span>
            </div>

            {/* Layout Amenities Strip */}
            <div className="grid grid-cols-3 gap-2 mb-5 text-[11px] text-slate-400 text-center">
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center justify-center gap-1.5 text-emerald-400 font-semibold">
                <Trees className="w-3.5 h-3.5" /> Avenue Plantation
              </div>
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center justify-center gap-1.5 text-amber-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Grand Entrance Arch
              </div>
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center justify-center gap-1.5 text-blue-300 font-semibold">
                <Zap className="w-3.5 h-3.5" /> Central Street Lights
              </div>
            </div>

            {/* Grid of Plots */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {filteredPlots.map((plot) => {
                const isSelected = selectedPlot?.id === plot.id;
                const statusBg =
                  plot.status === 'available'
                    ? isSelected
                      ? 'bg-emerald-500 ring-4 ring-amber-400/80 text-slate-950 font-black shadow-lg shadow-emerald-500/40'
                      : 'bg-emerald-950/60 border border-emerald-500/50 hover:bg-emerald-800/80 text-emerald-200 shadow'
                    : plot.status === 'reserved'
                    ? isSelected
                      ? 'bg-amber-500 ring-4 ring-white text-slate-950 font-black shadow-lg shadow-amber-500/40'
                      : 'bg-amber-950/60 border border-amber-500/50 hover:bg-amber-800/80 text-amber-200 shadow'
                    : 'bg-slate-950 border border-slate-800 text-slate-600 opacity-60 cursor-not-allowed';

                return (
                  <button
                    key={plot.id}
                    onClick={() => {
                      if (plot.status !== 'booked') setSelectedPlot(plot);
                    }}
                    className={`h-28 rounded-2xl p-2.5 flex flex-col justify-between text-left transition transform active:scale-95 ${statusBg} ${
                      plot.status !== 'booked' ? 'cursor-pointer hover:scale-105' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold">{plot.plotNumber}</span>
                      {plot.facing.includes('Corner') && (
                        <span className="text-[8px] bg-amber-400 text-slate-950 px-1 py-0.5 rounded font-black">
                          CORNER
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] space-y-0.5">
                      <div className="font-bold">{plot.sizeSqYd} Sq.Yds</div>
                      <div className="opacity-80 text-[9px] truncate">{plot.facing}</div>
                    </div>

                    <div className="text-[9px] font-mono opacity-90 truncate">
                      {plot.dimensions}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom 33-Feet Road Marking */}
            <div className="mt-5 bg-slate-950 p-3 rounded-xl border border-slate-800 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <Car className="w-4 h-4 text-slate-500" /> 33-FEET INTERNAL CROSS ROAD (SOUTH) • UNDERGROUND DRAINAGE & ELECTRICITY
            </div>
          </div>

          {/* Selected Plot Detail Inspector */}
          <div className="lg:col-span-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
            {selectedPlot ? (
              <>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">{selectedPlot.sector}</span>
                    <h3 className="text-3xl font-black text-white">{selectedPlot.plotNumber}</h3>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                      selectedPlot.status === 'available'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : selectedPlot.status === 'reserved'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {selectedPlot.status}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-slate-800/80">
                    <span className="text-slate-400">Total Plot Area:</span>
                    <span className="font-bold text-white">{selectedPlot.sizeSqYd} Sq. Yards ({selectedPlot.sizeSqYd * 9} Sq.Ft)</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800/80">
                    <span className="text-slate-400">Plot Dimensions:</span>
                    <span className="font-bold text-white">{selectedPlot.dimensions}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800/80">
                    <span className="text-slate-400">Vaastu Orientation:</span>
                    <span className="font-bold text-amber-300">{selectedPlot.facing} Facing</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800/80">
                    <span className="text-slate-400">Special Offer Rate:</span>
                    <span className="font-black text-amber-400">₹{selectedPlot.ratePerSqYd.toLocaleString()} / Sq. Yd</span>
                  </div>
                  <div className="flex justify-between py-3 bg-slate-950 px-4 rounded-xl border border-slate-800 text-sm">
                    <span className="text-slate-300 font-bold">Total Plot Value:</span>
                    <span className="font-black text-emerald-400 text-lg">
                      ₹{(selectedPlot.sizeSqYd * selectedPlot.ratePerSqYd).toLocaleString()}
                    </span>
                  </div>
                </div>

                {downloadNote && (
                  <div className="p-3 bg-emerald-950/60 border border-emerald-700/60 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{downloadNote}</span>
                  </div>
                )}

                <div className="pt-2 space-y-3">
                  <button
                    onClick={() => onSelectPlot(selectedPlot)}
                    className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CalendarCheck className="w-4 h-4" /> Book Free AC Cab Site Visit for {selectedPlot.plotNumber}
                  </button>

                  <button
                    onClick={handleDownloadMap}
                    className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" /> Download Layout Map PDF
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                <Info className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                Select any plot from the layout grid to inspect.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
