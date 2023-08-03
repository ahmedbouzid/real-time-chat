# Specify node version and image
# Name image development
FROM node:18 AS development


# SPECIFY WORKING DIR INSIDE DIR
WORKDIR /dev2/src/app
#Copy package-lock.json & package.json from host to inside container working directory

COPY package*.json ./


#  install deps inside container
RUN npm install

# Bundle app soource
COPY . .
RUN npm run build
EXPOSE 3000

## Production ####
### Build another image ####
FROM node:18 AS production 


ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}


# Set workdir
WORKDIR /dev2/src/app

COPY --from=development /dev2/src/app/ .
EXPOSE 3000 
 

 # run app 
 CMD [ "node","dist/main" ]