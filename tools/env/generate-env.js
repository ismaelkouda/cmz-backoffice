const fs = require('fs');
const path = require('path');
const config = require('./env.config');

const env = process.argv[2];

if (!env || !config[env]) {
  console.error('❌ Usage: node generate-env.js <dev|prod>');
  process.exit(1);
}

const templatePath = path.resolve(__dirname, '../../src/assets/config/env.template.js');
const outputPath = path.resolve(__dirname, '../../src/assets/config/env.js');
const envConfig = config[env];

fs.readFile(templatePath, 'utf8', (err, content) => {
  if (err) {
    console.error(`❌ Lecture template: ${err.message}`);
    process.exit(1);
  }

  const result = content
    .replace(/__VERIFY_IDENTITY_URL__/g, envConfig.VERIFY_IDENTITY_URL)
    .replace(/__API_URL__/g, envConfig.API_URL)
    .replace(/__FILE_URL__/g, envConfig.FILE_URL)
    .replace(/__ENVIRONMENT__/g, envConfig.ENVIRONMENT)
    .replace(/__ENABLE_DEBUG__/g, envConfig.ENABLE_DEBUG);

  fs.writeFile(outputPath, result, 'utf8', (err) => {
    if (err) {
      console.error(`❌ Erreur écriture : ${err.message}`);
      process.exit(1);
    }
    console.log(`✅ Environnement "${env}" généré avec succès.`);
  });
});