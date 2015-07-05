(function (root, init) {
    if (typeof define === 'function' && defined.amd) {
        define(['angular'], init);
    } else if (root.angular) {
        init(root.angular);
    }
}(this, function (angular) {
    var module = angular.module('angularModal', []),
        $ = angular.element;
    module.provider('angularModal', function () {
        this.$get = ['$window', '$document', '$templateCache', '$compile', '$q', '$http',
            function ($window, $document, $templateCache, $compile, $q, $http) {

            }
        ];
    });

    module.directive('angularModal', [function () {
        return {
            restrict: 'A',
            replace: true,
            scope: {},
            templateUrl: function (ele, attr) {
                return attr.tmplUrl;
            }
        }
    }]);

}));