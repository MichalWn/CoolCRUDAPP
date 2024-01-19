var express = require("express")
var router = express.Router();
var bcrypt = require("bcrypt")
var db = require("../db")
const config = require('../config')
var jsonwebtoken = require('jsonwebtoken')

const loggedIn = (req, res, next) => {
    try {
        const sessionToken = req.session.token;
        const tokenVerify = jsonwebtoken.verify(sessionToken, config.SECRET);
        return next()
    } catch (e) {
        return res.redirect("/login")
    }
}


router.all('*', loggedIn, (req, res, next) => {
    if (!req.session.admin) {
        return res.redirect("/")
    }

    next()
})


router.get('/', function (req, res, next) {
    res.send("Panel administracyjny")
})

router.get('/adduser', function (req, res, next) {
    try {
        res.render("admin/addUser", {
            title: "Admin - dodawanie użytkownika",
            message: "",
            username: ""
        })
    } catch (e) {
        return next(e)
    }
})


router.post("/adduser", function (req, res, next) {
    const { login, haslo, email, czyAdmin, imie, nazwisko, telefon } = req.body

    const sql = `SELECT * FROM users WHERE imie=$1 LIMIT 1`;

    db.all(sql, [login], async (err, rows) => {
        if (err) return console.error("Błąd przy próbie odczytu z bazy", err.message);

        if (rows.length === 1) {
            return res.render("admin/addUser", {
                title: "Admin - dodawanie użytkownika",
                message: "Użytkownik już istnieje",
                username: ""
            })
        }

        const hashedPassword = await bcrypt.hash(haslo, 10);

        const sqlInsert = `INSERT INTO users(login, haslo, email, czyAdmin, imie, nazwisko, telefon) VALUES($1, $2, $3, $4, $5, $6, $7)`;

        db.all(sqlInsert, [login, hashedPassword, email, czyAdmin, imie, nazwisko, telefon], (err, rows) => {
            if (err) {
                console.error("Błąd przy próbie zapisu do bazy", err.message);
                res.render("admin/addUser", {
                    title: "Admin - dodawanie użytkownika",
                    message: `Błąd przy próbie zapisu do bazy ${err.message}`,
                    username: ""
                })
            }

            res.render("admin/addUser", {
                title: "Admin - dodawanie użytkownika",
                message: "Użytkownik został dodany",
                username: ""
            })

        })

    })

})

router.get('/logout', (req, res, next)=> {
    res.clearCookie('session');
    res.redirect('/login')
})

module.exports = router