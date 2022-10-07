FROM node:16
WORKDIR /usr/src/app

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json tsconfig.json

RUN mkdir /secrets
RUN npm install

COPY src/. src/.
COPY includes/. includes/.

EXPOSE 56935
CMD [ "npm", "start" ]