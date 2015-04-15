var app = angular.module('app', ['ngSanitize', 'queryBuilder']);


app.constant('URL', 'data/');
var spec_id = document.getElementById("myInput").value;
app.constant('SPEC_ID', spec_id);
// console.log(spec_id)

app.factory('DataService', function ($http, URL, SPEC_ID) {
    var result;
    var getData = function () {
        return $http.get(URL + 'content.json?spec_id=' + SPEC_ID);
    };

    result = getData();

    return {
        getData: function(){
            return result
        }  
    };
});

app.factory('OpService', function ($http, URL) {
    var result;
    var getData = function (id) {
        return $http.get(URL + "operator_"+id+".json");
    };

    var getData1 = function () {
        return $http.get(URL + 'op1.json');
    };

    // result = getData();

     return {
        getData: function(id){
            return getData(id)
        },
        getData1: function(){
            return getData1()
        },

    };
});


app.factory('nukeService', function($http, URL) {
    
});

app.controller('QueryBuilderCtrl', ['$scope', 'DataService', '$http' , function ($scope, DataService, $http) {
    var data = '{ "group": { "operator": "AND", "rules": [ { "condition": "grater than or eql_14", "field": 14, "data": "11", "$$hashKey": "005" }, { "condition": "less than_15", "field": 15, "data": "222", "$$hashKey": "008" }, { "condition": "grater than_14", "field": 14, "data": "3333", "$$hashKey": "00B" }, { "condition": "Not Equl_14", "field": 14, "data": "44444", "$$hashKey": "00E" }, { "group": { "operator": "AND", "rules": [ { "condition": "grater than_16", "field": 16, "data": "111", "$$hashKey": "00X" }, { "condition": "grater than or eql_11", "field": 11, "data": "222", "$$hashKey": "010" }, { "condition": "Equl_11", "field": 11, "data": "333", "$$hashKey": "013" }, { "condition": "grater than_15", "field": 15, "data": "444", "$$hashKey": "016" }, { "group": { "operator": "AND", "rules": [ { "condition": "less than_13", "field": 13, "data": "333", "$$hashKey": "01D" }, { "condition": "grater than_14", "field": 14, "data": "444", "$$hashKey": "01G" }, { "group": { "operator": "AND", "rules": [ { "group": { "operator": "AND", "rules": [ { "condition": "Equl_11", "field": 11, "data": "222", "$$hashKey": "023" }, { "condition": "Equl_11", "field": 11, "data": "444", "$$hashKey": "026" } ] }, "$$hashKey": "01Z" }, { "condition": "Equl_11", "field": 11, "data": "444", "$$hashKey": "029" }, { "condition": "Equl_11", "field": 11, "data": "222", "$$hashKey": "02C" } ] }, "$$hashKey": "01V" } ] }, "$$hashKey": "019" }, { "condition": "less than_11", "field": 11, "data": "123", "$$hashKey": "01J" }, { "condition": "grater than_14", "field": 14, "data": "456", "$$hashKey": "01M" }, { "condition": "less than_15", "field": 15, "data": "666", "$$hashKey": "01P" }, { "condition": "grater than_13", "field": 13, "data": "999", "$$hashKey": "01S" } ] }, "$$hashKey": "00H" }, { "condition": "grater than_14", "field": 14, "data": "7777", "$$hashKey": "00L" }, { "condition": "less than_11", "field": 11, "data": "6666", "$$hashKey": "00O" }, { "condition": "grater than or eql1_13", "field": 13, "data": "77777", "$$hashKey": "00R" }, { "condition": "grater than or eql_16", "field": 16, "data": "77777", "$$hashKey": "00U" } ] } }';

    $scope.json = null;

    $scope.filter = JSON.parse(data);
    $scope.$watch('filter', function (newValue) {
        $scope.json = JSON.stringify(newValue, null, 2);
    }, true);

    $scope.submitForm = function(isValid) {
        if (isValid) {
            alert('our form is amazing');
            params = {id: 1}
            $http.post('/api', params)
                .success(function(){
                    console.log('Posted Data!!!')
                });

        }
    };

}]);

var queryBuilder = angular.module('queryBuilder', []);

queryBuilder.directive('queryBuilder', ['$compile', 'DataService', 'OpService' ,function ($compile, DataService, OpService) {
    return {
        restrict: 'E',
        scope: {
            group: '='
        },
        templateUrl: '/queryBuilderDirective.html',
        compile: function (element, attrs) {
            var content, directive;
            content = element.contents().remove();
            return function (scope, element, attrs) {
                scope.operators = [
                    { name: 'AND' },
                    { name: 'OR' }
                ];

                scope.conditions = {}

                getFields = function () {
                    DataService.getData().then(function (result) {                        
                        scope.fields = result.data;
                        angular.forEach(scope.fields, function(item) {
                            OpService.getData(item.id).then(function (result) {
                                scope.conditions[item.id] = result.data;
                            });
                           // getOp(item.id); 
                           // console.log(item.id)
                        })
                        
                    });
                };

                getOp = function(id) {
                    OpService.getData(id).then(function (result) {
                       scope.conditions[id] = result.data;
                   });
                };

                getFields();

                scope.addCondition = function () {
                    scope.group.rules.push({
                        condition: 'Equl_11',
                        field: scope.fields[0]["id"],
                        data: ''
                    });
                };

                scope.removeCondition = function (index) {
                    scope.group.rules.splice(index, 1);
                };

                scope.addGroup = function () {
                    scope.group.rules.push({
                        group: {
                            operator: 'AND',
                            rules: []
                        }
                    });
                };

                scope.selectOp = function(t, field_id) {
                    OpService.getData(field_id).then(function (result) {
                        scope.conditions[field_id] = result.data;
                    });
                }

                scope.selectedOp = function(t){
                    console.log(t);

                }

                scope.removeGroup = function () {
                    "group" in scope.$parent && scope.$parent.group.rules.splice(scope.$parent.$index, 1);
                };

                directive || (directive = $compile(content));

                element.append(directive(scope, function ($compile) {
                    return $compile;
                }));
            }
        }
    }
}]);
