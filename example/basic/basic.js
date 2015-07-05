angular.element(document).ready(function () {
    var module = angular.module('basic', []);
    module.requires.push('angularModal');

    angular.bootstrap(document, ['basic']);
});
