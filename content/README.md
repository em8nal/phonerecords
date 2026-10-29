# content/: datos del sitio, un archivo por entrada

Los datos de artistas, lanzamientos, videos, fechas de gira y piezas del journal viven aquí, cada entrada en su propio JSON. El sitio no los lee del disco en tiempo de ejecución: los cinco índices de `content/generated/` los importan de forma estática y los módulos de `lib/` los exponen con la misma API de siempre (`artists`, `releases`, `videos`, `events`, `journalPieces`, `getRelease`, `releaseVideo`…). La lógica (ordenar, filtrar, fechas, etiquetas) sigue en `lib/`.

| Colección | Carpeta | Tipo en `lib/` | Lleva `order` |
|---|---|---|---|
| Artistas | `content/artists/<slug>.json` | `Artist` (`lib/artists.ts`) | sí |
| Lanzamientos | `content/releases/<slug>.json` | `Release` (`lib/releases.ts`) | sí |
| Videos | `content/videos/<slug>.json` | `Video` (`lib/videos.ts`) | no |
| Fechas de gira | `content/events/<slug>.json` | `Event` (`lib/events.ts`) | no |
| Journal | `content/journal/<slug>.json` | `JournalPiece` (`lib/journal.ts`) | no |

Comandos:

- `pnpm content:index` regenera `content/generated/*.ts` desde las carpetas. Hace falta al **crear, borrar o renombrar** un archivo; editar uno que ya existe no lo requiere. El build lo corre antes de `next build`.
- `pnpm test:content` valida cada JSON contra su esquema y comprueba que los índices estén al día.
- `node scripts/content-index.mjs --check` solo comprueba los índices, sin escribir.

## Reglas comunes

- **Nombre del archivo:** el slug en kebab-case (`^[a-z0-9]+(-[a-z0-9]+)*\.json$`). El campo `slug` va dentro del JSON y tiene que ser igual al nombre del archivo.
- **Formato:** `JSON.stringify(entrada, null, 2)` más un salto de línea final, en UTF-8 y sin escapar tildes. Claves en este orden: `slug`, después `order` (si va) y después el resto como en las tablas.
- **Opcionales:** un campo opcional sin valor **no se escribe**. Nunca `null`, `""` ni arreglos de relleno.
- **Textos largos** (`bio`, `description`): los párrafos se separan con una línea en blanco (`\n\n` dentro del string JSON).
- **Rutas e imágenes:** `cover` es una ruta local (`/releases/<slug>.jpg`, archivo en `public/`) o una URL `https://`. Los enlaces (`href`, `smartLink`, `ticketsUrl`, `sameAs`) son URLs `https://`.
- No se escriben datos personales, precios ni material interno: todo lo que está aquí se publica en el sitio.

## Fechas

| Campo | Formato | Regla |
|---|---|---|
| `releaseDate` (lanzamientos) | `AAAA`, `AAAA-MM` o `AAAA-MM-DD` | Fecha de Santiago. Un día completo sale a las 00:00 America/Santiago de ese día; una fecha parcial cuenta como publicada solo al terminar el período (`"2026-12"` desde el 1 de enero, `"2027"` desde el 1 de enero de 2028). Ver `releaseLiveMs` en `lib/release-date.ts`. |
| `date` (videos) | `AAAA-MM-DD` (`AAAA-MM` tolerado) | Fecha de publicación en YouTube; el video aparece a las 00:00 de Santiago de ese día. |
| `date` (fechas de gira) | `AAAA-MM-DD` | Día del concierto en su ciudad; pasa al archivo de la gira desde el día siguiente (hora de Santiago). |
| `publishAt` (journal) | `AAAA-MM-DDTHH:MM[:SS]-03:00` o `-04:00` | Hora de Santiago con su offset real: -03:00 de septiembre a abril, -04:00 de abril a septiembre. Un valor sin offset o imposible deja la pieza sin publicar. |

## `order` (artistas y lanzamientos)

