#
#
## Azure Kubernetes Cluster Setup

### Setting docker registry secrets for a namespace (Pull from Azure ACR)
To configure your AKS cluster to use your ACR, you need to indicate Kubernetes from where the Docker images have to be pulled, so it is necessary to specify your custom Docker registry as part of your Kubernetes object configuration. Instead of editing the corresponding yaml files, you can use Kubernetes secrets.
    
    export myresourcegroup=azure-meetup
    export myacr=eteration
    export myuser=eterationsp
    export MY-ACR-AUTH = eteration.azurecr.io

    ACR_LOGIN_SERVER=$(az acr show --name $myacr --query loginServer --output tsv)
    ACR_REGISTRY_ID=$(az acr show --name $myacr --query id --output tsv)

    SP_PASSWD=$(az ad sp create-for-rbac --name $myuser --role Reader --scopes $ACR_REGISTRY_ID --query password --output tsv). 

    CLIENT_ID=$(az ad sp show --id http://$myuser --query appId --output tsv)
  
   you will need to refer to this secret in your kubernetes manifest with 
         imagePullSecrets:
        - name: eteration.azurecr.io

To create a Kubernetes secret, execute the commands below. Remember to define a value for MY-ACR-AUTH and to replace the EMAIL-ADDRESS placeholder with your email address:

    kubectl create secret docker-registry $MY-ACR-AUTH  --docker-server $ACR_LOGIN_SERVER  --docker-username $CLIENT_ID --docker-password $SP_PASSWD  --docker-email EMAIL-ADDRESS
 
### Webinar Test Namespace

    k create ns webinar-test

    k apply -f platform/k8s/secure-devops-sandbox.yaml -n webinar-test

    k get deployments -n webinar-test
    k get pods -n webinar-test
    k get svc -n webinar-test


### Webinar Prod Namespace

    k create ns webinar-test

    k apply -f platform/k8s/secure-devops-sandbox.yaml -n webinar-prod
    k get deployments -n webinar-test
    k get pods -n webinar-prod 
    k get svc -n webinar-prod
