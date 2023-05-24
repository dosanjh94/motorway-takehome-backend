Install requirements:
 - docker (https://docs.docker.com/get-docker/)

To initialize this project, run `docker compose up` from the root of this project. This will build and seed the database. By default the database runs on port `5432` and is also exposed on `5432`, if you want to change this you can update `docker-compose.yml`.

To run
```
npm install
npm run dev
```

- The tests are not complete and there should be intergration tests
- The .env file should not be checked into a git repo if this was a git repo i would add a git ignore
- The script to populate the DB has been altered to add a forgin key and an index
- To run tests `npm run test`