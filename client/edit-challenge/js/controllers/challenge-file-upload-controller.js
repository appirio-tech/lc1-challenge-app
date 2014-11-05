/**
 * This code is copyright (c) 2014 Topcoder Corporation
 */

(function (window, angular, undefined) {
  'use strict';

  angular
    .module('edit.challenge')
    .controller('ChallengeFileUploadController', ChallengeFileUploadController);

  ChallengeFileUploadController.$inject = ['$scope', '$document', '$upload', 'ChallengeService'];

  function ChallengeFileUploadController($scope, $document, $upload, ChallengeService) {

    function resetUploadForm() {
      $scope.fileName = '';
      $scope.fileTitle = '';
      $scope.progress = 0;
      $scope.selectedFile = null;
      $scope.uploading = false;
      $scope.fileNameInvalid = false;
      $scope.fileTitleInvalid = false;
    }
    resetUploadForm();


    /*get files in the challenge*/
    if ($scope.challenge.id) {
      ChallengeService.getFiles($scope.challenge.id).then(function(data) {
        $scope.fileBrowsing.uploadedFiles = data;
      });
    }

    /*file is selected*/
    $scope.onFileSelect = function($files) {
      $scope.selectedFiles = [];
      $scope.progress = 0;

      $scope.selectedFile = $files[0];
      $scope.fileName = $files[0].name;
    };

    /*start uploading*/
    $scope.uploadFile = function() {
      if (!$scope.fileName) {
        $scope.fileNameInvalid = true;
        return;
      }
      if (!$scope.fileTitle) {
        $scope.fileTitleInvalid = true;
        return;
      }

      var fileData = {
        title: $scope.fileTitle,
        file: $scope.selectedFile
      };
      $scope.uploading = true;

      ChallengeService.uploadChallengeFile($scope.challenge.id, fileData).then(function(data) {
          $scope.progress = 100;
          // add file to list
          ChallengeService.getFile($scope.challenge.id, data.id).then(function(data){
            $scope.fileBrowsing.uploadedFiles.push(data);
            resetUploadForm();
          },function(err){
            console.log('upload: error: ', err);
          });
          // clear form
        },
        function(error) {
          console.log('upload: error: ', error);
        },
        function(progress) {
          console.log('upload: progress: ', progress);
        }
      );
    };

    /*remove file*/
    $scope.deleteFile = function(file) {
      ChallengeService.deleteFile(file).then(function(data) {
        var index = $scope.fileBrowsing.uploadedFiles.indexOf(file);
        $scope.fileBrowsing.uploadedFiles.splice(index, 1);
        if ($scope.fileBrowsing.uploadedFiles.length === 0) {
          $scope.fileBrowsing.complete = false;
        }
      }, function(err){
        console.log(err);
      });

    };

    /*watch file browsing section*/
    $scope.$watch('fileBrowsing.uploadedFiles', function(newVal) {
      if ($scope.fileBrowsing.uploadedFiles.length > 0) {
        $scope.fileBrowsing.complete = true;
      }
    }, true);

    /*watch no-file*/
    $scope.changeNoFile = function (state) {
      $scope.fileBrowsing.complete = state;
    };

    /*detect if leave file browsing section*/
    $document.on('scroll', function() {
      $scope.isFirstSection = $document.scrollTop() <= 130;
    });

  };  // end of ChallengeFileUploadController


})(window, window.angular);