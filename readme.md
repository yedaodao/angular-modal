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
	}]);
	
1. bindElement(可选): 模板插入到哪个元素。
1. position(可选): 位置（center,top,custom）。
1. left(可选): 位置为custom时可用。自定义模态框位置。
1. top(可选): 同上。
1. width(必须)：modal宽度。
1. scope(可选)：可以吧当前模块的数据注入到modal controller的$scope里边；如果controller为空，则使用scope所在的controller。
1. theme(可选)：modal动画主题。
1. templateUrl/template(必须)： 模板url。
1. controller(可选)：modal对应的angular controller，**如果此项为空则必须把某个controller的$scope赋值给scope。**
1. overlay(可选)：点击其他区域是否隐藏/销毁modal。
1. closeAndDestroy(可选)：隐藏modal的同时是否同时销毁modal，默认为true。
1. removable(可选)：modal是否是可拖动的，默认为false。

##事件##

	$scope.$on('modal.init.complete.event', function () {
		//模态框初始化完成
	}
	$scope.$on('modal.open.end.event', function () {
	    //模态框弹出动画结束
	});
	$scope.$on('modal.open.start.event', function () {
	    //模态框弹出动画开始
	});
	$scope.$on('modal.close.end.event', function () {
	    //模态框关闭动画结束
	});
	$scope.$on('modal.close.start.event', function () {
	    //模态框关闭动画开始
	});
	$scope.$on('modal.closeAll.end.event', function () {
	    //关闭所有模态框动画结束
	});
	$scope.$on('modal.closeAll.start.event', function () {
	    //关闭所有模态框动画开始
	});
	$scope.$on('modal.destroy.event', function () {
	    //模态框销毁
	});
	$scope.$on('modal.destroyAll.event', function () {
	    //销毁所有模态框
	});


## 接口 ##

### SERVICE： ###

####init(opts):data####


初始化modal。

opts请参照用法。

    data{
		 closeAndDestroy: true, 
		 modalScope: $scope, 
		 controller: Object, //controller项未填不返回此项
		 key: "8cfca573-0b48-4515-816c-c5e553ea95b6", 
		 element: JQLiteElement
	}


####open(key)####

打开指定key的modal。

####close(key)####

隐藏指定key的modal。

####closeAll()####

隐藏所有打开的Modal

####destroy(key)####

销毁指定key的modal

####destroyAll()####

销毁所有的modal

### SCOPE： ###

####open(key)####

打开指定key的modal。

####close(key)####

隐藏指定key的modal。

####destroy(key)####

销毁指定key的modal