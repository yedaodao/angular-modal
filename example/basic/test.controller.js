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
        };

        angularModal.init({
            removable: false
        }).then(function (data) {
            angularModal.open(data.key);
        });

        var index = 0;
        var intervalId = setInterval(function () {
            angularModal.init().then(function (data) {
                data.modalScope.test = index;
                angularModal.open(data.key);
                index++;
                if(index == 3) {
                    clearInterval(intervalId);
                }
            });
        },200);
    }]);
}));