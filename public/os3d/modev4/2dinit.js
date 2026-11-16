

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

scene.makeSubShape = function (modelItem,x,y,z,r,w,h,m,co,ref,isTemp,isAttach,roomMode,roomRef,fun) {


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

        if (map.reference_uuid) {
            if (!scene.shapeRef) scene.shapeRef = [];
            scene.shapeRef[map.reference_uuid] = res;

        }



        // saved room
        if (map.data && map.data.conf1 && map.data.conf1.room) {
            if (!scene.existRoomsRef) scene.existRoomsRef = [];
            scene.existRoomsRef[map.data.genRoom] = res;
        }

        if (fun) fun(res,map);

        scene.setPosY(res.cm);

        var grp = res.cm;
        grp.parent = modelItem.mesh;

        grp.position.x = x;
        grp.position.z = z;
        grp.rotation.y = r;


        res.cm1.floorSubItem = true;
        res.cm1.isPickable = true;

        if (!scene.isPickPoint && scene.selOrCreateMode != null) {
            scene.initSelOrCreate(res.cm);
        }

        if (!temp) {
            res.cm.map = map;



            if (map.data.pos) {

                res.cm.position.x = def(map.data.pos.x,0.);
                /* res.cm.position.y = def( map.data.pos.y,0.);*/
                res.cm.position.z = def(map.data.pos.z,0.);
                res.cm.rotation.y = def(map.data.pos.r,0.);
            }

            if (scene.beSelect) {

                scene.selectedMesh = res.cm;
            }
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


    /// old used disabled
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




var br = 1;

scene.roomCounter = 0;



scene.users = [];

scene.createTitle = function (ttl,set,sc,pos,par) {

    ttl = ttl.replaceAll('mapShapeFloor','');
    if (!ttl || ttl == "") return;

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
    if (!ttl || ttl == "") return;


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

                appendlog(2);
                scene.updateDesk(d.desk,scene.deskParentMesh[scene.waitForUpdateDesk]);

            });

        }

        first('#formContainer').classList.add('hdn-i');

        if (scene.reuiredListItemRefresh) {
            canvas_scene.reuiredListItemRefresh = 0;


        }
    }


};



scene.newRoomCount = 10000;



