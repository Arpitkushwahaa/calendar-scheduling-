#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Current working directory: $(pwd)"
echo "Checking for compiled files:"
ls -la ./dist || echo "dist directory not found!"

echo "Starting application..."
node ./dist/index.js 