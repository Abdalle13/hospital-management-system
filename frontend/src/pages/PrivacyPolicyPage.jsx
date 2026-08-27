import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const Section = ({ title, children }) => (
  <div className="space-y-3">
    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
    <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
  </div>
);

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-16 space-y-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Privacy Policy</h1>
          <p className="text-sm text-gray-400">Last updated: August 26, 2026</p>
        </div>

        <p className="text-gray-600 leading-relaxed">
          SmartClinic ("we", "us", "our") provides an online platform for booking appointments, viewing
          medical records, and managing billing with our clinic. This policy explains what information
          we collect through the platform, how we use it, and the choices you have.
        </p>

        <Section title="1. Information We Collect">
          <p>When you register, book an appointment, or use your patient portal, we may collect:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Identity details — name, phone number, email address, date of birth, gender.</li>
            <li>Health information — appointment history, diagnoses, prescriptions, vital signs, and attached lab or imaging files you or your care team add to your record.</li>
            <li>Billing information — invoice history and payment status.</li>
            <li>Account activity — login timestamps and actions taken within the portal, used for security and audit purposes.</li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Information">
          <ul className="list-disc pl-6 space-y-1">
            <li>To schedule, confirm, and manage your appointments with our doctors.</li>
            <li>To maintain an accurate medical record accessible to you and your treating clinicians.</li>
            <li>To generate and track invoices for services rendered.</li>
            <li>To send you appointment confirmations and important account notifications.</li>
            <li>To keep the platform secure — for example, detecting suspicious login activity.</li>
          </ul>
        </Section>

        <Section title="3. Who Can See Your Information">
          <p>
            Access to your medical records, appointments, and billing is restricted to you, the clinicians
            directly involved in your care, and authorized administrative staff who need it to run the
            clinic (e.g. receptionists confirming a booking). We do not sell your personal or health
            information to third parties.
          </p>
        </Section>

        <Section title="4. Data Security">
          <p>
            We use industry-standard safeguards — encrypted connections, access controls based on your
            account role, and rate-limiting against abusive access — to protect your data from unauthorized
            access, alteration, or disclosure. No system is 100% secure, but we take reasonable steps to
            minimize risk.
          </p>
        </Section>

        <Section title="5. Your Rights">
          <p>You can, at any time:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>View and update your profile details from "My Profile" in the patient portal.</li>
            <li>Request a copy of your medical records by contacting our reception team.</li>
            <li>Ask us to correct inaccurate information held about you.</li>
            <li>Close your account by contacting the clinic directly.</li>
          </ul>
        </Section>

        <Section title="6. Contact Us">
          <p>
            Questions about this policy or your data can be sent to{' '}
            <a href="mailto:contact@smartclinic.com" className="text-emerald-600 font-semibold hover:underline">contact@smartclinic.com</a>{' '}
            or by visiting us at KM4 Area, Wadada Maka Al Mukarama, Mogadishu, Somalia.
          </p>
        </Section>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
