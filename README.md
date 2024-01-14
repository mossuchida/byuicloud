# BYUI Cloud Teaching Experience

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
node app.js
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

- Stop the container by right click the container name, then stop

## Configure Docker Hub
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
- Click `Sync Changes`

## Setup AWS Academy Learner Lab

Create an EKS Cluster
- Start AWS Lab
- Go to `Elastic Kubernetes Service`
- Add Cluster > Mostly default
  - Give it a name (e.g. demo)
  - Remove subnet us-east-1e
  - Add available security group
- Add `Node Group` to the cluster
  - Giv it a name (e.g. demo-group)
  - Select Node IAM role : Select available one (e.g. LabRole)


Connect the cluster with `AWS CloudShell`

- If the above command fails, run the [following command](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-console.html)
```
aws eks update-kubeconfig --region region-code --name my-cluster
e.g. aws eks update-kubeconfig --region us-east-1 --name moss
```

- run the following command to verify it is configured with the cluster
```
kubectl get svc
```

- Create a `demo` namespace and switch to the namespace
```
kubectl create namespace demo
kubectl config set-context --current --namespace=demo
```

- Check which namespace you are in
```
kubectl config get-contexts
```

## Deploy Image in Kubernetes

- Connect to your Kubernetes envrionment
- Create [deploy.yaml](./myExpressApp/deploy.yaml) file
- Copy the file to AWS PowerShell
  - Actions > Upload File
- Create the pod using deploy.yaml file with the following command

```
kubectl apply -f deploy.yaml
```
- Use the following command to track the creation progress
```
kubectl get pods -w
```
- Login to the pod & check if the service is running
```
kubectl exec -it myexpressapp-nnnn... -- /bin/sh
(e.g.) kubectl exec -it myexpressapp-nnnn... -- /bin/sh

/usr/src/app $wget http://localhost:3000
cat index.html
```


-	Create [LB.yaml](./myExpressApp/LB.yaml) file to generate routes
- Copy the file to AWS PowerShell
  - Actions > Upload File
-	Create the LoadBalancer service with the following command

```
kubectl apply -f LB.yaml
```

- Get the External IP address to connect to the application

```
kubectl get svc
```

## Pod Scaling Experiment

Change Node.js app to add count, hostname

- Change [myExpressApp/routes/index.js](./myExpressApp/routes/index.js) as you see in this link
- Change [myExpressApp/views/index.pug](./myExpressApp/views/index.pug) as you see in this link

- Create an image with a tag name `welcome`, then push image to docker hub
  - Create an image with [Dockerfile](./myExpressApp/Dockerfile), then when you push the image to Docker Hub, give it the tag name `welcome`
  - (e.g. docker.io/<YOUR USER NAME>/myexpressapp:welcome)
- Install this new image to Kubernetes by changing the tag name in [deploy.yaml](./myExpressApp/deploy.yaml)
- Verify on Docker Desktop or Docker Hub that the tag was created

- Change the tag name in [deploy.yaml](./myExpressApp/deploy.yaml), then run apply command
```
kubectl apply -f deploy.yaml
```
- Verify that new pod is created
- Verify that UI displays new style
  - Verify that it displays the Hostname of the container
  - Verify that count number increments

Scale the deployment with 2 replicas

- Run the following command to scale the replica to 2 pods

```
kubectl scale --replicas=2 deployment.app/myexpressapp
```
- Open couple incognito windows or 2 different browsers then access the app
  - Check for the host name and count number


Note:
- EKS Load Balancer uses Round robin : Each click gets the pod randomly
- Openshift routes uses Sticky Session : each browser is routed to the same pod


## (Optional) Deploy the app in OpenShift
- Install Openshift on laptop using CRC
  - Minimal environment for development and test purposes [doc](https://crc.dev/crc/getting_started/getting_started/introducing/)
- Install the [latest OC Cli](https://docs.openshift.com/container-platform/4.14/cli_reference/openshift_cli/getting-started-cli.html)

- Restart CRC
```
crc delete
crc stop
crc setup
crc start

Started the OpenShift cluster.

The server is accessible via web console at:
  https://console-openshift-console.apps-crc.testing

Log in as administrator:
  Username: kubeadmin
  Password: nnnnn....

Log in as user:
  Username: developer
  Password: developer

Use the 'oc' command line interface:
  $ eval $(crc oc-env)
  $ oc login -u developer https://api.crc.testing:6443
```
- Access OpenShift in the above URL.  kubeadmin is the admin account & easier to use

- Access oc cli with kubeadmin
```
oc login -u kubeadmin -p nnnn.... https://api.crc.testing:6443
```


- Run the following command each time you start CRC to reduce the security so that root user can be used

```
oc adm policy add-scc-to-user anyuid -z default
```

Option 1
- Run this command to deploy the app

```
oc new-app mossuchida/myexpressapp:welcome
```
- Run the following command to create the route

```
oc expose service/myexpressapp
```

Option 2
- Create [deploy.yaml](./myExpressApp/deploy.yaml) file
- Run the following command

```
kubectl apply -f deploy.yaml
```

- Create [svc.yaml](./myExpressApp/svc.yaml) file
- Run the following command

```
kubectl apply -f svc.yaml
```

- Create [route.yaml](./myExpressApp/route.yaml) file
- Run the following command

```
kubectl apply -f route.yaml
```
- Find the URL from Networking > Routes > Location

## (Optional) Generate a load against the application
Install JDK: brew install openjdk
Install jmeter : https://jmeter.apache.org/download_jmeter.cgi

Set JAVA_HOME & jmeter home in .zprofile

Run the following [jmx](./myExpressApp/StressMyExpress.jmx) file to generate the load
- Change the hostname to hit the correct URL








