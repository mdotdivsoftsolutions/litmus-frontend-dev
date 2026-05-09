import { Shield } from "lucide-react";
import { PolicyHero } from "./components/policies/PolicyHero";
import { PolicyArticle } from "./components/policies/PolicyArticle";

export default function PrivacyPage() {
  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen">
      <PolicyHero
        icon={Shield}
        eyebrow="Trust · Data & privacy"
        title={
          <>
            Privacy{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">
              Policy
            </span>
          </>
        }
        subtitle="How we collect, use, store, and share personal information when you book tests, speak with support, or browse Litmus. Demo policy text — have your legal team review before launch."
      />
      <PolicyArticle lastUpdated="May 9, 2026">
        <p>
          Litmus respects your privacy. This policy explains what we collect, why we collect it, and the choices you have.
          Capitalized terms used in orders or terms of service apply here as well where relevant.
        </p>

        <h2>1. Information we collect</h2>
        <ul>
          <li>
            <strong>Account &amp; profile:</strong> name, phone number, email, city, and optional demographics you choose to share.
          </li>
          <li>
            <strong>Health &amp; order context:</strong> test selections, referrals, prescription uploads when required, and notes you add for phlebotomy or lab handling.
          </li>
          <li>
            <strong>Payment:</strong> payment instrument metadata via our PCI-compliant payment partners — we do not store full card numbers on Litmus servers.
          </li>
          <li>
            <strong>Device &amp; usage:</strong> IP address, browser type, coarse location, cookies, and product analytics events to improve reliability and fraud prevention.
          </li>
        </ul>

        <h2>2. How we use information</h2>
        <p>
          We use personal data to schedule collections, route orders to labs, deliver reports, send transactional notifications,
          provide customer support, comply with law, and improve our services. With your consent, we may send marketing messages;
          you can opt out anytime from message footers or account settings when available.
        </p>

        <h2>3. Sharing</h2>
        <p>
          We share the minimum necessary information with partner laboratories, logistics vendors, and payment processors to fulfil your order.
          We may disclose information if required by regulation, court order, or to protect the safety of users and the public.
        </p>

        <h2>4. Retention</h2>
        <p>
          We retain order and report-related records as needed for healthcare compliance, dispute resolution, and auditing,
          then delete or anonymize according to internal schedules and applicable law.
        </p>

        <h2>5. Security</h2>
        <p>
          We apply administrative, technical, and organizational safeguards designed to protect personal data. No method of transmission
          over the Internet is perfectly secure; please use strong passwords and report suspicious activity to Support.
        </p>

        <h2>6. Your rights</h2>
        <p>
          Depending on where you live, you may have rights to access, correct, export, or delete certain personal data, and to object to some processing.
          Contact us to exercise these rights; we may verify your identity before responding.
        </p>

        <h2>7. Changes</h2>
        <p>We may update this policy periodically. Material changes will be highlighted on the site or via email where appropriate.</p>
      </PolicyArticle>
    </div>
  );
}
