const { Pool } = require('pg')
const crypto = require('crypto');

const pool = new Pool(
    {
        host: 'localhost',
        user: 'postgres',
        password: 'mysecretpassword',
        port: '5432',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    }
)

async function login(user) {
    let token = generateToken()
    let username = user.username
    let password = user.password
    let hashedpassword = hashPassword(password)
    console.debug(username)
    let query = `SELECT id, username, hashed_password, startdate, logged_in, session_tocken
    FROM "75Hard"."User" where username = '${username}' and hashed_password = '${hashedpassword}';
    `
    let updateQuery = `UPDATE "75Hard"."User"
    SET  logged_in=true, session_tocken='${token}' where username = '${username}';
    `
    const result = await pool.query(query)
    if (result.rows.length > 0) {
        await pool.query(updateQuery)
        return token
    }
    else {
        return "FALED TO LOGIN"
    }
}
async function logout(username) {
    let updateQuery = `UPDATE "75Hard"."User"
    SET  logged_in=false, session_tocken='' where username='${username}';
    `
    try {
        let result = await pool.query(updateQuery)
        console.log(result)
        return "user Logged out"
    }
    catch {
        return "Failed to log out user"
    }
}
async function isLoggedIn(token) {
    let query = `SELECT session_tocken
    FROM "75Hard"."User" where session_tocken = '${token}';
    `
    const result = await pool.query(query)
    if (result.rows.length == 0) {
        return false
    }
    else if (result.rows[0].session_tocken === token) {
        return true
    }
    else {
        return false
    }
}
async function addActivity(activity, user) {
    let dayId = await getCurrentDayId(user)
    let ai = activity.id
    let query = `INSERT INTO "75Hard"."75hard_activity"
    ("75hard_id", activity_id)
    VALUES(${dayId}, ${ai});
    ;
    `
    let result = pool.query(query)
    return true
}
async function getDay() {
    let query = ``
    const result = pool.query(query)
    return result.rows[0]
}
async function getAllDays() {
    let query = ``
    const result = pool.query(query)
    return result.rows
}
function generateToken() {
    let date = new Date()
    let rand = Math.floor(Math.random() * 5000000);
    let presalt = "1234567890123456789" + rand
    rand = Math.floor(Math.random() * 5000000);
    let posalt = "qwertyyuiopasdfghjklzxcvbnm" + rand
    let dateString = date.toDateString()
    let token = presalt + dateString + posalt;
    return token
}
function hashPassword(password) {
    return crypto.createHash('sha512').update(password).digest('hex');
}
async function addUser(user) {
    let username = user.username;
    let password = user.password;
    let hashedPassword = hashPassword(password)
    let query = `INSERT INTO "75Hard"."User"
(username, hashed_password, startdate, logged_in, session_tocken)
VALUES('${username}', '${hashedPassword}', CURRENT_DATE, false, '') returning username;
`

    try {
        let result = await pool.query(query)
        return result.rows
    }
    catch {
        return false
    }
}
async function getActivities(){
    let query = `SELECT id, activity_name
    FROM "75Hard".activity;
    `
    let result = await pool.query(query)
    return result.rows
}
async function getUserId(userName){
    let query =`SELECT id
    FROM "75Hard"."User" wher username = '${userName}';
    `
    let result = await pool.query(query)
    return result.rows[0].id
}
async function addDay(user){
    let id = await getUserId(user.username)
    let query = `INSERT INTO "75Hard"."75hard_day"
    ("date", user_id)
    VALUES(CURRENT_DATE, ${Number(id)});
     returning "id";`
    let result = await pool.query(query)
    return result.rows[0].id
}
async function getCurrentDayId(user){
    let id = await getUserId(user.username)
    let query = `SELECT id
    FROM "75Hard"."75hard_day" where user_id = ${id} and date = CURRENT_DATE;
    `
    let result = pool.query(query)
    return result.rows[0]
}

async function getCurrentDayCompletedActivites(user){
    let id = await getUserId(user.username)
    let query = `SELECT *  FROM "75Hard"."75hard_activity" h inner join "75Hard"."75hard_day" hd    on hd.id = h."75hard_id" inner join "75Hard".activity a  on a.id= h.activity_id  where date= current_date and  user_id = ${id} ;
    `
    let result = pool.query(query)
    return result.rows[0]
}

module.exports = {
    addDay,
    getDay,
    getAllDays,
    addActivity,
    login,
    logout,
    isLoggedIn,
    addUser,
    getActivities,
    getCurrentDayCompletedActivites
}