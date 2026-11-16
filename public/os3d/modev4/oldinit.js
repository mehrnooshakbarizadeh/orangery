
scene.roomPosY = 0.2;
scene.wallPosY = 0.;
scene.roomTitlePosY = 0.6;
scene.deskTitlePosY = 4.6;

scene.deskPosY = -4;
scene.parkPosY = 0;

/** color */

scene.floor_shape = { x: 201 / 255,y: 204 / 255,z: 210 / 255 };
scene.floor_wall = { x: 43 / 255,y: 46 / 255,z: 51 / 255 };
scene.floor_hover = { x: 0.0,y: 0.25,z: 0.45 };
scene.floor_select = { x: 249 / 255,y: 213 / 255,z: 7 / 255 };

scene.select_text_co = { x: 43 / 255,y: 46 / 255,z: 51 / 255 };
scene.defult_text_desk_co = '#ffffff'; // {x:255/255,y:255/255,z:255/255};  
scene.defult_text_room_co = '#2B2E33'; // {x:43/255,y:46/255,z:51/255};     

scene.floor_room = { x: 237 / 255,y: 238 / 255,z: 240 / 255 };
scene.floor_desk = { x: 14 / 255,y: 15 / 255,z: 17 / 255 };


scene.desk_font = "17px Arial";
scene.room_font = "bold 30px Arial";
scene.park_font = "bold 40px Arial";

scene.makeSubShape = function (modelItem,x,y,z,r,w,h,m,co,
    ref,isTemp,isAttach,roomMode,roomRef) {

    function apply(modelItem,x,y,z,r,w,h,m,co,map,temp,attach,rmmd,rmref) {

        if (!attach && scene.tempMesh) {
            scene.tempMesh.cm1.dispose();
            scene.tempMesh.cm.dispose();
        }

        if (attach && scene.tempMesh) {

            scene.tempMesh.cm.tempMode = true;
        }

        var res = scene.createShape(map,(m != 'roomCorner' ? w : null),w,h,0,y,m,co,rmmd,rmref);

        if (temp) {
            scene.tempMesh = res;
        }


        scene.setPosY(res.cm);

        var grp = res.cm;
        grp.parent = modelItem.mesh;

        grp.position.x = x;
        grp.position.z = z;
        grp.rotation.y = r;


        res.cm1.floorSubItem = true;
        res.cm1.isPickable = true;

        if (!temp) {
            res.cm.map = map;

            if (map.data.pos) {

                res.cm.position.x = def(map.data.pos.x,0.);
                /* res.cm.position.y = def( map.data.pos.y,0.);*/
                res.cm.position.z = def(map.data.pos.z,0.);
                res.cm.rotation.y = def(map.data.pos.r,0.);
            }



            if (scene.beSelect)
                scene.selectedMesh = res.cm;
        }
    }

    if (!ref && !isTemp) {

        scene.toMap(modelItem.mesh,null,null,modelItem.mesh.id,'','shape',modelItem.mesh.position,{ x: x,y: y,z: z,r: r,w: w,h: h,m: m,co: co },
            function (ms,map) {

                apply(modelItem,x,y,z,r,w,h,m,co,map,null,null,roomMode,roomRef);
            });

    } else if (!isTemp) {

        if (scene.replaceMesh) {

            apply(modelItem,ref.data.x,ref.data.y,ref.data.z,r,w,h,m,co,ref,null,null,roomMode,rmref);

        } else


            apply(modelItem,ref.data.x,ref.data.y,ref.data.z,ref.data.r,ref.data.w,ref.data.h,ref.data.m,co == 'locked' ? co : ref.data.co,ref,null,null,roomMode);

    } else {

        apply(modelItem,x,y,z,r,w,h,m,co,{ id: 'tempId',data: { x: x,y: y,z: z,r: r,w: w,h: h,m: m,co: co } },isTemp,isAttach,roomMode,roomRef);

    }

};



scene.create2DFloor = function (item,ts) {

    ts = def(ts,{ x: 0,y: 0,z: 0 });

    var modelStr = {
        name: item.name || "unknown",
        width: item.width,
        length: item.length,
        height: item.height,
        border: item.border || 0.015,
        color: item.color,
        borderColor: item.borderColor,
        rad: item.radius || 0.5,
        trans: item.uuid == "new_floor" ? true : false
    };


    var mesh = new BABYLON.Mesh();
    mesh.id = "model|" + data.id;
    mesh.isModelParent = true;
    mesh.modelData = data;

    scene.items[data.id] = { data: data,mesh: mesh };

    var modelItem = scene.items[data.id];

    if (ts) {
        modelItem.mesh.position.x = def(ts.x,0.);
        modelItem.mesh.position.y = def(ts.y,0.);
        modelItem.mesh.position.z = def(ts.z,0.);
        modelItem.mesh.item = item;
    }

    if (ts.fun) {
        ts.fun(modelItem,item,null);
        /** nasimi technical dep -- most disable  */
        ts.fun(modelItem,item,null);
    }

};

scene.loadNewInit = function (data) {


    var Items = [];


    for (var i in scene.mapsRef) {
        var i = scene.mapsRef[i];
        if (i.type == "room" && i.reference_uuid.indexOf('postpast') != -1) {

            for (var j in scene.floors) {
                if (scene.floors[j].mesh.id == i.data.parent) {

                    scene.createRoom(30,0,0.5,-60,-40,'roomRect',scene.floors[j].mesh,1,null,null,i.reference_uuid);

                }
            }

        }
    }
};

scene.roomColor = function (ty,st) {

    switch (st) {
        case 'Locked': return { r: 0.5,g: 0.5,b: 0.5 };
    }

    switch (ty) {
        case 'Meeting Room': return { r: 0.6,g: 0.5,b: 0.6 };
        case 'Mailing Room': return { r: 0.4,g: 0.45,b: 0.51 };
        case 'Private Office': return { r: 0.4,g: 0.45,b: 0.55 };
        case 'Warehouse': return { r: 0.4,g: 0.4,b: 0.45 };
        case 'Kitchen': return { r: 0.45,g: 0.4,b: 0.5 };
        case 'WC': return { r: 0.7,g: 0.5,b: 0.5 };
    }
};

scene.remoteColor = function (ty,st) {

    switch (st) {
        case 'Locked': return { r: 0.5,g: 0.5,b: 0.5 };
    }

    return { r: 0.6,g: 0.6,b: 0.4 };

};

scene.departementColor = function (ty,st) {

    switch (st) {
        case 'Locked': return { r: 0.5,g: 0.5,b: 0.5 };
    }

    return { r: 0.03,g: 0.03,b: 0.03 };
};

scene.areaColor = function (ty,st) {

    switch (st) {
        case 'Locked': return { r: 0.5,g: 0.5,b: 0.5 };
    }

    return { r: 0.7,g: 0.7,b: 0.8 };
};

scene.updateRoomStatus = function (mesh) {

    return 0;

    new entity("mapitem",localDB.officeRef).id(mesh.map.uuid).get().then(function (d) {

        d = d.map_item;

        var st = d.data.roomStatus;
        var ty = d.data.roomType;
        var bs = def(d.data.type,'Room');



        if (bs == 'Room') {
            mesh.floor.isVisible = true;
            mesh.wall.used = true;
            mesh.border.isVisible = false;
            mesh.floor.material = scene.roomFMat(scene.roomColor(ty,st));
        }

        if (bs == 'Remote') {
            mesh.floor.isVisible = true;
            mesh.wall.used = true;

            mesh.border.isVisible = false;
            mesh.floor.material = scene.roomFMat(scene.remoteColor(ty,st));
        }

        if (bs == 'Departement') {
            mesh.floor.isVisible = false;
            mesh.wall.used = false;

            mesh.border.isVisible = true;
            mesh.border.material = scene.roomBMat(scene.departementColor(ty,st));
        }

        if (bs == 'Area') {
            mesh.floor.isVisible = false;
            mesh.border.isVisible = true;
            mesh.wall.used = false;

            mesh.border.material = scene.roomBMat(scene.areaColor(ty,st));
        }

    });

};

