const request = require("request-promise");
const cheerio = require("cheerio");
 
async function getVideoUrl(url) {
	if (typeof url !== "string") throw new Error("URL must be string");

	url = new URL(url);

	let next = false;

	// Validation URL
	switch (url.hostname) {
  	case "www.facebook.com":
  	case "facebook.com":
  	case "m.facebook.com":
  	case "mbasic.facebook.com":
  	case "fb.watch":
  	case "fb.com":
  		next = true;
  		break;
  	default:
  		next = false;
  		break;
	}

	if (!next) throw new Error("Invalid URL!");
	if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("Invalid protocol");
	if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("Invalid protocol");
	
	let response;

	try {
		response = await request({
		  uri: "https://fdown.net/download.php",
		  method: "POST",
		  formData: {
		    URLz: url.href
		  }
		});
	} catch (e) {
	  throw new Error("ERR: Error when trying to request or maybe link is invalid");
	}
	
	let $;

	try {
		$ = cheerio.load(response);
	} catch (e) {
	  throw new Error("ERR: Error when trying to load response");
	}
    
	let obj = {
		sd: $("#sdlink").attr("href"),
		hd: $("#hdlink").attr("href")
	};

	return obj;
}

module.exports.getVideoUrl = getVideoUrl;