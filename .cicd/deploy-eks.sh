#!/bin/sh -eu
#
# Args: deploy.sh <stage name> <spoke AWS account ID> <region> <app name> <service name> <container image> <container tag>
export STAGE=$1
export AWS_ACCOUNT_ID=$2
export REGION=$3
export APP_NAME=$4
export EKS_NAMESPACE=$5
export HELM_RELEASE_NAME=$6
export HELM_CHARTS_DIR=$7
export CONTAINER_IMAGE=$8
export VERSION=$9
export SECRET_PATH=${10}

export JSON_ASSUME_FILE=assume-role-${STAGE}.json
# export DEPLOY_ROLE_ARN=arn:aws:iam::261166643659:role/dale-dev-compute-eks-cluster-eks-pod-execution-us-east-1
export DEPLOY_ROLE_ARN=arn:aws:iam::${AWS_ACCOUNT_ID}:role/${APP_NAME}-eks-cluster-eks-pod-execution-${REGION}
# export SA_IAM_ROLE_ARN=arn:aws:iam::${AWS_ACCOUNT_ID}:role/${APP_NAME}-${HELM_RELEASE_NAME}-pod-access-${REGION}
export SA_IAM_ROLE_ARN=arn:aws:iam::${AWS_ACCOUNT_ID}:role/${HELM_RELEASE_NAME}-pod-access-${REGION}
# export SA_IAM_ROLE_ARN=arn:aws:iam::261166643659:role/test_AmazonEKSLoadBalancerControllerRole
echo $SA_IAM_ROLE_ARN
# Install Helm for deployment to EKS
#
chmod +x .cicd/install-helm-kubectl.sh
.cicd/install-helm-kubectl.sh

# Login to AWS
rm -f ${JSON_ASSUME_FILE}
aws sts assume-role --region $REGION --role-arn ${DEPLOY_ROLE_ARN} --role-session-name "Deploy"  | jq .Credentials > ${JSON_ASSUME_FILE}
export AWS_ACCESS_KEY_ID=$(jq -r .AccessKeyId ${JSON_ASSUME_FILE})
export AWS_SECRET_ACCESS_KEY=$(jq -r .SecretAccessKey ${JSON_ASSUME_FILE})
export AWS_SESSION_TOKEN=$(jq -r .SessionToken ${JSON_ASSUME_FILE})
rm -f ${JSON_ASSUME_FILE}
echo "Get caller identity"
aws sts get-caller-identity

echo SECRET_NAME

# Connect to EKS
aws eks --region $REGION update-kubeconfig --name dale-${STAGE}-compute-eks-cluster

# Copy kubectl config to runner
cp -R ~/.kube /home/gitlab-runner/

# PRE checks
echo "---- Kube config"
kubectl config view --minify
echo "---- Kubectl info"
kubectl get svc
echo "---- PRE helm list"
helm list -n $EKS_NAMESPACE
echo "---- PRE get pods"
kubectl get pods -n $EKS_NAMESPACE


echo helm upgrade --namespace $EKS_NAMESPACE --create-namespace --values ./$HELM_CHARTS_DIR/values.yaml \
    --set image.repository=$CONTAINER_IMAGE \
    --set image.tag=$VERSION \
    --set secret.path=$SECRET_PATH \
    --set serviceAccount.annotations."eks\.amazonaws\.com/role-arn"=$SA_IAM_ROLE_ARN \
    --wait --install $HELM_RELEASE_NAME ./$HELM_CHARTS_DIR --timeout 10m

helm upgrade --namespace $EKS_NAMESPACE --create-namespace --values ./$HELM_CHARTS_DIR/values.yaml \
    --set image.repository=$CONTAINER_IMAGE \
    --set image.tag=$VERSION \
    --set secret.path=$SECRET_PATH \
    --set serviceAccount.annotations."eks\.amazonaws\.com/role-arn"=$SA_IAM_ROLE_ARN \
    --wait --install $HELM_RELEASE_NAME ./$HELM_CHARTS_DIR --timeout 10m

# Post checks
echo "---- helm list"
helm list -n $EKS_NAMESPACE
echo "---- get pods"
kubectl get pods -n $EKS_NAMESPACE
echo "---- get service"
kubectl get service -n $EKS_NAMESPACE
