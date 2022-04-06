const axios = require("axios")
const cheerio = require('cheerio')
const request = require('request')
const fs = require('fs')
const puppeteer = require('puppeteer')
const former = require("form-data")
const {
	fromBuffer
} = require('file-type');
const author = "Katashi"

async function Action() {
  return new Promise((resolve, reject) => {
    axios.get(`https://movieofotaku.blogspot.com/search/label/Action`)
      .then(({
        data
      }) => {
        const $ = cheerio.load(data)
        let synopsis = []
     let url = []
     let img = []
 	$('div.thumbnail > a').get().map((rest) => {
         url.push($(rest).attr('href'))
         })
         $('div.snippet-ongoing').get().map((rest) => {
        	synopsis.push($(rest).text())
         })
         $('div.thumbnail > a > img').get().map((rest) => {
        	img.push($(rest).attr('src'))
         })
     let result = []
     for (let i = 0; i < url.length; i++) {
          result.push({
               	sinopsis: synopsis[i],
               	link: url[i],
               	img: img[i]
          })
     }
            
        const res = {
            status: 200,
            author: "katashi",
            hasil: result
          }
          resolve(res)
      })
      .catch(reject)
  })
}

async function shorturl(url, alias) {
    return new Promise((resolve, reject) => {
        const aliasna = alias || ''
        axios.post('https://tinyurl.com/create.php', {
            'source': 'create',
            'url': url,
            'submit': 'Make TinyURL!',
            'alias': aliasna
        }).then(({ data }) => {
            resolve(data)
        })
    })
}

async function getUrlTiny(url) {
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then((response) => {
                const result = response.request.res.responseUrl
                
                const res = {
            status: 200,
            author: "katashi",
            hasil: result
          }
          resolve(res)
            }).catch(reject)
    })

}

async function searchLineSticker(query) {
     return new Promise((resolve, reject) => {
          axios.request({
               url: 'https://store.line.me/search/id?q=' + query,
               method: 'get',
               headers: {
                    Cookies: 'uu=b1WTj6v25XycORW8AAbn5l1o3p1oFK4IdSTgN6PUlgRHpNnaA5B92AZcK2voKHbo; fs=%7B%221%22%3A%7B%22impressed%22%3Afalse%7D%2C%222%22%3A%7B%22impressed%22%3Afalse%7D%2C%223%22%3A%7B%22impressed%22%3Afalse%7D%2C%224%22%3A%7B%22impressed%22%3Afalse%7D%7D; _ga=GA1.2.1178183582.1607484022; _trmccid=8efd163d8815b247; _ga=GA1.3.1178183582.1607484022; XSRF-TOKEN=57bd64c7-6a65-492b-8185-da991a4a321f; display_lang=id; ss=RCVSTjEPJwWR5RZ5n1ksm2gks527xxnxQOGHHx5XS9PG6905D2Lr4SfCqdUObFUqHJ8rUUpGZKnu1BSN16nxGYqwZeRUrNQXMwHS:164862:176e41e63da; _trmcdisabled2=-1; _trmcuser={"id":"","attr1":"4g","attr2":"PC","attr3":false,"attr4":false}; _gid=GA1.2.2024142913.1610144970; _gid=GA1.3.2024142913.1610144970; _trmcsession={"id":"9bfc398d1a8637f6","path":"/search/id","query":"?q=minecraft","params":{},"time":1610149248526}; _trmcpage=/search/id; __try__=1610149660198; _gat_UA-51908971-1=1; '
               }
          })
          .then(({ data }) => {
               fs.writeFileSync('./datachord.html', data)
               const $ = cheerio.load(data)
               console.log(data)
               resolve(data)
          }).catch(reject)
     })
}

async function savefrom(link) {
     let dl = `${link}`
     let url = 'https://id.savefrom.net/9-how-to-download-facebook-video.html'
     const browser = await puppeteer.launch({
          headless: false,
          executablePath: 'C://Program Files//Google//Chrome//Application//chrome.exe',
          defaultViewport: null
     })
     const page = await browser.newPage()
     await page.goto(url)
     await page.type('#sf_url', dl)
     await page.click('#sf_submit')
     await page.waitForSelector('a.link.link-download')
     const bodyHandle = await page.$('body');
     const html = await page.evaluate(body => body.innerHTML, bodyHandle);
     await bodyHandle.dispose();
     const $ = cheerio.load(html)
     const title = $('div.row.title').attr('title')
     const urls = $('#sf_result > div > div.result-box.video > div.info-box > div.link-box > div.def-btn-box > a').attr('href')
     resolve({
			title: title,
          url: urls
		})
     await browser.close()
}

async function charaCheck(query) {
     return new Promise((resolve, reject) => {
          const char = query
          axios.get('https://myanimelist.net/character.php?cat=character&q=' + char)
          .then(({ data }) => {
               const $ = cheerio.load(data)
               const selector = '#content > table > tbody > tr:nth-child(1) > td > a'
               const small = $('#content > table > tbody > tr:nth-child(1) > td:nth-child(2) > small').text()
               const name = $(selector).text() + ' ' + small
               const url = $(selector).attr('href')
               resolve({
                    status: 200,
                    author: "katashi",
                    name: name,
                    message: `Found chara ${name} and added to database!`
               })

          }).catch(e => reject({
               status: 404,
               message: `Character ${query} was not found!`
          }))
     })
}

