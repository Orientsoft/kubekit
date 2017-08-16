#!/bin/bash

set -x
set -e

HTTP_SERVER=$1
shift
ID=$1
shift

echo '#STEP1'
curl http://$HTTP_SERVER:9000/install/progress/$ID/1
sleep 8
echo '#STEP2'
curl http://$HTTP_SERVER:9000/install/progress/$ID/2
sleep 8
echo '#STEP3'
curl http://$HTTP_SERVER:9000/install/progress/$ID/3
sleep 8
echo '#STEP4'
curl http://$HTTP_SERVER:9000/install/progress/$ID/4
sleep 8
echo '#STEP5'
curl http://$HTTP_SERVER:9000/install/progress/$ID/5