'use strict';

var myApp = angular.module('myApp', ['ngRoute']);

/*路由*/
myApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/in_theaters/:page?', {
        controller: 'in_theaters_c',
        templateUrl: 'template'
    }).when('/coming_soon/:page?', {
        controller: 'coming_soon_c',
        templateUrl: 'template'
    }).when('/top250/:page?', {
        controller: 'top250_c',
        templateUrl: 'template'
    }).when('/search/:text?/:page?', {
        controller: 'search',
        templateUrl: 'template'
    }).otherwise({redirectTo: '/in_theaters'});
}]);

/*服务*/
myApp.service('HttpService', ['$window', '$document', function ($window, $document) {
    // url : http://api.douban.com/vsdfsdf -> <script> -> html就可自动执行
    this.jsonp = function (url, data, callback) {
        var fnSuffix = Math.random().toString().replace('.', '');
        var cbFuncName = 'my_json_cb_' + fnSuffix;
        // 不推荐
        $window[cbFuncName] = callback;
        var querystring = url.indexOf('?') === -1 ? '?' : '&';
        for (var key in data) {
            querystring += key + '=' + data[key] + '&';
        }
        querystring += 'callback=' + cbFuncName;
        var scriptElement = $document[0].createElement('script');
        scriptElement.src = url + querystring;
        $document[0].body.appendChild(scriptElement);
    };
}]);

myApp.service('MainService', [function () {
    /**
     * @return {string}
     */
    function Getgenres(genres) {
        var ret = "";
        for (var i = 0; i < genres.length; i++) {
            ret += genres[i];
            if (i < genres.length - 1) {
                ret += '，';
            }
        }
        return ret;
    }

    /**
     * @return {string}
     */
    function Arrayformat(array) {
        var ret = "";
        for (var i = 0; i < array.length; i++) {
            ret += array[i].name;
            if (i < array.length - 1) {
                ret += '，';
            }
        }
        return ret;
    }

    this.pushArray = function (array, subject) {
        array.push({
            id: subject.id,
            title: subject.title,
            original_title: subject.original_title,
            year: subject.year,
            collect_count: subject.collect_count,
            average: subject.rating.average,
            directors: Arrayformat(subject.directors),
            casts: Arrayformat(subject.casts),
            genres: Getgenres(subject.genres),
            img: subject.images.large
        });
    };

    this.page_total = function (total_in, count) {
        var _t = parseInt(total_in);
        var total = _t / count;
        if (_t % count !== 0) {
            total = parseInt(total);
            total += 1;
        }
        return total;
    };
}]);


/*控制器*/
myApp.controller('class_focus', ['$scope', '$location', function ($scope, $location) {
    $scope.$location = $location;

}]);

myApp.controller('in_theaters_c', ['$scope', 'HttpService', 'MainService', '$routeParams', function ($scope, HttpService, MainService, $routeParams) {
    $scope.subjects_data = [];
    var count = 10;
    var page = $routeParams['page'] ? $routeParams['page'] : 1;
    var page_num = parseInt(page);
    $scope.location = '/in_theaters';
    $scope.page = page_num;
    $scope.last = page_num > 1 ? page_num - 1 : page_num;
    var start = (page - 1) * count + 1;
    $scope.in_theaters_url = '//api.douban.com/v2/movie/in_theaters?start=' + start + '&count=' + count;
    HttpService.jsonp($scope.in_theaters_url, {}, function (response) {

        $scope.total = MainService.page_total(response.total, count);
        $scope.next = page_num + 1 <= parseInt($scope.total) ? page_num + 1 : page_num;

        for (var i = 0; i < response.subjects.length; i++) {
            var subject = response.subjects[i];
            MainService.pushArray($scope.subjects_data, subject);
            $scope.$apply();
        }
    });
}]);

myApp.controller('coming_soon_c', ['$scope', 'MainService', 'HttpService', '$routeParams', function ($scope, MainService, HttpService, $routeParams) {
    $scope.subjects_data = [];

    var count = 10;
    var page = $routeParams['page'] ? $routeParams['page'] : 1;
    var page_num = parseInt(page);
    $scope.location = '/coming_soon';
    $scope.page = page_num;
    $scope.last = page_num > 1 ? page_num - 1 : page_num;
    var start = (page - 1) * count + 1;

    $scope.coming_soon_url = '//api.douban.com/v2/movie/coming_soon?start=' + start + '&count=' + count;
    HttpService.jsonp($scope.coming_soon_url, {}, function (response) {
        $scope.total = MainService.page_total(response.total, count);
        $scope.next = page_num + 1 <= parseInt($scope.total) ? page_num + 1 : page_num;
        for (var i = 0; i < response.subjects.length; i++) {
            var subject = response.subjects[i];
            MainService.pushArray($scope.subjects_data, subject);
            $scope.$apply();
        }
    });
}]);

myApp.controller('top250_c', ['$scope', 'MainService', 'HttpService', '$routeParams', function ($scope, MainService, HttpService, $routeParams) {

    $scope.subjects_data = [];

    var count = 10;
    var page = $routeParams['page'] ? $routeParams['page'] : 1;
    var page_num = parseInt(page);
    $scope.location = '/top250';
    $scope.page = page_num;
    $scope.last = page_num > 1 ? page_num - 1 : page_num;
    var start = (page - 1) * count + 1;

    $scope.top250_url = '//api.douban.com/v2/movie/top250?start=' + start + '&count=' + count;

    HttpService.jsonp($scope.top250_url, {}, function (response) {
        $scope.total = MainService.page_total(response.total, count);
        $scope.next = page_num + 1 <= parseInt($scope.total) ? page_num + 1 : page_num;
        for (var i = 0; i < response.subjects.length; i++) {
            var subject = response.subjects[i];
            MainService.pushArray($scope.subjects_data, subject);
            $scope.$apply();
        }
    });
}]);

myApp.controller('search', ['$scope', 'MainService', 'HttpService', '$routeParams', function ($scope, MainService, HttpService, $routeParams) {
    $scope.subjects_data = [];

    $scope.text = "";
    var text = $routeParams['text'];
    var count = 10;
    var page = $routeParams['page'] ? $routeParams['page'] : 1;
    var page_num = parseInt(page);
    $scope.location = '/search';
    $scope.page = page_num;
    $scope.last = page_num > 1 ? page_num - 1 : page_num;
    var start = (page - 1) * count + 1;

    $scope.search_url = '//api.douban.com/v2/movie/search?q=' + text + '&start=' + start + '&count=' + count;

    HttpService.jsonp($scope.search_url, {}, function (response) {
        $scope.total = MainService.page_total(response.total, count);
        $scope.next = page_num + 1 <= parseInt($scope.total) ? page_num + 1 : page_num;
        for (var i = 0; i < response.subjects.length; i++) {
            var subject = response.subjects[i];
            MainService.pushArray($scope.subjects_data, subject);
            $scope.$apply();
        }
    });

    $scope.search_sub = function () {
        window.location.href="#!/search/"+$scope.text;
    }
}]);