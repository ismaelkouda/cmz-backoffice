const fs = require('fs');
const path = require('path');

const env = process.argv[2] || 'dev';
const supportedEnvs = ['dev', 'prod'];

if (!supportedEnvs.includes(env)) {
  console.error(`❌ Environnement invalide: "${env}". Utilisez "dev" ou "prod".`);
  process.exit(1);
}

const envFilePath = path.resolve(__dirname, 'src/assets/config/env.js');

fs.readFile(envFilePath, 'utf8', (err, content) => {
  if (err) {
    console.error(`❌ Erreur de lecture du fichier: ${err.message}`);
    process.exit(1);
  }

  const updated = content.replace(
    /window\.__env\.currentEnv\s*=\s*window\.__env\.(dev|prod);/,
    `window.__env.currentEnv = window.__env.${env};`
  );

  fs.writeFile(envFilePath, updated, 'utf8', (err) => {
    if (err) {
      console.error(`❌ Erreur d'écriture dans le fichier: ${err.message}`);
      process.exit(1);
    }
    console.log(`✅ L'environnement a été défini sur "${env}" dans env.js`);
  });
});
