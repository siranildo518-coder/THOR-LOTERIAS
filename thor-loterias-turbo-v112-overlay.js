(function(){
  var src='./THOR_TURBO_V112_RASTREADOR_COMPACTO.html?v=thor-v394';
  var layer,frame,notice,opened=false,loaded=false;
  function ensure(){
    if(layer)return;
    layer=document.createElement('div');
    layer.id='thorTurboLayer';
    layer.style.cssText='position:fixed;inset:0;z-index:2147483000;visibility:hidden;pointer-events:none;background:rgba(3,10,20,.28)';
    frame=document.createElement('iframe');
    frame.title='Loterias Turbo';
    frame.setAttribute('allow','fullscreen');
    frame.style.cssText='display:none;width:100%;height:100%;border:0;background:transparent';
    notice=document.createElement('div');
    notice.setAttribute('role','status');
    notice.style.cssText='position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);padding:16px 22px;border:1px solid rgba(255,255,255,.5);border-radius:14px;background:linear-gradient(145deg,#163b61,#071426);color:#fff;font:700 16px Arial,sans-serif;box-shadow:0 8px 28px rgba(0,0,0,.4);text-align:center;white-space:nowrap';
    notice.textContent='Abrindo Loterias Turbo…';
    layer.appendChild(frame);
    layer.appendChild(notice);
    document.body.appendChild(layer);
    frame.addEventListener('load',function(){
      loaded=true;
      if(opened){
        notice.style.display='none';
        frame.style.display='block';
        layer.style.background='transparent';
      }
    });
  }
  function load(){
    ensure();
    if(!frame.src)frame.src=src;
  }
  function openTurbo(){
    ensure();
    if(opened)return;
    opened=true;
    layer.style.visibility='visible';
    layer.style.pointerEvents='auto';
    if(loaded){
      notice.style.display='none';
      frame.style.display='block';
      layer.style.background='transparent';
    }else{
      frame.style.display='none';
      notice.style.display='block';
      layer.style.background='rgba(3,10,20,.28)';
      load();
    }
    try{history.pushState({thorTurboOverlay:true},'',location.href)}catch(e){}
  }
  window.thorAbrirLoteriasTurbo=openTurbo;
  window.addEventListener('popstate',function(){
    if(!opened)return;
    opened=false;
    layer.style.visibility='hidden';
    layer.style.pointerEvents='none';
  });
  function warm(){load();}
  setTimeout(warm,100);
})();