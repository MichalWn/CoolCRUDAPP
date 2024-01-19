var express = require("express");
var router = express.Router();
var db = require("../db");
var bcrypt = require("bcrypt");
var jsonwebtoken = require("jsonwebtoken");
const config = require("../config");
const { Logger, loggers } = require("winston");
const logs = require("../logs/log");

/* GET home page. */
router.get("/", function (req, res, next) {
	res.render("index", { title: "Customer panel" });
});

router.get("/login", (req, res, next) => {
	res.render("login", {
		title: "Admin - logowanie",
		message: "",
	});
});

router.post("/login", (req, res, next) => {
	const { login, haslo } = req.body;

	const sql = `SELECT * FROM users WHERE login=$1 LIMIT 1`;

	db.all(sql, [login], async (err, rows) => {
		if (err) return console.error("Błąd odczytu z bazy");

		if (rows.length === 0) {
			return res.render("login", {
				title: "Admin - logowanie",
				message: "Użytkownik nie istnieje",
			});
		}

		const comparedPassword = await bcrypt.compare(haslo, rows[0].haslo);

		if (comparedPassword === false) {
			return res.render("login", {
				title: "Admin - logowanie",
				message: "Hasło jest nieprawidłowe",
			});
		} else {
			req.session.admin = 1;

			const token = jsonwebtoken.sign(
				{
					username: rows[0].login,
					isAdmin: rows[0].czyAdmin,
				},
				config.SECRET,
				{
					expiresIn: 60 * 60, //godzina
				}
			);

			req.session.token = token;
	

			logs.info(`Zalogowano ${rows[0].login}`);

			res.redirect("/cars");
		}
	});
});

module.exports = router;
