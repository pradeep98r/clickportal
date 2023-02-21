FROM node:slim as build

RUN mkdir -p /app
WORKDIR /app
COPY . /app


# Install libpng-dev to fix the deployment issue

RUN apt-get update -y
RUN sudo apt-get install libpng-dev
RUN npm install -g pngquant-bin

# Rebuild the npm 
RUN npm rebuild

RUN npm install --force

#    && \
#    npm audit fix --force
#-g npm@7.18.1 \
#    && npm audit fix \
#    && npm install

RUN npm run build


# Use official nginx image as the base image
FROM nginx:latest

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/build /usr/share/nginx/html
COPY ./conf/default.conf /etc/nginx/conf.d/

# Expose port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
