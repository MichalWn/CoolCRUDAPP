var express = require("express");
var router = express.Router();
var db = require("../db");
const config = require("../config");
var jsonwebtoken = require("jsonwebtoken");

function getIsAdmin(token, res) {
	try {
		const tokenVerify = jsonwebtoken.verify(token, config.SECRET);
		return tokenVerify.isAdmin;
	} catch (e) {
		return res.redirect("/login");
	}
}

function getUsername(token, res) {
	try {
		const tokenVerify = jsonwebtoken.verify(token, config.SECRET);
		return tokenVerify.username;
	} catch (e) {
		return res.redirect("/login");
	}
}

/* GET users listing. */
router.get("/", function (req, res, next) {
	const sql = `SELECT * FROM samochody`;

	db.all(sql, [], (err, rows) => {
		if (err)
			return console.error("Błąd przy próbie pobrania samochodow z bazy", err);
		// const sessionToken = req.session.token;
		// const tokenVerify = jsonwebtoken.verify(sessionToken, config.SECRET);
		// console.log(tokenVerify);
		const isAdmin = getIsAdmin(req.session.token, res);
		if (isAdmin === 0) {
			res.render("cars/list", {
				title: "Samochody - lista",
				username: getUsername(req.session.token, res),
				data: rows,
			});
		} else if (isAdmin === 1) {
			res.render("cars/listAdmin", {
				title: "Samochody - admin",
				username: getUsername(req.session.token, res),
				data: rows,
			});
		}
	});
});

router.get("/edit/:id", (req, res, next) => {
	const { id } = req.params;

	const sql = `SELECT * FROM samochody WHERE id=$1`;

	db.all(sql, [id], (err, rows) => {
		if (err) return console.error("Błąd przy próbie pobrania samochodow", err);
		const isAdmin = getIsAdmin(req.session.token, res);
		if (isAdmin === 1) {
			res.render("cars/edit", {
				title: `Edycja samochodu: ${rows[0].marka}`,
				data: rows,
				username: getUsername(req.session.token, res),
			});
		} else {
			res.redirect("/cars");
		}
	});
});

router.post("/edit/:id", (req, res, next) => {
	const { marka, model, rocznik, cena } = req.body;
	const { id } = req.params;

	const isAdmin = getIsAdmin(req.session.token, res);
	if (isAdmin === 1) {
		const sql = `UPDATE samochody SET marka=$1, model=$2, rocznik=$3, cena=$4 WHERE id=$5`;
		db.all(sql, [marka, model, rocznik, cena, id], (err, result) => {
			if (err) return console.error("Błąd przy aktualizacji", err);
			res.redirect("/cars");
		});
	} else {
		res.redirect("/cars");
	}
});

router.get("/delete/:id", (req, res, next) => {
	const { id } = req.params;

	const isAdmin = getIsAdmin(req.session.token, res);
	if (isAdmin === 1) {
		const sql = `DELETE FROM samochody WHERE id=$1`;
		db.all(sql, [id], (err, result) => {
			if (err)
				return console.error("Błąd przy próbie usunięcia samochodu z bazy", err);

			res.redirect("/cars");
		});
	} else {
		res.redirect("/cars");
	}
});

module.exports = router;
