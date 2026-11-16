/*
     loader request 
     prepared a canvas as 3d Viewer 
*/

function cln3d(p) {
  if (p.length > 2 && !p.x) return { x: p[0],y: p[1],z: p[2],h: p[3] };
  return { x: p.x,y: p.y,z: p.z,h: p.h };
}

/* wait to load */
function WTA(cnd,fun,t,n,l,p) {
  if (l < n && cnd()) fun(p);
  else if (l < n)
    setTimeout(function () {
      WTA(cnd,fun,t,n,l++,p);
    },t);
}
var $3dsrv = function () { };
$3dsrv.prototype = {
  run: function (url,prg,size) {
    WTA(
      function () {
        try {
          return zip && zip.fs;
        } catch (e) { }
        return false;
      },
      function () {
        var req = new XMLHttpRequest();
        req.addEventListener(
          "progress",
          function (event) {
            if (event.lengthComputable) {
              prg(100 * event.loaded / event.total);
            } else {
              prg(100 * event.loaded / size);
            }
          },
          false
        );
        req.addEventListener(
          "load",
          function (event) {
            var zipFs = new zip.fs.FS();
            zipFs.importHttpContent(
              url,
              false,
              function () {
                var list = [];
                for (var it in zipFs.root.children) {
                  list.push(zipFs.root.children[it]);
                }
                var run_ind = 0;

                function RunJS() {
                  if (list.length == run_ind) return;
                  var firstEntry = list[run_ind++];
                  firstEntry.getText(function (data) {
                    window.eval(data);
                    requestAnimationFrame(RunJS);
                  });
                }
                RunJS();
              },
              function (e) {
                console.log(e);
              }
            );
          },
          false
        );
        req.addEventListener("error",function (event) { },false);
        req.open("GET",url);
        req.send();
      },
      100,
      100,
      1
    );
  },
  fileReq: function (url,prg,fun,size) {
    WTA(
      function () {
        try {
          return zip && zip.fs;
        } catch (e) { }
        return false;
      },
      function () {
        var req = new XMLHttpRequest();
        req.addEventListener(
          "progress",
          function (event) {
            if (event.lengthComputable) {
              prg(100 * event.loaded / event.total);
            } else {
              prg(100 * event.loaded / size);
            }
          },
          false
        );
        req.addEventListener(
          "load",
          function (event) {
            var zipFs = new zip.fs.FS();
            zipFs.importHttpContent(
              url,
              false,
              function () {
                var list = [];
                for (var it in zipFs.root.children) {
                  list.push(zipFs.root.children[it]);
                }

                var run_ind = 0;

                function RunJS() {
                  if (list.length == run_ind) return;
                  var firstEntry = list[run_ind++];
                  firstEntry.getText(function (data) {
                    fun(list[run_ind],data);
                    requestAnimationFrame(RunJS);
                  });
                }
                RunJS();
              },
              function (e) {
                console.log(e);
              }
            );
          },
          false
        );
        req.addEventListener("error",function (event) { },false);
        req.open("GET",url);
        req.send();
      },
      100,
      100,
      1
    );
  },
  canvas: function (canvas,custom,option) {
    WTA(
      function () {
        try {
          return BABYLON && BABYLONX;
        } catch (e) { }
        return false;
      },
      function () {
        dn({
          url: window.baseURL + "/resources/Scene3d_Design.js",
          success: function (data) {
            var temps = {
              single: {},
              default: {}
            };

            try {
              eval("template = temps." + template);
            } catch (e) { }
            var $3dsrv_part = function (fun,template) {
              this.engine = new BABYLON.Engine(canvas,true,{
                preserveDrawingBuffer: true,
                stencil: true
              });
              this.canvas = canvas;
              this.scene = fun(this);
              var th = this;
              this.engine.runRenderLoop(function () {
                th.loop();
              });

              canvas.addEventListener("resize",function () {
                th.engine.resize();
              });

              if (template) {
                this.cameraInit = template.camInit;
                this.loop = function () {
                  template.loop(th);
                };
              }
            };
            $3dsrv_part.prototype = {
              camera: null,
              cameraInit: function (camera,scene) {
                camera = new BABYLON.ArcRotateCamera(
                  "camera1",
                  3,
                  3,
                  3,
                  new BABYLON.Vector3(70,150,150),
                  scene
                );
                camera.setTarget(BABYLON.Vector3.Zero());

                return camera;
              },
              color: function (co) {
                this.scene.clearColor = new BABYLON.Color4(
                  co.r,
                  co.g,
                  co.b,
                  co.a
                );
                return this;
              },
              clearColor: function (camera,scene) {
                scene.clearColor = new BABYLON.Color4(1,1,1,0);
              },
              timer: -200 * abs(Math.random()),
              SBGB: null,
              engine: null,
              canvas: null,
              scene: null,
              renderState: true,
              render: function () {
                this.scene.render();
              },
              loop: function () {
                if (this.scene && this.renderState) {
                  this.scene.render();
                }
              }
            };

            eval(data);
            var part;
            if (createScene) {
              part = new $3dsrv_part(createScene);
              if (custom) custom(part);
            }

            if (option) {
              if (option.scene) {
              } else if (option.js) {
                function down(option) {
                  var req = new XMLHttpRequest();
                  req.addEventListener(
                    "progress",
                    function (event) {
                      if (event.lengthComputable) {
                        if (option.prg)
                          option.prg(100 * event.loaded / event.total);
                      } else {
                        if (option.prg)
                          option.prg(100 * event.loaded / def(option.size,1));
                      }
                    },
                    false
                  );
                  req.addEventListener(
                    "load",
                    function (event) {
                      eval(
                        "var lc = function(scene,camera,part){" +
                        req.responseText +
                        "};lc(part.scene ,part.camera,part);"
                      );

                      if (option.jsLoaded) {
                        option.jsLoaded();
                      }
                    },
                    false
                  );
                  req.addEventListener(
                    "error",
                    function (event) {
                      console.log(event);
                    },
                    false
                  );
                  req.open("GET",option.url);
                  req.send();
                }

                if (typeof option.js == typeof [1,2]) {
                  var arrInd = 0;
                  var loaded = 0;

                  function downStart() {
                    if (option.js.length <= arrInd) return;
                    down({
                      url: option.js[arrInd],
                      jsLoaded: function () {
                        loaded++;
                        if (option.jsLoaded) {
                          if (option.jsLoaded(loaded / option.js.length)) {
                            arrInd++;
                            downStart();
                          }
                        }
                      }
                    });
                  }
                  downStart();
                } else {
                  option.url = option.js;
                  down(option);
                }
              }
            }
          }
        });
      },
      100,
      100,
      1
    );
  }
};

