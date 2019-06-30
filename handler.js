'use strict';
const request = require("request-promise-native");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports.getFriends = async({ pathParameters }) => {

	const uri = `https://www.last.fm/user/${pathParameters.user}/following`;

	try {
		const body = await request.get({uri, simple: true});

		const dom = new JSDOM(body);
		const friends = [];
		dom.window.document
			.querySelectorAll("ul.user-list a.user-list-link")
			.forEach(a => friends.push(a.innerHTML));
		return {
			statusCode: 200,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Credentials": true
			},
			body: JSON.stringify(friends)
		};
	} catch (e) {
		if (e.statusCode == 404) {
			return {
				statusCode: 404,
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Credentials": true
				},
				body: "Username not found"
			};
		}
		return {
			statusCode: 500, 
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Credentials": true
			}
		};
	}
};
