const fs = require('fs');
const path = require('path');

let config = {};
const configPath = path.resolve(__dirname, './config.js');
if (fs.existsSync(configPath)) {
    config = require(configPath);
} else {
    console.warn("⚠️  Fichier 'config.js' introuvable. Aucun environnement ne sera généré.");
}

const env = process.argv[2];

if (!env || !config[env]) {
    console.warn(`⚠️  Aucune configuration trouvée pour l'environnement '${env}'. Le fichier ne sera pas généré.`);
} else {
    const selectedConfig = config[env];

    const output = `
        (function (window) {
            window.__env = ${JSON.stringify(selectedConfig, null, 4)};
        })(this);
        `;

    const outputPath = path.resolve(__dirname, '../../src/assets/config/env.js');
    fs.writeFileSync(outputPath, output, 'utf8');

    console.log(`✅ Fichier env.js généré avec succès pour '${env}' ➜ ${outputPath}`);
}
