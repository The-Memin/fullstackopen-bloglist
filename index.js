const { info } = require('./utils/logger')
const app = require('./app')
const config = require('./utils/config')

app.listen(config.PORT, () => {
    info(`Listening on port ${config.PORT}`)
})