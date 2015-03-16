// Example of a simple geoNear query across some documents

var MongoClient = require('mongodb').MongoClient,
  test = require('assert');
MongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
  
  // Fetch the collection
  var collection = db.collection("gnear");
    
  // Add a location based index
  collection.ensureIndex({loc:"2dSphere"}, function(err, result) {
  // collection.ensureIndex({loc:"2d"}, function(err, result) {
    // Save a new location tagged document
    collection.insert([{a:1, loc:[50, 30]}, {a:1, loc:[30, 50]}], {w:1}, function(err, result) {
     
      // Use geoNear command to find document
      collection.geoNear(50, 50, {query:{a:1}, num:1}, function(err, docs) {
        test.equal(1, docs.results.length);
        
        db.close();
      });          
    });
  });      
});