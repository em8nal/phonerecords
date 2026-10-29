// Catálogo de videos del roster para /videos, /videos/[slug] y la sección
// "Videos" de cada ficha de artista. Módulo puro (sin React ni next): lo
// cargan server components, el sitemap y `pnpm test:videos` con Node
// (type-stripping: sin enum, con `import type`).
//
// Fuente de cada entrada: metadatos de yt-dlp (título oficial, upload_date,
// duración) + descripción oficial del video + fichas de lib/releases.ts y bios
// de lib/artists.ts. Los textos `description` son propios (no la descripción
// de YouTube) y solo afirman lo que consta en esas fuentes: pieza, tema, disco,
// participantes, lugar y fecha. `date` es la fecha de publicación en YouTube;
// las grabaciones anteriores se aclaran en el texto. Un video con fecha futura
// no aparece hasta las 00:00 America/Santiago de ese día (isReleased).

import type { Language } from "./translations";
import { formatReleaseLabel, isReleased } from "./release-date";
import { TITLE_MAX, templatedTitle, titleLength } from "./seo";

export type VideoKind =
  | "videoclip"
  | "sesion"
  | "en-vivo"
  | "lyric"
  | "visualizer"
  | "documental"
  | "entrevista";

export type VideoCredit = { role: string; name: string };

export type Video = {
  slug: string;
  /** Id de YouTube (11 caracteres). */
  youtubeId: string;
  /** Título oficial del video, tal como está en YouTube. */
  title: string;
  /**
   * Título limpio para tarjetas, h1, alt y facade (16a). Sin el artista de la entrada,
   * sin etiquetas ("Video Oficial", "Visualizer", "Prod by"…) ni mayúsculas sostenidas;
   * nombres como en `description`. Objeto solo si cambia por idioma ("con"/"with").
   * El oficial (`title`) sigue en el `name` del VideoObject y en el <title> si cabe.
   */
  displayTitle?: string | { es: string; en: string };
  /** Debe existir en lib/artists.ts. Dúo Gestosimple & Klaus B → "klaus-b". */
  artistSlug: string;
  artistName: string;
  kind: VideoKind;
  /** "YYYY-MM-DD" (fecha de publicación en YouTube); "YYYY-MM" solo tolerado. */
  date: string;
  /**
   * Año de grabación cuando consta en el título o la descripción oficial y
   * difiere del de publicación (p. ej. "Live in Paris, 2015" subido en 2025).
   * Lo usan los pies "tipo · año" de tarjetas y sección; `date` sigue siendo
   * la fecha de publicación (uploadDate).
   */
  recordedYear?: number;
  durationSec?: number;
  /** Slug de lib/releases.ts cuando el video corresponde a una ficha del catálogo. */
  releaseSlug?: string;
  /** Texto propio ES/EN, 80–160 palabras, párrafos separados por "\n\n". */
  description: { es: string; en: string };
  /** Solo créditos que constan en la descripción oficial o en la ficha. */
  credits?: VideoCredit[];
  /** Va primero en la sección de la ficha de artista (máx. 6 por artista). */
  featured?: boolean;
  /**
   * Mejor miniatura disponible en i.ytimg.com cuando NO existe `maxresdefault`
   * (subidas antiguas o de baja resolución; verificado con `curl -I`). La usan
   * OG, JSON-LD y el preload de la ficha; las facades caen a hq solas en cliente.
   */
  thumb?: "hqdefault";
};

/** Orden de los chips de tipo en /videos. */
export const VIDEO_KINDS: readonly VideoKind[] = [
  "videoclip",
  "sesion",
  "en-vivo",
  "lyric",
  "visualizer",
  "documental",
  "entrevista",
];

export const VIDEO_KIND_LABEL: Record<Language, Record<VideoKind, string>> = {
  es: {
    videoclip: "Videoclip",
    sesion: "Sesión",
    "en-vivo": "En vivo",
    lyric: "Lyric video",
    visualizer: "Visualizer",
    documental: "Documental",
    entrevista: "Entrevista",
  },
  en: {
    videoclip: "Music video",
    sesion: "Session",
    "en-vivo": "Live",
    lyric: "Lyric video",
    visualizer: "Visualizer",
    documental: "Documentary",
    entrevista: "Interview",
  },
};

