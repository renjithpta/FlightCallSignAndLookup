#!/bin/bash

rm -rf gateway/local/*

pushd utils
node enrollAdmin.js org1
sleep 2
node registerUser.js org1 admin fly2plan
sleep 2

popd