import React from 'react';
import { useAcademy } from '../context/AcademyContext';

export const PolicyPages: React.FC<{ type: 'privacy' | 'terms' }> = ({ type }) => {
  const { settings } = useAcademy();

  if (type === 'privacy') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-slate-300 space-y-6">
        <h1 className="text-3xl font-bold text-white font-['Cinzel',serif]">Privacy Policy</h1>
        <p className="text-xs text-amber-400">Last Updated: March 2025 • {settings.academyName}</p>

        <section className="space-y-3 text-xs sm:text-sm leading-relaxed">
          <h2 className="text-lg font-bold text-white font-['Cinzel',serif]">1. Information Collection</h2>
          <p>
            At {settings.academyName}, located at {settings.address}, we respect the privacy of all parents, students, and website visitors. We collect only personal data submitted voluntarily through admission enquiry forms, contact requests, and virtual counseling appointments (such as parent names, student names, phone numbers, and educational preferences).
          </p>
        </section>

        <section className="space-y-3 text-xs sm:text-sm leading-relaxed">
          <h2 className="text-lg font-bold text-white font-['Cinzel',serif]">2. Purpose and Use of Data</h2>
          <p>
            The collected information is used solely for processing admission applications, contacting parents regarding test schedules, sharing academic fee schedules, and coordinating virtual or campus interviews. We do not sell, rent, or trade personal data to third parties.
          </p>
        </section>

        <section className="space-y-3 text-xs sm:text-sm leading-relaxed">
          <h2 className="text-lg font-bold text-white font-['Cinzel',serif]">3. Security</h2>
          <p>
            All submitted enquiries are stored in secure databases with role-based access control restricted strictly to authorized academy administrators.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-slate-300 space-y-6">
      <h1 className="text-3xl font-bold text-white font-['Cinzel',serif]">Terms & Conditions</h1>
      <p className="text-xs text-amber-400">Last Updated: March 2025 • {settings.academyName}</p>

      <section className="space-y-3 text-xs sm:text-sm leading-relaxed">
        <h2 className="text-lg font-bold text-white font-['Cinzel',serif]">1. Academy Admission Code</h2>
        <p>
          Admission to {settings.academyName} is subject to student evaluation, seat availability in residential or day-boarding batches, and agreement by parents to uphold our Islamic and behavioral standards (Adab & Akhlaq).
        </p>
      </section>

      <section className="space-y-3 text-xs sm:text-sm leading-relaxed">
        <h2 className="text-lg font-bold text-white font-['Cinzel',serif]">2. Fee Policy & Transparency</h2>
        <p>
          Fee structures published on this portal are approved by academy administration. Tuition and boarding fees are payable monthly in advance. Fees once paid for admitted sessions are regulated according to the official school prospectus.
        </p>
      </section>

      <section className="space-y-3 text-xs sm:text-sm leading-relaxed">
        <h2 className="text-lg font-bold text-white font-['Cinzel',serif]">3. Contact & Enquiries</h2>
        <p>
          For queries regarding admissions or terms, contact us at +91 {settings.phone} or {settings.email}.
        </p>
      </section>
    </div>
  );
};
