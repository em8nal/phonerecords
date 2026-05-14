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
  cover?: string;
  /** Co-credited roster artists; release appears under their filter too. */
  featuredArtistSlugs?: string[];
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
          { label: "Spotify", href: "https://open.spotify.com/album/7eICxMxArdEHZdkQY40n0N" },
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
          { label: "YouTube", href: "https://www.youtube.com/watch?v=yyKGWQ7RwKk" },
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
          { label: "Spotify", href: "https://open.spotify.com/album/6lhHBFeEds0AxMPKbVZD7U" },
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
          { label: "Spotify", href: "https://open.spotify.com/album/38wiZ5NMBVnXPLwk8dUiVL" },
],
  },
  {
    slug: "newen-afrobeat-newen-plays-fela-vinyl-2023",
    title: "Newen Plays Fela (12\" Vinyl)",
    artistSlug: "newen-afrobeat",
    artistName: "Newen Afrobeat",
    releaseDate: "2023-01-01",
    year: 2023,
    type: "ep",
    format: "Vinilo · 12\" Mini-Album · Limited Edition",
    label: "PHŌNÉ Records",
    cover: "https://i.discogs.com/V_c_R4zAmfvxQztwqufyZABwIIJF49zOobJ0bc-6Vdg/rs:fit/g:sm/q:90/h:587/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTI5MDUx/NTM2LTE3MDEyMDQw/MDMtNTQ4OS5qcGVn.jpeg",
    description: {
      es:
        "Edición limitada en vinilo 12\" del EP Newen Plays Fela, prensada en Chile por PHŌNÉ Records en 2023. Reúne las composiciones del EP original (2017) en formato físico.",
      en:
        "Limited 12\" vinyl edition of the Newen Plays Fela EP, pressed in Chile by PHŌNÉ Records in 2023. Gathers the original EP compositions (2017) in physical format.",
    },
    links: [
      { label: "Discogs", href: "https://www.discogs.com/release/29051536" },
          { label: "Bandcamp", href: "https://officehomerecords.bandcamp.com/album/newen-plays-fela" },
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
          { label: "Spotify", href: "https://open.spotify.com/album/7kbrxZhgajOSi6rT5o3pkC" },
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
      { label: "Apple Music", href: "https://music.apple.com/us/album/memorias-mixtape/1854040694" },
      { label: "Bandcamp", href: "https://klausb.bandcamp.com/album/memorias-mixtape" },
          { label: "Spotify", href: "https://open.spotify.com/album/3G6RYtdVGxDhkeVcX9aesa" },
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
          { label: "Spotify", href: "https://open.spotify.com/album/7fP1wduZdnVnuOLSI9Yf1N" },
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
          { label: "Spotify", href: "https://open.spotify.com/album/16r8e8DumGptUVPVXngllB" },
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
    cover: "https://f4.bcbits.com/img/a2824675677_10.jpg",
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
          { label: "Spotify", href: "https://open.spotify.com/album/1gyghb9fmPwRUrk5ol1WrL" },
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
    cover: "https://f4.bcbits.com/img/a4131860185_10.jpg",
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
          { label: "Spotify", href: "https://open.spotify.com/album/2KYfzVZSsEkPsJv12YN5rN" },
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
          { label: "Spotify", href: "https://open.spotify.com/album/0CzojB3HQtWpEkvZnGfmo3" },
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
          { label: "Spotify", href: "https://open.spotify.com/album/1E15jH8wgNsJXCl4ZWHTVB" },
],
  },
  {
    slug: "klaus-b-espejismos",
    title: "Espejismos",
    artistSlug: "klaus-brantmayer",
    artistName: "Klaus B",
    releaseDate: "2021-11-12",
    year: 2021,
    type: "single",
    format: "Single · digital",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/99/23/1e/99231ed5-787f-3488-a8a6-fe9698d9e3b0/0.jpg/1000x1000bb.jpg",
    description: {
      es:
        "Single instrumental de Klaus B publicado a fines de 2021. Pieza atmosférica que extiende la línea funk/neo-soul iniciada con Viento Radiante.",
      en:
        "Klaus B instrumental single released in late 2021. Atmospheric piece extending the funk/neo-soul line opened with Viento Radiante.",
    },
    links: [
      { label: "Apple Music", href: "https://music.apple.com/us/album/espejismos/1591949693" },
          { label: "Spotify", href: "https://open.spotify.com/album/3Yig3Xizb6XfBdNvKw11tb" },
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
          { label: "Spotify", href: "https://open.spotify.com/album/0LZBjCeS3MQkhxahbxXqMJ" },
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
  {
    slug: "ecamhi-gaviotas",
    title: "Gaviotas (feat. Felipe Montero & Enrique Camhi)",
    artistSlug: "ecamhi",
    artistName: "Diego de la Noche feat. Enrique Camhi",
    releaseDate: "2022-11-09",
    year: 2022,
    type: "single",
    format: "Single · digital",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/1d/19/c3/1d19c399-c5a2-a510-0f2d-9e83855fea82/artwork.jpg/1000x1000bb.jpg",
    description: {
      es:
        "Aparición de Enrique Camhi (Ecamhi) como invitado en Gaviotas, single de Diego de la Noche con Felipe Montero. Trompeta sobre un beat de pop electrónico de cámara.",
      en:
        "Enrique Camhi (Ecamhi) appears as guest on Gaviotas, a Diego de la Noche single with Felipe Montero. Trumpet over a chamber electronic-pop beat.",
    },
    links: [
      { label: "Apple Music", href: "https://music.apple.com/us/album/gaviotas-feat-felipe-montero-enrique-camhi-radio-edit/1654207363" },
    ],
  },
  {
    slug: "ecamhi-laruz",
    title: "Laruz (feat. Enrique Camhi)",
    artistSlug: "ecamhi",
    artistName: "Diego de la Noche feat. Enrique Camhi",
    releaseDate: "2022-11-09",
    year: 2022,
    type: "single",
    format: "Single · digital",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/b0/d6/b5/b0d6b5b4-7d56-28cf-33f7-9ace20c4fc36/artwork.jpg/1000x1000bb.jpg",
    description: {
      es:
        "Aparición de Ecamhi en Laruz, single de Diego de la Noche publicado el mismo día que Gaviotas (noviembre 2022).",
      en:
        "Ecamhi appears on Laruz, a Diego de la Noche single released the same day as Gaviotas (November 2022).",
    },
    links: [
      { label: "Apple Music", href: "https://music.apple.com/us/album/laruz-feat-enrique-camhi/1654191971" },
    ],
  },
  {
    slug: "ecamhi-ofrenda-de-amor",
    title: "Ofrenda De Amor",
    artistSlug: "ecamhi",
    artistName: "Ugnė Danielė, Enrique Camhi & Adydo",
    releaseDate: "2024-08-15",
    year: 2024,
    type: "single",
    format: "Single · digital",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/38/6b/bb/386bbbc9-a0b9-255c-c793-66d93238cd9c/artwork.jpg/1000x1000bb.jpg",
    description: {
      es:
        "Single co-firmado por Ugnė Danielė, Enrique Camhi y Adydo. Cruza chamber-jazz con voces e improvisación europea-sudamericana.",
      en:
        "Single co-signed by Ugnė Danielė, Enrique Camhi and Adydo. Crosses chamber-jazz with vocals and European–South American improvisation.",
    },
    links: [
      { label: "Apple Music", href: "https://music.apple.com/us/album/ofrenda-de-amor/1762193381" },
    ],
  },
  {
    slug: "ecamhi-mad-summer",
    title: "Mad Summer",
    artistSlug: "ecamhi",
    artistName: "Alejandro Camhi & Enrique Camhi",
    releaseDate: "2024-07-03",
    year: 2024,
    type: "single",
    format: "Single · digital",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ce/a0/f2/cea0f2b6-47f9-8d1e-5646-a29f601424be/artwork.jpg/1000x1000bb.jpg",
    description: {
      es:
        "Single firmado por Alejandro Camhi y Enrique Camhi. Verano electrónico con trompeta encima.",
      en:
        "Single signed by Alejandro Camhi and Enrique Camhi. Electronic summer with trumpet on top.",
    },
    links: [
      { label: "Apple Music", href: "https://music.apple.com/us/album/mad-summer/1752686994" },
          { label: "Spotify", href: "https://open.spotify.com/album/5oz3aK8wTsaB7BE7Po5s8i" },
],
  },
  {
    slug: "ecamhi-fake-money",
    title: "Fake Money",
    artistSlug: "ecamhi",
    artistName: "4Yo4U & Enrique Camhi",
    releaseDate: "2025-08-22",
    year: 2025,
    type: "single",
    format: "Single · digital",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/4d/5f/c4/4d5fc454-7958-7218-cfc5-fe5922a2da7a/199502158057_cover.jpg/1000x1000bb.jpg",
    description: {
      es:
        "Single de 4Yo4U con Enrique Camhi. Trompeta sobre electrónica contemporánea, eco del lenguaje de en viaje.",
      en:
        "4Yo4U single featuring Enrique Camhi. Trumpet over contemporary electronics, echoing the en viaje language.",
    },
    links: [
      { label: "Apple Music", href: "https://music.apple.com/us/album/fake-money/1831169551" },
          { label: "Spotify", href: "https://open.spotify.com/album/0vUmk1NoVEPc0Kb4kut9iy" },
],
  },
  {
    slug: "ecamhi-fake-love",
    title: "Fake Love",
    artistSlug: "ecamhi",
    artistName: "Enrique Camhi & Felipe Cortes",
    releaseDate: "2021-04-09",
    year: 2021,
    type: "single",
    format: "Single · digital",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/4e/bf/78/4ebf78f4-a3bb-02f6-9374-436c8719d001/cover.jpg/1000x1000bb.jpg",
    description: {
      es:
        "Single co-firmado por Enrique Camhi y Felipe Cortes. Primer registro publicado bajo el nombre Enrique Camhi previo al EP en viaje.",
      en:
        "Single co-signed by Enrique Camhi and Felipe Cortes. First record released under the Enrique Camhi name prior to the en viaje EP.",
    },
  },
  {
    slug: "ecamhi-move-to",
    title: "Move To",
    artistSlug: "ecamhi",
    artistName: "Enrique Camhi",
    releaseDate: "2022-05-19",
    year: 2022,
    type: "single",
    format: "Single · digital",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/3e/11/34/3e11342c-ef83-217d-471d-cda2270ed24b/00_Cover_Art.jpg/1000x1000bb.jpg",
    description: {
      es:
        "Single solista de Enrique Camhi (Ecamhi) publicado previo al EP inaugural en viaje. Trompeta y producción propia: precedente del lenguaje interdisciplinar del proyecto.",
      en:
        "Solo single by Enrique Camhi (Ecamhi), released prior to the inaugural EP en viaje. Trumpet and self-production: a precedent of the project's interdisciplinary language.",
    },
    links: [
      { label: "Apple Music", href: "https://music.apple.com/us/album/move-to/1618064796" },
          { label: "Spotify", href: "https://open.spotify.com/album/79OqBRxmaAO9kKVmfQf5BV" },
],
  },
  {
    slug: "claudio-solis-noche-oscura-del-alma",
    title: "Noche Oscura Del Alma",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis & Fco Martinez",
    featuredArtistSlugs: ["ecamhi"],
    releaseDate: "2023-12-15",
    year: 2023,
    type: "single",
    format: "Single · digital",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/dc/36/68/dc366893-4b0b-8110-9c40-77de890020eb/00_Cover_Art.jpg/1000x1000bb.jpg",
    description: {
      es:
        "Pieza minimal de tensión nocturna firmada por Claudio Solís y Fco Martinez, con Enrique Camhi en trompeta.",
      en:
        "Minimal piece of nocturnal tension signed by Claudio Solís and Fco Martinez, with Enrique Camhi on trumpet.",
    },
    links: [
      { label: "Apple Music", href: "https://music.apple.com/us/album/noche-oscura-del-alma/1716215340" },
          { label: "Spotify", href: "https://open.spotify.com/album/4gABlVNEoQvHDi6Lrsymhj" },
],
  },
  {
    slug: "claudio-solis-apagon",
    title: "Apagon",
    artistSlug: "claudio-solis",
    artistName: "Fco Martinez, Claudio Solis & Enrique Camhi",
    featuredArtistSlugs: ["ecamhi"],
    releaseDate: "2024-04-10",
    year: 2024,
    type: "single",
    format: "Single · digital",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/91/04/f2/9104f232-bda3-da2d-546a-3258f5993ac4/cover.jpg/1000x1000bb.jpg",
    description: {
      es:
        "Single triple-firmado entre Fco Martinez, Claudio Solís y Enrique Camhi. Continuación del eje minimal/trompeta abierto con Mystical Healers y Noche Oscura.",
      en:
        "Triple-signed single between Fco Martinez, Claudio Solís and Enrique Camhi. Continuation of the minimal/trumpet axis opened with Mystical Healers and Noche Oscura.",
    },
    links: [
      { label: "Apple Music", href: "https://music.apple.com/us/album/apagon-single/1737220462" },
          { label: "Spotify", href: "https://open.spotify.com/album/4rdQjtwBjKEJBvbUBg60PB" },
],
  },
  {
    slug: "claudio-solis-kototama-single",
    title: "Kototama (single)",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis & Seymour",
    releaseDate: "2025-06-25",
    year: 2025,
    type: "single",
    format: "Single · digital",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/dc/2e/b5/dc2eb59e-25e6-7f6e-1520-78c0a5e9c34a/00_Cover_Art.jpg/1000x1000bb.jpg",
    description: {
      es:
        "Versión digital del tema Kototama, co-firmado con Seymour. La edición en vinilo 12\" EP en Aquarians (2025) se publica en paralelo.",
      en:
        "Digital version of Kototama, co-signed with Seymour. The 12\" EP vinyl edition on Aquarians (2025) is released in parallel.",
    },
    links: [
      { label: "Apple Music", href: "https://music.apple.com/us/album/kototama-single/1811269979" },
          { label: "Spotify", href: "https://open.spotify.com/album/3xiMEtzaeGB1ZQnVdOWnsj" },
],
  },
  {
    slug: "claudio-solis-ecamhi-mystical-healers",
    title: "Mystical Healers I",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis & Enrique Camhi",
    featuredArtistSlugs: ["ecamhi"],
    releaseDate: "2023-09-28",
    year: 2023,
    type: "single",
    format: "Single · digital",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/b7/c5/d5/b7c5d533-ca30-e705-5a4c-fc15915e3882/00_Cover_Art.jpg/1000x1000bb.jpg",
    description: {
      es:
        "Primer single de la serie Mystical Healers, co-firmada por Claudio Solís y Enrique Camhi (Ecamhi). Antecedente directo del EP Ebs (2023).",
      en:
        "First single in the Mystical Healers series, co-signed by Claudio Solís and Enrique Camhi (Ecamhi). Direct precursor to the Ebs EP (2023).",
    },
    links: [
      { label: "Apple Music", href: "https://music.apple.com/us/album/mystical-healers-i/1702724386" },
          { label: "Spotify", href: "https://open.spotify.com/album/4bZlX9R4fxnhLJkvbWQoHz" },
],
  },
  {
    slug: "claudio-solis-ecamhi-ebs",
    title: "Ebs",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis & Enrique Camhi",
    featuredArtistSlugs: ["ecamhi"],
    releaseDate: "2023-11-30",
    year: 2023,
    type: "ep",
    format: "EP · digital",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/92/af/c9/92afc9d4-36ca-9d50-b32b-9c9176509368/00_Cover_Art.jpg/1000x1000bb.jpg",
    description: {
      es:
        "EP colaborativo entre Claudio Solís y Enrique Camhi (Ecamhi): minimal y trompeta en diálogo extendido. Lanzamiento conjunto dentro del ecosistema PHŌNÉ.",
      en:
        "Collaborative EP between Claudio Solís and Enrique Camhi (Ecamhi): minimal and trumpet in extended dialogue. Joint release within the PHŌNÉ ecosystem.",
    },
    links: [
      { label: "Apple Music", href: "https://music.apple.com/us/album/ebs-ep/1713387572" },
          { label: "Spotify", href: "https://open.spotify.com/album/2AmxKOl3gKbLOInH9VSWYP" },
],
  },

  // ─────────── Claudio Solís — series consolidadas ───────────
  {
    slug: "claudio-solis-sons-of-medusa",
    title: "Sons of Medusa I–IV",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2025-07-10",
    year: 2025,
    type: "album",
    format: "Vinilo · 4× LP · serie",
    label: "Vyasa Discos · Aquarians",
    cover: "https://es-ew1-prod-assets.s3.eu-west-1.amazonaws.com/releases/f2bfccf4-b6b3-48b7-a88e-7b12641ff963/93a3251a08f142c8281fef203d70601f-og-product-image.png",
    description: {
      es:
        "Obra mayor de Solís en 2025: cuatro volúmenes de vinilo prensados por Vyasa Discos y distribuidos digitalmente vía Aquarians como un álbum único de veinte tracks. La serie despliega su gramática actual de dark minimal en formato extendido — paciencia, repetición y mutación gradual — y consolida la arquitectura sonora que viene desarrollando desde Occvltheque. Cada volumen funciona como movimiento independiente dentro de una sola obra.",
      en:
        "Solís's major 2025 work: four vinyl volumes pressed by Vyasa Discos and distributed digitally via Aquarians as a single twenty-track album. The series unfolds his current dark-minimal grammar at extended length — patience, repetition, gradual mutation — and consolidates the sonic architecture developed since Occvltheque. Each volume functions as a movement within one piece.",
    },
    links: [
      { label: "Vinilo · Vol. I", href: "https://elasticstage.com/vyasa-discos/releases/sons-of-medusa-album" },
      { label: "Vinilo · Vol. II", href: "https://elasticstage.com/vyasa-discos/releases/sons-of-medusa-ii-album" },
      { label: "Vinilo · Vol. III", href: "https://elasticstage.com/vyasa-discos/releases/sons-of-medusa-iii-album" },
      { label: "Vinilo · Vol. IV", href: "https://elasticstage.com/vyasa-discos/releases/sons-of-medusa-iv-album" },
    ],
  },
  {
    slug: "claudio-solis-occvltheque",
    title: "Occvltheque I–II",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2024-11-08",
    year: 2024,
    type: "album",
    format: "Vinilo · 2× LP · serie",
    label: "Aquarians / Vyasa Discos",
    cover: "https://es-ew1-prod-assets.s3.eu-west-1.amazonaws.com/releases/0f9daafa-6ad2-4e54-b9c6-1e186117f4e5/ef1182575fcab1850d57c02ba04d00fd-og-product-image.png",
    description: {
      es:
        "Doble LP que define el canon dark minimal de Solís bajo Aquarians. Diez tracks por volumen, prensados en vinilo por Vyasa Discos y publicados digitalmente como una sola unidad (AQRNS021/021B). Estructuras rítmicas despojadas, presión inmersiva en bajas frecuencias y texturas oscurecidas que privilegian la atmósfera por sobre el impacto. Es el disco que mejor articula el método de combustión lenta que Solís viene refinando desde hace una década.",
      en:
        "Double LP that defines Solís's dark-minimal canon under Aquarians. Ten tracks per volume, pressed on vinyl by Vyasa Discos and released digitally as a single unit (AQRNS021/021B). Stripped rhythmic structures, immersive low-frequency pressure and shadowed textures that privilege atmosphere over impact. The release that best articulates the slow-burn method Solís has been refining for a decade.",
    },
    links: [
      { label: "Vinilo · Vol. I", href: "https://elasticstage.com/vyasa-discos/releases/occvltheque-i-album" },
      { label: "Vinilo · Vol. II", href: "https://elasticstage.com/vyasa-discos/releases/occvltheque-ii-album" },
    ],
  },
  {
    slug: "claudio-solis-doing-without-saying",
    title: "Doing Without Saying I–II",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2024-06-26",
    year: 2024,
    type: "album",
    format: "Vinilo · 2× LP · serie",
    label: "Vyasa Discos / Claudio Solis Series",
    cover: "https://es-ew1-prod-assets.s3.eu-west-1.amazonaws.com/releases/7c4584d2-da7a-4c8b-ae3b-207344a44318/1bcd1dda56d6a53409dcebd5fe42b5f9-og-product-image.png",
    description: {
      es:
        "Serie en dos volúmenes que pone en práctica su título: composición despojada de elementos prescindibles, ejercicio de sustracción aplicado al minimal techno. Diez tracks distribuidos en dos LPs en Vyasa Discos, con edición digital paralela en Claudio Solis Series. Hay menos elementos por compás que en cualquier otra serie suya — y la decisión es estética, no carencia. Cada track explora el umbral entre lo necesario y lo redundante.",
      en:
        "A two-volume series that enacts its title: composition stripped of dispensable elements, an exercise in subtraction applied to minimal techno. Ten tracks across two LPs on Vyasa Discos, with parallel digital edition on Claudio Solis Series. Fewer elements per bar than any other series of his — an aesthetic decision, not scarcity. Each track explores the threshold between what's needed and what's redundant.",
    },
    links: [
      { label: "Vinilo · Vol. I", href: "https://elasticstage.com/vyasa-discos/releases/doing-without-saying-album" },
      { label: "Vinilo · Vol. II", href: "https://elasticstage.com/vyasa-discos/releases/doing-without-saying-ii-album" },
    ],
  },
  {
    slug: "claudio-solis-nothing-but-the-truth",
    title: "Nothing But The Truth I–IV",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2023-08-15",
    year: 2023,
    type: "ep",
    format: "Vinilo · 4× EP · serie",
    label: "Vyasa Discos",
    cover: "https://es-ew1-prod-assets.s3.eu-west-1.amazonaws.com/releases/a17983dd-20a6-4682-b7ad-6f383d4e5e2c/2ac41a108f8e761bf4bbeac5e17e3c5b-og-product-image.png",
    description: {
      es:
        "Cuatro EPs en vinilo que conforman la serie más larga del catálogo Vyasa Discos. Once tracks repartidos a través de un año, escritos como declaraciones cortas y directas — sin floritura ni interludio. La premisa del título se cumple en la práctica: no hay disfraz instrumental, solo el groove despojado de su funda. Es la entrada más franca al lenguaje rítmico de Solís y el puente entre su lado más espiritual (Kirtan Club) y el actual canon dark.",
      en:
        "Four vinyl EPs that form the longest series in the Vyasa Discos catalogue. Eleven tracks released across a year, written as short and direct statements — no ornament, no interlude. The title's premise plays out in practice: no instrumental disguise, just the groove with its cover removed. The frankest entry into Solís's rhythmic language and the bridge between his more spiritual side (Kirtan Club) and the current dark canon.",
    },
    links: [
      { label: "Vinilo · Vol. Vinilo", href: "https://elasticstage.com/vyasa-discos/releases/nothing-but-the-truth-singleep" },
      { label: "Vinilo · Vol. II", href: "https://elasticstage.com/vyasa-discos/releases/nothing-but-the-truth-ii-singleep" },
      { label: "Vinilo · Vol. III", href: "https://elasticstage.com/vyasa-discos/releases/nothing-but-the-truth-iii-singleep" },
      { label: "Vinilo · Vol. IV", href: "https://elasticstage.com/vyasa-discos/releases/nothing-but-the-truth-iv-singleep" },
    ],
  },
  {
    slug: "claudio-solis-pleroma",
    title: "Pleroma I–II",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2022-09-15",
    year: 2022,
    type: "album",
    format: "Vinilo · 2× LP · serie",
    label: "Vyasa Discos / Claudio Solis Series",
    cover: "https://es-ew1-prod-assets.s3.eu-west-1.amazonaws.com/releases/ae58f72e-d427-42fb-b910-d446aaa71de1/d8cd5fe8d763548170bd6b5e8ee9c8cf-og-product-image.png",
    description: {
      es:
        "Pleroma —del griego, plenitud— pone en eje la idea de saturación armónica desde la economía rítmica. Dos LPs en Vyasa Discos donde Solís estira frecuencias graves hasta volverlas habitación, no decorado. Es el punto donde su lectura de la tradición minimal alemana se cruza con el espiritualismo del catálogo Kirtan; un disco para escuchar más que para pinchar, aunque opera intacto en ambas situaciones. Marca el inicio de su serie de obras largas en formato vinilo.",
      en:
        "Pleroma — Greek for fullness — centers harmonic saturation through rhythmic economy. Two LPs on Vyasa Discos where Solís stretches low frequencies until they become a room, not décor. The point where his reading of German minimal tradition meets the spiritualism of the Kirtan catalogue; a record for listening more than for DJing, though it operates intact in both situations. Marks the start of his long-form vinyl series.",
    },
    links: [
      { label: "Vinilo · Vol. I", href: "https://elasticstage.com/vyasa-discos/releases/pleroma-album" },
      { label: "Vinilo · Vol. II", href: "https://elasticstage.com/vyasa-discos/releases/pleroma-ii-album" },
    ],
  },
  {
    slug: "claudio-solis-kirtan-club",
    title: "Kirtan Club I–II",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2021-09-15",
    year: 2021,
    type: "ep",
    format: "Vinilo · 2× EP · serie",
    label: "Vyasa Discos / Claudio Solis Series",
    cover: "https://es-ew1-prod-assets.s3.eu-west-1.amazonaws.com/releases/9bac8b51-31d0-4c9b-8740-31032f930b05/ac1adc4719e4db83c2f8d63ef5814b41-og-product-image.png",
    description: {
      es:
        "Dos EPs que llevan el lenguaje del kirtan —canto devocional hindú repetido en grupo— al club. Solís construye loops largos sobre patterns bhakti, despojando el material de literalidad religiosa para dejar el principio rítmico: la repetición como ascesis. Es el antecedente directo de Goura Nitai y Devotional Service, y la entrada explícita de la espiritualidad como método compositivo, no como tema decorativo, en su catálogo Vyasa.",
      en:
        "Two EPs that bring the language of kirtan —Hindu devotional chanting repeated in group— into the club. Solís builds long loops over bhakti patterns, stripping the material of religious literalness to leave the rhythmic principle: repetition as ascesis. Direct precursor to Goura Nitai and Devotional Service, and the explicit entry of spirituality as compositional method, not decorative theme, into his Vyasa catalogue.",
    },
    links: [
      { label: "Vinilo · Vol. I", href: "https://elasticstage.com/vyasa-discos/releases/kirtan-club-singleep" },
      { label: "Vinilo · Vol. II", href: "https://elasticstage.com/vyasa-discos/releases/kirtan-club-ii-singleep" },
    ],
  },
  {
    slug: "claudio-solis-la-puerta-abre-hacia-adentro",
    title: "La Puerta Abre Hacia Adentro I–II",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2022-04-20",
    year: 2022,
    type: "album",
    format: "Vinilo · LP + EP · serie",
    label: "Vyasa Discos / Robot Ranch Records",
    cover: "https://es-ew1-prod-assets.s3.eu-west-1.amazonaws.com/releases/b7561ee6-542d-4e58-a4d5-492881a192c4/e92b8d77a470c95cb41ef780eca4a77d-og-product-image.png",
    description: {
      es:
        "Díptico con vol. I en LP y vol. II en EP, que toma la frase como instrucción de uso. Música compuesta hacia adentro: hipnosis lenta, sin gancho, sin propósito de pista de baile. Vyasa Discos prensa el vinilo, Robot Ranch Records administra la versión digital. Es uno de los trabajos más íntimos del catálogo de Solís y un manifiesto sin texto sobre el rol introspectivo de la música minimal — el público que escucha es el público que entra.",
      en:
        "Diptych with vol. I on LP and vol. II on EP, taking the phrase as an instruction manual. Music composed inwards: slow hypnosis, no hook, no dancefloor agenda. Vyasa Discos presses the vinyl, Robot Ranch Records handles digital. One of the most intimate works in Solís's catalogue and a wordless manifesto on the introspective role of minimal music — the audience that listens is the audience that enters.",
    },
    links: [
      { label: "Vinilo · Vol. I", href: "https://elasticstage.com/vyasa-discos/releases/la-puerta-abre-hacia-adentro-album" },
      { label: "Vinilo · Vol. II", href: "https://elasticstage.com/vyasa-discos/releases/la-puerta-abre-hacia-adentro-ii-singleep" },
    ],
  },

  // ─────────── Con.fusión ───────────
  {
    slug: "con-fusion-aua",
    title: "Aüa",
    artistSlug: "con-fusion",
    artistName: "Con.fusión",
    releaseDate: "2021-02-26",
    year: 2021,
    type: "single",
    format: "Single · digital",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/cd/61/ca/cd61ca54-884f-8045-cf53-78550b4b960c/0.jpg/1000x1000bb.jpg",
    description: {
      es:
        "Single de Con.fusión en colaboración con Fat Jota. Voz como instrumento sobre beats orgánicos: hip hop, jazz y neo soul en clave de canción breve.",
      en:
        "Con.fusión single in collaboration with Fat Jota. Voice as instrument over organic beats: hip hop, jazz and neo soul as compact song-form.",
    },
    links: [
      { label: "Apple Music", href: "https://music.apple.com/us/album/a%C3%BCa/1565365860" },
          { label: "Spotify", href: "https://open.spotify.com/album/0GwDOXlD8aVBp5kH6HrK3U" },
],
  },
  {
    slug: "con-fusion-que-aburrido",
    title: "Que Aburrido!",
    artistSlug: "con-fusion",
    artistName: "Con.fusión",
    releaseDate: "2020-07-10",
    year: 2020,
    type: "single",
    format: "Single · digital",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/5d/ca/30/5dca302d-2a10-e04e-cfbc-4f5604f5cb67/0.jpg/1000x1000bb.jpg",
    description: {
      es:
        "Single con Fat Jota. Beat hip hop con flow vocal mestizo entre rap, scat y melodía. Una declaración temprana del lenguaje de Con.fusión.",
      en:
        "Single with Fat Jota. Hip hop beat with a vocal flow that crosses rap, scat and melody. An early statement of Con.fusión's voice.",
    },
    links: [
      { label: "Apple Music", href: "https://music.apple.com/us/album/que-aburrido/1518666439" },
          { label: "Spotify", href: "https://open.spotify.com/album/5OvNVAP10yNQF4uuJPfwWC" },
],
  },
  {
    slug: "con-fusion-borboleta",
    title: "Borboleta (feat. Ziervo)",
    artistSlug: "con-fusion",
    artistName: "Con.fusión",
    releaseDate: "2020-10-08",
    year: 2020,
    type: "single",
    format: "Single · digital",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/35/52/db/3552dbb8-895c-2cfb-cbde-30cd6e80a14b/0.jpg/1000x1000bb.jpg",
    description: {
      es:
        "Single en portugués con Ziervo. Cruza neo soul, jazz y guiños a la MPB; muestra la dimensión cinematográfica del proyecto.",
      en:
        "Portuguese-language single with Ziervo. Crosses neo soul, jazz and MPB hints; shows the project's cinematic dimension.",
    },
    links: [
      { label: "Apple Music", href: "https://music.apple.com/us/album/borboleta-feat-ziervo/1531907261" },
          { label: "Spotify", href: "https://open.spotify.com/album/54odnPn2yW5ynEhjsgZ5mk" },
],
  },
  // ─────────── Claudio Solís — vinilos individuales ───────────
  {
    slug: "claudio-solis-kalki",
    title: "Kalki",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2026-01-15",
    year: 2026,
    type: "album",
    format: "Vinilo · LP",
    label: "Vyasa Discos",
    cover: "https://es-ew1-prod-assets.s3.eu-west-1.amazonaws.com/releases/5ded7581-2d8b-457e-be0f-3723a51dd28f/182a2bec17a2ba0312184fcd8da53521-og-product-image.png",
    description: {
      es: "Primer LP de Solís en 2026. Kalki —nombre del avatar futuro en la tradición hindú— funciona aquí como gesto programático: una declaración sobre lo que viene. El disco extiende la línea minimal-techno de Occvltheque hacia un territorio más físico, con grooves de mayor presencia y narrativa de larga duración. Vyasa Discos lo prensa en vinilo como continuidad natural del catálogo VD; queda abierto en la conversación entre el ciclo Sons of Medusa y los próximos volúmenes anunciados.",
      en: "Solís's first LP of 2026. Kalki — Hindu tradition's name for the future avatar — functions here as programmatic gesture: a statement about what's coming. The record extends the minimal-techno line of Occvltheque towards more physical territory, with weightier grooves and long-form narrative. Vyasa Discos presses it on vinyl as natural continuity of the VD catalogue; it stays open in the conversation between the Sons of Medusa cycle and the next announced volumes.",
    },
    links: [
      { label: "Comprar vinilo", href: "https://elasticstage.com/vyasa-discos/releases/kalki-album" },
    ],
  },
  {
    slug: "claudio-solis-ciencia-oculta",
    title: "Ciencia Oculta",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2025-09-20",
    year: 2025,
    type: "ep",
    format: "Vinilo · 12\" EP",
    label: "Vyasa Discos",
    cover: "https://es-ew1-prod-assets.s3.eu-west-1.amazonaws.com/releases/0bc5831d-6b26-4049-96d2-ecc270ba6203/a8b9722ef21d08aea1fc6cd980fa28cd-og-product-image.png",
    description: {
      es: "EP corto de 2025 publicado entre los volúmenes de Sons of Medusa. Toma el título —ciencia oculta, traducción literal de occulta scientia— como guía formal: secuencias rítmicas que sugieren sistemas internos sin explicitarlos, presión inmersiva en frecuencias bajas y modulaciones sutiles que recompensan la escucha repetida. Vyasa Discos lo edita en 12\" como entrada lateral al ciclo principal del año.",
      en: "Short 2025 EP released between the Sons of Medusa volumes. Takes the title — occult science, literal translation of occulta scientia — as formal guide: rhythmic sequences suggesting inner systems without making them explicit, immersive low-frequency pressure and subtle modulations that reward repeated listening. Vyasa Discos releases it on 12\" as a side entry to the year's main cycle.",
    },
    links: [
      { label: "Comprar vinilo", href: "https://elasticstage.com/vyasa-discos/releases/ciencia-oculta-singleep" },
    ],
  },
  {
    slug: "claudio-solis-kototama-vinyl",
    title: "Kototama (12\" vinyl)",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2025-06-11",
    year: 2025,
    type: "ep",
    format: "Vinilo · 12\" EP",
    label: "Aquarians",
    cover: "https://es-ew1-prod-assets.s3.eu-west-1.amazonaws.com/releases/5b2b13f7-b3fa-40e0-87e5-2122d07bd9cf/98e8701d3742b308f3df1efc3c1b82d1-og-product-image.png",
    description: {
      es: "Versión en vinilo del EP firmado por Claudio Solis y Seymour (CL), publicado en Aquarians como AQRNS027 en simultáneo con la edición digital. Kototama —en japonés, el alma de la palabra— sirve como concepto de partida para tres tracks que tratan el sonido como vibración con significado propio. Es el único release del año con Seymour como co-firmante, y el puente más reciente entre Solís y la nueva camada de productores chilenos.",
      en: "Vinyl version of the EP signed by Claudio Solis and Seymour (CL), released on Aquarians as AQRNS027 alongside the digital edition. Kototama — Japanese for the soul of the word — provides the starting concept for three tracks treating sound as vibration with intrinsic meaning. The year's only release with Seymour as co-signer, and the most recent bridge between Solís and the new wave of Chilean producers.",
    },
    links: [
      { label: "Comprar vinilo", href: "https://elasticstage.com/aquarians/releases/kototama-singleep" },
    ],
  },
  {
    slug: "claudio-solis-magical-correspondences",
    title: "Magical Correspondences",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2023-11-10",
    year: 2023,
    type: "album",
    format: "Vinilo · LP",
    label: "Vyasa Discos",
    cover: "https://es-ew1-prod-assets.s3.eu-west-1.amazonaws.com/releases/4fbb6c9d-1189-4f9b-9961-4cadfd256b42/b0f9a88eed7072b970e5aa426313f36c-og-product-image.png",
    description: {
      es: "LP que adopta el principio hermético de las correspondencias —como es arriba, es abajo— como método compositivo. Solís estructura cada track en pares: pattern y respuesta, gesto y eco, decisión y consecuencia. Es uno de los discos más conceptuales del catálogo Vyasa: música pensada como sistema de relaciones simétricas, no como sucesión lineal de eventos. Vinyl que opera mejor en escucha completa que en pinchazo aislado.",
      en: "LP that adopts the hermetic principle of correspondences — as above, so below — as compositional method. Solís structures each track in pairs: pattern and response, gesture and echo, decision and consequence. One of the most conceptual records in the Vyasa catalogue: music thought as a system of symmetrical relations, not a linear succession of events. A vinyl that works better in full listen than in isolated cuing.",
    },
    links: [
      { label: "Comprar vinilo", href: "https://elasticstage.com/vyasa-discos/releases/magical-correspondences-album" },
    ],
  },
  {
    slug: "claudio-solis-diez",
    title: "Diez",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2023-05-20",
    year: 2023,
    type: "ep",
    format: "Vinilo · 12\" EP",
    label: "Vyasa Discos / Claudio Solis Series",
    cover: "https://es-ew1-prod-assets.s3.eu-west-1.amazonaws.com/releases/75c30138-9847-40e3-b687-d19442d81095/60c6ed2558b2fff2734406648a6b2c9c-og-product-image.png",
    description: {
      es: "EP que toma el número como estructura: diez años de catálogo desde el primer release en Agua y Sed (2009), diez tracks en lista cerrada. Funciona como balance interno —no como retrospectiva pública— y como puente formal entre la línea más reciente de Kirtan Club y el dark minimal expandido de Pleroma. Vyasa Discos lo prensa con tirada limitada; Claudio Solis Series administra la versión digital paralela.",
      en: "EP that takes the number as structure: ten years of catalogue since the first release on Agua y Sed (2009), ten tracks in closed list. Functions as internal balance — not public retrospective — and as formal bridge between the most recent Kirtan Club line and the expanded dark minimal of Pleroma. Vyasa Discos presses it with limited run; Claudio Solis Series handles the parallel digital edition.",
    },
    links: [
      { label: "Comprar vinilo", href: "https://elasticstage.com/vyasa-discos/releases/diez-singleep" },
    ],
  },
  {
    slug: "claudio-solis-5ur-003",
    title: "5UR 003 — Various Artists",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2023-04-15",
    year: 2023,
    type: "compilation",
    format: "Vinilo · 12\" EP 180g · Ltd",
    label: "5 Universos Records",
    description: {
      es: "Tercera entrega de la compilación Various Artists en 12\" 180g de 5 Universos Records. Solís aporta un track y firma el mastering del prensaje completo (que extiende a todo el catálogo del sello, vinilo y digital). Sold out en su lanzamiento, queda como un artefacto físico que documenta la red minimal chilena de mediados de los 2020s, conectando productores locales con figuras europeas vía la curaduría del sello.",
      en: "Third installment of 5 Universos Records' Various Artists compilation on 180g 12\". Solís contributes a track and handles mastering of the full pressing (which extends across the label's whole catalogue, vinyl and digital). Sold out on release, it remains a physical artifact documenting the mid-2020s Chilean minimal network, connecting local producers with European figures via the label's curation.",
    },
  },
  {
    slug: "claudio-solis-pandit",
    title: "Pandit",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2022-11-10",
    year: 2022,
    type: "ep",
    format: "Vinilo · 12\" EP",
    label: "Vyasa Discos",
    cover: "https://es-ew1-prod-assets.s3.eu-west-1.amazonaws.com/releases/0cc15358-cf70-4c51-804d-1d58e811796a/aace2d6ed176ac31f98848eafb8bcb89-og-product-image.png",
    description: {
      es: "EP que se publica en plena ola de la serie Kirtan Club: Pandit —en sánscrito, erudito o sabio— continúa el método de hipnosis lenta sobre bases bhakti, esta vez con un brief más rítmico y menos contemplativo que la serie principal. Vyasa Discos lo edita en 12\" como entrega independiente, no como volumen numerado, manteniendo la distinción entre obra-serie y track-single en el catálogo del sello.",
      en: "EP released in the middle of the Kirtan Club wave: Pandit — Sanskrit for scholar or sage — continues the slow-hypnosis method over bhakti bases, this time with a more rhythmic and less contemplative brief than the main series. Vyasa Discos releases it on 12\" as an independent entry, not a numbered volume, keeping the distinction between series-work and single-track in the label's catalogue.",
    },
    links: [
      { label: "Comprar vinilo", href: "https://elasticstage.com/vyasa-discos/releases/pandit-singleep" },
    ],
  },
  {
    slug: "claudio-solis-jai-jagannath",
    title: "Jai Jagannath",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2022-08-15",
    year: 2022,
    type: "ep",
    format: "Vinilo · 12\" EP",
    label: "Vyasa Discos",
    cover: "https://es-ew1-prod-assets.s3.eu-west-1.amazonaws.com/releases/b4c939f1-c7f8-4d9d-a28f-a53a6405357e/d0a7129f054b19925a120955e99d4287-og-product-image.png",
    description: {
      es: "EP central del ciclo bhakti de Solís en 2022. Jai Jagannath —saludo devocional al señor del universo en la tradición hindú— se vuelve la unidad mínima sobre la que se construyen los loops: una palabra repetida hasta que se transforma en pulso. Solís disuelve la frontera entre canto y secuencia electrónica, tomando el principio del kirtan y trasladándolo al lenguaje de pista. Vyasa Discos lo prensa como pieza de su catálogo principal.",
      en: "Central EP of Solís's 2022 bhakti cycle. Jai Jagannath — devotional greeting to the lord of the universe in Hindu tradition — becomes the minimum unit over which the loops are built: a word repeated until it transforms into pulse. Solís dissolves the boundary between chant and electronic sequence, taking the kirtan principle and transposing it into dancefloor language. Vyasa Discos presses it as a core catalogue piece.",
    },
    links: [
      { label: "Comprar vinilo", href: "https://elasticstage.com/vyasa-discos/releases/jai-jagannath-singleep" },
    ],
  },
  {
    slug: "claudio-solis-5ur-002",
    title: "5UR 002 — Various Artists",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2022-06-20",
    year: 2022,
    type: "compilation",
    format: "Vinilo · 12\" EP",
    label: "5 Universos Records",
    description: {
      es: "Segunda compilación en 12\" de 5 Universos Records, donde Solís contribuye con un track y oficia como mastering engineer del prensaje. Sold out al cierre del año, documenta el primer empuje del sello hacia la circulación internacional —el roster cruza Chile, México y Europa— y consolida el rol de Solís como puente técnico y editorial entre la escena local y los partners externos. Predecesor directo del 5UR 003 (2023).",
      en: "Second 12\" compilation from 5 Universos Records, where Solís contributes a track and serves as mastering engineer for the pressing. Sold out by year's end, it documents the label's first push towards international circulation — the roster spans Chile, Mexico and Europe — and consolidates Solís's role as technical and editorial bridge between the local scene and external partners. Direct predecessor of 5UR 003 (2023).",
    },
  },
  {
    slug: "claudio-solis-fafo-011",
    title: "FAFO 011 — Various Artists",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2022-02-15",
    year: 2022,
    type: "compilation",
    format: "Vinilo · 12\" VA · Comp",
    label: "FAFO Records",
    description: {
      es: "Compilación FAFO 011 del sello chileno FAFO Records, prensada en vinilo 12\" como Various Artists. Solís aporta un track al lineup y queda registrado como uno de los productores chilenos consolidados que el sello convoca para sus ediciones aniversarias. Sold out poco después del lanzamiento; hoy circula casi exclusivamente en mercado de segunda mano, lo que lo vuelve uno de los releases físicos más buscados del catálogo de colaboraciones externas de Solís.",
      en: "FAFO 011 compilation from Chilean label FAFO Records, pressed on 12\" vinyl as Various Artists. Solís contributes a track to the lineup and is recorded as one of the established Chilean producers the label calls in for its anniversary editions. Sold out shortly after release; today it circulates almost exclusively in second-hand markets, which makes it one of the most sought-after physical releases in Solís's external-collaboration catalogue.",
    },
  },
  {
    slug: "claudio-solis-goura-nitai",
    title: "Goura Nitai",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2021-12-10",
    year: 2021,
    type: "ep",
    format: "Vinilo · 12\" EP",
    label: "Vyasa Discos",
    cover: "https://es-ew1-prod-assets.s3.eu-west-1.amazonaws.com/releases/9514dd51-38a7-4542-a3ba-cd27cc59c8ae/a3fc9a16ca28bca98ff9accc3e95f3c8-og-product-image.png",
    description: {
      es: "EP devocional cierra el ciclo bhakti de 2021. Goura Nitai —designación combinada de dos figuras centrales del Gaudiya Vaisnavismo— sirve como punto de llegada del trabajo iniciado en Devotional Service y Kirtan Club I-II del mismo año. Solís depura aún más la fórmula: cuatro tracks construidos sobre repetición y desplazamiento mínimo, sin retórica. Vyasa Discos lo edita como tercera entrega del año en su línea espiritual.",
      en: "Devotional EP closes the 2021 bhakti cycle. Goura Nitai — combined designation of two central figures in Gaudiya Vaisnavism — serves as arrival point for the work begun in Devotional Service and Kirtan Club I-II of the same year. Solís refines the formula further: four tracks built on repetition and minimal displacement, without rhetoric. Vyasa Discos releases it as the third entry of the year in its spiritual line.",
    },
    links: [
      { label: "Comprar vinilo", href: "https://elasticstage.com/vyasa-discos/releases/goura-nitai-singleep" },
    ],
  },
  {
    slug: "claudio-solis-devotional-service",
    title: "Devotional Service",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2021-09-15",
    year: 2021,
    type: "album",
    format: "Vinilo · LP",
    label: "Vyasa Discos",
    cover: "https://es-ew1-prod-assets.s3.eu-west-1.amazonaws.com/releases/f43b1580-b09f-4cbf-814f-15d94668bf85/c29591c93d42b542b6752e3815f3fac3-og-product-image.png",
    description: {
      es: "LP fundacional del ciclo bhakti de Solís. Devotional Service —servicio devocional, traducción directa del término sánscrito seva— funciona como manifiesto compositivo: la pieza minimal entendida como acto de servicio al material, no como vehículo de autor. Diez tracks que despliegan el método antes de fragmentarse en las series Kirtan Club y Goura Nitai. Vyasa Discos lo prensa como el primer gran LP de la línea espiritual del catálogo.",
      en: "Foundational LP of Solís's bhakti cycle. Devotional Service — direct translation of the Sanskrit term seva — functions as compositional manifesto: the minimal piece understood as act of service to the material, not as vehicle for the author. Ten tracks that deploy the method before fragmenting into the Kirtan Club and Goura Nitai series. Vyasa Discos presses it as the first major LP of the catalogue's spiritual line.",
    },
    links: [
      { label: "Comprar vinilo", href: "https://elasticstage.com/vyasa-discos/releases/devotional-service-album" },
    ],
  },
  {
    slug: "claudio-solis-chileans-are-playing",
    title: "Chileans Are Playing — VA",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2021-07-30",
    year: 2021,
    type: "compilation",
    format: "Vinilo · 12\" Comp",
    label: "Agua y Sed",
    description: {
      es: "Compilación 12\" de Agua y Sed (catálogo AYSLTD002) que reúne a productores chilenos bajo la curaduría histórica de Solís. Funciona como tarjeta de presentación internacional del sello: el sticker #ChileansArePlaying viene de aquí. Sold out poco después de su lanzamiento, queda como uno de los pocos vinilos del catálogo Agua y Sed —en su mayoría digital— y como documento de una escena local en plena consolidación post-pandemia.",
      en: "12\" compilation from Agua y Sed (cat AYSLTD002) gathering Chilean producers under Solís's historical curation. Functions as the label's international calling card: the #ChileansArePlaying tag originates here. Sold out shortly after release, it remains one of the few vinyls in the Agua y Sed catalogue — mostly digital — and a document of a local scene in full post-pandemic consolidation.",
    },
  },
  {
    slug: "claudio-solis-12-interplanetary-ursa",
    title: "12 Interplanetary Ursa Escape Rooms",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2021-05-15",
    year: 2021,
    type: "ep",
    format: "Vinilo · 12\" EP Ltd",
    label: "P.U.N.C.H.I.S. Records",
    description: {
      es: "EP en 12\" Limited del sello P.U.N.C.H.I.S. Records, con título conceptual que opera como mapa: doce salas de escape interplanetario, cada track una habitación cifrada con su propia clave rítmica. Es uno de los pocos releases de Solís fuera de su circuito propio (Vyasa, Agua y Sed, Aquarians) y muestra cómo opera bajo curaduría ajena: la materia se mantiene reconocible pero el marco la lleva hacia un experimentalismo más teatral. Sold out al lanzamiento.",
      en: "Limited 12\" EP from P.U.N.C.H.I.S. Records, with a conceptual title operating as map: twelve interplanetary escape rooms, each track an encoded chamber with its own rhythmic key. One of the few Solís releases outside his own circuit (Vyasa, Agua y Sed, Aquarians) and a window onto how he operates under external curation: the material stays recognizable but the frame pulls it toward more theatrical experimentalism. Sold out on release.",
    },
  },
  {
    slug: "claudio-solis-vaisnava",
    title: "Vaisnava",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2020-08-15",
    year: 2020,
    type: "album",
    format: "Vinilo · LP",
    label: "Vyasa Discos",
    cover: "https://es-ew1-prod-assets.s3.eu-west-1.amazonaws.com/releases/35e5f45a-a5ea-4b45-8040-b66276863a8f/9017e7efc6ed71705bf081dc28465bdf-og-product-image.png",
    description: {
      es: "LP que abre formalmente la línea espiritual del catálogo Vyasa Discos. Vaisnava —tradición hindú dedicada a Vishnu— sirve como ámbito conceptual para diez tracks que renuncian a la urgencia rítmica del techno post-2010 y proponen una temporalidad distinta: el groove como meditación más que como propulsión. Es el predecesor directo de toda la serie Kirtan Club y de Devotional Service; sin Vaisnava no existirían las obras siguientes.",
      en: "LP that formally opens the spiritual line of the Vyasa Discos catalogue. Vaisnava — Hindu tradition dedicated to Vishnu — provides the conceptual ground for ten tracks that renounce the post-2010 techno's rhythmic urgency and propose a different temporality: groove as meditation rather than propulsion. Direct predecessor to the entire Kirtan Club series and Devotional Service; without Vaisnava the following works would not exist.",
    },
    links: [
      { label: "Comprar vinilo", href: "https://elasticstage.com/vyasa-discos/releases/vaisnava-album" },
    ],
  },
  {
    slug: "claudio-solis-pelican-piety",
    title: "Pelican Piety",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2020-04-10",
    year: 2020,
    type: "ep",
    format: "Vinilo · 12\" EP",
    label: "Vyasa Discos",
    cover: "https://es-ew1-prod-assets.s3.eu-west-1.amazonaws.com/releases/3f6d0d16-d57a-4745-9fcd-ec8329804fe5/ce0ce4a3179b911050b7aa35f8097720-og-product-image.png",
    description: {
      es: "EP corto publicado en abril 2020, en pleno cierre por pandemia. Pelican Piety —referencia a la iconografía cristiana medieval del pelícano que se hiere para alimentar a sus crías como símbolo del sacrificio— enmarca cuatro tracks que cruzan dark minimal y devoción sin recurrir al lenguaje del kirtan que vendría después. Es un puente: aún no es Vaisnava ni Devotional Service, pero tampoco es el techno funcional anterior.",
      en: "Short EP released April 2020, in the middle of pandemic lockdown. Pelican Piety — reference to medieval Christian iconography of the pelican wounding itself to feed its young as a symbol of sacrifice — frames four tracks crossing dark minimal and devotion without resorting to the kirtan language that would come later. A bridge: not yet Vaisnava or Devotional Service, but no longer the prior functional techno either.",
    },
    links: [
      { label: "Comprar vinilo", href: "https://elasticstage.com/vyasa-discos/releases/pelican-piety-singleep" },
    ],
  },
  {
    slug: "claudio-solis-nibbana-traxx",
    title: "Nibbana Traxx",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2019-08-20",
    year: 2019,
    type: "ep",
    format: "Vinilo · 12\" EP · Ed. 30",
    label: "Gilesku Records",
    description: {
      es: "EP en edición limitada de 30 copias publicado por Gilesku Records, sello francés del circuito minimal underground. Nibbana —forma pali de nirvana— marca el primer trabajo de Solís con un partner europeo prensado físicamente; el tirage corto lo vuelve uno de los discos más escasos del catálogo. Sold out al lanzamiento, hoy circula en colecciones privadas o segunda mano de alta rotación. Es el predecesor estructural de Vaisnava (2020).",
      en: "Limited edition of 30 copies released by Gilesku Records, French label from the underground minimal circuit. Nibbana — Pali form of nirvana — marks Solís's first work with a European partner pressed physically; the short run makes it one of the scarcest records in the catalogue. Sold out on release, today it circulates in private collections or high-turnover second-hand. Structural predecessor to Vaisnava (2020).",
    },
  },
  {
    slug: "claudio-solis-alquimia",
    title: "Alquimia",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2018-11-15",
    year: 2018,
    type: "ep",
    format: "Vinilo · 12\" EP",
    label: "Vyasa Discos",
    cover: "https://es-ew1-prod-assets.s3.eu-west-1.amazonaws.com/releases/0b0a1725-26c6-460e-ba1d-af2581e48887/fd146376f88dea385c81ad4efec0be27-og-product-image.png",
    description: {
      es: "Primer EP en vinilo bajo Vyasa Discos tras Lost Hierophant (2017). Alquimia toma la noción de transmutación —de plomo a oro, de ruido a forma— como núcleo: cuatro tracks que operan como ejercicios alquímicos en miniatura. Es el momento en que Solís empieza a usar Vyasa como vehículo propio para sus prensajes, antes que como label colaborativo. Pequeño en formato, decisivo en el arco del catálogo.",
      en: "First vinyl EP under Vyasa Discos after Lost Hierophant (2017). Alquimia takes the notion of transmutation — lead to gold, noise to form — as its core: four tracks operating as miniature alchemical exercises. The moment Solís starts using Vyasa as his own vehicle for pressings, rather than as a collaborative label. Small in format, decisive in the catalogue's arc.",
    },
    links: [
      { label: "Comprar vinilo", href: "https://elasticstage.com/vyasa-discos/releases/alquimia-singleep" },
    ],
  },
  {
    slug: "claudio-solis-lost-hierophant",
    title: "Lost Hierophant",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2017-06-10",
    year: 2017,
    type: "album",
    format: "Vinilo · LP",
    label: "Vyasa Discos",
    cover: "https://es-ew1-prod-assets.s3.eu-west-1.amazonaws.com/releases/2573eb02-0f79-491c-9c81-9375e82c6ab5/a0b0bc0299b0697871cdd9cddc9c30f2-og-product-image.png",
    description: {
      es: "Primer LP en vinilo bajo Vyasa Discos: punto de partida formal del catálogo físico de Solís en su propio sello. Lost Hierophant —el hierofante perdido, figura mística del Tarot que comunica entre mundos— funciona como manifiesto. Solís se traslada desde la operación pura de Agua y Sed (digital, curatorial) hacia una práctica artística firmada en formato extendido. Todo lo que viene después se construye sobre la decisión tomada aquí.",
      en: "First vinyl LP under Vyasa Discos: formal starting point of Solís's physical catalogue on his own label. Lost Hierophant — the lost hierophant, mystical Tarot figure that mediates between worlds — works as manifesto. Solís moves from the pure operation of Agua y Sed (digital, curatorial) toward an artistic practice signed in extended format. Everything that follows is built on the decision made here.",
    },
    links: [
      { label: "Comprar vinilo", href: "https://elasticstage.com/vyasa-discos/releases/lost-hierophant-album" },
    ],
  },
  {
    slug: "claudio-solis-silent-weapons",
    title: "Silent Weapons for Quiet War",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2000-06-01",
    year: 2000,
    type: "ep",
    format: "Vinilo · 12\" EP",
    label: "Vyasa Discos",
    cover: "https://es-ew1-prod-assets.s3.eu-west-1.amazonaws.com/releases/3dcc4277-2478-4042-99c2-e9fb2b9065f4/9ccf66d7f2b5ee85fde02142d8d55b96-og-product-image.png",
    description: {
      es: "Entry catalogada como 2000 en solisolisolis.cl. El título —referencia al documento conspirativo Silent Weapons for Quiet Wars— enmarca un EP con material ambient/experimental anterior a la línea minimal actual de Solís. Si la fecha es correcta, es el release más temprano del catálogo Vyasa documentado; si es typo de un año posterior, queda como pieza atípica reposicionada. En cualquier caso, opera como excepción dentro del cuerpo de obra reciente.",
      en: "Entry catalogued as 2000 on solisolisolis.cl. The title — reference to the conspiracy document Silent Weapons for Quiet Wars — frames an EP with ambient/experimental material preceding Solís's current minimal line. If the date is correct, it is the earliest release documented in the Vyasa catalogue; if it's a typo for a later year, it remains a repositioned outlier piece. Either way, it operates as an exception within the recent body of work.",
    },
    links: [
      { label: "Comprar vinilo", href: "https://elasticstage.com/vyasa-discos/releases/silent-weapons-for-quiet-war-singleep" },
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
