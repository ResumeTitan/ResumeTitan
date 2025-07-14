FROM node:slim

EXPOSE 8181

ENV PATH=/usr/local/node/bin:$PATH
ARG NODE_VERSION=21.6.2

RUN apt-get update \
  && apt install -y curl python-is-python3 pkg-config build-essential ffmpeg \
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

# Install Python and pip properly
RUN apt-get update && \
    apt-get install -y \
    python3 \
    python3-pip \
    python3-setuptools \
    python3-wheel \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Verify Python and pip installation
RUN python3 --version && pip3 --version

RUN mkdir /app
WORKDIR /app

COPY . .

RUN pip install -r scraper/requirements.txt --break-system-packages
RUN npm install --force --production
RUN npm run build
RUN cp -r src/docs dist/

# Set up Puppeteer for PDF downloads
RUN npx puppeteer browsers install chrome

LABEL fly_launch_runtime="nodejs"

ENV PORT 3000
ENV HOST 0.0.0.0
ENV NODE_ENV production
ENV PATH /usr/local/node/bin:$PATH

CMD [ "npm", "run", "start:prod" ]