var util=require('util');
var testClient=require('mongodb').MongoClient, assert=require('assert');
var url = 'mongodb://localhost:27017/myproject';

// Use connect method to connect to the Server
testClient.connect(url,function(err, db) {
	// console.log(util.inspect(this));
	assert.equal(null, err);
	console.log("Connected correctly to server");

	insertDocuments(db, function() {
	  	updateDocument(db, function() {
	  		removeDocument(db, function() {
	  			findDocuments(db, function() {
	    			db.close();
	    		});
	    	});
	    });
	});

	//	following supported after v2.0
	// // Insert a single document
	// db.collection('inserts').insertOne({abc:1}, function(err, r) {
	// 	assert.equal(null, err);
	// 	// assert.equal(1, r.insertedCount);
	// });
	// // Insert multiple documents
	// db.collection('inserts').insertMany([{adc:2}, {arc:3}], function(err, r) {
	// 	assert.equal(null, err);
	// 	// assert.equal(2, r.insertedCount);
	// });
});

//no repeat check
var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // console.log(collection);
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
  	// console.log(util.inspect(result));    //result obj change 1.4 -> 2.0
    assert.equal(err, null);
    // assert.equal(3, result.length);       //work at 1.4, failed at 2.0
    assert.equal(3, result.result.n);	//test 1.4  failed, result return array
    assert.equal(3, result.ops.length);	//test 1.4  failed, result return array
    console.log("Inserted 3 documents into the document collection");
    callback(result);
  });
}



//only update one (first) document out of manys
var updateDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Update document where a is 2, set b equal to 1
  collection.update({ a : 2 }
    , { $set: { b : 1 } }, function(err, result) {
    assert.equal(err, null);
    // assert.equal(1, result.result.n);
    console.log("Updated the document with the field a equal to 2");
    callback(result);
  });  
}

//only remove one (first) document out of manys
var removeDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.remove({ a : 3 }, function(err, result) {
    assert.equal(err, null);
    // assert.equal(1, result.result.n);
    console.log("Removed the document with the field a equal to 3");
    callback(result);
  });    
}

var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    assert.equal(2, docs.length);
    console.log("Found the following records");
    console.dir(docs)
    callback(docs);
  });      
}


