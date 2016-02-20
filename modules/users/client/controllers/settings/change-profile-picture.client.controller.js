'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$location', '$window', 'Authentication', 'FileUploader', 'Users',
    function ($scope, $timeout, $window, $location, Authentication, FileUploader, Users) {

        $scope.user = Authentication.user;
        $scope.imageURL = $scope.user.profileImageURL;
        $scope.avatarSelected = false;


        if ($scope.user.provider === 'google') {

            var full = $scope.user.providerData.image.url;
            full = full.substring(0, full.length - 2);

            $scope.changedAvatar = full + '120';

        }


        $scope.randomAvatar1 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatar2 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatar3 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatar4 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatar5 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatar6 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatar7 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatar8 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatar9 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatar10 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatar11 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatar12 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatar13 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatar14 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatar15 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatar16 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatarFB = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
        $scope.randomAvatarG = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';


        // Create file uploader instance
        $scope.uploader = new FileUploader({
            url: 'api/users/picture'
        });

        // Check if provider is already in use with current user
        $scope.isConnectedSocialAccountProfile = function (provider) {

            return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
        };

        $scope.selectAvatar = function (imageURLIn) {

            $scope.imageURL = imageURLIn;
            $scope.avatarSelected = true;

        };


        $scope.randomiseAvatars = function () {

            $scope.randomAvatar1 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatar2 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatar3 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatar4 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatar5 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatar6 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatar7 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatar8 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatar9 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatar10 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatar11 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatar12 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatar13 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatar14 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatar15 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatar16 = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatarFB = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';
            $scope.randomAvatarG = '../modules/users/client/img/profile/avatars/2/' + Math.floor((Math.random() * 90) + 1) + '.png';


        };

        // Set file uploader image filter
        $scope.uploader.filters.push({
            name: 'imageFilter',
            fn: function (item, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        // Called after the user selected a new picture file
        $scope.uploader.onAfterAddingFile = function (fileItem) {
            if ($window.FileReader) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(fileItem._file);

                fileReader.onload = function (fileReaderEvent) {
                    $timeout(function () {
                        $scope.imageURL = fileReaderEvent.target.result;
                    }, 0);
                };
            }
        };

        // Called after the user has successfully uploaded a new picture
        $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
            // Show success message
            $scope.success = true;

            // Populate user object
            $scope.user = Authentication.user = response;

            // Clear upload buttons
            $scope.cancelUpload();
        };

        // Called after the user has failed to uploaded a new picture
        $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
            // Clear upload buttons
            $scope.cancelUpload();

            // Show error message
            $scope.error = response.message;
        };

        // Change user profile picture
        $scope.uploadProfilePicture = function () {
            // Clear messages
            $scope.success = $scope.error = null;

            // Start upload
            $scope.uploader.uploadAll();

        };

        // Change user profile picture
        $scope.uploadProfilePictureAvatar = function () {

            // Clear messages
            $scope.success = $scope.error = null;

            var user = new Users($scope.user);

            user.profileImageURL = $scope.imageURL;

            user.$update(function (response) {

                $scope.success = true;
                Authentication.user = response;


            }, function (response) {
                $scope.error = response.data.message;
            });


        };

        //be sure to inject $scope and $location
        $scope.changeLocation = function (url, forceReload) {
            $scope = $scope || angular.element(document).scope();
            if (forceReload || $scope.$$phase) {
                window.location = url;
            }
            else {
                //only use this if you want to replace the history stack
                //$location.path(url).replace();

                //this this if you want to change the URL and add it to the history stack
                $location.path(url);
                $scope.$apply();
            }
        };

        // Cancel the upload process
        $scope.cancelUpload = function () {
            $scope.uploader.clearQueue();
            $scope.imageURL = $scope.user.profileImageURL;
        };


    }
]);