scene.addFloor = function () {


    new entity('floor',localDB.officeRef).new({}).then(function (d) {

        canvas_scene.floorIndex = def(canvas_scene.floorIndex,0);

        canvas_scene.AddNewFloorUI(canvas_scene.floorIndex++,d.floor);


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
    keys: ['v'],call: function () {
        if (canvas_scene.selectedMesh &&
            canvas_scene.selectedMesh.conf1 &&
            canvas_scene.selectedMesh.conf1.md == "wall2point")
            canvas_scene.wallRotaionCorrect({ rd: 180 * deg });
    }
});
scene.keyWait.push({
    keys: ['h'],call: function () {
        if (canvas_scene.selectedMesh &&
            canvas_scene.selectedMesh.conf1 &&
            canvas_scene.selectedMesh.conf1.md == "wall2point")
            canvas_scene.wallRotaionCorrect({ rd: 90 * deg });
    }
});


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

scene.initBuilding = function (data) {

    scene.temp_data = data;
    first('#loading-wait').classList.remove('hdn-i');

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
    scene.desksMap = new Array();


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

        if (map && map.data && map.data.conf1 && map.data.conf1.room) {
            if (!scene.rooms) scene.rooms = [];

            if (map.data.genRoom)
                scene.rooms[map.data.genRoom] = cm;
        }





        if (scene.replaceMesh) {
            map.data.conf1 = cm.conf1;
            map.data.m = m;
            map.data.w = w;
            map.data.r = r;


            scene.toMap(scene.floors[scene.selectedFloor].mesh,map.uuid,null,scene.floors[scene.selectedFloor].mesh.id,'','shape',{ x: 0,y: 0,z: 0 },map.data,
                function (ms,map) {



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

        /*  for(var i in scene.existDesks){
              var i1 = scene.existDesks[i];
     
              scene.deskIdentity ++; 
     
              if(scene.mapsRef[i1.uuid] &&
                  !scene.desks[i1.uuid] && 
                   scene.mapsRef[i1.uuid].data.parent == map.uuid 
                   ){ 
     
                var deskCeckInroom = false;
                if(map && map.data && scene.roomsRef[map.data.genRoom]){
                 console.log(333 )
                    for(var j in scene.roomsRef[map.data.genRoom].desks){
                        j = scene.roomsRef[map.data.genRoom].desks[j];
     
                        console.log(334, j.uuid  , i1.uuid)
     
                        if(j && j.uuid == i1.uuid){
                             deskCeckInroom = true;
                        }
                    }
                }
     
                console.log(i1.uuid,deskCeckInroom)
     
                if(deskCeckInroom){
                   scene.desks[i1.uuid] ={}; 
                   scene.addDesk(i1,scene.mapsRef[i1.uuid].data.conf1,scene.mapsRef[i1.uuid].data.pos.x,scene.mapsRef[i1.uuid].data.pos.z,cm);
                } else{
     
                 console.log(i1)
                     
                 scene.addDesk(i1,scene.mapsRef[i1.uuid].data.conf1,scene.mapsRef[i1.uuid].data.pos.x,scene.mapsRef[i1.uuid].data.pos.z,cm);
              
                }   
              }
         }     */

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


                    scene.addDesk({ id: i1.reference_uuid },scene.mapsId[i1.uuid].data.conf1,scene.mapsId[i1.uuid].position_x,scene.mapsId[i1.uuid].position_z,scene.floors[flr].mesh);
                }
            }
        }

        if (!scene.assets) scene.assets = [];

        for (var i in scene.mapsAsset) {

            appendlog();
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

            appendlog();
            var i1 = scene.mapsId[i];

            for (var flr in scene.floors) {


                if (scene.mapsId[i1.uuid] && scene.mapsId[i1.uuid].type == 'asset' &&
                    !scene.assets[i1.uuid] &&
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

            first('#avl-room-pop').classList.add('hdn-i');
            first('#shape-pop').classList.add('hdn-i');
            first('#shapewall-pop').classList.add('hdn-i');
            first('#avl-desk-pop').classList.add('hdn-i');
            first('#avl-asset-pop').classList.add('hdn-i');
            first('#shaperoom-pop').classList.add('hdn-i');

            if (item.map.uuid) {
                item.dispose();
                scene.mapsRef[item.map.reference_uuid] = null;
                scene.mapsId[item.map.uuid] = null;
            }

            new entity('mapitem',localDB.officeRef).param({ room: item.map.data.genRoom }).id(item.map.uuid).remove().then(function (d,th) {

                scene.selectedMesh = null;
                /** remove desk shadow map from map items */
                if (th.params.room)
                    new entity('mapitem',localDB.officeRef).get(th.params.room).then(function (dt) {

                        var deskList = [];

                        scene.mapsRef[item.map.reference_uuid] = null;
                        scene.mapsId[item.map.uuid] = null;


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
        if (cm.conf1 && cm.conf1.md == "roomCorner") corner = 1;

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




    scene.addFloorPart = function (mode,pt,tmp,roomMode,roomRef,modei) {


        var points,name;

        scene.selOrCreateMode = modei;


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


                if (data[fi].rooms_count > 0) {



                    var attachedDesk = 0;




                    var rowInd = Math.ceil(pow(data[fi].rooms_count,0.5));

                    var deskPerRoom = Math.ceil(data[fi].number_of_desks / data[fi].rooms_count);



                    for (var i = 0; i < data[fi].rooms_count; i++) {

                        var roomDesks = min(deskPerRoom,data[fi].number_of_desks - attachedDesk);

                        attachedDesk = attachedDesk + roomDesks;


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

scene.isNeedGenerate = false;
canvas_scene.updateFirstBuilding = function () {

    // check floors
    // sort floors 
    canvas_scene.AppendParkings(function (parks) {
        canvas_scene.AppendNewFloors(
            function () {

                /** only for first step */
                var indd = 0; for (var i in scene.mapsId) indd++;
                if (indd == 0) scene.isNeedGenerate = true;


                canvas_scene.AppendRooms(function () {

                    canvas_scene.AppendRemainDesks();




                    canvas_scene.AppendMeetingRooms(function () {

                        for (var f in scene.floorsRef) {


                            var floor = scene.floorsRef[f];

                            if (floor.roomItemSett) {

                                floor.roomItemSett.ind = def(floor.roomItemSett.ind,1);

                                var meetx = [0,0];
                                if (floor.roomItemSett && floor.roomItemSett.indMeet) {
                                    meetx = [Math.ceil(floor.roomItemSett.ind / 4),min(floor.roomItemSett.ind,4)];
                                }


                                if (scene.isNeedGenerate) canvas_scene.ShapeForFloor(floor,-50 - 10 - 67.5 * meetx[1],floor.roomItemSett.startY + 55,max(67.5 * meetx[0],67.5 * Math.ceil(floor.roomItemSett.ind / 4)),67.5 * meetx[1] + 67.5 * min(floor.roomItemSett.ind,4),floor);



                            } else if (scene.isNeedGenerate) canvas_scene.ShapeForFloor(floor,-50,-0.,100.0,100.0,floor);



                        }

                        var items = [];

                        var iiden = 0;

                        for (var i in scene.meshes) {

                            i = scene.meshes[i];

                            if (i.map && i.map.uuid == undefined) {
                                i.map.data.iiden = iiden++;
                                items.push(i.map);

                            }
                        }


                        canvas_scene.to2DView();

                        first('#loading-wait').classList.add('hdn-i');

                        first('#flr' + canvas_scene.floors[0].mesh.id.replace(/-/g,'_')).click();


                        if (scene.isNeedGenerate) {
                            sysLog('Generated Item Saving ...','info',1);
                            new entity('mapitem',localDB.officeRef).id('bulk').new({ map_items: items }).then(function (d) {




                                sysLog('Generated Item Saved','info',100);

                                for (var i in scene.meshes) {

                                    i = scene.meshes[i];


                                    if (i.map && i.map.uuid == undefined) {

                                        for (var j in d.map_items) {


                                            if (d.map_items[j].data.iiden == i.map.data.iiden) {

                                                i.map.uuid = d.map_items[j].uuid;
                                                scene.mapsId[i.map.uuid] = i.map;
                                                scene.mapsRef[i.map.reference_uuid] = i.map;

                                            }

                                        }
                                    }

                                }


                            });
                        }


                    });

                });


                for (var i in parks) {
                    i = parks[i];

                    var map = {
                        "name": "asset parkingSpot",
                        "type": "asset",
                        "reference_uuid": "30a80d37-305c-4a25-bad1-3570eeaf6f93",
                        "position_x": 0,"position_y": 0,"position_z": 0,
                        "data": {
                            "rot": { "x": 0,"y": 0,"z": 0 },
                            "pos": { "x": -33.86273904419145,"y": 0,"z": 30.32676508232092 },
                            "conf1": { "md": 0,"sz": 0,"type": "parkingSpot","modeCount": 2,"sizeCount": 3,"seg": 10,"size": 0 },
                            "parent": "18937d2d-4947-402b-8c47-e653191a8d74",
                            "notset": false
                        }
                    };



                    scene.parkingSpotsRef[i.uuid] = i;
                }

            }

        );



    });


};

canvas_scene.AddNewFloorUI = function (index,floor,map) {

    var div = document.createElement('div');
    div.className = "f-center animated fadeIn rt ns   cfloor-h fs-04 bb-i-01 c-b-iwgray h-01 fnt-as pt-0005 pb-0005 flr_" + index;

    div.id = 'flr' + floor.uuid.replaceAll('-','_');

    div.ind = index;

    div.innerHTML += `<div>` + (index + 1) + `</div> 
    <div style='left:-124px;' class='ab menulpop hdn-i cflr z10   w-04 h-03 mr-0005 rad-10  '> 
        <div style="right:-45px;height:24px;top:32px;" class='ab sub r-00 cflr  w-02   mr-0005 rad-05  f f-ac f-cc f-r f-je  c-tblack fs-04 ' style='top:32px;height:24px'>  
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
        <div class='pb-00125  w-0325 fnt-as4 bb-i-01 c-b-iwgray fs-04 f f-r f-at f-ct f-jb'>Lock   <div onclick='this.classList.toggle("ccheck");this.classList.toggle("f-js");this.classList.toggle("f-je")' class="owf cgray ccheck lockStatus c-hblack f f-r f-at f-ct f-je rt h-0025 p-00125 rad-10 w-01 "><div  class=' w-0025 h-0025 cwhite rad-50'></div></div> </div>
        <div onclick=" popHide(); canvas_scene.openSettingFloor()" class='mb-00125 fnt-as4 fs-04 c-t-hwhite'>Setting</div> 
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

scene.meshBoundingBox = function (mesh) {

    var mx = 0,mz = 0,nx = 0,nz = 0;

    for (var i in mesh._children) {

        var bxi = mesh._children[i].getBoundingInfo();

        mx = max(mx,bxi.maximum.x);
        mz = max(mz,bxi.maximum.z);
        nx = min(nx,bxi.minimum.x);
        nz = min(nz,bxi.minimum.z);

        if (mesh._children[i]._children && mesh._children[i]._children.length > 0) {

            var bxs = scene.meshBoundingBox(mesh._children[i]);
            mx = max(mx,bxs.mx);
            mz = max(mz,bxs.mz);
            nx = min(nx,bxs.nx);
            nz = min(nz,bxs.nz);

        }
    }

    return { mx: mx,mz: mz,nx: nx,nz: nz };
};

scene.AppendRemainDesks = function (fun) {




    for (var i in scene.mapsId) {
        var i1 = scene.mapsId[i];


        if (scene.mapsId[i1.uuid] && scene.mapsId[i1.uuid].type == 'desk' &&
            !scene.desks[i1.uuid]

        ) {

            for (var mesh in scene.meshes) {
                mesh = scene.meshes[mesh];

                if (mesh && mesh.map && mesh.map.uuid == scene.mapsId[i1.uuid].data.parent) {

                    scene.deskIdentity++;
                    scene.desks[i1.uuid] = scene.mapsId[i1.uuid];

                    scene.addDesk({ id: i1.reference_uuid },
                        scene.mapsId[i1.uuid].data.conf1,
                        scene.mapsId[i1.uuid].position_x,
                        scene.mapsId[i1.uuid].position_z,
                        mesh);


                }

            }



        }

    }


    if (fun) fun();



};

canvas_scene.AppendMeetingRooms = function (fun) {

    // meeting rooms

    new entity('meeting-room',localDB.officeRef).list().then(function (d) {

        var rooms = d.meeting_rooms;


        for (var i in rooms) {
            i = rooms[i];


            if (!scene.roomsDataRef) scene.roomsDataRef = [];

            scene.roomsDataRef[i.uuid] = i;

            if (i.assigned_floor) {

                var floor = scene.floorsRef[i.assigned_floor.uuid];
                if (!floor) console.log('Error : room not have floor',i);

                if (!floor.roomItemSett) {


                    floor.roomItemSett = {
                        c: -1,
                        rowCount: 4,
                        x: 0,y: 0,
                        defStart: 0,
                        startX: -50,startY: 800,
                        width: 50,
                        height: 50
                    };

                    floor.roomItemSett.bound = canvas_scene.meshBoundingBox(floor.mesh);



                    if (floor.roomItemSett.bound.mx == 0 &&
                        floor.roomItemSett.bound.mz == 0 &&
                        floor.roomItemSett.bound.nx == 0 &&
                        floor.roomItemSett.bound.nz == 0) {

                        // not have any content

                        floor.roomItemSett.x = 0;
                        floor.roomItemSett.y = 0;
                        floor.roomItemSett.startX = -50;
                        floor.roomItemSett.startY = -50;
                        floor.roomItemSett.defStart = -50;

                    }
                    else {
                        floor.roomItemSett.x = 0;
                        floor.roomItemSett.y = 0;


                        floor.roomItemSett.defStart = floor.roomItemSett.bound.mx - 10.0;
                        floor.roomItemSett.startY = floor.roomItemSett.bound.mx - 10.0;
                        floor.roomItemSett.startX = -50;
                    }

                }

                if (!floor.firstMettingRoomItemSett) {
                    floor.firstMettingRoomItemSett = 1;
                    floor.roomItemSett.c = -1;

                    floor.roomItemSett.startY += 0.0;
                    floor.roomItemSett.startX = -120;
                    floor.roomItemSett.x = 0;
                    floor.roomItemSett.y = 0;

                }


                if (scene.isNeedGenerate && scene.mapsRef[i.uuid]) {
                    // room exist


                }
                else if (scene.isNeedGenerate) {



                    // room not exist

                    floor.roomItemSett.indMeet = def(floor.roomItemSett.indMeet,0.) + 1;

                    floor.roomItemSett.c++;
                    floor.roomItemSett.x -= floor.roomItemSett.width * 1.3;

                    if (floor.roomItemSett.c % floor.roomItemSett.rowCount == 0) {
                        floor.roomItemSett.y += floor.roomItemSett.height * 1.3;
                        floor.roomItemSett.x = 0;
                    }





                    var map = {
                        "name": i.name,
                        "type": "shape",
                        "reference_uuid": i.uuid,
                        "position_x": 0,
                        "position_y": 0,
                        "position_z": 0,
                        "data": {


                            "z": floor.roomItemSett.x + floor.roomItemSett.startX,
                            "y": 0.05,
                            "x": floor.roomItemSett.y + floor.roomItemSett.startY,
                            "r": 0,
                            "w": floor.roomItemSett.width,
                            "h": floor.roomItemSett.height,

                            "m": "roomRect",
                            "co": { "r": 0.74,"g": 0.75,"b": 0.8,"a": 1 },
                            "parent": floor.mesh.id,

                            "conf1": {
                                "w": floor.roomItemSett.width,
                                "l": floor.roomItemSett.width,
                                "h": 0,
                                "d": floor.roomItemSett.height,
                                "r": 0.5,
                                "b": 1,
                                "ry": 0,
                                "md": "roomRect",
                                "parts": [0,1],
                                "room": 1,
                                "seg": 5
                            },
                            "pos": {
                                "z": floor.roomItemSett.x + floor.roomItemSett.startX,
                                "y": 0.4,
                                "x": floor.roomItemSett.y + floor.roomItemSett.startY,
                                "r": 0
                            },
                            "deps": i.uuid,
                            "type": "Room",
                            "roomType": "Meeting Room",
                            "genRoom": "",
                            "meetRoom": i.uuid,
                            "roomStatus": ""
                        },
                    };



                    var ni = map;

                    scene.makeSubShape(floor,
                        ni.data.x,
                        ni.data.y,
                        ni.data.z,
                        ni.data.r,
                        ni.data.w,
                        ni.data.h,
                        ni.data.m,
                        scene.floorColor,
                        ni,null,null,null,null,function (re,mp) {

                        });

                }
            }

        }
        if (fun) fun();
    });

};

canvas_scene.AppendRooms = function (fun) {

    // meeting rooms

    new entity('room',localDB.officeRef).list().then(function (d) {

        var rooms = d.rooms;

        for (var i in rooms) {
            i = rooms[i];


            if (!scene.roomsDataRef) scene.roomsDataRef = [];

            scene.roomsDataRef[i.uuid] = i;

            if (i.floor) {

                var floor = scene.floorsRef[i.floor.uuid];
                if (!floor) console.log('Error : room not have floor',i);

                if (!floor.roomItemSett) {
                    floor.roomItemSett = { c: -1,rowCount: 4,x: 0,y: 0,defStart: 0,startX: -50,startY: 800,width: 50,height: 50 };

                    floor.roomItemSett.bound = canvas_scene.meshBoundingBox(floor.mesh);


                    if (floor.roomItemSett.bound.mx == 0 &&
                        floor.roomItemSett.bound.mz == 0 &&
                        floor.roomItemSett.bound.nx == 0 &&
                        floor.roomItemSett.bound.nz == 0) {

                        // not have any content

                        floor.roomItemSett.x = 0;
                        floor.roomItemSett.y = 0;
                        floor.roomItemSett.startX = -50;
                        floor.roomItemSett.startY = -50;
                        floor.roomItemSett.defStart = -50;

                    }
                    else {
                        floor.roomItemSett.x = 0;
                        floor.roomItemSett.y = 0;

                        floor.roomItemSett.defStart = floor.roomItemSett.bound.mx - 10.0;
                        floor.roomItemSett.startY = floor.roomItemSett.bound.mx - 10.0;
                        floor.roomItemSett.startX = -50;
                    }

                }

                if (scene.mapsRef[i.uuid]) {
                    // room exist

                    var ix = 0; iz = 0;
                    // add desks
                    if (scene.existRoomsRef[i.uuid]) {
                        for (var j in i.desks) {

                            j = i.desks[j];


                            if (scene.existRoomsRef[i.uuid]) {
                                console.log('ex ro');

                                if (scene.mapsRef[j.uuid]) {

                                    console.log('ex ds');



                                    scene.addDesk(j,
                                        scene.mapsRef[j.uuid].data.conf1,
                                        scene.mapsRef[j.uuid].data.pos.x,scene.mapsRef[j.uuid].data.pos.z,scene.existRoomsRef[i.uuid].cm);


                                } else {
                                    console.log('desk found for room but room not exist !',j);

                                }


                            }
                        }
                    }

                }
                else if (scene.isNeedGenerate) {

                    // room not exist

                    floor.roomItemSett.ind = def(floor.roomItemSett.ind,0) + 1;

                    floor.roomItemSett.c++;
                    floor.roomItemSett.x += floor.roomItemSett.width * 1.3;

                    if (floor.roomItemSett.c % floor.roomItemSett.rowCount == 0) {
                        floor.roomItemSett.y += floor.roomItemSett.height * 1.3;
                        floor.roomItemSett.x = 0;
                    }


                    var extraWidth = 0;
                    if (i.desks && i.desks.length) {

                        extraWidth = max(0,(Math.ceil(i.desks.length / 2.0) - 5.0) * 8.);

                    }


                    var map = {
                        "name": i.name,
                        "type": "shape",
                        "reference_uuid": i.uuid,
                        "position_x": 0,
                        "position_y": 0,
                        "position_z": 0,
                        "data": {

                            "z": floor.roomItemSett.x + floor.roomItemSett.startX,
                            "y": 0.05,
                            "x": floor.roomItemSett.y + floor.roomItemSett.startY,
                            "r": 0,
                            "w": floor.roomItemSett.width,
                            "h": floor.roomItemSett.height + extraWidth,

                            "m": "roomRect",
                            "co": { "r": 0.74,"g": 0.75,"b": 0.8,"a": 1 },
                            "parent": i.floor.uuid,

                            "conf1": {
                                "w": floor.roomItemSett.width,
                                "l": floor.roomItemSett.width,
                                "h": 0,
                                "d": floor.roomItemSett.height + extraWidth,
                                "r": 0.5,
                                "b": 1,
                                "ry": 0,
                                "md": "roomRect",
                                "parts": [0,1],
                                "room": 1,
                                "seg": 5
                            },
                            "pos": {
                                "z": floor.roomItemSett.x + floor.roomItemSett.startX,
                                "y": 0.4,
                                "x": floor.roomItemSett.y + floor.roomItemSett.startY,
                                "r": 0
                            },
                            "deps": i.uuid,
                            "type": "Room",
                            "roomType": "General Room",
                            "meetRoom": "",
                            "genRoom": i.uuid,
                            "roomStatus": ""
                        },
                    };

                    floor.roomItemSett.x += extraWidth;




                    var ni = map;

                    scene.makeSubShape(floor,
                        ni.data.x,
                        ni.data.y,
                        ni.data.z,
                        ni.data.r,
                        ni.data.w,
                        ni.data.h,
                        ni.data.m,
                        scene.floorColor,
                        ni,null,null,null,null,function (re,mp) {
                            var ix = 0; iz = 0;
                            // add desks
                            if (scene.roomsDataRef[map.reference_uuid].desks) {
                                for (var j in scene.roomsDataRef[map.reference_uuid].desks) {
                                    j = scene.roomsDataRef[map.reference_uuid].desks[j];

                                    ix++;

                                    var mapDesk = {

                                        "name": "mapDesk",
                                        "type": "desk",
                                        "reference_uuid": j.uuid,
                                        "position_x": 15. + ix * 12.,
                                        "position_y": 0,
                                        "position_z": 8,
                                        "data": {
                                            "parent": i.uuid,
                                            "notset": false,
                                            "pos": { "x": 15. + ix * 12.,"y": 0.15,"z": 8.0 + iz * 8.0 },
                                            "rot": { "x": 0,"y": 0,"z": 0 },
                                            "conf1": { "seg": 20,"width": 10.5,"length": 6,"rad": 0.35,"height": 4.85,"depth": 0.2,"depth2": 0.2,"col": 3.5,"colin": 0.35,"parts": [1],"type": 0,"kind": 1 },

                                        }
                                    };


                                    scene.addDesk(j,null,15. + ix * 12.,8.0 + iz * 8.0,re.cm,0,function (m) {
                                        m.map = mapDesk;
                                        console.log(881,mapDesk);
                                    });

                                    if (ix % 2 == 0) {
                                        iz++;
                                        ix = 0;
                                    }
                                }
                            }
                        });

                }
            }

        }

        if (fun) fun();
    });

};

canvas_scene.ShapeForFloor = function (floor,x,y,w,h,fun) {

    var map = {
        "name": "",
        "type": "shape",
        "reference_uuid": "",
        "position_x": 0,
        "position_y": 0,
        "position_z": 0,
        "data": {

            "z": x,
            "y": 0.05,
            "x": y,
            "r": 0,
            "w": w,
            "h": w,

            "m": "roomRect",
            "co": { "r": 0.74,"g": 0.75,"b": 0.8,"a": 1 },
            "parent": floor.mesh.id,
            "conf1": {
                "w": w,
                "l": w,
                "h": 0,
                "d": h,
                "r": 0.5,
                "b": 1,
                "ry": 0,
                "md": "roomRect",
                "parts": [0,1],
                "seg": 5
            },
            "pos": {
                "z": x,
                "y": 0.4,
                "x": y,
                "r": 0
            },
            "type": "shape",
        },
    };

    var ni = map;

    scene.makeSubShape(floor,
        ni.data.x,
        ni.data.y,
        ni.data.z,
        ni.data.r,
        ni.data.w,
        ni.data.h,
        ni.data.m,
        scene.floorColor,
        ni,null,null,null,null,function (re,mp) {

        });
};


canvas_scene.AppendNewFloors = function (fun) {

    new entity('floor',localDB.officeRef).list().then(function (d) {

        // sort by name 
        var flrNum = [];
        var floorList = [];
        var iden = 100;
        for (var i in d.floors) {
            i = d.floors[i];

            var fNum = 1000;

            if (scene.mapsSet[i.uuid] && scene.mapsSet[i.uuid].fNumber) {

                fNum = scene.mapsSet[i.uuid].fNumber.valueOf() * 1;

            }

            if (!flrNum[fNum]) flrNum[fNum] = 1;
            else flrNum[fNum]++;




            floorList[fNum * 100 + flrNum[fNum]] = i;
        }


        canvas_scene.floorIndex = def(canvas_scene.floorIndex,0.0);
        var floors = floorList;

        if (floors.length == 0) {
            sysLog('please add Floor for this location.<br/> we cant find any floor for this item. ','warning',100);
        }

        // sort for floor

        for (var i in floors) {
            i = floors[i];

            var div = first('#flr' + i.uuid.replaceAll('-','_'));

            if (!div) {

                if (!scene.floors) scene.floors = [];
                if (!scene.floorsRef) scene.floorsRef = [];

                scene.floors[canvas_scene.floorIndex] = { mesh: new BABYLON.Mesh('floor',scene) };
                scene.floors[canvas_scene.floorIndex].mesh.id = i.uuid;

                scene.floorsRef[i.uuid] = scene.floors[canvas_scene.floorIndex];


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

        if (fun) fun();

    });


};

canvas_scene.AppendParkings = function (fun) {

    // meeting rooms

    new entity('parking-spot',localDB.officeRef).list().then(function (d) {

        var parks = d.parking_spots;

        scene.parkingSpotsRef = [];

        for (var i in parks) {
            i = parks[i];


            scene.parkingSpotsRef[i.uuid] = i;
        }

        if (fun) fun(parks);
    });

};

scene.cameras[0].maxZ = 3000;


scene.initSelOrCreate = function (ms) {




    first('.selList').innerHTML = '';
    first('.selOrCreate').classList.remove('hdn-i');
    first('.selOrCreateWait').classList.remove('hdn-i');
    first('.selOrCreateContent').classList.add('hdn-i');


    switch (scene.selOrCreateMode) {
        case 1: {
            new entity('room',localDB.officeRef)
                .list(function (d) {
                    var rooms = d.rooms;
                    canvas_scene.selOrCreateCall = function (id,name) {

                        if (!id) {
                            // new item
                            new entity('room',localDB.officeRef).new({ floor_uuid: canvas_scene.floors[canvas_scene.selectedFloor].mesh.id }).then(function (d) {

                                console.log(d);
                                scene.selOrCreateCall(d.uuid,d.name);

                            });
                            return;
                        }


                        ms.map.data.conf1 = ms.conf1;
                        ms.map.data.conf1.room = 1;
                        ms.map.data.deps = id;
                        ms.map.data.genRoom = id;
                        ms.map.data.roomStatus = '';
                        ms.map.data.roomType = "General Room";
                        ms.map.data.type = "Room";
                        ms.map.reference_uuid = id;
                        ms.map.name = name;

                        first('.selOrCreateWait').classList.remove('hdn-i');
                        first('.selOrCreateContent').classList.add('hdn-i');

                        new entity('mapitem',localDB.officeRef).param({ ms: ms }).id(ms.map.uuid).set(ms.map).then(function (d) {

                            scene.selOrCreateMode = null;
                            first('.selOrCreate').classList.add('hdn-i');

                            scene.reCreateShape(this.params.ms,{});
                            sysLog('room Data updated.','info',100);
                        });


                    };

                    first('.selTitle').innerHTML = 'Assign Room';
                    first('.creTitle').innerHTML = 'Create Room';

                    for (var i in rooms) {
                        var room = rooms[i];
                        var div = document.createElement('div');
                        div.valUuid = room.uuid;
                        div.valName = room.name;

                        div.style.order = (room.floor ? room.floor.name : '0000');
                        div.innerHTML = `<span class='fs-03 w-full c-tgray '>` + (room.floor ? room.floor.name : '') + `</span><span class="m-0005 w-full  fnt-as3  fl      bb  rad-03 fs-03    c-tblack     ">
              `+ room.name + `
            </span>`;
                        div.className = 'rt   c-hwgray w-full  p-0005 pl-0025 pr-0025 bb-i-01 c-b-iwgray       ns f f-c f-ac f-cc f-js ';
                        div.onclick = function () {
                            canvas_scene.selOrCreateCall(this.valUuid,this.valName);
                        };

                        first('.selList').appendChild(div);

                    }

                    first('.selOrCreateWait').classList.add('hdn-i');
                    first('.selOrCreateContent').classList.remove('hdn-i');

                });


            break;
        };
        case 2: {
            new entity('meeting-room',localDB.officeRef)
                .list(function (d) {
                    var rooms = d.meeting_rooms;
                    canvas_scene.selOrCreateCall = function (id,name) {

                        if (!id) {
                            // new item
                            new entity('meeting-room',localDB.officeRef).new({ floor_uuid: canvas_scene.floors[canvas_scene.selectedFloor].mesh.id }).then(function (d) {

                                console.log(22,d);
                                scene.selOrCreateCall(d.meeting_room.uuid,d.meeting_room.name);

                            });
                            return;
                        }

                        console.log(23,d);


                        ms.map.data.conf1 = ms.conf1;
                        ms.map.data.conf1.room = 1;
                        ms.map.data.deps = id;
                        ms.map.data.meetRoom = id;
                        ms.map.data.roomStatus = '';
                        ms.map.data.roomType = "Meeting Room";
                        ms.map.data.type = "Room";
                        ms.map.reference_uuid = id;
                        ms.map.name = name;

                        first('.selOrCreateWait').classList.remove('hdn-i');
                        first('.selOrCreateContent').classList.add('hdn-i');

                        new entity('mapitem',localDB.officeRef).param({ ms: ms }).id(ms.map.uuid).set(ms.map).then(function (d) {

                            scene.selOrCreateMode = null;
                            first('.selOrCreate').classList.add('hdn-i');

                            scene.reCreateShape(this.params.ms,{});
                            sysLog('room Data updated.','info',100);
                        });


                    };

                    first('.selTitle').innerHTML = 'Assign Meeting Room';
                    first('.creTitle').innerHTML = 'Create Meeting Room';

                    for (var i in rooms) {
                        var room = rooms[i];
                        var div = document.createElement('div');
                        div.valUuid = room.uuid;
                        div.valName = room.name;

                        div.style.order = (room.floor ? room.floor.name : '0000');
                        div.innerHTML = `<span class='fs-03 w-full c-tgray '>` + (room.floor ? room.floor.name : '') + `</span><span class="m-0005 w-full  fnt-as3  fl      bb  rad-03 fs-03    c-tblack     ">
              `+ room.name + `
            </span>`;
                        div.className = 'rt   c-hwgray w-full  p-0005 pl-0025 pr-0025 bb-i-01 c-b-iwgray       ns f f-c f-ac f-cc f-js ';
                        div.onclick = function () {
                            canvas_scene.selOrCreateCall(this.valUuid,this.valName);
                        };

                        first('.selList').appendChild(div);

                    }

                    first('.selOrCreateWait').classList.add('hdn-i');
                    first('.selOrCreateContent').classList.remove('hdn-i');

                });

            break;
        };

    }


};

scene.applyIcon = function () {

    canvas_scene.selectedMesh.map.data.conf1.path = first('.createCustom .img').src;
    canvas_scene.selectedMesh.map.data.conf1.color = first('.createCustom .color').value;
    canvas_scene.selectedMesh.map.data.conf1.title = first('.createCustom .title').value;
    canvas_scene.selectedMesh.map.data.conf1.exac = first('.createCustom .exac').checked;
    canvas_scene.selectedMesh.map.data.conf1.fclr = first('.createCustom .fclr').value;


    first('.createCustomWait').classList.remove('hdn-i');
    first('.createCustomContent').classList.add('hdn-i');

    new entity('mapitem',localDB.officeRef)
        .id(canvas_scene.selectedMesh.map.uuid)
        .set(canvas_scene.selectedMesh.map)
        .then(function (d) {
            canvas_scene.mapsId[d.map_item.uuid] = d.map_item;

            canvas_scene.reCreateAsset(canvas_scene.selectedMesh,{
                path: canvas_scene.selectedMesh.map.data.conf1.path,
                title: canvas_scene.selectedMesh.map.data.conf1.title,
                color: canvas_scene.selectedMesh.map.data.conf1.color,
                exac: canvas_scene.selectedMesh.map.data.conf1.exac
            });

            first('.createCustom').classList.add('hdn-i');

        });




};

scene.wallRotaionCorrect = function (op) {


    var ax = scene.selectedMesh.conf1.ps[0];
    var ay = scene.selectedMesh.conf1.ps[1];
    var bx = scene.selectedMesh.conf1.ps[2];
    var by = scene.selectedMesh.conf1.ps[3];
    var cx = (ax + bx) * 0.5;
    var cy = (ay + by) * 0.5;


    var lab = pow(pow(bx - ax) + pow(by - ay),0.5);

    var alpha = atan((bx - bx) / abs((by - ay) + 0.0001));

    var pp = r_y({ x: 0.,y: 0.,z: lab * 0.5 },op.rd);

    scene.selectedMesh.conf1.ps = [cx + pp.x,cy + pp.z,cx - pp.x,cy - pp.z,0.,0.];
    scene.selectedMesh.map.data.conf1.w = [cx + pp.x,cy + pp.z,cx - pp.x,cy - pp.z,0.,0.];


    canvas_scene.reCreateShape(scene.selectedMesh,{},function (d) {
        d.cm1.floorSubItem = true;
        scene.saveShapeMap(scene.selectedMesh);

        d.cm1.parent.floatPoint1.position.x = scene.selectedMesh.conf1.ps[0];
        d.cm1.parent.floatPoint1.position.z = scene.selectedMesh.conf1.ps[1];
        d.cm1.parent.floatPoint2.position.x = scene.selectedMesh.conf1.ps[2];
        d.cm1.parent.floatPoint2.position.z = scene.selectedMesh.conf1.ps[3];


    });

};

scene.officePrepare = function () {

    new entity('office').list(function (d) {

        if (window.office == null) {
            localDB.currOffice = d.offices[0];
        }
        else {
            for (var int in d.offices) {
                if (d.offices[int].uuid == window.office) {
                    localDB.curr_office = d.offices[int];
                }
            }
            localDB.currOffice = window.office;
        }

        if (isSharedView()) {
            localDB.curr_office = d.offices[0];
        }

        new entity('office').get(localDB.currOffice).then(function (df) {
            localDB.officeRef = this;

            canvas_scene.sceneStarted = 1;

            canvas_scene.initBuilding();


            new entity('mapitem',localDB.officeRef).list(function (dmp) {

                canvas_scene.mapedList(dmp.map_items,function () {
                    canvas_scene.sceneStarted = 1;
                    canvas_scene.updateFirstBuilding();

                });



                /*  if (canvas_scene.mapsRef['structure']) {
    
                      canvas_scene.storage['office'] = canvas_scene.mapsRef['structure'].data;
    
                      //first('#lockPopUp').classList.add('hdn-i');
                      canvas_scene.isFirstLoadWithData = true;
    
                      canvas_scene.getItemList(function () {
                          canvas_scene.updateFirstBuilding();
                          // canvas_scene.updateBuilding(canvas_scene.storage['office'].data.rowdata);
                      });
    
                  }
                  else {*/

                // first time 
                // create def Floors




                // }


            });

        });
    });


};