# Speech Demo

![Reconocimiento y síntesis de voz para smartphone](./images/88.jpg 'Reconocimiento y síntesis de voz para smartphone')

<b style='color:blue'>Demostración de reconocimiento y síntesis de voz para aplicaciones móviles</b>
<br/>
<br/>
<p>Aunque la tecnología "<i>HTML5 Web Speech API</i>" 
    es un <a href='https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html' target='_blank_'>estandar W3C</a>, 
    debido a su reciente aparición,
    sólo algunos navegadores como Chrome o FireFox en sus últimas versiones la incorporan. 
    Usando dicha tecnología, esta demostración
    permite interactuar con un programa de distintas maneras: <b>ejecutando comandos por voz</b>
    o <b>convirtiendo texto a voz mediante habla sintética</b></p>
    
<p style='text-align:center'><span style='color:red'><b>Nota:</b> Esta es una tecnología experimental. Los navegadores  Microsoft IE, Edge,
    Ópera y Safari no son compatibles con esta aplicación por no  implementar el estándar</span></p>
    
<p style='text-align:center'><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API#Browser_compatibility" target="_blank">
    Consultar compatibilidad entre navegadores
</a> &rarr;</p>

<p>La demostración está dividida en tres secciones o pantallas:</p>

<ol class="font-size-14">
    <li class="pad-botm5"><b>Pantalla de instrucciones</b></li>
    <li class="pad-botm5"><b>Ejecución de comandos por voz:</b> Desde esta pantalla se puede activar/desactivar el reconocimiento de voz</li>
    <li class="pad-botm5"><b>Síntesis de voz:</b> Desde esta pantalla se puede activar/desactivar la síntesis de viz</li>
</ol>

<p>Se puede acceder a cada sección navegando con las flechas por las distintas pantallas hasta llegar
    a la sección elegida o mediante comandos de voz</p>
    
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

<br/>
<div style='text-align:center'><a href='./iframe/iframe.html' target='_blank_'><b>VER ONLINE VERSION PARA WEB</b></a> &rarr;</div>

<h1>Auditoría</h1>

<h3>Gráfico de carga:</h3>

- Descomposción de los datos de la aplicación según el tipo de fichero y cantidad de datos
- Número de peticiones HTTP realizadas usando chaché y sin usarla

Este gráfico permite visualizar cuántos datos se movilizan antes y después de usar la memoria caché, y ver cómo se agrupan según los tipos de ficheros.

La primera vez que se carge la aplicación en memoria sin utilzar la cache será necesario movilizar 793 K. Las siguientes  veces que se cargue la aplicación usando la caché, será necesario movilizar solamente 21.5 K.

![Gráfico de carga](./auditoria/audit.jpg 'Gráfico de carga')

<br/>
<a href='#'>Volver al principio</a> &uarr;

