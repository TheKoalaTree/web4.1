// Encapsulation useful operations to functions for database
var MongoClient = require("mongodb").MongoClient;
// get the db url
var setting = require("../../setting.js");

function __connectionDB(callback){
  MongoClient.connect(setting.dbUrl, function(err, client){
    console.log("Connected correctly to server!");
    callback(err, client);
  });
}

exports.insertOne = function(databaseName, collectionName, json, callback){
  __connectionDB(function(err, client){
    if(err){
      client.close();
      callback(err, client);
      return;
    }

    client.db(databaseName).collection(collectionName).insertOne(json, function(err, result){
      client.close();
      callback(err, result);
    });
  });
}

// find data
exports.find = function(databaseName, collectionName, json, C, D){
  var result = [];
  var callback = null;
  var args = null;
  // var json = json || {};
  if(arguments.length == 4){
    args = {pageAmount: 0, page: 0, sort: ""};
    callback = C;
  } else if(arguments.length == 5){
    args = C;
    callback = D;
  } else if(arguments.length > 5){
    callback("It has too much arguments for find function", null);
    return;
  }

  __connectionDB(function(err, client){
    if(err){
      client.close();
      callback(err, client);
      return;
    }

    // Return data by page
    var cursor = client.db(databaseName).collection(collectionName).find(json).limit(args.pageAmount).skip(args.pageAmount * (args.page-1)).sort(args.sort);
    cursor.forEach((doc)=>{
      if(doc != null){
        result.push(doc);         // It still has some data, then push into result array
      }
    }).then(() => {
      callback(null, result);     // No more data, invoke callback
    }).catch((err) => {
      client.close();
      callback(err, null);        // Catch error
    });
  });
}

exports.deleteMany = function(databaseName, collectionName, json, callback){
  __connectionDB(function(err, client){
    if(err){
      client.close();
      callback(err, client);
      return;
    }

    client.db(databaseName).collection(collectionName).deleteMany(
      json,
      function(err, results){
        client.close();
        callback(err, results);
    });
  });
}

exports.updateMany = function(databaseName, collectionName, json1, json2, callback){
  __connectionDB(function(err, client){
    if(err){
      client.close();
      callback(err, client);
      return;
    }
    
    client.db(databaseName).collection(collectionName).updateMany(json1, json2, function(err, results){
      client.close();
      callback(err, results);
    });

  });
}

exports.getAllCount = function(databaseName, collectionName, callback){
  __connectionDB(function(err, client){
    if(err){
      client.close();
      callback(err, client);
      return;
    }

    client.db(databaseName).collection(collectionName).countDocuments({}).then((result) => {
      client.close();
      callback(null, result);
    }).catch((err) => {
      client.close();
      callback(err, null);
    });
  });
}