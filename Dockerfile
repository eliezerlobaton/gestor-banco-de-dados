FROM node:18

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

COPY ./.env.prod ./.env

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start:prod"]
