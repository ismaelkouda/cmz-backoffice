import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateTypes, validateConfig } from './config-validator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class EnvironmentGenerator {
    constructor() {
        this.paths = {
            config: path.resolve(__dirname, './config.js'),
            types: path.resolve(
                __dirname,
                '../../src/core/config/config.types.ts'
            ),
            runtimeEnv: path.resolve(
                __dirname,
                '../../src/assets/config/env.js'
            ),
        };
    }
    
    async loadConfig() {
        this.ensureFileExists(
            this.paths.config,
            "❌ Fichier 'config.js' introuvable"
        );

        const configModule = await import(this.paths.config);
        return configModule.default || configModule;
    }

    validateEnvironment(config, env) {
        if (!config[env]) {
            throw new Error(
                `❌ Configuration non trouvée pour config.js '${env}'`
            );
        }

        console.log('config[env]: ', config[env]);
        const validation = validateConfig(config[env]);
        if (!validation.isValid) {
            throw new Error(
                `❌ Configuration invalide pour '${env}': ${validation.errors.join(', ')}`
            );
        }

        return validation.config;
    }

    buildRuntimeConfig(config, env) {
        return `(function (window) {
            window.__env = ${JSON.stringify(config, null, 4)};

            window.__env.buildInfo = {
                timestamp: '${new Date().toISOString()}',
                environment: '${env}',
                version: '${process.env.npm_package_version || '1.0.0'}',
                commitHash: '${process.env.GIT_COMMIT_HASH || 'local'}'
            };

            Object.freeze(window.__env);

            if (window.__env.appSettings) {
                Object.freeze(window.__env.appSettings);
            }
        })(this);`;
    }

    writeFile(filePath, content) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, content, 'utf8');
    }

    ensureFileExists(filePath, errorMessage) {
        if (!fs.existsSync(filePath)) {
            throw new Error(errorMessage);
        }
    }

    async generate(env) {
        const config = await this.loadConfig();

        const validatedConfig = this.validateEnvironment(config, env);

        this.writeFile(
            this.paths.types,
            generateTypes(config)
        );

        this.writeFile(
            this.paths.runtimeEnv,
            this.buildRuntimeConfig(validatedConfig, env)
        );

        return true;
    }
}

const args = process.argv.slice(2);
const env = args[0];

if (!env) {
    console.error('❌ Usage: node generate-env.js <environment>');
    process.exit(1);
}

const generator = new EnvironmentGenerator();

generator.generate(env).catch((error) => {
    console.error('💥 Erreur lors de la génération:', error.message);
    process.exit(1);
});

export default EnvironmentGenerator;
