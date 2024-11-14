#!/bin/bash

TARGET_DIR=/home/vladik/repositories/vladyslav005.github.io/

if [ ! -d "$TARGET_DIR" ]; then
  echo "Error: $TARGET_DIR is not a valid directory"
  exit 1
fi

# Delete all files and folders except for the .git directory
find "$TARGET_DIR" -mindepth 1 -not -path "$TARGET_DIR/.git*" -exec rm -rf {} +

echo "All files and folders except for .git have been deleted from $TARGET_DIR"

cd /home/vladik/repositories/lambda

npm run build

cp -r /home/vladik/repositories/lambda/build/* /home/vladik/repositories/vladyslav005.github.io/

cd /home/vladik/repositories/vladyslav005.github.io/

git add .
git commit -m "# deploy"
git push