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
        $scope.show = function () {
            angularModal.init().then(function (data) {
                angularModal.open(data.key);
            });
        }
    }]);
}));