const RAW: Video[] = [
  // ─────────── Newen Afrobeat ───────────
  {
    slug: "newen-afrobeat-live-in-liverpool",
    youtubeId: "yyKGWQ7RwKk",
    title: "Newen Afrobeat - Live In Liverpool (Live Session)",
    displayTitle: "Live In Liverpool",
    artistSlug: "newen-afrobeat",
    artistName: "Newen Afrobeat",
    kind: "en-vivo",
    date: "2025-04-03",
    durationSec: 1462,
    recordedYear: 2024,
    releaseSlug: "newen-afrobeat-liverpool-session",
    featured: true,
    description: {
      es: `Sesión en vivo de Newen Afrobeat grabada en cinta en Liverpool, Reino Unido, durante la gira de 2024, en Quarry (sala y estudio) y registrada por The Lightning Cave. Son 24 minutos con cuatro piezas seguidas: "Es La Vida" y "Grietas", del álbum Grietas (2024), y dos clásicos de Fela Kuti, "Ako" y "No Agreement". El audio de esta sesión es el EP Liverpool Session, publicado en abril de 2025.

Tocan Fran Ri y Erin Rutledge en voces, Sebastián Crooker en guitarra, Benjamín Astroza en bajo, Alejandro "El Galita" Orellana y Tomás Pavez en percusiones, Roberto "Tito" Gevert en batería, Klaus Brantmayer en saxo alto, Vicente Aravena en saxo tenor y Enrique Camhi y Sergio Quijada en trompetas. Thomas Benson y Jack Wait firman la grabación y la mezcla; Caitlin Mongan y Jack Cowls, el registro de video.

Con cuatro piezas seguidas y sin cortes, es una buena puerta de entrada a su sonido actual: repertorio propio y repertorio de Fela en un mismo set.`,
      en: `Live session by Newen Afrobeat, tape-recorded in Liverpool, UK, during the 2024 tour at Quarry (venue and studio) and captured by The Lightning Cave. Twenty-four minutes with four pieces back to back: "Es La Vida" and "Grietas", from the album Grietas (2024), and two Fela Kuti classics, "Ako" and "No Agreement". The audio of this session is the EP Liverpool Session, released in April 2025.

The line-up is Fran Ri and Erin Rutledge on vocals, Sebastián Crooker on guitar, Benjamín Astroza on bass, Alejandro "El Galita" Orellana and Tomás Pavez on percussion, Roberto "Tito" Gevert on drums, Klaus Brantmayer on alto sax, Vicente Aravena on tenor sax and Enrique Camhi and Sergio Quijada on trumpets. Thomas Benson and Jack Wait recorded and mixed it; Caitlin Mongan and Jack Cowls shot the video.

With four pieces back to back and no cuts, it is a good way into the band's current sound: their own repertoire and Fela's in one set.`,
    },
    credits: [
      { role: "Grabación y mezcla", name: "Thomas Benson, Jack Wait (The Lightning Cave)" },
      { role: "Video", name: "Caitlin Mongan, Jack Cowls" },
      { role: "Edición de video", name: "Caitlin Mongan" },
      { role: "Producción ejecutiva", name: "Tino Canessa" },
    ],
  },
  {
    slug: "newen-afrobeat-upside-down-tony-allen-paris-2015",
    youtubeId: "N6ifkm3SxLI",
    title: "Newen Afrobeat feat Tony Allen - Upside Down / Live in Paris, 2015",
    displayTitle: "Upside Down (feat. Tony Allen)",
    artistSlug: "newen-afrobeat",
    artistName: "Newen Afrobeat",
    kind: "en-vivo",
    date: "2025-10-17",
    durationSec: 777,
    recordedYear: 2015,
    releaseSlug: "newen-afrobeat-newen-plays-fela",
    description: {
      es: `Registro en vivo de Newen Afrobeat con Tony Allen, baterista y cofundador del afrobeat junto a Fela Kuti, interpretando "Upside Down" en FGO Barbara, París, en octubre de 2015. La banda lo publicó en su canal diez años después, en octubre de 2025, como un documento recuperado de su archivo.

Según cuenta la propia banda, aquel concierto junto a Les Frères Smith fue parte de su primera visita a Nigeria y su primer paso por Europa, y allí conocieron a Oghene Kologbo y a Tony Allen, a quien invitaron a tocar esta pieza, la única del repertorio de Fela cantada por una mujer. El video lo registraron Javiera Naranjo, Juan Esteban Morales, Matías Veras y Camila Fuentes, con edición de Javiera Naranjo y sonido de Álvaro "Viruta" Villalobos.

"Upside Down" abre además el EP Newen Plays Fela (2017), grabado en Lagos con Seun Kuti y músicos de Egypt 80.`,
      en: `Live recording of Newen Afrobeat with Tony Allen, drummer and co-founder of afrobeat alongside Fela Kuti, performing "Upside Down" at FGO Barbara, Paris, in October 2015. The band published it on its channel ten years later, in October 2025, as a document recovered from its archive.

As the band tells it, that concert with Les Frères Smith was part of their first visit to Nigeria and their first trip to Europe, where they met Oghene Kologbo and Tony Allen, whom they invited to play this piece, the only one in Fela's repertoire sung by a woman. The video was shot by Javiera Naranjo, Juan Esteban Morales, Matías Veras and Camila Fuentes, edited by Javiera Naranjo, with sound by Álvaro "Viruta" Villalobos.

"Upside Down" also opens the EP Newen Plays Fela (2017), recorded in Lagos with Seun Kuti and members of Egypt 80.`,
    },
    credits: [
      { role: "Registro de video", name: "Javiera Naranjo, Juan Esteban Morales, Matías Veras, Camila Fuentes" },
      { role: "Edición", name: "Javiera Naranjo" },
      { role: "Registro de sonido y mezcla", name: "Álvaro \"Viruta\" Villalobos" },
      { role: "Producción ejecutiva", name: "Lichens Family · Tino Canessa" },
    ],
  },
  {
    slug: "newen-afrobeat-voraz-kaliningrad-city-jazz",
    youtubeId: "6qu-6HQWGF4",
    title: "Voraz - Newen Afrobeat  |  Live At Kaliningrad City Jazz",
    displayTitle: "Voraz · Kaliningrad City Jazz",
    artistSlug: "newen-afrobeat",
    artistName: "Newen Afrobeat",
    kind: "en-vivo",
    date: "2024-12-20",
    durationSec: 458,
    releaseSlug: "newen-afrobeat-curiche",
    description: {
      es: `Versión en vivo de "Voraz", registrada en el festival Kaliningrad City Jazz en 2024 y publicada en el canal de la banda en diciembre de ese año. La canción pertenece a Curiche (2019), el segundo álbum de Newen Afrobeat, donde ocupa el tercer lugar del tracklist.

La formación es la misma de la gira europea de 2024: Fran Ri y Erin Rutledge en voces, Sebastián Crooker en guitarra, Benjamín Astroza en bajo, Alejandro Orellana y Tomás Pavez en percusiones, Roberto "Tito" Gevert en batería, Klaus Brantmayer en saxo alto, Vicente Aravena en saxo tenor y Enrique Camhi y Sergio Quijada en trompetas, con Francisco Infante en el sonido en vivo.

Junto a Live In Liverpool, es uno de los registros de esa gira publicados por la banda y sirve para escuchar cómo suena hoy, en escenario, un tema del disco de 2019.`,
      en: `Live version of "Voraz", recorded at the Kaliningrad City Jazz festival in 2024 and published on the band's channel in December that year. The song belongs to Curiche (2019), Newen Afrobeat's second album, where it sits third in the tracklist.

The line-up is the one from the 2024 European tour: Fran Ri and Erin Rutledge on vocals, Sebastián Crooker on guitar, Benjamín Astroza on bass, Alejandro Orellana and Tomás Pavez on percussion, Roberto "Tito" Gevert on drums, Klaus Brantmayer on alto sax, Vicente Aravena on tenor sax and Enrique Camhi and Sergio Quijada on trumpets, with Francisco Infante on live sound.

Together with Live In Liverpool, it is one of the recordings from that tour published by the band, and a way to hear how a track from the 2019 album sounds on stage today.`,
    },
    credits: [{ role: "Sonido en vivo", name: "Francisco Infante" }],
  },
  {
    slug: "newen-afrobeat-grietas-lyric-video",
    youtubeId: "WMspQ2-zy8M",
    title: "\"Grietas\" Lyric Video (Oficial) / Newen Afrobeat & Lido Pimienta",
    displayTitle: { es: "Grietas (con Lido Pimienta)", en: "Grietas (with Lido Pimienta)" },
    artistSlug: "newen-afrobeat",
    artistName: "Newen Afrobeat",
    kind: "lyric",
    date: "2023-11-23",
    durationSec: 313,
    releaseSlug: "newen-afrobeat-grietas",
    featured: true,
    description: {
      es: `Lyric video oficial de "Grietas", la canción de Newen Afrobeat con la artista colombo-canadiense Lido Pimienta que da nombre al álbum Grietas (2024, OfficeHome Records) y lo abre. La animación digital es de Juan Sáez; el tema fue grabado en Santuario Sónico, mezclado por Francisco Infante y masterizado por Carlos Barros, y se publicó en noviembre de 2023, casi un año antes que el disco.

La letra, de Fran Ri, es un inventario de la crisis climática leído desde América Latina: glaciares que se derriten, grietas continentales, incendios, el corredor seco de Guatemala, y una pregunta que el coro repite, "¿sostener la vida o la muerte?". El formato de lyric video pone ese texto al frente, que es lo que la canción pide.

En la ficha del álbum están los créditos completos y el resto del tracklist.`,
      en: `Official lyric video for "Grietas", the Newen Afrobeat song with Colombian-Canadian artist Lido Pimienta that gives the album Grietas (2024, OfficeHome Records) its name and opens it. The digital animation is by Juan Sáez; the track was recorded at Santuario Sónico, mixed by Francisco Infante and mastered by Carlos Barros, and came out in November 2023, almost a year before the record.

The lyrics, by Fran Ri, are an inventory of the climate crisis read from Latin America: melting glaciers, continental cracks, wildfires, Guatemala's dry corridor, and a question the chorus repeats, "sustain life or death?". The lyric video format puts that text up front, which is what the song asks for.

The album page has the full credits and the rest of the tracklist.`,
    },
    credits: [
      { role: "Animación digital", name: "Juan Sáez" },
      { role: "Mezcla", name: "Francisco Infante" },
      { role: "Master", name: "Carlos Barros" },
    ],
  },
  {
    slug: "newen-afrobeat-somos-el-presente",
    youtubeId: "q4aNa3rpnO4",
    title: "SOMOS EL PRESENTE (Video Oficial) Newen Afrobeat ft. Joe Vasconcellos",
    displayTitle: "Somos el Presente (feat. Joe Vasconcellos)",
    artistSlug: "newen-afrobeat",
    artistName: "Newen Afrobeat",
    kind: "videoclip",
    date: "2023-06-23",
    durationSec: 330,
    releaseSlug: "newen-afrobeat-grietas",
    featured: true,
    description: {
      es: `Videoclip oficial de "Somos el Presente", la canción de Newen Afrobeat con Joe Vasconcellos incluida en el álbum Grietas (2024), compuesta por Alejandro Orellana. Se publicó en junio de 2023 como uno de los adelantos del disco.

Lo dirigió Javier Moreno, con producción de Florece Producciones y Fran Ri, fotografía de Kevin Rodríguez, dirección de arte de Constanza Moreno, dirección de movimiento de María Pinchulef y edición, postproducción y color de Matías Cerón; se filmó en el estudio Jama Bros. La letra habla de ser "el presente de la historia" frente a la brutalidad, la adicción al poder, el patriarcado y las guerras, y pregunta si todo eso parará.

Junto al lyric video de "Grietas", es uno de los videos del álbum.`,
      en: `Official music video for "Somos el Presente", the Newen Afrobeat song with Joe Vasconcellos included on the album Grietas (2024) and composed by Alejandro Orellana. It was published in June 2023 as one of the record's advance singles.

Javier Moreno directed it, with production by Florece Producciones and Fran Ri, cinematography by Kevin Rodríguez, art direction by Constanza Moreno, movement direction by María Pinchulef and editing, post-production and colour by Matías Cerón; it was shot at the Jama Bros studio. The lyrics speak of being "the present of history" in the face of brutality, addiction to power, patriarchy and wars, and ask whether all of it will stop.

Alongside the "Grietas" lyric video, it is one of the album's videos.`,
    },
    credits: [
      { role: "Dirección general", name: "Javier Moreno" },
      { role: "Producción", name: "Florece Producciones, Fran Ri" },
      { role: "Dirección de fotografía", name: "Kevin Rodríguez" },
      { role: "Dirección de arte", name: "Constanza Moreno" },
      { role: "Dirección de movimiento", name: "María Pinchulef" },
      { role: "Edición, post y color", name: "Matías Cerón" },
    ],
  },
  {
    slug: "newen-afrobeat-zombie-seun-kuti",
    youtubeId: "YCZZWu9WR5s",
    title: "Newen Afrobeat & Seun Kuti - Zombie (Fela Kuti)",
    displayTitle: { es: "Zombie (con Seun Kuti)", en: "Zombie (with Seun Kuti)" },
    artistSlug: "newen-afrobeat",
    artistName: "Newen Afrobeat",
    kind: "sesion",
    date: "2021-10-15",
    durationSec: 700,
    recordedYear: 2019,
    description: {
      es: `Sesión en vivo de Newen Afrobeat con Seun Kuti interpretando "Zombie", la canción que Fela Kuti publicó en 1977 sobre la brutalidad de la policía contra su propio pueblo. Se grabó en una sola toma en Estudios La Makinita, Santiago, en abril de 2019, en los días posteriores a Lollapalooza Chile, y la banda la publicó en octubre de 2021.

El encuentro venía de antes: en 2018 Newen había vuelto a Nigeria para participar por segunda vez en Felabration, en Lagos, junto a la familia Kuti. Seun Kuti canta y toca saxo alto; Fran Ri comparte la voz principal, con coros de Francisca Castro y Macarena Rozic y una sección de bronces de tres trompetas y tres saxos. Grabó Cristian "Pini" Zamora, montó Camilo Carrasco y mezcló y masterizó Jorge "Pluto" Abarca; produjo Tino Canessa (Lichens Family).

La banda lee la canción como una premonición de lo que pasaría en Chile en octubre de 2019.`,
      en: `Live session by Newen Afrobeat with Seun Kuti performing "Zombie", the song Fela Kuti released in 1977 about police brutality against his own people. It was recorded in a single take at Estudios La Makinita, Santiago, in April 2019, in the days after Lollapalooza Chile, and the band published it in October 2021.

The meeting had a history: in 2018 Newen had returned to Nigeria to take part in Felabration in Lagos for the second time, alongside the Kuti family. Seun Kuti sings and plays alto sax; Fran Ri shares lead vocals, with backing vocals by Francisca Castro and Macarena Rozic and a horn section of three trumpets and three saxophones. Cristian "Pini" Zamora recorded it, Camilo Carrasco edited it and Jorge "Pluto" Abarca mixed and mastered it; Tino Canessa (Lichens Family) produced.

The band reads the song as a premonition of what would happen in Chile in October 2019.`,
    },
    credits: [
      { role: "Grabación", name: "Cristian \"Pini\" Zamora" },
      { role: "Estudio", name: "Estudios La Makinita" },
      { role: "Montaje audiovisual", name: "Camilo Carrasco" },
      { role: "Cámaras", name: "Camilo Carrasco, Jennifer Maçan, Claudio \"Karita\" Parra" },
      { role: "Mezcla y master", name: "Jorge \"Pluto\" Abarca" },
      { role: "Producción", name: "Tino Canessa (Lichens Family)" },
    ],
  },
  {
    slug: "newen-afrobeat-no-les-creere",
    youtubeId: "Xq8IgOcJ2qQ",
    thumb: "hqdefault", // sin maxresdefault (curl -I, 21-10-2026)
    title: "Newen Afrobeat - No les creeré (Video Oficial)",
    displayTitle: "No les creeré",
    artistSlug: "newen-afrobeat",
    artistName: "Newen Afrobeat",
    kind: "videoclip",
    date: "2020-04-10",
    durationSec: 290,
    description: {
      es: `Videoclip oficial de "No les creeré", publicado por Newen Afrobeat en abril de 2020 y construido con imágenes del estallido social chileno de octubre de 2019. Alejandro "Negro" Espinoza dirigió y montó la pieza a partir de material propio, de varios colaboradores con cámara y de una recopilación de videos virales de Instagram y YouTube; la postproducción es de Matías Cerón.

El texto que acompaña al video explica su motivo: las protestas contra un sistema que, según la banda, ha abusado de la mayoría, y la represión que dejó mutilaciones, torturas y muertes sin responsables. El tema se grabó en estudios CHT y lo mezcló y masterizó Juan Pablo Quezada (Prabha) en Santuario Sónico.

Es una de las piezas más directamente políticas del canal de la banda y no pertenece a ninguno de los discos del catálogo: funciona como registro de ese momento.`,
      en: `Official music video for "No les creeré", published by Newen Afrobeat in April 2020 and built from footage of the Chilean social uprising of October 2019. Alejandro "Negro" Espinoza directed and edited it from his own material, contributions from several people with cameras and a compilation of viral videos from Instagram and YouTube; post-production is by Matías Cerón.

The text accompanying the video explains its motive: the protests against a system that, in the band's words, has abused the majority, and the repression that left mutilations, torture and deaths without anyone held responsible. The track was recorded at CHT studios and mixed and mastered by Juan Pablo Quezada (Prabha) at Santuario Sónico.

It is one of the most directly political pieces on the band's channel and does not belong to any of the albums in the catalogue: it works as a record of that moment.`,
    },
    credits: [
      { role: "Dirección y montaje", name: "Alejandro \"Negro\" Espinoza" },
      { role: "Postproducción", name: "Matías Cerón" },
      { role: "Mezcla y master", name: "Juan Pablo Quezada (Prabha) · Santuario Sónico" },
    ],
  },
  {
    slug: "newen-afrobeat-cantaros",
    youtubeId: "vStU79dfil4",
    title: "Newen Afrobeat - Cántaros (Video Oficial)",
    displayTitle: "Cántaros",
    artistSlug: "newen-afrobeat",
    artistName: "Newen Afrobeat",
    kind: "videoclip",
    date: "2019-04-20",
    durationSec: 433,
    releaseSlug: "newen-afrobeat-curiche",
    description: {
      es: `Videoclip oficial de "Cántaros", cuarto tema de Curiche (2019), con letra de Francisca Riquelme y música de Alejandro Orellana. Se filmó en la región de Atacama, en la provincia de Copiapó y en el Parque Nacional Nevado Tres Cruces, y se publicó en abril de 2019, semanas antes del álbum.

La banda explica el lugar: el río Copiapó se seca por derechos de agua concentrados en la agricultura y la minería, y el video pregunta para quién y para qué se "reserva" el agua. La dirección es de la propia banda, con idea creativa de Francisca Riquelme, Francisca Castro, Macarena Rozic y Klaus Brantmayer, realización de Alejandro "Negro" Espinoza y Marcela Toledo, fotografía de Carlos Astudillo, dirección de arte de Francisca Castro y Camila Fuentes y María Pinchulef como intérprete y directora de movimiento.

Es el video de Curiche más ligado al territorio: la canción y el lugar hablan de lo mismo.`,
      en: `Official music video for "Cántaros", the fourth track on Curiche (2019), with lyrics by Francisca Riquelme and music by Alejandro Orellana. It was shot in the Atacama region, in the province of Copiapó and in Nevado Tres Cruces National Park, and published in April 2019, weeks before the album.

The band explains the place: the Copiapó river is drying up because water rights are concentrated in agriculture and mining, and the video asks for whom and for what water is "reserved". The band itself directed, with the creative idea by Francisca Riquelme, Francisca Castro, Macarena Rozic and Klaus Brantmayer, realisation by Alejandro "Negro" Espinoza and Marcela Toledo, cinematography by Carlos Astudillo, art direction by Francisca Castro and Camila Fuentes, and María Pinchulef as performer and movement director.

It is the Curiche video most tied to territory: the song and the place speak of the same thing.`,
    },
    credits: [
      { role: "Dirección", name: "Newen Afrobeat" },
      { role: "Realización", name: "Alejandro \"Negro\" Espinoza, Marcela Toledo" },
      { role: "Dirección de fotografía", name: "Carlos Astudillo" },
      { role: "Dirección de arte", name: "Francisca Castro, Camila Fuentes" },
      { role: "Intérprete · dirección de movimiento", name: "María Pinchulef" },
      { role: "Postproducción de color", name: "Thomas Woodroffe" },
      { role: "Producción ejecutiva", name: "Tino Canessa" },
    ],
  },
  {
    slug: "newen-afrobeat-open-your-eyes",
    youtubeId: "VwtjivFAjpU",
    title: "Newen Afrobeat Ft. Kologbo - Open Your Eyes (Video Oficial)",
    displayTitle: "Open Your Eyes (feat. Kologbo)",
    artistSlug: "newen-afrobeat",
    artistName: "Newen Afrobeat",
    kind: "videoclip",
    date: "2019-01-26",
    durationSec: 512,
    releaseSlug: "newen-afrobeat-curiche",
    description: {
      es: `Videoclip oficial de "Open Your Eyes", canción compuesta por Oghene Kologbo, guitarrista original de Fela Kuti, y registrada junto a Newen Afrobeat durante su visita a Chile en 2017. Es el quinto tema de Curiche (2019) y se publicó en enero de ese año como primer adelanto del disco.

Según la banda, el video retrata sus experiencias en Lagos, Nigeria, entre 2015 y 2018, y el contraste con Santiago de Chile. Lo dirigió Juane Morales, con cámara de Danilo Campos, motion graphics de Tomás Pavez e imágenes de Nigeria de Francisca Castro, Juane Morales, Matías Veras y Javiera Naranjo. El tema se grabó en estudios CHT y Santuario Sónico, lo produjo Martín Concha y lo mezcló y masterizó Juan Pablo Quezada (Prabha).

Es el video más visto del canal de la banda después del álbum debut completo, y el que mejor resume el vínculo de Newen con Lagos.`,
      en: `Official music video for "Open Your Eyes", a song composed by Oghene Kologbo, Fela Kuti's original guitarist, and recorded with Newen Afrobeat during his visit to Chile in 2017. It is the fifth track on Curiche (2019) and was published in January that year as the album's first single.

According to the band, the video portrays their experiences in Lagos, Nigeria, between 2015 and 2018, and the contrast with Santiago de Chile. Juane Morales directed it, with camera by Danilo Campos, motion graphics by Tomás Pavez and footage from Nigeria by Francisca Castro, Juane Morales, Matías Veras and Javiera Naranjo. The track was recorded at CHT and Santuario Sónico studios, produced by Martín Concha and mixed and mastered by Juan Pablo Quezada (Prabha).

It is the most-watched video on the band's channel after the full debut album, and the one that best sums up Newen's bond with Lagos.`,
    },
    credits: [
      { role: "Dirección", name: "Juane Morales" },
      { role: "Cámara", name: "Danilo Campos" },
      { role: "Motion graphics", name: "Tomás Pavez" },
      { role: "Imágenes Nigeria", name: "Francisca Castro, Juane Morales, Matías Veras, Javiera Naranjo" },
      { role: "Montaje", name: "Juane Morales, Sebastián Crooker, Alejandro Orellana" },
    ],
  },
  {
    slug: "newen-afrobeat-chaltumay",
    youtubeId: "AuMApxUYohk",
    title: "Newen Afrobeat - Chaltumay (Video Oficial)",
    displayTitle: "Chaltumay",
    artistSlug: "newen-afrobeat",
    artistName: "Newen Afrobeat",
    kind: "videoclip",
    date: "2018-11-23",
    durationSec: 386,
    releaseSlug: "newen-afrobeat-curiche",
    description: {
      es: `Videoclip oficial de "Chaltumay", sexto tema de Curiche (2019), publicado en noviembre de 2018 como el primer video de ese ciclo. Se realizó en la desembocadura del río Biobío, que la banda describe como la histórica línea de fuego entre el pueblo mapuche y el Estado de Chile.

El texto que acompaña al video sitúa la pieza en 2018, con desalojos de comunidades y asesinatos de líderes mapuche, y la lee como una pregunta por la aniquilación de esa cultura y de la idea de comunidad que trae consigo. La producción general es de Tomás Pavez; la dirección de arte y producción, de Macarena Rozic y Francisca Castro; la dirección y cámara, de Alejandro "Negro" Espinoza; el montaje, de Matías Cerón, Marcela Toledo y Espinoza, y la corrección de color, de Daniela Toscano.

Con "Cántaros" y "Open Your Eyes" forma la trilogía de videos de Curiche.`,
      en: `Official music video for "Chaltumay", the sixth track on Curiche (2019), published in November 2018 as the first video of that cycle. It was made at the mouth of the Biobío river, which the band describes as the historic front line between the Mapuche people and the Chilean state.

The text accompanying the video places the piece in 2018, with evictions of communities and killings of Mapuche leaders, and reads it as a question about the annihilation of that culture and of the idea of community it carries. General production is by Tomás Pavez; art direction and production by Macarena Rozic and Francisca Castro; direction and camera by Alejandro "Negro" Espinoza; editing by Matías Cerón, Marcela Toledo and Espinoza, and colour grading by Daniela Toscano.

With "Cántaros" and "Open Your Eyes" it forms the trilogy of Curiche videos.`,
    },
    credits: [
      { role: "Producción general", name: "Tomás Pavez" },
      { role: "Dirección de arte y producción", name: "Macarena Rozic, Francisca Castro" },
      { role: "Dirección y cámara", name: "Alejandro \"Negro\" Espinoza" },
      { role: "Montaje", name: "Matías Cerón, Marcela Toledo, Alejandro \"Negro\" Espinoza" },
      { role: "Corrección de color", name: "Daniela Toscano" },
    ],
  },

  // ─────────── Klaus B (y el dúo Gestosimple & Klaus B) ───────────
  {
    slug: "klaus-b-destellos-de-ti",
    youtubeId: "zEfVXTYtuo8",
    title: "Klaus B - Destellos De Ti [Videoclip Oficial]",
    displayTitle: "Destellos de ti",
    artistSlug: "klaus-b",
    artistName: "Klaus B",
    kind: "videoclip",
    date: "2026-10-23",
    durationSec: 281,
    releaseSlug: "klaus-b-destellos-de-ti",
    featured: true,
    description: {
      es: `Videoclip oficial de "Destellos de ti", el single con el que Klaus B abre el ciclo de "Una Cuota De Caos" (20 de noviembre de 2026), su álbum con PHŌNÉ Records. Se publicó en el canal del artista el 23 de octubre de 2026, un día después de que la canción llegara a plataformas.

La dirección, el montaje y la cámara son de Matías Burgos; la producción del video es del propio Klaus B, y participa la bailarina Catalina Herrera. En la canción tocan Klaus B en saxo alto, Pablo James en trombón, Felamusic en teclados, José Toledo en guitarra eléctrica, Francisco Ruiz en bajo y Benjamín Plaza en batería. Se grabó con Martín Schlotfeldt en Estudio Vinilo, la mezcla es de Ticho en Modo Estudios y el master, de Francisco Holzmann.

La descripción oficial presenta la canción como imágenes, sensaciones e intuiciones envueltas en una nostalgia luminosa: la memoria como aquello que nos define y el presente como lo que ilumina el camino. El segundo adelanto del ciclo es "Un Rezo" (5 de noviembre de 2026).`,
      en: `Official music video for "Destellos de ti", the single with which Klaus B opens the cycle of "Una Cuota De Caos" (November 20, 2026), his album with PHŌNÉ Records. It was published on the artist's channel on October 23, 2026, one day after the song reached streaming platforms.

Direction, editing and camera are by Matías Burgos; the video was produced by Klaus B himself, and dancer Catalina Herrera takes part. On the song, Klaus B plays alto saxophone, with Pablo James on trombone, Felamusic on keys, José Toledo on electric guitar, Francisco Ruiz on bass and Benjamín Plaza on drums. It was recorded with Martín Schlotfeldt at Estudio Vinilo, mixed by Ticho at Modo Estudios and mastered by Francisco Holzmann.

The official description presents the song as images, sensations and intuitions wrapped in a luminous nostalgia: memory as what defines us, and the present as what lights the way. The second single of the cycle is "Un Rezo" (November 5, 2026).`,
    },
    credits: [
      { role: "Dirección, montaje y cámara", name: "Matías Burgos" },
      { role: "Producción del video", name: "Klaus B" },
      { role: "Bailarina", name: "Catalina Herrera" },
      { role: "Grabación (Estudio Vinilo)", name: "Martín Schlotfeldt" },
      { role: "Mezcla (Modo Estudios)", name: "Ticho" },
      { role: "Master", name: "Francisco Holzmann" },
    ],
  },
  {
    slug: "klaus-b-those-days-far-away-lyric-visualizer",
    youtubeId: "6Geg_XVD_Uc",
    title: "Klaus B - Those Days Far Away feat. Mr.Li, Seven Star, Racecar (Lyric Visualizer)",
    displayTitle: "Those Days Far Away",
    artistSlug: "klaus-b",
    artistName: "Klaus B",
    kind: "lyric",
    date: "2025-11-13",
    durationSec: 301,
    releaseSlug: "klaus-b-those-days-far-away",
    description: {
      es: `Lyric visualizer de "Those Days Far Away", el single de Klaus B con Mr.Li, Seven Star y Racecar, publicado en su canal el 13 de noviembre de 2025, dos días después de la salida del tema. Es una pieza con la letra en pantalla, pensada para acompañar la escucha más que como videoclip.

La canción está coproducida con Lister Rossel (Mr.Li, Londres) y tiene como voces invitadas a los MC Seven Star (Orlando) y Racecar (París): tres ciudades sobre una base hecha en Santiago, con flauta y vocoder de Klaus B, piano de Felamusic, guitarra de José Toledo, trombón de Pablo James y clarinete bajo de Diego Toro. Días después apareció también como sexto tema de Memorias: Mixtape.

Dentro del catálogo de Klaus B marca el giro hacia el hip hop colaborativo entre continentes que sigue al mixtape, y es el segundo de sus dos visualizers de 2025, tras "El Secreto".`,
      en: `Lyric visualizer for "Those Days Far Away", the Klaus B single with Mr.Li, Seven Star and Racecar, published on his channel on November 13, 2025, two days after the track came out. It is a piece with the lyrics on screen, made to accompany listening rather than as a music video.

The song is co-produced with Lister Rossel (Mr.Li, London) and features MCs Seven Star (Orlando) and Racecar (Paris) as guest voices: three cities over a base made in Santiago, with Klaus B's flute and vocoder, Felamusic on piano, José Toledo on guitar, Pablo James on trombone and Diego Toro on bass clarinet. Days later it also appeared as the sixth track on Memorias: Mixtape.

Within Klaus B's catalogue it marks the turn towards cross-continental collaborative hip hop that follows the mixtape, and it is the second of his two 2025 visualizers, after "El Secreto".`,
    },
  },
  {
    slug: "klaus-b-el-secreto-visualizer",
    youtubeId: "6rkl5zVTii8",
    title: "Klaus B - El Secreto (Visualizer)",
    displayTitle: "El Secreto",
    artistSlug: "klaus-b",
    artistName: "Klaus B",
    kind: "visualizer",
    date: "2025-10-30",
    durationSec: 167,
    releaseSlug: "klaus-b-el-secreto",
    description: {
      es: `Visualizer de "El Secreto", single instrumental de Klaus B publicado el 30 de octubre de 2025, el mismo día en que el tema llegó a las plataformas. Dura 2:47, lo mismo que la canción: es un acompañamiento visual para escuchar el single completo, no un videoclip con relato.

"El Secreto" salió semanas antes de Memorias: Mixtape, donde ocupa el cuarto lugar, y la ficha del single lo describe como una antesala de ese disco: flauta funk, vocoder y beat orgánico condensados en un solo tema. Klaus B compone, produce y graba su propia música, y en este período alterna singles con el trabajo en el dúo Gestosimple & Klaus B.

Es el primero de los dos visualizers que el artista publicó en 2025; el segundo fue el lyric visualizer de "Those Days Far Away", dos semanas después.`,
      en: `Visualizer for "El Secreto", an instrumental single by Klaus B published on October 30, 2025, the same day the track reached streaming platforms. It runs 2:47, the length of the song: a visual accompaniment for listening to the full single, not a music video with a storyline.

"El Secreto" came out weeks before Memorias: Mixtape, where it sits fourth, and the single's page describes it as an antechamber to that record: funk flute, vocoder and an organic beat condensed into one track. Klaus B composes, produces and records his own music, and in this period he alternates singles with the work of the duo Gestosimple & Klaus B.

It is the first of the two visualizers the artist published in 2025; the second was the lyric visualizer for "Those Days Far Away", two weeks later.`,
    },
  },
  {
    slug: "gestosimple-klaus-b-requiem-estudios-del-maipo",
    youtubeId: "2OL4vyx-3iQ",
    title: "Gestosimple & Klaus B - Requiem (J Dilla) / Estudios del Maipo: Live Session",
    displayTitle: { es: "Requiem (con Gestosimple)", en: "Requiem (with Gestosimple)" },
    artistSlug: "klaus-b",
    artistName: "Klaus B",
    kind: "sesion",
    date: "2025-12-01",
    durationSec: 356,
    releaseSlug: "klaus-b-estudios-del-maipo",
    description: {
      es: `Sesión en vivo del dúo Gestosimple & Klaus B interpretando "Requiem", grabada en Estudios del Maipo, en el Cajón del Maipo, en 2025, y publicada en diciembre de ese año. Es el tercer y último tema del EP Estudios Del Maipo: Live Session, un disco que abre con una intro titulada "Thank You Jay Dee"; el título del video nombra a J Dilla, el productor al que remite la pieza.

Tocan Gestosimple en rap, Klaus B en flauta, DJ Dacel en scratch, ecamhi en trompeta, Felamusic en piano, José Toledo en guitarra eléctrica, Pancho Ruiz en bajo y Tito Gevert en batería. Grabó Nicolás Romero en Estudios del Maipo, mezcló y masterizó Juan Faúndez en Modo Estudios, y la cámara y edición son de Matías Burgos para Meidum Magazine.

Junto a "Desde La Emisora", registrada en la misma sesión, es la cara visible de uno de los pocos discos en vivo del catálogo de Klaus B.`,
      en: `Live session by the duo Gestosimple & Klaus B performing "Requiem", recorded at Estudios del Maipo, in Cajón del Maipo, in 2025 and published in December that year. It is the third and final track on the EP Estudios Del Maipo: Live Session, a record that opens with an intro titled "Thank You Jay Dee"; the video title names J Dilla, the producer the piece refers to.

The players are Gestosimple on rap, Klaus B on flute, DJ Dacel on scratch, ecamhi on trumpet, Felamusic on piano, José Toledo on electric guitar, Pancho Ruiz on bass and Tito Gevert on drums. Nicolás Romero recorded it at Estudios del Maipo, Juan Faúndez mixed and mastered it at Modo Estudios, and camera and editing are by Matías Burgos for Meidum Magazine.

Together with "Desde La Emisora", captured in the same session, it is the visible side of one of the few live records in Klaus B's catalogue.`,
    },
    credits: [
      { role: "Grabación", name: "Nicolás Romero · Estudios del Maipo" },
      { role: "Mezcla y master", name: "Juan Faúndez · Modo Estudios" },
      { role: "Cámara y edición", name: "Matías Burgos / Meidum Magazine" },
      { role: "Producción musical", name: "Klaus B" },
      { role: "Producción ejecutiva", name: "Gestosimple, Klaus B, Valentina Marinkovic" },
    ],
  },
  {
    slug: "gestosimple-klaus-b-desde-la-emisora-estudios-del-maipo",
    youtubeId: "0D-YOGVmCVc",
    title: "Gestosimple & Klaus B - Desde La Emisora / Estudios del Maipo: Live Session",
    displayTitle: { es: "Desde La Emisora (con Gestosimple)", en: "Desde La Emisora (with Gestosimple)" },
    artistSlug: "klaus-b",
    artistName: "Klaus B",
    kind: "sesion",
    date: "2025-08-14",
    durationSec: 561,
    releaseSlug: "klaus-b-estudios-del-maipo",
    featured: true,
    description: {
      es: `Sesión en vivo de Gestosimple & Klaus B interpretando "Desde La Emisora", grabada en Estudios del Maipo, en el Cajón del Maipo, en 2025, y publicada en agosto de ese año como adelanto del EP Estudios Del Maipo: Live Session. La canción cerraba el álbum Viaje Sin Tiempo (2024); aquí se extiende a más de nueve minutos con banda completa.

Gestosimple rapea; Klaus B toca saxo alto y firma la composición y la producción musical; ecamhi, flugelhorn; Felamusic, piano; José Toledo, guitarra eléctrica; DJ Dacel, scratch; Pancho Ruiz, bajo; Tito Gevert, batería. Nicolás Romero grabó en Estudios del Maipo, Juan Faúndez mezcló y masterizó en Modo Estudios y Matías Burgos (Meidum Magazine) hizo cámara y edición. La producción ejecutiva es de Gestosimple, Klaus B y Valentina Marinkovic.

Es el video más visto del canal del dúo y reúne a dos artistas del roster PHŌNÉ, Klaus B y ecamhi, en un mismo escenario.`,
      en: `Live session by Gestosimple & Klaus B performing "Desde La Emisora", recorded at Estudios del Maipo, in Cajón del Maipo, in 2025 and published in August that year as a preview of the EP Estudios Del Maipo: Live Session. The song closed the album Viaje Sin Tiempo (2024); here it stretches past nine minutes with a full band.

Gestosimple raps; Klaus B plays alto sax and is credited with composition and musical production; ecamhi plays flugelhorn; Felamusic, piano; José Toledo, electric guitar; DJ Dacel, scratch; Pancho Ruiz, bass; Tito Gevert, drums. Nicolás Romero recorded at Estudios del Maipo, Juan Faúndez mixed and mastered at Modo Estudios and Matías Burgos (Meidum Magazine) handled camera and editing. Executive production is by Gestosimple, Klaus B and Valentina Marinkovic.

It is the most-watched video on the duo's channel and brings together two PHŌNÉ roster artists, Klaus B and ecamhi, on the same stage.`,
    },
    credits: [
      { role: "Composición y producción musical", name: "Klaus B" },
      { role: "Grabación", name: "Nicolás Romero · Estudios del Maipo" },
      { role: "Mezcla y master", name: "Juan Faúndez · Modo Estudios" },
      { role: "Cámara y edición", name: "Matías Burgos / Meidum Magazine" },
      { role: "Producción ejecutiva", name: "Gestosimple, Klaus B, Valentina Marinkovic" },
    ],
  },
  {
    slug: "gestosimple-klaus-b-el-rayo-mas-calido",
    youtubeId: "m1Gw-BL7vcs",
    title: "Gestosimple & Klaus B - EL RAYO MÁS CÁLIDO feat Celeste Shaw, Cidtronyck, Felamusic, Ecamhi",
    displayTitle: { es: "El Rayo Más Cálido (con Gestosimple)", en: "El Rayo Más Cálido (with Gestosimple)" },
    artistSlug: "klaus-b",
    artistName: "Klaus B",
    kind: "videoclip",
    date: "2023-09-23",
    durationSec: 346,
    releaseSlug: "klaus-b-viaje-sin-tiempo",
    description: {
      es: `Videoclip de "El Rayo Más Cálido", canción del dúo Gestosimple & Klaus B con Celeste Shaw, Cidtronyck, Felamusic y ecamhi, publicado en septiembre de 2023 como segundo video del ciclo del álbum Viaje Sin Tiempo (2024), donde es el undécimo tema.

En la música, Gestosimple rapea, Klaus B toca flauta y saxo y produce, Celeste Shaw canta, Cidtronyck hace scratch, Felamusic toca teclados, ecamhi aporta trompeta, sintetizadores y arreglos, José Ignacio Toledo la guitarra y Martín Feres el bajo; mezcla Sebastián Pangal y master Chalo G. El video lo dirigió LemusFuria, con fotografía de RazativaRoots, edición y color de Darío Lemus, producción de LaduraFilms y el bailarín Ali Seimos.

La letra busca "el rayo más cálido" recorriendo "el desierto florido o árido", y el tema es la colaboración más amplia del disco: cinco invitados, dos de ellos del entorno PHŌNÉ.`,
      en: `Music video for "El Rayo Más Cálido", a song by the duo Gestosimple & Klaus B with Celeste Shaw, Cidtronyck, Felamusic and ecamhi, published in September 2023 as the second video of the cycle around the album Viaje Sin Tiempo (2024), where it is the eleventh track.

Musically, Gestosimple raps, Klaus B plays flute and sax and produces, Celeste Shaw sings, Cidtronyck scratches, Felamusic plays keys, ecamhi contributes trumpet, synths and arrangements, José Ignacio Toledo the guitar and Martín Feres the bass; Sebastián Pangal mixed and Chalo G mastered. LemusFuria directed the video, with cinematography by RazativaRoots, editing and colour by Darío Lemus, production by LaduraFilms and dancer Ali Seimos.

The lyrics look for "the warmest ray" crossing "the desert in bloom or barren", and the track is the album's broadest collaboration: five guests, two of them from the PHŌNÉ circle.`,
    },
    credits: [
      { role: "Dirección", name: "LemusFuria" },
      { role: "Dirección de fotografía", name: "RazativaRoots" },
      { role: "Edición y color", name: "Darío Lemus" },
      { role: "Productora", name: "LaduraFilms" },
      { role: "Bailarín", name: "Ali Seimos" },
    ],
  },
  {
    slug: "gestosimple-klaus-b-viaje-sin-tiempo",
    youtubeId: "pNQM33Qz4Fo",
    title: "Gestosimple & Klaus B - VIAJE SIN TIEMPO feat Fran Ri, DJ Dacel, Felamusic",
    displayTitle: { es: "Viaje Sin Tiempo (con Gestosimple)", en: "Viaje Sin Tiempo (with Gestosimple)" },
    artistSlug: "klaus-b",
    artistName: "Klaus B",
    kind: "videoclip",
    date: "2023-04-28",
    durationSec: 231,
    releaseSlug: "klaus-b-viaje-sin-tiempo",
    featured: true,
    description: {
      es: `Videoclip de "Viaje Sin Tiempo", la canción que da título al primer álbum largo del dúo Gestosimple & Klaus B, publicado en abril de 2023, más de un año antes que el disco (junio de 2024), donde es el segundo tema. Participan Fran Ri en la voz, DJ Dacel en scratch y Felamusic en teclados, con guitarra de Juan Núñez; Gestosimple rapea y Klaus B toca flauta y produce. Mezcla de Sebastián Pangal y master de Chalo G.

El video es de LemusFuria en la dirección, RazativaRoots en fotografía, Camila Fuentes en dirección de arte, Darío Lemus en edición y color y LaduraFilms en producción. La letra habla de sentir "la libertad, aire de primavera, las luces de la ciudad" y de ser "el autor de tu propio cuento".

Es la presentación en video del proyecto Gestosimple & Klaus B y el primero de sus dos videoclips con el mismo equipo audiovisual.`,
      en: `Music video for "Viaje Sin Tiempo", the title track of the first full-length album by the duo Gestosimple & Klaus B, published in April 2023, more than a year before the record (June 2024), where it is the second track. Fran Ri sings, DJ Dacel scratches and Felamusic plays keys, with guitar by Juan Núñez; Gestosimple raps and Klaus B plays flute and produces. Mixed by Sebastián Pangal and mastered by Chalo G.

The video has LemusFuria directing, RazativaRoots on cinematography, Camila Fuentes on art direction, Darío Lemus on editing and colour and LaduraFilms producing. The lyrics speak of feeling "freedom, spring air, the city lights" and of being "the author of your own story".

It is the video introduction to the Gestosimple & Klaus B project and the first of their two music videos with the same audiovisual team.`,
    },
    credits: [
      { role: "Dirección", name: "LemusFuria" },
      { role: "Dirección de fotografía", name: "RazativaRoots" },
      { role: "Dirección de arte", name: "Camila Fuentes" },
      { role: "Edición y color", name: "Darío Lemus" },
      { role: "Productora", name: "LaduraFilms" },
    ],
  },
  {
    slug: "klaus-b-quisiera-entender",
    youtubeId: "1vIGdzmOELU",
    thumb: "hqdefault", // sin maxresdefault (curl -I, 21-10-2026)
    title: "Klaus B feat Fran Ri & Newen Afrobeat - Quisiera Entender",
    displayTitle: "Quisiera Entender (feat. Fran Ri & Newen Afrobeat)",
    artistSlug: "klaus-b",
    artistName: "Klaus B",
    kind: "videoclip",
    date: "2023-05-26",
    durationSec: 269,
    releaseSlug: "klaus-b-quisiera-entender",
    featured: true,
    description: {
      es: `Videoclip de "Quisiera Entender", el single de Klaus B con Fran Ri y Newen Afrobeat, publicado en mayo de 2023, semanas antes de que el tema saliera en plataformas (julio de 2023). Según el propio artista, la canción se produjo en Santiago entre 2022 y 2023, después de un par de giras a Lagos, Nigeria, con Newen Afrobeat.

Matías Burgos dirigió, filmó y montó el video, y el registro en Nigeria es de Francisca Castro y Juane Morales. En la música, Klaus B toca vocoder y saxo alto y produce; Fran Ri canta; la sección de bronces completa de Newen participa, con Enrique Camhi, Diego González y Maururu Sánchez en trompetas, Marcelo Morales en saxo tenor y Aldo Gómez en barítono, más Martín Concha y Sebastián Crooker en guitarras, Álvaro Quintas en bajo, Alejandro Orellana en congas, Tomás Pavez en percusión y Tito Gevert en batería. Mezcla de Sebastián Pangal y master de Chalo G.

Es el cruce más directo entre el proyecto solista de Klaus B y la banda de la que forma parte.`,
      en: `Music video for "Quisiera Entender", the Klaus B single with Fran Ri and Newen Afrobeat, published in May 2023, weeks before the track reached streaming platforms (July 2023). According to the artist, the song was produced in Santiago between 2022 and 2023, after a couple of tours to Lagos, Nigeria, with Newen Afrobeat.

Matías Burgos directed, shot and edited the video, and the footage from Nigeria is by Francisca Castro and Juane Morales. Musically, Klaus B plays vocoder and alto sax and produces; Fran Ri sings; Newen's full horn section takes part, with Enrique Camhi, Diego González and Maururu Sánchez on trumpets, Marcelo Morales on tenor sax and Aldo Gómez on baritone, plus Martín Concha and Sebastián Crooker on guitars, Álvaro Quintas on bass, Alejandro Orellana on congas, Tomás Pavez on percussion and Tito Gevert on drums. Mixed by Sebastián Pangal and mastered by Chalo G.

It is the most direct crossing between Klaus B's solo project and the band he belongs to.`,
    },
    credits: [
      { role: "Dirección, cámara y montaje", name: "Matías Burgos" },
      { role: "Registro Nigeria", name: "Francisca Castro, Juane Morales" },
      { role: "Mezcla", name: "Sebastián Pangal" },
      { role: "Master", name: "Chalo G" },
    ],
  },

  // ─────────── Con.fusión ───────────
  {
    slug: "con-fusion-cuantas-veces",
    youtubeId: "lPXsqrH4SU4",
    title: "Cuántas veces - Con.fusion ft NuVee (Prod by ecamhi)",
    displayTitle: "Cuántas veces (feat. NuVee)",
    artistSlug: "con-fusion",
    artistName: "Con.fusión",
    kind: "videoclip",
    date: "2026-09-28",
    durationSec: 211,
    releaseSlug: "con-fusion-cuantas-veces",
    featured: true,
    description: {
      es: `Videoclip oficial de "Cuántas veces", el single de Con.fusión con el saxofón de NuVee y producción de ecamhi, estrenado en YouTube el 28 de septiembre de 2026, tres días antes de que la canción saliera en plataformas. Es el primer lanzamiento del catálogo 2026 de PHŌNÉ Records.

El video es de Bárbara Lafuente, que también firma el montaje y el color; la foto fija es de Andrés Abrigo y el diseño gráfico, de Daniel Torres. La canción la compusieron Con.fusión y NuVee; ecamhi la produjo y mezcló y DJ Pérez la masterizó. Según la ficha del single, la letra habla de lo que ocurre dentro de un sueño, con realidades paralelas que se repiten.

Es el primer video de Con.fusión como artista del sello y el inicio del camino hacia "Tulpa", su primer álbum solista, que prepara junto a Matiah Chinaski.`,
      en: `Official music video for "Cuántas veces", the Con.fusión single with NuVee's saxophone and production by ecamhi, premiered on YouTube on September 28, 2026, three days before the song reached streaming platforms. It is the first release in PHŌNÉ Records' 2026 catalogue.

The video is by Bárbara Lafuente, who also did the editing and colour; still photography is by Andrés Abrigo and graphic design by Daniel Torres. The song was written by Con.fusión and NuVee; ecamhi produced and mixed it and DJ Pérez mastered it. According to the single's page, the lyrics are about what happens inside a dream, with parallel realities that repeat.

It is Con.fusión's first video as a label artist and the start of the road to "Tulpa", her first solo album, which she is preparing with Matiah Chinaski.`,
    },
    credits: [
      { role: "Video, montaje y color", name: "Bárbara Lafuente" },
      { role: "Foto fija", name: "Andrés Abrigo" },
      { role: "Diseño gráfico", name: "Daniel Torres" },
      { role: "Producción y mezcla", name: "ecamhi" },
      { role: "Master", name: "DJ Pérez" },
    ],
  },
  {
    slug: "con-fusion-la-banca-oido-alterno",
    youtubeId: "QZ4IAyPVfP0",
    title: "CON.FUSIÓN FT DJ PÉREZ - LA BANCA / CUARTA TEMPORADA",
    displayTitle: "La Banca (feat. DJ Pérez)",
    artistSlug: "con-fusion",
    artistName: "Con.fusión",
    kind: "sesion",
    date: "2026-09-12",
    durationSec: 591,
    featured: true,
    description: {
      es: `Sesión de Con.fusión con DJ Pérez para La Banca, el ciclo de sesiones en vivo de Oído Alterno, publicada el 12 de septiembre de 2026 como capítulo 29 y parte de la cuarta temporada. Son casi diez minutos de voz y tornamesa, con la participación de Matiah Chinaski y Búfalo Dit, dos artistas con los que Catalina Aguilera ya había grabado.

El video vive en el canal de Oído Alterno, no en el de la artista, y se produjo como proyecto colaborativo financiado por Galpón Alterno. DJ Pérez es el mismo que masterizó "Cuántas veces", y Con.fusión integra hoy el show en vivo de Matiah Chinaski, así que la sesión reúne a su círculo de trabajo habitual.

Es el registro en vivo más reciente de Con.fusión y la pieza que mejor muestra su lado de rap e improvisación vocal, distinto del tono atmosférico del single.`,
      en: `Session by Con.fusión with DJ Pérez for La Banca, the live-session series by Oído Alterno, published on September 12, 2026 as chapter 29 and part of the fourth season. Almost ten minutes of voice and turntable, with guest appearances by Matiah Chinaski and Búfalo Dit, two artists Catalina Aguilera had already recorded with.

The video lives on Oído Alterno's channel, not the artist's, and was produced as a collaborative project funded by Galpón Alterno. DJ Pérez is the same person who mastered "Cuántas veces", and Con.fusión is currently part of Matiah Chinaski's live show, so the session gathers her usual working circle.

It is Con.fusión's most recent live recording and the piece that best shows her rap and vocal-improvisation side, distinct from the atmospheric tone of the single.`,
    },
    credits: [
      { role: "Canal", name: "Oído Alterno" },
      { role: "Participan", name: "Matiah Chinaski, Búfalo Dit" },
      { role: "Financiamiento", name: "Galpón Alterno" },
    ],
  },
  {
    slug: "con-fusion-zul-marino",
    youtubeId: "1iuDkdB9caM",
    title: "ZUL MARINO - CON.FUSIÓN & FAT JOTA (VIDEOCLIP OFICIAL)",
    displayTitle: { es: "Zul Marino (con Fat Jota)", en: "Zul Marino (with Fat Jota)" },
    artistSlug: "con-fusion",
    artistName: "Con.fusión",
    kind: "videoclip",
    date: "2026-06-29",
    durationSec: 183,
    recordedYear: 2022,
    description: {
      es: `Videoclip oficial de "Zul Marino", canción de Con.fusión con el productor Fat Jota. Según la descripción del video, se filmó en Europa en 2022 y lo dirigió Bárbara Lafuente, la misma realizadora de "Cuántas veces". Se publicó en el canal de la artista el 29 de junio de 2026, el día en que subió de golpe buena parte de su archivo audiovisual, por lo que la fecha de publicación es posterior a la del rodaje.

La canción, titulada "Zulmarino" en plataformas, salió como single en 2024. Fat Jota es el productor con el que empezó la trayectoria de Con.fusión, en un sonido cercano al lo-fi hip hop, antes de la banda Fat Lady y de sus colaboraciones posteriores.

Junto a la sesión de Tiny Plants, es uno de los registros de la dupla con Fat Jota publicados en el canal de la artista.`,
      en: `Official music video for "Zul Marino", a song by Con.fusión with producer Fat Jota. According to the video's description, it was shot in Europe in 2022 and directed by Bárbara Lafuente, the same filmmaker behind "Cuántas veces". It was published on the artist's channel on June 29, 2026, the day she uploaded a large part of her audiovisual archive at once, so the publication date is later than the shoot.

The song, listed as "Zulmarino" on streaming platforms, came out as a single in 2024. Fat Jota is the producer with whom Con.fusión's path began, in a sound close to lo-fi hip hop, before the band Fat Lady and her later collaborations.

Together with the Tiny Plants session, it is one of the recordings of the duo with Fat Jota published on the artist's channel.`,
    },
    credits: [{ role: "Dirección", name: "Bárbara Lafuente" }],
  },
  {
    slug: "con-fusion-tiny-plants",
    youtubeId: "NmguTXmKM2o",
    thumb: "hqdefault", // sin maxresdefault (curl -I, 21-10-2026)
    title: "TINY PLANTS CON.FUSION & FAT JOTA",
    displayTitle: { es: "Tiny Plants (con Fat Jota)", en: "Tiny Plants (with Fat Jota)" },
    artistSlug: "con-fusion",
    artistName: "Con.fusión",
    kind: "sesion",
    date: "2026-06-29",
    durationSec: 1008,
    description: {
      es: `Sesión en vivo de Con.fusión y Fat Jota para Tiny Plants Concerts, según indica el título del video. Dura casi 17 minutos y se publicó en el canal de la artista el 29 de junio de 2026, el día en que subió buena parte de su archivo. El video no trae descripción, créditos ni fecha de grabación, así que no se puede fijar cuándo se tocó ni describir su realización.

Muestra a la dupla Con.fusión y Fat Jota tocando en vivo con el repertorio de su etapa de lo-fi hip hop. Junto con "Zul Marino", filmado en Europa en 2022, es parte de lo publicado de esa colaboración en el canal.

Para quien llega desde "Cuántas veces", es la mejor forma de escuchar de dónde viene la voz del proyecto.`,
      en: `Live session by Con.fusión and Fat Jota for Tiny Plants Concerts, as the video's title states. It runs almost 17 minutes and was published on the artist's channel on June 29, 2026, the day she uploaded a large part of her archive. The video carries no description, credits or recording date, so when it was played cannot be established, nor can its production be described.

It shows the Con.fusión and Fat Jota duo playing live with the repertoire of their lo-fi hip hop period. Together with "Zul Marino", shot in Europe in 2022, it is part of what has been published of that collaboration on the channel.

For anyone arriving from "Cuántas veces", it is the best way to hear where the project's voice comes from.`,
    },
  },
  {
    slug: "con-fusion-sesiones-bugambilia",
    youtubeId: "DRzNfMD8O9E",
    title: "Sesiones BUGAMBILIA - Con.fusión ft Simon Squalo & Dj ESETÉ",
    displayTitle: "Sesiones Bugambilia (feat. Simon Squalo & DJ Eseté)",
    artistSlug: "con-fusion",
    artistName: "Con.fusión",
    kind: "sesion",
    date: "2026-06-29",
    durationSec: 389,
    description: {
      es: `Sesión de Con.fusión con Simon Squalo y DJ Eseté para Sesiones Bugambilia, publicada en el canal de la artista el 29 de junio de 2026, el día en que subió buena parte de su archivo audiovisual. Dura 6:29 y el video no incluye descripción, créditos ni fecha de grabación, así que lo único que consta son sus participantes y el nombre del ciclo.

Simon Squalo aparece en otros dos videos del mismo canal, y el formato con DJ remite al rap e improvisación vocal que Con.fusión practica en el show en vivo de Matiah Chinaski. Catalina Aguilera ha desarrollado buena parte de su trabajo en este tipo de grabaciones colaborativas de la escena chilena.

Se incluye como registro de esa red de colaboraciones. El video no incluye créditos de realización.`,
      en: `Session by Con.fusión with Simon Squalo and DJ Eseté for Sesiones Bugambilia, published on the artist's channel on June 29, 2026, the day she uploaded a large part of her audiovisual archive. It runs 6:29 and the video includes no description, credits or recording date, so the only facts on record are its participants and the name of the series.

Simon Squalo appears in two other videos on the same channel, and the format with a DJ points to the rap and vocal improvisation Con.fusión practises in Matiah Chinaski's live show. Catalina Aguilera has built much of her work in this kind of collaborative recording within the Chilean scene.

It is included as a record of that network of collaborations. The video carries no production credits.`,
    },
  },
  {
    slug: "con-fusion-que-aburrido",
    youtubeId: "muAkr2Re2Ks",
    title: "Con.fusión - Qué Aburrido!",
    displayTitle: "Qué Aburrido!",
    artistSlug: "con-fusion",
    artistName: "Con.fusión",
    kind: "videoclip",
    date: "2020-07-09",
    durationSec: 148,
    releaseSlug: "con-fusion-que-aburrido",
    description: {
      es: `Video animado de "Qué Aburrido!", single de Con.fusión producido por Fat Jota y publicado el 9 de julio de 2020, un día antes de que la canción saliera en plataformas. El diseño y la animación son de Camila Anaïs; dura 2:28, lo mismo que el tema.

La letra, incluida por la artista en la descripción, es una queja contra la rutina de producir: "¡Ay qué aburrido que se vuelve esto, ya está repetido!", "vivir no es solo producir", "no tengo nada más para dar", y cierra con "solo quiero vivir". Es uno de los primeros singles del catálogo público de Con.fusión, de la etapa de lo-fi hip hop con Fat Jota, donde la voz pasa del canto al rap sin pausa.

Publicado en julio de 2020, es anterior al archivo que la artista subió a su canal en junio de 2026 y el primero de sus videoclips en formato animado.`,
      en: `Animated video for "Qué Aburrido!", a Con.fusión single produced by Fat Jota and published on July 9, 2020, one day before the song reached streaming platforms. Design and animation are by Camila Anaïs; it runs 2:28, the length of the track.

The lyrics, included by the artist in the description, are a complaint against the routine of producing: "oh, how boring this is getting, it's already on repeat", "living is not just producing", "I have nothing more to give", closing with "I just want to live". It is one of the earliest singles in Con.fusión's public catalogue, from the lo-fi hip hop period with Fat Jota, where the voice moves from singing to rap without pause.

Published in July 2020, it predates the archive the artist uploaded to her channel in June 2026 and is the first of her music videos in animated form.`,
    },
    credits: [
      { role: "Producción", name: "Fat Jota" },
      { role: "Diseño y animación", name: "Camila Anaïs" },
    ],
  },

  // ─────────── ecamhi ───────────
  {
    slug: "ecamhi-planet-earth",
    youtubeId: "suwNLQSkQEY",
    thumb: "hqdefault", // sin maxresdefault (curl -I, 21-10-2026)
    title: "ecamhi - Planet Earth",
    displayTitle: "Planet Earth",
    artistSlug: "ecamhi",
    artistName: "ecamhi",
    kind: "videoclip",
    date: "2020-10-27",
    durationSec: 168,
    description: {
      es: `Video de "Planet Earth", pieza instrumental de ecamhi publicada en su canal el 27 de octubre de 2020, el mismo día que "Not My Birthday". A octubre de 2026 el canal no tiene otros videos: son los primeros registros audiovisuales del proyecto solista de Enrique Camhi, trompetista y productor de Newen Afrobeat. La descripción solo remite a su SoundCloud y no aporta datos sobre la imagen; las etiquetas del video hablan de beats, lo-fi, ambient y trompeta.

El tema dura 2:48 y es anterior a "Fake Love" (2021), su primer registro oficial en plataformas, y a "Move To" (2022). Muestra la línea de beatmaking con trompeta que la bio del artista describe como su propuesta instrumental y electrónica.

Es la entrada más temprana al universo de ecamhi, previa al EP "en viaje" que prepara con PHŌNÉ Records.`,
      en: `Video for "Planet Earth", an instrumental piece by ecamhi published on his channel on October 27, 2020, the same day as "Not My Birthday". As of October 2026 the channel has no other videos: they are the first audiovisual records of the solo project of Enrique Camhi, trumpet player and producer with Newen Afrobeat. The description only points to his SoundCloud and gives no details about the picture; the video's tags mention beats, lo-fi, ambient and trumpet.

The track runs 2:48 and predates "Fake Love" (2021), his first official release on streaming platforms, and "Move To" (2022). It shows the trumpet-and-beatmaking line that the artist's bio describes as his instrumental and electronic proposal.

It is the earliest entry into ecamhi's universe, prior to the EP "en viaje" he is preparing with PHŌNÉ Records.`,
    },
    credits: [{ role: "Música", name: "Enrique Camhi" }],
  },
  {
    slug: "ecamhi-not-my-birthday",
    youtubeId: "ZgzvAWP8N7g",
    title: "ecamhi - Not My Birthday",
    displayTitle: "Not My Birthday",
    artistSlug: "ecamhi",
    artistName: "ecamhi",
    kind: "videoclip",
    date: "2020-10-27",
    durationSec: 250,
    description: {
      es: `Video de "Not My Birthday", pieza de ecamhi publicada en su canal el 27 de octubre de 2020 junto a "Planet Earth". La descripción indica solo que la música está producida por Enrique Camhi y remite a su SoundCloud, sin datos sobre la imagen ni créditos de realización. Dura 4:10 y es el más largo de los dos.

Enrique Camhi es trompetista, productor y compositor, integrante de Newen Afrobeat, y bajo el nombre ecamhi desarrolla una propuesta instrumental y electrónica influida por el beatmaking, el jazz y el hip hop. Estos dos videos de 2020 son el punto de partida de esa línea solista, antes de los singles con otros artistas que figuran en su discografía.

Hoy ecamhi prepara el álbum "εποχή" y el EP "en viaje", concebido a partir de fotografías de gira; este video es el antecedente más antiguo de ese cruce entre imagen y sonido.`,
      en: `Video for "Not My Birthday", a piece by ecamhi published on his channel on October 27, 2020 alongside "Planet Earth". The description states only that the music is produced by Enrique Camhi and points to his SoundCloud, with no details about the picture or production credits. It runs 4:10 and is the longer of the two.

Enrique Camhi is a trumpet player, producer and composer, a member of Newen Afrobeat, and under the name ecamhi he develops an instrumental and electronic proposal influenced by beatmaking, jazz and hip hop. These two 2020 videos are the starting point of that solo line, before the singles with other artists listed in his discography.

Today ecamhi is preparing the album "εποχή" and the EP "en viaje", conceived from touring photographs; this video is the earliest precedent of that crossing between image and sound.`,
    },
    credits: [{ role: "Música", name: "Enrique Camhi" }],
  },

  // ─────────── Rosario Lircay ───────────
  {
    slug: "rosario-lircay-a-ti",
    youtubeId: "7HFurHmwCcs",
    title: "a ti - Rosario Lircay",
    displayTitle: "a ti",
    artistSlug: "rosario-lircay",
    artistName: "Rosario Lircay",
    kind: "videoclip",
    date: "2026-07-25",
    durationSec: 186,
    featured: true,
    description: {
      es: `Videoclip de "a ti", el segundo adelanto de "La Piel", el álbum debut de Rosario Lircay. La canción salió en junio de 2026 por seda.wav y el video se publicó en su canal el 25 de julio de ese año. Dura 3:06 y el video no incluye descripción ni créditos de realización.

"La Piel" reúne diez canciones nacidas de beats y luego tocadas por músicos, producidas por Fresco Fresco (Pablo Acuña y Nacho Barrientos), con la batería de Pablo Trangol y master de Chalo G. "a ti" sigue a "ya me tienes" (abril de 2026) y precede a "En Vela" (23 de octubre de 2026), su primer lanzamiento con PHŌNÉ Records.

Es el primer videoclip de las canciones del disco, anterior a la llegada de la artista al sello.`,
      en: `Music video for "a ti", the second single from "La Piel", Rosario Lircay's debut album. The song came out in June 2026 on seda.wav and the video was published on her channel on July 25 that year. It runs 3:06 and the video includes no description or production credits.

"La Piel" gathers ten songs born from beats and then played by musicians, produced by Fresco Fresco (Pablo Acuña and Nacho Barrientos), with Pablo Trangol on drums and mastering by Chalo G. "a ti" follows "ya me tienes" (April 2026) and precedes "En Vela" (October 23, 2026), her first release with PHŌNÉ Records.

It is the first music video for the album's songs, prior to the artist's arrival at the label.`,
    },
  },
  {
    slug: "rosario-lircay-ya-me-tienes-visualizer",
    youtubeId: "KE76q5V9t48",
    title: "ya me tienes - Rosario Lircay (visualizer)",
    displayTitle: "ya me tienes",
    artistSlug: "rosario-lircay",
    artistName: "Rosario Lircay",
    kind: "visualizer",
    date: "2026-04-14",
    durationSec: 116,
    description: {
      es: `Visualizer de "ya me tienes", el primer adelanto de "La Piel", publicado el 14 de abril de 2026, en la semana de salida del single. Dura 1:56. La idea original, el movimiento y la postproducción son de Lenin Araya, con Emilio Torres en cámara y foco, Seba Carozzi en asistencia de movimiento y Joaquín Álvarez Nelson en asistencia.

La canción la produjeron Fresco Fresco y la propia Rosario Lircay y se grabó en La Salitrera con Marcos Fauré como ingeniero; tocan Pau en bajo, Nacho Barrientos en guitarras, Pablo Trangol en batería y Fresco Fresco en sintetizadores; mezcla de Fresco Fresco y master de Chalo G. La letra, en español e inglés, insiste en una frase: "si me quieres, ya me tienes, no me falles".

Es el primer video de la etapa de "La Piel" y el que fija el equipo audiovisual que repite en el detrás de cámara del disco.`,
      en: `Visualizer for "ya me tienes", the first single from "La Piel", published on April 14, 2026, in the single's release week. It runs 1:56. Original idea, movement and post-production are by Lenin Araya, with Emilio Torres on camera and focus, Seba Carozzi on movement assistance and Joaquín Álvarez Nelson assisting.

The song was produced by Fresco Fresco and Rosario Lircay herself and recorded at La Salitrera with Marcos Fauré as engineer; Pau plays bass, Nacho Barrientos guitars, Pablo Trangol drums and Fresco Fresco synths; mixed by Fresco Fresco and mastered by Chalo G. The lyrics, in Spanish and English, insist on one line: "if you love me, you already have me, don't let me down".

It is the first video of the "La Piel" period and the one that sets the audiovisual team that returns in the album's behind-the-scenes piece.`,
    },
    credits: [
      { role: "Idea original, movimiento y postproducción", name: "Lenin Araya" },
      { role: "Operador de cámara y foco", name: "Emilio Torres" },
      { role: "Asistencia de movimiento y 2AC", name: "Seba Carozzi" },
      { role: "Asistencia", name: "Joaquín Álvarez Nelson" },
      { role: "Producción musical", name: "Fresco Fresco, Rosario Lircay" },
      { role: "Master", name: "Chalo G" },
    ],
  },
  {
    slug: "rosario-lircay-behind-the-scenes-la-piel",
    youtubeId: "GjfKRwgpRkI",
    title: "Behind the Scenes - Photoshoot \"La Piel\" -  Rosario Lircay",
    displayTitle: { es: "Detrás de cámara: sesión de fotos de \"La Piel\"", en: "Behind the Scenes: \"La Piel\" Photoshoot" },
    artistSlug: "rosario-lircay",
    artistName: "Rosario Lircay",
    kind: "documental",
    date: "2026-09-06",
    durationSec: 184,
    recordedYear: 2025,
    description: {
      es: `Detrás de cámara de la sesión de fotos de "La Piel", el álbum debut de Rosario Lircay, realizada en Santiago de Chile en diciembre de 2025 y publicada en su canal el 6 de septiembre de 2026. Dura 3:04 y de fondo suenan tres canciones: "En vela", "Ya me tienes" y "Así se da".

El video es de Lenin Araya, el mismo realizador del visualizer de "ya me tienes"; la fotografía es de @frrancesqo, el peinado y maquillaje de Amanda de la Puente, el styling de Tanza María y las luces de La Cámara Film, con Matías Schulze y Joaquín Álvarez Nelson como asistentes. La artista agradece a Cata Aguilera (Con.fusión) y a Sofi Pradel.

Es un registro documental del trabajo de imagen del disco, anterior a la salida de "En Vela", su primer single con PHŌNÉ Records.`,
      en: `Behind the scenes of the photo shoot for "La Piel", Rosario Lircay's debut album, made in Santiago de Chile in December 2025 and published on her channel on September 6, 2026. It runs 3:04 and three songs play in the background: "En vela", "Ya me tienes" and "Así se da".

The video is by Lenin Araya, the same filmmaker behind the "ya me tienes" visualizer; photography is by @frrancesqo, hair and make-up by Amanda de la Puente, styling by Tanza María and lighting by La Cámara Film, with Matías Schulze and Joaquín Álvarez Nelson assisting. The artist thanks Cata Aguilera (Con.fusión) and Sofi Pradel.

It is a documentary record of the album's image work, prior to the release of "En Vela", her first single with PHŌNÉ Records.`,
    },
    credits: [
      { role: "Video", name: "Lenin Araya" },
      { role: "Fotografía", name: "@frrancesqo" },
      { role: "Peinado y maquillaje", name: "Amanda de la Puente" },
      { role: "Styling", name: "Tanza María" },
      { role: "Luces", name: "La Cámara Film" },
      { role: "Asistentes", name: "Matías Schulze, Joaquín Álvarez Nelson" },
    ],
  },
];

