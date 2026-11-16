window.GUX = {
    QualityMinimum: 32,
    QualityLow: 256,
    QualityMedium: 512,
    QualityHD: 1024,
    Quality2K: 2048,
    Quality4K: 4096,
    Quality8K: 4096 * 2,/* only for render reason */
    Q0: 16,
    Q1: 32,
    Q2: 64,
    Q3: 128,
    QSD: 256,
    QMD: 512,
    QHD: 1024,
    Q2K: 2048,
    Q4K: 4096,
    Q8K: 4096 * 2,/* only for render reason */
};

GUX.DocsList = function (itemCount, quality) {

    this.UI = new GeoUI.UI(itemCount || 9, quality || GUX.QualityHD)
        .init(function (me) {
            return me.Transparency();
        }).back(true);

},
    GUX.DocsList.protoype = {
        UI: null
    };


GUX.navigate = {
    aroundCircle: function (ui, v, w, h) {
        for (var i = 0; i < pow(ui.columnsCount); i++)
            ui.setTransition(i, {
                ry: v * 0.0021 + 1. + 0.5 * i,
                mx: sin(v * 0.0021 + 0.5 * i) * h,
                my: sin(v * 0.01 + 0.5 * i) * w,
                mz: cos(v * 0.0021 + 0.5 * i) * h
            });
    }
}


GUX.keyController = {
    keys: '',
    value: '',
    getChar: function (key, evt) {


        if (key == 32) return ' ';
        if (key == 27) return '_ky_e';
        if (key == 8) return '_ky_b';
        if (key == 46) return '_ky_d';

        if (key == 222) return evt.shiftKey ? '"' : "'";
        if (key == 220) return evt.shiftKey ? '|' : "\\";
        if (key == 191) return evt.shiftKey ? '?' : "/";

        if (key == 49) return evt.shiftKey ? '!' : "1";
        if (key == 50) return evt.shiftKey ? '@' : "2";
        if (key == 51) return evt.shiftKey ? '#' : "3";
        if (key == 52) return evt.shiftKey ? '$' : "4";
        if (key == 53) return evt.shiftKey ? '%' : "5";
        if (key == 54) return evt.shiftKey ? '^' : "6";
        if (key == 55) return evt.shiftKey ? '&' : "7";
        if (key == 56) return evt.shiftKey ? '*' : "8";
        if (key == 57) return evt.shiftKey ? '(' : "9";
        if (key == 48) return evt.shiftKey ? ')' : "0";


        if (key == 97) return evt.shiftKey ? '_ky_1' : "1";
        if (key == 98) return evt.shiftKey ? '_ky_2' : "2";
        if (key == 99) return evt.shiftKey ? '_ky_3' : "3";
        if (key == 100) return evt.shiftKey ? '_ky_4' : "4";
        if (key == 101) return evt.shiftKey ? '_ky_5' : "5";
        if (key == 102) return evt.shiftKey ? '_ky_6' : "6";
        if (key == 103) return evt.shiftKey ? '_ky_7' : "7";
        if (key == 104) return evt.shiftKey ? '_ky_8' : "8";
        if (key == 105) return evt.shiftKey ? '_ky_9' : "9";

        if (key == 106) return evt.shiftKey ? '_ky_*' : "*";
        if (key == 107) return evt.shiftKey ? '_ky_+' : "+";
        if (key == 111) return evt.shiftKey ? '_ky_/' : "/";
        if (key == 109) return evt.shiftKey ? '_ky_-' : "-";

        if (key == 186) return evt.shiftKey ? ':' : ";";
        if (key == 188) return evt.shiftKey ? '<' : ",";
        if (key == 190) return evt.shiftKey ? '>' : ".";
        if (key == 110) return evt.shiftKey ? '' : ".";

        if (key == 96) return evt.shiftKey ? '_ky_0' : "0";



        if (key == 187) return evt.shiftKey ? '+' : "=";
        if (key == 189) return evt.shiftKey ? '_' : "-";



        if (!evt.shiftKey) {
            return (65 <= key && key <= 65 + 30) ? String.fromCharCode(key).toLocaleLowerCase() : '';
        }

        return (65 <= key && key <= 65 + 30) ? String.fromCharCode(key) : '';
    },
    down: function (evt) {
        var key = evt.keyCode;
        GUX.keyController.keys += ',' + GUX.keyController.getChar(key, evt) + ',';
        scene.screen.liveType('', GUX.keyController.value + GUX.keyController.getChar(key, evt), 0);
    },
    up: function (evt) {
        var key = evt.keyCode;

        if (key == 13 || key == 32) {
            scene.screen.liveType(GUX.keyController.value, '', key == 13);
            GUX.keyController.value = '';
        }
        GUX.keyController.value += GUX.keyController.getChar(key, evt);

        if (GUX.keyController.value.indexOf('_ky_b') != -1) {

            GUX.keyController.value = GUX.keyController.value.replace(/_ky_b/g, '');

            GUX.keyController.value = GUX.keyController.value.substr(0, GUX.keyController.value.length - 1);
        }

    }
}

