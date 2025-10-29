# indxo.app

The main site for indxo.app.

### Requirements

* Docker 28 (or newer)

### Setup

1. Clone the repository:

```bash
git clone https://github.com/Lanred-Dev/indxo.app.git
cd indxo.app/indxo.app
```

2. Build the Docker image:

```bash
docker build -t indxo.app .
```

3. Run the container:

```bash
docker run --env-file .env -p 3000:3000 indxo.app
```