/** Catálogo ordenado: fecha de publicación desc, luego título. */
export const videos: Video[] = [...RAW].sort(
  (a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title),
);

export const videoSlugs = videos.map((v) => v.slug);

export function getVideo(slug: string): Video | undefined {
  return videos.find((v) => v.slug === slug);
}

/** Título visible (tarjetas, h1, alt, facade): `displayTitle` del idioma o, si falta, el oficial. */
export function videoDisplayTitle(v: Pick<Video, "title" | "displayTitle">, lang: Language): string {
  const d = v.displayTitle;
  if (!d) return v.title;
  return typeof d === "string" ? d : d[lang];
}

/** El título más el artista si no lo nombra ya (minúsculas, sin plegar tildes). */
export function withArtist(title: string, artistName: string): string {
  return title.toLowerCase().includes(artistName.toLowerCase()) ? title : `${title} — ${artistName}`;
}

/**
 * <title> de la ficha de video, ≤ TITLE_MAX contando la plantilla del layout. Primera
 * opción que cabe: 1) oficial (+ artista) con plantilla; 2) visible + artista con
 * plantilla; 3) visible + artista sin plantilla; 4) visible con plantilla; 5) visible
 * sin plantilla. El oficial solo queda si cabe; si no, el artista gana a la marca.
 * `absolute: true` = va sin plantilla ({ absolute } en Metadata).
 */
