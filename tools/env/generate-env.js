const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../../src/assets/config/env.js');
let config = {};

if (fs.existsSync(envPath)) {
    config = require(envPath);
} else {
    console.warn('⚠️ Fichier env.js introuvable. Aucune config personnalisée ne sera utilisée.');
}

const env = process.argv[2];

if (!env || !config[env]) {
    console.error('❌ Usage: node generate-env.js <dev|prod>');
    // Tu peux choisir de continuer ou non :
    // process.exit(1);
}

const selectedConfig = config[env] || {};

const envContent = `(function (window) {
    window.__env = ${JSON.stringify({
        verifyIdentityDocumentUrl: selectedConfig?.VERIFY_IDENTITY_URL ?? '',
        apiUrl: selectedConfig?.API_URL ?? '',
        fileUrl: selectedConfig?.FILE_URL ?? '',
        environmentDeployment: selectedConfig?.ENVIRONMENT ?? '',
        enableDebug: selectedConfig?.ENABLE_DEBUG ?? false,
        headerSettings: selectedConfig?.HEADER_SETTINGS ?? {},
        messageApp: selectedConfig?.MESSAGE_APP ?? {}
    }, null, 4)};
})(this);
`;

const targetPath = path.join(__dirname, '../../src/assets/config/env.template.js');

fs.writeFileSync(targetPath, envContent, 'utf8');

console.log(`✅ env.template.js généré pour l’environnement '${env}' à : ${targetPath}`);
