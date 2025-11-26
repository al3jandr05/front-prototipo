# Dockerfile.dev
FROM node:18-alpine

WORKDIR /app

# Copiamos los archivos de configuración
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Exponemos el puerto 3000 que usa CRA por defecto
EXPOSE 3000

# Para que CRA escuche desde el contenedor
ENV HOST 0.0.0.0

# Comando para correr en modo desarrollo
CMD ["npm", "start"]