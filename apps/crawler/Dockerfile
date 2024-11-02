FROM node:20-alpine As development

WORKDIR /usr/src/app

COPY apps/crawler/package.json ./
COPY apps/crawler/package-lock.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

COPY apps/crawler apps/crawler
COPY libs libs

RUN npm install

RUN npm run build crawler

FROM node:20-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY apps/crawler/package.json ./
COPY apps/crawler/package-lock.json ./

RUN npm install --prod

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/crawler/main"]