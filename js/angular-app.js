var SpeechApp = angular.module('app-reconocimiento-voz', ['ngDialog', 'ngNotificationsBar', 'ngSanitize']);

SpeechApp.config(function ($compileProvider, notificationsConfigProvider) {

    $compileProvider.debugInfoEnabled(false);
    notificationsConfigProvider.setAutoHide(false);
    notificationsConfigProvider.setAcceptHTML(true);
});
// =====================================================================================================================
SpeechApp.service('ReconocimientoVoz', function ($rootScope, notifications, SintesisVoz, ngDialog) {

    this.commands = {};

    this.addCommand = function(frase, callback) {
        var command = {};
        command[frase] = function(args) {
            $rootScope.$apply(callback(args));
        };
        // Extiende lista comandos por voz
        angular.extend(this.commands, command);

        // Añade comandos al motor reconocedor de voz
        annyang.addCommands(this.commands);
    };
    this.start = function() {
        //annyang.addCommands(this.commands);
        annyang.debug(false);
        annyang.start({ autoRestart:true, continuous: true });
    };
    this.abort = function () {
        annyang.abort();
    };
    this.setLanguage = function (codigoLenguage) {
        annyang.setLanguage(codigoLenguage); // 'es-ES' -> spanish
    };
    this.isListening = function () {
        return annyang.isListening();
    };
    this.toggle = function () {
        if(annyang.isListening()) {
            this.abort();
            //console.log('Reconocimiento de voz desactivado');
        } else {
            this.start();
            //console.log('Reconocimiento de voz activado');
        }
    };

    // EVENTOS ---------------------------------------------------------------------------------------------------------

    annyang.addCallback('start', function () {
        $rootScope.statusMessage = 'Esperando comandos de voz...';
        notifications.showError({
            // No es error, es notificacion informativa de color rojo en la parte superior
            message: '<i class="ion-android-microphone animated fadeIn infinite"></i><a href="#"> Detener Voz </a>'
        });
        $rootScope.$apply();
    });
    annyang.addCallback('errorNetwork', function () {
        annyang.abort();
        notifications.closeAll();
        ngDialog.open({ template: '<h3>Error</h3> Fallo de red / sin conexión datos',
            className: 'ngdialog-theme-plain', disableAnimation:false, plain: true });
    });
    annyang.addCallback('errorPermissionBlocked', function () {
        notifications.closeAll();
        $rootScope.statusMessage = 'Permiso para acceder al microfono bloqueado';
        $rootScope.$apply();
    });
    annyang.addCallback('errorPermissionDenied', function () {
        notifications.closeAll();
        $rootScope.statusMessage = 'Permiso para usar microfono denegado';
        $rootScope.$apply();
    });
    annyang.addCallback('end', function () {
        $rootScope.statusMessage = 'Reconocimiento de voz desactivado';
        $rootScope.$apply();
        notifications.closeAll();
    });
    annyang.addCallback('resultMatch', function (usuarioDijo, textoComando, frasesPosibles) {
        SintesisVoz.hablarTexto(usuarioDijo);
        $rootScope.statusMessage = usuarioDijo;
        $rootScope.$apply();
    });
    annyang.addCallback('resultNoMatch', function (res) {
        $rootScope.statusMessage = res[0]+'<div style="color:red">Comando no reconocido</div>';
        $rootScope.$apply();
    });
});
// =====================================================================================================================
SpeechApp.controller('ReconocimientoVozCtrl', function ($rootScope, $scope, ReconocimientoVoz, SintesisVoz, ngDialog) {

    // INICIALIZACIONES ------------------------------------------------------------------------------------------------

    if(!annyang || !'speechSynthesis' in window || !'SpeechRecognition' in window){
        alert('El navegador no soporta reconocimiento o sintesis de voz. Probar con Chrome');
        return;
    }
    ReconocimientoVoz.setLanguage('es-ES');
    $rootScope.statusMessage = 'Reconocimiento de voz desactivado';
    $rootScope.cerrarPagina = function () {
        document.getElementById('btnCerrar').click();
    };
    $rootScope.toggle = function () {
        ReconocimientoVoz.toggle();
    };
    $scope.ayuda = function () {
        ngDialog.open({ template: 'ayuda', className: 'ngdialog-theme-plain', disableAnimation:false });
    };

    $scope.isListening = function () {
        return ReconocimientoVoz.isListening();
    };

    // COMANDOS --------------------------------------------------------------------------------------------------------

    ReconocimientoVoz.addCommand('detener voz', function () {
        console.log('desactivar voz');
        ReconocimientoVoz.abort();
    });
    ReconocimientoVoz.addCommand('cerrar', function () {
        if(ngDialog.getOpenDialogs().length > 0){
            ngDialog.closeAll();
        } else {
            $scope.cerrarPagina();
        }
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
        $scope.ayuda();
    });

    //ReconocimientoVoz.addCommand('*allSpeech', function(allSpeech) {
    //    console.debug(allSpeech);
    //    vm.addResult(allSpeech);
    //});

});
// =====================================================================================================================
SpeechApp.service('SintesisVoz', function () {

    // Deteccion de sintetizador de voz
    var configuracionVoz = null;
    if(window.speechSynthesis) {
        configuracionVoz = new SpeechSynthesisUtterance();
    } else {
        alert('El navegador no soporta síntesis de voz');
        return;
    }
    this.getVoices = function() {
        return speechSynthesis.getVoices();
    };
    this.hablarTexto = function(texto, config) {

        var voices = this.getVoices();

        // Configura voz. Si no hay valores escogidos, usar valores por defecto
        configuracionVoz.voice = config && config.voiceIndex ? voices[config.voiceIndex] : voices[0];
        configuracionVoz.volume = config && config.volume ? config.volume : 1;
        configuracionVoz.rate = config && config.rate ? config.rate : 1;
        configuracionVoz.pitch = config && config.pitch ? config.pitch : 1;
        configuracionVoz.text = texto;

        if (window.cordova) {
            // sintesis de voz cuando estamos en dispositivo android
            TTS.speak({
                    text: texto,
                    locale: 'es-ES',
                    rate: configuracionVoz.rate,
                    pitch: configuracionVoz.pitch
                }, function () {
                    console.log('Síntesis de voz correcta')
                },
                function (reason) {
                    alert('Error: sintetizador de voz no disponible')
                });
        } else {
            // sintesis de voz cuando estamos en navegador
            speechSynthesis.speak(configuracionVoz);
        }
    };
    this.cancel = function() {
        if (window.cordova){
            TTS.speak({text:''}); // android
        } else {
            speechSynthesis.cancel(); // navegador
        }
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
    //configuracionVoz.onerror = function () {
    //    console.error('Error en la síntesis de voz')
    //}
});
// =====================================================================================================================
SpeechApp.controller('SintesisVozCtrl', function ($scope, SintesisVoz, $timeout) {

    if(!window.cordova){
        // Deja tiempo para cargar las voces
        $timeout(function () {
            $scope.voices = SintesisVoz.getVoices();
        }, 100);
    }

    $scope.pitch = 1;
    $scope.rate = 1;
    $scope.volume = 1;
    $scope.msg = 'Prueba de síntesis de voz';
    $scope.isAndroid = window.cordova != null;

    $scope.onClickBtnHablar = function () {
        if($scope.optionSelected){
            var voiceIdx = $scope.voices.indexOf($scope.optionSelected);
        } else
            voiceIdx = 0;
        var config = {
            voiceIndex: voiceIdx,
            rate: $scope.rate,
            pitch: $scope.pitch,
            volume: $scope.volume
        };
        SintesisVoz.hablarTexto($scope.msg, config);
    };

    $scope.CancelarHablar = function () {
        SintesisVoz.cancel();
    }

});
// =====================================================================================================================
SpeechApp.filter('filtroHtml', ['$sce', function($sce) {
    return function(value, type) {
        return $sce.trustAs(type || 'html', value);
    }
}]);
// =====================================================================================================================
