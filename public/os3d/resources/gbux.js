var GeoUI = {};

// { seg, p:{w,h,ts:{mx,my,mz,...}}, backSide  }
// required a faces with square base UV per seg X seg  and tranition base on p
GeoUI.squareLayer = function(op) {
    throw "squareLayerMesh not implement yet!";
};
GeoUI.squareLayerMaterial = function(op) {
    throw "squareLayerMaterial not implement yet!";
};
GeoUI.sphereLayer = function(op) {
    throw "sphereInBaseLayer not implement yet!";
};

GeoUI.drawInGPU = function(me, index, code) {
    if (!me.drawInGPU) me.drawInGPU = [];
    me.drawInGPU[index] = code;
};
GeoUI.manageFaceInGPU = function(me, index, code) {
    if (!me.vertexInGPU) me.vertexInGPU = [];
    me.vertexInGPU[index] = code;
};


GeoUI.onFrame = function(t) {

    for (var motion in GeoUI.motionList) {

        motion = GeoUI.motionList[motion];
        motion.fun();
    }
}


GeoUI.motionList = [];
GeoUI.motion = function(key, frame, stimate, speed) {
    this.key = key;
    this.frame = frame;
    this.stimate = stimate || 10;

    var dt = new Date();
    dt.setSeconds(dt.getSeconds() + this.stimate);
    this.stimate = dt.getTime() - (new Date()).getTime();

    this.speed = speed || 1;
};
GeoUI.motion.prototype = {
    key: null,
    stimate: 10,
    timeLine: 0,
    speed: 1,
    startTime: null,
    previusTime: null,
    status: 0,
    frame: null,
    onTimeFun: null,
    waitCond: function(cond, fun) {
        if (!cond()) {
            this.replay();
        } else fun();
    },
    fun: function() {

        if (this.status != 1) return;
        var curr = new Date().getTime();

        this.timeLine += (curr - this.previusTime) * this.speed;

        this.previusTime = curr;

        var v = min(1, this.timeLine / this.stimate);
        if (v >= 1) this.status = 2;
        if(this.onTimeFun)this.onTimeFun(v);
        if (this.frame) this.frame(v, this);

    },
    play: function(fun) {
        if (!this.startTime) {
            this.startTime = new Date().getTime();
            this.previusTime = this.startTime;
            this.timeLine = null;
            this.onTimeFun = fun;
            GeoUI.motionList[this.key] = this;
        }
        this.status = 1;
        return this;
    },
    replay: function() {
        this.status = 0;
        this.startTime = null;
        this.play();
        return this;
    },
    pause: function() { this.status = 1; return this; },
    remove: function() {
        if (GeoUI.motionList[this.key])
            GeoUI.motionList[this.key] = null;
    }
};

/* */


var transition = function(p) {
    p = p || {};
    this.mx = p.mx || 0;
    this.my = p.my || 0;
    this.mz = p.mz || 0;
    this.rx = p.rx || 0;
    this.ry = p.ry || 0;
    this.rz = p.rz || 0;
    this.sx = p.sx || 1;
    this.sy = p.sy || 1;
    this.sz = p.sz || 1;
    this.sa = p.sa || 1;

};
transition.prototype = {

    mx: 0,
    my: 0,
    mz: 0,
    rx: 0,
    ry: 0,
    rz: 0,
    sz: 1,
    sz: 1,
    sz: 1,
    sa: 1,
    move_x: function(x) { this.mx += x; return this; },
    move_y: function(y) { this.my += y; return this; },
    move_z: function(z) { this.mz += z; return this; },
    rotate_x: function(x) { this.rx += x; return this; },
    rotate_y: function(y) { this.ry += y; return this; },
    rotate_z: function(z) { this.rz += z; return this; },
    scale: function(s) { this.sa *= s; return this; },
    scale_x: function(s) { this.sx *= s; return this; },
    scale_y: function(s) { this.sy *= s; return this; },
    scale_z: function(s) { this.sz *= s; return this; },
}

var _ts = transition;

