FROM node:18-alpine
WORKDIR .
COPY . .
RUN yarn
RUN yarn prepare
CMD ["yarn", "start"]
EXPOSE 8000