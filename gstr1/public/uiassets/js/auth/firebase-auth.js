myApp.controller('firebaseAuthCtrl', ['$scope', function ($scope) {
    $scope.email = '';
    $scope.password = '';
    $scope.busy = false;
    $scope.message = window.corebiqFirebaseError || '';

    function completeAuth(action) {
        if (!window.firebase || !firebase.apps || !firebase.apps.length) {
            $scope.message = window.corebiqFirebaseError ||
                'Firebase authentication is unavailable. Check the Firebase setup.';
            return;
        }

        $scope.busy = true;
        $scope.message = '';
        action().then(function () {
            $scope.$applyAsync(function () {
                $scope.busy = false;
            });
        }, function (error) {
            $scope.$applyAsync(function () {
                $scope.busy = false;
                $scope.message = error.message;
            });
        });
    }

    $scope.signIn = function () {
        completeAuth(function () {
            return firebase.auth().signInWithEmailAndPassword($scope.email, $scope.password);
        });
    };

    $scope.createAccount = function () {
        completeAuth(function () {
            return firebase.auth().createUserWithEmailAndPassword($scope.email, $scope.password);
        });
    };

    $scope.resetPassword = function () {
        completeAuth(function () {
            return firebase.auth().sendPasswordResetEmail($scope.email);
        });
    };
}]);
