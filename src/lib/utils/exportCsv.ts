/**
 * Universal CSV Export Utility for Admin Portal
 * Exports tabular data as a properly formatted UTF-8 CSV with Excel BOM compatibility.
 */

export interface CsvColumn<T = any> {
  key: keyof T | ((row: T) => any);
  label: string;
}

export function exportToCsv<T extends Record<string, any>>(
  filename: string,
  rows: T[],
  columns: CsvColumn<T>[]
) {
  if (!rows || rows.length === 0) {
    return false;
  }

  const headerLine = columns.map((col) => `"${col.label.replace(/"/g, '""')}"`).join(",");
  const dataLines = rows.map((row) =>
    columns
      .map((col) => {
        let val = typeof col.key === "function" ? col.key(row) : row[col.key];
        if (val === null || val === undefined) return '""';
        if (typeof val === "object") val = JSON.stringify(val);
        const escaped = String(val).replace(/"/g, '""');
        return `"${escaped}"`;
      })
      .join(",")
  );

  const csvContent = "\uFEFF" + [headerLine, ...dataLines].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const formattedFilename = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  link.setAttribute("href", url);
  link.setAttribute("download", formattedFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}
