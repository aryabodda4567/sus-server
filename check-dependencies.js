/**
 * This script checks if all required dependencies are installed
 * Run with: node check-dependencies.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// List of dependencies that should be installed
const requiredDependencies = [
  'express',
  'firebase-admin',
  'bcryptjs',
  'jsonwebtoken',
  'cookie-parser',
  'express-session',
  'cors',
  'dotenv',
  'multer',
  'swagger-jsdoc',
  'swagger-ui-express',
  'uuid'
];

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('❌ node_modules directory not found. Running npm install...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ npm install completed successfully');
  } catch (error) {
    console.error('❌ Error running npm install:', error.message);
    process.exit(1);
  }
}

// Check each dependency
let missingDependencies = [];

for (const dependency of requiredDependencies) {
  const dependencyPath = path.join(nodeModulesPath, dependency);
  if (!fs.existsSync(dependencyPath)) {
    missingDependencies.push(dependency);
  }
}

if (missingDependencies.length > 0) {
  console.log(`❌ Missing dependencies: ${missingDependencies.join(', ')}`);
  console.log('Installing missing dependencies...');
  
  try {
    execSync(`npm install ${missingDependencies.join(' ')}`, { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully');
  } catch (error) {
    console.error('❌ Error installing dependencies:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ All required dependencies are installed');
}

console.log('✅ Dependency check completed');
