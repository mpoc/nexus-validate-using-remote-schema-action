const core = require('@actions/core');
const fs = require('fs');
const yaml = require('js-yaml');
const fetch = require('node-fetch');
const Ajv = require("ajv").default;
const addFormats = require("ajv-formats");
const betterAjvErrors = require("better-ajv-errors");

(async () => {
    try {
        // Retrieve inputs
        const apiEndpoint = core.getInput('api-endpoint');
        const yamlFile = core.getInput('yaml-file');
        
        // Convert YAML file to JSON
        const convertedFile = yaml.load(fs.readFileSync(yamlFile, 'utf8'));
        console.log('YAML converted to JSON:');
        console.dir(convertedFile, { depth: null });
        
        // Fetch JSON schema
        const response = await fetch(apiEndpoint)
            .catch(error => { throw new Error(`Invalid request to server: ${error.message}`) });
        const jsonSchema = await response.json()
            .catch(error => { throw new Error(`Unable to parse JSON from server response: ${error.message}`) });
        
        // Validate grader config file
        const ajv = new Ajv();
        addFormats(ajv);
        const validate = ajv.compile(jsonSchema);
        const valid = validate(convertedFile);
        if (valid) {
            console.log(`${yamlFile} is valid`);
        } else {
            const output = betterAjvErrors(jsonSchema, convertedFile, validate.errors, { format: 'js' });
            const failMessage = `${yamlFile} does not fit definition: ${output[0].error}`;
            core.setFailed(failMessage);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
})();
