export const downloadJSON = (data: any, filename: string) => {
  const str = JSON.stringify(data);
  const encoded = new TextEncoder().encode(str);
  const blob = new Blob([encoded], {
    type: 'application/json;charset=utf-8'
  });

  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(blob);
  anchor.download = filename;
  anchor.click();
}