scene.world = new BABYLON.Mesh(scene);

scene.createFoundation = function () {

    if (scene.mainGround)
        scene.mainGround.dispose();

    scene.mainGround = new BABYLON.Mesh.CreateGround('sdground',7000,7000,2,scene);

    scene.mainGround.parent = scene.world;
    scene.mainGround.material = new BABYLONX.ShaderBuilder()
        .SetUniform("dynamicSample","sampler2D")
        .SetUniform("dynamicSett","vec4")
        .Func(function (me) {
            me.Setting.FragmentWorld = 1;
            me.InLine(`
   vec3 wpos = vec4(world*vec4(pos,1.)).xyz;
   vec3 wnrm =  mat3(world)*nrm;
   `);
            return me;
        })

        .Map({ index: "dynamicSample",uv: 'r_y(vec3((pos.x )*dynamicSett.x*0.002 -0.5,0.,(pos.z )*dynamicSett.x*dynamicSett.y*0.002-0.5) ,dynamicSett.z,vec3(0.) ).xz' }).Reference(5)
        .InLine(`
float fs =1.- dot(wnrm,normalize(wpos-camera));
float w0 = max(0.,abs(sin(wpos.x*0.01+3.14159265*0.5)*130000.)-129990.);
w0  = max(w0,abs(sin(wpos.z*0.01+3.14159265*0.5)*130000.)-129990.);
float w = max(0.,abs(sin(wpos.x*0.1+3.14159265*0.5)*13000.)-12999.);
w  = max(w,abs(sin(wpos.z*0.1+3.14159265*0.5)*13000.)-12999.);
float w2  = max(w,abs(sin(wpos.x*1.+3.14159265*0.5)*1000.)-999.);
w2  = max(w2,abs(sin(wpos.z*1.+3.14159265*0.5)*1000.)-999.);

float l = (1.-max(0.0,min(1.,length(wpos-camera)*0.01)))*0.85+0.15 ; 

result = vec4(  0.,0.,0.,(1.-max(0.,length(pos-camera)/200.0))* length(vec3(w2,w,0.)*0.25)*0.25);
result = vec4( vec3(float(`+
            scene.clearColor.r + `),float(` +
            scene.clearColor.g + `),float(` +
            scene.clearColor.b + `))-result.w,result.w+0.25);

if( dynamicSett.w >0.0){
    result.xyz = mix(result.xyz ,result_5.xyz,dynamicSett.w);
    result.w   = dynamicSett.w;
    result.w = min(1.,dynamicSett.w);
}

`)
        .Event(13,'  result.w = 0.85; ').Transparency().BuildMaterial(scene);
    var txt1 = new BABYLON.Texture(baseImgURL + '/temp.png',scene);
    scene.mainGround.material.setTexture("dynamicSample",txt1);
    scene.mainGround.material.setVector4("dynamicSett",{ x: 0,y: 0,z: 0,w: 0 });
    scene.mainGround.isFixed = true;
};



var mt = 1.;

var W = 1;
var H = 1;
var Y = 1.;

var D = 1;

var RL = 1.;
var CL = 1;

var br = 1;

