import { describe, it, expect } from "vitest";
import { formatCurrency } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";

describe("formatCurrency", () => {
  it("formats INR", () => {
    const value = formatCurrency(1569);
    expect(value).toContain("1,569");
  });
});

describe("cn", () => {
  it("dedupes conflicting classes", () => {
    expect(cn("text-red-500", "text-blue-500")).toContain("text-blue-500");
  });
});
