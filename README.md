# nova-ceruleo-web

Sitio oficial de Nova Ceruleo. Estático: HTML y CSS sin dependencias ni paso de compilación.

- Contenido publicado: carpeta `public/` (Cloudflare Pages, sin comando de compilación, directorio de salida `public`).
- Cada push a `main` publica en producción (`nova-ceruleo-web.pages.dev`); las demás ramas generan vistas previas.
- Capturas: tomadas del juego (`shots/` del repositorio principal), recortadas y convertidas a WebP.

Probar localmente: `python3 -m http.server -d public 8080` y abrir http://localhost:8080.
