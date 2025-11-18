#!/bin/bash

set -e

VERSION=${1:-latest}
GITHUB_USER=${2:-${GITHUB_USERNAME:-"suchavadee123"}}
IMAGE_NAME="products-backend"
REGISTRY="ghcr.io"

if ! docker info > /dev/null 2>&1; then
    exit 1
fi

IMAGE="${REGISTRY}/${GITHUB_USER}/${IMAGE_NAME}:${VERSION}"
IMAGE_LATEST="${REGISTRY}/${GITHUB_USER}/${IMAGE_NAME}:latest"

docker build -f Dockerfile.backend -t ${IMAGE} -t ${IMAGE_LATEST} .
docker push ${IMAGE}
docker push ${IMAGE_LATEST}
