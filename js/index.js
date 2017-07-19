var restify = require('restify');
var server = restify.createServer();
server.use(restify.fullresponse());
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.authorizationParser());

var place = require('./serverjs/search.js');
var db = require('.severjs/mongo.js');
var port = process.env.PORT;

server.del('/library', function(req, res){
    console.log('DELETE/library');
    db.clear(dbResult=>{
        console.log('mongo:'+dbResult);
        res.setHeader('content-type', 'application/json');
        res.send(202, 'Query cache deleted');
        res.end();
    });
});


server.listen(8081, function(err){
    if(err){
        console.error(err);
        
    }
    
    else{
        console.log('App is ready at: ' +port);
    }
});

server.get('/library', function(req, res){
    console.log('GET/library');
    const searchTerm = req.query.q;
    console.log('q='+searchTerm);
    
    if(!searchTerm){
        console.log('No keyword found');
        res.setHeader('content-type', 'application/json');
        res.send(400, 'Query is empty');
        res.end();
        return;
    }
    
    db.getQuery(searchTerm, function(data){
        if(data!=null){
            var d = JSON.parse(data.results);
            console.log('use persisted data');
            res.setHeader('content-type', 'application/json');
            res.send(d.code, d.data);
            res.end();
        }
        
        else{
            place.search(searchTerm, function(pInfo){
                console.log(pInfo.message);
                res.setHeader('content-type', 'application/json');
                res.status(pInfo.code);
                res.send(pInfo.code, pInfo.data);
                res.end();
                pInfo.query = searchTerm;
                db.addQuery(pInfo, dbResult=>{
                    console.log('mongo:' +dbResult);
                });
            });
        }
    });
});


server.put('/library/:id', function(req, res, next){
    db.library.finds({
        id: req.para.id
    }, function(err, data){
        var Update = {};
        
        for(var x in data){
            Update[x] = data[x];
        }
        
        for(var y in req.para){
            Update[y] = req.para[y];
        }
        
        db.library.up_d({
            id: req.para.id
        }, Update, { multi: false }, 
        
        function (err, data){
            res.writes('Content type: ', 'application/json');
            res.end(JSON.stringify(data));
        });
        
    });
    return.next();
});
