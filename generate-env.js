const fs = require('fs');
const path = require('path');

const env = process.argv[2];

if (!env || !['dev', 'prod'].includes(env)) {
    console.error('Usage: node generate-env.js <dev|prod>');
    process.exit(1);
}

const templatePath = path.resolve(__dirname, 'src/assets/config/env.template.js');
const outputPath = path.resolve(__dirname, 'src/assets/config/env.js');

// Configurations
const configs = {
    dev: {
        VERIFY_IDENTITY_URL: "https://sim-monitoring.cateli.io:8013/",
        API_URL: "https://sim-monitoring.cateli.io:12999/api/v1/",
        FILE_URL: "https://sim-monitoring.cateli.io:12999/",
        ENVIRONMENT: "DEV",
        ENABLE_DEBUG: true
    },
    prod: {
        VERIFY_IDENTITY_URL: "https://osim-monitoring.orange.ci:8013/",
        API_URL: "https://gs2e-osim.orange.ci:12300/api/v1/",
        FILE_URL: "https://gs2e-osim.orange.ci:12300/",
        ENVIRONMENT: "PROD",
        ENABLE_DEBUG: false
    }
};

export const envConfig = configs[env];

fs.readFile(templatePath, 'utf8', (err, content) => {
    if (err) {
        console.error(`Erreur lecture template: ${err}`);
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
            console.error(`Erreur écriture fichier env.js : ${err}`);
            process.exit(1);
        }
        console.log(`✅ env.js généré pour l'environnement ${env}`);
    });
});
