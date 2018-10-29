var environment = {}

environment.staging = {
    "port":"3000",
    "envName":"staging",
    "hashKey":"secretKey1"
}

environment.production = {
    "port":"5000",
    "envName":"production",
    "hashKey":"secretKey2"
}

var currentEnv = typeof(process.env.NODE_ENV) == "string" ? process.env.NODE_ENV.toLowerCase() : ""

var environmentToExport = typeof(environment[currentEnv]) == "object" ? environment[currentEnv] : environment["staging"]

module.exports = environmentToExport