scene.calculateFloorData = function (data,update) {
    var maxR = 0;
    var maxRoom = 0;

    scene.loadingItems = 0;

    for (var i = 0; i < data.length; i++) {
        maxR = max(def(data[i].number_of_desks,50).valueOf() * 1,maxR);
        maxRoom = max(def(data[i].rooms_count,1).valueOf() * 1,maxRoom);
    }

    maxR = max(50,maxR);
    maxRoom = max(1,maxRoom);

    if (maxR < 50) maxR = 50;
    else if (maxR < 100) maxR = 100;

    maxR = max(maxR,maxRoom * 20.);

    mt = sqrt((maxR * 8.) / 12.) * 5.;

    W = 4 * mt;
    H = 3 * mt;
    Y = 1.;

    D = min(3. * 10,max(3. * 3.,mt / floor((maxR / 105))));

    RL = D * 2.;
    CL = D * 1.5;

    if (update)
        scene.storage['office'] = {
            name: 'office',type: 'office',pos: { x: 0,y: 0,z: 0 },
            data: {
                parent: null,
                iden: localDB.officeRef.identity,
                maxR: maxR,
                mt: mt,
                W: W,
                H: H,
                Y: Y,
                D: D,
                RL: RL,
                CL: CL,
                br: br
                ,rowdata: data
            }
        };

    scene.toMap(scene.mainGround,scene.mapsRef['structure'] ? scene.mapsRef['structure'].uuid : 0,'structure',null,"structure","structure",{ x: 0,y: 0,z: 0,r: 0 },
        scene.storage['office']);

};
scene.roomCounter = 0;
scene.initBuilding = function (data) {

    scene.temp_data = data;
    first('#loading-wait').classList.remove('hdn-i');
    clearTempList('floor-num-temp','flritm');

    /* dispose */

    var mss = [];
    for (var ms in scene.meshes) {

        if (!scene.meshes[ms].isSys)
            mss.push(scene.meshes[ms]);
    }
    for (var ms in mss) {
        mss[ms].parent = null;
        // mss[ms].dispose();
        scene.meshes.pop(mss[ms]);
    }

    /*diable all indexes */
    scene.items = new Array();
    scene.meshes = new Array();
    scene.floors = new Array();
    scene.desks = new Array();

    //scene.calculateFloorData(data,!scene.isFirstLoadWithData) 


    scene.editShape = new BABYLON.Mesh.CreateSphere('s',10,4,scene);
    scene.editShape.material = new BABYLONX.ShaderBuilder()
        .Solid({ r: 0.2,g: 0.1,b: 0.1,a: 0.5 })
        .Event(3,'result.w = 0.9;')
        .Transparency().BuildMaterial(scene);
    scene.editShape.position.y = -60000;


    /* scene.linkToDom({ query: '#ctnFloors',
    pos: { x: -1.05*mt*2.,y: 0 },
    align: 'left center',
  
    css3d:['l-00','w-mx-025','t-005','animated','fadeIn'],
    css2d:['op2','op-h5','animated','fadeInUp'],  });  */



    scene.circle = scene.modelCommand.createGeo('circle',{}).toMesh(scene);
    scene.circle.position.y = -60000;

    scene.square = scene.modelCommand.createGeo('square',{}).toMesh(scene);
    scene.square.position.y = -60000;

    scene.rooms = [];

    var shapeCounter = 0;
    scene.shapes = [];


    scene.createShape = function (map,w1,W,H,r,y,m,co,roomMode,rmref) {

        shapeCounter++;

        var cm = new BABYLON.Mesh('s',scene);


        if (scene.replaceMesh) {

            var mss = [];
            for (var ms in scene.replaceMesh._children) {
                mss.push(scene.replaceMesh._children[ms]);
            }

            for (var ms in mss) {
                mss[ms].dispose();
            }

        }

        cm.color = co;

        cm.rot = r;

        cm.isRoomMode = roomMode;

        cm.rotation.y = r * deg;

        var shapeId = map.uuid;

        cm.id = shapeId;


        var conf1 = {
            w: def(w1,W),
            l: W,h: 0.,d: H,r: br * 0.5,b: br,ry: 0 * deg,
            md: m,
            parts: [0,1]
        };



        if (m == 'triangle') {
            conf1 = {
                md: 'triangle',
                y: y,
                ps: w1
            };
        } else if (m == 'shape_polygon') {
            conf1 = {
                md: 'shape_polygon',
                y: y,
                ps: w1
            };
        } else if (m == 'circle_cus') {
            conf1 = {
                md: 'circle_cus',
                y: y,
                ps: w1
            };
        } else if (m == 'circle_full') {
            conf1 = {
                md: 'circle_full',
                y: y,
                ps: w1
            };
        } else if (m == 'wall2point') {
            conf1 = {
                md: 'wall2point',
                dw: 0,
                y: y,
                h: 32.,
                d: 4,
                ps: w1,
                st: 2.,
                ds: 10.
            };
        }

        cm.conf1 = conf1;



        cm.conf1.room = roomMode;



        if (scene.replaceMesh) {
            map.data.conf1 = cm.conf1;
            map.data.m = m;
            map.data.w = w;
            map.data.r = r;


            scene.toMap(scene.floors[scene.selectedFloor].mesh,map.uuid,null,scene.floors[scene.selectedFloor].mesh.id,'','shape',{ x: 0,y: 0,z: 0 },map.data,
                function (ms,map) {

                    console.log(map);

                    scene.replaceMesh.dispose();

                    scene.replaceMesh = null;
                });


        }

        if (map.data.conf1) cm.conf1 = map.data.conf1;



        var key1 = 'shape' + JSON.stringify(cm.conf1);

        cm.center = { x: def(w1,W) / 2.,y: 0.,z: H / 2.0 };
        /*cm.center = r_y(cm.center, -r*deg); */

        cm.center.w = def(w1,W) / 2.;
        cm.center.d = H / 2.;

        if (m == 'triangle' || m == 'circle_cus' || m == 'circle_full' || m == 'wall2point') {

            cm.floatPoint1 = scene.editShape.clone();

            cm.floatPoint1.parent = cm;

            cm.floatPoint1.position.x = cm.conf1.ps[0];
            cm.floatPoint1.position.z = cm.conf1.ps[1];

            cm.floatPoint1.position.y = -60000;

            cm.floatPoint1.isEditPoint = true;
            cm.floatPoint1.isFloat1 = true;

            cm.floatPoint2 = scene.editShape.clone();

            cm.floatPoint2.parent = cm;

            cm.floatPoint2.position.x = cm.conf1.ps[2];
            cm.floatPoint2.position.z = cm.conf1.ps[3];

            cm.floatPoint2.position.y = -60000;

            cm.floatPoint2.isEditPoint = true;
            cm.floatPoint2.isFloat2 = true;

            cm.floatPoint3 = scene.editShape.clone();

            cm.floatPoint3.parent = cm;

            cm.floatPoint3.position.x = cm.conf1.ps[4];
            cm.floatPoint3.position.z = cm.conf1.ps[5];

            cm.floatPoint3.position.y = -60000;

            cm.floatPoint3.isEditPoint = true;
            cm.floatPoint3.isFloat3 = true;

        } else if (m == 'shape_polygon') {

            cm.floatPoints = [];

            for (var ij = 0; ij < cm.conf1.ps.length; ij += 2) {
                cm.floatPoints.push(scene.editShape.clone());

                if (ij == 0) {
                    n_1(cm.floatPoints).material = new BABYLONX.ShaderBuilder().Solid({ r: 1 }).BuildMaterial(scene);
                }

                n_1(cm.floatPoints).parent = cm;
                n_1(cm.floatPoints).isEditPoint = true;
                n_1(cm.floatPoints).index = floor(ij / 2);
                n_1(cm.floatPoints).position.x = -1. * cm.conf1.ps[ij];
                n_1(cm.floatPoints).position.z = cm.conf1.ps[ij + 1];
            }
        }
        else if (w1) {

            cm.editleft = scene.editShape.clone();

            cm.editleft.parent = cm;

            cm.editleft.position.x = cm.center.x + cm.center.w;
            cm.editleft.position.z = cm.center.z;

            cm.editleft.position.y = -60000;

            cm.editleft.isEditPoint = true;
            cm.editleft.isLeft = true;

            cm.editright = scene.editShape.clone();


            cm.editright.parent = cm;

            cm.editright.position.x = cm.center.x;
            cm.editright.position.z = cm.center.z + cm.center.d;

            cm.editright.position.y = -60000;

            cm.editright.isEditPoint = true;
            cm.editright.isRight = true;


            cm.editleft1 = scene.editShape.clone();

            cm.editleft1.parent = cm;

            cm.editleft1.position.x = cm.center.x - cm.center.w;
            cm.editleft1.position.z = cm.center.z;

            cm.editleft1.position.y = -60000;

            cm.editleft1.isEditPoint = true;
            cm.editleft1.isLeft1 = true;

            cm.editright1 = scene.editShape.clone();

            cm.editright1.parent = cm;

            cm.editright1.position.x = cm.center.x;
            cm.editright1.position.z = cm.center.z - cm.center.d;

            cm.editright1.position.y = -60000;

            cm.editright1.isEditPoint = true;
            cm.editright1.isRight1 = true;


        } else {

            /** corner */

            cm.editleft = scene.editShape.clone();

            cm.editleft.parent = cm;

            cm.editleft.position.x = cm.conf1.w;
            cm.editleft.position.z = cm.center.z;

            cm.editleft.position.y = -60000;

            cm.editleft.isEditPoint = true;
            cm.editleft.isLeft = true;

            cm.editright = scene.editShape.clone();


            cm.editright.parent = cm;

            cm.editright.position.x = cm.center.d;
            cm.editright.position.z = cm.conf1.l;

            cm.editright.position.y = -60000;

            cm.editright.isEditPoint = true;
            cm.editright.isRight = true;

            cm.editleft1 = scene.editShape.clone();

            cm.editleft1.parent = cm;

            cm.editleft1.position.x = 2000;
            cm.editleft1.position.z = 2000;

            cm.editleft1.position.y = -60000;

            cm.editleft1.isEditPoint = true;
            cm.editleft1.isLeft1 = true;

            cm.editright1 = scene.editShape.clone();

            cm.editright1.parent = cm;


            cm.editright1.position.x = 2000;
            cm.editright1.position.z = 2000;

            cm.editright1.position.y = -60000;

            cm.editright1.isEditPoint = true;
            cm.editright1.isRight1 = true;

        }

        var cm1 = null;

        cm1 = canvas_scene.modelCommand.createGeo((m == 'triangle' || m == 'shape_polygon' || m == 'circle_cus' || m == 'circle_full' || m == 'wall2point' ? m : 'room'),cm.conf1).toMesh(canvas_scene);
        scene.cacheMesh[key1] = cm1;
        cm1.name = 'shape';
        cm1.parent = cm;
        cm1.material = cm.conf1.md == 'wall2point' ? scene.shapeMat(co,map,'0.42,0.53,0.645') :

            (cm.conf1.room ? scene.shapeMat(co,map,'0.62,0.65,0.7') : scene.shapeMat(co,map));
        cm.floor = cm1;


        if (co == 'locked')
            cm.isLocked = true;

        cm.isShape = true;
        cm.isWallShape = m == 'wall2point';

        cm1.scaling.y = 0.01;

        scene.shapes[shapeId] = { cm: cm,cm1: cm1 };

        if (rmref && rmref.id) {

            map.data.genRoom = rmref.id;
            map.data.roomType = "General Room";
            map.data.type = "Room";
            map.data.conf1 = cm.conf1;

            new entity('room',localDB.officeRef).id(rmref.id).get().then(function (d) {

                map.name = d.name;

                new entity('mapitem',localDB.officeRef).id(map.uuid).set(map).then(function () {


                    scene.createTitleV2('room',d.name,
                        { alpha: 1,w: 256,h: 64,backRadiusRect: 32,dragable: 1,font: scene.room_font,color: scene.defult_text_room_co }
                        ,7.25,{ x: 0.,y: 0.50,z: 0. },cm,null);

                    new entity('room',localDB.officeRef).id(rmref.id).set({ floor_uuid: scene.floors[scene.selectedFloor].mesh.id }).then(function (th) {

                        console.log(8959,th);
                        sysLog('room floor update!','info',100);

                        var posx = -1;
                        for (var i in d.desks) {
                            posx++;
                            scene.addDesk({ id: d.desks[i].uuid },null,10. + floor(posx / 4) * 15.,8. + floor(posx % 4) * 8.,cm,1);
                        }
                    });
                });
            });

        } else if (map && map.data && map.data.conf1 && map.data.conf1.room) {

            //

            scene.createTitleV2('room',map.name,
                { alpha: 1,w: 256,h: 64,backRadiusRect: 32,dragable: 1,font: scene.room_font,color: scene.defult_text_room_co }
                ,7.25,{ x: 4.,y: 0.50,z: 12. },cm,map);


        }

        /** createDesks */

        for (var i in scene.existDesks) {
            var i1 = scene.existDesks[i];

            scene.deskIdentity++;

            if (scene.mapsRef[i1.uuid] &&
                !scene.desks[i1.uuid] &&
                scene.mapsRef[i1.uuid].data.parent == map.uuid
            ) {

                var deskCeckInroom = false;
                if (map && map.data && scene.roomsRef[map.data.genRoom]) {
                    console.log(333);
                    for (var j in scene.roomsRef[map.data.genRoom].desks) {
                        j = scene.roomsRef[map.data.genRoom].desks[j];

                        console.log(334,j.uuid,i1.uuid);

                        if (j && j.uuid == i1.uuid) {
                            deskCeckInroom = true;
                        }
                    }
                }

                console.log(i1.uuid,deskCeckInroom);

                if (deskCeckInroom) {
                    scene.desks[i1.uuid] = {};
                    scene.addDesk(i1,scene.mapsRef[i1.uuid].data.conf1,scene.mapsRef[i1.uuid].data.pos.x,scene.mapsRef[i1.uuid].data.pos.z,cm);
                } else {

                    console.log(i1);

                    scene.addDesk(i1,scene.mapsRef[i1.uuid].data.conf1,scene.mapsRef[i1.uuid].data.pos.x,scene.mapsRef[i1.uuid].data.pos.z,cm);

                }
            }
        }

        // update desk pos base on floor parent
        for (var i in scene.mapsId) {
            var i1 = scene.mapsId[i];

            for (var flr in scene.floors) {

                if (scene.mapsId[i1.uuid] && scene.mapsId[i1.uuid].type == 'desk' &&
                    !scene.desks[i1.uuid] &&
                    scene.mapsRef[scene.floors[flr].mesh.id] &&
                    scene.mapsRef[scene.floors[flr].mesh.id].type == 'floor' &&
                    scene.mapsId[i1.uuid].data.parent == scene.floors[flr].mesh.id
                ) {

                    scene.deskIdentity++;
                    scene.desks[i1.uuid] = scene.mapsId[i1.uuid];
                    console.log(8989,i1,i1.uuid,scene.desks[i1.reference_uuid]);
                    scene.addDesk({ id: i1.reference_uuid },scene.mapsId[i1.uuid].data.conf1,scene.mapsId[i1.uuid].position_x,scene.mapsId[i1.uuid].position_z,scene.floors[flr].mesh);
                }
            }
        }

        if (!scene.assets) scene.assets = [];

        for (var i in scene.mapsAsset) {
            var i1 = scene.mapsAsset[i];

            scene.newAssetCount++;

            if (scene.mapsId[i1.uuid] && scene.mapsId[i1.uuid].data.parent == map.uuid) {

                scene.assets[i1.uuid] = {};
                scene.addAsset(scene.mapsId[i1.uuid].data.conf1,
                    i1,scene.mapsId[i1.uuid].data.pos,cm);
            }

        }

        // update asset pos base on floor parent
        for (var i in scene.mapsId) {
            var i1 = scene.mapsId[i];

            for (var flr in scene.floors) {

                if (scene.mapsId[i1.uuid] && scene.mapsId[i1.uuid].type == 'asset' &&
                    !scene.assets[i1.uuid] &&
                    scene.mapsRef[scene.floors[flr].mesh.id] &&
                    scene.mapsRef[scene.floors[flr].mesh.id].type == 'floor' &&
                    scene.mapsId[i1.uuid].data.parent == scene.floors[flr].mesh.id
                ) {

                    scene.deskIdentity++;
                    scene.assets[i1.uuid] = {};
                    scene.addAsset(scene.mapsId[i1.uuid].data.conf1,scene.mapsId[i1.uuid],scene.mapsId[i1.uuid].data.pos,scene.floors[flr].mesh);
                }

            }

        }

        return { cm: cm,cm1: cm1 };
    };

    scene.removeShape = function (item) {
        if (confirm('are you wanna remove Selected Shape?')) {

            first('#shape-pop').classList.add('hdn-i');
            first('#shaperoom-pop').classList.add('hdn-i');
            first('#shapewall-pop').classList.add('hdn-i');


            new entity('mapitem',localDB.officeRef).param({ room: item.map.data.genRoom }).id(item.map.uuid).remove().then(function (d,th) {

                /** remove desk shadow map from map items */
                if (th.params.room)
                    new entity('mapitem',localDB.officeRef).get(th.params.room).then(function (dt) {

                        var deskList = [];

                        for (var i in dt.desks) {
                            if (scene.mapsRef[dt.desks[i].uuid]) {
                                new entity('mapitem',localDB.officeRef)
                                    .id(scene.mapsRef[dt.desks[i].uuid].uuid).remove().then(function () { console.log(28); });
                            }
                        }

                        sysLog('room removed only from 3d side','info',100);

                    });

                item.dispose();

            });

        }
    };

    scene.titles = [];

    scene.removeRoom = function (item) {

        if (confirm('are you wanna remove Selected Room?')) {

            first('#avl-room-pop').classList.add('hdn-i');


        }
    };

    scene.reCreateShape = function (cm,prm,f) {


        var corner = 0;
        if (cm.conf1.md == "roomCorner") corner = 1;

        if (prm.d) {

            if (corner) {

                cm.conf1.l = max(cm.conf1.d,prm.d);
            }
            else {

                cm.conf1.d = max(1,prm.d);

                cm.bd_d = max(1,prm.d);
            }

        } else if (prm.w) {

            cm.conf1.w = max(1,prm.w);
        }

        else if (prm.d1) {
            if (corner) {

            } else {

                cm.conf1.d = max(1,cm.center.d * 2. - prm.d1);
            }

        } else if (prm.w1) {

            if (corner) {

            } else {

                cm.conf1.w = max(1,cm.center.w * 2. - prm.w1);
            }

        }


        if (cm && cm.floor) {
            if (cm.catchFloor) cm.catchFloor.dispose();
            cm.catchFloor = cm.floor;
        }

        if (prm.p0) {
            cm.conf1.ps[0] = prm.p0[0];
            cm.conf1.ps[1] = prm.p0[1];
        }

        if (prm.p1) {
            cm.conf1.ps[2] = prm.p1[0];
            cm.conf1.ps[3] = prm.p1[1];
        }

        if (prm.p2) {
            cm.conf1.ps[4] = prm.p2[0];
            cm.conf1.ps[5] = prm.p2[1];
        }


        if (cm.conf1.md == 'shape_polygon') {

            console.log(342,cm.conf1.ps);

            cm.conf1.ps = [];
            for (var i in cm.floatPoints) {
                var cim = cm.floatPoints[i];
                cm.conf1.ps[cim.index * 2] = cim.position.x * -1;
                cm.conf1.ps[cim.index * 2 + 1] = cim.position.z;
            }

            console.log(342,cm.conf1.ps);

        }


        var cm1 = canvas_scene.modelCommand.createGeo(cm.conf1.md == 'triangle' || cm.conf1.md == 'shape_polygon' || cm.conf1.md == 'circle_cus' || cm.conf1.md == 'circle_full' || cm.conf1.md == "wall2point" ? cm.conf1.md : 'room',cm.conf1).toMesh(canvas_scene);
        cm1.name = 'room-border';
        cm1.parent = cm;
        cm1.material = cm.conf1.md == 'wall2point' ? scene.shapeMat(cm.conf1.co,cm.map,'0.42,0.53,0.645') :

            (cm.conf1.room ? scene.shapeMat(cm.conf1.co,cm.map,'0.62,0.65,0.7') : scene.shapeMat(cm.conf1.co,cm.map));


        cm.isShape = true;
        cm.isWallShape = cm.conf1.md == 'wall2point';

        scene.setPosY(cm);

        cm1.scaling.y = 0.01;

        if (cm.editleft) {
            if (corner)
                cm.editleft.position.z = cm.conf1.d / 2.;
            else {
                cm.editleft.position.z = cm.conf1.d / 2.;
                cm.editleft1.position.z = cm.conf1.d / 2.;
            }

            if (corner)
                cm.editright.position.x = cm.conf1.d / 2.;
            else {
                cm.editright.position.x = cm.conf1.w / 2.;
                cm.editright1.position.x = cm.conf1.w / 2.;
            }
        }


        cm.floor = cm1;

        if (cm.map && cm.map.data && cm.map.data.conf1 && cm.map.data.conf1.room) {
            scene.createTitleV2('room',cm.map.name,
                { alpha: 1,w: 256,h: 64,backRadiusRect: 32,dragable: 1,font: scene.room_font,color: scene.defult_text_room_co }
                ,7.25,{ x: 4.,y: 0.50,z: 12. },cm,cm.map);
        }

        else if (cm.title) cm.title.dispose();

        if (cm.catchFloor) {
            setTimeout(() => {
                cm.catchFloor.dispose();
            },10);
        }

        scene.shapes[cm.id].cm1 = cm1;

        if (f) f(scene.shapes[cm.id]);

        if (cm.editleft) {

            if (!corner) {
                if (prm.w1) {

                    cm.floor.position.x = prm.w1;

                    cm.editright.position.x = (cm.center.x + prm.w1 / 2.);
                    cm.editright1.position.x = (cm.center.x + prm.w1 / 2.);

                }

                if (prm.d1) {

                    cm.floor.position.z = prm.d1;

                    cm.editleft.position.z = (cm.center.z + prm.d1 / 2.);
                    cm.editleft1.position.z = (cm.center.z + prm.d1 / 2.);

                }
            }
        }


    };




    scene.addFloorPart = function (mode,pt,tmp,roomMode,roomRef) {


        var points,name;


        if (mode == 4) { name = 'wall2point'; points = def(pt,[-20,0,20,0,0,0]); }//wall2point
        else if (mode == 3) { name = 'triangle'; points = [-50,-50,-50,50,36,0]; } // triangle
        else if (mode == 10) { name = 'circle_cus'; points = def(pt,[0,0,0,15,30,30]); }// circle
        else if (mode == 11) { name = 'circle_full'; points = def(pt,[0,0,0,0.001,30,30]); }// circle full

        else if (mode == 100) {

            scene.pickModeRef.classList.remove('hdn-i');
            scene.pickPointMode = 'shape_polygon';
            scene.pickPoints = [];
            name = 'shape_polygon';

            scene.isPickPoint = true;
            points = scene.pickPoints;
            first('.finish_pick_mode').classList.remove('hdn-i');
            return;

        } else if (mode == 101) {

            scene.pickModeRef.classList.remove('hdn-i');
            scene.pickPointMode = 'customWall';
            scene.pickPoints = [];
            scene.isPickPoint = true;
            points = scene.pickPoints;
            first('.finish_pick_mode').classList.remove('hdn-i');
            return;

        }




        else if (mode == 2) { name = 'roomCorner'; points = 100; }
        else { name = 'roomRect'; points = 100; }

        if (scene.replaceMesh) {


            scene.makeSubShape(scene.floors[scene.selectedFloor],camera._currentTarget.x,0.05,camera._currentTarget.z,0 * deg,
                points,60,name
                ,scene.floorColor,scene.replaceMesh.map,tmp,null,roomMode,roomRef);

        } else {


            scene.makeSubShape(scene.floors[scene.selectedFloor],camera._currentTarget.x,0.05,camera._currentTarget.z,0 * deg,
                points,60,name
                ,scene.floorColor,null,tmp,null,roomMode,roomRef);
        }
    };

    scene.floorApplyItem = function (j,data,f,noroom) {

        scene.create2DFloor({
            uuid: j * 1.0,
            name: data[j].floor_name,
            id: data[j].uuid,
            iu: j * 1.0,
            ir: data[j].rooms_count,
            fun: f,
            radius: 2.,
            borderColor: { r: 0.8,g: 0.85,b: 0.98 },
            color: { r: 0.6,g: 0.69,b: 0.75 },
            width: mt * 3. + 2,
            length: mt * 4. + 2,
            border: 1.5,
        },{
            var: 'sample|' + j * 1.,
            x: 0,
            y: j * 350.,
            z: 0,
            fun: function (mi,m2) {

                if (!scene.floors)
                    scene.floors = [];
                if (!scene.floors[m2.iu]) {

                    scene.floors[m2.iu] = mi;
                    mi.mesh.id = m2.id;

                    if (scene.mapsPar[m2.id]) {

                        for (var ni in scene.mapsPar[m2.id]) {

                            ni = scene.mapsPar[m2.id][ni];
                            if (ni.type == "shape") {

                                scene.makeSubShape(mi,ni.data.x,ni.data.y,ni.data.z,ni.data.r,ni.data.w,ni.data.h,ni.data.m,scene.floorColor,ni);

                                if (ni.dataRecreate) {

                                }
                            }
                        }

                    } else {

                        scene.makeSubShape(mi,-1. * mi.mesh.item.width * 1.031 * 0.5,0.05,-1. * mi.mesh.item.length * 1.031 * 0.5,0 * deg,mi.mesh.item.width * 1.031,mi.mesh.item.length * 1.031,'roomRect',scene.floorColor);

                    }



                    if (scene.mapsRef[m2.id] && scene.mapsRef[m2.id].data.ref) {

                        var refid = scene.mapsRef[m2.id].data.ref;

                        for (var ni in scene.mapsPar[refid]) {

                            ni = scene.mapsPar[refid][ni];
                            if (ni.type == "shape") {

                                console.log(34);

                                scene.makeSubShape(mi,ni.data.x,ni.data.y,ni.data.z,ni.data.r,ni.data.w,ni.data.h,ni.data.m,'locked',ni);


                            }
                        }


                    }



                    mi.mesh.name = 'floor_' + m2.iu;
                    mi.mesh.parent = scene.building;


                }
                else {
                    if (m2.fun) m2.fun(m2.iu + 1,data,m2.fun,noroom);
                }

            }
        });
    };


    scene.updateReference = function () {
        first('#reffloors').innerHTML = '';
        first('#reffloors').appendChild(new Option('--','-1'));
        first('#reffloors').appendChild(new Option('without refrence','-2'));

        for (var f in scene.floors) {
            if (f != scene.selectedFloor)
                first('#reffloors').appendChild(new Option(f + '. ' + scene.floors[f].mesh.item.name,f + '!' + scene.floors[f].mesh.id));
        }
    };

    scene.createNewFloor = function (j,data,f,noroom) {
        var fname = data[j].floor_name;
        var fuid = data[j].uuid;
        var fi = j;


        if (data[j] && (!data[j].uuid || data[j].uuid == "0")) {



            new entity('floor',localDB.officeRef).new({ name: fname }).then(function (dc) {
                data[fi].uuid = dc.floor.uuid;

                scene.storage['office'].data.rowdata = data;

                scene.toMap(scene.mainGround,(scene.mapsRef && scene.mapsRef['structure'] ? scene.mapsRef['structure'].uuid : 0),'structure',null,"structure","structure",{ x: 0,y: 0,z: 0,r: 0 },
                    scene.storage['office']);

                if (data[fi].rooms_count > 0) {



                    var attachedDesk = 0;




                    var rowInd = Math.ceil(pow(data[fi].rooms_count,0.5));

                    var deskPerRoom = Math.ceil(data[fi].number_of_desks / data[fi].rooms_count);



                    for (var i = 0; i < data[fi].rooms_count; i++) {

                        var roomDesks = min(deskPerRoom,data[fi].number_of_desks - attachedDesk);

                        attachedDesk = attachedDesk + roomDesks;

                        console.log(33,rowInd,i,roomDesks,(i % rowInd) * 40.01,floor(i / rowInd) * 50.01);

                        scene.createMultiDesk(roomDesks,{ i: i,j: fi,li: [] },dc.floor.uuid,
                            function (p,fid) {
                                var refDesks = [];

                                for (var id in p.li) {
                                    refDesks.push(id);
                                }

                                new entity('room',localDB.officeRef).new({
                                    name: data[p.j].floor_name + " - Room " + p.i,
                                    description: " ",
                                    capacity: deskPerRoom + 2,
                                    floor_uuid: fid,
                                    desks: refDesks
                                })
                                    .param(p)
                                    .then(function (d,t1) {

                                        new entity('mapitem',localDB.officeRef)

                                            .new({
                                                name: "",
                                                position_x: 0,
                                                position_y: 0,
                                                position_z: 0,
                                                reference_uuid: null,
                                                type: "shape",
                                                data: {
                                                    co: { r: 0.74,g: 0.75,b: 0.8,a: 1 },
                                                    conf1: {
                                                        b: 1,
                                                        d: 45,
                                                        h: 0,
                                                        l: 100,
                                                        md: "roomRect",
                                                        parts: [0,1],
                                                        r: 0.5,
                                                        room: 1,
                                                        ry: 0,
                                                        seg: 5,
                                                        w: 35,
                                                    },
                                                    deps: d.uuid,
                                                    genRoom: d.uuid,
                                                    h: 60,
                                                    m: "roomRect",
                                                    meetRoom: "",
                                                    parent: dc.floor.uuid,
                                                    pos: { x: -1. * rowInd * 0.5 * 40 + (t1.params.i % rowInd) * 40.01,y: 1.,z: -1. * rowInd * 0.5 * 50 + floor(t1.params.i / rowInd) * 50.01,r: 0 },
                                                    r: 0,
                                                    roomStatus: "",
                                                    roomType: "General Room",
                                                    type: "Room",
                                                    w: 35,
                                                    x: 0.0,
                                                    y: 0.05,
                                                    z: 0.0
                                                }
                                            }).then(function (t2) {

                                                ix = (-1. * rowInd * 0.5 * 40 + t1.params.i % rowInd) * 40.01;
                                                iz = -1. * rowInd * 0.5 * 50 + floor(t1.params.i / rowInd) * 50.01;

                                                scene.makeSubShape(scene.floors[t1.params.j],
                                                    ix,0.05,iz,0 * deg,
                                                    35,60,"roomRect",{ r: 0.74,g: 0.75,b: 0.8,a: 1 },t2.map_item,null,null,1);
                                                var colInd = Math.ceil(pow(refDesks.length,0.5));


                                                var dind = 0;
                                                for (var id in p.li) {

                                                    dind++;

                                                    scene.addDesk(p.li[id],null,(dind % colInd) * 10 + 5,(floor(dind / colInd) % 3 ? 5 : 0) + floor(dind / colInd) * 5 + 5,scene.shapes[t2.map_item.uuid].cm);

                                                }

                                            });
                                    });
                            });
                    }



                    if (!scene.isFirstLoadWithData)
                        scene.storage[data[fi].uuid] = {
                            name: fname,type: 'floor',pos: { x: 0,y: 0,z: 0 },
                            data: {
                                parent: null,
                                number: (fi + 1).toFixed('00'),
                                i: fi * 1.0,
                                id: 'floor_' + dc.floor.uuid,
                                floorName: fname
                            }
                        };

                    var pattern = scene.mapsSet[j * 1];
                    var i1 = j * 1;
                    /* if(pattern && pattern.fNumber){ 
                      i1 = pattern.fNumber; 
                   } */

                    createTempElement('.floor-num-temp',{
                        click: function (i) {

                            var th = this;

                            scene.selectedFloor = this.op.i;
                            // first('.selFloor').innerText = 'selected floor:' +scene.selectedFloor;

                            if (first('.tab_p3').offsetWidth != 0) {
                                canvas_scene.getItemList();
                            }

                            scene.updateReference();

                            scene.applySelectedFloor();

                        },
                        number: (j + 1).toFixed('00'),
                        i: j * 1.0,
                        sort: i1,
                        id: 'floor_' + dc.floor.uuid,
                        floorName: fname,
                    });

                    scene.floorApplyItem(fi,data,f,noroom);
                }
            });
        } else if (data[j] && data[j].uuid) {

            new entity('floor',localDB.officeRef).get(data[j].uuid).then(function (dc) {

                if (!scene.isFirstLoadWithData)
                    scene.storage[data[fi].uuid] = {
                        name: fname,type: 'floor',pos: { x: 0,y: 0,z: 0 },
                        data: {
                            parent: null,
                            number: (fi + 1).toFixed('00'),
                            i: fi * 1.0,
                            id: 'floor_' + dc.floor.uuid,
                            floorName: fname
                        }
                    };

                createTempElement('.floor-num-temp',{
                    click: function (i) {
                        var th = this;
                        scene.selectedFloor = this.op.i;
                        // first('.selFloor').innerText = 'selected floor:' +scene.selectedFloor;

                        if (first('.tab_p3').offsetWidth != 0) {
                            canvas_scene.getItemList();
                        }

                        scene.updateReference();

                        scene.applySelectedFloor();

                    },
                    number: (j + 1).toFixed('00'),
                    i: j * 1.0,
                    sort: j * 1.0,
                    id: 'floor_' + dc.floor.uuid,
                    floorName: fname,
                });

                scene.floorApplyItem(fi,data,f,noroom);
            });
        }

    };

    scene.attachExistFloor = function (j,data,f,noroom) {
        scene.loadingItems++;

        if (!scene.isFirstLoadWithData)
            scene.storage[data[j].uuid] = {
                name: data[j].floor_name,type: 'floor',pos: { x: 0,y: 0,z: 0 },
                data: {
                    parent: null,
                    number: (j + 1).toFixed('00'),
                    i: j * 1.0,
                    id: 'floor_' + data[j].uuid,
                    floorName: data[j].floor_name
                }
            };

        createTempElement('.floor-num-temp',{
            click: function (i) {

                var th = this;
                scene.selectedFloor = this.op.i;
                //first('.selFloor').innerText = 'selected floor:' +(scene.selectedFloor+1);
                if (first('.tab_p3').offsetWidth != 0) {
                    canvas_scene.getItemList();
                }

                scene.updateReference();

                scene.applySelectedFloor();
            },
            number: (j + 1).toFixed('00'),
            i: j * 1.0,
            id: 'floor_' + data[j].uuid,
            floorName: data[j].floor_name,
        });

        scene.floorApplyItem(j,data,f,noroom);
    };

    scene.updateShapePos = function (ms,subs,fun) {

        var corner = 0;
        if (ms.conf1.md == "roomCorner")
            corner = 1;

        if (corner) {
            if (fun) fun(ms);
            return;
        }

        var pos = r_y({ x: subs[0].position.x,y: 0,z: -subs[0].position.z },ms.rotation.y);
        for (var i in subs) {
            subs[i].position.x = 0;
            subs[i].position.z = 0;
        }

        ms.position.z -= pos.z;
        ms.position.x += pos.x;

        ms.center.x = ms.conf1.w / 2.;
        ms.center.w = ms.conf1.w / 2.;
        ms.center.z = ms.conf1.d / 2.;
        ms.center.d = ms.conf1.d / 2.;


        if (ms.editleft) {

            ms.editleft.position.x = ms.center.x + ms.center.w;
            ms.editleft.position.z = ms.center.z;

            ms.editleft1.position.x = ms.center.x - ms.center.w;
            ms.editleft1.position.z = ms.center.z;

            ms.editright.position.x = ms.center.x;
            ms.editright.position.z = ms.center.z + ms.center.d;

            ms.editright1.position.x = ms.center.x;
            ms.editright1.position.z = ms.center.z - ms.center.d;
        }

        for (var i in scene.meshes) {
            i = scene.meshes[i];
            if (i.isShape) {

                if (i.editleft) {
                    i.editleft.isPickable = 1;
                    i.editleft1.isPickable = 1;
                    i.editright.isPickable = 1;
                    i.editright1.isPickable = 1;

                }

                if (i.floatPoint1) i.floatPoint1.isPickable = 1;
                if (i.floatPoint2) i.floatPoint2.isPickable = 1;
                if (i.floatPoint3) i.floatPoint3.isPickable = 1;

            }

        }

        if (fun) fun(ms);

    };

    if (!scene.building) scene.building = new BABYLON.Mesh('building',scene);

    scene.existDesks = [];



};


