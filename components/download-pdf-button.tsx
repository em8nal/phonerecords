import { Download } from "lucide-react";
import { TrackedLink } from "@/components/tracked-link";
import { pdfParamsFromHref } from "@/lib/analytics/events";

type Props = {
  label: string;
  href: string;
  filename: string;
};

// Server component. Con un href de press kit (/press-kits/<artista>-<es|en>.pdf) el clic registra
// `pdf_download` con el artista y el idioma del PDF (no el de la página); con otro href es el
// enlace de siempre, sin medición.
export function DownloadPdfButton({ label, href, filename }: Props) {
  const className =
    "inline-flex items-center gap-2 px-6 h-12 text-sm rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors";
  const content = (
    <>
      <Download className="w-4 h-4" />
      {label}
    </>
  );
  const pdf = pdfParamsFromHref(href);
  if (pdf) {
    return (
      <TrackedLink event="pdf_download" params={pdf} href={href} download={filename} className={className}>
        {content}
      </TrackedLink>
    );
  }
  return (
    <a href={href} download={filename} className={className}>
      {content}
    </a>
  );
}
