

scene.clearColor = new BABYLON.Color4(0.96,0.98,1,1);


scene.deskIdentity = 1;

for (var ms in scene.meshes) scene.disposeMesh(scene.meshes[ms]);

scene.link2Dom = [];

scene.linkToDom = function (mm) {
    scene.link2Dom[mm.query] = mm;
};

if (isSharedView()) {
    first('#touchWalk').classList.remove('mob');
    first('#touchWalk').classList.add('api-1110');
}

scene.createModel = function (data,fun) {

    if (scene.getMeshByID("model|" + data.id)) {
        scene.disposeMesh(scene.getMeshByID("model|" + data.id));
    }

    var mesh = new BABYLON.Mesh();
    mesh.id = "model|" + data.id;
    mesh.isModelParent = true;
    mesh.modelData = data;

    scene.items[data.id] = { data: data,mesh: mesh };

    callWorker({ id: data.id,mode: "model",data: data },fun);

};

if (!urlscrl()) {
    camera.inputs.remove(camera.inputs.attached.mousewheel);
    window.addEventListener('scroll',function () { console.log(33); return false; });
}


scene.motions = {
    speed: 10,
    mainCameraTarget: null,
};

scene.selectedFloor = 0;

scene.motions.mainCameraMove = new scene.UI.motion('mainCameraMove',
    function (v) {
        camera._currentTarget.x = v * (scene.motions.mainCameraTarget.x) + (1. - v) * (camera._currentTarget.x);
        camera._currentTarget.y = v * (scene.motions.mainCameraTarget.y) + (1. - v) * (camera._currentTarget.y);
        camera._currentTarget.z = v * (scene.motions.mainCameraTarget.z) + (1. - v) * (camera._currentTarget.z);

        camera.radius = v * (scene.motions.mainCameraTarget.r) + (1. - v) * (camera.radius);
        camera.alpha = v * (scene.motions.mainCameraTarget.a) + (1. - v) * (camera.alpha);
        camera.beta = v * (scene.motions.mainCameraTarget.b) + (1. - v) * (camera.beta);

        if (v == 1) {

            camera.upperAlphaLimit = scene.motions.mainCameraTarget.range_a ?
                scene.motions.mainCameraTarget.range_a[1] : null;
            camera.lowerAlphaLimit = scene.motions.mainCameraTarget.range_a ?
                scene.motions.mainCameraTarget.range_a[0] : null;

            camera.upperBetaLimit = scene.motions.mainCameraTarget.range_b ?
                scene.motions.mainCameraTarget.range_b[1] : null;
            camera.lowerBetaLimit = scene.motions.mainCameraTarget.range_b ?
                scene.motions.mainCameraTarget.range_b[0] : null;

            camera.upperRadiusLimit = scene.motions.mainCameraTarget.range_r ?
                scene.motions.mainCameraTarget.range_r[1] : null;
            camera.lowerRadiusLimit = scene.motions.mainCameraTarget.range_r ?
                scene.motions.mainCameraTarget.range_r[0] : null;

            if (scene.motions.mainCameraTarget.mi && scene.motions.mainCameraTarget.mi.mesh.select) {

                scene.motions.mainCameraTarget.mi.mesh.select();
            }

            this.status = 0;
            this.startTime = null;

        }

    },10,scene.motions.speed);

scene.walkCamera = new BABYLON.FreeCamera("camera1",new BABYLON.Vector3(0,5,-10),scene);
scene.activeCameras.push(camera);
/* scene.activeCameras.push(scene.walkCamera);*/
scene.activeCamera = camera;

scene.walkCamera.speed = 0.35;
scene.personViewHeightCorrection = 0.8;

scene.walkCamera.maxZ = 0.0001;
scene.walkCamera.minZ = 0.;

scene.gravity = new BABYLON.Vector3(0,-0.9,0);
scene.walkCamera.ellipsoid = new BABYLON.Vector3(0.1,0.91,0.1);
scene.walkCamera.ellipsoidOffset = new BABYLON.Vector3(0.2,0.66,0.2);

scene.collisionsEnabled = true;
scene.walkCamera.checkCollisions = true;

scene.walkCamera.applyGravity = true;

scene.items = [];

scene.canvas = canvas;
scene.heightDomMig = 11.75;
scene.time = 10000000;
camera.wheelPrecision = 1;

camera.alpha = 0.5;
camera.beta = 0.75;
camera.radius = 500;

scene.currentFloor = 0;
scene.mapItemCount = 0;

scene.pickModeRef = first('#pickInfo');

