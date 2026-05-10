# Core Hoodie Store

Mini ecommerce estatico para una unica referencia de hoodie con variantes de color, talla y contacto directo por WhatsApp. No usa base de datos: toda la informacion vive en `products.json` y puede editarse desde GitHub.

## Archivos principales

```text
index.html       # Estructura de la tienda
styles.css       # Diseno visual
app.js           # Logica de variantes y WhatsApp
products.json    # Datos editables del producto
vercel.json      # Configuracion Vercel
products/        # Fotos servidas como /products/...
```

## Configurar WhatsApp

Edita `products.json` y agrega tu numero con codigo de pais, sin `+`, espacios ni guiones:

```json
"whatsapp": "573001234567"
```

Si `whatsapp` queda vacio, el boton abre WhatsApp con el mensaje preparado, pero no lo dirige a un numero especifico.

## Banner superior y CDN

El banner rectangular superior se configura en `products.json`:

```json
"banner": {
  "enabled": true,
  "image": "/products/banner-hoodies.jpg",
  "href": "",
  "alt": "Banner promocional Core Hoodie"
}
```

`image` puede ser una ruta local o una URL completa de CDN, por ejemplo:

```json
"image": "https://cdn.tumarca.com/banners/hoodies-drop.jpg"
```

`href` tambien puede ser una URL completa si quieres que el banner lleve a otra pagina, campaña o link externo. Las fotos de variantes tambien pueden apuntar a CDN usando URLs completas dentro de `photos`.

## Editar producto

Modifica `products.json`:

- `brand`: nombre de la tienda o marca.
- `currency`: moneda para precios.
- `whatsapp`: numero de contacto.
- `product.reference`: referencia base.
- `product.name`: nombre comercial.
- `product.description`: descripcion principal.
- `product.details`: lista de detalles.
- `product.price`: precio numerico.
- `product.sizes`: tallas globales.
- `product.sizeGuide`: tabla de medidas.
- `product.variants`: colores disponibles.

Cada variante controla:

```json
{
  "color": "Negro",
  "slug": "negro",
  "hex": "#111111",
  "availableSizes": ["S", "M", "L", "XL"],
  "stockLabel": "Disponible",
  "photos": [
    "/products/core-hoodie-negro-1.jpg",
    "/products/core-hoodie-negro-2.jpg"
  ]
}
```

## Fotografias

Guarda las fotos en la carpeta `products/` de la raiz del proyecto.

Ejemplo:

```text
products/core-hoodie-negro-1.jpg
products/core-hoodie-negro-2.jpg
products/core-hoodie-gris-1.jpg
```

Y referencia esas imagenes en `products.json` con rutas como:

```json
"/products/core-hoodie-negro-1.jpg"
```

## Probar localmente

```bash
python3 -m http.server 4173
```

Abre:

```text
http://127.0.0.1:4173/
```

## Desplegar en Vercel

Importa el proyecto en Vercel. No requiere build command.
