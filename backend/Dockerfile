# Use the official lightweight Node.js 12 image.
# https://hub.docker.com/_/node
FROM node:17-slim
 
WORKDIR /usr/app
COPY ./ /usr/app

# Install necessary packages and dependencies
RUN apt-get update && apt-get install -y curl \
    && apt-get install -y gnupg \
    && echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list \
    && curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg add - \
    && apt-get update \
    && apt-get install -y google-cloud-sdk
 
# Install dependencies and build the project.
RUN npm install
 
# Run the web service on container startup.
CMD ["node", "index.js"]