scene.onFrame = function (ti,c) {
    var t = scene.time++;

    /* console.log(  canvas_scene.keysRef);*/

    if (scene.isPickPoint) {

        if (!scene.pickHelperPos) {
            scene.pickHelperPos = new BABYLON.Mesh('helper',scene);
            var bx = new BABYLON.Mesh.CreateBox('linex',0.15,scene);
            bx.material = new BABYLONX.ShaderBuilder().Solid({ b: 0.5,a: 0.25 }).Transparency().BuildMaterial(scene);
            bx.scaling.x = 10000.0;
            bx.parent = scene.pickHelperPos;
            bx.isPickable = false;



            var bm = new BABYLON.Mesh.CreateBox('linex',0.15,scene);
            bm.material = new BABYLONX.ShaderBuilder().Solid({ r: 1. }).BuildMaterial(scene);
            bm.scaling.x = 10000.0;
            bm.parent = scene.pickHelperPos;
            bm.isPickable = false;
            scene.pickHelperPos.main = bm;

            var radiusChange = (index,distance) => {
                return 1.0 + index * 0.015;
            };

            const myPath = [
                new BABYLON.Vector3(0.0,0,0.0),
                new BABYLON.Vector3(0,-0.01,0.0)
            ];

            var cr = BABYLON.MeshBuilder.CreateTube("tube",{ path: myPath,radiusFunction: radiusChange },scene);
            cr.material = new BABYLONX.ShaderBuilder().Solid({ r: 1.,a: 0.05 }).Transparency().BuildMaterial(scene);
            cr.parent = scene.pickHelperPos;
            cr.isPickable = false;
            scene.pickHelperPos.range = cr;



            var radiusChange2 = (index,distance) => {
                return 2.0 + index * 0.015;
            };

            var cr2 = BABYLON.MeshBuilder.CreateTube("tube",{ path: myPath,radiusFunction: radiusChange2 },scene);

            cr2.material = new BABYLONX.ShaderBuilder().Solid({ r: 1.,a: 0.05 }).Transparency().BuildMaterial(scene);
            cr2.parent = scene.pickHelperPos;
            cr2.isPickable = false;
            scene.pickHelperPos.range2 = cr2;

            var radiusChange3 = (index,distance) => {
                return 0.5 + index * 0.015;
            };

            var cr3 = BABYLON.MeshBuilder.CreateTube("tube",{ path: myPath,radiusFunction: radiusChange3 },scene);

            cr3.material = new BABYLONX.ShaderBuilder().Solid({ r: 1.,a: 0.05 }).Transparency().BuildMaterial(scene);
            cr3.parent = scene.pickHelperPos;
            cr3.isPickable = false;
            scene.pickHelperPos.range3 = cr3;



            var bm2 = new BABYLON.Mesh.CreateBox('linex',0.15,scene);
            bm2.material = new BABYLONX.ShaderBuilder().Solid({ r: 0.5,a: 0.15 }).Transparency().BuildMaterial(scene);
            bm2.scaling.x = 10000.0;
            bm2.parent = scene.pickHelperPos;
            bm2.isPickable = false;
            scene.pickHelperPos.main2 = bm2;

            var bp = new BABYLON.Mesh.CreateBox('linex',1,scene);
            bp.material = new BABYLONX.ShaderBuilder().Solid({ b: 0.5,a: 0.5 }).Transparency().BuildMaterial(scene);
            bp.parent = scene.pickHelperPos;
            bp.isPickable = false;


            scene.pickHelperPos.lineX = bx;

            var bz = new BABYLON.Mesh.CreateBox('linez',0.15,scene);
            bz.material = new BABYLONX.ShaderBuilder().Solid({ b: 0.25,a: 0.25 }).Transparency().BuildMaterial(scene);

            bz.scaling.z = 10000.0;
            bz.isPickable = false;

            bz.parent = scene.pickHelperPos;
            scene.pickHelperPos.lineZ = bz;

            var b45 = new BABYLON.Mesh.CreateBox('linez',0.15,scene);
            b45.material = new BABYLONX.ShaderBuilder().Solid({ r: 0.5,g: 0.5,b: 0.75,a: 0.1 }).Transparency().BuildMaterial(scene);

            b45.scaling.z = 10000.0;
            b45.isPickable = false;
            b45.rotation.y = 45 * deg;
            b45.parent = scene.pickHelperPos;
            var b45 = new BABYLON.Mesh.CreateBox('linez',0.15,scene);
            b45.material = new BABYLONX.ShaderBuilder().Solid({ r: 0.5,g: 0.5,b: 0.75,a: 0.1 }).Transparency().BuildMaterial(scene);

            b45.scaling.z = 10000.0;
            b45.isPickable = false;
            b45.rotation.y = -45 * deg;
            b45.parent = scene.pickHelperPos;

            var b45 = new BABYLON.Mesh.CreateBox('linez',0.15,scene);
            b45.material = new BABYLONX.ShaderBuilder().Solid({ r: 0.5,g: 0.5,b: 0.75,a: 0.1 }).Transparency().BuildMaterial(scene);

            b45.scaling.z = 10000.0;
            b45.isPickable = false;
            b45.rotation.y = -30 * deg;
            b45.parent = scene.pickHelperPos;

            var b45 = new BABYLON.Mesh.CreateBox('linez',0.15,scene);
            b45.material = new BABYLONX.ShaderBuilder().Solid({ r: 0.5,g: 0.5,b: 0.75,a: 0.1 }).Transparency().BuildMaterial(scene);

            b45.scaling.z = 10000.0;
            b45.isPickable = false;
            b45.rotation.y = -60 * deg;
            b45.parent = scene.pickHelperPos;

            var b45 = new BABYLON.Mesh.CreateBox('linez',0.15,scene);
            b45.material = new BABYLONX.ShaderBuilder().Solid({ r: 0.5,g: 0.5,b: 0.75,a: 0.1 }).Transparency().BuildMaterial(scene);

            b45.scaling.z = 10000.0;
            b45.isPickable = false;
            b45.rotation.y = 30 * deg;
            b45.parent = scene.pickHelperPos;

            var b45 = new BABYLON.Mesh.CreateBox('linez',0.15,scene);
            b45.material = new BABYLONX.ShaderBuilder().Solid({ r: 0.5,g: 0.5,b: 0.75,a: 0.1 }).Transparency().BuildMaterial(scene);

            b45.scaling.z = 10000.0;
            b45.isPickable = false;
            b45.rotation.y = 60 * deg;
            b45.parent = scene.pickHelperPos;
            scene.pickHelperPos.lineZ = bz;

        }



        if (canvas_scene.pickPoints && canvas_scene.pickPoints[canvas_scene.pickPoints.length - 1]) {

            if (canvas_scene.pickPoints.length > 1) {
                var a = canvas_scene.pickPoints[canvas_scene.pickPoints.length - 1];
                var b = canvas_scene.pickPoints[canvas_scene.pickPoints.length - 2];

                var alpha = 0.;

                if ((a.z - b.z) != 0.0)
                    alpha = atan((a.x - b.x) / (a.z - b.z));

                var len = pow(pow(a.x - b.x) + pow(a.z - b.z),0.5);

                scene.pickHelperPos.main.rotation.y = 90. * deg + alpha;
                scene.pickHelperPos.main2.rotation.y = alpha;

                scene.pickHelperPos.range.scaling.x = len * 1.;
                scene.pickHelperPos.range.scaling.z = len * 1.;

                scene.pickHelperPos.range2.scaling.x = len * 1.;
                scene.pickHelperPos.range2.scaling.z = len * 1.;

                scene.pickHelperPos.range3.scaling.x = len * 1.;
                scene.pickHelperPos.range3.scaling.z = len * 1.;


            }

            scene.pickHelperPos.position.x = canvas_scene.pickPoints[canvas_scene.pickPoints.length - 1].x;
            scene.pickHelperPos.position.z = canvas_scene.pickPoints[canvas_scene.pickPoints.length - 1].z;
            scene.pickHelperPos.position.y = 5.75;
        } else {

        }






    } else if (scene.pickHelperPos) {
        scene.pickHelperPos.position.x = 900000;
    }

    if (scene.selectedMesh &&
        scene.selectedMesh.map &&
        scene.selectedMesh.map &&
        scene.selectedMesh.map.data.m == "wall2point") {

        if (!scene.selectedMesh.map.data.conf1) {
            scene.selectedMesh.map.data.conf1 = { ps: scene.selectedMesh.map.data.w };
        }

        if (!scene.wallPointHelper1) {

            scene.wallPointHelper1 = new BABYLON.Mesh.CreateBox('linex',0.15,scene);
            scene.wallPointHelper1.material = new BABYLONX.ShaderBuilder().Solid({ b: 0.5,a: 0.25 }).Transparency().BuildMaterial(scene);
            scene.wallPointHelper1.scaling.x = 10000.0;
            scene.wallPointHelper1.isPickable = false;

            scene.wallPointHelper2 = new BABYLON.Mesh.CreateBox('linex',0.15,scene);
            scene.wallPointHelper2.material = new BABYLONX.ShaderBuilder().Solid({ b: 0.5,a: 0.25 }).Transparency().BuildMaterial(scene);
            scene.wallPointHelper2.scaling.x = 10000.0;
            scene.wallPointHelper2.isPickable = false;


            scene.wallPointHelper3 = new BABYLON.Mesh.CreateBox('linex',0.15,scene);
            scene.wallPointHelper3.material = new BABYLONX.ShaderBuilder().Solid({ r: 0.5,a: 0.25 }).Transparency().BuildMaterial(scene);
            scene.wallPointHelper3.scaling.x = 10000.0;
            scene.wallPointHelper3.isPickable = false;

        }

        var ps = scene.selectedMesh.map.data.conf1.ps;
        var alpha1 = 0;
        if (ps[1] - ps[3] != 0)
            alpha1 = atan((ps[0] - ps[2]) / (ps[1] - ps[3]));
        var ce = [ps[0] + ps[2],ps[1] + ps[3]];

        scene.wallPointHelper1.rotation.y = alpha1;
        scene.wallPointHelper1.position.x = ce[0] * 0.5;
        scene.wallPointHelper1.position.z = ce[1] * 0.5;
        scene.wallPointHelper1.parent = scene.selectedMesh;

        scene.wallPointHelper2.rotation.y = alpha1 + 90 * deg;
        scene.wallPointHelper2.parent = scene.selectedMesh;
        scene.wallPointHelper2.position.x = ce[0] * 0.5;
        scene.wallPointHelper2.position.z = ce[1] * 0.5;

        scene.selectedMesh.a = alpha1;
        scene.selectedMesh.c = ce;

        scene.wallSelected = scene.selectedMesh;

        scene.wallPointHelper1.visibility = 1;
        scene.wallPointHelper2.visibility = 1;

        scene.wallPointHelper3.visibility = 0;

        if (scene.lastWallSelected) {

            scene.wallPointHelper3.rotation.y = scene.lastWallSelected.a + 90 * deg;
            scene.wallPointHelper3.parent = scene.lastWallSelected;
            scene.wallPointHelper3.position.x = scene.lastWallSelected.c[0] * 0.5;
            scene.wallPointHelper3.position.z = scene.lastWallSelected.c[1] * 0.5;



            scene.wallPointHelper3.visibility = 1;

        }


    } else if (scene.wallPointHelper1) {
        scene.wallPointHelper1.visibility = 0;
        scene.wallPointHelper2.visibility = 0;
        scene.wallPointHelper3.visibility = 0;

    }


    if (scene.nextSaveMapItem)
        scene.nextSaveMapItem();

    if (localDB.officeRef && localDB.officeRef.data && localDB.officeRef.data.is_customer) {
        first('.addMenu').classList.add('hdn-i');
        first('.addfloorBtn').classList.add('hdn-i');
        first('.rebuild').classList.add('hdn-i');


    }

    if (t % 60 < 1) {
        scene.posh = 0.;
        for (var sm in scene.meshes) {
            sm = scene.meshes[sm];
            scene.setPosY(sm);
        }
    }

    scene.heightDomMig = canvas.offsetHeight / 85.0;

    camera.radius = max(2,camera.radius);

    if (scene.checkMapItem) {
        scene.checkMapItem = scene.nextMapItem();
        if (scene.checkMapItem) {
            scene.mapItemCount++;
        }
    }

    if (scene.matTester) {
        scene.matTester.rotation.x += 0.0005;
        scene.matTester.rotation.y += 0.00825;

    }



    for (var i in scene.keyWait) {
        i = scene.keyWait[i];
        var tr = true;
        for (var j in i.keys) {
            if (scene.keysRef.indexOf(',' + i.keys[j] + ',') == -1) {
                tr = false;
            } else {
                console.log(i.keys[j]);
            }
        }
        if (tr) {
            i.call();
        }
    }

    if (scene.link2Dom) {

        for (var elmp in scene.link2Dom) {
            elmp = scene.link2Dom[elmp];
            if (elmp.elm) {

                var newLeft = floor(canvas.offsetWidth * 1. / 2. + (elmp.pos.x - camera._currentTarget.z) * 100. * scene.heightDomMig / camera.radius) / 1.;
                var newTop = floor(canvas.offsetHeight * 1. / 2. + (elmp.pos.y - camera._currentTarget.x) * 100. * scene.heightDomMig / camera.radius) / 1.;

                if (scene.viewMode == "3D") {

                    if (elmp.pos3d || elmp.css2d || elmp.css3d) {
                        if (elmp.pos3d) {
                            elmp.elm.style.left = elmp.pos3d.x;
                            elmp.elm.style.top = elmp.pos3d.y;
                        } else {

                            /* elmp.elm.classList.add('hdn-i');  */
                            elmp.elm.style.top = '-600000px';
                        }

                        for (var i in elmp.css3d)
                            elmp.elm.classList.add(elmp.css3d[i]);

                        for (var i in elmp.css3d)
                            elmp.elm.classList.remove(elmp.css2d[i]);

                        elmp.elm.classList.add('apply3d');

                    } else {

                        elmp.elm.classList.add('hdn-i');

                    }

                } else {

                    elmp.elm.style.left = (newLeft + (elmp.alg[0] == 'left' ? -1. * elmp.elm.offsetWidth : (elmp.alg[0] == 'right' ? 0. : -1. * elmp.elm.offsetWidth / 2.)) + 50) + 'px';
                    elmp.elm.style.top = (newTop + (elmp.alg[1] == 'top' ? -1. * elmp.elm.offsetHeight : (elmp.alg[1] == 'bottom' ? 0. : -1. * elmp.elm.offsetHeight / 2.))) + 'px';

                    if (elmp.elm.className.indexOf('apply3d') != -1) {

                        for (var i in elmp.css3d)
                            elmp.elm.classList.remove(elmp.css3d[i]);
                        for (var i in elmp.css3d)
                            elmp.elm.classList.add(elmp.css2d[i]);

                        elmp.elm.classList.remove('apply3d');
                    }

                }

            } else {

                elmp.elm = first(elmp.query);
                elmp.align = def(elmp.align,'left bottom');
                elmp.alg = elmp.align.split(' ');
                elmp.pos = def(elmp.pos,{ x: 0,y: 0 });

            }
        }
    }

    for (var fi in scene.meshes) {
        fi = scene.meshes[fi];
        if (fi && fi.material && fi.parent != scene.hoverd) {
            if (fi.material && fi.material.flagDown)
                fi.material.flagDown(2);
        }
    }

    var sizeH = sizeSet.height2d;
    if (scene.viewMode == '3D') {
        sizeH = sizeSet.height3d;
    }

    var currFloorHeight = 0;
    /* if(scene.floors && scene.floors[scene.selectedFloor] && scene.floors[scene.selectedFloor].pattern && scene.floors[scene.selectedFloor].pattern.fNumber != null){
          currFloorHeight = scene.floors[scene.selectedFloor].pattern.fNumber;  
     } else { */
    currFloorHeight = scene.selectedFloor;
    // }

    if (scene.building && abs(scene.building.position.y - (-1.0 * sizeH * currFloorHeight)) > 0.1) {

        scene.building.position.y = -1.0 * sizeH * scene.currentFloor;

        scene.currentFloor = scene.selectedFloor;
    }

    if (scene.motions)
        for (var motion in scene.motions) {
            if (scene.motions[motion] && scene.motions[motion].play) {
                motion = scene.motions[motion];
                motion.fun();
            }
        }

    camera._currentTarget.y = max(0,camera._currentTarget.y);

    camera.panningSensibility = max(0.5,3140 / camera.radius);

    camera.wheelPrecision = 314 / camera.radius;
    camera.pinchPrecision = 314 / camera.radius;

    c.time = t;

    if (scene.selectedMesh) {

        first('#avl-room-pop').classList.remove('hdn-i');
        first('#shape-pop').classList.remove('hdn-i');
        first('#shapewall-pop').classList.remove('hdn-i');
        first('#avl-desk-pop').classList.remove('hdn-i');
        first('#avl-asset-pop').classList.remove('hdn-i');
        first('#shaperoom-pop').classList.remove('hdn-i');

    } else {
        first('#avl-room-pop').classList.add('hdn-i');
        first('#shape-pop').classList.add('hdn-i');
        first('#shapewall-pop').classList.add('hdn-i');
        first('#avl-desk-pop').classList.add('hdn-i');
        first('#avl-asset-pop').classList.add('hdn-i');
        first('#shaperoom-pop').classList.add('hdn-i');
    }


    var val = JSON.stringify({
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
        lx: camera._currentTarget.x,
        ly: camera._currentTarget.y,
        lz: camera._currentTarget.z,
        floor: scene.selectedFloor,
    });

    if (localDB && localDB.officeRef && !scene.isFirstLoadWithData && scene.sceneStarted && scene.posValue != val) {
        localStorage.setItem('officeCamera' + localDB.officeRef.identity,val);
        scene.posValue = val;

    }


    if (!isMobileView()) {
        camera._currentTarget.y = 15;
    }
    else {

        if (localStorage['POST_MOBILE_UUID'] && localStorage['POST_MOBILE_UUID'] != null) {
            scene.lockDeskId = localStorage['POST_MOBILE_UUID'].toString() + "";
            /*localStorage['POST_MOBILE_UUID'] = null;  */

        }
    }


    if (scene.lockDeskId && scene.desks && scene.desks[scene.lockDeskId]) {
        scene.lockToDesk(scene.lockDeskId);
    }

    if (scene.p3dCamMode == 'walk') {
        camera.radius = min(camera.radius,5);
        camera._currentTarget.y = 10;
    }

    if (scene.p3dCamMode == 'lock') {

        scene.applyLockMode(scene.lockPosition);

    } else if (scene.lockSphare) scene.lockSphare.visibility = false;


    if (scene.wallTouchSpeed != 0) {

        var dir = norm({
            x: camera.position.x - camera._currentTarget.x,y: 0,
            z: camera.position.z - camera._currentTarget.z
        });

        camera.alpha += scene.wallTouchRotateSpeed * 0.031;

        camera._currentTarget.x -= scene.walkSpeed * dir.x * scene.wallTouchSpeed;
        camera._currentTarget.z -= scene.walkSpeed * dir.z * scene.wallTouchSpeed;

    }

    if (scene.mainGround && scene.viewMode == '2D' && scene.pickModeRef.className.indexOf('hdn-i') == -1) {

        scene.mainGround.position.y = 5.5;
        scene.mainGround.material.flagUp(13);

        if (scene.tempMesh) {
            scene.tempMesh.cm.position.y = 5.85;
        }


    } else if (scene.mainGround) {
        scene.mainGround.position.y = -2;
        scene.mainGround.material.flagDown(13);
    }

    if (scene.selectedMesh && scene.selectedMesh.isShape) {
        scene.selectedMesh.floor.material.flagUp(11);

    }

    if (scene.Drag && scene.Drag.parent && scene.Drag.parent.isShape) {
        scene.Drag.parent.floor.material.flagUp(10);

    }

    if (scene.selectedMesh) {
        if (scene.selectedMesh.isDesk) {

        }
    }

    if (scene.p3dCamMode == 'walk') {
        canvas_scene.cameras[0].beta = min(2.,max(1.,canvas_scene.cameras[0].beta));
    }


    for (var i in scene.titles) {
        i = scene.titles[i];
        if (i.type == 'room' || i.type == 'meetroom') {

            i.mpos = def(i.mpos,{ x: 0,y: 0,z: 0 });
            i.mspos = def(i.mspos,{ x: 0,y: 0,z: 0 });

            i.scaling.x = i.scz * 80. * (min(130,camera.radius) / 360);
            i.scaling.z = 80. * (min(130,camera.radius) / 360);
            i.position.x = 0. * (min(130,camera.radius) / 360) + i.mpos.x + i.mspos.x;
            i.position.y = scene.roomTitlePosY;
            i.position.z = 0. * (min(130,camera.radius) / 360) + i.mpos.z + i.mspos.z;


        }

        else if (i.type == 'desk') {

            i.scaling.x = i.scz * 80. * (min(130,camera.radius) / 360);
            i.scaling.z = 80. * (min(130,camera.radius) / 360);
            i.rotation.y = 90 * deg;

            i.position.x = 0. * (min(130,camera.radius) / 360);
            i.position.z = 0. * (min(130,camera.radius) / 360);


            i.position.y = scene.deskTitlePosY + 1;

        }
    }

    return c;
};

