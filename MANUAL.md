# Build and Start Manual

## Prerequisites

- Install nodejs version >= 20 LTS
- Ensure Docker and Docker Compose are installed on your system.
- Install `pnpm` globally if not already installed: `npm install -g pnpm`.

## Getting started with development environment

1. Clone repo: [support-insight](https://github.com/somavamshi-stack/support-insight.git)
2. Run this command to install dependencies,

   ```bash
   npm run first-time
   ```

   This will install all dependiecies required for local setup.

3. After step 2 completes, goto app folder and start dev server.

   ```bash
   cd app
   # Below command to copy env file. You can tune according to requirements
   cp .env.dev .env
   pnpm run dev
   ```

## Development Scripts

1. Install dependencies:

   ```bash
   npm run dev:install
   ```

2. To start the application in developer mode, run:

   ```bash
   cd app;
   npm run dev
   ```

   This will start the application using nextjs build tool.

3. To stop the application, run:

   - find the process id and kill

4. Upgrade dependencies:

   ```bash
   npm run dev:upgrade
   ```

5. Prettify code:

   ```bash
      npm run dev:prettify
   ```

## Build Instructions for Local docker image

1. To build the application, run:

   ```bash
   npm run build
   ```

   This will use Docker Compose to build the necessary containers.

2. To build the Docker image manually, use:

   ```bash
   npm run build:docker
   ```

## Start Instructions for Local docker image

1. To start the application in docker, run:

   ```bash
   npm run start
   ```

   This will start the application using Docker Compose.

2. To stop the application in docker, run:

   ```bash
   npm run stop
   ```

## Build and Deploy docker image to Google Cloud run

1. To publish the application to Google Cloud, use:

   ```bash
   npm run publish
   ```
