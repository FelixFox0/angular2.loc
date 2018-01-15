(function(angular) {
    angular.module('myApp', [])
    .config(function($provide) {
        $provide.value('api_url', 'http://laravel2.loc/api/v1/players');
        $provide.value('page_elements', '5');
    })
    .controller('scoreTable', function($scope, $http, api_url, page_elements) {
        $scope.thisPage = 1;
        $scope.filter = {};
        $scope.getTable = function(page){
            url = api_url;
            if(page === undefined){
                url += "?start="+($scope.thisPage-1)*page_elements;
            }else{
                url += "?start="+(page-1)*page_elements;
                $scope.thisPage = page;
            }
            url += "&n="+page_elements;
            if($scope.filter.level !== undefined){
                url += "&level="+$scope.filter.level;
            }
            if($scope.filter.search !== undefined){
                url += "&search="+$scope.filter.search;
            }
            $http.get(url).then(function (response) {
                $scope.names = response.data.players;
                $scope.total = response.headers('x-total');
                $scope.getPagination();
            });
        }
        $scope.getTable();
        $scope.master = {name: "", level: "", score: "", suspected: ""};
        $scope.user = angular.copy($scope.master);
        $scope.send = function() {
            var data = 'name='+$scope.user.name + '&level='+$scope.user.level + '&score='+$scope.user.score + '&suspected='+$scope.user.suspected;
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            }
            $http.post(api_url, data, config).then(function (response) {
                $scope.selectPage($scope.pages);
                $scope.user = angular.copy($scope.master);
            }, function (response) {
                if (response.status == 422) {
                    alert('Fill in all the fields');
                }
            });
        };
        $scope.search= function(){
            $scope.getTable(1);
        };
        $scope.getPagination = function(){
            $scope.pagination = new Object();
            for (var i=1; i<$scope.total/page_elements+1; i++){
                $scope.pagination[i] = i;
                $scope.pages = i;
            }
        }
        $scope.selectPage = function(page){
            $scope.thisPage = page;
            $scope.getTable();
        }
    });
})(window.angular);