scene.wallTouchSpeed = 0;


scene.applySelectedFloor = function () {


    all('.flr-tmp',function (iat) {
        iat.classList.remove('c-b-iwgray');
        iat.classList.add('c-b-iwhite');

    },function () {

    });

    var set = scene.mapsSet[scene.floors[scene.selectedFloor].mesh.id];
    if (set) {
        scene.floors[scene.selectedFloor].pattern = set;
        first('#patternPath').src = set.path ? 'https://cdn.orangery.io/' + def(set.path,'') + '.jpg' : baseImgURL + '/temp.png';
        first('#pattscale').value = set.x;
        first('#pattrot').value = set.z;
        first('#pattopc').value = set.w * 100;

        first('#fNumber').value = def(set.fNumber,'-')
            ;
        first('#fHeight').value = set.fHeight;

        var txt1 = new BABYLON.Texture(first('#patternPath').src,scene);
        try {
            scene.mainGround.material.setVector4("dynamicSett",scene.floors[scene.selectedFloor].pattern);
            scene.mainGround.material.setTexture("dynamicSample",txt1);
        } catch (ew) { }

    }

};

scene.selectDeskCurrentFloor = function (deskid) {

    var desk = scene.desks[deskid];

    if (desk) {
        if (desk.parent && desk.parent.isRoom) {
            for (i = 0; i < scene.floors.length; i++) {
                if (desk.parent.parent.id == scene.floors[i].mesh.id) {
                    scene.selectedFloor = i;
                    scene.applySelectedFloor();

                }
            }
        }
        if (desk.parent && desk.parent.isRoom) {

        }

    }

};

