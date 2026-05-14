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
