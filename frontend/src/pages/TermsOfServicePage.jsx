import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const Section = ({ title, children }) => (
  <div className="space-y-3">
    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
    <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
  </div>
);

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-16 space-y-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Terms of Service</h1>
          <p className="text-sm text-gray-400">Last updated: August 26, 2026</p>
        </div>

        <p className="text-gray-600 leading-relaxed">
          These terms govern your use of the SmartClinic website and patient portal. By creating an
          account, requesting an appointment, or otherwise using the platform, you agree to the terms
          below.
        </p>

        <Section title="1. Using the Platform">
          <ul className="list-disc pl-6 space-y-1">
            <li>You must provide accurate information when registering or requesting an appointment.</li>
            <li>You are responsible for keeping your login credentials confidential and for all activity under your account.</li>
            <li>Accounts are for personal use — one account per patient. A parent or guardian may manage bookings on behalf of a minor.</li>
          </ul>
        </Section>

        <Section title="2. Appointments &amp; Requests">
          <p>
            Submitting an appointment request through the site or your portal does not guarantee a
            confirmed slot. Our reception team reviews each request and will contact you to confirm the
            date, time, and doctor. We reserve the right to reschedule or decline a request when a
            requested slot is unavailable.
          </p>
        </Section>

        <Section title="3. Medical Disclaimer">
          <p>
            SmartClinic's website and portal are administrative tools for booking and record-keeping —
            they are not a substitute for professional medical advice, diagnosis, or treatment. In a
            medical emergency, contact emergency services directly rather than using this platform.
          </p>
        </Section>

        <Section title="4. Billing">
          <p>
            Invoices generated through the platform reflect services rendered at the clinic. Payment
            terms and accepted methods (cash, EVC Plus, card, or insurance) are handled directly with our
            billing team. Disputed charges should be raised with reception as soon as possible.
          </p>
        </Section>

        <Section title="5. Acceptable Use">
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Attempt to access another patient's records, appointments, or billing information.</li>
            <li>Submit false medical or contact information.</li>
            <li>Use automated tools to scrape, spam, or overload the booking system.</li>
          </ul>
        </Section>

        <Section title="6. Changes to These Terms">
          <p>
            We may update these terms from time to time to reflect changes to our services. Continued use
            of the platform after an update constitutes acceptance of the revised terms.
          </p>
        </Section>

        <Section title="7. Contact Us">
          <p>
            Questions about these terms can be sent to{' '}
            <a href="mailto:contact@smartclinic.com" className="text-emerald-600 font-semibold hover:underline">contact@smartclinic.com</a>.
          </p>
        </Section>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfServicePage;
