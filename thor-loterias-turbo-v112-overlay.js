(function(){
  var src='./THOR_TURBO_V112_RASTREADOR_COMPACTO.html?v=thor-v395';
  var layer,frame,opened=false,loaded=false;
  function ensure(){
    if(layer)return;
    layer=document.createElement('div');
    layer.id='thorTurboLayer';
    layer.style.cssText='position:fixed;inset:0;z-index:2147483000;visibility:hidden;pointer-events:none;background:transparent';
    frame=document.createElement('iframe');
    frame.title='Loterias Turbo';
    frame.setAttribute('allow','fullscreen');
    frame.style.cssText='display:block;width:100%;height:100%;border:0;background:transparent';
    layer.appendChild(frame);
    document.body.appendChild(layer);
    frame.addEventListener('load',function(){
      loaded=true;
      if(opened)show();
    });
  }
  function show(){
    if(!layer)return;
    layer.style.visibility='visible';
    layer.style.pointerEvents='auto';
  }
  function load(){
    ensure();
    if(!frame.src)frame.src=src;
  }
  function openTurbo(){
    ensure();
    if(opened)return;
    opened=true;
    try{history.pushState({thorTurboOverlay:true},'',location.href)}catch(e){}
    if(loaded)show();
  }
  window.thorAbrirLoteriasTurbo=openTurbo;
  window.addEventListener('popstate',function(){
    if(!opened)return;
    opened=false;
    layer.style.visibility='hidden';
    layer.style.pointerEvents='none';
  });
  function warm(){load();}
  setTimeout(warm,0);
})();