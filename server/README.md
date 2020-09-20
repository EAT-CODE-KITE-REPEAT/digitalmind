Welcome to this boilerplate

See .env where to create your api and mysql db

To install everything, do the following:

- On the server, clone repo into /home/.../...
- Create db on the server with `CREATE DATABASE mydatabase CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
- to put the api online, `git pull`, `yarn`, `yarn build`, `yarn serve` (or `yarn cluster`)
- make sure to add a server block like this https://www.digitalocean.com/community/tutorials/how-to-set-up-nginx-server-blocks-virtual-hosts-on-ubuntu-16-04
