FROM rust:latest AS base

RUN apt-get update \
  && apt-get install -y libpq-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY Cargo.toml Cargo.lock ./
RUN cargo fetch

COPY src/ ./src/

FROM base AS development

EXPOSE 8080

CMD [ "cargo", "run", "--offline" ]

FROM base AS builder

RUN cargo build --release --offline

FROM ubuntu:latest

RUN apt-get update && apt-get install -y libpq5 && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/release/list_ranker /usr/local/bin/list_ranker

EXPOSE 8080

CMD ["list_ranker"]
