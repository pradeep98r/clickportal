#FROM node:16-alpine as build-stage
#
#WORKDIR /app
#RUN apk add --update --no-cache \
#            chromium \
#            nodejs \
#            npm
#
#ENV PATH /app/node_modules/.bin:$PATH
#ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
#ENV CHROMIUM_PATH /usr/bin/chromium-browser
#ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser
#
#COPY package.json ./
#COPY package-lock.json ./
#COPY . .
#RUN ./bin/build.sh
#
###EXPOSE 3000
###
###CMD ["npm", "start"]
#
#
FROM nginx:latest
#COPY --from=build-stage /app/build /usr/share/nginx/html
COPY build /usr/share/nginx/html
COPY ./conf/default.conf /etc/nginx/conf.d/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