GUX.waitCond = function (c, f, n) {
    new GeoUI.motion('txt1' + new Date().getTime(), function (v, t) {
        t.waitCond(c, f);
    }, n || 1, 1).play();
}

GUX.cbase = '12345678bcdefghijklmnopqrstuvwxyBCDEFGHIJKLMNOPQRSTUVWXY';
GUX.c7 = '!09azAZ';

GUX.base = function (num, base) {

    var mr = '';
    if (num < 0) mr = '!';

    num = floor(abs(num));
    base = base || GUX.cbase;
    var num_r = num * 1.0;

    while (num_r > base.length - 1) {
        mr = base[num_r % base.length] + mr;
        num_r = floor(num_r / (base.length));
    }
    mr = base[num_r] + mr;

    if (mr.indexOf('undefined') != -1) console.log('code error!', num, base);
    return mr;
}

GUX.back = function (str, base) {
    var mr = 0;
    for (var i = 0; i < str.length; i++) {

    }

    return mr;
}



/** GUX DB  */
GUX.XHR = {
    dn: function (op) {

        op = def(op, {});
        op.type = def(op.type, 'Get');
        op.url = def(op.url, '/');
        op.success = def(op.success, function (data) { });
        op.error = def(op.error, function (data) { });
        op.end = def(op.end, function () { });
        op.begin = def(op.begin, function () { });
        op.option = def(op.option, {});

        function processData(data) {
            op.success(data, op.option);
        }

        function handler() {
            op.subProgress = def(op.subProgress, function (p) { });
            op.subProgress(this);
            if (this.readyState == this.DONE) {
                if (this.status == 200) {
                    // success!
                    processData(this.responseText);
                }
                else {
                    op.error(this);
                }
                op.end();
            }
        }

        try {

            var client = new XMLHttpRequest();

            client.onreadystatechange = handler;
            client.open(op.type, op.url);
            op.begin(client);
            client.send();
            client.onprogress = function (pe) {
                if (pe.lengthComputable) {
                    op.progress = def(op.progress, function (p) { });
                    op.progress(pe.loaded * 100. / pe.total);
                }
            }
        } catch (e) { op.error(e); op.end(); }

    },
    up: function (op) {
        op = def(op, {});
        op.type = def(op.type, 'POST');
        op.url = def(op.url, '/');
        op.success = def(op.success, function (data) { });
        op.error = def(op.error, function (data) { });
        op.end = def(op.end, function () { });
        op.begin = def(op.begin, function () { });

        function processData(data) {
            op.success(data);
        }

        function handler() {

            if (this.readyState == this.DONE) {
                if (this.status == 200) {
                    // success!
                    processData(this.responseText);
                }
                else {
                    op.error(this);
                }
                op.end();
            }
        }

        try {

            var client = new XMLHttpRequest();

            client.onreadystatechange = handler;
            if ("withCredentials" in client) {
                client.open(op.type, op.url, true);
                op.begin(client);
                client.upload.onprogress = function (pe) {
                    if (pe.lengthComputable) {
                        op.progress = def(op.progress, function (p) { });
                        op.progress(pe.loaded * 100. / pe.total);
                    }
                }

            } else if (typeof XDomainRequest != "undefined") {

                // Otherwise, check if XDomainRequest.
                // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
                client = new XDomainRequest();
                client.onreadystatechange = handler;

                client.open(op.type, op.url);
                op.begin(client);
                client.upload.onprogress = function (pe) {
                    if (pe.lengthComputable) {
                        op.progress = def(op.progress, function (p) { });
                        op.progress(pe.loaded * 100. / pe.total);
                    }
                }
            }

            if (def(op.file)) {
                var data = new FormData();
                _for(op.file, function (at, i) {
                    data.append("file" + i, at.data);

                }, function () {
                    client.setRequestHeader("content", JSON.stringify(op.data));
                    client.send(data);
                    client.upload.onprogress = function (pe) {
                        if (pe.lengthComputable) {
                            op.progress = def(op.progress, function (p) { });
                            op.progress(pe.loaded * 100. / pe.total);
                        }
                    }
                });
            }
            else {
                client.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                client.send((def(op.data, false) ? JSON.stringify(op.data) : ''));
                client.onprogress = function (pe) {
                    if (pe.lengthComputable) {
                        op.progress = def(op.progress, function (p) { });
                        op.progress(pe.loaded * 100. / pe.total);
                    }
                }
            }
        } catch (e) { op.error(e); op.end(); }
    }
};

