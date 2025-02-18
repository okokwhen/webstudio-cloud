FROM node:20-alpine AS dependencies-env
RUN apk add --no-cache sqlite
COPY .npmrc package.json /app/
WORKDIR /app
RUN npm install
RUN npm install libphonenumber-js

FROM dependencies-env AS build-env
COPY . /app/
WORKDIR /app
RUN npm run build

FROM node:20-alpine
RUN apk add --no-cache sqlite
COPY .npmrc package.json /app/
COPY --from=dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
COPY --from=build-env /app/public /app/public
COPY --from=build-env /app/sqlite.db* /app/
WORKDIR /app
CMD ["npm", "run", "start"]
