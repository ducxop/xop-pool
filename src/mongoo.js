const mongoose = require('mongoose');
const { Schema } = mongoose;
const connexionString = 'mongodb://127.0.0.1:27017/testdb'
mongoose.connect(connexionString, { useNewUrlParser: true });
mongoose.connection.on('error', console.error);
// To fix https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;

let userSchema = new Schema({
  username: {
    type: String,
    required: true,
    index:true,
    unique: true
  },
  role: {
    type: String
  },
  password: {
    type: String
  }
});

let User = mongoose.model('users', userSchema);

async function find() {
    let newuser = new User({
        username:"admin",
        role:"admin",
        password:"123qwe123"
    })
    await newuser.save()
    console.log('save done')
    console.log(await User.find({}));
    console.log('done')
    mongoose.connection.close()
}
find()
// User.find({}, function(err,users){
//     if (err)
//         console.log(err)
//     console.log(users)
//     mongoose.connection.close()
// })

// var cons = require('consolidate')
// var mongodb= require('mongodb')
// var mongoClient=mongodb.MongoClient
// var assert = require('assert')

// mongoClient.connect('mongodb://localhost:27017/test', (err,client)=>{
// 	assert.equal(null,err)
//     console.log('Successfully connected to server')
//     const db = client.db('test')
// 	db.collection('names').find().toArray((err, docs)=>{
// 		docs.forEach((doc)=>{
// 			console.log(doc.name)
// 		})
//         client.close()
// 	})
// })

//////////////////////////////////////////////////////////////////////

// var MongoClient = require('mongodb').MongoClient,
//     assert = require('assert');
// var allOptions = [
//     {
//         overview: "wiki",
//     },
//     {
//         milestones: "CMO"
//     }
// ];
// var numQueriesFinished = 0;
// var companiesSeen = {};
// for (var i=0; i<allOptions.length; i++) {
//     var query = queryDocument(allOptions[i]);
//     queryMongoDB(query, i);
// }

// function queryMongoDB(query, queryNum) {

//     MongoClient.connect('mongodb://localhost:27017/crunchbase', function(err, cl) {
//         db = cl.db("crunchbase")
//         assert.equal(err, null);
//         console.log("Successfully connected to MongoDB for query: " + queryNum);
        
//         var cursor = db.collection('companies').find(query);
        
//         var numMatches = 0;
        
//         cursor.forEach(
//             function(doc) {
//                 numMatches = numMatches + 1;
//                 if (doc.permalink in companiesSeen) return;
//                 companiesSeen[doc.permalink] = doc;
//             },
//             function(err) {
//                 assert.equal(err, null);
//                 console.log("Query " + queryNum + " was:" + JSON.stringify(query));
//                 console.log("Matching documents: " + numMatches);
//                 numQueriesFinished = numQueriesFinished + 1;
//                 if (numQueriesFinished == allOptions.length) {
//                     report();
//                 }
//                 return cl.close();
//             }
//         );
//     });    
// }

// function queryDocument(options) {
//     var query = {};
//     if ("overview" in options) {
// 		query["$or"] = [{"overview":{"$regex":options.overview, "$options":"i"}},
// 						{"tag_list":{"$regex":options.overview,"$options":"i"}}]
//     }
//     if ("milestones" in options) {
//         query["milestones.source_description"] =
//             {"$regex": options.milestones, "$options": "i"};
//     }
//     return query;
// }

// function report() {
//     var totalEmployees = 0;
//     for (key in companiesSeen) {
//         totalEmployees = totalEmployees + companiesSeen[key].number_of_employees;
//     }

//     var companiesList = Object.keys(companiesSeen).sort();
//     console.log("Companies found: " + companiesList);
//     console.log("Total employees in companies identified: " + totalEmployees);
//     console.log("Total unique companies: " + companiesList.length);
//     console.log("Average number of employees per company: " + Math.floor(totalEmployees / companiesList.length));
// }












