// Columnas en escritorio: la que deja menos celdas vacías entre 5, 4 y 3 (empate → más columnas).
const LG_COLS: Record<number, string> = { 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5" };
export function pickLgCols(n: number): number {
  if (n <= 3) return Math.max(n, 1);
  let best = 5;
  for (const c of [5, 4, 3]) if ((c - (n % c)) % c < (best - (n % best)) % best) best = c;
  return best;
}
/** Celdas de relleno (fondo de página) para que la última fila no muestre el gris del gap. */
export function GridFillers({ count, cols }: { count: number; cols: number }) {
  const mobile = (2 - (count % 2)) % 2;
  const desktop = (cols - (count % cols)) % cols;
  return (
    <>
      {Array.from({ length: mobile }, (_, i) => (
        <div key={`m${i}`} aria-hidden="true" className="bg-background lg:hidden" />
      ))}
      {Array.from({ length: desktop }, (_, i) => (
        <div key={`d${i}`} aria-hidden="true" className="hidden bg-background lg:block" />
      ))}
    </>
  );
}
export function lgColsClass(cols: number): string {
  return LG_COLS[cols] ?? (cols <= 1 ? "lg:grid-cols-1" : cols === 2 ? "lg:grid-cols-2" : "lg:grid-cols-5");
}
