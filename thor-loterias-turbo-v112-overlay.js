(function(){
  var src='./THOR_TURBO_V112_RASTREADOR_COMPACTO.html?v=thor-v392';
  var layer,frame,opened=false,loading=false;
  function ensure(){
    if(layer)return;
    layer=document.createElement('div');
    layer.id='thorTurboLayer';
    layer.style.cssText='position:fixed;inset:0;z-index:2147483000;background:#000;visibility:hidden;pointer-events:none';
    frame=document.createElement('iframe');
    frame.title='Loterias Turbo';
    frame.setAttribute('allow','fullscreen');
    frame.style.cssText='display:block;width:100%;height:100%;border:0;background:#000';
    layer.appendChild(frame);
    document.body.appendChild(layer);
  }
  function load(){
    ensure();
    if(!frame.src){loading=true;frame.src=src;frame.addEventListener('load',function(){loading=false},{once:true});}
  }
  function openTurbo(){
    ensure();
    if(!frame.src)load();
    if(opened)return;
    opened=true;
    layer.style.visibility='visible';
    layer.style.pointerEvents='auto';
    try{history.pushState({thorTurboOverlay:true},'',location.href)}catch(e){}
  }
  window.thorAbrirLoteriasTurbo=openTurbo;
  window.addEventListener('popstate',function(){
    if(!opened)return;
    opened=false;
    layer.style.visibility='hidden';
    layer.style.pointerEvents='none';
  });
  function warm(){if(!frame||!frame.src)load();}
  if('requestIdleCallback' in window)requestIdleCallback(warm,{timeout:1800});
  else setTimeout(warm,1200);
})();