scene.lockToDesk = function (deskid) {
    var pos = scene.desksMap[deskid].absolutePosition.clone();
    scene.selectDeskCurrentFloor(deskid);

    scene.lockPosition = pos;
    scene.p3dCamMode = 'lock';
    scene.lockRadius = 25;
};

scene.lockToRoom = function (roomid) {
    var pos = scene.rooms[roomid].absolutePosition.clone();
    scene.selectDeskCurrentFloor(roomid);

    scene.lockPosition = pos;
    scene.p3dCamMode = 'lock';
    scene.lockRadius = 85;
};



scene.applyLockMode = function (pos) {

    camera.radius = min(camera.radius,scene.lockRadius);

    camera._currentTarget.x = pos.x;
    camera._currentTarget.y = pos.y;
    camera._currentTarget.z = pos.z;

    camera._currentTarget.y = 3;


    if (!scene.lockSphare)
        scene.lockSphare = scene.createLockSphere();


    if (scene.lockSphare) {

        /*lockSphare.scaling.z = scene.lockRadius/10.;
        lockSphare.scaling.x = scene.lockRadius/10.;*/


        scene.lockSphare.position = camera._currentTarget.clone();
        scene.lockSphare.position.y -= 1.5;

        scene.lockSphare.visibility = true;
    }
};

scene.cacheMesh = [];

var canvasCount = 0;
scene.liveCanvas = function (w,h) {
    var can = document.createElement("canvas");
    can.id = "can" + canvasCount++;
    can.width = w;
    can.height = h;
    return can;
};

scene.dyMat = function (txt,set) {
    set = def(set,{});
    var mt = new BABYLONX.ShaderBuilder()

        .SetUniform('dySample','sampler2D')
        .Solid({ r: Math.random() * 0.25 + 0.15,g: Math.random() * 0.25 + 0.15,b: Math.random() * 0.25 + 0.15 })
        .InLine(`   

    if(length(pos)>0.4)
        result.xyz =   mix(result.xyz,vec3(0.5), (length(pos)-0.4)*20.) ;
    `).Reference(1).Map({ index: 'dySample',alpha: set.alpha })
        .Func(function (me) {
            me.Setting.FragmentWorld = true;
            if (set.alpha) {
                me = me.Transparency();
            } else {
                me = me.InLine('result = vec4( max(result.xyz,result_1.xyz),1. ); ');
            }
            return me;
        })
        .Event(9,` 

    vec3 wpos = vec4(world*vec4(pos,1.)).xyz;

    if(length(camera-wpos)>50.0)
        result.w = 1.- max(1.,(length(camera-wpos)-50.)/50.) ;
    `).BuildMaterial(scene);

    mt.setTexture('dySample',new BABYLON.Texture(baseImgURL + '/temp.png',scene));

    mt.dyTexture = scene.liveCanvas(512,512);
    mt.dyTexture.reset = function (mat,wait) {

        var embed = mat.dyTexture.toDataURL();

        var img = document.createElement("img");
        img.onload = function () {
            var txt1 = new BABYLON.Texture(this.src,scene);

            if (wait)
                GUX.waitCond(
                    function () {
                        return txt1.isReady();
                    },
                    function () {
                        mat.setTexture("dySample",txt1);
                    },
                    0.05
                );
            else mat.setTexture("dySample",txt1);
        };
        img.src = embed;
    };

    mt.dyContext = mt.dyTexture.getContext("2d");

    var tmp = new canvas_scene.UI.Content(mt.dyContext);

    tmp.x = 0.;
    tmp.y = 0.;
    tmp.w = 512;
    tmp.h = 512;
    if (set.alpha)
        tmp.clear(def(set.color,'#ffffffff').substr(0,7) + '00');
    else
        tmp.clear(def(set.color,'#ffffffff'));

    if (set.tColor) {
        tmp.text({
            title: txt,
            font: def(set.font,'170px Arial Black'),
            color: def(set.tColor,'#ffffffff'),
            pos: '50% 60%',
            align: 'center center',
            rot: 0 * deg
        });

    } else {

        tmp.text({
            title: txt,
            font: def(set.font,'100px Arial Black'),
            color: def(def(set.tColor,set.color),'#ffffffff'),
            pos: '5% 55%',
            align: def(set.align,'left top'),
            rot: 0 * deg
        });

        if (set.type) {
            tmp.text({
                title: set.type,
                font: '30px Arial Black',
                color: def(set.color,'#ffffffff').substr(0,7) + '88',
                pos: '5% 45%',
                align: 'left top',
                rot: 0 * deg
            });
        }

        if (set.desc) {
            tmp.text({
                title: set.desc,
                font: '30px Arial Black',
                color: def(set.color,'#ffffffff').substr(0,7) + '88',
                pos: '5% 60%',
                align: 'left top',
                rot: 0 * deg
            });
        }
    }

    mt.dyTexture.reset(mt);

    return mt;

};