async function chara(query) {
     return new Promise((resolve, reject) => {
          const char = query
          axios.get('https://myanimelist.net/character.php?cat=character&q=' + char)
          .then(({ data }) => {
               const $ = cheerio.load(data)
               const selector = '#content > table > tbody > tr:nth-child(1) > td > a'
               const small = $('#content > table > tbody > tr:nth-child(1) > td:nth-child(2) > small').text()
               const name = $(selector).text() + ' ' + small
               const url = $(selector).attr('href')
               let manga = []
               selector_mov = '#content > table > tbody > tr:nth-child(1) > td:nth-child(3) > small > a'
               let serial = []
               $(selector_mov).get().map((res) => {
                    const name = $(res).text()
                    const url = 'https://myanimelist.net' + $(res).attr('href')
                    serial.push({
                         Anime: name,
                         url: url
                    })
               })
               let grab_frinst = $('#content > table > tbody > tr:nth-child(1) > td > small > div > a')
               if ($(`${grab_frinst}`).attr('href') === undefined) {
               } else {
                    manga.push({
                         name: $(grab_frinst).text(),
                         url: 'https://myanimelist.net' + $(`${grab_frinst}`).attr('href')
                    })
               }

               axios.get(url)
               .then(({ data }) => {
                    let imgs = []
                    const $ = cheerio.load(data)
                    const res_desc = $('#content > table > tbody > tr > td:nth-child(2)').text().split('\n\n\n\n\n\t  ')[1].split('            \n        \n')[0].replace(')',')\n')
                    $('#content > table > tbody > tr > td.borderClass > div > a > img').get().map((rest) => {
                         imgs.push($(rest).attr('data-src'))
                    })
                    const elseimg = ['https://mrhrtz-wabot.000webhostapp.com/cooltext372748737425114.png']
                    const sendImg = imgs.length > 0 ? imgs : elseimg
                    const result = {
                         status: 200,
                         author: "katashi",
                         name: name,
                         image: sendImg,
                         full_desc: res_desc,
                         url: url,
                         anime: serial,
                         manga: manga
                    }
                    resolve(result)
               }).catch(reject)
          }).catch(e => reject({
               status: 404,
               message: `Character ${query} was not found!`
          }))
     })
}

async function brainlydetail(url) {
     return new Promise((resolve, reject) => {
axios.get(url)
.then(({ data }) => {
    let answer = []
    const $ = cheerio.load(data)
    $('div[data-test="answer-box-text"]').get().map((rest) => {
        answer.push($(rest).text().replace('\n',''))
    })
    let media = [] 
    let media_question = []
    $('div[data-test="question-box-attachments"] > div > div > div > img.brn-qpage-next-attachments-viewer-image-preview__image').get().map((rest) => {
        if ($(rest).length) {
            media_question.push($(rest).attr('src'))
        }
    })
    $('div[data-test="answer-box-attachments"] > div > div > div > img.brn-qpage-next-attachments-viewer-image-preview__image').get().map((rest) => {
        if ($(rest).length) {
            media.push($(rest).attr('src'))
        }
    })
    const time = $('div.sg-text.sg-text--xsmall.sg-text--gray-secondary > time').attr('datetime')
    const mapel = $('a[data-test="question-box-subject"]').text().replace(/\n/g,'')
    const kelas = $('a[data-test="question-box-grade"]').text().replace(/\n/g,'')
    const pertanyaan = $('h1[data-test="question-box-text"] > span').text().replace('\n','')
    let jawaban = []
    for (let i = 0; i < answer.length; i++) {
        jawaban.push({
            teks: answer[i],
            media: media[i] || []
        })        
    }
    const result = { 
    	author: "katashi",
        pertanyaan: pertanyaan,
        foto_pertanyaan: media_question,
        waktu_dibuat: time,
        kelas: kelas,
        mapel: mapel,
        jawaban: jawaban
    }
    resolve(result)
    })
  })
}

async function brainly(pertanyaan,jumlah,callback){
  return new Promise((resolve,reject)=>{
    require("brainly-scraper")(pertanyaan.toString(),Number(jumlah)).then((res) => {
      let brainlyResult = []
      res.data.forEach((ask) => {
        let opt = {
          author: "katashi",
          pertanyaan: ask.pertanyaan,
          fotoPertanyaan: ask.questionMedia
        }
        ask.jawaban.forEach(answer => {
          opt.jawaban = {
            judulJawaban: answer.text,
            fotoJawaban: answer.media
          }
        })
        brainlyResult.push(opt)
      })
      resolve(brainlyResult)
    }).then(a => {
        callback(a)
    }).catch(reject)
  })
}

async function brainly2(query){
    const browser = await puppeteer.launch({
        headless: false,
        //executablePath: 'C://Program Files//Google//Chrome//Application//chrome.exe'
    });
    const page = await browser.newPage();
    const q = '${query}';
    await page.goto(`https://brainly.co.id/app/ask?&q=${q}`,{
        waitUntil: 'networkidle0',
    })
    await page.waitForSelector('a.sg-text')
    const bodyHandle = await page.$('body');
    const data = await page.evaluate(body => body.innerHTML, bodyHandle);
    await bodyHandle.dispose();
    const $ = cheerio.load(data)
    let url = []
    let title = []
    $('div > a.sg-text.sg-text--small.sg-text--link.sg-text--bold.sg-text--blue-dark').get().map((rest) => {
        url.push($(rest).attr('href'))
    })
    $('div > div > div.sg-text.sg-text--default.sg-text--break-words').get().map((rest) => {
        title.push($(rest).text())
    })
    let result = []
     for (let i = 0; i < url.length; i++) {
          resolve({
			title: title[i],
            url: url[i]
		})
     }
    await browser.close();
    }
    
async function brainly3(q) {
	return new Promise(async(resolve,reject) => {
	axios.get('https://brainly.co.id/app/ask?&q=${q}')
	.then(({ data }) => {
	const $ = cheerio.load(data)
	let url = []
    let title = []
    $('div > a.sg-text.sg-text--small.sg-text--link.sg-text--bold.sg-text--blue-dark').get().map((rest) => {
        url.push($(rest).attr('href'))
    })
    $('div > div > div.sg-text.sg-text--default.sg-text--break-words').get().map((rest) => {
        title.push($(rest).text())
    })
	for (let i = 0; i < url.length; i++) {
		resolve({
			title: title[i],
            url: url[i]
		})
	}
})
	.catch(reject)
	})
} 

