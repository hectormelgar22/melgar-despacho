# Guía de despliegue — Melgar & Asociados

Web estática (HTML + CSS + JS, sin dependencias ni build). Se sube tal cual
a cualquier hosting. Esta guía cubre **qué rellenar antes de publicar**, **cómo
subirla a Hostinger** y **cómo comprobar que todo funciona**.

> Trabaja siempre sobre una copia y prueba en local antes de subir:
> ```
> python -m http.server 4173
> ```
> y abre http://localhost:4173

---

## 1. Datos que hay que sustituir antes de publicar

Todo lo provisional está marcado en el código con `TODO` y con el marcador
visual `todo-data`. Esta es la lista completa, de mayor a menor prioridad.

### 1.1 Dominio real (aparece en 19 ficheros)
Es lo primero. Sustituye `www.melgarabogados.es` por tu dominio en **todos**
los ficheros a la vez. Desde la carpeta del proyecto:

```bash
# Linux / Mac / Git Bash
grep -rl "www.melgarabogados.es" . | xargs sed -i 's/www\.melgarabogados\.es/TU-DOMINIO.es/g'
```
```powershell
# Windows PowerShell
Get-ChildItem -Recurse -Include *.html,*.xml,*.txt,*.webmanifest |
  ForEach-Object { (Get-Content $_ -Raw) -replace 'www\.melgarabogados\.es','TU-DOMINIO.es' |
  Set-Content $_ -Encoding utf8 }
```
Afecta a: `canonical`, `og:url`, `og:image`, `twitter:image`, JSON-LD,
`robots.txt`, `sitemap.xml`, `site.webmanifest` y `.well-known/security.txt`.

Decide además **www o sin-www** y actívalo en `.htaccess` (sección 1, bloque
comentado "canonicalización de dominio").

### 1.2 Teléfono (17 ficheros)
Provisional: `+34 910 000 000`. Aparece en la cabecera, el pie, los CTA y el
enlace `tel:`. Sustituye las dos formas:
- Texto visible: `+34 910 000 000`
- Enlaces: `tel:+34910000000`

### 1.3 WhatsApp (17 ficheros)
Botón flotante. Provisional: `wa.me/34910000000`. Cámbialo por el número real
con prefijo internacional sin `+` ni espacios (ej. `wa.me/34600123123`).

### 1.4 Email (4 ficheros)
Provisional: `contacto@melgarabogados.es` (y `seguridad@…` en `security.txt`).

### 1.5 Dirección (Serrano 41 es provisional)
En `index.html`: sección «Cómo llegar», el bloque de Contacto y el mapa
(`data-map-src` y el enlace a Google Maps). Pon la dirección real y las
coordenadas del mapa.

### 1.6 Datos de colegiación y sociales (marcador `todo-data`)
Números de colegiado ICAM del pie y de cada ficha de abogado, y datos
societarios (razón social, NIF, domicilio) en `aviso-legal.html`.

### 1.7 Contenido que debe revisar un abogado
- **Textos legales** (`aviso-legal`, `privacidad`, `cookies`): completar y
  revisar. Mientras sean plantilla están en `noindex` a propósito; cuando estén
  finalizados, cambia `noindex, follow` → `index, follow` y vuelve a añadirlas
  a `sitemap.xml`.
- **Fichas del equipo** (`abogado-*.html`): nombres, formación, experiencia y
  «asuntos representativos» son **ficticios**. Sustituir por datos reales,
  siempre anonimizando los casos y sin prometer resultados.
- **Testimonios** de la portada: ficticios.
- **Herramientas**: los plazos de `calculadora-plazos.html`, las duraciones de
  `timeline-proceso.html` y los documentos de `checklist-consulta.html` deben
  validarse jurídicamente.
- **Cifras** de «Por qué elegirnos» (valoración, % sin juicio, fecha del dato).

### 1.8 Analítica (opcional)
En `index.html` hay un bloque GA4 comentado con `G-XXXXXXXXXX`. Si se usa,
pon el ID real y descomenta. El Consent Mode v2 ya está configurado (RGPD).

