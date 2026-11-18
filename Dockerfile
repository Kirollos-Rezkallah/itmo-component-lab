FROM node:26-alpine
LABEL org.opencontainers.image.source="https://github.com/Kirollos-Rezkallah/itmo-component-lab"
WORKDIR /app
COPY analyze.mjs index.mjs student-id.txt ./
USER node
CMD ["node", "index.mjs"]
