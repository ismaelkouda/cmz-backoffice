import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateTypes, validateConfig } from './config-validator.js';

// Equivalent à __dirname en ES Modules
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

        // Import dynamique pour charger le fichier de configuration
        const configModule = await import(this.configPath);
        return configModule.default || configModule;
    }

    validateEnvironment(config, env) {
        if (!env) {
            throw new Error('❌ Environnement non spécifié');
        }

        if (!config[env]) {
            throw new Error(
                `❌ Configuration non trouvée pour l'environnement '${env}'`
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
        console.log('✅ Types TypeScript générés:', this.typesOutputPath);
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
                console.error('❌ Configuration API manquante');
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
        console.log(
            `✅ Fichier env.js généré pour '${env}' → ${this.envOutputPath}`
        );
        fs.writeFileSync(this.envOutputPath, output, 'utf8');
    }

    async generate(env) {
        try {
            console.log(`🚀 Génération de l'environnement: ${env}`);

            const config = await this.loadConfig();
            this.generateTypeDefinitions(config);
            this.generateEnvFile(config, env);

            console.log(`🎉 Configuration ${env} générée avec succès!`);
            return true;
        } catch (error) {
            console.error('💥 Erreur lors de la génération:', error.message);
            process.exit(1);
        }
    }
}

// Gestion de l'appel en ligne de commande
const args = process.argv.slice(2);
const environment = args[0];

if (!environment) {
    console.error('❌ Usage: node generate-env.js <environment>');
    process.exit(1);
}

const generator = new EnvironmentGenerator();
generator.generate(environment);
export default EnvironmentGenerator;