scene.dyMatV2 = function (txt,set,co) {
    co = def(co,{ x: 0,y: 0,z: 0 });
    set = def(set,{});
    var mt = new BABYLONX.ShaderBuilder()

        .SetUniform('dySample','sampler2D')
        .SetUniform('sett','vec4')
        .Map({ index: 'dySample',alpha: 1.0 }).Transparency()
        .Event(2,`  
      result.xyz  = vec3(float(`+ scene.select_text_co.x + `),float(` + scene.select_text_co.y + `),float(` + scene.select_text_co.z + `));
  
     `).BuildMaterial(scene);

    var canvasSize = [def(set.w,256),def(set.h,256)];


    mt.setTexture('dySample',new BABYLON.Texture(baseImgURL + '/temp.png',scene));
    mt.setVector4('sett',{ x: 0,y: 0,z: 0,w: 1. });
    mt.dyTexture = scene.liveCanvas(canvasSize[0],canvasSize[1]);
    mt.dyTexture.reset = function (mat,wait) {

        var embed = mat.dyTexture.toDataURL();

        var img = document.createElement("img");
        img.onload = function () {
            var txt1 = new BABYLON.Texture(this.src,scene);

            if (wait)
                GUX.waitCond(
                    function () {
                        return txt1.isReady();
                    },
                    function () {
                        mat.setTexture("dySample",txt1);
                    },
                    0.05
                );
            else mat.setTexture("dySample",txt1);
        };
        img.src = embed;
    };



    mt.dyContext = mt.dyTexture.getContext("2d");

    var tmp = new canvas_scene.UI.Content(mt.dyContext);

    tmp.x = 0.;
    tmp.y = 0.;
    tmp.w = canvasSize[0];
    tmp.h = canvasSize[1];

    tmp.clear('#00000000');

    var ctx = mt.dyContext;

    var font = set.font.split(' ');
    var fontSize = '20px';
    var ps = '';
    var fs = '';
    if (font.length > 2) {
        fontSize = font[1].replaceAll('px','').valueOf() * 1;
        ps = font[2];
        fs = font[0];
    } else {
        fontSize = font[0].replaceAll('px','').valueOf() * 1;
        ps = font[1];
    }

    var ij = 0;
    var tts = [""];
    for (var i = 0; i < txt.length; i++) {
        ij++;
        if (ij > max(25,txt.length / 3.) && txt[i] == ' ') {
            tts.push("");
            ij = 0;
        } else tts[tts.length - 1] += txt[i];
    }

    if (tts[0].length > 15) {
        fontSize -= ((tts[0].length - 15) / 0.95);
        fontSize = max(12.0,fontSize);
    }


    var w1 = 0;
    for (var i in tts) {

        ctx.font = fs + (fs ? ' ' : '') + (fontSize * 0.9) + 'px' + ' ' + ps;

        var r = ctx.measureText(tts[i]);
        w1 = Math.max(w1,r.width);
        //   h1  +=  r.actualBoundingBoxAscent+r.actualBoundingBoxDescent  + fontsize*0.2;

    }

    if (set.backRadiusRect) {

        var rad = (set.backRadiusRect);

        var pl = (tmp.w - w1 - rad) / 2.;
        rad = (set.backRadiusRect + min(0,pl));
        pl = floor((tmp.w - w1 - rad) / 2.) - 2;


        ctx.fillStyle = '#F9D507ff';

        ctx.beginPath();
        ctx.moveTo(pl + rad,rad);
        ctx.arc(pl + rad,rad,rad,1.0 * Math.PI,1.5 * Math.PI);
        ctx.fill();

        ctx.beginPath();

        ctx.moveTo(pl + rad,tmp.h - rad);
        ctx.arc(pl + rad,tmp.h - rad,rad,1.0 * Math.PI,0.5 * Math.PI,1);

        ctx.fill();

        ctx.beginPath();

        ctx.moveTo(pl + tmp.w - rad - 2 * pl,rad);
        ctx.arc(pl + tmp.w - rad - 2 * pl,rad,rad,1.5 * Math.PI,2 * Math.PI);

        ctx.fill();

        ctx.beginPath();

        ctx.moveTo(pl + tmp.w - rad - 2 * pl,tmp.h - rad);

        ctx.arc(pl + tmp.w - rad - 2 * pl,tmp.h - rad,rad,0.5 * Math.PI,2 * Math.PI,1);
        ctx.fill();

        ctx.beginPath();

        ctx.rect(pl + rad - 1,0,tmp.w - rad * 2 - 2 * pl + 2,tmp.h);
        ctx.rect(pl - 1,rad - 1,tmp.w - 2 * pl + 2,tmp.h - rad * 2. + 2);

        ctx.fill();


    }



    for (var i in tts) {

        txt = tts[i];

        tmp.text({
            title: txt,
            font: fs + (fs ? ' ' : '') + (fontSize * 0.9) + 'px' + ' ' + ps,
            color: set.color + 'FF',
            pos: '50% ' + floor((i.valueOf() * 1 + 1) * (100 / (tts.length + 1))) + '%',
            align: 'center middle',
            rot: 0 * deg
        });
    }


    mt.dyTexture.reset(mt);

    return mt;

};

scene.storage = {};

scene.createMultiDesk = function (n,p,fid,fun) {

    scene.deskIdentity++;

    if (n > 0) {
        new entity('desk',localDB.officeRef).new({
            name: "Desk " + scene.deskIdentity,
            assigned_user_uuid: null,
            floor_uuid: fid,
            flex: true,
            active: true
        }).then(function (d) {
            var p1 = { i: p.i,j: p.j,li: p.li };
            p1.li[d.desk.uuid] = d.desk;
            scene.createMultiDesk(n - 1,p1,fid,fun);
        });
    }
    else {
        fun(p,fid);
    }
};

camera.inertia = 0.5;
scene.posh = 0.001;
scene.setPosY = function (mesh) {

    scene.posh += 0.015;
    scene.posh = scene.posh % 0.5;
    if (mesh) {
        if (mesh.isShape) {
            mesh.position.y = -0.05;
            mesh.floor.position.y = +scene.posh;
        }

        if (mesh.isDesk) {
            mesh.position.y = 0.15;

        }

        if (mesh.isWallShape) {
            mesh.position.y = 0.327;
            if (scene.viewMode == '2D') {
                mesh.floor.position.y = 0.14;
            } else
                mesh.floor.position.y = 0;
        }

        if (mesh.isShape && mesh.conf1 && mesh.conf1.room) {
            mesh.position.y = 0.4;
            mesh.floor.position.y = +scene.posh;

        }

        if (mesh.isRoom)
            mesh.position.y = 0.35;

    }

};

scene.firstView = 1;
scene.hoverd = null;
scene.downStatus = { x: 0,y: 0,t: 0 };

scene.lastDetectedTarget;

scene.pickedMesh = null;

scene.Drag = null;
scene.prepareMode = 1;

scene.removeAsset = function () {

    if (scene.selectedMesh && scene.selectedMesh.map) {

        console.log('del',scene.selectedMesh.map.uuid);

        var par = scene.selectedMesh.parent;

        new entity('mapitem',localDB.officeRef).param({ par: par,ref: scene.selectedMesh.map.reference_uuid })
            .id(scene.selectedMesh.map.uuid)
            .remove().then(function (d,th) {
                scene.desks[scene.selectedMesh.id] = null;

                console.log('deleted',scene.selectedMesh.map.uuid);

                if (scene.selectedMesh)
                    scene.selectedMesh.dispose();

                scene.linkToDom({
                    query: '#avl-asset-pop',
                    pos: { x: -10000.,y: -10000. },
                    align: 'center center',css3d: ['iu'],
                    css2d: ['iu']
                });

            });
    }

};

scene.removeDesk = function () {

    if (scene.selectedMesh && scene.selectedMesh.map) {

        console.log('del',scene.selectedMesh.map.uuid);



        var par = scene.selectedMesh.parent;

        new entity('mapitem',localDB.officeRef).param({ par: par,ref: scene.selectedMesh.map.reference_uuid }).id(scene.selectedMesh.map.uuid).remove().then(function (d,th) {
            scene.desks[scene.selectedMesh.id] = null;

            console.log('deleted',scene.selectedMesh.map.uuid);

            scene.desksExistRef[scene.selectedMesh.map.reference_uuid] = null;


            if (th.params.par &&
                th.params.ref &&
                scene.roomsRef[th.params.par.map.data.genRoom]) {

                new entity('room',localDB.officeRef).id(th.params.par.map.data.genRoom).get().then(function (dt) {

                    /** remove desk from room */
                    var deskList = [];

                    for (var i in dt.desks) {
                        if (dt.desks[i].uuid != th.params.ref)
                            deskList.push(dt.desks[i].uuid);
                    }

                    new entity('room',localDB.officeRef).id(dt.uuid).set({ desks: deskList })
                        .then(function (dt) {
                            sysLog(' desk removed from room!','info',100);
                            console.log(26);
                        });

                });
            }

            if (scene.selectedMesh)
                scene.selectedMesh.dispose();

            scene.linkToDom({
                query: '#avl-desk-pop',
                pos: { x: -10000.,y: -10000. },
                align: 'center center',css3d: ['iu'],
                css2d: ['iu']
            });





        });
    }



};

scene.glb_contents = [];
scene.loadGlb = async (name,scene,fn) => {
    var fileName = name;

    if (scene.glb_contents[name]) {
        scene.lastGlbNode = scene.glb_contents[name];

        fn(scene.lastGlbNode.clone());
    }
    else
        new entity('file/glb').raw(name,function (d) {

            var blob = new Blob([d]);

            var url = URL.createObjectURL(blob);

            BABYLON.SceneLoader.Append("",url,scene,function (d) {

                scene.lastGlbNode = null;

                for (i in d.rootNodes) {
                    if (d.rootNodes[i].name == '__root__') {
                        scene.lastGlbNode = d.rootNodes[i];

                        scene.glb_contents[name] = scene.lastGlbNode;
                        d.rootNodes[i].position.y = -600000;
                        d.rootNodes[i].isPickable = true;

                        fn(scene.lastGlbNode.clone());

                    }

                }

                BABYLON.DefaultLoadingScreen.prototype.hideLoadingUI();


            },undefined,undefined,".glb");

        });

};

