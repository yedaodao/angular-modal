angular.element(document).ready(function () {
    var module = angular.module('basic', []);
    module.requires.push('angularModal');
    module.requires.push('testModal');
    angular.bootstrap(document, ['basic']);
});