scene.users = [];

scene.createTitle = function (ttl,set,sc,pos,par) {

    ttl = ttl.replaceAll('mapShapeFloor','');

    if (par && par.title) par.title.dispose();

    var title = scene.square.clone();
    title.parent = par;
    title.scaling.x = sc;
    title.scaling.z = sc;
    title.isPickable = false;
    title.ignorePick = true;

    title.position.y = pos.y;
    title.posy = pos.y;

    title.position.x = pos.x;
    title.position.z = pos.z;

    title.material = scene.dyMat(ttl,set);

    par.title = title;
};

scene.createTitleV2 = function (ty,ttl,set,sc,pos,par,map) {

    ttl = ttl.replaceAll('mapShapeFloor','');


    if (par && par.title) par.title.dispose();

    var title = scene.square.clone();

    scene.titles.push(title);
    title.isTitle = true;
    title.type = ty;
    title.parent = par;
    title.scaling.x = (def(set.h,256) / def(set.w,256)) * sc;
    title.scaling.z = sc;
    title.scz = (def(set.h,256) / def(set.w,256));
    title.mspos = { x: 0,y: 0,z: 0 };

    if (ty == 'room' || ty == 'meetroom') {
        title.mspos = { x: 7,y: 0,z: 20 };
    }

    if (map && map.data && map.data.pos2) {

        title.mspos.x = def(map.data.pos2.x,0.);
        title.mspos.z = def(map.data.pos2.z,0.);
        title.rotation.y = def(map.data.pos2.r,0.);

    }

    title.isPickable = set.dragable;
    title.isDragable = set.dragable;
    title.ignorePick = !set.dragable;

    title.position.y = pos.y;
    title.posy = pos.y;

    title.position.x = pos.x;
    title.position.z = pos.z;

    title.material = scene.dyMatV2(ttl,set,set.color);

    par.title = title;

};

