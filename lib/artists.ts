// Static data for /artistas/[slug] pages.
// Sourced from informacion.md, spotify_manual.yaml, and Bandcamp scraping.
// Refresh stats periodically by re-running scripts/update_artists.py.

export type ArtistLink = {
  label: string;
  href: string;
};

export type Release = {
  year: string;
  title: string;
  format?: string;
  label?: string;
  notes?: string;
};

export type Artist = {
  slug: string;
  name: string;
  genres: string[];
  origin: string;
  bio: { es: string; en: string };
  links: ArtistLink[];
  releases?: Release[];
  stats?: {
    spotifyFollowers?: number;
    monthlyListeners?: number;
    youtubeSubs?: number;
  };
};

export const artists: Artist[] = [
  {
    slug: "newen-afrobeat",
    name: "Newen Afrobeat",
    genres: ["Afrobeat", "Afrofunk", "World Music"],
    origin: "Santiago, Chile · 2009",
    bio: {
      es:
        "Primera banda chilena de afrobeat, formada en 2009. La respuesta latinoamericana al estilo de Fela Kuti, con un sonido propio que cruza highlife, jazz, funk y rare groove. Han colaborado con Tony Allen, Seun Kuti, Cheick Tidiane Seck, Femi Kuti, Lido Pimienta, Joe Vasconcellos, Dele Sosimi y Chico César. Han girado por Chile, Brasil, Nigeria, Estados Unidos, Canadá y Europa.",
      en:
        "The first Chilean afrobeat band, formed in 2009. A Latin American response to Fela Kuti's style, with their own sound crossing highlife, jazz, funk and rare groove. They've collaborated with Tony Allen, Seun Kuti, Cheick Tidiane Seck, Femi Kuti, Lido Pimienta, Joe Vasconcellos, Dele Sosimi and Chico César. They've toured Chile, Brazil, Nigeria, the United States, Canada and Europe.",
    },
    links: [
      { label: "Bandcamp", href: "https://newenafrobeat.bandcamp.com/music" },
      { label: "Spotify", href: "https://open.spotify.com/artist/0PTJ848ulShbjTx2yqaAlb" },
      { label: "YouTube", href: "https://www.youtube.com/channel/UCTHMwr5NTvQ0MWbq0nbeP-w" },
      { label: "Instagram", href: "https://www.instagram.com/newenafrobeat/" },
    ],
    releases: [
      { year: "2025-04", title: "Liverpool Session", format: "EP en vivo · 4 tracks", notes: "Grabado 100% análogo en Quarry, Liverpool" },
      { year: "2024-09", title: "Grietas", format: "LP · vinilo + digital", label: "OfficeHome Records (París)", notes: "Featurings: Lido Pimienta, Dele Sosimi, Joe Vasconcellos, Chico César" },
      { year: "2019-05", title: "Curiche", format: "2° LP · 7 tracks", notes: "Grabado en Santuario Sónico" },
      { year: "2017-02", title: "Newen Plays Fela", format: "EP · CD (sold out)", notes: "Con Seun Kuti, Cheick Tidiane Seck, Egypt 80" },
      { year: "2014-06", title: "Newen Afrobeat", format: "LP debut · 7 tracks", notes: "Producido por Chalo Gonzáles + Nicolás Urbina" },
    ],
    stats: { spotifyFollowers: 66199, monthlyListeners: 28729, youtubeSubs: 44200 },
  },
  {
    slug: "claudio-solis",
    name: "Claudio Solís",
    genres: ["Dark Minimal", "Minimal Techno"],
    origin: "Santiago, Chile",
    bio: {
      es:
        "En una escena dominada por la inmediatez, Claudio Solís ha optado por una trayectoria pausada. Surgido del underground santiaguino, cultivó un sonido que se inclina hacia la oscuridad no como adorno estético, sino como principio estructural. Mucho antes de que el minimalismo oscuro se convirtiera en etiqueta, Solís exploraba estructuras rítmicas despojadas, atmósferas cargadas de tensión y narrativas groove extensas moldeadas a través de sesiones de vinilo. Más allá de sus producciones, ha sido un puente discreto entre artistas latinoamericanos y el ecosistema minimalista europeo. Firma además el diseño gráfico del LP Grietas (Newen Afrobeat, OfficeHome Records, 2024).",
      en:
        "Claudio Solís stands at the darker edge of minimal sound architecture. Emerging from the South American underground, he developed a distinctive language rooted in tension, restraint and immersive low-frequency pressure — a sonic approach often linked to the early foundations of dark minimal. Forged through extended vinyl sessions and a deep commitment to groove evolution, his sets unfold patiently. Beyond the booth, Solis has acted as a discreet bridge between Latin America and the European minimal movement. He also signs the graphic design of Newen Afrobeat's Grietas LP (OfficeHome Records, 2024).",
    },
    links: [],
    releases: [
      { year: "2025-02", title: "Oneiroi", label: "Advisual Records" },
      { year: "2025-01", title: "Selección Natural", label: "Nada Espacial" },
      { year: "2025-01", title: "Lota", label: "Atmos Music Label" },
      { year: "2024-09", title: "Occvltheque LP", label: "Aquarians" },
      { year: "2024-04", title: "How Long is the Night LP", label: "Nihil Sine Musica" },
      { year: "2024-03", title: "Doing Without Saying LP", label: "CSS" },
      { year: "2023-12", title: "Noche Oscura Del Alma", label: "Aquarians" },
      { year: "2023-04", title: "Nothing but the truth LP", label: "Vyasa Discos" },
    ],
  },
  {
    slug: "ecamhi",
    name: "Ecamhi",
    genres: ["Instrumental", "Jazz", "Interdisciplinar"],
    origin: "Santiago, Chile",
    bio: {
      es:
        "Enrique Camhi —Ecamhi— es trompetista, fluegelhornista, productor y fotógrafo chileno. Integrante histórico de la sección de bronces de Newen Afrobeat, ha participado en sus discos Curiche (2019) y Grietas (2024), donde co-compone Mare Mare junto a Martin Concha y co-dirige el arte del disco. Su trabajo solista cruza fotografía y música: cada imagen capturada en gira inspira una pieza sonora. Su EP en viaje fue el lanzamiento inaugural de PHŌNÉ Records, presentado como exhibición fotográfica con audífonos.",
      en:
        "Enrique Camhi — Ecamhi — is a Chilean trumpet and flugelhorn player, producer and photographer. A historic member of Newen Afrobeat's brass section, he played on Curiche (2019) and Grietas (2024), where he co-composed Mare Mare and co-directed the album art. His solo work crosses photography and music: each image captured on tour inspires a song. His EP en viaje was PHŌNÉ Records' inaugural release, presented as a photo exhibition with headphones.",
    },
    links: [
      { label: "SoundCloud", href: "https://soundcloud.com/enrique-camhi" },
      { label: "Instagram", href: "https://www.instagram.com/ecamhi/" },
    ],
    releases: [
      { year: "2024", title: "en viaje", format: "EP · 4 tracks", label: "PHŌNÉ Records", notes: "Lanzamiento inaugural del sello" },
      { year: "2024-09", title: "Grietas (Newen Afrobeat)", format: "LP", notes: "Trompeta + co-composición Mare Mare + co-dirección de arte" },
      { year: "2025-11", title: "Estudios Del Maipo: Live Session (Gestosimple & Klaus B)", format: "EP en vivo", notes: "Trompeta y fluegelhorn" },
    ],
  },
  {
    slug: "con-fusion",
    name: "Con.fusión",
    genres: ["Hip Hop", "Jazz", "Neo Soul"],
    origin: "Santiago, Chile",
    bio: {
      es:
        "Proyecto solista de Catalina Aguilera Martínez. Una propuesta que transita entre hip hop, jazz y pop, con exploraciones vocales que van desde el canto al rap y al scat. Su trayectoria comienza con Fat Jota (lo-fi hip hop, EP verdad), evoluciona en la banda Fat Lady (neosoul + rock) y sigue en festivales como Beatminds y Furia Jazz. Es la voz invitada del EP en viaje de Ecamhi, primer lanzamiento de PHŌNÉ. Trabaja en su primer álbum Tulpa, producido por Jenry Cancura (Matiah Chinaski), con referencias a Tom Waits y Lhasa de Sela.",
      en:
        "The solo project of Catalina Aguilera Martínez. A proposal moving between hip hop, jazz and pop, with vocal explorations from singing to rap and scat. She started with Fat Jota (lo-fi hip hop, EP verdad), evolved in the Fat Lady band (neosoul + rock) and continues at festivals like Beatminds and Furia Jazz. She is the guest voice on Ecamhi's en viaje EP, PHŌNÉ's inaugural release. She is working on her debut album Tulpa, produced by Jenry Cancura (Matiah Chinaski), with references to Tom Waits and Lhasa de Sela.",
    },
    links: [],
    releases: [
      { year: "2024", title: "Cantas Veces", format: "Single", notes: "Disponible en plataformas" },
      { year: "in production", title: "Tulpa", format: "Álbum", notes: "Tracks: Acertijo · En vez de quejarte tanto · Pisando caca a propósito" },
    ],
  },
  {
    slug: "klaus-brantmayer",
    name: "Klaus Brantmayer",
    genres: ["Nu-jazz", "Hip-hop jazz", "Rap jazz", "Neo-soul"],
    origin: "Santiago, Chile",
    bio: {
      es:
        "Klaus B es saxofonista, flautista y productor santiaguino. Su música cruza nu-jazz, rap jazz y neo-soul instrumental con un fraseo de viento que dialoga con J Dilla, los grooves orgánicos y la espiritualidad del jazz contemporáneo. Su catálogo —8 lanzamientos en Bandcamp desde 2021— alterna instrumentales atmosféricos con producciones colaborativas: el dúo Gestosimple & Klaus B (Viaje Sin Tiempo, 2024; Estudios Del Maipo: Live Session, 2025), el trabajo con Newen Afrobeat (Quisiera Entender, 2023; composición de Es la Vida en Grietas, 2024) y la mixtape Memorias (2025). Adjudicó el Fondo de la Música 2026 para su nuevo proyecto con PHŌNÉ.",
      en:
        "Klaus B is a Santiago-based saxophonist, flutist and producer. His music crosses nu-jazz, rap jazz and neo-soul instrumentals, with a wind phrasing that dialogues with J Dilla, organic grooves and contemporary jazz spirituality. His catalogue — 8 Bandcamp releases since 2021 — alternates atmospheric instrumentals with collaborative productions: the Gestosimple & Klaus B duo (Viaje Sin Tiempo, 2024; Estudios Del Maipo: Live Session, 2025), work with Newen Afrobeat (Quisiera Entender, 2023; composing Es la Vida on Grietas, 2024) and the Memorias mixtape (2025). Granted the 2026 Fondo de la Música for his new project with PHŌNÉ.",
    },
    links: [
      { label: "Bandcamp", href: "https://klausb.bandcamp.com/music" },
      { label: "Spotify", href: "https://open.spotify.com/artist/53A3Tz7xYVj0n3LlEwSmyw" },
      { label: "YouTube", href: "https://www.youtube.com/channel/UCN-g9sETAcl84PdpXWUTXOg" },
      { label: "Instagram", href: "https://www.instagram.com/klaausb/" },
    ],
    releases: [
      { year: "2025-11", title: "Estudios Del Maipo: Live Session", format: "EP en vivo · 3 tracks", notes: "Gestosimple & Klaus B · Cajón del Maipo" },
      { year: "2025-11", title: "Memorias: Mixtape", format: "LP / Mixtape · 15 tracks", notes: "Compuesto, producido y grabado por Klaus B" },
      { year: "2025-10", title: "El Secreto", format: "Single" },
      { year: "2024-06", title: "Viaje Sin Tiempo", format: "LP · 12 tracks", notes: "Gestosimple & Klaus B" },
      { year: "2023-07", title: "Quisiera Entender feat. Newen Afrobeat", format: "Single" },
      { year: "2021-08", title: "De Noche", format: "Single" },
      { year: "2021-06", title: "Viento Radiante", format: "Single instrumental" },
    ],
    stats: { spotifyFollowers: 460, monthlyListeners: 2186, youtubeSubs: 87 },
  },
  {
    slug: "andres-abrigo",
    name: "Andrés Abrigo",
    genres: ["Ambient", "Downtempo", "Post-tempo"],
    origin: "Chile",
    bio: {
      es:
        "Productor chileno cuyo trabajo se acerca al ambient y la composición experimental, más que a la fabricación de beats. Sus exploraciones combinan drum machines, bajo, trompeta y pianos en piezas atmosféricas. Su primer EP está en proceso bajo PHŌNÉ Records, con esbozos previstos para agosto y mezcla / máster proyectada para septiembre 2026.",
      en:
        "Chilean producer whose work leans towards ambient and experimental composition rather than beat-making. His explorations combine drum machines, bass, trumpet and pianos in atmospheric pieces. His first EP is in production under PHŌNÉ Records, with sketches expected in August and mixing / mastering projected for September 2026.",
    },
    links: [],
    releases: [
      { year: "2026 (in process)", title: "Primer EP", format: "EP", label: "PHŌNÉ Records", notes: "8 stems en desarrollo: Cumbia Andino, Ensayo Ansiedad, Post Dub Jam, Útero" },
    ],
  },
];

export const artistSlugs = artists.map((a) => a.slug);

export function getArtist(slug: string): Artist | undefined {
  return artists.find((a) => a.slug === slug);
}
