FROM mcr.microsoft.com/dotnet/aspnet:5.0-focal AS base
WORKDIR /app
EXPOSE 5001

ENV ASPNETCORE_URLS=http://+:5001

#copy certificates
COPY cer /app/cer

# Creates a non-root user with an explicit UID and adds permission to access the /app folder
# For more info, please refer to https://aka.ms/vscode-docker-dotnet-configure-containers
RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

FROM mcr.microsoft.com/dotnet/sdk:5.0-focal AS build
WORKDIR /src
USER root
##Add nugget packages to image
RUN apt-get update
#add curl
RUN apt-get -y install curl
RUN apt-get install unzip
#
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" 
#
RUN unzip awscliv2.zip 
#
RUN ./aws/install
#
RUN apt install wget
#
RUN wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
#
RUN dpkg -i packages-microsoft-prod.deb
#
RUN apt-get update
#
RUN apt-get install -y apt-transport-https
#
RUN apt-get update
#
RUN apt-get install -y dotnet-sdk-5.0
#
RUN apt-get install -y dotnet-sdk-3.1
#
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_DEFAULT_REGION=us-east-2
ARG AWS_DEFAULT_OUTPUT=JSON
ARG ENVIRONMENT
ENV NET_ENVIRONMENT=$ENVIRONMENT
RUN echo $NET_ENVIRONMENT
#
RUN aws configure set aws_access_key_id "$AWS_ACCESS_KEY_ID"
RUN aws configure set aws_secret_access_key "$AWS_SECRET_ACCESS_KEY"
RUN aws configure set default.region "$AWS_DEFAULT_REGION"
RUN aws configure set default.output "$AWS_DEFAULT_OUTPUT"
#
ENV CODEARTIFACT_AUTH_TOKEN='aws codeartifact get-authorization-token --domain avalsolucionesdigitales --domain-owner 215256885325 --query authorizationToken --output text'
#
RUN dotnet nuget add source "https://avalsolucionesdigitales-215256885325.d.codeartifact.us-east-2.amazonaws.com/nuget/nuget-store/v3/index.json" -n "avalsolucionesdigitales/nuget-store" -u "aws" -p "${CODEARTIFACT_AUTH_TOKEN}" --store-password-in-clear-text
#
RUN aws codeartifact login --tool dotnet --repository nuget-store --domain avalsolucionesdigitales --domain-owner 215256885325
RUN dotnet tool install --global AWS.CodeArtifact.NuGet.CredentialProvider --version 1.0.0
#
ENV PATH="${PATH}:/root/.dotnet/tools"
#
RUN dotnet codeartifact-creds install
#
RUN dotnet codeartifact-creds configure set profile default
#
COPY [".", "./"]
# Copy Certificates for novopaymer virtual debit card to physical
COPY ["cer/virtual-2-physical-dale-key-jwe.pem", "/app/cer/dale"]
COPY ["cer/virtual-2-physical-dale-key-jws.pem", "/app/cer/dale"]
COPY ["cer/virtual-2-physical-dale-pub-jwe.pem", "/app/cer/dale"]
COPY ["cer/virtual-2-physical-dale-pub-jws.pem", "/app/cer/dale"]
#
RUN dotnet restore
#
COPY . .
WORKDIR "/src/."
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Dale.Services.DebitCard.API.dll", "--environment=Staging"]