Entero único dentro de su colección, con huecos de 10 (10, 20, 30…). Los módulos de `lib/` ordenan por `order` ascendente y lo quitan antes de exportar: nunca llega a las páginas.

- **artists:** es la secuencia del roster (portada, footer, JSON-LD de miembros, FAQ, /llms.txt). Hoy: newen-afrobeat 10, ecamhi 20, con-fusion 30, klaus-b 40, rosario-lircay 50.
- **releases:** el sitemap y el catálogo recorren los lanzamientos en este orden, y los empates de fecha se resuelven por posición (Gaviotas antes que Laruz, ambos del 2022-11-09). Va agrupado por artista.
- Para insertar entre dos entradas se usa un número libre entre ambas; para agregar al final, el máximo más 10.

Videos, fechas de gira y journal no llevan `order`: `lib/videos.ts` ordena por fecha descendente y título, `lib/events.ts` por fecha, y el journal por `publishAt`.

## artists

| Campo | Tipo | Obligatorio | Regla |
|---|---|---|---|
| `slug` | texto | sí | Igual al nombre del archivo; es la URL `/artistas/<slug>`. |
| `order` | entero | sí | Posición en el roster (ver arriba). |
| `name` | texto | sí | Nombre artístico tal como se muestra. |
| `alternateName` | lista de textos | no | Otros nombres con que se le busca (JSON-LD `alternateName`). |
| `genres` | lista de textos | sí | En español; sirven para los dos idiomas si no hay `genresEn`. |
| `genresEn` | lista de textos | no | Solo si algún género se escribe distinto en inglés. |
| `origin` | texto | sí | "Ciudad, País" y, si corresponde, " · año de formación". |
| `role` | `{ es, en }` | sí | Formación o instrumento principal ("Datos clave" de la ficha). |
| `bio` | `{ es, en }` | sí | La primera oración dice quién es, de dónde y desde cuándo (`pnpm test:roster`). |
| `links` | lista de `{ label, href }` | sí | Perfiles en el orden Spotify · Apple Music · YouTube · Bandcamp · SoundCloud · Instagram · TikTok · Discogs, con esas etiquetas. |
| `sameAs` | lista de URLs | no | MusicBrainz y Wikidata, solo coincidencias inequívocas. |
| `releases` | lista de objetos | no | Solo lanzamientos **sin** ficha propia: `{ year, title, format?, label?, notes?, href?, hrefKind?: "buy" o "listen", cover? }`. `year` es texto ("2026-06", "in production"). |
| `stats` | `{ spotifyFollowers?, monthlyListeners?, youtubeSubs? }` | no | Enteros. |

## releases

| Campo | Tipo | Obligatorio | Regla |
|---|---|---|---|
| `slug` | texto | sí | `<slug del artista>-<título en kebab>`; es la URL `/releases/<slug>`. |
| `order` | entero | sí | Ver arriba. |
| `title` | texto | sí | |
| `artistSlug` | texto | sí | Slug de un artista de `content/artists/`. |
| `artistName` | texto | sí | Como se acredita (puede incluir " feat. …"). |
| `releaseDate` | texto | sí | Ver "Fechas". |
| `year` | entero | sí | Año del lanzamiento. |
| `type` | `album`, `ep`, `single`, `live`, `mixtape` o `compilation` | sí | |
| `format` | texto | sí | Legible, p. ej. "Single · digital". |
| `label` | texto | no | "PHŌNÉ Records" cuando el sello lo edita. |
| `description` | `{ es, en }` | sí | Sin frases que caduquen al pasar la fecha (`pnpm test:releases`, guardia TEMPORAL). |
| `tracklist` | lista de `{ n, title, duration?, composer?, guests? }` | no | `n` entero; `duration` "m:ss". |
| `credits` | lista de `{ role, name }` | no | |
| `links` | lista de `{ label, href }` | no | `label` en español o nombre de plataforma; las etiquetas en español necesitan su traducción en `LINK_LABEL_EN` (`lib/releases.ts`). |
| `cover` | texto | no | `/releases/<slug>.jpg`. |
| `featuredArtistSlugs` | lista de textos | no | Artistas del roster coacreditados. |
| `smartLink` | URL | no | Pre-save o enlace a todas las plataformas: maneja el botón principal de la ficha. |

