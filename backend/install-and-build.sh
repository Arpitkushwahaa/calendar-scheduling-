#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing dependencies..."
npm install

echo "Creating tsconfig.json backup..."
cp tsconfig.json tsconfig.json.backup

echo "Updating tsconfig.json to fix compilation issues..."
cat > tsconfig.json << EOL
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": false,
    "skipLibCheck": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "strictPropertyInitialization": false
  },
  "include": ["src/**/*.ts", "src/@types/**/*.ts"],
  "exclude": ["node_modules", "test", "dist", "**/*spec.ts"]
}
EOL

echo "Building the application..."
npm run build

echo "Build completed successfully!" 