export function videoMetaTitle(
  v: Pick<Video, "title" | "displayTitle" | "artistName">,
  lang: Language,
): { title: string; absolute: boolean } {
  const display = videoDisplayTitle(v, lang);
  const options: { title: string; absolute: boolean }[] = [
    { title: withArtist(v.title, v.artistName), absolute: false },
    { title: withArtist(display, v.artistName), absolute: false },
    { title: withArtist(display, v.artistName), absolute: true },
    { title: display, absolute: false },
    { title: display, absolute: true },
  ];
  const fits = (o: { title: string; absolute: boolean }) =>
    titleLength(o.absolute ? o.title : templatedTitle(o.title)) <= TITLE_MAX;
  return options.find(fits) ?? options[options.length - 1];
}

/**
 * Lo que una tarjeta de video necesita, con `title` ya resuelto al visible del idioma.
 * /videos pasa esta forma reducida a su grilla cliente: los textos largos ES/EN no
 * viajan en el payload RSC. Vive aquí (no en video-card.tsx, que entra al bundle del
 * navegador por la grilla) para que ese archivo solo importe tipos de este módulo.
 */
export type VideoCardData = Pick<
  Video,
  "slug" | "youtubeId" | "title" | "artistSlug" | "artistName" | "kind" | "date" | "recordedYear" | "thumb"
