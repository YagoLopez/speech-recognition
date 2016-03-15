var speechApp = angular.module('app-reconocimiento-voz', []);

speechApp.factory('ServicioReconocimientoVoz', function ($rootScope) {

    var service = {};

    service.commands = {};
    service.userSaid = null;
    service.commandText = null;
    service.phrases = null;

    service.addCommand = function(phrase, callback) {
        var command = {};

        command[phrase] = function(args) {
            $rootScope.$apply(callback(args));
        };

        // Extend our commands list
        angular.extend(service.commands, command);

        // Add the commands to annyang
        annyang.addCommands(service.commands);
        console.debug('added command "' + phrase + '"', service.commands);
    };

    service.start = function() {
        annyang.addCommands(service.commands);
        annyang.debug(false);
        annyang.start();
        console.debug('annyang', annyang);
        console.debug('SpeechRecognizer', annyang.getSpeechRecognizer());
    };

    service.setLanguage = function (codigoLenguage) {
        annyang.setLanguage(codigoLenguage); // 'es-ES' -> spanish
    };

    service.onOff = function () {
      if(annyang.isListening()) {
          console.log('desactivar');
          annyang.abort();
      } else {
          console.log('activar');
          this.start();
      }
    };

    return service;
});

speechApp.controller('ControladorReconocimientoVoz', function (ServicioReconocimientoVoz, $scope) {

    if(!annyang){
        alert('El navegador no soporta reconocimiento de voz. Pruebe con Chrome');
        return;
    }

    var vm = this;

    vm.init = function() {
        vm.clearResults();

        ServicioReconocimientoVoz.setLanguage('es-ES');

        ServicioReconocimientoVoz.addCommand('*allSpeech', function(allSpeech) {
            console.debug(allSpeech);
            vm.addResult(allSpeech);
        });

/*
        ServicioReconocimientoVoz.addCommand('siguiente', function () {
            console.log('redirigiendo a dos.html');
            window.location.href = 'dos.html';
        });
*/

        ServicioReconocimientoVoz.start();
    };

    vm.addResult = function(result) {
        vm.results.push({
            content: result
            //,
            //date: new Date()
        });
    };

    vm.clearResults = function() {
        vm.results = [];
    };

    vm.init();

    annyang.addCallback('start', function () {
        console.log('inicio')
    });
    //annyang.addCallback('error', function () {
    //    console.warn('error reconocimiento de voz')
    //});
    annyang.addCallback('errorNetwork', function () {
        console.warn('error de red/no conexion de datos')
    });
    annyang.addCallback('errorPermissionBlocked', function () {
        console.warn('error permission blocked')
    });
    annyang.addCallback('errorPermissionDenied', function () {
        console.warn('error permission denied')
    });
    annyang.addCallback('end', function () {
        console.log('fin sesión reconocimiento de voz')
    });
    annyang.addCallback('resultMatch', function (userSaid, commandText, phrases) {
        console.log('Texto reconocido: ', userSaid);
        console.log('Nombre de funcion ejecutada: ', commandText);
        console.log('Resultados posibles por orden de probabilidad: ', phrases); // array
        $scope.userSaid = userSaid;
        $scope.$apply();
    });
    annyang.addCallback('resultNoMatch', function (res) {
        console.warn('No se han reconocido comandos para:', res)
    });


});