GUX.dataRow = function (p, i) { this.partition = p; this.iden = i; };

GUX.dataRow._ErrorInSave = 500;
GUX.dataRow._ErrorInLoad = 404;
GUX.dataRow._Saved = 300;
GUX.dataRow._WaitToSaved = 100;
GUX.dataRow._WaitToDownload = 101;
GUX.dataRow._UpdateByServer = 200;
GUX.dataRow._WaitToUpdate = 201;

GUX.dataRow.prototype = {
    iden: null,
    event: null,
    log: null,
    watch: function (fun) {
        this.event = fun;
        return this;
    },
    partition: 99999,
    liveData: null,
    status: null,
    setId: function (id) {
        this.iden = id;
        return this;
    },
    /* */
    save: function (data) {

        var th = this;

        for (var i in data) {
            if (data[i] != undefined)
                data[i] = data[i].toString().replace(/,/g, '#comma').replace(/;/g, '#semicolon');
        }

        th.liveData = data;
        th.status = GUX.dataRow._WaitToSaved;
        if (th.log) th.log(th);

        data = JSON.stringify(data);
        up({
            url: apiPath+'api/Submit/950DA5EE-3130-4C14-98DA-D353780B8B72', data: { data: data, id: th.iden, Part: th.partition },
            success: function (d) {
                th.iden = d.replace(/"/g, '').split('|')[1].valueOf() * 1;
                th.status = GUX.dataRow._Saved;
                if (th.log) th.log(th);
                if (th.event) th.event('success', th);
            },
            error: function (d) {
                if (th.event) th.event('failed', d);
                th.status = GUX.dataRow._ErrorInSave;
                if (th.log) th.log(th, d);
            },
        });
        return th;
    },
    load: function (fields) {
        var th = this;
        var o = '_start_';
        var index = 0;
        for (var i in fields) {
            fields[i] = index;
            index += 1;
            o += ',' + i;
        }
        o = o.replace('_start_,', '');
        th.status = GUX.dataRow._WaitToDownload;
        if (th.log) th.log(th, d);
        dn({
            url: apiPath+'api/xobjs?c=1&i=0&p=' + th.partition + '&o=' + o + '&s=' + th.iden, success: function (d) {
                d = JSON.parse(d);
                th.status = GUX.dataRow._WaitToUpdate;
                for (var i in fields) {

                    fields[i] = d[0].p[fields[i]].toString().replace(/,/g, '#comma').replace(/;/g, '#semicolon');
                }
                th.liveData = fields;
                th.status = GUX.dataRow._UpdateByServer;
                if (th.log) th.log(th, d);
                if (th.event) th.event('success', th);
            },
            error: function (d) {
                th.status = GUX.dataRow._ErrorInLoad;
                if (th.log) th.log(th, d);
                if (th.event) th.event('failed', d);
            },
        });
        return th;
    }
}

GUX.list = function (part, filter, fields, fun, st, pg) {
    var th = this;
    st = def(st, 0);
    pg = def(pg, 100);
    var o = '_start_';
    var index = 0;
    for (var i in fields) {
        fields[i] = index;
        index += 1;
        o += ',' + i;
    }
    o = o.replace('_start_,', '');
    th.status = GUX.dataRow._WaitToDownload;
    if (th.log) th.log(th, d);
    dn({
        url: apiPath+'api/xobjs?c=' + pg + '&i=' + st + '&p=' + part + '&o=' + o + '&s=' + filter, success: function (d) {
            try {
                d = JSON.parse(d);

                for (var i in d) {
                    var fld = [];
                    var j = 0;
                    for (var fl in fields) {
                        if (d[i].p[j])
                            fld[fl] = d[i].p[j].toString().replace(/,/g, '#comma').replace(/;/g, '#semicolon');
                        j++;
                    }

                    try { fun('success', new GUX.dataRow(d[i].t, d[i].o), fld); } catch (e) {
                        fun('error!row', e, d[i])
                    }
                }
            } catch (e) { fun('error', e, d) }

        },
        error: function (d) {
            fun('failed', d)
        },
    });

}

GUX.dataURLtoFile = function (dataurl, filename, fun) {

    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    fun(new File([u8arr], filename, { type: mime }));
}

GUX.file = {
    embeds: [],
    state: 'ready',
    postFile: function (path, success, op) {

        function processData(data) {
            // taking care of data
            if (def(success)) {

                success(data);
            }
        }

        function handler() {
            if (this.readyState == this.DONE) {
                if (this.status == 200) {
                    // success!
                    processData(this.responseText);
                }
                else {
                    // something went wrong
                    ops("status is " + this.status, 'error', this);
                    alert(this.responseText);
                }
            }
        }

        var client = new XMLHttpRequest();
        client.onreadystatechange = handler;

        if ("withCredentials" in client) {

            // Check if the XMLHttpRequest object has a "withCredentials" property.
            // "withCredentials" only exists on XMLHTTPRequest2 objects.

            client.open("POST", path, true);
            client.upload.onprogress = function (pe) {
                if (pe.lengthComputable) {
                    op.progress = def(op.progress, function (p) { });
                    op.progress(pe.loaded * 100. / pe.total);
                }
            }

        } else if (typeof XDomainRequest != "undefined") {

            // Otherwise, check if XDomainRequest.
            // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
            client = new XDomainRequest();
            client.onreadystatechange = handler;

            client.open("POST", path);
            client.upload.onprogress = function (pe) {
                if (pe.lengthComputable) {
                    op.progress = def(op.progress, function (p) { });
                    op.progress(pe.loaded * 100. / pe.total);
                }
            }
        }

        if (def(op.file)) {

            var data = new FormData();

            _for(op.file, function (at, i) {
                data.append("file" + i, at.data);

            }, function () {
                client.setRequestHeader("content", JSON.stringify(op.data));
                client.send(data);
            });
        }
    },
    uploadBase64: function (data, ext, fn) {
        var elm = document.createElement('div');
        elm.files = [];

        GUX.dataURLtoFile(data, ext, function (file) {

            elm.files.push(file);

            GUX.file.upload({ currentTarget: elm }, function (a, b) {
                if (b && b.type == "ready") {
                    b.data = JSON.parse(b.data);
                    if (b.data && b.data.length > 0) {
                        fn(b.data[0].p);
                    }
                }
            });
        });
    }, uploadFile: function (file, fn) {
        var elm = document.createElement('div');
        elm.files = [file];
        GUX.file.upload({ currentTarget: elm }, function (a, b) {
            if (b && b.type == "ready") {
                b.data = JSON.parse(b.data);
                if (b.data && b.data.length > 0) {
                    fn(b.data[0].p);
                }
            }
        });

    },
    upload: function (evt, fn, files, ftp, key, size) {

        ctl = evt.currentTarget;

        if (files) {
            evt.currentTarget.files = files;
        }

        var service = apiPath+'api/ximages/1?obj=1&prp=mainPix&tlt=unknown&P1=ximages';
        dy.cuctl = ctl;
        var change = def(fn, function (a, b) { });

        if (service == "") { GUX.file.state = 'ready'; change(ctl, { data: evt }); return; }
        if (GUX.file.state != 'ready') {
            if (confirm('another upload in progress .please wait and cancel this confirm to finish and try again. or you can cancel ?')) {
                GUX.file.state = 'ready';
            };
        }
        else {
            GUX.file.state = 'start';
            try {
                if (def(ftp) && ftp) {
                    GUX.file.ftp(evt, change, key, size);
                }
                else
                    GUX.file.xhr(evt, change);
            }
            catch (e) {
                alert(e.message);
                GUX.file.state = 'ready';
            }
        }
    },
    xhr: function (evt, change) {
        ctl = evt.currentTarget;
        var rd = new FileReader();
        _tid = 0;
        embeds = [];

        var files = evt.currentTarget.files;
        GUX.file.state = 'reading';
        new th_for(files,
            function (tid, it) {
                _tid = tid;
                var imageType = /image.*/;
                var musicType = "audio/mp3";

                if (it.item.type.match(imageType)) {

                    rd.onload = function (ev) {

                        var im = document.createElement("img");
                        im.src = ev.target.result;
                        im.setAttribute("class", "h-02 p-0025 m-0025  ");
                        GUX.file.embeds.push({ url: ev.target.result, data: null });

                        n_1(GUX.file.embeds).data = it.item;
                        th_e(_tid);

                        change(evt.currentTarget, { type: 'reading', image: im });

                    }
                    rd.readAsDataURL(it.item);
                }
                else if (it.item.type == musicType) {

                    rd.onload = function (ev) {

                        var im = document.createElement("audio");
                        im.src = ev.target.result;
                        im.setAttribute("class", "h-02 p-0025 m-0025  ");
                        GUX.file.embeds.push({ url: ev.target.result, data: null });

                        n_1(GUX.file.embeds).data = it.item;
                        th_e(_tid);

                        change(evt.currentTarget, { type: 'reading', image: im });

                    }
                    rd.readAsDataURL(it.item);
                }
                else {

                    rd.onload = function (ev) {

                        var im = document.createElement("div");
                        im.innerHTML = kb(ev.target.result.length);
                        im.setAttribute("class", "h-02 w-02 p-0025 m-0025 ");
                        GUX.file.embeds.push({ url: ev.target.result, data: null });

                        n_1(GUX.file.embeds).data = it.item;
                        th_e(_tid);
                        change(evt.currentTarget, { type: 'reading', file: im });
                    }

                    rd.readAsDataURL(it.item);
                }
            },
            function () {
                GUX.file.state = 'sending';

                // xhr req
 
                var service = apiPath+'api/xmp3/1?obj=1&prp=mvideo&tlt=unknown&P1=xmp3';
                // api/xmp3/1?obj=1&prp=mvideo&tlt=unknown&P1=xmp3

                GUX.file.postFile(service, function (d) {
                    change(ctl, { type: 'ready', data: d });

                    GUX.file.embeds = new Array();
                    GUX.file.state = 'ready';
                    ctl.title = "100%";
                    ctl.setAttribute('prg', "100%");

                    setTimeout(function () {
                        ctl.setAttribute('prg', "0%");
                    }, 500);

                }, { file: GUX.file.embeds, data: {}, progress: function (p) { ctl.setAttribute('prg', p + "%"); ctl.title = p + "%"; } });
            }).start();
    },
    ftp: function (evt, change, key, size, ext) {
        ctl = evt.currentTarget;

        var rd = new FileReader();
        _tid = 0;
        embeds = [];

        var files = evt.currentTarget.files;
        GUX.file.state = 'reading';
        new th_for(files,
            function (tid, it) {
                _tid = tid;

                rd.onload = function (ev) {

                    var markup, result, n, aByte, byteStr;

                    GUX.file.embeds.push({ url: ev.target.result, data: rd.result });

                    th_e(_tid);
                    change(evt.currentTarget, { type: 'reading' });
                }

                rd.readAsBinaryString(it.item);
            },
            function () {
                GUX.file.state = 'sending';

                // xhr req
                var service = ctl.getAttribute('srv');

                service = change(ctl, { type: 'url_prepare', data: service });
                var len = GUX.file.embeds[0].data.length;
                var index = 0;
                var step = 1;
                var eof = false;
                function partUp() {
                    step++;
                    if (eof) return;
                    var ad = "";

                    for (var i = 0; i <= size; i++) {
                        if (i != size && len > index + i) {

                            aByte = GUX.file.embeds[0].data.charCodeAt(index + i);
                            var s = aByte.toString(16);
                            if (s.length == 0) s = "00";
                            else if (s.length == 1) s = "0" + s;
                            if (s.length == 2) ad += s;

                        } else if (i == size) {
                            dy.xhr.upload({
                                url: '/api/ftp/1', type: 'post',
                                data: { key: key, Data: ad },
                                success: function (d) {
                                    ctl.setAttribute('prg', Math.floor(index * 100 / len) + "%"); dy.cuctl.title = Math.floor(index * 100 / len) + "%";
                                    index += d.valueOf() * 1;
                                    if (index < len) {
                                        requestAnimationFrame(partUp);
                                    }
                                    else {
                                        console.log('done.');
                                        dy.xhr.upload({
                                            url: '/api/ftp/1', type: 'post',
                                            data: { key: key, Done: true, Extension: ext },
                                            success: function (d) {

                                                change(ctl, { type: 'ready', data: d });

                                                GUX.file.embeds = new Array();
                                                GUX.file.state = 'ready';
                                                ctl.title = "100%";
                                                ctl.setAttribute('prg', "100%");

                                                setTimeout(function () {
                                                    ctl.setAttribute('prg', "0%");
                                                }, 500);

                                            },
                                            error: function () {
                                                alert('upload is failed . try Again');
                                                GUX.file.embeds = new Array();
                                                GUX.file.state = 'ready';
                                                ctl.title = "100%";
                                                ctl.setAttribute('prg', "100%");

                                                setTimeout(function () {
                                                    ctl.setAttribute('prg', "0%");
                                                }, 500);
                                            }
                                        });

                                    }
                                },
                                error: function () {
                                    alert('try Again');

                                    GUX.file.embeds = new Array();
                                    GUX.file.state = 'ready';
                                    ctl.title = "100%";
                                    ctl.setAttribute('prg', "100%");

                                    setTimeout(function () {
                                        ctl.setAttribute('prg', "0%");
                                    }, 500);
                                }
                            });

                        }
                    }
                }
                change(ctl, { type: 'url_prepare', data: service });
                partUp();

            }).start();
    }
}