>;

export function toVideoCardData(v: Video, lang: Language): VideoCardData {
  return {
    slug: v.slug,
    youtubeId: v.youtubeId,
    title: videoDisplayTitle(v, lang),
    artistSlug: v.artistSlug,
    artistName: v.artistName,
    kind: v.kind,
    date: v.date,
    recordedYear: v.recordedYear,
    thumb: v.thumb,
  };
}

export function getVideosByArtist(artistSlug: string): Video[] {
  return videos.filter((v) => v.artistSlug === artistSlug);
}

/** Solo videos cuya fecha ya llegó (00:00 America/Santiago); se evalúa por petición. */
export function getPublishedVideos(nowMs: number = Date.now()): Video[] {
  return videos.filter((v) => isReleased(v.date, nowMs));
}

/** Videos de un artista para su ficha: publicados, destacados primero, hasta `limit`. */
export function pickArtistVideos(artistSlug: string, limit = 6, nowMs: number = Date.now()): Video[] {
  const mine = getPublishedVideos(nowMs).filter((v) => v.artistSlug === artistSlug);
  return [...mine.filter((v) => v.featured), ...mine.filter((v) => !v.featured)].slice(0, limit);
}

export function youtubeThumb(id: string, q: "maxresdefault" | "hqdefault" = "maxresdefault"): string {
  return `https://i.ytimg.com/vi/${id}/${q}.jpg`;
}

