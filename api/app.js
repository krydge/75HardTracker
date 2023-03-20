const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const PORT = 3001
const app = express()
const { HardRules } = require('./75HardRules')
const {
    addDay,
    getDay,
    getAllDays,
    addActivity,
    getActivities,
    login,
    logout,
    isLoggedIn,
    addUser,
    getCurrentDayCompletedActivites
} = require('./db')

app.use(cors())
app.use(bodyparser.json())

app.route('/')
    .get((req, res) => {
        res.status(200)
        res.send("All good")
    })

app.route('/user')
    .get(async (req, res) => {
        // let token = req.query.token;
        let user = { "username": "tasha a stubbs", "password": "0123456789" }
        let result = await login(user)
        result = await isLoggedIn(result)
        console.log(result)
        result = await logout(user)
        result = await isLoggedIn(result)
        // let result = await addUser(user)
        console.log(result)
        res.send(result)

    })
    .post(async (req, res) => {
        let username = req.body.username
        let password = req.body.password
        let user = { "username": username, "password": password }
        let result = await addUser(user)
        if (result) {
            res.status(200)
            res.send("User Added")
        }
        else {
            res.status(500)
            res.send("Failed to add User")
        }
    })

app.route('/user/login')
    .post(async (req, res) => {
        console.debug("login")
        let username = req.body.username
        let password = req.body.password
        let user = { "username": username, "password": password }
        let result = await login(user)
        user = { "username": username, "token": result }
        res.status(200)
        res.send(user)
    })

app.route('/user/logout')
    .post(async (req, res) => {
        console.debug("logout")
        let username = req.body.username
        let result = await logout(username)
        res.status(200)
        res.send(result)
    })
app.route('/user/islogedin')
    .get(async (req, res) => {
        console.debug("cheking is logged in")
        let token = req.query.body.token
        let result = await isLoggedIn(token)
        console.log(result)
        res.status(200)
        res.send(result)
    })
app.route('/rules')
    .get((req, res) => {
        console.log("returning rules")
        console.log(HardRules)
        res.status(200)
        res.send(HardRules)
    })
app.route('/activities')
    .get(async (req, res) => {
        let result = await getActivities()
        res.status(200)
        res.send(result)
    })
    .post(async (req, res) => {
        let user = req.query.body.user
        let activity = req.query.body.activity
        let result = await addActivity(activity, user)
        if (result) {
            res.status(200)
            res.send("Added activity")
        }
        else {
            res.sendStatus(500)
        }

    })
app.route('/completed')
    .get(async (req, res) => {
        let user = req.query.body.user
        let result = await getCurrentDayCompletedActivites(user)
    })
app.route('/day')
    .post(async (req, res) => {
        let result = await addDay()
        console.log(result)
        res.status(200)
        res.send({ "day-id": result })
    })

app.listen(PORT, (err) => {
    if (err) {
        console.error("Failed to start server")
    }
    else {
        console.debug('Started server listening on port:' + PORT)
    }
})