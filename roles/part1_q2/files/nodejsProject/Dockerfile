FROM node:14.15.1
EXPOSE 5000
WORKDIR /usr/app
COPY ./dist/ ./

RUN npm install

CMD ["npm","start"]