GeoUI.Content = function(context) { this.dc = context; };
GeoUI.Content.prototype = {
    dc: null,
    x: 0,
    y: 0,
    w: 100,
    h: 100,
    clear: function(color) {
        var th = this;

        th.dc.clearRect(th.x, th.y, th.w, th.h);
        if (color) {
            th.dc.fillStyle = color;
            th.dc.fillRect(th.x, th.y, th.w, th.h);
        }
        return th;
    },
    text: function(p) { 
        var th = this;
        var alg = def(p.align, 'center middle').split(' ');
        var pos = (p.pos || '50% 50%').split(' ');

        if (pos[0].indexOf('%') != -1)
            pos[0] = pos[0].replace('%', '').valueOf() * th.w * 0.01;
        else
            pos[0] = pos[0].replace('px', '').valueOf();

        if (pos[1].indexOf('%') != -1)
            pos[1] = pos[1].replace('%', '').valueOf() * th.h * 0.01;
        else
            pos[1] = pos[1].replace('px', '').valueOf();

        th.dc.font = def(p.font, (th.h / 3) + 'px tahoma');

        th.dc.textAlign = alg[0];
        th.dc.textBaseline = alg[1];
        th.dc.fillStyle = def(p.color, '#ff0000'); 
          

        th.dc.textAlign = alg[0];

        th.dc.save();

        if (p.flipX) {

            th.dc.scale(-1, 1.); 
        }

        if (p.flipY) {

            th.dc.scale(1, -1.);

        }

        if (p.rot) {

            th.dc.translate(pos[0] + th.x, pos[1] + th.y);
            th.dc.rotate(p.rot);

            th.dc.fillText(p.title, 0, 0); 

        } else
        { 
            th.dc.fillText(p.title, pos[0] + th.x, pos[1] + th.y);
            
        }

             

        th.dc.restore();


        return th;
    },
    p: function(p) {
        var th = this;
        var context = th.dc;

        var text = p.text;
        var font = def(p.font, (th.h / 16) + 'px tahoma');
        var lineh = p.lineHeight || (th.h / 16) * 1.2;
        var linesp = def(p.space, 5);
        var js = !def(p.justify, 1);

        var maxWidth = def(p.maxWidth, th.w * 90 / 100);

        text = text.replace(/\n/g, ' \n \n ');
        var words = text.split(' ');

        var metrics = context.measureText('WI');

        lineh = lineh || metrics.width * 1.2;

        context.font = font;
        context.fillStyle = def(p.color, '#000');


        if(p.stroke)context.strokeStyle = p.stroke;

        var lines = [{ w: 0, ws: [] }];

        var alg = def(p.align, 'left top').split(' ');
        var pos = (p.pos || '5% 5%').split(' ');

        if (pos[0].indexOf('%') != -1)
            pos[0] = pos[0].replace('%', '').valueOf() * th.w * 0.01;
        else
            pos[0] = pos[0].replace('px', '').valueOf();

        if (pos[1].indexOf('%') != -1)
            pos[1] = pos[1].replace('%', '').valueOf() * th.h * 0.01;
        else
            pos[1] = pos[1].replace('px', '').valueOf();


        th.dc.textAlign = alg[0];
        th.dc.textBaseline = alg[1];

        var linewidth = 0;

        for (var n = 0; n < words.length; n++) {

            var metrics = context.measureText(words[n].split('_set_')[0]);
            linewidth += metrics.width;
            var sus = linewidth + linesp * (lines[lines.length - 1].ws.length - 2);

            if (sus > maxWidth || words[n] == '\n') {

                linewidth = metrics.width;
                lines[lines.length - 1].w = sus - metrics.width;
                if (words[n] == '\n')
                    lines[lines.length - 1].eop = 1;

                lines.push({ w: metrics.width, ws: [] });

            } else {
                lines[lines.length - 1].w += metrics.width + linesp;
            }

            lines[lines.length - 1].ws.push({ w: metrics.width, t: words[n] });

        }

        for (var n = 0; n < lines.length; n++) {
            var ln = 0;
            for (var i = 0; i < lines[n].ws.length; i++) {

                if (lines[n].ws[i]) {

                    if (lines[n].ws[i].t.indexOf('~') != -1) {
                        var sett = lines[n].ws[i].t.split('~')[1];

                        context.fillStyle = (sett != '' ? sett : '#000');
                    }

                    context.save();

                    if (p.rot) {

                        context.translate(th.x + pos[0] + ln, th.y + pos[1] + n * lineh);
                        context.rotate(p.rot);

                        context.fillText(lines[n].ws[i].t.split('~')[0], 0., 0.);

                    } else

                        context.fillText(lines[n].ws[i].t.split('~')[0], th.x + pos[0] + ln, th.y + pos[1] + n * lineh);
                    ln += lines[n].ws[i].w +
                        (js || (n == lines.length - 1 || lines[n].eop) ? linesp :
                            Math.max(linesp, (maxWidth - lines[n].w) / (lines[n].ws.length - 1)));

                    context.restore();
                }

            }
        }
        return th;
    },
    image: function(p, fu) {

        var th = this;
        var x = 0,
            y = 0;

        var alg = (p.align || 'center center').split(' ');
        var pos = (p.pos || '50% 50%').split(' ');
        var size = p.size || '20%';

        if (pos[0].indexOf('%') != -1)
            pos[0] = pos[0].replace('%', '').valueOf() * th.w * 0.01;
        else
            pos[0] = pos[0].replace('px', '').valueOf();

        if (pos[1].indexOf('%') != -1)
            pos[1] = pos[1].replace('%', '').valueOf() * th.h * 0.01;
        else
            pos[1] = pos[1].replace('px', '').valueOf();


        if (size.indexOf('%') != -1)
            size = size.replace('%', '').valueOf() * th.w * 0.01;
        else
            size = size.replace('px', '').valueOf();


        var img = document.createElement('img');
        img.onload = function() {

            var rz = img.height / img.width;

            if (alg[0] == 'center') x -= size * 0.5;
            else if (alg[0] == 'left') x -= size;

            if (alg[1] == 'center') y -= size * rz * 0.5;
            else if (alg[1] == 'top') y -= size * rz;

            th.dc.textAlign = alg[0];

            th.dc.save();

            if (p.rot) {

                th.dc.translate(pos[0] + th.x + x, pos[1] + th.y + y);
                th.dc.rotate(p.rot);

                th.dc.drawImage(img, 0, 0, size, size * rz);

            } else

                th.dc.drawImage(img, pos[0] + th.x + x, pos[1] + th.y + y, size, size * rz);

            if (fu) setTimeout(fu, 300);

        }
        img.src = p.src || '/images/def.jpg';

        return th;

    }
};

