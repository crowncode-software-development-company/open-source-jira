#!/bin/bash

echo "Исполняется 'yarn workspace @open-condo/icons build'"
yarn workspace @open-condo/icons build

echo "Исполняется 'yarn workspace @open-condo/ui build'"
yarn workspace @open-condo/ui build

echo "Исполняется 'yarn workspace @open-condo/bridge build'"
yarn workspace @open-condo/bridge build

echo "Исполняется 'node ./bin/prepare.js'"
node ./bin/prepare.js

echo "Исполняется 'yarn workspace @open-condo/miniapp-utils build'"
yarn workspace @open-condo/miniapp-utils build

echo "Исполняется 'yarn workspace @open-condo/apollo build'"
yarn workspace @open-condo/apollo build

echo "Исполняется 'yarn workspace @app/condo build'"
yarn workspace @app/condo build

echo "Исполняется '@app/address-service build'"
yarn workspace @app/address-service build

echo "Исполняется 'yarn workspace @app/condo maketypes'"
yarn workspace @app/condo maketypes

echo "Исполняется '@app/address-service start'"
yarn workspace @app/address-service start &

echo "Исполняется 'yarn workspace @app/condo start'"
start bash -c "yarn workspace @app/condo start; exec bash" &