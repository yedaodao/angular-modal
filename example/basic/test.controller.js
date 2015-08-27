/**
 * Created by Administrator on 2015/7/23.
 */
(function (root, init) {
    if (typeof define === 'function' && defined.amd) {
        define(['../../bower_components/angular/angular'], init);
    } else if (root.angular) {
        init(root.angular);
    }
}(this, function (angular) {
    angular.module('testModal').controller('testController', ['$scope', 'angularModal', function ($scope, angularModal) {
        $scope.title= "标题";
        $scope.test = "hello modal";
        var key = '';
        angularModal.init({
            controller: 'modalController',
            position: 'top',
            closeAndDestroy: false
        }).then(function (data) {
            key = data.key;
        });
        $scope.showTop = function () {
            angularModal.open(key);
        };
        $scope.showCenter = function () {
            angularModal.init({
                scope: $scope,
                position: 'center'
            }).then(function (data) {
                angularModal.open(data.key);
            });
        };
        $scope.showCustom = function () {
            angularModal.init({
                controller: 'modalController',
                position: 'custom',
                left: 100,
                top: 100
            }).then(function (data) {
                angularModal.open(data.key);
            });
        }
    }]);
}));