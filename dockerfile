FROM node:18 AS build

WORKDIR /app


COPY package*.json ./


RUN yarn install


COPY . .


RUN yarn build


FROM node:18-slim


WORKDIR /app


COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./


RUN yarn install --only=production


EXPOSE 3000


CMD ["node", "./dist/index.js"]
