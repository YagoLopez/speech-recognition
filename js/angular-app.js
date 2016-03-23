var SpeechApp = angular.module('app-reconocimiento-voz', ['ngDialog', 'ngNotificationsBar', 'ngSanitize']);

SpeechApp.config(function ($compileProvider, notificationsConfigProvider) {

    $compileProvider.debugInfoEnabled(true);
    notificationsConfigProvider.setAutoHide(false);
    notificationsConfigProvider.setAcceptHTML(true);
});
// =====================================================================================================================
SpeechApp.service('ReconocimientoVoz', function ($rootScope, notifications, SintesisVoz, ngDialog) {

    this.commands = {};

    this.addCommand = function(phrase, callback) {
        var command = {};
        command[phrase] = function(args) {
            $rootScope.$apply(callback(args));
        };
        // Extiende lista comandos por voz
        angular.extend(this.commands, command);

        // Añade comandos al motor reconocedor de voz
        annyang.addCommands(this.commands);
    };
    this.start = function() {
        annyang.addCommands(this.commands);
        annyang.debug(false);
        annyang.start();
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
            annyang.abort();
            console.log('Reconocimiento de voz desactivado');
        } else {
            annyang.start();
            console.log('Reconocimiento de voz activado');
        }
    };

    // EVENTOS ---------------------------------------------------------------------------------------------------------

    annyang.addCallback('start', function () {
        $rootScope.statusMessage = 'Esperando comandos de voz...';
        notifications.showError({
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
        $rootScope.statusMessage = 'Permiso para acceder al microfono bloqueado';
        $rootScope.$apply();
    });
    annyang.addCallback('errorPermissionDenied', function () {
        $rootScope.statusMessage = 'Permiso para usar microfono denegado';
        $rootScope.$apply();
    });
    annyang.addCallback('end', function () {
        $rootScope.statusMessage = 'Reconocimiento de voz desactivado';
        $rootScope.$apply();
        notifications.closeAll();
    });
    annyang.addCallback('resultMatch', function (usuarioDijo, textoComando, frases) {
        var config = {voiceIndex: 0, rate: 1, pitch: 1, volume: 1};
        SintesisVoz.hablarTexto(usuarioDijo, config);
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
    //$scope.annyang = annyang;
    $rootScope.statusMessage = 'Reconocimiento de voz desactivado';
    //$scope.isListening = ReconocimientoVoz.isListening;
    //$rootScope.toggle = ReconocimientoVoz.toggle;
    $scope.ayuda = function () {
        ngDialog.open({ template: 'ayuda', className: 'ngdialog-theme-plain', disableAnimation:false });
    };
    $scope.cerrarPagina = function () {
        document.getElementById('btnCerrar').click();
    };

    // COMANDOS --------------------------------------------------------------------------------------------------------

    ReconocimientoVoz.addCommand('detener voz', function () {
        console.log('desactivar voz');
        ReconocimientoVoz.abort();
    });
    ReconocimientoVoz.addCommand('cerrar', function () {
        $scope.cerrarPagina();
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
    //ReconocimientoVoz.addCommand('cerrar ayuda', function () {
    //    ngDialog.close();
    //});
    //ReconocimientoVoz.addCommand('buscar', function (termino) {
    //    window.location.href = 'http://www.google.es?q=' + termino
    //});
    //ReconocimientoVoz.addCommand('*allSpeech', function(allSpeech) {
    //    console.debug(allSpeech);
    //    vm.addResult(allSpeech);
    //});

    // EVENTOS ---------------------------------------------------------------------------------------------------------
    //annyang.addCallback('start', function () {
    //    $rootScope.statusMessage = 'Esperando comandos de voz...';
    //    notifications.showError({
    //        message: '<i class="ion-android-microphone animated fadeIn infinite"></i><a href="#"> Detener Voz </a>'
    //    });
    //    $scope.$apply();
    //});
/*    annyang.addCallback('errorNetwork', function () {
        $rootScope.statusMessage = 'Fallo de red/Sin conexion de datos';
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
        $scope.$apply();
        notifications.closeAll();
    });
    annyang.addCallback('resultMatch', function (userSaid, commandText, phrases) {
        var config = {voiceIndex: 0, rate: 1, pitch: 1, volume: 1};
        SintesisVoz.hablarTexto(userSaid, config);
        $rootScope.statusMessage = userSaid;
        $scope.$apply();
    });
    annyang.addCallback('resultNoMatch', function (res) {
        //SintesisVoz.hablarTexto('Comando no reconocido');
        $rootScope.statusMessage = res[0]+'<div style="color:red">Comando no reconocido</div>';
        $scope.$apply();
    });*/

    // FIN EVENTOS -----------------------------------------------------------------------------------------------------

    // Necesario en rootScope para poder controlar el reconocimento de voz en toda la app
    $rootScope.ReconocimientoVoz = ReconocimientoVoz;

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
        return window.speechSynthesis.getVoices();
    };
    this.hablarTexto = function(texto, config) {
        var voices = this.getVoices();

        // Configura voz. Si no hay valores escogidos, usar valores por defecto
        configuracionVoz.voice = config && config.voiceIndex ? voices[config.voiceIndex] : voices[0];
        configuracionVoz.volume = config && config.volume ? config.volume : 1;
        configuracionVoz.rate = config && config.rate ? config.rate : 1;
        configuracionVoz.pitch = config && config.pitch ? config.pitch : 1;
        configuracionVoz.text = texto;
        speechSynthesis.speak(configuracionVoz);
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
    //configuracionVoz.onerror = function () {
    //    console.error('Error en la síntesis de voz')
    //}
});
// =====================================================================================================================
SpeechApp.controller('SintesisVozCtrl', function ($scope, $timeout, SintesisVoz) {

    // Deja tiempo para cargar los idiomas
    $timeout(function () {
        $scope.voices = SintesisVoz.getVoices();
    }, 500);

    $scope.pitch = 1;
    $scope.rate = 1;
    $scope.volume = 1;
    $scope.msg = 'La paradoja de Epiménides dice lo siguiente: "Esta frase es falsa".\n\n' +
        'Si la frase es verdadera se contradice a sí misma.\n\n' +
        'Por el contrario, si la frase es falsa, entonces su enunciado es verdadero, ' +
        'lo que también implica contradicción';


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

    $scope.SintesisVoz = SintesisVoz;

});
// =====================================================================================================================
SpeechApp.filter('filtroHtml', ['$sce', function($sce) {
    return function(value, type) {
        return $sce.trustAs(type || 'html', value);
    }
}]);
// =====================================================================================================================
