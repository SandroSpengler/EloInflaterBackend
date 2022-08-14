FROM node:16.14.0
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./package.json /usr/src/app
# RUN rm -r /usr/src/app/build
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --only=production; \
    fi
RUN npm install -g typescript
COPY . /usr/src/app
EXPOSE 5000
CMD ["npm","run","prod"]