/* une los trozos del .zip (Cloudflare Pages: máx. 25 MiB por archivo), verifica el SHA-256 y descarga el archivo entero */
(function(){
  var info=null;
  fetch("lanzador/lanzador.json?t="+Date.now()).then(function(r){return r.json()}).then(function(j){info=j.files});
  function hex(b){return Array.prototype.map.call(new Uint8Array(b),function(x){return("0"+x.toString(16)).slice(-2)}).join("")}
  document.querySelectorAll("button[data-f]").forEach(function(btn){
    btn.addEventListener("click",function(){
      var f=btn.getAttribute("data-f"),card=btn.parentNode,pg=card.querySelector("progress"),st=card.querySelector(".st");
      if(!info||!info[f]){st.textContent="Todavía no se cargó la información; probá de nuevo en un segundo.";return}
      var it=info[f],got=0,bufs=[];btn.disabled=true;pg.style.display="block";pg.max=it.size;pg.value=0;st.textContent="Descargando…";
      var step=function(i){
        if(i>=it.parts){
          var all=new Blob(bufs,{type:"application/zip"});
          all.arrayBuffer().then(function(ab){return crypto.subtle?crypto.subtle.digest("SHA-256",ab):null}).then(function(h){
            if(h&&hex(h)!==it.sha256){st.textContent="La descarga llegó dañada. Probá de nuevo.";btn.disabled=false;return}
            var a=document.createElement("a");a.href=URL.createObjectURL(all);a.download=f;document.body.appendChild(a);a.click();
            setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},30000);
            st.textContent="Listo: "+f+" ("+(it.size/1048576).toFixed(1)+" MB).";btn.disabled=false});
          return}
        fetch("lanzador/"+f+".part"+i+"?v="+it.sha256.slice(0,12)).then(function(r){if(!r.ok)throw new Error("HTTP "+r.status);return r.arrayBuffer()})
          .then(function(b){bufs.push(b);got+=b.byteLength;pg.value=got;step(i+1)})
          .catch(function(e){st.textContent="Error al descargar ("+e.message+"). Probá de nuevo.";btn.disabled=false});
      };step(0);
    });
  });
})();
