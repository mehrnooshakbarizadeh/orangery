
const TOKEN_KEY = "__token__";

var currentTokken = localStorage[TOKEN_KEY];

if (isSharedView() && localStorage['slos' + location.search.replace('?','')]) {



    dn({
        url: localStorage['slos' + location.search.replace('?','')],type: 'GET',
        success: function (d) {
            try {
                window.officeData = JSON.parse(d);

                window.sharedOffice = location.search.replace('?','');

                canvas_scene.officePrepare();


            } catch (e) {
                console.log(e);

            }

        },failed: function () {

        }
    });

    console.log(889,window.officeData);
}

window.os3dapi = {
    readFromShare: false,
    sample: {
        token: location.hash != 'temp' ? currentTokken : "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoic3RhZ2luZyIsInV1aWQiOiJhMjk1NWY0My0zMTAyLTRhYjktOTBjOS0yYzgwOGNiNzVlYzQifQ.L4ql0EFnvb_HAuUBHFdAzovuXcZi6_SPSpZ9jJLODlI",
        office: "46bc673a-d2f1-41c1-ae04-5dab63b0c27b",
        stage: "8e3478cb-f8bd-47ae-b247-aaca290f67a3",
        item: "??"
    },
    begin: function (xhr,sample) {
        xhr.setRequestHeader("Authorization","Bearer " + sample.token);
    },
    type: function (xhr,sample) {
        xhr.responseType = sample;
    },
    domain: localStorage["NEXT_PUBLIC_BASE_URL"]
};

function getList(d,ty) {
    var typ = ty;

    if (typ == 'mapitem') typ = 'map_item';

    var d1 = [];
    d1[typ + 's'] = [];
    for (var i in d) d1[typ + 's'].push(d[i]);
    return d1;
}

function getItem(d,ty) {
    var typ = ty;

    if (typ == 'mapitem') typ = 'map_item';

    var d1 = [];
    d1[typ] = d;

    return d1;
}

/** database table properties */
var schema = {
    office: {
        uuid: "inp_iden_readonly",
        name: "inp_name",
        address: "inp_address",
        employee_estimate: "num_employee_estimate",
        data: {}
    },

    building: {
        uuid: "inp_iden_readonly",
        name: "inp_name",
        position_x: "num_position_x",
        position_y: "num_position_y",
        position_z: "num_position_z",
        data: {}
        /* number_of_floors:  not used */
    },

    floor: {
        uuid: "inp_iden_readonly",
        name: "inp_name",
        building_uuid: "ref_buildings"
    },

    desk: {
        uuid: "inp_iden_readonly",

        name: "inp_name",
        assigned_user: [],
        assigned_floor: "ref_floor",
        flex: "flag_flex",
        active: "flag_active",

        department: "",
        capacity: 9
    },
    mapitem: {
        uuid: "inp_iden_readonly",
        name: "inp_name",
        type: "inp_type",
        reference_uuid: "ref_iden",
        position_x: "num_position_x",
        position_y: "num_position_y",
        position_z: "num_position_z",

        data: {}
    },
    empploye: {
        uuid: "inp_iden_readonly",
        name: "inp_name",
        first_name: "inp_first_name",
        last_name: "inp_last_name",
        email: "mail_email"
        /* group_name: "employee",
        group_uuid: "45819cb0-f0c9-4a4f-ad61-984908df8eb8",*/
    },
    department: {
        /** get all */
    }
};

var entity = function (type,parent,data) {
    this.type = type;
    this.parent = parent;
    this.data = data;
};