BABYLON.DefaultLoadingScreen.prototype.displayLoadingUI = function () {
    if (document.getElementById("customLoadingScreenDiv")) {
        // Do not add a loading screen if there is already one
        document.getElementById("customLoadingScreenDiv").style.display = "initial";
        return;
    }
    this._loadingDiv = document.createElement("div");
    this._loadingDiv.id = "customLoadingScreenDiv";
    this._loadingDiv.innerHTML = "scene is currently loading";
    var customLoadingScreenCss = document.createElement('style');
    customLoadingScreenCss.type = 'text/css';
    customLoadingScreenCss.innerHTML = `
    #customLoadingScreenDiv{
        background-color: #BB464Bcc;
        color: white;
        font-size:50px;
        text-align:center;
    }
    `;
    document.getElementsByTagName('head')[0].appendChild(customLoadingScreenCss);
    this._resizeLoadingUI();
    window.addEventListener("resize",this._resizeLoadingUI);
    document.body.appendChild(this._loadingDiv);
};

BABYLON.DefaultLoadingScreen.prototype.hideLoadingUI = function () {
    document.getElementById("customLoadingScreenDiv").style.display = "none";
    console.log("scene is now loaded");
};


scene.reBuildReq = function () {

    if (confirm("are you sure about remove your all design and rebuild them again?")) {

        sysLog('please wait ... ',100,'wait');
        localStorage['officeCamera' + localDB.officeRef.identity] = null;

        new entity('mapitem',localDB.officeRef).id('all').remove().then(function (d) {
            console.log(d);
            location.reload();
        });
    }
};

window.addEventListener("message",(event) => {

    /** get message from mobile side */



},false);



scene.pickPointModeClick = function (event,prm) {


    if (scene.pickPointMode == 'shape_polygon') {

        if (scene.pickPoints.length == 0) {
            scene.pickPoints.push(-prm.pickedPoint.x);
            scene.pickPoints.push(prm.pickedPoint.z);
        }

        scene.pickPoints.push(-prm.pickedPoint.x);
        scene.pickPoints.push(prm.pickedPoint.z);

        if (!scene.pickPointMesh) {
            scene.pickPointMesh = new BABYLON.Mesh.CreateSphere('se',10,1,scene);
            scene.pickPointMesh.material = new BABYLONX.ShaderBuilder().Solid({ r: 1.,g: 0.5 }).BuildMaterial(scene);
        }

        if (!scene.pickPointCenterMesh) {
            scene.pickPointCenterMesh = new BABYLON.Mesh.CreateSphere('se',10,1.5,scene);
            scene.pickPointCenterMesh.material = new BABYLONX.ShaderBuilder().Solid({ r: 1. }).BuildMaterial(scene);
            scene.pickPointCenterMesh.position.x = prm.pickedPoint.x;
            scene.pickPointCenterMesh.position.z = prm.pickedPoint.z;
            scene.pickPointCenterMesh.position.y = 5.5;
        }

        scene.pickPoints[0] = 0;
        scene.pickPoints[1] = 0;
        var indi = 0;

        for (var i = 2; i < scene.pickPoints.length; i += 2) {
            scene.pickPoints[0] += scene.pickPoints[i];
            scene.pickPoints[1] += scene.pickPoints[i + 1];
            indi++;
        }

        scene.pickPoints[0] /= indi;
        scene.pickPoints[1] /= indi;

        scene.pickPointCenterMesh.position.x = -1. * scene.pickPoints[0];
        scene.pickPointCenterMesh.position.z = scene.pickPoints[1];



        if (scene.pickPoints.length > 6 &&
            (abs(scene.pickPoints[2] - scene.pickPoints[scene.pickPoints.length - 2]) < 1.5 &&
                abs(scene.pickPoints[3] - scene.pickPoints[scene.pickPoints.length - 1]) < 1.5)) {


            scene.pickPoints[scene.pickPoints.length - 2] = scene.pickPoints[2];
            scene.pickPoints[scene.pickPoints.length - 1] = scene.pickPoints[3];

            scene.endPickPointMode();
            first('.finish_pick_mode').classList.add('hdn-i');
            return;
        }



        scene.pickPointMesh.position.x = prm.pickedPoint.x;
        scene.pickPointMesh.position.z = prm.pickedPoint.z;
        scene.pickPointMesh.position.y = 6.;



        /** create editable pattern */

        scene.makeSubShape(scene.floors[scene.selectedFloor],0,0.05,0,0 * deg,
            scene.pickPoints,60,scene.pickPointMode
            ,scene.floorColor,null,true);

    }

    if (scene.pickPointMode == 'customWall') {

        d = 1;
        if (scene.pickPoints && scene.pickPoints.length > 0)
            d = pow(pow(scene.pickPoints[scene.pickPoints.length - 1].x - prm.pickedPoint.x) + pow(scene.pickPoints[scene.pickPoints.length - 1].z - prm.pickedPoint.z),0.5);

        if (d > 0.1) {
            scene.pickPoints.push({ x: prm.pickedPoint.x,z: prm.pickedPoint.z });




            if (!scene.pickPointMesh) {
                scene.pickPointMesh = new BABYLON.Mesh.CreateSphere('se',10,1,scene);
                scene.pickPointMesh.material = new BABYLONX.ShaderBuilder().Solid({ r: 1.,g: 0.5 }).BuildMaterial(scene);
            }

            if (scene.pickPoints.length > 1) {

                scene.makeSubShape(scene.floors[scene.selectedFloor],0.,0.05,0.,0 * deg,
                    [scene.pickPoints[scene.pickPoints.length - 2].x,scene.pickPoints[scene.pickPoints.length - 2].z,
                    scene.pickPoints[scene.pickPoints.length - 1].x,scene.pickPoints[scene.pickPoints.length - 1].z,0,0],60,'wall2point'
                    ,scene.floorColor,null,true,true);
            }
        }
    }
};

scene.endPickPointMode = function () {

    scene.isPickPoint = false;


    if (scene.mainGround && scene.viewMode == '2D' && scene.pickModeRef.className.indexOf('hdn-i') == -1) {

        if (scene.pickPointMode == 'shape_polygon') {
            scene.pickPointCenterMesh.dispose();
            scene.pickPointMesh.dispose();
            if (scene.tempMesh) {
                scene.tempMesh.cm1.dispose();
                scene.tempMesh.cm.dispose();
            }
            scene.pickPointCenterMesh = null;
            scene.pickPointMesh = null;

            scene.makeSubShape(scene.floors[scene.selectedFloor],0,0.05,0,0 * deg,
                scene.pickPoints,60,scene.pickPointMode
                ,scene.floorColor);

            scene.pickModeRef.classList.add('hdn-i');
        }

        if (scene.pickPointMode == 'customWall') {
            var mss = [];
            for (var ms in scene.meshes) {
                if (scene.meshes[ms].tempMode || (scene.meshes[ms].parent && scene.meshes[ms].parent.tempMode)) {
                    mss.push(scene.meshes[ms]);
                }
            }

            for (var ms in mss) mss[ms].dispose();

            for (var ps = 1; ps < scene.pickPoints.length; ps += 1) {
                if (!scene.pickPoints[ps].cutted) {

                    var center = {
                        x: (scene.pickPoints[ps - 1].x + scene.pickPoints[ps].x) / 2.,
                        z: (scene.pickPoints[ps - 1].z + scene.pickPoints[ps].z) / 2.
                    };

                    var d = pow(pow(scene.pickPoints[ps - 1].x - scene.pickPoints[ps].x) + pow(scene.pickPoints[ps - 1].z - scene.pickPoints[ps].z),0.5);
                    if (d > 0.1) {

                        scene.makeSubShape(scene.floors[scene.selectedFloor],center.x,0.05,center.z,0 * deg,
                            [scene.pickPoints[ps - 1].x - center.x,scene.pickPoints[ps - 1].z - center.z,
                            scene.pickPoints[ps].x - center.x,scene.pickPoints[ps].z - center.z,0,0],60,'wall2point'
                            ,scene.floorColor);
                    }
                }
            }

            scene.pickPointCenterMesh = null;
            scene.pickPointMesh = null;

            scene.pickModeRef.classList.add('hdn-i');
        }
    }
};


