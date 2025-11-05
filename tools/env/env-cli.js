#!/usr/bin/env node

const EnvironmentGenerator = require('./generate-env');
const chalk = require('chalk');
const { program } = require('commander');

program
    .version('1.0.0')
    .description("🚀 Générateur de configuration d'environnement IMAKO")
    .argument('<environment>', 'Environnement à générer (dev, test, prod)')
    .option('-v, --validate', 'Valider la configuration sans générer')
    .option('-t, --types', 'Générer seulement les types TypeScript')
    .option('--ci', 'Mode CI (sortie JSON)')
    .action((environment, options) => {
        const generator = new EnvironmentGenerator();

        try {
            if (options.validate) {
                console.log(chalk.blue('🔍 Validation de la configuration...'));
                console.log('environnement: -> ', environment);
                const config = generator.loadConfig();
                generator.validateEnvironment(config, environment);
                console.log(chalk.green('✅ Configuration valide!'));
            } else if (options.types) {
                console.log(chalk.blue('📝 Génération des types...'));
                const config = generator.loadConfig();
                generator.generateTypeDefinitions(config);
            } else {
                generator.generate(environment);
            }

            if (options.ci) {
                console.log(JSON.stringify({ success: true, environment }));
            }
        } catch (error) {
            if (options.ci) {
                console.log(
                    JSON.stringify({ success: false, error: error.message })
                );
                process.exit(1);
            } else {
                console.error(chalk.red('💥 ' + error.message));
                process.exit(1);
            }
        }
    });

program.parse();
