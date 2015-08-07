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
    angular.module('testModal', [])
        .controller('modalController', ['$scope', function ($scope) {
            $scope.hide = function () {
                $scope.close($scope.key);
                $scope.$broadcast('modal.event.hide');
            };
            $scope.title= "标题";
            $scope.test = "hello modal";
            $scope.$on('modal.open.end.event', function () {
                console.log('modal open end');
            });
            $scope.$on('modal.open.start.event', function () {
                console.log('modal open start');
            });
            $scope.$on('modal.close.end.event', function () {
                console.log('modal close end');
            });
            $scope.$on('modal.close.start.event', function () {
                console.log('modal close start');
            });
            $scope.$on('modal.destroy.event', function () {
                console.log('modal destroy');
            });
    }]);
}));