# Comments are provided throughout this file to help you get started.
# syntax=docker/dockerfile:1
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

ARG NODE_VERSION=18.12.1

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production
ENV MONGODB_CONNECTION_STRING=mongodb+srv://atuljha381:<PASSWORD>@customer.qn7c3n3.mongodb.net/sample_customer_data?retryWrites=true&w=majority
ENV DATABASE_PASSWORD=MFOwUbJdP3H5YKIK
ENV JWT_SECRET=N!:ls+?"{!>u{L~nzpUvYiQ1m3*\gRmc"lyfmv#TtpBI=rHL`aPA%Y}HBZVvvc+
ENV JWT_EXPIRY=90d
ENV PORT=5050
ENV EMAIL_USERNAME=0564e441bf89ad
ENV EMAIL_PASSWORD=ddeebfddf7b3e8
ENV EMAIL_HOST=sandbox.smtp.mailtrap.io
ENV EMAIL_PORT=2525
ENV PHONE_SERVICE_SID=VA1805eccfa8f229ae7b523574b9aa27b6
ENV PHONE_ACCOUNT_SID=AC05ad1ead2f441609049f62c0ec98fa25
ENV PHONE_AUTH_TOKEN=8aa8ffb0107e472c72925d02bcdbd2b7


WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.yarn to speed up subsequent builds.
# Leverage a bind mounts to package.json and yarn.lock to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.yarn \
    yarn install --production --frozen-lockfile

# Run the application as a non-root user.
USER node

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 5050

# Run the application.
CMD yarn start
