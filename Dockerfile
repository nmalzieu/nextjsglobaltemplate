# Install dependencies only when needed
FROM node:22-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat curl bash
RUN curl -fsSL https://bun.sh/install | bash -s -- 'bun-v1.1.38'

WORKDIR /app

# Copy only package.json and yarn.lock to leverage Docker layer caching
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Build and run stage
FROM node:22-alpine AS app
WORKDIR /app
RUN apk add --no-cache libc6-compat curl bash
RUN curl -fsSL https://bun.sh/install | bash -s -- 'bun-v1.1.38'

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /root/.bun /root/.bun

# Add bun to PATH for this stage
ENV PATH="/root/.bun/bin:${PATH}"

# Copy the rest of the app
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

ARG NEXT_PUBLIC_VAR_1
ENV NEXT_PUBLIC_VAR_1=$NEXT_PUBLIC_VAR_1

ARG NEXT_PUBLIC_SENTRY_DSN
ENV NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN

ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN

ARG SOURCE_COMMIT
ENV SOURCE_COMMIT=$SOURCE_COMMIT

RUN echo "Release version: $SOURCE_COMMIT" && echo "Sentry Auth Token length: ${#SENTRY_AUTH_TOKEN}"

# Install Sentry CLI
RUN yarn global add @sentry/cli

RUN SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN yarn nextbuild
RUN sentry-cli sourcemaps upload .next --url-prefix '~/' --project javascript-nextjs --release "$SOURCE_COMMIT"

CMD ["yarn", "start"]
