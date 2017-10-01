var services = angular.module('app.services', []);
services.service('HttpService', ['$window', '$document', function ($window, $document) {
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

services.service('MainService', [function () {
    /**
     * @return {string}
     */
    function Getgenres(genres) {
        var ret = "";
        for (var i = 0; i < genres.length; i++) {
            ret += genres[i];
            if (i < genres.length - 1) {
                ret += ',';
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
                ret += ',';
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