scene.iframeInit = function (th) {

    var wn = th.contentWindow;
    // postMessage arguments: data to send, target origin 

    wn.addEventListener('message',scene.handleMessage,false);

};

scene.handleMessage = function (d) {

    if (d.data == 'close') {

        first('#formContainer iframe').src =
            window.baseURL.replace('os3d','') +
            'os3d/white.html';

        if (scene.selectedMesh && scene.selectedMesh.isShape) {
            setTimeout(() => {

                new entity("mapitem",localDB.officeRef).id(scene.selectedMesh.map.uuid).get().then(function (d) {
                    console.log(d);
                    scene.selectedMesh.map = d.map_item;

                    scene.reCreateShape(scene.selectedMesh,{});
                });


            },500);
        }

        if (scene.waitForUpdateDesk) {
            new entity("desk",localDB.officeRef).id(scene.waitForUpdateDesk).get().then(function (d) {
                scene.updateDesk(d.desk,scene.desks[scene.waitForUpdateDesk]);
            });

        }

        first('#formContainer').classList.add('hdn-i');

        if (scene.reuiredListItemRefresh) {
            canvas_scene.reuiredListItemRefresh = 0;


        }
    }


};



scene.newRoomCount = 10000;

scene.addRoom = function () {

    var D = 100;

    var RL = D * 2.;
    var CL = D * 1.5;



    scene.isFirstLoadWithData = false;

    var roomCount = scene.roomCounter++;

    var cm = scene.createRoom(30,0,0.5,-60,-40,'roomRect',scene.floors[scene.selectedFloor].mesh,1,null,null,'room!postpast!' + new Date().getTime());
    cm.position.x = camera._currentTarget.x;
    cm.position.z = camera._currentTarget.z;

    setTimeout(() => {
        canvas_scene.nextMapItem();
    },300);

};

