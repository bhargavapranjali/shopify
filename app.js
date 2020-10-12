var dotenv = require('dotenv').config();
var bodyParser = require('body-parser')
const { parse } = require('cookie')
var express = require('express')
var app = express()
var request = require('request')
var ejs = require('ejs')
var async = require('async');
const nodemon = require('nodemon');

const scopes = 'read_products';
var jsonParser = bodyParser.json()

const apiKey = process.env.SHOPIFY_API_KEY
const apiPassword = process.env.SHOPIFY_API_PASSWORD
const storeName = "test-husky"

var urlencodedParser = bodyParser.urlencoded({ extended: true })
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs")

app.get('/', function (req, res) {
    res.render("home")
})
var orders = []

function handle_first_api() {
    var url = 'https://' + apiKey + ':' + apiPassword + '@' + storeName + '.myshopify.com/admin/api/2020-10/orders.json'
    return new Promise(function (resolve, reject) {
        request({ url }, function (error, response, body) {
            var orderList = JSON.parse(body).orders
            for (var i = 0; i < orderList.length; i++) {
                var order = { "order_id": "", "available": "", "payment": "", "return": "", "fulfillment": "" }
                order.order_id = orderList[i].id.toString()
                order.fulfillment = orderList[i].fulfillment_status
                if (order.fulfillment == undefined) order.fulfillment = "not fulfilled"
                order.payment = orderList[i].financial_status

                var count = 0
                for (var j = 0; j<orderList[i].line_items.length; j++) {
                    if (orderList[i].line_items[j].fulfillable_quantity >= orderList[i].line_items[j].quantity) count++;
                }
                if (count == orderList[i].line_items.length) order.available = "Available"
                else if (count > 0) order.available = "Partially available"
                else order.available = "Not available"
                orders.push(order)
            }
            resolve(orders)
        })
    })
}

function handle_second_api(url) {
    return new Promise(function (resolve, reject) {
        request({ url }, function (error, response, body) {
            var returned_details = JSON.parse(body)
            //console.log(returned_details)
            resolve(returned_details)
        })
    })
}

app.get('/orders', async function (req, res) {
    orders = await handle_first_api()
    for (var i = 0; i < orders.length; i++) {
        try {
            var url = `https://${apiKey}:${apiPassword}@${storeName}.myshopify.com/admin/api/2020-10/orders/${orders[i].order_id}/refunds.json`
            var returned_details = await handle_second_api(url)
            if(returned_details.refunds.length) orders[i].return = "Returned"
            else orders[i].return = "Not Returned"
        }
        catch (error) {
            console.log(error)
        }
    }
    console.log(orders)
    res.render("orders", {orders:orders})
    orders=[]
})
app.listen(3000, function () {
    console.log("Server has started listening")
})
