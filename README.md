# Speech Demo

![Reconocimiento y síntesis de voz para smartphone](./images/88.jpg 'Reconocimiento y síntesis de voz para smartphone')

<b style='color:blue'>Demostración de reconocimiento y síntesis de voz para web y móvil</b>
<br/>
<br/>
<p>La tecnología "<i>HTML5 Web Speech API</i>" 
    es una <a href='https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html' target='_blank_'>propuesta del
     W3C</a> relativamente reciente y por lo tanto sólo algunos navegadores como Chrome o FireFox la incorporan en sus últimas versiones. 
    Usando dicha tecnología, esta demostración
    permite interactuar con un programa de distintas maneras: <b>ejecutando comandos por voz</b>
    o <b>convirtiendo texto a voz mediante habla sintética</b></p>
    
            NOTA: Esta es una tecnología experimental. Los navegadores Microsoft IE, Edge, Ópera y Safari
                  no son compatibles con esta aplicación.
  
<p><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API#Browser_compatibility" target="_blank">
    Consultar compatibilidad entre navegadores
</a> &rarr;</p>
<br/>

<p>La demostración está dividida en tres secciones o pantallas:</p>

<ol class="font-size-14">
    <li class="pad-botm5"><b>Pantalla de instrucciones</b></li>
    <li class="pad-botm5"><b>Ejecución de comandos por voz:</b> Desde esta pantalla se puede activar/desactivar el reconocimiento de voz</li>
    <li class="pad-botm5"><b>Síntesis de voz:</b> Desde esta pantalla se puede activar/desactivar la síntesis de voz</li>
</ol>

<p>Se puede acceder a cada pantalla  usando las flechas de la parte inferior hasta llegar
    a la sección elegida. También es posible la navegación entre pantallas usando comandos de voz</p>
    
<h3>Instrucciones</h3>
<ul class="font-size-14 pad-left-15">
<li class="pad-botm5">Conceder permiso a la aplicación para que
    acceda al hardware del micrófono siempre que se solicite</li>
<li class="pad-botm5">Durante el reconocimiento de voz, hablar a pocos centímetros del micrófono</li>
<li class="pad-botm5">Situarse en un entorno silencioso</li>
<li class="pad-botm5">Utilizar un tono claro y normal</li>
<li class="pad-botm5">Navegador compatible requerido</li>
<li class="pad-botm5">En caso de usar móvil sólo se garantiza el funcionamiento en
    Android por las cuestiones de compatibilidad antes mencionadas
</li>
</ul>

<a href='https://yagolopez.js.org/speech-recognition/' target='_blank_'>
<b>DEMO FULLSCREEN FOR MOBILE</b></a> &rarr;<br>
<a href='http://mobiletest.me/htc_one_emulator/?u=https://yagolopez.github.io/speech-recognition' target='_blank_'>
<b>DEMO FOR DESKTOP</b></a> &rarr;

<h1>Auditoría</h1>

<h3>Gráfico de carga:</h3>

- Descomposción de los datos de la aplicación según el tipo de fichero y cantidad de datos
- Número de peticiones HTTP realizadas usando caché y sin usarla

Este gráfico permite visualizar cuántos datos se movilizan antes y después de usar la memoria caché, y ver las agrupaciones de ficheros por tipo.

La primera vez que se carge la aplicación en memoria sin utilzar la cache será necesario movilizar 793 K. Las siguientes  veces que se cargue la aplicación usando la caché, será necesario movilizar solamente 21.5 K.

Esto se aplica a la versión web. En la app compilada para instalar en el móvil hay que añadir el <a href='https://crosswalk-project.org/documentation/about.html' target='_blank'>Runtime WebView de Chromium.</a>

![Gráfico de carga](./auditoria/audit.jpg 'Gráfico de carga')

<a href='#'>Volver al principio</a> &uarr;