GeoUI.UI = function(n, size) {
    this.items = new Array();

    n = def(n, pow(this.columnsCount));
    n = floor(pow(n, 0.5));

    this.columnsCount = n;

    if (size.length && size.length == 2) {
        this.size = size[0] * n;
        this.sizey = size[1] * n;
    } else {
        this.size = def(size, 256) * n;
        this.sizey = this.size;
    }
};
GeoUI.eventPointer = [];
GeoUI.UI.prototype = {
    columnsCount: 4,
    size: 2048,
    sizey: 2048,
    backSide: false,
    items: null,
    mat: null,
    mesh: null,
    Content: null,
    init: function(fun, fun2) {
        this.mat = GeoUI.squareLayerMaterial(0, this.size, this.sizey, fun, fun2);
        this.Content = new GeoUI.Content(this.mat.dynamicTexture.getContext("2d"));

        this.build();
        return this;
    },
    currFlags: 1,
    currItem: -1,
    select: function(item, fup, fdown) {
        this.currItem = item;
        if (fup || fdown)
            this.flags(fup, fdown);

        this.mat.setVector4('seg', { x: this.columnsCount, y: this.currItem, z: this.currFlags, w: 0. });
        return this;
    },
    unselect: function(f) {

        this.currItem = -1;
        if (f)
            this.currFlags = 1;

        this.mat.setVector4('seg', { x: this.columnsCount, y: this.currItem, z: this.currFlags, w: 0. });
        return this;
    },
    flags: function(flagUp, flagDown) {
        if (state && this.currFlags % flagUp != 0)
            this.currFlags *= flagUp;

        if (flagDown && this.currFlags % flagDown == 0)
            this.currFlags /= flagDown;

        this.mat.setVector4('seg', { x: this.columnsCount, y: this.currItem, z: this.currFlags, w: 0. });
        return this;
    },
    event: function(item, name, fun, out) {
        d = 0.5;
        var parState = { over: 0, out: 1 };
        for (var i = -0.5; i <= 0.5; i += d) {
            for (var j = -0.5; j <= 0.5; j += d) {
                GeoUI.eventPointer.push({
                    th: this,
                    item: item,
                    name: name,
                    fun: fun,
                    out: out,
                    d: d * this.items[item].w * 6.,
                    parent: parState,
                    p: {
                        x: this.items[item].w * i + this.items[item].ts.mx,
                        y: this.items[item].h * j + this.items[item].ts.my,
                        z: this.items[item].ts.mz
                    },
                    c: {
                        x: this.items[item].ts.mx,
                        y: this.items[item].ts.my,
                        z: this.items[item].ts.mz
                    }
                });

                /* var mesh = BABYLON.Mesh.CreateSphere('s',10,0.02 ,scene);
                 mesh.position.x = this.items[item].w*i+this.items[item].ts.mx;
                 mesh.position.y = this.items[item].h*j+this.items[item].ts.my;
                 mesh.position.z =  this.items[item].ts.mz;*/

            }
        }
        return this;
    },
    back: function(p) {
        this.backSide = p;
        return this;
    },
    builder: null,
    build: function() {
        if (this.mesh) {
            this.mesh.position.y = -60000;
            this.mesh.dispose();
        }

        this.mesh = (this.builder || GeoUI.squareLayer)({ seg: this.columnsCount, p: this.items, backSide: this.backSide });

        this.mesh.material = this.mat;

        this.mesh.material.setVector4('seg', { x: this.columnsCount, y: this.currItem, z: this.currFlags, w: 0. });
        return this;
    },
    refreshContent: function(n) {
        var th = this;
        setTimeout(function() {
            th.mat.dynamicTexture.reset(this.mat);
        }, n || 30);
        return th;
    },
    getContentTexture: function(n) {

        return this.mat.dynamicTexture;

    },
    draw: function(i, m, w) {
        var th = this;
        if (m) {
            th.Content.w = th.size / th.columnsCount;
            th.Content.h = th.sizey / th.columnsCount;

            th.Content.y = th.size - floor(1. + i / th.columnsCount) * th.Content.w;
            th.Content.x = (i % th.columnsCount) * th.Content.h;

            m(th.Content);

            th.mat.dynamicTexture.reset(th.mat, w);
        }

        return this;
    },
    resize: function(item, w, h, ts, m) {

        if (!this.items[item]) {
            this.items[item] = { ts: new _ts(), w: 0, h: 0 };
        }

        if (ts) {
            this.setTransition(item, ts, 1);
        }

        this.items[item].w = w;
        this.items[item].h = h;
        if (m)
            for (var im in m) {
                this.items[item][im] = m[im];
            }

        this.build();

        return this;
    },
    setTransition: function(item, ts, withoutRebuild) {

        if (!this.items[item]) {
            this.items[item] = { ts: new _ts(), w: 0, h: 0 };
        }

        this.items[item].ts = new _ts(ts);
        if (!withoutRebuild)
            this.build();

        return this;
    },
    getTransition: function(item) {

        if (!this.items[item]) {
            this.items[item] = { ts: new _ts(), w: 0, h: 0 };
        }

        return this.items[item].ts;
    }
};

GeoUI.UI.prototype._ts = GeoUI.UI.prototype.getTransition;

scene.UI = GeoUI;