var drag = function (slider,move,fun) {
  this.slider = slider;
  this.move = move;
  var th = this;
  this.slider.addEventListener("mousedown",function (event) {
    th.dragStart(event);
    event.preventDefault(0);
  });
  this.slider.addEventListener("touchstart",function (event) {
    th.dragStart(event);
    event.preventDefault(0);
  });
  this.move.addEventListener("mousemove",function (event) {
    th.dragMove(event);
  });
  this.slider.addEventListener("touchmove",function (event) {
    th.dragMove(event);
    event.preventDefault(0);
  });
  this.move.addEventListener("mouseup",function (event) {
    th.dragEnd(event);
  });
  this.slider.addEventListener("touchend",function (event) {
    th.dragEnd(event);
    event.preventDefault(0);
  });
  if (fun) this.action = fun;
};

drag.prototype = {
  slider: null,
  move: null,
  action: function () {
    return 1;
  },
  dragSt: { x: 0,y: 0,old_x: 0,old_y: 0,enable: 0 },
  dragStart: function (event) {
    if (event.targetTouches && event.targetTouches.length > 0) {
      this.dragSt.enable = 1;
      this.dragSt.x = event.targetTouches[0].pageX;
      this.dragSt.y = event.targetTouches[0].pageY;
    } else {
      this.dragSt.enable = 1;
      this.dragSt.x = event.pageX;
      this.dragSt.y = event.pageY;
    }

    this.dragSt.old_x = this.slider.offsetLeft;
    this.dragSt.old_y = this.slider.offsetTop;
  },
  dragMove: function (event) {
    if (this.dragSt.enable) {
      var dif = { x: 0,y: 0 };
      if (event.targetTouches && event.targetTouches.length > 0) {
        dif.x = this.dragSt.x - event.targetTouches[0].pageX;
        dif.y = this.dragSt.y - event.targetTouches[0].pageY;
      } else {
        dif.x = this.dragSt.x - event.pageX;
        dif.y = this.dragSt.y - event.pageY;
      }

      if (
        this.action(
          (this.dragSt.old_x - dif.x) / this.slider.parentNode.offsetWidth,
          "x"
        )
      ) {
        this.slider.style.left =
          max(
            0,
            min(
              this.slider.parentNode.offsetWidth - this.slider.offsetWidth,
              this.dragSt.old_x - dif.x
            )
          ) + "px";
      }
      if (this.action(this.dragSt.old_x - dif.x,"y"))
        this.slider.style.top = this.dragSt.old_y - dif.y + "px";
    }
  },
  dragEnd: function (event) {
    if (this.dragSt.enable) {
      this.dragSt.enable = 0;
    }
  }
};