entity.prototype = {
    parent: null,
    identity: null,
    params: {},
    param: function (p) {
        this.params = p;
        return this;
    },
    id: function (id) {
        if (id) {
            this.identity = id;
            return this;
        }
        return this.identity ? this.identity : "";
    },
    makeUrl: function () {
        var url = "";
        if (this.parent) url = this.parent.makeUrl();

        url += "/" + this.type + (this.identity ? "/" + this.id() : "");
        return url.replace('/null/','//');
    },
    type: "",
    xhr: function (typ,url,su,raw) {
        var fn = dn;
        var th = this;
        if (typ != "GET") fn = up;

        fn({
            url: os3dapi.domain + url,
            type: typ,
            begin: function (xhr) {
                os3dapi.begin(xhr,window.os3dapi.sample);
            },
            data: typ != "GET" || this.send_data ? this.send_data : null,
            success: function (d) {
                if (raw) {
                    su(d);
                    if (th.watcher_success) th.watcher_success(d,th);
                }
                else {
                    d = JSON.parse(d);

                    if (d.success) {
                        if (su) su(d.data);
                        if (th.watcher_success) th.watcher_success(d.data,th);
                    } else {
                        if (th.watcher_error) th.watcher_error(d);
                    }
                }

                if (th.watcher_final) th.watcher_final();
            },
            error: function (d) {
                if (th.watcher_error) th.watcher_error(d);
                else console.log("error:",d);
                if (th.watcher_final) th.watcher_final();
            }
        });
    },
    xhrBinary: function (typ,url,su,raw) {
        var fn = dnb;
        var th = this;
        if (typ != "GET") fn = up;

        fn({
            url: os3dapi.domain + url,
            type: typ,
            begin: function (xhr) {
                os3dapi.begin(xhr,window.os3dapi.sample);
                os3dapi.type(xhr,'arraybuffer');
            },
            data: typ != "GET" || this.send_data ? this.send_data : null,
            success: function (d) {
                if (raw) {
                    su(d);
                    if (th.watcher_success) th.watcher_success(d);
                }
                else {
                    d = JSON.parse(d);

                    if (d.success) {
                        if (su) su(d.data);
                        if (th.watcher_success) th.watcher_success(d.data);
                    } else {
                        if (th.watcher_error) th.watcher_error(d);
                    }
                }

                if (th.watcher_final) th.watcher_final();
            },
            error: function (d) {
                if (th.watcher_error) th.watcher_error(d);
                else console.log("error:",d);
                if (th.watcher_final) th.watcher_final();
            }
        });
    },
    new: function (data) {

        this.send_data = data;
        if (isSharedView()) return this;

        this.xhr("POST",this.makeUrl());
        return this;
    },
    get: function (id) {

        var th = this;
        this.id(id);

        if (isSharedView()) {

            th.data = getItem(window.officeData[th.type][th.identity],th.type);
            console.log(th.data);
            setTimeout(function () { th.watcher_success(th.data,th); },30);
            return th;
        }


        this.xhr("GET",this.makeUrl(),function (d) {
            th.data = d;
        });
        return this;
    },

    raw: function (id,fun) {
        var th = this;
        this.id(id);

        if (isSharedView()) {


            return th;
        }


        this.xhrBinary("GET",this.makeUrl(),function (d) {
            fun(d);
        },1);
        return this;
    },

    list: function (fun) {

        var th = this;

        if (isSharedView()) {
            th.data = getList(window.officeData[th.type],th.type);
            console.log(th.data);
            if (fun) fun(th.data);
            else setTimeout(function () { th.watcher_success(th.data,th); },30);

            return th;
        }

        this.xhr("GET",this.makeUrl(),function (d) {


            if (th.type == 'mapitem' && localDB.officeRef && localDB.officeRef.data && localDB.officeRef.data.is_customer) {

                new entity('mapitem',localDB.officeRef).id('parent').get().then(function (dd2) {

                    for (var i in dd2.map_items) {
                        dd2.map_items[i].locked = true;
                        d.map_items.push(dd2.map_items[i]);
                    }

                    if (fun) fun(d);


                    th.data = d;
                });

            } else {
                if (fun) fun(d);
                th.data = d;
            }

        });
        return this;
    },
    table: null,
    setAsDictionary: function (list,iden,func,final) {
        this.table = null;
        this.table = [];
        for (var itm in this.table) this.table[itm] = null;
        for (var itm in list) {
            itm = list[itm];
            this.table[itm[iden]] = itm;
            if (func) func(itm[iden],this.table[itm[iden]]);
        }

        if (final) final(this.table);
        return this;
    },
    set: function (data) {
        console.log(333,data,this);
        var th = this;
        this.send_data = data;

        this.id(data.id);
        console.log(333,data,this);

        if (isSharedView()) return this;

        this.xhr("PUT",this.makeUrl());
        return this;
    },
    remove: function () {
        var th = this;
        if (isSharedView()) return this;

        this.xhr("DELETE",this.makeUrl());
        return this;
    },
    then: function (f) {

        this.watcher_success = f;
        return this;
    },
    error: function (f) {
        this.watcher_error = f;
        return this;
    },
    final: function (f) {
        this.watcher_final = f;
        return this;
    },
    watcher_success: null,
    watcher_error: null,
    watcher_final: null,
    data: {},
    send_data: {}
};