scene.addFloor = function () {

    if (!scene.mapsRef['structure'].uuid) {
        sysLog('info','page need refresh',100);
        return;
    }

    new entity('floor',localDB.officeRef).new({}).then(function (d) {

        scene.temp_data.push({
            uuid: d.floor.uuid,floor_name: d.floor.name,
            number_of_desks: "0",
            rooms_count: "0"
        });

        scene.calculateFloorData(scene.temp_data,1);

        scene.storage['office'].data.rowdata = scene.temp_data;


        scene.toMap(scene.mainGround,scene.mapsRef['structure'].uuid,'structure',null,"structure","structure",{ x: 0,y: 0,z: 0,r: 0 },
            scene.storage['office']);

        scene.createNewFloor(scene.temp_data.length - 1,scene.temp_data,function () {

            scene.selectedFloor = scene.floors.length - 1;

            scene.applySelectedFloor();

            scene.to2DView();

        },true);

    });

};

scene.zoomOut = function () {
    camera.radius += 15;

};
scene.zoomIn = function () {
    camera.radius -= 15;

};
scene.createLockSphere = function () {
    var lockSpare = new BABYLON.Mesh.CreateSphere('loack',50,10,scene);
    lockSpare.isPickable = false;
    lockSpare.scaling.y = 0.2;
    lockSpare.isSys = true;
    lockSpare.material = new BABYLONX.ShaderBuilder()
        .Transparency()
        .InLine(` 

float tr1 = sin(time*0.051+pos.y*2. )*0.5 +0.5;

result = vec4(1.,0.5+tr1*0.25,tr1*0.25,0.5*min(0.75,1.- abs(pos.y)*0.5+tr1*0.25));

`)
        .Back('')
        .BuildMaterial(scene);

    return lockSpare;
};


