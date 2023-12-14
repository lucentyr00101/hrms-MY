FROM node:16.14.2-alpine
ARG ENVIRONMENT
RUN mkdir -p /code
WORKDIR /code
ADD . /code
RUN yarn install && \
    yarn build && \
    yarn cache clean && \
    mv dist / && rm -rf ./* && mv /dist ./