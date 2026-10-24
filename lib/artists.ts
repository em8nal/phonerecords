// Static data for /artistas/[slug] pages.
// Sourced from informacion.md, spotify_manual.yaml, and Bandcamp scraping.
// Refresh stats periodically by re-running scripts/update_artists.py.

// Alias de slugs viejos (?artist= y enlaces guardados). Viven en un módulo puro
// para que los componentes cliente no carguen este archivo completo.
export { LEGACY_ARTIST_SLUGS, resolveArtistSlug } from "./artist-slugs";

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
  /** Otros nombres con que se le conoce o busca (JSON-LD `alternateName`). */
  alternateName?: string[];
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

Lanzamientos 2026 con PHŌNÉ Records: single "La Fuerza" (30 de octubre de 2026); nuevo álbum de estudio 2026/2027.`,
      en:
        `Newen Afrobeat is one of the most influential bands of the contemporary Latin American afrobeat scene. Formed in Santiago, Chile, the band has built a proposal that combines the legacy of Fela Kuti's afrobeat with Latin American rhythms, jazz, funk and roots sounds, developing a distinctive identity marked by live energy, musical exploration and strong social and political content.

With more than a decade of trajectory, Newen Afrobeat has taken its music to stages and festivals across America, Europe and Africa, consolidating its position as one of the leading afrobeat references outside Nigeria. The band has collaborated with historical figures of the genre such as Seun Kuti and Dele Sosimi, and has developed a recognised series of reinterpretations of Fela Kuti classics that have reached millions of streams on digital platforms.

In 2026 the group is preparing a new studio album that will mark a new sonic stage for the band, deepening the mix of afrobeat, Latin American music and contemporary elements of jazz, soul and electronics. This new work will accompany a new international tour through Europe and other territories, continuing the global expansion of the project.

2026 releases with PHŌNÉ Records: single "La Fuerza" (October 30, 2026); new studio album 2026/2027.`,
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/artist/0PTJ848ulShbjTx2yqaAlb" },
      { label: "Apple Music", href: "https://music.apple.com/us/artist/newen-afrobeat/1023313707" },
      { label: "YouTube", href: "https://www.youtube.com/channel/UCTHMwr5NTvQ0MWbq0nbeP-w" },
      { label: "Bandcamp", href: "https://newenafrobeat.bandcamp.com/music" },
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
    slug: "ecamhi",
    name: "ecamhi",
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
      { label: "Apple Music", href: "https://music.apple.com/us/artist/ecamhi/1654191972" },
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
    alternateName: ["Con.fusion"],
    genres: ["Hip Hop", "Jazz", "Neo Soul"],
    origin: "Santiago, Chile",
    stats: { monthlyListeners: 8700 },
    bio: {
      es:
        `Con.fusión es el proyecto musical solista de Catalina Aguilera Martínez, una propuesta que transita entre el hip hop, el jazz y el neosoul, incorporando exploraciones vocales que van desde el canto hasta el rap y el scat. Su trayectoria comienza en colaboración con el productor Fat Jota, desarrollando un sonido cercano al lo-fi hip hop, para luego evolucionar hacia la banda Fat Lady, donde profundiza en una fusión entre neosoul y rock a partir de composiciones previas. Ha participado en espacios como Beatminds, encuentro de hip hop dirigido por el beatmaker chileno DJ Dacel, consolidando su presencia en la escena.

En paralelo, ha desarrollado un amplio trabajo colaborativo en la música chilena, participando en grabaciones junto a Matiah Chinaski, Pablo Joaquín (en su disco Tintinea), Búfalo Dit (en Errores irrepetibles, producido por Jenry Cancura) y siendo parte del disco Del dicho al hecho del artista Terrible. Como intérprete versátil, se ha desempeñado además como corista para proyectos como Pau, La Hipocresía Mató al Gato y actualmente en la grabación de coros para la banda Newen Afrobeat.

