#!/bin/bash

echo
echo "**********************************************"
echo "Creating backend symlinks for shared folder..."
echo "**********************************************"
cd backend/src || exit
ln -sf ../../shared
cd ../..

echo
echo "***********************************************"
echo "Creating frontend symlinks for shared folder..."
echo "***********************************************"
cd frontend/src || exit
ln -sf ../../shared
cd ../..

echo
echo "***********************************************"
echo "Installing shared packages..."
echo "***********************************************"
cd shared || exit
rm -rf node_modules
yarn install --frozen-lockfile
cd ..

echo
echo "***********************************************"
echo "Installing backend packages..."
echo "***********************************************"
cd backend || exit
rm -rf node_modules
yarn install --frozen-lockfile
cd ..

echo
echo "***********************************************"
echo "Installing frontend packages..."
echo "***********************************************"
cd frontend || exit
rm -rf node_modules
yarn install --frozen-lockfile
cd ..