async function Adventure() {
  return new Promise((resolve, reject) => {
    axios.get(`https://movieofotaku.blogspot.com/search/label/Adventure`)
      .then(({
        data
      }) => {
        const $ = cheerio.load(data)
        let synopsis = []
     let url = []
     let img = []
 	$('div.thumbnail > a').get().map((rest) => {
         url.push($(rest).attr('href'))
         })
         $('div.snippet-ongoing').get().map((rest) => {
        	synopsis.push($(rest).text())
         })
         $('div.thumbnail > a > img').get().map((rest) => {
        	img.push($(rest).attr('src'))
         })
     let result = []
     for (let i = 0; i < url.length; i++) {
          result.push({
               	sinopsis: synopsis[i],
               	link: url[i],
               	img: img[i]
          })
     }
            
        const res = {
            status: 200,
            author: "katashi",
            hasil: result
          }
          resolve(res)
      })
      .catch(reject)
  })
}

async function imgkey(url, imeg) {
	var u = new URL(url)
	var a = await coki()
	try {
		var form = new former()
		form.append("image", imeg, {
			filename: `${Math.floor(Math.random() * 10000)}.jpg`
		})
		var b = await axios.request("https://photofunia.com/images?server=1", {
			method: "POST",
			data: form.getBuffer(),
			headers: {
				"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; Flow) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/359.0.0.288 Safari/537.36",
				"Accept": "application/json, text/javascript, */*; q=0.01",
				"Host": "photofunia.com",
				cookie: a.coki + "; accept_cookie=true",
				...form.getHeaders(),
				"Accept-Language": "id-ID,id;q=0.9,en-GB;q=0.8,en;q=0.7,en-US;q=0.6",
				"Referer": "https://photofunia.com" + u.pathname
			}
		})
		var imgkey = b.data.response.key
		return ({
			key: imgkey,
			coki: a.coki,
			data: b.data
		})
	} catch (e) {
		if (e.response) {
			return ({
				status: "gagal",
				msg: e.response.statusText
			})
		} else {
			return ({
				status: "gagal", 
				msg: "bukan link gambar itu bang"
			})
		}
		console.log(e)
	}
}

async function photofunimg(url, imeg) {
	var u = new URL(url)
	if (!/https:\/\/.+\.photofunia.+/g.test(url)) {
		return resolve({
			status: "gagal", 
			msg: "itu bukan link dari photofunia"
		})
	}
	var key = await imgkey(url, imeg)
	console.log(key)
	try {
		form2 = new former()
		form2.append('current-category', "all_effects");
		form2.append('image', key.key);
		form2.append("image:crop", "0");
		c = await axios.request("https://photofunia.com" + u.pathname + "?server=1", {
			method: "POST",
			data: form2.getBuffer(),
			headers: {
				"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; Flow) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/359.0.0.288 Safari/537.36",
				"Accept": "application/json, text/javascript, */*; q=0.01",
				"Host": "photofunia.com",
				cookie: key.coki + "; accept_cookie=true",
				...form2.getHeaders(),
				"Accept-Language": "id-ID,id;q=0.9,en-GB;q=0.8,en;q=0.7,en-US;q=0.6",
				"Referer": "https://photofunia.com" + u.pathname
			}
		})
		var img = /data-share-image="(.+?)"/.exec(c.data)[1]
		return ({
			status: "sukses",
			author: "katashi",
			url: img
		})
	} catch (e) {
		if (e.response) {
			return ({
				status: "gagal",
				msg: e.response.statusText
			})

		} else {
			return ({
				status: "gagal", 
				msg: "error nih"
			})
		}
		console.log(e)
	}
}

async function photofuntext(url, text) {
	return new Promise(async (resolve, reject) => {
		if (!/https:\/\/.+\.photofunia.+/g.test(url)) {
			return resolve({
				msg: "itu bukan link dari photofunia"
			})
		}
		var u = new URL(url)
		try {
			a = await axios.request("https://photofunia.com/cookie-warning?server=1", {
				"method": "GET",
				"headers": {
					"Host": "photofunia.com",
					"Referer": "https://photofunia.com" + u.pathname
				}
			})
			var coki = a.headers['set-cookie'][0].split(';')[0]
			var form = new former()
			form.append('current-category', 'all_effect')
			form.append('text', text)

			var b = await axios.request("https://photofunia.com" + u.pathname + "?server=1", {
				method: "POST",
				data: form.getBuffer(),
				headers: {
					accept: '*/*',
					'accept-language': 'en-US,en;q=0.9',
					...form.getHeaders(),
					'referer': 'https://photofunia.com' + u.pathname,
					'user-agent': 'Mozilla/5.0 (X11; Linux x86_64; Flow) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/359.0.0.288 Safari/537.36',
					cookie: coki + "; accept_cookie=true"
				}
			})

			var img = /data-share-image="(.+?)"/.exec(b.data)[1]
			return resolve({
				status: "sukses",
				author: "katashi",
				url: img
			})
		} catch (e) {
			if (e.response) {
				return resolve({
					status: "gagal",
					msg: e.response.statusText
				})

			} else {
				return resolve({
					status: "gagal", 
					msg: "salah link mungkin"
				})
			}
			console.log(e)
		}
	})
}

