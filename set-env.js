const fs = require('fs');
const path = require('path');

const env = process.argv[2]; // 'dev' ou 'prod'
const envFilePath = path.resolve(__dirname, 'src/assets/config/env.js');

fs.readFile(envFilePath, 'utf8', (err, data) => {
    if (err) {
        return console.log(`Error reading file: ${err}`);
    }

    let result;
    if (env === 'dev') {
        result = data.replace(/window\.__env\.currentEnv = window\.__env\.(dev|prod);/, 'window.__env.currentEnv = window.__env.dev;');
    } else if (env === 'prod') {
        result = data.replace(/window\.__env\.currentEnv = window\.__env\.(dev|prod);/, 'window.__env.currentEnv = window.__env.prod;');
    } else {
        return console.log('Invalid environment specified. Use "dev" or "prod".');
    }

    fs.writeFile(envFilePath, result, 'utf8', (err) => {
        if (err) return console.log(`Error writing file: ${err}`);
        console.log(`Environment set to ${env}`);
    });
});
