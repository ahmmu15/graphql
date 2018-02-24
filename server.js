const express = require('express')
const expressGraphQl = require('express-graphql')
const schema = require('./schema.js')

const app = express()

// entry point (route) for anyone wanna use qraphql server
app.use('/graphql', expressGraphQl({
    // configuration object
    schema: schema,
    graphiql: true //that's for enabling graphical IDE to use by us (for testing)
}))

app.listen(4000, () => {
    console.log('Server is running on port 4000')
})