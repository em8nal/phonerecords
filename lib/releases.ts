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
          { label: "Spotify", href: "https://open.spotify.com/album/2xIKlMY8lbP2Z2bmQDZtG8" },
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
          { label: "Spotify", href: "https://open.spotify.com/album/1syBPAPfXgRr6S0OjjC96b" },
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
          { label: "Spotify", href: "https://open.spotify.com/album/0T49xqjq4N3ChTLgQN7tPT" },
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
          { label: "Spotify", href: "https://open.spotify.com/album/2WUvTJCjNXcDEnlgQkc1ET" },
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
          { label: "Spotify", href: "https://open.spotify.com/album/74cMKaeAcZQzGLRIo1STGR" },
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
          { label: "Spotify", href: "https://open.spotify.com/album/3qxD2OgTlAlkDsrPfraYRN" },
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
          { label: "Spotify", href: "https://open.spotify.com/album/2PUTr99vvGnZ4OAws39VIl" },
],
  },

  {
    slug: "claudio-solis-hapax",
    title: "Hapax",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2026-01-09",
    year: 2026,
    type: "ep",
    format: "EP · 4 tracks · digital",
    label: "Advisual Records",
    cover: "https://i.scdn.co/image/ab67616d00001e02b0d76bbad1a53385f0e3c5aa",
    description: {
      es:
        "EP de 2026 publicado en Advisual Records. Cuatro tracks —Nigredo, Estupa, Numquam Suade Mihi Vana y un remix de Nigredo por Quantifiq— que extienden el lenguaje minimal techno de Solís hacia un terreno más colaborativo. Hapax, en filología, designa una palabra que aparece una sola vez en un corpus: aquí funciona como marco para piezas pensadas como apariciones únicas. Primer release del año en un sello partner europeo, anterior a los siguientes volúmenes de Sons of Medusa.",
      en:
        "2026 EP released on Advisual Records. Four tracks —Nigredo, Estupa, Numquam Suade Mihi Vana and a Nigredo remix by Quantifiq— that extend Solís's minimal techno language toward more collaborative territory. Hapax, in philology, refers to a word appearing only once in a corpus: here it frames pieces conceived as singular apparitions. First release of the year on a European partner label, ahead of the next Sons of Medusa volumes.",
    },
    tracklist: [
      { n: 1, title: "Nigredo", duration: "7:10" },
      { n: 2, title: "Estupa", duration: "7:21" },
      { n: 3, title: "Numquam Suade Mihi Vana", duration: "6:02" },
      { n: 4, title: "Nigredo - Quantifiq Remix", duration: "7:17" },
    ],
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/4LFhsU9nCExrEyBejKdpkI" },
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
          { label: "Spotify", href: "https://open.spotify.com/album/3JluHDIFkWMYsLggweVhKP" },
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
          { label: "Spotify", href: "https://open.spotify.com/album/4pbguypz7RgXeR4fenvKuK" },
],
  },
  {
    slug: "claudio-solis-kototama-vinyl",
    title: "Kototama (12\" vinyl)",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    featuredArtistSlugs: ["ecamhi"],
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
          { label: "Spotify", href: "https://open.spotify.com/album/3xiMEtzaeGB1ZQnVdOWnsj" },
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
          { label: "Spotify", href: "https://open.spotify.com/album/6OaqKILswUWNAkihelQfhd" },
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
    cover: "https://i.scdn.co/image/ab67616d00001e02570ebe902ff51e8b80f6820f",
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
          { label: "Spotify", href: "https://open.spotify.com/album/37CelF08y1ZYSEujuMuSiw" },
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
          { label: "Spotify", href: "https://open.spotify.com/album/6QJTbdjPdR70o0JuT7sCZW" },
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
    cover: "https://i.scdn.co/image/ab67616d00001e026c1714c5517a7a1a187e67a5",
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
    cover: "https://i.scdn.co/image/ab67616d00001e026c1714c5517a7a1a187e67a5",
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
          { label: "Spotify", href: "https://open.spotify.com/album/5XRCGnDmQVnsTvqqnW94VP" },
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
          { label: "Spotify", href: "https://open.spotify.com/album/0flm7iGpiK9ueZmJk7Cb3v" },
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
    cover: "https://i.scdn.co/image/ab67616d00001e02833a7a834253df2000c28ac8",
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
    cover: "https://i.scdn.co/image/ab67616d00001e02833a7a834253df2000c28ac8",
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
          { label: "Spotify", href: "https://open.spotify.com/album/2rCZaA2BtY4w9wew7ufAf8" },
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
          { label: "Spotify", href: "https://open.spotify.com/album/7IVanKjFicGuxA1kiT55Lk" },
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
    cover: "https://i.discogs.com/SqwgmWAU3ZoBtv1gRe8HC0noHDGAkOKn0ztPDD64waw/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE0MTA1/NzIzLTE1NjkwOTY2/NjMtNzA5MC5qcGVn.jpeg",
    description: {
      es: "EP en edición limitada de 30 copias publicado por Gilesku Records, sello francés del circuito minimal underground. Nibbana —forma pali de nirvana— marca el primer trabajo de Solís con un partner europeo prensado físicamente; el tirage corto lo vuelve uno de los discos más escasos del catálogo. Sold out al lanzamiento, hoy circula en colecciones privadas o segunda mano de alta rotación. Es el predecesor estructural de Vaisnava (2020).",
      en: "Limited edition of 30 copies released by Gilesku Records, French label from the underground minimal circuit. Nibbana — Pali form of nirvana — marks Solís's first work with a European partner pressed physically; the short run makes it one of the scarcest records in the catalogue. Sold out on release, today it circulates in private collections or high-turnover second-hand. Structural predecessor to Vaisnava (2020).",
    },
    links: [
      { label: "Discogs", href: "https://www.discogs.com/release/14105723-Claudio-Solis-Nibbana-Traxx" },
    ],
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
          { label: "Spotify", href: "https://open.spotify.com/album/2xDe7j9WNLFM0UIGiqYzE3" },
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

  // ─────────── Claudio Solís — digitales extendidos ───────────
  {
    slug: "claudio-solis-isopanisad",
    title: "Isopanisad",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2019-01-21",
    year: 2019,
    type: "ep",
    format: "EP · digital · 3 tracks",
    label: "Tip Tap Records",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/d1/31/20/d131209a-84a3-dbeb-a3a0-d879b8888f47/193872003344_cover.jpg/1000x1000bb.jpg",
    description: {
      es: "Pieza del ciclo bhakti del catálogo Solis, publicada en 2019 en Tip Tap Records. 3 tracks. Continúa la operación de tomar términos sánscritos del Vaisnavismo como marco compositivo para minimal techno extendido.",
      en: "Piece from the bhakti cycle of the Solis catalogue, released in 2019 on Tip Tap Records. 3 tracks. Continues the operation of taking Sanskrit terms from Vaisnavism as compositional frame for extended minimal techno.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/04BPL0PSQ8tKVcfGIajJJ2" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1445595425" },
    ],
  },
  {
    slug: "claudio-solis-terrace",
    title: "Terrace",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2021-04-02",
    year: 2021,
    type: "ep",
    format: "EP · digital · 4 tracks",
    label: "Agua y Sed",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/cd/e5/ab/cde5ab29-6477-8f19-5538-986d46a66518/00_Cover_Art.jpg/1000x1000bb.jpg",
    description: {
      es: "EP de 2021 en Agua y Sed (AYS130), firmado por Solis y 5UNIVERSOS. Cuatro tracks de colaboración entre el founder del sello y el proyecto que mastearía todo el catálogo de 5 Universos Records desde 2022 en adelante.",
      en: "2021 EP on Agua y Sed (AYS130), signed by Solis and 5UNIVERSOS. Four collaboration tracks between the label founder and the project that would master the entire 5 Universos Records catalogue from 2022 onwards.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/0AaW6YL1woLV2z2TDbDW5O" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1549605408" },
    ],
  },
  {
    slug: "claudio-solis-wednesday-fair",
    title: "Wednesday Fair",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2011-05-11",
    year: 2011,
    type: "ep",
    format: "EP · digital · 5 tracks",
    label: "Agua y Sed",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music1/v4/10/b8/88/10b8880e-4a08-e036-0b01-6ddca7ab4850/00_Cover_Art.jpg/1000x1000bb.jpg",
    description: {
      es: "Release de 2011 en Agua y Sed (AYS029). Cinco tracks que marcan el reencuentro de Solis con la producción propia tras dos años dedicado mayormente a la curaduría del sello. Material funcional con guiño deep house, anterior al giro dark minimal del catálogo posterior a 2017.",
      en: "2011 release on Agua y Sed (AYS029). Five tracks marking Solis's return to his own production after two years devoted mostly to label curation. Functional material with deep house leanings, prior to the dark minimal turn of the post-2017 catalogue.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/0H2MPs03iu8A7yQRHf8oHJ" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1003545976" },
    ],
  },
  {
    slug: "claudio-solis-dulenega",
    title: "Dulenega",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2020-03-16",
    year: 2020,
    type: "ep",
    format: "EP · digital · 5 tracks",
    label: "Basement Dub",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/0a/c8/fd/0ac8fd86-2891-a473-b076-7db9a31a233c/195039194926_cover.jpg/1000x1000bb.jpg",
    description: {
      es: "Single/EP digital de Solís publicado en 2020 en Basement Dub. 5 tracks. Material dentro de la línea minimal techno / dark minimal del catálogo, distribuido fuera de sus sellos propios.",
      en: "Digital single/EP by Solís released in 2020 on Basement Dub. 5 tracks. Material within the catalogue's minimal techno / dark minimal line, distributed outside his own labels.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/0Ps4t1eflOAV8q3gVAcz02" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1499147772" },
    ],
  },
  {
    slug: "claudio-solis-ki-mura",
    title: "Ki Mura",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2022-10-13",
    year: 2022,
    type: "ep",
    format: "EP · digital · 3 tracks",
    label: "Agua y Sed",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/b1/17/3e/b1173ea0-2a73-7559-7ea8-d3e745147eff/00_Cover_Art.jpg/1000x1000bb.jpg",
    description: {
      es: "Single de 2022 en Agua y Sed (AYS169), firmado por Ale Valenzuela y Claudio Solis. Tres tracks. Continúa el dúo iniciado en Viaje en El Tiempo del mismo año; los dos colaboran como una de las parejas productivas más estables del catálogo.",
      en: "2022 single on Agua y Sed (AYS169), signed by Ale Valenzuela and Claudio Solis. Three tracks. Continues the duo opened in Viaje en El Tiempo the same year; the two collaborate as one of the catalogue's most stable productive pairs.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/0SAN3XCHTqRoAdyLv6hcfP" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1639624455" },
    ],
  },
  {
    slug: "claudio-solis-hari-bol",
    title: "Hari Bol",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2022-12-29",
    year: 2022,
    type: "ep",
    format: "EP · digital · 3 tracks",
    label: "Agua y Sed",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/ed/b1/2e/edb12e34-0ee4-5ee6-1eb7-9fd9f2fecf2c/00_Cover_Art.jpg/1000x1000bb.jpg",
    description: {
      es: "Single de 2022 en Agua y Sed (AYS177), firmado por Claudio Solis y Nikolas Hari. Tres tracks. Cierra el catálogo Agua y Sed del año con una colaboración entre Solis y otro de los DJs habituales del podcast del sello.",
      en: "2022 single on Agua y Sed (AYS177), signed by Claudio Solis and Nikolas Hari. Three tracks. Closes the year's Agua y Sed catalogue with a collaboration between Solis and another of the regular DJs from the label's podcast.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/0ScdPGruCVpnPP8q7UlYCf" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1649984824" },
    ],
  },
  {
    slug: "claudio-solis-stoa",
    title: "Stoa",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2021-03-12",
    year: 2021,
    type: "ep",
    format: "EP · digital · 3 tracks",
    label: "Agua y Sed",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/d8/15/21/d8152113-8a60-6878-2de5-eda44e223c63/00_Cover_Art.jpg/1000x1000bb.jpg",
    description: {
      es: "Single de 2021 en Agua y Sed (AYS129). Tres tracks. Stoa —pórtico estoico de la filosofía griega— funciona aquí como marco para piezas más austeras que el promedio del catálogo. Ejercicio de contención compositiva.",
      en: "2021 single on Agua y Sed (AYS129). Three tracks. Stoa — Stoic portico of Greek philosophy — frames pieces more austere than the catalogue's average. Exercise in compositional restraint.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/0YM2WCXocN3J1p89tc7Qt4" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1547471597" },
    ],
  },
  {
    slug: "claudio-solis-m-m",
    title: "M M",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2020-12-04",
    year: 2020,
    type: "single",
    format: "Single · digital · 2 tracks",
    label: "Agua y Sed",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/24/44/ac/2444acc5-4c5c-d3a2-d3ab-d8acb3766393/00_Cover_Art.jpg/1000x1000bb.jpg",
    description: {
      es: "Single de 2020 en Agua y Sed (AYS125), firmado por Alejandro Cuestas y Claudio Solis. Dos tracks. Material funcional, antes del giro definitivo al material bhakti del año siguiente.",
      en: "2020 single on Agua y Sed (AYS125), signed by Alejandro Cuestas and Claudio Solis. Two tracks. Functional material, before the definitive turn to bhakti material the following year.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/0ZUbMpyynks9XfQGDcvKQe" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1526143523" },
    ],
  },
  {
    slug: "claudio-solis-dubs-of-change-01",
    title: "Dubs of Change 01",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2019-12-27",
    year: 2019,
    type: "single",
    format: "Single · digital · 2 tracks",
    label: "Agua y Sed",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/ea/19/18/ea1918ae-79f7-65e3-e112-cf0fcf43ed22/00_Cover_Art.jpg/1000x1000bb.jpg",
    description: {
      es: "Volumen 01 de Dubs of Change, dúo Claudio Solis × Javier Labarca publicado en Agua y Sed (AYSX001/002, 2019). Dos tracks por entrega, formato cápsula. Solis y Labarca son los dos pilares productivos del catálogo Agua y Sed; esta serie documenta su trabajo a cuatro manos.",
      en: "Volume 01 of Dubs of Change, the Claudio Solis × Javier Labarca duo released on Agua y Sed (AYSX001/002, 2019). Two tracks per delivery, capsule format. Solis and Labarca are the two productive pillars of the Agua y Sed catalogue; this series documents their four-hand work.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/1GLPJPmISbzT69Cc3hoOWy" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1486390777" },
    ],
  },
  {
    slug: "claudio-solis-resonance-twenty-nine",
    title: "Resonance Twenty-Nine",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2021-11-05",
    year: 2021,
    type: "ep",
    format: "EP · digital · 3 tracks",
    label: "Resonance",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/c8/16/51/c81651e4-abf3-cfec-e772-dd1494f24a60/cover.jpg/1000x1000bb.jpg",
    description: {
      es: "Single/EP digital de Solís publicado en 2021 en Resonance. 3 tracks. Material dentro de la línea minimal techno / dark minimal del catálogo, distribuido fuera de sus sellos propios.",
      en: "Digital single/EP by Solís released in 2021 on Resonance. 3 tracks. Material within the catalogue's minimal techno / dark minimal line, distributed outside his own labels.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/1ciqPGVHkDA764CavCUFhT" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1593866873" },
    ],
  },
  {
    slug: "claudio-solis-instrumentos-mentales",
    title: "Instrumentos Mentales",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2023-03-30",
    year: 2023,
    type: "single",
    format: "Single · digital · 2 tracks",
    label: "brosh",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/57/24/a3/5724a388-5f57-ca0e-2597-e6b7e5ed02cd/4251164861327.jpg/1000x1000bb.jpg",
    description: {
      es: "Single de 2023 en Brosh Records. Dos tracks. El título —instrumentos mentales— enmarca la práctica como herramienta cognitiva más que como contenido musical aislado.",
      en: "2023 single on Brosh Records. Two tracks. The title — mental instruments — frames the practice as cognitive tool rather than isolated musical content.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/1oRW82An0jd2kz6KpS1PBq" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1875244106" },
    ],
  },
  {
    slug: "claudio-solis-sravanam-tools",
    title: "Sravanam Tools",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2022-09-15",
    year: 2022,
    type: "ep",
    format: "EP · digital · 4 tracks",
    label: "Claudio Solis",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/5d/c9/4b/5dc94b51-f558-1928-c71f-f3852a0bfbc7/5063072448779_cover.jpg/1000x1000bb.jpg",
    description: {
      es: "Pieza del ciclo bhakti del catálogo Solis, publicada en 2022 en Claudio Solis. 4 tracks. Continúa la operación de tomar términos sánscritos del Vaisnavismo como marco compositivo para minimal techno extendido.",
      en: "Piece from the bhakti cycle of the Solis catalogue, released in 2022 on Claudio Solis. 4 tracks. Continues the operation of taking Sanskrit terms from Vaisnavism as compositional frame for extended minimal techno.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/20zuq0Ih6Fq7h4dgwzyHcg" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1644201281" },
    ],
  },
  {
    slug: "claudio-solis-fiat-lux",
    title: "Fiat Lux",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2021-05-14",
    year: 2021,
    type: "ep",
    format: "EP · digital · 3 tracks",
    label: "Agua y Sed",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/a6/32/6a/a6326ac6-ab2a-7a21-a4f8-8945cde39f4f/00_Cover_Art.jpg/1000x1000bb.jpg",
    description: {
      es: "Single de 2021 en Agua y Sed (AYS133). Tres tracks. Fiat lux —hágase la luz— marca un momento concreto del catálogo: la salida productiva post-pandemia. Material funcional con presencia atmosférica creciente, antes de la entrada formal al ciclo bhakti del año siguiente.",
      en: "2021 single on Agua y Sed (AYS133). Three tracks. Fiat lux — let there be light — marks a concrete moment in the catalogue: post-pandemic productive output. Functional material with growing atmospheric presence, before the formal entry to the bhakti cycle of the following year.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/28eKhVwdn7wo9Chy0bahTF" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1554651900" },
    ],
  },
  {
    slug: "claudio-solis-ikigai",
    title: "Ikigai",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2024-05-10",
    year: 2024,
    type: "single",
    format: "Single · digital · 2 tracks",
    label: "Solina",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/39/a6/d6/39a6d6e8-37bb-94eb-dd2a-a5d63a7e4a85/723277486673.jpg/1000x1000bb.jpg",
    description: {
      es: "Single de 2024 en Solina. Dos tracks. Ikigai —concepto japonés de razón de ser— continúa la línea conceptual del catálogo Solis: títulos que enmarcan la práctica antes que describirla. Pieza corta, sin pretensión expansiva.",
      en: "2024 single on Solina. Two tracks. Ikigai — Japanese concept of reason for being — continues the conceptual line of the Solis catalogue: titles that frame practice rather than describe it. Short piece, without expansive ambition.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/2dkPpg9ocj6s9a4kkO25vY" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1741042537" },
    ],
  },
  {
    slug: "claudio-solis-yajna",
    title: "Yajna",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2020-11-06",
    year: 2020,
    type: "ep",
    format: "EP · digital · 3 tracks",
    label: "Agua y Sed",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/88/98/7d/88987db6-94c9-d14a-88eb-9b6e417bbcab/00_Cover_Art.jpg/1000x1000bb.jpg",
    description: {
      es: "Single de 2020 en Agua y Sed (AYS123), firmado por Claudio Solis y DELPHIE. Tres tracks. Yajna —ritual védico del fuego— continúa la línea espiritual abierta por Vaisnava del mismo año.",
      en: "2020 single on Agua y Sed (AYS123), signed by Claudio Solis and DELPHIE. Three tracks. Yajna — Vedic fire ritual — continues the spiritual line opened by Vaisnava the same year.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/2eLTFQPZbauWFmrMzs93Ed" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1526126616" },
    ],
  },
  {
    slug: "claudio-solis-vidya",
    title: "Vidya",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2020-09-03",
    year: 2020,
    type: "ep",
    format: "EP · digital · 4 tracks",
    label: "Agua y Sed",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/83/91/bb/8391bb9f-ab91-bd47-a9c1-9fcc3a4708b9/00_Cover_Art.jpg/1000x1000bb.jpg",
    description: {
      es: "Pieza del ciclo bhakti del catálogo Solis, publicada en 2020 en Agua y Sed. 4 tracks. Continúa la operación de tomar términos sánscritos del Vaisnavismo como marco compositivo para minimal techno extendido.",
      en: "Piece from the bhakti cycle of the Solis catalogue, released in 2020 on Agua y Sed. 4 tracks. Continues the operation of taking Sanskrit terms from Vaisnavism as compositional frame for extended minimal techno.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/3AY7G1fESnbgaVLR3ysD6b" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1519632550" },
    ],
  },
  {
    slug: "claudio-solis-sadhana",
    title: "Sadhana",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2020-10-06",
    year: 2020,
    type: "ep",
    format: "EP · digital · 5 tracks",
    label: "ATMOSCL",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/88/3d/61/883d61b6-9206-3d5d-d635-5ebee73c0b05/00_Cover_Art.jpg/1000x1000bb.jpg",
    description: {
      es: "Pieza del ciclo bhakti del catálogo Solis, publicada en 2020 en ATMOSCL. 5 tracks. Continúa la operación de tomar términos sánscritos del Vaisnavismo como marco compositivo para minimal techno extendido.",
      en: "Piece from the bhakti cycle of the Solis catalogue, released in 2020 on ATMOSCL. 5 tracks. Continues the operation of taking Sanskrit terms from Vaisnavism as compositional frame for extended minimal techno.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/3K2IlACSgsf82gDT4aaEDz" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1530300829" },
    ],
  },
  {
    slug: "claudio-solis-mayapur-amethyst",
    title: "Mayapur Amethyst",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2021-07-02",
    year: 2021,
    type: "single",
    format: "Single · digital · 2 tracks",
    label: "Agua y Sed",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/4b/cf/d8/4bcfd893-eaf0-fef5-b9db-4e3ded260bdd/00_Cover_Art.jpg/1000x1000bb.jpg",
    description: {
      es: "Single de 2021 en Agua y Sed (AYS137), firmado por Claudio Solis y Pavlo Fourier. Dos tracks. Mayapur —ciudad sagrada del Gaudiya Vaisnavismo— inserta el catálogo bhakti dentro del flujo Agua y Sed, donde lo espiritual no era el modo dominante.",
      en: "2021 single on Agua y Sed (AYS137), signed by Claudio Solis and Pavlo Fourier. Two tracks. Mayapur — sacred city of Gaudiya Vaisnavism — inserts the bhakti catalogue into the Agua y Sed flow, where the spiritual wasn't the dominant mode.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/3x0l2aNniHbUR7LJ3mqXJU" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1561562068" },
    ],
  },
  {
    slug: "claudio-solis-dubs-of-change-02",
    title: "Dubs of Change 02",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2020-01-13",
    year: 2020,
    type: "single",
    format: "Single · digital · 2 tracks",
    label: "Agua y Sed",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/d2/ea/99/d2ea99e6-b65b-f6ab-ecdb-27f26055217e/00_Cover_Art.jpg/1000x1000bb.jpg",
    description: {
      es: "Volumen 02 de Dubs of Change, dúo Claudio Solis × Javier Labarca publicado en Agua y Sed (AYSX001/002, 2020). Dos tracks por entrega, formato cápsula. Solis y Labarca son los dos pilares productivos del catálogo Agua y Sed; esta serie documenta su trabajo a cuatro manos.",
      en: "Volume 02 of Dubs of Change, the Claudio Solis × Javier Labarca duo released on Agua y Sed (AYSX001/002, 2020). Two tracks per delivery, capsule format. Solis and Labarca are the two productive pillars of the Agua y Sed catalogue; this series documents their four-hand work.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/3zPLkLlvL8KNTJZsR9NuXd" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1490860437" },
    ],
  },
  {
    slug: "claudio-solis-ratha-yatra",
    title: "Ratha Yatra",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2025-07-03",
    year: 2025,
    type: "album",
    format: "Álbum · digital · 6 tracks",
    label: "Aquarians",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/b9/c0/fe/b9c0fec2-501e-faf0-5153-d38034bfb43a/00_Cover_Art.jpg/1000x1000bb.jpg",
    description: {
      es: "EP de 2025 en Vyasa Discos (VD012). Ratha Yatra —festival de las carrozas del culto Jagannath— continúa la nomenclatura bhakti del catálogo. Seis tracks.",
      en: "2025 EP on Vyasa Discos (VD012). Ratha Yatra — chariot festival of the Jagannath cult — continues the catalogue's bhakti nomenclature. Six tracks.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/46RfqnJAaBGaq5X3FHFb56" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1812550541" },
    ],
  },
  {
    slug: "claudio-solis-oneiroi",
    title: "Oneiroi",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2025-02-08",
    year: 2025,
    type: "ep",
    format: "EP · digital · 3 tracks",
    label: "Advisual Records",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/20/b6/93/20b6937e-5a83-01a3-b9f8-a17debff3efe/cover.jpg/1000x1000bb.jpg",
    description: {
      es: "Single de 2025 en Advisual Records. Tres tracks que abren el año con material orientado a la pista, anterior al EP Hapax (2026) en el mismo sello. La línea Solis × Advisual se consolida como una de sus salidas internacionales más estables.",
      en: "2025 single on Advisual Records. Three tracks opening the year with floor-oriented material, prior to the Hapax EP (2026) on the same label. The Solis × Advisual line consolidates as one of his most stable international outlets.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/4LmXZsjEm5JKJ6p9gMUMya" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1800025410" },
    ],
  },
  {
    slug: "claudio-solis-agama",
    title: "Agama",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2020-02-24",
    year: 2020,
    type: "single",
    format: "Single · digital · 2 tracks",
    label: "Inwave",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/2c/e2/8b/2ce28b7c-27aa-4882-b7a8-3809a86340fe/195039154722_cover.jpg/1000x1000bb.jpg",
    description: {
      es: "Pieza del ciclo bhakti del catálogo Solis, publicada en 2020 en Inwave. 2 tracks. Continúa la operación de tomar términos sánscritos del Vaisnavismo como marco compositivo para minimal techno extendido.",
      en: "Piece from the bhakti cycle of the Solis catalogue, released in 2020 on Inwave. 2 tracks. Continues the operation of taking Sanskrit terms from Vaisnavism as compositional frame for extended minimal techno.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/4Q7QwdnFXUEgSX3e4MTfoQ" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1497802142" },
    ],
  },
  {
    slug: "claudio-solis-solis003",
    title: "Solis003",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2019-01-01",
    year: 2019,
    type: "ep",
    format: "EP · digital · 3 tracks",
    label: "Claudio Solis",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/b3/d9/1b/b3d91b46-753c-cbf1-98c9-61bb3e8905a3/5063072431689_cover.jpg/1000x1000bb.jpg",
    description: {
      es: "Volumen 3 de la serie SOLIS, catálogo digital numerado del propio artista. 3 tracks publicados en 2019. La serie funciona como cuaderno de campo del lenguaje minimal del autor: piezas cortas, despojadas, sin pretensión editorial. Cada SOLIS es ejercicio antes que obra cerrada.",
      en: "Volume 3 of the SOLIS series, the artist's own numbered digital catalogue. 3 tracks published in 2019. The series operates as a field notebook of his minimal language: short, stripped pieces, without editorial pretension. Each SOLIS is exercise before closed work.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/4VS8CTtcw2iibVT3YTUH87" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1634577464" },
    ],
  },
  {
    slug: "claudio-solis-solis009",
    title: "Solis009",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2022-08-25",
    year: 2022,
    type: "ep",
    format: "EP · digital · 3 tracks",
    label: "Claudio Solis",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/03/20/51/032051ca-7c48-45da-4539-86f878389c42/5063072439364_cover.jpg/1000x1000bb.jpg",
    description: {
      es: "Volumen 9 de la serie SOLIS, catálogo digital numerado del propio artista. 3 tracks publicados en 2022. La serie funciona como cuaderno de campo del lenguaje minimal del autor: piezas cortas, despojadas, sin pretensión editorial. Cada SOLIS es ejercicio antes que obra cerrada.",
      en: "Volume 9 of the SOLIS series, the artist's own numbered digital catalogue. 3 tracks published in 2022. The series operates as a field notebook of his minimal language: short, stripped pieces, without editorial pretension. Each SOLIS is exercise before closed work.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/4lmjRFRDb9kIX9B8b37BpE" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1640460547" },
    ],
  },
  {
    slug: "claudio-solis-el-circo",
    title: "El Circo",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2009-09-30",
    year: 2009,
    type: "single",
    format: "Single · digital · 1 track",
    label: "Agua y Sed",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music1/v4/88/c5/42/88c542f2-e95d-cf35-7a2a-9737aea83025/00_Cover_Art.jpg/1000x1000bb.jpg",
    description: {
      es: "Release inaugural de Claudio Solis en su sello Agua y Sed (AYS003, 2009). Track único que documenta el punto de partida del catálogo: un Solis veinteañero ya operando sobre los principios que va a refinar durante los siguientes dieciséis años. Pieza histórica más que pieza de pista.",
      en: "Inaugural release by Claudio Solis on his Agua y Sed label (AYS003, 2009). Single track documenting the catalogue's starting point: a twenty-something Solis already operating on the principles he'll refine over the following sixteen years. Historic piece more than dancefloor piece.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/59mzyDihS5xS7MyK1m3ZFB" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1003530005" },
    ],
  },
  {
    slug: "claudio-solis-1206",
    title: "1206",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2023-12-28",
    year: 2023,
    type: "ep",
    format: "EP · digital · 4 tracks",
    label: "Aquarians",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/7a/78/ee/7a78ee3f-4da0-652a-266c-381decf8b218/00_Cover_Art.jpg/1000x1000bb.jpg",
    description: {
      es: "EP de 4 tracks firmado por Ale Valenzuela y Claudio Solis, publicado en 2023 en Aquarians (AQRNS007). Cierra el ciclo Mystical Healers que abrió el sello hermano en 2023, esta vez con Valenzuela como co-firmante principal. Pieza de transición entre la línea bhakti y la electrónica chilena contemporánea.",
      en: "4-track EP signed by Ale Valenzuela and Claudio Solis, released in 2023 on Aquarians (AQRNS007). Closes the Mystical Healers cycle the sister label opened in 2023, this time with Valenzuela as primary co-signer. Transition piece between the bhakti line and contemporary Chilean electronics.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/5AJnUt5Lu1yzDrYoMGxIcU" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1717830704" },
    ],
  },
  {
    slug: "claudio-solis-damodar",
    title: "Damodar",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2022-09-22",
    year: 2022,
    type: "ep",
    format: "EP · digital · 4 tracks",
    label: "Claudio Solis",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/6d/e2/2e/6de22e00-e23e-7413-9f18-7a2dea48f170/5063072449417_cover.jpg/1000x1000bb.jpg",
    description: {
      es: "Pieza del ciclo bhakti del catálogo Solis, publicada en 2022 en Claudio Solis. 4 tracks. Continúa la operación de tomar términos sánscritos del Vaisnavismo como marco compositivo para minimal techno extendido.",
      en: "Piece from the bhakti cycle of the Solis catalogue, released in 2022 on Claudio Solis. 4 tracks. Continues the operation of taking Sanskrit terms from Vaisnavism as compositional frame for extended minimal techno.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/5F8ER0cW6zsmN5rmIKwRrS" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1642673675" },
    ],
  },
  {
    slug: "claudio-solis-viaje-en-el-tiempo",
    title: "Viaje en El Tiempo",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2022-08-25",
    year: 2022,
    type: "ep",
    format: "EP · digital · 3 tracks",
    label: "Agua y Sed",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/92/cc/0a/92cc0a83-93ae-2bcf-7291-4ec3aba5e557/00_Cover_Art.jpg/1000x1000bb.jpg",
    description: {
      es: "Single de 2022 en Agua y Sed (AYS163), firmado por Ale Valenzuela y Claudio Solis. Primera entrega documentada del dúo, antes de Ki Mura del mismo año. Tres tracks.",
      en: "2022 single on Agua y Sed (AYS163), signed by Ale Valenzuela and Claudio Solis. First documented delivery of the duo, before Ki Mura the same year. Three tracks.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/5PneqqAXUwnOnPK5x5P2wT" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1622740017" },
    ],
  },
  {
    slug: "claudio-solis-solis001",
    title: "Solis001",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2019-01-01",
    year: 2019,
    type: "single",
    format: "Single · digital · 2 tracks",
    label: "Claudio Solis",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/d4/17/6d/d4176d58-fe9c-2882-9fea-adf2e15785f2/5063072431382_cover.jpg/1000x1000bb.jpg",
    description: {
      es: "Volumen 1 de la serie SOLIS, catálogo digital numerado del propio artista. 2 tracks publicados en 2019. La serie funciona como cuaderno de campo del lenguaje minimal del autor: piezas cortas, despojadas, sin pretensión editorial. Cada SOLIS es ejercicio antes que obra cerrada.",
      en: "Volume 1 of the SOLIS series, the artist's own numbered digital catalogue. 2 tracks published in 2019. The series operates as a field notebook of his minimal language: short, stripped pieces, without editorial pretension. Each SOLIS is exercise before closed work.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/63ZK0hTW71DhfyXblcAUWb" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1633459692" },
    ],
  },
  {
    slug: "claudio-solis-solis004",
    title: "Solis004",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2019-01-01",
    year: 2019,
    type: "single",
    format: "Single · digital · 2 tracks",
    label: "Claudio Solis",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/a0/4f/1d/a04f1d54-d520-fe60-bccf-a0ef5eb5da8c/5063072438015_cover.jpg/1000x1000bb.jpg",
    description: {
      es: "Volumen 4 de la serie SOLIS, catálogo digital numerado del propio artista. 2 tracks publicados en 2019. La serie funciona como cuaderno de campo del lenguaje minimal del autor: piezas cortas, despojadas, sin pretensión editorial. Cada SOLIS es ejercicio antes que obra cerrada.",
      en: "Volume 4 of the SOLIS series, the artist's own numbered digital catalogue. 2 tracks published in 2019. The series operates as a field notebook of his minimal language: short, stripped pieces, without editorial pretension. Each SOLIS is exercise before closed work.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/68rzngibVweyB6YFHFTJw9" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1636037111" },
    ],
  },
  {
    slug: "claudio-solis-how-long-is-the-night",
    title: "How Long Is The Night",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2024-04-15",
    year: 2024,
    type: "album",
    format: "Álbum · digital · 10 tracks",
    label: "Organic Society",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/33/49/7a/33497a18-27a3-7e24-01f2-eb6c65ff24a6/5063501267353_cover.jpg/1000x1000bb.jpg",
    description: {
      es: "LP digital de 2024 en Nihil Sine Musica (sello europeo). Diez tracks que extienden el método dark minimal del catálogo Vyasa hacia un partner editorial fuera del circuito chileno. Operación de larga duración, pensada como objeto cerrado y no como serie.",
      en: "2024 digital LP on Nihil Sine Musica (European label). Ten tracks extending the dark minimal method of the Vyasa catalogue to an editorial partner outside the Chilean circuit. Long-form operation, conceived as closed object and not as series.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/6DrlOg2sDecdal6xpi6qPO" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1745552568" },
    ],
  },
  {
    slug: "claudio-solis-realizar-el-ser-disolver-el-yo",
    title: "Realizar El Ser, Disolver El Yo",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2025-06-06",
    year: 2025,
    type: "album",
    format: "Álbum · digital · 11 tracks",
    label: "Figura Negra",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/0f/cb/48/0fcb4888-1319-36a9-ce23-785706e4d8a2/5063544691610_cover.jpg/1000x1000bb.jpg",
    description: {
      es: "Álbum largo de 2025 con once tracks: el título —en castellano explícito— sintetiza la operación del catálogo bhakti de Solis. Una de las obras más ambiciosas del año, en línea con Devotional Service (LP) y Sons of Medusa (4 vols).",
      en: "Long 2025 album with eleven tracks: the title — explicit Spanish for 'Realize the Self, Dissolve the Ego' — synthesizes the operation of Solis's bhakti catalogue. One of the most ambitious works of the year, alongside Devotional Service (LP) and Sons of Medusa (4 vols).",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/6LzFZcStvsLDayUs83IMhh" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1805955805" },
    ],
  },
  {
    slug: "claudio-solis-uke-mapu",
    title: "Ñuke Mapu",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2020-09-14",
    year: 2020,
    type: "ep",
    format: "EP · digital · 4 tracks",
    label: "P.U.N.C.H.I.S. Records",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/be/e6/8c/bee68cf8-1a85-d9f2-bf23-2284248ad2c1/cover.jpg/1000x1000bb.jpg",
    description: {
      es: "EP de 2020 en P.U.N.C.H.I.S. Records. Ñuke Mapu —mapudungun: madre tierra— es la única referencia explícita al pueblo mapuche en el catálogo de Solis. Cuatro tracks que cruzan dark minimal con el imaginario sur-andino, antes del giro hindú del catálogo posterior a 2021.",
      en: "2020 EP on P.U.N.C.H.I.S. Records. Ñuke Mapu — Mapudungun for mother earth — is the only explicit reference to the Mapuche people in Solis's catalogue. Four tracks crossing dark minimal with southern-Andean imaginary, before the Hindu turn of the post-2021 catalogue.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/6OZxSxOvsyMyYmxLsFBUuq" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1531046434" },
    ],
  },
  {
    slug: "claudio-solis-mukti",
    title: "Mukti",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2020-07-14",
    year: 2020,
    type: "ep",
    format: "EP · digital · 4 tracks",
    label: "Claudio Solis",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/93/95/ed/9395edd5-39ad-ea52-01eb-c04044936c90/cover.jpg/1000x1000bb.jpg",
    description: {
      es: "Pieza del ciclo bhakti del catálogo Solis, publicada en 2020 en Claudio Solis. 4 tracks. Continúa la operación de tomar términos sánscritos del Vaisnavismo como marco compositivo para minimal techno extendido.",
      en: "Piece from the bhakti cycle of the Solis catalogue, released in 2020 on Claudio Solis. 4 tracks. Continues the operation of taking Sanskrit terms from Vaisnavism as compositional frame for extended minimal techno.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/6R8dFl7rtEhJ0ToJ3tQsgR" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1519009604" },
    ],
  },
  {
    slug: "claudio-solis-nibbana-traxx-part1",
    title: "Nibbana Traxx Part1",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2020-02-05",
    year: 2020,
    type: "single",
    format: "Single · digital · 2 tracks",
    label: "Gilesku Records",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/1b/06/a3/1b06a351-d036-2357-be47-d438168eb490/8790001276048.png/1000x1000bb.jpg",
    description: {
      es: "Segunda parte digital del EP Nibbana Traxx (Part 1). Material de 2020, complementario al vinilo 12\" ed. 30 publicado en 2019 en Gilesku Records. Nibbana —forma pali de nirvana— sigue siendo la palabra-clave que ordena estas piezas: contemplación rítmica, ausencia de gancho.",
      en: "Second digital part of the Nibbana Traxx EP (Part 1). 2020 material, complementary to the 2019 12\" ed. 30 vinyl on Gilesku Records. Nibbana — Pali form of nirvana — remains the keyword ordering these pieces: rhythmic contemplation, absence of hook.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/6ZJcL9Je4wgXvHA25w8u0s" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1497439700" },
    ],
  },
  {
    slug: "claudio-solis-abhay-charanaravinda",
    title: "Abhay Charanaravinda",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2025-06-06",
    year: 2025,
    type: "album",
    format: "Álbum · digital · 7 tracks",
    label: "Aquarians",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/e0/d3/2b/e0d32bec-67ee-4241-51d9-a573a6272f0e/00_Cover_Art.jpg/1000x1000bb.jpg",
    description: {
      es: "EP de 2025 en Vyasa Discos (VD001). Siete tracks. Abhay Charanaravinda —epíteto sánscrito de los pies de loto del señor— abre el catálogo VD numerado del sello vinyl en su ciclo 2025.",
      en: "2025 EP on Vyasa Discos (VD001). Seven tracks. Abhay Charanaravinda — Sanskrit epithet for the lotus feet of the lord — opens the numbered VD catalogue of the vinyl label in its 2025 cycle.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/71RM9QlSx1aDDSEm6TUTTy" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1812452552" },
    ],
  },
  {
    slug: "claudio-solis-vaisakha",
    title: "Vaisakha",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2022-06-03",
    year: 2022,
    type: "single",
    format: "Single · digital · 1 track",
    label: "Claudio Solis",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/f6/6e/17/f66e17f2-4f57-7adc-952d-2bd866935731/5063072128473_cover.jpg/1000x1000bb.jpg",
    description: {
      es: "Pieza del ciclo bhakti del catálogo Solis, publicada en 2022 en Claudio Solis. 1 tracks. Continúa la operación de tomar términos sánscritos del Vaisnavismo como marco compositivo para minimal techno extendido.",
      en: "Piece from the bhakti cycle of the Solis catalogue, released in 2022 on Claudio Solis. 1 tracks. Continues the operation of taking Sanskrit terms from Vaisnavism as compositional frame for extended minimal techno.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/733b0EIC9pGJVjBgpV0NLQ" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1626440718" },
    ],
  },
  {
    slug: "claudio-solis-neoretrochamandrum",
    title: "NeoRetroChamanDrum",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2021-09-17",
    year: 2021,
    type: "ep",
    format: "EP · digital · 4 tracks",
    label: "Agua y Sed",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/49/3f/79/493f790f-0b30-49b4-c59c-9b76e734ac3b/00_Cover_Art.jpg/1000x1000bb.jpg",
    description: {
      es: "EP de 2021 en Agua y Sed (AYS143). El neologismo del título —neo + retro + chamán + drum— sintetiza el método: fusión de capas temporales y simbólicas sobre base rítmica. Cuatro tracks. Punto de transición entre la línea pública del sello y el imaginario hindú que la siguiente fase del catálogo va a desarrollar.",
      en: "2021 EP on Agua y Sed (AYS143). The title neologism — neo + retro + shaman + drum — synthesizes the method: fusion of temporal and symbolic layers over rhythmic base. Four tracks. Transition point between the label's public line and the Hindu imaginary the catalogue's next phase will develop.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/7JF9JNLMhm8p1aWYbwmwDK" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1565581726" },
    ],
  },
  {
    slug: "claudio-solis-solis008",
    title: "Solis008",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2022-08-25",
    year: 2022,
    type: "ep",
    format: "EP · digital · 3 tracks",
    label: "Claudio Solis",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/fa/4d/3b/fa4d3b69-df12-2d7a-bc69-1d8c20ae90e3/5063072439166_cover.jpg/1000x1000bb.jpg",
    description: {
      es: "Volumen 8 de la serie SOLIS, catálogo digital numerado del propio artista. 3 tracks publicados en 2022. La serie funciona como cuaderno de campo del lenguaje minimal del autor: piezas cortas, despojadas, sin pretensión editorial. Cada SOLIS es ejercicio antes que obra cerrada.",
      en: "Volume 8 of the SOLIS series, the artist's own numbered digital catalogue. 3 tracks published in 2022. The series operates as a field notebook of his minimal language: short, stripped pieces, without editorial pretension. Each SOLIS is exercise before closed work.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/7bafbR4ljg7JkKjysmipny" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1640460897" },
    ],
  },
  {
    slug: "claudio-solis-back-2",
    title: "Back 2",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2025-06-13",
    year: 2025,
    type: "ep",
    format: "EP · digital · 3 tracks",
    label: "Aquarians",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/bf/97/09/bf970930-90dd-5c98-51a1-af7f42fa3b98/00_Cover_Art.jpg/1000x1000bb.jpg",
    description: {
      es: "Single de 2025 en Vyasa Discos (VD009). Tres tracks. Material reciente del ciclo 2025 del sello, prensado en vinilo en paralelo con Pandit y Devotional Service.",
      en: "2025 single on Vyasa Discos (VD009). Three tracks. Recent material from the label's 2025 cycle, pressed on vinyl in parallel with Pandit and Devotional Service.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/7fXFhm8Zjw6ARG0LxCDAw3" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1812531523" },
    ],
  },
  {
    slug: "claudio-solis-nibbana-traxx-part2",
    title: "Nibbana Traxx Part2",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2020-02-19",
    year: 2020,
    type: "single",
    format: "Single · digital · 2 tracks",
    label: "Gilesku Records",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/03/7d/7a/037d7a78-7aaf-5283-4c4b-62fb2354900d/8790001276352.png/1000x1000bb.jpg",
    description: {
      es: "Segunda parte digital del EP Nibbana Traxx (Part 2). Material de 2020, complementario al vinilo 12\" ed. 30 publicado en 2019 en Gilesku Records. Nibbana —forma pali de nirvana— sigue siendo la palabra-clave que ordena estas piezas: contemplación rítmica, ausencia de gancho.",
      en: "Second digital part of the Nibbana Traxx EP (Part 2). 2020 material, complementary to the 2019 12\" ed. 30 vinyl on Gilesku Records. Nibbana — Pali form of nirvana — remains the keyword ordering these pieces: rhythmic contemplation, absence of hook.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/7nMmgCFyOK9U1G3KB9kCFy" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1499229904" },
    ],
  },
  {
    slug: "claudio-solis-luz-de-las-velas",
    title: "Luz De Las Velas",
    artistSlug: "claudio-solis",
    artistName: "Claudio Solis",
    releaseDate: "2023-06-26",
    year: 2023,
    type: "ep",
    format: "EP · digital · 3 tracks",
    label: "Inwave",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/89/e3/cf/89e3cf02-665d-4484-2e0b-bca0d452596b/197773299219_cover.jpg/1000x1000bb.jpg",
    description: {
      es: "Single de 2023 en Inwave. Tres tracks. Continúa la línea internacional del catálogo Solis con sellos partners europeos del circuito minimal.",
      en: "2023 single on Inwave. Three tracks. Continues the international line of the Solis catalogue with European partner labels of the minimal circuit.",
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/album/7uvvr6IXapUw8kY4hwO2W6" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/1692857035" },
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
