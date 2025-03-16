# Step 1: Build a React App
FROM node:alpine3.18 as build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# Step 2 Serve build phone with nginx
FROM ngins:1.23-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=dist /app/dist .
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]