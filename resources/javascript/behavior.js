/*============= THIS IS THE NAMESPACED API FOR EXTENDING THE MAIN MODULE FOR THE UI ============*/

var docsApp = docsApp || {};
docsApp.directive = docsApp.directive || {};
docsApp.controller = docsApp.controller || {};
docsApp.serviceFactory = docsApp.serviceFactory || {};


/*============= HERE WE EXTEND THE MAIN MODULE WITH SOME ANGULAR SPECIFIC DIRECTIVES ===========*/

(function(){

    docsApp.directive.gitHubContributors = function($timeout) {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            template: [
                '<div>',
                    '<ul class="github-contributors">',
                        '<li ng-repeat="contributor in contributors">',
                            '<span class="github-contributors-photo"><img src="{{contributor.avatar_url}}"/></span>',
                            '<span class="github-contributors-info"><a href="{{contributor.html_url}}">{{contributor.login}}</a></span>',
                        '</li>',
                    '</ul>',
                '</div>'
            ].join(''),
            link: function(scope, element, attrs) {

                var sortByContributions = function (a, b) {
                    if(a.contributions < b.contributions) {
                        return 1;
                    } else if (a.contributions > b.contributions){
                        return -1;
                    } else {
                        return 0;
                    }
                };

                if(attrs.owner && attrs.repo){

                    var requestURL = 'controller/github/repos/'+attrs.owner+'/'+attrs.repo+'/contributors';

                    $.ajax({
                        dataType: "json",
                        url: requestURL,
                        cache: false,
                        success: function(data) {
                            data.sort(sortByContributions);
                            scope.contributors = data;
                            scope.$apply();
                        }
                    });
                }
            }
        };
    };

    docsApp.directive.gitHubIssues = function($timeout) {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            template: [
                '<div>',
                    '<ol class="github-issues">',
                        '<li ng-repeat="issue in issues | orderBy:predicate:reverse" ng-class="stateClass(issue)">',
                            '<span class="github-issue-name"><i ng-class="iconClass(issue)"></i> <a href="{{issue.html_url}}" target="_blank">{{issue.title}} </a></span>',
                        '</li>',
                    '</ol>',
                '</div>'
            ].join(''),
            link: function(scope, element, attrs) {

                scope.iconClass = function (issue) {
                    return {
                        'icon-check-empty': issue.state == "open",
                        'icon-check': issue.state == "closed"
                    };
                };

                scope.stateClass = function (issue) {
                    return {
                        'github-issue-closed': issue.state == "closed",
                        'github-issue-open': issue.state == "open"
                    };
                };

                var orderByString = attrs.orderBy || "state";
                var orderByParams = orderByString.split(':');
                scope.predicate = orderByParams[0];
                scope.reverse = orderByParams.length > 0 ? orderByParams[1] : 'false';

                attrs.labels = attrs.labels || "";
                var labels = attrs.labels.split(',');

                var sortBySomething = function (a, b) {
                    if(a.contributions < b.contributions) {
                        return 1;
                    } else if (a.contributions > b.contributions){
                        return -1;
                    } else {
                        return 0;
                    }
                };

                if(attrs.owner && attrs.repo){

                    var requestURL = 'controller/github/repos/'+attrs.owner+'/'+attrs.repo+'/issues';

                    var urlGlue = "?";

                    if(labels.length > 0){

                        var labelParams = urlGlue + "labels=";
                        urlGlue = "&";

                        var glue = "";
                        for(var i=0; i < labels.length; i++) {
                            labelParams = labelParams + glue + labels[i];
                            glue = "%2C";
                        }

                        requestURL = requestURL + labelParams;
                    }

                    var allIssues = [];
                    var finished = 0;
                    var loadData = function () {
                        finished = finished + 1;
                        if(finished == 2){
                            scope.issues = allIssues;
                            scope.$apply();
                        }
                    };

                    $.ajax({
                        dataType: "json",
                        url: requestURL + urlGlue + "state=open",
                        cache: false,
                        success: function(data) {
                            allIssues = allIssues.concat(data);
                            loadData();
                        }
                    });

                    $.ajax({
                        dataType: "json",
                        url: requestURL + urlGlue + "state=closed",
                        cache: false,
                        success: function(data) {
                            allIssues = allIssues.concat(data);
                            loadData();
                        }
                    });
                }

            }
        };
    };

})();


