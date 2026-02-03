FROM node:lts

WORKDIR /app
COPY .env .
COPY tsconfig.json .
COPY package.json .
COPY . .
RUN npm install
RUN npm run build

EXPOSE 1234
CMD ["npm", "start"]