scene.apply3dCameraMode = function (mode) {

    if (scene.viewMode == '2D' && mode == 'walk') {
        sysLog('Walk mode is availible only in 3d-View','info',100);
        return;
    }

    if (mode == 'walk') {

        first('#icwalk').classList.add('cblack'); first('#icwalk').classList.remove('c-t-iblack');
        first('#icwalk').classList.add('c-t-iwhite');
        first('#icfree').classList.remove('cblack');
        first('#icfree').classList.remove('c-t-iwhite');
        first('#icfree').classList.add('c-t-iblack');

    } else {
        first('#icfree').classList.add('cblack'); first('#icfree').classList.remove('c-t-iblack');
        first('#icfree').classList.add('c-t-iwhite');
        first('#icwalk').classList.remove('cblack');
        first('#icwalk').classList.remove('c-t-iwhite');

        first('#icwalk').classList.add('c-t-iblack');

    }

    scene.p3dCamMode = mode;
};

scene.keysRef = '';

scene.keyWait = [];

window.addEventListener('keydown',function (event) {
    scene.keysRef = scene.keysRef.replaceAll(',' + event.key + ',','');
    scene.keysRef += ',' + event.key + ',';

    stat(scene.keysRef);

});

window.addEventListener('keyup',function (event) {

    scene.keysRef = scene.keysRef.replaceAll(',' + event.key + ',','');



    stat(scene.keysRef);
});

scene.walkSpeed = 1.33;

scene.keyWait.push({
    keys: ['w'],call: function () {

        if (scene.p3dCamMode == 'walk') {

            var dir = norm({
                x: camera.position.x - camera._currentTarget.x,y: 0,
                z: camera.position.z - camera._currentTarget.z
            });

            camera._currentTarget.x -= scene.walkSpeed * dir.x;
            camera._currentTarget.z -= scene.walkSpeed * dir.z;
        }

        if (scene.matTester) {
            scene.matTester.rotation.y += 0.015;
        }

    }
});

scene.keyWait.push({
    keys: ['d'],call: function () {

        if (scene.p3dCamMode == 'walk') {



            var dir = norm({
                x: camera.position.x - camera._currentTarget.x,y: 0,
                z: camera.position.z - camera._currentTarget.z
            });

            dir = r_y(dir,90. * deg);

            camera._currentTarget.x += scene.walkSpeed * dir.x;
            camera._currentTarget.z += scene.walkSpeed * dir.z;
        }

        if (scene.matTester) {
            scene.matTester.rotation.x += 0.015;
        }
    }
});


