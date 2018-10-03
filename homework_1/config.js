var environments = {};

environments.staging = {
    'envName': 'staging',
    'httpPort': 3000
};

environments.production = {
    'envName': 'production',
    'httpPort': 5002
};

var currEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
var envToExport = typeof(environments[currEnv]) == 'object' ? environments[currEnv] : environments.staging;

module.exports = envToExport;