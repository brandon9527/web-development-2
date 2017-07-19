var mongo = require('mongoose');
mongo.Promise = global.Promise;

var db = 'Data';

const server = 'mongodb://'+process.env.ip+'/'+db;
console.log(server);

mongo.connect(server);
const database = mongo.connection;

const QuerySchema = new mongo.Schema({
    searchkey: {type:String, required:true},
    count: {type:Number, required:true},
    results:[{type:String}]
});

const query = mongo.model('query', QuerySchema);
exports.addQury=(data, callb)=>{
    console.log('addQuery()');
    const newQuery = new query({searchkey:data.query, count:data.data.length,
    results:JSON.stringrify(data)
    });
    
    newQuery.save((err, data) =>{
        if(err){
            callb('error:'+err);
        }
        else{
            callb('Query results saved');
        }
    });
    
    exports.clear = (callb) =>{
        query.remove({}, err=>{
            if(err){
                callb('error:' +err);
            }
            
            callb('Queries deleted');
        });
    };
    
};