scene.keyWait.push({
    keys: ['a'],call: function () {

        if (scene.p3dCamMode == 'walk') {


            var dir = norm({
                x: camera.position.x - camera._currentTarget.x,y: 0,
                z: camera.position.z - camera._currentTarget.z
            });

            dir = r_y(dir,-90. * deg);

            camera._currentTarget.x += scene.walkSpeed * dir.x;
            camera._currentTarget.z += scene.walkSpeed * dir.z;
        }
    }
});

scene.keyWait.push({
    keys: ['s'],call: function () {

        if (scene.p3dCamMode == 'walk') {

            var dir = norm({
                x: camera.position.x - camera._currentTarget.x,y: 0,
                z: camera.position.z - camera._currentTarget.z
            });

            camera._currentTarget.x += scene.walkSpeed * dir.x;
            camera._currentTarget.z += scene.walkSpeed * dir.z;
        }

    }
});

scene.keyWait.push({
    keys: ['Escape'],call: function () {
        scene.endPickPointMode();

        scene.setToMesh = false;
        scene.setModelSetting = null;
        scene.setToMeshMode = null;
        scene.setMaterialId = null;
        scene.apply3dCameraMode('free');
        first('.finish_pick_mode').classList.add('hdn-i');
    }
});

scene.keyWait.push({
    keys: ['c'],call: function () {

        if (scene.pickPointMode == 'customWall') {

            scene.pickPoints[scene.pickPoints.length - 1].cutted = true;
            console.log(scene.pickPoints);
        }

    }
});


scene.walkByTouch = false;
canvas_scene.touchStart = function (event) {
    scene.walkByTouch = true;

};

canvas_scene.touchStart2 = function (event) {


};

canvas_scene.touchMove = function (event) {

    if (scene.walkByTouch && event.touches.length > 0) {

        var v1x = first('#touchWalkFloat').parentNode.offsetLeft;
        var v2x = event.touches[0].pageX - v1x;

        var v1y = first('#touchWalkFloat').parentNode.offsetTop;
        var v2y = event.touches[0].pageY;

        first('#touchWalkFloat').style.left = -Math.sign(v1x - v2x) * min(20,max(5,abs(v1x - v2x))) + 'px';
        first('#touchWalkFloat').style.top = -Math.sign(v1y - v2y) * min(20,max(5,abs(v1y - v2y))) + 'px';

        if (scene.p3dCamMode == 'walk') {

            scene.wallTouchSpeed = 0.02 * Math.sign(v1y - v2y) * min(20,max(5,abs(v1y - v2y)));
            scene.wallTouchRotateSpeed = 0.02 * Math.sign(v1x - v2x) * min(20,max(5,abs(v1x - v2x)));

        }

    }
};

canvas_scene.touchEnd = function (event) {

    first('#touchWalkFloat').style.left = '0px';
    first('#touchWalkFloat').style.top = '0px';

    scene.wallTouchSpeed = 0;
    scene.walkByTouch = false;

};

canvas_scene.updateFirstBuilding = function () {

    // check floors
    // sort floors

    canvas_scene.AppendNewFloors();

    first('#loading-wait').classList.add('hdn-i');

};

canvas_scene.AddNewFloorUI = function (index,floor,map) {



    var div = document.createElement('div');
    div.className = "f-center animated slideInRight rt ns   cfloor-h fs-04 bb-i-01 c-b-iwgray h-01 fnt-as pt-0005 pb-0005";

    div.id = 'flr' + floor.uuid.replaceAll('-','_');

    div.ind = index;

    div.innerHTML += `<div>` + (index + 1) + `</div> 
    <div class='ab menulpop hdn-i cflr z10 l-n04 w-04 h-03 mr-0005 rad-10  '> 
        <div class='ab sub r-n02 cflr  w-03   mr-0005 rad-05  f f-ac f-cc f-r f-je  c-tblack fs-04 ' style='top:32px;height:24px'>  
        <div class="pr-005">`+ (index + 1) + `</div>
        </div>

        
        <svg height="10" width="10" style="top:22px;left:120px;"  class='ab sub     '
        viewbox="31.56 89.25 10  10"  '>
          <path style="fill:#fdcd32ff;" d="M 31.418237 87.917631 L 31.418237 99.481266 L 44.102734 99.481266 L 44.102734 99.471448 A 12.611944 11.993711 0 0 1 44.017985 99.473515 A 12.611944 11.993711 0 0 1 31.418237 87.917631 z" />
           
        </svg>
        <svg height="10" width="10" style="top:55px;left:120px;"  class='ab sub      '
        viewbox="31.56 88.15 10  10"  '>
          <path style="fill:#fdcd32ff;" d="M 31.418237,99.481266 V 87.917631 h 12.684497 v 0.0098 a 12.611944,11.993711 0 0 0 -0.08475,-0.0021 12.611944,11.993711 0 0 0 -12.599748,11.555884 z" />
          
        </svg>
        <div class="ab t-0025 l-005 h-025 ">
        <div class="w-325 owf  mb-00125 fnt-as7 bb " title='`+ floor.name + `'>` + floor.name + `</div>
        <div class='pb-00125 w-0325 fnt-as4 bb-i-01 c-b-iwgray fs-04 f f-r f-at f-ct f-jb'>Lock   <div onclick='this.classList.toggle("ccheck");this.classList.toggle("f-js");this.classList.toggle("f-je")' class="owf cgray ccheck c-hblack f f-r f-at f-ct f-je rt h-0025 p-00125 rad-10 w-01 "><div  class=' w-0025 h-0025 cwhite rad-50'></div></div> </div>
        <div class='mb-00125 fnt-as4 fs-04 c-t-hwhite'>Setting</div> 
        </div>
    <div>`;

    div.map = map;
    div.onclick = function () {

        var th = this;

        first('.topSelFloorMenu').classList.remove('hdn-i');
        chooseMenuTab('');

        all('.menulpop',function (at) { at.classList.add('hdn-i'); },function () {
            first('.menulpop',null,th).classList.remove('hdn-i');
        });

        scene.selectedFloor = this.ind;

        scene.updateReference();

        scene.applySelectedFloor();
    };

    first('#newFloors .floorsList').appendChild(div);
};

canvas_scene.AppendNewFloors = function () {

    new entity('floor',localDB.officeRef).list().then(function (d) {

        canvas_scene.floorIndex = def(canvas_scene.floorIndex,0.0);
        var floors = d.floors;

        if (floors.length == 0) {
            sysLog('please add Floor for this location.<br/> we cant find any floor for this item. ','warning',100);
        }

        // sort for floor

        for (var i in floors) {

            i = floors[i];

            var div = first('#flr' + i.uuid.replaceAll('-','_'));

            if (!div) {

                if (!scene.floors) scene.floors = [];

                scene.floors[canvas_scene.floorIndex] = { mesh: new BABYLON.Mesh('floor',scene) };
                scene.floors[canvas_scene.floorIndex].mesh.id = i.uuid;

                scene.floors[canvas_scene.floorIndex].mesh.name = 'floor_' + i.uuid;
                scene.floors[canvas_scene.floorIndex].mesh.item = i;
                scene.floors[canvas_scene.floorIndex].mesh.parent = scene.building;

                if (scene.mapsPar[i.uuid]) {

                    for (var ni in scene.mapsPar[i.uuid]) {

                        ni = scene.mapsPar[i.uuid][ni];
                        if (ni.type == "shape") {

                            scene.makeSubShape(scene.floors[canvas_scene.floorIndex],ni.data.x,ni.data.y,ni.data.z,ni.data.r,ni.data.w,ni.data.h,ni.data.m,scene.floorColor,ni);

                            if (ni.dataRecreate) {

                            }
                        }
                    }
                }

                if (scene.mapsRef && scene.mapsRef[i.uuid]) {
                    canvas_scene.AddNewFloorUI(canvas_scene.floorIndex,i,map);
                }
                else {
                    // detect new floor
                    canvas_scene.AddNewFloorUI(canvas_scene.floorIndex,i);
                }

                canvas_scene.floorIndex++;



            }

        }

        canvas_scene.to2DView();


    });





}




