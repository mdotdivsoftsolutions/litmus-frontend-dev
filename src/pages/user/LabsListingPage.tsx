import { useState } from "react";
import { laboratories } from "@/lib/placeholder-data";
import { LabsHero } from "./components/labs-listing/LabsHero";
import { LabsGrid } from "./components/labs-listing/LabsGrid";
import { ConsultationServices } from "./components/consultation/ConsultationServices";

import { useQuery } from "@tanstack/react-query";
import { labApi } from "@/lib/api/lab";

export default function LabsListingPage() {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [visibleCount, setVisibleCount] = useState(10);

  const { data: labsResponse, isLoading } = useQuery({
    queryKey: ["publicLabs", { location: selectedCity !== "All Cities" ? selectedCity : undefined }],
    queryFn: () => labApi.getLabsPublic({ location: selectedCity !== "All Cities" ? selectedCity : undefined }),
  });

  const rawLabs = labsResponse?.data || [];

  const filtered = rawLabs
    .map((l: any) => ({
      id: l._id,
      name: l.labName,
      city: l.location?.city || "Unknown",
      nabl: l.isNablAccredited,
      fssai: l.isFssaiApproved,
      rating: l.reviews?.length > 0 ? (l.reviews.reduce((acc: any, curr: any) => acc + curr.rating, 0) / l.reviews.length) : 0,
      reviewCount: l.reviews?.length || 0,
      priceFrom: l.pricing ? Math.min(...Object.values(l.pricing as Record<string, number>).filter(v => typeof v === 'number')) : 500,
      testsCount: l.tests?.length || 0,
      expertiseArea: l.expertiseArea || [],
    }))
    .filter((l: any) => {
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
          isLoading={isLoading}
        />
      </div>
      <ConsultationServices />
    </div>
  );
}
