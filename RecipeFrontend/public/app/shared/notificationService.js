app.service('notificationService', function ($rootScope, $timeout) {
    $rootScope.notification = {
      showSuccess: false,
      showFail: false,
      successMessage: '',
      failMessage: ''
    };
  
    function showSuccess(message) {
      $rootScope.notification.successMessage = message;
      $rootScope.notification.showSuccess = true;
      
      $timeout(function () {
        $rootScope.notification.showSuccess = false;
      }, 3000);
    }
  
    function showFail(message) {
      $rootScope.notification.failMessage = message;
      $rootScope.notification.showFail = true;
      
      $timeout(function () {
        $rootScope.notification.showFail = false;
      }, 3000);
    }
  
    return {
      success: showSuccess,
      fail: showFail
    };
  });