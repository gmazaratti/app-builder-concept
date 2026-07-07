"use client";

import { useMemo, useEffect } from "react";
import type { GeneratedFile } from "@/lib/types";

// Runs the generated React Native app for real, inside a sandboxed iframe:
// the generated files are transpiled in-browser with Babel and executed against
// react-native-web (loaded from a CDN), so the phone shows the actual app —
// real text, colors, and layout — instead of a static mock.

const REACT_VER = "18.2.0";
const RNW_VER = "0.19.13";

// Classic script: a tiny CommonJS module system + Babel transpile + RNW render.
const BOOT = `
function __norm(p){
  var parts=[], segs=String(p).replace(/\\\\/g,'/').split('/');
  for(var i=0;i<segs.length;i++){var s=segs[i]; if(!s||s==='.')continue; if(s==='..')parts.pop(); else parts.push(s);}
  return parts.join('/');
}
function __report(ok,message){ try{ parent.postMessage({source:'live-preview', ok:ok, message:message||''}, '*'); }catch(e){} }
function __showError(msg){
  var r=document.getElementById('root'); if(r) r.style.display='none';
  var e=document.getElementById('error'); e.style.display='block'; e.textContent="Couldn't run this preview:\\n\\n"+msg;
  __report(false, msg);
}
window.__showError=__showError;
window.__runApp=function(libs){
  try{
    var files=window.__FILES||[];
    var fileMap={};
    for(var i=0;i<files.length;i++){ fileMap[__norm(files[i].path)]=files[i].contents; }
    var cache={};
    function dirname(p){var i=p.lastIndexOf('/');return i<0?'':p.slice(0,i);}
    function tryExts(base){
      var b=__norm(base);
      var c=[b,b+'.tsx',b+'.ts',b+'.jsx',b+'.js',b+'/index.tsx',b+'/index.ts',b+'/index.jsx',b+'/index.js'];
      for(var i=0;i<c.length;i++){ if(fileMap.hasOwnProperty(c[i])) return c[i]; }
      return null;
    }
    function req(from, spec){
      if(spec==='react') return libs.react;
      if(spec==='react/jsx-runtime'||spec==='react/jsx-dev-runtime') return libs.jsx;
      if(spec==='react-dom'||spec==='react-dom/client') return libs.reactDom;
      if(spec==='react-native'||spec==='react-native-web') return libs.rnw;
      if(spec==='expo-status-bar') return { __esModule:true, StatusBar:function(){return null;} };
      if(spec.indexOf('expo')===0||spec.indexOf('@expo')===0) return { __esModule:true };
      if(spec.charAt(0)==='.'){
        var r=tryExts((dirname(from)?dirname(from)+'/':'')+spec);
        if(!r) throw new Error("Cannot resolve '"+spec+"' imported from '"+from+"'");
        return load(r);
      }
      return { __esModule:true };
    }
    function load(path){
      if(cache[path]) return cache[path].exports;
      var out=Babel.transform(fileMap[path],{
        filename:path,
        presets:[
          ['env',{modules:'commonjs',targets:{esmodules:true}}],
          ['react',{runtime:'automatic',development:false}],
          ['typescript',{isTSX:true,allExtensions:true}]
        ]
      }).code;
      var module={exports:{}};
      cache[path]=module;
      var fn=new Function('require','module','exports', out);
      fn(function(s){return req(path,s);}, module, module.exports);
      return module.exports;
    }
    var entry=tryExts('App')||tryExts('src/App')||tryExts('index')||tryExts('src/index');
    if(!entry && fileMap['package.json']){ try{ var mn=JSON.parse(fileMap['package.json']).main; if(mn) entry=tryExts(mn); }catch(e){} }
    if(!entry) throw new Error('No App entry file (App.tsx / App.js) found.');
    var mod=load(entry);
    var App=mod.default||mod.App;
    if(!App) throw new Error('The entry file has no default-exported component.');
    var AppRegistry=libs.rnw.AppRegistry;
    AppRegistry.registerComponent('__PreviewApp__', function(){ return App; });
    AppRegistry.runApplication('__PreviewApp__', { rootTag: document.getElementById('root') });
    __report(true);
  }catch(e){ __showError((e&&e.stack)||String(e)); }
};
`;

// Module script: load React + react-native-web from a CDN (pinned to one React
// so hooks work), then hand them to the boot script.
const LOADER = `
import * as ReactNS from 'https://esm.sh/react@${REACT_VER}';
import * as JsxRuntime from 'https://esm.sh/react@${REACT_VER}/jsx-runtime';
import * as ReactDOMNS from 'https://esm.sh/react-dom@${REACT_VER}/client';
import * as RNWNS from 'https://esm.sh/react-native-web@${RNW_VER}?deps=react@${REACT_VER},react-dom@${REACT_VER}';
try {
  var React = ReactNS.default || ReactNS;
  var wrap = function(ns, def){ return Object.assign({ __esModule:true, default: def || ns.default || ns }, ns); };
  window.__runApp({
    react: wrap(ReactNS, React),
    jsx: wrap(JsxRuntime),
    reactDom: wrap(ReactDOMNS),
    rnw: wrap(RNWNS)
  });
} catch (e) { window.__showError((e && e.stack) || String(e)); }
`;

function buildDoc(files: GeneratedFile[]): string {
  // Escape "<" so file contents can't break out of the inline <script>.
  const filesJson = JSON.stringify(files).replace(/</g, "\\u003c");
  return (
    "<!doctype html><html><head><meta charset='utf-8'/>" +
    "<style>html,body,#root{height:100%;margin:0;padding:0;}" +
    "body{background:#fff;font-family:-apple-system,system-ui,sans-serif;}" +
    "#error{padding:16px;color:#b42318;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap;display:none;}</style>" +
    "</head><body><div id='root'></div><div id='error'></div>" +
    "<script>window.__FILES=" + filesJson + ";</script>" +
    "<script src='https://unpkg.com/@babel/standalone@7/babel.min.js'></script>" +
    "<script>" + BOOT + "</script>" +
    "<script type='module'>" + LOADER + "</script>" +
    "</body></html>"
  );
}

export default function LivePreview({ files }: { files: GeneratedFile[] }) {
  const doc = useMemo(() => buildDoc(files), [files]);
  // Change the key when files change so the iframe fully reloads the new app.
  const key = useMemo(
    () => String(files.reduce((n, f) => n + f.path.length + f.contents.length, 0)),
    [files]
  );

  // Surface the iframe's success/error to the parent (useful for debugging).
  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.data && e.data.source === "live-preview") {
        (window as unknown as { __livePreviewLast?: unknown }).__livePreviewLast = e.data;
      }
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  return (
    <iframe
      key={key}
      title="App preview"
      srcDoc={doc}
      sandbox="allow-scripts"
      className="h-full w-full border-0 bg-surface"
    />
  );
}
