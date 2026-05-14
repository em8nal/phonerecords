import { Download } from "lucide-react";

type Props = {
  label: string;
  href: string;
  filename: string;
};

export function DownloadPdfButton({ label, href, filename }: Props) {
  return (
    <a
      href={href}
      download={filename}
      className="inline-flex items-center gap-2 px-6 h-12 text-sm rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
    >
      <Download className="w-4 h-4" />
      {label}
    </a>
  );
}