/** Mejor miniatura existente del video: maxres salvo que `thumb` diga que no la hay. */
export function videoThumb(v: Pick<Video, "youtubeId" | "thumb">): string {
  return youtubeThumb(v.youtubeId, v.thumb ?? "maxresdefault");
}

/** Miniaturas existentes para `thumbnailUrl` de schema.org (maxres si existe, y hq). */
export function videoThumbs(v: Pick<Video, "youtubeId" | "thumb">): string[] {
  const hq = youtubeThumb(v.youtubeId, "hqdefault");
  return v.thumb ? [hq] : [youtubeThumb(v.youtubeId), hq];
}

/** Dimensiones reales de la miniatura para Open Graph: maxres 1280×720, hq 480×360. */
export function videoThumbSize(v: Pick<Video, "thumb">): { width: number; height: number } {
  return v.thumb ? { width: 480, height: 360 } : { width: 1280, height: 720 };
}

export function youtubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

/** "22 de octubre de 2026" / "October 22, 2026"; "YYYY-MM" → "octubre 2026" / "October 2026". */
export function formatVideoDate(date: string, lang: Language): string {
  const label = formatReleaseLabel(date, lang);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return label;
  const year = date.slice(0, 4);
  return lang === "es" ? `${label} de ${year}` : `${label}, ${year}`;
}

/** "4:29", "1:02:03". */
export function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const mm = h ? String(m).padStart(2, "0") : String(m);
  return `${h ? `${h}:` : ""}${mm}:${String(s).padStart(2, "0")}`;
}

/** ISO 8601 para schema.org: "PT4M29S", "PT1H2M3S". */
export function isoDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s || (!h && !m) ? `${s}S` : ""}`;
}

/** Primer párrafo del texto propio, cortado en un espacio y con "…" (meta description). */
export function videoExcerpt(v: Video, lang: Language, max = 158): string {
  const first = v.description[lang].split(/\n{2,}/)[0].replace(/\s+/g, " ").trim();
  if (first.length <= max) return first;
  const cut = first.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.\-—]+$/, "") + "…";
}
