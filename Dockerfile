# Usar Debian como imagen base
FROM debian:latest

# Instalar Node.js y npm en Debian
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs

# Crear directorio de trabajo para la aplicación
WORKDIR /usr/src/app

# Copiar el package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar todo el contenido del proyecto (carpetas y archivos) al contenedor
COPY . .

# Exponer el puerto en el que la API escuchará (modificar si usas otro puerto)
EXPOSE 5000

# Definir el comando por defecto para iniciar la aplicación
CMD ["npm", "start"]

