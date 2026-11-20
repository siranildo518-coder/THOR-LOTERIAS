(function(){
'use strict';
var layer=null,frame=null,opened=false;
function installFrameHistory(w){
  try{
    var h=w.history,nativeReplace=h.replaceState.bind(h);
    var entries=[{state:h.state,url:w.location.href}],index=0;
    function apply(entry){nativeReplace(entry.state,'',entry.url);w.dispatchEvent(new w.PopStateEvent('popstate',{state:entry.state}));}
    h.pushState=function(state,title,url){
      entries=entries.slice(0,index+1);
      entries.push({state:state,url:url==null?w.location.href:new URL(url,w.location.href).href});
      index++;
      return nativeReplace(state,title,url==null?w.location.href:url);
    };
    h.replaceState=function(state,title,url){
      entries[index]={state:state,url:url==null?w.location.href:new URL(url,w.location.href).href};
      return nativeReplace(state,title,url==null?w.location.href:url);
    };
    h.go=function(delta){
      var target=Math.max(0,Math.min(entries.length-1,index+(Number(delta)||0)));
      if(target===index)return;
      index=target;apply(entries[index]);
    };
    h.back=function(){h.go(-1)};
    h.forward=function(){h.go(1)};
  }catch(_){}
}
function close(){
  if(!opened)return;
  opened=false;
  if(layer)layer.remove();
  layer=null;frame=null;
}
function open(){
  if(opened)return;
  opened=true;
  layer=document.createElement('section');
  layer.id='thorLoteriasTurboTela';
  layer.setAttribute('aria-label','Loterias Turbo');
  layer.style.cssText='position:fixed;inset:0;z-index:2147483647;background:#fff0bf;margin:0;padding:0;border:0;width:100vw;height:100vh;height:100dvh;max-width:none;overflow:hidden';
  frame=document.createElement('iframe');
  frame.title='Loterias Turbo';
  frame.setAttribute('allow','clipboard-read; clipboard-write');
  frame.style.cssText='display:block;width:100%;height:100%;border:0;margin:0;padding:0;background:#fff0bf';
  frame.addEventListener('load',function(){try{installFrameHistory(frame.contentWindow)}catch(_){}});
  layer.appendChild(frame);
  document.body.appendChild(layer);
  try{history.pushState(Object.assign({},history.state||{},{thorLoteriasTurbo:true}),'',location.href)}catch(_){}
  frame.src='./THOR_TURBO_V112_RASTREADOR_COMPACTO.html?v=thor-v390';
}
window.thorAbrirLoteriasTurbo=open;
window.addEventListener('popstate',function(event){
  if(!opened)return;
  event.preventDefault();
  event.stopImmediatePropagation();
  close();
},true);
})();