scene.patternChange = function (d) {

    scene.floors[scene.selectedFloor].pattern =
        def(scene.floors[scene.selectedFloor].pattern,{});

    if (d) {

        var img = document.createElement('img');
        img.onload = function () {

            first('#patternPath').src = d;

            var txt1 = new BABYLON.Texture(d,scene);

            try {

                scene.mainGround.material.setVector4("dynamicSett",{ x: first('#pattscale').value,y: img.width / img.height,z: first('#pattrot').value,w: first('#pattopc').value.valueOf() * 0.01 });
                scene.mainGround.material.setTexture("dynamicSample",txt1);

                scene.floors[scene.selectedFloor].pattern = {
                    id: scene.floors[scene.selectedFloor].pattern.id,
                    path: img.src,
                    fNumber: first('#fNumber') ? first('#fNumber').value.valueOf() * 1.0 : null,
                    fHeight: first('#fHeight') ? first('#fHeight').value.valueOf() * 1.0 : null,

                    x: first('#pattscale').value,y: img.width / img.height,z: first('#pattrot').value,w: first('#pattopc').value.valueOf() * 0.01
                };

                GUXFile.upload({ currentTarget: first('#patternUpload') },function (d2) {

                    scene.floors[scene.selectedFloor].pattern.path = JSON.parse(d2).data;

                    scene.mapsSet[scene.floors[scene.selectedFloor].mesh.id] = scene.floors[scene.selectedFloor].pattern;

                    scene.toMap(scene.mainGround,scene.floors[scene.selectedFloor].pattern.id,null,scene.floors[scene.selectedFloor].mesh.id,'pattern','setting',
                        scene.mainGround.position,scene.floors[scene.selectedFloor].pattern,
                        function (ms,map) {
                            scene.floors[scene.selectedFloor].pattern.id = map.uuid;

                        });
                },first('#patternUpload').files,'/image');
            } catch (e) {
            }

        };
        img.src = d;
    } else {

        scene.floors[scene.selectedFloor].pattern = {
            id: scene.floors[scene.selectedFloor].pattern.id,
            path: scene.floors[scene.selectedFloor].pattern.path,
            fNumber: first('#fNumber') ? first('#fNumber').value.valueOf() * 1.0 : null,
            fHeight: first('#fHeight') ? first('#fHeight').value.valueOf() * 1.0 : null,

            x: first('#pattscale').value,y: def(scene.floors[scene.selectedFloor].pattern.y,1.),z: first('#pattrot').value,w: first('#pattopc').value.valueOf() * 0.01
        };

        scene.toMap(scene.mainGround,scene.floors[scene.selectedFloor].pattern.id,null,scene.floors[scene.selectedFloor].mesh.id,'pattern','setting',
            scene.mainGround.position,scene.floors[scene.selectedFloor].pattern,
            function (ms,map) {

                scene.floors[scene.selectedFloor].pattern.id = map.uuid;

            });

        scene.mainGround.material.setVector4("dynamicSett",scene.floors[scene.selectedFloor].pattern);

        scene.mapsSet[scene.floors[scene.selectedFloor].mesh.id] =
            scene.floors[scene.selectedFloor].pattern;

    }


};
scene.iconChange = function (d) {
    console.log(111,d);


    if (d) {

        var img = document.createElement('img');
        img.src = d;
        img.onload = function () {

            first('#iconUpload').src = d;


            try {

                GUXFile.upload({ currentTarget: first('#iconUpload') },function (d2,st) {


                    if (!st)
                        first('.createCustom .img').src = 'https://cdn.orangery.io/' + JSON.parse(d2).data + '.png';



                },first('#iconUpload').files,'/png');
            } catch (e) {
            }

        };
    }

};


scene.mats = [];

scene.createTester = function () {
    scene.matTester = new BABYLON.Mesh.CreateBox('mat',10,scene);
    scene.matTester.parent = scene.cameras[0];
    scene.matTester.position.z = 30.;
    scene.matTester.isPickable = false;

    scene.matTester.material = new BABYLONX.ShaderBuilder()
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
        .InLine(`
vec3 nrrm = vec3(pos.x*dynamicSett.x,0., pos.y*dynamicSett.x*dynamicSett.y );
vec3 nm = `+ BABYLONX.Normals.Flat + `;
if(abs(nm.x) > 0.25 && abs(nm.z) < 0.25 ) nrrm = vec3(pos.z*dynamicSett.x,0., pos.y*dynamicSett.x*dynamicSett.y); 
else if(abs(nm.y) >  0.25 && abs(nm.z) < 0.25   )nrrm =vec3(pos.z*dynamicSett.x,0., pos.x*dynamicSett.x*dynamicSett.y); 

`)
        .Map({ index: "dynamicSample",uv: 'r_y(vec3((nrrm.x ) *0.002 -0.5,0.,(nrrm.z )*0.002-0.5) ,dynamicSett.z,vec3(0.) ).xz' }).Reference(5)

        .InLine(` 
float fs = 1.- dot(normalize(wnrm-vec3(0.2,1.,.3)*result_5.x*0.12),normalize(wpos-camera)) ;
result = vec4(0.5,0.5,0.5,1.);

if( dynamicSett.x >0.0){
result.xyz = result_5.xyz-dynamicSett.w*0.3-dynamicSett.w*length(result_5.xyz)*0.13
+dynamicSett.w*(1.-length(result_5.xyz))*0.13+(length(result_5.xyz)*0.3+0.2 )*dynamicSett.w*(pow(fs,3.)*0.15)
+dynamicSett.w*2.*length(result_5.xyz/2.)*pow(fs/2.,330.)*0.350 ;  
}  
`)
        .Event(13,' result.w = 0.85; ').BuildMaterial(scene);
    var txt1 = new BABYLON.Texture(baseImgURL + '/temp.png',scene);
    scene.matTester.material.setTexture("dynamicSample",txt1);
    scene.matTester.material.setVector4("dynamicSett",{ x: 0,y: 0,z: 0,w: 0 });
};

scene.textureChange = function (d,m,mid) {

    if (!scene.matTester) {
        scene.createTester();
    }

    scene.matTester.visibility = 1;

    if (d) {

        var img = document.createElement('img');
        img.onload = function () {

            first('#texturePath').src = d;

            var txt1 = new BABYLON.Texture(d,scene);

            var mat = { path: first('#texturePath').src,name: first('#matname').value,x: first('#matscale').value,y: img.width / img.height,z: first('#matrot').value,w: first('#matmet').value.valueOf() * 0.01 };

            scene.matTester.material.setVector4("dynamicSett",mat);
            scene.matTester.material.setTexture("dynamicSample",txt1);

        };

        img.src = d;

    } else {

        mat = {
            name: first('#matname').value,path: first('#texturePath').src,
            x: first('#matscale').value,y: 1.,z: first('#matrot').value,w: first('#matmet').value.valueOf() * 0.01
        };


        if (m) {

            if (first('#texturePath').src.length > 100) {

                var img = document.createElement('img');
                img.onload = function () {

                    first('#texturePath').src = d;

                    GUXFile.upload({ currentTarget: first('#textureUpload') },function (d2) {

                        d2 = JSON.parse(d2).data;

                        mat.path = 'https://cdn.orangery.io/' + d2 + '.jpg';
                        first('#texturePath').src = mat.path;
                        mat.uuid = mid;

                        mat.y = img.width / img.height;

                        mat.color = first('#matcolor').value;

                        mat.r = parseInt(first('#matcolor').value.substr(1,2),16) / 256;
                        mat.g = parseInt(first('#matcolor').value.substr(3,2),16) / 256;
                        mat.b = parseInt(first('#matcolor').value.substr(5,2),16) / 256;


                        scene.toMap(scene.mainGround,mid,null,null,'material','material',
                            scene.mainGround.position,mat,
                            function (ms,map) {

                                mat.uuid = map.uuid;

                                scene.mats[map.uuid] = mat;


                                first('.mattemplist').innerHTML = '';

                                for (var i in scene.mats) {

                                    createTempElement('.save-mat-temp',{ src2: 'src',coc: scene.mats[i].color,iden: i,path: scene.mats[i].path,name: scene.mats[i].name },
                                        first('.mattemplist'));
                                }

                                scene.matTester.visibility = 0;

                            });

                    },first('#textureUpload').files,'/image');
                };
                img.src = first('#texturePath').src;
            } else {

                mat.y = (mid && scene.mats[mid] ? scene.mats[mid].y : 1.);

                mat.color = first('#matcolor').value;

                mat.r = parseInt(first('#matcolor').value.substr(1,2),16) / 256;
                mat.g = parseInt(first('#matcolor').value.substr(3,2),16) / 256;
                mat.b = parseInt(first('#matcolor').value.substr(5,2),16) / 256;

                scene.toMap(scene.mainGround,mid,null,null,'material','material',
                    scene.mainGround.position,mat,
                    function (ms,map) {

                        mat.uuid = map.uuid;

                        scene.mats[map.uuid] = mat;

                        first('.mattemplist').innerHTML = '';

                        for (var i in scene.mats) {

                            createTempElement('.save-mat-temp',{ src2: 'src',coc: scene.mats[i].color,iden: i,path: scene.mats[i].path,name: scene.mats[i].name },
                                first('.mattemplist'));
                        }

                        scene.matTester.visibility = 0;

                    });
            }

        }

        var txt1 = new BABYLON.Texture(first('#texturePath').src,scene);

        scene.matTester.material.setTexture("dynamicSample",txt1);
        scene.matTester.material.setVector4("dynamicSett",{ x: first('#matscale').value,y: 1.0,z: first('#matrot').value,w: first('#matmet').value.valueOf() * 0.01 });
        scene.matTester.material.setVector4("dynamicSett2D",{
            x: parseInt(first('#matcolor').value.substr(1,2),16) / 256,
            y: parseInt(first('#matcolor').value.substr(3,2),16) / 256,
            z: parseInt(first('#matcolor').value.substr(5,2),16) / 256
        });

    }

};

