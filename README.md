# Melgar & Asociados — Web del despacho

Web estática premium para despacho de abogados en Madrid. Sin dependencias ni build:
HTML + CSS + JavaScript vanilla, lista para desplegar en cualquier hosting.

## Estructura

```
index.html                    Landing principal
derecho-penal.html            Área I   — Derecho Penal
derecho-civil.html            Área II  — Derecho Civil
derecho-laboral.html          Área III — Derecho Laboral
familia-matrimonio.html       Área IV  — Familia y matrimonio
derecho-mercantil.html        Área V   — Derecho Mercantil
negligencias-accidentes.html  Área VI  — Negligencias médicas y accidentes
aviso-legal | privacidad | cookies .html   Páginas legales (estructura base)
404.html                      Página de error (GitHub Pages y Hostinger)
css/styles.css                Sistema de diseño completo
js/main.js                    Interacciones (menú, slider, cookies, formulario)
assets/img/                   Imágenes WebP (placeholders — sustituir por fotos reales)
.htaccess                     Seguridad y caché en Hostinger/Apache (GitHub Pages lo ignora)
robots.txt + sitemap.xml      SEO (actualizar dominio)
```

## Vista previa local

```
python -m http.server 4173
```

y abrir http://localhost:4173

## Despliegue

**GitHub Pages**: Settings → Pages → Deploy from a branch → `main` / `/ (root)`.
La web queda en `https://<usuario>.github.io/<repo>/` (rutas relativas: funciona sin cambios).

**Hostinger**: subir todo el contenido del proyecto a `public_html/` (el `.htaccess`
incluido activa HTTPS forzado, cabeceras de seguridad, compresión y caché).

> Al modificar `css/styles.css` o `js/main.js`, subir el número de versión del
> parámetro `?v=` en los `<link>` y `<script>` de las 11 páginas. Sin eso, los
> visitantes recurrentes seguirían usando la copia cacheada durante un mes.

## Pendiente antes del lanzamiento real

- [ ] Sustituir teléfono, dirección y email provisionales (buscar `TODO` y `todo-data`)
- [ ] Números de colegiado ICAM y datos societarios en las páginas legales
- [ ] Descomentar el bloque JSON-LD de `index.html` al tener datos reales
- [ ] Sustituir el dominio placeholder en `canonical`, `og:url`, `robots.txt` y `sitemap.xml`
- [ ] Fotos reales del equipo y despacho (WebP) en lugar de los placeholders
      (incluidas las cuatro de `assets/img/oficina-*.webp`)
- [ ] Dirección real en «Cómo llegar», en Contacto y en el `data-map-src` del mapa
- [ ] Cifras reales en «Por qué elegirnos» (valoración, % sin juicio, fecha del dato)
- [ ] Número de WhatsApp real en el botón flotante de las 11 páginas
- [ ] Testimonios reales (los actuales son ficticios)
- [ ] Backend del formulario de contacto (repetir validación y honeypot en servidor)
- [ ] ID real de GA4 en el script comentado (Consent Mode v2 ya configurado)
- [ ] Revisión de textos legales por un abogado
