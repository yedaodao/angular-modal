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
        $scope.showTop = function () {
            angularModal.init({
                controller: 'modalController',
                position: 'top'
            }).then(function (data) {
                angularModal.open(data.key);
            });
        }
        $scope.showCenter = function () {
            angularModal.init({
                position: 'center'
            }).then(function (data) {
                angularModal.open(data.key);
            });
        }
        $scope.showCustom = function () {
            angularModal.init({
                position: 'custom',
                left: 100,
                top: 100
            }).then(function (data) {
                console.log(data);
                angularModal.open(data.key);
            });
        }
    }]);
}));