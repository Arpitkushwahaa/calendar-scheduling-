#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Current working directory: $(pwd)"
echo "Listing directory contents:"
ls -la

echo "Installing dependencies..."
npm install

echo "Building the application..."
npm run build

echo "Checking built files:"
ls -la dist/
ls -la dist/index.js || echo "index.js not found in dist folder!"

echo "Build completed successfully!" 