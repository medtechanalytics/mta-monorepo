#!/usr/bin/env bash

#Note the name of the folder *must* be nodejs, see explanation here:
#https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html
mkdir nodejs
cd nodejs
npm init -y
npm install --save pg
cd ..
zip -r nodejs.zip nodejs

aws lambda publish-layer-version --layer-name nodejs-pg --description "node.js pg dependency"  \
 --zip-file fileb://nodejs.zip \
 --compatible-runtimes node14js.x node16js.x

#   --compatible-architectures "x86_64"