async function wattpad(judul) {
	return new Promise((resolve, reject) => {
		axios.get("https://www.wattpad.com/search/" + judul).then(({
				data
			}) => {
				var $ = cheerio.load(data)
				var result = [];
				var jdl = [];
				var img = [];
				var des = [];
				var lnk = [];
				var red = [];
				var vt = [];
				var cp = [];
				var dur = [];
				var limk = 'https://www.wattpad.com'
				$('div.story-card-data.shown-xxs > div.top-section > div.cover').each(function(a, b) {
					img.push($(b).find('img').attr('src'))
				})
				$('div.story-card-data.shown-xxs > div.top-section > div.story-info > div.title').each(function(a, b) {
					jdl.push($(b).text().trim())
				})
				$('div.story-card-data.shown-xxs > div.description').each(function(a, b) {
					des.push($(b).eq(0).text().trim())
				})
				$('a.story-card').each(function(a, b) {
					lnk.push(limk + $(b).attr('href'))
				})
				$('div.story-card-data.shown-xxs > div.top-section > div.story-info >  ul.new-story-stats > li:nth-child(1) > div.icon-container > div.tool-tip > span.stats-value').each(function(a, b) {
					red.push($(b).text())
				})
				$('div.story-card-data.shown-xxs > div.top-section > div.story-info >  ul.new-story-stats > li:nth-child(2) > div.icon-container > div.tool-tip > span.stats-value').each(function(a, b) {
					vt.push($(b).text().trim())
				})
				$('div.story-card-data.shown-xxs > div.top-section > div.story-info >  ul.new-story-stats > li:nth-child(3) > div.icon-container > div.tool-tip > span.stats-value').each(function(a, b) {
					cp.push($(b).text())
				})
				$('div.story-card-data.shown-xxs > div.top-section > div.story-info >  ul.new-story-stats > li:nth-child(4) > div.icon-container > div.tool-tip > span.stats-value').each(function(a, b) {
					dur.push($(b).text())
				})
				for (let i = 0; i < lnk.length; i++) {
					result.push({
						author: "katashi",
						judul: jdl[i],
						desc: des[i],
						reads: red[i],
						votes: vt[i],
						chapters: cp[i],
						durations: dur[i],
						image: img[i],
						link: lnk[i]
					})

				}
				resolve(result)
			})
			.catch({
				message: 'err'
			})

	})
}

async function random_detail(judul) {
	return new Promise((resolve, reject) => {
		wattpad(judul).then(res => {
			let a = JSON.parse(JSON.stringify(res))
			let b = a[Math.floor(Math.random() * a.length)];
			axios.get(b.link).then(({
				data
			}) => {
				var $ = cheerio.load(data)

				var pp_author = $('div.author-info').find('img').attr('src')
				var author = $('div.story-details-page > div.story-header > div.story-info > div.author-info > div.author-info__username > a').text().trim()
				var link_author = $('div.story-details-page > div.story-header > div.story-info > div.author-info > div.author-info__username > a').attr('href')
				var rc = [];
				var tc = [];
				var to = [];
				$('div.story-parts.shown-xxs > ul > li > a').each(function(a, b) {
					rc.push($(b).attr('href'))
				})
				$('div.story-parts.shown-xxs > ul > li > a > div.part__label').each(function(a, b) {
					tc.push($(b).text().trim())
				})

				for (let i = 0; i < tc.length; i++) {
					to.push({
						title_part: tc[i],
						link_part: 'https://wattpad.com' + rc[i]
					})

				}
				resolve({
					author: "katashi",
					judul: b.judul,
					desc: b.desc,
					reads: b.reads,
					votes: b.votes,
					chapters: b.chapters,
					duration: b.durations,
					image: b.image,
					link: b.link,
					author,
					pp_author,
					link_author: 'https://www.wattpad.com' + link_author,
					read_chapters: to
				})
			})
		})
	})
}

async function sfile(urlnya) {
	return new Promise((resolve, reject) => {
		let oi = axios.request({
				url: urlnya,
				method: 'get',
				headers: {
					Accept: 'application/json, text/plain, */*',
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
				}
			})
			.then(({
				data
			}) => { //console.log(data)
				const $ = cheerio.load(data)
				const link = $('a#download').attr('href')
				let judul = $('div > b').text()
				let uploadet = $('div.list').eq(2).text().replace('\n - Uploaded: ', '')
				let total = $('div.list').eq(3).text().replace('\n - Downloads: ', '')
				let deskripsi = $('div.list').eq(4).text().replace('\n', ' ')
				let res = {
					status: true,
					msg: "Thanks For Using This API",
					result: {
						author: "katashi",
						title: judul,
						tanggal_upload: uploadet,
						total_download: total,
						deskripsi: deskripsi,
						url_download: link
					}
				}
				resolve({
					res
				})
			}).catch(reject)
	})
}

async function radio(url) {
	var a = await axios.request(url, {
		headers: {
			accept: '/',
			'accept-language': "en-US,en;q=0.9",
			'content-type': "application/x-www-form-urlencoded; charset=UTF-8",
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'
		}
	})
	var $ = cheerio.load(a.data)
	let radio1 = []
	let radio2 = []
	let value = {
		radio1,
		radio2
	}
	$("input[name='radio0[radio]']").each(function(palse, terue) {
		radio1.push($(terue).attr('value'))
	})
	$("input[name='radio1[radio]']").each(function(palse, terue) {
		radio2.push($(terue).attr('value'))
	})
	return value
}

