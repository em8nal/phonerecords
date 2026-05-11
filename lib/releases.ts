// Standalone data for /catalogo and /releases/[slug] pages.
// Sourced from informacion.md, Bandcamp scrape and credit lists.
// Each release has its own slug for SEO-rich individual pages.

export type ReleaseCredit = { role: string; name: string };

export type Track = {
  n: number;
  title: string;
  duration?: string; // mm:ss
  composer?: string;
  guests?: string[];
};

export type Release = {
  slug: string;
  title: string;
  artistSlug: string;
  artistName: string;
  releaseDate: string; // ISO yyyy-mm-dd or yyyy-mm
  year: number;
  type: "album" | "ep" | "single" | "live" | "mixtape" | "compilation";
  format: string; // human-readable (e.g. "LP · vinilo + digital")
  label?: string;
  description: { es: string; en: string };
  tracklist?: Track[];
  credits?: ReleaseCredit[];
  links?: { label: string; href: string }[];
  // Optional: cover art URL (we don't have files yet — leave undefined for now)
  cover?: string;
};

export const releases: Release[] = [
  // ─────────── Newen Afrobeat ───────────
  {
    slug: "newen-afrobeat-grietas",
    title: "Grietas",
    artistSlug: "newen-afrobeat",
    artistName: "Newen Afrobeat",
    releaseDate: "2024-09-25",
    year: 2024,
    type: "album",
    format: "LP · vinilo + digital",
    label: "OfficeHome Records (París)",
    cover: "https://f4.bcbits.com/img/a1399189381_10.jpg",
    description: {
      es:
        "Cuarto LP de Newen Afrobeat, grabado en Santuario Sónico (Santiago, abril 2022) con producción general de Sebastián Crooker, mezcla de Fran 'Antena' Infante y master de Carlos Barros. El disco articula a cuatro artistas del roster PHŌNÉ: Ecamhi (trompeta + co-composición de Mare Mare + co-dirección de arte con Tom Pavez), Klaus Brantmayer (composición de Es la Vida), y Claudio Solís (diseño gráfico). Featurings de Lido Pimienta, Dele Sosimi, Joe Vasconcellos y Chico César.",
      en:
        "Newen Afrobeat's fourth LP, recorded at Santuario Sónico (Santiago, April 2022) with general production by Sebastián Crooker, mixing by Fran 'Antena' Infante and mastering by Carlos Barros. The album articulates four PHŌNÉ roster artists: Ecamhi (trumpet + co-composition of Mare Mare + co-art direction with Tom Pavez), Klaus Brantmayer (composer of Es la Vida), and Claudio Solís (graphic design). Featurings by Lido Pimienta, Dele Sosimi, Joe Vasconcellos and Chico César.",
    },
    tracklist: [
      { n: 1, title: "Grietas", duration: "5:13", composer: "Fran Ri", guests: ["Lido Pimienta"] },
      { n: 2, title: "Mare Mare", duration: "5:08", composer: "Enrique Camhi & Martin Concha", guests: ["Dele Sosimi"] },
      { n: 3, title: "Lloverá", duration: "4:31", composer: "Sebastian Crooker" },
      { n: 4, title: "Somos el Presente", duration: "5:29", composer: "Alejandro Orellana", guests: ["Joe Vasconcellos"] },
      { n: 5, title: "Widin", duration: "2:53", composer: "Sebastian Crooker" },
      { n: 6, title: "Es la vida", duration: "5:59", composer: "Klaus Brantmayer", guests: ["Chico César"] },
    ],
    credits: [
      { role: "Producción general", name: "Sebastián Crooker" },
      { role: "Mezcla", name: "Fran 'Antena' Infante" },
      { role: "Master", name: "Carlos Barros" },
      { role: "Dirección de arte", name: "Tom Pavez + Ecamhi" },
      { role: "Cover art", name: "Matías Lasen" },
      { role: "Diseño gráfico", name: "Claudio Solís" },
      { role: "Producción ejecutiva", name: "Martín Canessa, Lichens Family" },
      { role: "Grabación", name: "Juan Pablo Quezada Kaulen · Santuario Sónico, Santiago, abril 2022" },
    ],
    links: [
      { label: "Bandcamp", href: "https://officehomerecords.bandcamp.com/album/grietas-2" },
    ],
  },
  {
    slug: "newen-afrobeat-liverpool-session",
    title: "Liverpool Session",
    artistSlug: "newen-afrobeat",
    artistName: "Newen Afrobeat",
    releaseDate: "2025-04-11",
    year: 2025,
    type: "live",
    format: "EP en vivo · 4 tracks",
    label: "Independent",
    cover: "https://f4.bcbits.com/img/a2149195633_10.jpg",
    description: {
      es:
        "EP en vivo capturado en Quarry, Liverpool, durante la gira de verano 2024. Versiones explosivas en directo de tracks de Grietas junto a relecturas de clásicos de Fela Kuti. Grabado 100% en vivo y completamente análogo. Representa el cruce entre la herencia musical africana y las perspectivas latinoamericanas.",
      en:
        "Live EP captured at Quarry, Liverpool, during the 2024 summer tour. Explosive live versions of tracks from Grietas alongside reimagined Fela Kuti classics. Recorded 100% live and fully analog. Represents the intersection of African musical heritage with Latin American perspectives.",
    },
    tracklist: [
      { n: 1, title: "Es la vida", duration: "6:08" },
      { n: 2, title: "Ako (Fela Kuti)", duration: "3:38" },
      { n: 3, title: "Grietas", duration: "5:53" },
      { n: 4, title: "No Agreement (Fela Kuti)", duration: "9:24" },
    ],
    credits: [
      { role: "Grabación", name: "The Lightning Cave" },
      { role: "Audio engineer", name: "Thomas Benson, Jack Wait" },
      { role: "Master", name: "Victor Sáez" },
      { role: "Voces", name: "Fran Ri, Erin Rutledge" },
    ],
    links: [
      { label: "Bandcamp", href: "https://newenafrobeat.bandcamp.com/album/liverpool-session" },
    ],
  },
  {
    slug: "newen-afrobeat-curiche",
    title: "Curiche",
    artistSlug: "newen-afrobeat",
    artistName: "Newen Afrobeat",
    releaseDate: "2019-05-10",
    year: 2019,
    type: "album",
    format: "2° LP · 7 tracks (48 min)",
    cover: "https://f4.bcbits.com/img/a2154521327_10.jpg",
    description: {
      es:
        "Segundo álbum de larga duración. Documenta la exploración continua del afrobeat y los viajes a Lagos, Nigeria para estudiar con maestros del género. Tematiza desigualdad, migración, rol femenino, culturas indígenas. Grabado, mezclado y masterizado en Santuario Sónico, Santiago de Chile. Participaciones de Oghene Kologbo, Enrique Camhi (Ecamhi) y Diego Alarcón.",
      en:
        "Second full-length album. Documents the continued exploration of afrobeat music and travels to Lagos, Nigeria to study with masters of the genre. Themes: inequality, migration, women's roles, indigenous cultures. Recorded, mixed and mastered at Santuario Sónico, Santiago, Chile. Participations by Oghene Kologbo, Enrique Camhi (Ecamhi) and Diego Alarcón.",
    },
    tracklist: [
      { n: 1, title: "Vuela junto a mi", duration: "6:35" },
      { n: 2, title: "Curiche", duration: "6:09" },
      { n: 3, title: "Voraz", duration: "5:27" },
      { n: 4, title: "Cántaros", duration: "7:12" },
      { n: 5, title: "Open your eyes", duration: "7:59" },
      { n: 6, title: "Chaltumay", duration: "5:56" },
      { n: 7, title: "Come y calla", duration: "9:00" },
    ],
    links: [
      { label: "Bandcamp", href: "https://newenafrobeat.bandcamp.com/album/curiche" },
    ],
  },
  {
    slug: "newen-afrobeat-newen-plays-fela",
    title: "Newen Plays Fela",
    artistSlug: "newen-afrobeat",
    artistName: "Newen Afrobeat",
    releaseDate: "2017-02-20",
    year: 2017,
    type: "ep",
    format: "EP · CD (sold out) + digital",
    cover: "https://f4.bcbits.com/img/a2971239057_10.jpg",
    description: {
      es:
        "EP que reúne dos composiciones de Fela Anikulapo Kuti junto a colaboradores notables: Seun Kuti, Cheick Tidiane Seck y músicos de Egypt 80. Tres tracks que extienden la conversación de Newen con la fuente del afrobeat.",
      en:
        "EP that gathers two compositions by Fela Anikulapo Kuti alongside notable collaborators: Seun Kuti, Cheick Tidiane Seck and Egypt 80 musicians. Three tracks that extend Newen's conversation with the source of afrobeat.",
    },
    tracklist: [
      { n: 1, title: "Upside Down", duration: "11:06" },
      { n: 2, title: "Opposite People Intro", duration: "1:02" },
      { n: 3, title: "Opposite People (with Seun Kuti, Cheick Tidiane Seck and more)", duration: "13:38" },
    ],
    links: [
      { label: "Bandcamp", href: "https://newenafrobeat.bandcamp.com/album/newen-plays-fela" },
    ],
  },
  {
    slug: "newen-afrobeat-debut",
    title: "Newen Afrobeat",
    artistSlug: "newen-afrobeat",
    artistName: "Newen Afrobeat",
    releaseDate: "2014-06-22",
    year: 2014,
    type: "album",
    format: "LP debut · 7 tracks (74 min)",
    cover: "https://f4.bcbits.com/img/a1477748070_10.jpg",
    description: {
      es:
        "LP debut. Un viaje groovero por el primer afrobeat chileno jamás grabado. Producido por Chalo Gonzáles y Nicolás Urbina en Estudios del Sur durante 2013.",
      en:
        "Debut LP. A groovy trip through the first Chilean Afrobeat ever made. Produced by Chalo Gonzáles and Nicolás Urbina at Estudios del Sur during 2013.",
    },
    tracklist: [
      { n: 1, title: "Santiago", duration: "13:31" },
      { n: 2, title: "Caminante", duration: "6:37" },
      { n: 3, title: "Rojo Carmín", duration: "4:57" },
      { n: 4, title: "Polvo de Inti", duration: "5:00" },
      { n: 5, title: "P.D.T.N. (prostituto de transnacional)", duration: "6:42" },
      { n: 6, title: "Nación Nueva", duration: "9:39" },
      { n: 7, title: "Que Sabemos", duration: "10:25" },
    ],
    links: [
      { label: "Bandcamp", href: "https://newenafrobeat.bandcamp.com/album/newen-afrobeat" },
    ],
  },

  // ─────────── Klaus B ───────────
  {
    slug: "klaus-b-memorias-mixtape",
    title: "Memorias: Mixtape",
    artistSlug: "klaus-brantmayer",
    artistName: "Klaus B",
    releaseDate: "2025-11-17",
    year: 2025,
    type: "mixtape",
    format: "LP / Mixtape · 15 tracks",
    cover: "https://f4.bcbits.com/img/a2195737014_10.jpg",
    description: {
      es:
        "Mirada íntima a una exploración musical personal desplegada durante varios años, combinando canciones e improvisaciones entre el jazz y el hip hop con grabaciones orgánicas. Presentado como archivo biográfico y documento vivo de evolución creativa.",
      en:
        "An intimate look at a personal musical exploration that unfolded over several years, combining songs and improvisations between jazz and hip hop with organic recordings. Presented as a biographical archive and living document of creative evolution.",
    },
    tracklist: [
      { n: 1, title: "Intro: Memorias", duration: "1:52" },
      { n: 2, title: "Viento Radiante", duration: "3:28" },
      { n: 3, title: "Devoción", duration: "2:55" },
      { n: 4, title: "El Secreto", duration: "2:47" },
      { n: 5, title: "Quisiera Entender feat. Newen Afrobeat", duration: "4:12" },
      { n: 6, title: "Those Days Far Away feat. Mr.Li, Seven Star, Racecar", duration: "5:01" },
      { n: 7, title: "Voy Y Vuelvo", duration: "1:32" },
      { n: 8, title: "Todo Vibra", duration: "6:54" },
      { n: 9, title: "Haz De Luz", duration: "1:22" },
      { n: 10, title: "Espejismos", duration: "4:08" },
      { n: 11, title: "Cielo", duration: "2:17" },
      { n: 12, title: "Groove Amor", duration: "2:45" },
      { n: 13, title: "De Noche", duration: "3:47" },
      { n: 14, title: "Como Una Mariposa", duration: "1:43" },
      { n: 15, title: "Nube", duration: "3:00" },
    ],
    credits: [
      { role: "Composición, producción y grabación", name: "Klaus B" },
      { role: "Mezcla", name: "Sebastián Pangal & Klaus B" },
      { role: "Master", name: "Victor Sáez & Chalo G" },
    ],
    links: [
      { label: "Bandcamp", href: "https://klausb.bandcamp.com/album/memorias-mixtape" },
    ],
  },
  {
    slug: "klaus-b-estudios-del-maipo",
    title: "Estudios Del Maipo: Live Session",
    artistSlug: "klaus-brantmayer",
    artistName: "Gestosimple & Klaus B",
    releaseDate: "2025-11-26",
    year: 2025,
    type: "live",
    format: "EP en vivo · 3 tracks",
    cover: "https://f4.bcbits.com/img/a0583641197_10.jpg",
    description: {
      es:
        "EP en vivo grabado en Estudios Del Maipo, Cajón del Maipo, Chile, 2025. Tres piezas largas que cruzan rap, jazz y groove orgánico con la sección instrumental completa.",
      en:
        "Live EP recorded at Estudios Del Maipo, Cajón del Maipo, Chile, 2025. Three long pieces crossing rap, jazz and organic groove with the full instrumental section.",
    },
    tracklist: [
      { n: 1, title: "Intro: Thank You Jay Dee", duration: "1:08" },
      { n: 2, title: "Desde La Emisora", duration: "9:10" },
      { n: 3, title: "Requiem", duration: "5:45" },
    ],
    credits: [
      { role: "Producción · alto sax · flauta", name: "Klaus B" },
      { role: "Rap", name: "Gestosimple" },
      { role: "Scratch", name: "DJ Dacel" },
      { role: "Trompeta · fluegelhorn", name: "Ecamhi" },
      { role: "Teclados", name: "Felamusic" },
      { role: "Guitarra eléctrica", name: "José Toledo" },
      { role: "Bajo", name: "Pancho Ruiz" },
      { role: "Batería", name: "Tito Gevert" },
      { role: "Grabación", name: "Nico Romero" },
      { role: "Mezcla y master", name: "Juan Faúndez" },
    ],
    links: [
      { label: "Bandcamp", href: "https://klausb.bandcamp.com/album/estudios-del-maipo-live-session" },
    ],
  },
  {
    slug: "klaus-b-viaje-sin-tiempo",
    title: "Viaje Sin Tiempo",
    artistSlug: "klaus-brantmayer",
    artistName: "Gestosimple & Klaus B",
    releaseDate: "2024-06-12",
    year: 2024,
    type: "album",
    format: "LP · 12 tracks",
    cover: "https://f4.bcbits.com/img/a0044868647_10.jpg",
    description: {
      es:
        "Álbum innovador del rapero Gestosimple y el saxofonista, flautista y productor Klaus B. Cruce de rap, nu-jazz, neo-soul y funk con una colaboración extensa de vocalistas, DJs e instrumentistas. Temas: vida, amor, música.",
      en:
        "Innovative album from rapper Gestosimple and saxophonist, flutist and producer Klaus B. Crossing rap, nu-jazz, neo-soul and funk with extensive collaboration of vocalists, DJs and instrumentalists. Themes: life, love, music.",
    },
    tracklist: [
      { n: 1, title: "Dentro De Mí", duration: "4:47" },
      { n: 2, title: "Viaje Sin Tiempo (feat. Fran Ri, DJ Dacel)", duration: "3:51" },
      { n: 3, title: "Elévame (feat. Senciyo Samuel HuiZa)", duration: "4:15" },
      { n: 4, title: "1988 (feat. Cidtronyck)", duration: "1:40" },
      { n: 5, title: "Tu Camino (feat. Lister Rossel)", duration: "4:01" },
      { n: 6, title: "Nuestro Espejo (feat. 22Ruzz)", duration: "4:25" },
      { n: 7, title: "El Tiempo Vuela (feat. Wagabond)", duration: "2:55" },
      { n: 8, title: "El Misterio (feat. Valentina Marinkovic)", duration: "3:01" },
      { n: 9, title: "Ya No Estás Aquí (feat. DJ Dacel)", duration: "4:04" },
      { n: 10, title: "La Inspiración", duration: "1:23" },
      { n: 11, title: "El Rayo Más Cálido (feat. Celeste Shaw, Cidtronyck)", duration: "5:45" },
      { n: 12, title: "Desde La Emisora", duration: "5:19" },
    ],
    credits: [
      { role: "Rap · letras", name: "Gestosimple" },
      { role: "Flauta · alto sax · vocoder · composición · producción", name: "Klaus B" },
    ],
    links: [
      { label: "Bandcamp", href: "https://klausb.bandcamp.com/album/viaje-sin-tiempo" },
    ],
  },
  {
    slug: "klaus-b-quisiera-entender",
    title: "Quisiera Entender feat. Newen Afrobeat",
    artistSlug: "klaus-brantmayer",
    artistName: "Klaus B",
    releaseDate: "2023-07-11",
    year: 2023,
    type: "single",
    format: "Single",
    cover: "https://f4.bcbits.com/img/a2195737014_10.jpg",
    description: {
      es:
        "Single producido en Santiago de Chile entre 2022 y 2023, después de viajes en gira a Lagos, Nigeria con Newen Afrobeat. Reúne la sección de bronces de Newen completa, incluido Ecamhi en trompeta.",
      en:
        "Single produced in Santiago de Chile between 2022 and 2023, after touring trips to Lagos, Nigeria with Newen Afrobeat. Brings together Newen's complete brass section, including Ecamhi on trumpet.",
    },
    credits: [
      { role: "Vocoder · alto sax", name: "Klaus B" },
      { role: "Voz principal", name: "Fran Ri" },
      { role: "Coros", name: "Camila Fuentes, Fran Castro, Maca Rozic" },
      { role: "Trompeta", name: "Enrique Camhi (Ecamhi), Diego González, Maururu Sánchez" },
      { role: "Tenor sax", name: "Marcelo Morales" },
      { role: "Baritone sax", name: "Aldo Gómez" },
      { role: "Guitarra eléctrica", name: "Sebastián Crooker, Martín Concha" },
      { role: "Bajo eléctrico", name: "Álvaro Quintas" },
      { role: "Congas y accesorios", name: "Alejandro Orellana" },
      { role: "Kpalongos · sakara · bells", name: "Tom Pavez" },
      { role: "Batería", name: "Tito Gevert" },
    ],
    links: [
      { label: "Bandcamp", href: "https://klausb.bandcamp.com/track/quisiera-entender-feat-newen-afrobeat" },
    ],
  },
  {
    slug: "klaus-b-those-days-far-away",
    title: "Those Days Far Away",
    artistSlug: "klaus-brantmayer",
    artistName: "Klaus B",
    releaseDate: "2025-11-11",
    year: 2025,
    type: "single",
    format: "Single",
    cover: "https://f4.bcbits.com/img/a2195737014_10.jpg",
    description: {
      es:
        "Producido en Santiago de Chile, en colaboración y co-producción con Lister Rossel (Mr.Li) en Londres, MC Seven Star en Orlando y MC Racecar en París. Hip-hop, jazz fusion, neo-soul.",
      en:
        "Produced in Santiago de Chile, in collaboration and co-produced by Lister Rossel (Mr.Li) in London, MC Seven Star in Orlando, and MC Racecar in Paris. Hip-hop, jazz fusion, neo-soul.",
    },
    credits: [
      { role: "Flauta · vocoder · producción", name: "Klaus B" },
      { role: "Co-producción", name: "Lister Rossel (Mr.Li)" },
      { role: "Rap", name: "Seven Star, Racecar" },
      { role: "Coros", name: "Camila Fuentes" },
      { role: "Piano", name: "Felamusic" },
      { role: "Guitarra", name: "José Toledo" },
      { role: "Trombón", name: "Pablo James" },
      { role: "Clarinete bajo", name: "Diego Toro" },
    ],
    links: [
      { label: "Bandcamp", href: "https://klausb.bandcamp.com/track/those-days-far-away-feat-mr-li-seven-star-racecar" },
    ],
  },
  {
    slug: "klaus-b-el-secreto",
    title: "El Secreto",
    artistSlug: "klaus-brantmayer",
    artistName: "Klaus B",
    releaseDate: "2025-10-30",
    year: 2025,
    type: "single",
    format: "Single",
    cover: "https://f4.bcbits.com/img/a2828912453_10.jpg",
    description: {
      es: "Single producido por Klaus B. Hip-hop / rap, jazz fusion, rap jazz, groove, jazz, neo-soul instrumental, nu-jazz.",
      en: "Single produced by Klaus B. Hip-hop / rap, jazz fusion, rap jazz, groove, jazz, instrumental neo-soul, nu-jazz.",
    },
    links: [
      { label: "Bandcamp", href: "https://klausb.bandcamp.com/track/el-secreto" },
    ],
  },
  {
    slug: "klaus-b-viento-radiante",
    title: "Viento Radiante",
    artistSlug: "klaus-brantmayer",
    artistName: "Klaus B",
    releaseDate: "2021-06-29",
    year: 2021,
    type: "single",
    format: "Single instrumental",
    cover: "https://f4.bcbits.com/img/a4057419649_10.jpg",
    description: {
      es:
        "Track instrumental groovero, liderado por una flauta funk brillante que rebota sobre un beat relajado. Cuando el viento gana el poder de brillar.",
      en:
        "A groovy instrumental track, led by a shiny funky flute that bounces on a laid back beat; when the wind gains the power to shine.",
    },
    credits: [
      { role: "Flauta · synths", name: "Klaus B" },
      { role: "Teclados · synths", name: "Diego Alarcón" },
      { role: "Bajo", name: "Iván Araya" },
      { role: "Batería", name: "Tito Gevert" },
      { role: "Música y producción", name: "Klaus B" },
      { role: "Arreglos", name: "Samurai Groove" },
    ],
    links: [
      { label: "Bandcamp", href: "https://klausb.bandcamp.com/track/viento-radiante" },
    ],
  },
  {
    slug: "klaus-b-de-noche",
    title: "De Noche",
    artistSlug: "klaus-brantmayer",
    artistName: "Klaus B",
    releaseDate: "2021-08-12",
    year: 2021,
    type: "single",
    format: "Single",
    cover: "https://f4.bcbits.com/img/a1553461504_10.jpg",
    description: {
      es: "Single de Klaus B (2021). Hip hop, jazz, lo-fi, nu-jazz: una mezcla downtempo de raíz jazz con rap.",
      en: "Klaus B single (2021). Hip hop, jazz, lo-fi, nu-jazz: a downtempo blend of jazz roots with rap.",
    },
    links: [
      { label: "Bandcamp", href: "https://klausb.bandcamp.com/track/de-noche" },
    ],
  },

  // ─────────── Ecamhi ───────────
  {
    slug: "ecamhi-en-viaje",
    title: "en viaje",
    artistSlug: "ecamhi",
    artistName: "Ecamhi",
    releaseDate: "2024-01-01",
    year: 2024,
    type: "ep",
    format: "EP · 4 tracks",
    label: "PHŌNÉ Records",
    description: {
      es:
        "EP debut de Ecamhi y lanzamiento inaugural del sello PHŌNÉ Records. Disco interdisciplinario donde cuatro fotografías capturadas en giras internacionales inspiraron cuatro canciones. El lanzamiento se presentó como exhibición fotográfica donde cada foto estaba acompañada de audífonos con la canción correspondiente. Imagen y sonido nacieron del mismo proceso creativo.",
      en:
        "Ecamhi's debut EP and PHŌNÉ Records' inaugural release. Interdisciplinary album where four photographs captured on international tours inspired four songs. The launch was presented as a photo exhibition where each picture was accompanied by headphones with the corresponding song. Image and sound born from the same creative process.",
    },
    credits: [
      { role: "Voz", name: "Catalina Aguilera (Con.fusión)" },
      { role: "Composición y sax", name: "Vicente Aravena" },
      { role: "Producción", name: "Enrique Camhi" },
      { role: "Mezcla", name: "Enrique Camhi" },
      { role: "Master", name: "Daniel Pérez" },
    ],
  },
];

export const releaseSlugs = releases.map((r) => r.slug);

export function getRelease(slug: string): Release | undefined {
  return releases.find((r) => r.slug === slug);
}

export function getReleasesByArtist(artistSlug: string): Release[] {
  return releases
    .filter((r) => r.artistSlug === artistSlug)
    .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
}

export function getAllReleasesSorted(): Release[] {
  return [...releases].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
}
