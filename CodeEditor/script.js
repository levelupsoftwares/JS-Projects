const HtmlElm = s => document.querySelector(s);
const HtmlAllElm = s => Array.from(document.querySelectorAll(s));
const out = HtmlElm('#output');
const STORAGE_KEY =  "Live CodeLab";

const escapeHtml = s =>
     String(s).replace(/[&<>"]/g , replaceWith =>(
        {
            '&':'&amp',
            '<':'&lt',
            '>':'&gt',
            '"':'&quot',
        }[replaceWith]
     )) ;

function log(msg,type="info"){
  const color = type ==='error'?'var(--err)':type === 'warn' ? 'var(--warn)':'var(--brand)';

  const time = new Date().toLocaleTimeString();

  const line = document.createElement('div');
  line.innerHTML = `<span style="color:${color}">[${time}]</span> ${escapeHtml(msg)}`;
  out.appendChild(line);
  out.scrollTop = out.scrolHeight;
}

function clearOut(){
    out.innerHTML="";
}

HtmlElm('#clearLogs')?.addEventListener('click', clearOut);

function makeEditor(id, mode){
  const ed = ace.edit(id, {
    theme:"ace/theme/dracula",
    mode,
    tabsize:2,
    useSoftTabs:true,
    showPrintMargin:false,
    wrap:true
  });

  ed.session.setUserWrapMode(true);

  ed.commands.addCommand({
    name:'run',
    bindKey:{
        win:'Cntrl + Enter',
        mac:'Command + Enter'
    },
    exec(){runWeb(false)}
  });

  ed.commands.addCommand({
    name:'save',
    bindKey:{
        win:'Cntrl + S',
        mac:'Command + S'
    },
    exec(){saveProject()}
  });

  return ed;
}

const ed_html = makeEditor('ed_html','ace/mode/html');
const ed_css = makeEditor('ed_css','ace/mode/css');
const ed_js = makeEditor('ed_js','ace/mode/javaScript') ;

const TAB_ORDER = ['html','css','js'];

const wraps = Object.fromEntries($$('#webEditors .editor-wrap').map(w => [w.dataset.pane, w]));

const editors = {
  html:ed_html,
  css:ed_css,
  js:ed_js
};

function activePane(){
  const t = HtmlElm('#webTabs .tab.active');
  return t ? t.dataset.pane:'html';
}

function showPane(name){
  TAB_ORDER.forEach( i => {
    if (wraps[i]){
      wraps[i].hidden =(i !== name)
    }
  });

  HtmlAllElm('#webTabs .tab').forEach( j  => {
    const on = j.dataset.pane === name;
    j.classList.toggle('active' , on);
    j.setAttribute('aria-selected' , on);
    j.tabIndex = on ? 0 : -1;
  });

  requestAnimationFrame(()=>{
    const ed = editors[name];
    if(ed && ed.resize){
      ed.resize(true);
      ed.focus();
    }
  })
}

HtmlElm('#webTabs')?.addEventListener('click',(e)=>{
  const btn = e.target.closest('.tab');
  if(!btn){
    return ;
  }
  showPane(btn.dataset.pane)
})

HtmlElm('#webTabs')?.addEventListener('keydown',(e)=>{
  const index = TAB_ORDER.indexOf(activePane());
  if(e.key === 'ArrowLeft' || e.key === 'ArrowRight'){
    const delta = e.key === 'ArrowLeft' ? -1 : 1;
    showPane(TAB_ORDER[(index + delta + TAB_ORDER.length) % TAB_ORDER.length])
  }
})
showPane('html');

function buildwebSrcdoc(withTests = false){
  const html = ed_html.getValue();
  const css = ed_css.getValue();
  const js = ed_js.getValue();

  const tests = (HtmlElm('#testArea')?.value || '').trim();

  return `
     <!DOCTYPE html>
    <html lang="en" dir='ltr'>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <style>
      ${css}\n
    </style>
  </head>

  <body>
    ${html}

    <script >
       try{
          ${js}

          ${withTests && tests ? `\n/*tests */\n ${tests}`: ''}
       }
          catch (e){
          console.error(e)
          }
    <\/script>
  
  </html>
  `; 
}

function runWeb(withTests = false){
  preview.srcdoc = buildwebSrcdoc(withTests);
  log(withTests ? "Run with tests" : "Web preview updated.")
}
HtmlElm( "#runWeb")?.addEventListener('click',()=>runWeb(false));
HtmlElm('#runTests')?.addEventListener('click', ()=>runWeb(true));
HtmlElm('#openPreview')?.addEventListener('click',()=>{
  const src = buildwebSrcdoc(false);
  const w = window.open('about:blank');
  w.document.open();
  w.document.write(src);
  w.document.close();
});

function projectJSON(){
  return {
    version: 1,
    kind:'web-only',
    assignment:HtmlElm("#assignment")?.value || "",
    test:HtmlElm('#testArea')?.value || "",
    html:ed_html.getValue(),
    css:ed_css.getValue(),
    js:ed_js.getValue(),

  }
}

function loadProject(){
  try{
    if(HtmlElm('#assignment')){
      HtmlElm('#assignment').value = obj.assignment || "";
    }
    if(HtmlElm('#testArea')){
      HtmlElm('testArea').value = obj.test || "";
    }
    ed_html.setValue(obj.html || "" ,-1);
    ed_css.setValue(obj.css || "" , -1);
    ed_js.setValue(obj.js || "" , -1);

    log("web project loaded.")
  }catch(e){
  log("Unable to load project: " + e , "error")
  }
}

function setDeafultContent(){
  ed_html.setValue(`<h1>Welcome to Live_code</h1>
    <p>This is the demo code to execute in the browser</p>
    <button>Try me</button>`);
  ed_css.setValue(`h1{color:red}`);
  ed_js.setValue(`console.log("hello browser")`)
}

function saveProject(){
  try{
    const data = JSON.stringify(projectJSON(),null,2);
    localStorage.setItem(STORAGE_KEY , data);
    const blob = new Blob([data] , {type:"application/json"});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "today-code.json";
    a.click();
    log('Saved Localy and downloaded JSON file ');
  }catch(e){
    log("Unable to save: "+ e + "error");
  }
}
HtmlElm('#saveBtn')?.addEventListener("click",saveProject());
HtmlElm('#loadBtn')?.addEventListener("click",()=>{HtmlElm('#openFile').click()});
HtmlElm('#openFile')?.addEventListener('change',async(e)=>{   
    const f = e.target.files ?.[0];
    if(f){
      return ;
    }
    try {
      const obj = JSON.parse(await f.text());
      loadProject();
    }catch(err){
      log("invalid project file" , err)
    }
});
 try{
  const cache  = localStorage.getItem(STORAGE_KEY);
  if(cache){
    loadProject(JSON.parse(cache));
  }else{
    setDeafultContent()
  }
 }catch{
   setDeafultContent();
 }

 log("Ready - web with html/css/js");
