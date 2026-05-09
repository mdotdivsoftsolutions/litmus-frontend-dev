import { Scale } from "lucide-react";
import { PolicyHero } from "./components/policies/PolicyHero";
import { PolicyArticle } from "./components/policies/PolicyArticle";

export default function TermsPage() {
  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen">
      <PolicyHero
        icon={Scale}
        eyebrow="Legal · Terms of use"
        title={
          <>
            Terms &amp;{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">
              Conditions
            </span>
          </>
        }
        subtitle="These terms describe how you may use Litmus diagnostics booking, payments, and reports. Demo copy for product preview — replace with counsel-reviewed language before production."
      />
      <PolicyArticle lastUpdated="May 9, 2026">
        <p>
          Welcome to Litmus. By accessing our website, mobile experience, or placing an order for laboratory testing services,
          you agree to the following terms. If you do not agree, please discontinue use of our services.
        </p>

        <h2>1. Services</h2>
        <p>
          Litmus operates as a marketplace and coordination layer between you and accredited partner laboratories. Test menus,
          turnaround times, and pricing are displayed in good faith and may change based on sample type, location, or lab capacity.
          Final scope is confirmed at checkout and in your order confirmation.
        </p>

        <h2>2. Orders &amp; payment</h2>
        <p>
          When you book a test or package, you authorize us to charge the payment method you provide for the quoted amount,
          including applicable taxes and collection fees. Orders are binding once payment succeeds unless cancelled under our
          cancellation rules communicated at checkout.
        </p>
        <ul>
          <li>Home collection slots are offered subject to availability in your pin code.</li>
          <li>Sample integrity requirements (fasting, container type, timing) must be followed; otherwise results may be delayed or invalid.</li>
        </ul>

        <h2>3. Reports &amp; medical disclaimer</h2>
        <p>
          Diagnostic reports are issued by the performing laboratory. Litmus does not practise medicine. Reports are for informational
          use and should be interpreted by a qualified clinician. Do not use report content as the sole basis for diagnosis or treatment.
        </p>

        <h2>4. Acceptable use</h2>
        <p>You agree not to misuse the platform — including attempting unauthorized access, scraping bulk data, or submitting fraudulent orders.</p>

        <h2>5. Limitation of liability</h2>
        <p>
          To the extent permitted by law, Litmus and its affiliates are not liable for indirect or consequential damages arising from
          delays in sample logistics, third-party lab operations, or force-majeure events. Our aggregate liability for any claim
          relating to these terms is limited to the fees you paid for the specific order giving rise to the claim.
        </p>

        <h2>6. Contact</h2>
        <p>For questions about these terms, reach us through the Support page or the contact details listed in your order confirmation.</p>
      </PolicyArticle>
    </div>
  );
}
