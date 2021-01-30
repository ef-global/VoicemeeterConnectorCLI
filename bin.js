const prettyprint = require('./main') /* the current working directory so that means main.js because of package.json */
let command = process.argv[2] /* what the user enters as first argument */
let param1 = process.argv[3]
let param2 = process.argv[4]

console.log(
    prettyprint(command, param1, param2)
)
