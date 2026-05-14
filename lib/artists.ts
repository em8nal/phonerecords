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
        `Newen Afrobeat es la primera orquesta chilena de afrobeat: una formación de once músicos que toma el lenguaje fundado por Fela Kuti en Lagos y lo escribe en el sur del mundo, sin imitación y sin pose.

Formada en Santiago en 2009, la banda atravesó una década de gestación lenta antes de viajar a Lagos a estudiar con maestros del género. Esa peregrinación marcó el quiebre entre el ejercicio de género y la voz propia: a partir de su segundo LP Curiche (2019) la banda asumió temas situados —desigualdad, migración, rol femenino, culturas indígenas— sin dejar caer la urgencia rítmica del afrobeat clásico.

El catálogo cuenta con cinco lanzamientos: el LP debut Newen Afrobeat (2014, Estudios del Sur), el EP Newen Plays Fela (2017) grabado con Seun Kuti, Cheick Tidiane Seck y músicos de Egypt 80, el LP Curiche (2019), el LP Grietas (OfficeHome Records, París, 2024) con featurings de Lido Pimienta, Dele Sosimi, Joe Vasconcellos y Chico César, y la sesión en vivo Liverpool Session (2025) grabada 100% análoga en Quarry, Liverpool.

El sonido dialoga con highlife, jazz modal, funk y rare groove, pero opera desde la lectura sudamericana del trance afrobeat: secciones de bronces densas, percusiones que cruzan kpalongos, sakara, congas y batería; voces en español, inglés y yoruba. La sección ampliada —vocales, tres bronces, dos saxos, guitarras, bajo, percusiones y batería— les permite estirar piezas a 9-13 minutos sin perder pulso, una decisión estética antes que comercial.

Han colaborado con Tony Allen, Seun Kuti, Femi Kuti, Cheick Tidiane Seck, Oghene Kologbo, Lido Pimienta, Joe Vasconcellos, Dele Sosimi y Chico César. Dentro del ecosistema PHŌNÉ, Ecamhi participa como trompetista histórico y co-compositor de Mare Mare, y Klaus Brantmayer firma la composición de Es la Vida; Claudio Solís diseña el arte gráfico del LP Grietas.

Han girado por Chile, Brasil, Nigeria, Estados Unidos, Canadá, Reino Unido y Europa, con presentación destacada en Glastonbury. La gira Europa 2026 (agosto-septiembre) los lleva a Innsbruck, Frick, Frankfurt, Ginebra, Viena y al Jazz Cafe de Londres, con management compartido entre PHŌNÉ Records (Chile) y Ludwig Sound Booking Agency (Heidelberg, Alemania).`,
      en:
        `Newen Afrobeat is the first Chilean afrobeat orchestra: an eleven-piece formation that takes the language founded by Fela Kuti in Lagos and writes it from the southern hemisphere, without imitation and without pose.

Formed in Santiago in 2009, the band went through a decade of slow gestation before traveling to Lagos to study with masters of the genre. That pilgrimage marked the break between genre exercise and self-voice: from their second LP Curiche (2019), the band took on situated themes —inequality, migration, women's roles, indigenous cultures— without letting go of classic afrobeat's rhythmic urgency.

The catalogue counts five releases: the debut LP Newen Afrobeat (2014, Estudios del Sur), the EP Newen Plays Fela (2017) recorded with Seun Kuti, Cheick Tidiane Seck and Egypt 80 musicians, the LP Curiche (2019), the LP Grietas (OfficeHome Records, Paris, 2024) featuring Lido Pimienta, Dele Sosimi, Joe Vasconcellos and Chico César, and the live session Liverpool Session (2025) recorded fully analog at Quarry, Liverpool.

The sound dialogues with highlife, modal jazz, funk and rare groove, but operates from a South American reading of afrobeat trance: dense brass sections, percussions crossing kpalongos, sakara, congas and drums; voices in Spanish, English and Yoruba. The expanded section —vocals, three brass, two saxophones, guitars, bass, percussion and drums— allows them to stretch pieces to 9-13 minutes without losing pulse, an aesthetic rather than a commercial decision.

They have collaborated with Tony Allen, Seun Kuti, Femi Kuti, Cheick Tidiane Seck, Oghene Kologbo, Lido Pimienta, Joe Vasconcellos, Dele Sosimi and Chico César. Within the PHŌNÉ ecosystem, Ecamhi plays as historic trumpet player and co-composer of Mare Mare, and Klaus Brantmayer signs the composition of Es la Vida; Claudio Solís designs the graphic art of the LP Grietas.

They have toured Chile, Brazil, Nigeria, the United States, Canada, the United Kingdom and Europe, with a notable presentation at Glastonbury. The Europe 2026 tour (August-September) takes them to Innsbruck, Frick, Frankfurt, Geneva, Vienna and Jazz Cafe in London, with management shared between PHŌNÉ Records (Chile) and Ludwig Sound Booking Agency (Heidelberg, Germany).`,
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
        `Enrique Camhi —Ecamhi— es trompetista, fluegelhornista, productor y fotógrafo chileno cuyo trabajo solista habita en la zona donde imagen y sonido se alimentan mutuamente. No firma "música con fotos" ni "fotos con música": ambas vienen del mismo gesto creativo y se publican como un solo objeto.

Su primer EP, en viaje, fue el lanzamiento inaugural del sello PHŌNÉ Records. El disco surge de un archivo de fotografías capturadas en giras internacionales: cuatro imágenes inspiraron cuatro canciones que se presentaron en una exhibición donde cada foto estaba acompañada de audífonos con su pieza correspondiente. La estructura curatorial —imagen como punto de partida, sonido como respuesta— se volvió una declaración de método del sello.

Como sesionista, integra desde hace años la sección de bronces de Newen Afrobeat. Su trompeta aparece en los LPs Curiche (2019) y Grietas (OfficeHome Records, 2024), donde además co-compone Mare Mare junto a Martin Concha y co-dirige el arte del disco con Tom Pavez.

En su trabajo solista cruza música instrumental, jazz, electrónica de cámara y montajes interdisciplinares. La trompeta funciona como hilo —tema melódico, contracanto, atmósfera difusa— sobre arreglos que privilegian el silencio y la geometría espacial. La fotografía no es paratexto: muchas piezas existen sólo en relación con la imagen que las gatilló.

Es la voz orquestal cruzada del ecosistema PHŌNÉ: además de Newen, aparece como invitado en Estudios Del Maipo: Live Session de Gestosimple & Klaus B (2025) y en el single Quisiera Entender de Klaus B (2023), grabado tras los viajes a Lagos con Newen Afrobeat. La voz invitada de su EP en viaje es Catalina Aguilera (Con.fusión); el sax y co-composición son de Vicente Aravena; el master, de Daniel Pérez.

Trabaja en nuevos materiales que extienden la lógica interdisciplinar del primer EP, con énfasis en sesiones en vivo grabadas en cinta y exposiciones que combinan imagen, sonido y texto. Continúa activo en la formación de Newen Afrobeat con presentaciones programadas en la gira Europa 2026.`,
      en:
        `Enrique Camhi —Ecamhi— is a Chilean trumpet and flugelhorn player, producer and photographer whose solo work inhabits the zone where image and sound feed each other. He doesn't sign "music with photos" or "photos with music": both come from the same creative gesture and are published as a single object.

His first EP, en viaje, was the inaugural release of PHŌNÉ Records. The album emerges from an archive of photographs captured on international tours: four images inspired four songs, presented as an exhibition where each photo was accompanied by headphones playing its corresponding piece. The curatorial structure —image as starting point, sound as response— became a methodological statement for the label.

As a session player, he has been part of Newen Afrobeat's brass section for years. His trumpet appears on the LPs Curiche (2019) and Grietas (OfficeHome Records, 2024), where he also co-composes Mare Mare with Martin Concha and co-directs the album art with Tom Pavez.

In his solo work he crosses instrumental music, jazz, chamber electronics and interdisciplinary stagings. The trumpet operates as a thread —melodic theme, counter-line, diffuse atmosphere— over arrangements that privilege silence and spatial geometry. Photography is not paratext: many pieces only exist in relation to the image that triggered them.

He is the cross-orchestra voice of the PHŌNÉ ecosystem: besides Newen, he appears as a guest in Estudios Del Maipo: Live Session by Gestosimple & Klaus B (2025) and on the single Quisiera Entender by Klaus B (2023), recorded after the Lagos tours with Newen Afrobeat. The guest voice on his en viaje EP is Catalina Aguilera (Con.fusión); sax and co-composition are by Vicente Aravena; mastering by Daniel Pérez.

He is working on new materials that extend the interdisciplinary logic of the first EP, with emphasis on tape-recorded live sessions and exhibitions that combine image, sound and text. He continues active in Newen Afrobeat's formation with scheduled performances on the Europe 2026 tour.`,
    },
    links: [
      { label: "Spotify", href: "https://open.spotify.com/artist/6dUvYBGnjpf2emwATOIP4c" },
      { label: "SoundCloud", href: "https://soundcloud.com/enrique-camhi" },
      { label: "Instagram", href: "https://www.instagram.com/ecamhi/" },
    ],
    stats: { monthlyListeners: 3 },
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
    stats: { monthlyListeners: 8700 },
    bio: {
      es:
        `Con.fusión es el proyecto solista de Catalina Aguilera Martínez: una propuesta vocal que transita entre el hip hop, el jazz, el neo soul y la exploración de la voz como territorio de investigación, no como decoración.

Su trayectoria se inicia en colaboración con el productor Fat Jota, con quien desarrolla un sonido cercano al lo-fi hip hop documentado en el EP verdad. Desde ahí evoluciona hacia la banda Fat Lady, donde el lenguaje se desplaza al cruce entre neo soul y rock. Ha participado activamente en festivales y plataformas como Beatminds (junto al DJ Dacel), Furia Jazz y otros circuitos de la escena chilena de música improvisada y urbana.

Su single Cantas Veces se publica como anticipo del trabajo en proceso. Es además la voz invitada del EP en viaje de Ecamhi —el lanzamiento inaugural de PHŌNÉ Records—, donde aparece como vocalista en piezas que cruzan trompeta y exploración tímbrica.

Su práctica vocal va del canto ortodoxo al rap, al scat y a las texturas sin palabra: la voz se trabaja como instrumento en igualdad con los bronces y la electrónica. Las composiciones combinan estructuras del hip hop —beats, samples, breakbeat— con armonías heredadas del jazz contemporáneo y atmósferas cinematográficas, en una zona donde la canción y la pieza sonora se confunden.

Está en producción su primer álbum Tulpa, laboratorio intensivo de investigación y creación a cargo del productor Jenry Cancura (alias Matiah Chinaski). El trabajo cruza hip hop, jazz, neo soul y prácticas de arte sonoro, con bronces y vientos —trompetas, saxofones— en atmósferas nocturnas y cinematográficas. Como referentes explícitos del proyecto figuran Tom Waits y Lhasa de Sela. El tracklist en proceso incluye Acertijo, En vez de quejarte tanto y Pisando caca a propósito.

Ha postulado a la residencia FRECUENCIAS 2026 (Burdeos, Francia, octubre 2026) para profundizar en la dimensión escénica del proyecto. PHŌNÉ acompaña la producción de Tulpa con dirección creativa, asistencia en arreglos y curaduría visual, en un proceso de formato extendido que prioriza la incubación sobre el lanzamiento apurado.`,
      en:
        `Con.fusión is the solo project of Catalina Aguilera Martínez: a vocal proposal moving between hip hop, jazz, neo soul and the exploration of voice as a territory of research, not as decoration.

Her trajectory begins in collaboration with producer Fat Jota, with whom she develops a sound close to lo-fi hip hop documented in the EP verdad. From there she evolves towards the band Fat Lady, where the language shifts to the crossing of neo soul and rock. She has actively participated in festivals and platforms like Beatminds (alongside DJ Dacel), Furia Jazz and other circuits of the Chilean improvised and urban music scene.

Her single Cantas Veces is released as a preview of the work in process. She is also the guest voice on Ecamhi's en viaje EP —the inaugural release of PHŌNÉ Records— appearing as vocalist on pieces that cross trumpet and timbral exploration.

Her vocal practice ranges from orthodox singing to rap, scat and wordless textures: the voice is treated as an instrument on equal footing with brass and electronics. Compositions combine hip hop structures —beats, samples, breakbeat— with harmonies inherited from contemporary jazz and cinematic atmospheres, in a zone where song and sonic piece blur into each other.

Her debut album Tulpa is in production, an intensive laboratory of research and creation led by producer Jenry Cancura (alias Matiah Chinaski). The work crosses hip hop, jazz, neo soul and sound art practices, with brass and winds —trumpets, saxophones— in nocturnal and cinematic atmospheres. Tom Waits and Lhasa de Sela appear as explicit references for the project. The tracklist in progress includes Acertijo, En vez de quejarte tanto and Pisando caca a propósito.

She has applied to the FRECUENCIAS 2026 residency (Bordeaux, France, October 2026) to deepen the project's stage dimension. PHŌNÉ accompanies the production of Tulpa with creative direction, arrangement assistance and visual curation, in an extended-format process that prioritises incubation over rushed release.`,
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
        `Klaus B es saxofonista, flautista y productor santiaguino. Su música cruza nu-jazz, hip-hop jazz y neo-soul instrumental con un fraseo de viento que dialoga con J Dilla, los grooves orgánicos y la espiritualidad del jazz contemporáneo.

Activo desde 2021, su catálogo en Bandcamp acumula ocho lanzamientos que alternan instrumentales atmosféricos con producciones colaborativas. La línea solista parte con los singles Viento Radiante (2021) —flauta funk con Diego Alarcón en teclados, Iván Araya en bajo y Tito Gevert en batería— y De Noche (2021), y se profundiza con El Secreto (2025) y Those Days Far Away (2025), este último co-producido por Lister Rossel (Mr.Li, Londres) con MC Seven Star (Orlando) y MC Racecar (París).

La línea colaborativa converge en el dúo extendido Gestosimple & Klaus B: el LP Viaje Sin Tiempo (2024, doce tracks con featurings de Fran Ri, DJ Dacel, Valentina Marinkovic, Cidtronyck, Celeste Shaw, Wagabond, Senciyo Samuel HuiZa y 22Ruzz) y el EP en vivo Estudios Del Maipo: Live Session (2025), grabado en Cajón del Maipo con Ecamhi en trompeta. La mixtape Memorias (2025) cierra una primera etapa: quince piezas grabadas a lo largo de varios años que funcionan como archivo personal de la práctica musical.

Las etiquetas habituales en su catálogo —rap jazz, future jazz, future funk, neo-soul instrumental, scratching— apuntan a una sensibilidad tributaria de la escuela post-Dilla con flauta y vocoder como firmas tímbricas. Las piezas se construyen como conversación entre vientos, teclados, bajo, batería orgánica y procesamiento sutil, manteniendo siempre el groove al frente.

Dentro del ecosistema PHŌNÉ aparece en el LP Grietas de Newen Afrobeat (2024) como compositor de Es la Vida; el single Quisiera Entender feat. Newen Afrobeat (2023) fue producido tras gira a Lagos con la banda y cuenta con la sección de bronces de Newen completa, incluido Ecamhi en trompeta. Afuera del sello colabora con Gestosimple, Mr.Li, Cidtronyck, DJ Dacel, Valentina Marinkovic, Camila Fuentes, José Toledo, Pablo James y Diego Toro, entre otros.

Adjudicó el Fondo de la Música 2026 para desarrollar un nuevo proyecto en colaboración con PHŌNÉ Records. El plan contempla desarrollo de identidad y dirección artística, ensayos y grabación entre junio y julio de 2026, y producción paralela de piezas visuales que acompañen la música. Es la primera entrega del artista bajo el sello.`,
      en:
        `Klaus B is a Santiago-based saxophonist, flutist and producer. His music crosses nu-jazz, hip-hop jazz and instrumental neo-soul with a wind phrasing that dialogues with J Dilla, organic grooves and contemporary jazz spirituality.

Active since 2021, his Bandcamp catalogue counts eight releases alternating atmospheric instrumentals with collaborative productions. The solo line starts with the singles Viento Radiante (2021) —flute funk with Diego Alarcón on keys, Iván Araya on bass and Tito Gevert on drums— and De Noche (2021), and deepens with El Secreto (2025) and Those Days Far Away (2025), the latter co-produced by Lister Rossel (Mr.Li, London) with MC Seven Star (Orlando) and MC Racecar (Paris).

The collaborative line converges in the extended duo Gestosimple & Klaus B: the LP Viaje Sin Tiempo (2024, twelve tracks with features by Fran Ri, DJ Dacel, Valentina Marinkovic, Cidtronyck, Celeste Shaw, Wagabond, Senciyo Samuel HuiZa and 22Ruzz) and the live EP Estudios Del Maipo: Live Session (2025), recorded in Cajón del Maipo with Ecamhi on trumpet. The mixtape Memorias (2025) closes a first chapter: fifteen pieces recorded over several years functioning as a personal archive of musical practice.

The usual tags across his catalogue —rap jazz, future jazz, future funk, instrumental neo-soul, scratching— point to a sensibility tributary to the post-Dilla school with flute and vocoder as timbral signatures. Pieces are built as a conversation between winds, keys, bass, organic drums and subtle processing, always keeping the groove at the front.

Within the PHŌNÉ ecosystem he appears on the LP Grietas by Newen Afrobeat (2024) as composer of Es la Vida; the single Quisiera Entender feat. Newen Afrobeat (2023) was produced after the Lagos tour with the band and features Newen's complete brass section, including Ecamhi on trumpet. Outside the label he collaborates with Gestosimple, Mr.Li, Cidtronyck, DJ Dacel, Valentina Marinkovic, Camila Fuentes, José Toledo, Pablo James and Diego Toro, among others.

He was awarded the 2026 Fondo de la Música to develop a new project in collaboration with PHŌNÉ Records. The plan includes identity development and artistic direction, rehearsals and recording between June and July 2026, and parallel production of visual pieces accompanying the music. It will be the artist's first delivery under the label.`,
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
        `Andrés Abrigo es un productor chileno cuyo trabajo se aleja de la fabricación de beats para acercarse a la composición ambient y experimental. La pieza, no la pista, es la unidad mínima de su práctica.

Sus exploraciones iniciales —documentadas en redes y SoundCloud— combinan drum machine, bajo, trompeta y pianos en piezas atmosféricas que privilegian la duración y el detalle por sobre el impacto rítmico. La etiqueta interna del proyecto, post-tempo, condensa una intención: salir de la cuadrícula del compás cerrado para componer en tiempos más abiertos.

El cuerpo de trabajo en proceso bajo PHŌNÉ Records incluye ocho stems de estudio actualmente en desarrollo —Cumbia Andino, Dos, Ensayo Ansiedad, Post Dub Jam, Sábanas, Simple, Uno y Útero— que serán curados en su primer EP.

El registro se mueve entre ambient, downtempo, post-dubstep y formas híbridas que resisten clasificación neta. Atmósferas de grano fino, bajos densos, trompetas filtradas, pianos preparados y secuencias que priorizan la respiración por sobre la repetición. Cada pieza es escrita como objeto único, no como track de DJ set.

El proyecto se desarrolla bajo dirección creativa de PHŌNÉ Records, con acompañamiento en ensamblaje sonoro, arreglos y dirección de arte. La conexión con el resto del roster es indirecta —comparten ecosistema antes que sesiones— y abre la posibilidad de diálogos cruzados con Ecamhi (trompeta) o Klaus B (vientos) en futuras grabaciones.

El cronograma 2026 contempla esbozo de cinco temas como primer hito (agosto) y mezcla y máster proyectados para septiembre. El EP debut funcionará como carta de presentación pública del artista bajo el sello, con materiales visuales y editoriales producidos en paralelo.`,
      en:
        `Andrés Abrigo is a Chilean producer whose work moves away from beat-making and towards ambient and experimental composition. The piece, not the track, is the minimum unit of his practice.

His initial explorations —documented on social media and SoundCloud— combine drum machine, bass, trumpet and pianos in atmospheric pieces that privilege duration and detail over rhythmic impact. The project's internal tag, post-tempo, condenses an intention: to leave the grid of closed time signatures to compose in more open temporalities.

The body of work in progress under PHŌNÉ Records includes eight studio stems currently in development —Cumbia Andino, Dos, Ensayo Ansiedad, Post Dub Jam, Sábanas, Simple, Uno and Útero— that will be curated into his debut EP.

The register moves between ambient, downtempo, post-dubstep and hybrid forms resisting clean classification. Fine-grain atmospheres, dense basses, filtered trumpets, prepared pianos and sequences prioritising breathing over repetition. Each piece is written as a unique object, not as a DJ-set track.

The project is developed under PHŌNÉ Records' creative direction, with support on sound assembly, arrangements and art direction. The connection with the rest of the roster is indirect —they share an ecosystem rather than sessions— and opens the possibility for cross-dialogues with Ecamhi (trumpet) or Klaus B (winds) in future recordings.

The 2026 schedule contemplates sketches of five tracks as a first milestone (August) and mixing and mastering projected for September. The debut EP will function as the artist's public introduction under the label, with visual and editorial materials produced in parallel.`,
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
