# images.indxo.app

Handles all image-related functionality for indxo.app.

### Requirements

* Docker 28 (or newer)
* Disk space for image files

### Setup

1. Clone the repository:

```bash
git clone https://github.com/Lanred-Dev/indxo.app.git
cd indxo.app/images.indxo.app
```

2. Build the Docker image:

```bash
docker build -t images.indxo.app .
```

3. Run the container:

```bash
docker run --env-file .env -p 3001:3001 images.indxo.app
```
