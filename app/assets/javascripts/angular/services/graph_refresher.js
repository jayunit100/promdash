angular.module("Prometheus.services").factory('GraphRefresher',
                                              ["$http",
                                               "$q",
                                               "VariableInterpolator",
                                               "URLGenerator",
                                               function($http,
                                                        $q,
                                                        VariableInterpolator,
                                                        URLGenerator) {
  return function($scope) {
    function loadGraphData(idx, server, path, expressionID, params) {
      var deferred = $q.defer();
      $http.get(URLGenerator(server.url, path, $scope.vars), {
        params: params,
        cache: false
      }).then(function(payload, status) {
        data = payload.data;
        switch(data.Type || data.type) {
          case 'error':
            var errMsg = "Expression " + (idx + 1) + ": " + (data.Value || data.value);
            $scope.errorMessages.push(errMsg);
            break;
          case 'matrix':
            deferred.resolve({
              'exp_id': expressionID,
              'data': data
            });
            break;
          case 'vector':
            var d = data.value || data.Value;
            d.forEach(function(s) { s.metric.serverName = server.name; });
            deferred.resolve(d);
            break;
          default:
            var errMsg = 'Expression ' + (idx + 1) + ': Result type "' + (data.Type || data.type) + '" cannot be graphed."';
            $scope.errorMessages.push(errMsg);
        }
      }, function(data, status, b) {
        var errMsg = "Expression " + (idx + 1) + ": Server returned status " + status + ".";
        $scope.errorMessages.push(errMsg);
      });
      return deferred.promise;
    }

    return function(path, params) {
      var deferred = $q.defer();
      var promises = [];
      $scope.errorMessages = [];
      for (var i = 0; i < $scope.graph.expressions.length; i++) {
        var exp = $scope.graph.expressions[i];
        var server = $scope.serversById[exp.serverID];
        if (server === undefined || !exp.expression) {
          continue;
        }
        params.expr = VariableInterpolator(exp.expression, $scope.vars);
        $scope.requestsInFlight = true;
        // params is passed by reference, requiring us to make a copy.
        // $.extend creates a shallow copy of the object.
        promises[i] = loadGraphData(i, server, path, exp.id, $.extend({}, params));
      }
      $q.all(promises).then(function(data) {
        $scope.requestsInFlight = false;
        deferred.resolve(data);
      });
      return deferred.promise;
    };
  };
}]);
