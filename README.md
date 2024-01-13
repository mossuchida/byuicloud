# BYUI Cloud test repository

## Deploying Node.js in Kubernetes & generate a load

### Prerequisites:

Install VS code
https://code.visualstudio.com/docs

Install github
https://docs.github.com/en/github-cli/github-cli/quickstart

Install Node.js
https://nodejs.org/en/download/

## Setting Up Github

Sign on github
https://github.com/

Create a new repository
-	Add Readme.md
-	Set gitignore with Node
-	Set appach 2.0 license

Setup SSH keys
-	On your VM or macbook, generate rsa ssh key

```
ssh-keygen -b 4096 -t rsa
```
-	Use all default

```cd ~/.ssh
ls -ltr
cat id_rsa.pub
```

-	Enter this id_rsa.pub into your github account
-	Run these commands  so that you can push your code to github


```
git config --global user.name "JohnDoe"
git config --global user.email "johndoe@email.com"
```
-	Above creates file 

```
cat ~/.gitconfig
[user]
		name=JohnDoe
		email= git config --global user.email {ID}+{username}@users.noreply.github.com
```

Clone created github repository to your local computer or VM 
- Name it byuicloud
  - Add .gitignore for Node.js so that unnecessary files won't be checked in

```
git clone https://github.com/JohnDoe/byuicloud
cd byuicloud
code .
```
-	Use VS code to create first Node.js code 
-	Edit README.md, -> Change stage, add comment -> commit

## Create Node.js Apps
Create a first “Hello World” app
https://code.visualstudio.com/docs/nodejs/nodejs-tutorial

- Make a directory `hello`, then create app.js file. Enter the following code

```
var msg = 'Hello World';
console.log(msg);
```

On command line, go to hello directory, then run the following

```
node.app.js
```

Create an express app

- Go back to the root directory, then run these commands

```
npm install -g express-generator
express myExpressApp --view pug
cd myExpressApp
npm install
npm start
```

- Access the app with the following URL

```
http://localhost:3000/
```

- Stop the application

## Create a Docker Image

-	Create dockerhub account
https://hub.docker.com/

-	Install Docker Desktop, then startup
https://docs.docker.com/desktop/

-	Install Docker extension in VS code
https://code.visualstudio.com/docs/containers/overview

- Generate a docker file
- Command Palette (⇧⌘P) and using Docker: Add Docker Files to Workspace command > Node.js > myExpressApp/package.json
  - Specify the port number 3000
  - Included optional Docker Compose file? - No
- myExpressApp/Docker file is created

- Steps to run the container on your laptop
https://learn.microsoft.com/en-us/visualstudio/docker/tutorials/docker-tutorial?WT.mc_id=vscode_docker_aka_getstartedwithdocker

Building a Docker Image
-	Right click “Dockerfile”, select `Build Image...` OR

```
cd myExpressApp
docker build -t myexpressapp:latest .
```

## Running a Docker Container

- On VS Code, click Docker icon on the left
- Under image, find `myexpressapp`. Expand it. You will see latest
- Right Click `latest`. then select “Run”, that will start up a container
OR type command

```
docker run --rm -d -p 3000:3000/tcp myexpressapp:latest
```

## Configure docker hub
- Connect Registry from VS code > Docker Hub
- Click Connect Registry > Docker Hub > Docker Hub User Name > Docker Hub Password

Push docker image to docker hub
- Select latest image, then click “Push”, then select docker, your account name OR run command

```
docker image push docker.io/<YOUR USER NAME>/myexpressapp:latest
```
## Check in the code in Github

Fix .gitignore
- Check in the changes  by clicking on + sign right to `Changes`
- Change stage > Commit with comments