Actualmente forma parte del show en vivo de Matiah Chinaski, donde aporta una presencia femenina en una escena predominantemente masculina, integrando canto, rap e improvisación vocal. Hoy se encuentra desarrollando su primer disco de larga duración "Tulpa" solista bajo el sello PHŌNÉ Records, consolidando una propuesta artística propia dentro de la música contemporánea chilena.

Último lanzamiento: "Cuántas veces" (octubre 2026), single que abre el catálogo 2026 del sello. Próximo: "Tulpa", su primer álbum solista, producido por Matiah Chinaski (2027).`,
      en:
        `Con.fusión is the solo musical project of Catalina Aguilera Martínez, a proposal moving between hip hop, jazz and neosoul, incorporating vocal explorations that range from singing to rap and scat. Her trajectory begins in collaboration with producer Fat Jota, developing a sound close to lo-fi hip hop, later evolving towards the band Fat Lady, where she deepens a fusion between neosoul and rock from earlier compositions. She has participated in spaces such as Beatminds, the hip hop gathering led by Chilean beatmaker DJ Dacel, consolidating her presence in the scene.

In parallel, she has developed extensive collaborative work in Chilean music, recording with Matiah Chinaski, Pablo Joaquín (on his album Tintinea), Búfalo Dit (on Errores irrepetibles, produced by Jenry Cancura) and as part of Del dicho al hecho by the artist Terrible. As a versatile performer, she has also worked as backing vocalist for projects such as Pau, La Hipocresía Mató al Gato, and is currently recording choir parts for Newen Afrobeat.

She is currently part of Matiah Chinaski's live show, where she contributes a female presence in a predominantly male scene, integrating song, rap and vocal improvisation. Today she is developing her first full-length solo album "Tulpa" under the PHŌNÉ Records label, consolidating an artistic proposal of her own within contemporary Chilean music.

