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
  releaseDate: string; // ISO yyyy-mm-dd, yyyy-mm or yyyy (fecha parcial si no se conoce el día)
  year: number;
  type: "album" | "ep" | "single" | "live" | "mixtape" | "compilation";
  format: string; // human-readable (e.g. "LP · vinilo + digital")
  label?: string;
  description: { es: string; en: string };
  tracklist?: Track[];
  credits?: ReleaseCredit[];
  /** `label` en español o nombre de plataforma; /en la traduce con releaseLinkLabel (LINK_LABEL_EN). */
  links?: { label: string; href: string }[];
  cover?: string;
  /** Co-credited roster artists; release appears under their filter too. */
  featuredArtistSlugs?: string[];
  /** Pre-save / listen smart link (e.g. ONErpm). Drives the primary button on the release page. */
  smartLink?: string;
  /** Official video, embedded under the description (YouTube id only). */
  video?: { youtubeId: string; title: string };
};

export const releases: Release[] = [
  {
    slug: "rosario-lircay-en-vela",
    title: "En Vela",
    artistSlug: "rosario-lircay",
    artistName: "Rosario Lircay",
    releaseDate: "2026-10-23",
    year: 2026,
    type: "single",
    format: "Single · digital",
    label: "PHŌNÉ Records",
    cover: "/releases/rosario-lircay-en-vela.jpg",
    smartLink: "https://onerpm.link/105010589210",
    description: {
      es: `"En Vela" es el tercer adelanto de "La Piel", el álbum debut de Rosario Lircay, y su primer lanzamiento con PHŌNÉ Records, publicado el viernes 23 de octubre de 2026; el enlace de la sección "Escuchar" lleva a todas las plataformas. La canción se apoya en un ritmo de hip hop a medio tiempo, con el teclado de Fede Rocha y el scratch de DJ Acres dibujando el fondo sobre el que la voz se debate entre lamentar y superar una pérdida amorosa.

El relato parte con una frase desafiante: no importa si quieres irte, que te vaya bien. Desde ahí la cantante deja claro que quien se fue ya no es bienvenido y que volver tiene consecuencias: encontrarla con otras caricias que se parecen a las suyas. El coro insiste en que se trata de una canción de superación, pero la segunda estrofa vuelve a mirar atrás, pregunta qué nos pasó y se cierra con un cansado "ya qué más da". Ese vaivén es el centro del tema: el autoconvencimiento de quien dice haber dado vuelta la página cuando el olvido todavía no llega. Una noche en vela.

Como el resto del disco, "En Vela" nació de un beat y luego fue interpretada por músicos, con la voz cantada-hablada que caracteriza esta etapa de Rosario Lircay, entre el r&b, el hip hop y el pop alternativo. "La Piel" fue producido por Fresco Fresco (Pablo Acuña y Nacho Barrientos), grabado en La Salitrera y Fresco Fresco y masterizado por Chalo G; sus adelantos anteriores fueron "ya me tienes" (abril de 2026) y "a ti" (junio de 2026).

Rosario Lircay es el nombre artístico de Rosario Meléndez, cantante de la Región de Ñuble radicada en Santiago, corista estable de Alex Anwandter y ex vocalista de Mareo! y Narcisa. "En Vela" dura 2:50 y es ℗ 2026 PHŌNÉ Records, bajo licencia exclusiva a ONErpm. Los créditos completos de composición, grabación, mezcla y arte se agregarán a esta ficha cuando la artista los confirme.`,
      en: `"En Vela" ("Sleepless") is the third single from "La Piel", Rosario Lircay's debut album, and her first release with PHŌNÉ Records, published on Friday, October 23, 2026; the link in the "Listen" section takes you to all platforms. The song rests on a mid-tempo hip hop beat, with Fede Rocha's keyboard and DJ Acres' scratching drawing the backdrop over which the voice wavers between mourning and getting over a lost love.

The story opens with a defiant line: it doesn't matter if you want to leave, good luck to you. From there the singer makes it clear that the one who left is no longer welcome and that coming back has consequences: finding her with other caresses that resemble his. The chorus insists this is a song about moving on, but the second verse looks back again, asks what happened to us and closes with a tired "what does it matter now". That back-and-forth is the heart of the track: the self-persuasion of someone who claims to have turned the page while forgetting hasn't arrived yet. A sleepless night.

Like the rest of the record, "En Vela" was born from a beat and then played by musicians, with the half-sung, half-spoken voice that defines this stage of Rosario Lircay, between R&B, hip hop and alternative pop. "La Piel" was produced by Fresco Fresco (Pablo Acuña and Nacho Barrientos), recorded at La Salitrera and Fresco Fresco and mastered by Chalo G; its previous singles were "ya me tienes" (April 2026) and "a ti" (June 2026).

Rosario Lircay is the stage name of Rosario Meléndez, a singer from the Ñuble region based in Santiago, a permanent backing vocalist for Alex Anwandter and former lead singer of Mareo! and Narcisa. "En Vela" runs 2:50 and is ℗ 2026 PHŌNÉ Records, under exclusive license to ONErpm. Full composition, recording, mixing and artwork credits will be added to this page once the artist confirms them.`,
    },
    tracklist: [{ n: 1, title: "En Vela", duration: "2:50" }],
    credits: [
      { role: "Teclado", name: "Fede Rocha" },
      { role: "Scratch", name: "DJ Acres" },
      { role: "℗", name: "2026 PHŌNÉ Records, bajo licencia exclusiva a ONErpm" },
    ],
    links: [
      { label: "Todas las plataformas", href: "https://onerpm.link/105010589210" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/en-vela-single/6821221086" },
      // Del smartlink; verificado con el oEmbed de Spotify (título "En Vela") el 24-10 y el 26-10-2026.
      { label: "Spotify", href: "https://open.spotify.com/album/5ONQBpFhxX31ruaLxwUMqw" },
    ],
  },
  {
    slug: "newen-afrobeat-la-fuerza",
    title: "La Fuerza",
    artistSlug: "newen-afrobeat",
    artistName: "Newen Afrobeat",
    releaseDate: "2026-10-30",
    year: 2026,
    type: "single",
    format: "Single · digital",
    label: "PHŌNÉ Records",
    cover: "/releases/newen-afrobeat-la-fuerza.jpg",
    smartLink: "https://orcd.co/npk70nb",
    description: {
      es: `"La Fuerza" es un single de Newen Afrobeat editado con PHŌNÉ Records, con fecha de lanzamiento el viernes 30 de octubre de 2026. Es la primera canción nueva de la banda desde "Liverpool Session" (2025) y el primer adelanto de la etapa que abre su próximo álbum de estudio, el disco que el grupo prepara durante 2026 y que profundiza el cruce entre afrobeat, música latinoamericana y elementos contemporáneos de jazz, soul y electrónica. El tema dura 4:44 y se publica como single digital, también en alta resolución (24 bits / 48 kHz) en Qobuz.

Newen Afrobeat es una de las agrupaciones más influyentes de la escena afrobeat latinoamericana. Formada en Santiago de Chile en 2009, fue la primera banda de afrobeat del país y en más de quince años ha llevado su música a escenarios y festivales de América, Europa y África. Su discografía incluye el disco debut "Newen Afrobeat" (2014), "Newen Plays Fela" (2017, con Seun Kuti, Cheick Tidiane Seck y músicos de Egypt 80), "Curiche" (2019), el álbum "Grietas" (2024, con Lido Pimienta, Dele Sosimi, Joe Vasconcellos y Chico César) y "Liverpool Session" (2025), grabado de forma íntegramente análoga.

La portada de "La Fuerza", obra del ilustrador chileno Wacko (@wacko_art), es un paisaje andino: una montaña de cumbres nevadas sobre un desierto rojo, una laguna con flamencos y guanacos bajo un cielo violeta y un sol lleno. Ese imaginario de altura y territorio acompaña el título y anticipa el tono del single, que la banda presentará en vivo en los próximos conciertos.

La grabación es ℗ 2026 Newen Afrobeat y la edición © 2026 PHŌNÉ Records. El enlace de la sección "Escuchar" lleva a todas las plataformas. Los créditos completos de composición, grabación, mezcla y master se publicarán cuando la banda los confirme.`,
      en: `"La Fuerza" ("The Force") is a single by Newen Afrobeat on PHŌNÉ Records, with a release date of Friday, October 30, 2026. It is the band's first new song since "Liverpool Session" (2025) and the first taste of the stage opened by their next studio album, the record the group is preparing through 2026, which deepens the crossing of afrobeat, Latin American music and contemporary elements of jazz, soul and electronics. The track runs 4:44 and is released as a digital single, also in high resolution (24-bit / 48 kHz) on Qobuz.

Newen Afrobeat is one of the most influential bands of the Latin American afrobeat scene. Formed in Santiago, Chile in 2009, it was the country's first afrobeat band and in more than fifteen years has taken its music to stages and festivals across the Americas, Europe and Africa. Its discography includes the debut album "Newen Afrobeat" (2014), "Newen Plays Fela" (2017, with Seun Kuti, Cheick Tidiane Seck and members of Egypt 80), "Curiche" (2019), the album "Grietas" (2024, with Lido Pimienta, Dele Sosimi, Joe Vasconcellos and Chico César) and "Liverpool Session" (2025), recorded entirely on analog equipment.

The cover of "La Fuerza", by Chilean illustrator Wacko (@wacko_art), is an Andean landscape: a snow-capped mountain over a red desert, a lagoon with flamingos and guanacos under a violet sky and a full sun. That imagery of altitude and territory matches the title and sets the tone of the single, which the band will present live at its upcoming concerts.

The recording is ℗ 2026 Newen Afrobeat and the release © 2026 PHŌNÉ Records. The link in the "Listen" section takes you to all platforms. Full composition, recording, mixing and mastering credits will be published once the band confirms them.`,
    },
    tracklist: [{ n: 1, title: "La Fuerza", duration: "4:44" }],
    credits: [
      { role: "Ilustración de portada", name: "Wacko (@wacko_art)" },
      { role: "℗", name: "2026 Newen Afrobeat" },
      { role: "©", name: "2026 PHŌNÉ Records" },
    ],
    // Apple Music verificado con iTunes Lookup el 29-10-2026 ("La Fuerza - Single", Newen Afrobeat,
    // 2026-10-30, 1 tema). Spotify: el smart link apunta a open.spotify.com/album/7pDBGQqk3zOhnKhjz95SUZ,
    // pero el oEmbed da 404 hasta el estreno. El 30-10, si el oEmbed lo confirma, reemplaza a
    // "Spotify (artista)" con la etiqueta "Spotify" (el perfil ya está en la ficha del artista).
    links: [
      { label: "Todas las plataformas", href: "https://orcd.co/npk70nb" },
      { label: "Qobuz (hi-res)", href: "https://www.qobuz.com/us-en/album/la-fuerza-newen-afrobeat/rkxyy8xslgx0o" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/la-fuerza-single/6822447521" },
      { label: "Spotify (artista)", href: "https://open.spotify.com/artist/0PTJ848ulShbjTx2yqaAlb" },
    ],
  },
  // ─────────── Newen Afrobeat ───────────
  {
    slug: "newen-afrobeat-grietas",
    title: "Grietas",
    artistSlug: "newen-afrobeat",
    artistName: "Newen Afrobeat",
    featuredArtistSlugs: ["ecamhi", "klaus-b"],
    releaseDate: "2024-09-25",
    year: 2024,
    type: "album",
    format: "LP · vinilo + digital",
    label: "OfficeHome Records (París)",
    cover: "https://f4.bcbits.com/img/a1399189381_10.jpg",
    description: {
      es:
        "Cuarto LP de Newen Afrobeat, grabado en Santuario Sónico (Santiago, abril 2022) con producción general de Sebastián Crooker, mezcla de Fran 'Antena' Infante y master de Carlos Barros. Además de la banda, el disco reúne a dos artistas del roster PHŌNÉ: ecamhi (trompeta, co-composición de Mare Mare y co-dirección de arte con Tom Pavez) y Klaus B (composición de Es la vida). Featurings de Lido Pimienta, Dele Sosimi, Joe Vasconcellos y Chico César.",
      en:
        "Newen Afrobeat's fourth LP, recorded at Santuario Sónico (Santiago, April 2022) with general production by Sebastián Crooker, mixing by Fran 'Antena' Infante and mastering by Carlos Barros. Besides the band, the album brings together two PHŌNÉ roster artists: ecamhi (trumpet, co-composition of Mare Mare and co-art direction with Tom Pavez) and Klaus B (composer of Es la vida). Featurings by Lido Pimienta, Dele Sosimi, Joe Vasconcellos and Chico César.",
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
      { role: "Dirección de arte", name: "Tom Pavez + ecamhi" },
      { role: "Cover art", name: "Matías Lasen" },
      { role: "Diseño gráfico", name: "Claudio Solís" },
      { role: "Producción ejecutiva", name: "Martín Canessa, Lichens Family" },
      { role: "Grabación", name: "Juan Pablo Quezada Kaulen · Santuario Sónico, Santiago, abril 2022" },
    ],
    links: [
      { label: "Bandcamp", href: "https://officehomerecords.bandcamp.com/album/grietas-2" },
      { label: "Discogs", href: "https://www.discogs.com/release/35010053-Newen-Afrobeat-Grietas" },
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
        "Segundo álbum de larga duración. Documenta la exploración continua del afrobeat y los viajes a Lagos, Nigeria para estudiar con maestros del género. Tematiza desigualdad, migración, rol femenino, culturas indígenas. Grabado, mezclado y masterizado en Santuario Sónico, Santiago de Chile. Participaciones de Oghene Kologbo, Enrique Camhi (ecamhi) y Diego Alarcón.",
      en:
        "Second full-length album. Documents the continued exploration of afrobeat music and travels to Lagos, Nigeria to study with masters of the genre. Themes: inequality, migration, women's roles, indigenous cultures. Recorded, mixed and mastered at Santuario Sónico, Santiago, Chile. Participations by Oghene Kologbo, Enrique Camhi (ecamhi) and Diego Alarcón.",
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
    releaseDate: "2023",
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
    slug: "klaus-b-un-rezo",
    title: "Un Rezo",
    artistSlug: "klaus-b",
    artistName: "Klaus B",
    releaseDate: "2026-11-05",
    year: 2026,
    type: "single",
    format: "Single · digital",
    label: "PHŌNÉ Records",
    cover: "/releases/klaus-b-un-rezo.jpg",
    smartLink: "https://onerpm.link/106214256083",
    description: {
      es: `"Un Rezo" es un single de Klaus B con fecha de lanzamiento el jueves 5 de noviembre de 2026, dos semanas después de "Destellos de ti". Es el segundo adelanto del álbum "Una Cuota De Caos" (viernes 20 de noviembre de 2026) y cuenta con videoclip oficial.

La canción es nu jazz futurista de carácter espiritual y devocional. La flauta y el trombón se apoyan en una batería con inercia que no deja que la pieza se detenga. El resultado es un tema moderno, inspirador y emocional. El título, "Un Rezo", ya anticipa ese espíritu devocional, aunque el sonido mire hacia adelante: es música de hoy, con la vista puesta en el futuro.

Si "Destellos de ti" abrió el ciclo con un tema emotivo e íntimo, de saxofón, trombón y banda, "Un Rezo" muestra otra cara de Klaus B dentro del mismo universo: aquí la flauta y el trombón dan forma a un carácter más espiritual y devocional. Ambos singles descansan sobre la batería, con reminiscencias de drum and bass en el primero y con inercia en el segundo, y juntos arman un primer retrato de "Una Cuota De Caos".

Klaus B es integrante de Newen Afrobeat y de la banda de Pascuala Ilabaca, y su música propia fusiona hip hop, jazz, neo soul, funk y ritmos afro-latinoamericanos. En "Un Rezo" firma la composición y la producción, además del saxofón y la flauta que figuran en los créditos del single.

El álbum llega después de "Viaje Sin Tiempo" (2024), disco hecho junto a Gestosimple, y de "Memorias: Mixtape" (2025). Detrás del lanzamiento está PHŌNÉ Records, que lo acompaña en difusión y prensa, con distribución de ONErpm. "Un Rezo" ocupa el centro del calendario: queda entre el primer single (22 de octubre) y el álbum completo (20 de noviembre), a quince días de este último, que cierra el ciclo.`,
      en: `"Un Rezo" is a single by Klaus B with a release date of Thursday, November 5, 2026, two weeks after "Destellos de ti". It is the second preview from the album "Una Cuota De Caos" (Friday, November 20, 2026), and it has an official music video.

The song is futuristic nu jazz with a spiritual, devotional character. Flute and trombone rest on drums with an inertia that never lets the piece stand still. The result is a modern, inspiring and emotional track. The title, "Un Rezo" ("A Prayer"), already hints at that devotional spirit, even though the sound looks ahead: it is music of today, with its eyes on the future.

If "Destellos de ti" opened the cycle with an emotional, intimate track of saxophone, trombone and band, "Un Rezo" shows another side of Klaus B within the same universe: here flute and trombone shape a more spiritual, devotional character. Both singles rest on the drums, with echoes of drum and bass in the first and a driving inertia in the second, and together they sketch a first portrait of "Una Cuota De Caos".

Klaus B is a member of Newen Afrobeat and of Pascuala Ilabaca's band, and his own music fuses hip hop, jazz, neo soul, funk and Afro-Latin American rhythms. On "Un Rezo" he is credited with composition and production, as well as the saxophone and flute listed in the single's credits.

The album follows "Viaje Sin Tiempo" (2024), a record made together with Gestosimple, and "Memorias: Mixtape" (2025). PHŌNÉ Records stands behind the release, supporting it with promotion and press, with distribution by ONErpm. "Un Rezo" sits at the center of the calendar: it falls between the first single (October 22) and the full album (November 20), fifteen days before the latter, which closes the cycle.`,
    },
    credits: [
      { role: "Composición, saxofón, flauta, producción", name: "Klaus B" },
      { role: "Sello, difusión y prensa", name: "PHŌNÉ Records" },
      { role: "Distribución", name: "ONErpm" },
    ],
    // Apple Music verificado con iTunes Lookup el 29-10-2026 ("Un Rezo - Single", Klaus B, 2026-11-05,
    // 1 tema). Spotify: el smart link de ONErpm no trae el id; se agrega el 05-11 tras el oEmbed.
    links: [
      { label: "Todas las plataformas", href: "https://onerpm.link/106214256083" },
      { label: "Apple Music", href: "https://music.apple.com/us/album/un-rezo-single/6821460706" },
    ],
  },
  {
    slug: "klaus-b-destellos-de-ti",
    title: "Destellos de ti",
    artistSlug: "klaus-b",
    artistName: "Klaus B",
    releaseDate: "2026-10-22",
    year: 2026,
    type: "single",
    format: "Single · digital",
    label: "PHŌNÉ Records",
    cover: "/releases/klaus-b-destellos-de-ti.jpg",
    smartLink: "https://onerpm.link/102211016130",
    description: {
      es: `"Destellos de ti" es un single de Klaus B publicado el jueves 22 de octubre de 2026. Es el primer adelanto de "Una Cuota De Caos", el álbum del saxofonista, flautista, compositor y productor chileno, y cuenta con videoclip oficial.

Lo que suena es nu jazz moderno y futurista. El saxofón y el trombón se encuentran con una banda, y todo descansa sobre una batería con reminiscencias de drum and bass que le da impulso a la canción. Es un tema emotivo e íntimo, pero con mucha potencia y presencia sonora: la emoción y la contundencia conviven en el mismo espacio, sin que una le quite lugar a la otra.

Con este single comienza un ciclo de tres lanzamientos que se despliega en menos de un mes. "Destellos de ti" abre el camino el 22 de octubre; dos semanas después, el jueves 5 de noviembre de 2026, llega el segundo single, "Un Rezo"; y quince días más tarde, el viernes 20 de noviembre de 2026, se publica el álbum completo, "Una Cuota De Caos". Ser el primero de la serie le da a este tema un lugar especial: es la primera puerta de entrada al disco y permite seguir el ciclo en el orden en que se publica.

El single tiene además videoclip oficial, igual que el segundo adelanto, "Un Rezo": los dos primeros pasos del ciclo cuentan con imagen propia, además del sonido.

Klaus B llega a este lanzamiento con dos trabajos recientes: el álbum "Viaje Sin Tiempo" (2024), hecho junto a Gestosimple, y "Memorias: Mixtape" (2025). Su música mezcla hip hop, jazz, neo soul y funk con ritmos afro-latinoamericanos, y "Destellos de ti" lleva ese cruce hacia un nu jazz moderno y futurista, con una batería de herencia drum and bass.

En este single, Klaus B firma la composición, el saxofón, la flauta y la producción. PHŌNÉ Records, sello cultural independiente de Santiago de Chile, respalda el lanzamiento con difusión y prensa, y la distribución está a cargo de ONErpm. Dentro del catálogo 2026 del sello, "Destellos de ti" llega tres semanas después de "Cuántas veces", el single de Con.fusión con el que PHŌNÉ Records abre ese catálogo.`,
      en: `"Destellos de ti" is a single by Klaus B, released on Thursday, October 22, 2026. It is the first single from "Una Cuota De Caos", the album by the Chilean saxophonist, flautist, composer and producer, and it has an official music video.

What you hear is modern, futuristic nu jazz. Saxophone and trombone meet a band, and everything rests on drums with echoes of drum and bass that give the song its drive. It is an emotional, intimate piece with real power and sonic presence: feeling and force share the same space without either one taking room from the other.

With this single, a cycle of three releases begins, unfolding in less than a month. "Destellos de ti" opens the way on October 22; two weeks later, on Thursday, November 5, 2026, the second single, "Un Rezo", arrives; and fifteen days after that, on Friday, November 20, 2026, the full album, "Una Cuota De Caos", is released. Being first in the series gives this track a special place: it is the first way into the record and lets you follow the cycle in the order it is published.

The single also has an official music video, just like the second single, "Un Rezo": the first two steps of the cycle come with their own visuals as well as their sound.

Klaus B arrives at this release with two recent works: the album "Viaje Sin Tiempo" (2024), made together with Gestosimple, and "Memorias: Mixtape" (2025). His music blends hip hop, jazz, neo soul and funk with Afro-Latin American rhythms, and "Destellos de ti" takes that crossing toward a modern, futuristic nu jazz, with drums that carry a drum and bass heritage.

On this single, Klaus B is credited with composition, saxophone, flute and production. PHŌNÉ Records, an independent cultural label from Santiago, Chile, backs the release with promotion and press, and distribution is handled by ONErpm. Within the label's 2026 catalogue, "Destellos de ti" arrives three weeks after "Cuántas veces", the Con.fusión single with which PHŌNÉ Records opens that catalogue.`,
    },
    credits: [
      { role: "Composición, saxofón, flauta, producción", name: "Klaus B" },
      { role: "Trombón", name: "Pablo James" },
      { role: "Teclados", name: "Felamusic" },
      { role: "Guitarra eléctrica", name: "José Toledo" },
      { role: "Bajo eléctrico", name: "Francisco Ruiz" },
      { role: "Batería", name: "Benjamín Plaza" },
      { role: "Grabación (Estudio Vinilo)", name: "Martín Schlotfeldt" },
      { role: "Mezcla (Modo Estudios)", name: "Ticho" },
      { role: "Master", name: "Francisco Holzmann" },
      { role: "Diseño", name: "Seven Estudio" },
      { role: "Videoclip (dirección, montaje y cámara)", name: "Matías Burgos" },
      { role: "Sello, difusión y prensa", name: "PHŌNÉ Records" },
      { role: "Distribución", name: "ONErpm" },
    ],
    video: { youtubeId: "zEfVXTYtuo8", title: "Klaus B - Destellos De Ti [Videoclip Oficial]" },
    links: [
      { label: "Todas las plataformas", href: "https://onerpm.link/102211016130" },
      // Del smartlink; verificado con el oEmbed de Spotify (título "Destellos de Ti") el 24-10 y el 26-10-2026.
      { label: "Spotify", href: "https://open.spotify.com/album/5loHWji5dshEXJv1LavbCF" },
    ],
  },
  {
    slug: "klaus-b-memorias-mixtape",
    title: "Memorias: Mixtape",
    artistSlug: "klaus-b",
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
    artistSlug: "klaus-b",
    artistName: "Gestosimple & Klaus B",
    featuredArtistSlugs: ["ecamhi"],
    releaseDate: "2025-11-26",
    year: 2025,
    type: "live",
    format: "EP en vivo · 3 tracks",
    cover: "https://f4.bcbits.com/img/a0583641197_10.jpg",
    description: {
      es:
        "EP en vivo del dúo Gestosimple & Klaus B grabado en Cajón del Maipo, con Enrique Camhi en trompeta como invitado. Tres tracks que cruzan future jazz y hip-hop instrumental en formato sesión cerrada: nada de la artificialidad del estudio, todo el aire del lugar. Es uno de los pocos registros en vivo del catálogo de Klaus y el más reciente puente formal entre su proyecto y el de ecamhi dentro del ecosistema PHŌNÉ.",
      en:
        "Live EP by the duo Gestosimple & Klaus B recorded in Cajón del Maipo, with Enrique Camhi as guest on trumpet. Three tracks crossing future jazz and instrumental hip-hop in closed-session format: none of the studio's artifice, all the air of the place. One of the few live records in Klaus's catalogue and the most recent formal bridge between his project and ecamhi's within the PHŌNÉ ecosystem.",
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
      { role: "Trompeta · fluegelhorn", name: "ecamhi" },
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
    artistSlug: "klaus-b",
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
    artistSlug: "klaus-b",
    artistName: "Klaus B",
    releaseDate: "2023-07-11",
    year: 2023,
    type: "single",
    format: "Single",
    cover: "https://f4.bcbits.com/img/a2824675677_10.jpg",
    description: {
      es:
        "Single producido entre 2022 y 2023, después de los viajes en gira de Newen Afrobeat a Lagos. Reúne la sección de bronces completa de Newen —incluido ecamhi en trompeta— sobre una base hip-hop jazz que Klaus construye desde el vocoder y la flauta. Es el cruce más explícito entre el universo afrobeat de Newen y el lenguaje neo-soul instrumental de Klaus, y uno de los primeros singles que tematiza la conexión entre ambos proyectos.",
      en:
        "Single produced between 2022 and 2023, after Newen Afrobeat's touring trips to Lagos. Gathers Newen's full brass section — including ecamhi on trumpet — over a hip-hop jazz base Klaus builds from vocoder and flute. The most explicit crossing between Newen's afrobeat universe and Klaus's instrumental neo-soul language, and one of the first singles to thematize the connection between both projects.",
    },
    credits: [
      { role: "Vocoder · alto sax", name: "Klaus B" },
      { role: "Voz principal", name: "Fran Ri" },
      { role: "Coros", name: "Camila Fuentes, Fran Castro, Maca Rozic" },
      { role: "Trompeta", name: "Enrique Camhi (ecamhi), Diego González, Maururu Sánchez" },
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
    artistSlug: "klaus-b",
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
    artistSlug: "klaus-b",
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
    artistSlug: "klaus-b",
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
    artistSlug: "klaus-b",
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
    artistSlug: "klaus-b",
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

  // ─────────── ecamhi ───────────
  {
    slug: "ecamhi-en-viaje",
    title: "en viaje",
    artistSlug: "ecamhi",
    artistName: "ecamhi",
    releaseDate: "2027",
    year: 2027,
    type: "ep",
    format: "EP · 4 tracks · en producción",
    label: "PHŌNÉ Records",
    description: {
      es:
        "Próximo EP de ecamhi, previsto para 2027 y actualmente en producción. Se concibe a partir de las fotografías de las giras con Newen Afrobeat: cada foto se convierte en una canción, hasta completar cuatro piezas. El proyecto está pensado para presentarse junto a una exposición fotográfica, donde cada imagen va acompañada de audífonos con la pieza correspondiente. Imagen y sonido nacen del mismo proceso creativo.",
      en:
        "Forthcoming EP from ecamhi, planned for 2027 and currently in production. It is conceived from photographs of the tours with Newen Afrobeat: each photo becomes a song, until four pieces are complete. The project is designed to be presented alongside a photo exhibition, where each image comes with headphones playing the corresponding piece. Image and sound come from the same creative process.",
    },
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
        "Aparición de Enrique Camhi (ecamhi) como trompetista invitado en Gaviotas, single de Diego de la Noche con Felipe Montero. La trompeta de Camhi opera sobre una base de pop electrónico de cámara, demostrando la versatilidad del instrumento fuera del marco jazz/afrobeat habitual. Publicado en simultáneo con Laruz como parte de una entrega doble. Es una de las primeras apariciones documentadas de Camhi como sesionista fuera del ecosistema PHŌNÉ.",
      en:
        "Appearance of Enrique Camhi (ecamhi) as guest trumpeter on Gaviotas, a Diego de la Noche single with Felipe Montero. Camhi's trumpet operates over a chamber electronic-pop base, demonstrating the instrument's versatility outside the usual jazz/afrobeat frame. Released alongside Laruz as part of a double drop. One of the first documented appearances of Camhi as session player outside the PHŌNÉ ecosystem.",
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
        "Segunda aparición de ecamhi como invitado en singles de Diego de la Noche, publicado el mismo día que Gaviotas (noviembre 2022). Camhi sostiene la trompeta como hilo melódico principal del track, lo que lo distingue del rol de adorno tímbrico habitual del instrumento en producciones similares. Cierra una entrega doble que documenta la red colaborativa de Camhi en el circuito chileno de electrónica de cámara y pop experimental.",
      en:
        "Second appearance of ecamhi as guest on Diego de la Noche singles, released the same day as Gaviotas (November 2022). Camhi sustains the trumpet as the track's main melodic thread, distinguishing him from the usual role of timbral ornament for the instrument in similar productions. Closes a double drop documenting Camhi's collaborative network in the Chilean chamber-electronics and experimental-pop circuit.",
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
        "Single firmado por Alejandro Camhi y Enrique Camhi —dúo familiar— publicado en julio 2024. Es la única colaboración documentada entre ambos hermanos: electrónica estival con trompeta encima, pieza corta y sin gancho convencional, hecha para escucha de estación más que para playlist. Funciona como entrada secundaria al catálogo de ecamhi y como documento personal del eje familiar dentro de su práctica musical.",
      en:
        "Single signed by Alejandro Camhi and Enrique Camhi —familial duo— released July 2024. The only documented collaboration between the brothers: summery electronics with trumpet on top, a short piece without conventional hook, made for seasonal listening rather than for playlist. Functions as secondary entry into the ecamhi catalogue and as personal document of the familial axis within his musical practice.",
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
        "Single solista publicado en mayo 2022, años antes del EP en viaje. Es el primer trabajo firmado únicamente por Enrique Camhi sin co-autores: trompeta y producción propia en una pieza corta que ya anuncia la lógica interdisciplinar del proyecto. La estructura del track —menos canción, más cuadro sonoro— sirve como antecedente directo de en viaje, donde cuatro imágenes inspirarían cuatro piezas. Marca la consolidación de su voz solista.",
      en:
        "Solo single released May 2022, years before the en viaje EP. The first work signed solely by Enrique Camhi without co-authors: trumpet and self-produced in a short piece already announcing the project's interdisciplinary logic. The track's structure —less song, more sonic painting— serves as direct precursor to en viaje, where four images would inspire four pieces. Marks the consolidation of his solo voice.",
    },
    links: [
      { label: "Apple Music", href: "https://music.apple.com/us/album/move-to/1618064796" },
          { label: "Spotify", href: "https://open.spotify.com/album/79OqBRxmaAO9kKVmfQf5BV" },
],
  },

  // ─────────── Con.fusión ───────────
  {
    slug: "con-fusion-cuantas-veces",
    title: "Cuántas veces",
    artistSlug: "con-fusion",
    artistName: "Con.fusión",
    featuredArtistSlugs: ["ecamhi"],
    releaseDate: "2026-10-01",
    year: 2026,
    type: "single",
    format: "Single · digital",
    label: "PHŌNÉ Records",
    cover: "/releases/con-fusion-cuantas-veces.jpg",
    video: { youtubeId: "lPXsqrH4SU4", title: "Cuántas veces - Con.fusión ft. NuVee (prod. ecamhi)" },
    description: {
      es: `"Cuántas veces" es el single con el que PHŌNÉ Records abre su catálogo 2026, y una declaración de lo que viene. Con.fusión, la voz que fusiona hip hop, jazz y neosoul, se encuentra con el saxofón de NuVee sobre una producción de ecamhi que trabaja el espacio como un instrumento más. Los sonidos aparecen, se alejan y se envuelven unos en otros, y la voz está tratada de una forma poco habitual: estirada, desplazada, puesta en lugares donde no se la espera. El resultado es una canción de sensibilidad indie, envolvente y atmosférica, donde el saxo y la voz conversan en vez de competir.

"Cuántas veces" habla de todo lo que sucede dentro de un sueño: miles de realidades paralelas que se repiten una y otra vez. La producción traduce esa idea al sonido, con capas que vuelven, se duplican y se desplazan como escenas de un sueño que no termina. Su valor está en el cruce: el oficio vocal de una intérprete con formación en jazz, puesto al servicio de una producción que se arriesga.

"Cuántas veces" marca el inicio de un camino de lanzamientos de Con.fusión rumbo a "Tulpa", su primer álbum solista, que prepara junto a Matiah Chinaski. Es la fusión urbana chilena sonando desde un lugar propio.

Con.fusión es el proyecto solista de Catalina Aguilera, una propuesta que transita entre el hip hop, el jazz y el neosoul, con exploraciones vocales que van del canto al rap y el scat. El single se publicó el 1 de octubre de 2026 y su videoclip oficial, estrenado en YouTube el 28 de septiembre, se puede ver completo en esta misma página, justo debajo de esta descripción. La composición y la letra son de Con.fusión (Catalina Aguilera) y NuVee, y el saxofón es de NuVee. La producción y la mezcla son de ecamhi, también parte del roster de PHŌNÉ Records, y el master es de DJ Pérez. El video, el montaje y el color son de Bárbara Lafuente; la foto fija, de Andrés Abrigo, y el diseño gráfico, de Daniel Torres. En las plataformas el tema figura como "Cuántas Veces (feat. Ecamhi & NuVee)", dura 3:29 y puede escucharse en Apple Music desde el enlace de la sección "Escuchar" de esta ficha. La grabación es ℗ PHŌNÉ Records, bajo licencia exclusiva a ONErpm.`,
      en: `"Cuántas veces" is the single with which PHŌNÉ Records opens its 2026 catalogue, and a statement of what is coming. Con.fusión, the voice that fuses hip hop, jazz and neosoul, meets NuVee's saxophone over a production by ecamhi that treats space as one more instrument. Sounds appear, drift away and wrap around one another, and the voice is treated in an unusual way: stretched, displaced, placed where you would not expect it. The result is an enveloping, atmospheric song with an indie sensibility, where the sax and the voice converse instead of competing.

"Cuántas veces" ("How many times") is about everything that happens inside a dream: thousands of parallel realities that repeat over and over. The production translates that idea into sound, with layers that return, double and shift like scenes from a dream that never ends. Its value lies in the crossing: the vocal craft of a performer trained in jazz, put at the service of a production that takes risks.

"Cuántas veces" marks the beginning of a path of Con.fusión releases leading to "Tulpa", her first solo album, which she is preparing together with Matiah Chinaski. It is Chilean urban fusion sounding from a place of its own.

Con.fusión is the solo project of Catalina Aguilera, a proposal that moves between hip hop, jazz and neosoul, with vocal explorations that range from singing to rap and scat. The single was released on October 1, 2026, and its official music video, premiered on YouTube on September 28, can be watched in full on this very page, right below this description. Composition and lyrics are by Con.fusión (Catalina Aguilera) and NuVee, and the saxophone is played by NuVee. Production and mixing are by ecamhi, also part of the PHŌNÉ Records roster, and the master is by DJ Pérez. Video, editing and color are by Bárbara Lafuente; still photography is by Andrés Abrigo, and graphic design by Daniel Torres. On streaming platforms the track is listed as "Cuántas Veces (feat. Ecamhi & NuVee)", runs 3:29 and can be heard on Apple Music through the link in the "Listen" section of this page. The recording is ℗ PHŌNÉ Records, released under exclusive license to ONErpm.`,
    },
    tracklist: [{ n: 1, title: "Cuántas Veces (feat. Ecamhi & NuVee)", duration: "3:29" }],
    credits: [
      { role: "Composición y letra", name: "Con.fusión (Catalina Aguilera) y NuVee" },
      { role: "Saxofón", name: "NuVee" },
      { role: "Producción y mezcla", name: "ecamhi" },
      { role: "Master", name: "DJ Pérez" },
      { role: "Video, montaje y color", name: "Bárbara Lafuente" },
      { role: "Foto fija", name: "Andrés Abrigo" },
      { role: "Diseño gráfico", name: "Daniel Torres" },
      { role: "℗", name: "PHŌNÉ Records, bajo licencia exclusiva a ONErpm" },
    ],
    // Orden estándar (Bandcamp · Discogs · Apple Music · Spotify · YouTube). Spotify sin
    // verificar todavía (no hay smartlink y la API pública de song.link ya no responde).
    links: [
      { label: "Apple Music", href: "https://music.apple.com/us/album/cu%C3%A1ntas-veces-feat-ecamhi-nuvee/6810767171" },
      { label: "YouTube", href: "https://www.youtube.com/watch?v=lPXsqrH4SU4" },
    ],
  },
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

/** Recurso de Spotify que la ficha de lanzamiento puede embeber. */
export type SpotifyRef = { kind: "album" | "track" | "playlist"; id: string };

const SPOTIFY_REF_RE =
  /open\.spotify\.com\/(?:intl-[a-z]{2}\/)?(album|track|playlist)\/([A-Za-z0-9]{22})(?![A-Za-z0-9])/;

/**
 * Primer enlace de `links` que apunta a un álbum, una canción o una lista de
 * Spotify (los perfiles /artist/ no cuentan). Vive en lib y no en
 * components/spotify-embed.tsx porque un server component no puede llamar
 * funciones de un módulo "use client".
 */
export function spotifyRefFromLinks(links?: { href: string }[]): SpotifyRef | null {
  for (const l of links ?? []) {
    const m = SPOTIFY_REF_RE.exec(l.href);
    if (m) return { kind: m[1] as SpotifyRef["kind"], id: m[2] };
  }
  return null;
}

/**
 * Etiquetas de `links` escritas en español que cambian en /en. Las demás son nombres de
 * plataforma ("Spotify", "Apple Music", "Qobuz (hi-res)"…) y se muestran igual en ambos idiomas.
 * "Todas las plataformas" nombra el smart link por su destino, no por una acción: "Pre-save" es
 * falso después del estreno y "Escuchar", antes. `pnpm test:releases` exige que cada etiqueta sea
 * una clave de este mapa o un nombre de plataforma conocido.
 */
export const LINK_LABEL_EN: Record<string, string> = {
  "Todas las plataformas": "All platforms",
  "Spotify (artista)": "Spotify (artist)",
};

/** Etiqueta de un enlace de la ficha en el idioma de la página. */
export function releaseLinkLabel(label: string, lang: string): string {
  if (lang === "es") return label;
  return Object.hasOwn(LINK_LABEL_EN, label) ? LINK_LABEL_EN[label] : label;
}

/** Nombre del sello tal como aparece en `label` cuando PHŌNÉ edita el lanzamiento. */
export const PHONE_LABEL = "PHŌNÉ Records";

/** True cuando el lanzamiento lo edita PHŌNÉ (`label === PHONE_LABEL`), no solo lo distribuye. */
export function isPhoneRelease(r: Pick<Release, "label">): boolean {
  return r.label === PHONE_LABEL;
}

/**
 * Sufijo que agrega la plantilla de título de app/layout.tsx (`'%s — PHŌNÉ Records'`).
 * `pnpm test:releases` comprueba que ambos coincidan.
 */
export const TITLE_SUFFIX = " — PHŌNÉ Records";

/** Tope de caracteres del <title> de una ficha de lanzamiento. */
export const MAX_TITLE_LENGTH = 60;

const FEAT_RE = /\s+(?:feat\.|ft\.|featuring)\s.*$/i;

/**
 * Título de la ficha de lanzamiento, de ≤ 60 caracteres con el sufijo del sitio.
 * Con `full = "título — artista"`: si `full` + sufijo cabe, se usa la plantilla
 * (`absolute: false`). Si no, el primero que quepa SIN sufijo (`absolute: true`) entre
 * `full`, "título — artista" sin el " feat. …" del artista, y el título solo. Último
 * recurso: el título cortado a 59 caracteres + "…".
 */
export function releaseTitle(
  r: Pick<Release, "title" | "artistName">,
): { text: string; absolute: boolean } {
  const full = `${r.title} — ${r.artistName}`;
  if (full.length + TITLE_SUFFIX.length <= MAX_TITLE_LENGTH) return { text: full, absolute: false };
  const candidates = [full, `${r.title} — ${r.artistName.replace(FEAT_RE, "")}`, r.title];
  const fit = candidates.find((c) => c.length <= MAX_TITLE_LENGTH);
  if (fit) return { text: fit, absolute: true };
  return { text: `${r.title.slice(0, MAX_TITLE_LENGTH - 1).trimEnd()}…`, absolute: true };
}
