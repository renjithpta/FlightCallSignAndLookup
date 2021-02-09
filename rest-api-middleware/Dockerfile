FROM node:8.17.0-alpine
RUN apk add g++ make python

# Change working directory
WORKDIR /app

# Update packages and install dependency packages for services



# Install npm production packages
COPY package.json /app/
RUN cd /app; npm install

COPY . /app

ENV NODE_ENV PRODUCTION
ENV PORT 5000

EXPOSE 5000

CMD ["npm", "run", "start"]