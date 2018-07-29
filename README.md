# ModSaber
Beat Saber Mod Database

## Deploying
1. Install [Docker]() and [Docker Compose]()
2. Clone the repo and copy `example.env` to `site.env`
3. Fill in environment variables as denoted in `site.env`
4. Pull external container dependencies with `docker-compose pull`
5. Build ModSaber containers with `docker-compose build`
6. Start the services with `docker-compose up -d`
7. Configure a reverse proxy to listen to port `1280`. Make sure you set the max file upload to 10MB or higher

## API Routes
Public API routes will be documented in the [Wiki](https://github.com/lolPants/ModSaber/wiki)

## Thanks :heart:
* `Assistant#8431` - Helping design the platform and bug test.
* `williams#0001` - Helping design the platform and bug test.
* `! 🍆 Donne !#0069` - Helping bug test.
