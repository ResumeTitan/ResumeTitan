FROM node:slim

EXPOSE 8181

ENV PATH=/usr/local/node/bin:$PATH
ARG NODE_VERSION=20.8.0

RUN apt-get update \
  && apt install -y curl python-is-python3 pkg-config build-essential \
  && curl -sL https://github.com/nodenv/node-build/archive/master.tar.gz | tar xz -C /tmp/ \
  && /tmp/node-build-master/bin/node-build "${NODE_VERSION}" /usr/local/node \
  && rm -rf /tmp/node-build-master

# Set environment variable for Puppeteer to use the headless mode
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/google-chrome

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install gnupg wget -y && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install google-chrome-stable -y --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*


RUN mkdir /app
WORKDIR /app

COPY . .

RUN npm install --force --production
RUN npm run build

# Set up Puppeteer for PDF downloads
RUN npx puppeteer browsers install chrome

LABEL fly_launch_runtime="nodejs"

ENV PORT 3000
ENV HOST 0.0.0.0
ENV NODE_ENV production
ENV PATH /usr/local/node/bin:$PATH

CMD [ "npm", "run", "start:prod" ]