async function ephotoi(url, image) {
	if (!/^https:\/\/ephoto360\.com\/.+\.html$/.test(url) && !/^https:\/\/en.ephoto360\.com\/.+\.html$/.test(url))
		throw new Error("Invalid URL");
	var a = await axios.request(url, {
		method: 'GET',
		headers: {
			accept: '/',
			'accept-language': "en-US,en;q=0.9",
			'content-type': "application/x-www-form-urlencoded; charset=UTF-8",
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'
		}
	})
	var html = a.data
	var $ = cheerio.load(html)
	var cookies = a.headers['set-cookie'].toString()
	var fs = require("fs")
	var c = await upload(image)
	var form = new former()
	if (typeof c === "string") c = [c]
	for (texts of c) form.append("image[]", texts)
	form.append("file_image_input", "")
	form.append("submit", $("input[name=submit]").attr("value"))
	form.append("token", $("input[name=token]").attr("value"))
	form.append("build_server", "https://s1.ephoto360.com")
	form.append("build_server_id", $("input[name=build_server_id]").attr("value"))

	var a2 = await axios.request(url, {
		method: 'POST',
		headers: {
			accept: '/',
			'accept-language': "en-US,en;q=0.9",
			...form.getHeaders(),
			cookie: cookies,
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'
		},
		data: form.getBuffer()
	})
	var $$ = cheerio.load(a2.data)
	var form_value = $$("input[name=form_value_input]").attr("value")
	if (!form_value) throw new Error('Token invalid? False')
	var apa = JSON.parse(form_value)
	var e = encodeURIComponent
	var body = Object.keys(apa).map(key => {
		vals = apa[key]
		isArray = Array.isArray(vals)
		keyq = e(key + (isArray ? '[]' : ''))
		if (!isArray) vals = [vals]
		out = []
		for (valq of vals) out.push(keyq + '=' + e(valq))
		return out.join('&')
	}).join('&')
	var headers = {
		cookie: cookies
	}
	var u = new URL(url)
	var d = await axios.request(u.origin + "/effect/create-image", {
		method: 'POST',
		headers: {
			accept: '/',
			'accept-language': "en-US,en;q=0.9",
			'content-type': "application/x-www-form-urlencoded; charset=UTF-8",
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
			...headers
		},
		data: body
	})
	var hasil = {
		author: "katashi",
		data: d.data,
		url: apa.build_server + d.data.image
	}
	return hasil
}
async function ephotoi2(url, image, image2) {
	if (!/^https:\/\/ephoto360\.com\/.+\.html$/.test(url) && !/^https:\/\/en.ephoto360\.com\/.+\.html$/.test(url))
		throw new Error("Invalid URL");
	var a = await axios.request(url, {
		method: 'GET',
		headers: {
			accept: '/',
			'accept-language': "en-US,en;q=0.9",
			'content-type': "application/x-www-form-urlencoded; charset=UTF-8",
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'
		}
	})
	var html = a.data
	var $ = cheerio.load(html)
	var cookies = a.headers['set-cookie'].toString()
	var c = await upload(image).then(async (d) => {
		var a = await upload(image2)
		var b = [d, a]
		return b
	})
	var form = new former()
	if (typeof c === "string") c = [c]
	for (texts of c) form.append("image[]", texts)
	form.append("file_image_input", "")
	form.append("submit", $("input[name=submit]").attr("value"))
	form.append("token", $("input[name=token]").attr("value"))
	form.append("build_server", "https://s1.ephoto360.com")
	form.append("build_server_id", $("input[name=build_server_id]").attr("value"))

	var a2 = await axios.request(url, {
		method: 'POST',
		headers: {
			accept: '/',
			'accept-language': "en-US,en;q=0.9",
			...form.getHeaders(),
			cookie: cookies,
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'
		},
		data: form.getBuffer()
	})
	var $$ = cheerio.load(a2.data)
	var form_value = $$("input[name=form_value_input]").attr("value")
	if (!form_value) throw new Error('Token invalid? False')
	var apa = JSON.parse(form_value)
	var e = encodeURIComponent
	var body = Object.keys(apa).map(key => {
		vals = apa[key]
		isArray = Array.isArray(vals)
		keyq = e(key + (isArray ? '[]' : ''))
		if (!isArray) vals = [vals]
		out = []
		for (valq of vals) out.push(keyq + '=' + e(valq))
		return out.join('&')
	}).join('&')
	var headers = {
		cookie: cookies
	}
	var u = new URL(url)
	var d = await axios.request(u.origin + "/effect/create-image", {
		method: 'POST',
		headers: {
			accept: '/',
			'accept-language': "en-US,en;q=0.9",
			'content-type': "application/x-www-form-urlencoded; charset=UTF-8",
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
			...headers
		},
		data: body
	})
	var hasil = {
		author: "katashi",
		data: d.data,
		url: apa.build_server + d.data.image
	}
	return hasil
}
async function ephotori(url, radio, image) {
	if (!/^https:\/\/ephoto360\.com\/.+\.html$/.test(url) && !/^https:\/\/en.ephoto360\.com\/.+\.html$/.test(url))
		throw new Error("Invalid URL");
	var a = await axios.request(url, {
		method: 'GET',
		headers: {
			accept: '/',
			'accept-language': "en-US,en;q=0.9",
			'content-type': "application/x-www-form-urlencoded; charset=UTF-8",
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'
		}
	})
	var html = a.data
	var $ = cheerio.load(html)
	var cookies = a.headers['set-cookie'].toString()
	var c = await upload(image)
	var form = new former()
	if (typeof c === "string") c = [c]
	for (texts of c) form.append("image[]", texts)
	form.append("file_image_input", "")
	form.append("submit", $("input[name=submit]").attr("value"))
	form.append("token", $("input[name=token]").attr("value"))
	form.append("radio0[radio]", radio)
	form.append("build_server", "https://s1.ephoto360.com")
	form.append("build_server_id", $("input[name=build_server_id]").attr("value"))

	var a2 = await axios.request(url, {
		method: 'POST',
		headers: {
			accept: '/',
			'accept-language': "en-US,en;q=0.9",
			...form.getHeaders(),
			cookie: cookies,
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'
		},
		data: form.getBuffer()
	})
	var $$ = cheerio.load(a2.data)
	var form_value = $$("input[name=form_value_input]").attr("value")
	if (!form_value) throw new Error('Token invalid? False')
	var apa = JSON.parse(form_value)
	var e = encodeURIComponent
	var body = Object.keys(apa).map(key => {
		vals = apa[key]
		isArray = Array.isArray(vals)
		keyq = e(key + (isArray ? '[]' : ''))
		if (!isArray) vals = [vals]
		out = []
		for (valq of vals) out.push(keyq + '=' + e(valq))
		return out.join('&')
	}).join('&')
	var body2 = body.split('radio0=%5Bobject%20Object%5D').join('radio0%5Bradio%5D=' + apa.radio0.radio)
	var headers = {
		cookie: cookies
	}
	var u = new URL(url)
	var d = await axios.request(u.origin + "/effect/create-image", {
		method: 'POST',
		headers: {
			accept: '/',
			'accept-language': "en-US,en;q=0.9",
			'content-type': "application/x-www-form-urlencoded; charset=UTF-8",
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
			...headers
		},
		data: body2
	})
	var hasil = {
		author: "katashi",
		data: d.data,
		url: apa.build_server + d.data.image
	}
	return hasil
}

