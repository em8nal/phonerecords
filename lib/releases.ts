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
    featuredArtistSlugs: ["ecamhi", "klaus-brantmayer", "claudio-solis"],
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
        "EP grabado en Lagos durante el viaje formativo de la banda a Nigeria. Tres tracks que reúnen dos composiciones de Fela Anikulapo Kuti con Seun Kuti, Cheick Tidiane Seck y músicos de Egypt 80 en sesiones directas. No es homenaje desde la distancia: es Newen escribiendo afrobeat junto a quienes lo fundaron, en su lugar de origen. Documento clave del puente que la banda construye entre el afrobeat clásico y la lectura latinoamericana posterior.",
      en:
        "EP recorded in Lagos during the band's formative trip to Nigeria. Three tracks gathering two Fela Anikulapo Kuti compositions with Seun Kuti, Cheick Tidiane Seck and Egypt 80 musicians in direct sessions. Not homage from a distance: it's Newen writing afrobeat alongside those who founded it, in its place of origin. Key document of the bridge the band builds between classic afrobeat and the later Latin American reading.",
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
        "Edición limitada en vinilo 12\" prensada por PHŌNÉ Records en 2023, seis años después del EP digital original. Recupera las composiciones de Fela —Upside Down y Opposite People— en formato físico con dirección de arte revisada para el prensaje. Marca el primer prensaje del sello PHŌNÉ con cat# PHONELTD001 y abre la línea de reediciones físicas del catálogo de Newen Afrobeat. Edición agotada en gran parte tras la gira europea.",
      en:
        "Limited 12\" vinyl edition pressed by PHŌNÉ Records in 2023, six years after the original digital EP. Recovers Fela's compositions — Upside Down and Opposite People — in physical format with revised art direction for the pressing. Marks PHŌNÉ Records' first pressing with cat# PHONELTD001 and opens the line of physical reissues from Newen Afrobeat's catalogue. Largely sold out after the European tour.",
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
        "Mixtape de 15 tracks que funciona como archivo personal: piezas compuestas y grabadas a lo largo de varios años que Klaus reúne en un solo objeto. Cruza nu-jazz, hip-hop jazz, neo-soul instrumental, vocoder y flauta. No es álbum convencional sino documento vivo de una práctica continua, presentado como mixtape porque ese formato permite la heterogeneidad que el LP cerrado no admite. Master de Victor Sáez y Chalo G.",
      en:
        "15-track mixtape that functions as personal archive: pieces composed and recorded over several years that Klaus gathers in a single object. Crosses nu-jazz, hip-hop jazz, instrumental neo-soul, vocoder and flute. Not a conventional album but a living document of continuous practice, presented as mixtape because that format allows the heterogeneity a closed LP doesn't admit. Mastering by Victor Sáez and Chalo G.",
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
    featuredArtistSlugs: ["ecamhi"],
    releaseDate: "2025-11-26",
    year: 2025,
    type: "live",
    format: "EP en vivo · 3 tracks",
    cover: "https://f4.bcbits.com/img/a0583641197_10.jpg",
    description: {
      es:
        "EP en vivo del dúo Gestosimple & Klaus B grabado en Cajón del Maipo, con Enrique Camhi en trompeta como invitado. Tres tracks que cruzan future jazz y hip-hop instrumental en formato sesión cerrada: nada de la artificialidad del estudio, todo el aire del lugar. Es uno de los pocos registros en vivo del catálogo de Klaus y el más reciente puente formal entre su proyecto y el de Ecamhi dentro del ecosistema PHŌNÉ.",
      en:
        "Live EP by the duo Gestosimple & Klaus B recorded in Cajón del Maipo, with Enrique Camhi as guest on trumpet. Three tracks crossing future jazz and instrumental hip-hop in closed-session format: none of the studio's artifice, all the air of the place. One of the few live records in Klaus's catalogue and the most recent formal bridge between his project and Ecamhi's within the PHŌNÉ ecosystem.",
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
        "Primer LP largo del dúo Gestosimple & Klaus B. Doce tracks con featurings de Fran Ri, DJ Dacel, Valentina Marinkovic, Cidtronyck, Celeste Shaw, Wagabond, Senciyo Samuel HuiZa y 22Ruzz. Articula la red de productores que comparten el lenguaje rap-jazz / future funk en Santiago de Chile, con Klaus como punto de convergencia técnica. Es el disco más extendido del catálogo Klaus y el manifiesto colectivo del proyecto Gestosimple.",
      en:
        "First long LP from the duo Gestosimple & Klaus B. Twelve tracks featuring Fran Ri, DJ Dacel, Valentina Marinkovic, Cidtronyck, Celeste Shaw, Wagabond, Senciyo Samuel HuiZa and 22Ruzz. Articulates the network of producers sharing the rap-jazz / future funk language in Santiago de Chile, with Klaus as technical convergence point. Klaus's most extended record and the collective manifesto of the Gestosimple project.",
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
        "Single producido entre 2022 y 2023, después de los viajes en gira de Newen Afrobeat a Lagos. Reúne la sección de bronces completa de Newen —incluido Ecamhi en trompeta— sobre una base hip-hop jazz que Klaus construye desde el vocoder y la flauta. Es el cruce más explícito entre el universo afrobeat de Newen y el lenguaje neo-soul instrumental de Klaus, y uno de los primeros singles que tematiza la conexión entre ambos proyectos.",
      en:
        "Single produced between 2022 and 2023, after Newen Afrobeat's touring trips to Lagos. Gathers Newen's full brass section — including Ecamhi on trumpet — over a hip-hop jazz base Klaus builds from vocoder and flute. The most explicit crossing between Newen's afrobeat universe and Klaus's instrumental neo-soul language, and one of the first singles to thematize the connection between both projects.",
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
        "Single co-producido con Lister Rossel (Mr.Li, Londres), con MC Seven Star (Orlando) y MC Racecar (París) como voces invitadas. Mueve el catálogo de Klaus hacia el formato hip-hop colaborativo trans-continental: tres ciudades, tres voces, una base hecha en Santiago. Master de Sebastián Pangal y Klaus B. Anuncia la dirección del proyecto post-mixtape Memorias y consolida la red internacional alrededor del sonido neo-soul jazz de Klaus.",
      en:
        "Single co-produced with Lister Rossel (Mr.Li, London), with MC Seven Star (Orlando) and MC Racecar (Paris) as guest vocalists. Moves Klaus's catalogue toward trans-continental collaborative hip-hop: three cities, three voices, one base made in Santiago. Mastering by Sebastián Pangal and Klaus B. Announces the project's direction post-Memorias mixtape and consolidates the international network around Klaus's neo-soul jazz sound.",
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
      es: "Single instrumental publicado a fines de 2025, semanas antes de la mixtape Memorias. Funciona como antesala: Klaus condensa en un solo track el método que la mixtape desplegará en quince —flauta funk, vocoder, beat orgánico, presencia rítmica antes que melódica. Es la entrada más sintética al lenguaje instrumental del proyecto en su versión 2025, y queda como referencia pedagógica para entender el resto del catálogo.",
      en: "Instrumental single released in late 2025, weeks before the Memorias mixtape. Works as antechamber: Klaus condenses into one track the method the mixtape will unfold across fifteen — funk flute, vocoder, organic beat, rhythmic presence before melodic. The most synthetic entry into the project's instrumental language in its 2025 version, and stays as pedagogical reference for understanding the rest of the catalogue.",
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
        "Primer single solista del proyecto Klaus B, publicado en mediados de 2021. Construido con Diego Alarcón en teclados, Iván Araya en bajo y Tito Gevert en batería, define la fórmula inicial del catálogo: flauta funk sobre base orgánica, con vocoder mínimo. Es el punto de partida que las series posteriores expanden o contraen, y queda como referencia formal del sonido fundacional del proyecto en su versión 2021.",
      en:
        "First solo single of the Klaus B project, released mid-2021. Built with Diego Alarcón on keys, Iván Araya on bass and Tito Gevert on drums, it defines the catalogue's initial formula: funk flute over organic base, with minimal vocoder. The starting point that later series expand or contract, and stays as formal reference of the project's foundational sound in its 2021 version.",
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
        "Single instrumental publicado a fines de 2021 entre Viento Radiante y De Noche. Extiende el lenguaje funk-jazz iniciado meses antes hacia un terreno más atmosférico: la flauta de Klaus opera como hilo lento sobre una base sustraída, con presencia de vocoder como contrapunto. Aparece después en la mixtape Memorias (2025) como track #10, lo que lo vuelve referencia interna recurrente del propio catálogo del proyecto.",
      en:
        "Instrumental single released late 2021 between Viento Radiante and De Noche. Extends the funk-jazz language opened months earlier toward more atmospheric territory: Klaus's flute operates as slow thread over a subtracted base, with vocoder presence as counterpoint. Appears later in the Memorias mixtape (2025) as track #10, making it a recurring internal reference in the project's own catalogue.",
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
      es: "Segundo single del proyecto Klaus B, publicado en agosto 2021. Es la entrega más temprana del lenguaje nocturno que el catálogo va a explorar durante los siguientes años: groove pausado, atmósfera densa, flauta como voz principal sin recurrir a vocalistas humanos. Junto a Viento Radiante define el método dual del proyecto —diurno/nocturno, claro/oscuro— que se sostiene como eje hasta la mixtape Memorias.",
      en: "Second single of the Klaus B project, released August 2021. The earliest delivery of the nocturnal language the catalogue will explore over the following years: paused groove, dense atmosphere, flute as main voice without resorting to human vocalists. Together with Viento Radiante it defines the project's dual method — diurnal/nocturnal, light/dark — that holds as axis through the Memorias mixtape.",
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
    // EP en producción — fecha estimada por anunciar.
    releaseDate: "2026-12-31",
    year: 2026,
    type: "ep",
    format: "EP · 4 tracks · en producción",
    label: "PHŌNÉ Records",
    description: {
      es:
        "Próximo EP de Ecamhi y release inaugural del sello PHŌNÉ Records, actualmente en producción. El proyecto está concebido como obra interdisciplinaria: cuatro fotografías capturadas en giras internacionales inspirando cuatro composiciones, presentadas en simultáneo como exhibición fotográfica donde cada imagen va acompañada de audífonos con la pieza correspondiente. Imagen y sonido nacen del mismo proceso creativo. Voz invitada de Catalina Aguilera (Con.fusión), composición y sax de Vicente Aravena, producción y mezcla de Enrique Camhi, master de Daniel Pérez.",
      en:
        "Forthcoming EP from Ecamhi and the inaugural release of PHŌNÉ Records, currently in production. The project is conceived as an interdisciplinary work: four photographs captured on international tours inspiring four compositions, presented simultaneously as a photo exhibition where each image is accompanied by headphones with the corresponding piece. Image and sound born from the same creative process. Guest vocals by Catalina Aguilera (Con.fusión), composition and sax by Vicente Aravena, production and mixing by Enrique Camhi, mastering by Daniel Pérez.",
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
        "Aparición de Enrique Camhi (Ecamhi) como trompetista invitado en Gaviotas, single de Diego de la Noche con Felipe Montero. La trompeta de Camhi opera sobre una base de pop electrónico de cámara, demostrando la versatilidad del instrumento fuera del marco jazz/afrobeat habitual. Publicado en simultáneo con Laruz como parte de una entrega doble. Es una de las primeras apariciones documentadas de Camhi como sesionista fuera del ecosistema PHŌNÉ.",
      en:
        "Appearance of Enrique Camhi (Ecamhi) as guest trumpeter on Gaviotas, a Diego de la Noche single with Felipe Montero. Camhi's trumpet operates over a chamber electronic-pop base, demonstrating the instrument's versatility outside the usual jazz/afrobeat frame. Released alongside Laruz as part of a double drop. One of the first documented appearances of Camhi as session player outside the PHŌNÉ ecosystem.",
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
        "Segunda aparición de Ecamhi como invitado en singles de Diego de la Noche, publicado el mismo día que Gaviotas (noviembre 2022). Camhi sostiene la trompeta como hilo melódico principal del track, lo que lo distingue del rol de adorno tímbrico habitual del instrumento en producciones similares. Cierra una entrega doble que documenta la red colaborativa de Camhi en el circuito chileno de electrónica de cámara y pop experimental.",
      en:
        "Second appearance of Ecamhi as guest on Diego de la Noche singles, released the same day as Gaviotas (November 2022). Camhi sustains the trumpet as the track's main melodic thread, distinguishing him from the usual role of timbral ornament for the instrument in similar productions. Closes a double drop documenting Camhi's collaborative network in the Chilean chamber-electronics and experimental-pop circuit.",
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
        "Single co-firmado por Ugnė Danielė (Lituania), Enrique Camhi y Adydo, publicado en agosto 2024. Cruza chamber-jazz con voces e improvisación en una colaboración transcontinental que extiende la red internacional de Camhi más allá del circuito chileno-europeo. La trompeta de Camhi opera en diálogo abierto con la voz de Danielė, sin definir jerarquía instrumental. Es uno de los pocos releases del catálogo que articula tres autores en igualdad.",
      en:
        "Single co-signed by Ugnė Danielė (Lithuania), Enrique Camhi and Adydo, released August 2024. Crosses chamber-jazz with vocals and improvisation in a transcontinental collaboration extending Camhi's international network beyond the Chilean-European circuit. Camhi's trumpet operates in open dialogue with Danielė's voice, without defined instrumental hierarchy. One of the few catalogue releases articulating three authors as equals.",
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
        "Single firmado por Alejandro Camhi y Enrique Camhi —dúo familiar— publicado en julio 2024. Es la única colaboración documentada entre ambos hermanos: electrónica estival con trompeta encima, pieza corta y sin gancho convencional, hecha para escucha de estación más que para playlist. Funciona como entrada secundaria al catálogo de Ecamhi y como documento personal del eje familiar dentro de su práctica musical.",
      en:
        "Single signed by Alejandro Camhi and Enrique Camhi —familial duo— released July 2024. The only documented collaboration between the brothers: summery electronics with trumpet on top, a short piece without conventional hook, made for seasonal listening rather than for playlist. Functions as secondary entry into the Ecamhi catalogue and as personal document of the familial axis within his musical practice.",
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
        "Single firmado por 4Yo4U y Enrique Camhi, publicado en agosto 2025. La trompeta de Camhi se inserta sobre una base de electrónica contemporánea con eco directo al lenguaje del EP en viaje (2024, PHŌNÉ): trompeta filtrada, sintetizadores densos, ausencia de gancho pop. Documenta el desplazamiento de Camhi hacia colaboraciones con productores más jóvenes y la expansión de su trompeta a circuitos electrónicos no jazz.",
      en:
        "Single signed by 4Yo4U and Enrique Camhi, released August 2025. Camhi's trumpet inserts itself over a contemporary electronic base with direct echo to the language of the en viaje EP (2024, PHŌNÉ): filtered trumpet, dense synths, absence of pop hook. Documents Camhi's drift toward collaborations with younger producers and the expansion of his trumpet into non-jazz electronic circuits.",
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
        "Single co-firmado por Enrique Camhi y Felipe Cortes, publicado en abril 2021. Es el primer registro oficial bajo el nombre Enrique Camhi, anterior al EP en viaje (2024) y a Move To (2022). Pone en marcha la línea solista del proyecto antes de que tome forma como cuerpo de obra coherente: la trompeta opera sobre una base de electrónica de cámara con Cortes como co-productor. Documento de origen del Camhi solista.",
      en:
        "Single co-signed by Enrique Camhi and Felipe Cortes, released April 2021. The first official record under the Enrique Camhi name, prior to the en viaje EP (2024) and Move To (2022). Launches the project's solo line before it takes shape as coherent body of work: trumpet operates over a chamber electronics base with Cortes as co-producer. Origin document of the solo Camhi.",
    },
    links: [
      { label: "Apple Music", href: "https://music.apple.com/us/album/fake-love-single/1558646526" },
      { label: "Beatport", href: "https://www.beatport.com/track/fake-love/15063234" },
      { label: "Tidal", href: "https://listen.tidal.com/album/177394194" },
    ],
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
        "Single solista publicado en mayo 2022, dos años antes del EP inaugural en viaje. Es el primer trabajo firmado únicamente por Enrique Camhi sin co-autores: trompeta y producción propia en una pieza corta que ya anuncia la lógica interdisciplinar del proyecto. La estructura del track —menos canción, más cuadro sonoro— sirve como antecedente directo de en viaje, donde cuatro imágenes inspirarían cuatro piezas. Marca la consolidación de su voz solista.",
      en:
        "Solo single released May 2022, two years before the inaugural en viaje EP. The first work signed solely by Enrique Camhi without co-authors: trumpet and self-produced in a short piece already announcing the project's interdisciplinary logic. The track's structure —less song, more sonic painting— serves as direct precursor to en viaje, where four images would inspire four pieces. Marks the consolidation of his solo voice.",
    },
    links: [
      { label: "Apple Music", href: "https://music.apple.com/us/album/move-to/1618064796" },
          { label: "Spotify", href: "https://open.spotify.com/album/79OqBRxmaAO9kKVmfQf5BV" },
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
        "Single de Con.fusión en colaboración con Fat Jota, publicado en febrero 2021. La voz de Catalina Aguilera opera como instrumento sobre beats orgánicos en una pieza corta que ya muestra el método del proyecto: hip hop, jazz y neo soul cruzados sin obediencia a ninguno. Aüa es uno de los primeros singles donde se articula formalmente el lenguaje del proyecto, anterior a la entrada en producción del LP Tulpa. Marca el inicio público del catálogo.",
      en:
        "Con.fusión single in collaboration with Fat Jota, released February 2021. Catalina Aguilera's voice operates as instrument over organic beats in a short piece that already shows the project's method: hip hop, jazz and neo soul crossed without obedience to any. Aüa is one of the first singles where the project's language is formally articulated, prior to the Tulpa LP entering production. Marks the public start of the catalogue.",
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
        "Single con Fat Jota publicado en julio 2020, primera entrega de la colaboración entre ambos. Beat hip hop con flow vocal de Aguilera que cruza rap, scat y melodía sin pausa entre técnicas: la voz funciona como ejercicio simultáneo de tradiciones distintas. Es la entrega más temprana del catálogo público de Con.fusión y queda como referencia formal del método que se va a desarrollar en los singles siguientes y en el LP Tulpa.",
      en:
        "Single with Fat Jota released July 2020, first delivery of the collaboration between both. Hip hop beat with Aguilera's vocal flow crossing rap, scat and melody without pause between techniques: voice functioning as simultaneous exercise of distinct traditions. The earliest delivery in Con.fusión's public catalogue and remains formal reference of the method to be developed in the following singles and in the Tulpa LP.",
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
        "Single en portugués con Ziervo, publicado en octubre 2020. Cruza neo soul, jazz y guiños a la MPB en una pieza cinematográfica que se distingue del resto del catálogo por su lengua y por su tempo más pausado. La voz de Catalina Aguilera trabaja menos como instrumento y más como narradora: hay una historia detrás del beat. Es uno de los pocos releases bilingües del proyecto y queda como puerta hacia influencias brasileñas en el repertorio.",
      en:
        "Portuguese-language single with Ziervo, released October 2020. Crosses neo soul, jazz and MPB hints in a cinematic piece distinguishing itself from the rest of the catalogue by its language and slower tempo. Catalina Aguilera's voice works less as instrument and more as narrator: there's a story behind the beat. One of the few bilingual releases of the project and a doorway to Brazilian influences in the repertoire.",
    },
    links: [
      { label: "Apple Music", href: "https://music.apple.com/us/album/borboleta-feat-ziervo/1531907261" },
          { label: "Spotify", href: "https://open.spotify.com/album/54odnPn2yW5ynEhjsgZ5mk" },
],
  },
  {
    slug: "con-fusion-verdad",
    title: "Verdad",
    artistSlug: "con-fusion",
    artistName: "Con.fusión",
    releaseDate: "2018-08-23",
    year: 2018,
    type: "ep",
    format: "EP · digital · 4 tracks",
    cover: "https://i.scdn.co/image/ab67616d00001e02992166091b82012adf8aec5b",
    description: {
      es:
        "Primer EP de Con.fusión en colaboración con el productor Fat Jota, publicado en agosto de 2018. Cuatro piezas que documentan el sonido inicial del proyecto: lo-fi hip hop con voz como instrumento, beats orgánicos y armonías heredadas del jazz. Incluye los singles Lento y Vuelo junto a sus versiones instrumentales. Es el punto de partida formal del catálogo público de Catalina Aguilera y marca el método que se expande en singles posteriores.",
      en:
        "First Con.fusión EP in collaboration with producer Fat Jota, released August 2018. Four pieces documenting the early sound of the project: lo-fi hip hop with voice as instrument, organic beats and harmonies inherited from jazz. Includes the singles Lento and Vuelo alongside their instrumental versions. Formal starting point of Catalina Aguilera's public catalogue and the method expanded in later singles.",
    },
    links: [
      { label: "Apple Music", href: "https://music.apple.com/us/album/verdad-ep/1529684760" },
      { label: "Spotify", href: "https://open.spotify.com/album/2NCFiQFHd6LoVwwtGjiEhk" },
    ],
  },
  {
    slug: "con-fusion-unos-besos",
    title: "Unos Besos",
    artistSlug: "con-fusion",
    artistName: "Con.fusión",
    releaseDate: "2019-06-16",
    year: 2019,
    type: "single",
    format: "Single · digital",
    cover: "https://i.scdn.co/image/ab67616d00001e02851776cb2ee384bc2c7e591a",
    description: {
      es:
        "Single de Con.fusión y Fat Jota publicado en junio de 2019, entre el EP Verdad y los singles de 2020. Sigue la línea lo-fi hip hop del trabajo en conjunto: beats íntimos, voz al frente, arreglos breves. Es uno de los puentes cronológicos del catálogo: extiende la fórmula inicial antes del giro hacia Borboleta (Ziervo) y Aüa, donde el proyecto se abre a colaboradores externos.",
      en:
        "Con.fusión and Fat Jota single released June 2019, between the Verdad EP and the 2020 singles. Follows the lo-fi hip hop line of their joint work: intimate beats, voice up front, short arrangements. One of the chronological bridges in the catalogue: extends the initial formula before the turn towards Borboleta (Ziervo) and Aüa, where the project opens to external collaborators.",
    },
    links: [
      { label: "Apple Music", href: "https://music.apple.com/us/album/unos-besos-single/1531906912" },
      { label: "Spotify", href: "https://open.spotify.com/album/5HBrsQmZ1fpdQS6HaBfNF2" },
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
