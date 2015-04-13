angular.module("Prometheus.services").factory('SharedWidgetSetup',
                                              ["$timeout",
                                                "VariableInterpolator",
                                                "ServersByIDObject",
                                                "ModalService",
                                                "WidgetLinkHelper",
                                                "URLHashEncoder",
                                                "CheckWidgetMenuAlignment",
                                                "WidgetTabService",
                                                function($timeout,
                                                         VariableInterpolator,
                                                         ServersByIDObject,
                                                         ModalService,
                                                         WidgetLinkHelper,
                                                         URLHashEncoder,
                                                         CheckWidgetMenuAlignment,
                                                         WidgetTabService) {

return function($scope) {
  $scope.generateWidgetLink = function(event) {
    if ($scope.showTab !== 'staticlink') {
      return;
    }
    var graphBlob = {};
    graphBlob.widget = $scope.graph;
    graphBlob.globalConfig = dashboardData.globalConfig;
    WidgetLinkHelper
      .createLink({
         encoded_url: URLHashEncoder(graphBlob),
         graph_title: $scope.graph.title,
         dashboard_name: dashboardName
       }, event)
      .setLink($scope)
      .highlightInput(event);
  };
  $scope.serversById = ServersByIDObject($scope.servers);
  $scope.graph.showLegend = $scope.graph.showLegend || "sometimes";

  $scope.$on('refreshDashboard', function(ev) {
    $scope.refreshGraph();
  });

  $scope.title = function() {
    return VariableInterpolator($scope.graph.title, $scope.vars);
  };

  $scope.addExpression = function() {
    var serverID = 0;
    var axisID = 0;
    var id = 0;
    if ($scope.graph.expressions.length !== 0) {
      var prev = $scope.graph.expressions[$scope.graph.expressions.length-1];
      id = prev.id + 1;
      serverID = prev.serverID;
      axisID = prev.axisID;
    } else if ($scope.servers.length !== 0) {
      serverID = $scope.servers[0].id;
      axisID = $scope.graph.axes[0].id;
    }

    var exp = {
      id: id,
      serverID: serverID,
      axisID: axisID,
      expression: ''
    };
    $scope.graph.expressions.push(exp);
  };

  WidgetTabService($scope);
};
}]);