async function ephototi(url, text, image) {
	if (!/^https:\/\/ephoto360\.com\/.+\.html$/.test(url) && !/^https:\/\/en.ephoto360\.com\/.+\.html$/.test(url))
		throw new Error("Invalid URL");
	var a = await axios.request(url, {
		method: 'GET',
		headers: {
			accept: '/',
			'accept-language': "en-US,en;q=0.9",
			'content-type': "application/x-www-form-urlencoded; charset=UTF-8",
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'
		}
	})
	var html = a.data
	var $ = cheerio.load(html)
	var cookies = a.headers['set-cookie'].toString()
	var c = await upload(image)
	var form = new former()
	if (typeof text === "string") text = [text]
	for (tex of text) form.append("text[]", tex)
	if (typeof c === "string") c = [c]
	for (texts of c) form.append("image[]", texts)
	form.append("file_image_input", "")
	form.append("submit", $("input[name=submit]").attr("value"))
	form.append("token", $("input[name=token]").attr("value"))
	form.append("build_server", "https://s1.ephoto360.com")
	form.append("build_server_id", $("input[name=build_server_id]").attr("value"))

	var a2 = await axios.request(url, {
		method: 'POST',
		headers: {
			accept: '/',
			'accept-language': "en-US,en;q=0.9",
			...form.getHeaders(),
			cookie: cookies,
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'
		},
		data: form.getBuffer()
	})
	var $$ = cheerio.load(a2.data)
	var form_value = $$("input[name=form_value_input]").attr("value")
	if (!form_value) throw new Error('Token invalid? False')
	var apa = JSON.parse(form_value)
	var e = encodeURIComponent
	var body = Object.keys(apa).map(key => {
		vals = apa[key]
		isArray = Array.isArray(vals)
		keyq = e(key + (isArray ? '[]' : ''))
		if (!isArray) vals = [vals]
		out = []
		for (valq of vals) out.push(keyq + '=' + e(valq))
		return out.join('&')
	}).join('&')
	headers = {
		cookie: cookies
	}
	var u = new URL(url)
	var d = await axios.request(u.origin + "/effect/create-image", {
		method: 'POST',
		headers: {
			accept: '/',
			'accept-language': "en-US,en;q=0.9",
			'content-type': "application/x-www-form-urlencoded; charset=UTF-8",
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
			...headers
		},
		data: body
	})
	var hasil = {
		data: d.data,
		url: apa.build_server + d.data.image
	}
	return hasil
}

async function ephototri(url, text, radio, image) {
	if (!/^https:\/\/ephoto360\.com\/.+\.html$/.test(url) && !/^https:\/\/en.ephoto360\.com\/.+\.html$/.test(url))
		throw new Error("Invalid URL");
	var a = await axios.request(url, {
		method: 'GET',
		headers: {
			accept: '/',
			'accept-language': "en-US,en;q=0.9",
			'content-type': "application/x-www-form-urlencoded; charset=UTF-8",
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'
		}
	})
	var html = a.data
	var $ = cheerio.load(html)
	var cookies = a.headers['set-cookie'].toString()
	var c = await upload(image)
	var form = new former()
	if (typeof text === "string") text = [text]
	for (tex of text) form.append("text[]", tex)
	if (typeof c === "string") c = [c]
	for (texts of c) form.append("image[]", texts)
	form.append("file_image_input", "")
	form.append("submit", $("input[name=submit]").attr("value"))
	form.append("token", $("input[name=token]").attr("value"))
	form.append("radio0[radio]", radio)
	form.append("build_server", "https://s1.ephoto360.com")
	form.append("build_server_id", $("input[name=build_server_id]").attr("value"))

	var a2 = await axios.request(url, {
		method: 'POST',
		headers: {
			accept: '/',
			'accept-language': "en-US,en;q=0.9",
			...form.getHeaders(),
			cookie: cookies,
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'
		},
		data: form.getBuffer()
	})
	var $$ = cheerio.load(a2.data)
	var form_value = $$("input[name=form_value_input]").attr("value")
	if (!form_value) throw new Error('Token invalid? False')
	var apa = JSON.parse(form_value)
	var e = encodeURIComponent
	var body = Object.keys(apa).map(key => {
		vals = apa[key]
		isArray = Array.isArray(vals)
		keyq = e(key + (isArray ? '[]' : ''))
		if (!isArray) vals = [vals]
		out = []
		for (valq of vals) out.push(keyq + '=' + e(valq))
		return out.join('&')
	}).join('&')
	var body2 = body.split('radio0=%5Bobject%20Object%5D').join('radio0%5Bradio%5D=' + apa.radio0.radio)
	var headers = {
		cookie: cookies
	}
	var u = new URL(url)
	var d = await axios.request(u.origin + "/effect/create-image", {
		method: 'POST',
		headers: {
			accept: '/',
			'accept-language': "en-US,en;q=0.9",
			'content-type': "application/x-www-form-urlencoded; charset=UTF-8",
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
			...headers
		},
		data: body2
	})
	var hasil = {
		author: "katashi",
		data: d.data,
		url: apa.build_server + d.data.image
	}
	return hasil
}

