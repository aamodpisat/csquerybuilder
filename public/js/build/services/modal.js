module.exports = [
  '$q',
  '$modal',
  function($q, $modal) {
    this.openModal = function(data, template, controller, options) {
      var defaultOptions = {
        template: template,
        backdrop: 'static',
        keyboard: true,
        controller: controller,
        size: '',
        resolve: {
          data: function() {
            return data;
          }
        }
      };
      var modalData = _.extend({}, defaultOptions, options || {});
      var modalInstance = $modal.open(modalData);
      return modalInstance.result;
    }
  }
]