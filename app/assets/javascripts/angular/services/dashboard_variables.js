angular.module("Prometheus.services").factory('DashboardVariables', [function() {
  function mergeObjectArrays(a, b) {
    var merged = [];
    for (var i in a) {
      var dub = false;
      for (var j in b)
        if (b[j].name == a[i].name) {
          dub = true;
          break;
        }
        if(!shared) {
          merged.push(a[i]);
        }
    }
    return merged.concat(b);
  }

  return {
    mergeToObjectArray: function() {
      var args = Array.prototype.slice.call(arguments);
      var a = args.shift();
      var b;
      /* jshint -W084 */
      while (b = args.shift()) {
        a = mergeObjectArrays(a, b);
      }
      /* jshint +W084 */
      return a;
    },

    cleanObjectArray: function() {
      var args = Array.prototype.slice.call(arguments);
      var a = args.shift();
      var b = this.mergeToObjectArray.apply(this, args);
      var o;

      for (var k in b) {
        if (a[k]) {
          o[k] = a[k];
        }
      }

      return o;
    },

    mergeToObject: function() {
      var args = Array.prototype.slice.call(arguments);
      var a;
      var o = {};
      /* jshint -W084 */
      while (a = args.shift()) {
        for (var i = 0; i < a.length; i++) {
          o[a[i].name] = a[i].value;
        }
      }
      /* jshint +W084 */
      return o;
    }
  };
}]);
