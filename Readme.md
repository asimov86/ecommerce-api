# ecommerce-api

## Configuración de variables de entorno

Este proyecto utiliza variables de entorno para manejar configuraciones sensibles (como la conexión a la base de datos y claves secretas). Para configurar el entorno:

1. Duplica el archivo `.env.example` que se encuentra en la raíz del proyecto.
2. Renómbralo a `.env`.
3. Completa los valores de las variables de entorno según tu entorno de desarrollo o producción.

### Variables requeridas:

- **MONGO_URI**: URI a la base de datos MongoDB .
- **JWT_SECRET**: Clave secreta para firmar los tokens JWT.
- **SERVICE_MAILING**: Host del servidor SMTP para enviar correos (en mi caso usé gmail).
- **PORT_MAILING**: Puerto del servidor SMTP.
- **EMAIL_USER**: Usuario del servidor SMTP.
- **EMAIL_PASS**: Contraseña del servidor SMTP.
- **PORT**: Puerto en el que se ejecutará la API (por defecto `5000`).

## Pasos para usar el archivo `Dockerfile`:

1. **Construir la imagen**:

   Desde el directorio donde se encuentra el `Dockerfile`, ejecuta:

   ```bash
   docker build -t ecommerce-api .
   ```

   Esto construirá una imagen llamada `ecommerce-api`.

2. **Levantar el contenedor**:

   Ejecuta el siguiente comando para correr el contenedor basado en la imagen que acabas de construir:

   ```bash
   docker run -d -p 5000:5000 ecommerce-api
   ```

   Aquí, el contenedor estará disponible en el puerto 5000 de tu máquina host.

### Verificación:

- Usa el comando `docker ps` para asegurarte de que el contenedor esté corriendo.


## Documentación de la API

Este proyecto incluye la documentación de la API generada con **Swagger**. Después de iniciar el servidor, puedes acceder a la documentación interactiva en la siguiente ruta:

```
http://localhost:5000/api-docs/
```

### Cómo acceder a la documentación

Abre tu navegador y visita la siguiente URL:

   ```
   http://localhost:5000/api-docs/
   ```

   Esta URL te llevará a una interfaz gráfica interactiva donde podrás visualizar y probar los endpoints de la API.

### Swagger UI

La documentación de Swagger te permitirá:
- Ver todos los endpoints disponibles en la API.
- Probar los endpoints directamente desde la interfaz gráfica.
- Ver los detalles de las peticiones y respuestas (como los parámetros, headers y cuerpos de respuesta).

## Limitaciones actuales

### Documentación incompleta

- **Documentación pendiente**: Actualmente, no todos los endpoints de la API están completamente documentados en **Swagger**. Estamos trabajando para agregar la documentación completa de los endpoints que faltan. Si encuentras algún endpoint sin documentación o con información limitada, ten en cuenta que estamos en proceso de actualizarlo.

### Configuración de entorno

- **API solo disponible en localhost**: Por ahora, la API está configurada para funcionar exclusivamente en **localhost**. Si deseas desplegarla en un entorno remoto o en producción, deberás modificar la configuración de red y de las variables de entorno.
