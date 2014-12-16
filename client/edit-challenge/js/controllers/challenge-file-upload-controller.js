/**
 * This code is copyright (c) 2014 Topcoder Corporation
 */

(function (window, angular, undefined) {
  'use strict';

  angular
    .module('edit.challenge')
    .controller('ChallengeFileUploadController', ChallengeFileUploadController);


  ChallengeFileUploadController.$inject = ['$scope', '$log', '$timeout', '$document', '$upload', 'ChallengeService'];

  function ChallengeFileUploadController($scope, $log,  $timeout, $document, $upload, ChallengeService) {

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
        _.forEach(data, function(datum) {
          datum.name = datum.fileUrl.substring(datum.fileUrl.lastIndexOf('/') + 1);
          datum.extension = datum.fileUrl.substring(datum.fileUrl.lastIndexOf('.') + 1);
        })

        $scope.fileBrowsing.uploadedFiles = data;
      });
    }

    /*file is selected*/
    $scope.onFileSelect = function($files) {
      $scope.selectedFiles = [];
      $scope.progress = 0;
      $scope.selectedFile = $files[0];
      // I was throwing an error becuase $scope.filename was being assigned before a file was selected
      if ($scope.selectedFile) {
        $scope.fileName = $files[0].name;
      }
    };

    /*start uploading*/
    var uploadUrl = '/challenges/' + $scope.challenge.id +'/uploadfile';
    $scope.doUpload = function (file) {
      if ($scope.fileName === '') {
        return;
      }
      $scope.uploading = true;
      $log.debug('starting the file upload');
      $scope.upload = $upload.upload({
        url: uploadUrl,
        method: 'POST',
        data: {
          title: $scope.fileTitle
        },
        file: $scope.selectedFile,
        fileFormDataName: 'file'
      }).progress(function(evt) {
        $log.debug('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :'+ evt.config.file.name);
        $scope.progress =  parseInt(100.0 * evt.loaded / evt.total);
      }).success(function(data, status, headers, config) {
        // file is uploaded successfully
        $log.info('file ' + config.file.name + 'is uploaded successfully. Response: ' + data);
      });



      //;
      $scope.upload.then(function (uploadResponse) {    // success
        var actionResponse = uploadResponse.data;
        ChallengeService.getFile($scope.challenge.id, actionResponse.id)
          .then(function(file) {
            // add file to list
            file.name = file.fileUrl.substring(file.fileUrl.lastIndexOf('/') + 1);
            file.extension = file.fileUrl.substring(file.fileUrl.lastIndexOf('.') + 1);
            $scope.fileBrowsing.uploadedFiles.push(file);
            // clear form
            resetUploadForm();
          }, function(err) {
            $log.error('getFile: error: ', err);
          });

      }, function (err) {    // error
        $log.error('doUpload: error: ', err);
      }, function (evt) {   // progress notify
        // Math.min is to fix IE which reports 200% sometimes
        $scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
    };

    /*remove file*/
    $scope.deleteFile = function(file) {
      ChallengeService.deleteFile(file).then(function(data) {
        var index = $scope.fileBrowsing.uploadedFiles.indexOf(file);
        $scope.fileBrowsing.uploadedFiles.splice(index, 1);
        if ($scope.fileBrowsing.uploadedFiles.length === 0) {
          $scope.fileBrowsing.complete = false;
        }
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
