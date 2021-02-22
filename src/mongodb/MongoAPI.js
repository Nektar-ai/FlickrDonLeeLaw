var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';

var app = express();
app.use(express.urlencoded());
app.use(express.json({limit:'50mb'}));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','http://localhost:4200')
    res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type')
    res.setHeader('Access-Control-Allow-Credentials',true)
    next();
});

app.get("/api/getRecherche",function( req,res){
    MongoClient.connect(url, function(err, client) {
        var db = client.db('FlickerDonleelowme');
        var cursor = db.collection('Recherche').find({name:req.query.name});
        cursor.count().then((value) => {
            if (value == 0) {
                res.send()
            }
        });
        cursor.count();
        cursor.forEach(
            function (doc) {
                if (doc != null) {
                    res.send(doc);
                }else{
                    res.send('null');
                }
            },
            function (err) {
            }
        );
        client.close();
    });
})

app.post("/api/insertRecherche",function(req,res){
    MongoClient.connect(url, function(err, client) {
        var db = client.db('FlickerDonleelowme');
        db.collection('Recherche').insertOne(req.body)
        client.close();
        console.log("data: ["+req.body.name+"] is inserted")
        res.send(req.body);
    });
})

app.post("/api/updateRecherche",function(req,res){
    MongoClient.connect(url, function(err, client) {
        var db = client.db('FlickerDonleelowme');
        db.collection('Recherche').updateOne({ name:req.body.name },{ $set: { currPage:req.body.currPage , urls:req.body.urls }})
        client.close();
        console.log("data: ["+req.body.name+"] is updated");
        res.send(req.body);
    });
})

function flush() {
    setTimeout(() => {
        MongoClient.connect(url, function(err, client) {
            var db = client.db('FlickerDonleelowme');
            console.log('flush !');
            db.collection('Recherche').deleteMany({date:{$lt:new Date().getTime() - 300000}});
            flush();
        });
    }, 300000);
}

app.listen(8080, function () {
    flush()
    console.log('Mongo API is UP !');
})
    