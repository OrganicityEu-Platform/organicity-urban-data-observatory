(function(){
  'use strict';

  angular.module('app.components')
    .controller('UrnController', UrnController);

  UrnController.$inject = ['alert'];
  function UrnController(alert){
    var vm = this;

    vm.copied = copied;
    vm.copyFail = copyFail;

    ///////////////

    function copied(){
      alert.info.generic(
      'URN copied to your clipboard! Let\'s start using the Asset Discovery API!', 
      5000,
      {
        button: 'Documentation',
        buttonAttributes: 'target="_blank"',
        href: 'https://organicityeu.github.io/api/AssetDiscovery.html'
      });
    }

    function copyFail(err){
      console.log('Copy error: ', err);
      alert.error('Oops! An error occurred copying the urn.');
    }

  }
})();
