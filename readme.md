# Angular-Modal #

## 生命周期 ##

init-open-close-destroy

- init：加载html模板，scope注入controller，编译html模板并插入dom中，绑定鼠标点击事件以及拖动事件。
- open：显示Modal。
- close：隐藏Modal。
- destroy：解除绑定事件，从dom删除模板，销毁scope

## 模板 ##

    <div class="angular-modal-dialog">
	    <div class="angular-modal-content">
		    <div class="angular-modal-header">
		    	<h4 class="angular-modal-title">{{title}}</h4>
		    </div>
		    <div class="angular-modal-body">
		    	{{test}}
		    </div>
		    <div class="angular-modal-footer">
			    <button type="button" class="btn" ng-click="click()">Save changes</button>
			    <button type="button" class="btn" ng-click="hide()">close</button>
		    </div>
	    </div>
    </div>

## 用法 ##
    angularModal.init({
		bindElement: $document.find('body'),
		position: 'center',
		left: 0,
		top: 0,
		width: 600,
		scope: {},
        theme: 'default-theme',
		template: '',
        templateUrl: 'angular-modal-basic.html',
        controller: 'modalController',
        overlay: true,
		clickBgClose: true,
        closeAndDestroy: true,
        removable: true
	}).then(function (data) {
    	angularModal.open(data.key);//显示
		angularModal.close(data.key);//隐藏
		angularModal.destroy(data.key);//销毁
    });

modalController：
		
    angular.module('testMoudle', []) .controller('modalController', ['$scope', function ($scope) {
        $scope.hide = function () {
            $scope.destroy($scope.key);
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
		$scope.$on('modal.closeAll.end.event', function () {
            console.log('modal close end');
        });
        $scope.$on('modal.closeAll.start.event', function () {
            console.log('modal close start');
        });
        $scope.$on('modal.destroy.event', function () {
            console.log('modal destroy');
        });
		$scope.$on('modal.destroyAll.event', function () {
            console.log('modal destroy');
        });
	}]);
	
- bindElement(可选): 模板插入到哪个元素。
- position(可选): 位置（center,top,custom）。
- left(可选): 位置为custom时可用。自定义模态框位置。
- top(可选): 同上。
- width(必须)：modal宽度。
- scope(可选)：可以吧当前模块的数据注入到modal controller的$scope里边；如果controller为空，则使用scope所在的controller。
- theme(可选)：modal动画主题。
- templateUrl/template(必须)： 模板url。
- controller(可选)：modal对应的angular controller，**如果此项为空则必须把某个controller的$scope赋值给scope。**
- overlay(可选)：是否显示灰色背景。
- clickBgClose(可选)：点击其他区域是否关闭模态框。
- closeAndDestroy(可选)：隐藏modal的同时是否同时销毁modal，默认为true。
- removable(可选)：modal是否是可拖动的，默认为false。

## 接口 ##

### SERVICE： ###

**init(opts):data**

初始化modal。

opts请参照用法。

    data{
		 closeAndDestroy: true, 
		 modalScope: $scope, 
		 controller: Object, //controller项未填不返回此项
		 key: "8cfca573-0b48-4515-816c-c5e553ea95b6", 
		 element: JQLiteElement
	}

**open(key)**

打开指定key的modal。

**close(key)**

隐藏指定key的modal。

**closeAll()**

隐藏所有打开的Modal

**destroy(key)**

销毁指定key的modal

**destroyAll()**

销毁所有的modal

### SCOPE： ###

**open(key)**

打开指定key的modal。

**close(key)**

隐藏指定key的modal。

**destroy(key)**

销毁指定key的modal