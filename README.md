# drcoayla.net — Web del Dr. Guillermo Coayla

Sitio estático (HTML + CSS + JS, sin dependencias) publicado en Cloudflare Workers. Cada cambio en `main` se publica solo.

| Página | URL | Contenido |
|---|---|---|
| `index.html` | `/` | Portada: hero, formación internacional, especialidades, cuestionario, trayectoria, pacientes de provincias y del extranjero, guías y preguntas frecuentes |
| `pancreas.html` | `/pancreas` | Página de autoridad: enfermedades y cirugías del páncreas |
| `operacion-whipple.html` | `/operacion-whipple` | Guía completa de la operación de Whipple |
| `higado-vias-biliares.html` | `/higado-vias-biliares` | Cirugía de hígado y vías biliares |
| `vesicula.html` | `/vesicula` | Captación: colecistectomía laparoscópica |
| `hernias.html` | `/hernias` | Captación: hernias |
| `segunda-opinion.html` | `/segunda-opinion` | Segunda opinión para Perú y el extranjero |
| `guias.html` | `/guias` | Índice de guías para pacientes |
| `quiste-de-pancreas.html`, `cuando-operar-la-vesicula.html`, `lesion-de-via-biliar.html` | | Artículos SEO |
| `404.html` | | Página de error |

**SEO técnico:** URLs limpias (sin `.html`), `sitemap.xml`, `robots.txt`, datos estructurados Schema.org (`Physician`, `MedicalWebPage`, `MedicalProcedure`, `FAQPage`, `BreadcrumbList`, `Article`) e imagen para redes `assets/og-image.jpg`.
**Publicación:** `wrangler.jsonc`, `_headers` (seguridad y caché) y `.assetsignore` (evita publicar `.git` y los `.md`).

**Cómo verla en local:** `npx wrangler dev` (los enlaces usan URLs limpias, así que abrir el HTML directamente no navega bien).

**Pendiente:**
- Fotos en `assets/`: `dr-coayla.jpg` (retrato) y `dr-coayla-quirofano.jpg`. Mientras no existan, se muestra el monograma "GC".
- N.º de CMP y RNE en el pie de página.
- Testimonios reales con consentimiento (hay una plantilla comentada en `index.html`).
- Revisión médica de los textos de las guías.
- Conectar el dominio `www.drcoayla.net` al Worker en Cloudflare: las URLs canónicas y el sitemap ya apuntan a ese dominio.

El número de WhatsApp se cambia en una sola línea: `WA_NUMBER` en `assets/main.js`.
