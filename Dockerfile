FROM node:latest
WORKDIR /app
COPY . /app
RUN npm install
RUN echo test
CMD ["npm","start"]
EXPOSE 6969