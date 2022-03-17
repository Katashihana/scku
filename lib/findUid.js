const request = require("request-promise");
const cheerio = require("cheerio");
const axios = require("axios")
const qs = require("qs")

function fbdownlod(url){
	return new Promise((resolve,reject) => {
	let config = {
		'url': url
		}
	axios('https://fdown.net/download.php',{
			method: "POST",
		  formData: {
		    URLz: url.href
			}
		})
	.then(async({ data }) => {
		const $ = cheerio.load(data);	
		resolve({
			sd: $("#sdlink").attr("href"),
		    hd: $("#hdlink").attr("href")
			})
		})
	.catch(reject)
	})
}

module.exports.fbdownlod = fbdownlod;