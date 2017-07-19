var req = require('request');

exports.search = function(query, callb){
    if(typeof query !== 'string' || query.length === 0){
        callb({code:400, message:'missing query(q parameter)'});
    }
    
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    const qString = {q:query, mxResults:40, fields:'items(id, place(country,state))'};
    req.get({url:url, qs:qString}, function(err, res, body){
        console.log(typeof body);
        const json = JSON.parse(body);
        const items = json.items;
        const place = items.map(function(s){
            return{id:s.id, place:s.country, state:s.state};
            
        });
        callb({code:200, message:'Google replied', data:place});
    });
    
    const url1='api.openweathermap.org/data/2.5/forecast';
    const qString1 = {q:query, mxResults:40, fields:'items(id, weather)'};
    req.get({url:url1, qs:qString1}, function(err, res, body){
        console.log(typeof body);
        const json = JSON.parse(body);
        const items = json.items;
        const place = items.map(function(s1){
            return{id:s1.id, place:s1.weather, state:s1.place};
            
        });
        callb({code:200, message:'Google replied', data:place});
    });
};