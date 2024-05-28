const fs = require('fs/promises')


const readEndpoints = () => {
    return fs.readFile(`${__dirname}/../endpoints.json`, 'utf-8').then((endpointsObj) => {
        return JSON.parse(endpointsObj)
    })
}

module.exports = readEndpoints