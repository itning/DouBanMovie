var controllers = angular.module('app.controllers', ['ngRoute']);
controllers.controller('class_focus', ['$scope', '$location', function ($scope, $location) {
    $scope.$location = $location;

}]);

controllers.controller('in_theaters_c', ['$scope', 'HttpService', 'MainService', '$routeParams', function ($scope, HttpService, MainService, $routeParams) {
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

controllers.controller('coming_soon_c', ['$scope', 'MainService', 'HttpService', '$routeParams', function ($scope, MainService, HttpService, $routeParams) {
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

controllers.controller('top250_c', ['$scope', 'MainService', 'HttpService', '$routeParams', function ($scope, MainService, HttpService, $routeParams) {

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

controllers.controller('search', ['$scope', 'MainService', 'HttpService', '$routeParams', function ($scope, MainService, HttpService, $routeParams) {
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
        window.location.href = "#!/search/" + $scope.text;
    }
}]);