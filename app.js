
const express = require('express')
const morgan = require('morgan')
const bodyParser = require("body-parser")
const axios = require('axios');

const app = express()
const port = 6969

// const colors = {
//     down: 10682371,
//     up: 172800,
//     warn: 15258703
// }

const sendDiscordWebhook = (data, url, ret) => {
    let params = {
        username: data.name,
        avatar_url: data.pfp,
        content: `## ${data.msg}`,
    }

    axios.post(url, params).then(() => {
        ret()
    })
}


app.use(morgan('combined'))
app.use(bodyParser.json())

app.post('/', (req, res) => {
    let data = { msg: "", color: 0 };
    let { body, headers } = req
    let { heartbeat, monitor } = body

    let discordURL = headers.discordhook
    let pfp = headers.botpfp
    let name = headers.botname

    data = { pfp, name }

    if (!heartbeat || !monitor) {
        data.msg = "⚠️ Testing webhook"
        data.color = colors.warn
    } else {
        data.msg = `${heartbeat.status === 0 ? "❌" : "✅"} ${monitor.name} is ${heartbeat.status === 0 ? "DOWN" : "UP"}`
        data.color = heartbeat.status === 0 ? colors.down : colors.up
    }
    console.log(discordURL)

    sendDiscordWebhook(data, discordURL, () => {
        res.send('suc')
    })
})

app.listen(port, () => {
    console.log(`Custom webhook app listening on port ${port}`)
})