/**
 * 
    this can be apply by any kind download
     XHR download and upload
 */

var dn = function (op) {
  op = def(op,{});
  op.type = def(op.type,"Get");
  op.url = def(op.url,"/");
  op.success = def(op.success,function (data) { });
  op.error = def(op.error,function (data) { });
  op.end = def(op.end,function () { });
  op.begin = def(op.begin,function () { });
  op.option = def(op.option,{});

  function processData(data) {
    op.success(data,op.option);
  }

  function handler() {
    op.subProgress = def(op.subProgress,function (p) { });
    op.subProgress(this);
    if (this.readyState == this.DONE) {
      if (this.status == 200) {
        // success!
        processData(this.responseText);
      } else {
        op.error(this);
      }
      op.end();
    }
  }

  try {
    var client = new XMLHttpRequest();

    client.onreadystatechange = handler;
    client.open(op.type,op.url);
    op.begin(client);
    client.send();
    client.onprogress = function (pe) {
      if (pe.lengthComputable) {
        op.progress = def(op.progress,function (p) { });
        op.progress(pe.loaded * 100 / pe.total);
      }
    };
  } catch (e) {
    op.error(e);
    op.end();
  }
};
var dnb = function (op) {
  op = def(op,{});
  op.type = def(op.type,"Get");
  op.url = def(op.url,"/");
  op.success = def(op.success,function (data) { });
  op.error = def(op.error,function (data) { });
  op.end = def(op.end,function () { });
  op.begin = def(op.begin,function () { });
  op.option = def(op.option,{});

  function processData(data) {
    op.success(data,op.option);
  }

  function handler() {
    op.subProgress = def(op.subProgress,function (p) { });
    op.subProgress(this);
    if (this.readyState == this.DONE) {
      if (this.status == 200) {
        // success!
        processData(this.response);
      } else {
        op.error(this);
      }
      op.end();
    }
  }

  try {
    var client = new XMLHttpRequest();

    client.onreadystatechange = handler;
    client.open(op.type,op.url);
    op.begin(client);
    client.send();
    client.onprogress = function (pe) {
      if (pe.lengthComputable) {
        op.progress = def(op.progress,function (p) { });
        op.progress(pe.loaded * 100 / pe.total);
      }
    };
  } catch (e) {
    op.error(e);
    op.end();
  }
};

