# ModSaber
Beat Saber Mod Database

## Contributing
See the [contribution guidelines](https://github.com/lolPants/ModSaber/blob/master/.github/CONTRIBUTING.md).

## Deploying
1. Install [Docker](https://docs.docker.com/install/) and [Docker Compose](https://docs.docker.com/compose/install/)
2. Clone the repo and copy `example.env` to `site.env`
3. Fill in environment variables as denoted in `site.env`
4. Pull external container dependencies with `docker-compose pull`
5. Build ModSaber containers with `docker-compose build`
6. Start the services with `docker-compose up -d`
7. Configure a reverse proxy to listen to port `1280`. Make sure you set the max file upload to 10MB or higher

## API Routes
Public API routes will be documented in the [Wiki](https://github.com/lolPants/ModSaber/wiki)

## Thanks :heart:
| | |
| --- | --- |
| `Assistant#8431` | Helping design the platform and bug test |
| `williums#0001` | Helping design the platform and bug test |
| `Umbranox#6671` | Feedback, security consultant, writing the Mod Manager |
