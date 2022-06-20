FROM node:slim as build

RUN mkdir -p /app
WORKDIR /app
COPY . /app

RUN npm install --no-audit
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

# Expose port 80
EXPOSE 80