Latest release: "Cuántas veces" (October 2026), the single that opens the label's 2026 catalogue. Next: "Tulpa", her first solo album, produced by Matiah Chinaski (2027).`,
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/artist/3LnpeMefgyavyTUTFNs5Xd" },
      { label: "Apple Music", href: "https://music.apple.com/us/artist/con-fusi%C3%B3n/1518275936" },
      { label: "YouTube", href: "https://www.youtube.com/channel/UCJP4nihg8wJcMjSNYrWkxxw" },
      { label: "Instagram", href: "https://www.instagram.com/aguasudaca/" },
    ],
    releases: [
      { year: "in production", title: "Tulpa", format: "Álbum", notes: "Tracks: Acertijo · En vez de quejarte tanto · Pisando caca a propósito" },
    ],
  },
  {
    slug: "klaus-b",
    name: "Klaus B",
    alternateName: ["Klaus Brantmayer"],
    genres: ["Nu-jazz", "Hip-hop jazz", "Rap jazz", "Neo-soul"],
    origin: "Santiago, Chile",
    bio: {
      es:
        `Saxofonista, flautista, compositor y productor chileno. Realizó estudios independientes y académicos, tanto doctos como populares. Ha profundizado su desarrollo musical a través de la improvisación y de la experiencia en escenarios. Actualmente forma parte estable en diversos proyectos como Newen Afrobeat, Pascuala Ilabaca y Fauna, el dúo de hip-hop Gestosimple & Klaus B, Valentina Marinkovic, Fran Ri y Camila Bañados.

Su enfoque artístico y su búsqueda personal actual están estrechamente vinculados al nu jazz y a géneros contemporáneos como el funk, el neo soul y el hip-hop, en una exploración constante de un sonido moderno e innovador. Este camino se centra en la calidad interpretativa, la expresividad y la musicalidad, integrando sus influencias dentro de un lenguaje propio.

Ha tocado en diversos escenarios y festivales alrededor del mundo, como en Brasil, Colombia, Ecuador, Estados Unidos, Canadá, Francia, Alemania, Austria, Bélgica, Holanda, Italia, España, Portugal, Inglaterra, Suecia, Suiza, Hungría, República Checa, Polonia, Rusia y Nigeria, haciendo de estas experiencias parte fundamental de su formación y aprendizaje.

Ciclo de lanzamientos 2026 con PHŌNÉ Records: "Destellos de ti" (22 de octubre de 2026), "Un Rezo" (5 de noviembre de 2026) y el álbum "Una Cuota De Caos" (20 de noviembre de 2026).`,
      en:
        `Saxophone player, flautist, composer and producer from Chile. He pursued both independent and academic studies, in classical and popular music. He has deepened his musical development through improvisation and live experience. He is currently a stable member of various projects such as Newen Afrobeat, Pascuala Ilabaca y Fauna, the hip-hop duo Gestosimple & Klaus B, Valentina Marinkovic, Fran Ri and Camila Bañados.

His artistic focus and current personal search are closely tied to nu jazz and contemporary genres such as funk, neo soul and hip-hop, in a constant exploration of a modern and innovative sound. The path centres on interpretive quality, expressivity and musicality, integrating his influences into a personal language.

He has played on stages and at festivals around the world — Brazil, Colombia, Ecuador, United States, Canada, France, Germany, Austria, Belgium, Netherlands, Italy, Spain, Portugal, England, Sweden, Switzerland, Hungary, Czech Republic, Poland, Russia and Nigeria — making these experiences a fundamental part of his formation and learning.

2026 release cycle with PHŌNÉ Records: "Destellos de ti" (October 22, 2026), "Un Rezo" (November 5, 2026) and the album "Una Cuota De Caos" (November 20, 2026).`,
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/artist/53A3Tz7xYVj0n3LlEwSmyw" },
      { label: "Apple Music", href: "https://music.apple.com/us/artist/klaus-b/1571046890" },
      { label: "YouTube", href: "https://www.youtube.com/channel/UCN-g9sETAcl84PdpXWUTXOg" },
      { label: "Bandcamp", href: "https://klausb.bandcamp.com/music" },
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
    slug: "rosario-lircay",
    name: "Rosario Lircay",
    genres: ["R&B", "Pop alternativo", "Hip hop", "Soul"],
    origin: "Ñuble · Santiago, Chile",
    bio: {
      es:
        `Rosario Lircay es el nombre artístico de Rosario Meléndez, cantante chilena nacida en la Región de Ñuble y radicada en Santiago. Con formación en canto jazz y música popular y en producción musical, construyó su oficio en los escenarios como corista: hoy es voz estable en la banda de Alex Anwandter y ha acompañado a Brain Damage, Celeste Shaw, Con.fusión, Pau y LHMG, entre otros, en escenarios como Lollapalooza Chile, el Teatro Caupolicán, el Movistar Arena y el Teatro Gran Rex de Buenos Aires.

Antes de firmar con su propio nombre pasó por bandas de jazz, rock progresivo y soul latino (Proyecto Sin Raza, Personalidad Múltiple, Franck Palace, Fractos), fue vocalista del grupo electro pop Mareo!, con el que giró por Japón, y de Narcisa. Desde "Nina" (2020) publica como Rosario Lircay sus propias canciones y colaboraciones, entre ellas "Infinito" con Ziervo y Con.fusión y "No necesito más" con Low Criss.

Su primer álbum, "La Piel", reúne diez canciones cortas nacidas de beats y luego tocadas por músicos: bajo, sintetizadores, guitarras, la batería de Pablo Trangol y una voz cantada-hablada que se mueve entre el r&b, el hip hop y el pop alternativo. Producido por Fresco Fresco (Pablo Acuña y Nacho Barrientos), grabado en La Salitrera y Fresco Fresco y masterizado por Chalo G, cuenta con participaciones de Con.fusión, Balta Neira y la flauta de Emaflu, y letras que recorren la depresión, la frustración, el enojo, la esperanza y el juego. Lo adelantan los singles "ya me tienes" (abril de 2026), "a ti" (junio de 2026) y "En Vela" (23 de octubre de 2026), su primer lanzamiento con PHŌNÉ Records.`,
      en:
        `Rosario Lircay is the stage name of Rosario Meléndez, a Chilean singer born in the Ñuble region and based in Santiago. Trained in jazz and popular singing and in music production, she built her craft on stage as a backing vocalist: today she is a permanent voice in Alex Anwandter's band and has sung with Brain Damage, Celeste Shaw, Con.fusión, Pau and LHMG, among others, at Lollapalooza Chile, Teatro Caupolicán, Movistar Arena and Teatro Gran Rex in Buenos Aires.

Before signing under her own name she passed through jazz, progressive rock and Latin soul bands (Proyecto Sin Raza, Personalidad Múltiple, Franck Palace, Fractos), fronted the electro-pop group Mareo!, with whom she toured Japan, and sang in Narcisa. Since "Nina" (2020) she has released her own songs and collaborations as Rosario Lircay, including "Infinito" with Ziervo and Con.fusión and "No necesito más" with Low Criss.

Her debut album, "La Piel", gathers ten short songs born from beats and then played by musicians: bass, synthesizers, guitars, Pablo Trangol's drums and a half-sung, half-spoken voice that moves between R&B, hip hop and alternative pop. Produced by Fresco Fresco (Pablo Acuña and Nacho Barrientos), recorded at La Salitrera and Fresco Fresco and mastered by Chalo G, it features Con.fusión, Balta Neira and Emaflu's flute, with lyrics that run through depression, frustration, anger, hope and play. It is previewed by the singles "ya me tienes" (April 2026), "a ti" (June 2026) and "En Vela" (October 23, 2026), her first release with PHŌNÉ Records.`,
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/artist/7Fx3PtKk7xitpPfDsSCw9S" },
      { label: "Apple Music", href: "https://music.apple.com/us/artist/rosario-lircay/1530697143" },
      { label: "YouTube", href: "https://www.youtube.com/@rosariolircay" },
      { label: "Instagram", href: "https://www.instagram.com/rosariolircay/" },
      { label: "TikTok", href: "https://www.tiktok.com/@rosariolircay" },
    ],
    releases: [
      { year: "in production", title: "La Piel", format: "Álbum debut · 10 tracks", notes: "Producido por Fresco Fresco (Pablo Acuña y Nacho Barrientos) · master Chalo G" },
      { year: "2026-06", title: "a ti", format: "Single · digital", label: "seda.wav", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/18/8c/c1/188cc1b3-279c-abff-6810-5054fb6627d0/artwork.jpg/600x600bb.jpg", href: "https://music.apple.com/us/album/a-ti-single/6780959605", hrefKind: "listen" },
      { year: "2026-04", title: "ya me tienes", format: "Single · digital", label: "seda.wav", notes: "Producción: Fresco Fresco · batería Pablo Trangol (La Salitrera) · master Chalo G", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/37/d9/2d/37d92df1-40f3-1a96-72c2-9f26a0212133/artwork.jpg/600x600bb.jpg", href: "https://music.apple.com/us/album/ya-me-tienes-single/1885689900", hrefKind: "listen" },
      { year: "2020-10", title: "Nina", format: "Single · digital", label: "Fat Jota", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/c2/b4/ba/c2b4ba5c-a2f7-6655-c76c-46e3bc19512f/0.jpg/600x600bb.jpg", href: "https://music.apple.com/us/album/nina-single/1530783846", hrefKind: "listen" },
    ],
  },
];

export const artistSlugs = artists.map((a) => a.slug);

export function getArtist(slug: string): Artist | undefined {
  return artists.find((a) => a.slug === slug);
}
