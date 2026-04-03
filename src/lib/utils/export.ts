/**
 * Converts an array of objects to a CSV string and triggers a browser download.
 * @param data Array of objects to export
 * @param filename Desired filename (without extension)
 */
export const downloadCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) return;

  // Extract headers
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvRows = [];
  csvRows.push(headers.join(',')); // Add headers
  
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      const escaped = ('' + val).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  // Create link and trigger download
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