El video de la ficha no se escribe aquí: sale de `content/videos/` por `releaseSlug` (`releaseVideo`).

## videos

| Campo | Tipo | Obligatorio | Regla |
|---|---|---|---|
| `slug` | texto | sí | `<slug del artista>-<título en kebab>`; es la URL `/videos/<slug>`. |
| `youtubeId` | texto | sí | 11 caracteres. |
| `title` | texto | sí | Título oficial, tal como está en YouTube. |
| `displayTitle` | texto o `{ es, en }` | no | Título limpio para tarjetas y h1, sin el artista ni etiquetas ("Video Oficial"…). Objeto solo si cambia por idioma. |
| `artistSlug` | texto | sí | Slug de un artista de `content/artists/`. |
| `artistName` | texto | sí | |
| `kind` | `videoclip`, `sesion`, `en-vivo`, `lyric`, `visualizer`, `documental` o `entrevista` | sí | |
| `date` | texto | sí | Ver "Fechas". |
| `recordedYear` | entero | no | Solo si consta y difiere del año de publicación. |
| `durationSec` | entero | no | Duración en segundos. |
| `releaseSlug` | texto | no | Slug de `content/releases/` si el video corresponde a una ficha. |
| `description` | `{ es, en }` | sí | Texto propio, 80–160 palabras, párrafos separados por `\n\n`. |
| `credits` | lista de `{ role, name }` | no | Solo lo que consta en la descripción oficial o en la ficha. |
| `featured` | `true` | no | Va primero en la ficha del artista (máximo 6 por artista). Si no, se omite. |
| `thumb` | `"hqdefault"` | no | Solo si YouTube no tiene `maxresdefault` para ese video (comprobado con `curl -I`). |

## events

| Campo | Tipo | Obligatorio | Regla |
|---|---|---|---|
| `slug` | texto | sí | `<prefijo del artista>-<AAAA-MM-DD>-<ciudad en inglés, kebab>`, p. ej. `newen-2026-08-20-innsbruck`. El prefijo de Newen Afrobeat es `newen`; para otro artista, su slug. No aparece en ninguna URL: es la clave estable de la fila. |
| `date` | texto | sí | Ver "Fechas". |
| `artistSlug` | texto | sí | |
| `artistName` | texto | sí | |
| `venue` | texto | sí | |
| `city` | texto | sí | En español, como se muestra. |
| `country` | texto | sí | En español, como se muestra. |
| `countryCode` | texto | sí | ISO-3166 alfa-2 en mayúsculas. |
| `status` | `scheduled`, `tentative` o `cancelled` | sí | Lo que se publica, no la planificación interna. |
| `ticketsUrl` | URL | no | |
| `notes` | `{ es?, en? }` | no | |

## journal

| Campo | Tipo | Obligatorio | Regla |
|---|---|---|---|
| `slug` | texto | sí | El mismo en ES y EN; es la URL `/journal/<slug>`. |
| `title` | `{ es, en }` | sí | 60 caracteres como máximo. |
| `excerpt` | `{ es, en }` | sí | 140–160 caracteres ideal, 200 como máximo. |
| `body` | `{ es: bloques, en: bloques }` | sí | Cada bloque lleva `type`: `paragraph { text }`, `heading { text }`, `quote { text, cite? }`, `image { alt, caption?, src, width, height, credit }`, `video { youtubeId, title, thumb? }` o `release { slug }`. |
| `publishAt` | texto | sí | Ver "Fechas". |
| `author` | texto | sí | "PHŌNÉ Records" firma como el sello. |
| `artists` | lista de textos | sí | Al menos un slug de `content/artists/`. |
| `releases` | lista de textos | sí | Slugs de `content/releases/` (puede ir vacía). |
| `cover` | objeto | sí | `{ src, width, height, credit, alt: { es, en }, position?, mobile?: { src, width, height } }`; imágenes en `public/journal/<slug>/`. |
| `format` | `cronica`, `track-by-track`, `entrevista`, `archivo` o `detras-del-disco` | sí | |

