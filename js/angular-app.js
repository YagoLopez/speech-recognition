var SpeechApp = angular.module('app-reconocimiento-voz', []);

SpeechApp.factory('ReconocimientoVoz', function ($rootScope) {

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
        //console.debug('added command "' + phrase + '"', service.commands);
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
    service.toggle = function () {
      if(annyang.isListening()) {
          annyang.abort();
          console.log('Reconocimiento de voz desactivado');
          //console.log('is listening', annyang.isListening());
      } else {
          annyang.start();
          console.log('Reconocimiento de voz activado');
          //console.log('is listening', annyang.isListening());
      }
    };

    return service;
});
// =====================================================================================================================
SpeechApp.controller('ControladorReconocimientoVoz', function (ReconocimientoVoz, $scope) {


    // INICIALIZACIONES ------------------------------------------------------------------------------------------------
    if(!annyang || !'speechSynthesis' in window || !'SpeechRecognition' in window){
        alert('El navegador no soporta reconocimiento o sintesis de voz. Probar con Chrome');
        return;
    }
    ReconocimientoVoz.setLanguage('es-ES');
    $scope.annyang = annyang;
    $scope.statusMessage = 'Reconocimiento de voz desactivado';
    $scope.toggle = ReconocimientoVoz.toggle;

    // COMANDOS --------------------------------------------------------------------------------------------------------
    //ReconocimientoVoz.addCommand('*allSpeech', function(allSpeech) {
    //    console.debug(allSpeech);
    //    vm.addResult(allSpeech);
    //});
    ReconocimientoVoz.addCommand('siguiente', function () {
        console.log('redirigiendo a dos.html');
        window.location.href = 'dos.html';
    });
    ReconocimientoVoz.addCommand('detener voz', function () {
        console.log('desactivar voz');
        annyang.abort();
    });

    // EVENTOS ---------------------------------------------------------------------------------------------------------
    annyang.addCallback('start', function () {
        $scope.statusMessage = 'Esperando comandos de voz...';
        $scope.$apply();
    });
    //annyang.addCallback('error', function () {
    //    console.warn('error reconocimiento de voz')
    //});
    annyang.addCallback('errorNetwork', function () {
        $scope.statusMessage = 'Fallo de red / Sin conexion de datos';
        $scope.$apply();
    });
    annyang.addCallback('errorPermissionBlocked', function () {
        $scope.statusMessage = 'Permiso para acceder al microfono bloqueado';
        $scope.$apply();
    });
    annyang.addCallback('errorPermissionDenied', function () {
        $scope.statusMessage = 'Permiso para usar microfono denegado';
        $scope.$apply();
    });
    annyang.addCallback('end', function () {
        $scope.statusMessage = 'Reconocimiento de voz desactivado';
        $scope.$apply();
    });
    annyang.addCallback('resultMatch', function (userSaid, commandText, phrases) {
        console.debug('Texto reconocido: ', userSaid);
        console.debug('Nombre de funcion ejecutada: ', commandText);
        console.debug('Resultados posibles por orden de probabilidad: ', phrases); // array
        $scope.statusMessage = userSaid;
        $scope.$apply();
    });
    annyang.addCallback('resultNoMatch', function (res) {
        console.log('Texto reconocido pero no asociado a ningun comando:', res);
        $scope.statusMessage = res[0];
        $scope.$apply();
    });
    // FIN EVENTOS -----------------------------------------------------------------------------------------------------

});
// =====================================================================================================================
SpeechApp.factory('speech', function () {

     //Deteccion de sintetizador de voz
    if(window.speechSynthesis) {
        var msg = new SpeechSynthesisUtterance();
    } else {
        alert('El navegador no soporta síntesis de voz');
        return;
    }

    function getVoices() {
        window.speechSynthesis.getVoices();
        return window.speechSynthesis.getVoices();
    }

    function sayIt(text, config) {
        var voices = getVoices();

        //choose voice. Fallback to default
        msg.voice = config && config.voiceIndex ? voices[config.voiceIndex] : voices[0];
        msg.volume = config && config.volume ? config.volume : 1;
        msg.rate = config && config.rate ? config.rate : 1;
        msg.pitch = config && config.pitch ? config.pitch : 1;

        //message for speech
        msg.text = text;

        speechSynthesis.speak(msg);
    }

    return {
        sayText: sayIt,
        getVoices: getVoices
    };
});
// =====================================================================================================================
SpeechApp.controller('speechCtrl', ['$scope', '$timeout', 'speech', function ($scope, $timeout, speech) {

    $scope.support = false;
    if(window.speechSynthesis) {
        $scope.support = true;

        $timeout(function () {
            $scope.voices = speech.getVoices();
        }, 500);
    }

    $scope.pitch = 1;
    $scope.rate = 1;
    $scope.volume = 1;
    $scope.msg = 'La paradoja de Epiménides dice lo siguiente: "Esta frase es falsa.\n\n' +
        'Si es cierto que la frase es falsa, implica contradicción. Por el contrario, si es falso, ' +
        'entonces la sentencia es cierta, lo que también implica contradicción';

    $scope.submitEntry = function () {
        var voiceIdx = $scope.voices.indexOf($scope.optionSelected);
        var config = {
                voiceIndex: voiceIdx,
                rate: $scope.rate,
                pitch: $scope.pitch,
                volume: $scope.volume
            };

        //if(window.speechSynthesis) {
            console.log('hablando...', $scope.msg);
            speech.sayText($scope.msg, config);
        //}
    }
}]);
// =====================================================================================================================
SpeechApp.filter('FiltroHtml', ['$sce', function($sce) {
    return function(value, type) {
        return $sce.trustAs(type || 'html', value);
    }
}]);
