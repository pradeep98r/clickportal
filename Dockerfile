FROM node:16-alpine3.16 as build

RUN mkdir -p /app
WORKDIR /app
COPY . /app


RUN apk add pngquant  bash \
    libpng-dev \
    gcc \
    g++ \
    make

RUN npm install --force

RUN npm run build


# Use official nginx image as the base image
FROM nginx:latest

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/build /usr/share/nginx/html
COPY ./conf/default.conf /etc/nginx/conf.d/

# Expose port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
