var app = angular.module('app', ['ngSanitize', 'queryBuilder']);


app.constant('URL', 'data/');

app.factory('DataService', function ($http, URL) {
    var result;
    var getData = function () {
        return $http.get(URL + 'content.json');
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
    var getData = function () {
        return $http.get(URL + 'operator.json');
    };

    result = getData();

     return {
        getData: function(){
            return result
        }  
    };
});

app.controller('QueryBuilderCtrl', ['$scope', 'DataService', function ($scope, DataService) {
    var data = '{ "group": { "operator": "AND", "rules": [ { "condition": "Equl", "field": 4, "data": "1", "$$hashKey": "005" }, { "group": { "operator": "AND", "rules": [ { "condition": "grater than", "field": 5, "data": "232", "$$hashKey": "00C" }, { "condition": "grater than or eql", "field": 4, "data": "123", "$$hashKey": "00F" }, { "group": { "operator": "AND", "rules": [ { "condition": "grater than", "field": 3, "data": "23", "$$hashKey": "00I" }, { "group": { "operator": "OR", "rules": [ { "group": { "operator": "OR", "rules": [ { "condition": "less than", "field": 11, "data": "23", "$$hashKey": "00T" } ] }, "$$hashKey": "00P" } ] }, "$$hashKey": "00L" } ] }, "$$hashKey": "00E" } ] }, "$$hashKey": "008" } ] } }';

    $scope.json = null;

    $scope.filter = JSON.parse(data);
    $scope.$watch('filter', function (newValue) {
        $scope.json = JSON.stringify(newValue, null, 2);
    }, true);

    $scope.submitForm = function(isValid) {
        if (isValid) {
            alert('our form is amazing');
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
            console.log(content);
            return function (scope, element, attrs) {
                scope.operators = [
                    { name: 'AND' },
                    { name: 'OR' }
                ];

                getFields = function () {
                    DataService.getData().then(function (result) {
                        scope.fields = result.data;
                    });
                };

                getOp = function() {
                    OpService.getData().then(function (result) {
                        scope.conditions = result.data;
                    });
                };

                getFields();
                getOp();

                scope.addCondition = function () {
                    scope.group.rules.push({
                        condition: 'Equl',
                        field: 11,
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

                scope.selectOp = function(t) {
                    OpService.getData().then(function (result) {
                        scope.conditions = result.data;
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
