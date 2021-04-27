const { Router } = require("express");
const { validateToken } = require("../middlewares");

const options = Router();

options.options("/", (req, res) => {
	//header {Authorization: "Bearer -access token-"}
	const options = [
		{
			method: "post",
			path: "/users/register",
			description: "Register, Required: email, name, password",
			example: {
				body: { email: "user@email.com", name: "user", password: "password" },
			},
		},
		{
			method: "post",
			path: "/users/login",
			description: "Login, Required: valid email and password",
			example: { body: { email: "user@email.com", password: "password" } },
		},
		{
			method: "post",
			path: "/users/token",
			description: "Renew access token, Required: valid refresh token",
			example: { headers: { token: "*Refresh Token*" } },
		},
		{
			method: "post",
			path: "/users/tokenValidate",
			description: "Access Token Validation, Required: valid access token",
			example: { headers: { Authorization: "Bearer *Access Token*" } },
		},
		{
			method: "get",
			path: "/api/v1/information",
			description: "Access user's information, Required: valid access token",
			example: { headers: { Authorization: "Bearer *Access Token*" } },
		},
		{
			method: "post",
			path: "/users/logout",
			description: "Logout, Required: access token",
			example: { body: { token: "*Refresh Token*" } },
		},
		{
			method: "get",
			path: "api/v1/users",
			description: "Get users DB, Required: Valid access token of admin user",
			example: { headers: { authorization: "Bearer *Access Token*" } },
		},
	];

	let availableOptions;
	const auth = req.header("authorization");
	if (!auth) return res.status(200).json([options[0], options[1]]);
	const token = auth.split(" ")[1];
	try {
		const decoded = jwt.verify(token, ACCESS_KEY);
		console.log("decoded admin", decoded);
		if (!decoded.isAdmin)
			availableOptions = [
				options[0],
				options[1],
				options[2],
				options[3],
				options[4],
				options[5],
			];
		if (decoded.isAdmin) availableOptions = options;
	} catch (err) {
		availableOptions = [options[0], options[1], options[2], options[3]];
	}
	res.status(200).json(availableOptions);
});

module.exports = options;
