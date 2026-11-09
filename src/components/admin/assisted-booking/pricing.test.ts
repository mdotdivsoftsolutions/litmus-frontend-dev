import { describe, expect, it } from "vitest";
import { lineMrp, linePrice } from "./pricing";
import type { LineDraft, SampleDraft } from "./types";

const sample = (over: Partial<SampleDraft> = {}): SampleDraft => ({
  id: "s",
  productName: "Mango Pickle",
  quantity: "",
  batchNumber: "",
  sku: "",
  specifics: "",
  selectedParameters: ["Standard Parameter"],
  extraParameters: [],
  ...over,
});

const testLine = (samples: SampleDraft[], over: Partial<LineDraft> = {}): LineDraft => ({
  key: "t1",
  itemType: "TEST",
  refId: "t1",
  name: "Acid Insoluble Ash",
  unitPrice: 600,
  unitMrp: 600,
  parameters: [{ name: "Standard Parameter", price: 600 }],
  packageTests: [],
  samples,
  ...over,
});

describe("assisted booking pricing with added parameters", () => {
  it("is unchanged when no parameter is added", () => {
    const line = testLine([sample()]);
    expect(lineMrp(line)).toBe(600);
    expect(linePrice(line)).toBe(600);
  });

  it("adds the price of each named extra parameter to the same sample", () => {
    const line = testLine([
      sample({ extraParameters: [{ id: "a", name: "Moisture", price: "250" }, { id: "b", name: "", price: "" }] }),
    ]);
    expect(lineMrp(line)).toBe(850);
    expect(linePrice(line)).toBe(850);
  });

  it("applies the catalog discount to catalog parameters only", () => {
    const line = testLine([sample({ extraParameters: [{ id: "a", name: "Moisture", price: "100" }] })], {
      catalogDiscountType: "PERCENTAGE",
      catalogDiscountValue: 10,
    });
    expect(linePrice(line)).toBe(640); // 600 - 10% + 100
    expect(lineMrp(line)).toBe(700);
  });

  it("charges only the added parameter when every catalog parameter is unticked", () => {
    const line = testLine([sample({ selectedParameters: [], extraParameters: [{ id: "a", name: "Moisture", price: "300" }] })]);
    expect(linePrice(line)).toBe(300);
  });

  it("works for packages too", () => {
    const line = testLine([sample({ extraParameters: [{ id: "a", name: "Lead", price: "400" }] })], {
      itemType: "PACKAGE",
      parameters: [],
      unitPrice: 2000,
      unitMrp: 2500,
    });
    expect(linePrice(line)).toBe(2400);
    expect(lineMrp(line)).toBe(2900);
  });
});
