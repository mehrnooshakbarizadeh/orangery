 scene.clearColor = new BABYLON.Color4(0.96, 0.98, 1, 1);

 for (var ms in scene.meshes) scene.disposeMesh(scene.meshes[ms]);


 scene.controlCamera = function(data) {
     if (data.enable == true) {
         scene.attachControl(canvas, true);
     } else if (data.enable == false) {
         scene.detachControl(canvas);
     }
 };

 var canvasCount = 0;
 scene.liveCanvas = function(w, h) {
     var can = document.createElement("canvas");
     can.id = "can" + canvasCount++;
     can.width = w;
     can.height = h;
     return can;
 };

 scene.motions = {
     speed: 10,
     mainCameraTarget: null,
 };

 scene.motions.mainCameraMove = new scene.UI.motion('mainCameraMove',
     function(v) {
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

             if (scene.motions.mainCameraTarget.mi) {

                 scene.motions.mainCameraTarget.mi.mesh.select();
             }

             this.status = 0;
             this.startTime = null;

         }

     }, 10, scene.motions.speed);

 scene.walkCamera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
 scene.activeCameras.push(camera);
 /* scene.activeCameras.push(scene.walkCamera);*/
 scene.activeCamera = camera;

 scene.avatar = new BABYLON.Mesh(scene);
 var avat1 = new BABYLON.Mesh.CreateGround("ss", 0.5, 1.5, 1, scene);
 avat1.rotation.x = -90. * deg;

 avat1.parent = scene.avatar;

 avat1.material = new BABYLONX.ShaderBuilder().Map({ path: window.baseImgURL + '/avat1.png' }).
 InLine(`result  =  vec4(vec3(0.75,0.45,0.) , (1.-length(result.xyz))*0.25); `).Transparency().BuildMaterial(scene);

 scene.walkCamera.speed = 0.35;
 scene.personViewHeightCorrection = 0.8;

 scene.walkCamera.maxZ = 0.0001;
 scene.walkCamera.minZ = 0.;

 scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
 scene.walkCamera.ellipsoid = new BABYLON.Vector3(0.1, 0.91, 0.1);
 scene.walkCamera.ellipsoidOffset = new BABYLON.Vector3(0.2, 0.66, 0.2);

 scene.collisionsEnabled = true;
 scene.walkCamera.checkCollisions = true;

 scene.walkCamera.applyGravity = true;



 scene.changeCameraMode = function(sett) {

     if (scene.cameraMode == "2d" && sett.cameraMode != "2d") {

         scene.createDefaultBuilding(
             [0, 3, 3, 3, 3, 3], { name: 'Building 1', uuid: "1521654656565656" }, {
                 x: scene.selectedItem.mesh.position.x,
                 y: scene.selectedItem.mesh.position.y,
                 z: scene.selectedItem.mesh.position.z,
                 autoSelected: 1,
                 fun: function(mi) {

                     scene.motions.mainCameraTarget = {
                         x: scene.selectedItem.mesh.position.x,
                         y: 0,
                         z: scene.selectedItem.mesh.position.x,
                         r: 65,
                         a: 2.05,
                         b: 1.42,
                         range_r: [20, 80],
                         range_b: [0.95, 1.45],
                         range_a: null,
                         cameraMode: 'walk',
                         mi: mi
                     };

                     scene.motions.mainCameraMove.play();

                 }
             }
         );

         return;

     }

     all('.vwitm', function(at) {
         at.classList.remove('co-secd-i');
     });

     var pos = camera._currentTarget.clone();
     pos.y = scene.personViewHeightCorrection * 2.;

     if (sett.pos) {
         pos = sett.pos;
     }

     first('#vw_' + sett.cameraMode).classList.add('co-secd-i')

     if (!scene.isWalk && sett.cameraMode == "walk") {
         camera.detachControl(canvas, true);
         camera.lowerRadiusLimit = 0;

         scene.activeCameras.push(scene.walkCamera);
         scene.isWalk = 1;

         scene.walkCamera.position = new BABYLON.Vector3(pos.x, pos.y, pos.z);

         scene.walkCamera.attachControl(canvas, true);
         scene.cameraMode = sett.cameraMode;

         scene.motions.mainCameraTarget = {
             x: pos.x,
             y: pos.y,
             z: pos.z,
             r: 2.25,
             a: camera.alpha - 180. * deg,
             b: camera.beta,
             range_r: [2.25, 2.25],
             range_b: null,
             range_a: null,
         };

         scene.motions.mainCameraMove.play();


     } else if (sett.cameraMode == "floor") {

         if (scene.isWalk) {
             scene.activeCameras.pop();
             camera.attachControl(canvas, true);
             scene.walkCamera.detachControl(canvas, true);
         }
         scene.isWalk = 0;
         scene.cameraMode = sett.cameraMode;



         scene.motions.mainCameraTarget = {
             x: pos.x,
             y: pos.y,
             z: pos.z,
             r: 60,
             a: 0.45,
             b: 1.25,
             range_r: [35, 90],
             range_b: null,
             range_a: null,
         };

         scene.motions.mainCameraMove.play();


     } else if (sett.cameraMode == "free") {
         if (scene.isWalk) {
             scene.activeCameras.pop();
             camera.attachControl(canvas, true);
             scene.walkCamera.detachControl(canvas, true);
         }
         scene.isWalk = 0;
         scene.cameraMode = sett.cameraMode;

         scene.motions.mainCameraTarget = {
             x: pos.x,
             y: pos.y,
             z: pos.z,
             r: 560,
             a: 0.45,
             b: 1.25,
             range_r: null,
             range_b: null,
             range_a: null,
         };

         scene.motions.mainCameraMove.play();

     } else if (scene.cameraMode != "2d" && sett.cameraMode == "2d" && scene.selectFloor) {
         if (scene.isWalk) {
             scene.activeCameras.pop();
             camera.attachControl(canvas, true);
             scene.walkCamera.detachControl(canvas, true);
         }
         scene.isWalk = 0;
         scene.cameraMode = sett.cameraMode;

         var mesh = scene.selectFloor;
         var modelItem = scene.selectedItem;

         scene.createDefaultBuilding(
             [0, mesh.dy.d], { name: modelItem.data.params.name, uuid: modelItem.data.id }, {
                 x: modelItem.mesh.position.x,
                 y: modelItem.mesh.position.y,
                 z: modelItem.mesh.position.z,
                 autoSelected: 1,
                 fun: function(mi) {

                     scene.motions.mainCameraTarget = {
                         x: pos.x,
                         y: pos.y,
                         z: pos.z,
                         r: 30,
                         a: 0.0,
                         b: 0.,
                         range_r: [10, 50],
                         range_b: [0, 0],
                         range_a: [0, 0],
                     };

                     scene.motions.mainCameraMove.play();

                 }
             }, );



     }

 };

 scene.time = 10000000;
 camera.wheelPrecision = 1;

 camera.alpha = 0.5;
 camera.beta = 0.75;
 camera.radius = 500;
 scene.onFrame = function(ti, c) {
     var t = scene.time++;

     camera.radius = max(2, camera.radius);

     if (scene.cameraMode == "walk") {

         scene.avatar.position.x = scene.walkCamera.position.x;
         scene.avatar.position.y = scene.walkCamera.position.y + 0.25 - scene.personViewHeightCorrection;
         scene.avatar.position.z = scene.walkCamera.position.z;

         camera._currentTarget.x = scene.walkCamera.position.x;
         camera._currentTarget.y = scene.walkCamera.position.y;
         camera._currentTarget.z = scene.walkCamera.position.z;

         camera.radius = 2.25;

         camera.alpha = -90. * deg - scene.walkCamera.rotation.y;
         camera.beta = 90. * deg - scene.walkCamera.rotation.x;

         scene.avatar.rotation.y = scene.walkCamera.rotation.y;

     }

     if (scene.motions)
         for (var motion in scene.motions) {
             if (scene.motions[motion] && scene.motions[motion].play) {
                 motion = scene.motions[motion]
                 motion.fun();
             }
         }

     camera._currentTarget.y = max(0, camera._currentTarget.y);



     camera.panningSensibility = max(0.5, 3140 / camera.radius);

     camera.wheelPrecision = 314 / camera.radius;
     camera.pinchPrecision = 314 / camera.radius;

     c.time = t;

     stat(" ");
     if (scene.dargStatus.x != null)
         if (new Date().getTime() - scene.dargStatus.t < 300) {
             // hold
             stat("hold");
         } else if (new Date().getTime() - scene.dargStatus.t < 1500) {
         // long hold
         stat("long hold");

         if (scene.selectedMesh) {
             scene.dargStatus.status = 1;

             camera.detachControl(canvas);

             scene.detach = 1;
         }
     } else {
         // very long hold
         stat("very long hold");

         if (scene.selectedMesh) {
             scene.dargStatus.status = 1;


             camera.detachControl(canvas);

             scene.detach = 1;
         }
     }

     return c;
 };

 var liveElements = [];

 var ground = new BABYLON.Mesh();
 ground.id = "ground|base";
 ground.rotation.x = 90 * deg;
 ground.position.y = 0;
 ground.position_y = 0;
 ground.isGround = 1;

 scene.modelCommand.createModel({
         type: "content",
         id: "ground|grid",
         mode: "flat",
         pick: false,
         param: {
             width: 2000,
             height: 2000
         }
     }, { grid: 0 },
     null,
     function(ms) {
         ms.rotation.x = 90 * deg;
         ms.position.y = -0.15;
         scene.groundGrid = ms;
     }
 );

 scene.modelCommand.createModel({
         type: "content",
         id: "ground|base",
         mode: "flat",
         pick: true,
         param: {
             width: 2000,
             height: 2000
         }
     }, { discard: 0 },
     ground,
     function(ms) {

         ms.checkCollisions = 1;

     }
 );
 scene.ground = ground;


 scene.items = [];

 scene.identity = 0;

 scene.createModel = function(data, fun) {

     if (scene.getMeshByID("model|" + data.id)) {
         scene.disposeMesh(scene.getMeshByID("model|" + data.id));
     }

     var mesh = new BABYLON.Mesh();
     mesh.id = "model|" + data.id;
     mesh.isModelParent = true;
     mesh.modelData = data;

     scene.items[data.id] = { data: data, mesh: mesh };

     callWorker({ id: data.id, mode: "model", data: data }, fun);


 };

 scene.deleteModel = function(data) {
     if (scene.getMeshByID("model|" + data.id)) {
         scene.disposeMesh(scene.getMeshByID("model|" + data.id));
     }
 };

 scene.saveTemp = function() {
     /*
               for (var ms in scene.meshes) {
                   ms = scene.meshes[ms];
                   if (ms.isModelParent && ms.id != 'deleted') {
                       datas.push(ms.modelData);
                   }
               }
               console.log(JSON.stringify(datas))*/
 };

 scene.loadTemp = function() {
     /* var data = JSON.parse(localStorage.tempData);
               for (var i in data) {
                   scene.createModel(data[i]);
               } */
 };

 scene.dargStatus = { status: 0 };

 scene.onPointerDown = function(evn, prm) {

     scene.dargStatus.x = evn.pageX;
     scene.dargStatus.y = evn.pageY;
     scene.dargStatus.t = new Date().getTime();

     if (prm && prm.hit) {
         if (
             prm.pickedMesh.parent &&
             prm.pickedMesh.parent.isModelParent &&
             prm.pickedMesh.item_type == "default"
         ) {
             stat("-- ", evn.button);


             scene.selectedMesh = prm.pickedMesh.parent;
         }

         if (prm.pickedMesh.editBox) {
             scene.editBox = prm.pickedMesh;
             scene.editBox.isPickable = false;
         }
     }
 };

 scene.onPointerUp = function(evn, prm) {
     if (
         abs(scene.dargStatus.x - evn.pageX) < 3 &&
         abs(scene.dargStatus.y - evn.pageY) < 3
     ) {
         if (new Date().getTime() - scene.dargStatus.t < 200) {
             // click

             if (evn.buttons == 0) {
                 if (scene.lastPicSelected && scene.lastPicSelected.pickedMesh.click) {
                     scene.lastPicSelected.pickedMesh.click(scene.lastPicSelected.pickedMesh);
                 }


             } else
             if (prm && prm.hit) {
                 if (prm.pickedMesh.click) prm.pickedMesh.click(prm.pickedMesh);

                 /** setUp building click status */
             }
         } else {
             // 3d click
             stat("hold click");
         }
     }

     scene.dargStatus.x = null;
     scene.dargStatus.y = null;
     scene.dargStatus.t = 0;

     if (scene.detach == 1) {
         scene.detach = 0;
         scene.dargStatus.status = 0;

         if (scene.selectedMesh.isModelParent && scene.lastPicSelected) {
             if (scene.lastPicSelected.pickedMesh.id == "ground|base|discard") {
                 /** just moved */

                 if (localDB.all_buildings.table[scene.selectedMesh.item.uuid]) {
                     new entity("building", localDB.curr_office)
                         .id(scene.selectedMesh.item.uuid)
                         .set({
                             position_x: floor(scene.lastPicSelected.pickedPoint.x * 1000),
                             position_y: floor(scene.lastPicSelected.pickedPoint.y * 1000 + 1),
                             position_z: floor(scene.lastPicSelected.pickedPoint.z * 1000),
                             data: {
                                 status: "building_set3dpos",
                                 position_x: floor(scene.lastPicSelected.pickedPoint.x * 1000) / 1000,
                                 position_y: floor(scene.lastPicSelected.pickedPoint.y * 1000 + 1) /
                                     1000.0,
                                 position_z: floor(scene.lastPicSelected.pickedPoint.z * 1000) / 1000
                             }
                         })
                         .then(me => {
                             console.log("saved building", me);
                         });
                 } else if (localDB.all_floor.table[scene.selectedMesh.item.uuid]) {
                     new entity("floor", localDB.curr_office)
                         .id(scene.selectedMesh.item.uuid)
                         .set({
                             data: {
                                 status: "singlefloor_set3dpos",
                                 position_x: floor(scene.lastPicSelected.pickedPoint.x * 1000) / 1000,
                                 position_y: floor(scene.lastPicSelected.pickedPoint.y * 1000 + 1) /
                                     1000.0,
                                 position_z: floor(scene.lastPicSelected.pickedPoint.z * 1000) / 1000
                             }
                         })
                         .then(me => {
                             console.log("saved floor", me);
                         });
                 } else if (localDB.all_desks.table[scene.selectedMesh.item.uuid]) {
                     /** nasimi ??? need all map item for handle save desk by position */

                     console.log(
                         "unassigned floor desk cant be save (i dont have mapitem for office ) "
                     );
                 }
             } else if (
                 scene.lastPicSelected.pickedMesh &&
                 scene.lastPicSelected.pickedMesh._parentNode &&
                 scene.lastPicSelected.pickedMesh._parentNode.item
             ) {
                 if (scene.lastPicSelected.pickedMesh._parentNode.item.floors) {
                     /** is building */
                     if (
                         localDB.all_buildings.table[
                             scene.lastPicSelected.pickedMesh._parentNode.item.uuid
                         ]
                     ) {}
                 } else {
                     /** is floor */
                     if (
                         localDB.all_floor.table[
                             scene.lastPicSelected.pickedMesh._parentNode.item.uuid
                         ]
                     ) {
                         if (localDB.all_desks.table[scene.selectedMesh.item.uuid]) {
                             new entity("desk", localDB.curr_office)
                                 .id(scene.selectedMesh.item.uuid)
                                 .set({
                                     name: "First Desk",
                                     assigned_user_uuids: [],
                                     flex: false,
                                     active: false,
                                     department: "New IT-Department",
                                     floor_uuid: scene.lastPicSelected.pickedMesh._parentNode.item.uuid
                                 })
                                 .then(me => {
                                     console.log(
                                         "desk assigned to floor: ",
                                         scene.lastPicSelected.pickedMesh._parentNode.item.uuid
                                     );
                                 });
                         }
                     }
                 }
             }
         }


         setTimeout(() => {
             scene.selectedMesh = null;
         }, 50);

         camera.attachControl(canvas);
     }
 };

 var nanPos = new BABYLON.Vector3(-99999999999, -99999999999, -99999999999);

 scene.buildings = [];

 scene.onPointerMove = function(evn, pik) {

     var prm = scene.pick(scene.pointerX, scene.pointerY);




     if (prm.hit) {

         console.log(prm.pickedMesh.name)

         stat(prm.pickedMesh.id, prm.pickedMesh.editBox);
         scene.currPosition = prm.pickedPoint;


         if (scene.dargStatus.status && scene.selectedMesh) {

             scene.selectedMesh.position.x = prm.pickedPoint.x;
             scene.selectedMesh.position.y = prm.pickedPoint.y;
             scene.selectedMesh.position.z = prm.pickedPoint.z;


         } else if (scene.editBox) {


             scene.editBox.position.x = prm.pickedPoint.x;
             scene.editBox.position.y = prm.pickedPoint.y;
             scene.editBox.position.z = prm.pickedPoint.z;

         }
         for (var itm in scene.meshes) {
             if (prm.pickedMesh.id != scene.meshes[itm].id && scene.meshes[itm].material && scene.meshes[itm].material.flagDown)
                 scene.meshes[itm].material.flagDown(2);
         }

         if (prm.pickedMesh.material && prm.pickedMesh.material.flagUp) {
             if (prm.pickedMesh.id.indexOf('|hover') != -1)
                 document.body.style.cursor = 'pointer';
             else document.body.style.cursor = 'default';
             prm.pickedMesh.material.flagUp(2);

             scene.lastPicSelected = prm;
         } else scene.lastPicSelected = null;



         if (prm.pickedMesh) {
             scene.groundGrid.material.setVector3("pickedPoint", {
                 x: prm.pickedPoint.x,
                 y: -0.15,
                 z: prm.pickedPoint.z
             });
         } else {
             if (prm.pickedMesh)
                 prm.pickedMesh.material.setVector3("pickedPoint", nanPos);
         }

         scene.postMessage({
             type: "mouse-move",
             eventType: { button: evn.button },
             mesh: prm.pickedMesh.name,
             point: cln(prm.pickedPoint)
         });
     } else scene.currPosition = null;
 };

 scene.drag = function(event) {
     prm = scene.pick(event.offsetX, event.offsetY);

     if (prm.hit) {
         scene.currPosition = prm.pickedPoint;

         if (prm.pickedMesh) {
             prm.pickedMesh.material.setVector3("pickedPoint", prm.pickedPoint);
             scene.groundGrid.material.setVector3("pickedPoint", prm.pickedPoint);
         } else {
             if (prm.pickedMesh)
                 prm.pickedMesh.material.setVector3("pickedPoint", nanPos);
         }

         scene.postMessage({
             type: "drag-move",
             eventType: { button: event.button },
             mesh: prm.pickedMesh.name,
             point: cln(prm.pickedPoint)
         });
     } else scene.currPosition = null;

     if (scene.dargStatus) {
         if (!scene.dragCarrier) {
             var id = ++scene.identity + "_" + new Date().getTime();
             scene.dragCarrier = id;

             scene.createModel({
                 modelType: scene.dragedItem.model,
                 params: scene.dragedItem.params,
                 variant: scene.dragedItem.mode,
                 id: id
             });
         } else if (scene.items && scene.items[scene.dragCarrier]) {
             if (scene.currPosition) {
                 scene.items[scene.dragCarrier].mesh.position.x = scene.currPosition.x;
                 scene.items[scene.dragCarrier].mesh.position.y = scene.currPosition.y;
                 scene.items[scene.dragCarrier].mesh.position.z = scene.currPosition.z;
             } else {
                 scene.items[scene.dragCarrier].mesh.position = nanPos;
             }
         }
     }
 };

 scene.drop = function() {
     if (scene.dargStatus) {
         if (
             scene.items[scene.dragCarrier] &&
             scene.items[scene.dragCarrier].data &&
             scene.items[scene.dragCarrier].mesh &&
             scene.items[scene.dragCarrier].mesh.position.y > nanPos.y
         ) {
             if (
                 scene.items[scene.dragCarrier].data.modelType.startsWith("building_")
             ) {
                 scene.buildings.push(scene.dragCarrier);

                 updateBuildings(scene.dragCarrier);
             } else {
                 updateProperties(
                     scene.items[scene.dragCarrier].data.params,
                     scene.items[scene.dragCarrier].data,
                     function() {}
                 );
             }
         }

         scene.dargStatus = null;
         scene.dragCarrier = null;
     }
 };

 function updateBuildings(id) {
     if (document.getElementById("building_items")) {
         var bilds = document.getElementById("building_items");
         try {
             bilds.innerHTML = "";

             for (var bil in scene.buildings) {
                 bil = scene.buildings[bil];
                 bilds.appendChild(
                     new Option(scene.items[bil].data.params.name || "unknown", bil)
                 );
             }

             if (!bilds.onchange)
                 bilds.onchange = function() {
                     updateStages(this.value);
                     scene.buildingCamera(this.value);
                     updateProperties(
                         scene.items[this.value].data.params,
                         scene.items[this.value].data,
                         updateBuildings
                     );
                 };

             if (id) {
                 bilds.value = id;
                 updateStages(id);
                 updateProperties(
                     scene.items[id].data.params,
                     scene.items[id].data,
                     updateBuildings
                 );
             }
         } catch (e) {
             console.log(e);
         }
     }
 }

 function updateStages(id) {
     var stgs = document.getElementById("stage_items");
     stgs.innerHTML = "";

     stgs.key = id;

     if (!stgs.onchange)
         stgs.onchange = function() {
             scene.stageCamera(this.key, this.value);
         };

     stgs.appendChild(new Option("---", -1));

     var arr = scene.items[id].data.params.mul_stages_height_s;

     for (var stg in arr) {
         stgs.appendChild(new Option("st " + stg, stg));
     }

     stgs.value = -1;
 }

 camera.minZ = 0;
 camera.lowerRadiusLimit = 0.1;

 scene.stageCamera = function(id, stg) {
     var ms = scene.items[id];

     if (ms) {
         var pos = ms.mesh.position.clone();
         var h = 0;
         var lh = 3;

         for (var i = 0; i <= stg; i++) {
             if (ms.data.params.mul_stages_height_s[i]) {
                 lh = ms.data.params.mul_stages_height_s[i];
                 h += ms.data.params.mul_stages_height_s[i];
             }
         }

         pos.y += h + min(1.5, lh * 0.25);

         camera.setTarget(pos);
         camera.radius = 0.02;

         camera.beta = 1.45;


     }
 };
 scene.updateBuildings = updateBuildings;

 scene.updateGroundMat = function(img, op) {
     op = def(op, {});
     scene.groundGrid.material = new BABYLONX.ShaderBuilder()
         .SetUniform("sett", "vec4")
         .SetUniform("pickedPoint", "vec3")
         .Func(function(me) {
             me.Map({
                 path: img.src,
                 uv: "vec2(float(" +
                     1 / (def(op.sc, 1) * 0.1) +
                     ")*vuv*vec2(-1.,1.)+vec2(float(" +
                     def(op.x, 0) +
                     "),float(" +
                     def(op.z, 0) +
                     ")))"
             });
             return me;
         })
         .Transparency()
         .Reference(1)
         .Func(function(me) {
             me.Setting.FragmentWorld = 1;
             me.InLine(`
                vec3 wpos = vec4(world*vec4(pos,1.)).xyz;
                vec3 wnrm =  mat3(world)*nrm;
                `);
             return me;
         })
         .InLine(
             `
        float fs =1.- dot(wnrm,normalize(wpos-camera));
        float w0 = max(0.,abs(sin(wpos.x*0.01+3.14159265*0.5)*130000.)-129990.);
        w0  = max(w0,abs(sin(wpos.z*0.01+3.14159265*0.5)*130000.)-129990.);
        float w = max(0.,abs(sin(wpos.x*0.1+3.14159265*0.5)*13000.)-12999.);
        w  = max(w,abs(sin(wpos.z*0.1+3.14159265*0.5)*13000.)-12999.);
        float w2  = max(w,abs(sin(wpos.x*1.+3.14159265*0.5)*1000.)-999.);
        w2  = max(w2,abs(sin(wpos.z*1.+3.14159265*0.5)*1000.)-999.);

        float l = (1.-max(0.0,min(1.,length(wpos-camera)*0.01)))*0.85+0.15+sett.y; 
    
        result = vec4( vec3(0.7,0.8,1.) , min(0.5, (l*0.8)*w*0.85+fs*max( (0.98-length(result.xyz)*0.5) *sett.y  ,l*w2  )*0.25)+max(0.05,min(0.1,w0 )));

        float circleDis =  length(pickedPoint-wpos.xyz ) ;
        float radius =    length(pickedPoint-camera) *0.015 ;
        float tickness = 2./radius;
        
       
        float circleCand = abs(1.-(8./radius)*circleDis);
        float circle =  circleCand < tickness?1.-circleCand /tickness:
         (circleDis<  0.5*tickness*radius ?1.:0.);
        
         result.xyz = vec3( mix(result.xyz,vec3(0.5),circle)); 
         result.w =  mix(result.w,1.,circle*0.1); 

         result  = mix(result,result_1,float(` +
             def(op.a, 0.3) +
             `));
        
        `
         )
         .BuildMaterial(scene);
 };

 scene.getBase64 = function(file) {
     return new Promise((resolve, reject) => {
         const reader = new FileReader();
         reader.readAsDataURL(file);
         reader.onload = () => resolve(reader.result);
         reader.onerror = error => reject(error);
     });
 };

 scene.buildingCamera = function(id) {
     var ms = scene.items[id];

     if (ms) {
         camera.setTarget(ms.mesh.position.clone());
         camera.radius = 30;
     }
 };

 scene.finalizeLoadAllItem = function() {
     if (localDB.loadProcess == 4) {}
 };

 scene.appendIcons = function(mesh, icons) {
     for (var i = 0; i < icons.length; i++) {
         scene.modelCommand.createModel({
                 type: "content",
                 id: "ground|grid",
                 mode: "flat",
                 pick: false,

                 param: {
                     width: def(icons[i].size, 0.5),
                     height: def(icons[i].size, 0.5),
                     path: icons[i].path
                 }
             }, { icon: 0 },
             mesh,
             function(ms) {
                 ms.isPickable = 1;
                 ms.id += '|hover';
                 ms.rotation.z = 90 * deg;
                 ms.position.x = def(icons[i].x, 0);
                 ms.position.y = def(icons[i].y, 0);
                 ms.position.z = def(icons[i].z, 0);

                 if (icons[i].click) {
                     ms.click = icons[i].click;
                 }
             }
         );
     }
 };

 scene.appendTag = function(id, tag, dy, draw, click) {
     callWorker({
             id: id,
             mode: "model",
             data: {
                 modelType: "content",
                 liveMat: 1,
                 id: id,
                 variant: "tag",
                 pick: false,
                 params: {
                     dy: { tag: dy },
                     width: def(tag.w, 0.5),
                     height: def(tag.h, 0.5),
                 }
             }
         },
         function(ms, mesh, variant) {

             mesh.id += "|hover";

             mesh.isPickable = true;

             if (dy && draw) {
                 draw(mesh.dyContext, dy, mesh, mesh.dyTexture);
                 mesh.dyTexture.reset(mesh, mesh.material);
             }

             mesh.click = click;

         }
     );
 };

 var buildingDefaultPosition = {
     x: 50,
     y: 0,
     z: -300,
     mz: 50,
     mx: 50,
     count: 0,
     grid: 4
 };

 function buildingGetNewPosition() {
     var pos = {
         x: buildingDefaultPosition.x +
             buildingDefaultPosition.count %
             buildingDefaultPosition.grid *
             buildingDefaultPosition.mx,
         y: buildingDefaultPosition.y,
         z: buildingDefaultPosition.z +
             floor(buildingDefaultPosition.count / buildingDefaultPosition.grid) *
             buildingDefaultPosition.mz
     };
     buildingDefaultPosition.count++;
     return pos;
 }

 var floorDefaultPosition = {
     x: 300,
     y: 0,
     z: -300,
     mz: 50,
     mx: 50,
     count: 0,
     grid: 3
 };

 function floorGetNewPosition() {
     var pos = {
         x: floorDefaultPosition.x +
             floorDefaultPosition.count %
             floorDefaultPosition.grid *
             floorDefaultPosition.mx,
         y: floorDefaultPosition.y,
         z: floorDefaultPosition.z +
             floor(floorDefaultPosition.count / floorDefaultPosition.grid) *
             floorDefaultPosition.mz
     };
     floorDefaultPosition.count++;
     return pos;
 }

 var deskDefaultPosition = {
     x: 450,
     y: 0,
     z: -300,
     mz: 5,
     mx: 5,
     count: 0,
     grid: 12
 };

 function deskGetNewPosition() {
     var pos = {
         x: deskDefaultPosition.x +
             deskDefaultPosition.count %
             deskDefaultPosition.grid *
             deskDefaultPosition.mx,
         y: deskDefaultPosition.y,
         z: deskDefaultPosition.z +
             floor(deskDefaultPosition.count / deskDefaultPosition.grid) *
             deskDefaultPosition.mz
     };
     deskDefaultPosition.count++;
     return pos;
 }

 scene.deSelectAll = function(id) {

     for (var itm in scene.items) {
         itm = scene.items[itm];
         if (id.indexOf(itm.mesh.id) != -1 && itm.mesh.deselectMotion) {
             itm.mesh.deselectMotion.play();
         }
     }
 }


 scene.createDefaultBuilding = function(floors, item, ts) {
     var modelStr = {
         name: item.name || "unknown",
         width: 40,
         depth: 30,
         pick: 1,
         exp_stair_width: 2.5,
         exp_stair_depth: 2.5,
         exp_stair_position_x: 5,
         exp_stair_position_z: 5,
         mul_stages_height_s: floors,
         trans: item.uuid == "new_floor" ? true : false
     };

     scene.createModel({
             modelType: "building_rect",
             params: modelStr,
             variant: 'default',
             id: item.uuid
         },
         function(modelItem, mesh, variant) {
             modelItem.type = "building";

             if (ts.autoSelected) {
                 scene.selectedItem = modelItem;
             }

             if (variant == "default") {

                 mesh.checkCollisions = 1;

                 scene.appendTag(modelItem.data.id + ' walkin', {
                     h: 12,
                     w: 3.,
                 }, {
                     w: 128,
                     h: 512,
                 }, function(cx, dy, ms) {

                     ms.checkCollisions = true;
                     ms.isPickable = true;

                     ms.rotation.z = 90. * deg;
                     ms.rotation.x = 180. * deg;
                     ms.position.y = 3.;
                     ms.position.x = 0.;
                     ms.position.z = modelItem.data.params.depth / 2.0 + 0.5;

                     ms.parent = modelItem.mesh;
                     ms.dy = dy;

                     var tmp = new canvas_scene.UI.Content(cx);

                     tmp.x = 0.;
                     tmp.y = 0.;
                     tmp.w = dy.w;
                     tmp.h = dy.h;

                     tmp.clear("#00000000");

                     tmp.text({
                         title: "[ Walk In ]",
                         font: '66px Arial Black',
                         color: '#000000ff',
                         pos: '49% 50%',
                         rot: -90 * deg
                     });
                     tmp.text({
                         title: "[ Walk In ]",
                         font: '64px Arial Black',
                         color: '#ffdd00ff',
                         rot: -90 * deg
                     })

                 }, function(ms) {

                     scene.selectFloor = ms;
                     scene.selectedModel = modelItem;

                     scene.changeCameraMode({
                         cameraMode: 'walk',
                         pos: {
                             x: modelItem.mesh.absolutePosition.x,
                             y: modelItem.mesh.absolutePosition.y + 1.0,
                             z: modelItem.mesh.absolutePosition.z
                         }
                     })
                 });


                 scene.appendTag(modelItem.data.id + ' logo', {
                     h: 12,
                     w: 12.,
                 }, {
                     w: 1024,
                     h: 1024,
                 }, function(cx, dy, ms, dt) {

                     ms.checkCollisions = true;
                     ms.isPickable = true;

                     ms.rotation.z = 90. * deg;
                     ms.rotation.x = 180. * deg;
                     ms.position.y = 8.;
                     ms.position.x = -modelItem.data.params.width / 2.0 + modelItem.data.params.width / 4.5;
                     ms.position.z = modelItem.data.params.depth / 2.0 + 0.5;

                     ms.parent = modelItem.mesh;
                     ms.dy = dy;

                     var tmp = new canvas_scene.UI.Content(cx);

                     tmp.x = 0.;
                     tmp.y = 0.;
                     tmp.w = dy.w;
                     tmp.h = dy.h;

                     tmp.clear("#00000000");

                     tmp.image({
                         size: '50%',
                         src: window.baseImgURL + "/logo.jpg",
                         pos: '49% 50%',
                         rot: -90 * deg
                     }, function() {
                         dt.reset(ms, ms.material)

                     });

                 }, function(ms) {

                     window.open('https://orangeryos.de/', '_blank');
                 });


                 var h = 0;
                 for (var i = 0; i < floors.length - 1; i++) {
                     h += floors[i];
                     scene.appendTag(modelItem.data.id + ' ' + i, {
                         h: 6,
                         w: 1.5,
                     }, {
                         w: 128,
                         h: 512,
                         d: h,
                         i: i * 1.0 + 1.0,

                     }, function(cx, dy, ms) {

                         ms.dy = dy;

                         ms.rotation.z = 90. * deg;
                         ms.rotation.x = 180. * deg;
                         ms.position.y = dy.d + 1.;
                         ms.position.x = modelItem.data.params.width / 2.0 - modelItem.data.params.width / 6.;
                         ms.position.z = modelItem.data.params.depth / 2.0 + 0.25;

                         ms.parent = modelItem.mesh;

                         var tmp = new canvas_scene.UI.Content(cx);

                         var siz = dy.w;

                         tmp.x = 0.;
                         tmp.y = 0.;
                         tmp.w = dy.w;
                         tmp.h = dy.h;

                         tmp.clear("#00000000");
                         tmp.text({
                             title: "Floor NO:" + dy.i,
                             font: '64px Arial Black',
                             color: '#000000ff',
                             rot: -90 * deg
                         })

                     }, function(ms) {

                         scene.selectFloor = ms;
                         scene.selectedModel = modelItem;

                         scene.changeCameraMode({
                             cameraMode: 'walk',
                             pos: {
                                 x: modelItem.mesh.absolutePosition.x,
                                 y: modelItem.mesh.absolutePosition.y + ms.dy.d + 1.,
                                 z: modelItem.mesh.absolutePosition.z
                             }
                         })
                     });
                 }

                 modelItem.mesh.select = function() {
                     scene.selectedItem = modelItem;
                     scene.deSelectAll([modelItem.mesh.id]);
                     if (modelItem.mesh.selectMotion) {

                         modelItem.mesh.selectMotion.play();
                     }
                 }

                 modelItem.mesh.selectMotion = new scene.UI.motion("mo|" + item.uuid, function(v) {


                 }, 1., scene.motions.speed);

                 scene.motions["mo|" + item.uuid] = modelItem.mesh.selectMotion;


             }

             if (ts) {
                 modelItem.mesh.position.x = ts.x;
                 modelItem.mesh.position.y = ts.y;
                 modelItem.mesh.position.z = ts.z;

                 modelItem.mesh.floors = floors;
                 modelItem.mesh.item = item;

                 if (ts.floorsItem) {
                     modelItem.floorsItem = ts.floorsItem;
                 }
             } else {
                 var pos = floorGetNewPosition();
                 modelItem.mesh.position.x = pos.x;
                 modelItem.mesh.position.y = pos.y;
                 modelItem.mesh.position.z = pos.z;

                 modelItem.mesh.floors = floors;
                 modelItem.mesh.item = item;
             }

             var h = 0;

             var icons = [];

             for (var n = 0; n < modelItem.mesh.floors.length; n++) {
                 h += modelItem.mesh.floors[n];
                 if (n < modelItem.mesh.floors.length - 2)
                     icons.push({
                         size: 1.25,
                         y: h + 2,
                         x: 20 + 2,
                         z: 15 + 2,
                         path: baseImgURL + "/remove.png",
                         click: function() {
                             modelItem.mesh.floors.pop();
                             scene.createDefaultBuilding(
                                 modelItem.mesh.floors,
                                 modelItem.mesh.item
                             );
                         }
                     });
             }

             if (item.uuid == "new_floor") {
                 icons.push({
                     size: 2,
                     y: h + 2,
                     x: 20 + 2,
                     z: 15 + 2,
                     path: baseImgURL + "/add.png",
                     click: function() {


                         /* new entity("floor", localDB.curr_office)
                               .new({
                                   name: "new floor (unknown)"
                               })
                               .then(function(d) {
                                   var newItem = d.floor;

                                   localDB.all_floor.table[newItem.uuid] = newItem;

                                   scene.createDefaultBuilding([0], newItem, {
                                       x: scene.items["new_floor"].mesh.position.x * 1.0,
                                       y: scene.items["new_floor"].mesh.position.y * 1.0,
                                       z: scene.items["new_floor"].mesh.position.z * 1.0
                                   });

                                   pos = floorGetNewPosition();
                                   scene.items["new_floor"].mesh.position.x = pos.x;
                                   scene.items["new_floor"].mesh.position.y = pos.y;
                                   scene.items["new_floor"].mesh.position.z = pos.z;
                               });*/


                     }
                 });
             } else if (!modelItem.floorsItem) {
                 /** create building */
                 icons.push({
                     size: 3,
                     y: h + 2,
                     x: 20 + 2,
                     z: 15 + 2,
                     path: baseImgURL + "/add.png",
                     click: function() {
                         /*  new entity("building", localDB.curr_office)
                              .new({
                                  name: "bld_" + item.uuid
                              })
                              .then(function(d) {
                                  var newBuild = d.building;
                                  localDB.all_buildings.table[newBuild.uuid] = newBuild;

                                  new entity("floor", localDB.curr_office)
                                      .new({
                                          name: "new floor (unknown)",
                                          building_uuid: newBuild.uuid
                                      })
                                      .then(function(d2) {
                                          var newFloor = d2.floor;

                                          new entity("floor", localDB.curr_office)
                                              .id(item.uuid)
                                              .set({
                                                  building_uuid: newBuild.uuid
                                              })
                                              .then(d => {
                                                  
                                                  scene.items[item.uuid].mesh.position.y = 200;
                                                  scene.disposeMesh(scene.items[item.uuid].mesh);
                                                  setTimeout(() => {
                                                      scene.items[item.uuid] = null;
                                                  }, 200);
                                              });

                                          localDB.all_floor.table[newFloor.uuid] = newFloor;

                                          scene.createDefaultBuilding([0, 5], newBuild, {
                                              x: scene.items[item.uuid].mesh.position.x * 1.0,
                                              y: 0,
                                              z: scene.items[item.uuid].mesh.position.z * 1.0,
                                              floorsItem: [item, newFloor]
                                          });
                                      });
                              }); */
                     }
                 });
             } else {
                 icons.push({
                     size: 3,
                     y: h + 2,
                     x: 20 + 2,
                     z: 15 + 2,
                     path: baseImgURL + "/add.png",
                     click: function() {
                         new entity("floor", localDB.curr_office)
                             .new({
                                 name: "new floor (unknown)",
                                 building_uuid: modelItem.data.id
                             })
                             .then(d2 => {
                                 var newFloor = d2.floor;

                                 var buildItem = localDB.all_buildings.table[modelItem.data.id];

                                 localDB.all_floor.table[newFloor.uuid] = newFloor;

                                 modelItem.floorsItem.push(newFloor);

                                 var stages = [0];
                                 for (var j = 0; j < modelItem.floorsItem.length - 1; j++) {
                                     stages.push(5);
                                 }

                                 scene.createDefaultBuilding(stages, buildItem, {
                                     x: scene.items[buildItem.uuid].mesh.position.x * 1.0,
                                     y: scene.items[buildItem.uuid].mesh.position.y * 1.0,
                                     z: scene.items[buildItem.uuid].mesh.position.z * 1.0,
                                     floorsItem: modelItem.floorsItem
                                 });
                             });
                     }
                 });
             }



             var newStr = mix(modelStr, {
                 dy: {
                     content: {
                         w: 1024,
                         h: 1024,
                     }
                 }
             }, 1);


             if (!modelItem.mesh.detail) {
                 modelItem.mesh.detail = 'inprocess';
                 scene.createModel({
                         modelType: "detail_content",
                         params: newStr,
                         variant: 'default',
                         id: 'detail|' + item.uuid,
                     },
                     function(detailModelItem, mesh, variant) {


                         detailModelItem.mesh.position.y = -3.;

                         modelItem.mesh.selectMotion.frame = function(v) {
                             detailModelItem.mesh.position.y = -3. + v * 3.;

                             for (var ittm in canvas_scene.selectedItem.mesh.detail._children) {
                                 ittm = canvas_scene.selectedItem.mesh.detail._children[ittm];

                                 ittm.material.setVector4('sett', { x: 0, y: 0, z: 0, w: v });
                             }
                         };

                         if (detailModelItem.data.params.dy && detailModelItem.data.params.dy[variant]) {


                             var cwall = new canvas_scene.UI.Content(mesh.dyContext);

                             var siz = detailModelItem.data.params.dy[variant].w;

                             cwall.x = 0.;
                             cwall.y = 0.;
                             cwall.w = detailModelItem.data.params.dy[variant].w / 2.;
                             cwall.h = detailModelItem.data.params.dy[variant].h / 2.;

                             cwall.clear("#00000000");
                             cwall.text({ title: 'name : ', font: floor(siz / 20.) + 'px Arial  ', color: '#000000ff', pos: '30% 15%' });
                             cwall.text({ title: detailModelItem.data.params.name, font: floor(siz / 15.) + 'px Arial Black', color: '#000000ff', pos: '50% 35%' });
                             cwall.text({ title: 'unassigned to building', font: floor(siz / 40.) + 'px Arial Black', color: '#00000099', pos: '50% 50%' });

                             var cfloor = new canvas_scene.UI.Content(mesh.dyContext);

                             cfloor.x = detailModelItem.data.params.dy[variant].w / 2.;
                             cfloor.y = 0.;
                             cfloor.w = detailModelItem.data.params.dy[variant].w / 2.;
                             cfloor.h = detailModelItem.data.params.dy[variant].h / 2.;

                             cfloor.clear("#00000000");
                             cfloor.p({
                                 text: 'this content can explain about how to work with this floor or detail of floors contents ... \n this is new floor you can create some stage on this and make it as building and all setting of floor is same in thee one building .. ',
                                 font: floor(siz / 30.) + 'px Arial',
                                 color: '#999999ff',
                                 pos: '5% 5%'
                             });

                             var cwidth = new canvas_scene.UI.Content(mesh.dyContext);

                             cwidth.x = detailModelItem.data.params.dy[variant].w / 2.;
                             cwidth.y = detailModelItem.data.params.dy[variant].h / 2.;
                             cwidth.w = detailModelItem.data.params.dy[variant].w / 2.;
                             cwidth.h = detailModelItem.data.params.dy[variant].h / 2.;

                             cwidth.clear("#00000000");
                             cwidth.text({ title: 'Width : ' + detailModelItem.data.params.width + ' m', font: floor(siz / 15.) + 'px Arial', rot: 180 * deg, color: '#000000ff', pos: '50% 50%' });

                             var cheight = new canvas_scene.UI.Content(mesh.dyContext);

                             cheight.x = 0.;
                             cheight.y = detailModelItem.data.params.dy[variant].h / 2.;
                             cheight.w = detailModelItem.data.params.dy[variant].w / 2.;
                             cheight.h = detailModelItem.data.params.dy[variant].h / 2.;


                             cheight.clear("#00000000");
                             cheight.text({ title: 'Length : ' + detailModelItem.data.params.depth + ' m', font: floor(siz / 15.) + 'px Arial ', rot: -90 * deg, color: '#000000ff', pos: '50% 50%' });


                             mesh.dyTexture.reset(mesh, mesh.material);

                         }


                         detailModelItem.mesh.parent = modelItem.mesh;
                         modelItem.mesh.detail = detailModelItem.mesh;

                         if (ts.fun) ts.fun(modelItem);

                     }
                 );
             }


             scene.appendIcons(modelItem.mesh, icons);
         }
     );

 };

 scene.createDefaultDesk = function(item, ts) {
     scene.createModel({
             modelType: "desk_simple",
             params: {
                 name: "unknown",
                 exp_seg: 32,
                 width: 1.2,
                 depth: 0.65,
                 corner: 0.05,
                 height: 0.64,
                 exp_deep: 0.04,
                 exp_down_deep: 0.02,
                 exp_column_scale: 3.5,
                 exp_column_in: 0.05,
                 trans: item.uuid == "new_desk" ? true : false
             },
             variant: 'default',
             id: item.uuid
         },
         function(modelItem) {
             modelItem.type = "desk";



             if (ts) {
                 modelItem.mesh.position.x = ts.x;
                 modelItem.mesh.position.y = ts.y;
                 modelItem.mesh.position.z = ts.z;

                 modelItem.mesh.item = item;
             } else {
                 var pos = deskGetNewPosition();

                 modelItem.mesh.position.x = pos.x;
                 modelItem.mesh.position.y = pos.y;
                 modelItem.mesh.position.z = pos.z;

                 modelItem.mesh.item = item;
             }

             var h = 0;

             var icons = [];

             if (item.uuid == "new_desk") {
                 icons.push({
                     size: 1,
                     y: h + 0.1,
                     x: 1 + 0.1,
                     z: 1 + 0.1,
                     path: baseImgURL + "/newdesk.png",
                     click: function() {
                         new entity("desk", localDB.curr_office)
                             .new({
                                 name: "new desk (unknown)",
                                 flex: true,
                                 active: true,
                                 capacity: 1
                             })
                             .then(function(d) {
                                 var newItem = d.desk;

                                 localDB.all_desks.table[newItem.uuid] = newItem;

                                 scene.createDefaultDesk(newItem, {
                                     x: scene.items["new_desk"].mesh.position.x * 1.0,
                                     y: scene.items["new_desk"].mesh.position.y * 1.0,
                                     z: scene.items["new_desk"].mesh.position.z * 1.0
                                 });

                                 pos = deskGetNewPosition();
                                 scene.items["new_desk"].mesh.position.x = pos.x;
                                 scene.items["new_desk"].mesh.position.y = pos.y;
                                 scene.items["new_desk"].mesh.position.z = pos.z;
                             });
                     }
                 });
             } else {}

             scene.appendIcons(modelItem.mesh, icons);
         }
     );
 };

 scene.createDefaultWall = function(item, ts) {
     scene.createModel({
             modelType: "wall",
             params: {
                 name: "unknown",
                 points: item.points,
                 trans: item.uuid == "new_wall" ? true : false
             },
             variant: 'default',
             id: item.uuid
         },
         function(modelItem, mesh, variant) {
             modelItem.type = "wall";

             mesh.checkCollisions = 1;

             console.log(modelItem);

             for (var i = 0; i < modelItem.data.params.points.length; i++) {
                 var pts = new BABYLON.Mesh.CreateBox('editBox', 0.15, scene);

                 pts.material = new BABYLONX.ShaderBuilder().Solid({ r: 1, a: 0.25 }).Transparency().Event(2, 'result.xyz = result.xyz*0.5+0.5*vec3(1.0,0.85,0.);').BuildMaterial(scene);
                 pts.position.x = ts.x + modelItem.data.params.points[i].x;
                 pts.position.y = ts.y + 0.05 + modelItem.data.params.points[i].y + 0.15;
                 pts.position.z = ts.z + modelItem.data.params.points[i].z;

                 pts.ts = ts;

                 pts.editBox = true;
                 pts.isPickable = true;
                 pts.model = modelItem;

             }

             if (ts) {
                 modelItem.mesh.position.x = ts.x;
                 modelItem.mesh.position.y = ts.y + 0.05;
                 modelItem.mesh.position.z = ts.z;

                 modelItem.mesh.item = item;
             }
         }
     );
 };


 scene.loadAllItemsAfterGetOffice = function(office) {

     localDB.all_desks = new entity("desk", office).list().then(function(d) {
         localDB.loadProcess++;


         localDB.all_desks.setAsDictionary(
             d.desks,
             "uuid",
             function(uuid, item) {
                 if (location.hash.indexOf('clear') != -1) {
                     new entity("desk", office).id(item.uuid).remove().then(function(d) { console.log('dessk removed', d, item) });
                 } else scene.createDefaultDesk(item);
             },
             function(table) {
                 scene.createDefaultDesk({ uuid: "new_desk" });
             }
         );

         scene.finalizeLoadAllItem();
     });
     localDB.all_floor = new entity("floor", office).list().then(function(d) {
         localDB.loadProcess++;

         localDB.all_floor.setAsDictionary(
             d.floors,
             "uuid",
             function(uuid, item) {
                 first("#floor_items").appendChild(new Option(item.name, uuid));

                 if (!item.building && !item.data.status) {
                     scene.createDefaultBuilding([0], item);
                 } else if (item.building) {
                     /** handle in buildings load side */
                 } else if (item.data.status) {
                     /** draged single floor  */

                     scene.createDefaultBuilding([0], item, {
                         x: def(item.data.position_x, 500),
                         y: def(item.data.position_y, 0),
                         z: def(item.data.position_z, 500)
                     });
                 }

                 item.mapItems = new entity(
                         "mapitem",
                         new entity("floor", office).id(uuid)
                     )
                     .list()
                     .then(function(d2) {
                         localDB.loadProcess += 1 / d.floors.length;
                         scene.finalizeLoadAllItem();
                     });
             },
             function(table) {
                 scene.createDefaultBuilding([0], { uuid: "new_floor" });
             }
         );
     });

     localDB.all_buildings = new entity("building", office)
         .list()
         .then(function(d) {
             localDB.loadProcess++;

             localDB.all_buildings.setAsDictionary(d.buildings, "uuid", function(
                 uuid,
                 item
             ) {
                 if (item.floors.length > 0) {
                     var stages = [0];
                     var floorsItem = [];
                     for (var i = 0; i < item.floors.length - 1; i++) {
                         stages.push(5);
                         floorsItem.push(item.floors[i].uuid);
                     }

                     first("#building_items").appendChild(
                         new Option(item.name, item.uuid)
                     );

                     if (!item.data.status) {
                         var pos = buildingGetNewPosition();

                         scene.createDefaultBuilding(
                             stages, { uuid: item.uuid }, {
                                 x: pos.x,
                                 y: pos.y,
                                 z: pos.z,
                                 floorsItem: floorsItem
                             }
                         );
                     } else {
                         scene.createDefaultBuilding(
                             stages, { uuid: item.uuid }, {
                                 x: item.data.position_x,
                                 y: item.data.position_y,
                                 z: item.data.position_z,
                                 floorsItem: floorsItem
                             }
                         );
                     }
                 }
             });
             scene.finalizeLoadAllItem();
         });
 };

 scene.redrawOffice = function(key) {
     return;


     /** fill all building drap down */

     localDB.curr_office = new entity("office").id(key);
     localDB.curr_office.data = localDB.all_offices.table[key];

     scene.loadAllItemsAfterGetOffice(localDB.curr_office);

     /** load all office map  items */

     /** */
 };


 /*
 var set = {
     modelType: "desk_simple",
     params: {
         name: "unknown",
         exp_seg: 32,
         width: 1.2,
         depth: 0.65,
         corner: 0.05,
         height: 0.74,
         exp_deep: 0.04,
         exp_down_deep: 0.02,
         exp_column_scale: 3.5,
         exp_column_in: 0.05,
         trans: false
     },
     variant: 'default',
     id: 'new_desk'
 };
 */
 setTimeout(() => {
     var pos = buildingGetNewPosition();

     scene.createDefaultBuilding(
         [0, 3], { uuid: "new_floor" }, {
             x: pos.x,
             y: pos.y,
             z: pos.z,
             fun: function(mi) {

                 scene.motions.mainCameraTarget = {
                     x: pos.x,
                     y: pos.y,
                     z: pos.z,
                     r: 60,
                     a: 2.25,
                     b: 0.95,
                     range_r: [20, 80],
                     range_b: [0.95, 1.25],
                     range_a: null,
                     cameraMode: 'walk',
                     mi: mi
                 };

                 scene.motions.mainCameraMove.play();

             }
         }
     );



     var pos1 = buildingGetNewPosition();

     scene.createDefaultBuilding(
         [0, 3, 3, 3, 3, 3], { name: 'Building 1', uuid: "1521654656565656" }, {
             x: pos1.x,
             y: pos1.y,
             z: pos1.z,
             fun: function(mi) {

                 scene.motions.mainCameraTarget = {
                     x: pos1.x,
                     y: 0,
                     z: pos1.z,
                     r: 65,
                     a: 2.05,
                     b: 1.42,
                     range_r: [20, 80],
                     range_b: [0.95, 1.45],
                     range_a: null,
                     cameraMode: 'walk',
                     mi: mi
                 };

                 scene.motions.mainCameraMove.play();

             }
         }
     );


     for (var i = 0; i < 5; i++)
         for (var j = 0; j < 2; j++)
             scene.createDefaultDesk({ uuid: "d64654d6f456d546" + i + j }, {
                 x: pos1.x + 5 + i * 2.,
                 y: pos1.y,
                 z: pos1.z + 5 + j * 2.,
                 fun: function(mi) {}
             });



 }, 500);

 scene.keyApply = function(evt) {
     console.log(evt)

     if (evt.keyCode == 27) {
         if (scene.cameraMode == "walk") {
             setTimeout(function() { scene.changeCameraMode({ cameraMode: 'floor' }); }, 300)
         }
         if (scene.cameraMode == "2d") {
             setTimeout(function() { scene.changeCameraMode({ cameraMode: 'floor' }); }, 300)

         }
         if (scene.cameraMode == "desk") {
             setTimeout(function() { scene.changeCameraMode({ cameraMode: 'floor' }); }, 300)

         }
         if (scene.cameraMode == "floor") {
             setTimeout(function() { scene.changeCameraMode({ cameraMode: 'free' }); }, 300)

         }
     }
 }

 scene.iden = 1000;