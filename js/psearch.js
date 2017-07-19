/*global angular*/
/*global search*/
var app = angular.module('app', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/search', {
            templateUrl: 'templates/psearch.html',
            controller: 'searchController'
        });
}]);

app.controller('searchController', function($scope, $http){
    $scope.message = 'Enter the place you interest and press enter to search';
    $scope.search = function($event){
        console.log('search()');
        
        if($event.which == 13){
            var s = $scope.searchTerm;
            console.log(s);
            
            var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?" + "key=" + key + "&location=" + location + "&radius=" + radius + "&sensor=" + sensor + "&types=" + types + "&keyword=" + search;
            $http.get(url).success(function(res){
                console.log(res);
                $scope.place = res.items;
                $scope.searchTerm = ' ';
            });
        }
    };
    
    $scope.search = function($event){
        console.log('search()');
        
        if($event.which == 13){
            var s = $scope.searchTerm;
            console.log(s);
            
            var url = 'api.openweathermap.org/data/2.5/forecast?q?mxResults=40&fields=items(id,weather)&q=' +search;
            $http.get(url).success(function(res){
                console.log(res);
                $scope.place = res.items;
                $scope.searchTerm = ' ';
            });
        }
    };
})