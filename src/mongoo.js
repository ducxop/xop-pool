var cons = require('consolidate')
var mongodb= require('mongodb')
var mongoClient=mongodb.MongoClient
var assert = require('assert')

mongoClient.connect('mongodb://localhost:27017/test', (err,client)=>{
	assert.equal(null,err)
    console.log('Successfully connected to server')
    const db = client.db('test')
	db.collection('names').find().toArray((err, docs)=>{
		docs.forEach((doc)=>{
			console.log(doc.name)
		})
        client.close()
	})
})