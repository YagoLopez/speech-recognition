angular.element(document).ready(function () {
    // android
    if (window.cordova) {
        document.addEventListener('deviceready', function () {
            // Antes de arrancar angular hay que esperar a que se cargue la api de cordova
            console.log('Cordova device ready');
            // Una vez cargada la api de cordova, arrancaqr angular manualmente
            angular.bootstrap(document.body, ['app-reconocimiento-voz']);
        }, false);
    // navegador
    } else {
        console.log('Cordova no disponible => ejecucion desde navegador');
        angular.bootstrap(document.body, ['app-reconocimiento-voz']);
    }
});
