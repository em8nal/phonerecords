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
  /** Storefront URL for "Comprar" button on artist page / catalog. */
  href?: string;
  /** Action label preference if explicitly set. Defaults to "buy" when href is a storefront. */
  hrefKind?: "buy" | "listen";
  /** Cover image URL for the catalog grid. */
  cover?: string;
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
        `Newen Afrobeat es una de las agrupaciones más influyentes de la escena afrobeat latinoamericana contemporánea. Formada en Santiago de Chile, la banda ha construido una propuesta que combina la herencia del afrobeat de Fela Kuti con ritmos latinoamericanos, jazz, funk y sonidos de raíz, desarrollando una identidad propia marcada por la energía en vivo, la exploración musical y un fuerte contenido social y político.

Con más de una década de trayectoria, Newen Afrobeat ha llevado su música a escenarios y festivales de América, Europa y África, consolidándose como una de las principales referencias del afrobeat fuera de Nigeria. La banda ha colaborado con figuras históricas del género como Seun Kuti y Dele Sosimi, además de desarrollar una reconocida serie de reinterpretaciones de clásicos de Fela Kuti que han alcanzado millones de reproducciones en plataformas digitales.

En 2026, la agrupación se encuentra preparando un nuevo álbum de estudio que marcará una nueva etapa sonora para la banda, profundizando la mezcla entre afrobeat, música latinoamericana y elementos contemporáneos de jazz, soul y electrónica. Este nuevo trabajo acompañará una nueva gira internacional por Europa y otros territorios, continuando la expansión global del proyecto.

Próximos lanzamientos: 1 single (segundo semestre 2026), álbum 2026/2027.`,
      en:
        `Newen Afrobeat is one of the most influential bands of the contemporary Latin American afrobeat scene. Formed in Santiago, Chile, the band has built a proposal that combines the legacy of Fela Kuti's afrobeat with Latin American rhythms, jazz, funk and roots sounds, developing a distinctive identity marked by live energy, musical exploration and strong social and political content.

With more than a decade of trajectory, Newen Afrobeat has taken its music to stages and festivals across America, Europe and Africa, consolidating its position as one of the leading afrobeat references outside Nigeria. The band has collaborated with historical figures of the genre such as Seun Kuti and Dele Sosimi, and has developed a recognised series of reinterpretations of Fela Kuti classics that have reached millions of streams on digital platforms.

In 2026 the group is preparing a new studio album that will mark a new sonic stage for the band, deepening the mix of afrobeat, Latin American music and contemporary elements of jazz, soul and electronics. This new work will accompany a new international tour through Europe and other territories, continuing the global expansion of the project.

Upcoming releases: 1 single (second half of 2026), album 2026/2027.`,
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
    stats: { monthlyListeners: 155 },
    bio: {
      es:
        `Claudio Solís es DJ, productor y curador chileno radicado en Santiago. Trabaja entre minimal techno, dark minimal y breakbeat, con énfasis en estructuras rítmicas pausadas y atmósferas extendidas.

Activo desde 2009, ese año fundó el sello Agua y Sed, dedicado a la escena electrónica chilena: 195 lanzamientos y más de 300 artistas pasaron por su catálogo entre 2009 y 2022. En 2023 inició Aquarians, sello hermano enfocado en dark minimal, con artistas de Chile, Rumania, México, Estados Unidos, Australia y Nueva Zelanda. Su propio imprint Vyasa Discos prensa la mayoría de sus vinilos.

Como artista cuenta con más de treinta y ocho lanzamientos en vinilo entre 2017 y 2026, distribuidos en Vyasa Discos, Aquarians, 5 Universos Records, P.U.N.C.H.I.S. Records, Gilesku Records, FAFO Records y Agua y Sed. Series principales: Sons of Medusa, Occvltheque, Doing Without Saying, Pleroma, Kirtan Club, Nothing But The Truth y La Puerta Abre Hacia Adentro. En paralelo publica digitalmente en Inwave, Advisual Records, Cavilar, Paravibe Records, Brosh Records, Robot Ranch, Nihil Sine Musica y Minimum Music Mindset, entre otros.

Además del trabajo solista, hace el mastering del catálogo completo de 5 Universos Records (vinilo y digital). Firma también el diseño gráfico del LP Grietas de Newen Afrobeat (OfficeHome Records, 2024) y del LP Fiesta Groove Humo de Tercer Tipo (Ferona Discos, 2018).

Dentro del ecosistema PHŌNÉ co-firma con Enrique Camhi (Ecamhi) el EP Ebs y el single Mystical Healers I (2023), y con Fco Martinez los singles Noche Oscura Del Alma (2023) y Apagón (2024).

Sus sets privilegian sesiones largas, atmósfera y narrativa. Ha tocado en Club der Visionaere (Berlín), Trotamundo Festival (Ecuador) y mantiene presencia constante en circuitos minimal de Chile y Europa.`,
      en:
        `Claudio Solís is a Chilean DJ, producer and label curator based in Santiago. He works between minimal techno, dark minimal and breakbeat, with a focus on measured rhythmic structures and extended atmospheres.

Active since 2009, that year he founded the label Agua y Sed, dedicated to the Chilean electronic scene: 195 releases and more than 300 artists passed through its catalogue between 2009 and 2022. In 2023 he started Aquarians, a sister label focused on dark minimal, with artists from Chile, Romania, Mexico, the United States, Australia and New Zealand. His own imprint Vyasa Discos presses most of his vinyls.

As an artist his vinyl catalogue counts more than thirty-eight releases between 2017 and 2026, distributed on Vyasa Discos, Aquarians, 5 Universos Records, P.U.N.C.H.I.S. Records, Gilesku Records, FAFO Records and Agua y Sed. Main series: Sons of Medusa, Occvltheque, Doing Without Saying, Pleroma, Kirtan Club, Nothing But The Truth and La Puerta Abre Hacia Adentro. He also releases digitally on Inwave, Advisual Records, Cavilar, Paravibe Records, Brosh Records, Robot Ranch, Nihil Sine Musica and Minimum Music Mindset, among others.

Beyond solo work, he masters the full 5 Universos Records catalogue (vinyl and digital). He also signs the graphic design for Newen Afrobeat's LP Grietas (OfficeHome Records, 2024) and for Tercer Tipo's LP Fiesta Groove Humo (Ferona Discos, 2018).

Within the PHŌNÉ ecosystem he co-signs the EP Ebs and the single Mystical Healers I (2023) with Enrique Camhi (Ecamhi), and the singles Noche Oscura Del Alma (2023) and Apagón (2024) with Fco Martinez.

His sets favour long sessions, atmosphere and narrative. He has played at Club der Visionaere (Berlin), Trotamundo Festival (Ecuador) and maintains a steady presence in minimal circuits in Chile and Europe.`,
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/artist/7Ldq8qyOs4jJ42cN1oD4qN" },
      { label: "SoundCloud", href: "https://soundcloud.com/solisolisolis" },
      { label: "Bandcamp", href: "https://claudiosolis.bandcamp.com" },
      { label: "Instagram", href: "https://www.instagram.com/solisolisolis/" },
    ],
    releases: [
    ],
  },
  {
    slug: "ecamhi",
    name: "Ecamhi",
    genres: ["Instrumental", "Jazz", "Interdisciplinar"],
    origin: "Santiago, Chile",
    bio: {
      es:
        `ecamhi es el proyecto solista de Enrique Camhi, trompetista, productor y compositor chileno con una trayectoria ligada a distintos proyectos relevantes de la escena musical nacional. A lo largo de los años ha trabajado como músico y creativo junto a artistas y bandas como Newen Afrobeat y La Combo Tortuga, desarrollando una identidad artística marcada por la exploración sonora y la mezcla de géneros.

Bajo el nombre ecamhi, presenta una propuesta instrumental y electrónica influenciada por el beatmaking, el jazz, el hip-hop y la música experimental, combinando elementos orgánicos con producción contemporánea. Actualmente se encuentra preparando el lanzamiento de un nuevo disco, un trabajo que expande su universo musical hacia sonidos más personales, atmosféricos y cinematográficos, consolidando una nueva etapa en su carrera como artista independiente.

Próximos lanzamientos: álbum εποχή (2026), EP "en viaje" (2027).`,
      en:
        `ecamhi is the solo project of Enrique Camhi, a Chilean trumpet player, producer and composer with a trajectory tied to various key projects in the national music scene. Over the years he has worked as musician and creative alongside artists and bands such as Newen Afrobeat and La Combo Tortuga, developing an artistic identity marked by sonic exploration and the mixing of genres.

Under the name ecamhi, he presents an instrumental and electronic proposal influenced by beatmaking, jazz, hip-hop and experimental music, combining organic elements with contemporary production. He is currently preparing the release of a new album — a work that expands his musical universe towards more personal, atmospheric and cinematographic sounds, consolidating a new stage in his career as an independent artist.

Upcoming releases: album εποχή (2026), EP "en viaje" (2027).`,
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/artist/6dUvYBGnjpf2emwATOIP4c" },
      { label: "SoundCloud", href: "https://soundcloud.com/enrique-camhi" },
      { label: "Instagram", href: "https://www.instagram.com/ecamhi/" },
    ],
    stats: { monthlyListeners: 3 },
    releases: [
    ],
  },
  {
    slug: "con-fusion",
    name: "Con.fusión",
    genres: ["Hip Hop", "Jazz", "Neo Soul"],
    origin: "Santiago, Chile",
    stats: { monthlyListeners: 8700 },
    bio: {
      es:
        `Con.fusión es el proyecto musical solista de Catalina Aguilera Martínez, una propuesta que transita entre el hip hop, el jazz y el neosoul, incorporando exploraciones vocales que van desde el canto hasta el rap y el scat. Su trayectoria comienza en colaboración con el productor Fat Jota, desarrollando un sonido cercano al lo-fi hip hop, para luego evolucionar hacia la banda Fat Lady, donde profundiza en una fusión entre neosoul y rock a partir de composiciones previas. Ha participado en espacios como Beatminds, encuentro de hip hop dirigido por el beatmaker chileno DJ Dacel, consolidando su presencia en la escena.

En paralelo, ha desarrollado un amplio trabajo colaborativo en la música chilena, participando en grabaciones junto a Matiah Chinaski, Pablo Joaquín (en su disco Tintinea), Búfalo Dit (en Errores irrepetibles, producido por Jenry Cancura) y siendo parte del disco Del dicho al hecho del artista Terrible. Como intérprete versátil, se ha desempeñado además como corista para proyectos como Pau, La Hipocresía Mató al Gato y actualmente en la grabación de coros para la banda Newen Afrobeat.

Actualmente forma parte del show en vivo de Matiah Chinaski, donde aporta una presencia femenina en una escena predominantemente masculina, integrando canto, rap e improvisación vocal. Hoy se encuentra desarrollando su primer disco de larga duración "Tulpa" solista bajo el sello PHŌNÉ Records, consolidando una propuesta artística propia dentro de la música contemporánea chilena.

Próximos lanzamientos: single "Sueños" producido por ecamhi (junio 2026), "Tulpa" producido por Jenry Cancura / Matiah Chinaski (marzo 2027).`,
      en:
        `Con.fusión is the solo musical project of Catalina Aguilera Martínez, a proposal moving between hip hop, jazz and neosoul, incorporating vocal explorations that range from singing to rap and scat. Her trajectory begins in collaboration with producer Fat Jota, developing a sound close to lo-fi hip hop, later evolving towards the band Fat Lady, where she deepens a fusion between neosoul and rock from earlier compositions. She has participated in spaces such as Beatminds, the hip hop gathering led by Chilean beatmaker DJ Dacel, consolidating her presence in the scene.

In parallel, she has developed extensive collaborative work in Chilean music, recording with Matiah Chinaski, Pablo Joaquín (on his album Tintinea), Búfalo Dit (on Errores irrepetibles, produced by Jenry Cancura) and as part of Del dicho al hecho by the artist Terrible. As a versatile performer, she has also worked as backing vocalist for projects such as Pau, La Hipocresía Mató al Gato, and is currently recording choir parts for Newen Afrobeat.

She is currently part of Matiah Chinaski's live show, where she contributes a female presence in a predominantly male scene, integrating song, rap and vocal improvisation. Today she is developing her first full-length solo album "Tulpa" under the PHŌNÉ Records label, consolidating an artistic proposal of her own within contemporary Chilean music.

Upcoming releases: single "Sueños" produced by ecamhi (June 2026), "Tulpa" produced by Jenry Cancura / Matiah Chinaski (March 2027).`,
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/artist/3LnpeMefgyavyTUTFNs5Xd" },
    ],
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
        `Saxofonista, flautista, compositor y productor chileno. Realizó estudios independientes y académicos, tanto doctos como populares. Ha profundizado su desarrollo musical a través de la improvisación y de la experiencia en escenarios. Actualmente forma parte estable en diversos proyectos como Newen Afrobeat, Pascuala Ilabaca y Fauna, el dúo de hip-hop Gestosimple & Klaus B, Valentina Marinkovic, Fran Ri y Camila Bañados.

Su enfoque artístico y su búsqueda personal actual están estrechamente vinculados al nu jazz y a géneros contemporáneos como el funk, el neo soul y el hip-hop, en una exploración constante de un sonido moderno e innovador. Este camino se centra en la calidad interpretativa, la expresividad y la musicalidad, integrando sus influencias dentro de un lenguaje propio.

Ha tocado en diversos escenarios y festivales alrededor del mundo, como en Brasil, Colombia, Ecuador, Estados Unidos, Canadá, Francia, Alemania, Austria, Bélgica, Holanda, Italia, España, Portugal, Inglaterra, Suecia, Suiza, Hungría, República Checa, Polonia, Rusia y Nigeria, haciendo de estas experiencias parte fundamental de su formación y aprendizaje.

Próximos lanzamientos: álbum octubre 2026.`,
      en:
        `Saxophone player, flautist, composer and producer from Chile. He pursued both independent and academic studies, in classical and popular music. He has deepened his musical development through improvisation and live experience. He is currently a stable member of various projects such as Newen Afrobeat, Pascuala Ilabaca y Fauna, the hip-hop duo Gestosimple & Klaus B, Valentina Marinkovic, Fran Ri and Camila Bañados.

His artistic focus and current personal search are closely tied to nu jazz and contemporary genres such as funk, neo soul and hip-hop, in a constant exploration of a modern and innovative sound. The path centres on interpretive quality, expressivity and musicality, integrating his influences into a personal language.

He has played on stages and at festivals around the world — Brazil, Colombia, Ecuador, United States, Canada, France, Germany, Austria, Belgium, Netherlands, Italy, Spain, Portugal, England, Sweden, Switzerland, Hungary, Czech Republic, Poland, Russia and Nigeria — making these experiences a fundamental part of his formation and learning.

Upcoming releases: album October 2026.`,
    },
    links: [
      { label: "Bandcamp", href: "https://klausb.bandcamp.com/music" },
      { label: "Spotify", href: "https://open.spotify.com/artist/53A3Tz7xYVj0n3LlEwSmyw" },
      { label: "Apple Music", href: "https://music.apple.com/us/artist/klaus-b/1571046890" },
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
        `Andrés Abrigo es realizador en cine y televisión, con una trayectoria ligada a la dirección, el montaje, la fotografía y la composición musical. Su trabajo se ha desarrollado entre el cine, las artes escénicas y la creación audiovisual, construyendo una sensibilidad marcada por la exploración atmosférica y narrativa del sonido.

Actualmente inicia su proyecto musical solista, orientado hacia los lenguajes del down tempo y el post dubstep, trabajando en la creación de su primer álbum. Su propuesta se construye a partir de sintetizadores, drum machines y paisajes sonoros que dialogan con la imagen, la textura y la experimentación electrónica, dando forma a composiciones de carácter inmersivo y cinematográfico.

Próximos lanzamientos: álbum marzo 2027.`,
      en:
        `Andrés Abrigo is a film and television director, with a trajectory tied to direction, editing, photography and musical composition. His work has developed across cinema, performing arts and audiovisual creation, building a sensibility marked by atmospheric and narrative sonic exploration.

He is currently beginning his solo musical project, oriented towards the languages of downtempo and post dubstep, working on the creation of his first album. His proposal is built from synthesisers, drum machines and soundscapes that dialogue with image, texture and electronic experimentation, giving shape to immersive, cinematographic compositions.

Upcoming releases: album March 2027.`,
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
