FROM node:latest

WORKDIR /app/medusa

COPY . .

RUN apt-get update && apt-get install -y python3 python3-pip python-is-python3

RUN yarn global add @medusajs/medusa-cli

RUN yarn

RUN yarn build

what this command does?:

RUN yarn install --production --ignore-engines

CMD medusa migrations run && yarn start
