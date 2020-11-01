# react-flask-starter
Quickstart for building a React-Flask Web-Application

## Run Client in Development Mode
    cd client
    npm start

## Run Server in Development Mode
    cd server
    flask run

## Run Client, Server and Reverse Proxy in Production Mode

### Docker

Build Services and run Contaiers

    docker-compose up -d

Rebuild Service(s)

    docker-compose up --build --force-recreate --no-deps [-d] [<service_name>..]

Options:
| Flag  |  Description |
|---|---|
| `-d, --detach`  | Detached mode: Run containers in the background, print new container names. Incompatible with `--abort-on-container-exit`. |
| `--no-deps`  | Don't start linked services. |
| `--force-recreate`  | Recreate containers even if their configuration and image haven't changed. |
| `--build`  | Build images before starting containers. |