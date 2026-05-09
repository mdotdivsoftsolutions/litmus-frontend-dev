import { BadgeCheck } from "lucide-react";
import { PolicyHero } from "./components/policies/PolicyHero";
import { PolicyArticle } from "./components/policies/PolicyArticle";

export default function NablDataPage() {
  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen">
      <PolicyHero
        icon={BadgeCheck}
        eyebrow="Quality · Accreditation"
        title={
          <>
            NABL &amp; lab{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">
              data statement
            </span>
          </>
        }
        subtitle="Transparency about accreditation scope, how we display NABL-related information on Litmus, and what it means for your reports. Illustrative content — align with your compliance team and live certificates."
      />
      <PolicyArticle lastUpdated="May 9, 2026">
        <p>
          Litmus partners with laboratories that maintain quality programmes consistent with Indian regulatory expectations.
          National Accreditation Board for Testing and Calibration (NABL) accreditation is issued to individual laboratory facilities
          for defined scopes — not to Litmus as a platform.
        </p>

        <h2>1. What you see on Litmus</h2>
        <p>
          Lab profile pages may show accreditation badges, certificate identifiers, and scope summaries supplied by the lab or verified from public directories.
          We aim to keep this information current but rely on partners to notify us of renewals, suspensions, or scope changes.
        </p>

        <h2>2. Reports</h2>
        <p>
          Official test reports contain the performing lab&apos;s letterhead, signatories, and accreditation references where applicable.
          Your PDF report is the authoritative document for auditors and regulators — not marketing copy on this website.
        </p>

        <h2>3. Scope limitations</h2>
        <ul>
          <li>An accredited lab may run only certain methods or matrices under its NABL scope.</li>
          <li>Some add-on assays may be routed to referral partners; those will be labeled on your order and report.</li>
          <li>If a requested test falls outside scope, we will inform you before confirming the order where possible.</li>
        </ul>

        <h2>4. Verification</h2>
        <p>
          Customers may request lab registration numbers and certificate details for their own due diligence. Where available, we link to
          NABL directory entries or provide document references shared by the laboratory.
        </p>

        <h2>5. Data handling &amp; audit trail</h2>
        <p>
          Order metadata, chain-of-custody timestamps, and report download events are stored to support internal quality review and customer support.
          Aggregated analytics never include free-text clinical notes tied to identifiable individuals in external dashboards.
        </p>

        <h2>6. Updates</h2>
        <p>
          Accreditation status can change between annual assessments. This page is refreshed when we receive verified updates from partner labs.
          For time-sensitive decisions, confirm directly with the issuing laboratory.
        </p>
      </PolicyArticle>
    </div>
  );
}
