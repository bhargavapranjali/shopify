# shopify

This custom app is used to retrieve information related to an order such as Stock Availability Status, Payment Status, Fulfillment Status, Return Status corresponding to a given order using Order Id.


**Steps to create a testing environment for the custom app**

1. Create a development store to test the app.
2. Go to Apps > Manage private apps > Enable private app development
3. After enabling the private app development, create a private app and enable the admin API permissions accordingly and allow the usage of Storefront API.
4. After creating the custom app, the API key and Password will be generated which will be further used to test the app.
5. Create products and orders in the store to have a database to work on.


**Steps to run the code locally on your system**

1. Change the apiKey, apiPassword and the storeName in the app.js file.
2. Run the command "node app.js" on the terminal. The port 3000 will start listening to the requests.
3. Run "http://localhost:3000/" in your browser. This will open the home page to the app.
4. Click on "List of orders" to go to "http://localhost:3000/orders", if you do not see the orders please wait for a while or refresh the page.
5. Meanwhile, you can also see the information related to the orders in the terminal.


