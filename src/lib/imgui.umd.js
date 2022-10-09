(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
      (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ImGui = {}));
}(this, (function (exports) { 'use strict';

  /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

  function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }

  function getAugmentedNamespace(n) {
    if (n.__esModule) return n;
    var a = Object.defineProperty({}, '__esModule', {value: true});
    Object.keys(n).forEach(function (k) {
      var d = Object.getOwnPropertyDescriptor(n, k);
      Object.defineProperty(a, k, d.get ? d : {
        enumerable: true,
        get: function () {
          return n[k];
        }
      });
    });
    return a;
  }

  function createCommonjsModule(fn) {
    var module = { exports: {} };
    return fn(module, module.exports), module.exports;
  }

  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.

  // resolves . and .. elements in a path array with directory names there
  // must be no slashes, empty elements, or device names (c:\) in the array
  // (so also no leading and trailing slashes - it does not distinguish
  // relative and absolute paths)
  function normalizeArray(parts, allowAboveRoot) {
    // if the path tries to go above the root, `up` ends up > 0
    var up = 0;
    for (var i = parts.length - 1; i >= 0; i--) {
      var last = parts[i];
      if (last === '.') {
        parts.splice(i, 1);
      } else if (last === '..') {
        parts.splice(i, 1);
        up++;
      } else if (up) {
        parts.splice(i, 1);
        up--;
      }
    }

    // if the path is allowed to go above the root, restore leading ..s
    if (allowAboveRoot) {
      for (; up--; up) {
        parts.unshift('..');
      }
    }

    return parts;
  }

  // Split a filename into [root, dir, basename, ext], unix version
  // 'root' is just a slash, or nothing.
  var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
  var splitPath = function(filename) {
    return splitPathRe.exec(filename).slice(1);
  };

  // path.resolve([from ...], to)
  // posix version
  function resolve() {
    var resolvedPath = '',
      resolvedAbsolute = false;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path = (i >= 0) ? arguments[i] : '/';

      // Skip empty and invalid entries
      if (typeof path !== 'string') {
        throw new TypeError('Arguments to path.resolve must be strings');
      } else if (!path) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charAt(0) === '/';
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
      return !!p;
    }), !resolvedAbsolute).join('/');

    return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
  }
  // path.normalize(path)
  // posix version
  function normalize(path) {
    var isPathAbsolute = isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

    // Normalize the path
    path = normalizeArray(filter(path.split('/'), function(p) {
      return !!p;
    }), !isPathAbsolute).join('/');

    if (!path && !isPathAbsolute) {
      path = '.';
    }
    if (path && trailingSlash) {
      path += '/';
    }

    return (isPathAbsolute ? '/' : '') + path;
  }
  // posix version
  function isAbsolute(path) {
    return path.charAt(0) === '/';
  }

  // posix version
  function join() {
    var paths = Array.prototype.slice.call(arguments, 0);
    return normalize(filter(paths, function(p, index) {
      if (typeof p !== 'string') {
        throw new TypeError('Arguments to path.join must be strings');
      }
      return p;
    }).join('/'));
  }


  // path.relative(from, to)
  // posix version
  function relative(from, to) {
    from = resolve(from).substr(1);
    to = resolve(to).substr(1);

    function trim(arr) {
      var start = 0;
      for (; start < arr.length; start++) {
        if (arr[start] !== '') break;
      }

      var end = arr.length - 1;
      for (; end >= 0; end--) {
        if (arr[end] !== '') break;
      }

      if (start > end) return [];
      return arr.slice(start, end - start + 1);
    }

    var fromParts = trim(from.split('/'));
    var toParts = trim(to.split('/'));

    var length = Math.min(fromParts.length, toParts.length);
    var samePartsLength = length;
    for (var i = 0; i < length; i++) {
      if (fromParts[i] !== toParts[i]) {
        samePartsLength = i;
        break;
      }
    }

    var outputParts = [];
    for (var i = samePartsLength; i < fromParts.length; i++) {
      outputParts.push('..');
    }

    outputParts = outputParts.concat(toParts.slice(samePartsLength));

    return outputParts.join('/');
  }

  var sep = '/';
  var delimiter = ':';

  function dirname(path) {
    var result = splitPath(path),
      root = result[0],
      dir = result[1];

    if (!root && !dir) {
      // No dirname whatsoever
      return '.';
    }

    if (dir) {
      // It has a dirname, strip trailing slash
      dir = dir.substr(0, dir.length - 1);
    }

    return root + dir;
  }

  function basename(path, ext) {
    var f = splitPath(path)[2];
    // TODO: make this comparison case-insensitive on windows?
    if (ext && f.substr(-1 * ext.length) === ext) {
      f = f.substr(0, f.length - ext.length);
    }
    return f;
  }


  function extname(path) {
    return splitPath(path)[3];
  }
  var path = {
    extname: extname,
    basename: basename,
    dirname: dirname,
    sep: sep,
    delimiter: delimiter,
    relative: relative,
    join: join,
    isAbsolute: isAbsolute,
    normalize: normalize,
    resolve: resolve
  };
  function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
      if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
  }

  // String.prototype.substr - negative index don't work in IE8
  var substr = 'ab'.substr(-1) === 'b' ?
    function (str, start, len) { return str.substr(start, len) } :
    function (str, start, len) {
      if (start < 0) start = str.length + start;
      return str.substr(start, len);
    }
  ;

  var path$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    resolve: resolve,
    normalize: normalize,
    isAbsolute: isAbsolute,
    join: join,
    relative: relative,
    sep: sep,
    delimiter: delimiter,
    dirname: dirname,
    basename: basename,
    extname: extname,
    'default': path
  });

  var empty = {};

  var empty$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': empty
  });

  var require$$0 = /*@__PURE__*/getAugmentedNamespace(path$1);

  var require$$1 = /*@__PURE__*/getAugmentedNamespace(empty$1);

  var bindImgui = createCommonjsModule(function (module, exports) {
    var Module = (function() {
      var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
      if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
      return (
        function(Module) {
          Module = Module || {};

          var Module=typeof Module!=="undefined"?Module:{};var readyPromiseResolve,readyPromiseReject;Module["ready"]=new Promise(function(resolve,reject){readyPromiseResolve=resolve;readyPromiseReject=reject;});var moduleOverrides={};var key;for(key in Module){if(Module.hasOwnProperty(key)){moduleOverrides[key]=Module[key];}}var ENVIRONMENT_IS_WEB=typeof window==="object";var ENVIRONMENT_IS_WORKER=typeof importScripts==="function";var ENVIRONMENT_IS_NODE=typeof process==="object"&&typeof process.versions==="object"&&typeof process.versions.node==="string";var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var read_,readAsync,readBinary;var nodeFS;var nodePath;if(ENVIRONMENT_IS_NODE){if(ENVIRONMENT_IS_WORKER){scriptDirectory=require$$0.dirname(scriptDirectory)+"/";}else {scriptDirectory=__dirname+"/";}read_=function shell_read(filename,binary){var ret=tryParseAsDataURI(filename);if(ret){return binary?ret:ret.toString()}if(!nodeFS)nodeFS=require$$1;if(!nodePath)nodePath=require$$0;filename=nodePath["normalize"](filename);return nodeFS["readFileSync"](filename,binary?null:"utf8")};readBinary=function readBinary(filename){var ret=read_(filename,true);if(!ret.buffer){ret=new Uint8Array(ret);}assert(ret.buffer);return ret};readAsync=function readAsync(filename,onload,onerror){var ret=tryParseAsDataURI(filename);if(ret){onload(ret);}if(!nodeFS)nodeFS=require$$1;if(!nodePath)nodePath=require$$0;filename=nodePath["normalize"](filename);nodeFS["readFile"](filename,function(err,data){if(err)onerror(err);else onload(data.buffer);});};if(process["argv"].length>1){process["argv"][1].replace(/\\/g,"/");}process["argv"].slice(2);process["on"]("uncaughtException",function(ex){if(!(ex instanceof ExitStatus)){throw ex}});process["on"]("unhandledRejection",abort);Module["inspect"]=function(){return "[Emscripten Module object]"};}else if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WORKER){scriptDirectory=self.location.href;}else if(typeof document!=="undefined"&&document.currentScript){scriptDirectory=document.currentScript.src;}if(_scriptDir){scriptDirectory=_scriptDir;}if(scriptDirectory.indexOf("blob:")!==0){scriptDirectory=scriptDirectory.substr(0,scriptDirectory.lastIndexOf("/")+1);}else {scriptDirectory="";}{read_=function(url){try{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText}catch(err){var data=tryParseAsDataURI(url);if(data){return intArrayToString(data)}throw err}};if(ENVIRONMENT_IS_WORKER){readBinary=function(url){try{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)}catch(err){var data=tryParseAsDataURI(url);if(data){return data}throw err}};}readAsync=function(url,onload,onerror){var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=function(){if(xhr.status==200||xhr.status==0&&xhr.response){onload(xhr.response);return}var data=tryParseAsDataURI(url);if(data){onload(data.buffer);return}onerror();};xhr.onerror=onerror;xhr.send(null);};}}else;var out=Module["print"]||console.log.bind(console);var err=Module["printErr"]||console.warn.bind(console);for(key in moduleOverrides){if(moduleOverrides.hasOwnProperty(key)){Module[key]=moduleOverrides[key];}}moduleOverrides=null;if(Module["arguments"]);if(Module["thisProgram"]);if(Module["quit"]);var wasmBinary;if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];Module["noExitRuntime"]||true;if(typeof WebAssembly!=="object"){abort("no native wasm support detected");}var wasmMemory;var ABORT=false;function assert(condition,text){if(!condition){abort("Assertion failed: "+text);}}var UTF8Decoder=typeof TextDecoder!=="undefined"?new TextDecoder("utf8"):undefined;function UTF8ArrayToString(heap,idx,maxBytesToRead){var endIdx=idx+maxBytesToRead;var endPtr=idx;while(heap[endPtr]&&!(endPtr>=endIdx))++endPtr;if(endPtr-idx>16&&heap.subarray&&UTF8Decoder){return UTF8Decoder.decode(heap.subarray(idx,endPtr))}else {var str="";while(idx<endPtr){var u0=heap[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=heap[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=heap[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2;}else {u0=(u0&7)<<18|u1<<12|u2<<6|heap[idx++]&63;}if(u0<65536){str+=String.fromCharCode(u0);}else {var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023);}}}return str}function UTF8ToString(ptr,maxBytesToRead){return ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):""}function stringToUTF8Array(str,heap,outIdx,maxBytesToWrite){if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343){var u1=str.charCodeAt(++i);u=65536+((u&1023)<<10)|u1&1023;}if(u<=127){if(outIdx>=endIdx)break;heap[outIdx++]=u;}else if(u<=2047){if(outIdx+1>=endIdx)break;heap[outIdx++]=192|u>>6;heap[outIdx++]=128|u&63;}else if(u<=65535){if(outIdx+2>=endIdx)break;heap[outIdx++]=224|u>>12;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63;}else {if(outIdx+3>=endIdx)break;heap[outIdx++]=240|u>>18;heap[outIdx++]=128|u>>12&63;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63;}}heap[outIdx]=0;return outIdx-startIdx}function stringToUTF8(str,outPtr,maxBytesToWrite){return stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite)}function lengthBytesUTF8(str){var len=0;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343)u=65536+((u&1023)<<10)|str.charCodeAt(++i)&1023;if(u<=127)++len;else if(u<=2047)len+=2;else if(u<=65535)len+=3;else len+=4;}return len}var UTF16Decoder=typeof TextDecoder!=="undefined"?new TextDecoder("utf-16le"):undefined;function UTF16ToString(ptr,maxBytesToRead){var endPtr=ptr;var idx=endPtr>>1;var maxIdx=idx+maxBytesToRead/2;while(!(idx>=maxIdx)&&HEAPU16[idx])++idx;endPtr=idx<<1;if(endPtr-ptr>32&&UTF16Decoder){return UTF16Decoder.decode(HEAPU8.subarray(ptr,endPtr))}else {var str="";for(var i=0;!(i>=maxBytesToRead/2);++i){var codeUnit=HEAP16[ptr+i*2>>1];if(codeUnit==0)break;str+=String.fromCharCode(codeUnit);}return str}}function stringToUTF16(str,outPtr,maxBytesToWrite){if(maxBytesToWrite===undefined){maxBytesToWrite=2147483647;}if(maxBytesToWrite<2)return 0;maxBytesToWrite-=2;var startPtr=outPtr;var numCharsToWrite=maxBytesToWrite<str.length*2?maxBytesToWrite/2:str.length;for(var i=0;i<numCharsToWrite;++i){var codeUnit=str.charCodeAt(i);HEAP16[outPtr>>1]=codeUnit;outPtr+=2;}HEAP16[outPtr>>1]=0;return outPtr-startPtr}function lengthBytesUTF16(str){return str.length*2}function UTF32ToString(ptr,maxBytesToRead){var i=0;var str="";while(!(i>=maxBytesToRead/4)){var utf32=HEAP32[ptr+i*4>>2];if(utf32==0)break;++i;if(utf32>=65536){var ch=utf32-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023);}else {str+=String.fromCharCode(utf32);}}return str}function stringToUTF32(str,outPtr,maxBytesToWrite){if(maxBytesToWrite===undefined){maxBytesToWrite=2147483647;}if(maxBytesToWrite<4)return 0;var startPtr=outPtr;var endPtr=startPtr+maxBytesToWrite-4;for(var i=0;i<str.length;++i){var codeUnit=str.charCodeAt(i);if(codeUnit>=55296&&codeUnit<=57343){var trailSurrogate=str.charCodeAt(++i);codeUnit=65536+((codeUnit&1023)<<10)|trailSurrogate&1023;}HEAP32[outPtr>>2]=codeUnit;outPtr+=4;if(outPtr+4>endPtr)break}HEAP32[outPtr>>2]=0;return outPtr-startPtr}function lengthBytesUTF32(str){var len=0;for(var i=0;i<str.length;++i){var codeUnit=str.charCodeAt(i);if(codeUnit>=55296&&codeUnit<=57343)++i;len+=4;}return len}var buffer,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;function updateGlobalBufferAndViews(buf){buffer=buf;Module["HEAP8"]=HEAP8=new Int8Array(buf);Module["HEAP16"]=HEAP16=new Int16Array(buf);Module["HEAP32"]=HEAP32=new Int32Array(buf);Module["HEAPU8"]=HEAPU8=new Uint8Array(buf);Module["HEAPU16"]=HEAPU16=new Uint16Array(buf);Module["HEAPU32"]=HEAPU32=new Uint32Array(buf);Module["HEAPF32"]=HEAPF32=new Float32Array(buf);Module["HEAPF64"]=HEAPF64=new Float64Array(buf);}Module["INITIAL_MEMORY"]||16777216;var wasmTable;var __ATPRERUN__=[];var __ATINIT__=[];var __ATPOSTRUN__=[];function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift());}}callRuntimeCallbacks(__ATPRERUN__);}function initRuntime(){callRuntimeCallbacks(__ATINIT__);}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift());}}callRuntimeCallbacks(__ATPOSTRUN__);}function addOnPreRun(cb){__ATPRERUN__.unshift(cb);}function addOnInit(cb){__ATINIT__.unshift(cb);}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb);}var runDependencies=0;var dependenciesFulfilled=null;function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies);}}function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies);}if(runDependencies==0){if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback();}}}Module["preloadedImages"]={};Module["preloadedAudios"]={};function abort(what){if(Module["onAbort"]){Module["onAbort"](what);}what+="";err(what);ABORT=true;what="abort("+what+"). Build with -s ASSERTIONS=1 for more info.";var e=new WebAssembly.RuntimeError(what);readyPromiseReject(e);throw e}var dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(filename){return filename.startsWith(dataURIPrefix)}function isFileURI(filename){return filename.startsWith("file://")}var wasmBinaryFile;wasmBinaryFile="data:application/octet-stream;base64,AGFzbQEAAAABiQqWAWACf38AYAF/AGABfwF/YAJ/fwF/YAN/f38AYAN/f38Bf2AEf39/fwBgAABgBH9/f38Bf2AAAX9gB39/f39/f38Bf2AFf39/f38AYAZ/f39/f38Bf2AGf39/f39/AGAFf39/f38Bf2ACf38BfWACf30AYAh/f39/f39/fwF/YAABfWABfwF9YAF9AGAHf39/f39/fwBgAX0BfWADf399AGAFf39/f30AYAV/fn5+fgBgBX9/fX9/AGAEf39/fQBgBn9/f39/fQBgBX9/f31/AGADf35/AX5gCX9/f39/f39/fwF/YAp/f39/f39/f39/AGAIf39/f39/f38AYAJ9fQBgBn19fX9/fwBgA399fQBgAn99AX1gBH9/fX8AYAN/fX0Bf2ACfX0BfWACf30Bf2AGf39/f31/AGAGf399f399AGAIf39/fX9/f38Bf2ADf399AX9gBH99f38AYAd/f39/f399AGAHf39/f31/fQBgBH9+fn8AYAV/f399fQBgBn9/fX19fwBgBH9/fX0AYAh/f319fX9/fwBgA39/fwF9YAF/AXxgBn9/fX9/fwBgBn9/f31/fwBgB39/f39/fX8AYAh/f39/f399fwBgCX9/f39/f399fwBgC39/f39/f39/f39/AGAJf39/f39/f39/AGAFf319fX0Bf2ADfX19AX1gAXwBfWABfAF/YAJ8fwF8YAZ9fX1/fX0BfWAGf31/f39/AX9gBn98f39/fwF/YAN+fn4BfmAKf39/f39/f39/fwF/YAZ/f399f38Bf2AEfX19fQF9YAh/f31/f399fwBgAAF8YAR/fX99AX9gBX9/f399AX9gA399fwBgBn9/fHx/fwF/YAN9f38AYA1/f39/f39/f39/f39/AGADf39/AXxgA39/fABgAXwBfGAHf319fX19fQBgB39/f319fX0AYAJ/fgBgCX9/f399f39/fwF/YAJ/fABgAnx8AXxgCX9/fX9/f399fwBgBH5+fn4Bf2ACf34BfmAEfX19fQF/YAJ+fwF/YAZ8fHx/fX0BfWAFf39/f30BfWAGf39/f319AX1gB39/fX9/f38Bf2ACf3wBfGAGfXx8f319AXxgBX5+fn99AX1gBn5+fn99fQF9YAV9f39/fQF/YAZ9f39/fX0Bf2AIf39/f31/fX8AYAh/f319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xwHGAeIGiQTFAaQK6QGjCuEC4AK8CqIKoQqmCe0LgwSgCusBxQHgBp8K/gSeCusBnQrHAcYBvgK9AogF/QbNA+4E7AvEA4MEnArrAccBxgHeBokExQGbCpoK6wGZCscBxgHhAuAC6QSYCusBxwHGAcUBlwqWCpUKlAqTCsUBkgqRCscBxgGQCtEFqAOPCqcDjgqNCowKiwqKCokKiAqHCoYKhQqECoMKggqBCoAK/wn+Cf0J/An7CfoJ+Qn4CfcJ9gn1CfQJ8wnyCfEJ8AnvCe4J7QnsCesJ6gnvArcB0QrpCegJ5wnmCeUJ5AnpAbwGxAPpAaEJ6wvqC+kL6AvnC+YL5QugCeQLnwnjC+EL4AvfC94L3QvcC9sL2gu6BtkL2AufCaAJvAbXC7kG1gumCbwG1Qu6BuMJ4gnhCeEC4ALHAcYBxQH+BNYG1QbPCuAJ6QHEA+kB3wnrAcUB3gndCb4CvQLcCesBxQHbCekB2gnhAuACxwHGAb4CvQLZCdgJ1wnHAcYB1gnVCdQJ0wnSCb4CvQLRCcUB0AnpAc8J4gaJBN4GiQTaDscBxgHCBcEF2Q7YDssKkAT1A9cO1g7VDtQO6QHEA+kEuQbUC4ME0wvSC9EL0AvTDtIO0Q7QDqUE2wfaB9wHzgrPDs4OzQ7MDssOyg7JDsgOxw7GDsUO4QLgAscBxgHFAcQO6QHDDtUGwg7BDqEJzgvEA4MEgwTFAekBwA6/DscBxgHFAb4OvgK9Ar0O6QG8DrsOug65DrgOtw62DrUO4QLgArQOsw6yDrEOsA6vDq4OrQ6sDqsOqg6pDqgOpw6mDqUOpA6jDqIOoQ6gDp8Ong6dDpwOmw6fC5oOmQ6AC5gOlw6WDpUOlA7NC5cJzAuXCcsLygu5BroGyQvEA+kEkw7rAb4CvQLFAeAG/gTWBscBxgGSDpEOkA6PDo4OjQ6MDosOig7hAuACiQ6IDocO0ArpBMgL7gTHC4UOhA6DDoIOgQ6ADv8NgQuvCP0K/g3DCf0Nwwn8DcIJwgnSCvsN+g35DfgN9w3yAfYNrwPoCukK7ArlBfUN9A3zDesK6gryDfEN8A3vDecK5gr9Be4N7Q3sDesN5QrqDekN6A3nDeYN5Q3kDeMN3grdCtwK2grZCtsKiwjWCpII2ArXCuINmQjhDcQB4A27ApgIlwjtCpcI7QPhAcECnAHnBeYF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AS0AAzoAAyABQQRqIQEgAkEEaiICIARNDQALCyACIANJBEADQCACIAEtAAA6AAAgAUEBaiEBIAJBAWoiAiADRw0ACwsgAAsZAQF/QZDdAygCACgC7DQiAEEBOgCMASAACxIAIABB1JYDNgIAIABBBGoQNwsWACAAKAIQEFQEf0EABSAAQQRqEDALC1kBA38gACICQdSWAzYCACMAQRBrIgMkACACQQRqIgRCADcCACAEQQA2AgggA0EQaiQAIAIgATYCECABEFRFBEAgAiACKAIAKAIAEQEACyAAQbyVAzYCACAACxgAIAAgASkCADcCACAAIAIpAgA3AgggAAsmAQF/IwBBEGsiASQAIAEgADYCDCABQQxqEC0hACABQRBqJAAgAAsMACAAIAEgACABXRsLNwEBfAJ9Q///f38gABCABSIBRAAAAOD//+9HZg0AGkP//3//IAFEAAAA4P//78dlDQAaIAG2CwsRAEEAIABBBGogACgCCBBUGwsgAQF/IAAoAggiAQRAIABCADcCACABEEggAEEANgIICwsSACAAQQA2AgggAEIANwIAIAALFAEBfyAAKAIIIgEEQCABEEgLIAAL8gICAn8BfgJAIAJFDQAgACACaiIDQQFrIAE6AAAgACABOgAAIAJBA0kNACADQQJrIAE6AAAgACABOgABIANBA2sgAToAACAAIAE6AAIgAkEHSQ0AIANBBGsgAToAACAAIAE6AAMgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBBGsgATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQQhrIAE2AgAgAkEMayABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2AgwgAkEQayABNgIAIAJBFGsgATYCACACQRhrIAE2AgAgAkEcayABNgIAIAQgA0EEcUEYciIEayICQSBJDQAgAa1CgYCAgBB+IQUgAyAEaiEBA0AgASAFNwMYIAEgBTcDECABIAU3AwggASAFNwMAIAFBIGohASACQSBrIgJBH0sNAAsLIAALMwEBfyMAQRBrIgMkACAAIAEoAgAgA0EIaiACEJoBIgAoAgAQCxBeGiAAECwgA0EQaiQACzoBAX8CQCAARQ0AQZDdAygCACIBRQ0A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AkL///////8/gyILQiCIIREgDUIRiCESIARCMIinQf//AXEhBwJAAn8gAkIwiKdB//8BcSIJQQFrQf3/AU0EQEEAIAdBAWtB/v8BSQ0BGgsgAVAgAkL///////////8AgyIOQoCAgICAgMD//wBUIA5CgICAgICAwP//AFEbRQRAIAJCgICAgICAIIQhCgwCCyADUCAEQv///////////wCDIgJCgICAgICAwP//AFQgAkKAgICAgIDA//8AURtFBEAgBEKAgICAgIAghCEKIAMhAQwCCyABIA5CgICAgICAwP//AIWEUARAIAIgA4RQBEBCgICAgICA4P//ACEKQgAhAQwDCyAKQoCAgICAgMD//wCEIQpCACEBDAILIAMgAkKAgICAgIDA//8AhYRQBEAgASAOhCECQgAhASACUARAQoCAgICAgOD//wAhCgwDCyAKQoCAgICAgMD//wCEIQoMAgsgASAOhFAEQEIAIQEMAgsgAiADhFAEQEIAIQEMAgsgDkL///////8/WARAIAVB0ABqIAEgCyABIAsgC1AiBht5IAZBBnStfKciBkEPaxCTASAFKQNYIgtCIIYgBSkDUCIBQiCIhCEPIAtCIIghEUEQIAZrIQYLIAYgAkL///////8/Vg0AGiAFQUBrIAMgDSADIA0gDVAiCBt5IAhBBnStfKciCEEPaxCTASAFKQNIIgJCD4YgBSkDQCIDQjGIhCEQIAJCL4YgA0IRiIQhDCACQhGIIRIgBiAIa0EQagshBiAMQv////8PgyICIAFC/////w+DIgF+IhMgA0IPhkKAgP7/D4MiAyAPQv////8PgyIOfnwiBEIghiINIAEgA358IgwgDVStIAIgDn4iFSADIAtC/////w+DIgt+fCIUIBBC/////w+DIg0gAX58IhAgBCATVK1CIIYgBEIgiIR8IhMgAiALfiIWIAMgEUKAgASEIg9+fCIDIA0gDn58IhEgASASQv////8Hg0KAgICACIQiAX58IhJCIIZ8Ihd8IQQgByAJaiAGakH//wBrIQYCQCALIA1+IhggAiAPfnwiAiAYVK0gAiACIAEgDn58IgJWrXwgAiACIBQgFVStIBAgFFStfHwiAlatfCABIA9+fCABIAt+IgsgDSAPfnwiASALVK1CIIYgAUIgiIR8IAIgAUIghnwiASACVK18IAEg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IgJFDQAgASgCCCIDRQ0AIAFB4ABqIQAgAyACQQFrQShsaiICKAIcRQRAIAIgACkCADcCACACIAApAhA3AhAgAiAAKQIINwIIDwsgAiAAQRgQ0gFFDQELIAEQ7wILCw0AIAAoAgggAUEYbGoLUgEDf0GQ3QMoAgAiACgCxDcgACgC7DQiAUYEQEGQ3QMoAgAiAkECNgLIOSACIAE2AsQ5CyABLQALQQFxBEAgAEEBOgCeNAsQ8gEgAEEAOgCeNAvYCQIEfwR+IwBB8ABrIgUkACAEQv///////////wCDIQoCQAJAIAFCAX0iC0J/USACQv///////////wCDIgkgASALVq18QgF9IgtC////////v///AFYgC0L///////+///8AURtFBEAgA0IBfSILQn9SIAogAyALVq18QgF9IgtC////////v///AFQgC0L///////+///8AURsNAQsgAVAgCUKAgICAgIDA//8AVCAJQoCAgICAgMD//wBRG0UEQCACQoCAgICAgCCEIQQgASEDDAILIANQIApCgICAgICAwP//AFQgCkKAgICAgIDA//8AURtFBEAgBEKAgICAgIAghCEEDAILIAEgCUKAgICAgIDA//8AhYRQBEBCgICAgICA4P//ACACIAEgA4UgAiAEhUKAgICAgICAgIB/hYRQIgYbIQRCACABIAYbIQMMAgsgAyAKQoCAgICAgMD//wCFhFANASABIAmEUARAIAMgCoRCAFINAiABIAODIQMgAiAEgyEEDAILIAMgCoRQRQ0AIAEhAyACIQQMAQsgAyABIAEgA1QgCSAKVCAJIApRGyIHGyEKIAQgAiAHGyILQv///////z+DIQkgAiAEIAcbIgJCMIinQf//AXEhCCALQjCIp0H//wFxIgZFBEAgBUHgAGogCiAJIAogCSAJUCIGG3kgBkEGdK18pyIGQQ9rEJMBIAUpA2ghCSAFKQNgIQpBECAGayEGCyABIAMgBxshAyACQv///////z+DIQQgCEUEQCAFQdAAaiADIAQgAyAEIARQIgcbeSAHQQZ0rXynIgdBD2sQkwFBECAHayEIIAUpA1ghBCAFKQNQIQMLIARCA4YgA0I9iIRCgICAgICAgASEIQQgCUIDhiAKQj2IhCEJIAIgC4UhDAJ+IANCA4YiASAGIAhrIgdFDQAaIAdB/wBLBEBCACEEQgEMAQsgBUFAayABIARBgAEgB2sQkwEgBUEwaiABIAQgBxCCAyAFKQM4IQQgBSkDMCAFKQNAIAUpA0iEQgBSrYQLIQIgCUKAgICAgICABIQhCSAKQgOGIQMCQCAMQn9XBEAgAyACfSIBIAkgBH0gAiADVq19IgSEUARAQgAhA0IAIQQMAwsgBEL/////////A1YNASAFQSBqIAEgBCABIAQgBFAiBxt5IAdBBnStfKdBDGsiBxCTASAGIAdrIQYgBSkDKCEEIAUpAyAhAQwBCyACIAN8IgEgAlStIAQgCXx8IgRCgICAgICAgAiDUA0AIAFCAYMgBEI/hiABQgGIhIQhASAGQQFqIQYgBEIBiCEECyALQoCAgICAgICAgH+DIQIgBkH//wFOBEAgAkKAgICAgIDA//8AhCEEQgAhAwwBC0EAIQcCQCAGQQBKBEAgBiEHDAELIAVBEGogASAEIAZB/wBqEJMBIAUgASAEQQEgBmsQggMgBSkDACAFKQMQIAUpAxiEQgBSrYQhASAFKQMIIQQLIAGnQQdxIgZBBEutIARCPYYgAUIDiIQiAXwiAyABVK0gBEIDiEL///////8/gyAHrUIwhoQgAoR8IQQCQCAGQQRGBEAgBCADQgGDIgEgA3wiAyABVK18IQQMAQsgBkUNAQsLIAAgAzcDACAAIAQ3AwggBUHwAGokAAsSACAAQcCXAzYCACAAEIwJIAALJwEBfyMAQRBrIgIkACAAQQJBtPsCQaj1AkH9BSABEAEgAkEQaiQAC3oBAn9BkN0DKAIAIgQoAuw0IQUCQCADBEAgASACEJkBIQIMAQsgAg0AIAEQbSABaiECCwJAIAEgAkYNACAFKAKIBSAEKAKsMiAEKgKwMiAAQQBDAACAPxA2IAEgAkMAAAAAQQAQxgIgBC0AhF5FDQAgACABIAIQggILC3MBBH8jAEEgayIDJABBkN0DKAIAIQQgA0EIahDfBiICIAA2AgAgAiAEIABBBHRqIgBB3CtqIgUpAgA3AgQgAiAAQeQraiIAKQIANwIMIARB5DZqIAIQ3QYgACABKQIINwIAIAUgASkCADcCACADQSBqJAAL6QEBAn0CQCAEIAZbDQAgAioCGCIIIARdDQAgAioCFCIHIAZeDQACQCAEIAddRQRAIAQhBwwBCyAFIAOTIAcgBJOUIAYgBJOVIAOSIQMLAkAgBiAIXkUEQCAGIQgMAQsgCCAGkyAFIAOTlCAGIAeTlSAFkiEFCwJ9IAMgAbIiBF9FIAQgBWBFckUEQCAIIAeTIAIqAhCUDAELIAFBAWqyIgYgA19BACAFIAZgGw0BIAMgBJMgBSAEk5JDAAAAv5RDAACAP5IgCCAHkyACKgIQlJQLIQQgACABQQJ0aiIAIAAqAgAgBJI4AgALCwwAIAEgACAAIAFIGwvDAQECfwJAIAAoAiggAmpBgIAESQ0AIAAtACRBCHFFDQAgACAAKAIYNgJ0IAAiA0EANgIoAkAgACgCCCAAKAIAQQFrQShsaiIEKAIcBEAgAxDvAgwBCyAEIAMoAnQ2AhQLCyAAKAIIIAAoAgBBKGxqQQxrIgMgAygCACABajYCACAAQRhqIAIgACgCGCIDahDUBSAAIAAoAiAgA0EUbGo2AjQgAEEMaiABIAAoAgwiAmoQzgEgACAAKAIUIAJBAXRqNgI4C+0BAQN/IAJBf3MhAwJAIAEEQCADIQIDQCAAIgRBAWohAAJAIAQtAAAiBUEjRyABQQFrIgFBAklyDQAgAC0AAEEjRw0AIAMgAiAELQACQSNGGyECCyACQf8BcSAFc0ECdEHAkQFqKAIAIAJBCHZzIQIgAQ0ACwwBCyAALQAAIgFFBEAgAyECDAELIAMhAgNAIAFB/wFxIgRBI0cgAC0AASIBQSNHckUEQCADIAIgAC0AAkEjRhshAkEjIQELIABBAWohACACQf8BcSAEc0ECdEHAkQFqKAIAIAJBCHZzIQIgAUH/AXENAAsLIAJBf3MLogQCCX8BfSMAQSBrIgEkACABQQhqQZDdAygCACIDKALsNCIAQeQBaiICIANBoDdqIggQsQQiBEEEaiIFEIACIAFBEGogBSABQQhqED4hBSAAIAQpAgQ3AswBIAFBCGogBEEMaiACEIACIAIgASkDCDcCACAAIAQoAhQ2AowCIAAgBCgCGDYClAIgACAEKQIcNwL0ASAAIAQqAiQiCTgChAIgAy0AhF4EQCADQf///3s2ApxeCwJAIAQtAC1FDQAgACAAKgKIAiAJEC84AoQCIAFBCGogBRDiASABQQhqQwAAgL8QeSAFQQBBABBZGgJAAkACQAJAAkACQCADKAKkNSIHIAQoAihHBEAgAygCqDUgB0YgB0EAR3EhAiAELQAsDQMgAy0A4DUhBSACRQ0BIAVBAEchBgwECyAELQAsDQQgAy0A4DUNAQwECyAFRQ0DCyAAIAMoAtw1NgKYAkEBIQYMAgsgAkUNAQsgACAHNgKYAiAAIAEpAxg3AqgCIAAgASkDEDcCoAIgAEGcAmoiBSgCACECIAMtALU1BEAgACACQSRyNgKcAiAGRQ0DIAJBBHIhAgwCCyAAIAJBIHI2ApwCIAZFDQIMAQsgACABKQMQNwKgAiAAIAEpAxg3AqgCIABBnAJqIgUgACgCnAIiAkEgcjYCACAGRQ0BCyADKAKkNSADKALcNUYNACAFIAJB4AByNgIACyAIEIkBIAFBIGokAAsfACABIAAoAgRKBEAgACAAIAEQZRDHAwsgACABNgIAC38CAn8BfiMAQRBrIgMkACAAAn4gAUUEQEIADAELIAMgASABQR91IgJqIAJzIgKtQgAgAmciAkHRAGoQkwEgAykDCEKAgICAgIDAAIVBnoABIAJrrUIwhnwgAUGAgICAeHGtQiCGhCEEIAMpAwALNwMAIAAgBDcDCCADQRBqJAALDQAgACgCCCABQQR0agsQACAAKAIEIAAoAgBrQQF1CxIAIABBhJUDNgIAIAAQkQkgAAsfACABIAAoAgRKBEAgACAAIAEQZRDmAgsgACABNgIACwkAIABBADYCAAvCAQIDfwF9IwBBIGsiBSQAQZDdAygCACIHKALsNCIGKAKIBSAAIAEgAiAEQQ8QawJAIANFDQAgB0HcKmoqAgAiCEMAAAAAXkUNACAGKAKIBSECIAVBGGogACAFQRBqQwAAgD9DAACAPxArEDEgBUEIaiABIAVDAACAP0MAAIA/ECsQMSACIAVBGGogBUEIakEGQwAAgD8QNiAEQQ8gCBBoIAYoAogFIAAgAUEFQwAAgD8QNiAEQQ8gCBBoCyAFQSBqJAALJwEBfyMAQRBrIgIkACAAQQJB0JADQYD4AkH3BSABEAEgAkEQaiQAC0kBAX8CQCACIAMQmQEiAyACRg0AQZDdAygCACIHKALsNCgCiAUgACABIAIgAyAEIAUgBhD1BCAHLQCEXkUNACAAIAIgAxCCAgsLbQEEfyAAQQFOBEBBkN0DKAIAIgNB5DZqIQIDQCADIAIoAgggAigCAEEUbGpBFGsiASgCAEEEdGoiBEHkK2ogASkCDDcCACAEQdwraiABKQIENwIAIAIQiQEgAEEBSiEBIABBAWshACABDQALCws2AQF/IwBBEGsiAiQAIAJBCGogASAAKAIAEQAAIAJBCGoQhAEhACACQQhqECwgAkEQaiQAIAALDwAgASAAKAIAaiACNgIACw0AIAEgACgCAGooAgALJAEBfyMAQRBrIgMkACADIAI2AgwgACABIAIQngUgA0EQaiQACx4AIAAgACgCXCAAKAJUIAEgAiADEKcEIABBADYCVAuSAgICfwJ9QZDdAygCACECIAFFBEAgAiAAQQJ0aioCgAYPCyACIABBAnRqQdgoaioCACIEQwAAAABdIgNFIAFBAkdyRQRAQwAAgD9DAAAAACACIABBAnRqQawpaioCAEMAAAAAYBsPCwJAIAMNAAJAAkACQAJAIAFBAWsOBQAEAQIDBAtDAACAP0MAAAAAIARDAAAAAFsbDwsgBCACKgIYkyAEIAIqAowBQ+xROD+UIAIqApABQ83MTD+UELIDsg8LIAQgAioCGJMgBCACKgKMAUMAAKA/lCACKgKQASIEIASSELIDsg8LIAQgAioCGJMgBCACKgKMAUPsUTg/lCACKgKQAUOamZk+lBCyA7IhBQsgBQuLAgIFfwF9IwBBEGsiAyQAQZDdAygCACICKALsNCEAIAJBoDdqIgEgAigCoDdBAWoQvAggARCxBCIBIAAoAgQ2AgAgASAAKQLMATcCBCABIAApAuQBNwIMIAEgACgCjAI2AhQgASAAKAKUAjYCGCABIAApAvQBNwIcIAEgACoChAI4AiQgASACKAKoNTYCKCACLQDgNSEEIAFBAToALSABIAQ6ACwgACAAKQLMATcC5AEgACAAKgLMASAAKgIMkyAAKgKQApMiBTgClAIgACAFOAKMAiADQQhqQwAAAABDAAAAABArGiAAIAMpAwg3AvQBIAItAIReBEAgAkH///97NgKcXgsgA0EQaiQAC2UBBH8jAEEQayIBJABBkN0DKAIAKALsNCIDIQQjAEEQayICJAAgAiAANgIMIAJBDGpBBCAEQcABahB6KAIAEOAFIQAgAkEQaiQAIAEgADYCDCADQcABaiABQQxqEHggAUEQaiQACzgBAn8jAEEQayIBJAAgAUGQ3QMoAgAoAuw0IgIgABCrCTYCDCACQcABaiABQQxqEHggAUEQaiQACx8AIAEgACgC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GiAGIANBoDdqELEEKAIAIAEoAgRHDQAaIAYgASoCjAKSCyEIIAYgB5IhBkEBIQQCf0EAIABBBHFFDQAaQQAgASgCmAMiAEUNABoQpAdBACEEIAALIQUgAkEQaiACQQhqIAggASoC0AEQKyACIAYgASoC0AFDAACAP5IQKxA+IQAgAkEIakMAAAAAQwAAAAAQK0MAAIC/EHkCQCAAQQBBABBZRQ0AIAEoAogFIAAgAkEIaiAAKgIIIAAqAgQQK0EbQwAAgD8QNkMAAIA/EIABIAMtAIReRQ0AIABB+4QBQQAQggILIAQNABCjByAFIAEqAtABOAIcCyACQSBqJAALC54GAgh/A30jAEGQAWsiAiQAAkAQOiIELQCPAQ0AQZDdAygCACEGIAQgABBaIQMgAkGIAWogAEEAQQFDAACAvxBgEO8BIQsgAiAEKQLMATcDgAEgAkHQAGogAkGAAWogAkHoAGogCyACKgKIASIMQwAAAABeBH0gDCAGQegqaioCAJIFIAoLkiACKgKMASAGQdQqaiIFKgIAIgogCpKSECsQMSACQfAAaiACQYABaiACQdAAahA+IgcgBSoCABClASAHIANBABBZRQ0AIAcgAyACQecAaiACQeYAakEAEIsBIggEQCABIAEtAABBAXM6AAAgAxDUAQsgAkHoAGogAkGAAWogAkHIAGogCyALECsQMSACQdAAaiACQYABaiACQegAahA+IQUgByADQQEQlwEgAiAFKQMANwNAIAIgBSkDCDcDOEEJQQhBByACLQBnIgMbIgkgAxsgCSACLQBmG0MAAIA/EDYhAyAGQdgqaioCACEKIAIgAikDQDcDGCACIAIpAzg3AxAgAkEYaiACQRBqIANBASAKEMEBQRJDAACAPxA2IQMCQAJAIAQtALADQcAAcUUEQCABLQAABEAgBCgCiAUhBCACQShqIAUgAkHoAGpDAACAPwJ/IAtDAADAQJUiCotDAAAAT10EQCAKqAwBC0GAgICAeAuyEC8iCiAKECsQMSACIAIpAyg3AwggBCACQQhqIAMgCyAKIAqSkxDCBwsgBi0AhF5FDQJB7usAQfLrACABLQAAGyEBDAELIAVBCGohCSACQegAakMAAIA/An8gC0NmZmZAlSILi0MAAABPXQRAIAuoDAELQYCAgIB4C7IQLyILIAsQKyEBIAQoAogF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ByAAQf3/AzYCAAsgBwsJACAAIAEQugMLrQEBBH8gAUGAAnEhA0GQ3QMoAgAhAiABQYABcQRAIAIoAqw3IQAgAwRAIABBAEoPCyAAIAIoArg3Sg8LIAJBrDdqIQQgAigCrDchBQJAIAMEQEEAIQEgBUEATARAQQAPCwNAIAQgARBNKAIAIgIgAEYhAyAAIAJGDQIgAUEBaiIBIAQoAgBIDQALDAELQQAhAyAFIAIoArg3IgFMDQAgBCABEE0oAgAgAEYPCyADC6gBAAJAIAFBgAhOBEAgAEQAAAAAAADgf6IhACABQf8PSARAIAFB/wdrIQEMAgsgAEQAAAAAAADgf6IhACABQf0XIAFB/RdIG0H+D2shAQwBCyABQYF4Sg0AIABEAAAAAAAAEACiIQAgAUGDcEoEQCABQf4HaiEBDAELIABEAAAAAAAAEACiIQAgAUGGaCABQYZoShtB/A9qIQELIAAgAUH/B2qtQjSGv6ILCgAgAEEwa0EKSQsRAEEAIABBCGogACgCEBBUGwspACAAIAE2AhAgAEGcoQM2AgAgARBURQRAIAAgACgCACgCABEBAAsgAAspACAAIAE2AgggAEG4oAM2AgAgARBURQRAIAAgACgCACgCABEBAAsgAAspACAAIAE2AgggAEHUnwM2AgAgARBURQRAIAAgACgCACgCABEBAAsgAAspACAAIAE2AgggAEHwngM2AgAgARBURQRAIAAgACgCACgCABEBAAsgAAspACAAIAE2AgggAEGIngM2AgAgARBURQRAIAAgACgCACgCABEBAAsgAAspACAAIAE2AgggAEGgnQM2AgAgARBURQRAIAAgACgCACgCABEBAAsgAAspACAAIAE2AgggAEG4nAM2AgAgARBURQRAIAAgACgCACgCABEBAAsgAAspACAAIAE2AgggAEH4mwM2AgAgARBURQRAIAAgACgCACgCABEBAAsgAAsKACAAKAIIIAFqCykAIAAgATYCCCAAQYyQAzYCACABEFRFBEAgACAAKAIAKAIIEQEACyAACzIBAX8jAEEQayIDJAAgACgCACADQQhqIAEQYiIAKAIAIAIoAgAQCiAAECwgA0EQaiQACycBAX8jAEEQayICJAAgAEEDQZCTA0Gk8wJBkgYgARABIAJBEGokAAtAAQF/AkAgASoCACAAKgIAYEUNACAB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IAEPC0H4lAVBMDYCAEF/C58BAQF/IwBBEGsiAyQAQQAgAiACIAAoAKsBIgJBGHRBGHVxG0UEQCAAIAJBcXE2AKsBIANBCGpD//9/f0P//39/ECsaIAAgAykDCDcCsAEgAyAAKQIMNwMIIAMgARB1IAAgAykDADcCDCADIABBDGogA0EIahA1IABBzAFqIAMQrgIgAEHkAWogAxCuAiAAQdwBaiADEK4CCyADQRBqJAAL2wECAX8CfkEBIQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQAgACAChCAFIAaEhFAEQEEADwsgASADg0IAWQRAQX8hBCAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwtBfyEEIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAtQAQF+AkAgA0HAAHEEQCACIANBQGqtiCEBQgAhAgwBCyADRQ0AIAJBwAAgA2uthiABIAOtIgSIhCEBIAIgBIghAgsgACABNwMAIAAgAjcDCAvKBAEGfyMAQdABayIEJAAgBEIBNwMIAkAgASACbCIJRQ0AIAQgAjYCECAEIAI2AhRBACACayEIIAIiASEHQQIhBQNAIARBEGogBUECdGogASIGIAIgB2pqIgE2AgAgBUEBaiEFIAYhByABIAlJDQALAkAgACAAIAlqIAhqIgZPBEBBASEFQQEhAQwBC0EBIQVBASEBA0ACfyAFQQNxQQNGBEAgACACIAMgASAEQRBqEJcGIARBCGpBAhDMBCABQQJqDAELAkAgBEEQaiABQQFrIgdBAnRqKAIAIAYgAGtPBEAgACACIAMgBEEIaiABQQAgBEEQahDLBAwBCyAAIAIgAyABIARBEGoQlwYLIAFBAUYEQCAEQQhqQQEQygRBAAwBCyAEQQhqIAcQygRBAQshASAEIAQoAghBAXIiBTYCCCAAIAJqIgAgBkkNAAsLIAAgAiADIARBCGogAUEAIARBEGoQywQDQAJ/AkACQCABQQFHIAVBAUdyRQRAIAQoAgwNAQwFCyABQQFKDQELIARBCGogBEEIahDMCCIGEMwEIAQoAggh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iAE3AgBB5DBBABDrAyADQegAaiANQaACahDvAyADQfAAaiADQegAaiADQeAAakMAAIC/IAdB5CpqKgIAECsQMSADQfAAakEAIANB2ABqQwAAAABDAAAAABArEMkCCyAKQQhxRQRAQdYOQQEQqwMLQeQwQQAQ6gNFDQAgBygC7DQhBiAAIBNHBEAgACATQQAQowEQngcLIB9DAABAQZQQwQJB4jAgASACQYKApPwBcUGAgdADciAHQezcAGoQjAQgCXIhCRCvAQsgCkGAAXEgACATRnJFBEAgA0GAAWogGSASBH0gHQUgICAHQegqaioCAJILkiAbIAdB1CpqKgIAkhArGiANIAMpA4ABNwLMASAAIBNBABCjAQsCQCAJIAZFcUUNACAURQRAQQAhBANAIARBAnQiACADQdABamogA0HAAWogAGooAgCyQwAAf0OVOAIAIARBAWoiBEEERw0ACwsgD0GAgIDBAHFBgICAwQBGBEAgByADKgLQASIYOALYXCAHIAMqAtQBIh04AtxcIBggHSADKgLYASADQdABaiAMIAsQogIgB0Ho3ABqIAMoAtgBNgIAIAcgAykD0AE3A+BcCyAVQYCAwIABRgRAIAMqAtABIAMqAtQBIAMqAtgBIANB0AFqIAwgCxDsAgsgASADKgLQATgCACABIAMqAtQBOAIEIAEgAyoC2AE4AgggBQ0AIAEgAyoC3AE4AgwLEGwQuQECQCANLQCcAkEBcUUgCkGABHFyDQAQhghFDQBBz/IAQQAQ3QUiAARAIAEgACgCACICKQAANwAAIAEgAigACDYACEEBIQkLQcjyAEEAEN0FIgIEfyABIAIoAgAgCEECdBA5GkEBIQlBAQUgAEEARwtFIA9BgICAgAFxRXJFBEAgASoCACABKgIEIAEqAgggASABQQRqIAFBCGoQ7AILEIUICwJAIAZFDQAgBygCpDUiAEUNACAHKALQNSAGRw0AIA0gADYCmAILIAlFDQAgDSgCmAIQ1AELIANB4AFqJAAgCQsxAQF/IAAoAgQgACgCCEcEQCAAEOwGIABBADoAFiAAIAAoAgQiATYCCCAAIAE2AgALC2wBAn8gACABEIoBIAEoAgQiAiABKAIIIgNHBEACQCACIANIBEAgACABIAIgAyACaxCNBCABIAEoAgQiADYCCAwBCyAAIAEgAyACIANr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CDcDCCAFQRBqJAALxAECAX8CfkF/IQMCQCAAQgBSIAFC////////////AIMiBEKAgICAgIDA//8AViAEQoCAgICAgMD//wBRGw0AQQAgAkL///////////8AgyIFQoCAgICAgMD//wBWIAVCgICAgICAwP//AFEbDQAgACAEIAWEhFAEQEEADwsgASACg0IAWQRAQQAgASACUyABIAJRGw0BIAAgASAChYRCAFIPCyAAQgBSIAEgAlUgASACURsNACAAIAEgAoWEQgBSIQMLIAML2QMCAn4CfyMAQSBrIgQkAAJAIAFC////////////AIMiA0KAgICAgIDAgDx9IANCgICAgICAwP/DAH1UBEAgAUIEhiAAQjyIhCEDIABC//////////8PgyIAQoGAgICAgICACFoEQCADQoGAgICAgICAwAB8IQIMAgsgA0KAgICAgICAgEB9IQIgAEKAgICAgICAgAiFQgBSDQEgAiADQgGDfCECDAELIABQIANCgICAgICAwP//AFQgA0KAgICAgIDA//8AURtFBEAgAUIEhiAAQjyIhEL/////////A4NCgICAgICAgPz/AIQhAgwBC0KAgICAgICA+P8AIQIgA0L///////+//8MAVg0AQgAhAiADQjCIpyIFQZH3AEkNACAEQRBqIAAgAUL///////8/g0KAgICAgIDAAIQiAiAFQYH3AGsQkwEgBCAAIAJBgfgAIAVrEIIDIAQpAwhCBIYgBCkDACIAQjyIhCECIAQpAxAgBCkDGIRCAFKtIABC//////////8Pg4QiAEKBgICAgICAgAhaBEAgAkIBfCECDAELIABCgICAgICAgIAIhUIAUg0AIAJCAYMgAnwhAgsgBEEgaiQAIAIgAUKAgICAgICAgIB/g4S/Cw0AQZDdAygCACgCkDQLrwEBBn8jAEHwAWsiBiQAIAYgADYCAEEBIQcCQCADQQJIDQBBACABayEJIAAhBQNAIAAgBSAJaiIFIAQgA0ECayIKQQJ0aigCAGsiCCACEQMAQQBOBEAgACAFIAIRAwBBf0oNAgsgBiAHQQJ0aiAIIAUgCCAFIAIRAwBBf0oiCBsiBTYCACAHQQFqIQcgA0EBayAKIAgbIgNBAUoNAAsLIAEgBiAHEMsIIAZB8AFqJAALKwAgAENr0w28lEO6Ey+9kiAAlEN1qio+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BEAgACAAKAIAKAIMEQEACyAACxsAIAAgASACKAIAIAIQpwEgAyAEIAUgBhCHAgsSACAAQbCkAzYCACAAEO4IIAALPQEBfyMAQRBrIgMkACAAKAIAIANBCGogARBnIgAoAgAgAyACEIQEIgEoAgAQCiABECwgABAsIANBEGokAAsbACAAIAEgAigCACACEKcBIAMgBCAFIAYQiQILMQEBfyAAEPcIIAAoAgAEQCAAIAAoAgAQ+AggABBcGiAAKAIAIQEgABCHAxogARBTCwuFBwEIfyABIAAQpwEiAksEQCMAQSBrIgckAAJAIAEgAmsiBiAAEFwoAgAgACgCBGtBAnVNBEAjAEEQayICJAACfyACIgEgACIFNgIAIAEgACgCBCIANgIEIAEgACAGQQJ0ajYCCCABIgAoAgQiAyAAKAIIIgFHCwRAA0AgBRBcGiADEMABIAAgA0EEaiIDNgIEIAEgA0cNAAsLIAAQ5gQgAkEQaiQADAELIAAQXCEJIAdBCGohAgJ/IAAQpwEgBmohCCMAQRBrIgMkACADIAg2AgwCfyMAQRBrIgQkACAAIgUQXBogBEH/////AzYCDCAEQf////8HNgIIIARBDGogBEEIahDiBCgCACEBIARBEGokACABIAhPCwRAIAUQhwMiBSABQQF2SQRAIAMgBUEBdDYCCCADQQhqIANBDGoQwgMoAgAhAQsgA0EQaiQAIAEMAQsQyAQACyEFIAAQpwEhBEEAIQEjAEEQayIDJAAgA0EANgIMIAJBDGogA0EMaiAJEOUEIAUEQCACKAIQGiAFIgFB/////wNLBEBB3s0AEIUEAAsgAUECdBDRASEBCyACIAE2AgAgAiABIARBAnRqIgQ2AgggAiAENgIEIAIQ5wEgASAFQQJ0ajYCACADQRBqJAAjAEEQayIFJAACfyAFIgEgAiIDKAIINgIAIAIoAgghBCABIAJBCGo2AgggASAEIAZBAnRqNgIEIAEoAgAgASgCBEcLBEADQCADKAIQGiABKAIAEMABIAEgASgCAEEEaiIENgIAIAQgASgCBEcNAAsLIAEQ5AQgBUEQaiQAIAAQ9wggABBcIAAoAgAgACgCBCACQQRqIgEQ4wQgACABEOYBIABBBGogAkEIahDmASAAEFwgAhDnARDmASACIAIoAgQ2AgAgABCnARogACgCABogACgCACAAEIcDQQJ0ahogACgCACAAEIcDQQJ0ahogACgCABogAiIAKAIIIAAoAgQiAUcEQANAIAAoAhAaIAAgACgCCEEEazYCCCAAKAIIIAFHDQALCyACKAIABEAgAigCEBogAigCACEAIAIQ5wEoAgAgAigCAGsaIAAQUwsLIAdBIGokAA8LIAEgAkkEQCAAKAIAIAFBAnRqIQEgABCnARogACABEPgIIAAoAgAaIAAoAgAgABCHA0ECdGoaIAAoAgAaIAAoAgAgABCnAUECdGoaCwsdACAAIAEgAigCACACEKcBIAMgBCAFIAYgBxCKAgsZACAAIAE2AhQgAEGYmwM2AgAgABCCCSAACxkAIAAgATYCECAAQeCaAzYCACAAEIQJIAALDwAgAEEYahBPGiAAEL4ECxkAIAAgATYCDCAAQaiaAzYCACAAEIYJIAALZAEDfyMAQRBrIgEkACABQQA2AgwDQCAAKAIUIQMgAUEIaiAAIAJBAnRqQQRqEIQCIAMgAUEMaiABQQhqEPsBIAFBCGoQLCABIAEoAgxBAWoiAjYCDCACQQRJDQALIAFBEGokAAtoAgJ/AX0jAEEQayIBJAAgAUEANgIMA0AgAUEIaiAAKAIUIAFBDGoQ/AEgAUEIahBBIQMgACABKAIMQQJ0aiADOAIEIAFBCGoQLCABIAEoAgxBAWoiAjYCDCACQQRJDQALIAFBEGokAAsZACAAIAE2AgwgAEGYmAM2AgAgABCLCSAACxIAIABBrJQDNgIAIAAQlAkgAAsSACAAQfSTAzYCACAAELEGIAALKAEBfyMAQRBrIgIkACAAQYT7AiACQQhqIAEQcxADNgIAIAJBEGokAAsqAQF/IwBBEGsiAiQAIABB0NcDIAJBCGogARBzEAM2AgAgAkEQaiQAIAALZAEEfyMAQRBrIgEkACABQQA2AgwgAEEEaiEDA0AgACgCCCECIAFBCGogAxCdCSACIAFBDGogAUEIahD7ASABQQhqECwgASABKAIMIgJBAWoiBDYCDCACIARLDQALIAFBEGokAAtmAQN/IwBBEGsiASQAIAFBADYCDANAIAFBCGogACgCCCABQQxqEPwBIAFBCGoQywMhAiAAIAEoAgxqIAI6AAQgAUEIahAsIAEgASgCDCICQQFqIgM2AgwgAiADSw0ACyABQRBqJAAL4AIBCX8gASIFEG0hASMAQRBrIgYkAAJAIAEgABCRBiIDTQRAIAAQMCICIQMgASIEBEAgAyAFIAQQ0AELIAZBADoADyABIAJqIAZBD2oQ6gQCQCAAEJADBEAgACABEMcEDAELIAAgARDrBAsMAQsgABCPAyIIIQogASEEIwBBEGsiAiQAAkAgASADayIHQW8iASADQX9zak0EQCAAEDAhCQJ/IAMgAUEBdkEQa0kEQCACIANBAXQ2AgggAiADIAdqNgIMIAJBDGogAkEIahDCAygCABCQBgwBCyABQQFrC0EBaiIHENEBIQEgBARAIAEgBSAEEMYECyAKIAhrIgUEQCABIARqIAggCWogBRDGBAsgA0EKRwRAIAkQUwsgACABEKYDIAAgBxCPBiAAIAQgBWoiABDHBCACQQA6AAcgACABaiACQQdqEOoEIAJBEGokAAwBCxCSBgALCyAGQRBqJAAL2AEBAn9BkN0DKAIAIQIgACAAKAKoA0EBajYCqAMgACgCsANBBXEiA0UEQCAAIAAoAqwDQQFqNgKsAwsCQCACKAKkNSABRw0AIAItAPw5RQ0AQQAQgAQNACACKALoOQ0AIAIgADYC6DkgAiAAKAKsA0EAQX8gAxtBASACLQD9ARtqNgL4OQsCfwJAIAIoAuQ5IABHDQBBASAAKAKoAyACKALsOUYNARoCQCADDQAgACgCrAMgAigC8DlHDQAgAiABNgLgN0EBDwsgAigCpDUgAUcNABByC0EACwsxAQF/IAAQnAkgACgCAARAIAAgACgCABCaCSAAEFwaIAAoAgAhASAAEI0DGiABEFMLC8oGAQh/IAEgABCoASICSwRAIwBBIGsiByQAAkAgASACayIGIAAQXCgCACAAKAIEa00EQCMAQRBrIgIkAAJ/IAIiASAAIgU2AgAgASAAKAIEIgA2AgQgASAAIAZqNgIIIAEiACgCBCIDIAAoAggiAUcLBEADQCAFEFwaIAMQmQkgACADQQFqIgM2AgQgASADRw0ACwsgABDmBCACQRBqJAAMAQsgABBcIQkgB0EIaiECAn8gABCoASAGaiEIIwBBEGsiAyQAIAMgCDYCDAJ/IwBBEGsiBCQAIAAiBRBcGiAEQX82AgwgBEH/////BzYCCCAEQQxqIARBCGoQ4gQoAgAhASAEQRBqJAAgASAITwsEQCAFEI0DIgUgAUEBdkkEQCADIAVBAXQ2AgggA0EIaiADQQxqEMIDKAIAIQELIANBEGokACABDAELEMgEAAshBSAAEKgBIQRBACEBIwBBEGsiAyQAIANBADYCDCACQQxqIANBDGogCRDlBCAFBEAgAigCEBogBRDRASEBCyACIAE2AgAgAiABIARqIgQ2AgggAiAENgIEIAIQ5wEgASAFajYCACADQRBqJAAjAEEQayIFJAACfyAFIgEgAiIDKAIINgIAIAIoAgghBCABIAJBCGo2AgggASAEIAZqNgIEIAEoAgAgASgCBEcLBEADQCADKAIQGiABKAIAEJkJIAEgASgCAEEBaiIENgIAIAQgASgCBEcNAAsLIAEQ5AQgBUEQaiQAIAAQnAkgABBcIAAoAgAgACgCBCACQQRqIgEQ4wQgACABEOYBIABBBGogAkEIahDmASAAEFwgAhDnARDmASACIAIoAgQ2AgAgABCoARogACgCABogACgCACAAEI0DahogACgCACAAEI0DahogACgCABogAiIAKAIIIAAoAgQiAUcEQANAIAAoAhAaIAAgACgCCEEBazYCCCAAKAIIIAFHDQALCyACKAIABEAgAigCEBogAigCACEAIAIQ5wEoAgAgAigCAGsaIAAQUwsLIAdBIGokAA8LIAEgAkkEQCAAKAIAIAFqIQEgABCoARogACABEJoJIAAoAgAaIAAoAgAgABCNA2oaIAAoAgAaIAAoAgAgABCoAWoaCwsoAQF/IwBBEGsiAiQAIABBiIgDIAJBCGogARBzEAM2AgAgAkEQaiQACyoBAX8jAEEQayICJAAgAiAANgIMIAJBDGogARCEARD9ASACQRBqJAAgAAs3AQF/IAAoAgQiA0EBdSABaiEBIAAoAgAhACABIAIgA0EBcQR/IAEoAgAgAGooAgAFIAALEQAACw4AIAEgAiAAKAIAEQAAC0QCAn8BfCMAQRBrIgEkACAAKAIAQfT/AigCACABQQRqEAUhAyABIAEoAgQQXiEAIAMQmAIhAiAAEKIBIAFBEGokACACC0UBAX8jAEEQayIFJAAgACgCACEAIAVBCGogAhAuIAUgAxAuIAEgBUEIaiAFIAQgABEGACAFECwgBUEIahAsIAVBEGokAAtqAQJ/QQEhAwJAQZDdAygCACgCxDciAkUNAAJAIAIoAqAGIgJFDQAgAi0AiwFFDQAgAiAAKAKgBkYNAEEAIQMgAigCCCIAQYCAgMAAcQ0BIABBgICAIHFFDQAgAUEIcUUNAQtBASEDCyADCzcBAX8jAEEQayIDJAAgAyAANgIMIANBDGogARCEARD9ASADQQxqIAIQhAEQ/QEgA0EQaiQAIAALKgEBfyMAQRBrIgIkACAAQbjXAyACQQhqIAEQcxADNgIAIAJBEGokACAACw4AIAAoAghB/////wdxCzYBAX9BkN0DKAIAIgFBADsBmDUgASAANgKQNQJAIABFDQAgASgClDUgAEYNACABQgA3Apw1CwsnAQF/IwBBEGsiAyQAIAMgARBLIAMgAiAAEQAAIAMQNyADQRBqJAALDwAgABDSBSAAQQhqEEUaCycBAX8jAEEQayICJAAgAEEDQeCoA0H48gJBuAYgARABIAJBEGokAAsnAQF/IwBBEGsiAiQAIABBA0G0qANBpPMCQbYGIAEQASACQRBqJAALHwAgAEEIahBEGiAAQQA2AhAgAEIANwIIIABCADcCAAsKACAAQQBBJBBGCycBAX8jAEEQayICJAAgAEEFQdClA0GEkQNBpwYgARABIAJBEGokAAsnAQF/IwBBEGsiAiQAIABBBUHwowNBhJEDQaQGIAEQASACQRBqJAALVgAgABBEGiAAQQxqEEQaIABBGGoQRBogAEE8ahBEGiAAQcgAahBEGiAAQdQAahBEGiAAQeAAahDxARogAEH4AGoQxgYgAEEAQZABEEYiACABNgIsIAALMQECfSAAIAEqAgAiAyACKgIAIgQgAyAEXRsgASoCBCIDIAIqAgQiBCADIARdGxArGgsnAQF/IwBBEGsiAiQAIABBA0H8kgNBpPMCQZAGIAEQASACQRBqJAALJwEBfyMAQRBrIgIkACAAQQJBzJIDQaj1AkGLBiABEAEgAkEQaiQACycBAX8jAEEQayICJAAgAEEDQaSSA0Gs9QJBhwYgARABIAJBEGokAAsnAQF/IwBBEGsiAiQAIABBA0GQkgNBnJIDQYYGIAEQASACQRBqJAALJwEBfyMAQRBrIgIkACAAQQNB1JEDQaz1AkGCBiABEAEgAkEQaiQACycBAX8jAEEQayICJAAgAEECQdiQA0GA+AJB+QUgARABIAJBEGokAAsnAQF/IwBBEGsiAiQAIABBAUGs8AJBqPACQfgFIAEQASACQRBq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IQMCQBA6IgUtAI8BDQAgABDiBSEHIAJB6ABqIABBAEEBQwAAgL8QYCACIAEpAgA3A1gQnAEhCBCvBCEJIANB5CpqKgIAIQogAiACKQNYNwMQIAJB4ABqIAJBEGogCCAKIAlDzczsQJSSEK4DIAJBMGogBUHMAWoiASACQdAAaiACKgJgIAIqAmQgAioCbBAvECsQMUMAAAAAIQggAkEoaiACQUBrIAEgAkEwahA+IgFBCGogAkEgaiACKgJoIglDAAAAAF4EfSAJIANB6CpqKgIAkgUgCAtDAAAAABArEDEgAkEwaiABIAJBKGoQPiEEIAUgAikDODcCqAIgBSACKQMwNwKgAiADQdA2ahDAASAEIARBCGoQkAgiBkUEQCACQShqIAQQ4gEgAkEoaiADQdQqaioCABB5IARBACABEFkaDAELEMsBIAIqAmhDAAAAAF4EQCACIAJBGGogASoCCCADQegqaioCAJIgASoCBCADQdQqaioCAJIQKykCADcDCCACQQhqIABBAEEBELMBCyACQShqIAEQ4gEgByACQShqQQAQoggaCyACQfAAaiQAIAYLUQEBf0GQ3QMoAgAoAuw0IgEgACgCADYCmAIgASAAKAIENgKcAiABIAApAgg3AqACIAEgACkCEDcCqAIgASAAKQIYNwKwAiABIAApAiA3ArgCC2MBAX8gAEEIahBPGiAAQRhqEE8aIABBkN0DKAIAKALsNCIBKAKYAjYCACAAIAEoApwCNgIEIAAgASkCoAI3AgggACABKQKoAjcCECAAIAEpArACNwIYIAAgASkCuAI3AiAgAAtSAgF/AX0gACgCCCIBQQBOBEACQCABQf////8HRg0AIAAoAgBBAEgNACAAKgIYIAAqAhQiAiABIAAoAhBrspSSIAIQhQULIABC/////z83AggLC0wBAX8jAEEQayIBJAAgASAANgIMQZDdAygCACgC7DQhAEMAAAAAEKcCIAAgACgCgANBAWo2AoADIABBwAFqIAFBDGoQeCABQRBqJAALPwECfxA6IgUtAI8BBH8gBAVBkN0DKAIAQbziAGoiBEGBGCACIAMQ9QIhAiAFIAAQ7AQgASAEIAIgBGoQlgMLCz4BAn8QOiIFLQCPAQR/IAQFQZDdAygCAEG84gBqIgRBgRggAiADEPUCIQIgBSAAEFogASAEIAIgBGoQ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IAVIGyAGIABBAEobCzYCAAsgAUEtRw0FIAICfyADKAIAIQECfyAEKAIAIgBBAU4EQEGAgICAeCAAQYCAgIB4ciABSg0BGgtB/////wcgASAAayICIABB/////wdqIAFIGyACIABBAEgbCws2AgAPCyABQStGBEAgAkF/IAMoAgAiBSAEKAIAIgBqIgYgAEF/cyAFSRsgBiAAGzYCAAsgAUEtRw0EIAJBACADKAIAIgEgBCgCACIAayICIAAgAUsbIAIgABs2AgAPCyABQStGBEAgAykDACEIIAICfiAEKQMAIgdCf1cEQEKAgICAgICAgIB/QoCAgICAgICAgH8gB30gCFUNARoLQv///////////wAgByAIfCIJQv///////////wAgB30gCFMbIAkgB0IAVRsLNwMACyABQS1HDQMgAykDACEIIAICfiAEKQMAIgdCAVkEQEKAgICAgICAgIB/IAdCgICAgICAgICAf4QgCFUNARoLQv///////////wAgCCAHfSIJIAdC////////////AHwgCFMbIAkgB0IAUxsLNwMADwsgAUErRgRAIAJCfyADKQMAIgggBCkDACIHfCIJIAdCf4UgCFQbIAkgB0IAUhs3AwALIAFBLUcNAiACQgAgAykDACIIIAQpAwAiB30iCSAHIAhWGyAJIAdCAFIbNwMADwsgAUErRgRAIAIgAyoCACAEKgIAkjgCAAsgAUEtRw0BIAIgAyoCACAEKgIAkzgCAA8LIAFBK0YEQCACIAMrAwAgBCsDAKA5AwALIAFBLUcNACACIAMrAwAgBCsDAKE5AwALCxEAIAAgAUEUIAIgAyAEEJoHC8YCAQN/IwBBIGsiBiQAQZDdAygCACEIIAZBADYCHCABKAIAIgdBAEggBCAHTHJFBEAgAyAHIAZBHGogAhEFABoLAkAgBUF/Rg0AIAgtAPA1QRBxDQAgBkEQakMAAAAAQwAAAAAQKyAGQQhqQ///f38gBRCbBxArQQAQ7gMLAn9BACAAIAYoAhxBABCgBUUNABpBACEFIARBAEoEQEEAIQADQCAFEMwBIAEoAgAhBwJ/IAMgBSAGQQhqIAIRBQAEQCAGKAIIDAELIAZBnoUBNgIIQZ6FAQsgBSAHRkEAIAZBEGpDAAAAAEMAAAAAECsQhgEEQCABIAU2AgBBASEACyAFIAdGBEAQ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AgRKBEAgAUEkbBBQIQIgACgCCCIDBEAgAiADIAAoAgBBJGwQORogACgCCBBICyAAIAE2AgQgACACNgIICws+AQJ/QZDdAygCACIBQbg0aiECIAEoArg0IQEDQCABQQFIBEBBfw8LIAIgAUEBayIBEEooAgAgAEcNAAsgAQsKACAAIAFqIAFvC1EBAn9BkN0DKAIAIgIgADYCjDggAigCxDchAQJAIAANACACIAEQugQiATYCxDcgASgCsAYiAEUNACAAQQBBACABQbgGahCuBA8LIAFBARC5BAtiAQR/IAEgACgCBEoEQCAAIAEQZSEDIAMgACICKAIESgRAIANBMGwQUCEEIAIoAggiBQRAIAQgBSACKAIAQTBsEDkaIAIoAggQSAsgAiADNgIEIAIgBDYCCAsLIAAgATYCAAs7AQJ/QZDdAygCACIBLQD8ASIAQQJyIAAgAS0A/QEbIgBBBHIgACABLQD+ARsiAEEIciAAIAEtAP8BGwscACAAIAFBCCACpyACQiCIpyADpyADQiCIpxAZC5cCAQN/AkAgASACKAIQIgMEfyADBQJ/IAIiAyADLQBKIgRBAWsgBHI6AEogAygCACIEQQhxBEAgAyAEQSByNgIAQX8MAQsgA0IANwIEIAMgAygCLCIENgIcIAMgBDYCFCADIAQgAygCMGo2AhBBAAsNASACKAIQCyACKAIUIgRrSwRAIAIgACABIAIoAiQRBQAPCwJAIAIsAEtBAEgEQEEAIQMMAQsgASEFA0AgBSIDRQRAQQAhAwwCCyAAIANBAWsiBWotAABBCkcNAAsgAiAAIAMgAigCJBEFACIFIANJDQEgACADaiEAIAEgA2shASACKAIUIQQLIAQgACABEDkaIAIgAigCFCABajYCFCABIANqIQULIAUL0QYCBH8DfiMAQYABayIFJAACQAJAAkAgAyAEQgBCABCBA0UNAAJ/IAMhCSAEQv///////z+DIQoCfyAEQjCIp0H//wFxIgZB//8BRwRAQQQgBg0BGkECQQMgCSAKhFAbDAILIAkgCoRQCwtFDQAgAkIwiKciCEH//wFxIgZB//8BRw0BCyAFQRBqIAEgAiADIAQQYSAFIAUpAxAiASAFKQMYIgIgASACEMkIIAUpAwghAiAFKQMAIQQMAQsgASACQv///////z+DIAatQjCGhCIKIAMg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AgRBAXI2AgQgAyAMEMIICyAFIQILIAILIgIEQCACQQhqDwsgARCTAiIFRQRAQQAPCyAFIABBfEF4IABBBGsoAgAiAkEDcRsgAkF4cWoiAiABIAEgAksbEDkaIAAQUyAFC00BAX8CQCABRQ0AIAFB2NUDEOMBIgFFDQAgASgCCCAAKAIIQX9zcQ0AIAAoAgwgASgCDEEAEH1FDQAgACgCECABKAIQQQAQfSECCyACC1UBAn8gACgCBCEEAn9BACACRQ0AGiAEQQh1IgUgBEEBcUUNABogAigCACAFEIsGCyEFIAAoAgAiACABIAIgBWogA0ECIARBAnEbIAAoAgAoAhwRBgALIwAgAEEANgIMIAAgATYCBCAAIAE2AgAgACABQQFqNgIIIAALeAEDfyMAQRBrIgMkACACQW9NBEACQCACQQpNBEAgACACEOsEIAAhBAwBCyAAIAIQkAZBAWoiBRDRASIEEKYDIAAgBRCPBiAAIAIQxwQLIAQgASACEMYEIANBADoADyACIARqIANBD2oQ6gQgA0EQaiQADwsQkgYAC38BAn8jAEEQayICJABBkN0DKAIAIQEgABB3IAAoAlAgABD+ASABQQE6ALI1IAFBAToAljggAkEIaiABQeQBaiAAKAKgBkEMahA1IAEgAikDCDcDyDUCQCAALQAIQQRxDQAgACgCoAYtAAhBBHENACABIAA2Avw0CyACQRBqJAALxg8CBX8OfiMAQdACayIFJAAgBEL///////8/gyEKIAJC////////P4MhCyACIASFQoCAgICAgICAgH+DIQ0gBEIwiKdB//8BcSEIAkACQCACQjCIp0H//wFxIglBAWtB/f8BTQRAIAhBAWtB/v8BSQ0BCyABUCACQv///////////wCDIg9CgICAgICAwP//AFQgD0KAgICAgIDA//8AURtFBEAgAkKAgICAgIAghCENDAILIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRG0UEQCAEQoCAgICAgCCEIQ0gAyEBDAILIAEgD0KAgICAgIDA//8AhYRQBEAgAyACQoCAgICAgMD//wCFhFAEQEIAIQFCgICAgICA4P//ACENDAMLIA1CgICAgICAwP//AIQhDUIAIQEMAgsgAyACQoCAgICAgMD//wCFhFAEQEIA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AAAAAAAA8D8gBhDQAiEWAkAgA0F/TA0AIAMhAgNAIAUgAkEDdGogFiAFQeADaiACQQJ0aigCALeiOQMAIBZEAAAAAAAAcD6iIRYgAkEASiEGIAJBAWshAiAGDQALIANBf0wNACADIQIDQCADIAIiBmshCEQAAAAAAAAAACEWQQAhAgNAAkAgFiACQQN0QeDMA2orAwAgBSACIAZqQQN0aisDAKKgIRYgAiAJTg0AIAIgCEkhBCACQQFqIQIgBA0BCwsgBUGgAWogCEEDdGogFjkDACAGQQFrIQIgBkEASg0ACwtEAAAAAAAAAAAhFiADQQBOBEADQCAWIAVBoAFqIANBA3RqKwMAoCEWIANBAEohAiADQQFrIQMgAg0ACwsgCyAWmiAWIAwbOQMAIAVBsARqJAAgB0EHcSEDIAsrAwAhFiARQX9MBEAgASAWmjkDAEEAIANrIQMMAQsgASAWOQMACyALQRBqJAAgAws5AQF+An4gACgCTEF/TARAIAAQ1ggMAQsgABDWCAsiAUKAgICACFkEQEH4lAVBPTYCAEF/DwsgAacLYAIBfgJ/IAAoAighAkEBIQMgAEIAIAAtAABBgAFxBH9BAkEBIAAoAhQgACgCHEsbBSADCyACER4AIgFCAFkEfiAAKAIUIAAoAhxrrCABIAAoAgggACgCBGusfXwFIAELC3IBA38gAEEMaiECIAAoAgxBAEoEQANAIAIgAxDoAigCBCIBQX9HBEAgACABELoDIgEoAggQSCABQeQDahBFGiABQcQDahDDBiABQbgDahDoAQsgA0EBaiIDIAIoAgBIDQALCyACEEMgABBDIABBADYCGAu7AgACQCABQRRLDQACQAJAAkACQAJAAkACQAJAAkACQCABQQlrDgoAAQIDBAUGBwgJCgsgAiACKAIAIgFBBGo2AgAgACABKAIANgIADwsgAiACKAIAIgFBBGo2AgAgACABNAIANwMADwsgAiACKAIAIgFBBGo2AgAgACABNQIANwMADwsgAiACKAIAQQdqQXhxIgFBCGo2AgAgACABKQMANwMADwsgAiACKAIAIgFBBGo2AgAgACABMgEANwMADwsgAiACKAIAIgFBBGo2AgAgACABMwEANwMADwsgAiACKAIAIgFBBGo2AgAgACABMAAANwMADwsgAiACKAIAIgFBBGo2AgAgACAB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XQRAIAWoDAELQYCAgIB4CzYCACACAn8gASoCBCAAKgIQIgWTIgaLQwAAAE9dBEAgBqgMAQtBgICAgHgLNgIEIAICfyABKgIIIASTIgSLQwAAAE9dBEAgBKgMAQtBgICAgHgLNgIIIAICfyABKgIMIAWTIgSLQwAAAE9dBEAgBKgMAQtBgICAgHgLNgIMIAJBECADEOAFIgAQ/wEgAkEQaiQAIAALVQEBfyMAQSBrIgUkACAFQRBqIAEQSyAFQQhqIAIQLiAFIAMQLiAFQRBqIAVBCGogBSAEIAARCAAhACAFECwgBUEIahAsIAVBEGoQNyAFQSBqJAAgAAsUACABQQAgAEHAAWoQeigCABC4AQsrAQF/IwBBEGsiAyQAIAMgARBLIAMgAiAAEQMAIQAgAxA3IANBEGokACAACzMBAX8jAEEQayICJAAgAkEIaiABIAARAAAgAkEIahCEASEAIAJBCGoQLCACQRBqJAAgAAspAQF/IwBBEGsiAiQAIAIgASAAEQIANgIMIAIoAgwhACACQRBqJAAgAAsLACABIAIgABEAAAtJAQF/IwBBIGsiBCQAIARBEGogARBLIARBCGogAhAuIARBEGogBEEIaiADIAARBQAhACAEQQhqECwgBEEQahA3IARBIGokACAACwkAIAEgABECAAsnAQF/IwBBEGsiAiQAIABBA0H4qwNBpPMCQcsGIAEQASACQRBqJAALJwEBfyMAQRBrIgIkACAAQQdB0KsDQeyrA0HKBiABEAEgAkEQaiQACxQAIABB6ABqEMMGIABB3ABqEEUaCycBAX8jAEEQayICJAAgAEECQZCqA0Go9QJBwwYgARABIAJBEGokAAsnAQF/IwBBEGsiAiQAIABBAkHQqQNB9PICQcAGIAEQASACQRBqJAALJwEBfyMAQRBrIgIkACAAQQJBoKkDQaj1AkG9BiABEAEgAkEQaiQACycBAX8jAEEQayICJAAgAEECQZipA0Go9QJBvAYgARABIAJBEGokAAsnAQF/IwBBEGsiAiQAIABBA0HApwNBrPUCQbEGIAEQASACQRBqJAALMAEBfyAAEDAhAiMAQRBrIgAkACAAIAE2AgQgACACNgIAQdblACAAEFIgAEEQaiQACycBAX8jAEEQayICJAAgAEEKQYCnA0GopwNBrwYgARABIAJBEGokAAsnAQF/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AkEQahAsIAJBEGogAUHn7QAQRyAAIAJBEGoQQTgCOCACQRBqECwgAkEQaiABQYfaABBHIAAgAkEQahDLAzoAPCACQRBqECwgAkEQaiABQbUmEEcgACACQRBqEMoDNgJAIAJBEGoQLCACQRBqIAFBiQkQRyAAIAJBEGoQQTgCRCACQRBqECwgAkEIaiABQbDXABBHIAJBEGogAkEIahChASAAQcoAaiACQRBqEDBBJxDPBCACQRBqEDcgAkEIahAsIAJBIGoQLCACQShqECwgAkEwaiQACzkBAX8jAEEQayICJAAgAiABNgIMQYyAAyAAQQNBqIkDQaTzAkGSAiACQQxqEC1BABACIAJBEGokAAs9AQF/IwBBEGsiAiQAIAIgASkCADcDCEGMgAMgAEECQaCJA0GA+AJBkQIgAkEIahCNAUEAEAIgAkEQaiQAC1UBAX8gACgCACICIAAoAgRGBEAgACAAIAJBAWoQZRDJCSAAKAIAIQILIAAoAgggAkEMbGoiAiABKQIANwIAIAIgASgCCDYCCCAAIAAoAgBBAWo2AgALwAUBD38jAEEQayIBJAAgAEGUCGohAyAAQcQBaiECIABBBGoQNCEEIABBFGoQNCEFIABBHGoQNCEGIABBOGoQNCEHIABByABqEDQhCCAAQdAAahA0IQkgAEHYAGoQNCEKIABB4ABqEDQhCyAAQZQBahA0IQwgAEGcAWoQNCENIABBpAFqEDQhDiAAQawBahA0IQ8DQCACEPEBQRBqIgIgA0cNAAsgAEGAgID8AzYCACABQQhqQwAAAEFDAAAAQRArGiAEIAEpAwg3AgAgAEKAgICAgICAwD83AgwgAUEIakMAAABCQwAAAEIQKxogBSABKQMINwIAIAFBCGpDAAAAAEMAAAA/ECsaIAYgASkDCDcCACAAQoCAgICAgIDAPzcCMCAAQoCAgICAgIDAPzcCKCAAQQA2AiQgAUEIakMAAIBAQwAAQEAQKxogByABKQMINwIAIABCADcCQCABQQhqQwAAAEFDAACAQBArGiAIIAEpAwg3AgAgAUEIakMAAIBAQwAAgEAQKxogCSABKQMINwIAIAFBCGpDAACAQEMAAABAECsaIAogASkDCDcCACABQQhqQwAAAABDAAAAABArGiALIAEpAwg3AgAgAEEBNgKQASAAQgA3AogBIABCgICA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aiACEOwBIQMgAhAsIAJBCGoQLAsgAkEQaiQAIAMLUAEBfyMAQRBrIgMkACADQQhqIAJBzwwQRyABQc8MIANBCGoQZiADQQhqECwgAyACQdQJEEcgAUHUCSADEGYgAxAsIAAgARCVAyADQRBqJAALGwAgAUHPDCACEGYgAUHUCSADEGYgACABEJUDCwYAQczxAgsxAQF/IwBBEGsiASQAIAFBCGogABEBACABQQhqEIQBIQAgAUEIahAsIAFBEGokACAAC+EEAQx/IwBBMGsiASQAIwBBEGshAiABQgA3AgggAUIANwIoIAFCADcCICABQgA3AhggAUIANwIQQdyYBSgCAEUEQEHomAVCfzcCAEHgmAVCgKCAgICABDcCAEHcmAUgAkEMakFwcUHYqtWqBXM2AgBB8JgFQQA2AgBBwJgFQQA2AgALQZyVBSgCACIKBEBBxJgFIQNBASEIQZCVBSgCACILQShqIgQhBQNAIAMoAgAiBkF4IAZrQQdxQQAgBkEIakEHcRtqIQIgBiADKAIEaiEMA0ACQCACIApGIAIgDE9yDQAgAigCBCIHQQdGDQAgB0F4cSIJQQAgB0EDcUEBRiIHGyAFaiEFIAQgCWohBCAHIAhqIQggAiAJaiICIAZPDQELCyADKAIIIgMNAAsgASAINgIMIAEgBDYCCCABQbSYBSgCACICIARrNgIYQbiYBSgCACEDIAEgCzYCLCABIAU2AiggASACIAVrNgIkIAEgAzYCHAsgABCBBSAAQb/rACABIAFBCGoQZyICEGYgAhAsIABB7iUgASABQQhqQQRyEGciAhBmIAIQLCAAQdclIAEgAUEQahBnIgIQZiACECwgAEHeJSABIAFBFGoQZyICEGYgAhAsIABBzNwAIAEgAUEYahBnIgIQZiACECwgAEHOJSABIAFBHGoQZyICEGYgAhAsIABB1iUgASABQSBqEGciAhBmIAIQLCAAQeQlIAEgAUEkahBnIgIQZiACECwgAEHtJSABIAFBKGoQZyICEGYgAhAsIABBwRAgASABQSxqEGciABBmIAAQLCABQTBqJAALigECAX4CfyAAQQFqIAAgAC0AAEEtRiIEGyIDQQFqIAMgACAEai0AAEErRhsiAC0AACIDQTBrQf8BcUEJTQRAA0AgAkIKfiADrUL/AYNC0P///w98Qv////8Pg3wh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QRBqJAAgAguWAgECfyMAQTBrIgAkACAAIAE2AixBtIsFKAIAIQMCQCABQQBIDQAgAygCnAEgAUgNACADQaABaiIBQbuRARCzBiAAQShqEJAJIABBCGogARCEBCEEIABBADYCGCAAQSBqIABBKGogAEEYahCXAiAAQSBqIAQQjwkgAEEgahAsIAQQLCAAQSBqIANBlAFqIANBmAFqIABBCGogAEEsahBnIgMgAEEoahCOCSADECwgAEEANgIEIABBGGogAEEoaiAAQQRqEJcCIABBCGogAEEYahChASABIABBCGoQjAMgAEEIahA3IABBGGoQLCACIAEQMDYCACAAQSBqEMsDIQQgAEEgahAsIABBKGoQLAsgAEEwaiQAIAQLhgEBAn8jAEEgayIAJAAgACABNgIcQbSLBSgCACEDAkAgAUEASA0AIAMoAoQBIAFIDQAgAEEIaiADQYABaiAAQRxqEJcCIABBEGogAEEIahChASADQYgBaiIBIABBEGoQjAMgAEEQahA3IABBCGoQLCACIAEQMDYCAEEBIQQLIABBIGokACAECwkAIAAQngYQUwsJACAAEKAGEFMLUQECfyMAQRBrIgEkACABIAA2AgwgAUEIakG0iwUoAgBB/ABqIAEgAUEMahDwCCIAEI4DIAFBCGoQkAEhAiABQQhqECwgABAsIAFBEGokACACCw8AIAAgACgCEBCABTkDCAtDAQF/IAAoAqw0BEAgAEGsNGohAkEAIQEDQCACIAEQSigCAEF/NgKEBSABQQFqIgEgAigCAEcNAAsLIABB4N0AahBDCw4AIAAgACgCCBBBOAIECw8AIAAgACgCCBDKAzYCBAsPACAAIAAoAggQkAE2AgQLUwICfwF8IAACfyAAKAIIIQEjAEEQayIAJAAgASgCAEG0ngMoAgAgAEEEahAFIQMgACAAKAIEEF4hASADEJgCIQIgARCiASAAQRBqJAAgAgs7AQQLUwICfwF8IAACfyAAKAIIIQEjAEEQayIAJAAgASgCAEHMnQMoAgAgAEEEahAFIQMgACAAKAIEEF4hASADEPgEIQIgARCiASAAQRBqJAAgAgs7AQQLWwAjAEEQayIBJAAgAkEAQQAQuAEQ9gUiAEUEQCACELEIIQALIAAoAgAhAiABELQIIAAgASkBBjcBBiAAIAEpAwA3AgAgAEEBOgANIAAgAjYCACABQRBqJAAgAAtTAgJ/AXwgAAJ/IAAoAgghASMAQRBrIgAkACABKAIAQeScAygCACAAQQRqEAUhAyAAIAAoAgQQXiEBIAMQmAIhAiABEKIBIABBEGokACACCzoABAtTAgJ/AXwgAAJ/IAAoAgghASMAQRBrIgAkACABKAIAQaScAygCACAAQQRqEAUhAyAAIAAoAgQQXiEBIAMQ+AQhAiABEKIBIABBEGokACACCzoABAvFAQAjAEFAaiIAJAAgACAAQTxqNgIgIAAgAEE4ajYCJAJAIANB2cIAIABBIGoQcEECRgRAIABBNGogAC4BPCAALgE4ELgEIAIgACgCNDYCBAwBCyAAIABBOGo2AhQgACAAQTxqNgIQIANB48IAIABBEGoQcEECRgRAIABBNGogAC4BPCAALgE4ELgEIAIgACgCNDYCCAwBCyAAIABBNGo2AgAgA0HB5AAgABBwQQFHDQAgAiAAKAI0QQBHOgAMCyAAQUBrJAALRgEBfyAAQeDdAGoiARDzASIABEADQCAALQANBEAgACgCABCzCCICBEAgAiAAELIICyAAQQA6AA0LIAEgABCsAiIADQALCwuIBAIGfwF9IwBBQGoiAyQAIABB4N0AaiEFIAAoAqw0BEAgAEGsNGohBgNAIAYgCBBKKAIAIgAtAAlBAXFFBEACfyAAKAKEBSIEQX9HBEAgBSAEENsCDAELIAAoAgQQ9gULIgRFBEAgACAFIAAoAgAQsQgiBBC3BDYChAULAn8gACoCECIJi0MAAABPXQRAIAmoDAELQYCAgIB4CyEHIANBPGoCfyAAKgIMIgmLQwAAAE9dBEAgCagMAQtBgICAgHgLIAcQuAQgBCADKAI8NgIEAn8gACoCICIJi0MAAABPXQRAIAmoDAELQYCAgIB4CyEHIANBPGoCfyAAKgIcIgmLQwAAAE9dBEAgCagMAQtBgICAgHgLIAcQuAQgBCADKAI8NgIIIAQgAC0AjQE6AAwLIAhBAWoiCCAGKAIARw0ACwsgAiACEPoCIAUoAgBBBmxqELAIIAUQ8wEiAARAA0AgABCrAiEEIAEoAgAhBiADIAQ2AjQgAyAGNgIwIAJB65ABIANBMGoQyAEgAC4BBCEEIAMgAC4BBjYCJCADIAQ2AiAgAkHUkAEgA0EgahDIASAALgEIIQQgAyAALgEKNgIUIAMgBDYCECACQd+QASADQRBqEMgBIAMgAC0ADDYCACACQcaQASADEMgBIAJBupEBQQAQ3QMgBSAAEKwCIgANAAsLIANBQGskAAsJACAAEPkDEFMLCQAgABD6AxBTCwkAIAAQ+wMQUwsJACAAEIkDEFMLCQAgABCKAxBTCwkAIAAQ/gMQUwsJACAAELEBEFMLlQIBAn8jAEEwayIAJAAgACABNgIsQbSLBSgCACEDAkAgAUEASA0AIAMoAmggAUwNACADQewAaiIBQbuRARCzBiAAQShqEJAJIABBCGogARCEBCEEIABBADYCGCAAQSBqIABBKGogAEEYahCXAiAAQSBqIAQQjwkgAEEgahAsIAQQLCAAQSBqIANB4ABqIANB5ABqIABBCGogAEEsahBnIgMgAEEoahCOCSADECwgAEEANgIEIABBGGogAEEoaiAAQQRqEJcCIABBCGogAEEYahChASABIABBCGoQjAMgAEEIahA3IABBGGoQLCACIAEQMDYCACAAQSBqEMsDIQQgAEEgahAsIABBKGoQLAsgAEEwaiQAIAQLLAEBfyMAQRBrIgEkACABIAAoAhAQoQEgAEEEaiABEIwDIAEQNyABQRBqJAALCQAgABC+ARBTCwkAIAAQrQYQUwsJACAAEK4GEFMLZQEBfyMAQRBrIgEkACABIAA2AgwgAUEIakG0iwUoAgBBzABqAn8jAEEQayIAJAAgAUG09gIgAEEIaiABQQxqEHMQAzYCACAAQRBqJAAgAQsQjgMgAUEIahAsIAEQLCABQRBqJAALCQAgABCWAhBTC5MBAQR/IwBBIGsiACQAQbSLBSgCACIBQUBrIgMQVEUEQCMAQRBrIgIkACACIAFByABqELgGIQQgAEEIaiADKAIAQQFB4I8DIARB1AYRCAAQXhogAkEQaiQAIABBEGogAEEIahChASABQTRqIABBEGoQjAMgAEEQahA3IABBCGoQLAsgAUE0ahAwIQEgAEEgaiQAIAELnwEBBH8jAEEQayIAJABBtIsFKAIAIgJBNGoiBCABELMGIAJBxABqEFRFBEAjAEEgayIDJAAjAEEQayIBJAAgASADQQhqIgU2AgwgAUEMaiACQcgAahCEARD9ASABQQxqIAQQxgMQ/QEgAUEQaiQAIABBCGogAigCREECQeSPAyAFQdQGEQgAEF4a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IAARCgAhACAIQQhqECwgCEEQahAsIAhBGGoQLCAIQSBqECwgCEEoahAsIAhBMGoQNyAIQUBrJAAgAAt1AQF/IwBBMGsiByQAIAdBIGogARBLIAdBGGogAhAuIAdBEGogAxAuIAdBCGogBBAuIAdBIGogB0EYaiAHQRBqIAdBCGogBSAGIAARDAAhACAHQQhqECwgB0EQahAsIAdBGGoQLCAHQSBqEDcgB0EwaiQAIAALPAEBfyMAQRBrIgQkACAEQQhqIAIQLiAEIAMQLiABIARBCGogBCAAEVEAIAQQLCAEQQhqECwgBEEQaiQAC5QBAQF/IwBBMGsiCCQAIAhBKGogARAuIAhBIGogAhAuIAhBGGogAxAuIAhBEGogBBAuIAhBCGogBhAuIAggBxAuIAhBKGogCEEgaiAIQRhqIAhBEGogBSAIQQhqIAggABEKACEAIAgQLCAIQQhqECwgCEEQahAsIAhBGGoQLCAIQSBqECwgCEEoahAsIAhBMGokACAAC44BAQF/IwBBMGsiByQAIAdBKGogARAuIAdBIGogAhAuIAdBGGogAxAuIAdBEGogBBAuIAdBCGogBRAuIAcgBhAuIAdBKGogB0EgaiAHQRhqIAdBEGogB0EIaiAHIAARDQAgBxAsIAdBCGoQLCAHQRBqECwgB0EYahAsIAdBIGoQLCAHQShqECwgB0EwaiQACykBAX8jAEEQayICJAAgAiABEEsgAiAAEQIAIQAgAhA3IAJBEGokACAAC0cBAX8jAEEgayIDJAAgA0EQaiABEEsgA0EIaiACEC4gA0EQaiADQQhqIAARAwAhACADQQhqECwgA0EQahA3IANBIGokACAACzoBAX8jAEEgayIDJAAgA0EQaiABEEsgAyACEEsgA0EQaiADIAARAAAgAxA3IANBEGoQNyADQSBqJAALQwEBfyMAQSBrIgMkACADQRhqIAEQLiADQQhqIAIQSyADQRhqIANBCGogABEAACADQQhqEDcgA0EYahAsIANBIGokAAs8AQF/IwBBEGsiAiQAIAJBCGogARAuIAIgAkEIaiAAEQIANgIMIAIoAgwhACACQQhqECwgAkEQaiQAIAALPgEBfyMAQRBrIgMkACADQQhqIAIQLiADIAEgA0EIaiAAEQMANgIMIAMoAgwhACADQQhqECwgA0EQaiQAIAALMAEBfyMAQRBrIgMkACADQQhqIAIQLiABIANBCGogABEAACADQQhqECwgA0EQaiQACwsAIAEgAiAAESIACykBAX8jAEEQayIEJAAgBCABEEsgBCACIAMgABEEACAEEDcgBEEQaiQAC0UBAX8jAEEgayIEJAAgBEEQaiABEEsgBEEIaiACEC4gBEEQaiAEQQhqIAMgABEEACAEQQhqECwgBEEQahA3IARBIGokAAsJACABIAARFAALZAEBfyMAQSBrIgUkACAFQRhqIAEQLiAFQRBqIAIQLiAFQQhqIAMQLiAFIAQQLiAFQRhqIAVBEGogBUEIaiAFIAARBgAgBRAsIAVBCGoQLCAFQRBqECwgBUEYahAsIAVBIGokAAswAQF/IwBBEGsiAyQAIANBCGogARAuIANBCGogAiAAEQAAIANBCGoQLCADQRBqJAALPAEBfyMAQRBrIgQkACAEQQhqIAEQLiAEIAMQLiAEQQhqIAIgBCAAEQQAIAQQLCAEQQhqECwgBEEQaiQACykCAX8BfSMAQRBrIgEkACABIAAREgA4AgwgASoCDCECIAFBEGokACACCz0BAX8jAEEQayICJAAgAiABEC4gAkEIaiACIAARAAAgAkEIahCEASEAIAJBCGoQLCACECwgAkEQaiQAIAALQgEBfyMAQRBrIgUkACAFQQhqIAEQLiAFIAIQLiAFQQhqIAUgAyAEIAARCAAhACAFECwgBUEIahAsIAVBEGokACAACygBAX8jAEEQayIBJAAgASAAEQEAIAEQxgMhACABEDcgAUEQaiQAIAALJQEBfyMAQRBrIgIkACACIAEQSyACIAARAQAgAhA3IAJBEGokAAsuAQF/IwBBEGsiAiQAIAJBCGogARAuIAJBCGogABEBACACQQhqECwgAkEQaiQACwcAIAARBwALCQAgABDpCBBICygBAX8jAEEQayICJAAgAiABEFA2AgwgACACQQxqEOgIGiACQRBqJAALUAEBfwJAQbSLBSgCACIDQawBaiAAEHEgA0GwAWogARBxIANBtAFqIAIQcQJAIAAQVEUEQCABEFRFDQELQQBBABCHCQwBC0HgBkHhBhCHCQsLFQAgABAwIAEgAiADIAQgBSAGEI8ICw0AIABBABD1BRCYARoLCwAgABAwQQAQ/wcLJgEBfyMAQRBrIgEkACABIAAQoQEgARAw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IiADEIIBISMgASACKAIEQYDAA3FBgEBqIgNBgIACSQR/IANBC3ZBwO0CaigCAAVB8fYACzYC4AIgASAjuzkD2AIgASAiuzkD0AIgASAguzkDyAIgASAhuzkDwAJB940BIAFBwAJqEGkgAioCwAEhICACKgLEASEiIAEgAioCvAEiI7s5A7ACQwAAAAAhISABQYKHAUG7kQEgI0MAAAAAWxs2ArgCIAEgIrs5A6gCIAEgILs5A6ACQbMrIAFBoAJqEGkgAioCpAEhICACKgKsASEiIAIqArABISMgASACKgKgAbs5A5gCIAEgI7s5A5ACIAEgIrs5A4gCIAEgILs5A4ACQYDNACABQYACahBpIAIsAIAEIQMgASACLACBBDYC9AEgASADNgLwAUGr5gAgAUHwAWoQaSACLACDBCEDIAIsAIYEIQYgASACLACFBDYC6AEgASAGNgLkASABIAM2AuABQZDnACABQeABahBpQQAhAwJAIAIoAlRBAEwNACACQQxqIQgDQCAIIAMQOC0AAEEEcQRAICEgCCADEDgqAhiSISELIANBAWoiAyACKAJUIglIDQALQQAhBiAJQQBMDQAgAUGwA2ohDiABQUBrIRIDQCAIIAYQOCEDIAIgBhCxBSETQYqHAUG7kQEgBiACLACOBEgbIRQgAy0AWSEVIAMtAFghFiADLQBfIRcgAy0AXiEYIAMtAF0hGSADLQBcIRogAy0AWiEbIAMsAFIhHCADKgIYIiK7ISsgAyoCFLshLCADKgIQuyEtIAMqAgS7IS4gAyoCDCIjIAIqAvQBIiCTuyEvIAMqAggiJCAgk7shMCADKgIoISUgAy0AZCEdIAMqAkAhJyADKgJEISggAyoCSCEpIAMqAkwhKiADKgI0ISAgAyoCICEmIAMsAFYhHiADKAIwIR8gASADKAIAIgk2AsQBIAEgHzYCwAEgASAeNgK4ASABICa7OQOAASABICMgJJO7OQN4IAEgI7s5A3AgASAkuzkDaCABICIgIZVDAADIQpRDAAAAACAiQwAAAABeG7s5A2AgASArOQNYIAEgLDkDUCABIC05A0ggEiAuOQMAIAEgFTYCPCABIBY2AjggASAXNgI0IAEgGDYCMCABIBk2AiwgASAaNgIoIAEgGzYCJCABIBQ2AiAgASAvOQMYIAEgMDkDECABQe+PAUG7kQEg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AUH4NGpCADcDACABQYA1akEANgIAIAFBjDVqQQBBKxBGGiABQcA1akIANwMAIAFCADcDuDUgBkMAAIC/QwAAgL8QKxogByAGKQMANwMAIAFBADYC7DUgAUIANwLkNSABQgA3A9A1IAFB2DVqQgA3AwAgAUHgNWpBADsBACABQcQ3akEAQTQQRhogBhBPGiAFIAYpAwg3AgggBSAGKQMANwIAIAFBADYCvDggAUIANwK0OCABQQA6ALA4IAFBADYCnDggAUEBOgCWOCABQQA7AZQ4IAFB/////wc2ApA4IAFCADcDiDggAUF/NgLIOCABQQA2AJc4IAFCfzcDwDggAUIANwLkOSABQgA3AsQ5IAFBzDlqQgA3AgAgAUHUOWpCADcCACABQdk5akIANwAAIAFB/////wc2AvA5IAFB/////wc2Auw5IAFC//////f/////ADcC9DkgAUH4OmpBqNsANgIAIAFBiDxqQbXbADYCACABQQA2AvA8IAFBADYCxDogAUEAOgD8OSABQQA2Aug8IAFB6zxqQQA2AAAgAUJ/NwL0PCABQgA3AsQ9IAFBzD1qQgA3AgAgAUHUPWpBADYCACABQQA2AsA+IAFC/////w83A9g9IAFCADcC7D0gAUH0PWpCADcCACABQfw9akEANgIAIAZDAAAAAEMAAAAAECsaIAggBikDADcDACABQoCAgICAgIDICjcD0FwgAUHo3ABqQf////sHNgIAIAFCADcD2FwgAUGAgID4AzYClF0gAUIANwKMXSABQoCAgICg4fWRPDcChF0gAUEAOwGAXSABQQA2AvxcIAFC////+/f//7//ADcD4FwgBkP//39/Q///f38QKxogCSAGKQMAIg83AwAgCiAPNwMAIAFBAjYCrF4gAUEAOgCgXiABQf////sHNgKcXiABQgA3A4heIAFBADoAhF4gAUEANgLEXSABQS47AcBdIAFBADYCtF4gAUEAOgCwXiABQoCAgIAgNwKkXiABQcjeAGpBAEHoAxBGGiABQX82ArhiIAFCfzcDsGIgAUG84gBqQQBBgRgQRhogBkEQaiQAQZDdAygCAEUEQCABELECCyMAQTBrIgIkACACQQhqEMcGIgBBuA02AgBBuA1BAEEAELgBIQQgAEEENgIcIABBBTYCGCAAQQY2AhQgAEEHNgIQIABBCDYCCCAAIAQ2AgQgAUHU3QBqIAAQ+AMjAEEwayIEJAAgBEEIahDHBiIAQdnYADYCAEHZ2ABBAEEAELgBIQYgAEEONgIcIABBDzYCGCAAQRA2AhQgAEERNgIQIABBEjYCCCAAIAY2AgQgAUHU3QBqIAAQ+AMgBEEwaiQAIAFBAToAACACQTBqJAAgAQs2AgAgA0EEakG7kQEQmAEaIANBEGpBu5EBEJgBGiADQRxqEH8gA0EgahB/IANBJGoQfyADQShqEH8gA0EsahB/IANBMGoQfyADQTRqQbuRARCYARogA0FAaxB/IANBxABqEH8gA0HIAGoQfyADQcwAahCfASADQdAAahCfASADQdQAahCfASADQdgAahCfASADQdwAahCfASADQeAAahCfASADQeQAahCfASADQQA2AmggA0HsAGpBu5EBEJgBGiADQfgAahCfASADQfwAahCfASADQYABahCfASADQQA2AoQBIANBiAFqQbuRARCYARogA0GUAWoQnwEgA0GYAWoQnwEgA0EANgKcASADQaABakG7kQEQmAEaIANBrAFqEJ8BIANBsAFqEJ8BIANBtAFqEJ8BQZDdAygCACEBIAMoAgAQsQIQzgQiAEEANgLQASAAQdUGNgLMASAAQdYGNgLIASAAQgA3AxggARCxAiADCxcAQfT/AEGQKkGUCEEIQRBBFEECEI8ICzwBAX9BkN0DKAIAQZjdAGoiABBDIAAgARBtIgJBAWoQvwEgAEEAENsCIAEgAhA5GiAAIAIQ2wJBADoAAAsLAEGUCBDRARDOCQtGAQF/IwBBEGsiAyQAIAFBNE0EQCADIAIQ6gEgACABQQR0aiIAIAMpAwg3AswBIAAgAykDADcCxAELIANBEGokACABQTVJC14BAX8jAEEQayIDJAACQCACQTRNBEAgAyABIAJBBHRqQcQBajYCDCMAQRBrIgEkACAAQdTzAiABQQhqIANBDGoQcxADNgIAIAFBEGokAAwBCyAAEJ8BCyADQRBqJAALKAEBfyMAQRBrIgIkACACIAFBrAFqNgIMIAAgAkEMahB+IAJBEGokAAsoAQF/IwBBEGsiAiQAIAIgAUGkAWo2AgwgACACQQxqEH4gAkEQaiQACygBAX8jAEEQayICJAAgAiABQZwBajYCDCAAIAJBDGoQfiACQRBqJAALKAEBfyMAQRBrIgIk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ZW1Db3VudDogJWQsIFZ0eE9mZnNldDogKyVkLCBJZHhPZmZzZXQ6ICslZCwgQXJlYTogfiUwLmYgcHgAQ2hlY2tib3gAUGF0aEZpbGxDb252ZXgAIyNoZXgAR2V0S2V5SW5kZXgAVGFibGVHZXRSb3dJbmRleABUYWJsZVNldENvbHVtbkluZGV4AFRhYmxlR2V0Q29sdW1uSW5kZXgAQW50aUFsaWFzZWRMaW5lc1VzZVRleABIZXgAUHJpbVdyaXRlSWR4ACMjbWF4AEdldENsaXBSZWN0TWF4AEdldEl0ZW1SZWN0TWF4AEdldFdpbmRvd0NvbnRlbnRSZWdpb25NYXgAR2V0Q29udGVudFJlZ2lvbk1heAAjI1BvcHVwXyUwOHgALSsgICAwWDB4AC0wWCswWCAwWC0weCsweCAweABCZWdpblBvcHVwQ29udGV4dFdpbmRvdwBTaG93QWJvdXRXaW5kb3cAUm9vdFdpbmRvdwBQYXJlbnRXaW5kb3cAU2hvd01ldHJpY3NXaW5kb3cAU2hvd0RlbW9XaW5kb3cAIENoaWxkV2luZG93AEJvcmRlclNoYWRvdwBUYWJsZU5leHRSb3cAVGFibGVIZWFkZXJzUm93ACMjcHJldmlldwAjI2hzdgBOYXYAIyN2ACMjQ29udGV4dE1lbnUAQmVnaW5NZW51AEVuZE1lbnUAIENoaWxkTWVudQAlbGx1ACV1AGltZ3VpX2xvZy50eHQAd2luZG93X2NvbnRleHQAdm9pZF9jb250ZXh0AERlc3Ryb3lDb250ZXh0AFNldEN1cnJlbnRDb250ZXh0AEdldEN1cnJlbnRDb250ZXh0AFdyYXBJbUd1aUNvbnRleHQAQ3JlYXRlQ29udGV4dABDb25maWdEcmFnQ2xpY2tUb0lucHV0VGV4dABCdWxsZXRUZXh0AExhYmVsVGV4dABMb2dUZXh0AFNldENsaXBib2FyZFRleHQAR2V0Q2xpcGJvYXJkVGV4dAAjI1RleHQAd3QAV2FudFRleHRJbnB1dABEZWJ1Z0NoZWNrVmVyc2lvbkFuZERhdGFMYXlvdXQAa2VlcGNvc3QAYXV0byBFbXNjcmlwdGVuQmluZGluZ0luaXRpYWxpemVyX0ltR3VpOjpFbXNjcmlwdGVuQmluZGluZ0luaXRpYWxpemVyX0ltR3VpKCk6Oihhbm9ueW1vdXMgY2xhc3MpOjpvcGVyYXRvcigpKGVtc2NyaXB0ZW46OnZhbCkgY29uc3QAYXV0byBFbXNjcmlwdGVuQmluZGluZ0luaXRpYWxpemVyX0ltRm9udENvbmZpZzo6RW1zY3JpcHRlbkJpbmRpbmdJbml0aWFsaXplcl9JbUZvbnRDb25maWcoKTo6KGFub255bW91cyBjbGFzcyk6Om9wZXJhdG9yKCkoSW1Gb250Q29uZmlnICYsIGVtc2NyaXB0ZW46OnZhbCkgY29uc3QAYXV0byBFbXNjcmlwdGVuQmluZGluZ0luaXRpYWxpemVyX0ltR3VpOjpFbXNjcmlwdGVuQmluZGluZ0luaXRpYWxpemVyX0ltR3VpKCk6Oihhbm9ueW1vdXMgY2xhc3MpOjpvcGVyYXRvcigpKCkgY29uc3QAYXV0byBFbXNjcmlwdGVuQmluZGluZ0luaXRpYWxpemVyX0ltRm9udENvbmZpZzo6RW1zY3JpcHRlbkJpbmRpbmdJbml0aWFsaXplcl9JbUZvbnRDb25maWcoKTo6KGFub255bW91cyBjbGFzcyk6Om9wZXJhdG9yKCkoY29uc3QgSW1Gb250Q29uZmlnICYpIGNvbnN0AEdldFdpbmRvd0RyYXdMaXN0AEltRHJhd0xpc3QAR2V0QmFja2dyb3VuZERyYXdMaXN0AEdldEZvcmVncm91bmREcmF3TGlzdAAjIyNOYXZXaW5kb3dpbmdMaXN0AE1vdXNlRG91YmxlQ2xpY2tNYXhEaXN0AFBhdGhBcmNUb0Zhc3QAdW5zaWduZWQgc2hvcnQARGlzcGxheVN0YXJ0AFNlbGVjdGlvblN0YXJ0AEdldEtleVByZXNzZWRBbW91bnQAVG90YWxWdHhDb3VudABUb3RhbElkeENvdW50AENtZExpc3RzQ291bnQAR2V0Q29sdW1uc0NvdW50AEl0ZW1zQ291bnQAU3BlY3NDb3VudABUYWJsZUdldENvbHVtbkNvdW50AEVsZW1Db3VudABHZXRGcmFtZUNvdW50AENvbmZpZ0RhdGFDb3VudABEc3RGb250AEdldEZvbnQAUG9wRm9udABJbUZvbnQAUHVzaEZvbnQAQ29kZXBvaW50AElucHV0VGV4dFdpdGhIaW50AHVuc2lnbmVkIGludABDb250ZW50ACMjY3VycmVudABDaGFubmVsc1NldEN1cnJlbnQAVW5pbmRlbnQASW5kZW50AERlc2NlbnQAQXNjZW50AElucHV0SW50AFZTbGlkZXJJbnQARHJhZ0ludABBZGRGb250RGVmYXVsdABHZXRHbHlwaFJhbmdlc0RlZmF1bHQARGVidWcjI0RlZmF1bHQASXNCdWlsdABLZXlBbHQAVGFibGVSb3dCZ0FsdABDaGFubmVsc1NwbGl0AElzSXRlbURlYWN0aXZhdGVkQWZ0ZXJFZGl0AEZpeGVkRml0AE5hdkhpZ2hsaWdodABOYXZXaW5kb3dpbmdIaWdobGlnaHQAaGVpZ2h0AFdlaWdodABUZXhIZWlnaHQAR2V0V2luZG93SGVpZ2h0AEl0ZW1zSGVpZ2h0AEdldFRleHRMaW5lSGVpZ2h0AEdldEZyYW1lSGVpZ2h0AFN0eWxlQ29sb3JzTGlnaHQAVGFibGVCb3JkZXJMaWdodABLZXlTaGlmdABWdHhPZmZzZXQASWR4T2Zmc2V0AEltRHJhd1ZlcnRQb3NPZmZzZXQAU2V0Q29sdW1uT2Zmc2V0AEdldENvbHVtbk9mZnNldABJbURyYXdWZXJ0Q29sT2Zmc2V0AEdseXBoT2Zmc2V0AGJ5dGVPZmZzZXQASW1EcmF3VmVydFVWT2Zmc2V0AEJ1bGxldABCZWdpbkRyYWdEcm9wVGFyZ2V0AEVuZERyYWdEcm9wVGFyZ2V0AFNldABDb2x1bW5zUmVjdABPdXRlclJlY3QASW5uZXJSZWN0AEhvc3RDbGlwUmVjdABDb2x1bW5zQ2xpcFJlY3QASW5uZXJDbGlwUmVjdABQb3BDbGlwUmVjdABQdXNoQ2xpcFJlY3QAQmFja2dyb3VuZENsaXBSZWN0AENvbnRlbnRSZWdpb25SZWN0AFByaW1SZWN0AENvbHVtbnNXb3JrUmVjdABQYXRoUmVjdABJc01vdXNlSG92ZXJpbmdSZWN0AEFkZFJlY3QAZmxvYXQASW5wdXRGbG9hdABWU2xpZGVyRmxvYXQARHJhZ0Zsb2F0AFBvcEJ1dHRvblJlcGVhdABQdXNoQnV0dG9uUmVwZWF0AHVpbnQ2NF90AFNldHRpbmdzV2luZG93cwBNZXRyaWNzUmVuZGVyV2luZG93cwBNZXRyaWNzQWN0aXZlV2luZG93cwBDaGlsZFdpbmRvd3MAU2V0TmV4dFdpbmRvd0ZvY3VzAFNldFdpbmRvd0ZvY3VzAFNldEl0ZW1EZWZhdWx0Rm9jdXMAU2V0V2luZG93TmFtZUZvY3VzAFBvcEFsbG93S2V5Ym9hcmRGb2N1cwBQdXNoQWxsb3dLZXlib2FyZEZvY3VzAE5vTmF2SW5wdXRzAF9zZXRBdF9OYXZJbnB1dHMAX2dldEF0X05hdklucHV0cwBOb01vdXNlSW5wdXRzAEl0ZXJhdGVEcmF3TGlzdHMAQ2xlYXJGb250cwBJdGVyYXRlRm9udHMAU2V0TmV4dFdpbmRvd1NpemVDb25zdHJhaW50cwBTY2FsZUNsaXBSZWN0cwBfc2V0QXRfQ29sb3JzAF9nZXRBdF9Db2xvcnMAQ29uZmlnTWFjT1NYQmVoYXZpb3JzAENsZWFySW5wdXRDaGFyYWN0ZXJzAFNldHRpbmdzSGFuZGxlcnMARGVJbmRleEFsbEJ1ZmZlcnMASW5zZXJ0Q2hhcnMARGVsZXRlQ2hhcnMAVGFiQmFycwBQb3B1cHMARGlzcGxheVBvcwBTZXROZXh0V2luZG93UG9zAFNldFdpbmRvd1BvcwBHZXRXaW5kb3dQb3MAR2V0Q3Vyc29yU3RhcnRQb3MAU2V0Q3Vyc29yUG9zAEdldEN1cnNvclBvcwBQb3BUZXh0V3JhcFBvcwBQdXNoVGV4dFdyYXBQb3MAU2V0Q3Vyc29yU2NyZWVuUG9zAEdldEN1cnNvclNjcmVlblBvcwBXYW50U2V0TW91c2VQb3MAR2V0TW91c2VQb3MAU2V0V2luZG93TmFtZVBvcwBfZ2V0QXRfTW91c2VDbGlja2VkUG9zAExvZ0J1dHRvbnMAU2V0Q29sb3JFZGl0T3B0aW9ucwBTZXRBbGxvY2F0b3JGdW5jdGlvbnMAJWQgYWN0aXZlIGFsbG9jYXRpb25zAE1ldHJpY3NBY3RpdmVBbGxvY2F0aW9ucwBjb2x1bW5zAENvbHVtbnMAVG9vbHMAcGl4ZWxzAFNpemVQaXhlbHMARXF1YWxzAHVzbWJsa3MAZnNtYmxrcwBoYmxrcwB1b3JkYmxrcwBmb3JkYmxrcwBJdGVyYXRlR2x5cGhzAENsZWFyIHNldHRpbmdzAFdhbnRTYXZlSW5pU2V0dGluZ3MAQ2hlY2tib3hGbGFncwBSYXN0ZXJpemVyRmxhZ3MAVGFibGVHZXRDb2x1bW5GbGFncwBDb25maWdGbGFncwBCYWNrZW5kRmxhZ3MAU2NhbGVBbGxTaXplcwBTZXR0aW5ncyBwYWNrZWQgZGF0YTogV2luZG93czogJWQgYnl0ZXMAU2V0dGluZ3MgcGFja2VkIGRhdGE6IFRhYmxlczogJWQgYnl0ZXMAU2V0dGluZ3MgdW5wYWNrZWQgZGF0YSAoLmluaSk6ICVkIGJ5dGVzACVzOiAlZCBlbnRyaWVzLCAlZCBieXRlcwBQbG90TGluZXMAQW50aUFsaWFzZWRMaW5lcwBTaG93IHdpbmRvd3MgcmVjdGFuZ2xlcwBTaG93IHRhYmxlcyByZWN0YW5nbGVzAFNldHRpbmdzVGFibGVzAEdseXBoUmFuZ2VzAENvbmZpZ1dpbmRvd3NSZXNpemVGcm9tRWRnZXMATWV0cmljc1JlbmRlclZlcnRpY2VzAE1ldHJpY3NSZW5kZXJJbmRpY2VzAERlcwAlczogJyVzJyAlZCB2dHgsICVkIGluZGljZXMsICVkIGNtZHMASXRlcmF0ZURyYXdDbWRzAFRhYmxlR2V0U29ydFNwZWNzAEltR3VpVGFibGVTb3J0U3BlY3MASW1HdWlUYWJsZVNvcnRDb2x1bW5TcGVjcwBGb250RGF0YU93bmVkQnlBdGxhcwBJbUZvbnRBdGxhcwAKJSpzJS4qcwAgJS4qcwBTY3JvbGw6ICglLjJmLyUuMmYsJS4yZi8lLjJmKSBTY3JvbGxiYXI6JXMlcwBQb3B1cElEOiAlMDh4LCBXaW5kb3c6ICclcyclcyVzAENvbHVtbnNHaXZlbldpZHRoOiAlLjFmLCBDb2x1bW5zQXV0b0ZpdFdpZHRoOiAlLjFmLCBJbm5lcldpZHRoOiAlLjFmJXMAJXMgMHglMDhYICglZCB0YWJzKSVzAFRhYmxlIDB4JTA4WCAoJWQgY29sdW1ucywgaW4gJyVzJyklcwAlcyAnJXMnJXMARGVhciBJbUd1aSAlcwAoJTYuMWYsJTYuMWYpICglNi4xZiwlNi4xZikgU2l6ZSAoJTYuMWYsJTYuMWYpIENvbCAlZCAlcwBOYXZMYXN0Q2hpbGROYXZXaW5kb3c6ICVzACUlczogJXMATmF2SW5wdXRTb3VyY2U6ICVzAEFjdGl2ZUlkOiAweCUwOFgvMHglMDhYICglLjJmIHNlYyksIEFsbG93T3ZlcmxhcDogJWQsIFNvdXJjZTogJXMAKCU2LjFmLCU2LjFmKSAoJTYuMWYsJTYuMWYpIFNpemUgKCU2LjFmLCU2LjFmKSAlcwBTaG93U3R5bGVFZGl0b3IAdmVjdG9yAFNob3dGb250U2VsZWN0b3IAU2hvd1N0eWxlU2VsZWN0b3IAU2VwYXJhdG9yAE1vdXNlRHJhd0N1cnNvcgBTZXRNb3VzZUN1cnNvcgBHZXRNb3VzZUN1cnNvcgBDaXJjbGVTZWdtZW50TWF4RXJyb3IAQWRkUmVjdEZpbGxlZE11bHRpQ29sb3IAVGFibGVTZXRCZ0NvbG9yAFBvcFN0eWxlQ29sb3IAUHVzaFN0eWxlQ29sb3IATGlzdEJveEZvb3RlcgBBZGRJbnB1dENoYXJhY3RlcgBLZXlTdXBlcgBJbUd1aUxpc3RDbGlwcGVyAENvbmZpZ01lbW9yeUNvbXBhY3RUaW1lcgAjI3ByZXZpZXdpbmdfcGlja2VyACMjcGlja2VyAERlYXIgSW1HdWkgTWV0cmljcy9EZWJ1Z2dlcgBidWZmZXIAVnR4QnVmZmVyAElkeEJ1ZmZlcgBCb3JkZXIAUmVzZXQgb3JkZXIAU2hvdyB3aW5kb3dzIGJlZ2luIG9yZGVyAFNvcnRPcmRlcgBSZW5kZXIAVGFibGVIZWFkZXIAbnVtYmVyAElucHV0U2NhbGFyAFZTbGlkZXJTY2FsYXIARHJhZ1NjYWxhcgB1bnNpZ25lZCBjaGFyAEV2ZW50Q2hhcgBFbGxpcHNpc0NoYXIAUmVuZGVyQ2hhcgBTZXRGYWxsYmFja0NoYXIAUGF0aENsZWFyACMjbWVudWJhcgBQb3BTdHlsZVZhcgBQdXNoU3R5bGVWYXIAQmVnaW5NZW51QmFyAEJlZ2luTWFpbk1lbnVCYXIARW5kTWFpbk1lbnVCYXIAIyNNYWluTWVudUJhcgBFbmRNZW51QmFyAFByb2dyZXNzQmFyAEJlZ2luVGFiQmFyAEVuZFRhYkJhcgBBbHBoYSBCYXIAbWF4cABHZXRNb3VzZVBvc09uT3BlbmluZ0N1cnJlbnRQb3B1cABDbG9zZUN1cnJlbnRQb3B1cABCZWdpblBvcHVwAE9wZW5Qb3B1cABFbmRQb3B1cABCZWdpbkdyb3VwAEVuZEdyb3VwAENhcHR1cmVNb3VzZUZyb21BcHAAQ2FwdHVyZUtleWJvYXJkRnJvbUFwcABTdHJldGNoUHJvcABUcmVlUG9wAFNldFRvb2x0aXAAQmVnaW5Ub29sdGlwAEVuZFRvb2x0aXAAUmVzaXplR3JpcABTdGVwAGNtYXAAU2V0SXRlbUFsbG93T3ZlcmxhcABfc2V0QXRfS2V5TWFwAF9nZXRBdF9LZXlNYXAAQ2FsbGJhY2sgJXAsIHVzZXJfZGF0YSAlcABtYWxsaW5mbwBCZWdpbkNvbWJvAEVuZENvbWJvAFBhdGhCZXppZXJRdWFkcmF0aWNDdXJ2ZVRvAFBhdGhCZXppZXJDdWJpY0N1cnZlVG8AUGF0aExpbmVUbwBQYXRoQXJjVG8ARm9udE5vAFN0ZXBObwBVbmtub3duAElzS2V5RG93bgBfc2V0QXRfS2V5c0Rvd24AX2dldEF0X0tleXNEb3duAElzQW55TW91c2VEb3duAElzTW91c2VEb3duAF9zZXRBdF9Nb3VzZURvd24AX2dldEF0X01vdXNlRG93bgAjU291cmNlRXh0ZXJuAGtlcm4AQXJyb3dCdXR0b24AIyNDb2xvckJ1dHRvbgBUYWJJdGVtQnV0dG9uAFNtYWxsQnV0dG9uAFRhYk1pbldpZHRoRm9yQ2xvc2VCdXR0b24ASW52aXNpYmxlQnV0dG9uAEltYWdlQnV0dG9uAEdldEdseXBoUmFuZ2VzQ2hpbmVzZVNpbXBsaWZpZWRDb21tb24Ac3RkOjpleGNlcHRpb24AV2luZG93TWVudUJ1dHRvblBvc2l0aW9uAENvbG9yQnV0dG9uUG9zaXRpb24AU29ydERpcmVjdGlvbgBIYXNTZWxlY3Rpb24AX19jeGFfZ3VhcmRfYWNxdWlyZSBkZXRlY3RlZCByZWN1cnNpdmUgaW5pdGlhbGl6YXRpb24AX2dldEF0X0tleXNEb3duRHVyYXRpb24AX2dldEF0X05hdklucHV0c0Rvd25EdXJhdGlvbgBfZ2V0QXRfTW91c2VEb3duRHVyYXRpb24AR2V0VmVyc2lvbgBBZGROZ29uAFRhYmxlTmV4dENvbHVtbgBUYWJsZVNldHVwQ29sdW1uACMjbWluAEJlZ2luAEdldENsaXBSZWN0TWluAEdldEl0ZW1SZWN0TWluAEdldFdpbmRvd0NvbnRlbnRSZWdpb25NaW4AQnV0dG9uVGV4dEFsaWduAFNlbGVjdGFibGVUZXh0QWxpZ24AV2luZG93VGl0bGVBbGlnbgBDb2x1bW5zQ29udGVudFVuZnJvemVuAENvbHVtbnNDb250ZW50RnJvemVuAEl0ZW1zRnJvemVuAElzUG9wdXBPcGVuAFNldE5leHRJdGVtT3BlbgBJc0l0ZW1Ub2dnbGVkT3BlbgBQdXNoQ2xpcFJlY3RGdWxsU2NyZWVuAEJ1ZlRleHRMZW4AbmFuAEdldEdseXBoUmFuZ2VzS29yZWFuAFNldENsaXBib2FyZFRleHRGbgBHZXRDbGlwYm9hcmRUZXh0Rm4AV2VpZ2h0PSVmJW4AT3JkZXI9JWQlbgBXaWR0aD0lZCVuAFZpc2libGU9JWQlbgBDb2x1bW4gJWQlbgBTb3J0PSVkJWMlbgBVc2VySUQ9MHglMDhYJW4AQmVnaW5Qb3B1cENvbnRleHRJdGVtAEJlZ2luVGFiSXRlbQBFbmRUYWJJdGVtAFBsb3RIaXN0b2dyYW0AS2V5Q3RybABib29sAEN1cnZlVGVzc2VsbGF0aW9uVG9sAEdldEdseXBoUmFuZ2VzQ2hpbmVzZUZ1bGwAQW50aUFsaWFzZWRGaWxsAFNpemUgYWxsIGNvbHVtbnMgdG8gZGVmYXVsdCMjI1NpemVBbGwAU2l6ZSBhbGwgY29sdW1ucyB0byBmaXQjIyNTaXplQWxsAEdldENvbnRlbnRSZWdpb25BdmFpbABieXRlc19wZXJfcGl4ZWwAR2V0Rm9udFRleFV2V2hpdGVQaXhlbABNb3VzZVdoZWVsAGVtc2NyaXB0ZW46OnZhbAAjI29yaWdpbmFsAE9yaWdpbmFsAENvbnRlbnRJZGVhbABDb2x1bW5zQ29udGVudEhlYWRlcnNJZGVhbABCZWdpblBvcHVwTW9kYWwAU2F2ZSB0byBkaXNrAENoZWNrTWFyawBTdHlsZUNvbG9yc0RhcmsAQ29uZmlnSW5wdXRUZXh0Q3Vyc29yQmxpbmsAT3BlblBvcHVwT25JdGVtQ2xpY2sARmluZEdseXBoTm9GYWxsYmFjawBBZGRDYWxsYmFjawBpbWd1aS5pbmkAIyNJbmkAR2V0R2x5cGhSYW5nZXNUaGFpAFBvcz0laSwlaQBTaXplPSVpLCVpAERlZmF1bHQgRGVwdGgAbGVuZ3RoAGJ5dGVMZW5ndGgAd2lkdGgAVGV4V2lkdGgAR2V0V2luZG93V2lkdGgAR2V0V2luZG93Q29udGVudFJlZ2lvbldpZHRoAFNldENvbHVtbldpZHRoAEdldENvbHVtbldpZHRoAFNldE5leHRJdGVtV2lkdGgAUG9wSXRlbVdpZHRoAFB1c2hJdGVtV2lkdGgAQ2FsY0l0ZW1XaWR0aABUZXhEZXNpcmVkV2lkdGgAI1RyZWVQdXNoAExvZ0ZpbmlzaABJbUZvbnRHbHlwaABGYWxsYmFja0dseXBoAEZpbmRHbHlwaABUYWJsZUJvcmRlclN0cm9uZwB1bnNpZ25lZCBsb25nAHN0ZDo6d3N0cmluZwBiYXNpY19zdHJpbmcAc3RkOjpzdHJpbmcAc3RkOjp1MTZzdHJpbmcAc3RkOjp1MzJzdHJpbmcAU2hvdyBJbURyYXdDbWQgYm91bmRpbmcgYm94ZXMgd2hlbiBob3ZlcmluZwBTaG93IEltRHJhd0NtZCBtZXNoIHdoZW4gaG92ZXJpbmcASXNXaW5kb3dBcHBlYXJpbmcAQ2FsY0xpc3RDbGlwcGluZwBGb250QWxsb3dVc2VyU2NhbGluZwBJc01vdXNlRHJhZ2dpbmcAV2luZG93Um91bmRpbmcAU2Nyb2xsYmFyUm91bmRpbmcAUG9wdXBSb3VuZGluZwBGcmFtZVJvdW5kaW5nAENoaWxkUm91bmRpbmcAR3JhYlJvdW5kaW5nAFRhYlJvdW5kaW5nAERpc3BsYXlXaW5kb3dQYWRkaW5nAENlbGxQYWRkaW5nAFRleEdseXBoUGFkZGluZwBBbGlnblRleHRUb0ZyYW1lUGFkZGluZwBUb3VjaEV4dHJhUGFkZGluZwBEaXNwbGF5U2FmZUFyZWFQYWRkaW5nAEluZGVudFNwYWNpbmcASXRlbUlubmVyU3BhY2luZwBDb2x1bW5zTWluU3BhY2luZwBJdGVtU3BhY2luZwBHZXRUcmVlTm9kZVRvTGFiZWxTcGFjaW5nAEdldFRleHRMaW5lSGVpZ2h0V2l0aFNwYWNpbmcAR2V0RnJhbWVIZWlnaHRXaXRoU3BhY2luZwBHbHlwaEV4dHJhU3BhY2luZwBJbUZvbnRDb25maWcAJS4wZiBkZWcARXZlbnRGbGFnAFdpbmRvd0JnAFRhYmxlUm93QmcAVGFibGVIZWFkZXJCZwBTY3JvbGxiYXJCZwBNZW51QmFyQmcAUG9wdXBCZwBNb2RhbFdpbmRvd0RpbUJnAE5hdldpbmRvd2luZ0RpbUJnAEZyYW1lQmcAVGl0bGVCZwBDaGlsZEJnAFRleHRTZWxlY3RlZEJnACVkOiAlOC40ZwolZDogJTguNGcAZ2x5ZgBCdWYAaW5mACVsZgAgV2VpZ2h0PSUuNGYAVjolMC4zZgBTOiUwLjNmAFI6JTAuM2YASDolMC4zZgBHOiUwLjNmAEI6JTAuM2YAQTolMC4zZgAlczogJS4zZgBIOiAlLjNmLCBTOiAlLjNmLCBWOiAlLjNmAEg6ICUuM2YsIFM6ICUuM2YsIFY6ICUuM2YsIEE6ICUuM2YAU2V0dGluZ3NEaXJ0eVRpbWVyICUuMmYAJTAyZCVjIFRhYiAweCUwOFggJyVzJyBPZmZzZXQ6ICUuMWYsIFdpZHRoOiAlLjFmLyUuMWYAQ2VsbFBhZGRpbmdYOiAlLjFmLCBDZWxsU3BhY2luZ1g6ICUuMWYvJS4xZiwgT3V0ZXJQYWRkaW5nWDogJS4xZgBSZWZTY2FsZT0lZgBBbHdheXNBdXRvUmVzaXplAGFsbG9jYXRvcjxUPjo6YWxsb2NhdGUoc2l6ZV90IG4pICduJyBleGNlZWRzIG1heGltdW0gc3VwcG9ydGVkIHNpemUARGlzcGxheVNpemUASW1EcmF3SWR4U2l6ZQBTZXROZXh0V2luZG93U2l6ZQBTZXRXaW5kb3dTaXplAEdldFdpbmRvd1NpemUAQ2FsY1RleHRTaXplAEltRHJhd1ZlcnRTaXplAEdldEZvbnRTaXplAFNldE5leHRXaW5kb3dDb250ZW50U2l6ZQBDdXJyZW50U2l6ZQBHZXRJdGVtUmVjdFNpemUAV2luZG93Qm9yZGVyU2l6ZQBQb3B1cEJvcmRlclNpemUARnJhbWVCb3JkZXJTaXplAENoaWxkQm9yZGVyU2l6ZQBUYWJCb3JkZXJTaXplAFNjcm9sbGJhclNpemUAV2luZG93TWluU2l6ZQBHcmFiTWluU2l6ZQBCdWZTaXplAFNldFdpbmRvd05hbWVTaXplAEltR3VpU3R5bGVTaXplAERlc2lyZWRTaXplAEltR3VpSU9TaXplAEltVmVjNFNpemUASW1WZWMyU2l6ZQBUYWJsZVNldHVwU2Nyb2xsRnJlZXplAFByaW1VbnJlc2VydmUAUHJpbVJlc2VydmUATmF2QWN0aXZlAFNlcGFyYXRvckFjdGl2ZQBIZWFkZXJBY3RpdmUAUmVzaXplR3JpcEFjdGl2ZQBCdXR0b25BY3RpdmUASXNBbnlJdGVtQWN0aXZlAElzSXRlbUFjdGl2ZQBGcmFtZUJnQWN0aXZlAFRpdGxlQmdBY3RpdmUAVGFiVW5mb2N1c2VkQWN0aXZlAFNsaWRlckdyYWJBY3RpdmUAU2Nyb2xsYmFyR3JhYkFjdGl2ZQBUYWJBY3RpdmUAdHJ1ZQBodWUASW50ZXJuYWwgc3RhdGUARnJhbWVyYXRlAFBhdGhMaW5lVG9NZXJnZUR1cGxpY2F0ZQBLZXlSZXBlYXRSYXRlAEluaVNhdmluZ1JhdGUAV2FudENhcHR1cmVNb3VzZQBmYWxzZQBHZXRHbHlwaFJhbmdlc0phcGFuZXNlAEdldEdseXBoUmFuZ2VzVmlldG5hbWVzZQBTZXRLZXlib2FyZEZvY3VzSGVyZQAjI3Nob3dfd2luZG93c19yZWN0X3R5cGUAIyNzaG93X3RhYmxlX3JlY3RzX3R5cGUATG9nU2xpZGVyRGVhZHpvbmUATm9uZQBBZGRQb2x5bGluZQBJbnB1dFRleHRNdWx0aWxpbmUATmV3TGluZQBTYW1lTGluZQBBZGRMaW5lAFNpemUgY29sdW1uIHRvIGZpdCMjI1NpemVPbmUAR2V0VGltZQBNb3VzZURvdWJsZUNsaWNrVGltZQBEZWx0YVRpbWUATmV3RnJhbWUARW5kRnJhbWUAQmVnaW5DaGlsZEZyYW1lAEVuZENoaWxkRnJhbWUASW5pRmlsZW5hbWUATG9nRmlsZW5hbWUAU3RyZXRjaFNhbWUARml4ZWRTYW1lAEdldFN0eWxlQ29sb3JOYW1lAEJhY2tlbmRSZW5kZXJlck5hbWUAVGFibGVHZXRDb2x1bW5OYW1lAEJhY2tlbmRQbGF0Zm9ybU5hbWUAR2V0RGVidWdOYW1lAEdldFN0eWxlAEltR3VpU3R5bGUATG9nVG9GaWxlAExvZyBUbyBGaWxlAEFkZFRyaWFuZ2xlAFNsaWRlckFuZ2xlAEFkZENpcmNsZQBkb3VibGUASW5wdXREb3VibGUATmF2VmlzaWJsZQBJc0l0ZW1WaXNpYmxlACMjc2VsZWN0YWJsZQBCdWlsZExvb2t1cFRhYmxlAEJlZ2luVGFibGUARW5kVGFibGUAVGV4VXZTY2FsZQBTZXRXaW5kb3dGb250U2NhbGUATW91c2VDdXJzb3JTY2FsZQBEaXNwbGF5RnJhbWVidWZmZXJTY2FsZQBGb250R2xvYmFsU2NhbGUAUGF0aFN0cm9rZQBDaGFubmVsc01lcmdlAFNldFN0YXRlU3RvcmFnZQBHZXRTdGF0ZVN0b3JhZ2UAI2ltYWdlAEFkZEltYWdlAE1lbUZyZWUATWVyZ2VNb2RlAFNob3dVc2VyR3VpZGUAQmVnaW5EcmFnRHJvcFNvdXJjZQBFbmREcmFnRHJvcFNvdXJjZQBHZXRDaGFyQWR2YW5jZQBNZXRyaWNzVG90YWxTdXJmYWNlAE5hdktleWJvYXJkAFdhbnRDYXB0dXJlS2V5Ym9hcmQATG9nVG9DbGlwYm9hcmQATG9nIFRvIENsaXBib2FyZAAjI0JhY2tncm91bmQAIyNGb3JlZ3JvdW5kAERpc3BsYXlFbmQAU2VsZWN0aW9uRW5kAEltRHJhd0NtZABBZGREcmF3Q21kAE1vdXNlRHJhZ1RocmVzaG9sZAAlbGxkAEJ1aWxkAEJlZ2luQ2hpbGQARW5kQ2hpbGQAdm9pZABCZWdpblBvcHVwQ29udGV4dFZvaWQASXNNb3VzZVBvc1ZhbGlkAGhibGtoZABUZXh0VW5mb3JtYXR0ZWQASXNJdGVtRWRpdGVkAElzSXRlbURlYWN0aXZhdGVkAElzSXRlbUFjdGl2YXRlZABUYWJVbmZvY3VzZWQASXNXaW5kb3dGb2N1c2VkAElzQW55SXRlbUZvY3VzZWQASXNJdGVtRm9jdXNlZABJc0tleVByZXNzZWQAU2V0TmV4dFdpbmRvd0NvbGxhcHNlZABTZXRXaW5kb3dDb2xsYXBzZWQASXNXaW5kb3dDb2xsYXBzZWQAVGl0bGVCZ0NvbGxhcHNlZABTZXRXaW5kb3dOYW1lQ29sbGFwc2VkAFNldFRhYkl0ZW1DbG9zZWQASXNLZXlSZWxlYXNlZABJc01vdXNlUmVsZWFzZWQAQ29sdW1uc0NvbnRlbnRIZWFkZXJzVXNlZABUZXh0Q29sb3JlZABJc1dpbmRvd0hvdmVyZWQAUGxvdExpbmVzSG92ZXJlZABTZXBhcmF0b3JIb3ZlcmVkAEhlYWRlckhvdmVyZWQAUmVzaXplR3JpcEhvdmVyZWQAQnV0dG9uSG92ZXJlZABJc0FueUl0ZW1Ib3ZlcmVkAElzSXRlbUhvdmVyZWQAUGxvdEhpc3RvZ3JhbUhvdmVyZWQARnJhbWVCZ0hvdmVyZWQAU2Nyb2xsYmFyR3JhYkhvdmVyZWQAVGFiSG92ZXJlZABPdXRlclJlY3RDbGlwcGVkAFRleHRXcmFwcGVkAEFkZENvbnZleFBvbHlGaWxsZWQAQWRkUmVjdEZpbGxlZABBZGROZ29uRmlsbGVkAEFkZFRyaWFuZ2xlRmlsbGVkAEFkZENpcmNsZUZpbGxlZABBZGRRdWFkRmlsbGVkAFRleHREaXNhYmxlZABMb2NrZWQASXNJdGVtQ2xpY2tlZABJc01vdXNlQ2xpY2tlZABJc01vdXNlRG91YmxlQ2xpY2tlZABBZGRJbWFnZVJvdW5kZWQASXNMb2FkZWQAQWRkSW1hZ2VRdWFkAEFkZFF1YWQATmF2R2FtZXBhZABBY2NlcHREcmFnRHJvcFBheWxvYWQAU2V0RHJhZ0Ryb3BQYXlsb2FkAEdldERyYWdEcm9wUGF5bG9hZABoZWFkAFRleHR1cmVJZABWOiUzZABTOiUzZABSOiUzZABIOiUzZABHOiUzZABCOiUzZABBOiUzZAAjI01lbnVfJTAyZAAjI1Rvb2x0aXBfJTAyZAAjI0NvbWJvXyUwMmQAQ29sdW1uICUtMmQAIE9yZGVyPSVkACBXaWR0aD0lZAAgVmlzaWJsZT0lZAAweCUwOFggIiVzIiBQb3MgKCVkLCVkKSBTaXplICglZCwlZCkgQ29sbGFwc2VkPSVkADB4JTA4WCwlZABBY3RpdmU6ICVkLyVkLCBXcml0ZUFjY2Vzc2VkOiAlZCwgQmVnaW5PcmRlcldpdGhpbkNvbnRleHQ6ICVkAEFwcGVhcmluZzogJWQsIEhpZGRlbjogJWQgKENhblNraXAgJWQgQ2Fubm90ICVkKSwgU2tpcEl0ZW1zOiAlZAAlczogJWQATmF2SWQ6IDB4JTA4WCwgTmF2TGF5ZXI6ICVkAE5hdkRpc2FibGVIaWdobGlnaHQ6ICVkLCBOYXZEaXNhYmxlTW91c2VIb3ZlcjogJWQASG92ZXJlZENvbHVtbkJvZHk6ICVkLCBIb3ZlcmVkQ29sdW1uQm9yZGVyOiAlZABIb3ZlcmVkSWQ6IDB4JTA4WC8weCUwOFggKCUuMmYgc2VjKSwgQWxsb3dPdmVybGFwOiAlZABSZXNpemVkQ29sdW1uOiAlZCwgUmVvcmRlckNvbHVtbjogJWQsIEhlbGRIZWFkZXJDb2x1bW46ICVkAE5hdkFjdGl2ZTogJWQsIE5hdlZpc2libGU6ICVkAEFzYwBNZW1BbGxvYwBBZGRCZXppZXJRdWFkcmF0aWMAU3R5bGVDb2xvcnNDbGFzc2ljAEdldEdseXBoUmFuZ2VzQ3lyaWxsaWMAQWRkQmV6aWVyQ3ViaWMAR2V0U3BlYwAgU29ydD0lZCVjAHJiACMjcmdiAFNsaWRlckdyYWIAU2Nyb2xsYmFyR3JhYgBUYWIAcndhAFJlc2V0TW91c2VEcmFnRGVsdGEAR2V0TW91c2VEcmFnRGVsdGEATW91c2VEZWx0YQBDbGVhclRleERhdGEAR2V0RHJhd0RhdGEASW1EcmF3RGF0YQBDbGVhck91dHB1dERhdGEAQ2xlYXJJbnB1dERhdGEARm9udERhdGEAQmFja2VuZFJlbmRlcmVyVXNlckRhdGEAQmFja2VuZFBsYXRmb3JtVXNlckRhdGEAQmFja2VuZExhbmd1YWdlVXNlckRhdGEAQ2xpcGJvYXJkVXNlckRhdGEASW1HdWlJbnB1dFRleHRDYWxsYmFja0RhdGEASW1HdWlTaXplQ2FsbGJhY2tEYXRhAFNldHRpbmdzSW5pRGF0YQBJdGVyYXRlQ29uZmlnRGF0YQBHZXREcmF3TGlzdFNoYXJlZERhdGEAYXJlbmEAYWxwaGEAU2V0TmV4dFdpbmRvd0JnQWxwaGEAaGhlYQBsb2NhAFt+XQBbeF0AWyBdACMjWgBHZXRTY3JvbGxNYXhZAFN0YXJ0UG9zWQBTZXRDdXJzb3JQb3NZAEdldEN1cnNvclBvc1kAU2V0U2Nyb2xsRnJvbVBvc1kAU2V0U2Nyb2xsWQBHZXRTY3JvbGxZAFNldFNjcm9sbEhlcmVZAExvZ1RvVFRZAExvZyBUbyBUVFkAI1NDUk9MTFkAIyNZAEdldFNjcm9sbE1heFgAU2V0Q3Vyc29yUG9zWABHZXRDdXJzb3JQb3NYAFNldFNjcm9sbEZyb21Qb3NYAFNldFNjcm9sbFgAR2V0U2Nyb2xsWABTZXRTY3JvbGxIZXJlWABHbHlwaE1heEFkdmFuY2VYAEdseXBoTWluQWR2YW5jZVgARmFsbGJhY2tBZHZhbmNlWAAjU0NST0xMWABDb2x1bW4gJWQgT3JkZXIgJWQgU29ydE9yZGVyICVkICVzIFZpcyAlZCAlcyAlNy4zZiBVc2VySUQgMHglMDhYAE5hdkZvY3VzU2NvcGVJZCA9IDB4JTA4WABTYXZlRmxhZ3M6IDB4JTA4WABOYXZBY3RpdmF0ZUlkOiAweCUwOFgsIE5hdklucHV0SWQ6IDB4JTA4WABIb3ZlcmVkSWQ6IDB4JTA4WAAlcy8lc18lMDhYACBVc2VySUQ9JTA4WAAlcy8lMDhYAENvbHVtbnMgSWQ6IDB4JTA4WCwgQ291bnQ6ICVkLCBGbGFnczogMHglMDRYACMlMDJYJTAyWCUwMlglMDJYACMlMDJYJTAyWCUwMlgATmF2TGFzdElkczogMHglMDhYLDB4JTA4WCwgTmF2TGF5ZXJBY3RpdmVNYXNrOiAlWAAjI1gAIyNXAE92ZXJzYW1wbGVWAFByaW1SZWN0VVYAUHJpbVF1YWRVVgBDb2xvckNvbnZlcnRSR0J0b0hTVgBOQVYsRk9DVVMAR1BPUwBJVEVNUwBHZXRJTwBJbUd1aUlPAElNR1VJX1ZFUlNJT04ASU1HVUlfQ0hFQ0tWRVJTSU9OAE5BTgAlczogTlVMTABQaXhlbFNuYXBIAE92ZXJzYW1wbGVIAFdJTkRPV0lORwBDVVJSRU5UTFkgQVBQRU5ESU5HAEFkZEZvbnRGcm9tTWVtb3J5VFRGAElORgBfQ09MNEYAX0NPTDNGACNSRVNJWkUAI01PVkUAI0NPTExBUFNFACNDTE9TRQBWYWx1ZV9EAFRleElEAEdldElEAENvbHVtblVzZXJJRABQb3BJRABQdXNoSUQAUG9wVGV4dHVyZUlEAFB1c2hUZXh0dXJlSUQAVHJlZU5vZGVFeF9DAFZhbHVlX0MAVHJlZU5vZGVfQwBHZXRDb2xvclUzMl9DAExpc3RCb3hfQgBUcmVlTm9kZUV4X0IAQWRkVGV4dF9CAExpc3RCb3hIZWFkZXJfQgBDb2xsYXBzaW5nSGVhZGVyX0IAUmFkaW9CdXR0b25fQgBNZW51SXRlbV9CAFRyZWVQdXNoX0IAVmFsdWVfQgBJc1JlY3RWaXNpYmxlX0IAU2VsZWN0YWJsZV9CAFRyZWVOb2RlX0IAR2V0Q29sb3JVMzJfQgBDb2xvckNvbnZlcnRIU1Z0b1JHQgBDYWxjV29yZFdyYXBQb3NpdGlvbkEAQ2FsY1RleHRTaXplQQBMaXN0Qm94X0EAVHJlZU5vZGVFeF9BAEFkZFRleHRfQQBMaXN0Qm94SGVhZGVyX0EAQ29sbGFwc2luZ0hlYWRlcl9BAFJhZGlvQnV0dG9uX0EATWVudUl0ZW1fQQBUcmVlUHVzaF9BAFZhbHVlX0EASXNSZWN0VmlzaWJsZV9BAFNlbGVjdGFibGVfQQBUcmVlTm9kZV9BAEdldENvbG9yVTMyX0EATi9BAGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHNob3J0PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1bnNpZ25lZCBzaG9ydD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8aW50PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1bnNpZ25lZCBpbnQ+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGZsb2F0PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1aW50OF90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxpbnQ4X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVpbnQxNl90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxpbnQxNl90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1aW50MzJfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8aW50MzJfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8Y2hhcj4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dW5zaWduZWQgY2hhcj4Ac3RkOjpiYXNpY19zdHJpbmc8dW5zaWduZWQgY2hhcj4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8c2lnbmVkIGNoYXI+ADx1bmtub3duPgA8VW5rbm93bj4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8bG9uZz4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dW5zaWduZWQgbG9uZz4ATmF2UmVjdFJlbFswXTogPE5vbmU+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGRvdWJsZT4APE5VTEw+ACMjPgAjIzwAVmVydDoAJyVzJzoAR2V0VGV4RGF0YUFzQWxwaGE4AFU4AFM4AEFkZElucHV0Q2hhcmFjdGVyc1VURjgAVTE2AFMxNgAwLi4yNTUASW5wdXRJbnQ0AFNsaWRlckludDQARHJhZ0ludDQAQ29sb3JFZGl0NABJbnB1dEZsb2F0NABTbGlkZXJGbG9hdDQAQ29sb3JDb252ZXJ0VTMyVG9GbG9hdDQARHJhZ0Zsb2F0NABDb2xvclBpY2tlcjQAR2V0U3R5bGVDb2xvclZlYzQASW1WZWM0AFU2NABTNjQASW5wdXRJbnQzAFNsaWRlckludDMARHJhZ0ludDMAQ29sb3JFZGl0MwBJbnB1dEZsb2F0MwBTbGlkZXJGbG9hdDMARHJhZ0Zsb2F0MwBDb2xvclBpY2tlcjMASW5wdXRJbnQyAFNsaWRlckludDIARHJhZ0ludDIASW5wdXRGbG9hdDIAU2xpZGVyRmxvYXQyAERyYWdGbG9hdDIARHJhZ0ludFJhbmdlMgBEcmFnRmxvYXRSYW5nZTIASW1WZWMyAENvbG9yQ29udmVydEZsb2F0NFRvVTMyAFMzMgBHZXRUZXhEYXRhQXNSR0JBMzIAWTEAWDEAVjEAVTEAWTAAWDAAVjAAVTAAMS44MABNOjAwMABNOjAuMDAwADAuMDAuLjEuMDAAV2lsbCBjYWxsIHRoZSBJTV9ERUJVR19CUkVBSygpIG1hY3JvIHRvIGJyZWFrIGluIGRlYnVnZ2VyLgpXYXJuaW5nOiBJZiB5b3UgZG9uJ3QgaGF2ZSBhIGRlYnVnZ2VyIGF0dGFjaGVkLCB0aGlzIHdpbGwgcHJvYmFibHkgY3Jhc2guAFByZXNzIEVTQyB0byBhYm9ydCBwaWNraW5nLgBOb3RlOiBzb21lIG1lbW9yeSBidWZmZXJzIGhhdmUg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AQABAAgAAwAEAAEABQAHAAIAAQAEAAQACAAEAAIAAQACAAEAAQAEAAUABgADAAYAAgAMAAMAAQADAAkAAgAEAAMABAABAAUAAwADAAEAAwAHAAEABQABAAEAAQABAAIAAwAEAAUAAgADAAIABgABAAEAAgABAAcAAQAHAAMABAAFAA8AAgACAAEABQADABYAEwACAAEAAQABAAEAAgAFAAEAAQABAAYAAQABAAwACAACAAkAEgAWAAQAAQABAAUAAQAQAAEAAgAHAAoADwABAAEABgACAAQAAQACAAQAAQAGAAEAAQADAAIABAABAAYABAAFAAEAAgABAAEAAgABAAoAAwABAAMAAgABAAkAAwACAAUABwACABMABAADAAYAAQABAAEAAQABAAQAAwACAAEAAQABAAIABQADAAEAAQABAAIAAgABAAEAAgABAAEAAgABAAMAAQABAAEAAwAHAAEABAABAAEAAgABAAEAAgABAAIABAAEAAMACAABAAEAAQACAAEAAwAFAAEAAwABAAMABAAGAAIAAgAOAAQABgAGAAsACQABAA8AAwABABwABQACAAUABQADAAEAAwAEAAUABAAGAA4AAwACAAMABQAVAAIABwAUAAoAAQACABMAAgAEABwAHAACAAMAAgABAA4ABAABABoAHAAqAAwAKAADADQATwAFAA4AEQADAAIAAgALAAMABAAGAAMAAQAIAAIAFwAEAAUACAAKAAQAAgAHAAMABQABAAEABgADAAEAAgACAAIABQAcAAEAAQAHAAcAFAAFAAMAHQADABEAGgABAAgABAAbAAMABgALABcABQADAAQABgANABgAEAAGAAUACgAZACMABwADAAIAAwADAA4AAwAGAAIABgABAAQAAgADAAgAAgABAAEAAwADAAMABAABAAEADQACAAIABAAFAAIAAQAOAA4AAQACAAIAAQAEAAUAAgADAAEADgADAAwAAwARAAIAEAAFAAEAAgABAAgACQADABMABAACAAIABAARABkAFQAUABwASwABAAoAHQBnAAQAAQACAAEAAQAEAAIABAABAAIAAwAYAAIAAgACAAEAAQACAAEAAwAIAAEAAQABAAIAAQABAAMAAQABAAEABgABAAUAAwABAAEAAQADAAQAAQABAAUAAgABAAUABgANAAkAEAABAAEAAQABAAMAAgADAAIABAAFAAIABQACAAIAAwAHAA0ABwACAAIAAQABAAEAAQACAAMAAwACAAEABgAEAAkAAgABAA4AAgAOAAIAAQASAAMABAAOAAQACwApAA8AFwAPABcAsAABAAMABAABAAEAAQABAAUAAwABAAIAAwAHAAMAAQABAAIAAQACAAQABAAGAAIABAABAAkABwABAAoABQAIABAAHQABAAEAAgACAAMAAQADAAUAAgAEAAUABAABAAEAAgACAAMAAwAHAAEABgAKAAEAEQABACwABAAGAAIAAQABAAYABQAEAAIACgABAAYACQACAAgAAQAYAAEAAgANAAcACAAIAAIAAQAEAAEAAwABAAMAAwAFAAIABQAKAAkABAAJAAwAAgABAAYAAQAKAAEAAQAHAAcABAAKAAgAAwABAA0ABAADAAEABgABAAMABQACAAEAAgARABAABQACABAABgABAAQAAgABAAMAAwAGAAgABQALAAsAAQADAAMAAgAEAAYACgAJAAUABwAEAAcABAAHAAEAAQAEAAIAAQADAAYACAAHAAEABgALAAUABQADABgACQAEAAIABwANAAUAAQAIAFIAEAA9AAEAAQABAAQAAgACABAACgADAAgAAQABAAYABAACAAEAAwABAAEAAQAEAAMACAAEAAIAAgABAAEAAQABAAEABgADAAUAAQABAAQABgAJAAIAAQABAAEAAgABAAcAAgABAAYAAQAFAAQABAADAAEACAABAAMAAwABAAMAAgACAAIAAgADAAEABgABAAIAAQACAAEAAwAHAAEACAACAAEAAgABAAUAAgAFAAMABQAKAAEAAgABAAEAAwACAAUACwADAAkAAwAFAAEAAQAFAAkAAQACAAEABQAHAAkACQAIAAEAAwADAAMABgAIAAIAAwACAAEAAQAgAAYAAQACAA8ACQADAAcADQABAAMACgANAAIADgABAA0ACgACAAEAAwAKAAQADwACAA8ADwAKAAEAAwAJAAYACQAgABkAGgAvAAcAAwACAAMAAQAGAAMABAADAAIACAAFAAQAAQAJAAQAAgACABMACgAGAAIAAwAIAAEAAgACAAQAAgABAAkABAAEAAQABgAEAAgACQACAAMAAQABAAEAAQADAAUABQABAAMACAAEAAYAAgABAAQADAABAAUAAwAHAA0AAgAFAAgAAQAGAAEAAgAFAA4ABgABAAUAAgAEAAgADwAFAAEAFwAGAD4AAgAKAAEAAQAIAAEAAgACAAoABAACAAIACQACAAEAAQADAAIAAwABAAUAAwADAAIAAQADAAgAAQABAAEACwADAAEAAQAEAAMABwABAA4AAQACAAMADAAFAAIABQABAAYABwAFAAcADgALAAEAAwABAAgACQAMAAIAAQALAAgABAAEAAIABgAKAAkADQABAAEAAwABAAUAAQADAAIABAAEAAEAEgACAAMADgALAAQAHQAEAAIABwABAAMADQAJAAIAAgAFAAMABQAUAAcAEAAIAAUASAAiAAYABAAWAAwADAAcAC0AJAAJAAcAJwAJAL8AAQABAAEABAALAAgABAAJAAIAAwAWAAEAAQABAAEABAARAAEABwAHAAEACwAfAAoAAgAEAAgAAgADAAIAAQAEAAIAEAAEACAAAgADABMADQAEAAkAAQAFAAIADgAIAAEAAQADAAYAEwAGAAUAAQAQAAYAAgAKAAgABQABAAIAAwABAAUABQABAAsABgAGAAEAAwADAAIABgADAAgAAQABAAQACgAHAAUABwAHAAUACAAJAAIAAQADAAQAAQABAAMAAQADAAMAAgAGABAAAQAEAAYAAwABAAoABgABAAMADwACAAkAAgAKABkADQAJABAABgACAAIACgALAAQAAwAJAAEAAgAGAAYABQAEAB4AKAABAAoABwAMAA4AIQAGAAMABgAHAAMAAQADAAEACwAOAAQACQAFAAwACwAxABIAMwAfAIwAHwACAAIAAQAFAAEACAABAAoAAQAEAAQAAwAYAAEACgABAAMABgAGABAAAwAEAAUAAgABAAQAAgA5AAoABgAWAAIAFgADAAcAFgAGAAoACwAkABIAEAAhACQAAgAFAAUAAQABAAEABAAKAAEABAANAAIABwAFAAIACQADAAQAAQAHACsAAwAHAAMACQAOAAcACQABAAsAAQABAAMABwAEABIADQABAA4AAQADAAYACgBJAAIAAgAeAAYAAQALABIAEwANABYAAwAuACoAJQBZAAcAAwAQACIAAgACAAMACQABAAcAAQABAAEAAgACAAQACgAHAAMACgADAAkABQAcAAkAAgAGAA0ABwADAAEAAwAKAAIABwACAAsAAwAGABUANgBVAAIAAQAEAAIAAgABACcAAwAVAAIAAgAFAAEAAQABAAQAAQABAAMABAAPAAEAAwACAAQABAACAAMACAACABQAAQAIAAcADQAEAAEAGgAGAAIACQAiAAQAFQA0AAoABAAEAAEABQAMAAIACwABAAcAAgAeAAwALAACAB4AAQABAAMABgAQAAkAEQAnAFIAAgACABgABwABAAcAAwAQAAkADgAsAAIAAQACAAEAAgADAAUAAgAEAAEABgAHAAUAAwACAAYAAQALAAUACwACAAEAEgATAAgAAQADABgAHQACAAEAAwAFAAIAAgABAA0ABgAFAAEALgALAAMABQABAAEABQAIAAIACgAGAAwABgADAAcACwACAAQAEAANAAIABQABAAEAAgACAAUAAgAcAAUAAgAXAAoACAAEAAQAFgAnAF8AJgAIAA4ACQAFAAEADQAFAAQAAwANAAwACwABAAkAAQAbACUAAgAFAAQABAA/ANMAXwACAAIAAgABAAMABQACAAEAAQACAAIAAQABAAEAAwACAAQAAQACAAEAAQAFAAIAAgABAAEAAgADAAEAAwABAAEAAQADAAEABAACAAEAAwAGAAEAAQADAAcADwAFAAMAAgAFAAMACQALAAQAAgAWAAEABgADAAgABwABAAQAHAAEABAAAwADABkABAAEABsAGwABAAQAAQACAAIABwABAAMABQACABwACAACAA4AAQAIAAYAEAAZAAMAAwADAA4AAwADAAEAAQACAAEABAAGAAMACAAEAAEAAQABAAIAAwAGAAoABgACAAMAEgADAAIABQAFAAQAAwABAAUAAgAFAAQAFwAHAAYADAAGAAQAEQALAAkABQABAAEACgAFAAwAAQABAAsAGgAhAAcAAwAGAAEAEQAHAAEABQAMAAEACwACAAQAAQAIAA4AEQAXAAEAAgABAAcACAAQAAsACQAGAAUAAgAGAAQAEAACAAgADgABAAsACAAJAAEAAQABAAkAGQAEAAsAEwAHAAIADwACAAwACAA0AAcABQATAAIAEAAEACQACAABABAACAAYABoABAAGAAIACQAFAAQAJAADABwADAAZAA8AJQAbABEADAA7ACYABQAgAH8AAQACAAkAEQAOAAQAAQACAAEAAQAIAAsAMgAEAA4AAgATABAABAARAAUABAAFABoADAAtAAIAFwAtAGgAHgAMAAgAAwAKAAIAAgADAAMAAQAEABQABwACAAkABgAPAAIAFAABAAMAEAAEAAsADwAGAIYAAgAFADsAAQACAAIAAgABAAkAEQADABoAiQAKANMAOwABAAIABAABAAQAAQABAAEAAgAGAAIAAwABAAEAAgADAAIAAwABAAMABAAEAAIAAwADAAEABAADAAEABwACAAIAAwABAAIAAQADAAMAAwACAAIAAwACAAEAAwAOAAYAAQADAAIACQAGAA8AGwAJACIAkQABAAEAAgABAAEAAQABAAIAAQABAAEAAQACAAIAAgADAAEAAgABAAEAAQACAAMABQAIAAMABQACAAQAAQADAAIAAgACAAwABAABAAEAAQAKAAQABQABABQABAAQAAEADwAJAAUADAACAAkAAgAFAAQAAgAaABMABwABABoABAAeAAwADwAqAAEABgAIAKwAAQABAAQAAgABAAEACwACAAIABAACAAEAAgABAAoACAABAAIAAQAEAAUAAQACAAUAAQAIAAQAAQADAAQAAgABAAYAAgABAAMABAABAAIAAQABAAEAAQAMAAUABwACAAQAAwABAAEAAQADAAMABgABAAIAAgADAAMAAwACAAEAAgAMAA4ACwAGAAYABAAMAAIACAABAAcACgABACMABwAEAA0ADwAEAAMAFwAVABwANAAFABoABQAGAAEABwAKAAIABwA1AAMAAgABAAEAAQACAKMAFAIBAAoACwABAAMAAwAEAAgAAgAIAAYAAgACABcAFgAEAAIAAgAEAAIAAQADAAEAAwADAAUACQAIAAIAAQACAAgAAQAKAAIADAAVABQADwBpAAIAAwABAAEAAwACAAMAAQABAAIABQABAAQADwALABMAAQABAAEAAQAFAAQABQABAAEAAgAFAAMABQAMAAEAAgAFAAEACwABAAEADwAJAAEABAAFAAMAGgAIAAIAAQADAAEAAQAPABMAAgAMAAEAAgAFAAIABwACABMAAgAUAAYAGgAHAAUAAgACAAcAIgAVAA0ARgACAIAAAQABAAIAAQABAAIAAQABAAMAAgACAAIADwABAAQAAQADAAQAKgAKAAYAAQAxAFUACAABAAIAAQABAAQABAACAAMABgABAAUABwAEAAMA0wAEAAEAAgABAAIABQABAAIABAACAAIABgAFAAYACgADAAQAMABkAAYAAgAQACgBBQAbAIMBAgACAAMABwAQAAgABQAmAA8AJwAVAAkACgADAAcAOwANABsAFQAvAAUAFQAGAEGQyQELFCAA/wAAIG8gADD/MPAx/zEA/+//AEGyyQELvi8BAAIABAABAAEAAQABAAIAAQADAAMAAgACAAEABQADAAUABwAFAAYAAQACAAEABwACAAYAAwABAAgAAQABAAQAAQABABIAAgALAAIABgACAAEAAgABAAUAAQACAAEAAwABAAIAAQACAAMAAwABAAEAAgADAAEAAQABAAwABwAJAAEABAAFAAEAAQACAAEACgABAAEACQACAAIABAAFAAYACQADAAEAAQABAAEACQADABIABQACAAIAAgACAAEABgADAAcAAQABAAEAAQACAAIABAACAAEAFwACAAoABAADAAUAAgAEAAoAAgAEAA0AAQAGAAEACQADAAEAAQAGAAYABwAGAAMAAQACAAsAAwACAAIAAwACAA8AAgACAAUABAADAAYABAABAAIABQACAAwAEAAGAA0ACQANAAIAAQABAAcAEAAEAAcAAQATAAEABQABAAIAAgAHAAcACAACAAYABQAEAAkAEgAHAAQABQAJAA0ACwAIAA8AAgABAAEAAQACAAEAAgACAAEAAgACAAgAAgAJAAMAAwABAAEABAAEAAEAAQABAAQACQABAAQAAwAFAAUAAgAHAAUAAwAEAAgAAgABAA0AAgADAAMAAQAOAAEAAQAEAAUAAQADAAYAAQAFAAIAAQABAAMAAwADAAMAAQABAAIABwAGAAYABwABAAQABwAGAAEAAQABAAEAAQAMAAMAAwAJAAUAAgAGAAEABQAGAAEAAgADABIAAgAEAA4ABAABAAMABgABAAEABgADAAUABQADAAIAAgACAAIADAADAAEABAACAAMAAgADAAsAAQAHAAQAAQACAAEAAwARAAEACQABABgAAQABAAQAAgACAAQAAQACAAcAAQABAAEAAwABAAIAAgAEAA8AAQABAAIAAQABAAIAAQAFAAIABQAUAAIABQAJAAEACgAIAAcABgABAAEAAQABAAEAAQAGAAIAAQACAAgAAQABAAEAAQAFAAEAAQADAAEAAQABAAEAAwABAAEADAAEAAEAAwABAAEAAQABAAEACgADAAEABwAFAA0AAQACAAMABAAGAAEAAQAeAAIACQAJAAEADwAmAAsAAwABAAgAGAAHAAEACQAIAAoAAgABAAkAHwACAA0ABgACAAkABAAxAAUAAgAPAAIAAQAKAAIAAQABAAEAAgACAAYADwAeACMAAwAOABIACAABABAACgAcAAwAEwAtACYAAQADAAIAAwANAAIAAQAHAAMABgAFAAMABAADAAEABQAHAAgAAQAFAAMAEgAFAAMABgABABUABAAYAAkAGAAoAAMADgADABUAAwACAAEAAgAEAAIAAwABAA8ADwAGAAUAAQABAAMAAQAFAAYAAQAJAAcAAwADAAIAAQAEAAMACAAVAAUAEAAEAAUAAgAKAAsACwADAAYAAwACAAkAAwAGAA0AAQACAAEAAQABAAEACwAMAAYABgABAAQAAgAGAAUAAgABAAEAAwADAAYADQADAAEAAQAFAAEAAgADAAMADgACAAEAAgACAAIABQABAAkABQABAAEABgAMAAMADAADAAQADQACAA4AAgAIAAEAEQAFAAEAEAAEAAIAAgAVAAgACQAGABcAFAAMABkAEwAJACYACAADABUAKAAZACEADQAEAAMAAQAEAAEAAgAEAAEAAgAFABoAAgABAAEAAgABAAMABgACAAEAAQABAAEAAQABAAIAAwABAAEAAQAJAAIAAwABAAEAAQADAAYAAwACAAEAAQAGAAYAAQAIAAIAAgACAAEABAABAAIAAwACAAcAAwACAAQAAQACAAEAAgACAAEAAQABAAEAAQADAAEAAgAFAAQACgAJAAQACQABAAEAAQABAAEAAQAFAAMAAgABAAYABAAJAAYAAQAKAAIAHwARAAgAAwAHAAUAKAABAAcABwABAAYABQACAAoABwAIAAQADwAnABkABgAcAC8AEgAKAAcAAQADAAEAAQACAAEAAQABAAMAAwADAAEAAQABAAMABAACAAEABAABAAMABgAKAAcACAAGAAIAAgABAAMAAwACAAUACAAHAAkADAACAA8AAQABAAQAAQACAAEAAQABAAMAAgABAAMAAwAFAAYAAgADAAIACgABAAQAAgAIAAEAAQABAAsABgABABUABAAQAAMAAQADAAEABAACAAMABgAFAAEAAwABAAEAAwADAAQABgABAAEACgAEAAIABwAKAAQABwAEAAIACQAEAAMAAQABAAEABAABAAgAAwAEAAEAAwABAAYAAQAEAAIAAQAEAAcAAgABAAgAAQAEAAUAAQABAAIAAgAEAAYAAgAHAAEACgABAAEAAwAEAAsACgAIABUABAAGAAEAAwAFAAIAAQACABwABQAFAAIAAwANAAEAAgADAAEABAACAAEABQAUAAMACAALAAEAAwADAAMAAQAIAAoACQACAAoACQACAAMAAQABAAIABAABAAgAAwAGAAEABwAIAAYACwABAAQAHQAIAAQAAwABAAIABwANAAEABAABAAYAAgAGAAwADAACABQAAwACAAMABgAEAAgACQACAAcAIgAFAAEAEgAGAAEAAQAEAAQABQAHAAkAAQACAAIABAADAAQAAQAHAAIAAgACAAYAAgADABkABQADAAYAAQAEAAYABwAEAAIAAQAEAAIADQAGAAQABAADAAEABQADAAQABAADAAIAAQABAAQAAQACAAEAAQADAAEACwABAAYAAwABAAcAAwAGAAIACAAIAAYACQADAAQACwADAAIACgAMAAIABQALAAEABgAEAAUAAwABAAgABQAEAAYABgADAAUAAQABAAMAAgABAAIAAgAGABEADAABAAoAAQAGAAwAAQAGAAYAEwAJAAYAEAABAA0ABAAEAA8ABwARAAYACwAJAA8ADAAGAAcAAgABAAIAAgAPAAkAAwAVAAQABgAxABIABwADAAIAAwABAAYACAACAAIABgACAAkAAQADAAYABAAEAAEAAgAQAAIABQACAAEABgACAAMABQADAAEAAgAFAAEAAgABAAkAAwABAAgABgAEAAgACwADAAEAAQABAAEAAwABAA0ACAAEAAEAAwACAAIAAQAEAAEACwABAAUAAgABAAUAAgAFAAgABgABAAEABwAEAAMACAADAAIABwACAAEABQABAAUAAgAEAAcABgACAAgABQABAAsABAAFAAMABgASAAEAAgANAAMAAwABABUAAQABAAQAAQAEAAEAAQABAAgAAQACAAIABwABAAIABAACAAIACQACAAEAAQABAAQAAwAGAAMADAAFAAEAAQABAAUABgADAAIABAAIAAIAAgAEAAIABwABAAgACQAFAAIAAwACAAEAAwACAA0ABwAOAAYABQABAAEAAgABAAQAAgAXAAIAAQABAAYAAwABAAQAAQAPAAMAAQAHAAMACQAOAAEAAwABAAQAAQABAAUACAABAAMACAADAAgADwALAAQADgAEAAQAAgAFAAUAAQAHAAEABgAOAAcABwAIAAUADwAEAAgABgAFAAYAAgABAA0AAQAUAA8ACwAJAAIABQAGAAIACwACAAYAAgAFAAEABQAIAAQADQATABkABAABAAEACwABACIAAgAFAAkADgAGAAIAAgAGAAEAAQAOAAEAAwAOAA0AAQAGAAwAFQAOAA4ABgAgABEACAAgAAkAHAABAAIABAALAAgAAwABAA4AAgAFAA8AAQABAAEAAQADAAYABAABAAMABAALAAMAAQABAAsAHgABAAUAAQAEAAEABQAIAAEAAQADAAIABAADABEAIwACAAYADAARAAMAAQAGAAIAAQABAAwAAgAHAAMAAwACAAEAEAACAAgAAwAGAAUABAAHAAMAAwAIAAEACQAIAAUAAQACAAEAAwACAAgAAQACAAkADAABAAEAAgADAAgAAwAYAAwABAADAAcABQAIAAMAAwADAAMAAwADAAEAFwAKAAMAAQACAAIABgADAAEAEAABABAAFgADAAoABAALAAYACQAHAAcAAwAGAAIAAgACAAQACgACAAEAAQACAAgABwABAAYABAABAAMAAwADAAUACgAMAAwAAgADAAwACAAPAAEAAQAQAAYABgABAAUACQALAAQACwAEAAIABgAMAAEAEQAFAA0AAQAEAAkABQABAAsAAgABAAgAAQAFAAcAHAAIAAMABQAKAAIAEQADACYAFgABAAIAEgAMAAoABAAmABIAAQAEACwAEwAEAAEACAAEAAEADAABAAQAHwAMAAEADgAHAEsABwAFAAoABgAGAA0AAwACAAsACwADAAIABQAcAA8ABgASABIABQAGAAQAAwAQAAEABwASAAcAJAADAAUAAwABAAcAAQAJAAEACgAHAAIABAACAAYAAgAJAAcABAADACAADAADAAcACgACABcAEAADAAEADAADAB8ABAALAAEAAwAIAAkABQABAB4ADwAGAAwAAwACAAIACwATAAkADgACAAYAAgADABMADQARAAUAAwADABkAAwAOAAEAAQABACQAAQADAAIAEwADAA0AJAAJAA0AHwAGAAQAEAAiAAIABQAEAAIAAwADAAUAAQABAAEABAADAAEAEQADAAIAAwAFAAMAAQADAAIAAwAFAAYAAwAMAAsAAQADAAEAAgAaAAcADAAHAAIADgADAAMABwAHAAsAGQAZABwAEAAEACQAAQACAAEABgACAAEACQADABsAEQAEAAMABAANAAQAAQADAAIAAgABAAoABAACAAQABgADAAgAAgABABIAAQABABgAAgACAAQAIQACAAMAPwAHAAEABgAoAAcAAwAEAAQAAgAEAA8AEgABABAAAQABAAsAAgApAA4AAQADABIADQADAAIABAAQAAIAEQAHAA8AGAAHABIADQAsAAIAAgADAAYAAQABAAcABQABAAcAAQAEAAMAAwAFAAoACAACAAMAAQAIAAEAAQAbAAQAAgABAAwAAQACAAEACgAGAAEABgAHAAUAAgADAAcACwAFAAsAAwAGAAYAAgADAA8ABAAJAAEAAQACAAEAAgALAAIACAAMAAgABQAEAAIAAwABAAUAAgACAAEADgABAAwACwAEAAEACwARABEABAADAAIABQAFAAcAAwABAAUACQAJAAgAAgAFAAYABgANAA0AAgABAAIABgABAAIAAgAxAAQACQABAAIACgAQAAcACAAEAAMAAgAXAAQAOgADAB0AAQAOABMAEwALAAsAAgAHAAUAAQADAAQABgACABIABQAMAAwAEQARAAMAAwACAAQAAQAGAAIAAwAEAAMAAQABAAEAAQAFAAEAAQAJAAEAAwABAAMABgABAAgAAQABAAIABgAEAA4AAwABAAQACwAEAAEAAwAgAAEAAgAEAA0ABAABAAIABAACAAEAAwABAAsAAQAEAAIAAQAEAAQABgADAAUAAQAGAAUABwAGAAMAFwADAAUAAwAFAAMAAwANAAMACQAKAAEADAAKAAIAAwASAA0ABwCgADQABAACAAIAAwACAA4ABQAEAAwABAAGAAQAAQAUAAQACwAGAAIADAAbAAEABAABAAIAAgAHAAQABQACABwAAwAHABkACAADABMAAwAGAAoAAgACAAEACgACAAUABAABAAMABAABAAUAAwACAAYACQADAAYAAgAQAAMAAwAQAAQABQAFAAMAAgABAAIAEAAPAAgAAgAGABUAAgAEAAEAFgAFAAgAAQABABUACwACAAEACwALABMADQAMAAQAAgADAAIAAwAGAAEACAALAAEABAACAAkABQACAAEACwACAAkAAQABAAIADgAfAAkAAwAEABUADgAEAAgAAQAHAAIAAgACAAUAAQAEABQAAwADAAQACgABAAsACQAIAAIAAQAEAAUADgAMAA4AAgARAAkABgAfAAQADgABABQADQAaAAUAAgAHAAMABgANAAIABAACABMABgACAAIAEgAJAAMABQAMAAwADgAEAAYAAgADAAYACQAFABYABAAFABkABgAEAAgABQACAAYAGwACACMAAgAQAAMABwAIAAgABgAGAAUACQARAAIAFAAGABMAAgANAAMAAQABAAEABAARAAwAAgAOAAcAAQAEABIADAAmACEAAgAKAAEAAQACAA0ADgARAAsAMgAGACEAFAAaAEoAEAAXAC0AMgANACYAIQAGAAYABwAEAAQAAgABAAMAAgAFAAgABwAIAAkAAwALABUACQANAAEAAwAKAAYABwABAAIAAgASAAUABQABAAkACQACAEQACQATAA0AAgAFAAEABAAEAAcABAANAAMACQAKABUAEQADABoAAgABAAUAAgAEAAUABAABAAcABAAHAAMABAACAAEABgABAAEAFAAEAAEACQACAAIAAQADAAMAAgADAAIAAQABAAEAFAACAAMAAQAGAAIAAwAGAAIABAAIAAEAAwACAAoAAwAFAAMABAAEAAMABAAQAAEABgABAAoAAgAEAAIAAQABAAIACgALAAIAAgADAAEAGAAfAAQACgAKAAIABQAMABAApAAPAAQAEAAHAAkADwATABEAAQACAAEAAQAFAAEAAQABAAEAAQADAAEABAADAAEAAwABAAMAAQACAAEAAQADAAMABwACAAgAAQACAAIAAgABAAMABAADAAcACAAMAFwAAgAKAAMAAQADAA4ABQAZABAAKgAEAAcABwAEAAIAFQAFABsAGgAbABUAGQAeAB8AAgABAAUADQADABYABQAGAAYACwAJAAwAAQAFAAkABwAFAAUAFgA8AAMABQANAAEAAQAIAAEAAQADAAMAAgABAAkAAwADABIABAABAAIAAwAHAAYAAwABAAIAAwAJAAEAAwABAAMAAgABAAMAAQABAAEAAgABAAsAAwABAAYACQABAAMAAgADAAEAAgABAAUAAQABAAQAAwAEAAEAAgACAAQABAABAAcAAgABAAIAAgADAAUADQASAAMABAAOAAkACQAEABAAAwAHAAUACAACAAYAMAAcAAMAAQABAAQAAgAOAAgAAgAJAAIAAQAPAAIABAADAAIACgAQAAwACAAHAAEAAQADAAEAAQABAAIABwAEAAEABgAEACYAJwAQABcABwAPAA8AAwACAAwABwAVACUAGwAGAAUABAAIAAIACgAIAAgABgAFAAEAAgABAAMAGAABABAAEQAJABcACgARAAYAAQAzADcALAANACYBCQADAAYAAgAEAAIAAgAPAAEAAQABAA0AFQARAEQADgAIAAkABAABAAQACQADAAsABwABAAEAAQAFAAYAAwACAAEAAQABAAIAAwAIAAEAAgACAAQAAQAFAAUAAgABAAQAAwAHAA0ABAABAAQAAQADAAEAAQABAAUABQAKAAEABgABAAUAAgABAAUAAgAEAAEABAAFAAcAAwASAAIACQALACAABAADAAMAAgAEAAcACwAQAAkACwAIAA0AJgAgAAgABAACAAEAAQACAAEAAgAEAAQAAQABAAEABAABABUAAwALAAEAEAABAAEABgABAAMAAgAEAAkACAA5AAcALAABAAMAAwANAAMACgABAAEABwAFAAIABwAVAC8APwADAA8ABAAHAAEAEAABAAEAAgAIAAIAAwAqAA8ABAABAB0ABwAWAAoAAwBOABAADAAUABIABABDAAsABQABAAMADwAGABUAHwAgABsAEgANAEcAIwAFAI4ABAAKAAEAAgAyABMAIQAQACMAJQAQABMAGwAHAAEAhQATAAEABAAIAAcAFAABAAQABAABAAoAAwABAAYAAQACADMABQAoAA8AGAArAJBZCwABAA0AmgBGAAMAAQABAAcABAAKAAEAAgABAAEAAgABAAIAAQACAAIAAQABAAIAAQABAAEAAQABAAIAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQACAAEAAQABAAMAAgABAAEAAQABAAIAAQABAAAAIAD/AAAw/zDwMf8xAP/v/yAA/wAABC8F4C3/LUCmn6YAACAA/wAQIF4gAA5/DgAAIAD/AAIBAwEQAREBKAEpAWgBaQGgAaEBrwGwAaAe+R4AQYD5AQvkFi4uLSAgICAgICAgIC1YWFhYWFhYLSAgICBYICAgIC0gICAgICAgICAgIFggICAgICAgICAgIC1YWFhYWFhYICAgICAgICAgIC0gICAgICAgICAgWFhYWFhYWC0gICAgIFhYICAgICAgICAgIC4uLSAgICAgICAgIC1YLi4uLi5YLSAgIFguWCAgIC0gICAgICAgICAgWC5YICAgICAgICAgIC1YLi4uLi5YICAgICAgICAgIC0gICAgICAgICAgWC4uLi4uWC0gICAgWC4uWCAgICAgICAgIC0tLSAgICAgICAgIC1YWFguWFhYLSAgWC4uLlggIC0gICAgICAgICBYLi4uWCAgICAgICAgIC1YLi4uLlggICAgICAgICAgIC0gICAgICAgICAgIFguLi4uWC0gICAgWC4uWCAgICAgICAgIFggICAgICAgICAgIC0gIFguWCAgLSBYLi4uLi5YIC0gICAgICAgIFguLi4uLlggICAgICAgIC1YLi4uWCAgICAgICAgICAgIC0gICAgICAgICAgICBYLi4uWC0gICAgWC4uWCAgICAgICAgIFhYICAgICAgICAgIC0gIFguWCAgLVguLi4uLi4uWC0gICAgICAgWC4uLi4uLi5YICAgICAgIC1YLi5YLlggICAgICAgICAgIC0gICAgICAgICAgIFguWC4uWC0gICAgWC4uWCAgICAgICAgIFguWCAgICAgICAgIC0gIFguWCAgLVhYWFguWFhYWC0gICAgICAgWFhYWC5YWFhYICAgICAgIC1YLlggWC5YICAgICAgICAgIC0gICAgICAgICAgWC5YIFguWC0gICAgWC4uWFhYICAgICAgIFguLlggICAgICAgIC0gIFguWCAgLSAgIFguWCAgIC0gICAgICAgICAgWC5YICAgICAgICAgIC1YWCAgIFguWCAgICAgICAgIC0gICAgICAgICBYLlggICBYWC0gICAgWC4uWC4uWFhYICAgIFguLi5YICAgICAgIC0gIFguWCAgLSAgIFguWCAgIC0gICAgWFggICAgWC5YICAgIFhYICAgIC0gICAgICBYLlggICAgICAgIC0gICAgICAgIFguWCAgICAgIC0gICAgWC4uWC4uWC4uWFggIFguLi4uWCAgICAgIC0gIFguWCAgLSAgIFguWCAgIC0gICBYLlggICAgWC5YICAgIFguWCAgIC0gICAgICAgWC5YICAgICAgIC0gICAgICAgWC5YICAgICAgIC0gICAgWC4uWC4uWC4uWC5YIFguLi4uLlggICAgIC0gIFguWCAgLSAgIFguWCAgIC0gIFguLlggICAgWC5YICAgIFguLlggIC0gICAgICAgIFguWCAgICAgIC0gICAgICBYLlggICAgICAgIC1YWFggWC4uWC4uWC4uWC4uWFguLi4uLi5YICAgIC0gIFguWCAgLSAgIFguWCAgIC0gWC4uLlhYWFhYWC5YWFhYWFguLi5YIC0gICAgICAgICBYLlggICBYWC1YWCAgIFguWCAgICAgICAgIC1YLi5YWC4uLi4uLi4uWC4uWFguLi4uLi4uWCAgIC0gIFguWCAgLSAgIFguWCAgIC1YLi4uLi4uLi4uLi4uLi4uLi4uLi4uWC0gICAgICAgICAgWC5YIFguWC1YLlggWC5YICAgICAgICAgIC1YLi4uWC4uLi4uLi4uLi4uWFguLi4uLi4uLlggIC0gIFguWCAgLSAgIFguWCAgIC0gWC4uLlhYWFhYWC5YWFhYWFguLi5YIC0gICAgICAgICAgIFguWC4uWC1YLi5YLlggICAgICAgICAgIC0gWC4uLi4uLi4uLi4uLi4uWFguLi4uLi4uLi5YIC1YWFguWFhYLSAgIFguWCAgIC0gIFguLlggICAgWC5YICAgIFguLlggIC0gICAgICAgICAgICBYLi4uWC1YLi4uWCAgICAgICAgICAgIC0gIFguLi4uLi4uLi4uLi4uWFguLi4uLi4uLi4uWC1YLi4uLi5YLSAgIFguWCAgIC0gICBYLlggICAgWC5YICAgIFguWCAgIC0gICAgICAgICAgIFguLi4uWC1YLi4uLlggICAgICAgICAgIC0gIFguLi4uLi4uLi4uLi4uWFguLi4uLi5YWFhYWC1YWFhYWFhYLSAgIFguWCAgIC0gICAgWFggICAgWC5YICAgIFhYICAgIC0gICAgICAgICAgWC4uLi4uWC1YLi4uLi5YICAgICAgICAgIC0gICBYLi4uLi4uLi4uLi4uWFguLi5YLi5YICAgIC0tLS0tLS0tLSAgIFguWCAgIC0gICAgICAgICAgWC5YICAgICAgICAgIC0gICAgICAgICAgWFhYWFhYWC1YWFhYWFhYICAgICAgICAgIC0gICBYLi4uLi4uLi4uLi5YIFguLlggWC4uWCAgIC0gICAgICAgLVhYWFguWFhYWC0gICAgICAgWFhYWC5YWFhYICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gICAgWC4uLi4uLi4uLi5YIFguWCAgWC4uWCAgIC0gICAgICAgLVguLi4uLi4uWC0gICAgICAgWC4uLi4uLi5YICAgICAgIC0gICAgWFggICAgICAgICAgIFhYICAgIC0gICAgICAgICAgIC0gICAgWC4uLi4uLi4uLi5YIFhYICAgIFguLlggIC0gICAgICAgLSBYLi4uLi5YIC0gICAgICAgIFguLi4uLlggICAgICAgIC0gICBYLlggICAgICAgICAgIFguWCAgIC0gICAgICAgICAgIC0gICAgIFguLi4uLi4uLlggICAgICAgIFguLlggICAgICAgICAgLSAgWC4uLlggIC0gICAgICAgICBYLi4uWCAgICAgICAgIC0gIFguLlggICAgICAgICAgIFguLlggIC0gICAgICAgICAgIC0gICAgIFguLi4uLi4uLlggICAgICAgICBYWCAgICAgICAgICAgLSAgIFguWCAgIC0gICAgICAgICAgWC5YICAgICAgICAgIC0gWC4uLlhYWFhYWFhYWFhYWFguLi5YIC0gICAgICAgICAgIC0gICAgIFhYWFhYWFhYWFggIC0tLS0tLS0tLS0tLSAgICAgICAgLSAgICBYICAgIC0gICAgICAgICAgIFggICAgICAgICAgIC1YLi4uLi4uLi4uLi4uLi4uLi4uLi4uWC0gICAgICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLSAgICAgICAgICAgICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gWC4uLlhYWFhYWFhYWFhYWFguLi5YIC0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gIFguLlggICAgICAgICAgIFguLlggIC0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gICBYLlggICAgICAgICAgIFguWCAgIC0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gICAgWFggICAgICAgICAgIFhYICAgIC0gICAgICAgICAgICAgICAgICAgICAgICAgICAgIABB8I8CC8BlN10pIyMjIyMjI2hWMHFzJy8jIyNbKSwjIy9sOiQjUTY+IyM1W240Mj5jLVRIYC0+PiMvZT4xMU5OVj1CdigqOi5GP3V1IyhnUlUubzBYR0hgJHZoTEcxaHh0OT9XYCMsNUxzQ3AjLWk+LnIkPCQ2cEQ+TGInOzlDcmM2dGdYbUtWZVUyY0Q0RW8zUi8yKj5dYihNQzskalBmWS47aF5gSVdNOTxMaDJUbFMrZi1zJG82UTxCV0hgWWlVLnhmTHEkTjskMGlSL0dYOlUoamNXMnAvVypxPy1xbW5VQ0k7akhTQWlGV00uUiprVUBDPUdIP2E5d3A4ZiRlLi00XlFnMSlRLUdMKGxmKHIvN0dyUmd3ViVNUz1DI2A4TkQ+UW8jdCdYIyh2I1k5dzAjMUQkQ0lmO1cnI3BXVVBYT3V4WHVVKEg5TSgxPHEtVUUzMSNeLVYnOElSVW83UWYuL0w+PUtlJCQnNUYlKV0wXiMwWEBVLmE8cjpRTHRGc0xjTDYjI2xPaikjLlk1PC1SJktnTHdxSmZMZ04mO1E/Z0leI0RZMnVMaUBeck1sOXQ9Y1dxNiMjd2VnPiRGQmpWUVRTRGdFS25JUzdFTTk+Wlk5dzAjTDs+PiNNeCY0TXZ0Ly9MW01rQSNXQGxLLk4nWzAjN1JMXyYjdytGJUh0RzlNI1hMYE4mLixHTTRQZzstPG5MRU5odng+LVZzTS5NMHJKZkxIMmVUTWAqb0pNSFJDYE5rZmltTTJKLFctalhTOilyMHdLI0BGZ2UkVT5gdydON0cjJCNmQiMkRV4kIzo5OmhrK2VPZS0tNngpRjcqRSU/NzYlXkdNSGVQVy1aNWwnJkdpRiMkOTU2OnJTP2RBI2ZpSzopWXIrYCYjMGpAJ0RiRyYjXiRQRy5MbCtETmE8WENNS0VWKk4pTE4vTipiPSVRNnBpYS1YZzhJJDxNUiYsVmRKZSQ8KDdHO0NrbCcmaEY7OyQ8Xz1YKGIuUlMlJSkjIyNNUEJ1dUUxVjp2JmNYJiMybSMoJmNWXWBrOU9oTE1ibiVzJEcyLEIkQmZEM1gqc3A1I2wsJFIjXXhfWDF4S1glYjVVKltyNWlNZlVvOVVgTjk5aEcpdG0rL1VzOXBHKVhQdWA8MHMtKVdUdChnQ1J4SWcoJTZzZmg9a3RNS24zaik8NjxiNVNrXy8wKF5dQWFOIyhwL0w+JlZaPjFpJWgxUzl1NW9AWWFhVyRlK2I8VFdGbi9aOk9oKEN4MiRsTkVvTl5lKSNDRllAQEk7Qk9RKnNSd1p0WnhSY1U3dVc2Q1hvdzBpKD8kUVtjak9kW1A0ZCldPlJPUE9weFRPN1N0d2kxOjppQjFxKUNfPWRWMjZKOzIsXTdvcCRddVFyQF9WNyRxXiVsUXd0dUhZXT1EWCxuM0wjMFBIRE80Zjk+ZENATz5IQnVLUHBQKkUsTitiM0wjbHBSL01yVEVILklBUWsuYT5EWy5lO21jLnhdSXAuUEheJy9hcVVPLyQxV3hMb1cwW2lMQTxRVDs1SEtEK0BxUSdOUSgzX1BMaEU0OFIucUFQU3dRMC9XSz9aLFt4Py1KO2pRVFdBMFhAS0ooX1k4Ti06L003NDovLVpwS3JVc3M/ZCNkWnFdREFia1UqSnFrTCtud1hAQDQ3YDU+dz00aCg5LmBHQ1JVeEhQZVJgNU1qb2woZFVXeFphKD5TVHJQa3JKaVd4YDVVN0YjLmcqanJvaEdnYGNnOmxTVHZFWS9FVl83SDRROVtaJWNudjtKUVlaNXEubDdaZWFzOkhPSVpPQj9HPE5hbGQkcXNdQF1MPEo3YlIqPmd2Ols3TUkyaykuJzIoJDVGTlAmRVEoLClVXVddK2ZoMTgudnNhaTAwKTtEM0A0a3U1UD9EUDhhSnQrO3FVTV09K2InOEA7bVZpQkt4MERFWy1hdUdsODpQSiZEaitNNk9DXU9eKCgjI11gMGkpZHJUOy03WGA9LUgzW2lnVW5QRy1OWmxvLiNrQGgjPU9yayRtPmE+JC0/VG0kVVYoPyNQNllZIycvIyMjeGU3cS43M3JJMypwUC8kMT5zOSlXLEpyTTdTTl0nLzRDI3YkVWAwI1YuWzA+eFFzSCRmRW1QTWdZMnU3S2goRyVzaUlmTFNvUytNSzJlVE0kPTUsTThwYEEuO19SJSN1W0sjJHg0QUc4LmtLL0hTQj09LSdJZS9RVHRHPy0uKl5OLTRCL1pNXzNZbFFDNyhwN3EpJl0oYDZfYykkLypKTChMLV4oXSR3SU1gZFB0T2RHQSxVMzp3Mk0tMDxxLV1MXz9eKTF2dycuLE1Sc3FWci5MO2FOJiMvRWdKKVBCY1stZj4rV29tWDJ1N2xxTTJpRXVtTVRjc0Y/LWFUPVotOTdVRW5YZ2xFbjFLLWJuRU9gZ3VGdChjJT07QW1fUXNAakxvb0kmTlg7XTAjajQjRjE0O2dsOC1HUXBnd2hycTgnPWxfZi1iNDknVU9xa0x1Ny0jI29EWTJMKHRlK01jaCZnTFl0SixNRXRKZkxoJ3gnTT0kQ1MtWlolUF04Ylo+I1M/WVkjJVEmcSczXkZ3Jj9EKVVETnJvY00zQTc2Ly9vTD8jaDdnbDg1W3FXL05ET2slMTZpajsrOjFhJ2lOSWRiLW91OC5QKncsdjUjRUkkVFdTPlBvdC1SKkgnLVNFcEE6ZylmK08kJSVga0EjRz04Uk1tRzEmT2A+dG84YkNdVCYkLG4uTG9PPjI5c3AzZHQtNTJVJVZNI3E3J0RIcGcrI1o5JUhbSzxMJWEyRS1ncldWTTNAMj0tazIydExdNCQjIzZXZSc4VUpDS0VbZF89JXdJOyc2WC1Hc0xYNGpeU2dKJCMjUip3LHZQM3dLI2lpVyYjKmheRCZSP2pwNysvdSYjKEFQIyNYVThjJGZTWVctSjk1Xy1EcFtnOXdjTyYjTS1oMU9jSmxjLSp2cHcweFVYJiNPUUZLTlhAUUknSW9QcDduYixRVS8vTVEmWkRrS1ApWDxXU1ZMKDY4dVZsJiNjJ1swIyhzMVgmeG0kWSVCNypLOmVEQTMyM2o5OThHWGJBI3B3TXMtamdEJDlRSVNCLUFfKGFONHhvRk1eQEM1OEQwK1ErcTNuMCMzVTFJbkRqRjY4Mi1Tak1YSkspKGgkaHh1YV9LXXVsOTIlJ0JPVSYjQlJSaC1zbGc4S0RscjolTDcxS2E6LkE7JVlVTGpEUG1MPExZczhpI1h3Sk9ZYUtQS2MxaDonOUtlLGcpYiksNzg9STM5Qjt4aVkkYmdHdy0mLlppOUluWER1WWElRypmMkJxN21uOV4jcDF2diUjKFdpLTsvWjVobzsjMjo7JWQmI3g5djY4QzVnP250WDBYKXBUYDslcEIzcTdtZ0dOKTMlKFA4blRkNUw3R2VBLUdMQCslSjN1MjooWWY+ZXRgZTspZiNLbTgmK0RDJEk0Nj4jS3JdXXUtWz05OXR0czEucWIjcTcyZzFXSk84MXErZU4nMDMnZU0+JjFYeFktY2FFbk9qJTJuOCkpLD9JTFI1Xi5JYm48LVgtTXE3W2E4MkxxOkYmI2NlK1M5d3NDSyp4YDU2OUU4ZXcnSGVdaDpzSVsyTE0kW2d1a2EzWlJkNjp0JUlHOjskJVlpSjpOcT0/ZUF3Oy86bm5EcTAoQ1ljTXBHKXFMTjQkIyMmSjxqJFVwSzxRNGExXU11cFdeLXNqXyQlW0hLJSdGIyMjI1FSWko6OlkzRUdsNCdAJUZraUFPZyNwWyMjT2BndWtUZkJIYWdMPExIdyVxJk9WMCMjRj02LzpjaEltMEBlQ1A4WF06a0ZJJWhsOGhnT0BSY0JoUy1AUWIkJSttPWhQRExnKiVLOGxuKHdjZjMvJ0RXLSQubFI/bltuQ0gtZVhPT05USmxoOi5SWUYlMydwNnNxOlVJTUE5NDUmXkhGUzg3QCRFUDJpRzwtbENPJCVjYHVLR0QzckMkeDBCTDhhRm4tLWBrZSUjSE1QJ3ZoMS9SJk9fSjkndW0sLjx0eFtAJXdzSmsmYlVUMmAwdU12N2dnI3FwL2lqLkw1NidobDsuczVDVXJ4ak9NNy0jIy5sK0F1J0EmTzotVDcyTF1QYCY9O2N0cCdYU2NYKnJVLj4tWFR0LCVPVlU0KVMxK1ItI2RnMC9Obj9LdTFeMGYkQipQOlJvd3dtLWAwUEtqWURETSczXWQzOVZaSEVsNCwuaiddUGstTS5oXiY6MEZBQ20kbWFxLSZzZ3cwdDcvNiheeHRrJUx1SDg4RmotZWttPkdBI18+NTY4eDYoT0ZSbC1JWnBgJmIsX1AnJE08Sm5xNzlWc0pXL21XUypQVWlxNzY7XS9OTV8+aExieGZjJG1qYCxPOyYlVzJtYFpoOi8pVWV0dzphSiVdSzloOlRjRl11Xy1TajksVkszTS4qJyYwRFtDYV1KOWdwOCxrQVddJSg/QSVSJGY8LT5adHMnXmtuPS1eQGM0JS1wWTZxSSVKJTFJR3hmTFU5Q1A4Y2JQbFh2KTtDPWIpLDwybU92UDh1cCxVVmYzODM5YWNBV0FXLVc/I2FvL14jJUtZbzhmUlVMTmQyLj4lbV1VSzpuJXIkJ3N3XUo7NXBBb09fIzJtTzNuLCc9SDUoZXRIZypgK1JMZ3Y+PTRVOGd1RCRJJUQ6Vz4tcjVWKiVqKlc6S3Zlai5McCQ8TS1TR1onOitRX2srdXZPU0xpRW8oPGFEL0s8Q0NjYCdMeD4nPzsrK08nPigpakxSLV51NjhQSG04WkZXZStlajhoOjlyNkwqMC8vYyZpSCZSOHBSYkEjS2ptJXVwVjFnOmFfI1VyN0Z1QSModFJoIy5ZNUsrQD8zPC04bTAkUEVuO0o6cmg2P0k2dUc8LWB3TVUnaXJjcDBMYUVfT3RsTWImMSM2VC4jRkRLdSMxTHcldSUrR00rWCdlP1lMZmpNW1ZPME1idUZwNzs+USYjV0lvKTBARiVxN2MjNFhBWE4tVSZWQjxIRkYqcUwoJC9WLDsoa1haZWpXT2A8WzU/P2V3WSgqOT0ld0RjOyx1PCc5dDNXLShIMXRoMytHXXVjUV1rTHM3ZGYoJC8qSkxdQCp0N0J1X0czXzdtcDc8aWFRak9ALmtMZzt4M0IwbHFwN0hmLF5aZTctIyNAL2M1OE1vKDM7a25wMCUpQTc/LVcrZUknbzgpYjxuS253J0hvOEM9WT5wcUI+MGllJmpoWls/aUxSQEBfQXZBLWlRQyg9a3NSWlJWcDdgLj0rTnBCQyVyaCYzXVI6OFhEbUU1XlY4Tyh4PDxhRy8xTiQjRlgkMFY1WTZ4J2FFckkzSSQ3eCVFYHY8LUJZLCklLT9Qc2YqbD8lQzMubU0oPS9NMDpKeEcnPzdXaEglbydhPC04MGcwTkJ4b08oR0g8ZE1dbi4rJXFAakg/Zi5Vc0oyR2dzJjQ8LWU0NyZLbCtmLy85QGBiKz8uVGVOXyZCOFNzP3Y7XlRyaztmI1l2SmtsJnckXT4tK2s/Jyg8Uzo2OHRxKldvRGZadSc7bU0/OFhbbWE4VyUqYC09O0QuKG5jNy87KWc6VDE9XkokJkJSVigtbFRtTkI2eHFCW0AwKm8uZXJNKjxTV0ZddTI9c3QtKig2dj5eXShILmFSRVpTaSwjMTpbSVhhWkZPbTwtdWkjcVVxMiQjI1JpO3U3NU9LIyhSdGFXLUstRmBTK2NGXXVOYC1LTVElclAvWHJpLkxSY0IjIz1ZTDNCZ00vM01EP0BmJjEnQlctKUp1PEwyNWdsOHVoVm0xaEwkIyMqOCMjIydBMy9Ma0tXKyhecldYPzVXXzhnKWEobSZLOFA+I2JtbVdDTWtrJiNUUmBDLDVkPmcpRjt0LDQ6QF9sOEcvNWg0dlVkJSYlOTUwOlZYRCdRZFdvWS1GJEJ0VXdtZmUkWXFMJzgoUFdYKFA/XkBQbzMkIyNgTVNzP0RXQlovUz4rNCU+ZlgsVld2L3cnS0RgTFA1SWJIO3JUVj5uM2NFSzhVI2JYXWwtL1YrXmxqMzt2bE1iJls1WVE4I3Bla1g5SlAzWFVDNzJMLCw/K05pJmNvN0Fwbk8qNU5LLCgoVy1pOiQsa3AnVURBTyhHMFNxN01WakpzYkl1KSdaLCpbPmJyNWZYXjpGUEFXci1tMktnTDxMVU4wOThrVEYmI2x2bzU4PS92akRvOy47KUthKmhMUiMvaz1yS2J4dVZgPlFfbk42Jzh1VEcmIzFUNWcpdUx2Ojg3M1VwVExnSCsjRmdwSCdfbzE3ODBQaDhLbXhRSjgjSDcyTDRANzY4QFRtJlFoNENCLzVPdm1BJixRJlFiVW9pJGFfJTNNMDFIKTR4N0leJktRVmd0Rm5WKztbUGM+W200ay8vLF0xPyNgVllbSnIqMyYmc2xSZkxpVlpKOl0/PUszU3c9WyQ9dVJCPzN4azQ4QGFlZzxaJzwkIzRIKTYsPmUwalQ2J04jKHElLk89PzJTXXUqKG08LVY4SicoMSlHXVs2OGhXJDUncVtHQyY1amBURT9tJ2VzRkdOUk0paixmZlo/LXF4ODstPmc0dCo6Q0lQL1tRYXA3LzknIygxc2FvN3ctLnFOVWRrSil0Q0YmI0JeO3hHdm4ycjlGRVBGRkZjTEAuaUZOa1R2ZSRtJSNRdlFTOFVAKTJaKzNLOkFLTTVpc1o4OCtkS1EpVzY+SiVDTDxLRT5gLmQqKEJgLW44RDlvSzxVcF1jJFgkKCwpTThadDcvW3Jka3FUZ2wtMGN1R012Jz8+LVhWMXFbJy01aydjQVo2OWU7RF8/JFpQUCZzXis3XSkkKiQjQFFZaTksNVAmIzlyKyQlQ0U9Njg+SzhyMD1kU0MlJShAcDcubTdqaWxRMDInMC1WV0FnPGEvJyczdS49NEwkWSk2ay9LOl9bMz0manZMPEwwQy8yJ3Y6XjstRElCVyxCNEU2ODprWjslPzgoUThCSD1rTzY1Qlc/eFNHJiNAdVUsRFMqLD8uKyhvKCMxdkNTOCNDSEY+VGxHVydiKVRxN1ZUOXFeKl4kJC46Jk5AQCQmKVdIdFBtKjVfck8wJmUlSyYjLTMwaihFNCMnWmIuby8oVHBtJD5LJ2ZAW1B2RmwsaGZJTlROVTZ1JzBwYW83JVhVcDldNS4+JWhgOF89VllieHVlbC5OVFNzSmZMYWNGdTNCJ2xRU3UvbTYtT3FlbThUK29FLS0kMGEva111ajlFd3NHPiV2ZVIqaHZeQkZwUWo6SycjU0osc0ItJyNdKGouTGc5MnJUdy0qbiVALzszOXJySkYsbCNxViVPcnRCZUM2Lyw7cUIzZWJOV1s/LEhxajJMLjFOUCZHalVSPTFEOFFhUzNVcCZAKjl3UD8rbG83Yj9AJSdrNGBwMFokMjIlSzMraUNaaj9YSk40Tm0mK1lGXXVALVckVSVWRVEvLCw+PiMpRDxoI2ApaDA6PFE2OTA5dWErJlZVJW4yOmNHM0ZKLSVAQmotRGdMcmBIdyZIQUtqS2pzZUs8L3hLVCopQixOOVgzXWtyYzEydCdwZ1RWKEx2LXRMW3hnXyU9TV9xN2FeeD83VWJkPiMlOGNZI1laPz0sYFdkeHUvYWUmI3c2KVI4OXRJIzZAcycoNkJmN2EmP1M9XlpJX2tTJmFpYCY9dEU3MkxfRCw7XlIpN1skczxFaCNjJilxLk1YSSUjdjlST2E1RlpPJXNGN3E3TndiJiNwdFVKOmFxSmUkU2w2OCUuRCMjI0VDPjw/LWFGJiNSTlF2Pm84bEtOJTUvJCh2ZGZxNytlYkEjdTFwXW92VUtXJlklcV0nPiQxQC1beGZuJDdaVHA3bU0sRyxLbzdhJkd1JUdbUk14SnNbME1NJXdjaS5MRkRLKSg8Y2BROE4pakVJRiorP1AyYThnJSkkcV1vMmFIOEMmPFNpYkMvcSwoZTp2Oy1iIzZbJE50RFo4NEplMktOdkIjJFA1P3RRM250KDBkPWouTFFmLi9MbDMzKyg7cTNMLXc9OGRYJCNXRiZ1SUpALWJmST4lOl9pMkI1Q3NSOCY5WiYjPW1QRW5tMGZgPCZjKVFMNXVKIyV1JWxKaitELXI7Qm9GJiM0RG9TOTdoNWcpRSNvOiZTNHdlREYsOV5Ib2VgaCpMK19hKk5yTFctMXBHXyYyVWRCODZlJUIvOj0+KU40eGVXLip3ZnQtOyQnNTgtRVNxcjxiP1VJKF8lQFtQNDY+I1VgJzZBUV1tJjYvYFo+I1M/WVkjVmM7cjdVMiYzMjZkPXcmSCMjIyM/VFpgKjQ/Ji5NSz9MUDhWeGc+JFtRWGMlUUp2OTIuKERiKkIpZ2IqQk05ZE0qaEpNQW8qYyYjYjB2PVBqZXJdJGdHJkpYRGYtPidTdHZVNzUwNWw5JEFGdmdZUkleJjxeYjY4P2ojcTlRWDRTTSdSTyMmc0wxSU0uckpmTFVBajIyMV1kIyNEVz1tODN1NTsnYll4LCpTbDBoTChXOzskZG9CJk8vVFE6KFpeeEJkTGpMPExuaTsnJ1guYCQjOCsxR0Q6ayRZVVdzYm44b2doNnJ4WjJaOV0lbmQrPlYjKjhVXzcyTGgrMlE4Q2owaTo2aHAmJEMvOnAoSEs+VDhZW2dIUTRgNCknJEFiKE5vZiVWJzhoTCYjPE5FZHRnKG4nPVMxQShRMS9JJjQoWyVkTWAsSXUnMTpfaEw+U2ZEMDcmNkQ8ZnA4ZEhNNy9nK3RsUE45SipyS2FQY3QmPyd1QkNlbV5qbiU5X0spPCxDNUszcz01ZyZHbUpiKltTWXE3SztUUkxHQ3NNLSQkO1MlOllAcjdBSzBwcHJwTDxMcmgscTdlLyVLV0s6NTBJXittJ3ZpYDM/JVpwKzwtZCskTC1TdjpALm8xOW4kczAmMzk7a247UyVCU3EqJDNXb0pTQ0x3ZVZbYVonTVFJak88NztYLVg7JitkTUx2dSNeVXNHRUM5V0VjW1god0k3IzIuKEYwalYqZVpmPC1RdjNKLWMrSjVBbHJCIyRwKEg2OEx2RUEncTNuMCNtLFtgKjhGdClGY1lnRXVkXUNXZm02OCwoYUxBJEBFRlRnTFhvQnEvVVBscDc6ZFsvO3JfaXg9OlRGYFM1SC1iPExJJkhZKEs9aCMpXUxrJEsxNGxWZm06eCRIPDNeUWw8TWAkT2hhcEJua3VwJ0QjTCRQYl9gTipnXTJlO1gvRHRnLGJzaiZLIzJbLTppWXInX3dnSClOVUlSOGExbiNTP1llaidoOF41OFViWmQrXkZLRCpUQDs2QTdhUUNbSzhkLSh2NkdJJHg6VDwmJ0dwNVVmPkBNLipKOjskLXJ2MjknTV04cU12LXRMcCwnODg2aWFDPUhiKllKb0tKLChqJUs9SGBLLnY5SGdncUJJaVp1J1F2QlQuIz0pMHVrcnVWJi4pMz0oXjFgbypQajQ8LTxhTigoXjcoJyNaMHdLIzVHWEA3dV1bYCpTXjQzOTMzQTRybF1bYCpPNENnTEVsXXYkMVEzQWVGMzdkYlhrLC4pdmojeCdkYDtxZ2JRUiVGVywyKD9MTz1zJVNjNjglTlAnIyNBb3RsOHg9QkUjajFVRChbMyRNKF1VSTJMWDNScEtOQDsvI2YnZi8mX210JkYpWGRGPDl0NClRYS4qa1RMd1EnKFRUQjkueEgnPiNNSitnTHE5LSMjQEh1WlBOMF11Omg3LlQuLkc6OyQvVXNqKFQ3YFE4dFQ3MkxuWWw8LXF4ODstSFY3US0mWGR4JTFhLGhDPTB1K0hsc1Y+bnVJUUwtNTxOPylOQlMpUU4qX0ksPyYpMidJTSVMM0kpWCgoZS9kbDImOCc8TTpeI00qUStbVC5YcmkuTFlTM3YlZkZgNjhoO2ItWFsvRW4nQ1IucTdFKXAnL2tsZTJITSx1O14lT0tDLU4rTGwlRjlDRjxOZideI3QyTCw7MjdXOjBPQDYjI1U2Vzc6JHJKZkxXSGokIyl3b3FCZWZJWi5QSzxiKnQ3ZWQ7cCpfbTs0RXhLI2hAJl0+Xz5Aa1hRdE1hY2ZELm0tVkFiODtJUmVNMyR3ZjAnJ2hyYSpzbzU2OCdJcCZ2UnM4NDknTVJZU3AlOnQ6aDVxU2d3cEVyJEI+USw7cyhDIyQpYHN2UXVGJCMjLUQsIyMsZzY4QDJbVDsuWFNkTjlRZSlycHQuX0stIzV3RilzUCcjI3AjQzBjJS1HYiVoZCs8LWonQWkqeCYmSE1rVF1DJ09TbCMjNVJHW0pYYUhOO2QndUEjeC5fVTsuYFBVQChaM2R0NHIxNTJAOnYsJ1IuU2ondyMwPC07a1BJKUZmSiYjQVlKJiMvLyk+LWs9bT0qWG5LJD49KTcyTF0wSSU+Lkc2OTBhOiQjIzwsKTs/OzcyIz94OStkO15WJzk7allAOyliciNxXllRcHg6WCNUZSRaXic9LT1iR2hMZjpENiZiTndaOS1aRCNuXjlIaExNcjVHOyddZCY2J3dZbVRGbUw8TEQpRl4lW3RDJzg7KzlFI0MkZyUjNVk+cTl3ST5QKDltSVs+a0MtZWtMQy9SJkNIK3MnQjtLLU02JEVCJWlzMDA6K0E0Wzd4a3MuTHJOazAmRSl3SUxZRkAyTCcwTmIkK3B2PCgyLjc2OC9GclkmaCReM2kmQCtHJUpUJzwtLHZgMztfKUk5TV5BRV1DTj9DbDJBWmcrJTRpVHBUMzxuLSYlSCViPEZEajJNPGhIPSZFaDwyTGVuJGIqYVRYPS04UXhOKWsxMUlNMWNeaiU5czxMPE5GU28pQj8rPC0oR3hzRixeLUVoQCQ0ZFhoTiQrI3J4SzgnamUnRDdrYGU7KTJwWXdQQSdfcDkmQF4xOG1sMV5bQGc0dCpbSk9hKls9UXA3KHFKX29PTF4oJzdmQiZIcS06c2Ysc05qOHhxXj4kVTRPXUdLeCdtOSliQHA3WXN2SzN3XllSLUNkUSo6SXI8KCR1JikjKCY/TDlSZzNIKTRmaUVwXmlJOU84S25UaixdSD9EKnI3J007UHdaOUswRV5rJi1jcEk7LnAvNl92d29GTVY8LT4jJVhpLkx4Vm5yVSg0JjgvUCs6aExTS2okI1UlXTQ5dCdJOnJnTWknRkxAYTowWS11QVszOScsKHZibWEqaFUlPC1TUkZgVHQ6NTQyUl9WViRwQFtwOERWW0EsPzE4MzlGV2RGPFRkZEY8OUFoLTYmOXRXb0RsaF0mMVNwR01xPlRpMU8qSCYjKEFMOFtfUCUuTT52Xi0pKXFPVCpGNUNxMGBZZSUrJEI2aTo3QDBJWDxOK1QrME1sTUJQUSpWaj5Tc0Q8VTRKSFk4a0QyKTJmVS9NIyRlLilUNCxfPThoTGltWyYpOz9Va0snLXg/Jyg6c2lJZkw8JHBGTWBpPD8lVyhtR0RITSU+aVdQLCMjUGAlL0w8ZVhpOkBaOUMuN289QChwWGRBTy9OTFE4bFBsK0hQT1FhOHdEOD1eR2xQYThUS0kxQ2poc0NUU0xKTScvV2w+LVMocXclc2YvQCUjQjY7L1U3S111WmJpXk9jXjJuPGJoUG1Va013PiV0PCknbUVWRScnbmBXbkpyYSReVEt2WDVCPjtfYVNFSycsKGh3YTA6aTRHPy5CY2kuKFhbP2IqKCQsPS1uPC5RJWAoWD0/K0BBbSpKczAmPTNiaDhLXW1MPExvTnMnNiwnODVgMD90LydfVTU5QF1kZEY8I0xkRjxlV2RGPE91Ti80NXJZPC1MQCYjK2ZtPjY5PUxiLE9jWlYvKTtUVG04Vkk7PyVPdEo8KGI0bXE3TTY6dT9LUmRGPGdSQDJMPUZOVS08YlsoOWMvTUwzbTtaWyRvRjNnKUdBV3FwQVJjPTxST3U3Y0w1bDstW0FdJS8rZnNkO2wjU2FmVC9mKlddMD1PJyQoVGI8WykqQGU3NzVSLTpZb2IlZyo+bCo6eFA/WWIuNSkld19JPzd1azVKQytGUyhtI2knay4nYTBpKTk8N2InZnMnNTlocSQqNVVodiMjcGleOCtoSUVCRmBudm9gOydsMC5eUzE8LXdVSzIvQ29oNThLS2hMak09U08qcmZPYCtxQ2BXLU9uLj1BSjU2Pj5pMkAyTEg2QTomNXFgPzlJM0BAJzA0JnAyL0xWYSpULTQ8LWkzO005VXZaZCtONz5iKmVJd2c6Q0MpYzw+bk8mIzxJR2U7X18udGhqWmw8JXcoV2syeG1wNFFASSNJOSxERl11Ny1QPS4tXzpZSl1hU0BWPzYqQygpZE9wNzpXTCxiJjNSZy8uY21NOSZyXj4kKD4uWi1JJkooUTBIZDVRJTdDby1iYC1jPE4oNnJAaXArQXVySzxtODZRSXRoKiN2Oy1PQnFpK0w3d0RFLUlyOEtbJ20rRERTTHdLJi8uPy1WJVVfJTM6cUtOdSRfYipCLWtwN05hRCdRZFdRUEtZcVtAPlApaEk7Kl9GXXVgUmJbLmo4X1EvPCY+dXUrVnNIJHNNOVRBJT8pKHZtSjgwKSxQN0U+KXRqRCUyTD0tdCNmS1slYHY9UTg8RmZOa2dnXm9JYmFoKiM4L1F0JEYmOksqLShOLycrMXZNQix1KCktYS5WVVUqI1tlJWdBQU8oUz5XbEEyKTtTYT5nWG04WUJgMWRASyNuXTc2LWEkVSxtRjxmWF1pZHFkKTwzLF1KN0ptVzRgNl11a3M9NC03MkwoakVrKzpiSjBNXnEtOERtX1o/MG9sUDFDOVNhJkhbZCZjJG9vUVVqXUV4ZCozWk1ALVdHVzIlcycsQi1fTSU+JVVsOiMvJ3hvRk05UVgtJC5RTic+WyUkWiR1RjZwQTZLaTJPNTo4dyp2UDE8LTFgW0csKS1tIz4wYFAmI2ViIy4zaSlydEI2MShvJyQ/WDNCPC9SOTA7ZVpdJU5jcTstVGxdI0Y+MlFmdF5hZV81dEtMOU1VZTliKnNMRVE5NUMmYD1HP0BNaj13aConM0U+PS08KUd0Kkl3KSdRRzpgQEl3T2Y3Jl0xaSdTMDFCK0V2L05hYyM5Uzs9O1lRcGdfNlVgKmtWWTM5eEssWy82QWo3OicxQm0tXzFFWWZhMStvJm80aHA3S05fUShPbElvQFMlO2pWZG4wJzE8VmM1Mj11YDNeby1uMSdnNHY1OEhqJjZfdDckIyM/TSljPCRiZ1FfJ1NZKCgteGtBI1koLHAnSDlySVZZLWIsJyViQ1BGNy5KPFVwXiwoZFUxVlkqNSNXa1RVPmgxOXcsV1FoTEkpM1MjZiQyKGViLGpyKmI7M1Z3XSo3TkglJGM0VnMsZUQ5PlhXOD9OXW8rKCpwZ0MlLzcyTFYtdTxIcCwzQGVeOVVCMUorYWs5LVROL21oS1BnK0FKWWQkTWx2QUZfakNLKi5PLV4oNjNhZE1ULT5XJWlld1M4VzZtMnJ0Q3BvJ1JTMVI4ND1AcGFUS3QpPj0lJjFbKSp2cCd1K3gsVnJ3TjsmXWt1TzlKRGJnPXBPJEoqLmpWZTt1J20wZHI5bCw8KndNSypPZT1nOGxWX0tFQkZrTydvVV1ePVstNzkyI29rLClpXWxSOHFRMm9BOHdjUkNaXjd3L05qaDs/LnN0WD9RMT5TMXE0Qm4kKUsxPC1yR2RPJyRXci5MYy5DRykkLypKTDR0TlIvLFNWTzMsYVV3J0RKTjopU3M7d0duOUEzMmlqdyVGTCtaMEZuLlU5O3JlU3EpYm1JMzJVPT01QUx1RyYjVmYxMzk4L3BWbzEqYy0oYVkxNjhvPGBKc1Niay0sMU47JD4wOk9VYXMoMzo4Wjk3MkxTZkY4ZWI9Yy07PlNQdzcuNmhuM21gOV5Ya24oci5xU1swO1QlJlFjPStTVFJ4WCdxMUJOazMmKmV1MjsmOHEkJng+USNRN15UZis2PChkJVpWbWoyYkRpJS4zTDJuKzRXJyRQaURERylnLHIlKz8sJEA/dW91NXRTZTJhTl9BUVUqPGhgZS1HSTcpP09LMkEuZDdfYyk/d1E1QVNAREwzciM3ZlNrZ2w2LSsrRDonQSx1cTdTdmxCJHBjcEgncTNuMCNfJWRZI3hDcHItbDxGME5SQC0jI0ZFVjZOVEY2IyMkbDg0TjF3P0FPPidJQU9VUlEjI1ZeRnYtWEZiR003RmwoTjwzRGhMR0YlcS4xckMkIzpUX18mUGk2OCUweGlfJltxRkooNzdqXyZKV29GLlY3MzUmVCxbUio6eEZSKks1Pj4jYGJXLT80TmVfJjZOZV8mNk5lXyZuYGtyLSNHSmNNNlg7dU02WDt1TSguYS4uXjJUa0wlb1IoIzt1LlQlZkFyJTR0SjgmPjwxPUdIWl8rbTkvI0gxRl5SI1NDIypOPUJBOShEP3ZbVWlGWT4+XjhwLEtLRi5XXUwyOXVMa0xsdS8rNFQ8WG9JQiZoeD1UMVBjRGFCJjtISCstQUZyPyhtOUhaVilGS1M4SkN3O1NEPTZbXi9EWlVMYEVVRGZdR0dsRyY+dyQpRi4vXm4zK3JsbytEQjs1c0lZR05rK2kxdC02OUpnLS0wcGFvN1NtI0spcGRIVyY7THVETkhASD4jL1gtVEkoO1A+IyxHYz4jMFN1PiM0YDE/IzhsQz8jPHhVPyNALmk/I0Q6JUAjSEY3QCNMUklAI1BfW0AjVGtuQCNYdypBI10tPUEjYTlPQSNkPEYmIyo7RyMjLkdZIyMyU2wjIzZgKCQjOmw6JCM+eEwkI0IuYCQjRjpyJCNKRi4lI05SQCUjUl9SJSNWa2UlI1p3dyUjXy00JiMzXlJoJVNmbHItaydNUy5vPy41L3NXZWwvd3BFTTAlMycvMSlLXmYxLWQ+RzIxJnYoMzU+VmAzOVY3QTQ9b254NEExT1k1RUkwOzZJYmdyNk0kSFM3UTwpNThDNXcsO1dvQSojWyVUKiNgMWcqI2Q9IysjaEk1KyNsVUcrI3BiWSsjdG5sKyN4JCksIyYxOywjKj1NLCMuSWAsIzJVciwjNmIuLSM7d1tII2lRdEEjbV4wQiNxakJCI3V2VEIjIy1oQiMnOSRDIytFNkMjL1FIQyMzXlpDIzdqbUMjO3YpRCM/LDxEI0M4TkQjR0RhRCNLUHNEI09dL0UjZzFBNSNLQSoxI2dDMTcjTUdkOyM4KDAyI0wtZDMjcldNNCNIZ2ExIyw8dzAjVC5qPCNPIycyI0NZTjEjcWFeOiNfNG0zI29ALz0jZUc4PSN0OEo1I2ArNzgjNHVJLSNtM0IyI1NCWzgjUTBAOCNpWyo5I2lPbjgjMU5tOyNec045I3FoPDkjOj14LSNQO0syIyQlWDkjYkMrLiNSZzs8I21OPS4jTVRGLiNSWk8uIzI/KTQjWSMoLyNbKTEvI2I7TC8jZEFVLyMwU3Y7I2xZJDAjbmAt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AK8YoQAhLEYAWfPXANl6mACeVMAAT4b6AFYG/ADlea4AiSI2ADitIgBnk9wAVeiqAIImOADK55sAUQ2kAJkzsQCp1w4AaQVIAGWy8AB/iKcAiEyXAPnRNgAhkrMAe4JKAJjPIQBAn9wA3EdVAOF0OgBn60IA/p3fAF7UXwB7Z6QAuqx6AFX2ogAriCMAQbpVAFluCAAhKoYAOUeDAInj5gDlntQASftAAP9W6QAcD8oAxVmKAJT6KwDTwcUAD8XPANtargBHxYYAhUNiACGGOwAseZQAEGGHACpMewCALBoAQ78SAIgmkAB4PIkAqMTkAOXbewDEOsIAJvTqAPdnigANkr8AZaMrAD2TsQC9fAsApFHcACfdYwBp4d0AmpQZAKgplQBozigACe20AESfIABOmMoAcIJjAH58IwAPuTIAp/WOABRW5wAh8QgAtZ0qAG9+TQClGVEAtfmrAILf1gCW3WEAFjYCAMQ6nwCDoqEAcu1tADmNegCCuKkAazJcAEYnWwAANO0A0gB3APz0VQABWU0A4HGAAEHjzAMLnw1A+yH5PwAAAAAtRHQ+AAAAgJhG+DwAAABgUcx4OwAAAICDG/A5AAAAQCAlejgAAACAIoLjNgAAAAAd82k1OGPtPtoPST9emHs/2g/JP2k3rDFoISIztA8UM2ghojMAAIA/AADAPwAAAADcz9E1AAAAAADAFT8AAAAAAAAAAP////////////////////////////////////////////////////////////////8AAQIDBAUGBwgJ/////////woLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIj////////CgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAECBAcDBgUAAAAAAAAA0XSeAFedvSqAcFIP//8+JwoAAABkAAAA6AMAABAnAACghgEAQEIPAICWmAAA4fUFGAAAADUAAABxAAAAa////877//+Sv///AAAAAAAAAAACAADAAwAAwAQAAMAFAADABgAAwAcAAMAIAADACQAAwAoAAMALAADADAAAwA0AAMAOAADADwAAwBAAAMARAADAEgAAwBMAAMAUAADAFQAAwBYAAMAXAADAGAAAwBkAAMAaAADAGwAAwBwAAMAdAADAHgAAwB8AAMAAAACzAQAAwwIAAMMDAADDBAAAwwUAAMMGAADDBwAAwwgAAMMJAADDCgAAwwsAAMMMAADDDQAA0w4AAMMPAADDAAAMuwEADMMCAAzDAwAMwwQADNMAAAAAMOkAAKwDAACtAwAArgMAAFN0OWV4Y2VwdGlvbgAAAAAQ7AAAIOkAAAAAAABc6QAAUwMAAK8DAACwAwAAU3QxMWxvZ2ljX2Vycm9yADjsAABM6QAAMOkAAAAAAACQ6QAAUwMAALEDAACwAwAAU3QxMmxlbmd0aF9lcnJvcgAAAAA47AAAfOkAAFzpAABTdDl0eXBlX2luZm8AAAAAEOwAAJzpAABOMTBfX2N4eGFiaXYxMTZfX3NoaW1fdHlwZV9pbmZvRQAAAAA47AAAtOkAAKzpAABOMTBfX2N4eGFiaXYxMTdfX2NsYXNzX3R5cGVfaW5mb0UAAAA47AAA5OkAANjpAABOMTBfX2N4eGFiaXYxMTdfX3BiYXNlX3R5cGVfaW5mb0UAAAA47AAAFOoAANjpAABOMTBfX2N4eGFiaXYxMTlfX3BvaW50ZXJfdHlwZV9pbmZvRQA47AAAROoAADjqAABOMTBfX2N4eGFiaXYxMjBfX2Z1bmN0aW9uX3R5cGVfaW5mb0UAAAAAOOwAAHTqAADY6QAATjEwX19jeHhhYml2MTI5X19wb2ludGVyX3RvX21lbWJlcl90eXBlX2luZm9FAAAAOOwAAKjqAAA46gAAAAAAACjrAACyAwAAswMAALQDAAC1AwAAtgMAAE4xMF9fY3h4YWJpdjEyM19fZnVuZGFtZW50YWxfdHlwZV9pbmZvRQA47AAAAOsAANjpAAB2AAAA7OoAADTrAABQdgAA8OwAAEDrAAAAAAAAOOsAAERuAADs6gAAVOsAAGIAAADs6gAAYOsAAGMAAADs6gAAbOsAAGgAAADs6gAAeOsAAGEAAADs6gAAhOsAAHMAAADs6gAAkOsAAHQAAADs6gAAnOsAAGkAAADs6gAAqOsAAGoAAADs6gAAtOsAAGwAAADs6gAAwOsAAG0AAADs6gAAzOsAAHgAAADs6gAA2OsAAHkAAADs6gAA5OsAAGYAAADs6gAA8OsAAGQAAADs6gAA/OsAAAAAAAAI6gAAsgMAALcDAAC0AwAAtQMAALgDAAC5AwAAugMAALsDAAAAAAAAgOwAALIDAAC8AwAAtAMAALUDAAC4AwAAvQMAAL4DAAC/AwAATjEwX19jeHhhYml2MTIwX19zaV9jbGFzc190eXBlX2luZm9FAAAAADjsAABY7AAACOoAAAAAAADc7AAAsgMAAMADAAC0AwAAtQMAALgDAADBAwAAwgMAAMMDAABOMTBfX2N4eGFiaXYxMjFfX3ZtaV9jbGFzc190eXBlX2luZm9FAAAAOOwAALTsAAAI6gAAAAAAAGjqAACyAwAAxAMAALQDAAC1AwAAxQMAQYjaAwsJCgAAAAsAAAAFAEGc2gMLAqMDAEG02gMLDqQDAAClAwAAOEYBAAAEAEHM2gMLAQEAQdvaAwsFCv////8AQaDbAwsCEO0AQdDcAwsDYEoBAEGI3QMLA4BMUQ==";if(!isDataURI(wasmBinaryFile)){wasmBinaryFile=locateFile(wasmBinaryFile);}function getBinary(file){try{if(file==wasmBinaryFile&&wasmBinary){return new Uint8Array(wasmBinary)}var binary=tryParseAsDataURI(file);if(binary){return binary}if(readBinary){return readBinary(file)}else {throw "both async and sync fetching of the wasm failed"}}catch(err){abort(err);}}function getBinaryPromise(){if(!wasmBinary&&(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)){if(typeof fetch==="function"&&!isFileURI(wasmBinaryFile)){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){if(!response["ok"]){throw "failed to load wasm binary file at '"+wasmBinaryFile+"'"}return response["arrayBuffer"]()}).catch(function(){return getBinary(wasmBinaryFile)})}else {if(readAsync){return new Promise(function(resolve,reject){readAsync(wasmBinaryFile,function(response){resolve(new Uint8Array(response));},reject);})}}}return Promise.resolve().then(function(){return getBinary(wasmBinaryFile)})}function createWasm(){var info={"a":asmLibraryArg};function receiveInstance(instance,module){var exports=instance.exports;Module["asm"]=exports;wasmMemory=Module["asm"]["R"];updateGlobalBufferAndViews(wasmMemory.buffer);wasmTable=Module["asm"]["V"];addOnInit(Module["asm"]["S"]);removeRunDependency();}addRunDependency();function receiveInstantiationResult(result){receiveInstance(result["instance"]);}function instantiateArrayBuffer(receiver){return getBinaryPromise().then(function(binary){var result=WebAssembly.instantiate(binary,info);return result}).then(receiver,function(reason){err("failed to asynchronously prepare wasm: "+reason);abort(reason);})}function instantiateAsync(){if(!wasmBinary&&typeof WebAssembly.instantiateStreaming==="function"&&!isDataURI(wasmBinaryFile)&&!isFileURI(wasmBinaryFile)&&typeof fetch==="function"){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){var result=WebAssembly.instantiateStreaming(response,info);return result.then(receiveInstantiationResult,function(reason){err("wasm streaming compile failed: "+reason);err("falling back to ArrayBuffer instantiation");return instantiateArrayBuffer(receiveInstantiationResult)})})}else {return instantiateArrayBuffer(receiveInstantiationResult)}}if(Module["instantiateWasm"]){try{var exports=Module["instantiateWasm"](info,receiveInstance);return exports}catch(e){err("Module.instantiateWasm callback failed with error: "+e);return false}}instantiateAsync().catch(readyPromiseReject);return {}}function callRuntimeCallbacks(callbacks){while(callbacks.length>0){var callback=callbacks.shift();if(typeof callback=="function"){callback(Module);continue}var func=callback.func;if(typeof func==="number"){if(callback.arg===undefined){wasmTable.get(func)();}else {wasmTable.get(func)(callback.arg);}}else {func(callback.arg===undefined?null:callback.arg);}}}function ___cxa_allocate_exception(size){return _malloc(size+16)+16}function ExceptionInfo(excPtr){this.excPtr=excPtr;this.ptr=excPtr-16;this.set_type=function(type){HEAP32[this.ptr+4>>2]=type;};this.get_type=function(){return HEAP32[this.ptr+4>>2]};this.set_destructor=function(destructor){HEAP32[this.ptr+8>>2]=destructor;};this.get_destructor=function(){return HEAP32[this.ptr+8>>2]};this.set_refcount=function(refcount){HEAP32[this.ptr>>2]=refcount;};this.set_caught=function(caught){caught=caught?1:0;HEAP8[this.ptr+12>>0]=caught;};this.get_caught=function(){return HEAP8[this.ptr+12>>0]!=0};this.set_rethrown=function(rethrown){rethrown=rethrown?1:0;HEAP8[this.ptr+13>>0]=rethrown;};this.get_rethrown=function(){return HEAP8[this.ptr+13>>0]!=0};this.init=function(type,destructor){this.set_type(type);this.set_destructor(destructor);this.set_refcount(0);this.set_caught(false);this.set_rethrown(false);};this.add_ref=function(){var value=HEAP32[this.ptr>>2];HEAP32[this.ptr>>2]=value+1;};this.release_ref=function(){var prev=HEAP32[this.ptr>>2];HEAP32[this.ptr>>2]=prev-1;return prev===1};}function ___cxa_throw(ptr,type,destructor){var info=new ExceptionInfo(ptr);info.init(type,destructor);throw ptr}var SYSCALLS={mappings:{},buffers:[null,[],[]],printChar:function(stream,curr){var buffer=SYSCALLS.buffers[stream];if(curr===0||curr===10){(stream===1?out:err)(UTF8ArrayToString(buffer,0));buffer.length=0;}else {buffer.push(curr);}},varargs:undefined,get:function(){SYSCALLS.varargs+=4;var ret=HEAP32[SYSCALLS.varargs-4>>2];return ret},getStr:function(ptr){var ret=UTF8ToString(ptr);return ret},get64:function(low,high){return low}};function ___sys_fcntl64(fd,cmd,varargs){SYSCALLS.varargs=varargs;return 0}function ___sys_ioctl(fd,op,varargs){SYSCALLS.varargs=varargs;return 0}function ___sys_open(path,flags,varargs){SYSCALLS.varargs=varargs;}function __embind_register_bigint(primitiveType,name,size,minRange,maxRange){}function getShiftFromSize(size){switch(size){case 1:return 0;case 2:return 1;case 4:return 2;case 8:return 3;default:throw new TypeError("Unknown type size: "+size)}}function embind_init_charCodes(){var codes=new Array(256);for(var i=0;i<256;++i){codes[i]=String.fromCharCode(i);}embind_charCodes=codes;}var embind_charCodes=undefined;function readLatin1String(ptr){var ret="";var c=ptr;while(HEAPU8[c]){ret+=embind_charCodes[HEAPU8[c++]];}return ret}var awaitingDependencies={};var registeredTypes={};var typeDependencies={};var char_0=48;var char_9=57;function makeLegalFunctionName(name){if(undefined===name){return "_unknown"}name=name.replace(/[^a-zA-Z0-9_]/g,"$");var f=name.charCodeAt(0);if(f>=char_0&&f<=char_9){return "_"+name}else {return name}}function createNamedFunction(name,body){name=makeLegalFunctionName(name);return new Function("body","return function "+name+"() {\n"+'    "use strict";'+"    return body.apply(this, arguments);\n"+"};\n")(body)}function extendError(baseErrorType,errorName){var errorClass=createNamedFunction(errorName,function(message){this.name=errorName;this.message=message;var stack=new Error(message).stack;if(stack!==undefined){this.stack=this.toString()+"\n"+stack.replace(/^Error(:[^\n]*)?\n/,"");}});errorClass.prototype=Object.create(baseErrorType.prototype);errorClass.prototype.constructor=errorClass;errorClass.prototype.toString=function(){if(this.message===undefined){return this.name}else {return this.name+": "+this.message}};return errorClass}var BindingError=undefined;function throwBindingError(message){throw new BindingError(message)}var InternalError=undefined;function throwInternalError(message){throw new InternalError(message)}function whenDependentTypesAreResolved(myTypes,dependentTypes,getTypeConverters){myTypes.forEach(function(type){typeDependencies[type]=dependentTypes;});function onComplete(typeConverters){var myTypeConverters=getTypeConverters(typeConverters);if(myTypeConverters.length!==myTypes.length){throwInternalError("Mismatched type converter count");}for(var i=0;i<myTypes.length;++i){registerType(myTypes[i],myTypeConverters[i]);}}var typeConverters=new Array(dependentTypes.length);var unregisteredTypes=[];var registered=0;dependentTypes.forEach(function(dt,i){if(registeredTypes.hasOwnProperty(dt)){typeConverters[i]=registeredTypes[dt];}else {unregisteredTypes.push(dt);if(!awaitingDependencies.hasOwnProperty(dt)){awaitingDependencies[dt]=[];}awaitingDependencies[dt].push(function(){typeConverters[i]=registeredTypes[dt];++registered;if(registered===unregisteredTypes.length){onComplete(typeConverters);}});}});if(0===unregisteredTypes.length){onComplete(typeConverters);}}function registerType(rawType,registeredInstance,options){options=options||{};if(!("argPackAdvance"in registeredInstance)){throw new TypeError("registerType registeredInstance requires argPackAdvance")}var name=registeredInstance.name;if(!rawType){throwBindingError('type "'+name+'" must have a positive integer typeid pointer');}if(registeredTypes.hasOwnProperty(rawType)){if(options.ignoreDuplicateRegistrations){return}else {throwBindingError("Cannot register type '"+name+"' twice");}}registeredTypes[rawType]=registeredInstance;delete typeDependencies[rawType];if(awaitingDependencies.hasOwnProperty(rawType)){var callbacks=awaitingDependencies[rawType];delete awaitingDependencies[rawType];callbacks.forEach(function(cb){cb();});}}function __embind_register_bool(rawType,name,size,trueValue,falseValue){var shift=getShiftFromSize(size);name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":function(wt){return !!wt},"toWireType":function(destructors,o){return o?trueValue:falseValue},"argPackAdvance":8,"readValueFromPointer":function(pointer){var heap;if(size===1){heap=HEAP8;}else if(size===2){heap=HEAP16;}else if(size===4){heap=HEAP32;}else {throw new TypeError("Unknown boolean type size: "+name)}return this["fromWireType"](heap[pointer>>shift])},destructorFunction:null});}function ClassHandle_isAliasOf(other){if(!(this instanceof ClassHandle)){return false}if(!(other instanceof ClassHandle)){return false}var leftClass=this.$$.ptrType.registeredClass;var left=this.$$.ptr;var rightClass=other.$$.ptrType.registeredClass;var right=other.$$.ptr;while(leftClass.baseClass){left=leftClass.upcast(left);leftClass=leftClass.baseClass;}while(rightClass.baseClass){right=rightClass.upcast(right);rightClass=rightClass.baseClass;}return leftClass===rightClass&&left===right}function shallowCopyInternalPointer(o){return {count:o.count,deleteScheduled:o.deleteScheduled,preservePointerOnDelete:o.preservePointerOnDelete,ptr:o.ptr,ptrType:o.ptrType,smartPtr:o.smartPtr,smartPtrType:o.smartPtrType}}function throwInstanceAlreadyDeleted(obj){function getInstanceTypeName(handle){return handle.$$.ptrType.registeredClass.name}throwBindingError(getInstanceTypeName(obj)+" instance already deleted");}var finalizationGroup=false;function detachFinalizer(handle){}function runDestructor($$){if($$.smartPtr){$$.smartPtrType.rawDestructor($$.smartPtr);}else {$$.ptrType.registeredClass.rawDestructor($$.ptr);}}function releaseClassHandle($$){$$.count.value-=1;var toDelete=0===$$.count.value;if(toDelete){runDestructor($$);}}function attachFinalizer(handle){if("undefined"===typeof FinalizationGroup){attachFinalizer=function(handle){return handle};return handle}finalizationGroup=new FinalizationGroup(function(iter){for(var result=iter.next();!result.done;result=iter.next()){var $$=result.value;if(!$$.ptr){console.warn("object already deleted: "+$$.ptr);}else {releaseClassHandle($$);}}});attachFinalizer=function(handle){finalizationGroup.register(handle,handle.$$,handle.$$);return handle};detachFinalizer=function(handle){finalizationGroup.unregister(handle.$$);};return attachFinalizer(handle)}function ClassHandle_clone(){if(!this.$$.ptr){throwInstanceAlreadyDeleted(this);}if(this.$$.preservePointerOnDelete){this.$$.count.value+=1;return this}else {var clone=attachFinalizer(Object.create(Object.getPrototypeOf(this),{$$:{value:shallowCopyInternalPointer(this.$$)}}));clone.$$.count.value+=1;clone.$$.deleteScheduled=false;return clone}}function ClassHandle_delete(){if(!this.$$.ptr){throwInstanceAlreadyDeleted(this);}if(this.$$.deleteScheduled&&!this.$$.preservePointerOnDelete){throwBindingError("Object already scheduled for deletion");}detachFinalizer(this);releaseClassHandle(this.$$);if(!this.$$.preservePointerOnDelete){this.$$.smartPtr=undefined;this.$$.ptr=undefined;}}function ClassHandle_isDeleted(){return !this.$$.ptr}var delayFunction=undefined;var deletionQueue=[];function flushPendingDeletes(){while(deletionQueue.length){var obj=deletionQueue.pop();obj.$$.deleteScheduled=false;obj["delete"]();}}function ClassHandle_deleteLater(){if(!this.$$.ptr){throwInstanceAlreadyDeleted(this);}if(this.$$.deleteScheduled&&!this.$$.preservePointerOnDelete){throwBindingError("Object already scheduled for deletion");}deletionQueue.push(this);if(deletionQueue.length===1&&delayFunction){delayFunction(flushPendingDeletes);}this.$$.deleteScheduled=true;return this}function init_ClassHandle(){ClassHandle.prototype["isAliasOf"]=ClassHandle_isAliasOf;ClassHandle.prototype["clone"]=ClassHandle_clone;ClassHandle.prototype["delete"]=ClassHandle_delete;ClassHandle.prototype["isDeleted"]=ClassHandle_isDeleted;ClassHandle.prototype["deleteLater"]=ClassHandle_deleteLater;}function ClassHandle(){}var registeredPointers={};function ensureOverloadTable(proto,methodName,humanName){if(undefined===proto[methodName].overloadTable){var prevFunc=proto[methodName];proto[methodName]=function(){if(!proto[methodName].overloadTable.hasOwnProperty(arguments.length)){throwBindingError("Function '"+humanName+"' called with an invalid number of arguments ("+arguments.length+") - expects one of ("+proto[methodName].overloadTable+")!");}return proto[methodName].overloadTable[arguments.length].apply(this,arguments)};proto[methodName].overloadTable=[];proto[methodName].overloadTable[prevFunc.argCount]=prevFunc;}}function exposePublicSymbol(name,value,numArguments){if(Module.hasOwnProperty(name)){if(undefined===numArguments||undefined!==Module[name].overloadTable&&undefined!==Module[name].overloadTable[numArguments]){throwBindingError("Cannot register public name '"+name+"' twice");}ensureOverloadTable(Module,name,name);if(Module.hasOwnProperty(numArguments)){throwBindingError("Cannot register multiple overloads of a function with the same number of arguments ("+numArguments+")!");}Module[name].overloadTable[numArguments]=value;}else {Module[name]=value;if(undefined!==numArguments){Module[name].numArguments=numArguments;}}}function RegisteredClass(name,constructor,instancePrototype,rawDestructor,baseClass,getActualType,upcast,downcast){this.name=name;this.constructor=constructor;this.instancePrototype=instancePrototype;this.rawDestructor=rawDestructor;this.baseClass=baseClass;this.getActualType=getActualType;this.upcast=upcast;this.downcast=downcast;this.pureVirtualFunctions=[];}function upcastPointer(ptr,ptrClass,desiredClass){while(ptrClass!==desiredClass){if(!ptrClass.upcast){throwBindingError("Expected null or instance of "+desiredClass.name+", got an instance of "+ptrClass.name);}ptr=ptrClass.upcast(ptr);ptrClass=ptrClass.baseClass;}return ptr}function constNoSmartPtrRawPointerToWireType(destructors,handle){if(handle===null){if(this.isReference){throwBindingError("null is not a valid "+this.name);}return 0}if(!handle.$$){throwBindingError('Cannot pass "'+_embind_repr(handle)+'" as a '+this.name);}if(!handle.$$.ptr){throwBindingError("Cannot pass deleted object as a pointer of type "+this.name);}var handleClass=handle.$$.ptrType.registeredClass;var ptr=upcastPointer(handle.$$.ptr,handleClass,this.registeredClass);return ptr}function genericPointerToWireType(destructors,handle){var ptr;if(handle===null){if(this.isReference){throwBindingError("null is not a valid "+this.name);}if(this.isSmartPointer){ptr=this.rawConstructor();if(destructors!==null){destructors.push(this.rawDestructor,ptr);}return ptr}else {return 0}}if(!handle.$$){throwBindingError('Cannot pass "'+_embind_repr(handle)+'" as a '+this.name);}if(!handle.$$.ptr){throwBindingError("Cannot pass deleted object as a pointer of type "+this.name);}if(!this.isConst&&handle.$$.ptrType.isConst){throwBindingError("Cannot convert argument of type "+(handle.$$.smartPtrType?handle.$$.smartPtrType.name:handle.$$.ptrType.name)+" to parameter type "+this.name);}var handleClass=handle.$$.ptrType.registeredClass;ptr=upcastPointer(handle.$$.ptr,handleClass,this.registeredClass);if(this.isSmartPointer){if(undefined===handle.$$.smartPtr){throwBindingError("Passing raw pointer to smart pointer is illegal");}switch(this.sharingPolicy){case 0:if(handle.$$.smartPtrType===this){ptr=handle.$$.smartPtr;}else {throwBindingError("Cannot convert argument of type "+(handle.$$.smartPtrType?handle.$$.smartPtrType.name:handle.$$.ptrType.name)+" to parameter type "+this.name);}break;case 1:ptr=handle.$$.smartPtr;break;case 2:if(handle.$$.smartPtrType===this){ptr=handle.$$.smartPtr;}else {var clonedHandle=handle["clone"]();ptr=this.rawShare(ptr,__emval_register(function(){clonedHandle["delete"]();}));if(destructors!==null){destructors.push(this.rawDestructor,ptr);}}break;default:throwBindingError("Unsupporting sharing policy");}}return ptr}function nonConstNoSmartPtrRawPointerToWireType(destructors,handle){if(handle===null){if(this.isReference){throwBindingError("null is not a valid "+this.name);}return 0}if(!handle.$$){throwBindingError('Cannot pass "'+_embind_repr(handle)+'" as a '+this.name);}if(!handle.$$.ptr){throwBindingError("Cannot pass deleted object as a pointer of type "+this.name);}if(handle.$$.ptrType.isConst){throwBindingError("Cannot convert argument of type "+handle.$$.ptrType.name+" to parameter type "+this.name);}var handleClass=handle.$$.ptrType.registeredClass;var ptr=upcastPointer(handle.$$.ptr,handleClass,this.registeredClass);return ptr}function simpleReadValueFromPointer(pointer){return this["fromWireType"](HEAPU32[pointer>>2])}function RegisteredPointer_getPointee(ptr){if(this.rawGetPointee){ptr=this.rawGetPointee(ptr);}return ptr}function RegisteredPointer_destructor(ptr){if(this.rawDestructor){this.rawDestructor(ptr);}}function RegisteredPointer_deleteObject(handle){if(handle!==null){handle["delete"]();}}function downcastPointer(ptr,ptrClass,desiredClass){if(ptrClass===desiredClass){return ptr}if(undefined===desiredClass.baseClass){return null}var rv=downcastPointer(ptr,ptrClass,desiredClass.baseClass);if(rv===null){return null}return desiredClass.downcast(rv)}function getInheritedInstanceCount(){return Object.keys(registeredInstances).length}function getLiveInheritedInstances(){var rv=[];for(var k in registeredInstances){if(registeredInstances.hasOwnProperty(k)){rv.push(registeredInstances[k]);}}return rv}function setDelayFunction(fn){delayFunction=fn;if(deletionQueue.length&&delayFunction){delayFunction(flushPendingDeletes);}}function init_embind(){Module["getInheritedInstanceCount"]=getInheritedInstanceCount;Module["getLiveInheritedInstances"]=getLiveInheritedInstances;Module["flushPendingDeletes"]=flushPendingDeletes;Module["setDelayFunction"]=setDelayFunction;}var registeredInstances={};function getBasestPointer(class_,ptr){if(ptr===undefined){throwBindingError("ptr should not be undefined");}while(class_.baseClass){ptr=class_.upcast(ptr);class_=class_.baseClass;}return ptr}function getInheritedInstance(class_,ptr){ptr=getBasestPointer(class_,ptr);return registeredInstances[ptr]}function makeClassHandle(prototype,record){if(!record.ptrType||!record.ptr){throwInternalError("makeClassHandle requires ptr and ptrType");}var hasSmartPtrType=!!record.smartPtrType;var hasSmartPtr=!!record.smartPtr;if(hasSmartPtrType!==hasSmartPtr){throwInternalError("Both smartPtrType and smartPtr must be specified");}record.count={value:1};return attachFinalizer(Object.create(prototype,{$$:{value:record}}))}function RegisteredPointer_fromWireType(ptr){var rawPointer=this.getPointee(ptr);if(!rawPointer){this.destructor(ptr);return null}var registeredInstance=getInheritedInstance(this.registeredClass,rawPointer);if(undefined!==registeredInstance){if(0===registeredInstance.$$.count.value){registeredInstance.$$.ptr=rawPointer;registeredInstance.$$.smartPtr=ptr;return registeredInstance["clone"]()}else {var rv=registeredInstance["clone"]();this.destructor(ptr);return rv}}function makeDefaultHandle(){if(this.isSmartPointer){return makeClassHandle(this.registeredClass.instancePrototype,{ptrType:this.pointeeType,ptr:rawPointer,smartPtrType:this,smartPtr:ptr})}else {return makeClassHandle(this.registeredClass.instancePrototype,{ptrType:this,ptr:ptr})}}var actualType=this.registeredClass.getActualType(rawPointer);var registeredPointerRecord=registeredPointers[actualType];if(!registeredPointerRecord){return makeDefaultHandle.call(this)}var toType;if(this.isConst){toType=registeredPointerRecord.constPointerType;}else {toType=registeredPointerRecord.pointerType;}var dp=downcastPointer(rawPointer,this.registeredClass,toType.registeredClass);if(dp===null){return makeDefaultHandle.call(this)}if(this.isSmartPointer){return makeClassHandle(toType.registeredClass.instancePrototype,{ptrType:toType,ptr:dp,smartPtrType:this,smartPtr:ptr})}else {return makeClassHandle(toType.registeredClass.instancePrototype,{ptrType:toType,ptr:dp})}}function init_RegisteredPointer(){RegisteredPointer.prototype.getPointee=RegisteredPointer_getPointee;RegisteredPointer.prototype.destructor=RegisteredPointer_destructor;RegisteredPointer.prototype["argPackAdvance"]=8;RegisteredPointer.prototype["readValueFromPointer"]=simpleReadValueFromPointer;RegisteredPointer.prototype["deleteObject"]=RegisteredPointer_deleteObject;RegisteredPointer.prototype["fromWireType"]=RegisteredPointer_fromWireType;}function RegisteredPointer(name,registeredClass,isReference,isConst,isSmartPointer,pointeeType,sharingPolicy,rawGetPointee,rawConstructor,rawShare,rawDestructor){this.name=name;this.registeredClass=registeredClass;this.isReference=isReference;this.isConst=isConst;this.isSmartPointer=isSmartPointer;this.pointeeType=pointeeType;this.sharingPolicy=sharingPolicy;this.rawGetPointee=rawGetPointee;this.rawConstructor=rawConstructor;this.rawShare=rawShare;this.rawDestructor=rawDestructor;if(!isSmartPointer&&registeredClass.baseClass===undefined){if(isConst){this["toWireType"]=constNoSmartPtrRawPointerToWireType;this.destructorFunction=null;}else {this["toWireType"]=nonConstNoSmartPtrRawPointerToWireType;this.destructorFunction=null;}}else {this["toWireType"]=genericPointerToWireType;}}function replacePublicSymbol(name,value,numArguments){if(!Module.hasOwnProperty(name)){throwInternalError("Replacing nonexistant public symbol");}if(undefined!==Module[name].overloadTable&&undefined!==numArguments){Module[name].overloadTable[numArguments]=value;}else {Module[name]=value;Module[name].argCount=numArguments;}}function dynCallLegacy(sig,ptr,args){var f=Module["dynCall_"+sig];return args&&args.length?f.apply(null,[ptr].concat(args)):f.call(null,ptr)}function dynCall(sig,ptr,args){if(sig.includes("j")){return dynCallLegacy(sig,ptr,args)}return wasmTable.get(ptr).apply(null,args)}function getDynCaller(sig,ptr){var argCache=[];return function(){argCache.length=arguments.length;for(var i=0;i<arguments.length;i++){argCache[i]=arguments[i];}return dynCall(sig,ptr,argCache)}}function embind__requireFunction(signature,rawFunction){signature=readLatin1String(signature);function makeDynCaller(){if(signature.includes("j")){return getDynCaller(signature,rawFunction)}return wasmTable.get(rawFunction)}var fp=makeDynCaller();if(typeof fp!=="function"){throwBindingError("unknown function pointer with signature "+signature+": "+rawFunction);}return fp}var UnboundTypeError=undefined;function getTypeName(type){var ptr=___getTypeName(type);var rv=readLatin1String(ptr);_free(ptr);return rv}function throwUnboundTypeError(message,types){var unboundTypes=[];var seen={};function visit(type){if(seen[type]){return}if(registeredTypes[type]){return}if(typeDependencies[type]){typeDependencies[type].forEach(visit);return}unboundTypes.push(type);seen[type]=true;}types.forEach(visit);throw new UnboundTypeError(message+": "+unboundTypes.map(getTypeName).join([", "]))}function __embind_register_class(rawType,rawPointerType,rawConstPointerType,baseClassRawType,getActualTypeSignature,getActualType,upcastSignature,upcast,downcastSignature,downcast,name,destructorSignature,rawDestructor){name=readLatin1String(name);getActualType=embind__requireFunction(getActualTypeSignature,getActualType);if(upcast){upcast=embind__requireFunction(upcastSignature,upcast);}if(downcast){downcast=embind__requireFunction(downcastSignature,downcast);}rawDestructor=embind__requireFunction(destructorSignature,rawDestructor);var legalFunctionName=makeLegalFunctionName(name);exposePublicSymbol(legalFunctionName,function(){throwUnboundTypeError("Cannot construct "+name+" due to unbound types",[baseClassRawType]);});whenDependentTypesAreResolved([rawType,rawPointerType,rawConstPointerType],baseClassRawType?[baseClassRawType]:[],function(base){base=base[0];var baseClass;var basePrototype;if(baseClassRawType){baseClass=base.registeredClass;basePrototype=baseClass.instancePrototype;}else {basePrototype=ClassHandle.prototype;}var constructor=createNamedFunction(legalFunctionName,function(){if(Object.getPrototypeOf(this)!==instancePrototype){throw new BindingError("Use 'new' to construct "+name)}if(undefined===registeredClass.constructor_body){throw new BindingError(name+" has no accessible constructor")}var body=registeredClass.constructor_body[arguments.length];if(undefined===body){throw new BindingError("Tried to invoke ctor of "+name+" with invalid number of parameters ("+arguments.length+") - expected ("+Object.keys(registeredClass.constructor_body).toString()+") parameters instead!")}return body.apply(this,arguments)});var instancePrototype=Object.create(basePrototype,{constructor:{value:constructor}});constructor.prototype=instancePrototype;var registeredClass=new RegisteredClass(name,constructor,instancePrototype,rawDestructor,baseClass,getActualType,upcast,downcast);var referenceConverter=new RegisteredPointer(name,registeredClass,true,false,false);var pointerConverter=new RegisteredPointer(name+"*",registeredClass,false,false,false);var constPointerConverter=new RegisteredPointer(name+" const*",registeredClass,false,true,false);registeredPointers[rawType]={pointerType:pointerConverter,constPointerType:constPointerConverter};replacePublicSymbol(legalFunctionName,constructor);return [referenceConverter,pointerConverter,constPointerConverter]});}function heap32VectorToArray(count,firstElement){var array=[];for(var i=0;i<count;i++){array.push(HEAP32[(firstElement>>2)+i]);}return array}function runDestructors(destructors){while(destructors.length){var ptr=destructors.pop();var del=destructors.pop();del(ptr);}}function __embind_register_class_constructor(rawClassType,argCount,rawArgTypesAddr,invokerSignature,invoker,rawConstructor){assert(argCount>0);var rawArgTypes=heap32VectorToArray(argCount,rawArgTypesAddr);invoker=embind__requireFunction(invokerSignature,invoker);var args=[rawConstructor];var destructors=[];whenDependentTypesAreResolved([],[rawClassType],function(classType){classType=classType[0];var humanName="constructor "+classType.name;if(undefined===classType.registeredClass.constructor_body){classType.registeredClass.constructor_body=[];}if(undefined!==classType.registeredClass.constructor_body[argCount-1]){throw new BindingError("Cannot register multiple constructors with identical number of parameters ("+(argCount-1)+") for class '"+classType.name+"'! Overload resolution is currently only performed using the parameter count, not actual type info!")}classType.registeredClass.constructor_body[argCount-1]=function unboundTypeHandler(){throwUnboundTypeError("Cannot construct "+classType.name+" due to unbound types",rawArgTypes);};whenDependentTypesAreResolved([],rawArgTypes,function(argTypes){classType.registeredClass.constructor_body[argCount-1]=function constructor_body(){if(arguments.length!==argCount-1){throwBindingError(humanName+" called with "+arguments.length+" arguments, expected "+(argCount-1));}destructors.length=0;args.length=argCount;for(var i=1;i<argCount;++i){args[i]=argTypes[i]["toWireType"](destructors,arguments[i-1]);}var ptr=invoker.apply(null,args);runDestructors(destructors);return argTypes[0]["fromWireType"](ptr)};return []});return []});}function new_(constructor,argumentList){if(!(constructor instanceof Function)){throw new TypeError("new_ called with constructor type "+typeof constructor+" which is not a function")}var dummy=createNamedFunction(constructor.name||"unknownFunctionName",function(){});dummy.prototype=constructor.prototype;var obj=new dummy;var r=constructor.apply(obj,argumentList);return r instanceof Object?r:obj}function craftInvokerFunction(humanName,argTypes,classType,cppInvokerFunc,cppTargetFunc){var argCount=argTypes.length;if(argCount<2){throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!");}var isClassMethodFunc=argTypes[1]!==null&&classType!==null;var needsDestructorStack=false;for(var i=1;i<argTypes.length;++i){if(argTypes[i]!==null&&argTypes[i].destructorFunction===undefined){needsDestructorStack=true;break}}var returns=argTypes[0].name!=="void";var argsList="";var argsListWired="";for(var i=0;i<argCount-2;++i){argsList+=(i!==0?", ":"")+"arg"+i;argsListWired+=(i!==0?", ":"")+"arg"+i+"Wired";}var invokerFnBody="return function "+makeLegalFunctionName(humanName)+"("+argsList+") {\n"+"if (arguments.length !== "+(argCount-2)+") {\n"+"throwBindingError('function "+humanName+" called with ' + arguments.length + ' arguments, expected "+(argCount-2)+" args!');\n"+"}\n";if(needsDestructorStack){invokerFnBody+="var destructors = [];\n";}var dtorStack=needsDestructorStack?"destructors":"null";var args1=["throwBindingError","invoker","fn","runDestructors","retType","classParam"];var args2=[throwBindingError,cppInvokerFunc,cppTargetFunc,runDestructors,argTypes[0],argTypes[1]];if(isClassMethodFunc){invokerFnBody+="var thisWired = classParam.toWireType("+dtorStack+", this);\n";}for(var i=0;i<argCount-2;++i){invokerFnBody+="var arg"+i+"Wired = argType"+i+".toWireType("+dtorStack+", arg"+i+"); // "+argTypes[i+2].name+"\n";args1.push("argType"+i);args2.push(argTypes[i+2]);}if(isClassMethodFunc){argsListWired="thisWired"+(argsListWired.length>0?", ":"")+argsListWired;}invokerFnBody+=(returns?"var rv = ":"")+"invoker(fn"+(argsListWired.length>0?", ":"")+argsListWired+");\n";if(needsDestructorStack){invokerFnBody+="runDestructors(destructors);\n";}else {for(var i=isClassMethodFunc?1:2;i<argTypes.length;++i){var paramName=i===1?"thisWired":"arg"+(i-2)+"Wired";if(argTypes[i].destructorFunction!==null){invokerFnBody+=paramName+"_dtor("+paramName+"); // "+argTypes[i].name+"\n";args1.push(paramName+"_dtor");args2.push(argTypes[i].destructorFunction);}}}if(returns){invokerFnBody+="var ret = retType.fromWireType(rv);\n"+"return ret;\n";}invokerFnBody+="}\n";args1.push(invokerFnBody);var invokerFunction=new_(Function,args1).apply(null,args2);return invokerFunction}function __embind_register_class_function(rawClassType,methodName,argCount,rawArgTypesAddr,invokerSignature,rawInvoker,context,isPureVirtual){var rawArgTypes=heap32VectorToArray(argCount,rawArgTypesAddr);methodName=readLatin1String(methodName);rawInvoker=embind__requireFunction(invokerSignature,rawInvoker);whenDependentTypesAreResolved([],[rawClassType],function(classType){classType=classType[0];var humanName=classType.name+"."+methodName;if(methodName.startsWith("@@")){methodName=Symbol[methodName.substring(2)];}if(isPureVirtual){classType.registeredClass.pureVirtualFunctions.push(methodName);}function unboundTypesHandler(){throwUnboundTypeError("Cannot call "+humanName+" due to unbound types",rawArgTypes);}var proto=classType.registeredClass.instancePrototype;var method=proto[methodName];if(undefined===method||undefined===method.overloadTable&&method.className!==classType.name&&method.argCount===argCount-2){unboundTypesHandler.argCount=argCount-2;unboundTypesHandler.className=classType.name;proto[methodName]=unboundTypesHandler;}else {ensureOverloadTable(proto,methodName,humanName);proto[methodName].overloadTable[argCount-2]=unboundTypesHandler;}whenDependentTypesAreResolved([],rawArgTypes,function(argTypes){var memberFunction=craftInvokerFunction(humanName,argTypes,classType,rawInvoker,context);if(undefined===proto[methodName].overloadTable){memberFunction.argCount=argCount-2;proto[methodName]=memberFunction;}else {proto[methodName].overloadTable[argCount-2]=memberFunction;}return []});return []});}function validateThis(this_,classType,humanName){if(!(this_ instanceof Object)){throwBindingError(humanName+' with invalid "this": '+this_);}if(!(this_ instanceof classType.registeredClass.constructor)){throwBindingError(humanName+' incompatible with "this" of type '+this_.constructor.name);}if(!this_.$$.ptr){throwBindingError("cannot call emscripten binding method "+humanName+" on deleted object");}return upcastPointer(this_.$$.ptr,this_.$$.ptrType.registeredClass,classType.registeredClass)}function __embind_register_class_property(classType,fieldName,getterReturnType,getterSignature,getter,getterContext,setterArgumentType,setterSignature,setter,setterContext){fieldName=readLatin1String(fieldName);getter=embind__requireFunction(getterSignature,getter);whenDependentTypesAreResolved([],[classType],function(classType){classType=classType[0];var humanName=classType.name+"."+fieldName;var desc={get:function(){throwUnboundTypeError("Cannot access "+humanName+" due to unbound types",[getterReturnType,setterArgumentType]);},enumerable:true,configurable:true};if(setter){desc.set=function(){throwUnboundTypeError("Cannot access "+humanName+" due to unbound types",[getterReturnType,setterArgumentType]);};}else {desc.set=function(v){throwBindingError(humanName+" is a read-only property");};}Object.defineProperty(classType.registeredClass.instancePrototype,fieldName,desc);whenDependentTypesAreResolved([],setter?[getterReturnType,setterArgumentType]:[getterReturnType],function(types){var getterReturnType=types[0];var desc={get:function(){var ptr=validateThis(this,classType,humanName+" getter");return getterReturnType["fromWireType"](getter(getterContext,ptr))},enumerable:true};if(setter){setter=embind__requireFunction(setterSignature,setter);var setterArgumentType=types[1];desc.set=function(v){var ptr=validateThis(this,classType,humanName+" setter");var destructors=[];setter(setterContext,ptr,setterArgumentType["toWireType"](destructors,v));runDestructors(destructors);};}Object.defineProperty(classType.registeredClass.instancePrototype,fieldName,desc);return []});return []});}function __embind_register_constant(name,type,value){name=readLatin1String(name);whenDependentTypesAreResolved([],[type],function(type){type=type[0];Module[name]=type["fromWireType"](value);return []});}var emval_free_list=[];var emval_handle_array=[{},{value:undefined},{value:null},{value:true},{value:false}];function __emval_decref(handle){if(handle>4&&0===--emval_handle_array[handle].refcount){emval_handle_array[handle]=undefined;emval_free_list.push(handle);}}function count_emval_handles(){var count=0;for(var i=5;i<emval_handle_array.length;++i){if(emval_handle_array[i]!==undefined){++count;}}return count}function get_first_emval(){for(var i=5;i<emval_handle_array.length;++i){if(emval_handle_array[i]!==undefined){return emval_handle_array[i]}}return null}function init_emval(){Module["count_emval_handles"]=count_emval_handles;Module["get_first_emval"]=get_first_emval;}function __emval_register(value){switch(value){case undefined:{return 1}case null:{return 2}case true:{return 3}case false:{return 4}default:{var handle=emval_free_list.length?emval_free_list.pop():emval_handle_array.length;emval_handle_array[handle]={refcount:1,value:value};return handle}}}function __embind_register_emval(rawType,name){name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":function(handle){var rv=emval_handle_array[handle].value;__emval_decref(handle);return rv},"toWireType":function(destructors,value){return __emval_register(value)},"argPackAdvance":8,"readValueFromPointer":simpleReadValueFromPointer,destructorFunction:null});}function _embind_repr(v){if(v===null){return "null"}var t=typeof v;if(t==="object"||t==="array"||t==="function"){return v.toString()}else {return ""+v}}function floatReadValueFromPointer(name,shift){switch(shift){case 2:return function(pointer){return this["fromWireType"](HEAPF32[pointer>>2])};case 3:return function(pointer){return this["fromWireType"](HEAPF64[pointer>>3])};default:throw new TypeError("Unknown float type: "+name)}}function __embind_register_float(rawType,name,size){var shift=getShiftFromSize(size);name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":function(value){return value},"toWireType":function(destructors,value){if(typeof value!=="number"&&typeof value!=="boolean"){throw new TypeError('Cannot convert "'+_embind_repr(value)+'" to '+this.name)}return value},"argPackAdvance":8,"readValueFromPointer":floatReadValueFromPointer(name,shift),destructorFunction:null});}function __embind_register_function(name,argCount,rawArgTypesAddr,signature,rawInvoker,fn){var argTypes=heap32VectorToArray(argCount,rawArgTypesAddr);name=readLatin1String(name);rawInvoker=embind__requireFunction(signature,rawInvoker);exposePublicSymbol(name,function(){throwUnboundTypeError("Cannot call "+name+" due to unbound types",argTypes);},argCount-1);whenDependentTypesAreResolved([],argTypes,function(argTypes){var invokerArgsArray=[argTypes[0],null].concat(argTypes.slice(1));replacePublicSymbol(name,craftInvokerFunction(name,invokerArgsArray,null,rawInvoker,fn),argCount-1);return []});}function integerReadValueFromPointer(name,shift,signed){switch(shift){case 0:return signed?function readS8FromPointer(pointer){return HEAP8[pointer]}:function readU8FromPointer(pointer){return HEAPU8[pointer]};case 1:return signed?function readS16FromPointer(pointer){return HEAP16[pointer>>1]}:function readU16FromPointer(pointer){return HEAPU16[pointer>>1]};case 2:return signed?function readS32FromPointer(pointer){return HEAP32[pointer>>2]}:function readU32FromPointer(pointer){return HEAPU32[pointer>>2]};default:throw new TypeError("Unknown integer type: "+name)}}function __embind_register_integer(primitiveType,name,size,minRange,maxRange){name=readLatin1String(name);if(maxRange===-1){maxRange=4294967295;}var shift=getShiftFromSize(size);var fromWireType=function(value){return value};if(minRange===0){var bitshift=32-8*size;fromWireType=function(value){return value<<bitshift>>>bitshift};}var isUnsignedType=name.includes("unsigned");registerType(primitiveType,{name:name,"fromWireType":fromWireType,"toWireType":function(destructors,value){if(typeof value!=="number"&&typeof value!=="boolean"){throw new TypeError('Cannot convert "'+_embind_repr(value)+'" to '+this.name)}if(value<minRange||value>maxRange){throw new TypeError('Passing a number "'+_embind_repr(value)+'" from JS side to C/C++ side to an argument of type "'+name+'", which is outside the valid range ['+minRange+", "+maxRange+"]!")}return isUnsignedType?value>>>0:value|0},"argPackAdvance":8,"readValueFromPointer":integerReadValueFromPointer(name,shift,minRange!==0),destructorFunction:null});}function __embind_register_memory_view(rawType,dataTypeIndex,name){var typeMapping=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array];var TA=typeMapping[dataTypeIndex];function decodeMemoryView(handle){handle=handle>>2;var heap=HEAPU32;var size=heap[handle];var data=heap[handle+1];return new TA(buffer,data,size)}name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":decodeMemoryView,"argPackAdvance":8,"readValueFromPointer":decodeMemoryView},{ignoreDuplicateRegistrations:true});}function __embind_register_std_string(rawType,name){name=readLatin1String(name);var stdStringIsUTF8=name==="std::string";registerType(rawType,{name:name,"fromWireType":function(value){var length=HEAPU32[value>>2];var str;if(stdStringIsUTF8){var decodeStartPtr=value+4;for(var i=0;i<=length;++i){var currentBytePtr=value+4+i;if(i==length||HEAPU8[currentBytePtr]==0){var maxRead=currentBytePtr-decodeStartPtr;var stringSegment=UTF8ToString(decodeStartPtr,maxRead);if(str===undefined){str=stringSegment;}else {str+=String.fromCharCode(0);str+=stringSegment;}decodeStartPtr=currentBytePtr+1;}}}else {var a=new Array(length);for(var i=0;i<length;++i){a[i]=String.fromCharCode(HEAPU8[value+4+i]);}str=a.join("");}_free(value);return str},"toWireType":function(destructors,value){if(value instanceof ArrayBuffer){value=new Uint8Array(value);}var getLength;var valueIsOfTypeString=typeof value==="string";if(!(valueIsOfTypeString||value instanceof Uint8Array||value instanceof Uint8ClampedArray||value instanceof Int8Array)){throwBindingError("Cannot pass non-string to std::string");}if(stdStringIsUTF8&&valueIsOfTypeString){getLength=function(){return lengthBytesUTF8(value)};}else {getLength=function(){return value.length};}var length=getLength();var ptr=_malloc(4+length+1);HEAPU32[ptr>>2]=length;if(stdStringIsUTF8&&valueIsOfTypeString){stringToUTF8(value,ptr+4,length+1);}else {if(valueIsOfTypeString){for(var i=0;i<length;++i){var charCode=value.charCodeAt(i);if(charCode>255){_free(ptr);throwBindingError("String has UTF-16 code units that do not fit in 8 bits");}HEAPU8[ptr+4+i]=charCode;}}else {for(var i=0;i<length;++i){HEAPU8[ptr+4+i]=value[i];}}}if(destructors!==null){destructors.push(_free,ptr);}return ptr},"argPackAdvance":8,"readValueFromPointer":simpleReadValueFromPointer,destructorFunction:function(ptr){_free(ptr);}});}function __embind_register_std_wstring(rawType,charSize,name){name=readLatin1String(name);var decodeString,encodeString,getHeap,lengthBytesUTF,shift;if(charSize===2){decodeString=UTF16ToString;encodeString=stringToUTF16;lengthBytesUTF=lengthBytesUTF16;getHeap=function(){return HEAPU16};shift=1;}else if(charSize===4){decodeString=UTF32ToString;encodeString=stringToUTF32;lengthBytesUTF=lengthBytesUTF32;getHeap=function(){return HEAPU32};shift=2;}registerType(rawType,{name:name,"fromWireType":function(value){var length=HEAPU32[value>>2];var HEAP=getHeap();var str;var decodeStartPtr=value+4;for(var i=0;i<=length;++i){var currentBytePtr=value+4+i*charSize;if(i==length||HEAP[currentBytePtr>>shift]==0){var maxReadBytes=currentBytePtr-decodeStartPtr;var stringSegment=decodeString(decodeStartPtr,maxReadBytes);if(str===undefined){str=stringSegment;}else {str+=String.fromCharCode(0);str+=stringSegment;}decodeStartPtr=currentBytePtr+charSize;}}_free(value);return str},"toWireType":function(destructors,value){if(!(typeof value==="string")){throwBindingError("Cannot pass non-string to C++ string type "+name);}var length=lengthBytesUTF(value);var ptr=_malloc(4+length+charSize);HEAPU32[ptr>>2]=length>>shift;encodeString(value,ptr+4,length+charSize);if(destructors!==null){destructors.push(_free,ptr);}return ptr},"argPackAdvance":8,"readValueFromPointer":simpleReadValueFromPointer,destructorFunction:function(ptr){_free(ptr);}});}function __embind_register_void(rawType,name){name=readLatin1String(name);registerType(rawType,{isVoid:true,name:name,"argPackAdvance":0,"fromWireType":function(){return undefined},"toWireType":function(destructors,o){return undefined}});}function requireHandle(handle){if(!handle){throwBindingError("Cannot use deleted val. handle = "+handle);}return emval_handle_array[handle].value}function requireRegisteredType(rawType,humanName){var impl=registeredTypes[rawType];if(undefined===impl){throwBindingError(humanName+" has unknown type "+getTypeName(rawType));}return impl}function __emval_as(handle,returnType,destructorsRef){handle=requireHandle(handle);returnType=requireRegisteredType(returnType,"emval::as");var destructors=[];var rd=__emval_register(destructors);HEAP32[destructorsRef>>2]=rd;return returnType["toWireType"](destructors,handle)}function __emval_lookupTypes(argCount,argTypes){var a=new Array(argCount);for(var i=0;i<argCount;++i){a[i]=requireRegisteredType(HEAP32[(argTypes>>2)+i],"parameter "+i);}return a}function __emval_call(handle,argCount,argTypes,argv){handle=requireHandle(handle);var types=__emval_lookupTypes(argCount,argTypes);var args=new Array(argCount);for(var i=0;i<argCount;++i){var type=types[i];args[i]=type["readValueFromPointer"](argv);argv+=type["argPackAdvance"];}var rv=handle.apply(undefined,args);return __emval_register(rv)}var emval_symbols={};function getStringOrSymbol(address){var symbol=emval_symbols[address];if(symbol===undefined){return readLatin1String(address)}else {return symbol}}var emval_methodCallers=[];function __emval_call_void_method(caller,handle,methodName,args){caller=emval_methodCallers[caller];handle=requireHandle(handle);methodName=getStringOrSymbol(methodName);caller(handle,methodName,null,args);}function __emval_addMethodCaller(caller){var id=emval_methodCallers.length;emval_methodCallers.push(caller);return id}function __emval_get_method_caller(argCount,argTypes){var types=__emval_lookupTypes(argCount,argTypes);var retType=types[0];var signatureName=retType.name+"_$"+types.slice(1).map(function(t){return t.name}).join("_")+"$";var params=["retType"];var args=[retType];var argsList="";for(var i=0;i<argCount-1;++i){argsList+=(i!==0?", ":"")+"arg"+i;params.push("argType"+i);args.push(types[1+i]);}var functionName=makeLegalFunctionName("methodCaller_"+signatureName);var functionBody="return function "+functionName+"(handle, name, destructors, args) {\n";var offset=0;for(var i=0;i<argCount-1;++i){functionBody+="    var arg"+i+" = argType"+i+".readValueFromPointer(args"+(offset?"+"+offset:"")+");\n";offset+=types[i+1]["argPackAdvance"];}functionBody+="    var rv = handle[name]("+argsList+");\n";for(var i=0;i<argCount-1;++i){if(types[i+1]["deleteObject"]){functionBody+="    argType"+i+".deleteObject(arg"+i+");\n";}}if(!retType.isVoid){functionBody+="    return retType.toWireType(destructors, rv);\n";}functionBody+="};\n";params.push(functionBody);var invokerFunction=new_(Function,params).apply(null,args);return __emval_addMethodCaller(invokerFunction)}function __emval_get_property(handle,key){handle=requireHandle(handle);key=requireHandle(key);return __emval_register(handle[key])}function __emval_incref(handle){if(handle>4){emval_handle_array[handle].refcount+=1;}}function __emval_new_array(){return __emval_register([])}function __emval_new_cstring(v){return __emval_register(getStringOrSymbol(v))}function __emval_new_object(){return __emval_register({})}function __emval_run_destructors(handle){var destructors=emval_handle_array[handle].value;runDestructors(destructors);__emval_decref(handle);}function __emval_set_property(handle,key,value){handle=requireHandle(handle);key=requireHandle(key);value=requireHandle(value);handle[key]=value;}function __emval_strictly_equals(first,second){first=requireHandle(first);second=requireHandle(second);return first===second}function __emval_take_value(type,argv){type=requireRegisteredType(type,"_emval_take_value");var v=type["readValueFromPointer"](argv);return __emval_register(v)}function __emval_typeof(handle){handle=requireHandle(handle);return __emval_register(typeof handle)}function _abort(){abort();}function _emscripten_memcpy_big(dest,src,num){HEAPU8.copyWithin(dest,src,src+num);}function abortOnCannotGrowMemory(requestedSize){abort("OOM");}function _emscripten_resize_heap(requestedSize){HEAPU8.length;abortOnCannotGrowMemory();}function _fd_close(fd){return 0}function _fd_read(fd,iov,iovcnt,pnum){var stream=SYSCALLS.getStreamFromFD(fd);var num=SYSCALLS.doReadv(stream,iov,iovcnt);HEAP32[pnum>>2]=num;return 0}function _fd_seek(fd,offset_low,offset_high,whence,newOffset){}function _fd_write(fd,iov,iovcnt,pnum){var num=0;for(var i=0;i<iovcnt;i++){var ptr=HEAP32[iov+i*8>>2];var len=HEAP32[iov+(i*8+4)>>2];for(var j=0;j<len;j++){SYSCALLS.printChar(fd,HEAPU8[ptr+j]);}num+=len;}HEAP32[pnum>>2]=num;return 0}function _setTempRet0(val){}embind_init_charCodes();BindingError=Module["BindingError"]=extendError(Error,"BindingError");InternalError=Module["InternalError"]=extendError(Error,"InternalError");init_ClassHandle();init_RegisteredPointer();init_embind();UnboundTypeError=Module["UnboundTypeError"]=extendError(Error,"UnboundTypeError");init_emval();function intArrayToString(array){var ret=[];for(var i=0;i<array.length;i++){var chr=array[i];if(chr>255){chr&=255;}ret.push(String.fromCharCode(chr));}return ret.join("")}var decodeBase64=typeof atob==="function"?atob:function(input){var keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var output="";var chr1,chr2,chr3;var enc1,enc2,enc3,enc4;var i=0;input=input.replace(/[^A-Za-z0-9\+\/\=]/g,"");do{enc1=keyStr.indexOf(input.charAt(i++));enc2=keyStr.indexOf(input.charAt(i++));enc3=keyStr.indexOf(input.charAt(i++));enc4=keyStr.indexOf(input.charAt(i++));chr1=enc1<<2|enc2>>4;chr2=(enc2&15)<<4|enc3>>2;chr3=(enc3&3)<<6|enc4;output=output+String.fromCharCode(chr1);if(enc3!==64){output=output+String.fromCharCode(chr2);}if(enc4!==64){output=output+String.fromCharCode(chr3);}}while(i<input.length);return output};function intArrayFromBase64(s){if(typeof ENVIRONMENT_IS_NODE==="boolean"&&ENVIRONMENT_IS_NODE){var buf=Buffer.from(s,"base64");return new Uint8Array(buf["buffer"],buf["byteOffset"],buf["byteLength"])}try{var decoded=decodeBase64(s);var bytes=new Uint8Array(decoded.length);for(var i=0;i<decoded.length;++i){bytes[i]=decoded.charCodeAt(i);}return bytes}catch(_){throw new Error("Converting base64 string to bytes failed.")}}function tryParseAsDataURI(filename){if(!isDataURI(filename)){return}return intArrayFromBase64(filename.slice(dataURIPrefix.length))}var asmLibraryArg={"P":___cxa_allocate_exception,"O":___cxa_throw,"p":___sys_fcntl64,"F":___sys_ioctl,"G":___sys_open,"z":__embind_register_bigint,"I":__embind_register_bool,"e":__embind_register_class,"u":__embind_register_class_constructor,"c":__embind_register_class_function,"a":__embind_register_class_property,"v":__embind_register_constant,"H":__embind_register_emval,"s":__embind_register_float,"b":__embind_register_function,"h":__embind_register_integer,"g":__embind_register_memory_view,"t":__embind_register_std_string,"n":__embind_register_std_wstring,"J":__embind_register_void,"f":__emval_as,"M":__emval_call,"j":__emval_call_void_method,"m":__emval_decref,"i":__emval_get_method_caller,"l":__emval_get_property,"o":__emval_incref,"K":__emval_new_array,"x":__emval_new_cstring,"Q":__emval_new_object,"N":__emval_run_destructors,"k":__emval_set_property,"w":__emval_strictly_equals,"d":__emval_take_value,"L":__emval_typeof,"D":_abort,"B":_emscripten_memcpy_big,"C":_emscripten_resize_heap,"r":_fd_close,"E":_fd_read,"y":_fd_seek,"q":_fd_write,"A":_setTempRet0};createWasm();Module["___wasm_call_ctors"]=function(){return (Module["___wasm_call_ctors"]=Module["asm"]["S"]).apply(null,arguments)};var _malloc=Module["_malloc"]=function(){return (_malloc=Module["_malloc"]=Module["asm"]["T"]).apply(null,arguments)};var _free=Module["_free"]=function(){return (_free=Module["_free"]=Module["asm"]["U"]).apply(null,arguments)};var ___getTypeName=Module["___getTypeName"]=function(){return (___getTypeName=Module["___getTypeName"]=Module["asm"]["W"]).apply(null,arguments)};Module["___embind_register_native_and_builtin_types"]=function(){return (Module["___embind_register_native_and_builtin_types"]=Module["asm"]["X"]).apply(null,arguments)};Module["dynCall_jiji"]=function(){return (Module["dynCall_jiji"]=Module["asm"]["Y"]).apply(null,arguments)};var calledRun;function ExitStatus(status){this.name="ExitStatus";this.message="Program terminated with exit("+status+")";this.status=status;}dependenciesFulfilled=function runCaller(){if(!calledRun)run();if(!calledRun)dependenciesFulfilled=runCaller;};function run(args){if(runDependencies>0){return}preRun();if(runDependencies>0){return}function doRun(){if(calledRun)return;calledRun=true;Module["calledRun"]=true;if(ABORT)return;initRuntime();readyPromiseResolve(Module);if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();postRun();}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(function(){setTimeout(function(){Module["setStatus"]("");},1);doRun();},1);}else {doRun();}}Module["run"]=run;if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()();}}run();


          return Module.ready
        }
      );
    })();
    module.exports = Module;
  });

  var bindImgui$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.assign(/*#__PURE__*/Object.create(null), bindImgui, {
    'default': bindImgui
  }));

  exports.bind = void 0;
  function imgui (value) {
    return __awaiter(this, void 0, void 0, function* () {
      return new Promise((resolve) => {
        bindImgui(value).then((value) => {
          exports.bind = value;
          resolve();
        });
      });
    });
  }
  function import_Scalar(sca) {
    if (Array.isArray(sca)) {
      return [sca[0]];
    }
    if (typeof sca === "function") {
      return [sca()];
    }
    return [sca.x];
  }
  function export_Scalar(tuple, sca) {
    if (Array.isArray(sca)) {
      sca[0] = tuple[0];
      return;
    }
    if (typeof sca === "function") {
      sca(tuple[0]);
      return;
    }
    sca.x = tuple[0];
  }
  function import_Vector2(vec) {
    if (Array.isArray(vec)) {
      return [vec[0], vec[1]];
    }
    return [vec.x, vec.y];
  }
  function export_Vector2(tuple, vec) {
    if (Array.isArray(vec)) {
      vec[0] = tuple[0];
      vec[1] = tuple[1];
      return;
    }
    vec.x = tuple[0];
    vec.y = tuple[1];
  }
  function import_Vector3(vec) {
    if (Array.isArray(vec)) {
      return [vec[0], vec[1], vec[2]];
    }
    return [vec.x, vec.y, vec.z];
  }
  function export_Vector3(tuple, vec) {
    if (Array.isArray(vec)) {
      vec[0] = tuple[0];
      vec[1] = tuple[1];
      vec[2] = tuple[2];
      return;
    }
    vec.x = tuple[0];
    vec.y = tuple[1];
    vec.z = tuple[2];
  }
  function import_Vector4(vec) {
    if (Array.isArray(vec)) {
      return [vec[0], vec[1], vec[2], vec[3] || 0];
    }
    return [vec.x, vec.y, vec.z, vec.w];
  }
  function export_Vector4(tuple, vec) {
    if (Array.isArray(vec)) {
      vec[0] = tuple[0];
      vec[1] = tuple[1];
      vec[2] = tuple[2];
      vec[3] = tuple[3];
      return;
    }
    vec.x = tuple[0];
    vec.y = tuple[1];
    vec.z = tuple[2];
    vec.w = tuple[3];
  }
  function import_Color3(col) {
    if (Array.isArray(col)) {
      return [col[0], col[1], col[2]];
    }
    if ("r" in col) {
      return [col.r, col.g, col.b];
    }
    return [col.x, col.y, col.z];
  }
  function export_Color3(tuple, col) {
    if (Array.isArray(col)) {
      col[0] = tuple[0];
      col[1] = tuple[1];
      col[2] = tuple[2];
      return;
    }
    if ("r" in col) {
      col.r = tuple[0];
      col.g = tuple[1];
      col.b = tuple[2];
      return;
    }
    col.x = tuple[0];
    col.y = tuple[1];
    col.z = tuple[2];
  }
  function import_Color4(col) {
    if (Array.isArray(col)) {
      return [col[0], col[1], col[2], col[3]];
    }
    if ("r" in col) {
      return [col.r, col.g, col.b, col.a];
    }
    return [col.x, col.y, col.z, col.w];
  }
  function export_Color4(tuple, col) {
    if (Array.isArray(col)) {
      col[0] = tuple[0];
      col[1] = tuple[1];
      col[2] = tuple[2];
      col[3] = tuple[3];
      return;
    }
    if ("r" in col) {
      col.r = tuple[0];
      col.g = tuple[1];
      col.b = tuple[2];
      col.a = tuple[3];
      return;
    }
    col.x = tuple[0];
    col.y = tuple[1];
    col.z = tuple[2];
    col.w = tuple[3];
  }
  const IMGUI_VERSION = "1.80"; // bind.IMGUI_VERSION;
  const IMGUI_VERSION_NUM = 18000; // bind.IMGUI_VERSION_NUM;
  function IMGUI_CHECKVERSION() { return DebugCheckVersionAndDataLayout(IMGUI_VERSION, exports.bind.ImGuiIOSize, exports.bind.ImGuiStyleSize, exports.bind.ImVec2Size, exports.bind.ImVec4Size, exports.bind.ImDrawVertSize, exports.bind.ImDrawIdxSize); }
  const IMGUI_HAS_TABLE = true;
  function ASSERT(c) { if (!c) {
    throw new Error();
  } }
  function IM_ASSERT(c) { if (!c) {
    throw new Error();
  } }
  function IM_ARRAYSIZE(_ARR) {
    if (_ARR instanceof ImStringBuffer) {
      return _ARR.size;
    }
    else {
      return _ARR.length;
    }
  }
  class ImStringBuffer {
    constructor(size, buffer = "") {
      this.size = size;
      this.buffer = buffer;
    }
  }
  exports.WindowFlags = void 0;
  (function (ImGuiWindowFlags) {
    ImGuiWindowFlags[ImGuiWindowFlags["None"] = 0] = "None";
    ImGuiWindowFlags[ImGuiWindowFlags["NoTitleBar"] = 1] = "NoTitleBar";
    ImGuiWindowFlags[ImGuiWindowFlags["NoResize"] = 2] = "NoResize";
    ImGuiWindowFlags[ImGuiWindowFlags["NoMove"] = 4] = "NoMove";
    ImGuiWindowFlags[ImGuiWindowFlags["NoScrollbar"] = 8] = "NoScrollbar";
    ImGuiWindowFlags[ImGuiWindowFlags["NoScrollWithMouse"] = 16] = "NoScrollWithMouse";
    ImGuiWindowFlags[ImGuiWindowFlags["NoCollapse"] = 32] = "NoCollapse";
    ImGuiWindowFlags[ImGuiWindowFlags["AlwaysAutoResize"] = 64] = "AlwaysAutoResize";
    ImGuiWindowFlags[ImGuiWindowFlags["NoBackground"] = 128] = "NoBackground";
    ImGuiWindowFlags[ImGuiWindowFlags["NoSavedSettings"] = 256] = "NoSavedSettings";
    ImGuiWindowFlags[ImGuiWindowFlags["NoMouseInputs"] = 512] = "NoMouseInputs";
    ImGuiWindowFlags[ImGuiWindowFlags["MenuBar"] = 1024] = "MenuBar";
    ImGuiWindowFlags[ImGuiWindowFlags["HorizontalScrollbar"] = 2048] = "HorizontalScrollbar";
    ImGuiWindowFlags[ImGuiWindowFlags["NoFocusOnAppearing"] = 4096] = "NoFocusOnAppearing";
    ImGuiWindowFlags[ImGuiWindowFlags["NoBringToFrontOnFocus"] = 8192] = "NoBringToFrontOnFocus";
    ImGuiWindowFlags[ImGuiWindowFlags["AlwaysVerticalScrollbar"] = 16384] = "AlwaysVerticalScrollbar";
    ImGuiWindowFlags[ImGuiWindowFlags["AlwaysHorizontalScrollbar"] = 32768] = "AlwaysHorizontalScrollbar";
    ImGuiWindowFlags[ImGuiWindowFlags["AlwaysUseWindowPadding"] = 65536] = "AlwaysUseWindowPadding";
    ImGuiWindowFlags[ImGuiWindowFlags["NoNavInputs"] = 262144] = "NoNavInputs";
    ImGuiWindowFlags[ImGuiWindowFlags["NoNavFocus"] = 524288] = "NoNavFocus";
    ImGuiWindowFlags[ImGuiWindowFlags["UnsavedDocument"] = 1048576] = "UnsavedDocument";
    ImGuiWindowFlags[ImGuiWindowFlags["NoNav"] = 786432] = "NoNav";
    ImGuiWindowFlags[ImGuiWindowFlags["NoDecoration"] = 43] = "NoDecoration";
    ImGuiWindowFlags[ImGuiWindowFlags["NoInputs"] = 786944] = "NoInputs";
    // [Internal]
    ImGuiWindowFlags[ImGuiWindowFlags["NavFlattened"] = 8388608] = "NavFlattened";
    ImGuiWindowFlags[ImGuiWindowFlags["ChildWindow"] = 16777216] = "ChildWindow";
    ImGuiWindowFlags[ImGuiWindowFlags["Tooltip"] = 33554432] = "Tooltip";
    ImGuiWindowFlags[ImGuiWindowFlags["Popup"] = 67108864] = "Popup";
    ImGuiWindowFlags[ImGuiWindowFlags["Modal"] = 134217728] = "Modal";
    ImGuiWindowFlags[ImGuiWindowFlags["ChildMenu"] = 268435456] = "ChildMenu";
  })(exports.WindowFlags || (exports.WindowFlags = {}));
  exports.InputTextFlags = void 0;
  (function (ImGuiInputTextFlags) {
    ImGuiInputTextFlags[ImGuiInputTextFlags["None"] = 0] = "None";
    ImGuiInputTextFlags[ImGuiInputTextFlags["CharsDecimal"] = 1] = "CharsDecimal";
    ImGuiInputTextFlags[ImGuiInputTextFlags["CharsHexadecimal"] = 2] = "CharsHexadecimal";
    ImGuiInputTextFlags[ImGuiInputTextFlags["CharsUppercase"] = 4] = "CharsUppercase";
    ImGuiInputTextFlags[ImGuiInputTextFlags["CharsNoBlank"] = 8] = "CharsNoBlank";
    ImGuiInputTextFlags[ImGuiInputTextFlags["AutoSelectAll"] = 16] = "AutoSelectAll";
    ImGuiInputTextFlags[ImGuiInputTextFlags["EnterReturnsTrue"] = 32] = "EnterReturnsTrue";
    ImGuiInputTextFlags[ImGuiInputTextFlags["CallbackCompletion"] = 64] = "CallbackCompletion";
    ImGuiInputTextFlags[ImGuiInputTextFlags["CallbackHistory"] = 128] = "CallbackHistory";
    ImGuiInputTextFlags[ImGuiInputTextFlags["CallbackAlways"] = 256] = "CallbackAlways";
    ImGuiInputTextFlags[ImGuiInputTextFlags["CallbackCharFilter"] = 512] = "CallbackCharFilter";
    ImGuiInputTextFlags[ImGuiInputTextFlags["AllowTabInput"] = 1024] = "AllowTabInput";
    ImGuiInputTextFlags[ImGuiInputTextFlags["CtrlEnterForNewLine"] = 2048] = "CtrlEnterForNewLine";
    ImGuiInputTextFlags[ImGuiInputTextFlags["NoHorizontalScroll"] = 4096] = "NoHorizontalScroll";
    ImGuiInputTextFlags[ImGuiInputTextFlags["AlwaysInsertMode"] = 8192] = "AlwaysInsertMode";
    ImGuiInputTextFlags[ImGuiInputTextFlags["ReadOnly"] = 16384] = "ReadOnly";
    ImGuiInputTextFlags[ImGuiInputTextFlags["Password"] = 32768] = "Password";
    ImGuiInputTextFlags[ImGuiInputTextFlags["NoUndoRedo"] = 65536] = "NoUndoRedo";
    ImGuiInputTextFlags[ImGuiInputTextFlags["CharsScientific"] = 131072] = "CharsScientific";
    ImGuiInputTextFlags[ImGuiInputTextFlags["CallbackResize"] = 262144] = "CallbackResize";
    ImGuiInputTextFlags[ImGuiInputTextFlags["CallbackEdit"] = 524288] = "CallbackEdit";
    // [Internal]
    ImGuiInputTextFlags[ImGuiInputTextFlags["Multiline"] = 1048576] = "Multiline";
    ImGuiInputTextFlags[ImGuiInputTextFlags["NoMarkEdited"] = 2097152] = "NoMarkEdited";
  })(exports.InputTextFlags || (exports.InputTextFlags = {}));
  exports.TreeNodeFlags = void 0;
  (function (ImGuiTreeNodeFlags) {
    ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["None"] = 0] = "None";
    ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["Selected"] = 1] = "Selected";
    ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["Framed"] = 2] = "Framed";
    ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["AllowItemOverlap"] = 4] = "AllowItemOverlap";
    ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["NoTreePushOnOpen"] = 8] = "NoTreePushOnOpen";
    ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["NoAutoOpenOnLog"] = 16] = "NoAutoOpenOnLog";
    ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["DefaultOpen"] = 32] = "DefaultOpen";
    ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["OpenOnDoubleClick"] = 64] = "OpenOnDoubleClick";
    ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["OpenOnArrow"] = 128] = "OpenOnArrow";
    ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["Leaf"] = 256] = "Leaf";
    ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["Bullet"] = 512] = "Bullet";
    ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["FramePadding"] = 1024] = "FramePadding";
    ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["SpanAvailWidth"] = 2048] = "SpanAvailWidth";
    ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["SpanFullWidth"] = 4096] = "SpanFullWidth";
    ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["NavLeftJumpsBackHere"] = 8192] = "NavLeftJumpsBackHere";
    ImGuiTreeNodeFlags[ImGuiTreeNodeFlags["CollapsingHeader"] = 26] = "CollapsingHeader";
  })(exports.TreeNodeFlags || (exports.TreeNodeFlags = {}));
  exports.PopupFlags = void 0;
  (function (ImGuiPopupFlags) {
    ImGuiPopupFlags[ImGuiPopupFlags["None"] = 0] = "None";
    ImGuiPopupFlags[ImGuiPopupFlags["MouseButtonLeft"] = 0] = "MouseButtonLeft";
    ImGuiPopupFlags[ImGuiPopupFlags["MouseButtonRight"] = 1] = "MouseButtonRight";
    ImGuiPopupFlags[ImGuiPopupFlags["MouseButtonMiddle"] = 2] = "MouseButtonMiddle";
    ImGuiPopupFlags[ImGuiPopupFlags["MouseButtonMask_"] = 31] = "MouseButtonMask_";
    ImGuiPopupFlags[ImGuiPopupFlags["MouseButtonDefault_"] = 1] = "MouseButtonDefault_";
    ImGuiPopupFlags[ImGuiPopupFlags["NoOpenOverExistingPopup"] = 32] = "NoOpenOverExistingPopup";
    ImGuiPopupFlags[ImGuiPopupFlags["NoOpenOverItems"] = 64] = "NoOpenOverItems";
    ImGuiPopupFlags[ImGuiPopupFlags["AnyPopupId"] = 128] = "AnyPopupId";
    ImGuiPopupFlags[ImGuiPopupFlags["AnyPopupLevel"] = 256] = "AnyPopupLevel";
    ImGuiPopupFlags[ImGuiPopupFlags["AnyPopup"] = 384] = "AnyPopup";
  })(exports.PopupFlags || (exports.PopupFlags = {}));
  exports.SelectableFlags = void 0;
  (function (ImGuiSelectableFlags) {
    ImGuiSelectableFlags[ImGuiSelectableFlags["None"] = 0] = "None";
    ImGuiSelectableFlags[ImGuiSelectableFlags["DontClosePopups"] = 1] = "DontClosePopups";
    ImGuiSelectableFlags[ImGuiSelectableFlags["SpanAllColumns"] = 2] = "SpanAllColumns";
    ImGuiSelectableFlags[ImGuiSelectableFlags["AllowDoubleClick"] = 4] = "AllowDoubleClick";
    ImGuiSelectableFlags[ImGuiSelectableFlags["Disabled"] = 8] = "Disabled";
    ImGuiSelectableFlags[ImGuiSelectableFlags["AllowItemOverlap"] = 16] = "AllowItemOverlap"; // (WIP) Hit testing to allow subsequent widgets to overlap this one
  })(exports.SelectableFlags || (exports.SelectableFlags = {}));
  exports.ImGuiComboFlags = void 0;
  (function (ImGuiComboFlags) {
    ImGuiComboFlags[ImGuiComboFlags["None"] = 0] = "None";
    ImGuiComboFlags[ImGuiComboFlags["PopupAlignLeft"] = 1] = "PopupAlignLeft";
    ImGuiComboFlags[ImGuiComboFlags["HeightSmall"] = 2] = "HeightSmall";
    ImGuiComboFlags[ImGuiComboFlags["HeightRegular"] = 4] = "HeightRegular";
    ImGuiComboFlags[ImGuiComboFlags["HeightLarge"] = 8] = "HeightLarge";
    ImGuiComboFlags[ImGuiComboFlags["HeightLargest"] = 16] = "HeightLargest";
    ImGuiComboFlags[ImGuiComboFlags["NoArrowButton"] = 32] = "NoArrowButton";
    ImGuiComboFlags[ImGuiComboFlags["NoPreview"] = 64] = "NoPreview";
    ImGuiComboFlags[ImGuiComboFlags["HeightMask_"] = 30] = "HeightMask_";
  })(exports.ImGuiComboFlags || (exports.ImGuiComboFlags = {}));
  exports.TabBarFlags = void 0;
  (function (ImGuiTabBarFlags) {
    ImGuiTabBarFlags[ImGuiTabBarFlags["None"] = 0] = "None";
    ImGuiTabBarFlags[ImGuiTabBarFlags["Reorderable"] = 1] = "Reorderable";
    ImGuiTabBarFlags[ImGuiTabBarFlags["AutoSelectNewTabs"] = 2] = "AutoSelectNewTabs";
    ImGuiTabBarFlags[ImGuiTabBarFlags["TabListPopupButton"] = 4] = "TabListPopupButton";
    ImGuiTabBarFlags[ImGuiTabBarFlags["NoCloseWithMiddleMouseButton"] = 8] = "NoCloseWithMiddleMouseButton";
    ImGuiTabBarFlags[ImGuiTabBarFlags["NoTabListScrollingButtons"] = 16] = "NoTabListScrollingButtons";
    ImGuiTabBarFlags[ImGuiTabBarFlags["NoTooltip"] = 32] = "NoTooltip";
    ImGuiTabBarFlags[ImGuiTabBarFlags["FittingPolicyResizeDown"] = 64] = "FittingPolicyResizeDown";
    ImGuiTabBarFlags[ImGuiTabBarFlags["FittingPolicyScroll"] = 128] = "FittingPolicyScroll";
    ImGuiTabBarFlags[ImGuiTabBarFlags["FittingPolicyMask_"] = 192] = "FittingPolicyMask_";
    ImGuiTabBarFlags[ImGuiTabBarFlags["FittingPolicyDefault_"] = 64] = "FittingPolicyDefault_";
  })(exports.TabBarFlags || (exports.TabBarFlags = {}));
  exports.TabItemFlags = void 0;
  (function (ImGuiTabItemFlags) {
    ImGuiTabItemFlags[ImGuiTabItemFlags["None"] = 0] = "None";
    ImGuiTabItemFlags[ImGuiTabItemFlags["UnsavedDocument"] = 1] = "UnsavedDocument";
    ImGuiTabItemFlags[ImGuiTabItemFlags["SetSelected"] = 2] = "SetSelected";
    ImGuiTabItemFlags[ImGuiTabItemFlags["NoCloseWithMiddleMouseButton"] = 4] = "NoCloseWithMiddleMouseButton";
    ImGuiTabItemFlags[ImGuiTabItemFlags["NoPushId"] = 8] = "NoPushId";
    ImGuiTabItemFlags[ImGuiTabItemFlags["NoTooltip"] = 16] = "NoTooltip";
    ImGuiTabItemFlags[ImGuiTabItemFlags["NoReorder"] = 32] = "NoReorder";
    ImGuiTabItemFlags[ImGuiTabItemFlags["Leading"] = 64] = "Leading";
    ImGuiTabItemFlags[ImGuiTabItemFlags["Trailing"] = 128] = "Trailing"; // Enforce the tab position to the right of the tab bar (before the scrolling buttons)
  })(exports.TabItemFlags || (exports.TabItemFlags = {}));
  exports.TableFlags = void 0;
  (function (ImGuiTableFlags) {
    // Features
    ImGuiTableFlags[ImGuiTableFlags["None"] = 0] = "None";
    ImGuiTableFlags[ImGuiTableFlags["Resizable"] = 1] = "Resizable";
    ImGuiTableFlags[ImGuiTableFlags["Reorderable"] = 2] = "Reorderable";
    ImGuiTableFlags[ImGuiTableFlags["Hideable"] = 4] = "Hideable";
    ImGuiTableFlags[ImGuiTableFlags["Sortable"] = 8] = "Sortable";
    ImGuiTableFlags[ImGuiTableFlags["NoSavedSettings"] = 16] = "NoSavedSettings";
    ImGuiTableFlags[ImGuiTableFlags["ContextMenuInBody"] = 32] = "ContextMenuInBody";
    // Decorations
    ImGuiTableFlags[ImGuiTableFlags["RowBg"] = 64] = "RowBg";
    ImGuiTableFlags[ImGuiTableFlags["BordersInnerH"] = 128] = "BordersInnerH";
    ImGuiTableFlags[ImGuiTableFlags["BordersOuterH"] = 256] = "BordersOuterH";
    ImGuiTableFlags[ImGuiTableFlags["BordersInnerV"] = 512] = "BordersInnerV";
    ImGuiTableFlags[ImGuiTableFlags["BordersOuterV"] = 1024] = "BordersOuterV";
    ImGuiTableFlags[ImGuiTableFlags["BordersH"] = 384] = "BordersH";
    ImGuiTableFlags[ImGuiTableFlags["BordersV"] = 1536] = "BordersV";
    ImGuiTableFlags[ImGuiTableFlags["BordersInner"] = 640] = "BordersInner";
    ImGuiTableFlags[ImGuiTableFlags["BordersOuter"] = 1280] = "BordersOuter";
    ImGuiTableFlags[ImGuiTableFlags["Borders"] = 1920] = "Borders";
    ImGuiTableFlags[ImGuiTableFlags["NoBordersInBody"] = 2048] = "NoBordersInBody";
    ImGuiTableFlags[ImGuiTableFlags["NoBordersInBodyUntilResize"] = 4096] = "NoBordersInBodyUntilResize";
    // Sizing Policy (read above for defaults)
    ImGuiTableFlags[ImGuiTableFlags["SizingFixedFit"] = 8192] = "SizingFixedFit";
    ImGuiTableFlags[ImGuiTableFlags["SizingFixedSame"] = 16384] = "SizingFixedSame";
    ImGuiTableFlags[ImGuiTableFlags["SizingStretchProp"] = 24576] = "SizingStretchProp";
    ImGuiTableFlags[ImGuiTableFlags["SizingStretchSame"] = 32768] = "SizingStretchSame";
    // Sizing Extra Options
    ImGuiTableFlags[ImGuiTableFlags["NoHostExtendX"] = 65536] = "NoHostExtendX";
    ImGuiTableFlags[ImGuiTableFlags["NoHostExtendY"] = 131072] = "NoHostExtendY";
    ImGuiTableFlags[ImGuiTableFlags["NoKeepColumnsVisible"] = 262144] = "NoKeepColumnsVisible";
    ImGuiTableFlags[ImGuiTableFlags["PreciseWidths"] = 524288] = "PreciseWidths";
    // Clipping
    ImGuiTableFlags[ImGuiTableFlags["NoClip"] = 1048576] = "NoClip";
    // Padding
    ImGuiTableFlags[ImGuiTableFlags["PadOuterX"] = 2097152] = "PadOuterX";
    ImGuiTableFlags[ImGuiTableFlags["NoPadOuterX"] = 4194304] = "NoPadOuterX";
    ImGuiTableFlags[ImGuiTableFlags["NoPadInnerX"] = 8388608] = "NoPadInnerX";
    // Scrolling
    ImGuiTableFlags[ImGuiTableFlags["ScrollX"] = 16777216] = "ScrollX";
    ImGuiTableFlags[ImGuiTableFlags["ScrollY"] = 33554432] = "ScrollY";
    // Sorting
    ImGuiTableFlags[ImGuiTableFlags["SortMulti"] = 67108864] = "SortMulti";
    ImGuiTableFlags[ImGuiTableFlags["SortTristate"] = 134217728] = "SortTristate";
    // [Internal] Combinations and masks
    ImGuiTableFlags[ImGuiTableFlags["SizingMask_"] = 57344] = "SizingMask_";
  })(exports.TableFlags || (exports.TableFlags = {}));
  exports.TableColumnFlags = void 0;
  (function (ImGuiTableColumnFlags) {
    // Input configuration flags
    ImGuiTableColumnFlags[ImGuiTableColumnFlags["None"] = 0] = "None";
    ImGuiTableColumnFlags[ImGuiTableColumnFlags["DefaultHide"] = 1] = "DefaultHide";
    ImGuiTableColumnFlags[ImGuiTableColumnFlags["DefaultSort"] = 2] = "DefaultSort";
    ImGuiTableColumnFlags[ImGuiTableColumnFlags["WidthStretch"] = 4] = "WidthStretch";
    ImGuiTableColumnFlags[ImGuiTableColumnFlags["WidthFixed"] = 8] = "WidthFixed";
    ImGuiTableColumnFlags[ImGuiTableColumnFlags["NoResize"] = 16] = "NoResize";
    ImGuiTableColumnFlags[ImGuiTableColumnFlags["NoReorder"] = 32] = "NoReorder";
    ImGuiTableColumnFlags[ImGuiTableColumnFlags["NoHide"] = 64] = "NoHide";
    ImGuiTableColumnFlags[ImGuiTableColumnFlags["NoClip"] = 128] = "NoClip";
    ImGuiTableColumnFlags[ImGuiTableColumnFlags["NoSort"] = 256] = "NoSort";
    ImGuiTableColumnFlags[ImGuiTableColumnFlags["NoSortAscending"] = 512] = "NoSortAscending";
    ImGuiTableColumnFlags[ImGuiTableColumnFlags["NoSortDescending"] = 1024] = "NoSortDescending";
    ImGuiTableColumnFlags[ImGuiTableColumnFlags["NoHeaderWidth"] = 2048] = "NoHeaderWidth";
    ImGuiTableColumnFlags[ImGuiTableColumnFlags["PreferSortAscending"] = 4096] = "PreferSortAscending";
    ImGuiTableColumnFlags[ImGuiTableColumnFlags["PreferSortDescending"] = 8192] = "PreferSortDescending";
    ImGuiTableColumnFlags[ImGuiTableColumnFlags["IndentEnable"] = 16384] = "IndentEnable";
    ImGuiTableColumnFlags[ImGuiTableColumnFlags["IndentDisable"] = 32768] = "IndentDisable";
    // Output status flags, read-only via TableGetColumnFlags()
    ImGuiTableColumnFlags[ImGuiTableColumnFlags["IsEnabled"] = 1048576] = "IsEnabled";
    ImGuiTableColumnFlags[ImGuiTableColumnFlags["IsVisible"] = 2097152] = "IsVisible";
    ImGuiTableColumnFlags[ImGuiTableColumnFlags["IsSorted"] = 4194304] = "IsSorted";
    ImGuiTableColumnFlags[ImGuiTableColumnFlags["IsHovered"] = 8388608] = "IsHovered";
    // [Internal] Combinations and masks
    ImGuiTableColumnFlags[ImGuiTableColumnFlags["WidthMask_"] = 12] = "WidthMask_";
    ImGuiTableColumnFlags[ImGuiTableColumnFlags["IndentMask_"] = 49152] = "IndentMask_";
    ImGuiTableColumnFlags[ImGuiTableColumnFlags["StatusMask_"] = 15728640] = "StatusMask_";
    ImGuiTableColumnFlags[ImGuiTableColumnFlags["NoDirectResize_"] = 1073741824] = "NoDirectResize_"; // [Internal] Disable user resizing this column directly (it may however we resized indirectly from its left edge)
  })(exports.TableColumnFlags || (exports.TableColumnFlags = {}));
  exports.TableRowFlags = void 0;
  (function (ImGuiTableRowFlags) {
    ImGuiTableRowFlags[ImGuiTableRowFlags["None"] = 0] = "None";
    ImGuiTableRowFlags[ImGuiTableRowFlags["Headers"] = 1] = "Headers"; // Identify header row (set default background color + width of its contents accounted different for auto column width)
  })(exports.TableRowFlags || (exports.TableRowFlags = {}));
  exports.TableBgTarget = void 0;
  (function (ImGuiTableBgTarget) {
    ImGuiTableBgTarget[ImGuiTableBgTarget["None"] = 0] = "None";
    ImGuiTableBgTarget[ImGuiTableBgTarget["RowBg0"] = 1] = "RowBg0";
    ImGuiTableBgTarget[ImGuiTableBgTarget["RowBg1"] = 2] = "RowBg1";
    ImGuiTableBgTarget[ImGuiTableBgTarget["CellBg"] = 3] = "CellBg"; // Set cell background color (top-most color)
  })(exports.TableBgTarget || (exports.TableBgTarget = {}));
  exports.ImGuiFocusedFlags = void 0;
  (function (ImGuiFocusedFlags) {
    ImGuiFocusedFlags[ImGuiFocusedFlags["None"] = 0] = "None";
    ImGuiFocusedFlags[ImGuiFocusedFlags["ChildWindows"] = 1] = "ChildWindows";
    ImGuiFocusedFlags[ImGuiFocusedFlags["RootWindow"] = 2] = "RootWindow";
    ImGuiFocusedFlags[ImGuiFocusedFlags["AnyWindow"] = 4] = "AnyWindow";
    ImGuiFocusedFlags[ImGuiFocusedFlags["RootAndChildWindows"] = 3] = "RootAndChildWindows";
  })(exports.ImGuiFocusedFlags || (exports.ImGuiFocusedFlags = {}));
  exports.ImGuiHoveredFlags = void 0;
  (function (ImGuiHoveredFlags) {
    ImGuiHoveredFlags[ImGuiHoveredFlags["None"] = 0] = "None";
    ImGuiHoveredFlags[ImGuiHoveredFlags["ChildWindows"] = 1] = "ChildWindows";
    ImGuiHoveredFlags[ImGuiHoveredFlags["RootWindow"] = 2] = "RootWindow";
    ImGuiHoveredFlags[ImGuiHoveredFlags["AnyWindow"] = 4] = "AnyWindow";
    ImGuiHoveredFlags[ImGuiHoveredFlags["AllowWhenBlockedByPopup"] = 8] = "AllowWhenBlockedByPopup";
    //AllowWhenBlockedByModal     = 1 << 4,   // Return true even if a modal popup window is normally blocking access to this item/window. FIXME-TODO: Unavailable yet.
    ImGuiHoveredFlags[ImGuiHoveredFlags["AllowWhenBlockedByActiveItem"] = 32] = "AllowWhenBlockedByActiveItem";
    ImGuiHoveredFlags[ImGuiHoveredFlags["AllowWhenOverlapped"] = 64] = "AllowWhenOverlapped";
    ImGuiHoveredFlags[ImGuiHoveredFlags["AllowWhenDisabled"] = 128] = "AllowWhenDisabled";
    ImGuiHoveredFlags[ImGuiHoveredFlags["RectOnly"] = 104] = "RectOnly";
    ImGuiHoveredFlags[ImGuiHoveredFlags["RootAndChildWindows"] = 3] = "RootAndChildWindows";
  })(exports.ImGuiHoveredFlags || (exports.ImGuiHoveredFlags = {}));
  exports.ImGuiDragDropFlags = void 0;
  (function (ImGuiDragDropFlags) {
    // BeginDragDropSource() flags
    ImGuiDragDropFlags[ImGuiDragDropFlags["None"] = 0] = "None";
    ImGuiDragDropFlags[ImGuiDragDropFlags["SourceNoPreviewTooltip"] = 1] = "SourceNoPreviewTooltip";
    ImGuiDragDropFlags[ImGuiDragDropFlags["SourceNoDisableHover"] = 2] = "SourceNoDisableHover";
    ImGuiDragDropFlags[ImGuiDragDropFlags["SourceNoHoldToOpenOthers"] = 4] = "SourceNoHoldToOpenOthers";
    ImGuiDragDropFlags[ImGuiDragDropFlags["SourceAllowNullID"] = 8] = "SourceAllowNullID";
    ImGuiDragDropFlags[ImGuiDragDropFlags["SourceExtern"] = 16] = "SourceExtern";
    ImGuiDragDropFlags[ImGuiDragDropFlags["SourceAutoExpirePayload"] = 32] = "SourceAutoExpirePayload";
    // AcceptDragDropPayload() flags
    ImGuiDragDropFlags[ImGuiDragDropFlags["AcceptBeforeDelivery"] = 1024] = "AcceptBeforeDelivery";
    ImGuiDragDropFlags[ImGuiDragDropFlags["AcceptNoDrawDefaultRect"] = 2048] = "AcceptNoDrawDefaultRect";
    ImGuiDragDropFlags[ImGuiDragDropFlags["AcceptNoPreviewTooltip"] = 4096] = "AcceptNoPreviewTooltip";
    ImGuiDragDropFlags[ImGuiDragDropFlags["AcceptPeekOnly"] = 3072] = "AcceptPeekOnly";
  })(exports.ImGuiDragDropFlags || (exports.ImGuiDragDropFlags = {}));
  // Standard Drag and Drop payload types. You can define you own payload types using 12-characters long strings. Types starting with '_' are defined by Dear ImGui.
  const IMGUI_PAYLOAD_TYPE_COLOR_3F = "_COL3F"; // float[3]     // Standard type for colors, without alpha. User code may use this type.
  const IMGUI_PAYLOAD_TYPE_COLOR_4F = "_COL4F"; // float[4]     // Standard type for colors. User code may use this type.
  exports.ImGuiDataType = void 0;
  (function (ImGuiDataType) {
    ImGuiDataType[ImGuiDataType["S8"] = 0] = "S8";
    ImGuiDataType[ImGuiDataType["U8"] = 1] = "U8";
    ImGuiDataType[ImGuiDataType["S16"] = 2] = "S16";
    ImGuiDataType[ImGuiDataType["U16"] = 3] = "U16";
    ImGuiDataType[ImGuiDataType["S32"] = 4] = "S32";
    ImGuiDataType[ImGuiDataType["U32"] = 5] = "U32";
    ImGuiDataType[ImGuiDataType["S64"] = 6] = "S64";
    ImGuiDataType[ImGuiDataType["U64"] = 7] = "U64";
    ImGuiDataType[ImGuiDataType["Float"] = 8] = "Float";
    ImGuiDataType[ImGuiDataType["Double"] = 9] = "Double";
    ImGuiDataType[ImGuiDataType["COUNT"] = 10] = "COUNT";
  })(exports.ImGuiDataType || (exports.ImGuiDataType = {}));
  exports.ImGuiDir = void 0;
  (function (ImGuiDir) {
    ImGuiDir[ImGuiDir["None"] = -1] = "None";
    ImGuiDir[ImGuiDir["Left"] = 0] = "Left";
    ImGuiDir[ImGuiDir["Right"] = 1] = "Right";
    ImGuiDir[ImGuiDir["Up"] = 2] = "Up";
    ImGuiDir[ImGuiDir["Down"] = 3] = "Down";
    ImGuiDir[ImGuiDir["COUNT"] = 4] = "COUNT";
  })(exports.ImGuiDir || (exports.ImGuiDir = {}));
  exports.SortDirection = void 0;
  (function (ImGuiSortDirection) {
    ImGuiSortDirection[ImGuiSortDirection["None"] = 0] = "None";
    ImGuiSortDirection[ImGuiSortDirection["Ascending"] = 1] = "Ascending";
    ImGuiSortDirection[ImGuiSortDirection["Descending"] = 2] = "Descending"; // Descending = 9->0, Z->A etc.
  })(exports.SortDirection || (exports.SortDirection = {}));
  exports.Key = void 0;
  (function (ImGuiKey) {
    ImGuiKey[ImGuiKey["Tab"] = 0] = "Tab";
    ImGuiKey[ImGuiKey["LeftArrow"] = 1] = "LeftArrow";
    ImGuiKey[ImGuiKey["RightArrow"] = 2] = "RightArrow";
    ImGuiKey[ImGuiKey["UpArrow"] = 3] = "UpArrow";
    ImGuiKey[ImGuiKey["DownArrow"] = 4] = "DownArrow";
    ImGuiKey[ImGuiKey["PageUp"] = 5] = "PageUp";
    ImGuiKey[ImGuiKey["PageDown"] = 6] = "PageDown";
    ImGuiKey[ImGuiKey["Home"] = 7] = "Home";
    ImGuiKey[ImGuiKey["End"] = 8] = "End";
    ImGuiKey[ImGuiKey["Insert"] = 9] = "Insert";
    ImGuiKey[ImGuiKey["Delete"] = 10] = "Delete";
    ImGuiKey[ImGuiKey["Backspace"] = 11] = "Backspace";
    ImGuiKey[ImGuiKey["Space"] = 12] = "Space";
    ImGuiKey[ImGuiKey["Enter"] = 13] = "Enter";
    ImGuiKey[ImGuiKey["Escape"] = 14] = "Escape";
    ImGuiKey[ImGuiKey["KeyPadEnter"] = 15] = "KeyPadEnter";
    ImGuiKey[ImGuiKey["A"] = 16] = "A";
    ImGuiKey[ImGuiKey["C"] = 17] = "C";
    ImGuiKey[ImGuiKey["V"] = 18] = "V";
    ImGuiKey[ImGuiKey["X"] = 19] = "X";
    ImGuiKey[ImGuiKey["Y"] = 20] = "Y";
    ImGuiKey[ImGuiKey["Z"] = 21] = "Z";
    ImGuiKey[ImGuiKey["COUNT"] = 22] = "COUNT";
  })(exports.Key || (exports.Key = {}));
  exports.KeyModFlags = void 0;
  (function (ImGuiKeyModFlags) {
    ImGuiKeyModFlags[ImGuiKeyModFlags["None"] = 0] = "None";
    ImGuiKeyModFlags[ImGuiKeyModFlags["Ctrl"] = 1] = "Ctrl";
    ImGuiKeyModFlags[ImGuiKeyModFlags["Shift"] = 2] = "Shift";
    ImGuiKeyModFlags[ImGuiKeyModFlags["Alt"] = 4] = "Alt";
    ImGuiKeyModFlags[ImGuiKeyModFlags["Super"] = 8] = "Super";
  })(exports.KeyModFlags || (exports.KeyModFlags = {}));
  exports.NavInput = void 0;
  (function (ImGuiNavInput) {
    // Gamepad Mapping
    ImGuiNavInput[ImGuiNavInput["Activate"] = 0] = "Activate";
    ImGuiNavInput[ImGuiNavInput["Cancel"] = 1] = "Cancel";
    ImGuiNavInput[ImGuiNavInput["Input"] = 2] = "Input";
    ImGuiNavInput[ImGuiNavInput["Menu"] = 3] = "Menu";
    ImGuiNavInput[ImGuiNavInput["DpadLeft"] = 4] = "DpadLeft";
    ImGuiNavInput[ImGuiNavInput["DpadRight"] = 5] = "DpadRight";
    ImGuiNavInput[ImGuiNavInput["DpadUp"] = 6] = "DpadUp";
    ImGuiNavInput[ImGuiNavInput["DpadDown"] = 7] = "DpadDown";
    ImGuiNavInput[ImGuiNavInput["LStickLeft"] = 8] = "LStickLeft";
    ImGuiNavInput[ImGuiNavInput["LStickRight"] = 9] = "LStickRight";
    ImGuiNavInput[ImGuiNavInput["LStickUp"] = 10] = "LStickUp";
    ImGuiNavInput[ImGuiNavInput["LStickDown"] = 11] = "LStickDown";
    ImGuiNavInput[ImGuiNavInput["FocusPrev"] = 12] = "FocusPrev";
    ImGuiNavInput[ImGuiNavInput["FocusNext"] = 13] = "FocusNext";
    ImGuiNavInput[ImGuiNavInput["TweakSlow"] = 14] = "TweakSlow";
    ImGuiNavInput[ImGuiNavInput["TweakFast"] = 15] = "TweakFast";
    // [Internal] Don't use directly! This is used internally to differentiate keyboard from gamepad inputs for behaviors that require to differentiate them.
    // Keyboard behavior that have no corresponding gamepad mapping (e.g. CTRL+TAB) may be directly reading from io.KeyDown[] instead of io.NavInputs[].
    ImGuiNavInput[ImGuiNavInput["KeyMenu_"] = 16] = "KeyMenu_";
    ImGuiNavInput[ImGuiNavInput["KeyLeft_"] = 17] = "KeyLeft_";
    ImGuiNavInput[ImGuiNavInput["KeyRight_"] = 18] = "KeyRight_";
    ImGuiNavInput[ImGuiNavInput["KeyUp_"] = 19] = "KeyUp_";
    ImGuiNavInput[ImGuiNavInput["KeyDown_"] = 20] = "KeyDown_";
    ImGuiNavInput[ImGuiNavInput["COUNT"] = 21] = "COUNT";
    ImGuiNavInput[ImGuiNavInput["InternalStart_"] = 16] = "InternalStart_";
  })(exports.NavInput || (exports.NavInput = {}));
  exports.ImGuiConfigFlags = void 0;
  (function (ImGuiConfigFlags) {
    ImGuiConfigFlags[ImGuiConfigFlags["None"] = 0] = "None";
    ImGuiConfigFlags[ImGuiConfigFlags["NavEnableKeyboard"] = 1] = "NavEnableKeyboard";
    ImGuiConfigFlags[ImGuiConfigFlags["NavEnableGamepad"] = 2] = "NavEnableGamepad";
    ImGuiConfigFlags[ImGuiConfigFlags["NavEnableSetMousePos"] = 4] = "NavEnableSetMousePos";
    ImGuiConfigFlags[ImGuiConfigFlags["NavNoCaptureKeyboard"] = 8] = "NavNoCaptureKeyboard";
    ImGuiConfigFlags[ImGuiConfigFlags["NoMouse"] = 16] = "NoMouse";
    ImGuiConfigFlags[ImGuiConfigFlags["NoMouseCursorChange"] = 32] = "NoMouseCursorChange";
    ImGuiConfigFlags[ImGuiConfigFlags["IsSRGB"] = 1048576] = "IsSRGB";
    ImGuiConfigFlags[ImGuiConfigFlags["IsTouchScreen"] = 2097152] = "IsTouchScreen"; // Application is using a touch screen instead of a mouse.
  })(exports.ImGuiConfigFlags || (exports.ImGuiConfigFlags = {}));
  exports.ImGuiCol = void 0;
  (function (ImGuiCol) {
    ImGuiCol[ImGuiCol["Text"] = 0] = "Text";
    ImGuiCol[ImGuiCol["TextDisabled"] = 1] = "TextDisabled";
    ImGuiCol[ImGuiCol["WindowBg"] = 2] = "WindowBg";
    ImGuiCol[ImGuiCol["ChildBg"] = 3] = "ChildBg";
    ImGuiCol[ImGuiCol["PopupBg"] = 4] = "PopupBg";
    ImGuiCol[ImGuiCol["Border"] = 5] = "Border";
    ImGuiCol[ImGuiCol["BorderShadow"] = 6] = "BorderShadow";
    ImGuiCol[ImGuiCol["FrameBg"] = 7] = "FrameBg";
    ImGuiCol[ImGuiCol["FrameBgHovered"] = 8] = "FrameBgHovered";
    ImGuiCol[ImGuiCol["FrameBgActive"] = 9] = "FrameBgActive";
    ImGuiCol[ImGuiCol["TitleBg"] = 10] = "TitleBg";
    ImGuiCol[ImGuiCol["TitleBgActive"] = 11] = "TitleBgActive";
    ImGuiCol[ImGuiCol["TitleBgCollapsed"] = 12] = "TitleBgCollapsed";
    ImGuiCol[ImGuiCol["MenuBarBg"] = 13] = "MenuBarBg";
    ImGuiCol[ImGuiCol["ScrollbarBg"] = 14] = "ScrollbarBg";
    ImGuiCol[ImGuiCol["ScrollbarGrab"] = 15] = "ScrollbarGrab";
    ImGuiCol[ImGuiCol["ScrollbarGrabHovered"] = 16] = "ScrollbarGrabHovered";
    ImGuiCol[ImGuiCol["ScrollbarGrabActive"] = 17] = "ScrollbarGrabActive";
    ImGuiCol[ImGuiCol["CheckMark"] = 18] = "CheckMark";
    ImGuiCol[ImGuiCol["SliderGrab"] = 19] = "SliderGrab";
    ImGuiCol[ImGuiCol["SliderGrabActive"] = 20] = "SliderGrabActive";
    ImGuiCol[ImGuiCol["Button"] = 21] = "Button";
    ImGuiCol[ImGuiCol["ButtonHovered"] = 22] = "ButtonHovered";
    ImGuiCol[ImGuiCol["ButtonActive"] = 23] = "ButtonActive";
    ImGuiCol[ImGuiCol["Header"] = 24] = "Header";
    ImGuiCol[ImGuiCol["HeaderHovered"] = 25] = "HeaderHovered";
    ImGuiCol[ImGuiCol["HeaderActive"] = 26] = "HeaderActive";
    ImGuiCol[ImGuiCol["Separator"] = 27] = "Separator";
    ImGuiCol[ImGuiCol["SeparatorHovered"] = 28] = "SeparatorHovered";
    ImGuiCol[ImGuiCol["SeparatorActive"] = 29] = "SeparatorActive";
    ImGuiCol[ImGuiCol["ResizeGrip"] = 30] = "ResizeGrip";
    ImGuiCol[ImGuiCol["ResizeGripHovered"] = 31] = "ResizeGripHovered";
    ImGuiCol[ImGuiCol["ResizeGripActive"] = 32] = "ResizeGripActive";
    ImGuiCol[ImGuiCol["Tab"] = 33] = "Tab";
    ImGuiCol[ImGuiCol["TabHovered"] = 34] = "TabHovered";
    ImGuiCol[ImGuiCol["TabActive"] = 35] = "TabActive";
    ImGuiCol[ImGuiCol["TabUnfocused"] = 36] = "TabUnfocused";
    ImGuiCol[ImGuiCol["TabUnfocusedActive"] = 37] = "TabUnfocusedActive";
    ImGuiCol[ImGuiCol["PlotLines"] = 38] = "PlotLines";
    ImGuiCol[ImGuiCol["PlotLinesHovered"] = 39] = "PlotLinesHovered";
    ImGuiCol[ImGuiCol["PlotHistogram"] = 40] = "PlotHistogram";
    ImGuiCol[ImGuiCol["PlotHistogramHovered"] = 41] = "PlotHistogramHovered";
    ImGuiCol[ImGuiCol["TableHeaderBg"] = 42] = "TableHeaderBg";
    ImGuiCol[ImGuiCol["TableBorderStrong"] = 43] = "TableBorderStrong";
    ImGuiCol[ImGuiCol["TableBorderLight"] = 44] = "TableBorderLight";
    ImGuiCol[ImGuiCol["TableRowBg"] = 45] = "TableRowBg";
    ImGuiCol[ImGuiCol["TableRowBgAlt"] = 46] = "TableRowBgAlt";
    ImGuiCol[ImGuiCol["TextSelectedBg"] = 47] = "TextSelectedBg";
    ImGuiCol[ImGuiCol["DragDropTarget"] = 48] = "DragDropTarget";
    ImGuiCol[ImGuiCol["NavHighlight"] = 49] = "NavHighlight";
    ImGuiCol[ImGuiCol["NavWindowingHighlight"] = 50] = "NavWindowingHighlight";
    ImGuiCol[ImGuiCol["NavWindowingDimBg"] = 51] = "NavWindowingDimBg";
    ImGuiCol[ImGuiCol["ModalWindowDimBg"] = 52] = "ModalWindowDimBg";
    ImGuiCol[ImGuiCol["COUNT"] = 53] = "COUNT";
  })(exports.ImGuiCol || (exports.ImGuiCol = {}));
  exports.StyleVar = void 0;
  (function (ImGuiStyleVar) {
    // Enum name --------------------- // Member in ImGuiStyle structure (see ImGuiStyle for descriptions)
    ImGuiStyleVar[ImGuiStyleVar["Alpha"] = 0] = "Alpha";
    ImGuiStyleVar[ImGuiStyleVar["WindowPadding"] = 1] = "WindowPadding";
    ImGuiStyleVar[ImGuiStyleVar["WindowRounding"] = 2] = "WindowRounding";
    ImGuiStyleVar[ImGuiStyleVar["WindowBorderSize"] = 3] = "WindowBorderSize";
    ImGuiStyleVar[ImGuiStyleVar["WindowMinSize"] = 4] = "WindowMinSize";
    ImGuiStyleVar[ImGuiStyleVar["WindowTitleAlign"] = 5] = "WindowTitleAlign";
    ImGuiStyleVar[ImGuiStyleVar["ChildRounding"] = 6] = "ChildRounding";
    ImGuiStyleVar[ImGuiStyleVar["ChildBorderSize"] = 7] = "ChildBorderSize";
    ImGuiStyleVar[ImGuiStyleVar["PopupRounding"] = 8] = "PopupRounding";
    ImGuiStyleVar[ImGuiStyleVar["PopupBorderSize"] = 9] = "PopupBorderSize";
    ImGuiStyleVar[ImGuiStyleVar["FramePadding"] = 10] = "FramePadding";
    ImGuiStyleVar[ImGuiStyleVar["FrameRounding"] = 11] = "FrameRounding";
    ImGuiStyleVar[ImGuiStyleVar["FrameBorderSize"] = 12] = "FrameBorderSize";
    ImGuiStyleVar[ImGuiStyleVar["ItemSpacing"] = 13] = "ItemSpacing";
    ImGuiStyleVar[ImGuiStyleVar["ItemInnerSpacing"] = 14] = "ItemInnerSpacing";
    ImGuiStyleVar[ImGuiStyleVar["IndentSpacing"] = 15] = "IndentSpacing";
    ImGuiStyleVar[ImGuiStyleVar["CellPadding"] = 16] = "CellPadding";
    ImGuiStyleVar[ImGuiStyleVar["ScrollbarSize"] = 17] = "ScrollbarSize";
    ImGuiStyleVar[ImGuiStyleVar["ScrollbarRounding"] = 18] = "ScrollbarRounding";
    ImGuiStyleVar[ImGuiStyleVar["GrabMinSize"] = 19] = "GrabMinSize";
    ImGuiStyleVar[ImGuiStyleVar["GrabRounding"] = 20] = "GrabRounding";
    ImGuiStyleVar[ImGuiStyleVar["TabRounding"] = 21] = "TabRounding";
    ImGuiStyleVar[ImGuiStyleVar["ButtonTextAlign"] = 22] = "ButtonTextAlign";
    ImGuiStyleVar[ImGuiStyleVar["SelectableTextAlign"] = 23] = "SelectableTextAlign";
    ImGuiStyleVar[ImGuiStyleVar["COUNT"] = 24] = "COUNT";
  })(exports.StyleVar || (exports.StyleVar = {}));
  exports.ImGuiBackendFlags = void 0;
  (function (ImGuiBackendFlags) {
    ImGuiBackendFlags[ImGuiBackendFlags["None"] = 0] = "None";
    ImGuiBackendFlags[ImGuiBackendFlags["HasGamepad"] = 1] = "HasGamepad";
    ImGuiBackendFlags[ImGuiBackendFlags["HasMouseCursors"] = 2] = "HasMouseCursors";
    ImGuiBackendFlags[ImGuiBackendFlags["HasSetMousePos"] = 4] = "HasSetMousePos";
    ImGuiBackendFlags[ImGuiBackendFlags["RendererHasVtxOffset"] = 8] = "RendererHasVtxOffset";
  })(exports.ImGuiBackendFlags || (exports.ImGuiBackendFlags = {}));
  exports.ImGuiButtonFlags = void 0;
  (function (ImGuiButtonFlags) {
    ImGuiButtonFlags[ImGuiButtonFlags["None"] = 0] = "None";
    ImGuiButtonFlags[ImGuiButtonFlags["MouseButtonLeft"] = 1] = "MouseButtonLeft";
    ImGuiButtonFlags[ImGuiButtonFlags["MouseButtonRight"] = 2] = "MouseButtonRight";
    ImGuiButtonFlags[ImGuiButtonFlags["MouseButtonMiddle"] = 4] = "MouseButtonMiddle";
    // [Internal]
    ImGuiButtonFlags[ImGuiButtonFlags["MouseButtonMask_"] = 7] = "MouseButtonMask_";
    ImGuiButtonFlags[ImGuiButtonFlags["MouseButtonDefault_"] = 1] = "MouseButtonDefault_";
  })(exports.ImGuiButtonFlags || (exports.ImGuiButtonFlags = {}));
  exports.ImGuiColorEditFlags = void 0;
  (function (ImGuiColorEditFlags) {
    ImGuiColorEditFlags[ImGuiColorEditFlags["None"] = 0] = "None";
    ImGuiColorEditFlags[ImGuiColorEditFlags["NoAlpha"] = 2] = "NoAlpha";
    ImGuiColorEditFlags[ImGuiColorEditFlags["NoPicker"] = 4] = "NoPicker";
    ImGuiColorEditFlags[ImGuiColorEditFlags["NoOptions"] = 8] = "NoOptions";
    ImGuiColorEditFlags[ImGuiColorEditFlags["NoSmallPreview"] = 16] = "NoSmallPreview";
    ImGuiColorEditFlags[ImGuiColorEditFlags["NoInputs"] = 32] = "NoInputs";
    ImGuiColorEditFlags[ImGuiColorEditFlags["NoTooltip"] = 64] = "NoTooltip";
    ImGuiColorEditFlags[ImGuiColorEditFlags["NoLabel"] = 128] = "NoLabel";
    ImGuiColorEditFlags[ImGuiColorEditFlags["NoSidePreview"] = 256] = "NoSidePreview";
    ImGuiColorEditFlags[ImGuiColorEditFlags["NoDragDrop"] = 512] = "NoDragDrop";
    ImGuiColorEditFlags[ImGuiColorEditFlags["NoBorder"] = 1024] = "NoBorder";
    // User Options (right-click on widget to change some of them). You can set application defaults using SetColorEditOptions(). The idea is that you probably don't want to override them in most of your calls, let the user choose and/or call SetColorEditOptions() during startup.
    ImGuiColorEditFlags[ImGuiColorEditFlags["AlphaBar"] = 65536] = "AlphaBar";
    ImGuiColorEditFlags[ImGuiColorEditFlags["AlphaPreview"] = 131072] = "AlphaPreview";
    ImGuiColorEditFlags[ImGuiColorEditFlags["AlphaPreviewHalf"] = 262144] = "AlphaPreviewHalf";
    ImGuiColorEditFlags[ImGuiColorEditFlags["HDR"] = 524288] = "HDR";
    ImGuiColorEditFlags[ImGuiColorEditFlags["DisplayRGB"] = 1048576] = "DisplayRGB";
    ImGuiColorEditFlags[ImGuiColorEditFlags["DisplayHSV"] = 2097152] = "DisplayHSV";
    ImGuiColorEditFlags[ImGuiColorEditFlags["DisplayHex"] = 4194304] = "DisplayHex";
    ImGuiColorEditFlags[ImGuiColorEditFlags["Uint8"] = 8388608] = "Uint8";
    ImGuiColorEditFlags[ImGuiColorEditFlags["Float"] = 16777216] = "Float";
    ImGuiColorEditFlags[ImGuiColorEditFlags["PickerHueBar"] = 33554432] = "PickerHueBar";
    ImGuiColorEditFlags[ImGuiColorEditFlags["PickerHueWheel"] = 67108864] = "PickerHueWheel";
    ImGuiColorEditFlags[ImGuiColorEditFlags["InputRGB"] = 134217728] = "InputRGB";
    ImGuiColorEditFlags[ImGuiColorEditFlags["InputHSV"] = 268435456] = "InputHSV";
    // Defaults Options. You can set application defaults using SetColorEditOptions(). The intent is that you probably don't want to
    // override them in most of your calls. Let the user choose via the option menu and/or call SetColorEditOptions() once during startup.
    ImGuiColorEditFlags[ImGuiColorEditFlags["_OptionsDefault"] = 177209344] = "_OptionsDefault";
    // [Internal] Masks
    ImGuiColorEditFlags[ImGuiColorEditFlags["_DisplayMask"] = 7340032] = "_DisplayMask";
    ImGuiColorEditFlags[ImGuiColorEditFlags["_DataTypeMask"] = 25165824] = "_DataTypeMask";
    ImGuiColorEditFlags[ImGuiColorEditFlags["_PickerMask"] = 100663296] = "_PickerMask";
    ImGuiColorEditFlags[ImGuiColorEditFlags["_InputMask"] = 402653184] = "_InputMask";
  })(exports.ImGuiColorEditFlags || (exports.ImGuiColorEditFlags = {}));
  exports.SliderFlags = void 0;
  (function (ImGuiSliderFlags) {
    ImGuiSliderFlags[ImGuiSliderFlags["None"] = 0] = "None";
    ImGuiSliderFlags[ImGuiSliderFlags["AlwaysClamp"] = 16] = "AlwaysClamp";
    ImGuiSliderFlags[ImGuiSliderFlags["Logarithmic"] = 32] = "Logarithmic";
    ImGuiSliderFlags[ImGuiSliderFlags["NoRoundToFormat"] = 64] = "NoRoundToFormat";
    ImGuiSliderFlags[ImGuiSliderFlags["NoInput"] = 128] = "NoInput";
    ImGuiSliderFlags[ImGuiSliderFlags["InvalidMask_"] = 1879048207] = "InvalidMask_"; // [Internal] We treat using those bits as being potentially a 'float power' argument from the previous API that has got miscast to this enum, and will trigger an assert if needed.
  })(exports.SliderFlags || (exports.SliderFlags = {}));
  exports.MouseButton = void 0;
  (function (ImGuiMouseButton) {
    ImGuiMouseButton[ImGuiMouseButton["Left"] = 0] = "Left";
    ImGuiMouseButton[ImGuiMouseButton["Right"] = 1] = "Right";
    ImGuiMouseButton[ImGuiMouseButton["Middle"] = 2] = "Middle";
    ImGuiMouseButton[ImGuiMouseButton["COUNT"] = 5] = "COUNT";
  })(exports.MouseButton || (exports.MouseButton = {}));
  exports.MouseCursor = void 0;
  (function (ImGuiMouseCursor) {
    ImGuiMouseCursor[ImGuiMouseCursor["None"] = -1] = "None";
    ImGuiMouseCursor[ImGuiMouseCursor["Arrow"] = 0] = "Arrow";
    ImGuiMouseCursor[ImGuiMouseCursor["TextInput"] = 1] = "TextInput";
    ImGuiMouseCursor[ImGuiMouseCursor["ResizeAll"] = 2] = "ResizeAll";
    ImGuiMouseCursor[ImGuiMouseCursor["ResizeNS"] = 3] = "ResizeNS";
    ImGuiMouseCursor[ImGuiMouseCursor["ResizeEW"] = 4] = "ResizeEW";
    ImGuiMouseCursor[ImGuiMouseCursor["ResizeNESW"] = 5] = "ResizeNESW";
    ImGuiMouseCursor[ImGuiMouseCursor["ResizeNWSE"] = 6] = "ResizeNWSE";
    ImGuiMouseCursor[ImGuiMouseCursor["Hand"] = 7] = "Hand";
    ImGuiMouseCursor[ImGuiMouseCursor["NotAllowed"] = 8] = "NotAllowed";
    ImGuiMouseCursor[ImGuiMouseCursor["COUNT"] = 9] = "COUNT";
  })(exports.MouseCursor || (exports.MouseCursor = {}));
  exports.ImGuiCond = void 0;
  (function (ImGuiCond) {
    ImGuiCond[ImGuiCond["None"] = 0] = "None";
    ImGuiCond[ImGuiCond["Always"] = 1] = "Always";
    ImGuiCond[ImGuiCond["Once"] = 2] = "Once";
    ImGuiCond[ImGuiCond["FirstUseEver"] = 4] = "FirstUseEver";
    ImGuiCond[ImGuiCond["Appearing"] = 8] = "Appearing";
  })(exports.ImGuiCond || (exports.ImGuiCond = {}));
  exports.ImDrawCornerFlags = void 0;
  (function (ImDrawCornerFlags) {
    ImDrawCornerFlags[ImDrawCornerFlags["None"] = 0] = "None";
    ImDrawCornerFlags[ImDrawCornerFlags["TopLeft"] = 1] = "TopLeft";
    ImDrawCornerFlags[ImDrawCornerFlags["TopRight"] = 2] = "TopRight";
    ImDrawCornerFlags[ImDrawCornerFlags["BotLeft"] = 4] = "BotLeft";
    ImDrawCornerFlags[ImDrawCornerFlags["BotRight"] = 8] = "BotRight";
    ImDrawCornerFlags[ImDrawCornerFlags["Top"] = 3] = "Top";
    ImDrawCornerFlags[ImDrawCornerFlags["Bot"] = 12] = "Bot";
    ImDrawCornerFlags[ImDrawCornerFlags["Left"] = 5] = "Left";
    ImDrawCornerFlags[ImDrawCornerFlags["Right"] = 10] = "Right";
    ImDrawCornerFlags[ImDrawCornerFlags["All"] = 15] = "All";
  })(exports.ImDrawCornerFlags || (exports.ImDrawCornerFlags = {}));
  exports.wListFlags = void 0;
  (function (ImDrawListFlags) {
    ImDrawListFlags[ImDrawListFlags["None"] = 0] = "None";
    ImDrawListFlags[ImDrawListFlags["AntiAliasedLines"] = 1] = "AntiAliasedLines";
    ImDrawListFlags[ImDrawListFlags["AntiAliasedLinesUseTex"] = 2] = "AntiAliasedLinesUseTex";
    ImDrawListFlags[ImDrawListFlags["AntiAliasedFill"] = 4] = "AntiAliasedFill";
    ImDrawListFlags[ImDrawListFlags["AllowVtxOffset"] = 8] = "AllowVtxOffset"; // Can emit 'VtxOffset > 0' to allow large meshes. Set when 'ImGuiBackendFlags_RendererHasVtxOffset' is enabled.
  })(exports.wListFlags || (exports.wListFlags = {}));
  class ImVec2 {
    constructor(x = 0.0, y = 0.0) {
      this.x = x;
      this.y = y;
    }
    Set(x, y) {
      this.x = x;
      this.y = y;
      return this;
    }
    Copy(other) {
      this.x = other.x;
      this.y = other.y;
      return this;
    }
    Equals(other) {
      if (this.x !== other.x) {
        return false;
      }
      if (this.y !== other.y) {
        return false;
      }
      return true;
    }
  }
  ImVec2.ZERO = new ImVec2(0.0, 0.0);
  ImVec2.UNIT = new ImVec2(1.0, 1.0);
  ImVec2.UNIT_X = new ImVec2(1.0, 0.0);
  ImVec2.UNIT_Y = new ImVec2(0.0, 1.0);
  class ImVec4 {
    constructor(x = 0.0, y = 0.0, z = 0.0, w = 1.0) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;
    }
    Set(x, y, z, w) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;
      return this;
    }
    Copy(other) {
      this.x = other.x;
      this.y = other.y;
      this.z = other.z;
      this.w = other.w;
      return this;
    }
    Equals(other) {
      if (this.x !== other.x) {
        return false;
      }
      if (this.y !== other.y) {
        return false;
      }
      if (this.z !== other.z) {
        return false;
      }
      if (this.w !== other.w) {
        return false;
      }
      return true;
    }
  }
  ImVec4.ZERO = new ImVec4(0.0, 0.0, 0.0, 0.0);
  ImVec4.UNIT = new ImVec4(1.0, 1.0, 1.0, 1.0);
  ImVec4.UNIT_X = new ImVec4(1.0, 0.0, 0.0, 0.0);
  ImVec4.UNIT_Y = new ImVec4(0.0, 1.0, 0.0, 0.0);
  ImVec4.UNIT_Z = new ImVec4(0.0, 0.0, 1.0, 0.0);
  ImVec4.UNIT_W = new ImVec4(0.0, 0.0, 0.0, 1.0);
  ImVec4.BLACK = new ImVec4(0.0, 0.0, 0.0, 1.0);
  ImVec4.WHITE = new ImVec4(1.0, 1.0, 1.0, 1.0);
  class ImVector extends Array {
    constructor() {
      super(...arguments);
      this.Data = this;
      // public:
      // int                         Size;
      // int                         Capacity;
      // T*                          Data;
      // typedef T                   value_type;
      // typedef value_type*         iterator;
      // typedef const value_type*   const_iterator;
      // inline ImVector()           { Size = Capacity = 0; Data = NULL; }
      // inline ~ImVector()          { if (Data) ImGui::MemFree(Data); }
      // inline bool                 empty() const                   { return Size == 0; }
      // inline int                  size() const                    { return Size; }
      // inline int                  capacity() const                { return Capacity; }
      // inline value_type&          operator[](int i)               { IM_ASSERT(i < Size); return Data[i]; }
      // inline const value_type&    operator[](int i) const         { IM_ASSERT(i < Size); return Data[i]; }
      // inline void                 clear()                         { if (Data) { Size = Capacity = 0; ImGui::MemFree(Data); Data = NULL; } }
      // inline iterator             begin()                         { return Data; }
      // inline const_iterator       begin() const                   { return Data; }
      // inline iterator             end()                           { return Data + Size; }
      // inline const_iterator       end() const                     { return Data + Size; }
      // inline value_type&          front()                         { IM_ASSERT(Size > 0); return Data[0]; }
      // inline const value_type&    front() const                   { IM_ASSERT(Size > 0); return Data[0]; }
      // inline value_type&          back()                          { IM_ASSERT(Size > 0); return Data[Size - 1]; }
      // inline const value_type&    back() const                    { IM_ASSERT(Size > 0); return Data[Size - 1]; }
      // inline void                 swap(ImVector<T>& rhs)          { int rhs_size = rhs.Size; rhs.Size = Size; Size = rhs_size; int rhs_cap = rhs.Capacity; rhs.Capacity = Capacity; Capacity = rhs_cap; value_type* rhs_data = rhs.Data; rhs.Data = Data; Data = rhs_data; }
      // inline int                  _grow_capacity(int size) const  { int new_capacity = Capacity ? (Capacity + Capacity/2) : 8; return new_capacity > size ? new_capacity : size; }
      // inline void                 resize(int new_size)            { if (new_size > Capacity) reserve(_grow_capacity(new_size)); Size = new_size; }
      // inline void                 resize(int new_size, const T& v){ if (new_size > Capacity) reserve(_grow_capacity(new_size)); if (new_size > Size) for (int n = Size; n < new_size; n++) Data[n] = v; Size = new_size; }
      // inline void                 reserve(int new_capacity)
      // {
      //     if (new_capacity <= Capacity)
      //         return;
      //     T* new_data = (value_type*)ImGui::MemAlloc((size_t)new_capacity * sizeof(T));
      //     if (Data)
      //         memcpy(new_data, Data, (size_t)Size * sizeof(T));
      //     ImGui::MemFree(Data);
      //     Data = new_data;
      //     Capacity = new_capacity;
      // }
      // inline void                 push_back(const value_type& v)  { if (Size == Capacity) reserve(_grow_capacity(Size + 1)); Data[Size++] = v; }
      // inline void                 pop_back()                      { IM_ASSERT(Size > 0); Size--; }
      // inline void                 push_front(const value_type& v) { if (Size == 0) push_back(v); else insert(Data, v); }
      // inline iterator             erase(const_iterator it)                        { IM_ASSERT(it >= Data && it < Data+Size); const ptrdiff_t off = it - Data; memmove(Data + off, Data + off + 1, ((size_t)Size - (size_t)off - 1) * sizeof(value_type)); Size--; return Data + off; }
      // inline iterator             erase(const_iterator it, const_iterator it_last){ IM_ASSERT(it >= Data && it < Data+Size && it_last > it && it_last <= Data+Size); const ptrdiff_t count = it_last - it; const ptrdiff_t off = it - Data; memmove(Data + off, Data + off + count, ((size_t)Size - (size_t)off - count) * sizeof(value_type)); Size -= (int)count; return Data + off; }
      // inline iterator             erase_unsorted(const_iterator it)               { IM_ASSERT(it >= Data && it < Data+Size);  const ptrdiff_t off = it - Data; if (it < Data+Size-1) memcpy(Data + off, Data + Size - 1, sizeof(value_type)); Size--; return Data + off; }
      // inline iterator             insert(const_iterator it, const value_type& v)  { IM_ASSERT(it >= Data && it <= Data+Size); const ptrdiff_t off = it - Data; if (Size == Capacity) reserve(_grow_capacity(Size + 1)); if (off < (int)Size) memmove(Data + off + 1, Data + off, ((size_t)Size - (size_t)off) * sizeof(value_type)); Data[off] = v; Size++; return Data + off; }
      // inline bool                 contains(const value_type& v) const             { const T* data = Data;  const T* data_end = Data + Size; while (data < data_end) if (*data++ == v) return true; return false; }
    }
    get Size() { return this.length; }
    empty() { return this.length === 0; }
    clear() { this.length = 0; }
    pop_back() { return this.pop(); }
    push_back(value) { this.push(value); }
    front() { IM_ASSERT(this.Size > 0); return this.Data[0]; }
    back() { IM_ASSERT(this.Size > 0); return this.Data[this.Size - 1]; }
    size() { return this.Size; }
    resize(new_size, v) {
      if (v) {
        for (let index = this.length; index < new_size; ++index) {
          this[index] = v(index);
        }
      }
      else {
        this.length = new_size;
      }
    }
    contains(value) {
      return this.includes(value);
    }
    find_erase_unsorted(value) {
      const index = this.indexOf(value);
      if (index !== -1) {
        this.splice(index, 1);
      }
    }
  }
  const IM_UNICODE_CODEPOINT_MAX = 0xFFFF; // Maximum Unicode code point supported by this build.
  class ImGuiTextFilter {
    // IMGUI_API           ImGuiTextFilter(const char* default_filter = "");
    constructor(default_filter = "") {
      // [Internal]
      // struct TextRange
      // {
      //     const char* b;
      //     const char* e;
      //     TextRange() { b = e = NULL; }
      //     TextRange(const char* _b, const char* _e) { b = _b; e = _e; }
      //     const char* begin() const { return b; }
      //     const char* end() const { return e; }
      //     bool empty() const { return b == e; }
      //     char front() const { return *b; }
      //     static bool is_blank(char c) { return c == ' ' || c == '\t'; }
      //     void trim_blanks() { while (b < e && is_blank(*b)) b++; while (e > b && is_blank(*(e-1))) e--; }
      //     IMGUI_API void split(char separator, ImVector<TextRange>& out);
      // };
      // char                InputBuf[256];
      this.InputBuf = new ImStringBuffer(256);
      // ImVector<TextRange> Filters;
      // int                 CountGrep;
      this.CountGrep = 0;
      if (default_filter) {
        // ImStrncpy(InputBuf, default_filter, IM_ARRAYSIZE(InputBuf));
        this.InputBuf.buffer = default_filter;
        this.Build();
      }
      else {
        // InputBuf[0] = 0;
        this.InputBuf.buffer = "";
        this.CountGrep = 0;
      }
    }
    // IMGUI_API bool      Draw(const char* label = "Filter (inc,-exc)", float width = 0.0f);    // Helper calling InputText+Build
    Draw(label = "Filter (inc,-exc)", width = 0.0) {
      if (width !== 0.0)
        exports.bind.PushItemWidth(width);
      const value_changed = InputText(label, this.InputBuf, IM_ARRAYSIZE(this.InputBuf));
      if (width !== 0.0)
        exports.bind.PopItemWidth();
      if (value_changed)
        this.Build();
      return value_changed;
    }
    // IMGUI_API bool      PassFilter(const char* text, const char* text_end = NULL) const;
    PassFilter(text, text_end = null) {
      // if (Filters.empty())
      //     return true;
      // if (text == NULL)
      //     text = "";
      // for (int i = 0; i != Filters.Size; i++)
      // {
      //     const TextRange& f = Filters[i];
      //     if (f.empty())
      //         continue;
      //     if (f.front() == '-')
      //     {
      //         // Subtract
      //         if (ImStristr(text, text_end, f.begin()+1, f.end()) != NULL)
      //             return false;
      //     }
      //     else
      //     {
      //         // Grep
      //         if (ImStristr(text, text_end, f.begin(), f.end()) != NULL)
      //             return true;
      //     }
      // }
      // Implicit * grep
      if (this.CountGrep === 0)
        return true;
      return false;
    }
    // IMGUI_API void      Build();
    Build() {
      // Filters.resize(0);
      // TextRange input_range(InputBuf, InputBuf+strlen(InputBuf));
      // input_range.split(',', Filters);
      this.CountGrep = 0;
      // for (int i = 0; i != Filters.Size; i++)
      // {
      //     Filters[i].trim_blanks();
      //     if (Filters[i].empty())
      //         continue;
      //     if (Filters[i].front() != '-')
      //         CountGrep += 1;
      // }
    }
    // void                Clear() { InputBuf[0] = 0; Build(); }
    Clear() { this.InputBuf.buffer = ""; this.Build(); }
    // bool                IsActive() const { return !Filters.empty(); }
    IsActive() { return false; }
  }
  class ImGuiTextBuffer {
    constructor() {
      // ImVector<char>      Buf;
      this.Buf = "";
      // ImGuiTextBuffer()   { Buf.push_back(0); }
      // inline char         operator[](int i) { return Buf.Data[i]; }
      // const char*         begin() const { return &Buf.front(); }
      // const char*         end() const { return &Buf.back(); }      // Buf is zero-terminated, so end() will point on the zero-terminator
      // int                 size() const { return Buf.Size - 1; }
      // bool                empty() { return Buf.Size <= 1; }
      // void                clear() { Buf.clear(); Buf.push_back(0); }
      // void                reserve(int capacity) { Buf.reserve(capacity); }
      // const char*         c_str() const { return Buf.Data; }
      // IMGUI_API void      appendf(const char* fmt, ...) IM_FMTARGS(2);
      // IMGUI_API void      appendfv(const char* fmt, va_list args) IM_FMTLIST(2);
    }
    begin() { return this.Buf; }
    size() { return this.Buf.length; }
    clear() { this.Buf = ""; }
    append(text) { this.Buf += text; }
  }
  // Helper: Simple Key->value storage
  // Typically you don't have to worry about this since a storage is held within each Window.
  // We use it to e.g. store collapse state for a tree (Int 0/1), store color edit options.
  // This is optimized for efficient reading (dichotomy into a contiguous buffer), rare writing (typically tied to user interactions)
  // You can use it as custom user storage for temporary values. Declare your own storage if, for example:
  // - You want to manipulate the open/close state of a particular sub-tree in your interface (tree node uses Int 0/1 to store their state).
  // - You want to store custom debug data easily without adding or editing structures in your code (probably not efficient, but convenient)
  // Types are NOT stored, so it is up to you to make sure your Key don't collide with different types.
  class ImGuiStorage {
  }
  // Helpers macros to generate 32-bits encoded colors
  const IM_COL32_R_SHIFT = 0;
  const IM_COL32_G_SHIFT = 8;
  const IM_COL32_B_SHIFT = 16;
  const IM_COL32_A_SHIFT = 24;
  const IM_COL32_A_MASK = 0xFF000000;
  function IM_COL32(R, G, B, A = 255) {
    return ((A << IM_COL32_A_SHIFT) | (B << IM_COL32_B_SHIFT) | (G << IM_COL32_G_SHIFT) | (R << IM_COL32_R_SHIFT)) >>> 0;
  }
  const IM_COL32_WHITE = IM_COL32(255, 255, 255, 255);
  const IM_COL32_BLACK = IM_COL32(0, 0, 0, 255);
  const IM_COL32_BLACK_TRANS = IM_COL32(0, 0, 0, 0);
  class ImColor {
    constructor(r = 0.0, g = 0.0, b = 0.0, a = 1.0) {
      // ImVec4              Value;
      this.Value = new ImVec4();
      if (typeof (r) === "number") {
        if (r > 255 && g === 0.0 && b === 0.0 && a === 1.0) {
          this.Value.x = Math.max(0.0, Math.min(1.0, ((r >> IM_COL32_R_SHIFT) & 0xFF) / 255));
          this.Value.y = Math.max(0.0, Math.min(1.0, ((r >> IM_COL32_G_SHIFT) & 0xFF) / 255));
          this.Value.z = Math.max(0.0, Math.min(1.0, ((r >> IM_COL32_B_SHIFT) & 0xFF) / 255));
          this.Value.w = Math.max(0.0, Math.min(1.0, ((r >> IM_COL32_A_SHIFT) & 0xFF) / 255));
        }
        else if (r <= 1.0 && g <= 1.0 && b <= 1.0 && a <= 1.0) {
          this.Value.x = Math.max(0.0, r);
          this.Value.y = Math.max(0.0, g);
          this.Value.z = Math.max(0.0, b);
          this.Value.w = Math.max(0.0, a);
        }
        else {
          this.Value.x = Math.max(0.0, Math.min(1.0, r / 255));
          this.Value.y = Math.max(0.0, Math.min(1.0, g / 255));
          this.Value.z = Math.max(0.0, Math.min(1.0, b / 255));
          if (a <= 1.0) {
            this.Value.w = Math.max(0.0, a);
          }
          else {
            this.Value.w = Math.max(0.0, Math.min(1.0, a / 255));
          }
        }
      }
      else {
        this.Value.Copy(r);
      }
    }
    // inline operator ImU32() const                                   { return ImGui::ColorConvertFloat4ToU32(Value); }
    toImU32() { return ColorConvertFloat4ToU32(this.Value); }
    // inline operator ImVec4() const                                  { return Value; }
    toImVec4() { return this.Value; }
    // FIXME-OBSOLETE: May need to obsolete/cleanup those helpers.
    // inline void    SetHSV(float h, float s, float v, float a = 1.0f){ ImGui::ColorConvertHSVtoRGB(h, s, v, Value.x, Value.y, Value.z); Value.w = a; }
    SetHSV(h, s, v, a = 1.0) {
      const ref_r = [this.Value.x];
      const ref_g = [this.Value.y];
      const ref_b = [this.Value.z];
      ColorConvertHSVtoRGB(h, s, v, ref_r, ref_g, ref_b);
      this.Value.x = ref_r[0];
      this.Value.y = ref_g[0];
      this.Value.z = ref_b[0];
      this.Value.w = a;
    }
    // static ImColor HSV(float h, float s, float v, float a = 1.0f)   { float r,g,b; ImGui::ColorConvertHSVtoRGB(h, s, v, r, g, b); return ImColor(r,g,b,a); }
    static HSV(h, s, v, a = 1.0) {
      const color = new ImColor();
      color.SetHSV(h, s, v, a);
      return color;
    }
  }
  const ImGuiInputTextDefaultSize = 128;
  class ImGuiInputTextCallbackData {
    constructor(native, UserData = null) {
      this.native = native;
      this.UserData = UserData;
    }
    // ImGuiInputTextFlags EventFlag;      // One of ImGuiInputTextFlags_Callback* // Read-only
    get EventFlag() { return this.native.EventFlag; }
    // ImGuiInputTextFlags Flags;          // What user passed to InputText()      // Read-only
    get Flags() { return this.native.Flags; }
    // void*               UserData;       // What user passed to InputText()      // Read-only
    // public get UserData(): any { return this.native.UserData; }
    // CharFilter event:
    // ImWchar             EventChar;      // Character input                      // Read-write (replace character or set to zero)
    get EventChar() { return this.native.EventChar; }
    set EventChar(value) { this.native.EventChar = value; }
    // Completion,History,Always events:
    // If you modify the buffer contents make sure you update 'BufTextLen' and set 'BufDirty' to true.
    // ImGuiKey            EventKey;       // Key pressed (Up/Down/TAB)            // Read-only
    get EventKey() { return this.native.EventKey; }
    // char*               Buf;            // Current text buffer                  // Read-write (pointed data only, can't replace the actual pointer)
    get Buf() { return this.native.Buf; }
    set Buf(value) { this.native.Buf = value; }
    // int                 BufTextLen;     // Current text length in bytes         // Read-write
    get BufTextLen() { return this.native.BufTextLen; }
    set BufTextLen(value) { this.native.BufTextLen = value; }
    // int                 BufSize;        // Maximum text length in bytes         // Read-only
    get BufSize() { return this.native.BufSize; }
    // bool                BufDirty;       // Set if you modify Buf/BufTextLen!!   // Write
    set BufDirty(value) { this.native.BufDirty = value; }
    // int                 CursorPos;      //                                      // Read-write
    get CursorPos() { return this.native.CursorPos; }
    set CursorPos(value) { this.native.CursorPos = value; }
    // int                 SelectionStart; //                                      // Read-write (== to SelectionEnd when no selection)
    get SelectionStart() { return this.native.SelectionStart; }
    set SelectionStart(value) { this.native.SelectionStart = value; }
    // int                 SelectionEnd;   //                                      // Read-write
    get SelectionEnd() { return this.native.SelectionEnd; }
    set SelectionEnd(value) { this.native.SelectionEnd = value; }
    // NB: Helper functions for text manipulation. Calling those function loses selection.
    // IMGUI_API void    DeleteChars(int pos, int bytes_count);
    DeleteChars(pos, bytes_count) { return this.native.DeleteChars(pos, bytes_count); }
    // IMGUI_API void    InsertChars(int pos, const char* text, const char* text_end = NULL);
    InsertChars(pos, text, text_end = null) { return this.native.InsertChars(pos, text_end !== null ? text.substring(0, text_end) : text); }
    // void                SelectAll()             { SelectionStart = 0; SelectionEnd = BufTextLen; }
    SelectAll() { this.native.SelectAll(); }
    // void                ClearSelection()        { SelectionStart = SelectionEnd = BufTextLen; }
    ClearSelection() { this.native.ClearSelection(); }
    // bool              HasSelection() const { return SelectionStart != SelectionEnd; }
    HasSelection() { return this.native.HasSelection(); }
  }
  class ImGuiSizeCallbackData {
    constructor(native, UserData) {
      this.native = native;
      this.UserData = UserData;
    }
    get Pos() { return this.native.Pos; }
    get CurrentSize() { return this.native.CurrentSize; }
    get DesiredSize() { return this.native.DesiredSize; }
  }
  class ImGuiTableColumnSortSpecs {
    constructor(native) {
      this.native = native;
    }
    get ColumnUserID() { return this.native.ColumnUserID; }
    get ColumnIndex() { return this.native.ColumnIndex; }
    get SortOrder() { return this.native.SortOrder; }
    get SortDirection() { return this.native.SortDirection; }
  }
  class ImGuiTableSortSpecs {
    constructor(native) {
      this.native = native;
      this._Specs = Array.from({ length: this.SpecsCount }).map((_, i) => {
        return new ImGuiTableColumnSortSpecs(this.native.GetSpec(i));
      });
    }
    get Specs() { return this._Specs; }
    get SpecsCount() { return this.native.SpecsCount; }
    get SpecsDirty() { return this.native.SpecsDirty; }
    set SpecsDirty(value) { this.native.SpecsDirty = value; }
  }
  class ImGuiListClipper {
    constructor() {
      this._native = null;
    }
    get native() {
      return this._native || (this._native = new exports.bind.ImGuiListClipper());
    }
    get DisplayStart() { return this.native.DisplayStart; }
    get DisplayEnd() { return this.native.DisplayEnd; }
    get ItemsCount() { return this.native.ItemsCount; }
    get StepNo() { return this.native.StepNo; }
    get ItemsFrozen() { return this.native.ItemsFrozen; }
    get ItemsHeight() { return this.native.ItemsHeight; }
    get StartPosY() { return this.native.StartPosY; }
    // items_count:  Use -1 to ignore (you can call Begin later). Use INT_MAX if you don't know how many items you have (in which case the cursor won't be advanced in the final step).
    // items_height: Use -1.0f to be calculated automatically on first step. Otherwise pass in the distance between your items, typically GetTextLineHeightWithSpacing() or GetFrameHeightWithSpacing().
    // If you don't specify an items_height, you NEED to call Step(). If you specify items_height you may call the old Begin()/End() api directly, but prefer calling Step().
    // ImGuiListClipper(int items_count = -1, float items_height = -1.0f)  { Begin(items_count, items_height); } // NB: Begin() initialize every fields (as we allow user to call Begin/End multiple times on a same instance if they want).
    // ~ImGuiListClipper()                                                 { IM_ASSERT(ItemsCount == -1); }      // Assert if user forgot to call End() or Step() until false.
    delete() {
      if (this._native !== null) {
        this._native.delete();
        this._native = null;
      }
    }
    // IMGUI_API void Begin(int items_count, float items_height = -1.0f);  // Automatically called by constructor if you passed 'items_count' or by Step() in Step 1.
    Begin(items_count, items_height = -1.0) {
      this.native.Begin(items_count, items_height);
    }
    // IMGUI_API void End();                                               // Automatically called on the last call of Step() that returns false.
    End() {
      this.native.End();
      this.delete();
    }
    // IMGUI_API bool Step();                                              // Call until it returns false. The DisplayStart/DisplayEnd fields will be set and you can process/draw those items.
    Step() {
      const busy = this.native.Step();
      if (!busy) {
        this.delete();
      }
      return busy;
    }
  }
  //-----------------------------------------------------------------------------
  // Draw List
  // Hold a series of drawing commands. The user provides a renderer for ImDrawData which essentially contains an array of ImDrawList.
  //-----------------------------------------------------------------------------
  // The maximum line width to bake anti-aliased textures for. Build atlas with ImFontAtlasFlags_NoBakedLines to disable baking.
  const IM_DRAWLIST_TEX_LINES_WIDTH_MAX = 63;
  // Special Draw callback value to request renderer back-end to reset the graphics/render state.
  // The renderer back-end needs to handle this special value, otherwise it will crash trying to call a function at this address.
  // This is useful for example if you submitted callbacks which you know have altered the render state and you want it to be restored.
  // It is not done by default because they are many perfectly useful way of altering render state for imgui contents (e.g. changing shader/blending settings before an Image call).
  const ImDrawCallback_ResetRenderState = -1;
  class ImDrawCmd {
    constructor(native) {
      this.native = native;
      // ImDrawCallback  UserCallback;           // If != NULL, call the function instead of rendering the vertices. clip_rect and texture_id will be set normally.
      this.UserCallback = null; // TODO
      // void*           UserCallbackData;       // The draw callback code can access this.
      this.UserCallbackData = null; // TODO
    }
    // unsigned int    ElemCount;              // Number of indices (multiple of 3) to be rendered as triangles. Vertices are stored in the callee ImDrawList's vtx_buffer[] array, indices in idx_buffer[].
    get ElemCount() { return this.native.ElemCount; }
    // ImVec4          ClipRect;               // Clipping rectangle (x1, y1, x2, y2)
    get ClipRect() { return this.native.ClipRect; }
    // ImTextureID     TextureId;              // User-provided texture ID. Set by user in ImfontAtlas::SetTexID() for fonts or passed to Image*() functions. Ignore if never using images or multiple fonts atlas.
    get TextureId() {
      return ImGuiContext.getTexture(this.native.TextureId);
    }
    // unsigned int    VtxOffset;              // Start offset in vertex buffer. Pre-1.71 or without ImGuiBackendFlags_RendererHasVtxOffset: always 0. With ImGuiBackendFlags_RendererHasVtxOffset: may be >0 to support meshes larger than 64K vertices with 16-bits indices.
    get VtxOffset() { return this.native.VtxOffset; }
    // unsigned int    IdxOffset;              // Start offset in index buffer. Always equal to sum of ElemCount drawn so far.
    get IdxOffset() { return this.native.IdxOffset; }
  }
  const ImDrawIdxSize = 2; // bind.ImDrawIdxSize;
  const ImDrawVertSize = 20; // bind.ImDrawVertSize;
  const ImDrawVertPosOffset = 0; // bind.ImDrawVertPosOffset;
  const ImDrawVertUVOffset = 8; // bind.ImDrawVertUVOffset;
  const ImDrawVertColOffset = 16; // bind.ImDrawVertColOffset;
  class ImDrawVert {
    constructor(buffer, byteOffset = 0) {
      this.pos = new Float32Array(buffer, byteOffset + exports.bind.ImDrawVertPosOffset, 2);
      this.uv = new Float32Array(buffer, byteOffset + exports.bind.ImDrawVertUVOffset, 2);
      this.col = new Uint32Array(buffer, byteOffset + exports.bind.ImDrawVertColOffset, 1);
    }
  }
  // #else
  // You can override the vertex format layout by defining IMGUI_OVERRIDE_DRAWVERT_STRUCT_LAYOUT in imconfig.h
  // The code expect ImVec2 pos (8 bytes), ImVec2 uv (8 bytes), ImU32 col (4 bytes), but you can re-order them or add other fields as needed to simplify integration in your engine.
  // The type has to be described within the macro (you can either declare the struct or use a typedef)
  // NOTE: IMGUI DOESN'T CLEAR THE STRUCTURE AND DOESN'T CALL A CONSTRUCTOR SO ANY CUSTOM FIELD WILL BE UNINITIALIZED. IF YOU ADD EXTRA FIELDS (SUCH AS A 'Z' COORDINATES) YOU WILL NEED TO CLEAR THEM DURING RENDER OR TO IGNORE THEM.
  // IMGUI_OVERRIDE_DRAWVERT_STRUCT_LAYOUT;
  // #endif
  // [Internal] For use by ImDrawList
  class ImDrawCmdHeader {
  }
  // Draw channels are used by the Columns API to "split" the render list into different channels while building, so items of each column can be batched together.
  // You can also use them to simulate drawing layers and submit primitives in a different order than how they will be rendered.
  class ImDrawChannel {
  }
  class ImDrawListSharedData {
    constructor(native) {
      this.native = native;
    }
  }
  class ImDrawList {
    constructor(native) {
      this.native = native;
    }
    IterateDrawCmds(callback) {
      this.native.IterateDrawCmds((draw_cmd, ElemStart) => {
        callback(new ImDrawCmd(draw_cmd), ElemStart);
      });
    }
    // This is what you have to render
    // ImVector<ImDrawCmd>     CmdBuffer;          // Draw commands. Typically 1 command = 1 GPU draw call, unless the command is a callback.
    // ImVector<ImDrawIdx>     IdxBuffer;          // Index buffer. Each command consume ImDrawCmd::ElemCount of those
    get IdxBuffer() { return this.native.IdxBuffer; }
    // ImVector<ImDrawVert>    VtxBuffer;          // Vertex buffer.
    get VtxBuffer() { return this.native.VtxBuffer; }
    // ImDrawListFlags         Flags;              // Flags, you may poke into these to adjust anti-aliasing settings per-primitive.
    get Flags() { return this.native.Flags; }
    set Flags(value) { this.native.Flags = value; }
    // [Internal, used while building lists]
    // unsigned int            _VtxCurrentIdx;     // [Internal] == VtxBuffer.Size
    // const ImDrawListSharedData* _Data;          // Pointer to shared draw data (you can use ImGui::GetDrawListSharedData() to get the one from current ImGui context)
    // const char*             _OwnerName;         // Pointer to owner window's name for debugging
    // ImDrawVert*             _VtxWritePtr;       // [Internal] point within VtxBuffer.Data after each add command (to avoid using the ImVector<> operators too much)
    // ImDrawIdx*              _IdxWritePtr;       // [Internal] point within IdxBuffer.Data after each add command (to avoid using the ImVector<> operators too much)
    // ImVector<ImVec4>        _ClipRectStack;     // [Internal]
    // ImVector<ImTextureID>   _TextureIdStack;    // [Internal]
    // ImVector<ImVec2>        _Path;              // [Internal] current path building
    // int                     _ChannelsCurrent;   // [Internal] current channel number (0)
    // int                     _ChannelsCount;     // [Internal] number of active channels (1+)
    // ImVector<ImDrawChannel> _Channels;          // [Internal] draw channels for columns API (not resized down so _ChannelsCount may be smaller than _Channels.Size)
    // ImDrawList(const ImDrawListSharedData* shared_data) { _Data = shared_data; _OwnerName = NULL; Clear(); }
    // ~ImDrawList() { ClearFreeMemory(); }
    // IMGUI_API void  PushClipRect(ImVec2 clip_rect_min, ImVec2 clip_rect_max, bool intersect_with_current_clip_rect = false);  // Render-level scissoring. This is passed down to your render function but not used for CPU-side coarse clipping. Prefer using higher-level ImGui::PushClipRect() to affect logic (hit-testing and widget culling)
    PushClipRect(clip_rect_min, clip_rect_max, intersect_with_current_clip_rect = false) {
      this.native.PushClipRect(clip_rect_min, clip_rect_max, intersect_with_current_clip_rect);
    }
    // IMGUI_API void  PushClipRectFullScreen();
    PushClipRectFullScreen() { this.native.PushClipRectFullScreen(); }
    // IMGUI_API void  PopClipRect();
    PopClipRect() { this.native.PopClipRect(); }
    // IMGUI_API void  PushTextureID(ImTextureID texture_id);
    PushTextureID(texture_id) {
      this.native.PushTextureID(ImGuiContext.setTexture(texture_id));
    }
    // IMGUI_API void  PopTextureID();
    PopTextureID() { this.native.PopTextureID(); }
    // inline ImVec2   GetClipRectMin() const { const ImVec4& cr = _ClipRectStack.back(); return ImVec2(cr.x, cr.y); }
    GetClipRectMin(out = new ImVec2()) {
      return this.native.GetClipRectMin(out);
    }
    // inline ImVec2   GetClipRectMax() const { const ImVec4& cr = _ClipRectStack.back(); return ImVec2(cr.z, cr.w); }
    GetClipRectMax(out = new ImVec2()) {
      return this.native.GetClipRectMax(out);
    }
    // Primitives
    // IMGUI_API void  AddLine(const ImVec2& a, const ImVec2& b, ImU32 col, float thickness = 1.0f);
    AddLine(a, b, col, thickness = 1.0) {
      this.native.AddLine(a, b, col, thickness);
    }
    // IMGUI_API void  AddRect(const ImVec2& a, const ImVec2& b, ImU32 col, float rounding = 0.0f, int rounding_corners_flags = ImDrawCornerFlags_All, float thickness = 1.0f);   // a: upper-left, b: lower-right, rounding_corners_flags: 4-bits corresponding to which corner to round
    AddRect(a, b, col, rounding = 0.0, rounding_corners_flags = exports.ImDrawCornerFlags.All, thickness = 1.0) {
      this.native.AddRect(a, b, col, rounding, rounding_corners_flags, thickness);
    }
    // IMGUI_API void  AddRectFilled(const ImVec2& a, const ImVec2& b, ImU32 col, float rounding = 0.0f, int rounding_corners_flags = ImDrawCornerFlags_All);                     // a: upper-left, b: lower-right
    AddRectFilled(a, b, col, rounding = 0.0, rounding_corners_flags = exports.ImDrawCornerFlags.All) {
      this.native.AddRectFilled(a, b, col, rounding, rounding_corners_flags);
    }
    // IMGUI_API void  AddRectFilledMultiColor(const ImVec2& a, const ImVec2& b, ImU32 col_upr_left, ImU32 col_upr_right, ImU32 col_bot_right, ImU32 col_bot_left);
    AddRectFilledMultiColor(a, b, col_upr_left, col_upr_right, col_bot_right, col_bot_left) {
      this.native.AddRectFilledMultiColor(a, b, col_upr_left, col_upr_right, col_bot_right, col_bot_left);
    }
    // IMGUI_API void  AddQuad(const ImVec2& a, const ImVec2& b, const ImVec2& c, const ImVec2& d, ImU32 col, float thickness = 1.0f);
    AddQuad(a, b, c, d, col, thickness = 1.0) {
      this.native.AddQuad(a, b, c, d, col, thickness);
    }
    // IMGUI_API void  AddQuadFilled(const ImVec2& a, const ImVec2& b, const ImVec2& c, const ImVec2& d, ImU32 col);
    AddQuadFilled(a, b, c, d, col) {
      this.native.AddQuadFilled(a, b, c, d, col);
    }
    // IMGUI_API void  AddTriangle(const ImVec2& a, const ImVec2& b, const ImVec2& c, ImU32 col, float thickness = 1.0f);
    AddTriangle(a, b, c, col, thickness = 1.0) {
      this.native.AddTriangle(a, b, c, col, thickness);
    }
    // IMGUI_API void  AddTriangleFilled(const ImVec2& a, const ImVec2& b, const ImVec2& c, ImU32 col);
    AddTriangleFilled(a, b, c, col) {
      this.native.AddTriangleFilled(a, b, c, col);
    }
    // IMGUI_API void  AddCircle(const ImVec2& centre, float radius, ImU32 col, int num_segments = 12, float thickness = 1.0f);
    AddCircle(centre, radius, col, num_segments = 12, thickness = 1.0) {
      this.native.AddCircle(centre, radius, col, num_segments, thickness);
    }
    // IMGUI_API void  AddCircleFilled(const ImVec2& centre, float radius, ImU32 col, int num_segments = 12);
    AddCircleFilled(centre, radius, col, num_segments = 12) {
      this.native.AddCircleFilled(centre, radius, col, num_segments);
    }
    // IMGUI_API void  AddNgon(const ImVec2& center, float radius, ImU32 col, int num_segments, float thickness = 1.0f);
    AddNgon(centre, radius, col, num_segments, thickness = 1.0) {
      this.native.AddNgon(centre, radius, col, num_segments, thickness);
    }
    // IMGUI_API void  AddNgonFilled(const ImVec2& center, float radius, ImU32 col, int num_segments);
    AddNgonFilled(centre, radius, col, num_segments) {
      this.native.AddNgonFilled(centre, radius, col, num_segments);
    }
    AddText(...args) {
      if (args[0] instanceof ImFont) {
        const font = args[0];
        const font_size = args[1];
        const pos = args[2];
        const col = args[3];
        const text_begin = args[4];
        const text_end = args[5] || null;
        const wrap_width = args[6] = 0.0;
        const cpu_fine_clip_rect = args[7] || null;
        this.native.AddText_B(font.native, font_size, pos, col, text_end !== null ? text_begin.substring(0, text_end) : text_begin, wrap_width, cpu_fine_clip_rect);
      }
      else {
        const pos = args[0];
        const col = args[1];
        const text_begin = args[2];
        const text_end = args[3] || null;
        this.native.AddText_A(pos, col, text_end !== null ? text_begin.substring(0, text_end) : text_begin);
      }
    }
    // IMGUI_API void  AddPolyline(const ImVec2* points, const int num_points, ImU32 col, bool closed, float thickness);
    AddPolyline(points, num_points, col, closed, thickness) {
      this.native.AddPolyline(points, num_points, col, closed, thickness);
    }
    // IMGUI_API void  AddConvexPolyFilled(const ImVec2* points, const int num_points, ImU32 col);
    AddConvexPolyFilled(points, num_points, col) {
      this.native.AddConvexPolyFilled(points, num_points, col);
    }
    // IMGUI_API void  AddBezierCubic(const ImVec2& p1, const ImVec2& p2, const ImVec2& p3, const ImVec2& p4, ImU32 col, float thickness, int num_segments = 0); // Cubic Bezier (4 control points)
    AddBezierCubic(p1, p2, p3, p4, col, thickness = 1.0, num_segments = 0) {
      this.native.AddBezierCubic(p1, p2, p3, p4, col, thickness, num_segments);
    }
    // IMGUI_API void  AddBezierQuadratic(const ImVec2& p1, const ImVec2& p2, const ImVec2& p3, ImU32 col, float thickness, int num_segments = 0);               // Quadratic Bezier (3 control points)
    AddBezierQuadratic(p1, p2, p3, col, thickness = 1.0, num_segments = 0) {
      this.native.AddBezierQuadratic(p1, p2, p3, col, thickness, num_segments);
    }
    // IMGUI_API void  AddImage(ImTextureID user_texture_id, const ImVec2& a, const ImVec2& b, const ImVec2& uv_a = ImVec2(0,0), const ImVec2& uv_b = ImVec2(1,1), ImU32 col = 0xFFFFFFFF);
    AddImage(user_texture_id, a, b, uv_a = ImVec2.ZERO, uv_b = ImVec2.UNIT, col = 0xFFFFFFFF) {
      this.native.AddImage(ImGuiContext.setTexture(user_texture_id), a, b, uv_a, uv_b, col);
    }
    // IMGUI_API void  AddImageQuad(ImTextureID user_texture_id, const ImVec2& a, const ImVec2& b, const ImVec2& c, const ImVec2& d, const ImVec2& uv_a = ImVec2(0,0), const ImVec2& uv_b = ImVec2(1,0), const ImVec2& uv_c = ImVec2(1,1), const ImVec2& uv_d = ImVec2(0,1), ImU32 col = 0xFFFFFFFF);
    AddImageQuad(user_texture_id, a, b, c, d, uv_a = ImVec2.ZERO, uv_b = ImVec2.UNIT_X, uv_c = ImVec2.UNIT, uv_d = ImVec2.UNIT_Y, col = 0xFFFFFFFF) {
      this.native.AddImageQuad(ImGuiContext.setTexture(user_texture_id), a, b, c, d, uv_a, uv_b, uv_c, uv_d, col);
    }
    // IMGUI_API void  AddImageRounded(ImTextureID user_texture_id, const ImVec2& a, const ImVec2& b, const ImVec2& uv_a, const ImVec2& uv_b, ImU32 col, float rounding, int rounding_corners = ImDrawCornerFlags_All);
    AddImageRounded(user_texture_id, a, b, uv_a, uv_b, col, rounding, rounding_corners = exports.ImDrawCornerFlags.All) {
      this.native.AddImageRounded(ImGuiContext.setTexture(user_texture_id), a, b, uv_a, uv_b, col, rounding, rounding_corners);
    }
    // Stateful path API, add points then finish with PathFill() or PathStroke()
    // inline    void  PathClear()                                                 { _Path.resize(0); }
    PathClear() { this.native.PathClear(); }
    // inline    void  PathLineTo(const ImVec2& pos)                               { _Path.push_back(pos); }
    PathLineTo(pos) { this.native.PathLineTo(pos); }
    // inline    void  PathLineToMergeDuplicate(const ImVec2& pos)                 { if (_Path.Size == 0 || memcmp(&_Path[_Path.Size-1], &pos, 8) != 0) _Path.push_back(pos); }
    PathLineToMergeDuplicate(pos) { this.native.PathLineToMergeDuplicate(pos); }
    // inline    void  PathFillConvex(ImU32 col)                                   { AddConvexPolyFilled(_Path.Data, _Path.Size, col); PathClear(); }
    PathFillConvex(col) { this.native.PathFillConvex(col); }
    // inline    void  PathStroke(ImU32 col, bool closed, float thickness = 1.0f)  { AddPolyline(_Path.Data, _Path.Size, col, closed, thickness); PathClear(); }
    PathStroke(col, closed, thickness = 1.0) { this.native.PathStroke(col, closed, thickness); }
    // IMGUI_API void  PathArcTo(const ImVec2& centre, float radius, float a_min, float a_max, int num_segments = 10);
    PathArcTo(centre, radius, a_min, a_max, num_segments = 10) { this.native.PathArcTo(centre, radius, a_min, a_max, num_segments); }
    // IMGUI_API void  PathArcToFast(const ImVec2& centre, float radius, int a_min_of_12, int a_max_of_12);                                // Use precomputed angles for a 12 steps circle
    PathArcToFast(centre, radius, a_min_of_12, a_max_of_12) { this.native.PathArcToFast(centre, radius, a_min_of_12, a_max_of_12); }
    // IMGUI_API void  PathBezierCubicCurveTo(const ImVec2& p2, const ImVec2& p3, const ImVec2& p4, int num_segments = 0);  // Cubic Bezier (4 control points)
    PathBezierCubicCurveTo(p2, p3, p4, num_segments = 0) { this.native.PathBezierCubicCurveTo(p2, p3, p4, num_segments); }
    // IMGUI_API void  PathBezierQuadraticCurveTo(const ImVec2& p2, const ImVec2& p3, int num_segments = 0);                // Quadratic Bezier (3 control points)
    PathBezierQuadraticCurveTo(p2, p3, num_segments = 0) { this.native.PathBezierQuadraticCurveTo(p2, p3, num_segments); }
    // IMGUI_API void  PathRect(const ImVec2& rect_min, const ImVec2& rect_max, float rounding = 0.0f, int rounding_corners_flags = ImDrawCornerFlags_All);
    PathRect(rect_min, rect_max, rounding = 0.0, rounding_corners_flags = exports.ImDrawCornerFlags.All) { this.native.PathRect(rect_min, rect_max, rounding, rounding_corners_flags); }
    // Channels
    // - Use to simulate layers. By switching channels to can render out-of-order (e.g. submit foreground primitives before background primitives)
    // - Use to minimize draw calls (e.g. if going back-and-forth between multiple non-overlapping clipping rectangles, prefer to append into separate channels then merge at the end)
    // IMGUI_API void  ChannelsSplit(int channels_count);
    ChannelsSplit(channels_count) { this.native.ChannelsSplit(channels_count); }
    // IMGUI_API void  ChannelsMerge();
    ChannelsMerge() { this.native.ChannelsMerge(); }
    // IMGUI_API void  ChannelsSetCurrent(int channel_index);
    ChannelsSetCurrent(channel_index) { this.native.ChannelsSetCurrent(channel_index); }
    // Advanced
    // IMGUI_API void  AddCallback(ImDrawCallback callback, void* callback_data);  // Your rendering function must check for 'UserCallback' in ImDrawCmd and call the function instead of rendering triangles.
    AddCallback(callback, callback_data) {
      const _callback = (parent_list, draw_cmd) => {
        callback(new ImDrawList(parent_list), new ImDrawCmd(draw_cmd));
      };
      this.native.AddCallback(_callback, callback_data);
    }
    // IMGUI_API void  AddDrawCmd();                                               // This is useful if you need to forcefully create a new draw call (to allow for dependent rendering / blending). Otherwise primitives are merged into the same draw-call as much as possible
    AddDrawCmd() { this.native.AddDrawCmd(); }
    // Internal helpers
    // NB: all primitives needs to be reserved via PrimReserve() beforehand!
    // IMGUI_API void  PrimReserve(int idx_count, int vtx_count);
    PrimReserve(idx_count, vtx_count) { this.native.PrimReserve(idx_count, vtx_count); }
    // IMGUI_API void  PrimUnreserve(int idx_count, int vtx_count);
    PrimUnreserve(idx_count, vtx_count) { this.native.PrimUnreserve(idx_count, vtx_count); }
    // IMGUI_API void  PrimRect(const ImVec2& a, const ImVec2& b, ImU32 col);      // Axis aligned rectangle (composed of two triangles)
    PrimRect(a, b, col) { this.native.PrimRect(a, b, col); }
    // IMGUI_API void  PrimRectUV(const ImVec2& a, const ImVec2& b, const ImVec2& uv_a, const ImVec2& uv_b, ImU32 col);
    PrimRectUV(a, b, uv_a, uv_b, col) { this.native.PrimRectUV(a, b, uv_a, uv_b, col); }
    // IMGUI_API void  PrimQuadUV(const ImVec2& a, const ImVec2& b, const ImVec2& c, const ImVec2& d, const ImVec2& uv_a, const ImVec2& uv_b, const ImVec2& uv_c, const ImVec2& uv_d, ImU32 col);
    PrimQuadUV(a, b, c, d, uv_a, uv_b, uv_c, uv_d, col) { this.native.PrimQuadUV(a, b, c, d, uv_a, uv_b, uv_c, uv_d, col); }
    // inline    void  PrimWriteVtx(const ImVec2& pos, const ImVec2& uv, ImU32 col){ _VtxWritePtr->pos = pos; _VtxWritePtr->uv = uv; _VtxWritePtr->col = col; _VtxWritePtr++; _VtxCurrentIdx++; }
    PrimWriteVtx(pos, uv, col) { this.native.PrimWriteVtx(pos, uv, col); }
    // inline    void  PrimWriteIdx(ImDrawIdx idx)                                 { *_IdxWritePtr = idx; _IdxWritePtr++; }
    PrimWriteIdx(idx) { this.native.PrimWriteIdx(idx); }
    // inline    void  PrimVtx(const ImVec2& pos, const ImVec2& uv, ImU32 col)     { PrimWriteIdx((ImDrawIdx)_VtxCurrentIdx); PrimWriteVtx(pos, uv, col); }
    PrimVtx(pos, uv, col) { this.native.PrimVtx(pos, uv, col); }
  }
  class ImDrawData {
    constructor(native) {
      this.native = native;
    }
    IterateDrawLists(callback) {
      this.native.IterateDrawLists((draw_list) => {
        callback(new ImDrawList(draw_list));
      });
    }
    // bool            Valid;                  // Only valid after Render() is called and before the next NewFrame() is called.
    get Valid() { return this.native.Valid; }
    // ImDrawList**    CmdLists;
    // int             CmdListsCount;
    get CmdListsCount() { return this.native.CmdListsCount; }
    // int             TotalIdxCount;          // For convenience, sum of all cmd_lists idx_buffer.Size
    get TotalIdxCount() { return this.native.TotalIdxCount; }
    // int             TotalVtxCount;          // For convenience, sum of all cmd_lists vtx_buffer.Size
    get TotalVtxCount() { return this.native.TotalVtxCount; }
    // ImVec2          DisplayPos;             // Upper-left position of the viewport to render (== upper-left of the orthogonal projection matrix to use)
    get DisplayPos() { return this.native.DisplayPos; }
    // ImVec2          DisplaySize;            // Size of the viewport to render (== io.DisplaySize for the main viewport) (DisplayPos + DisplaySize == lower-right of the orthogonal projection matrix to use)
    get DisplaySize() { return this.native.DisplaySize; }
    // ImVec2          FramebufferScale;       // Amount of pixels for each unit of DisplaySize. Based on io.DisplayFramebufferScale. Generally (1,1) on normal display, (2,2) on OSX with Retina display.
    get FramebufferScale() { return this.native.FramebufferScale; }
    // Functions
    // ImDrawData() { Valid = false; CmdLists = NULL; CmdListsCount = TotalVtxCount = TotalIdxCount = 0; }
    // IMGUI_API void DeIndexAllBuffers();               // For backward compatibility or convenience: convert all buffers from indexed to de-indexed, in case you cannot render indexed. Note: this is slow and most likely a waste of resources. Always prefer indexed rendering!
    DeIndexAllBuffers() { this.native.DeIndexAllBuffers(); }
    // IMGUI_API void ScaleClipRects(const ImVec2& fb_scale);  // Helper to scale the ClipRect field of each ImDrawCmd. Use if your final output buffer is at a different scale than ImGui expects, or if there is a difference between your window resolution and framebuffer resolution.
    ScaleClipRects(fb_scale) {
      this.native.ScaleClipRects(fb_scale);
    }
  }
  class script_ImFontConfig {
    constructor() {
      // void*           FontData;                   //          // TTF/OTF data
      // int             FontDataSize;               //          // TTF/OTF data size
      this.FontData = null;
      // bool            FontDataOwnedByAtlas;       // true     // TTF/OTF data ownership taken by the container ImFontAtlas (will delete memory itself).
      this.FontDataOwnedByAtlas = true;
      // int             FontNo;                     // 0        // Index of font within TTF/OTF file
      this.FontNo = 0;
      // float           SizePixels;                 //          // Size in pixels for rasterizer.
      this.SizePixels = 0;
      // int             OversampleH, OversampleV;   // 3, 1     // Rasterize at higher quality for sub-pixel positioning. We don't use sub-pixel positions on the Y axis.
      this.OversampleH = 3;
      this.OversampleV = 1;
      // bool            PixelSnapH;                 // false    // Align every glyph to pixel boundary. Useful e.g. if you are merging a non-pixel aligned font with the default font. If enabled, you can set OversampleH/V to 1.
      this.PixelSnapH = false;
      // ImVec2          GlyphExtraSpacing;          // 0, 0     // Extra spacing (in pixels) between glyphs. Only X axis is supported for now.
      this.GlyphExtraSpacing = new ImVec2(0, 0);
      // ImVec2          GlyphOffset;                // 0, 0     // Offset all glyphs from this font input.
      this.GlyphOffset = new ImVec2(0, 0);
      // const ImWchar*  GlyphRanges;                // NULL     // Pointer to a user-provided list of Unicode range (2 value per range, values are inclusive, zero-terminated list). THE ARRAY DATA NEEDS TO PERSIST AS LONG AS THE FONT IS ALIVE.
      this.GlyphRanges = null;
      // float           GlyphMinAdvanceX;           // 0        // Minimum AdvanceX for glyphs, set Min to align font icons, set both Min/Max to enforce mono-space font
      this.GlyphMinAdvanceX = 0;
      // float           GlyphMaxAdvanceX;           // FLT_MAX  // Maximum AdvanceX for glyphs
      this.GlyphMaxAdvanceX = Number.MAX_VALUE;
      // bool            MergeMode;                  // false    // Merge into previous ImFont, so you can combine multiple inputs font into one ImFont (e.g. ASCII font + icons + Japanese glyphs). You may want to use GlyphOffset.y when merge font of different heights.
      this.MergeMode = false;
      // unsigned int    RasterizerFlags;            // 0x00     // Settings for custom font rasterizer (e.g. ImGuiFreeType). Leave as zero if you aren't using one.
      this.RasterizerFlags = 0;
      // float           RasterizerMultiply;         // 1.0f     // Brighten (>1.0f) or darken (<1.0f) font output. Brightening small fonts may be a good workaround to make them more readable.
      this.RasterizerMultiply = 1.0;
      // ImWchar         EllipsisChar;           // -1       // Explicitly specify unicode codepoint of ellipsis character. When fonts are being merged first specified ellipsis will be used.
      this.EllipsisChar = -1;
      // [Internal]
      // char            Name[32];                               // Name (strictly to ease debugging)
      this.Name = "";
      // ImFont*         DstFont;
      this.DstFont = null;
      // IMGUI_API ImFontConfig();
    }
  }
  class ImFontConfig {
    constructor(internal = new script_ImFontConfig()) {
      this.internal = internal;
    }
    // void*           FontData;                   //          // TTF/OTF data
    // int             FontDataSize;               //          // TTF/OTF data size
    get FontData() { return this.internal.FontData; }
    // bool            FontDataOwnedByAtlas;       // true     // TTF/OTF data ownership taken by the container ImFontAtlas (will delete memory itself).
    get FontDataOwnedByAtlas() { return this.internal.FontDataOwnedByAtlas; }
    // int             FontNo;                     // 0        // Index of font within TTF/OTF file
    get FontNo() { return this.internal.FontNo; }
    // float           SizePixels;                 //          // Size in pixels for rasterizer.
    get SizePixels() { return this.internal.SizePixels; }
    // int             OversampleH, OversampleV;   // 3, 1     // Rasterize at higher quality for sub-pixel positioning. We don't use sub-pixel positions on the Y axis.
    get OversampleH() { return this.internal.OversampleH; }
    get OversampleV() { return this.internal.OversampleV; }
    // bool            PixelSnapH;                 // false    // Align every glyph to pixel boundary. Useful e.g. if you are merging a non-pixel aligned font with the default font. If enabled, you can set OversampleH/V to 1.
    get PixelSnapH() { return this.internal.PixelSnapH; }
    // ImVec2          GlyphExtraSpacing;          // 0, 0     // Extra spacing (in pixels) between glyphs. Only X axis is supported for now.
    get GlyphExtraSpacing() { return this.internal.GlyphExtraSpacing; }
    // ImVec2          GlyphOffset;                // 0, 0     // Offset all glyphs from this font input.
    get GlyphOffset() { return this.internal.GlyphOffset; }
    // const ImWchar*  GlyphRanges;                // NULL     // Pointer to a user-provided list of Unicode range (2 value per range, values are inclusive, zero-terminated list). THE ARRAY DATA NEEDS TO PERSIST AS LONG AS THE FONT IS ALIVE.
    get GlyphRanges() { return this.internal.GlyphRanges; }
    // float           GlyphMinAdvanceX;           // 0        // Minimum AdvanceX for glyphs, set Min to align font icons, set both Min/Max to enforce mono-space font
    get GlyphMinAdvanceX() { return this.internal.GlyphMinAdvanceX; }
    // float           GlyphMaxAdvanceX;           // FLT_MAX  // Maximum AdvanceX for glyphs
    get GlyphMaxAdvanceX() { return this.internal.GlyphMaxAdvanceX; }
    // bool            MergeMode;                  // false    // Merge into previous ImFont, so you can combine multiple inputs font into one ImFont (e.g. ASCII font + icons + Japanese glyphs). You may want to use GlyphOffset.y when merge font of different heights.
    get MergeMode() { return this.internal.MergeMode; }
    // unsigned int    RasterizerFlags;            // 0x00     // Settings for custom font rasterizer (e.g. ImGuiFreeType). Leave as zero if you aren't using one.
    get RasterizerFlags() { return this.internal.RasterizerFlags; }
    // float           RasterizerMultiply;         // 1.0f     // Brighten (>1.0f) or darken (<1.0f) font output. Brightening small fonts may be a good workaround to make them more readable.
    get RasterizerMultiply() { return this.internal.RasterizerMultiply; }
    // [Internal]
    // char            Name[32];                               // Name (strictly to ease debugging)
    get Name() { return this.internal.Name; }
    set Name(value) { this.internal.Name = value; }
    // ImFont*         DstFont;
    get DstFont() {
      const font = this.internal.DstFont;
      return font && new ImFont(font);
    }
  }
  // struct ImFontGlyph
  class script_ImFontGlyph {
    constructor() {
      // unsigned int    Codepoint : 31;     // 0x0000..0xFFFF
      this.Codepoint = 0;
      // unsigned int    Visible : 1;        // Flag to allow early out when rendering
      this.Visible = false;
      // float           AdvanceX;           // Distance to next character (= data from font + ImFontConfig::GlyphExtraSpacing.x baked in)
      this.AdvanceX = 0.0;
      // float           X0, Y0, X1, Y1;     // Glyph corners
      this.X0 = 0.0;
      this.Y0 = 0.0;
      this.X1 = 1.0;
      this.Y1 = 1.0;
      // float           U0, V0, U1, V1;     // Texture coordinates
      this.U0 = 0.0;
      this.V0 = 0.0;
      this.U1 = 1.0;
      this.V1 = 1.0;
    }
  }
  class ImFontGlyph {
    constructor(internal = new script_ImFontGlyph()) {
      this.internal = internal;
    }
    // unsigned int    Codepoint : 31;     // 0x0000..0xFFFF
    get Codepoint() { return this.internal.Codepoint; }
    // unsigned int    Visible : 1;        // Flag to allow early out when rendering
    get Visible() { return this.internal.Visible; }
    // float           AdvanceX;           // Distance to next character (= data from font + ImFontConfig::GlyphExtraSpacing.x baked in)
    get AdvanceX() { return this.internal.AdvanceX; }
    ;
    // float           X0, Y0, X1, Y1;     // Glyph corners
    get X0() { return this.internal.X0; }
    ;
    get Y0() { return this.internal.Y0; }
    ;
    get X1() { return this.internal.X1; }
    ;
    get Y1() { return this.internal.Y1; }
    ;
    // float           U0, V0, U1, V1;     // Texture coordinates
    get U0() { return this.internal.U0; }
    ;
    get V0() { return this.internal.V0; }
    ;
    get U1() { return this.internal.U1; }
    ;
    get V1() { return this.internal.V1; }
    ;
  }
  // See ImFontAtlas::AddCustomRectXXX functions.
  class ImFontAtlasCustomRect {
  }
  exports.ImFontAtlasFlags = void 0;
  (function (ImFontAtlasFlags) {
    ImFontAtlasFlags[ImFontAtlasFlags["None"] = 0] = "None";
    ImFontAtlasFlags[ImFontAtlasFlags["NoPowerOfTwoHeight"] = 1] = "NoPowerOfTwoHeight";
    ImFontAtlasFlags[ImFontAtlasFlags["NoMouseCursors"] = 2] = "NoMouseCursors";
    ImFontAtlasFlags[ImFontAtlasFlags["NoBakedLines"] = 4] = "NoBakedLines";
  })(exports.ImFontAtlasFlags || (exports.ImFontAtlasFlags = {}));
  class ImFontAtlas {
    constructor(native) {
      this.native = native;
    }
    // IMGUI_API ImFontAtlas();
    // IMGUI_API ~ImFontAtlas();
    // IMGUI_API ImFont*           AddFont(const ImFontConfig* font_cfg);
    // IMGUI_API ImFont*           AddFontDefault(const ImFontConfig* font_cfg = NULL);
    AddFontDefault(font_cfg = null) {
      return new ImFont(this.native.AddFontDefault(font_cfg));
    }
    // IMGUI_API ImFont*           AddFontFromFileTTF(const char* filename, float size_pixels, const ImFontConfig* font_cfg = NULL, const ImWchar* glyph_ranges = NULL);
    // IMGUI_API ImFont*           AddFontFromMemoryTTF(void* font_data, int font_size, float size_pixels, const ImFontConfig* font_cfg = NULL, const ImWchar* glyph_ranges = NULL); // Note: Transfer ownership of 'ttf_data' to ImFontAtlas! Will be deleted after Build(). Set font_cfg->FontDataOwnedByAtlas to false to keep ownership.
    AddFontFromMemoryTTF(data, size_pixels, font_cfg = null, glyph_ranges = null) {
      return new ImFont(this.native.AddFontFromMemoryTTF(new Uint8Array(data), size_pixels, font_cfg && font_cfg.internal, glyph_ranges));
    }
    // IMGUI_API ImFont*           AddFontFromMemoryCompressedTTF(const void* compressed_font_data, int compressed_font_size, float size_pixels, const ImFontConfig* font_cfg = NULL, const ImWchar* glyph_ranges = NULL); // 'compressed_font_data' still owned by caller. Compress with binary_to_compressed_c.cpp.
    // IMGUI_API ImFont*           AddFontFromMemoryCompressedBase85TTF(const char* compressed_font_data_base85, float size_pixels, const ImFontConfig* font_cfg = NULL, const ImWchar* glyph_ranges = NULL);              // 'compressed_font_data_base85' still owned by caller. Compress with binary_to_compressed_c.cpp with -base85 parameter.
    // IMGUI_API void              ClearTexData();             // Clear the CPU-side texture data. Saves RAM once the texture has been copied to graphics memory.
    ClearTexData() { this.native.ClearTexData(); }
    // IMGUI_API void              ClearInputData();           // Clear the input TTF data (inc sizes, glyph ranges)
    ClearInputData() { this.native.ClearInputData(); }
    // IMGUI_API void              ClearFonts();               // Clear the ImGui-side font data (glyphs storage, UV coordinates)
    ClearFonts() { this.native.ClearFonts(); }
    // IMGUI_API void              Clear();                    // Clear all
    Clear() { this.native.Clear(); }
    // Build atlas, retrieve pixel data.
    // User is in charge of copying the pixels into graphics memory (e.g. create a texture with your engine). Then store your texture handle with SetTexID().
    // RGBA32 format is provided for convenience and compatibility, but note that unless you use CustomRect to draw color data, the RGB pixels emitted from Fonts will all be white (~75% of waste).
    // Pitch = Width * BytesPerPixels
    // IMGUI_API bool              Build();                    // Build pixels data. This is called automatically for you by the GetTexData*** functions.
    Build() { return this.native.Build(); }
    // IMGUI_API bool              IsBuilt()                   { return Fonts.Size > 0 && (TexPixelsAlpha8 != NULL || TexPixelsRGBA32 != NULL); }
    IsBuilt() { return this.native.IsBuilt(); }
    // IMGUI_API void              GetTexDataAsAlpha8(unsigned char** out_pixels, int* out_width, int* out_height, int* out_bytes_per_pixel = NULL);  // 1 byte per-pixel
    GetTexDataAsAlpha8() {
      return this.native.GetTexDataAsAlpha8();
    }
    // IMGUI_API void              GetTexDataAsRGBA32(unsigned char** out_pixels, int* out_width, int* out_height, int* out_bytes_per_pixel = NULL);  // 4 bytes-per-pixel
    GetTexDataAsRGBA32() {
      return this.native.GetTexDataAsRGBA32();
    }
    // void                        SetTexID(ImTextureID id)    { TexID = id; }
    SetTexID(id) { this.TexID = id; }
    //-------------------------------------------
    // Glyph Ranges
    //-------------------------------------------
    // Helpers to retrieve list of common Unicode ranges (2 value per range, values are inclusive, zero-terminated list)
    // NB: Make sure that your string are UTF-8 and NOT in your local code page. In C++11, you can create UTF-8 string literal using the u8"Hello world" syntax. See FAQ for details.
    // IMGUI_API const ImWchar*    GetGlyphRangesDefault();    // Basic Latin, Extended Latin
    GetGlyphRangesDefault() { return this.native.GetGlyphRangesDefault(); }
    // IMGUI_API const ImWchar*    GetGlyphRangesKorean();     // Default + Korean characters
    GetGlyphRangesKorean() { return this.native.GetGlyphRangesKorean(); }
    // IMGUI_API const ImWchar*    GetGlyphRangesJapanese();   // Default + Hiragana, Katakana, Half-Width, Selection of 1946 Ideographs
    GetGlyphRangesJapanese() { return this.native.GetGlyphRangesJapanese(); }
    // IMGUI_API const ImWchar*    GetGlyphRangesChineseFull();            // Default + Half-Width + Japanese Hiragana/Katakana + full set of about 21000 CJK Unified Ideographs
    GetGlyphRangesChineseFull() { return this.native.GetGlyphRangesChineseFull(); }
    // IMGUI_API const ImWchar*    GetGlyphRangesChineseSimplifiedCommon();// Default + Half-Width + Japanese Hiragana/Katakana + set of 2500 CJK Unified Ideographs for common simplified Chinese
    GetGlyphRangesChineseSimplifiedCommon() { return this.native.GetGlyphRangesChineseSimplifiedCommon(); }
    // IMGUI_API const ImWchar*    GetGlyphRangesCyrillic();   // Default + about 400 Cyrillic characters
    GetGlyphRangesCyrillic() { return this.native.GetGlyphRangesCyrillic(); }
    // IMGUI_API const ImWchar*    GetGlyphRangesThai();       // Default + Thai characters
    GetGlyphRangesThai() { return this.native.GetGlyphRangesThai(); }
    // IMGUI_API const ImWchar*    GetGlyphRangesVietnamese();       // Default + Vietnamese characters
    GetGlyphRangesVietnamese() { return this.native.GetGlyphRangesVietnamese(); }
    // Helpers to build glyph ranges from text data. Feed your application strings/characters to it then call BuildRanges().
    // struct GlyphRangesBuilder
    // {
    //     ImVector<unsigned char> UsedChars;  // Store 1-bit per Unicode code point (0=unused, 1=used)
    //     GlyphRangesBuilder()                { UsedChars.resize(0x10000 / 8); memset(UsedChars.Data, 0, 0x10000 / 8); }
    //     bool           GetBit(int n) const  { return (UsedChars[n >> 3] & (1 << (n & 7))) != 0; }
    //     void           SetBit(int n)        { UsedChars[n >> 3] |= 1 << (n & 7); }  // Set bit 'c' in the array
    //     void           AddChar(ImWchar c)   { SetBit(c); }                          // Add character
    //     IMGUI_API void AddText(const char* text, const char* text_end = NULL);      // Add string (each character of the UTF-8 string are added)
    //     IMGUI_API void AddRanges(const ImWchar* ranges);                            // Add ranges, e.g. builder.AddRanges(ImFontAtlas::GetGlyphRangesDefault) to force add all of ASCII/Latin+Ext
    //     IMGUI_API void BuildRanges(ImVector<ImWchar>* out_ranges);                  // Output new ranges
    // };
    //-------------------------------------------
    // Custom Rectangles/Glyphs API
    //-------------------------------------------
    // You can request arbitrary rectangles to be packed into the atlas, for your own purposes. After calling Build(), you can query the rectangle position and render your pixels.
    // You can also request your rectangles to be mapped as font glyph (given a font + Unicode point), so you can render e.g. custom colorful icons and use them as regular glyphs.
    // struct CustomRect
    // {
    //     unsigned int    ID;             // Input    // User ID. Use <0x10000 to map into a font glyph, >=0x10000 for other/internal/custom texture data.
    //     unsigned short  Width, Height;  // Input    // Desired rectangle dimension
    //     unsigned short  X, Y;           // Output   // Packed position in Atlas
    //     float           GlyphAdvanceX;  // Input    // For custom font glyphs only (ID<0x10000): glyph xadvance
    //     ImVec2          GlyphOffset;    // Input    // For custom font glyphs only (ID<0x10000): glyph display offset
    //     ImFont*         Font;           // Input    // For custom font glyphs only (ID<0x10000): target font
    //     CustomRect()            { ID = 0xFFFFFFFF; Width = Height = 0; X = Y = 0xFFFF; GlyphAdvanceX = 0.0f; GlyphOffset = ImVec2(0,0); Font = NULL; }
    //     bool IsPacked() const   { return X != 0xFFFF; }
    // };
    // IMGUI_API int       AddCustomRectRegular(unsigned int id, int width, int height);                                                                   // Id needs to be >= 0x10000. Id >= 0x80000000 are reserved for ImGui and ImDrawList
    // IMGUI_API int       AddCustomRectFontGlyph(ImFont* font, ImWchar id, int width, int height, float advance_x, const ImVec2& offset = ImVec2(0,0));   // Id needs to be < 0x10000 to register a rectangle to map into a specific font.
    // IMGUI_API void      CalcCustomRectUV(const CustomRect* rect, ImVec2* out_uv_min, ImVec2* out_uv_max);
    // const CustomRect*   GetCustomRectByIndex(int index) const { if (index < 0) return NULL; return &CustomRects[index]; }
    //-------------------------------------------
    // Members
    //-------------------------------------------
    // bool                        Locked;             // Marked as Locked by ImGui::NewFrame() so attempt to modify the atlas will assert.
    get Locked() { return this.native.Locked; }
    set Locked(value) { this.native.Locked = value; }
    // ImFontAtlasFlags            Flags;              // Build flags (see ImFontAtlasFlags_)
    get Flags() { return this.native.Flags; }
    set Flags(value) { this.native.Flags = value; }
    // ImTextureID                 TexID;              // User data to refer to the texture once it has been uploaded to user's graphic systems. It is passed back to you during rendering via the ImDrawCmd structure.
    get TexID() {
      return ImGuiContext.getTexture(this.native.TexID);
    }
    set TexID(value) {
      this.native.TexID = ImGuiContext.setTexture(value);
    }
    // int                         TexDesiredWidth;    // Texture width desired by user before Build(). Must be a power-of-two. If have many glyphs your graphics API have texture size restrictions you may want to increase texture width to decrease height.
    get TexDesiredWidth() { return this.native.TexDesiredWidth; }
    set TexDesiredWidth(value) { this.native.TexDesiredWidth = value; }
    // int                         TexGlyphPadding;    // Padding between glyphs within texture in pixels. Defaults to 1.
    get TexGlyphPadding() { return this.native.TexGlyphPadding; }
    set TexGlyphPadding(value) { this.native.TexGlyphPadding = value; }
    // [Internal]
    // NB: Access texture data via GetTexData*() calls! Which will setup a default font for you.
    // unsigned char*              TexPixelsAlpha8;    // 1 component per pixel, each component is unsigned 8-bit. Total size = TexWidth * TexHeight
    // unsigned int*               TexPixelsRGBA32;    // 4 component per pixel, each component is unsigned 8-bit. Total size = TexWidth * TexHeight * 4
    // int                         TexWidth;           // Texture width calculated during Build().
    get TexWidth() { return this.native.TexWidth; }
    // int                         TexHeight;          // Texture height calculated during Build().
    get TexHeight() { return this.native.TexHeight; }
    // ImVec2                      TexUvScale;         // = (1.0f/TexWidth, 1.0f/TexHeight)
    get TexUvScale() { return this.native.TexUvScale; }
    // ImVec2                      TexUvWhitePixel;    // Texture coordinates to a white pixel
    get TexUvWhitePixel() { return this.native.TexUvWhitePixel; }
    // ImVector<ImFont*>           Fonts;              // Hold all the fonts returned by AddFont*. Fonts[0] is the default font upon calling ImGui::NewFrame(), use ImGui::PushFont()/PopFont() to change the current font.
    get Fonts() {
      const fonts = new ImVector();
      this.native.IterateFonts((font) => {
        fonts.push(new ImFont(font));
      });
      return fonts;
    }
  }
  class ImFont {
    constructor(native) {
      this.native = native;
    }
    // Members: Hot ~62/78 bytes
    // float                       FontSize;           // <user set>   // Height of characters, set during loading (don't change after loading)
    get FontSize() { return this.native.FontSize; }
    // float                       Scale;              // = 1.f        // Base font scale, multiplied by the per-window font scale which you can adjust with SetFontScale()
    get Scale() { return this.native.Scale; }
    set Scale(value) { this.native.Scale = value; }
    // ImVector<ImFontGlyph>       Glyphs;             //              // All glyphs.
    get Glyphs() {
      const glyphs = new ImVector();
      this.native.IterateGlyphs((glyph) => {
        glyphs.push(new ImFontGlyph(glyph)); // TODO: wrap native
      });
      return glyphs;
    }
    // ImVector<float>             IndexAdvanceX;      //              // Sparse. Glyphs->AdvanceX in a directly indexable way (more cache-friendly, for CalcTextSize functions which are often bottleneck in large UI).
    // get IndexAdvanceX(): any { return this.native.IndexAdvanceX; }
    // ImVector<unsigned short>    IndexLookup;        //              // Sparse. Index glyphs by Unicode code-point.
    // get IndexLookup(): any { return this.native.IndexLookup; }
    // const ImFontGlyph*          FallbackGlyph;      // == FindGlyph(FontFallbackChar)
    get FallbackGlyph() {
      const glyph = this.native.FallbackGlyph;
      return glyph && new ImFontGlyph(glyph);
    }
    set FallbackGlyph(value) {
      this.native.FallbackGlyph = value && value.internal;
    }
    // float                       FallbackAdvanceX;   // == FallbackGlyph->AdvanceX
    get FallbackAdvanceX() { return this.native.FallbackAdvanceX; }
    // ImWchar                     FallbackChar;       // = '?'        // Replacement glyph if one isn't found. Only set via SetFallbackChar()
    get FallbackChar() { return this.native.FallbackChar; }
    // ImWchar                     EllipsisChar;       // 2     // out // = -1       // Character used for ellipsis rendering.
    get EllipsisChar() { return this.native.EllipsisChar; }
    // Members: Cold ~18/26 bytes
    // short                       ConfigDataCount;    // ~ 1          // Number of ImFontConfig involved in creating this font. Bigger than 1 when merging multiple font sources into one ImFont.
    get ConfigDataCount() { return this.ConfigData.length; }
    // ImFontConfig*               ConfigData;         //              // Pointer within ContainerAtlas->ConfigData
    get ConfigData() {
      const cfg_data = [];
      this.native.IterateConfigData((cfg) => {
        cfg_data.push(new ImFontConfig(cfg));
      });
      return cfg_data;
    }
    // ImFontAtlas*                ContainerAtlas;     //              // What we has been loaded into
    get ContainerAtlas() { return null; }
    // float                       Ascent, Descent;    //              // Ascent: distance from top to bottom of e.g. 'A' [0..FontSize]
    get Ascent() { return this.native.Ascent; }
    get Descent() { return this.native.Descent; }
    // int                         MetricsTotalSurface;//              // Total surface in pixels to get an idea of the font rasterization/texture cost (not exact, we approximate the cost of padding between glyphs)
    get MetricsTotalSurface() { return this.native.MetricsTotalSurface; }
    // Methods
    // IMGUI_API ImFont();
    // IMGUI_API ~ImFont();
    // IMGUI_API void              ClearOutputData();
    ClearOutputData() { return this.native.ClearOutputData(); }
    // IMGUI_API void              BuildLookupTable();
    BuildLookupTable() { return this.native.BuildLookupTable(); }
    // IMGUI_API const ImFontGlyph*FindGlyph(ImWchar c) const;
    FindGlyph(c) {
      const glyph = this.native.FindGlyph(c);
      return glyph && new ImFontGlyph(glyph);
    }
    // IMGUI_API const ImFontGlyph*FindGlyphNoFallback(ImWchar c) const;
    FindGlyphNoFallback(c) {
      const glyph = this.native.FindGlyphNoFallback(c);
      return glyph && new ImFontGlyph(glyph);
    }
    // IMGUI_API void              SetFallbackChar(ImWchar c);
    SetFallbackChar(c) { return this.native.SetFallbackChar(c); }
    // float                       GetCharAdvance(ImWchar c) const     { return ((int)c < IndexAdvanceX.Size) ? IndexAdvanceX[(int)c] : FallbackAdvanceX; }
    GetCharAdvance(c) { return this.native.GetCharAdvance(c); }
    // bool                        IsLoaded() const                    { return ContainerAtlas != NULL; }
    IsLoaded() { return this.native.IsLoaded(); }
    // const char*                 GetDebugName() const                { return ConfigData ? ConfigData->Name : "<unknown>"; }
    GetDebugName() { return this.native.GetDebugName(); }
    // 'max_width' stops rendering after a certain width (could be turned into a 2d size). FLT_MAX to disable.
    // 'wrap_width' enable automatic word-wrapping across multiple lines to fit into given width. 0.0f to disable.
    // IMGUI_API ImVec2            CalcTextSizeA(float size, float max_width, float wrap_width, const char* text_begin, const char* text_end = NULL, const char** remaining = NULL) const; // utf8
    CalcTextSizeA(size, max_width, wrap_width, text_begin, text_end = null, remaining = null) {
      return this.native.CalcTextSizeA(size, max_width, wrap_width, text_end !== null ? text_begin.substring(0, text_end) : text_begin, remaining, new ImVec2());
    }
    // IMGUI_API const char*       CalcWordWrapPositionA(float scale, const char* text, const char* text_end, float wrap_width) const;
    CalcWordWrapPositionA(scale, text, text_end = null, wrap_width) {
      return this.native.CalcWordWrapPositionA(scale, text_end !== null ? text.substring(0, text_end) : text, wrap_width);
    }
    // IMGUI_API void              RenderChar(ImDrawList* draw_list, float size, ImVec2 pos, ImU32 col, unsigned short c) const;
    RenderChar(draw_list, size, pos, col, c) {
      this.native.RenderChar(draw_list.native, size, pos, col, c);
    }
    // IMGUI_API void              RenderText(ImDrawList* draw_list, float size, ImVec2 pos, ImU32 col, const ImVec4& clip_rect, const char* text_begin, const char* text_end, float wrap_width = 0.0f, bool cpu_fine_clip = false) const;
    RenderText(draw_list, size, pos, col, clip_rect, text_begin, text_end = null, wrap_width = 0.0, cpu_fine_clip = false) { }
    // [Internal]
    // IMGUI_API void              GrowIndex(int new_size);
    // IMGUI_API void              AddGlyph(ImWchar c, float x0, float y0, float x1, float y1, float u0, float v0, float u1, float v1, float advance_x);
    // IMGUI_API void              AddRemapChar(ImWchar dst, ImWchar src, bool overwrite_dst = true); // Makes 'dst' character/glyph points to 'src' character/glyph. Currently needs to be called AFTER fonts have been built.
    // #ifndef IMGUI_DISABLE_OBSOLETE_FUNCTIONS
    // typedef ImFontGlyph Glyph; // OBSOLETE 1.52+
    // #endif
    // IMGUI_API bool              IsGlyphRangeUnused(unsigned int c_begin, unsigned int c_last);
    IsGlyphRangeUnused(c_begin, c_last) { return false; } // TODO
  }
  // a script version of Bind.ImGuiStyle with matching interface
  class script_ImGuiStyle {
    constructor() {
      this.Alpha = 1.0;
      this.WindowPadding = new ImVec2(8, 8);
      this.WindowRounding = 7.0;
      this.WindowBorderSize = 0.0;
      this.WindowMinSize = new ImVec2(32, 32);
      this.WindowTitleAlign = new ImVec2(0.0, 0.5);
      this.WindowMenuButtonPosition = exports.ImGuiDir.Left;
      this.ChildRounding = 0.0;
      this.ChildBorderSize = 1.0;
      this.PopupRounding = 0.0;
      this.PopupBorderSize = 1.0;
      this.FramePadding = new ImVec2(4, 3);
      this.FrameRounding = 0.0;
      this.FrameBorderSize = 0.0;
      this.ItemSpacing = new ImVec2(8, 4);
      this.ItemInnerSpacing = new ImVec2(4, 4);
      this.CellPadding = new ImVec2(4, 2);
      this.TouchExtraPadding = new ImVec2(0, 0);
      this.IndentSpacing = 21.0;
      this.ColumnsMinSpacing = 6.0;
      this.ScrollbarSize = 16.0;
      this.ScrollbarRounding = 9.0;
      this.GrabMinSize = 10.0;
      this.GrabRounding = 0.0;
      this.LogSliderDeadzone = 4.0;
      this.TabRounding = 0.0;
      this.TabBorderSize = 0.0;
      this.TabMinWidthForCloseButton = 0.0;
      this.ColorButtonPosition = exports.ImGuiDir.Right;
      this.ButtonTextAlign = new ImVec2(0.5, 0.5);
      this.SelectableTextAlign = new ImVec2(0.0, 0.0);
      this.DisplayWindowPadding = new ImVec2(22, 22);
      this.DisplaySafeAreaPadding = new ImVec2(4, 4);
      this.MouseCursorScale = 1;
      this.AntiAliasedLines = true;
      this.AntiAliasedLinesUseTex = true;
      this.AntiAliasedFill = true;
      this.CurveTessellationTol = 1.25;
      this.CircleSegmentMaxError = 1.60;
      this.Colors = [];
      for (let i = 0; i < exports.ImGuiCol.COUNT; ++i) {
        this.Colors[i] = new ImVec4();
      }
      const _this = new ImGuiStyle(this);
      const native = new exports.bind.ImGuiStyle();
      const _that = new ImGuiStyle(native);
      _that.Copy(_this);
      exports.bind.StyleColorsClassic(native);
      _this.Copy(_that);
      native.delete();
    }
    _getAt_Colors(index) { return this.Colors[index]; }
    _setAt_Colors(index, color) { this.Colors[index].Copy(color); return true; }
    ScaleAllSizes(scale_factor) {
      const _this = new ImGuiStyle(this);
      const native = new exports.bind.ImGuiStyle();
      const _that = new ImGuiStyle(native);
      _that.Copy(_this);
      native.ScaleAllSizes(scale_factor);
      _this.Copy(_that);
      native.delete();
    }
  }
  class ImGuiStyle {
    constructor(internal = new script_ImGuiStyle()) {
      this.internal = internal;
      this.Colors = new Proxy([], {
        get: (target, key) => {
          if (key === "length") {
            return exports.ImGuiCol.COUNT;
          }
          return this.internal._getAt_Colors(Number(key));
        },
        set: (target, key, value) => {
          return this.internal._setAt_Colors(Number(key), value);
        },
      });
    }
    get Alpha() { return this.internal.Alpha; }
    set Alpha(value) { this.internal.Alpha = value; }
    get WindowPadding() { return this.internal.WindowPadding; }
    get WindowRounding() { return this.internal.WindowRounding; }
    set WindowRounding(value) { this.internal.WindowRounding = value; }
    get WindowBorderSize() { return this.internal.WindowBorderSize; }
    set WindowBorderSize(value) { this.internal.WindowBorderSize = value; }
    get WindowMinSize() { return this.internal.WindowMinSize; }
    get WindowTitleAlign() { return this.internal.WindowTitleAlign; }
    get WindowMenuButtonPosition() { return this.internal.WindowMenuButtonPosition; }
    set WindowMenuButtonPosition(value) { this.internal.WindowMenuButtonPosition = value; }
    get ChildRounding() { return this.internal.ChildRounding; }
    set ChildRounding(value) { this.internal.ChildRounding = value; }
    get ChildBorderSize() { return this.internal.ChildBorderSize; }
    set ChildBorderSize(value) { this.internal.ChildBorderSize = value; }
    get PopupRounding() { return this.internal.PopupRounding; }
    set PopupRounding(value) { this.internal.PopupRounding = value; }
    get PopupBorderSize() { return this.internal.PopupBorderSize; }
    set PopupBorderSize(value) { this.internal.PopupBorderSize = value; }
    get FramePadding() { return this.internal.FramePadding; }
    get FrameRounding() { return this.internal.FrameRounding; }
    set FrameRounding(value) { this.internal.FrameRounding = value; }
    get FrameBorderSize() { return this.internal.FrameBorderSize; }
    set FrameBorderSize(value) { this.internal.FrameBorderSize = value; }
    get ItemSpacing() { return this.internal.ItemSpacing; }
    get ItemInnerSpacing() { return this.internal.ItemInnerSpacing; }
    get CellPadding() { return this.internal.CellPadding; }
    get TouchExtraPadding() { return this.internal.TouchExtraPadding; }
    get IndentSpacing() { return this.internal.IndentSpacing; }
    set IndentSpacing(value) { this.internal.IndentSpacing = value; }
    get ColumnsMinSpacing() { return this.internal.ColumnsMinSpacing; }
    set ColumnsMinSpacing(value) { this.internal.ColumnsMinSpacing = value; }
    get ScrollbarSize() { return this.internal.ScrollbarSize; }
    set ScrollbarSize(value) { this.internal.ScrollbarSize = value; }
    get ScrollbarRounding() { return this.internal.ScrollbarRounding; }
    set ScrollbarRounding(value) { this.internal.ScrollbarRounding = value; }
    get GrabMinSize() { return this.internal.GrabMinSize; }
    set GrabMinSize(value) { this.internal.GrabMinSize = value; }
    get GrabRounding() { return this.internal.GrabRounding; }
    set GrabRounding(value) { this.internal.GrabRounding = value; }
    get LogSliderDeadzone() { return this.internal.LogSliderDeadzone; }
    set LogSliderDeadzone(value) { this.internal.LogSliderDeadzone = value; }
    get TabRounding() { return this.internal.TabRounding; }
    set TabRounding(value) { this.internal.TabRounding = value; }
    get TabBorderSize() { return this.internal.TabBorderSize; }
    set TabBorderSize(value) { this.internal.TabBorderSize = value; }
    get TabMinWidthForCloseButton() { return this.internal.TabMinWidthForCloseButton; }
    set TabMinWidthForCloseButton(value) { this.internal.TabMinWidthForCloseButton = value; }
    get ColorButtonPosition() { return this.internal.ColorButtonPosition; }
    set ColorButtonPosition(value) { this.internal.ColorButtonPosition = value; }
    get ButtonTextAlign() { return this.internal.ButtonTextAlign; }
    get SelectableTextAlign() { return this.internal.SelectableTextAlign; }
    get DisplayWindowPadding() { return this.internal.DisplayWindowPadding; }
    get DisplaySafeAreaPadding() { return this.internal.DisplaySafeAreaPadding; }
    get MouseCursorScale() { return this.internal.MouseCursorScale; }
    set MouseCursorScale(value) { this.internal.MouseCursorScale = value; }
    get AntiAliasedLines() { return this.internal.AntiAliasedLines; }
    set AntiAliasedLines(value) { this.internal.AntiAliasedLines = value; }
    get AntiAliasedLinesUseTex() { return this.internal.AntiAliasedLinesUseTex; }
    set AntiAliasedLinesUseTex(value) { this.internal.AntiAliasedLinesUseTex = value; }
    get AntiAliasedFill() { return this.internal.AntiAliasedFill; }
    set AntiAliasedFill(value) { this.internal.AntiAliasedFill = value; }
    get CurveTessellationTol() { return this.internal.CurveTessellationTol; }
    set CurveTessellationTol(value) { this.internal.CurveTessellationTol = value; }
    get CircleSegmentMaxError() { return this.internal.CircleSegmentMaxError; }
    set CircleSegmentMaxError(value) { this.internal.CircleSegmentMaxError = value; }
    Copy(other) {
      this.Alpha = other.Alpha;
      this.WindowPadding.Copy(other.WindowPadding);
      this.WindowRounding = other.WindowRounding;
      this.WindowBorderSize = other.WindowBorderSize;
      this.WindowMinSize.Copy(other.WindowMinSize);
      this.WindowTitleAlign.Copy(other.WindowTitleAlign);
      this.WindowMenuButtonPosition = other.WindowMenuButtonPosition;
      this.ChildRounding = other.ChildRounding;
      this.ChildBorderSize = other.ChildBorderSize;
      this.PopupRounding = other.PopupRounding;
      this.PopupBorderSize = other.PopupBorderSize;
      this.FramePadding.Copy(other.FramePadding);
      this.FrameRounding = other.FrameRounding;
      this.FrameBorderSize = other.FrameBorderSize;
      this.ItemSpacing.Copy(other.ItemSpacing);
      this.ItemInnerSpacing.Copy(other.ItemInnerSpacing);
      this.CellPadding.Copy(other.CellPadding);
      this.TouchExtraPadding.Copy(other.TouchExtraPadding);
      this.IndentSpacing = other.IndentSpacing;
      this.ColumnsMinSpacing = other.ColumnsMinSpacing;
      this.ScrollbarSize = other.ScrollbarSize;
      this.ScrollbarRounding = other.ScrollbarRounding;
      this.GrabMinSize = other.GrabMinSize;
      this.GrabRounding = other.GrabRounding;
      this.LogSliderDeadzone = other.LogSliderDeadzone;
      this.TabRounding = other.TabRounding;
      this.TabBorderSize = other.TabBorderSize;
      this.TabMinWidthForCloseButton = other.TabMinWidthForCloseButton;
      this.ColorButtonPosition = other.ColorButtonPosition;
      this.ButtonTextAlign.Copy(other.ButtonTextAlign);
      this.DisplayWindowPadding.Copy(other.DisplayWindowPadding);
      this.DisplaySafeAreaPadding.Copy(other.DisplaySafeAreaPadding);
      this.MouseCursorScale = other.MouseCursorScale;
      this.AntiAliasedLines = other.AntiAliasedLines;
      this.AntiAliasedLinesUseTex = other.AntiAliasedLinesUseTex;
      this.AntiAliasedFill = other.AntiAliasedFill;
      this.CurveTessellationTol = other.CurveTessellationTol;
      this.CircleSegmentMaxError = other.CircleSegmentMaxError;
      for (let i = 0; i < exports.ImGuiCol.COUNT; ++i) {
        this.Colors[i].Copy(other.Colors[i]);
      }
      return this;
    }
    ScaleAllSizes(scale_factor) { this.internal.ScaleAllSizes(scale_factor); }
  }
  class ImGuiIO {
    constructor(native) {
      this.native = native;
      // int           KeyMap[ImGuiKey_COUNT];   // <unset>              // Map of indices into the KeysDown[512] entries array
      this.KeyMap = new Proxy([], {
        get: (target, key) => {
          if (key === "length") {
            return exports.Key.COUNT;
          }
          return this.native._getAt_KeyMap(Number(key));
        },
        set: (target, key, value) => {
          return this.native._setAt_KeyMap(Number(key), value);
        },
      });
      // bool        MouseDown[5];               // Mouse buttons: left, right, middle + extras. ImGui itself mostly only uses left button (BeginPopupContext** are using right button). Others buttons allows us to track if the mouse is being used by your application + available to user as a convenience via IsMouse** API.
      this.MouseDown = new Proxy([], {
        get: (target, key) => {
          if (key === "length") {
            return 5;
          }
          return this.native._getAt_MouseDown(Number(key));
        },
        set: (target, key, value) => {
          return this.native._setAt_MouseDown(Number(key), value);
        },
      });
      // bool        KeysDown[512];              // Keyboard keys that are pressed (in whatever storage order you naturally have access to keyboard data)
      this.KeysDown = new Proxy([], {
        get: (target, key) => {
          if (key === "length") {
            return 512;
          }
          return this.native._getAt_KeysDown(Number(key));
        },
        set: (target, key, value) => {
          return this.native._setAt_KeysDown(Number(key), value);
        },
      });
      // float       NavInputs[ImGuiNavInput_COUNT]; // Gamepad inputs (keyboard keys will be auto-mapped and be written here by ImGui::NewFrame)
      this.NavInputs = new Proxy([], {
        get: (target, key) => {
          if (key === "length") {
            return exports.NavInput.COUNT;
          }
          return this.native._getAt_NavInputs(Number(key));
        },
        set: (target, key, value) => {
          return this.native._setAt_NavInputs(Number(key), value);
        },
      });
      //------------------------------------------------------------------
      // [Internal] ImGui will maintain those fields. Forward compatibility not guaranteed!
      //------------------------------------------------------------------
      // ImGuiKeyModFlags KeyMods;                   // Key mods flags (same as io.KeyCtrl/KeyShift/KeyAlt/KeySuper but merged into flags), updated by NewFrame()
      // ImVec2      MousePosPrev;               // Previous mouse position temporary storage (nb: not for public use, set to MousePos in NewFrame())
      // ImVec2      MouseClickedPos[5];         // Position at time of clicking
      this.MouseClickedPos = new Proxy([], {
        get: (target, key) => {
          if (key === "length") {
            return 5;
          }
          return this.native._getAt_MouseClickedPos(Number(key));
        },
      });
      // float       MouseClickedTime[5];        // Time of last click (used to figure out double-click)
      // bool        MouseClicked[5];            // Mouse button went from !Down to Down
      // bool        MouseDoubleClicked[5];      // Has mouse button been double-clicked?
      // bool        MouseReleased[5];           // Mouse button went from Down to !Down
      // bool        MouseDownOwned[5];          // Track if button was clicked inside a window. We don't request mouse capture from the application if click started outside ImGui bounds.
      // float       MouseDownDuration[5];       // Duration the mouse button has been down (0.0f == just clicked)
      this.MouseDownDuration = new Proxy([], {
        get: (target, key) => {
          if (key === "length") {
            return 5;
          }
          return this.native._getAt_MouseDownDuration(Number(key));
        },
      });
      // float       MouseDownDurationPrev[5];   // Previous time the mouse button has been down
      // ImVec2      MouseDragMaxDistanceAbs[5]; // Maximum distance, absolute, on each axis, of how much mouse has traveled from the clicking point
      // float       MouseDragMaxDistanceSqr[5]; // Squared maximum distance of how much mouse has traveled from the clicking point
      // float       KeysDownDuration[512];      // Duration the keyboard key has been down (0.0f == just pressed)
      this.KeysDownDuration = new Proxy([], {
        get: (target, key) => {
          if (key === "length") {
            return 512;
          }
          return this.native._getAt_KeysDownDuration(Number(key));
        },
      });
      // float       KeysDownDurationPrev[512];  // Previous duration the key has been down
      // float       NavInputsDownDuration[ImGuiNavInput_COUNT];
      this.NavInputsDownDuration = new Proxy([], {
        get: (target, key) => {
          if (key === "length") {
            return exports.NavInput.COUNT;
          }
          return this.native._getAt_NavInputsDownDuration(Number(key));
        },
      });
    }
    //------------------------------------------------------------------
    // Settings (fill once)                 // Default value:
    //------------------------------------------------------------------
    // ImGuiConfigFlags   ConfigFlags;         // = 0                  // See ImGuiConfigFlags_ enum. Set by user/application. Gamepad/keyboard navigation options, etc.
    get ConfigFlags() { return this.native.ConfigFlags; }
    set ConfigFlags(value) { this.native.ConfigFlags = value; }
    // ImGuiBackendFlags  BackendFlags;        // = 0                  // Set ImGuiBackendFlags_ enum. Set by imgui_impl_xxx files or custom back-end to communicate features supported by the back-end.
    get BackendFlags() { return this.native.BackendFlags; }
    set BackendFlags(value) { this.native.BackendFlags = value; }
    // ImVec2        DisplaySize;              // <unset>              // Display size, in pixels. For clamping windows positions.
    get DisplaySize() { return this.native.DisplaySize; }
    // float         DeltaTime;                // = 1.0f/60.0f         // Time elapsed since last frame, in seconds.
    get DeltaTime() { return this.native.DeltaTime; }
    set DeltaTime(value) { this.native.DeltaTime = value; }
    // float         IniSavingRate;            // = 5.0f               // Maximum time between saving positions/sizes to .ini file, in seconds.
    get IniSavingRate() { return this.native.IniSavingRate; }
    set IniSavingRate(value) { this.native.IniSavingRate = value; }
    // const char*   IniFilename;              // = "imgui.ini"        // Path to .ini file. NULL to disable .ini saving.
    get IniFilename() { return this.native.IniFilename; }
    set IniFilename(value) { this.native.IniFilename = value; }
    // const char*   LogFilename;              // = "imgui_log.txt"    // Path to .log file (default parameter to ImGui::LogToFile when no file is specified).
    get LogFilename() { return this.native.LogFilename; }
    set LogFilename(value) { this.native.LogFilename = value; }
    // float         MouseDoubleClickTime;     // = 0.30f              // Time for a double-click, in seconds.
    get MouseDoubleClickTime() { return this.native.MouseDoubleClickTime; }
    set MouseDoubleClickTime(value) { this.native.MouseDoubleClickTime = value; }
    // float         MouseDoubleClickMaxDist;  // = 6.0f               // Distance threshold to stay in to validate a double-click, in pixels.
    get MouseDoubleClickMaxDist() { return this.native.MouseDoubleClickMaxDist; }
    set MouseDoubleClickMaxDist(value) { this.native.MouseDoubleClickMaxDist = value; }
    // float         MouseDragThreshold;       // = 6.0f               // Distance threshold before considering we are dragging
    get MouseDragThreshold() { return this.native.MouseDragThreshold; }
    set MouseDragThreshold(value) { this.native.MouseDragThreshold = value; }
    // float         KeyRepeatDelay;           // = 0.250f             // When holding a key/button, time before it starts repeating, in seconds (for buttons in Repeat mode, etc.).
    get KeyRepeatDelay() { return this.native.KeyRepeatDelay; }
    set KeyRepeatDelay(value) { this.native.KeyRepeatDelay = value; }
    // float         KeyRepeatRate;            // = 0.050f             // When holding a key/button, rate at which it repeats, in seconds.
    get KeyRepeatRate() { return this.native.KeyRepeatRate; }
    set KeyRepeatRate(value) { this.native.KeyRepeatRate = value; }
    // void*         UserData;                 // = NULL               // Store your own data for retrieval by callbacks.
    get UserData() { return this.native.UserData; }
    set UserData(value) { this.native.UserData = value; }
    // ImFontAtlas*  Fonts;                    // <auto>               // Load and assemble one or more fonts into a single tightly packed texture. Output to Fonts array.
    get Fonts() { return new ImFontAtlas(this.native.Fonts); }
    // float         FontGlobalScale;          // = 1.0f               // Global scale all fonts
    get FontGlobalScale() { return this.native.FontGlobalScale; }
    set FontGlobalScale(value) { this.native.FontGlobalScale = value; }
    // bool          FontAllowUserScaling;     // = false              // Allow user scaling text of individual window with CTRL+Wheel.
    get FontAllowUserScaling() { return this.native.FontAllowUserScaling; }
    set FontAllowUserScaling(value) { this.native.FontAllowUserScaling = value; }
    // ImFont*       FontDefault;              // = NULL               // Font to use on NewFrame(). Use NULL to uses Fonts->Fonts[0].
    get FontDefault() {
      const font = this.native.FontDefault;
      return (font === null) ? null : new ImFont(font);
    }
    set FontDefault(value) {
      this.native.FontDefault = value && value.native;
    }
    // ImVec2        DisplayFramebufferScale;  // = (1.0f,1.0f)        // For retina display or other situations where window coordinates are different from framebuffer coordinates. User storage only, presently not used by ImGui.
    get DisplayFramebufferScale() { return this.native.DisplayFramebufferScale; }
    // Miscellaneous configuration options
    // bool          OptMacOSXBehaviors;       // = defined(__APPLE__) // OS X style: Text editing cursor movement using Alt instead of Ctrl, Shortcuts using Cmd/Super instead of Ctrl, Line/Text Start and End using Cmd+Arrows instead of Home/End, Double click selects by word instead of selecting whole text, Multi-selection in lists uses Cmd/Super instead of Ctrl
    get ConfigMacOSXBehaviors() { return this.native.ConfigMacOSXBehaviors; }
    set ConfigMacOSXBehaviors(value) { this.native.ConfigMacOSXBehaviors = value; }
    // bool          ConfigInputTextCursorBlink;   // = true               // Enable blinking cursor, for users who consider it annoying.
    get ConfigInputTextCursorBlink() { return this.native.ConfigInputTextCursorBlink; }
    set ConfigInputTextCursorBlink(value) { this.native.ConfigInputTextCursorBlink = value; }
    // bool        ConfigDragClickToInputText;     // = false          // [BETA] Enable turning DragXXX widgets into text input with a simple mouse click-release (without moving). Not desirable on devices without a keyboard.
    get ConfigDragClickToInputText() { return this.native.ConfigDragClickToInputText; }
    set ConfigDragClickToInputText(value) { this.native.ConfigDragClickToInputText = value; }
    // bool          ConfigWindowsResizeFromEdges; // = false          // [BETA] Enable resizing of windows from their edges and from the lower-left corner. This requires (io.BackendFlags & ImGuiBackendFlags_HasMouseCursors) because it needs mouse cursor feedback. (This used to be the ImGuiWindowFlags_ResizeFromAnySide flag)
    get ConfigWindowsResizeFromEdges() { return this.native.ConfigWindowsResizeFromEdges; }
    set ConfigWindowsResizeFromEdges(value) { this.native.ConfigWindowsResizeFromEdges = value; }
    // bool        ConfigWindowsMoveFromTitleBarOnly;// = false        // [BETA] Set to true to only allow moving windows when clicked+dragged from the title bar. Windows without a title bar are not affected.
    get ConfigWindowsMoveFromTitleBarOnly() { return this.native.ConfigWindowsMoveFromTitleBarOnly; }
    set ConfigWindowsMoveFromTitleBarOnly(value) { this.native.ConfigWindowsMoveFromTitleBarOnly = value; }
    // float       ConfigMemoryCompactTimer;       // = 60.0f          // Timer (in seconds) to free transient windows/tables memory buffers when unused. Set to -1.0f to disable.
    get ConfigMemoryCompactTimer() { return this.native.ConfigMemoryCompactTimer; }
    set ConfigMemoryCompactTimer(value) { this.native.ConfigMemoryCompactTimer = value; }
    //------------------------------------------------------------------
    // Settings (User Functions)
    //------------------------------------------------------------------
    // Optional: Platform/Renderer back-end name (informational only! will be displayed in About Window) + User data for back-end/wrappers to store their own stuff.
    // const char* BackendPlatformName;            // = NULL
    get BackendPlatformName() { return this.native.BackendPlatformName; }
    set BackendPlatformName(value) { this.native.BackendPlatformName = value; }
    // const char* BackendRendererName;            // = NULL
    get BackendRendererName() { return this.native.BackendRendererName; }
    set BackendRendererName(value) { this.native.BackendRendererName = value; }
    // void*       BackendPlatformUserData;        // = NULL
    get BackendPlatformUserData() { return this.native.BackendPlatformUserData; }
    set BackendPlatformUserData(value) { this.native.BackendPlatformUserData = value; }
    // void*       BackendRendererUserData;        // = NULL
    get BackendRendererUserData() { return this.native.BackendRendererUserData; }
    set BackendRendererUserData(value) { this.native.BackendRendererUserData = value; }
    // void*       BackendLanguageUserData;        // = NULL
    get BackendLanguageUserData() { return this.native.BackendLanguageUserData; }
    set BackendLanguageUserData(value) { this.native.BackendLanguageUserData = value; }
    // Optional: access OS clipboard
    // (default to use native Win32 clipboard on Windows, otherwise uses a private clipboard. Override to access OS clipboard on other architectures)
    // const char* (*GetClipboardTextFn)(void* user_data);
    get GetClipboardTextFn() { return this.native.GetClipboardTextFn; }
    set GetClipboardTextFn(value) { this.native.GetClipboardTextFn = value; }
    // void        (*SetClipboardTextFn)(void* user_data, const char* text);
    get SetClipboardTextFn() { return this.native.SetClipboardTextFn; }
    set SetClipboardTextFn(value) { this.native.SetClipboardTextFn = value; }
    // void*       ClipboardUserData;
    get ClipboardUserData() { return this.native.ClipboardUserData; }
    set ClipboardUserData(value) { this.native.ClipboardUserData = value; }
    // Optional: override memory allocations. MemFreeFn() may be called with a NULL pointer.
    // (default to posix malloc/free)
    // void*       (*MemAllocFn)(size_t sz);
    // void        (*MemFreeFn)(void* ptr);
    // Optional: notify OS Input Method Editor of the screen position of your cursor for text input position (e.g. when using Japanese/Chinese IME in Windows)
    // (default to use native imm32 api on Windows)
    // void        (*ImeSetInputScreenPosFn)(int x, int y);
    // void*       ImeWindowHandle;            // (Windows) Set this to your HWND to get automatic IME cursor positioning.
    //------------------------------------------------------------------
    // Input - Fill before calling NewFrame()
    //------------------------------------------------------------------
    // ImVec2      MousePos;                   // Mouse position, in pixels. Set to ImVec2(-FLT_MAX,-FLT_MAX) if mouse is unavailable (on another screen, etc.)
    get MousePos() { return this.native.MousePos; }
    // float       MouseWheel;                 // Mouse wheel: 1 unit scrolls about 5 lines text.
    get MouseWheel() { return this.native.MouseWheel; }
    set MouseWheel(value) { this.native.MouseWheel = value; }
    // float       MouseWheelH;                    // Mouse wheel (Horizontal). Most users don't have a mouse with an horizontal wheel, may not be filled by all back-ends.
    get MouseWheelH() { return this.native.MouseWheelH; }
    set MouseWheelH(value) { this.native.MouseWheelH = value; }
    // bool        MouseDrawCursor;            // Request ImGui to draw a mouse cursor for you (if you are on a platform without a mouse cursor).
    get MouseDrawCursor() { return this.native.MouseDrawCursor; }
    set MouseDrawCursor(value) { this.native.MouseDrawCursor = value; }
    // bool        KeyCtrl;                    // Keyboard modifier pressed: Control
    get KeyCtrl() { return this.native.KeyCtrl; }
    set KeyCtrl(value) { this.native.KeyCtrl = value; }
    // bool        KeyShift;                   // Keyboard modifier pressed: Shift
    get KeyShift() { return this.native.KeyShift; }
    set KeyShift(value) { this.native.KeyShift = value; }
    // bool        KeyAlt;                     // Keyboard modifier pressed: Alt
    get KeyAlt() { return this.native.KeyAlt; }
    set KeyAlt(value) { this.native.KeyAlt = value; }
    // bool        KeySuper;                   // Keyboard modifier pressed: Cmd/Super/Windows
    get KeySuper() { return this.native.KeySuper; }
    set KeySuper(value) { this.native.KeySuper = value; }
    // Functions
    // IMGUI_API void AddInputCharacter(ImWchar c);                        // Add new character into InputCharacters[]
    AddInputCharacter(c) { this.native.AddInputCharacter(c); }
    // IMGUI_API void  AddInputCharacterUTF16(ImWchar16 c);        // Queue new character input from an UTF-16 character, it can be a surrogate
    AddInputCharacterUTF16(c) { this.native.AddInputCharacterUTF16(c); }
    // IMGUI_API void AddInputCharactersUTF8(const char* utf8_chars);      // Add new characters into InputCharacters[] from an UTF-8 string
    AddInputCharactersUTF8(utf8_chars) { this.native.AddInputCharactersUTF8(utf8_chars); }
    // inline void    ClearInputCharacters() { InputCharacters[0] = 0; }   // Clear the text input buffer manually
    ClearInputCharacters() { this.native.ClearInputCharacters(); }
    //------------------------------------------------------------------
    // Output - Retrieve after calling NewFrame()
    //------------------------------------------------------------------
    // bool        WantCaptureMouse;           // When io.WantCaptureMouse is true, do not dispatch mouse input data to your main application. This is set by ImGui when it wants to use your mouse (e.g. unclicked mouse is hovering a window, or a widget is active).
    get WantCaptureMouse() { return this.native.WantCaptureMouse; }
    set WantCaptureMouse(value) { this.native.WantCaptureMouse = value; }
    // bool        WantCaptureKeyboard;        // When io.WantCaptureKeyboard is true, do not dispatch keyboard input data to your main application. This is set by ImGui when it wants to use your keyboard inputs.
    get WantCaptureKeyboard() { return this.native.WantCaptureKeyboard; }
    set WantCaptureKeyboard(value) { this.native.WantCaptureKeyboard = value; }
    // bool        WantTextInput;              // Mobile/console: when io.WantTextInput is true, you may display an on-screen keyboard. This is set by ImGui when it wants textual keyboard input to happen (e.g. when a InputText widget is active).
    get WantTextInput() { return this.native.WantTextInput; }
    set WantTextInput(value) { this.native.WantTextInput = value; }
    // bool        WantSetMousePos;              // [BETA-NAV] MousePos has been altered, back-end should reposition mouse on next frame. Set only when 'NavMovesMouse=true'.
    get WantSetMousePos() { return this.native.WantSetMousePos; }
    set WantSetMousePos(value) { this.native.WantSetMousePos = value; }
    // bool        WantSaveIniSettings;        // When manual .ini load/save is active (io.IniFilename == NULL), this will be set to notify your application that you can call SaveIniSettingsToMemory() and save yourself. IMPORTANT: You need to clear io.WantSaveIniSettings yourself.
    get WantSaveIniSettings() { return this.native.WantSaveIniSettings; }
    set WantSaveIniSettings(value) { this.native.WantSaveIniSettings = value; }
    // bool        NavActive;                  // Directional navigation is currently allowed (will handle ImGuiKey_NavXXX events) = a window is focused and it doesn't use the ImGuiWindowFlags_NoNavInputs flag.
    get NavActive() { return this.native.NavActive; }
    set NavActive(value) { this.native.NavActive = value; }
    // bool        NavVisible;                 // Directional navigation is visible and allowed (will handle ImGuiKey_NavXXX events).
    get NavVisible() { return this.native.NavVisible; }
    set NavVisible(value) { this.native.NavVisible = value; }
    // float       Framerate;                  // Application framerate estimation, in frame per second. Solely for convenience. Rolling average estimation based on IO.DeltaTime over 120 frames
    get Framerate() { return this.native.Framerate; }
    // int         MetricsRenderVertices;      // Vertices output during last call to Render()
    get MetricsRenderVertices() { return this.native.MetricsRenderVertices; }
    // int         MetricsRenderIndices;       // Indices output during last call to Render() = number of triangles * 3
    get MetricsRenderIndices() { return this.native.MetricsRenderIndices; }
    // int         MetricsRenderWindows;       // Number of visible windows
    get MetricsRenderWindows() { return this.native.MetricsRenderWindows; }
    // int         MetricsActiveWindows;       // Number of visible root windows (exclude child windows)
    get MetricsActiveWindows() { return this.native.MetricsActiveWindows; }
    // int         MetricsActiveAllocations;   // Number of active allocations, updated by MemAlloc/MemFree based on current context. May be off if you have multiple imgui contexts.
    get MetricsActiveAllocations() { return this.native.MetricsActiveAllocations; }
    // ImVec2      MouseDelta;                 // Mouse delta. Note that this is zero if either current or previous position are invalid (-FLT_MAX,-FLT_MAX), so a disappearing/reappearing mouse won't have a huge delta.
    get MouseDelta() { return this.native.MouseDelta; }
  }
  // Context creation and access
  // Each context create its own ImFontAtlas by default. You may instance one yourself and pass it to CreateContext() to share a font atlas between imgui contexts.
  // None of those functions is reliant on the current context.
  // IMGUI_API ImGuiContext* CreateContext(ImFontAtlas* shared_font_atlas = NULL);
  // IMGUI_API void          DestroyContext(ImGuiContext* ctx = NULL);   // NULL = destroy current context
  // IMGUI_API ImGuiContext* GetCurrentContext();
  // IMGUI_API void          SetCurrentContext(ImGuiContext* ctx);
  class ImGuiContext {
    constructor(native) {
      this.native = native;
    }
    static getTexture(index) {
      if (ImGuiContext.current_ctx === null) {
        throw new Error();
      }
      return ImGuiContext.current_ctx._getTexture(index);
    }
    static setTexture(texture) {
      if (ImGuiContext.current_ctx === null) {
        throw new Error();
      }
      return ImGuiContext.current_ctx._setTexture(texture);
    }
    _getTexture(index) {
      return ImGuiContext.textures[index] || null;
    }
    _setTexture(texture) {
      let index = ImGuiContext.textures.indexOf(texture);
      if (index === -1) {
        for (let i = 0; i < ImGuiContext.textures.length; ++i) {
          if (ImGuiContext.textures[i] === null) {
            ImGuiContext.textures[i] = texture;
            return i;
          }
        }
        index = ImGuiContext.textures.length;
        ImGuiContext.textures.push(texture);
      }
      return index;
    }
  }
  ImGuiContext.current_ctx = null;
  ImGuiContext.textures = [];
  function CreateContext(shared_font_atlas = null) {
    const ctx = new ImGuiContext(exports.bind.CreateContext(shared_font_atlas !== null ? shared_font_atlas.native : null));
    if (ImGuiContext.current_ctx === null) {
      ImGuiContext.current_ctx = ctx;
    }
    return ctx;
  }
  function DestroyContext(ctx = null) {
    if (ctx === null) {
      ctx = ImGuiContext.current_ctx;
      ImGuiContext.current_ctx = null;
    }
    exports.bind.DestroyContext((ctx === null) ? null : ctx.native);
  }
  function GetCurrentContext() {
    // const ctx_native: Bind.ImGuiContext | null = bind.GetCurrentContext();
    return ImGuiContext.current_ctx;
  }
  function SetCurrentContext(ctx) {
    exports.bind.SetCurrentContext((ctx === null) ? null : ctx.native);
    ImGuiContext.current_ctx = ctx;
  }
  // Main
  // IMGUI_API ImGuiIO&      GetIO();                                    // access the IO structure (mouse/keyboard/gamepad inputs, time, various configuration options/flags)
  // IMGUI_API ImGuiStyle&   GetStyle();                                 // access the Style structure (colors, sizes). Always use PushStyleCol(), PushStyleVar() to modify style mid-frame!
  // IMGUI_API void          NewFrame();                                 // start a new Dear ImGui frame, you can submit any command from this point until Render()/EndFrame().
  // IMGUI_API void          EndFrame();                                 // ends the Dear ImGui frame. automatically called by Render(). If you don't need to render data (skipping rendering) you may call EndFrame() without Render()... but you'll have wasted CPU already! If you don't need to render, better to not create any windows and not call NewFrame() at all!
  // IMGUI_API void          Render();                                   // ends the Dear ImGui frame, finalize the draw data. You can then get call GetDrawData().
  // IMGUI_API ImDrawData*   GetDrawData();                              // valid after Render() and until the next call to NewFrame(). this is what you have to render.
  function GetIO() { return new ImGuiIO(exports.bind.GetIO()); }
  function GetStyle() { return new ImGuiStyle(exports.bind.GetStyle()); }
  function NewFrame() { exports.bind.NewFrame(); }
  function EndFrame() { exports.bind.EndFrame(); }
  function Render() { exports.bind.Render(); }
  function GetDrawData() {
    const draw_data = exports.bind.GetDrawData();
    return (draw_data === null) ? null : new ImDrawData(draw_data);
  }
  // Demo, Debug, Information
  // IMGUI_API void          ShowDemoWindow(bool* p_open = NULL);        // create Demo window. demonstrate most ImGui features. call this to learn about the library! try to make it always available in your application!
  // IMGUI_API void          ShowMetricsWindow(bool* p_open = NULL);     // create Metrics/Debugger window. display Dear ImGui internals: windows, draw commands, various internal state, etc.
  // IMGUI_API void          ShowAboutWindow(bool* p_open = NULL);       // create About window. display Dear ImGui version, credits and build/system information.
  // IMGUI_API void          ShowStyleEditor(ImGuiStyle* ref = NULL);    // add style editor block (not a window). you can pass in a reference ImGuiStyle structure to compare to, revert to and save to (else it uses the default style)
  // IMGUI_API bool          ShowStyleSelector(const char* label);       // add style selector block (not a window), essentially a combo listing the default styles.
  // IMGUI_API void          ShowFontSelector(const char* label);        // add font selector block (not a window), essentially a combo listing the loaded fonts.
  // IMGUI_API void          ShowUserGuide();                            // add basic help/info block (not a window): how to manipulate ImGui as a end-user (mouse/keyboard controls).
  // IMGUI_API const char*   GetVersion();                               // get the compiled version string e.g. "1.80 WIP" (essentially the value for IMGUI_VERSION from the compiled version of imgui.cpp)
  function ShowDemoWindow(p_open = null) { exports.bind.ShowDemoWindow(p_open); }
  function ShowMetricsWindow(p_open = null) {
    if (p_open === null) {
      exports.bind.ShowMetricsWindow(null);
    }
    else if (Array.isArray(p_open)) {
      exports.bind.ShowMetricsWindow(p_open);
    }
    else {
      const ref_open = [p_open()];
      exports.bind.ShowMetricsWindow(ref_open);
      p_open(ref_open[0]);
    }
  }
  function ShowAboutWindow(p_open = null) {
    if (p_open === null) {
      exports.bind.ShowAboutWindow(null);
    }
    else if (Array.isArray(p_open)) {
      exports.bind.ShowAboutWindow(p_open);
    }
    else {
      const ref_open = [p_open()];
      exports.bind.ShowAboutWindow(ref_open);
      p_open(ref_open[0]);
    }
  }
  function ShowStyleEditor(ref = null) {
    if (ref === null) {
      exports.bind.ShowStyleEditor(null);
    }
    else if (ref.internal instanceof exports.bind.ImGuiStyle) {
      exports.bind.ShowStyleEditor(ref.internal);
    }
    else {
      const native = new exports.bind.ImGuiStyle();
      const wrap = new ImGuiStyle(native);
      wrap.Copy(ref);
      exports.bind.ShowStyleEditor(native);
      ref.Copy(wrap);
      native.delete();
    }
  }
  function ShowStyleSelector(label) { return exports.bind.ShowStyleSelector(label); }
  function ShowFontSelector(label) { exports.bind.ShowFontSelector(label); }
  function ShowUserGuide() { exports.bind.ShowUserGuide(); }
  function GetVersion() { return exports.bind.GetVersion(); }
  // Styles
  // IMGUI_API void          StyleColorsDark(ImGuiStyle* dst = NULL);    // new, recommended style (default)
  // IMGUI_API void          StyleColorsLight(ImGuiStyle* dst = NULL);   // best used with borders and a custom, thicker font
  // IMGUI_API void          StyleColorsClassic(ImGuiStyle* dst = NULL); // classic imgui style
  function StyleColorsDark(dst = null) {
    if (dst === null) {
      exports.bind.StyleColorsDark(null);
    }
    else if (dst.internal instanceof exports.bind.ImGuiStyle) {
      exports.bind.StyleColorsDark(dst.internal);
    }
    else {
      const native = new exports.bind.ImGuiStyle();
      const wrap = new ImGuiStyle(native);
      wrap.Copy(dst);
      exports.bind.StyleColorsDark(native);
      dst.Copy(wrap);
      native.delete();
    }
  }
  function StyleColorsLight(dst = null) {
    if (dst === null) {
      exports.bind.StyleColorsLight(null);
    }
    else if (dst.internal instanceof exports.bind.ImGuiStyle) {
      exports.bind.StyleColorsLight(dst.internal);
    }
    else {
      const native = new exports.bind.ImGuiStyle();
      const wrap = new ImGuiStyle(native);
      wrap.Copy(dst);
      exports.bind.StyleColorsLight(native);
      dst.Copy(wrap);
      native.delete();
    }
  }
  function StyleColorsClassic(dst = null) {
    if (dst === null) {
      exports.bind.StyleColorsClassic(null);
    }
    else if (dst.internal instanceof exports.bind.ImGuiStyle) {
      exports.bind.StyleColorsClassic(dst.internal);
    }
    else {
      const native = new exports.bind.ImGuiStyle();
      const wrap = new ImGuiStyle(native);
      wrap.Copy(dst);
      exports.bind.StyleColorsClassic(native);
      dst.Copy(wrap);
      native.delete();
    }
  }
  // Windows
  // - Begin() = push window to the stack and start appending to it. End() = pop window from the stack.
  // - Passing 'bool* p_open != NULL' shows a window-closing widget in the upper-right corner of the window,
  //   which clicking will set the boolean to false when clicked.
  // - You may append multiple times to the same window during the same frame by calling Begin()/End() pairs multiple times.
  //   Some information such as 'flags' or 'p_open' will only be considered by the first call to Begin().
  // - Begin() return false to indicate the window is collapsed or fully clipped, so you may early out and omit submitting
  //   anything to the window. Always call a matching End() for each Begin() call, regardless of its return value!
  //   [Important: due to legacy reason, this is inconsistent with most other functions such as BeginMenu/EndMenu,
  //    BeginPopup/EndPopup, etc. where the EndXXX call should only be called if the corresponding BeginXXX function
  //    returned true. Begin and BeginChild are the only odd ones out. Will be fixed in a future update.]
  // - Note that the bottom of window stack always contains a window called "Debug".
  // IMGUI_API bool          Begin(const char* name, bool* p_open = NULL, ImGuiWindowFlags flags = 0);
  // IMGUI_API void          End();
  function Begin(name, open = null, flags = 0) {
    if (open === null) {
      return exports.bind.Begin(name, null, flags);
    }
    else if (Array.isArray(open)) {
      return exports.bind.Begin(name, open, flags);
    }
    else {
      const ref_open = [open()];
      const opened = exports.bind.Begin(name, ref_open, flags);
      open(ref_open[0]);
      return opened;
    }
  }
  function End() { exports.bind.End(); }
  // Child Windows
  // - Use child windows to begin into a self-contained independent scrolling/clipping regions within a host window. Child windows can embed their own child.
  // - For each independent axis of 'size': ==0.0f: use remaining host window size / >0.0f: fixed size / <0.0f: use remaining window size minus abs(size) / Each axis can use a different mode, e.g. ImVec2(0,400).
  // - BeginChild() returns false to indicate the window is collapsed or fully clipped, so you may early out and omit submitting anything to the window.
  //   Always call a matching EndChild() for each BeginChild() call, regardless of its return value.
  //   [Important: due to legacy reason, this is inconsistent with most other functions such as BeginMenu/EndMenu,
  //    BeginPopup/EndPopup, etc. where the EndXXX call should only be called if the corresponding BeginXXX function
  //    returned true. Begin and BeginChild are the only odd ones out. Will be fixed in a future update.]
  // IMGUI_API bool          BeginChild(const char* str_id, const ImVec2& size = ImVec2(0, 0), bool border = false, ImGuiWindowFlags flags = 0);
  // IMGUI_API bool          BeginChild(ImGuiID id, const ImVec2& size = ImVec2(0, 0), bool border = false, ImGuiWindowFlags flags = 0);
  // IMGUI_API void          EndChild();
  function BeginChild(id, size = ImVec2.ZERO, border = false, flags = 0) {
    return exports.bind.BeginChild(id, size, border, flags);
  }
  function EndChild() { exports.bind.EndChild(); }
  // Windows Utilities
  // - 'current window' = the window we are appending into while inside a Begin()/End() block. 'next window' = next window we will Begin() into.
  // IMGUI_API bool          IsWindowAppearing();
  // IMGUI_API bool          IsWindowCollapsed();
  // IMGUI_API bool          IsWindowFocused(ImGuiFocusedFlags flags=0); // is current window focused? or its root/child, depending on flags. see flags for options.
  // IMGUI_API bool          IsWindowHovered(ImGuiHoveredFlags flags=0); // is current window hovered (and typically: not blocked by a popup/modal)? see flags for options. NB: If you are trying to check whether your mouse should be dispatched to imgui or to your app, you should use the 'io.WantCaptureMouse' boolean for that! Please read the FAQ!
  // IMGUI_API ImDrawList*   GetWindowDrawList();                        // get draw list associated to the current window, to append your own drawing primitives
  // IMGUI_API ImVec2        GetWindowPos();                             // get current window position in screen space (useful if you want to do your own drawing via the DrawList API)
  // IMGUI_API ImVec2        GetWindowSize();                            // get current window size
  // IMGUI_API float         GetWindowWidth();                           // get current window width (shortcut for GetWindowSize().x)
  // IMGUI_API float         GetWindowHeight();                          // get current window height (shortcut for GetWindowSize().y)
  function IsWindowAppearing() { return exports.bind.IsWindowAppearing(); }
  function IsWindowCollapsed() { return exports.bind.IsWindowCollapsed(); }
  function IsWindowFocused(flags = 0) { return exports.bind.IsWindowFocused(flags); }
  function IsWindowHovered(flags = 0) { return exports.bind.IsWindowHovered(flags); }
  function GetWindowDrawList() { return new ImDrawList(exports.bind.GetWindowDrawList()); }
  function GetWindowPos(out = new ImVec2()) { return exports.bind.GetWindowPos(out); }
  function GetWindowSize(out = new ImVec2()) { return exports.bind.GetWindowSize(out); }
  function GetWindowWidth() { return exports.bind.GetWindowWidth(); }
  function GetWindowHeight() { return exports.bind.GetWindowHeight(); }
  // Prefer using SetNextXXX functions (before Begin) rather that SetXXX functions (after Begin).
  // IMGUI_API void          SetNextWindowPos(const ImVec2& pos, ImGuiCond cond = 0, const ImVec2& pivot = ImVec2(0, 0)); // set next window position. call before Begin(). use pivot=(0.5f,0.5f) to center on given point, etc.
  // IMGUI_API void          SetNextWindowSize(const ImVec2& size, ImGuiCond cond = 0);                  // set next window size. set axis to 0.0f to force an auto-fit on this axis. call before Begin()
  // IMGUI_API void          SetNextWindowSizeConstraints(const ImVec2& size_min, const ImVec2& size_max, ImGuiSizeCallback custom_callback = NULL, void* custom_callback_data = NULL); // set next window size limits. use -1,-1 on either X/Y axis to preserve the current size. Sizes will be rounded down. Use callback to apply non-trivial programmatic constraints.
  // IMGUI_API void          SetNextWindowContentSize(const ImVec2& size);                               // set next window content size (~ scrollable client area, which enforce the range of scrollbars). Not including window decorations (title bar, menu bar, etc.) nor WindowPadding. set an axis to 0.0f to leave it automatic. call before Begin()
  // IMGUI_API void          SetNextWindowCollapsed(bool collapsed, ImGuiCond cond = 0);                 // set next window collapsed state. call before Begin()
  // IMGUI_API void          SetNextWindowFocus();                                                       // set next window to be focused / top-most. call before Begin()
  // IMGUI_API void          SetNextWindowBgAlpha(float alpha);                                          // set next window background color alpha. helper to easily override the Alpha component of ImGuiCol_WindowBg/ChildBg/PopupBg. you may also use ImGuiWindowFlags_NoBackground.
  // IMGUI_API void          SetWindowPos(const ImVec2& pos, ImGuiCond cond = 0);                        // (not recommended) set current window position - call within Begin()/End(). prefer using SetNextWindowPos(), as this may incur tearing and side-effects.
  // IMGUI_API void          SetWindowSize(const ImVec2& size, ImGuiCond cond = 0);                      // (not recommended) set current window size - call within Begin()/End(). set to ImVec2(0, 0) to force an auto-fit. prefer using SetNextWindowSize(), as this may incur tearing and minor side-effects.
  // IMGUI_API void          SetWindowCollapsed(bool collapsed, ImGuiCond cond = 0);                     // (not recommended) set current window collapsed state. prefer using SetNextWindowCollapsed().
  // IMGUI_API void          SetWindowFocus();                                                           // (not recommended) set current window to be focused / top-most. prefer using SetNextWindowFocus().
  // IMGUI_API void          SetWindowFontScale(float scale);                                            // set font scale. Adjust IO.FontGlobalScale if you want to scale all windows. This is an old API! For correct scaling, prefer to reload font + rebuild ImFontAtlas + call style.ScaleAllSizes().
  // IMGUI_API void          SetWindowPos(const char* name, const ImVec2& pos, ImGuiCond cond = 0);      // set named window position.
  // IMGUI_API void          SetWindowSize(const char* name, const ImVec2& size, ImGuiCond cond = 0);    // set named window size. set axis to 0.0f to force an auto-fit on this axis.
  // IMGUI_API void          SetWindowCollapsed(const char* name, bool collapsed, ImGuiCond cond = 0);   // set named window collapsed state
  // IMGUI_API void          SetWindowFocus(const char* name);                                           // set named window to be focused / top-most. use NULL to remove focus.
  function SetNextWindowPos(pos, cond = 0, pivot = ImVec2.ZERO) { exports.bind.SetNextWindowPos(pos, cond, pivot); }
  function SetNextWindowSize(pos, cond = 0) { exports.bind.SetNextWindowSize(pos, cond); }
  function SetNextWindowSizeConstraints(size_min, size_max, custom_callback = null, custom_callback_data = null) {
    if (custom_callback) {
      exports.bind.SetNextWindowSizeConstraints(size_min, size_max, (data) => {
        custom_callback(new ImGuiSizeCallbackData(data, custom_callback_data));
      }, null);
    }
    else {
      exports.bind.SetNextWindowSizeConstraints(size_min, size_max, null, null);
    }
  }
  function SetNextWindowContentSize(size) { exports.bind.SetNextWindowContentSize(size); }
  function SetNextWindowCollapsed(collapsed, cond = 0) { exports.bind.SetNextWindowCollapsed(collapsed, cond); }
  function SetNextWindowFocus() { exports.bind.SetNextWindowFocus(); }
  function SetNextWindowBgAlpha(alpha) { exports.bind.SetNextWindowBgAlpha(alpha); }
  function SetWindowPos(name_or_pos, pos_or_cond = 0, cond = 0) {
    if (typeof (name_or_pos) === "string") {
      exports.bind.SetWindowNamePos(name_or_pos, pos_or_cond, cond);
      return;
    }
    else {
      exports.bind.SetWindowPos(name_or_pos, pos_or_cond);
    }
  }
  function SetWindowSize(name_or_size, size_or_cond = 0, cond = 0) {
    if (typeof (name_or_size) === "string") {
      exports.bind.SetWindowNamePos(name_or_size, size_or_cond, cond);
    }
    else {
      exports.bind.SetWindowSize(name_or_size, size_or_cond);
    }
  }
  function SetWindowCollapsed(name_or_collapsed, collapsed_or_cond = 0, cond = 0) {
    if (typeof (name_or_collapsed) === "string") {
      exports.bind.SetWindowNameCollapsed(name_or_collapsed, collapsed_or_cond, cond);
    }
    else {
      exports.bind.SetWindowCollapsed(name_or_collapsed, collapsed_or_cond);
    }
  }
  function SetWindowFocus(name) {
    if (typeof (name) === "string") {
      exports.bind.SetWindowNameFocus(name);
    }
    else {
      exports.bind.SetWindowFocus();
    }
  }
  function SetWindowFontScale(scale) { exports.bind.SetWindowFontScale(scale); }
  // Content region
  // - Retrieve available space from a given point. GetContentRegionAvail() is frequently useful.
  // - Those functions are bound to be redesigned (they are confusing, incomplete and the Min/Max return values are in local window coordinates which increases confusion)
  // IMGUI_API ImVec2        GetContentRegionAvail();                                        // == GetContentRegionMax() - GetCursorPos()
  // IMGUI_API ImVec2        GetContentRegionMax();                                          // current content boundaries (typically window boundaries including scrolling, or current column boundaries), in windows coordinates
  // IMGUI_API ImVec2        GetWindowContentRegionMin();                                    // content boundaries min (roughly (0,0)-Scroll), in window coordinates
  // IMGUI_API ImVec2        GetWindowContentRegionMax();                                    // content boundaries max (roughly (0,0)+Size-Scroll) where Size can be override with SetNextWindowContentSize(), in window coordinates
  // IMGUI_API float         GetWindowContentRegionWidth();                                  //
  function GetContentRegionAvail(out = new ImVec2()) { return exports.bind.GetContentRegionAvail(out); }
  function GetContentRegionMax(out = new ImVec2()) { return exports.bind.GetContentRegionMax(out); }
  function GetWindowContentRegionMin(out = new ImVec2()) { return exports.bind.GetWindowContentRegionMin(out); }
  function GetWindowContentRegionMax(out = new ImVec2()) { return exports.bind.GetWindowContentRegionMax(out); }
  function GetWindowContentRegionWidth() { return exports.bind.GetWindowContentRegionWidth(); }
  // Windows Scrolling
  // IMGUI_API float         GetScrollX();                                                   // get scrolling amount [0 .. GetScrollMaxX()]
  // IMGUI_API float         GetScrollY();                                                   // get scrolling amount [0 .. GetScrollMaxY()]
  // IMGUI_API void          SetScrollX(float scroll_x);                                     // set scrolling amount [0 .. GetScrollMaxX()]
  // IMGUI_API void          SetScrollY(float scroll_y);                                     // set scrolling amount [0 .. GetScrollMaxY()]
  // IMGUI_API float         GetScrollMaxX();                                                // get maximum scrolling amount ~~ ContentSize.x - WindowSize.x - DecorationsSize.x
  // IMGUI_API float         GetScrollMaxY();                                                // get maximum scrolling amount ~~ ContentSize.y - WindowSize.y - DecorationsSize.y
  // IMGUI_API void          SetScrollHereX(float center_x_ratio = 0.5f);                    // adjust scrolling amount to make current cursor position visible. center_x_ratio=0.0: left, 0.5: center, 1.0: right. When using to make a "default/current item" visible, consider using SetItemDefaultFocus() instead.
  // IMGUI_API void          SetScrollHereY(float center_y_ratio = 0.5f);                    // adjust scrolling amount to make current cursor position visible. center_y_ratio=0.0: top, 0.5: center, 1.0: bottom. When using to make a "default/current item" visible, consider using SetItemDefaultFocus() instead.
  // IMGUI_API void          SetScrollFromPosX(float local_x, float center_x_ratio = 0.5f);  // adjust scrolling amount to make given position visible. Generally GetCursorStartPos() + offset to compute a valid position.
  // IMGUI_API void          SetScrollFromPosY(float local_y, float center_y_ratio = 0.5f);  // adjust scrolling amount to make given position visible. Generally GetCursorStartPos() + offset to compute a valid position.
  function GetScrollX() { return exports.bind.GetScrollX(); }
  function GetScrollY() { return exports.bind.GetScrollY(); }
  function SetScrollX(scroll_x) { exports.bind.SetScrollX(scroll_x); }
  function SetScrollY(scroll_y) { exports.bind.SetScrollY(scroll_y); }
  function GetScrollMaxX() { return exports.bind.GetScrollMaxX(); }
  function GetScrollMaxY() { return exports.bind.GetScrollMaxY(); }
  function SetScrollHereX(center_x_ratio = 0.5) { exports.bind.SetScrollHereX(center_x_ratio); }
  function SetScrollHereY(center_y_ratio = 0.5) { exports.bind.SetScrollHereY(center_y_ratio); }
  function SetScrollFromPosX(pos_x, center_x_ratio = 0.5) { exports.bind.SetScrollFromPosX(pos_x, center_x_ratio); }
  function SetScrollFromPosY(pos_y, center_y_ratio = 0.5) { exports.bind.SetScrollFromPosY(pos_y, center_y_ratio); }
  // Parameters stacks (shared)
  // IMGUI_API void          PushFont(ImFont* font);                                         // use NULL as a shortcut to push default font
  // IMGUI_API void          PopFont();
  // IMGUI_API void          PushStyleColor(ImGuiCol idx, ImU32 col);                        // modify a style color. always use this if you modify the style after NewFrame().
  // IMGUI_API void          PushStyleColor(ImGuiCol idx, const ImVec4& col);
  // IMGUI_API void          PopStyleColor(int count = 1);
  // IMGUI_API void          PushStyleVar(ImGuiStyleVar idx, float val);                     // modify a style float variable. always use this if you modify the style after NewFrame().
  // IMGUI_API void          PushStyleVar(ImGuiStyleVar idx, const ImVec2& val);             // modify a style ImVec2 variable. always use this if you modify the style after NewFrame().
  // IMGUI_API void          PopStyleVar(int count = 1);
  // IMGUI_API void          PushAllowKeyboardFocus(bool allow_keyboard_focus);              // allow focusing using TAB/Shift-TAB, enabled by default but you can disable it for certain widgets
  // IMGUI_API void          PopAllowKeyboardFocus();
  // IMGUI_API void          PushButtonRepeat(bool repeat);                                  // in 'repeat' mode, Button*() functions return repeated true in a typematic manner (using io.KeyRepeatDelay/io.KeyRepeatRate setting). Note that you can call IsItemActive() after any Button() to tell if the button is held in the current frame.
  // IMGUI_API void          PopButtonRepeat();
  function PushFont(font) { exports.bind.PushFont(font ? font.native : null); }
  function PopFont() { exports.bind.PopFont(); }
  function PushStyleColor(idx, col) {
    if (col instanceof ImColor) {
      exports.bind.PushStyleColor(idx, col.Value);
    }
    else {
      exports.bind.PushStyleColor(idx, col);
    }
  }
  function PopStyleColor(count = 1) { exports.bind.PopStyleColor(count); }
  function PushStyleVar(idx, val) { exports.bind.PushStyleVar(idx, val); }
  function PopStyleVar(count = 1) { exports.bind.PopStyleVar(count); }
  function PushAllowKeyboardFocus(allow_keyboard_focus) { exports.bind.PushAllowKeyboardFocus(allow_keyboard_focus); }
  function PopAllowKeyboardFocus() { exports.bind.PopAllowKeyboardFocus(); }
  function PushButtonRepeat(repeat) { exports.bind.PushButtonRepeat(repeat); }
  function PopButtonRepeat() { exports.bind.PopButtonRepeat(); }
  // Parameters stacks (current window)
  // IMGUI_API void          PushItemWidth(float item_width);                                // push width of items for common large "item+label" widgets. >0.0f: width in pixels, <0.0f align xx pixels to the right of window (so -FLT_MIN always align width to the right side). 0.0f = default to ~2/3 of windows width,
  // IMGUI_API void          PopItemWidth();
  // IMGUI_API void          SetNextItemWidth(float item_width);                             // set width of the _next_ common large "item+label" widget. >0.0f: width in pixels, <0.0f align xx pixels to the right of window (so -FLT_MIN always align width to the right side)
  // IMGUI_API float         CalcItemWidth();                                                // width of item given pushed settings and current cursor position. NOT necessarily the width of last item unlike most 'Item' functions.
  // IMGUI_API void          PushTextWrapPos(float wrap_local_pos_x = 0.0f);                 // push word-wrapping position for Text*() commands. < 0.0f: no wrapping; 0.0f: wrap to end of window (or column); > 0.0f: wrap at 'wrap_pos_x' position in window local space
  // IMGUI_API void          PopTextWrapPos();
  function PushItemWidth(item_width) { exports.bind.PushItemWidth(item_width); }
  function PopItemWidth() { exports.bind.PopItemWidth(); }
  function SetNextItemWidth(item_width) { exports.bind.SetNextItemWidth(item_width); } // set width of the _next_ common large "item+label" widget. >0.0f: width in pixels, <0.0f align xx pixels to the right of window (so -1.0f always align width to the right side)
  function CalcItemWidth() { return exports.bind.CalcItemWidth(); }
  function PushTextWrapPos(wrap_pos_x = 0.0) { exports.bind.PushTextWrapPos(wrap_pos_x); }
  function PopTextWrapPos() { exports.bind.PopTextWrapPos(); }
  // Style read access
  // IMGUI_API ImFont*       GetFont();                                                      // get current font
  // IMGUI_API float         GetFontSize();                                                  // get current font size (= height in pixels) of current font with current scale applied
  // IMGUI_API ImVec2        GetFontTexUvWhitePixel();                                       // get UV coordinate for a while pixel, useful to draw custom shapes via the ImDrawList API
  // IMGUI_API ImU32         GetColorU32(ImGuiCol idx, float alpha_mul = 1.0f);              // retrieve given style color with style alpha applied and optional extra alpha multiplier, packed as a 32-bit value suitable for ImDrawList
  // IMGUI_API ImU32         GetColorU32(const ImVec4& col);                                 // retrieve given color with style alpha applied, packed as a 32-bit value suitable for ImDrawList
  // IMGUI_API ImU32         GetColorU32(ImU32 col);                                         // retrieve given color with style alpha applied, packed as a 32-bit value suitable for ImDrawList
  // IMGUI_API const ImVec4& GetStyleColorVec4(ImGuiCol idx);                                // retrieve style color as stored in ImGuiStyle structure. use to feed back into PushStyleColor(), otherwise use GetColorU32() to get style color with style alpha baked in.
  function GetFont() { return new ImFont(exports.bind.GetFont()); }
  function GetFontSize() { return exports.bind.GetFontSize(); }
  function GetFontTexUvWhitePixel(out = new ImVec2()) { return exports.bind.GetFontTexUvWhitePixel(out); }
  function GetColorU32(...args) {
    if (args.length === 1) {
      if (typeof (args[0]) === "number") {
        if (0 <= args[0] && args[0] < exports.ImGuiCol.COUNT) {
          const idx = args[0];
          return exports.bind.GetColorU32_A(idx, 1.0);
        }
        else {
          const col = args[0];
          return exports.bind.GetColorU32_C(col);
        }
      }
      else {
        const col = args[0];
        return exports.bind.GetColorU32_B(col);
      }
    }
    else {
      const idx = args[0];
      const alpha_mul = args[1];
      return exports.bind.GetColorU32_A(idx, alpha_mul);
    }
  }
  function GetStyleColorVec4(idx) { return exports.bind.GetStyleColorVec4(idx); }
  // Cursor / Layout
  // - By "cursor" we mean the current output position.
  // - The typical widget behavior is to output themselves at the current cursor position, then move the cursor one line down.
  // - You can call SameLine() between widgets to undo the last carriage return and output at the right of the preceding widget.
  // - Attention! We currently have inconsistencies between window-local and absolute positions we will aim to fix with future API:
  //    Window-local coordinates:   SameLine(), GetCursorPos(), SetCursorPos(), GetCursorStartPos(), GetContentRegionMax(), GetWindowContentRegion*(), PushTextWrapPos()
  //    Absolute coordinate:        GetCursorScreenPos(), SetCursorScreenPos(), all ImDrawList:: functions.
  // IMGUI_API void          Separator();                                                    // separator, generally horizontal. inside a menu bar or in horizontal layout mode, this becomes a vertical separator.
  // IMGUI_API void          SameLine(float offset_from_start_x=0.0f, float spacing=-1.0f);  // call between widgets or groups to layout them horizontally. X position given in window coordinates.
  // IMGUI_API void          NewLine();                                                      // undo a SameLine() or force a new line when in an horizontal-layout context.
  // IMGUI_API void          Spacing();                                                      // add vertical spacing.
  // IMGUI_API void          Dummy(const ImVec2& size);                                      // add a dummy item of given size. unlike InvisibleButton(), Dummy() won't take the mouse click or be navigable into.
  // IMGUI_API void          Indent(float indent_w = 0.0f);                                  // move content position toward the right, by indent_w, or style.IndentSpacing if indent_w <= 0
  // IMGUI_API void          Unindent(float indent_w = 0.0f);                                // move content position back to the left, by indent_w, or style.IndentSpacing if indent_w <= 0
  // IMGUI_API void          BeginGroup();                                                   // lock horizontal starting position
  // IMGUI_API void          EndGroup();                                                     // unlock horizontal starting position + capture the whole group bounding box into one "item" (so you can use IsItemHovered() or layout primitives such as SameLine() on whole group, etc.)
  // IMGUI_API ImVec2        GetCursorPos();                                                 // cursor position in window coordinates (relative to window position)
  // IMGUI_API float         GetCursorPosX();                                                //   (some functions are using window-relative coordinates, such as: GetCursorPos, GetCursorStartPos, GetContentRegionMax, GetWindowContentRegion* etc.
  // IMGUI_API float         GetCursorPosY();                                                //    other functions such as GetCursorScreenPos or everything in ImDrawList::
  // IMGUI_API void          SetCursorPos(const ImVec2& local_pos);                          //    are using the main, absolute coordinate system.
  // IMGUI_API void          SetCursorPosX(float local_x);                                   //    GetWindowPos() + GetCursorPos() == GetCursorScreenPos() etc.)
  // IMGUI_API void          SetCursorPosY(float local_y);                                   //
  // IMGUI_API ImVec2        GetCursorStartPos();                                            // initial cursor position in window coordinates
  // IMGUI_API ImVec2        GetCursorScreenPos();                                           // cursor position in absolute screen coordinates [0..io.DisplaySize] (useful to work with ImDrawList API)
  // IMGUI_API void          SetCursorScreenPos(const ImVec2& pos);                          // cursor position in absolute screen coordinates [0..io.DisplaySize]
  // IMGUI_API void          AlignTextToFramePadding();                                      // vertically align upcoming text baseline to FramePadding.y so that it will align properly to regularly framed items (call if you have text on a line before a framed item)
  // IMGUI_API float         GetTextLineHeight();                                            // ~ FontSize
  // IMGUI_API float         GetTextLineHeightWithSpacing();                                 // ~ FontSize + style.ItemSpacing.y (distance in pixels between 2 consecutive lines of text)
  // IMGUI_API float         GetFrameHeight();                                               // ~ FontSize + style.FramePadding.y * 2
  // IMGUI_API float         GetFrameHeightWithSpacing();                                    // ~ FontSize + style.FramePadding.y * 2 + style.ItemSpacing.y (distance in pixels between 2 consecutive lines of framed widgets)
  function Separator() { exports.bind.Separator(); }
  function SameLine(pos_x = 0.0, spacing_w = -1.0) { exports.bind.SameLine(pos_x, spacing_w); }
  function NewLine() { exports.bind.NewLine(); }
  function Spacing() { exports.bind.Spacing(); }
  function Dummy(size) { exports.bind.Dummy(size); }
  function Indent(indent_w = 0.0) { exports.bind.Indent(indent_w); }
  function Unindent(indent_w = 0.0) { exports.bind.Unindent(indent_w); }
  function BeginGroup() { exports.bind.BeginGroup(); }
  function EndGroup() { exports.bind.EndGroup(); }
  function GetCursorPos(out = new ImVec2()) { return exports.bind.GetCursorPos(out); }
  function GetCursorPosX() { return exports.bind.GetCursorPosX(); }
  function GetCursorPosY() { return exports.bind.GetCursorPosY(); }
  function SetCursorPos(local_pos) { exports.bind.SetCursorPos(local_pos); }
  function SetCursorPosX(x) { exports.bind.SetCursorPosX(x); }
  function SetCursorPosY(y) { exports.bind.SetCursorPosY(y); }
  function GetCursorStartPos(out = new ImVec2()) { return exports.bind.GetCursorStartPos(out); }
  function GetCursorScreenPos(out = new ImVec2()) { return exports.bind.GetCursorScreenPos(out); }
  function SetCursorScreenPos(pos) { exports.bind.SetCursorScreenPos(pos); }
  function AlignTextToFramePadding() { exports.bind.AlignTextToFramePadding(); }
  function GetTextLineHeight() { return exports.bind.GetTextLineHeight(); }
  function GetTextLineHeightWithSpacing() { return exports.bind.GetTextLineHeightWithSpacing(); }
  function GetFrameHeight() { return exports.bind.GetFrameHeight(); }
  function GetFrameHeightWithSpacing() { return exports.bind.GetFrameHeightWithSpacing(); }
  // ID stack/scopes
  // - Read the FAQ for more details about how ID are handled in dear imgui. If you are creating widgets in a loop you most
  //   likely want to push a unique identifier (e.g. object pointer, loop index) to uniquely differentiate them.
  // - The resulting ID are hashes of the entire stack.
  // - You can also use the "Label##foobar" syntax within widget label to distinguish them from each others.
  // - In this header file we use the "label"/"name" terminology to denote a string that will be displayed and used as an ID,
  //   whereas "str_id" denote a string that is only used as an ID and not normally displayed.
  // IMGUI_API void          PushID(const char* str_id);                                     // push string into the ID stack (will hash string).
  // IMGUI_API void          PushID(const char* str_id_begin, const char* str_id_end);       // push string into the ID stack (will hash string).
  // IMGUI_API void          PushID(const void* ptr_id);                                     // push pointer into the ID stack (will hash pointer).
  // IMGUI_API void          PushID(int int_id);                                             // push integer into the ID stack (will hash integer).
  // IMGUI_API void          PopID();                                                        // pop from the ID stack.
  // IMGUI_API ImGuiID       GetID(const char* str_id);                                      // calculate unique ID (hash of whole ID stack + given parameter). e.g. if you want to query into ImGuiStorage yourself
  // IMGUI_API ImGuiID       GetID(const char* str_id_begin, const char* str_id_end);
  // IMGUI_API ImGuiID       GetID(const void* ptr_id);
  function PushID(id) { exports.bind.PushID(id); }
  function PopID() { exports.bind.PopID(); }
  function GetID(id) { return exports.bind.GetID(id); }
  // Widgets: Text
  // IMGUI_API void          TextUnformatted(const char* text, const char* text_end = NULL); // raw text without formatting. Roughly equivalent to Text("%s", text) but: A) doesn't require null terminated string if 'text_end' is specified, B) it's faster, no memory copy is done, no buffer size limits, recommended for long chunks of text.
  // IMGUI_API void          Text(const char* fmt, ...)                                      IM_FMTARGS(1); // formatted text
  // IMGUI_API void          TextV(const char* fmt, va_list args)                            IM_FMTLIST(1);
  // IMGUI_API void          TextColored(const ImVec4& col, const char* fmt, ...)            IM_FMTARGS(2); // shortcut for PushStyleColor(ImGuiCol_Text, col); Text(fmt, ...); PopStyleColor();
  // IMGUI_API void          TextColoredV(const ImVec4& col, const char* fmt, va_list args)  IM_FMTLIST(2);
  // IMGUI_API void          TextDisabled(const char* fmt, ...)                              IM_FMTARGS(1); // shortcut for PushStyleColor(ImGuiCol_Text, style.Colors[ImGuiCol_TextDisabled]); Text(fmt, ...); PopStyleColor();
  // IMGUI_API void          TextDisabledV(const char* fmt, va_list args)                    IM_FMTLIST(1);
  // IMGUI_API void          TextWrapped(const char* fmt, ...)                               IM_FMTARGS(1); // shortcut for PushTextWrapPos(0.0f); Text(fmt, ...); PopTextWrapPos();. Note that this won't work on an auto-resizing window if there's no other widgets to extend the window width, yoy may need to set a size using SetNextWindowSize().
  // IMGUI_API void          TextWrappedV(const char* fmt, va_list args)                     IM_FMTLIST(1);
  // IMGUI_API void          LabelText(const char* label, const char* fmt, ...)              IM_FMTARGS(2); // display text+label aligned the same way as value+label widgets
  // IMGUI_API void          LabelTextV(const char* label, const char* fmt, va_list args)    IM_FMTLIST(2);
  // IMGUI_API void          BulletText(const char* fmt, ...)                                IM_FMTARGS(1); // shortcut for Bullet()+Text()
  // IMGUI_API void          BulletTextV(const char* fmt, va_list args)                      IM_FMTLIST(1);
  function TextUnformatted(text, text_end = null) { exports.bind.TextUnformatted(text_end !== null ? text.substring(0, text_end) : text); }
  function Text(text) { exports.bind.Text(text); }
  function TextColored(col, text) { exports.bind.TextColored((col instanceof ImColor) ? col.Value : col, text); }
  function TextDisabled(text) { exports.bind.TextDisabled(text); }
  function TextWrapped(text) { exports.bind.TextWrapped(text); }
  function LabelText(label, text) { exports.bind.LabelText(label, text); }
  function BulletText(text) { exports.bind.BulletText(text); }
  // Widgets: Main
  // - Most widgets return true when the value has been changed or when pressed/selected
  // - You may also use one of the many IsItemXXX functions (e.g. IsItemActive, IsItemHovered, etc.) to query widget state.
  // IMGUI_API bool          Button(const char* label, const ImVec2& size = ImVec2(0, 0));   // button
  // IMGUI_API bool          SmallButton(const char* label);                                 // button with FramePadding=(0,0) to easily embed within text
  // IMGUI_API bool          InvisibleButton(const char* str_id, const ImVec2& size, ImGuiButtonFlags flags = 0); // flexible button behavior without the visuals, frequently useful to build custom behaviors using the public api (along with IsItemActive, IsItemHovered, etc.)
  // IMGUI_API bool          ArrowButton(const char* str_id, ImGuiDir dir);                  // square button with an arrow shape
  // IMGUI_API void          Image(ImTextureID user_texture_id, const ImVec2& size, const ImVec2& uv0 = ImVec2(0, 0), const ImVec2& uv1 = ImVec2(1,1), const ImVec4& tint_col = ImVec4(1,1,1,1), const ImVec4& border_col = ImVec4(0,0,0,0));
  // IMGUI_API bool          ImageButton(ImTextureID user_texture_id, const ImVec2& size, const ImVec2& uv0 = ImVec2(0, 0),  const ImVec2& uv1 = ImVec2(1,1), int frame_padding = -1, const ImVec4& bg_col = ImVec4(0,0,0,0), const ImVec4& tint_col = ImVec4(1,1,1,1));    // <0 frame_padding uses default frame padding settings. 0 for no padding
  // IMGUI_API bool          Checkbox(const char* label, bool* v);
  // IMGUI_API bool          CheckboxFlags(const char* label, int* flags, int flags_value);
  // IMGUI_API bool          CheckboxFlags(const char* label, unsigned int* flags, unsigned int flags_value);
  // IMGUI_API bool          RadioButton(const char* label, bool active);                    // use with e.g. if (RadioButton("one", my_value==1)) { my_value = 1; }
  // IMGUI_API bool          RadioButton(const char* label, int* v, int v_button);           // shortcut to handle the above pattern when value is an integer
  // IMGUI_API void          ProgressBar(float fraction, const ImVec2& size_arg = ImVec2(-FLT_MIN, 0), const char* overlay = NULL);
  // IMGUI_API void          Bullet();                                                       // draw a small circle + keep the cursor on the same line. advance cursor x position by GetTreeNodeToLabelSpacing(), same distance that TreeNode() uses
  function Button(label, size = ImVec2.ZERO) { return exports.bind.Button(label, size); }
  function SmallButton(label) { return exports.bind.SmallButton(label); }
  function ArrowButton(str_id, dir) { return exports.bind.ArrowButton(str_id, dir); }
  function InvisibleButton(str_id, size, flags = 0) { return exports.bind.InvisibleButton(str_id, size, flags); }
  function Image(user_texture_id, size, uv0 = ImVec2.ZERO, uv1 = ImVec2.UNIT, tint_col = ImVec4.WHITE, border_col = ImVec4.ZERO) {
    exports.bind.Image(ImGuiContext.setTexture(user_texture_id), size, uv0, uv1, tint_col, border_col);
  }
  function ImageButton(user_texture_id, size = new ImVec2(Number.MIN_SAFE_INTEGER, 0), uv0 = ImVec2.ZERO, uv1 = ImVec2.UNIT, frame_padding = -1, bg_col = ImVec4.ZERO, tint_col = ImVec4.WHITE) {
    return exports.bind.ImageButton(ImGuiContext.setTexture(user_texture_id), size, uv0, uv1, frame_padding, bg_col, tint_col);
  }
  function Checkbox(label, v) {
    if (Array.isArray(v)) {
      return exports.bind.Checkbox(label, v);
    }
    else {
      const ref_v = [v()];
      const ret = exports.bind.Checkbox(label, ref_v);
      v(ref_v[0]);
      return ret;
    }
  }
  function CheckboxFlags(label, flags, flags_value) {
    if (Array.isArray(flags)) {
      return exports.bind.CheckboxFlags(label, flags, flags_value);
    }
    else {
      const ref_flags = [flags()];
      const ret = exports.bind.CheckboxFlags(label, ref_flags, flags_value);
      flags(ref_flags[0]);
      return ret;
    }
  }
  function RadioButton(label, ...args) {
    if (typeof (args[0]) === "boolean") {
      const active = args[0];
      return exports.bind.RadioButton_A(label, active);
    }
    else {
      const v = args[0];
      const v_button = args[1];
      const _v = Array.isArray(v) ? v : [v()];
      const ret = exports.bind.RadioButton_B(label, _v, v_button);
      if (!Array.isArray(v)) {
        v(_v[0]);
      }
      return ret;
    }
  }
  function ProgressBar(fraction, size_arg = new ImVec2(-1, 0), overlay = null) {
    exports.bind.ProgressBar(fraction, size_arg, overlay);
  }
  function Bullet() { exports.bind.Bullet(); }
  // Widgets: Combo Box
  // - The BeginCombo()/EndCombo() api allows you to manage your contents and selection state however you want it, by creating e.g. Selectable() items.
  // - The old Combo() api are helpers over BeginCombo()/EndCombo() which are kept available for convenience purpose.
  // IMGUI_API bool          BeginCombo(const char* label, const char* preview_value, ImGuiComboFlags flags = 0);
  // IMGUI_API void          EndCombo(); // only call EndCombo() if BeginCombo() returns true!
  // IMGUI_API bool          Combo(const char* label, int* current_item, const char* const items[], int items_count, int popup_max_height_in_items = -1);
  // IMGUI_API bool          Combo(const char* label, int* current_item, const char* items_separated_by_zeros, int popup_max_height_in_items = -1);      // Separate items with \0 within a string, end item-list with \0\0. e.g. "One\0Two\0Three\0"
  // IMGUI_API bool          Combo(const char* label, int* current_item, bool(*items_getter)(void* data, int idx, const char** out_text), void* data, int items_count, int popup_max_height_in_items = -1);
  function BeginCombo(label, preview_value = null, flags = 0) { return exports.bind.BeginCombo(label, preview_value, flags); }
  function EndCombo() { exports.bind.EndCombo(); }
  function Combo(label, current_item, ...args) {
    let ret = false;
    const _current_item = Array.isArray(current_item) ? current_item : [current_item()];
    if (Array.isArray(args[0])) {
      const items = args[0];
      const items_count = typeof (args[1]) === "number" ? args[1] : items.length;
      const popup_max_height_in_items = typeof (args[2]) === "number" ? args[2] : -1;
      const items_getter = (data, idx, out_text) => { out_text[0] = items[idx]; return true; };
      ret = exports.bind.Combo(label, _current_item, items_getter, null, items_count, popup_max_height_in_items);
    }
    else if (typeof (args[0]) === "string") {
      const items_separated_by_zeros = args[0];
      const popup_max_height_in_items = typeof (args[1]) === "number" ? args[1] : -1;
      const items = items_separated_by_zeros.replace(/^\0+|\0+$/g, "").split("\0");
      const items_count = items.length;
      const items_getter = (data, idx, out_text) => { out_text[0] = items[idx]; return true; };
      ret = exports.bind.Combo(label, _current_item, items_getter, null, items_count, popup_max_height_in_items);
    }
    else {
      const items_getter = args[0];
      const data = args[1];
      const items_count = args[2];
      const popup_max_height_in_items = typeof (args[3]) === "number" ? args[3] : -1;
      ret = exports.bind.Combo(label, _current_item, items_getter, data, items_count, popup_max_height_in_items);
    }
    if (!Array.isArray(current_item)) {
      current_item(_current_item[0]);
    }
    return ret;
  }
  // Widgets: Drag Sliders
  // - CTRL+Click on any drag box to turn them into an input box. Manually input values aren't clamped and can go off-bounds.
  // - For all the Float2/Float3/Float4/Int2/Int3/Int4 versions of every functions, note that a 'float v[X]' function argument is the same as 'float* v', the array syntax is just a way to document the number of elements that are expected to be accessible. You can pass address of your first element out of a contiguous set, e.g. &myvector.x
  // - Adjust format string to decorate the value with a prefix, a suffix, or adapt the editing and display precision e.g. "%.3f" -> 1.234; "%5.2f secs" -> 01.23 secs; "Biscuit: %.0f" -> Biscuit: 1; etc.
  // - Format string may also be set to NULL or use the default format ("%f" or "%d").
  // - Speed are per-pixel of mouse movement (v_speed=0.2f: mouse needs to move by 5 pixels to increase value by 1). For gamepad/keyboard navigation, minimum speed is Max(v_speed, minimum_step_at_given_precision).
  // - Use v_min < v_max to clamp edits to given limits. Note that CTRL+Click manual input can override those limits.
  // - Use v_max = FLT_MAX / INT_MAX etc to avoid clamping to a maximum, same with v_min = -FLT_MAX / INT_MIN to avoid clamping to a minimum.
  // - We use the same sets of flags for DragXXX() and SliderXXX() functions as the features are the same and it makes it easier to swap them.
  // - Legacy: Pre-1.78 there are DragXXX() function signatures that takes a final `float power=1.0f' argument instead of the `ImGuiSliderFlags flags=0' argument.
  //   If you get a warning converting a float to ImGuiSliderFlags, read https://github.com/ocornut/imgui/issues/3361
  // IMGUI_API bool          DragFloat(const char* label, float* v, float v_speed = 1.0f, float v_min = 0.0f, float v_max = 0.0f, const char* format = "%.3f", ImGuiSliderFlags flags = 0);     // If v_min >= v_max we have no bound
  // IMGUI_API bool          DragFloat2(const char* label, float v[2], float v_speed = 1.0f, float v_min = 0.0f, float v_max = 0.0f, const char* format = "%.3f", ImGuiSliderFlags flags = 0);
  // IMGUI_API bool          DragFloat3(const char* label, float v[3], float v_speed = 1.0f, float v_min = 0.0f, float v_max = 0.0f, const char* format = "%.3f", ImGuiSliderFlags flags = 0);
  // IMGUI_API bool          DragFloat4(const char* label, float v[4], float v_speed = 1.0f, float v_min = 0.0f, float v_max = 0.0f, const char* format = "%.3f", ImGuiSliderFlags flags = 0);
  // IMGUI_API bool          DragFloatRange2(const char* label, float* v_current_min, float* v_current_max, float v_speed = 1.0f, float v_min = 0.0f, float v_max = 0.0f, const char* format = "%.3f", const char* format_max = NULL, ImGuiSliderFlags flags = 0);
  // IMGUI_API bool          DragInt(const char* label, int* v, float v_speed = 1.0f, int v_min = 0, int v_max = 0, const char* format = "%d", ImGuiSliderFlags flags = 0);  // If v_min >= v_max we have no bound
  // IMGUI_API bool          DragInt2(const char* label, int v[2], float v_speed = 1.0f, int v_min = 0, int v_max = 0, const char* format = "%d", ImGuiSliderFlags flags = 0);
  // IMGUI_API bool          DragInt3(const char* label, int v[3], float v_speed = 1.0f, int v_min = 0, int v_max = 0, const char* format = "%d", ImGuiSliderFlags flags = 0);
  // IMGUI_API bool          DragInt4(const char* label, int v[4], float v_speed = 1.0f, int v_min = 0, int v_max = 0, const char* format = "%d", ImGuiSliderFlags flags = 0);
  // IMGUI_API bool          DragIntRange2(const char* label, int* v_current_min, int* v_current_max, float v_speed = 1.0f, int v_min = 0, int v_max = 0, const char* format = "%d", const char* format_max = NULL, ImGuiSliderFlags flags = 0);
  // IMGUI_API bool          DragScalar(const char* label, ImGuiDataType data_type, void* p_data, float v_speed, const void* p_min = NULL, const void* p_max = NULL, const char* format = NULL, ImGuiSliderFlags flags = 0);
  // IMGUI_API bool          DragScalarN(const char* label, ImGuiDataType data_type, void* p_data, int components, float v_speed, const void* p_min = NULL, const void* p_max = NULL, const char* format = NULL, ImGuiSliderFlags flags = 0);
  function DragFloat(label, v, v_speed = 1.0, v_min = 0.0, v_max = 0.0, display_format = "%.3f", flags = 0) {
    const _v = import_Scalar(v);
    const ret = exports.bind.DragFloat(label, _v, v_speed, v_min, v_max, display_format, flags);
    export_Scalar(_v, v);
    return ret;
  }
  function DragFloat2(label, v, v_speed = 1.0, v_min = 0.0, v_max = 0.0, display_format = "%.3f", flags = 0) {
    const _v = import_Vector2(v);
    const ret = exports.bind.DragFloat2(label, _v, v_speed, v_min, v_max, display_format, flags);
    export_Vector2(_v, v);
    return ret;
  }
  function DragFloat3(label, v, v_speed = 1.0, v_min = 0.0, v_max = 0.0, display_format = "%.3f", flags = 0) {
    const _v = import_Vector3(v);
    const ret = exports.bind.DragFloat3(label, _v, v_speed, v_min, v_max, display_format, flags);
    export_Vector3(_v, v);
    return ret;
  }
  function DragFloat4(label, v, v_speed = 1.0, v_min = 0.0, v_max = 0.0, display_format = "%.3f", flags = 0) {
    const _v = import_Vector4(v);
    const ret = exports.bind.DragFloat4(label, _v, v_speed, v_min, v_max, display_format, flags);
    export_Vector4(_v, v);
    return ret;
  }
  function DragFloatRange2(label, v_current_min, v_current_max, v_speed = 1.0, v_min = 0.0, v_max = 0.0, display_format = "%.3f", display_format_max = null, flags = 0) {
    const _v_current_min = import_Scalar(v_current_min);
    const _v_current_max = import_Scalar(v_current_max);
    const ret = exports.bind.DragFloatRange2(label, _v_current_min, _v_current_max, v_speed, v_min, v_max, display_format, display_format_max, flags);
    export_Scalar(_v_current_min, v_current_min);
    export_Scalar(_v_current_max, v_current_max);
    return ret;
  }
  function DragInt(label, v, v_speed = 1.0, v_min = 0, v_max = 0, format = "%d", flags = 0) {
    const _v = import_Scalar(v);
    const ret = exports.bind.DragInt(label, _v, v_speed, v_min, v_max, format, flags);
    export_Scalar(_v, v);
    return ret;
  }
  function DragInt2(label, v, v_speed = 1.0, v_min = 0, v_max = 0, format = "%d", flags = 0) {
    const _v = import_Vector2(v);
    const ret = exports.bind.DragInt2(label, _v, v_speed, v_min, v_max, format, flags);
    export_Vector2(_v, v);
    return ret;
  }
  function DragInt3(label, v, v_speed = 1.0, v_min = 0, v_max = 0, format = "%d", flags = 0) {
    const _v = import_Vector3(v);
    const ret = exports.bind.DragInt3(label, _v, v_speed, v_min, v_max, format, flags);
    export_Vector3(_v, v);
    return ret;
  }
  function DragInt4(label, v, v_speed = 1.0, v_min = 0, v_max = 0, format = "%d", flags = 0) {
    const _v = import_Vector4(v);
    const ret = exports.bind.DragInt4(label, _v, v_speed, v_min, v_max, format, flags);
    export_Vector4(_v, v);
    return ret;
  }
  function DragIntRange2(label, v_current_min, v_current_max, v_speed = 1.0, v_min = 0, v_max = 0, format = "%d", format_max = null, flags = 0) {
    const _v_current_min = import_Scalar(v_current_min);
    const _v_current_max = import_Scalar(v_current_max);
    const ret = exports.bind.DragIntRange2(label, _v_current_min, _v_current_max, v_speed, v_min, v_max, format, format_max, flags);
    export_Scalar(_v_current_min, v_current_min);
    export_Scalar(_v_current_max, v_current_max);
    return ret;
  }
  function DragScalar(label, v, v_speed, v_min = null, v_max = null, format = null, flags = 0) {
    if (v instanceof Int8Array) {
      return exports.bind.DragScalar(label, exports.ImGuiDataType.S8, v, v_speed, v_min, v_max, format, flags);
    }
    if (v instanceof Uint8Array) {
      return exports.bind.DragScalar(label, exports.ImGuiDataType.U8, v, v_speed, v_min, v_max, format, flags);
    }
    if (v instanceof Int16Array) {
      return exports.bind.DragScalar(label, exports.ImGuiDataType.S16, v, v_speed, v_min, v_max, format, flags);
    }
    if (v instanceof Uint16Array) {
      return exports.bind.DragScalar(label, exports.ImGuiDataType.U16, v, v_speed, v_min, v_max, format, flags);
    }
    if (v instanceof Int32Array) {
      return exports.bind.DragScalar(label, exports.ImGuiDataType.S32, v, v_speed, v_min, v_max, format, flags);
    }
    if (v instanceof Uint32Array) {
      return exports.bind.DragScalar(label, exports.ImGuiDataType.U32, v, v_speed, v_min, v_max, format, flags);
    }
    // if (v instanceof Int64Array) { return bind.DragScalar(label, ImGuiDataType.S64, v, v_speed, v_min, v_max, format, flags); }
    // if (v instanceof Uint64Array) { return bind.DragScalar(label, ImGuiDataType.U64, v, v_speed, v_min, v_max, format, flags); }
    if (v instanceof Float32Array) {
      return exports.bind.DragScalar(label, exports.ImGuiDataType.Float, v, v_speed, v_min, v_max, format, flags);
    }
    if (v instanceof Float64Array) {
      return exports.bind.DragScalar(label, exports.ImGuiDataType.Double, v, v_speed, v_min, v_max, format, flags);
    }
    throw new Error();
  }
  // Widgets: Regular Sliders
  // - CTRL+Click on any slider to turn them into an input box. Manually input values aren't clamped and can go off-bounds.
  // - Adjust format string to decorate the value with a prefix, a suffix, or adapt the editing and display precision e.g. "%.3f" -> 1.234; "%5.2f secs" -> 01.23 secs; "Biscuit: %.0f" -> Biscuit: 1; etc.
  // - Format string may also be set to NULL or use the default format ("%f" or "%d").
  // - Legacy: Pre-1.78 there are SliderXXX() function signatures that takes a final `float power=1.0f' argument instead of the `ImGuiSliderFlags flags=0' argument.
  //   If you get a warning converting a float to ImGuiSliderFlags, read https://github.com/ocornut/imgui/issues/3361
  // IMGUI_API bool          SliderFloat(const char* label, float* v, float v_min, float v_max, const char* format = "%.3f", ImGuiSliderFlags flags = 0);     // adjust format to decorate the value with a prefix or a suffix for in-slider labels or unit display.
  // IMGUI_API bool          SliderFloat2(const char* label, float v[2], float v_min, float v_max, const char* format = "%.3f", ImGuiSliderFlags flags = 0);
  // IMGUI_API bool          SliderFloat3(const char* label, float v[3], float v_min, float v_max, const char* format = "%.3f", ImGuiSliderFlags flags = 0);
  // IMGUI_API bool          SliderFloat4(const char* label, float v[4], float v_min, float v_max, const char* format = "%.3f", ImGuiSliderFlags flags = 0);
  // IMGUI_API bool          SliderAngle(const char* label, float* v_rad, float v_degrees_min = -360.0f, float v_degrees_max = +360.0f, const char* format = "%.0f deg", ImGuiSliderFlags flags = 0);
  // IMGUI_API bool          SliderInt(const char* label, int* v, int v_min, int v_max, const char* format = "%d", ImGuiSliderFlags flags = 0);
  // IMGUI_API bool          SliderInt2(const char* label, int v[2], int v_min, int v_max, const char* format = "%d", ImGuiSliderFlags flags = 0);
  // IMGUI_API bool          SliderInt3(const char* label, int v[3], int v_min, int v_max, const char* format = "%d", ImGuiSliderFlags flags = 0);
  // IMGUI_API bool          SliderInt4(const char* label, int v[4], int v_min, int v_max, const char* format = "%d", ImGuiSliderFlags flags = 0);
  // IMGUI_API bool          SliderScalar(const char* label, ImGuiDataType data_type, void* p_data, const void* p_min, const void* p_max, const char* format = NULL, ImGuiSliderFlags flags = 0);
  // IMGUI_API bool          SliderScalarN(const char* label, ImGuiDataType data_type, void* p_data, int components, const void* p_min, const void* p_max, const char* format = NULL, ImGuiSliderFlags flags = 0);
  // IMGUI_API bool          VSliderFloat(const char* label, const ImVec2& size, float* v, float v_min, float v_max, const char* format = "%.3f", ImGuiSliderFlags flags = 0);
  // IMGUI_API bool          VSliderInt(const char* label, const ImVec2& size, int* v, int v_min, int v_max, const char* format = "%d", ImGuiSliderFlags flags = 0);
  // IMGUI_API bool          VSliderScalar(const char* label, const ImVec2& size, ImGuiDataType data_type, void* p_data, const void* p_min, const void* p_max, const char* format = NULL, ImGuiSliderFlags flags = 0);
  function SliderFloat(label, v, v_min, v_max, format = "%.3f", flags = 0) {
    const _v = import_Scalar(v);
    const ret = exports.bind.SliderFloat(label, _v, v_min, v_max, format, flags);
    export_Scalar(_v, v);
    return ret;
  }
  function SliderFloat2(label, v, v_min, v_max, format = "%.3f", flags = 0) {
    const _v = import_Vector2(v);
    const ret = exports.bind.SliderFloat2(label, _v, v_min, v_max, format, flags);
    export_Vector2(_v, v);
    return ret;
  }
  function SliderFloat3(label, v, v_min, v_max, format = "%.3f", flags = 0) {
    const _v = import_Vector3(v);
    const ret = exports.bind.SliderFloat3(label, _v, v_min, v_max, format, flags);
    export_Vector3(_v, v);
    return ret;
  }
  function SliderFloat4(label, v, v_min, v_max, format = "%.3f", flags = 0) {
    const _v = import_Vector4(v);
    const ret = exports.bind.SliderFloat4(label, _v, v_min, v_max, format, flags);
    export_Vector4(_v, v);
    return ret;
  }
  function SliderAngle(label, v_rad, v_degrees_min = -360.0, v_degrees_max = +360.0, format = "%.0f deg", flags = 0) {
    const _v_rad = import_Scalar(v_rad);
    const ret = exports.bind.SliderAngle(label, _v_rad, v_degrees_min, v_degrees_max, format, flags);
    export_Scalar(_v_rad, v_rad);
    return ret;
  }
  function SliderAngle3(label, v_rad, v_degrees_min = -360.0, v_degrees_max = +360.0, format = "%.0f deg", flags = 0) {
    const _v_rad = import_Vector3(v_rad);
    _v_rad[0] = Math.floor(_v_rad[0] * 180 / Math.PI);
    _v_rad[1] = Math.floor(_v_rad[1] * 180 / Math.PI);
    _v_rad[2] = Math.floor(_v_rad[2] * 180 / Math.PI);
    const ret = exports.bind.SliderInt3(label, _v_rad, v_degrees_min, v_degrees_max, format, flags);
    _v_rad[0] = _v_rad[0] * Math.PI / 180;
    _v_rad[1] = _v_rad[1] * Math.PI / 180;
    _v_rad[2] = _v_rad[2] * Math.PI / 180;
    export_Vector3(_v_rad, v_rad);
    return ret;
  }
  function SliderInt(label, v, v_min, v_max, format = "%d", flags = 0) {
    const _v = import_Scalar(v);
    const ret = exports.bind.SliderInt(label, _v, v_min, v_max, format, flags);
    export_Scalar(_v, v);
    return ret;
  }
  function SliderInt2(label, v, v_min, v_max, format = "%d", flags = 0) {
    const _v = import_Vector2(v);
    const ret = exports.bind.SliderInt2(label, _v, v_min, v_max, format, flags);
    export_Vector2(_v, v);
    return ret;
  }
  function SliderInt3(label, v, v_min, v_max, format = "%d", flags = 0) {
    const _v = import_Vector3(v);
    const ret = exports.bind.SliderInt3(label, _v, v_min, v_max, format, flags);
    export_Vector3(_v, v);
    return ret;
  }
  function SliderInt4(label, v, v_min, v_max, format = "%d", flags = 0) {
    const _v = import_Vector4(v);
    const ret = exports.bind.SliderInt4(label, _v, v_min, v_max, format, flags);
    export_Vector4(_v, v);
    return ret;
  }
  function SliderScalar(label, v, v_min, v_max, format = null, flags = 0) {
    if (v instanceof Int8Array) {
      return exports.bind.SliderScalar(label, exports.ImGuiDataType.S8, v, v_min, v_max, format, flags);
    }
    if (v instanceof Uint8Array) {
      return exports.bind.SliderScalar(label, exports.ImGuiDataType.U8, v, v_min, v_max, format, flags);
    }
    if (v instanceof Int16Array) {
      return exports.bind.SliderScalar(label, exports.ImGuiDataType.S16, v, v_min, v_max, format, flags);
    }
    if (v instanceof Uint16Array) {
      return exports.bind.SliderScalar(label, exports.ImGuiDataType.U16, v, v_min, v_max, format, flags);
    }
    if (v instanceof Int32Array) {
      return exports.bind.SliderScalar(label, exports.ImGuiDataType.S32, v, v_min, v_max, format, flags);
    }
    if (v instanceof Uint32Array) {
      return exports.bind.SliderScalar(label, exports.ImGuiDataType.U32, v, v_min, v_max, format, flags);
    }
    // if (v instanceof Int64Array) { return bind.SliderScalar(label, ImGuiDataType.S64, v, v_min, v_max, format, flags); }
    // if (v instanceof Uint64Array) { return bind.SliderScalar(label, ImGuiDataType.U64, v, v_min, v_max, format, flags); }
    if (v instanceof Float32Array) {
      return exports.bind.SliderScalar(label, exports.ImGuiDataType.Float, v, v_min, v_max, format, flags);
    }
    if (v instanceof Float64Array) {
      return exports.bind.SliderScalar(label, exports.ImGuiDataType.Double, v, v_min, v_max, format, flags);
    }
    throw new Error();
  }
  function VSliderFloat(label, size, v, v_min, v_max, format = "%.3f", flags = 0) {
    const _v = import_Scalar(v);
    const ret = exports.bind.VSliderFloat(label, size, _v, v_min, v_max, format, flags);
    export_Scalar(_v, v);
    return ret;
  }
  function VSliderInt(label, size, v, v_min, v_max, format = "%d", flags = 0) {
    const _v = import_Scalar(v);
    const ret = exports.bind.VSliderInt(label, size, _v, v_min, v_max, format, flags);
    export_Scalar(_v, v);
    return ret;
  }
  function VSliderScalar(label, size, data_type, v, v_min, v_max, format = null, flags = 0) {
    if (v instanceof Int8Array) {
      return exports.bind.VSliderScalar(label, size, exports.ImGuiDataType.S8, v, v_min, v_max, format, flags);
    }
    if (v instanceof Uint8Array) {
      return exports.bind.VSliderScalar(label, size, exports.ImGuiDataType.U8, v, v_min, v_max, format, flags);
    }
    if (v instanceof Int16Array) {
      return exports.bind.VSliderScalar(label, size, exports.ImGuiDataType.S16, v, v_min, v_max, format, flags);
    }
    if (v instanceof Uint16Array) {
      return exports.bind.VSliderScalar(label, size, exports.ImGuiDataType.U16, v, v_min, v_max, format, flags);
    }
    if (v instanceof Int32Array) {
      return exports.bind.VSliderScalar(label, size, exports.ImGuiDataType.S32, v, v_min, v_max, format, flags);
    }
    if (v instanceof Uint32Array) {
      return exports.bind.VSliderScalar(label, size, exports.ImGuiDataType.U32, v, v_min, v_max, format, flags);
    }
    // if (v instanceof Int64Array) { return bind.VSliderScalar(label, size, ImGuiDataType.S64, v, v_min, v_max, format, flags); }
    // if (v instanceof Uint64Array) { return bind.VSliderScalar(label, size, ImGuiDataType.U64, v, v_min, v_max, format, flags); }
    if (v instanceof Float32Array) {
      return exports.bind.VSliderScalar(label, size, exports.ImGuiDataType.Float, v, v_min, v_max, format, flags);
    }
    if (v instanceof Float64Array) {
      return exports.bind.VSliderScalar(label, size, exports.ImGuiDataType.Double, v, v_min, v_max, format, flags);
    }
    throw new Error();
  }
  // Widgets: Input with Keyboard
  // - If you want to use InputText() with std::string or any custom dynamic string type, see misc/cpp/imgui_stdlib.h and comments in imgui_demo.cpp.
  // - Most of the ImGuiInputTextFlags flags are only useful for InputText() and not for InputFloatX, InputIntX, InputDouble etc.
  // IMGUI_API bool          InputText(const char* label, char* buf, size_t buf_size, ImGuiInputTextFlags flags = 0, ImGuiInputTextCallback callback = NULL, void* user_data = NULL);
  // IMGUI_API bool          InputTextMultiline(const char* label, char* buf, size_t buf_size, const ImVec2& size = ImVec2(0, 0), ImGuiInputTextFlags flags = 0, ImGuiInputTextCallback callback = NULL, void* user_data = NULL);
  // IMGUI_API bool          InputTextWithHint(const char* label, const char* hint, char* buf, size_t buf_size, ImGuiInputTextFlags flags = 0, ImGuiInputTextCallback callback = NULL, void* user_data = NULL);
  // IMGUI_API bool          InputFloat(const char* label, float* v, float step = 0.0f, float step_fast = 0.0f, const char* format = "%.3f", ImGuiInputTextFlags flags = 0);
  // IMGUI_API bool          InputFloat2(const char* label, float v[2], const char* format = "%.3f", ImGuiInputTextFlags flags = 0);
  // IMGUI_API bool          InputFloat3(const char* label, float v[3], const char* format = "%.3f", ImGuiInputTextFlags flags = 0);
  // IMGUI_API bool          InputFloat4(const char* label, float v[4], const char* format = "%.3f", ImGuiInputTextFlags flags = 0);
  // IMGUI_API bool          InputInt(const char* label, int* v, int step = 1, int step_fast = 100, ImGuiInputTextFlags flags = 0);
  // IMGUI_API bool          InputInt2(const char* label, int v[2], ImGuiInputTextFlags flags = 0);
  // IMGUI_API bool          InputInt3(const char* label, int v[3], ImGuiInputTextFlags flags = 0);
  // IMGUI_API bool          InputInt4(const char* label, int v[4], ImGuiInputTextFlags flags = 0);
  // IMGUI_API bool          InputDouble(const char* label, double* v, double step = 0.0, double step_fast = 0.0, const char* format = "%.6f", ImGuiInputTextFlags flags = 0);
  // IMGUI_API bool          InputScalar(const char* label, ImGuiDataType data_type, void* p_data, const void* p_step = NULL, const void* p_step_fast = NULL, const char* format = NULL, ImGuiInputTextFlags flags = 0);
  // IMGUI_API bool          InputScalarN(const char* label, ImGuiDataType data_type, void* p_data, int components, const void* p_step = NULL, const void* p_step_fast = NULL, const char* format = NULL, ImGuiInputTextFlags flags = 0);
  function InputText(label, buf, buf_size = buf instanceof ImStringBuffer ? buf.size : ImGuiInputTextDefaultSize, flags = 0, callback = null, user_data = null) {
    const _callback = callback && ((data) => callback(new ImGuiInputTextCallbackData(data, user_data))) || null;
    if (Array.isArray(buf)) {
      return exports.bind.InputText(label, buf, buf_size, flags, _callback, null);
    }
    else if (buf instanceof ImStringBuffer) {
      const ref_buf = [buf.buffer];
      const _buf_size = Math.min(buf_size, buf.size);
      const ret = exports.bind.InputText(label, ref_buf, _buf_size, flags, _callback, null);
      buf.buffer = ref_buf[0];
      return ret;
    }
    else {
      const ref_buf = [buf()];
      const ret = exports.bind.InputText(label, ref_buf, buf_size + 1, flags, _callback, null);
      buf(ref_buf[0]);
      return ret;
    }
  }
  function InputTextMultiline(label, buf, buf_size = buf instanceof ImStringBuffer ? buf.size : ImGuiInputTextDefaultSize, size = ImVec2.ZERO, flags = 0, callback = null, user_data = null) {
    const _callback = callback && ((data) => callback(new ImGuiInputTextCallbackData(data, user_data))) || null;
    if (Array.isArray(buf)) {
      return exports.bind.InputTextMultiline(label, buf, buf_size, size, flags, _callback, null);
    }
    else if (buf instanceof ImStringBuffer) {
      const ref_buf = [buf.buffer];
      const _buf_size = Math.min(buf_size, buf.size);
      const ret = exports.bind.InputTextMultiline(label, ref_buf, _buf_size, size, flags, _callback, null);
      buf.buffer = ref_buf[0];
      return ret;
    }
    else {
      const ref_buf = [buf()];
      const ret = exports.bind.InputTextMultiline(label, ref_buf, buf_size, size, flags, _callback, null);
      buf(ref_buf[0]);
      return ret;
    }
  }
  function InputTextWithHint(label, hint, buf, buf_size = buf instanceof ImStringBuffer ? buf.size : ImGuiInputTextDefaultSize, flags = 0, callback = null, user_data = null) {
    const _callback = callback && ((data) => callback(new ImGuiInputTextCallbackData(data, user_data))) || null;
    if (Array.isArray(buf)) {
      return exports.bind.InputTextWithHint(label, hint, buf, buf_size, flags, _callback, null);
    }
    else if (buf instanceof ImStringBuffer) {
      const ref_buf = [buf.buffer];
      const _buf_size = Math.min(buf_size, buf.size);
      const ret = exports.bind.InputTextWithHint(label, hint, ref_buf, _buf_size, flags, _callback, null);
      buf.buffer = ref_buf[0];
      return ret;
    }
    else {
      const ref_buf = [buf()];
      const ret = exports.bind.InputTextWithHint(label, hint, ref_buf, buf_size, flags, _callback, null);
      buf(ref_buf[0]);
      return ret;
    }
  }
  function InputFloat(label, v, step = 0.0, step_fast = 0.0, format = "%.3f", flags = 0) {
    const _v = import_Scalar(v);
    const ret = exports.bind.InputFloat(label, _v, step, step_fast, format, flags);
    export_Scalar(_v, v);
    return ret;
  }
  function InputFloat2(label, v, format = "%.3f", flags = 0) {
    const _v = import_Vector2(v);
    const ret = exports.bind.InputFloat2(label, _v, format, flags);
    export_Vector2(_v, v);
    return ret;
  }
  function InputFloat3(label, v, format = "%.3f", flags = 0) {
    const _v = import_Vector3(v);
    const ret = exports.bind.InputFloat3(label, _v, format, flags);
    export_Vector3(_v, v);
    return ret;
  }
  function InputFloat4(label, v, format = "%.3f", flags = 0) {
    const _v = import_Vector4(v);
    const ret = exports.bind.InputFloat4(label, _v, format, flags);
    export_Vector4(_v, v);
    return ret;
  }
  function InputInt(label, v, step = 1, step_fast = 100, flags = 0) {
    const _v = import_Scalar(v);
    const ret = exports.bind.InputInt(label, _v, step, step_fast, flags);
    export_Scalar(_v, v);
    return ret;
  }
  function InputInt2(label, v, flags = 0) {
    const _v = import_Vector2(v);
    const ret = exports.bind.InputInt2(label, _v, flags);
    export_Vector2(_v, v);
    return ret;
  }
  function InputInt3(label, v, flags = 0) {
    const _v = import_Vector3(v);
    const ret = exports.bind.InputInt3(label, _v, flags);
    export_Vector3(_v, v);
    return ret;
  }
  function InputInt4(label, v, flags = 0) {
    const _v = import_Vector4(v);
    const ret = exports.bind.InputInt4(label, _v, flags);
    export_Vector4(_v, v);
    return ret;
  }
  function InputDouble(label, v, step = 0.0, step_fast = 0.0, format = "%.6f", flags = 0) {
    const _v = import_Scalar(v);
    const ret = exports.bind.InputDouble(label, _v, step, step_fast, format, flags);
    export_Scalar(_v, v);
    return ret;
  }
  function InputScalar(label, v, step = null, step_fast = null, format = null, flags = 0) {
    if (v instanceof Int8Array) {
      return exports.bind.InputScalar(label, exports.ImGuiDataType.S8, v, step, step_fast, format, flags);
    }
    if (v instanceof Uint8Array) {
      return exports.bind.InputScalar(label, exports.ImGuiDataType.U8, v, step, step_fast, format, flags);
    }
    if (v instanceof Int16Array) {
      return exports.bind.InputScalar(label, exports.ImGuiDataType.S16, v, step, step_fast, format, flags);
    }
    if (v instanceof Uint16Array) {
      return exports.bind.InputScalar(label, exports.ImGuiDataType.U16, v, step, step_fast, format, flags);
    }
    if (v instanceof Int32Array) {
      return exports.bind.InputScalar(label, exports.ImGuiDataType.S32, v, step, step_fast, format, flags);
    }
    if (v instanceof Uint32Array) {
      return exports.bind.InputScalar(label, exports.ImGuiDataType.U32, v, step, step_fast, format, flags);
    }
    // if (v instanceof Int64Array) { return bind.InputScalar(label, ImGuiDataType.S64, v, step, step_fast, format, flags); }
    // if (v instanceof Uint64Array) { return bind.InputScalar(label, ImGuiDataType.U64, v, step, step_fast, format, flags); }
    if (v instanceof Float32Array) {
      return exports.bind.InputScalar(label, exports.ImGuiDataType.Float, v, step, step_fast, format, flags);
    }
    if (v instanceof Float64Array) {
      return exports.bind.InputScalar(label, exports.ImGuiDataType.Double, v, step, step_fast, format, flags);
    }
    throw new Error();
  }
  // Widgets: Color Editor/Picker (tip: the ColorEdit* functions have a little color square that can be left-clicked to open a picker, and right-clicked to open an option menu.)
  // - Note that in C++ a 'float v[X]' function argument is the _same_ as 'float* v', the array syntax is just a way to document the number of elements that are expected to be accessible.
  // - You can pass the address of a first float element out of a contiguous structure, e.g. &myvector.x
  // IMGUI_API bool          ColorEdit3(const char* label, float col[3], ImGuiColorEditFlags flags = 0);
  // IMGUI_API bool          ColorEdit4(const char* label, float col[4], ImGuiColorEditFlags flags = 0);
  // IMGUI_API bool          ColorPicker3(const char* label, float col[3], ImGuiColorEditFlags flags = 0);
  // IMGUI_API bool          ColorPicker4(const char* label, float col[4], ImGuiColorEditFlags flags = 0, const float* ref_col = NULL);
  // IMGUI_API bool          ColorButton(const char* desc_id, const ImVec4& col, ImGuiColorEditFlags flags = 0, ImVec2 size = ImVec2(0, 0)); // display a color square/button, hover for details, return true when pressed.
  // IMGUI_API void          SetColorEditOptions(ImGuiColorEditFlags flags);                     // initialize current options (generally on application startup) if you want to select a default format, picker type, etc. User will be able to change many settings, unless you pass the _NoOptions flag to your calls.
  function ColorEdit3(label, col, flags = 0) {
    const _col = import_Color3(col);
    const ret = exports.bind.ColorEdit3(label, _col, flags);
    export_Color3(_col, col);
    return ret;
  }
  function ColorEdit4(label, col, flags = 0) {
    const _col = import_Color4(col);
    const ret = exports.bind.ColorEdit4(label, _col, flags);
    export_Color4(_col, col);
    return ret;
  }
  function ColorPicker3(label, col, flags = 0) {
    const _col = import_Color3(col);
    const ret = exports.bind.ColorPicker3(label, _col, flags);
    export_Color3(_col, col);
    return ret;
  }
  function ColorPicker4(label, col, flags = 0, ref_col = null) {
    const _col = import_Color4(col);
    const _ref_col = ref_col ? import_Color4(ref_col) : null;
    const ret = exports.bind.ColorPicker4(label, _col, flags, _ref_col);
    export_Color4(_col, col);
    if (_ref_col && ref_col) {
      export_Color4(_ref_col, ref_col);
    }
    return ret;
  }
  function ColorButton(desc_id, col, flags = 0, size = ImVec2.ZERO) {
    return exports.bind.ColorButton(desc_id, col, flags, size);
  }
  function SetColorEditOptions(flags) {
    exports.bind.SetColorEditOptions(flags);
  }
  function TreeNode(...args) {
    if (typeof (args[0]) === "string") {
      if (args.length === 1) {
        const label = args[0];
        return exports.bind.TreeNode_A(label);
      }
      else {
        const str_id = args[0];
        const fmt = args[1];
        return exports.bind.TreeNode_B(str_id, fmt);
      }
    }
    else {
      const ptr_id = args[0];
      const fmt = args[1];
      return exports.bind.TreeNode_C(ptr_id, fmt);
    }
  }
  function TreeNodeEx(...args) {
    if (typeof (args[0]) === "string") {
      if (args.length < 3) {
        const label = args[0];
        const flags = args[1] || 0;
        return exports.bind.TreeNodeEx_A(label, flags);
      }
      else {
        const str_id = args[0];
        const flags = args[1];
        const fmt = args[2];
        return exports.bind.TreeNodeEx_B(str_id, flags, fmt);
      }
    }
    else {
      const ptr_id = args[0];
      const flags = args[1];
      const fmt = args[2];
      return exports.bind.TreeNodeEx_C(ptr_id, flags, fmt);
    }
  }
  function TreePush(...args) {
    if (typeof (args[0]) === "string") {
      const str_id = args[0];
      exports.bind.TreePush_A(str_id);
    }
    else {
      const ptr_id = args[0];
      exports.bind.TreePush_B(ptr_id);
    }
  }
  function TreePop() { exports.bind.TreePop(); }
  function GetTreeNodeToLabelSpacing() { return exports.bind.GetTreeNodeToLabelSpacing(); }
  function CollapsingHeader(label, ...args) {
    if (args.length === 0) {
      return exports.bind.CollapsingHeader_A(label, 0);
    }
    else {
      if (typeof (args[0]) === "number") {
        const flags = args[0];
        return exports.bind.CollapsingHeader_A(label, flags);
      }
      else {
        const p_open = args[0];
        const flags = args[1] || 0;
        const ref_open = Array.isArray(p_open) ? p_open : [p_open()];
        const ret = exports.bind.CollapsingHeader_B(label, ref_open, flags);
        if (!Array.isArray(p_open)) {
          p_open(ref_open[0]);
        }
        return ret;
      }
    }
  }
  function SetNextItemOpen(is_open, cond = 0) {
    exports.bind.SetNextItemOpen(is_open, cond);
  }
  function Selectable(label, ...args) {
    if (args.length === 0) {
      return exports.bind.Selectable_A(label, false, 0, ImVec2.ZERO);
    }
    else {
      if (typeof (args[0]) === "boolean") {
        const selected = args[0];
        const flags = args[1] || 0;
        const size = args[2] || ImVec2.ZERO;
        return exports.bind.Selectable_A(label, selected, flags, size);
      }
      else {
        const p_selected = args[0];
        const flags = args[1] || 0;
        const size = args[2] || ImVec2.ZERO;
        const ref_selected = Array.isArray(p_selected) ? p_selected : [p_selected()];
        const ret = exports.bind.Selectable_B(label, ref_selected, flags, size);
        if (!Array.isArray(p_selected)) {
          p_selected(ref_selected[0]);
        }
        return ret;
      }
    }
  }
  function ListBox(label, current_item, ...args) {
    let ret = false;
    const _current_item = Array.isArray(current_item) ? current_item : [current_item()];
    if (Array.isArray(args[0])) {
      const items = args[0];
      const items_count = typeof (args[1]) === "number" ? args[1] : items.length;
      const height_in_items = typeof (args[2]) === "number" ? args[2] : -1;
      ret = exports.bind.ListBox_A(label, _current_item, items, items_count, height_in_items);
    }
    else {
      const items_getter = args[0];
      const data = args[1];
      const items_count = args[2];
      const height_in_items = typeof (args[3]) === "number" ? args[3] : -1;
      ret = exports.bind.ListBox_B(label, _current_item, items_getter, data, items_count, height_in_items);
    }
    if (!Array.isArray(current_item)) {
      current_item(_current_item[0]);
    }
    return ret;
  }
  function ListBoxHeader(label, ...args) {
    if (typeof (args[0]) === "object") {
      const size = args[0];
      return exports.bind.ListBoxHeader_A(label, size);
    }
    else {
      const items_count = args[0];
      const height_in_items = typeof (args[1]) === "number" ? args[1] : -1;
      return exports.bind.ListBoxHeader_B(label, items_count, height_in_items);
    }
  }
  function ListBoxFooter() { exports.bind.ListBoxFooter(); }
  function PlotLines(label, ...args) {
    if (Array.isArray(args[0])) {
      const values = args[0];
      const values_getter = (data, idx) => values[idx * stride];
      const values_count = typeof (args[1]) === "number" ? args[1] : values.length;
      const values_offset = typeof (args[2]) === "number" ? args[2] : 0;
      const overlay_text = typeof (args[3]) === "string" ? args[3] : null;
      const scale_min = typeof (args[4]) === "number" ? args[4] : Number.MAX_VALUE;
      const scale_max = typeof (args[5]) === "number" ? args[5] : Number.MAX_VALUE;
      const graph_size = args[6] || ImVec2.ZERO;
      const stride = typeof (args[7]) === "number" ? args[7] : 1;
      exports.bind.PlotLines(label, values_getter, null, values_count, values_offset, overlay_text, scale_min, scale_max, graph_size);
    }
    else {
      const values_getter = args[0];
      const data = args[1];
      const values_count = args[2];
      const values_offset = typeof (args[3]) === "number" ? args[3] : 0;
      const overlay_text = typeof (args[4]) === "string" ? args[4] : null;
      const scale_min = typeof (args[5]) === "number" ? args[5] : Number.MAX_VALUE;
      const scale_max = typeof (args[6]) === "number" ? args[6] : Number.MAX_VALUE;
      const graph_size = args[7] || ImVec2.ZERO;
      exports.bind.PlotLines(label, values_getter, data, values_count, values_offset, overlay_text, scale_min, scale_max, graph_size);
    }
  }
  function PlotHistogram(label, ...args) {
    if (Array.isArray(args[0])) {
      const values = args[0];
      const values_getter = (data, idx) => values[idx * stride];
      const values_count = typeof (args[1]) === "number" ? args[1] : values.length;
      const values_offset = typeof (args[2]) === "number" ? args[2] : 0;
      const overlay_text = typeof (args[3]) === "string" ? args[3] : null;
      const scale_min = typeof (args[4]) === "number" ? args[4] : Number.MAX_VALUE;
      const scale_max = typeof (args[5]) === "number" ? args[5] : Number.MAX_VALUE;
      const graph_size = args[6] || ImVec2.ZERO;
      const stride = typeof (args[7]) === "number" ? args[7] : 1;
      exports.bind.PlotHistogram(label, values_getter, null, values_count, values_offset, overlay_text, scale_min, scale_max, graph_size);
    }
    else {
      const values_getter = args[0];
      const data = args[1];
      const values_count = args[2];
      const values_offset = typeof (args[3]) === "number" ? args[3] : 0;
      const overlay_text = typeof (args[4]) === "string" ? args[4] : null;
      const scale_min = typeof (args[5]) === "number" ? args[5] : Number.MAX_VALUE;
      const scale_max = typeof (args[6]) === "number" ? args[6] : Number.MAX_VALUE;
      const graph_size = args[7] || ImVec2.ZERO;
      exports.bind.PlotHistogram(label, values_getter, data, values_count, values_offset, overlay_text, scale_min, scale_max, graph_size);
    }
  }
  function Value(prefix, ...args) {
    if (typeof (args[0]) === "boolean") {
      exports.bind.Value_A(prefix, args[0]);
    }
    else if (typeof (args[0]) === "number") {
      if (Number.isInteger(args[0])) {
        exports.bind.Value_B(prefix, args[0]);
      }
      else {
        exports.bind.Value_D(prefix, args[0], typeof (args[1]) === "string" ? args[1] : null);
      }
    }
    else {
      exports.bind.Text(prefix + String(args[0]));
    }
  }
  // Widgets: Menus
  // - Use BeginMenuBar() on a window ImGuiWindowFlags_MenuBar to append to its menu bar.
  // - Use BeginMainMenuBar() to create a menu bar at the top of the screen and append to it.
  // - Use BeginMenu() to create a menu. You can call BeginMenu() multiple time with the same identifier to append more items to it.
  // IMGUI_API bool          BeginMenuBar();                                                     // append to menu-bar of current window (requires ImGuiWindowFlags_MenuBar flag set on parent window).
  // IMGUI_API void          EndMenuBar();                                                       // only call EndMenuBar() if BeginMenuBar() returns true!
  // IMGUI_API bool          BeginMainMenuBar();                                                 // create and append to a full screen menu-bar.
  // IMGUI_API void          EndMainMenuBar();                                                   // only call EndMainMenuBar() if BeginMainMenuBar() returns true!
  // IMGUI_API bool          BeginMenu(const char* label, bool enabled = true);                  // create a sub-menu entry. only call EndMenu() if this returns true!
  // IMGUI_API void          EndMenu();                                                          // only call EndMenu() if BeginMenu() returns true!
  // IMGUI_API bool          MenuItem(const char* label, const char* shortcut = NULL, bool selected = false, bool enabled = true);  // return true when activated. shortcuts are displayed for convenience but not processed by ImGui at the moment
  // IMGUI_API bool          MenuItem(const char* label, const char* shortcut, bool* p_selected, bool enabled = true);              // return true when activated + toggle (*p_selected) if p_selected != NULL
  function BeginMenuBar() { return exports.bind.BeginMenuBar(); }
  function EndMenuBar() { exports.bind.EndMenuBar(); }
  function BeginMainMenuBar() { return exports.bind.BeginMainMenuBar(); }
  function EndMainMenuBar() { exports.bind.EndMainMenuBar(); }
  function BeginMenu(label, enabled = true) { return exports.bind.BeginMenu(label, enabled); }
  function EndMenu() { exports.bind.EndMenu(); }
  function MenuItem(label, ...args) {
    if (args.length === 0) {
      return exports.bind.MenuItem_A(label, null, false, true);
    }
    else if (args.length === 1) {
      const shortcut = args[0];
      return exports.bind.MenuItem_A(label, shortcut, false, true);
    }
    else {
      const shortcut = args[0];
      if (typeof (args[1]) === "boolean") {
        const selected = args[1];
        const enabled = typeof (args[2]) === "boolean" ? args[2] : true;
        return exports.bind.MenuItem_A(label, shortcut, selected, enabled);
      }
      else {
        const p_selected = args[1];
        const enabled = typeof (args[2]) === "boolean" ? args[2] : true;
        const ref_selected = Array.isArray(p_selected) ? p_selected : [p_selected()];
        const ret = exports.bind.MenuItem_B(label, shortcut, ref_selected, enabled);
        if (!Array.isArray(p_selected)) {
          p_selected(ref_selected[0]);
        }
        return ret;
      }
    }
  }
  // Tooltips
  // - Tooltip are windows following the mouse. They do not take focus away.
  // IMGUI_API void          BeginTooltip();                                                     // begin/append a tooltip window. to create full-featured tooltip (with any kind of items).
  // IMGUI_API void          EndTooltip();
  // IMGUI_API void          SetTooltip(const char* fmt, ...) IM_FMTARGS(1);                     // set a text-only tooltip, typically use with ImGui::IsItemHovered(). override any previous call to SetTooltip().
  // IMGUI_API void          SetTooltipV(const char* fmt, va_list args) IM_FMTLIST(1);
  function BeginTooltip() { exports.bind.BeginTooltip(); }
  function EndTooltip() { exports.bind.EndTooltip(); }
  function SetTooltip(fmt) { exports.bind.SetTooltip(fmt); }
  // Popups, Modals
  //  - They block normal mouse hovering detection (and therefore most mouse interactions) behind them.
  //  - If not modal: they can be closed by clicking anywhere outside them, or by pressing ESCAPE.
  //  - Their visibility state (~bool) is held internally instead of being held by the programmer as we are used to with regular Begin*() calls.
  //  - The 3 properties above are related: we need to retain popup visibility state in the library because popups may be closed as any time.
  //  - You can bypass the hovering restriction by using ImGuiHoveredFlags_AllowWhenBlockedByPopup when calling IsItemHovered() or IsWindowHovered().
  //  - IMPORTANT: Popup identifiers are relative to the current ID stack, so OpenPopup and BeginPopup generally needs to be at the same level of the stack.
  //    This is sometimes leading to confusing mistakes. May rework this in the future.
  // Popups: begin/end functions
  //  - BeginPopup(): query popup state, if open start appending into the window. Call EndPopup() afterwards. ImGuiWindowFlags are forwarded to the window.
  //  - BeginPopupModal(): block every interactions behind the window, cannot be closed by user, add a dimming background, has a title bar.
  // IMGUI_API bool          BeginPopup(const char* str_id, ImGuiWindowFlags flags = 0);                         // return true if the popup is open, and you can start outputting to it.
  // IMGUI_API bool          BeginPopupModal(const char* name, bool* p_open = NULL, ImGuiWindowFlags flags = 0); // return true if the modal is open, and you can start outputting to it.
  // IMGUI_API void          EndPopup();                                                                         // only call EndPopup() if BeginPopupXXX() returns true!
  function BeginPopup(str_id, flags = 0) { return exports.bind.BeginPopup(str_id, flags); }
  function BeginPopupModal(str_id, p_open = null, flags = 0) {
    if (Array.isArray(p_open)) {
      return exports.bind.BeginPopupModal(str_id, p_open, flags);
    }
    else if (typeof (p_open) === "function") {
      const _p_open = [p_open()];
      const ret = exports.bind.BeginPopupModal(str_id, _p_open, flags);
      p_open(_p_open[0]);
      return ret;
    }
    else {
      return exports.bind.BeginPopupModal(str_id, null, flags);
    }
  }
  function EndPopup() { exports.bind.EndPopup(); }
  // Popups: open/close functions
  //  - OpenPopup(): set popup state to open. ImGuiPopupFlags are available for opening options.
  //  - If not modal: they can be closed by clicking anywhere outside them, or by pressing ESCAPE.
  //  - CloseCurrentPopup(): use inside the BeginPopup()/EndPopup() scope to close manually.
  //  - CloseCurrentPopup() is called by default by Selectable()/MenuItem() when activated (FIXME: need some options).
  //  - Use ImGuiPopupFlags_NoOpenOverExistingPopup to avoid opening a popup if there's already one at the same level. This is equivalent to e.g. testing for !IsAnyPopupOpen() prior to OpenPopup().
  // IMGUI_API void          OpenPopup(const char* str_id, ImGuiPopupFlags popup_flags = 0);                     // call to mark popup as open (don't call every frame!).
  // IMGUI_API void          OpenPopupOnItemClick(const char* str_id = NULL, ImGuiPopupFlags popup_flags = 1);   // helper to open popup when clicked on last item. return true when just opened. (note: actually triggers on the mouse _released_ event to be consistent with popup behaviors)
  // IMGUI_API void          CloseCurrentPopup();                                                                // manually close the popup we have begin-ed into.
  function OpenPopup(str_id, popup_flags = 0) { exports.bind.OpenPopup(str_id, popup_flags); }
  function OpenPopupOnItemClick(str_id = null, popup_flags = 1) { exports.bind.OpenPopupOnItemClick(str_id, popup_flags); }
  function CloseCurrentPopup() { exports.bind.CloseCurrentPopup(); }
  // Popups: open+begin combined functions helpers
  //  - Helpers to do OpenPopup+BeginPopup where the Open action is triggered by e.g. hovering an item and right-clicking.
  //  - They are convenient to easily create context menus, hence the name.
  //  - IMPORTANT: Notice that BeginPopupContextXXX takes ImGuiPopupFlags just like OpenPopup() and unlike BeginPopup(). For full consistency, we may add ImGuiWindowFlags to the BeginPopupContextXXX functions in the future.
  //  - IMPORTANT: we exceptionally default their flags to 1 (== ImGuiPopupFlags_MouseButtonRight) for backward compatibility with older API taking 'int mouse_button = 1' parameter, so if you add other flags remember to re-add the ImGuiPopupFlags_MouseButtonRight.
  // IMGUI_API bool          BeginPopupContextItem(const char* str_id = NULL, ImGuiPopupFlags popup_flags = 1);  // open+begin popup when clicked on last item. if you can pass a NULL str_id only if the previous item had an id. If you want to use that on a non-interactive item such as Text() you need to pass in an explicit ID here. read comments in .cpp!
  // IMGUI_API bool          BeginPopupContextWindow(const char* str_id = NULL, ImGuiPopupFlags popup_flags = 1);// open+begin popup when clicked on current window.
  // IMGUI_API bool          BeginPopupContextVoid(const char* str_id = NULL, ImGuiPopupFlags popup_flags = 1);  // open+begin popup when clicked in void (where there are no windows).
  function BeginPopupContextItem(str_id = null, popup_flags = 1) { return exports.bind.BeginPopupContextItem(str_id, popup_flags); }
  function BeginPopupContextWindow(str_id = null, popup_flags = 1) { return exports.bind.BeginPopupContextWindow(str_id, popup_flags); }
  function BeginPopupContextVoid(str_id = null, popup_flags = 1) { return exports.bind.BeginPopupContextVoid(str_id, popup_flags); }
  // Popups: test function
  //  - IsPopupOpen(): return true if the popup is open at the current BeginPopup() level of the popup stack.
  //  - IsPopupOpen() with ImGuiPopupFlags_AnyPopupId: return true if any popup is open at the current BeginPopup() level of the popup stack.
  //  - IsPopupOpen() with ImGuiPopupFlags_AnyPopupId + ImGuiPopupFlags_AnyPopupLevel: return true if any popup is open.
  // IMGUI_API bool          IsPopupOpen(const char* str_id, ImGuiPopupFlags flags = 0);                         // return true if the popup is open.
  function IsPopupOpen(str_id, flags = 0) { return exports.bind.IsPopupOpen(str_id, flags); }
  // Tables
  // [BETA API] API may evolve slightly! If you use this, please update to the next version when it comes out!
  // - Full-featured replacement for old Columns API.
  // - See Demo->Tables for demo code.
  // - See top of imgui_tables.cpp for general commentary.
  // - See ImGuiTableFlags_ and ImGuiTableColumnFlags_ enums for a description of available flags.
  // The typical call flow is:
  // - 1. Call BeginTable().
  // - 2. Optionally call TableSetupColumn() to submit column name/flags/defaults.
  // - 3. Optionally call TableSetupScrollFreeze() to request scroll freezing of columns/rows.
  // - 4. Optionally call TableHeadersRow() to submit a header row. Names are pulled from TableSetupColumn() data.
  // - 5. Populate contents:
  //    - In most situations you can use TableNextRow() + TableSetColumnIndex(N) to start appending into a column.
  //    - If you are using tables as a sort of grid, where every columns is holding the same type of contents,
  //      you may prefer using TableNextColumn() instead of TableNextRow() + TableSetColumnIndex().
  //      TableNextColumn() will automatically wrap-around into the next row if needed.
  //    - IMPORTANT: Comparatively to the old Columns() API, we need to call TableNextColumn() for the first column!
  //    - Summary of possible call flow:
  //        --------------------------------------------------------------------------------------------------------
  //        TableNextRow() -> TableSetColumnIndex(0) -> Text("Hello 0") -> TableSetColumnIndex(1) -> Text("Hello 1")  // OK
  //        TableNextRow() -> TableNextColumn()      -> Text("Hello 0") -> TableNextColumn()      -> Text("Hello 1")  // OK
  //                          TableNextColumn()      -> Text("Hello 0") -> TableNextColumn()      -> Text("Hello 1")  // OK: TableNextColumn() automatically gets to next row!
  //        TableNextRow()                           -> Text("Hello 0")                                               // Not OK! Missing TableSetColumnIndex() or TableNextColumn()! Text will not appear!
  //        --------------------------------------------------------------------------------------------------------
  // - 5. Call EndTable()
  // IMGUI_API bool          BeginTable(const char* str_id, int column, ImGuiTableFlags flags = 0, const ImVec2& outer_size = ImVec2(0.0f, 0.0f), float inner_width = 0.0f);
  // IMGUI_API void          EndTable();                                 // only call EndTable() if BeginTable() returns true!
  // IMGUI_API void          TableNextRow(ImGuiTableRowFlags row_flags = 0, float min_row_height = 0.0f); // append into the first cell of a new row.
  // IMGUI_API bool          TableNextColumn();                          // append into the next column (or first column of next row if currently in last column). Return true when column is visible.
  // IMGUI_API bool          TableSetColumnIndex(int column_n);          // append into the specified column. Return true when column is visible.
  function BeginTable(str_id, column, flags = 0, outer_size = ImVec2.ZERO, inner_width = 0.0) { return exports.bind.BeginTable(str_id, column, flags, outer_size, inner_width); }
  function EndTable() { exports.bind.EndTable(); }
  function TableNextRow(row_flags = 0, min_row_height = 0.0) { exports.bind.TableNextRow(row_flags, min_row_height); }
  function TableNextColumn() { return exports.bind.TableNextColumn(); }
  function TableSetColumnIndex(column_n) { return exports.bind.TableSetColumnIndex(column_n); }
  // Tables: Headers & Columns declaration
  // - Use TableSetupColumn() to specify label, resizing policy, default width/weight, id, various other flags etc.
  // - Use TableHeadersRow() to create a header row and automatically submit a TableHeader() for each column.
  //   Headers are required to perform: reordering, sorting, and opening the context menu.
  //   The context menu can also be made available in columns body using ImGuiTableFlags_ContextMenuInBody.
  // - You may manually submit headers using TableNextRow() + TableHeader() calls, but this is only useful in
  //   some advanced use cases (e.g. adding custom widgets in header row).
  // - Use TableSetupScrollFreeze() to lock columns/rows so they stay visible when scrolled.
  // IMGUI_API void          TableSetupColumn(const char* label, ImGuiTableColumnFlags flags = 0, float init_width_or_weight = 0.0f, ImU32 user_id = 0);
  // IMGUI_API void          TableSetupScrollFreeze(int cols, int rows); // lock columns/rows so they stay visible when scrolled.
  // IMGUI_API void          TableHeadersRow();                          // submit all headers cells based on data provided to TableSetupColumn() + submit context menu
  // IMGUI_API void          TableHeader(const char* label);             // submit one header cell manually (rarely used)
  function TableSetupColumn(label, flags = 0, init_width_or_weight = 0.0, user_id = 0) { exports.bind.TableSetupColumn(label, flags, init_width_or_weight, user_id); }
  function TableSetupScrollFreeze(cols, rows) { exports.bind.TableSetupScrollFreeze(cols, rows); }
  function TableHeadersRow() { exports.bind.TableHeadersRow(); }
  function TableHeader(label) { exports.bind.TableHeader(label); }
  // Tables: Sorting
  // - Call TableGetSortSpecs() to retrieve latest sort specs for the table. NULL when not sorting.
  // - When 'SpecsDirty == true' you should sort your data. It will be true when sorting specs have changed
  //   since last call, or the first time. Make sure to set 'SpecsDirty = false' after sorting, else you may
  //   wastefully sort your data every frame!
  // - Lifetime: don't hold on this pointer over multiple frames or past any subsequent call to BeginTable().
  // IMGUI_API ImGuiTableSortSpecs* TableGetSortSpecs();                        // get latest sort specs for the table (NULL if not sorting).
  function TableGetSortSpecs() {
    const sort_specs = exports.bind.TableGetSortSpecs();
    return (sort_specs === null) ? null : new ImGuiTableSortSpecs(sort_specs);
  }
  // Tables: Miscellaneous functions
  // - Functions args 'int column_n' treat the default value of -1 as the same as passing the current column index.
  // IMGUI_API int                   TableGetColumnCount();                      // return number of columns (value passed to BeginTable)
  // IMGUI_API int                   TableGetColumnIndex();                      // return current column index.
  // IMGUI_API int                   TableGetRowIndex();                         // return current row index.
  // IMGUI_API const char*           TableGetColumnName(int column_n = -1);      // return "" if column didn't have a name declared by TableSetupColumn(). Pass -1 to use current column.
  // IMGUI_API ImGuiTableColumnFlags TableGetColumnFlags(int column_n = -1);     // return column flags so you can query their Enabled/Visible/Sorted/Hovered status flags. Pass -1 to use current column.
  // IMGUI_API void                  TableSetBgColor(ImGuiTableBgTarget target, ImU32 color, int column_n = -1);  // change the color of a cell, row, or column. See ImGuiTableBgTarget_ flags for details.
  function TableGetColumnCount() { return exports.bind.TableGetColumnCount(); }
  function TableGetColumnIndex() { return exports.bind.TableGetColumnIndex(); }
  function TableGetRowIndex() { return exports.bind.TableGetRowIndex(); }
  function TableGetColumnName(column_n = -1) { return exports.bind.TableGetColumnName(column_n); }
  function TableGetColumnFlags(column_n = -1) { return exports.bind.TableGetColumnFlags(column_n); }
  function TableSetBgColor(target, color, column_n = -1) { exports.bind.TableSetBgColor(target, color, column_n); }
  // Legacy Columns API (2020: prefer using Tables!)
  // - You can also use SameLine(pos_x) to mimic simplified columns.
  // IMGUI_API void          Columns(int count = 1, const char* id = NULL, bool border = true);
  // IMGUI_API void          NextColumn();                                                       // next column, defaults to current row or next row if the current row is finished
  // IMGUI_API int           GetColumnIndex();                                                   // get current column index
  // IMGUI_API float         GetColumnWidth(int column_index = -1);                              // get column width (in pixels). pass -1 to use current column
  // IMGUI_API void          SetColumnWidth(int column_index, float width);                      // set column width (in pixels). pass -1 to use current column
  // IMGUI_API float         GetColumnOffset(int column_index = -1);                             // get position of column line (in pixels, from the left side of the contents region). pass -1 to use current column, otherwise 0..GetColumnsCount() inclusive. column 0 is typically 0.0f
  // IMGUI_API void          SetColumnOffset(int column_index, float offset_x);                  // set position of column line (in pixels, from the left side of the contents region). pass -1 to use current column
  // IMGUI_API int           GetColumnsCount();
  function Columns(count = 1, id = null, border = true) { exports.bind.Columns(count, id, border); }
  function NextColumn() { exports.bind.NextColumn(); }
  function GetColumnIndex() { return exports.bind.GetColumnIndex(); }
  function GetColumnWidth(column_index = -1) { return exports.bind.GetColumnWidth(column_index); }
  function SetColumnWidth(column_index, width) { exports.bind.SetColumnWidth(column_index, width); }
  function GetColumnOffset(column_index = -1) { return exports.bind.GetColumnOffset(column_index); }
  function SetColumnOffset(column_index, offset_x) { exports.bind.SetColumnOffset(column_index, offset_x); }
  function GetColumnsCount() { return exports.bind.GetColumnsCount(); }
  // Tab Bars, Tabs
  // IMGUI_API bool          BeginTabBar(const char* str_id, ImGuiTabBarFlags flags = 0);        // create and append into a TabBar
  // IMGUI_API void          EndTabBar();                                                        // only call EndTabBar() if BeginTabBar() returns true!
  // IMGUI_API bool          BeginTabItem(const char* label, bool* p_open = NULL, ImGuiTabItemFlags flags = 0); // create a Tab. Returns true if the Tab is selected.
  // IMGUI_API void          EndTabItem();                                                       // only call EndTabItem() if BeginTabItem() returns true!
  // IMGUI_API bool          TabItemButton(const char* label, ImGuiTabItemFlags flags = 0);      // create a Tab behaving like a button. return true when clicked. cannot be selected in the tab bar.
  // IMGUI_API void          SetTabItemClosed(const char* tab_or_docked_window_label);           // notify TabBar or Docking system of a closed tab/window ahead (useful to reduce visual flicker on reorderable tab bars). For tab-bar: call after BeginTabBar() and before Tab submissions. Otherwise call with a window name.
  function BeginTabBar(str_id, flags = 0) { return exports.bind.BeginTabBar(str_id, flags); }
  function EndTabBar() { exports.bind.EndTabBar(); }
  function BeginTabItem(label, p_open = null, flags = 0) {
    if (p_open === null) {
      return exports.bind.BeginTabItem(label, null, flags);
    }
    else if (Array.isArray(p_open)) {
      return exports.bind.BeginTabItem(label, p_open, flags);
    }
    else {
      const ref_open = [p_open()];
      const ret = exports.bind.BeginTabItem(label, ref_open, flags);
      p_open(ref_open[0]);
      return ret;
    }
  }
  function EndTabItem() { exports.bind.EndTabItem(); }
  function TabItemButton(label, flags = 0) { return exports.bind.TabItemButton(label, flags); }
  function SetTabItemClosed(tab_or_docked_window_label) { exports.bind.SetTabItemClosed(tab_or_docked_window_label); }
  // Logging/Capture
  // - All text output from the interface can be captured into tty/file/clipboard. By default, tree nodes are automatically opened during logging.
  // IMGUI_API void          LogToTTY(int auto_open_depth = -1);                                 // start logging to tty (stdout)
  // IMGUI_API void          LogToFile(int auto_open_depth = -1, const char* filename = NULL);   // start logging to file
  // IMGUI_API void          LogToClipboard(int auto_open_depth = -1);                           // start logging to OS clipboard
  // IMGUI_API void          LogFinish();                                                        // stop logging (close file, etc.)
  // IMGUI_API void          LogButtons();                                                       // helper to display buttons for logging to tty/file/clipboard
  // IMGUI_API void          LogText(const char* fmt, ...) IM_FMTARGS(1);                        // pass text data straight to log (without being displayed)
  function LogToTTY(max_depth = -1) { exports.bind.LogToTTY(max_depth); }
  function LogToFile(max_depth = -1, filename = null) { exports.bind.LogToFile(max_depth, filename); }
  function LogToClipboard(max_depth = -1) { exports.bind.LogToClipboard(max_depth); }
  function LogFinish() { exports.bind.LogFinish(); }
  function LogButtons() { exports.bind.LogButtons(); }
  function LogText(fmt) { exports.bind.LogText(fmt); }
  // Drag and Drop
  // - If you stop calling BeginDragDropSource() the payload is preserved however it won't have a preview tooltip (we currently display a fallback "..." tooltip as replacement)
  // IMGUI_API bool          BeginDragDropSource(ImGuiDragDropFlags flags = 0);                                      // call when the current item is active. If this return true, you can call SetDragDropPayload() + EndDragDropSource()
  // IMGUI_API bool          SetDragDropPayload(const char* type, const void* data, size_t sz, ImGuiCond cond = 0);  // type is a user defined string of maximum 32 characters. Strings starting with '_' are reserved for dear imgui internal types. Data is copied and held by imgui.
  // IMGUI_API void          EndDragDropSource();                                                                    // only call EndDragDropSource() if BeginDragDropSource() returns true!
  // IMGUI_API bool                  BeginDragDropTarget();                                                          // call after submitting an item that may receive a payload. If this returns true, you can call AcceptDragDropPayload() + EndDragDropTarget()
  // IMGUI_API const ImGuiPayload*   AcceptDragDropPayload(const char* type, ImGuiDragDropFlags flags = 0);          // accept contents of a given type. If ImGuiDragDropFlags_AcceptBeforeDelivery is set you can peek into the payload before the mouse button is released.
  // IMGUI_API void                  EndDragDropTarget();                                                            // only call EndDragDropTarget() if BeginDragDropTarget() returns true!
  // IMGUI_API const ImGuiPayload*   GetDragDropPayload();                                                           // peek directly into the current payload from anywhere. may return NULL. use ImGuiPayload::IsDataType() to test for the payload type.
  const _ImGui_DragDropPayload_data = {};
  function BeginDragDropSource(flags = 0) {
    return exports.bind.BeginDragDropSource(flags);
  }
  function SetDragDropPayload(type, data, cond = 0) {
    _ImGui_DragDropPayload_data[type] = data;
    return exports.bind.SetDragDropPayload(type, data, 0, cond);
  }
  function EndDragDropSource() {
    exports.bind.EndDragDropSource();
  }
  function BeginDragDropTarget() {
    return exports.bind.BeginDragDropTarget();
  }
  function AcceptDragDropPayload(type, flags = 0) {
    const data = _ImGui_DragDropPayload_data[type];
    return exports.bind.AcceptDragDropPayload(type, flags) ? { Data: data } : null;
  }
  function EndDragDropTarget() {
    exports.bind.EndDragDropTarget();
  }
  function GetDragDropPayload() {
    return exports.bind.GetDragDropPayload();
  }
  // Clipping
  // - Mouse hovering is affected by ImGui::PushClipRect() calls, unlike direct calls to ImDrawList::PushClipRect() which are render only.
  // IMGUI_API void          PushClipRect(const ImVec2& clip_rect_min, const ImVec2& clip_rect_max, bool intersect_with_current_clip_rect);
  // IMGUI_API void          PopClipRect();
  function PushClipRect(clip_rect_min, clip_rect_max, intersect_with_current_clip_rect) {
    exports.bind.PushClipRect(clip_rect_min, clip_rect_max, intersect_with_current_clip_rect);
  }
  function PopClipRect() {
    exports.bind.PopClipRect();
  }
  // Focus, Activation
  // - Prefer using "SetItemDefaultFocus()" over "if (IsWindowAppearing()) SetScrollHereY()" when applicable to signify "this is the default item"
  // IMGUI_API void          SetItemDefaultFocus();                                              // make last item the default focused item of a window.
  // IMGUI_API void          SetKeyboardFocusHere(int offset = 0);                               // focus keyboard on the next widget. Use positive 'offset' to access sub components of a multiple component widget. Use -1 to access previous widget.
  function SetItemDefaultFocus() { exports.bind.SetItemDefaultFocus(); }
  function SetKeyboardFocusHere(offset = 0) { exports.bind.SetKeyboardFocusHere(offset); }
  // Item/Widgets Utilities
  // - Most of the functions are referring to the last/previous item we submitted.
  // - See Demo Window under "Widgets->Querying Status" for an interactive visualization of most of those functions.
  // IMGUI_API bool          IsItemHovered(ImGuiHoveredFlags flags = 0);                         // is the last item hovered? (and usable, aka not blocked by a popup, etc.). See ImGuiHoveredFlags for more options.
  // IMGUI_API bool          IsItemActive();                                                     // is the last item active? (e.g. button being held, text field being edited. This will continuously return true while holding mouse button on an item. Items that don't interact will always return false)
  // IMGUI_API bool          IsItemFocused();                                                    // is the last item focused for keyboard/gamepad navigation?
  // IMGUI_API bool          IsItemClicked(ImGuiMouseButton mouse_button = 0);                   // is the last item clicked? (e.g. button/node just clicked on) == IsMouseClicked(mouse_button) && IsItemHovered()
  // IMGUI_API bool          IsItemVisible();                                                    // is the last item visible? (items may be out of sight because of clipping/scrolling)
  // IMGUI_API bool          IsItemEdited();                                                     // did the last item modify its underlying value this frame? or was pressed? This is generally the same as the "bool" return value of many widgets.
  // IMGUI_API bool          IsItemActivated();                                                  // was the last item just made active (item was previously inactive).
  // IMGUI_API bool          IsItemDeactivated();                                                // was the last item just made inactive (item was previously active). Useful for Undo/Redo patterns with widgets that requires continuous editing.
  // IMGUI_API bool          IsItemDeactivatedAfterEdit();                                       // was the last item just made inactive and made a value change when it was active? (e.g. Slider/Drag moved). Useful for Undo/Redo patterns with widgets that requires continuous editing. Note that you may get false positives (some widgets such as Combo()/ListBox()/Selectable() will return true even when clicking an already selected item).
  // IMGUI_API bool          IsItemToggledOpen();                                                // was the last item open state toggled? set by TreeNode().
  // IMGUI_API bool          IsAnyItemHovered();                                                 // is any item hovered?
  // IMGUI_API bool          IsAnyItemActive();                                                  // is any item active?
  // IMGUI_API bool          IsAnyItemFocused();                                                 // is any item focused?
  // IMGUI_API ImVec2        GetItemRectMin();                                                   // get upper-left bounding rectangle of the last item (screen space)
  // IMGUI_API ImVec2        GetItemRectMax();                                                   // get lower-right bounding rectangle of the last item (screen space)
  // IMGUI_API ImVec2        GetItemRectSize();                                                  // get size of last item
  // IMGUI_API void          SetItemAllowOverlap();                                              // allow last item to be overlapped by a subsequent item. sometimes useful with invisible buttons, selectables, etc. to catch unused area.
  function IsItemHovered(flags = 0) { return exports.bind.IsItemHovered(flags); }
  function IsItemActive() { return exports.bind.IsItemActive(); }
  function IsItemFocused() { return exports.bind.IsItemFocused(); }
  function IsItemClicked(mouse_button = 0) { return exports.bind.IsItemClicked(mouse_button); }
  function IsItemVisible() { return exports.bind.IsItemVisible(); }
  function IsItemEdited() { return exports.bind.IsItemEdited(); }
  function IsItemActivated() { return exports.bind.IsItemActivated(); }
  function IsItemDeactivated() { return exports.bind.IsItemDeactivated(); }
  function IsItemDeactivatedAfterEdit() { return exports.bind.IsItemDeactivatedAfterEdit(); }
  function IsItemToggledOpen() { return exports.bind.IsItemToggledOpen(); }
  function IsAnyItemHovered() { return exports.bind.IsAnyItemHovered(); }
  function IsAnyItemActive() { return exports.bind.IsAnyItemActive(); }
  function IsAnyItemFocused() { return exports.bind.IsAnyItemFocused(); }
  function GetItemRectMin(out = new ImVec2()) { return exports.bind.GetItemRectMin(out); }
  function GetItemRectMax(out = new ImVec2()) { return exports.bind.GetItemRectMax(out); }
  function GetItemRectSize(out = new ImVec2()) { return exports.bind.GetItemRectSize(out); }
  function SetItemAllowOverlap() { exports.bind.SetItemAllowOverlap(); }
  function IsRectVisible(...args) {
    if (args.length === 1) {
      const size = args[0];
      return exports.bind.IsRectVisible_A(size);
    }
    else {
      const rect_min = args[0];
      const rect_max = args[1];
      return exports.bind.IsRectVisible_B(rect_min, rect_max);
    }
  }
  function GetTime() { return exports.bind.GetTime(); }
  function GetFrameCount() { return exports.bind.GetFrameCount(); }
  function GetBackgroundDrawList() {
    return new ImDrawList(exports.bind.GetBackgroundDrawList());
  }
  function GetForegroundDrawList() {
    return new ImDrawList(exports.bind.GetForegroundDrawList());
  }
  function GetDrawListSharedData() {
    return new ImDrawListSharedData(exports.bind.GetDrawListSharedData());
  }
  function GetStyleColorName(idx) { return exports.bind.GetStyleColorName(idx); }
  // IMGUI_API void          SetStateStorage(ImGuiStorage* tree);
  // IMGUI_API ImGuiStorage* GetStateStorage();
  function CalcListClipping(items_count, items_height, out_items_display_start, out_items_display_end) {
    return exports.bind.CalcListClipping(items_count, items_height, out_items_display_start, out_items_display_end);
  }
  function BeginChildFrame(id, size, flags = 0) { return exports.bind.BeginChildFrame(id, size, flags); }
  function EndChildFrame() { exports.bind.EndChildFrame(); }
  // Text Utilities
  // IMGUI_API ImVec2        CalcTextSize(const char* text, const char* text_end = NULL, bool hide_text_after_double_hash = false, float wrap_width = -1.0f);
  function CalcTextSize(text, text_end = null, hide_text_after_double_hash = false, wrap_width = -1, out = new ImVec2()) {
    return exports.bind.CalcTextSize(text_end !== null ? text.substring(0, text_end) : text, hide_text_after_double_hash, wrap_width, out);
  }
  // Color Utilities
  // IMGUI_API ImVec4        ColorConvertU32ToFloat4(ImU32 in);
  // IMGUI_API ImU32         ColorConvertFloat4ToU32(const ImVec4& in);
  // IMGUI_API void          ColorConvertRGBtoHSV(float r, float g, float b, float& out_h, float& out_s, float& out_v);
  // IMGUI_API void          ColorConvertHSVtoRGB(float h, float s, float v, float& out_r, float& out_g, float& out_b);
  function ColorConvertU32ToFloat4(in_, out = new ImVec4()) { return exports.bind.ColorConvertU32ToFloat4(in_, out); }
  function ColorConvertFloat4ToU32(in_) { return exports.bind.ColorConvertFloat4ToU32(in_); }
  function ColorConvertRGBtoHSV(r, g, b, out_h, out_s, out_v) { exports.bind.ColorConvertRGBtoHSV(r, g, b, out_h, out_s, out_v); }
  function ColorConvertHSVtoRGB(h, s, v, out_r, out_g, out_b) { exports.bind.ColorConvertHSVtoRGB(h, s, v, out_r, out_g, out_b); }
  // Inputs Utilities: Keyboard
  // - For 'int user_key_index' you can use your own indices/enums according to how your backend/engine stored them in io.KeysDown[].
  // - We don't know the meaning of those value. You can use GetKeyIndex() to map a ImGuiKey_ value into the user index.
  // IMGUI_API int           GetKeyIndex(ImGuiKey imgui_key);                                    // map ImGuiKey_* values into user's key index. == io.KeyMap[key]
  // IMGUI_API bool          IsKeyDown(int user_key_index);                                      // is key being held. == io.KeysDown[user_key_index].
  // IMGUI_API bool          IsKeyPressed(int user_key_index, bool repeat = true);               // was key pressed (went from !Down to Down)? if repeat=true, uses io.KeyRepeatDelay / KeyRepeatRate
  // IMGUI_API bool          IsKeyReleased(int user_key_index);                                  // was key released (went from Down to !Down)?
  // IMGUI_API int           GetKeyPressedAmount(int key_index, float repeat_delay, float rate); // uses provided repeat rate/delay. return a count, most often 0 or 1 but might be >1 if RepeatRate is small enough that DeltaTime > RepeatRate
  // IMGUI_API void          CaptureKeyboardFromApp(bool want_capture_keyboard_value = true);    // attention: misleading name! manually override io.WantCaptureKeyboard flag next frame (said flag is entirely left for your application to handle). e.g. force capture keyboard when your widget is being hovered. This is equivalent to setting "io.WantCaptureKeyboard = want_capture_keyboard_value"; after the next NewFrame() call.
  function GetKeyIndex(imgui_key) { return exports.bind.GetKeyIndex(imgui_key); }
  function IsKeyDown(user_key_index) { return exports.bind.IsKeyDown(user_key_index); }
  function IsKeyPressed(user_key_index, repeat = true) { return exports.bind.IsKeyPressed(user_key_index, repeat); }
  function IsKeyReleased(user_key_index) { return exports.bind.IsKeyReleased(user_key_index); }
  function GetKeyPressedAmount(user_key_index, repeat_delay, rate) { return exports.bind.GetKeyPressedAmount(user_key_index, repeat_delay, rate); }
  function CaptureKeyboardFromApp(capture = true) { return exports.bind.CaptureKeyboardFromApp(capture); }
  // Inputs Utilities: Mouse
  // - To refer to a mouse button, you may use named enums in your code e.g. ImGuiMouseButton_Left, ImGuiMouseButton_Right.
  // - You can also use regular integer: it is forever guaranteed that 0=Left, 1=Right, 2=Middle.
  // - Dragging operations are only reported after mouse has moved a certain distance away from the initial clicking position (see 'lock_threshold' and 'io.MouseDraggingThreshold')
  // IMGUI_API bool          IsMouseDown(ImGuiMouseButton button);                               // is mouse button held?
  // IMGUI_API bool          IsMouseClicked(ImGuiMouseButton button, bool repeat = false);       // did mouse button clicked? (went from !Down to Down)
  // IMGUI_API bool          IsMouseReleased(ImGuiMouseButton button);                           // did mouse button released? (went from Down to !Down)
  // IMGUI_API bool          IsMouseDoubleClicked(ImGuiMouseButton button);                      // did mouse button double-clicked? (note that a double-click will also report IsMouseClicked() == true)
  // IMGUI_API bool          IsMouseHoveringRect(const ImVec2& r_min, const ImVec2& r_max, bool clip = true);// is mouse hovering given bounding rect (in screen space). clipped by current clipping settings, but disregarding of other consideration of focus/window ordering/popup-block.
  // IMGUI_API bool          IsMousePosValid(const ImVec2* mouse_pos = NULL);                    // by convention we use (-FLT_MAX,-FLT_MAX) to denote that there is no mouse available
  // IMGUI_API bool          IsAnyMouseDown();                                                   // is any mouse button held?
  // IMGUI_API ImVec2        GetMousePos();                                                      // shortcut to ImGui::GetIO().MousePos provided by user, to be consistent with other calls
  // IMGUI_API ImVec2        GetMousePosOnOpeningCurrentPopup();                                 // retrieve mouse position at the time of opening popup we have BeginPopup() into (helper to avoid user backing that value themselves)
  // IMGUI_API bool          IsMouseDragging(ImGuiMouseButton button, float lock_threshold = -1.0f);         // is mouse dragging? (if lock_threshold < -1.0f, uses io.MouseDraggingThreshold)
  // IMGUI_API ImVec2        GetMouseDragDelta(ImGuiMouseButton button = 0, float lock_threshold = -1.0f);   // return the delta from the initial clicking position while the mouse button is pressed or was just released. This is locked and return 0.0f until the mouse moves past a distance threshold at least once (if lock_threshold < -1.0f, uses io.MouseDraggingThreshold)
  // IMGUI_API void          ResetMouseDragDelta(ImGuiMouseButton button = 0);                   //
  // IMGUI_API ImGuiMouseCursor GetMouseCursor();                                                // get desired cursor type, reset in ImGui::NewFrame(), this is updated during the frame. valid before Render(). If you use software rendering by setting io.MouseDrawCursor ImGui will render those for you
  // IMGUI_API void          SetMouseCursor(ImGuiMouseCursor cursor_type);                       // set desired cursor type
  // IMGUI_API void          CaptureMouseFromApp(bool want_capture_mouse_value = true);          // attention: misleading name! manually override io.WantCaptureMouse flag next frame (said flag is entirely left for your application to handle). This is equivalent to setting "io.WantCaptureMouse = want_capture_mouse_value;" after the next NewFrame() call.
  function IsMouseDown(button) { return exports.bind.IsMouseDown(button); }
  function IsMouseClicked(button, repeat = false) { return exports.bind.IsMouseClicked(button, repeat); }
  function IsMouseDoubleClicked(button) { return exports.bind.IsMouseDoubleClicked(button); }
  function IsMouseReleased(button) { return exports.bind.IsMouseReleased(button); }
  function IsMouseHoveringRect(r_min, r_max, clip = true) { return exports.bind.IsMouseHoveringRect(r_min, r_max, clip); }
  function IsMousePosValid(mouse_pos = null) { return exports.bind.IsMousePosValid(mouse_pos); }
  function IsAnyMouseDown() { return exports.bind.IsAnyMouseDown(); }
  function GetMousePos(out = new ImVec2()) { return exports.bind.GetMousePos(out); }
  function GetMousePosOnOpeningCurrentPopup(out = new ImVec2()) { return exports.bind.GetMousePosOnOpeningCurrentPopup(out); }
  function IsMouseDragging(button = 0, lock_threshold = -1.0) { return exports.bind.IsMouseDragging(button, lock_threshold); }
  function GetMouseDragDelta(button = 0, lock_threshold = -1.0, out = new ImVec2()) { return exports.bind.GetMouseDragDelta(button, lock_threshold, out); }
  function ResetMouseDragDelta(button = 0) { exports.bind.ResetMouseDragDelta(button); }
  function GetMouseCursor() { return exports.bind.GetMouseCursor(); }
  function SetMouseCursor(type) { exports.bind.SetMouseCursor(type); }
  function CaptureMouseFromApp(capture = true) { exports.bind.CaptureMouseFromApp(capture); }
  // Clipboard Utilities
  // - Also see the LogToClipboard() function to capture GUI into clipboard, or easily output text data to the clipboard.
  // IMGUI_API const char*   GetClipboardText();
  // IMGUI_API void          SetClipboardText(const char* text);
  function GetClipboardText() { return exports.bind.GetClipboardText(); }
  function SetClipboardText(text) { exports.bind.SetClipboardText(text); }
  // Settings/.Ini Utilities
  // - The disk functions are automatically called if io.IniFilename != NULL (default is "imgui.ini").
  // - Set io.IniFilename to NULL to load/save manually. Read io.WantSaveIniSettings description about handling .ini saving manually.
  // IMGUI_API void          LoadIniSettingsFromDisk(const char* ini_filename);                  // call after CreateContext() and before the first call to NewFrame(). NewFrame() automatically calls LoadIniSettingsFromDisk(io.IniFilename).
  // IMGUI_API void          LoadIniSettingsFromMemory(const char* ini_data, size_t ini_size=0); // call after CreateContext() and before the first call to NewFrame() to provide .ini data from your own data source.
  // IMGUI_API void          SaveIniSettingsToDisk(const char* ini_filename);                    // this is automatically called (if io.IniFilename is not empty) a few seconds after any modification that should be reflected in the .ini file (and also by DestroyContext).
  // IMGUI_API const char*   SaveIniSettingsToMemory(size_t* out_ini_size = NULL);               // return a zero-terminated string with the .ini data which you can save by your own mean. call when io.WantSaveIniSettings is set, then save data by your own mean and clear io.WantSaveIniSettings.
  function LoadIniSettingsFromDisk(ini_filename) { throw new Error(); } // TODO
  function LoadIniSettingsFromMemory(ini_data, ini_size = 0) { exports.bind.LoadIniSettingsFromMemory(ini_data); }
  function SaveIniSettingsToDisk(ini_filename) { throw new Error(); } // TODO
  function SaveIniSettingsToMemory(out_ini_size = null) { return exports.bind.SaveIniSettingsToMemory(); }
  // Debug Utilities
  // IMGUI_API bool          DebugCheckVersionAndDataLayout(const char* version_str, size_t sz_io, size_t sz_style, size_t sz_vec2, size_t sz_vec4, size_t sz_drawvert, size_t sz_drawidx); // This is called by IMGUI_CHECKVERSION() macro.
  function DebugCheckVersionAndDataLayout(version_str, sz_io, sz_style, sz_vec2, sz_vec4, sz_draw_vert, sz_draw_idx) {
    return exports.bind.DebugCheckVersionAndDataLayout(version_str, sz_io, sz_style, sz_vec2, sz_vec4, sz_draw_vert, sz_draw_idx);
  }
  // Memory Allocators
  // - All those functions are not reliant on the current context.
  // - If you reload the contents of imgui.cpp at runtime, you may need to call SetCurrentContext() + SetAllocatorFunctions() again because we use global storage for those.
  // IMGUI_API void          SetAllocatorFunctions(void* (*alloc_func)(size_t sz, void* user_data), void (*free_func)(void* ptr, void* user_data), void* user_data = NULL);
  // IMGUI_API void*         MemAlloc(size_t size);
  // IMGUI_API void          MemFree(void* ptr);
  function SetAllocatorFunctions(alloc_func, free_func, user_data = null) {
    exports.bind.SetAllocatorFunctions(alloc_func, free_func, user_data);
  }
  function MemAlloc(sz) { exports.bind.MemAlloc(sz); }
  function MemFree(ptr) { exports.bind.MemFree(ptr); }

  exports.ARRAYSIZE = IM_ARRAYSIZE;
  exports.ASSERT = ASSERT;
  exports.AcceptDragDropPayload = AcceptDragDropPayload;
  exports.AlignTextToFramePadding = AlignTextToFramePadding;
  exports.ArrowButton = ArrowButton;
  exports.BackendFlags = exports.ImGuiBackendFlags;
  exports.Begin = Begin;
  exports.BeginChild = BeginChild;
  exports.BeginChildFrame = BeginChildFrame;
  exports.BeginCombo = BeginCombo;
  exports.BeginDragDropSource = BeginDragDropSource;
  exports.BeginDragDropTarget = BeginDragDropTarget;
  exports.BeginGroup = BeginGroup;
  exports.BeginMainMenuBar = BeginMainMenuBar;
  exports.BeginMenu = BeginMenu;
  exports.BeginMenuBar = BeginMenuBar;
  exports.BeginPopup = BeginPopup;
  exports.BeginPopupContextItem = BeginPopupContextItem;
  exports.BeginPopupContextVoid = BeginPopupContextVoid;
  exports.BeginPopupContextWindow = BeginPopupContextWindow;
  exports.BeginPopupModal = BeginPopupModal;
  exports.BeginTabBar = BeginTabBar;
  exports.BeginTabItem = BeginTabItem;
  exports.BeginTable = BeginTable;
  exports.BeginTooltip = BeginTooltip;
  exports.Bind = bindImgui$1;
  exports.Bullet = Bullet;
  exports.BulletText = BulletText;
  exports.Button = Button;
  exports.ButtonFlags = exports.ImGuiButtonFlags;
  exports.CHECKVERSION = IMGUI_CHECKVERSION;
  exports.COL32 = IM_COL32;
  exports.COL32_BLACK = IM_COL32_BLACK;
  exports.COL32_BLACK_TRANS = IM_COL32_BLACK_TRANS;
  exports.COL32_WHITE = IM_COL32_WHITE;
  exports.CalcItemWidth = CalcItemWidth;
  exports.CalcListClipping = CalcListClipping;
  exports.CalcTextSize = CalcTextSize;
  exports.CaptureKeyboardFromApp = CaptureKeyboardFromApp;
  exports.CaptureMouseFromApp = CaptureMouseFromApp;
  exports.Checkbox = Checkbox;
  exports.CheckboxFlags = CheckboxFlags;
  exports.CloseCurrentPopup = CloseCurrentPopup;
  exports.Col = exports.ImGuiCol;
  exports.CollapsingHeader = CollapsingHeader;
  exports.Color = ImColor;
  exports.ColorButton = ColorButton;
  exports.ColorConvertFloat4ToU32 = ColorConvertFloat4ToU32;
  exports.ColorConvertHSVtoRGB = ColorConvertHSVtoRGB;
  exports.ColorConvertRGBtoHSV = ColorConvertRGBtoHSV;
  exports.ColorConvertU32ToFloat4 = ColorConvertU32ToFloat4;
  exports.ColorEdit3 = ColorEdit3;
  exports.ColorEdit4 = ColorEdit4;
  exports.ColorEditFlags = exports.ImGuiColorEditFlags;
  exports.ColorPicker3 = ColorPicker3;
  exports.ColorPicker4 = ColorPicker4;
  exports.Columns = Columns;
  exports.Combo = Combo;
  exports.ComboFlags = exports.ImGuiComboFlags;
  exports.Cond = exports.ImGuiCond;
  exports.ConfigFlags = exports.ImGuiConfigFlags;
  exports.CreateContext = CreateContext;
  exports.DataType = exports.ImGuiDataType;
  exports.DebugCheckVersionAndDataLayout = DebugCheckVersionAndDataLayout;
  exports.DestroyContext = DestroyContext;
  exports.Dir = exports.ImGuiDir;
  exports.DragDropFlags = exports.ImGuiDragDropFlags;
  exports.DragFloat = DragFloat;
  exports.DragFloat2 = DragFloat2;
  exports.DragFloat3 = DragFloat3;
  exports.DragFloat4 = DragFloat4;
  exports.DragFloatRange2 = DragFloatRange2;
  exports.DragInt = DragInt;
  exports.DragInt2 = DragInt2;
  exports.DragInt3 = DragInt3;
  exports.DragInt4 = DragInt4;
  exports.DragIntRange2 = DragIntRange2;
  exports.DragScalar = DragScalar;
  exports.DrawCmd = ImDrawCmd;
  exports.DrawCornerFlags = exports.ImDrawCornerFlags;
  exports.DrawData = ImDrawData;
  exports.DrawIdxSize = ImDrawIdxSize;
  exports.DrawList = ImDrawList;
  exports.DrawVert = ImDrawVert;
  exports.DrawVertColOffset = ImDrawVertColOffset;
  exports.DrawVertPosOffset = ImDrawVertPosOffset;
  exports.DrawVertSize = ImDrawVertSize;
  exports.DrawVertUVOffset = ImDrawVertUVOffset;
  exports.Dummy = Dummy;
  exports.End = End;
  exports.EndChild = EndChild;
  exports.EndChildFrame = EndChildFrame;
  exports.EndCombo = EndCombo;
  exports.EndDragDropSource = EndDragDropSource;
  exports.EndDragDropTarget = EndDragDropTarget;
  exports.EndFrame = EndFrame;
  exports.EndGroup = EndGroup;
  exports.EndMainMenuBar = EndMainMenuBar;
  exports.EndMenu = EndMenu;
  exports.EndMenuBar = EndMenuBar;
  exports.EndPopup = EndPopup;
  exports.EndTabBar = EndTabBar;
  exports.EndTabItem = EndTabItem;
  exports.EndTable = EndTable;
  exports.EndTooltip = EndTooltip;
  exports.FocusedFlags = exports.ImGuiFocusedFlags;
  exports.Font = ImFont;
  exports.FontAtlas = ImFontAtlas;
  exports.FontAtlasFlags = exports.ImFontAtlasFlags;
  exports.FontConfig = ImFontConfig;
  exports.FontGlyph = ImFontGlyph;
  exports.GetBackgroundDrawList = GetBackgroundDrawList;
  exports.GetClipboardText = GetClipboardText;
  exports.GetColorU32 = GetColorU32;
  exports.GetColumnIndex = GetColumnIndex;
  exports.GetColumnOffset = GetColumnOffset;
  exports.GetColumnWidth = GetColumnWidth;
  exports.GetColumnsCount = GetColumnsCount;
  exports.GetContentRegionAvail = GetContentRegionAvail;
  exports.GetContentRegionMax = GetContentRegionMax;
  exports.GetCurrentContext = GetCurrentContext;
  exports.GetCursorPos = GetCursorPos;
  exports.GetCursorPosX = GetCursorPosX;
  exports.GetCursorPosY = GetCursorPosY;
  exports.GetCursorScreenPos = GetCursorScreenPos;
  exports.GetCursorStartPos = GetCursorStartPos;
  exports.GetDragDropPayload = GetDragDropPayload;
  exports.GetDrawData = GetDrawData;
  exports.GetDrawListSharedData = GetDrawListSharedData;
  exports.GetFont = GetFont;
  exports.GetFontSize = GetFontSize;
  exports.GetFontTexUvWhitePixel = GetFontTexUvWhitePixel;
  exports.GetForegroundDrawList = GetForegroundDrawList;
  exports.GetFrameCount = GetFrameCount;
  exports.GetFrameHeight = GetFrameHeight;
  exports.GetFrameHeightWithSpacing = GetFrameHeightWithSpacing;
  exports.GetID = GetID;
  exports.GetIO = GetIO;
  exports.GetItemRectMax = GetItemRectMax;
  exports.GetItemRectMin = GetItemRectMin;
  exports.GetItemRectSize = GetItemRectSize;
  exports.GetKeyIndex = GetKeyIndex;
  exports.GetKeyPressedAmount = GetKeyPressedAmount;
  exports.GetMouseCursor = GetMouseCursor;
  exports.GetMouseDragDelta = GetMouseDragDelta;
  exports.GetMousePos = GetMousePos;
  exports.GetMousePosOnOpeningCurrentPopup = GetMousePosOnOpeningCurrentPopup;
  exports.GetScrollMaxX = GetScrollMaxX;
  exports.GetScrollMaxY = GetScrollMaxY;
  exports.GetScrollX = GetScrollX;
  exports.GetScrollY = GetScrollY;
  exports.GetStyle = GetStyle;
  exports.GetStyleColorName = GetStyleColorName;
  exports.GetStyleColorVec4 = GetStyleColorVec4;
  exports.GetTextLineHeight = GetTextLineHeight;
  exports.GetTextLineHeightWithSpacing = GetTextLineHeightWithSpacing;
  exports.GetTime = GetTime;
  exports.GetTreeNodeToLabelSpacing = GetTreeNodeToLabelSpacing;
  exports.GetVersion = GetVersion;
  exports.GetWindowContentRegionMax = GetWindowContentRegionMax;
  exports.GetWindowContentRegionMin = GetWindowContentRegionMin;
  exports.GetWindowContentRegionWidth = GetWindowContentRegionWidth;
  exports.GetWindowDrawList = GetWindowDrawList;
  exports.GetWindowHeight = GetWindowHeight;
  exports.GetWindowPos = GetWindowPos;
  exports.GetWindowSize = GetWindowSize;
  exports.GetWindowWidth = GetWindowWidth;
  exports.HoveredFlags = exports.ImGuiHoveredFlags;
  exports.IMGUI_CHECKVERSION = IMGUI_CHECKVERSION;
  exports.IMGUI_HAS_TABLE = IMGUI_HAS_TABLE;
  exports.IMGUI_PAYLOAD_TYPE_COLOR_3F = IMGUI_PAYLOAD_TYPE_COLOR_3F;
  exports.IMGUI_PAYLOAD_TYPE_COLOR_4F = IMGUI_PAYLOAD_TYPE_COLOR_4F;
  exports.IMGUI_VERSION = IMGUI_VERSION;
  exports.IMGUI_VERSION_NUM = IMGUI_VERSION_NUM;
  exports.IM_ARRAYSIZE = IM_ARRAYSIZE;
  exports.IM_ASSERT = IM_ASSERT;
  exports.IM_COL32 = IM_COL32;
  exports.IM_COL32_A_MASK = IM_COL32_A_MASK;
  exports.IM_COL32_A_SHIFT = IM_COL32_A_SHIFT;
  exports.IM_COL32_BLACK = IM_COL32_BLACK;
  exports.IM_COL32_BLACK_TRANS = IM_COL32_BLACK_TRANS;
  exports.IM_COL32_B_SHIFT = IM_COL32_B_SHIFT;
  exports.IM_COL32_G_SHIFT = IM_COL32_G_SHIFT;
  exports.IM_COL32_R_SHIFT = IM_COL32_R_SHIFT;
  exports.IM_COL32_WHITE = IM_COL32_WHITE;
  exports.IM_DRAWLIST_TEX_LINES_WIDTH_MAX = IM_DRAWLIST_TEX_LINES_WIDTH_MAX;
  exports.IM_UNICODE_CODEPOINT_MAX = IM_UNICODE_CODEPOINT_MAX;
  exports.IO = ImGuiIO;
  exports.ImColor = ImColor;
  exports.ImDrawCallback_ResetRenderState = ImDrawCallback_ResetRenderState;
  exports.ImDrawChannel = ImDrawChannel;
  exports.ImDrawCmd = ImDrawCmd;
  exports.ImDrawCmdHeader = ImDrawCmdHeader;
  exports.ImDrawData = ImDrawData;
  exports.ImDrawIdxSize = ImDrawIdxSize;
  exports.ImDrawList = ImDrawList;
  exports.ImDrawListFlags = exports.wListFlags;
  exports.ImDrawListSharedData = ImDrawListSharedData;
  exports.ImDrawVert = ImDrawVert;
  exports.ImDrawVertColOffset = ImDrawVertColOffset;
  exports.ImDrawVertPosOffset = ImDrawVertPosOffset;
  exports.ImDrawVertSize = ImDrawVertSize;
  exports.ImDrawVertUVOffset = ImDrawVertUVOffset;
  exports.ImFont = ImFont;
  exports.ImFontAtlas = ImFontAtlas;
  exports.ImFontAtlasCustomRect = ImFontAtlasCustomRect;
  exports.ImFontConfig = ImFontConfig;
  exports.ImFontGlyph = ImFontGlyph;
  exports.ImGuiContext = ImGuiContext;
  exports.ImGuiIO = ImGuiIO;
  exports.ImGuiInputTextCallbackData = ImGuiInputTextCallbackData;
  exports.ImGuiInputTextDefaultSize = ImGuiInputTextDefaultSize;
  exports.ImGuiInputTextFlags = exports.InputTextFlags;
  exports.ImGuiKey = exports.Key;
  exports.ImGuiKeyModFlags = exports.KeyModFlags;
  exports.ImGuiListClipper = ImGuiListClipper;
  exports.ImGuiMouseButton = exports.MouseButton;
  exports.ImGuiMouseCursor = exports.MouseCursor;
  exports.ImGuiNavInput = exports.NavInput;
  exports.ImGuiPopupFlags = exports.PopupFlags;
  exports.ImGuiSelectableFlags = exports.SelectableFlags;
  exports.ImGuiSizeCallbackData = ImGuiSizeCallbackData;
  exports.ImGuiSliderFlags = exports.SliderFlags;
  exports.ImGuiSortDirection = exports.SortDirection;
  exports.ImGuiStorage = ImGuiStorage;
  exports.ImGuiStyle = ImGuiStyle;
  exports.ImGuiStyleVar = exports.StyleVar;
  exports.ImGuiTabBarFlags = exports.TabBarFlags;
  exports.ImGuiTabItemFlags = exports.TabItemFlags;
  exports.ImGuiTableBgTarget = exports.TableBgTarget;
  exports.ImGuiTableColumnFlags = exports.TableColumnFlags;
  exports.ImGuiTableColumnSortSpecs = ImGuiTableColumnSortSpecs;
  exports.ImGuiTableFlags = exports.TableFlags;
  exports.ImGuiTableRowFlags = exports.TableRowFlags;
  exports.ImGuiTableSortSpecs = ImGuiTableSortSpecs;
  exports.ImGuiTextBuffer = ImGuiTextBuffer;
  exports.ImGuiTextFilter = ImGuiTextFilter;
  exports.ImGuiTreeNodeFlags = exports.TreeNodeFlags;
  exports.ImGuiWindowFlags = exports.WindowFlags;
  exports.ImStringBuffer = ImStringBuffer;
  exports.ImVec2 = ImVec2;
  exports.ImVec4 = ImVec4;
  exports.ImVector = ImVector;
  exports.Image = Image;
  exports.ImageButton = ImageButton;
  exports.Indent = Indent;
  exports.InputDouble = InputDouble;
  exports.InputFloat = InputFloat;
  exports.InputFloat2 = InputFloat2;
  exports.InputFloat3 = InputFloat3;
  exports.InputFloat4 = InputFloat4;
  exports.InputInt = InputInt;
  exports.InputInt2 = InputInt2;
  exports.InputInt3 = InputInt3;
  exports.InputInt4 = InputInt4;
  exports.InputScalar = InputScalar;
  exports.InputText = InputText;
  exports.InputTextCallbackData = ImGuiInputTextCallbackData;
  exports.InputTextDefaultSize = ImGuiInputTextDefaultSize;
  exports.InputTextMultiline = InputTextMultiline;
  exports.InputTextWithHint = InputTextWithHint;
  exports.InvisibleButton = InvisibleButton;
  exports.IsAnyItemActive = IsAnyItemActive;
  exports.IsAnyItemFocused = IsAnyItemFocused;
  exports.IsAnyItemHovered = IsAnyItemHovered;
  exports.IsAnyMouseDown = IsAnyMouseDown;
  exports.IsItemActivated = IsItemActivated;
  exports.IsItemActive = IsItemActive;
  exports.IsItemClicked = IsItemClicked;
  exports.IsItemDeactivated = IsItemDeactivated;
  exports.IsItemDeactivatedAfterEdit = IsItemDeactivatedAfterEdit;
  exports.IsItemEdited = IsItemEdited;
  exports.IsItemFocused = IsItemFocused;
  exports.IsItemHovered = IsItemHovered;
  exports.IsItemToggledOpen = IsItemToggledOpen;
  exports.IsItemVisible = IsItemVisible;
  exports.IsKeyDown = IsKeyDown;
  exports.IsKeyPressed = IsKeyPressed;
  exports.IsKeyReleased = IsKeyReleased;
  exports.IsMouseClicked = IsMouseClicked;
  exports.IsMouseDoubleClicked = IsMouseDoubleClicked;
  exports.IsMouseDown = IsMouseDown;
  exports.IsMouseDragging = IsMouseDragging;
  exports.IsMouseHoveringRect = IsMouseHoveringRect;
  exports.IsMousePosValid = IsMousePosValid;
  exports.IsMouseReleased = IsMouseReleased;
  exports.IsPopupOpen = IsPopupOpen;
  exports.IsRectVisible = IsRectVisible;
  exports.IsWindowAppearing = IsWindowAppearing;
  exports.IsWindowCollapsed = IsWindowCollapsed;
  exports.IsWindowFocused = IsWindowFocused;
  exports.IsWindowHovered = IsWindowHovered;
  exports.LabelText = LabelText;
  exports.ListBox = ListBox;
  exports.ListBoxFooter = ListBoxFooter;
  exports.ListBoxHeader = ListBoxHeader;
  exports.ListClipper = ImGuiListClipper;
  exports.LoadIniSettingsFromDisk = LoadIniSettingsFromDisk;
  exports.LoadIniSettingsFromMemory = LoadIniSettingsFromMemory;
  exports.LogButtons = LogButtons;
  exports.LogFinish = LogFinish;
  exports.LogText = LogText;
  exports.LogToClipboard = LogToClipboard;
  exports.LogToFile = LogToFile;
  exports.LogToTTY = LogToTTY;
  exports.MemAlloc = MemAlloc;
  exports.MemFree = MemFree;
  exports.MenuItem = MenuItem;
  exports.NewFrame = NewFrame;
  exports.NewLine = NewLine;
  exports.NextColumn = NextColumn;
  exports.OpenPopup = OpenPopup;
  exports.OpenPopupOnItemClick = OpenPopupOnItemClick;
  exports.PlotHistogram = PlotHistogram;
  exports.PlotLines = PlotLines;
  exports.PopAllowKeyboardFocus = PopAllowKeyboardFocus;
  exports.PopButtonRepeat = PopButtonRepeat;
  exports.PopClipRect = PopClipRect;
  exports.PopFont = PopFont;
  exports.PopID = PopID;
  exports.PopItemWidth = PopItemWidth;
  exports.PopStyleColor = PopStyleColor;
  exports.PopStyleVar = PopStyleVar;
  exports.PopTextWrapPos = PopTextWrapPos;
  exports.ProgressBar = ProgressBar;
  exports.PushAllowKeyboardFocus = PushAllowKeyboardFocus;
  exports.PushButtonRepeat = PushButtonRepeat;
  exports.PushClipRect = PushClipRect;
  exports.PushFont = PushFont;
  exports.PushID = PushID;
  exports.PushItemWidth = PushItemWidth;
  exports.PushStyleColor = PushStyleColor;
  exports.PushStyleVar = PushStyleVar;
  exports.PushTextWrapPos = PushTextWrapPos;
  exports.RadioButton = RadioButton;
  exports.Render = Render;
  exports.ResetMouseDragDelta = ResetMouseDragDelta;
  exports.SameLine = SameLine;
  exports.SaveIniSettingsToDisk = SaveIniSettingsToDisk;
  exports.SaveIniSettingsToMemory = SaveIniSettingsToMemory;
  exports.Selectable = Selectable;
  exports.Separator = Separator;
  exports.SetAllocatorFunctions = SetAllocatorFunctions;
  exports.SetClipboardText = SetClipboardText;
  exports.SetColorEditOptions = SetColorEditOptions;
  exports.SetColumnOffset = SetColumnOffset;
  exports.SetColumnWidth = SetColumnWidth;
  exports.SetCurrentContext = SetCurrentContext;
  exports.SetCursorPos = SetCursorPos;
  exports.SetCursorPosX = SetCursorPosX;
  exports.SetCursorPosY = SetCursorPosY;
  exports.SetCursorScreenPos = SetCursorScreenPos;
  exports.SetDragDropPayload = SetDragDropPayload;
  exports.SetItemAllowOverlap = SetItemAllowOverlap;
  exports.SetItemDefaultFocus = SetItemDefaultFocus;
  exports.SetKeyboardFocusHere = SetKeyboardFocusHere;
  exports.SetMouseCursor = SetMouseCursor;
  exports.SetNextItemOpen = SetNextItemOpen;
  exports.SetNextItemWidth = SetNextItemWidth;
  exports.SetNextWindowBgAlpha = SetNextWindowBgAlpha;
  exports.SetNextWindowCollapsed = SetNextWindowCollapsed;
  exports.SetNextWindowContentSize = SetNextWindowContentSize;
  exports.SetNextWindowFocus = SetNextWindowFocus;
  exports.SetNextWindowPos = SetNextWindowPos;
  exports.SetNextWindowSize = SetNextWindowSize;
  exports.SetNextWindowSizeConstraints = SetNextWindowSizeConstraints;
  exports.SetScrollFromPosX = SetScrollFromPosX;
  exports.SetScrollFromPosY = SetScrollFromPosY;
  exports.SetScrollHereX = SetScrollHereX;
  exports.SetScrollHereY = SetScrollHereY;
  exports.SetScrollX = SetScrollX;
  exports.SetScrollY = SetScrollY;
  exports.SetTabItemClosed = SetTabItemClosed;
  exports.SetTooltip = SetTooltip;
  exports.SetWindowCollapsed = SetWindowCollapsed;
  exports.SetWindowFocus = SetWindowFocus;
  exports.SetWindowFontScale = SetWindowFontScale;
  exports.SetWindowPos = SetWindowPos;
  exports.SetWindowSize = SetWindowSize;
  exports.ShowAboutWindow = ShowAboutWindow;
  exports.ShowDemoWindow = ShowDemoWindow;
  exports.ShowFontSelector = ShowFontSelector;
  exports.ShowMetricsWindow = ShowMetricsWindow;
  exports.ShowStyleEditor = ShowStyleEditor;
  exports.ShowStyleSelector = ShowStyleSelector;
  exports.ShowUserGuide = ShowUserGuide;
  exports.SizeCallbackData = ImGuiSizeCallbackData;
  exports.SliderAngle = SliderAngle;
  exports.SliderAngle3 = SliderAngle3;
  exports.SliderFloat = SliderFloat;
  exports.SliderFloat2 = SliderFloat2;
  exports.SliderFloat3 = SliderFloat3;
  exports.SliderFloat4 = SliderFloat4;
  exports.SliderInt = SliderInt;
  exports.SliderInt2 = SliderInt2;
  exports.SliderInt3 = SliderInt3;
  exports.SliderInt4 = SliderInt4;
  exports.SliderScalar = SliderScalar;
  exports.SmallButton = SmallButton;
  exports.Spacing = Spacing;
  exports.StringBuffer = ImStringBuffer;
  exports.Style = ImGuiStyle;
  exports.StyleColorsClassic = StyleColorsClassic;
  exports.StyleColorsDark = StyleColorsDark;
  exports.StyleColorsLight = StyleColorsLight;
  exports.TabItemButton = TabItemButton;
  exports.TableColumnSortSpecs = ImGuiTableColumnSortSpecs;
  exports.TableGetColumnCount = TableGetColumnCount;
  exports.TableGetColumnFlags = TableGetColumnFlags;
  exports.TableGetColumnIndex = TableGetColumnIndex;
  exports.TableGetColumnName = TableGetColumnName;
  exports.TableGetRowIndex = TableGetRowIndex;
  exports.TableGetSortSpecs = TableGetSortSpecs;
  exports.TableHeader = TableHeader;
  exports.TableHeadersRow = TableHeadersRow;
  exports.TableNextColumn = TableNextColumn;
  exports.TableNextRow = TableNextRow;
  exports.TableSetBgColor = TableSetBgColor;
  exports.TableSetColumnIndex = TableSetColumnIndex;
  exports.TableSetupColumn = TableSetupColumn;
  exports.TableSetupScrollFreeze = TableSetupScrollFreeze;
  exports.TableSortSpecs = ImGuiTableSortSpecs;
  exports.Text = Text;
  exports.TextBuffer = ImGuiTextBuffer;
  exports.TextColored = TextColored;
  exports.TextDisabled = TextDisabled;
  exports.TextFilter = ImGuiTextFilter;
  exports.TextUnformatted = TextUnformatted;
  exports.TextWrapped = TextWrapped;
  exports.TreeNode = TreeNode;
  exports.TreeNodeEx = TreeNodeEx;
  exports.TreePop = TreePop;
  exports.TreePush = TreePush;
  exports.UNICODE_CODEPOINT_MAX = IM_UNICODE_CODEPOINT_MAX;
  exports.Unindent = Unindent;
  exports.VERSION = IMGUI_VERSION;
  exports.VERSION_NUM = IMGUI_VERSION_NUM;
  exports.VSliderFloat = VSliderFloat;
  exports.VSliderInt = VSliderInt;
  exports.VSliderScalar = VSliderScalar;
  exports.Value = Value;
  exports.Vec2 = ImVec2;
  exports.Vec4 = ImVec4;
  exports.Vector = ImVector;
  exports.default = imgui;
  exports.script_ImFontConfig = script_ImFontConfig;
  exports.script_ImFontGlyph = script_ImFontGlyph;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
