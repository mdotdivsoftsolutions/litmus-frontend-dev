import { useState } from "react";
import { laboratories } from "@/lib/placeholder-data";
import { LabsHero } from "./components/labs-listing/LabsHero";
import { LabsCertificates } from "./components/labs-listing/LabsCertificates";
import { LabsGrid } from "./components/labs-listing/LabsGrid";

export default function LabsListingPage() {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [visibleCount, setVisibleCount] = useState(10);

  const filtered = laboratories.filter((l) => {
    if (selectedCity !== "All Cities" && l.city !== selectedCity) return false;
    if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.city.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="animate-fade-in min-h-screen bg-white">
      <LabsHero
        search={search}
        setSearch={setSearch}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
      />
      <div className="bg-slate-50">
        <LabsGrid
          filtered={filtered}
          visibleCount={visibleCount}
          setVisibleCount={setVisibleCount}
        />
      </div>
      <div className="">
        <LabsCertificates />
      </div>
    </div>
  );
}