scene.newMat = function () {
    first('#matscale').value = 50.0;
    first('#matrot').value = 0;

    first('#matmet').value = 50;

    first('#matcolor').value = '#000000';

    canvas_scene.selectedMatIden = null;

    if (scene.matTester) {


        var txt1 = new BABYLON.Texture(first('#texturePath').src,scene);

        scene.matTester.material.setTexture("dynamicSample",txt1);

        scene.matTester.material.setVector4("dynamicSett",{ x: 50,y: 1.0,z: 0,w: 50 * 0.01 });


        scene.matTester.visibility = 1;
    } else scene.createTester();

    first('#texturePath').src = baseImgURL + '/temp.png';
};

scene.pickAsMaterial = null;
scene.pickAsMaterialModel = null;

scene.pickMat = function (model) {
    scene.pickAsMaterial = 1;
    scene.pickAsMaterialModel = model;

    first('#matListPop').classList.remove('hdn-i');
};

scene.applyMat = function (id,model) {

    var txt1 = new BABYLON.Texture(scene.mats[id].path,scene);

    if (model.isShape) {

        model.floor.material.setTexture("dynamicSample",txt1);

        model.floor.material.setVector4("dynamicSett",scene.mats[id]);

        model.floor.material.setVector4("dynamicSett2D",{
            x: scene.mats[id].r,
            y: scene.mats[id].g,
            z: scene.mats[id].b,w: 1
        });

        model.floor.material.flagUp(9);
        model.map.data.mat = id;

        scene.toMap(model,model.map.uuid,model.map.reference_uuid,model.map.data.parent,
            model.map.name,model.map.type,{ x: 0,y: 0,z: 0 },model.map.data,function () {
                console.log('material apply');
            });
    }

};

scene.editMat = function (id,ed) {

    if (!ed && scene.pickAsMaterial) {

        scene.applyMat(id,scene.pickAsMaterialModel);

        first('#matListPop').classList.add('hdn-i');
        first('#newMatItemPop').classList.add('hdn-i');

        scene.pickAsMaterial = null;
        if (scene.matTester) scene.matTester.visibility = 0;

        return;
    }

    canvas_scene.selectedMatIden = id;

    first('#matcolor').value = scene.mats[id].color;


    first('#matscale').value = scene.mats[id].x;
    first('#matrot').value = scene.mats[id].z;

    first('#matmet').value = scene.mats[id].w * 100;
    first('#texturePath').src = scene.mats[id].path;
    first('#matname').value = scene.mats[id].name;

    first('#matListPop').classList.remove('hdn-i');
    first('#newMatItemPop').classList.remove('hdn-i');


    if (scene.matTester) {

        var txt1 = new BABYLON.Texture(first('#texturePath').src,scene);
        scene.matTester.material.setTexture("dynamicSample",txt1);
        scene.matTester.visibility = 1;
        scene.matTester.material.setVector4("dynamicSett",{ x: first('#matscale').value,y: scene.mats[id].y,z: first('#matrot').value,w: first('#matmet').value.valueOf() * 0.01 });

    } else scene.createTester();

};

scene.duplicate = function (model) {

    if (model && model.isShape && model.isWallShape) {

        scene.toMap(model,0,model.map.reference_uuid,model.map.data.parent,
            model.map.name,model.map.type,{ x: 0,y: 0,z: 0 },model.map.data,function (mis,map2) {

                var ms = model.clone();
                ms.isShape = true;
                ms.isWallShape = true;
                ms.map = map2;
                ms.position.x += 2.5;
                ms.position.z += 2.5;

                if (ms._children[0]) ms._children[0].dispose();
                if (ms._children[0]) ms._children[0].dispose();
                if (ms._children[0]) ms._children[0].dispose();
                if (ms._children[0]) ms._children[0].dispose();
                if (ms._children[0]) ms._children[0].dispose();


                var md = model.floor.clone();
                scene.shapes[map2.id] = { cm: ms,cm1: md };
                ms.id = map2.id;

                setTimeout(() => {

                    if (ms.floor) ms.floor.dispose();
                    ms.floor = md;
                    ms.floor.parent = ms;

                },20);


                ms.center = model.center;

                if (model.floatPoint1) {
                    ms.floatPoint1 = model.floatPoint1.clone();
                    ms.floatPoint1.parent = ms;
                }

                if (model.floatPoint2) {
                    ms.floatPoint2 = model.floatPoint2.clone();
                    ms.floatPoint2.parent = ms;
                }

                if (model.floatPoint3) {
                    ms.floatPoint3 = model.floatPoint3.clone();
                    ms.floatPoint3.parent = ms;
                }

                ms.conf1 = model.conf1;

                scene.selectedMesh = null;
                for (var msi in scene.meshes) {
                    msi = scene.meshes[msi];
                    if (msi.material && msi.material.flagDown) {
                        msi.material.flagDown(11);

                    }
                }
            });

    }

};

scene.setToMesh = 0;

scene.pickMultiMat = function (id) {
    scene.setToMesh = true;
    scene.setMaterialId = id;
    scene.setToMeshMode = 'mat';
};

scene.pickMultiSetting = function (set) {
    scene.setToMesh = true;
    scene.setModelSetting = set;
    scene.setToMeshMode = 'setting';
};

scene.saveShapeMap = function (ms) {



    ms.map.data.conf1 = ms.conf1;
    ms.map.data.pos = {};
    ms.map.data.pos.x = ms.position.x;
    ms.map.data.pos.y = ms.position.y;
    ms.map.data.pos.z = ms.position.z;
    ms.map.data.pos.r = ms.rotation.y;

    ms.map.data.parent = ms.parent.id;

    if (ms.map.uuid)

        new entity('mapitem',localDB.officeRef).id(ms.map.uuid).set(ms.map).then(function (d) {

        });

    else {

        new entity('mapitem',localDB.officeRef).new(ms.map).then(function (d) {

            ms.map = d.map_item;

            scene.mapsRef[ms.map.reference_uuid] = ms.map;
            scene.mapsId[ms.map.uuid] = ms.map;


        });

    }
};

scene.unlockShapes = function (v) {

    if (!v) {
        first('#lock-btn').classList.add('cwhite');
        first('#lock-btn').classList.add('coyel3-t');
        first('#lock-btn').classList.remove('c-twhite');

        first('#unlock-btn').classList.remove('cwhite');
        first('#unlock-btn').classList.remove('coyel3-t');
        first('#unlock-btn').classList.add('c-twhite');

        scene.floors[scene.selectedFloor].unLock = 0;
    } else {
        first('#unlock-btn').classList.add('cwhite');
        first('#unlock-btn').classList.add('coyel3-t');
        first('#unlock-btn').classList.remove('c-twhite');

        first('#lock-btn').classList.remove('cwhite');
        first('#lock-btn').classList.remove('coyel3-t');
        first('#lock-btn').classList.add('c-twhite');
        scene.floors[scene.selectedFloor].unLock = 1;
    }

};
scene.openSettingFloor = function () {

    first('#newItemsPop').classList.remove('hdn-i');

};

scene.pickNewShape = function (mesh) {

    scene.replaceMesh = mesh;

    first('#roomShapes').classList.remove('hdn-i');

};

scene.makeRoom = function (mesh) {
    mesh.map.data.conf1.room = !mesh.map.data.conf1.room;
    new entity('mapitem',localDB.officeRef).id(mesh.map.uuid).set(mesh.map).then(
        function (d) {

            scene.reCreateShape(scene.selectedMesh,{});
        });
};

initEvent(scene,camera,canvas);
initCreation(scene);
initMaterial(scene,camera)

