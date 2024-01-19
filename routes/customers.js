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

function getUserName(token, res) {
	try {
		const tokenVerify = jsonwebtoken.verify(token, config.SECRET);
		return tokenVerify.username;
	} catch (e) {
		return res.redirect("/login");
	}
}

/* GET users listing. */
router.get("/", function (req, res, next) {
	const sql = `SELECT * FROM customers`;

	db.all(sql, [], (err, rows) => {
		if (err)
			return console.error("Błąd przy próbie pobrania klientów z bazy", err);
		// const sessionToken = req.session.token;
		// const tokenVerify = jsonwebtoken.verify(sessionToken, config.SECRET);
		// console.log(tokenVerify);
		const isAdmin = getIsAdmin(req.session.token, res);
		if (isAdmin === 0) {
			res.render("customer/list", {
				title: "Customer - klienci",
				username: getUserName(req.session.token, res),
				data: rows,
			});
		} else if (isAdmin === 1) {
			res.render("customer/listAdmin", {
				title: "Customer - klienci",
				username: getUserName(req.session.token, res),
				data: rows,
			});
		}
	});
});

router.get("/edit/:id", (req, res, next) => {
	const { id } = req.params;

	const sql = `SELECT * FROM customers WHERE id=$1`;

	db.all(sql, [id], (err, rows) => {
		if (err) return console.error("Błąd przy próbie pobrania klientów", err);
		const isAdmin = getIsAdmin(req.session.token, res);
		if (isAdmin === 1) {
			res.render("customer/edit", {
				title: `Edycja klienta: ${rows[0].name}`,
				data: rows,
				username: getUserName(req.session.token, res),
			});
		} else {
			res.redirect("/customers");
		}
	});
});

router.post("/edit/:id", (req, res, next) => {
	const { name, address, email, phone } = req.body;
	const { id } = req.params;

	const isAdmin = getIsAdmin(req.session.token, res);
	if (isAdmin === 1) {
		const sql = `UPDATE customers SET name=$1, address=$2, email=$3, phone=$4 WHERE id=$5`;
		db.all(sql, [name, address, email, phone, id], (err, result) => {
			if (err) return console.error("Błąd przy aktualizacji", err);
			res.redirect("/customers");
		});
	} else {
		res.redirect("/customers");
	}
});

router.get("/delete/:id", (req, res, next) => {
	const { id } = req.params;

	const isAdmin = getIsAdmin(req.session.token, res);
	if (isAdmin === 1) {
		const sql = `DELETE FROM customers WHERE id=$1`;
		db.all(sql, [id], (err, result) => {
			if (err)
				return console.error("Błąd przy próbie usunięcia klienta z bazy", err);

			res.redirect("/customers");
		});
	} else {
		res.redirect("/customers");
	}
});

module.exports = router;
