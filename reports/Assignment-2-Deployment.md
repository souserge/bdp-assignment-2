# Part 1: Deployment

While the plan was to dockerize the server and deploy it to Google Cloud using Kubernetes, I did not manage to do it due to lack of time. The MongoDB was set up on MongoDB Atlas, while the client and server parts were tested locally.

On a Unix system, in order to install all the dependencies, install Node (> 8.0.0), run `npm install` in the client app folder (`code/client/mysimbdp-fetchdata`) and in two folders on the server side (`code/server/mysimbdp-batchingestmanager` and `code/server/mysimbdp-batchingestmanager/clientapps/serge/clientingestapp`).

In order to run the client app (file watcher), run `npm start` in the aforementioned client folder. For the server, add a MongoDB connection string to `code/server/mysimbdp-batchingestmanager/.env` and run `sudo npm start` in `code/server/mysimbdp-batchingestmanager`.
