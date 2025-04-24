const fs = require('fs');
const path = require('path');
const config = require('../../src/assets/config/env.js');

const env = process.argv[2];

if (!env || !config[env]) {
    console.error('❌ Usage: node generate-env.js <dev|prod>');
    // process.exit(1);
}

const selectedConfig = config[env];

const envContent = `(function (window) {
    window.__env = ${JSON.stringify({
        verifyIdentityDocumentUrl: selectedConfig?.VERIFY_IDENTITY_URL,
        apiUrl: selectedConfig?.API_URL,
        fileUrl: selectedConfig?.FILE_URL,
        environmentDeployment: selectedConfig?.ENVIRONMENT,
        enableDebug: selectedConfig?.ENABLE_DEBUG,
        headerSettings: selectedConfig?.HEADER_SETTINGS,
        messageApp: selectedConfig?.MESSAGE_APP
    }, null, 4)};
})(this);
`;

const targetPath = path.join(__dirname, '../../src/assets/config/env.template.js');
console.log("update/gitlab-ci", envContent);

fs.writeFileSync(targetPath, envContent, 'utf8');

console.log(`✅ env.template.js generated for '${env}' environment at ${targetPath}`);
