const HTTP =  require("./http")
const https = require('https')
const FormData = require('form-data')
const Util = require('./util')
const util  = new Util()

class HTTPForm extends HTTP {

	post(path, data) {
		return new Promise((resolve, reject) => {
			const options = super.get_options()
			options.path += path
			options.method = 'POST'
			
			const form = new FormData()

			// for(let property in data){
			// 	// console.log(property, '=', data[property])
			// 	form.append(property, data[property])
			// }

			// clone data and delete files
			const clone = util.omit(data)

			const form_data = util.to_form(clone)
			for(let property in form_data){
				form.append(property, form_data[property])
			}

			// add images from origional data object 
			form.append('sides[front][artwork]', data.sides.front.artwork)

			// add content headers 
			options.headers['content-type'] = form.getHeaders()['content-type']			

			const req = https.request(options)
			form.pipe(req);

			req.on('response', (response) => {
			  	let body = ''
			  	response.on('data', (chunk) => { body += chunk; })
				response.on('end', () => { resolve(body) })
			})
			req.on('error', (e) => { reject(e) })
		})
	}
	
}

module.exports = HTTPForm