var up = function (op) {
  op = def(op,{});
  op.type = def(op.type,"POST");
  op.url = def(op.url,"/");
  op.success = def(op.success,function (data) { });
  op.error = def(op.error,function (data) { });
  op.end = def(op.end,function () { });
  op.begin = def(op.begin,function () { });

  function processData(data) {
    op.success(data);
  }

  function handler() {
    if (this.readyState == this.DONE) {
      if (this.status == 200) {
        // success!
        processData(this.responseText);
      } else {
        op.error(this);
      }
      op.end();
    }
  }

  try {
    var client = new XMLHttpRequest();

    client.onreadystatechange = handler;
    if ("withCredentials" in client) {
      client.open(op.type,op.url,true);
      op.begin(client);
      client.upload.onprogress = function (pe) {
        if (pe.lengthComputable) {
          op.progress = def(op.progress,function (p) { });
          op.progress(pe.loaded * 100 / pe.total);
        }
      };
    } else if (typeof XDomainRequest != "undefined") {
      // Otherwise, check if XDomainRequest.
      // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
      client = new XDomainRequest();
      client.onreadystatechange = handler;

      client.open(op.type,op.url);
      op.begin(client);
      client.upload.onprogress = function (pe) {
        if (pe.lengthComputable) {
          op.progress = def(op.progress,function (p) { });
          op.progress(pe.loaded * 100 / pe.total);
        }
      };
    }

    if (def(op.file)) {
      var data = new FormData();
      _for(
        op.file,
        function (at,i) {
          data.append("file" + i,at.data);
        },
        function () {
          client.setRequestHeader("content",JSON.stringify(op.data));
          client.send(data);
          client.upload.onprogress = function (pe) {
            if (pe.lengthComputable) {
              op.progress = def(op.progress,function (p) { });
              op.progress(pe.loaded * 100 / pe.total);
            }
          };
        }
      );
    } else {
      client.setRequestHeader("Content-Type","application/json;charset=UTF-8");
      client.send(def(op.data,false) ? JSON.stringify(op.data) : "");
      client.onprogress = function (pe) {
        if (pe.lengthComputable) {
          op.progress = def(op.progress,function (p) { });
          op.progress(pe.loaded * 100 / pe.total);
        }
      };
    }
  } catch (e) {
    op.error(e);
    op.end();
  }
};

function ds(p,fn) {
  dn({
    url: p,
    success: function (d) {
      window.eval(d);
      if (fn) fn();
    }
  });
}


var baseUL = location.pathname.split("/os3d");

window.baseURL = baseUL[0] + "/os3d";
window.baseImgURL = baseUL[0] + "/os3d/3dimages";

var isMobileView = function () {
  return (location.hash.indexOf('mobileView') != -1);
};
var isSharedView = function () {
  return (location.hash.indexOf('ShareView') != -1);
};
var urlFreeCam = function () {
  return (location.hash.indexOf('!free') != -1);
};
var urlWalkCam = function () {
  return (location.hash.indexOf('!walk') != -1);
};
var url2DCam = function () {
  return (location.hash.indexOf('!2d') != -1);
};
var urlfloor = function () {
  return (location.hash.indexOf('!nofloors') == -1);
};
var urlicon = function () {
  return (location.hash.indexOf('!noicons') == -1);
};

var urlscrl = function () {
  return (location.hash.indexOf('!noscrl') == -1);
};



/**
 * 
 * d  = 
 * [ dom ]
 * /// live script
 * [ script ]
 */
function initInnerContent(d,fn,fs) {
  fn = def(fn,function (d) {
    return d;
  });
  fs = def(fs,function (d) {
    return d;
  });


  d = d
    .replaceAll(
      "<loader>",
      `<img src="[#images]/preload.png?[#date]" class="h-01" onload="templateLoad('`
    )
    .replaceAll("</loader>",`',this)" />`)
    .replaceAll("[#root]",window.baseURL)
    .replaceAll("[#src]=","src=")
    .replaceAll("[#mob]",isMobileView() ? "mob" : "not-mob")
    .replaceAll("elmMob",isMobileView() ? "div" : "deleted") /** for clear all delited items */
    .replaceAll("[#date]",new Date().getTime())
    .replaceAll("[#images]",window.baseURL + "/3dimages");

  var sd = [];
  if (d.indexOf("/// live script") != -1) {
    sd = d.split("/// live script");
    d = sd[0];
  }
  fn(d);
  if (sd.length != 0) {
    window.eval(fs(sd[1]).replace("<script>","").replace("</script>",""));
  }
}

function templateLoad(path,th) {
  dn({
    url: "../os3d/3dpages" + window.currVer + '/' + path + ".htm",
    success: function (d) {
      initInnerContent(
        d,
        function (d1) {
          th.parentNode.innerHTML = d1;
        },
        function (d1) {
          return d1;
        }
      );
    }
  });
}
