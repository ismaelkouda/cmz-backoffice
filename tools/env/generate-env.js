import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateTypes, validateConfig } from './config-validator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class EnvironmentGenerator {
    constructor() {
        this.configPath = path.resolve(__dirname, './config.js');
        this.typesOutputPath = path.resolve(
            __dirname,
            '../../src/environments/config.types.ts'
        );
        this.envOutputPath = path.resolve(
            __dirname,
            '../../src/assets/config/env.js'
        );
    }

    async loadConfig() {
        if (!fs.existsSync(this.configPath)) {
            throw new Error("❌ Fichier 'config.js' introuvable");
        }

        const configModule = await import(this.configPath);
        return configModule.default || configModule;
    }

    validateEnvironment(config, env) {
        if (!config[env]) {
            throw new Error(
                `❌ Configuration non trouvée pour config.js '${env}'`
            );
        }

        const validation = validateConfig(config[env]);
        if (!validation.isValid) {
            throw new Error(
                `❌ Configuration invalide pour '${env}': ${validation.errors.join(', ')}`
            );
        }

        return validation.config;
    }

    generateTypeDefinitions(config) {
        const typeDefinition = generateTypes(config);
        fs.writeFileSync(this.typesOutputPath, typeDefinition, 'utf8');
    }

    generateEnvFile(config, env) {
        const selectedConfig = this.validateEnvironment(config, env);

        const output = `(function (window) {
            window.__env = ${JSON.stringify(selectedConfig, null, 4)};
            window.__env.buildInfo = {
                timestamp: '${new Date().toISOString()}',
                environment: '${env}',
                version: '${process.env.npm_package_version || '1.0.0'}',
                commitHash: '${process.env.GIT_COMMIT_HASH || 'local'}'
            };
            
            // Validation de la configuration
            if (typeof window.__env.authenticationUrl === 'undefined' && typeof window.__env.reportUrl === 'undefined' && typeof window.__env.settingUrl === 'undefined') {
                console.error('❌ Configuration API manquante (authenticationUrl, reportUrl, settingUrl)');
            }
            
            // Lock la configuration
            Object.freeze(window.__env);
            Object.freeze(window.__env.messageApp);
            Object.freeze(window.__env.appSettings);
        })(this);`;

        // Création du dossier si nécessaire
        const outputDir = path.dirname(this.envOutputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        fs.writeFileSync(this.envOutputPath, output, 'utf8');
    }

    async generate(env) {
        try {
            const config = await this.loadConfig();
            this.generateTypeDefinitions(config);
            this.generateEnvFile(config, env);
            return true;
        } catch (error) {
            console.error('💥 Erreur lors de la génération:', error.message);
            process.exit(1);
        }
    }
}

const args = process.argv.slice(2);
const env = args[0];

if (!env) {
    console.error('❌ Usage: node generate-env.js <environnement>');
    process.exit(1);
}

const generator = new EnvironmentGenerator();
generator.generate(env);
export default EnvironmentGenerator;