window.entity = entity;

/** currunt item + all items */

window.localDB = {
    all_buildings: null,
    all_floors: null,
    all_desks: null,
    all_items: null,
    all_offices: new entity("office"),
    curr_office: null,
    floor: null,
    desk: null,
    item: null,
    loadProcess: 0
};

localDB.curr_office = "";


window.makeLink = function () {


    first('#shareLinkView input').value = (location.toString().indexOf('localhost') != -1 ?
        'http://localhost:3030/os3d/view.htm?' : 'https://space.orangeryos.de/os3d/view.htm?') + res.data +
        '#!' + first('.camViewShareLink').value +
        '!' + first('.floorViewShareLink').value +
        '!' + first('.iconViewShareLink').value +
        '!' + first('.scrlViewShareLink').value + '~' +
        floor(canvas_scene.cameras[0].alpha * 100) + '!' +
        floor(canvas_scene.cameras[0].beta * 100) + '!' +
        floor(canvas_scene.cameras[0].radius * 100) + '!' +
        floor(canvas_scene.cameras[0]._currentTarget.x * 100) + '!' +
        floor(canvas_scene.cameras[0]._currentTarget.y * 100) + '!' +
        floor(canvas_scene.cameras[0]._currentTarget.z * 100) + '!' +
        floor(canvas_scene.selectedFloor * 1) + '!v1';

};

window.prepareJsonShareLink = function (callback) {
    first('#shareLinkView .waitshare').classList.remove('hdn-i');
    first('#shareLinkView').classList.remove('hdn-i');

    var iJson = {
        floor: {},
        desk: {},
        meeting_room: {},
        room: {},
        office: {},
        mapitem: {}
    };
    new entity('floor',localDB.officeRef).list(function (d) { for (var i = 0; i < d["floors"].length; i++) { iJson.floor[d["floors"][i]["uuid"]] = structuredClone(d["floors"][i]); } }).then(() => {
        new entity('desk',localDB.officeRef).list(function (d) { for (var i = 0; i < d["desks"].length; i++) { iJson.desk[d["desks"][i]["uuid"]] = structuredClone(d["desks"][i]); } }).then(() => {
            new entity('office').id(localDB.officeRef.identity).get().then(function (d) {
                iJson.office[d.uuid] = structuredClone(d);
                for (var i = 0; i < d["meeting_rooms"].length; i++) { iJson.meeting_room[d["meeting_rooms"][i]["uuid"]] = structuredClone(d["meeting_rooms"][i]); }
                new entity('room',localDB.officeRef).list(function (d) { for (var i = 0; i < d["rooms"].length; i++) { iJson.room[d["rooms"][i]["uuid"]] = structuredClone(d["rooms"][i]); } }).then(() => {
                    new entity('mapitem',localDB.officeRef).list(function (d) { for (var i = 0; i < d["map_items"].length; i++) { iJson.mapitem[d["map_items"][i]["uuid"]] = structuredClone(d["map_items"][i]); } }).then(() => {
                        const jsn = JSON.stringify(iJson);
                        const blob = new Blob([jsn],{ type: 'application/json' });
                        const file = new File([blob],'file.json');
                        var data = new FormData();
                        data.append("file",file);
                        data.append("office_uuid",localDB.officeRef.identity);
                        var xmlhttp = new XMLHttpRequest();
                        var theUrl = os3dapi.domain + '/file/document/public';
                        xmlhttp.onreadystatechange = function () {
                            if (this.readyState == 4 && this.status == 200) {
                                res = JSON.parse(xmlhttp.response);

                                window.makeLink();


                                first('#shareLinkView .waitshare').classList.add('hdn-i');
                                if (callback) callback(res,iJson);
                            }
                        };
                        xmlhttp.open("POST",theUrl);
                        xmlhttp.setRequestHeader("Authorization","Bearer " + localStorage['__token__']);
                        xmlhttp.send(data);
                    });
                });
            });
        });
    });
}