async function ephoto(url, text) {
	if (!/^https:\/\/ephoto360\.com\/.+\.html$/.test(url) && !/^https:\/\/en.ephoto360\.com\/.+\.html$/.test(url))
		throw new Error("Invalid URL");
	var a = await axios.request(url, {
		method: 'GET',
		headers: {
			accept: '/',
			'accept-language': "en-US,en;q=0.9",
			'content-type': "application/x-www-form-urlencoded; charset=UTF-8",
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'
		}
	})
	var html = a.data
	var $ = cheerio.load(html)
	var cookies = a.headers['set-cookie'].toString()
	var form = new former()
	if (typeof text === "string") text = [text]
	for (texts of text) form.append("text[]", texts)
	form.append("submit", $("input[name=submit]").attr("value"))
	form.append("token", $("input[name=token]").attr("value"))
	form.append("build_server", $("input[name=build_server]").attr("value"))
	form.append("build_server_id", $("input[name=build_server_id]").attr("value"))

	var a2 = await axios.request(url, {
		method: 'POST',
		headers: {
			accept: '/',
			'accept-language': "en-US,en;q=0.9",
			...form.getHeaders(),
			cookie: cookies,
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'
		},
		data: form.getBuffer()
	})
	var $$ = cheerio.load(a2.data)
	var form_value = $$("input[name=form_value_input]").attr("value")
	if (!form_value) throw new Error('Token invalid? False')
	var apa = JSON.parse(form_value)
	var e = encodeURIComponent
	var body = Object.keys(apa).map(key => {
		vals = apa[key]
		isArray = Array.isArray(vals)
		keyq = e(key + (isArray ? '[]' : ''))
		if (!isArray) vals = [vals]
		out = []
		for (valq of vals) out.push(keyq + '=' + e(valq))
		return out.join('&')
	}).join('&')
	headers = {
		cookie: cookies
	}
	var u = new URL(url)
	var c = await axios.request(u.origin + "/effect/create-image", {
		method: 'POST',
		headers: {
			accept: '/',
			'accept-language': "en-US,en;q=0.9",
			'content-type': "application/x-www-form-urlencoded; charset=UTF-8",
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
			...headers
		},
		data: body
	})
	var hasil = {
		author: "katashi",
		data: c.data,
		url: apa.build_server + c.data.image
	}
	return hasil
}
async function ephotor(url, text, radio) {
	if (!/^https:\/\/ephoto360\.com\/.+\.html$/.test(url) && !/^https:\/\/en.ephoto360\.com\/.+\.html$/.test(url))
		throw new Error("Invalid URL");
	var a = await axios.request(url, {
		method: 'GET',
		headers: {
			accept: '/',
			'accept-language': "en-US,en;q=0.9",
			'content-type': "application/x-www-form-urlencoded; charset=UTF-8",
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'
		}
	})
	var html = a.data
	var $ = cheerio.load(html)
	var cookies = a.headers['set-cookie'].toString()
	var form = new former()
	if (typeof text === "string") text = [text]
	for (texts of text) form.append("text[]", texts)
	form.append("submit", $("input[name=submit]").attr("value"))
	form.append("token", $("input[name=token]").attr("value"))
	form.append("radio0[radio]", radio)
	form.append("build_server", $("input[name=build_server]").attr("value"))
	form.append("build_server_id", $("input[name=build_server_id]").attr("value"))

	var a2 = await axios.request(url, {
		method: 'POST',
		headers: {
			accept: '/',
			'accept-language': "en-US,en;q=0.9",
			...form.getHeaders(),
			cookie: cookies,
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'
		},
		data: form.getBuffer()
	})
	var $$ = cheerio.load(a2.data)
	var form_value = $$("input[name=form_value_input]").attr("value")
	if (!form_value) throw new Error('Token invalid? False')
	var apa = JSON.parse(form_value)
	var e = encodeURIComponent
	var body = Object.keys(apa).map(key => {
		vals = apa[key]
		isArray = Array.isArray(vals)
		keyq = e(key + (isArray ? '[]' : ''))
		if (!isArray) vals = [vals]
		out = []
		for (valq of vals) out.push(keyq + '=' + e(valq))
		return out.join('&')
	}).join('&')
	var body2 = body.split('radio0=%5Bobject%20Object%5D').join('radio0%5Bradio%5D=' + apa.radio0.radio)
	var headers = {
		cookie: cookies
	}
	var u = new URL(url)
	var c = await axios.request(u.origin + "/effect/create-image", {
		method: 'POST',
		headers: {
			accept: '/',
			'accept-language': "en-US,en;q=0.9",
			'content-type': "application/x-www-form-urlencoded; charset=UTF-8",
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
			...headers
		},
		data: body2
	})
	var hasil = {
		author: "katashi",
		data: c.data,
		url: apa.build_server + c.data.image
	}
	return hasil
}

async function top4top(baper) {
	return new Promise(async (resolve, reject) => {
		const {
			ext
		} = await fromBuffer(baper) || {}
		var req = request({
				url: "https://top4top.io/index.php",
				method: "POST",
				"headers": {
					"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
					"accept-language": "en-US,en;q=0.9,id;q=0.8",
					"cache-control": "max-age=0",
					'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryAmIhdMyLOrbDawcA',
					'User-Agent': 'Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.0.0.585 Mobile Safari/534.11+'
				}
			},
			function(error, response, body) {
				if (error) { return resolve({
					result: 'error'
				}) }
				const $ = cheerio.load(body)
				let result = $('div.alert.alert-warning > ul > li > span').find('a').attr('href') || "gagal"
				if (result == "gagal") {
					resolve({
						status: "error",
						msg: "maybe file not allowed or try another file"
					})
				}
				resolve({
					author: "katashi",
					status: "sukses",
					result
				})
			});
		let form = req.form()
		form.append('file_1_', baper, {
			filename: `${Math.floor(Math.random() * 10000)}.` + `${ext}`
		})
		form.append('file_1_', '')
		form.append('submitr', '[ رفع الملفات ]')
	})
}

async function coki() {
	try {
		var a = await axios.request("https://photofunia.com/images?server=1", {
			method: "GET",
			headers: {
				"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; Flow) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/359.0.0.288 Safari/537.36",
				"Accept": "application/json, text/javascript, */*; q=0.01",
				"Host": "photofunia.com"
			}
		})
		var coki = a.headers['set-cookie'][0].split(';')[0]
		return ({
			coki: coki
		})
	} catch (e) {
		if (e.response) {
			return ({
				status: e.response.status,
				msg: e.response.statusText
			})

		}
		console.log(e)
	}
}

