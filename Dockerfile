FROM mhart/alpine-node:14

WORKDIR /src

COPY package.json /src
RUN npm install
ADD . .
EXPOSE 80

CMD ["npm", "start"]