`pnpm test:journal` valida además las imágenes, los offsets de `publishAt` y las relaciones.

## Agregar una entrada a mano

1. Copiar un JSON parecido de la misma carpeta y guardarlo como `content/<colección>/<slug>.json`, con el mismo slug en el campo `slug`.
2. Completar los campos según la tabla de la colección. Si es un artista o un lanzamiento, darle un `order` libre.
3. `pnpm content:index` (solo al crear, borrar o renombrar archivos).
4. `pnpm test:content` y la prueba de la colección: `test:roster` (artistas), `test:releases` (lanzamientos), `test:videos` (videos), `test:banners` (fechas de gira) o `test:journal`.
5. Commit del JSON junto con el `content/generated/<colección>.ts` que cambió.

Editar un campo de un archivo existente (por ejemplo, agregar el enlace de Spotify el día del estreno) es solo el paso 4.

El carrusel de la portada no vive aquí: sigue en `lib/banner.ts`.

## Notas de verificación

Procedencia de algunos datos, que antes iba como comentario junto al literal en `lib/`.

| Archivo | Nota |
|---|---|
| `artists/newen-afrobeat.json` | Enlace de Discogs: de las relaciones de MusicBrainz y de Wikidata (P1953), verificado el 29-10-2026. |
| `artists/newen-afrobeat.json` | `sameAs`: MusicBrainz (Group, CL, afrobeat; mismo canal de YouTube y Bandcamp) y Wikidata (P434 = ese MBID). |
| `releases/rosario-lircay-en-vela.json` | Spotify: del smartlink; verificado con el oEmbed de Spotify (título "En Vela") el 24-10 y el 26-10-2026. |
| `releases/newen-afrobeat-la-fuerza.json` | Apple Music verificado con iTunes Lookup el 29-10-2026 ("La Fuerza - Single", Newen Afrobeat, 2026-10-30, 1 tema). Spotify: el smart link apunta a open.spotify.com/album/7pDBGQqk3zOhnKhjz95SUZ, pero el oEmbed da 404 hasta el estreno. El 30-10, si el oEmbed lo confirma, reemplaza a "Spotify (artista)" con la etiqueta "Spotify" (el perfil ya está en la ficha del artista). |
| `releases/klaus-b-un-rezo.json` | Apple Music verificado con iTunes Lookup el 29-10-2026 ("Un Rezo - Single", Klaus B, 2026-11-05, 1 tema). Spotify: el smart link de ONErpm no trae el id; se agrega el 05-11 tras el oEmbed. |
| `releases/klaus-b-destellos-de-ti.json` | Spotify: del smartlink; verificado con el oEmbed de Spotify (título "Destellos de Ti") el 24-10 y el 26-10-2026. |
| `releases/con-fusion-cuantas-veces.json` | Enlaces en el orden estándar (Bandcamp · Discogs · Apple Music · Spotify · YouTube). Spotify sin verificar todavía (no hay smartlink y la API pública de song.link ya no responde). |
| `videos/newen-afrobeat-no-les-creere.json` | `thumb`: sin maxresdefault (curl -I, 21-10-2026). |
| `videos/klaus-b-quisiera-entender.json` | `thumb`: sin maxresdefault (curl -I, 21-10-2026). |
| `videos/con-fusion-tiny-plants.json` | `thumb`: sin maxresdefault (curl -I, 21-10-2026). |
| `videos/ecamhi-planet-earth.json` | `thumb`: sin maxresdefault (curl -I, 21-10-2026). |

## CMS

El esquema calza con colecciones de Keystatic (`path: "content/<colección>/*"`, `format: { data: "json" }`, `slugField: "slug"`), pero Keystatic **no está instalado**: depende de la GitHub App (X13), y un `/keystatic` en modo local no puede quedar expuesto en producción. La configuración equivalente y lo que falta probar están en el reporte del carril S del p19.
