# Newsletter (K0)

Las suscripciones llegan desde tres lugares: bloque "Newsletter" en `/contacto` (`source: contacto`), portada (`home`) y la casilla opcional del formulario de contacto (`contacto-form`).

## Con y sin base de datos

- **Sin `DATABASE_URL`**: cada alta se envía como correo interno ("Nueva suscripción newsletter") al buzón del sello, vía `lib/mail.ts` (`ZOHO_SMTP_*`). Si el correo falla, la persona ve "intenta de nuevo" y el log del servidor registra una línea JSON `newsletter_subscription_lost` con el email enmascarado.
- **Con `DATABASE_URL`**: upsert en la tabla `subscribers` (Postgres). Si la base falla en un envío, se cae al correo.

## Conectar Neon desde Vercel

1. Vercel, proyecto phonerecords, pestaña Storage (o Marketplace), Neon, "Create / Connect". Vercel crea `DATABASE_URL` en los entornos del proyecto.
2. Agrega `SUBSCRIBER_SALT` (cadena aleatoria larga, por ejemplo `openssl rand -hex 32`) en Settings, Environment Variables.
3. Trae las variables a local: `vercel env pull .env.local`.
4. Crea la tabla: `pnpm db:push` (lee `DATABASE_URL`; con `export $(grep DATABASE_URL .env.local)` o `set -a; source .env.local; set +a` antes). La migración SQL versionada está en `drizzle/`; si cambias `lib/db/schema.ts`, corre `pnpm db:generate`.
5. Redeploy.

## Ver suscriptores (hasta que exista /admin)

En la consola SQL de Neon (o `psql "$DATABASE_URL"`):

```sql
select email, lang, source, status, consent_at
from subscribers
order by created_at desc
limit 100;

-- Resumen por origen
select source, status, count(*) from subscribers group by 1, 2 order by 1, 2;

-- Dar de baja manualmente
update subscribers
set status = 'unsubscribed', unsubscribed_at = now(), updated_at = now()
where email = 'persona@ejemplo.com';
```

## Notas

- `email` se guarda en minúsculas. `ip_hash` es sha256(IP + `SUBSCRIBER_SALT` + fecha UTC); nunca se guarda la IP. Si falta `SUBSCRIBER_SALT` (o la IP), `ip_hash` queda en `null`: defínela antes de abrir al público.
- Reinscripción de alguien `unsubscribed`: vuelve a `subscribed`, se actualiza `consent_at` y el texto de consentimiento.
- Estado por defecto `subscribed`; el doble opt-in (`pending`) llega en K2.
- Antibot del bloque independiente: honeypot `website` y mínimo 2 s desde el render; honeypot: éxito silencioso sin guardar; envío demasiado rápido: error genérico. La UI responde el mismo mensaje para alta nueva, repetida o reactivada (no revela si un correo ya estaba suscrito); el detalle va solo al log.