async function pinterest(querry) {
	let HASIL = []
	await axios.request(`https://id.pinterest.com/search/pins/?rs=typed&q=` + querry, {
			method: "GET",
			url: "https://id.pinterest.com/search/pins/?rs=typed&q="+ querry,
			headers: {
				"sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
				"sec-ch-ua-mobile": "?0",
				"upgrade-insecure-requests": "1",
				"cookie": "csrftoken=ebe0be3a93cea6072be18633add953a2; _b=\"AVezvd6F4UtE24FUsA6INxipyZZDoSpyCc5vaJK4QDYXmExosVEc4h6WkiKhlVtQ430=\"; cm_sub=denied; fba=True; _ga=GA1.2.862909259.1620474446; g_state={\"i_l\":0}; _auth=1; _pinterest_sess=TWc9PSZ0VEZqZmdDSlJYaGU5REIvNklIcVlnMjE5b0ZraTE5REJVQ0JiMUwxTkZZaGFoVk1sRDVhOFlwQzhkQnQ0YkMwRlNyV0lIWUFlK0ZVTkVxYUhKNmlvZ0R1UXlQYTBRRVVhMU1yYkpmcXpHK3UyNjNhckRqUFFOYVJVa3RnVmJtVzd2MmRGaHFMZUpLNVhtaHptTDhWSnBSdXhZY0FhRnRTN3J1S0V4cGtsVTBxeE54NkF2blVNSFV3R0NTQTR1bVVNRURGVGdnYlN5UjdBbk9YcHVGbGI3a1kwd1dEZDgrZVM1SDc3V0pJMm00OWxKUDVNQjBLVlFocTB4Mjg1M1RnbGxBaFAxbS9MTnVzei91cEQvcjBtakp6N0ZnU2t1Y3NxWW1DRDV1Q3h0ankvQ3FEWGh3MXczcXBHNXJpYVNCMHB6dUoxMGF6ZzVxN2VqQVBoSElSd0tiQk41ZVRPQXlOaGNpNzVQMWJSeVZJbCtYYVMxQ1ZRUFUwalU3eGVzMGRySlNzdWo1NG5uaXNFM3ZpT0o0TkZHR1daUXlwaXFQclMwa04raW9xVnVaTTRSVGEzTE03TVlZcmZYVDd5UmVPd2lZaGw4aE9VMHJBd0tidEsrcHdPWk96RlFMekVLTzY3VU1PL0tIYUdwUE1IWVdJNnJXalBkU09Sb3dEaHlQVVR1T1RqNW5Sc2FRdmVkZmhkMk9HNHBCL0ZpZ3NMdmZvVW9ReVltTFBCTlNLWHpray9LNWJ2UTNvTlBzVm9aZjRvYWRvRFhla0dBNzdveWJVYXZmVFp2cnFFNU5DYUVwSHhxeDlIajNIVTlHaEVYdGptWm5mSGVSRmtIMmQwVVVVZlVCVEh6UHB3TnBtdWV0b2l6L3VTc3pXMXFGN3lHS3ZJM3BwL0NrWVJDMm1HY2tROGxuQVFRNS9OUW45R3dtSk8zeFJidVFSTG1qTG5PelAvKzd3T3lrN1NoKzBHVGNTY1pGSEY0bW8xcGVmc3NtclBhTWE2QUMxOXNpQWUwRmo4UHl0ZGpwUzhUQXVhbjYwT0ZJeHhHai8yOWFUVTA1Wkx2czN4VSttLzMvbkFVQ2svWnZvNC9xZ3E4VkhYSFZ5elo4TzhtU0o5c3ZDcEJyYjE3QVI1WHlmTTFhWThvWHQ1T0tSTWRsWnI3a1lpU245dEVLd1lZSXRremtkTUZmcVA2YUg0c1UrSk1JOWJVRzZpcWd3T0NVaFZkdUh3UUdURi9sbDBqT2pBZVV2ZnlTQzc5ZnBMYkFMQ1ZsWjdIYWcmaDc1Uk5kK2I4MjFMUXBaVUthci9rVHpCUWRvPQ==; _pinterest_cm=\"TWc9PSYxZnpkMS9XN29Rd2R0TnpBN0RzVktja1J4NUtINUJqRzNGODFXS0xES1pndWlNVm52a0d3V0JocmVIS3p5eDdnNXNZa0hGelNQNDBSTFRId3ZhTFFIQjRGOW1lNlJZMzFiVlg1MHhSOFpmMGhRZUoySUpJZDIyWlVYMjRXNHRaL1lodFl4eW1jWjNyTklpbytYbHZyd29nRm5DY0pQOGgyUWpDdk9zQ1craXR5VEZoNHV4ZzRnOXV4SUFFSStYZCsmT08zMFI1bktXa3pwSDFtK3NNRWpxWWNpQzNzPQ==\"; _routing_id=\"595f24cd-7f4c-4495-aa67-37212d099cd8\"; sessionFunnelEventLogged=1"
			}
		}).then(res => {
			const $ = cheerio.load(res.data)
			let hasil = []
			$('body > div > div > div > div > div > div > div > div > div > div > div').each(function (a, b) {
				$(b).find('div').each(function (c, d) {
					let Link = $(d).find('div > div > div > div > a').find('img').attr('src')
					hasil.push(Link)
				})
			})
			let Data = []
			hasil.map(V => {
				if (V === undefined) return 
				Data.push(V.replace('236x', 'originals'))
			})
			let FilterArray = new Set(Data)
			let unique = [...FilterArray]
			const result = {
				status: res.status,
				creator: "Katashi",
				result: unique
			}
			HASIL.push(result)
		})
		return HASIL[0]
}

module.exports.Adventure = Adventure
module.exports.Action = Action
module.exports.shorturl = shorturl
module.exports.getUrlTiny = getUrlTiny
module.exports.searchLineSticker = searchLineSticker
module.exports.savefrom = savefrom
module.exports.charaCheck = charaCheck
module.exports.chara = chara
module.exports.brainlydetail = brainlydetail
module.exports.brainly = brainly
module.exports.brainly2 = brainly2
module.exports.brainly3 = brainly3
module.exports.photofunimg = photofunimg
module.exports.photofuntext = photofuntext
module.exports.wattpad = wattpad
module.exports.random_detail = random_detail
module.exports.sfile = sfile
module.exports.radio = radio
module.exports.ephoto = ephoto
module.exports.ephotor = ephotor
module.exports.ephotoi = ephotoi
module.exports.ephotoi2 = ephotoi2
module.exports.ephotori = ephotori
module.exports.ephototi = ephototi
module.exports.ephototri = ephototri
module.exports.top4top = top4top
module.exports.pinterest = pinterest

