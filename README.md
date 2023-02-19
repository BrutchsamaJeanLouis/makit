# Development Setup
==================================================
* run yarn to install all dependencies

* .env.development variables are stored on git so postgres user details must match

* run yarn createDB to create the database

* run yarn build to create server static files(picture-logos etc) this is needed since server and client run on  the same port

* run yarn start  to the run application

NOTE
aws s3 bucket files are uploaded to aws-s3-media folder located on the root of the project
aws ses email are sent to aws-ses folder located on the root of the project

the dist folder is the production build of the application
