FROM node:18-alpine AS build

# Arg
ARG DEVOPS_ACCOUNT_ID
ARG AWS_DEFAULT_REGION

# Install
RUN apk --no-cache add python3 py3-pip
RUN pip install pip==21.3.1 &&\
    pip3 install pip==21.3.1 &&\
    python -m pip install pip==21.3.1 &&\
    python3 -m pip install pip==21.3.1
RUN pip3 install --no-cache-dir awscli

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY --chown=node:node  package*.json ./

RUN ["node", "-e", "\
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));\
const pkgLock = JSON.parse(fs.readFileSync('package-lock.json', 'utf-8'));\
fs.writeFileSync('package.json', JSON.stringify({ ...pkg, version: '0.0.0' }));\
fs.writeFileSync('package-lock.json', JSON.stringify({ ...pkgLock, version: '0.0.0' }));\
"]

# Config aws-cli
RUN aws codeartifact login --tool npm --repository npm-private --domain avalsolucionesdigitales --domain-owner $DEVOPS_ACCOUNT_ID --region $AWS_DEFAULT_REGION

# Install app dependencies
RUN npm install

# Bundle app source
COPY --chown=node:node . .

# Creates a "dist" folder with the production build
RUN npm run build

ENV NODE_ENV production

USER node

FROM node:18-alpine AS production

RUN apk update
RUN export TZDATA_PACKAGE=$(apk search 'tzdata' |awk '/^tzdata-/{print $1; exit}' | sed 's/tzdata-//g') && \
    apk add --no-cache tzdata=$TZDATA_PACKAGE
ENV TZ=America/Bogota

# Create app directory
WORKDIR /usr/src/app
RUN chown -R node /usr/src/app

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist/ ./
COPY --chown=node:node --from=build /usr/src/app/package.json ./

#migration
COPY --chown=node:node --from=build /usr/src/app/.cicd/service.entrypoint.sh ./.cicd/service.entrypoint.sh
COPY --chown=node:node --from=build /usr/src/app/pre-orm.js ./
COPY --chown=node:node --from=build /usr/src/app/tsconfig.json ./

USER node

EXPOSE 3000
# Start the server using the production build
CMD sh -c "sh .cicd/service.entrypoint.sh && npm run typeorm:migrate && node src/main.js"