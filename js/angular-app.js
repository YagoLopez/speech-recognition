var SpeechApp = angular.module('app-reconocimiento-voz', ['ngDialog', 'ngNotificationsBar', 'ngSanitize']);

SpeechApp.config(function ($compileProvider, notificationsConfigProvider) {

    $compileProvider.debugInfoEnabled(true);
    notificationsConfigProvider.setAutoHide(false);
    notificationsConfigProvider.setAcceptHTML(true);
});
// =====================================================================================================================
SpeechApp.factory('ReconocimientoVoz', function ($rootScope) {

    var service = {};

    service.commands = {};
    service.userSaid = null;
    service.commandText = null;
    service.phrases = null;
    service.statusMessage = null;

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
        }
    };
    return service;
});
// =====================================================================================================================
SpeechApp.controller('ReconocimientoVozCtrl', function ($rootScope, ReconocimientoVoz, $scope, ngDialog, notifications, speech) {

    // INICIALIZACIONES ------------------------------------------------------------------------------------------------
    if(!annyang || !'speechSynthesis' in window || !'SpeechRecognition' in window){
        alert('El navegador no soporta reconocimiento o sintesis de voz. Probar con Chrome');
        return;
    }
    ReconocimientoVoz.setLanguage('es-ES');
    $scope.annyang = annyang;
    $rootScope.statusMessage = 'Reconocimiento de voz desactivado';
    $rootScope.toggle = ReconocimientoVoz.toggle;
    $scope.openDialog = function () {
        ngDialog.open({ template: 'dialog', className: 'ngdialog-theme-plain', disableAnimation:false });
    };
    $scope.cerrarPagina = function () {
      document.getElementById('btnCerrar').click();
    };

    // COMANDOS --------------------------------------------------------------------------------------------------------
    //ReconocimientoVoz.addCommand('*allSpeech', function(allSpeech) {
    //    console.debug(allSpeech);
    //    vm.addResult(allSpeech);
    //});
    ReconocimientoVoz.addCommand('detener voz', function () {
        console.log('desactivar voz');
        annyang.abort();
    });
    ReconocimientoVoz.addCommand('cerrar', function () {
        document.getElementById('btnCerrar').click();
    });
    ReconocimientoVoz.addCommand('siguiente', function () {
        document.getElementById('btnDerecha').click();
    });
    ReconocimientoVoz.addCommand('anterior', function () {
        document.getElementById('btnIzquierda').click();
    });
    ReconocimientoVoz.addCommand('detalles', function () {
        document.getElementById('btnDetalles').click();
    });
    ReconocimientoVoz.addCommand('ayuda', function () {
        $scope.openDialog();
     });

    // EVENTOS ---------------------------------------------------------------------------------------------------------
    annyang.addCallback('start', function () {
        $rootScope.statusMessage = 'Esperando comandos de voz...';
        $scope.$apply();
        notifications.showError({
            message: '<i class="ion-android-microphone animated fadeIn infinite"></i> '+$rootScope.statusMessage+
            '<a href="#"> <i class="ion-close-circled"></i> Stop</a>'
        });
    });
    //annyang.addCallback('error', function () {
    //    console.warn('error reconocimiento de voz')
    //});
    annyang.addCallback('errorNetwork', function () {
        $rootScope.statusMessage = 'Fallo de red / Sin conexion de datos';
        $scope.$apply();
    });
    annyang.addCallback('errorPermissionBlocked', function () {
        $rootScope.statusMessage = 'Permiso para acceder al microfono bloqueado';
        $scope.$apply();
    });
    annyang.addCallback('errorPermissionDenied', function () {
        $rootScope.statusMessage = 'Permiso para usar microfono denegado';
        $scope.$apply();
    });
    annyang.addCallback('end', function () {
        $rootScope.statusMessage = 'Reconocimiento de voz desactivado';
        //notifications.showInfo({
        //    message: 'fin'
        //});
        $scope.$apply();
        notifications.closeAll();
    });
    annyang.addCallback('resultMatch', function (userSaid, commandText, phrases) {
        //var config = {voiceIndex: 0, rate: 1, pitch: 1, volume: 1};
        speech.sayText(userSaid);
        $rootScope.statusMessage = userSaid;
        $scope.$apply();
        //console.debug('Texto reconocido: ', userSaid);
        //console.debug('Nombre de funcion ejecutada: ', commandText);
        //console.debug('Resultados posibles por orden de probabilidad: ', phrases); // array
    });
    annyang.addCallback('resultNoMatch', function (res) {
        console.log('Texto reconocido pero no asociado a ningun comando:', res);
        //speech.sayText('Comando no reconocido');
        $rootScope.statusMessage = '<div style="color:red">'+res[0]+'<br/>[Comando no reconocido]</div>';
        $scope.$apply();
    });
    // FIN EVENTOS -----------------------------------------------------------------------------------------------------

    //$scope.codropsModal = function () {
    //    var el = document.querySelector('.md-trigger');
    //    var modal = document.querySelector( '#' + el.getAttribute('data-modal') );
    //    addEventListener( 'click', function( ev ) {
    //        classie.add(modal, 'md-show');
    //    });
    //};

    //$scope.closeCodropsModal = function (hasPerspective) {
    //    console.log('cerrando modal');
    //    var el = document.querySelector('.md-trigger');
    //    var modal = document.querySelector( '#' + el.getAttribute('data-modal') );
    //    addEventListener('click', function (ev) {
    //        classie.remove( modal, 'md-show' );
    //    });
    //
    //    if( hasPerspective ) {
    //        classie.remove( document.documentElement, 'md-perspective' );
    //    }
    //};

});
// =====================================================================================================================
SpeechApp.service('speech', function () {

     //Deteccion de sintetizador de voz
    var msg = null;
    if(window.speechSynthesis) {
        msg = new SpeechSynthesisUtterance();
    } else {
        alert('El navegador no soporta síntesis de voz');
        return;
    }

    this.getVoices = function() {
        return window.speechSynthesis.getVoices();
    };
    this.sayText = function(text, config) {
        var voices = this.getVoices();

        //choose voice. Fallback to default
        msg.voice = config && config.voiceIndex ? voices[config.voiceIndex] : voices[0];
        msg.volume = config && config.volume ? config.volume : 1;
        msg.rate = config && config.rate ? config.rate : 1;
        msg.pitch = config && config.pitch ? config.pitch : 1;

        //message for speech
        msg.text = text;

        speechSynthesis.speak(msg);
    };
    this.cancel = function() {
        speechSynthesis.cancel();
    };
    this.isTalking = function() {
        return speechSynthesis.speaking;
    };
    this.pause = function () {
        speechSynthesis.pause();
    };
    this.resume = function () {
        speechSynthesis.resume();
    };
    msg.onend = function () {};
    msg.onerror = function () {
        console.error('Error en la síntesis de voz')
    }
});
// =====================================================================================================================
SpeechApp.controller('speechCtrl', ['$scope', '$timeout', 'speech', function ($scope, $timeout, speech) {

    $scope.support = false;
    if(window.speechSynthesis) {
        $scope.support = true;

        $timeout(function () {
            $scope.voices = speech.getVoices();
        }, 200);
    }

    $scope.pitch = 1;
    $scope.rate = 1;
    $scope.volume = 1;
    $scope.msg = 'La paradoja de Epiménides dice lo siguiente: "Esta frase es falsa".\n\n' +
        'Si la frase es verdadera se contradice a sí misma.\n\n' +
        'Por el contrario, si la frase es falsa, entonces su enunciado es verdadero, ' +
        'lo que también implica contradicción';

    $scope.submitEntry = function () {
        var voiceIdx = $scope.voices.indexOf($scope.optionSelected);
        var config = {
                voiceIndex: voiceIdx,
                rate: $scope.rate,
                pitch: $scope.pitch,
                volume: $scope.volume
            };
        console.log(window.speechSynthesis);
        speech.sayText($scope.msg, config);
    };

    $scope.speech = speech;

}]);
// =====================================================================================================================
SpeechApp.filter('FiltroHtml', ['$sce', function($sce) {
    return function(value, type) {
        return $sce.trustAs(type || 'html', value);
    }
}]);
