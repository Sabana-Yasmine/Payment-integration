const express = require ("express")
const braintree = require ("braintree")
const cors = require  ("cors")
const {response} = require ("express")
const app = express();
require('dotenv').config()
 
app.use(express.json());

const config = {
    environment : braintree.Environment.Sandbox,
    merchantId : process.env.merchantId,
    publicKey : process.env.publicKey,
    privateKey : process.env.privateKey
};
 const gateway = new braintree.BraintreeGateway(config)

 // to create token

 app.get('/token',  async(req, res) => {
    try {
        gateway.clientToken.generate({},(err, response) => {
            if(err){
                return res.send({'error' : err})
            }else{
                return res.json({'status' : 'success', 'message' : response})
            }
        })
    } catch (err) {
        return res.json({'error' : err.message})
    }
 })
 
 //Transaction

 app.post('/transaction', async(req, res) => {
   
    try {
        const paymentDetail = gateway.transaction.sale({amount : req.body.amount,
            paymentMethodNonce :req.body.paymentMethodNonce,
            options : 
            {
               submitForSettlement :true
            }
           } ,(err, response) => {
            if(response.success){
                return res.json({"status" : "success", "message" : response.transaction} )
            }else{
                return res.send({err : err})
            }           
        })
        
    } catch (error) {
        return res.send({error : error.message})
        
    }
 })

 //server creation

 app.listen(6543, () => {
    console.log("server started....")
 })