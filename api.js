const HTTP =  require("./lib/http")
const HTTPv3 =  require("./lib/httpv3")
const HTTPForm =  require("./lib/http-form")
const querystring = require('querystring')

class API {
	constructor(username, password) {
		this.http = new HTTP(username, password)
		this.httpv3 = new HTTPv3(username, password)
		this.http_form = new HTTPForm(username, password)
		

		// bind methods
		this.product_list_categories = this.product_list_categories.bind(this)
		this.product_list = this.product_list.bind(this)
		this.product_information = this.product_information.bind(this)
		this.product_availability = this.product_availability.bind(this)
		this.product_item_information = this.product_item_information.bind(this)

		this.quote_ready = this.quote_ready.bind(this)
		this.quote_bulk = this.quote_bulk.bind(this)

		this.order_place = this.order_place.bind(this)
		this.order_reprint = this.order_reprint.bind(this)
		this.order_get = this.order_get.bind(this)
		this.order_change_address = this.order_change_address.bind(this)
		this.order_cancel = this.order_cancel.bind(this)

		this.event_get = this.event_get.bind(this)

		this.design_create = this.design_create.bind(this)
		this.design_get = this.design_get.bind(this)
		this.design_delete = this.design_delete.bind(this)

		this.customization_get = this.customization_get.bind(this)

		this.invoice_list = this.invoice_list.bind(this)
		this.invoice_pay = this.invoice_pay.bind(this)
		
		this.product = { 
			list_categories: this.product_list_categories,
			list: this.product_list,
			info: this.product_information,
			availability: this.product_availability,
			detail: this.product_item_information
		}

		this.quote = {
			get: this.quote_ready,
			bulk: this.quote_bulk
		}

		this.order = {
			place: this.order_place,
			reprint: this.order_reprint,
			get: this.order_get,
			change_address: this.order_change_address,
			cancel: this.order_cancel
		}

		this.event = {
			get: this.event_get
		}

		this.design = {
			create: this.design_create,
			get: this.design_get,
			delete: this.design_delete
		}

		this.custom = {
			get: this.customization_get
		}

		this.invoice = {
			get: this.invoice_list,
			pay: this.invoice_pay
		}
	}

	// api wraping methods
	// product
	product_list_categories(){
		return this.http.get('/categories')
	}

	product_list(categoryId) {
		return this.http.get('/categories/' + categoryId)
	}

	product_information(productId) {
		return this.http.get('/products/' + productId)
	}

	product_availability(productId){
		return this.http.get('/products/' + productId + '/availability')
	}

	product_item_information(productId){
		return this.http.get('/products/' + productId + '/items')
	}

	// quote
	quote_ready(order){
		return this.http.post('/quote', order)
	}

	quote_bulk(order){
		return this.http.post('/quote/bulk', order)
	}

	// order
	order_place(orderToken){
		return this.http.post('/order', orderToken)
	}

	order_reprint(orderId, order){
		return this.http.post('/order/' + orderId + '/reprint', order)
	}

	order_get(orderId){
		if(orderId) return this.http.get('/order/' + orderId)
		else return this.http.get('/order')
	}

	order_change_address(orderId, addressChange){
		return this.http.post('/order/' + orderId + '/changeAddress', addressChange)
	}

	order_cancel(orderId){
		return this.http.delete('/order/' + orderId)
	}

	event_get(orderId, dates){
		if(orderId) return this.httpv3.get('/event/' + orderId)
		else if (dates) return this.httpv3.get('/event?' + querystring.stringify(dates))
		else return this.httpv3.get('/event')
	}

	design_create(designObject){
		return this.http_form.post('/design', designObject)
	}

	design_get(designId){
		return this.http.get('/design/' + designId)
	}

	design_delete(designId){
		return this.http.delete('/design/' + designId)
	}

	customization_get(){
		return this.http.get('/customization')
	}

	invoice_list(invoiceId){
		if(invoiceId) return this.http.get('/billing/invoice/' + invoiceId)
		else return this.http.get('/billing/invoice')	
	}

	invoice_pay(invoiceId, payPalTransaction){
		return this.http.post('/billing/invoice/' + invoiceId + '/pay/paypal', payPalTransaction)
	}

}

module.exports = API