### 1.9 Datos estructurados de negocio (JSON-LD)
En `index.html`, dentro del `<head>`, hay un bloque **comentado**
`LegalService` con teléfono, dirección, horario y coordenadas. Cuando tengas
los datos reales, rellénalo y quita los delimitadores `<!-- … -->` para
activarlo. Los bloques `WebSite`, `FAQPage` y `BreadcrumbList` ya están activos
(no contienen datos de contacto, solo estructura y contenido real).

---

## 2. Imágenes reales

Sustituye los `.webp` de `assets/img/` manteniendo **los mismos nombres de
fichero** (así no hay que tocar el HTML):
- `hero-columnas.webp` — cabecera de portada
- `despacho-interior.webp` — imagen del despacho
- `abogado-1/2/3.webp` — retratos del equipo (también salen en sus fichas)
- `oficina-recepcion / sala-reuniones / biblioteca / fachada.webp` — galería
- `og-image.jpg` — tarjeta social (1200×630)

Exporta a WebP (calidad ~82) y respeta las proporciones actuales para que no
descuadre. Los iconos (`favicon-*`, `apple-touch-icon`, `icon-*`) puedes
regenerarlos si cambia el logotipo.

---

## 3. Subir a Hostinger

Hostinger usa Apache/LiteSpeed, así que el `.htaccess` incluido funciona tal
cual (HTTPS forzado, cabeceras de seguridad, compresión y caché).

1. **Panel de Hostinger → Administrador de archivos** (o FTP con FileZilla).
2. Entra en la carpeta **`public_html`**.
3. Sube **todo el contenido del proyecto** conservando la estructura de
   carpetas (`assets/`, `css/`, `js/`, `.well-known/`).
   - **Sí subir:** todos los `.html`, `css/`, `js/`, `assets/`, `.htaccess`,
     `robots.txt`, `sitemap.xml`, `site.webmanifest`, `.well-known/`,
     `404.html`, `favicon.svg`.
   - **NO subir** (son de desarrollo): `README.md`, `DESPLIEGUE.md`,
     `.gitignore`, `.nojekyll`, la carpeta `.git/` y la carpeta `.claude/`.
     *(El `.htaccess` ya bloquea el acceso a `.md`, `.git` y ficheros ocultos
     por si acaso, pero es más limpio no subirlos.)*
4. Comprueba que el `.htaccess` se ha subido (el Administrador de archivos
   oculta los ficheros que empiezan por punto; actívalos con «Mostrar ficheros
   ocultos»).
5. En Hostinger, activa el **SSL gratuito** (Seguridad → SSL) y espera a que el
   candado esté activo. El `.htaccess` ya redirige todo a HTTPS.

---

## 4. Comprobaciones tras publicar

| Qué | Dónde | Qué esperar |
|-----|-------|-------------|
| HTTPS y redirección | abrir `http://tudominio` | debe saltar a `https://` |
| Cabeceras de seguridad | securityheaders.com | nota **A** o superior |
| SSL | ssllabs.com/ssltest | nota **A** |
| Datos estructurados | search.google.com/test/rich-results | WebSite, FAQ y BreadcrumbList sin errores |
| Tarjeta social | opengraph.xyz o el depurador de Facebook | imagen y textos correctos |
| Rendimiento | pagespeed.web.dev | verde en móvil y escritorio |
| Móvil | probar en un teléfono real | menú, herramientas y WhatsApp |

### Posicionamiento (hacer una vez)
1. **Google Search Console**: da de alta el dominio, verifica la propiedad y
   envía `sitemap.xml`.
2. **Bing Webmaster Tools**: lo mismo (Bing alimenta a varios buscadores y a
   asistentes de IA).
3. **Google Business Profile**: crea la ficha del despacho (nombre, dirección,
   teléfono, horario). Es lo que más mueve el SEO local de un despacho.
4. Comparte la web una vez en las redes del despacho para que los rastreadores
   sociales generen las tarjetas.

---

## 5. Actualizaciones posteriores

- Si editas `css/styles.css` o `js/main.js`, **sube el número de `?v=`** en los
  `<link>`/`<script>` de las 17 páginas (ahora `?v=5`). Sin eso, los visitantes
  recurrentes seguirían con la versión cacheada.
- La cabecera, el pie, el banner de cookies y el botón de WhatsApp están
  copiados en cada página (no hay plantillas): si tocas una de esas piezas,
  replícala en las 17.
- Si añades páginas, inclúyelas en `sitemap.xml` con su `<lastmod>`.
