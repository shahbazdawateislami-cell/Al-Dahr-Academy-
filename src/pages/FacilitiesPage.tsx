import React from 'react';
import { useAcademy } from '../context/AcademyContext';
import {
  Home,
  Moon,
  Building,
  Atom,
  Utensils,
  Shield,
  Trophy,
  Heart,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const FacilitiesPage: React.FC = () => {
  const { facilities, setIsAdmissionModalOpen } = useAcademy();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          Campus Infrastructure
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Cinzel',serif] tracking-tight">
          Comprehensive Campus Facilities
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          State-of-the-art residential boarding, quiet prayer Musalla, smart classrooms, science labs, and lush playgrounds designed for student peace and productivity.
        </p>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {facilities.map((fac) => (
          <div
            key={fac.id}
            className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between group hover:border-amber-500/40 transition duration-300 shadow-xl"
          >
            <div className="h-52 overflow-hidden bg-slate-950 relative">
              <img
                src={fac.imageUrl}
                alt={fac.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            </div>

            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-['Cinzel',serif] text-white group-hover:text-amber-400 transition">
                  {fac.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {fac.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Phulwari Sharif Campus Amenity</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Campus Visit Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-amber-500/40 p-8 sm:p-12 text-center space-y-4">
        <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
        <h2 className="text-2xl sm:text-3xl font-bold font-['Cinzel',serif]">
          Inspect Our Facilities in Person
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          We welcome parents to tour our residential dormitories, observe the meal preparation, and walk through our learning labs at Phulwari Sharif, Patna.
        </p>
        <button
          onClick={() => setIsAdmissionModalOpen(true)}
          className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-xl transition"
        >
          Book a Campus Tour
        </button>
      </div>
    </div>
  );
};
