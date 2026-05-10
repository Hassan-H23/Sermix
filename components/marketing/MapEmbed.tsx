import { company } from "@/lib/data/company";

// TODO: replace this with Mapbox GL JS once a NEXT_PUBLIC_MAPBOX_TOKEN is
// supplied. CLAUDE.md mandates Mapbox; this OpenStreetMap iframe is a
// no-key placeholder so the Contact page is shippable today.
//
// When swapping in Mapbox:
//   1. `pnpm add mapbox-gl @types/mapbox-gl`
//   2. Dynamic-import the map module so the Contact page stays inside the
//      JS budget on first paint.
//   3. Style the map to the Heritage Industrial palette (custom Mapbox
//      Studio style — desaturated greys + cream water).

export function MapEmbed({ label }: { label: string }) {
  const { lat, lng } = company.map;
  const halfSpan = 0.012; // ~1.3km bbox
  const bbox = [
    lng - halfSpan,
    lat - halfSpan,
    lng + halfSpan,
    lat + halfSpan,
  ].join(",");
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div className="relative w-full overflow-hidden rounded-[4px] border border-border bg-surface-2">
      <iframe
        title={label}
        src={src}
        loading="lazy"
        className="h-full w-full"
        style={{ minHeight: 360, filter: "grayscale(0.35) contrast(0.95)" }}
      />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-bg/95 px-4 py-2 text-xs text-fg-subtle">
        <span dir="ltr">
          {company.map.lat.toFixed(4)}, {company.map.lng.toFixed(4)}
        </span>
        <a
          href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${company.map.zoom}/${lat}/${lng}`}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-fg hover:text-accent transition-colors"
        >
          ↗
        </a>
      </div>
    </div>
  );
}
