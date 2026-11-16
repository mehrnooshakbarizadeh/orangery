

window.initEvent = function (scene,camera,canvas) {

    scene.onPointerDown = function (evnt,prma) {

        scene.isFirstLoadWithData = false;
        if (scene.matTester) scene.matTester.isPickable = false;

        if (isSharedView()) return;


        if (scene)


            if (scene.p3dCamMode == 'lock') {
                return;
            }

        scene.downStatus = { x: scene.pointerX,y: scene.pointerY,t: new Date().getTime(),down: 1 };

        if (evnt.buttons == 2 || scene.viewMode == '3D') {
            scene.Drag = null;

            /** pick door animation is remain here - nasimi */

            return;
        }

        var prm = scene.pick(scene.pointerX,scene.pointerY);


        if (scene.setToMesh) {



            if (prm.pickedMesh) {
                if (prm.pickedMesh.parent.isShape) {
                    if (scene.setToMeshMode == 'mat') {

                        scene.applyMat(scene.setMaterialId,prm.pickedMesh.parent);
                        scene.saveShapeMap(prm.pickedMesh.parent);

                    }
                    if (scene.setToMeshMode == 'setting') {



                        prm.pickedMesh.parent.conf1.dw = scene.setModelSetting.dw;
                        prm.pickedMesh.parent.conf1.st = scene.setModelSetting.st;
                        prm.pickedMesh.parent.conf1.d = scene.setModelSetting.d;

                        canvas_scene.reCreateShape(prm.pickedMesh.parent,{},function (d) {
                            d.cm1.floorSubItem = true;
                            scene.saveShapeMap(prm.pickedMesh.parent);
                        });

                    }
                }
            };

            return;
        }

        var islockedShapes = first('.flr_' + canvas_scene.selectedFloor + ' .lockStatus').className.indexOf('ccheck') != -1; //!scene.floors[scene.selectedFloor].unLock;

        if (prm.pickedMesh && (prm.pickedMesh.parent && !prm.pickedMesh.parent.isDesk && !prm.pickedMesh.isUser) && localDB.officeRef && localDB.officeRef.data && localDB.officeRef.data.is_customer) {
            scene.downStatus = null;

            return;
        }

        if (prm.hit && scene.downStatus.down &&
            ((prm.pickedMesh.parent.isDesk && !prm.pickedMesh.isUser) || prm.pickedMesh.parent.isAsset || prm.pickedMesh.isRoomSub || (prm.pickedMesh.floorSubItem && !islockedShapes) || prm.pickedMesh.isEditPoint || (prm.pickedMesh.parent && prm.pickedMesh.parent.isGLB) ||
                /*prm.pickedMesh.isUser || */ prm.pickedMesh.isDragable)) {

            scene.Drag = prm.pickedMesh;
            scene.Drag.startPickedPoint = prm.pickedPoint;

            scene.Drag.oldStatus = prm.pickedMesh.position.clone();
            scene.Drag.oldStatus.r = prm.pickedMesh.rotation.y;

            if (prm.pickedMesh.isDragable) {
                console.log(2233);

                scene.Drag.mpos = { x: 0,y: 0,z: 0 };

            }

            prm.pickedMesh.isPickable = false;
            if (prm.pickedMesh.parent) prm.pickedMesh.parent.isPickable = false;


            if (prm.pickedMesh.parent.isShape && prm.pickedMesh.isEditPoint) {
                prm.pickedMesh.parent.isPickable = true;
                prm.pickedMesh.parent.floor.isPickable = true;

                if (prm.pickedMesh.parent.editleft) {
                    prm.pickedMesh.parent.editleft.isPickable = false;
                    prm.pickedMesh.parent.editright.isPickable = false;
                }

                if (prm.pickedMesh.parent.floatPoint1)
                    prm.pickedMesh.parent.floatPoint1.isPickable = false;
                if (prm.pickedMesh.parent.floatPoint2)
                    prm.pickedMesh.parent.floatPoint2.isPickable = false;
                if (prm.pickedMesh.parent.floatPoint3)
                    prm.pickedMesh.parent.floatPoint3.isPickable = false;

                if (prm.pickedMesh.parent.floatPoints) {

                    for (var i in prm.pickedMesh.parent.floatPoints)
                        prm.pickedMesh.parent.floatPoints[i].isPickable = false;
                }

                prm.pickedMesh.parent.pos = {
                    x: prm.pickedMesh.parent.absolutePosition.x - prm.pickedPoint.x,
                    z: prm.pickedMesh.parent.absolutePosition.z - prm.pickedPoint.z

                };

                prm.pickedMesh.parent.posx = {
                    x: prm.pickedMesh.parent.position.x,
                    z: prm.pickedMesh.parent.position.z

                };


            } else if (prm.pickedMesh.isEditPoint) {
                prm.pickedMesh.parent.isPickable = true;
                prm.pickedMesh.parent.floor.isPickable = true;

                prm.pickedMesh.parent.border.isPickable = true;
                prm.pickedMesh.parent.editleft.isPickable = false;
                prm.pickedMesh.parent.editright.isPickable = false;

                prm.pickedMesh.parent.pos = {
                    x: prm.pickedMesh.parent.absolutePosition.x - prm.pickedPoint.x,
                    z: prm.pickedMesh.parent.absolutePosition.z - prm.pickedPoint.z

                };

                prm.pickedMesh.parent.posx = {
                    x: prm.pickedMesh.parent.position.x,
                    z: prm.pickedMesh.parent.position.z
                };



            } else if (prm.pickedMesh.isRoomSub) {
                prm.pickedMesh.parent.isPickable = false;
                prm.pickedMesh.parent.floor.isPickable = false;
                prm.pickedMesh.parent.border.isPickable = false;

                prm.pickedMesh.parent.pos = {
                    x: prm.pickedMesh.parent.absolutePosition.x - prm.pickedPoint.x,
                    z: prm.pickedMesh.parent.absolutePosition.z - prm.pickedPoint.z

                };
            }
            else if (prm.pickedMesh.floorSubItem) {

                prm.pickedMesh.parent.isPickable = false;
                prm.pickedMesh.isPickable = false;
                prm.pickedMesh.parent.liveShape = prm.pickedMesh;


                prm.pickedMesh.parent.pos = {
                    x: prm.pickedMesh.parent.absolutePosition.x - prm.pickedPoint.x,
                    z: prm.pickedMesh.parent.absolutePosition.z - prm.pickedPoint.z
                };

            }

        }
    };

    scene.lastDetectedTarget;

    scene.pickedMesh = null;

    scene.onPointerUp = function (evnt,prma) {

        sysLogHide();

        if (isSharedView()) return;


        scene.prepareMode = 0;

        if (scene.Drag && scene.Drag.parent.isDesk && scene.Drag.parent.map) {


            if (scene.lastDetectedTarget && scene.lastDetectedTarget.parent && scene.lastDetectedTarget.parent.isShape && scene.Drag.parent.map.data && scene.Drag.parent.map.data.parent) {


                var oldParentId = scene.Drag.parent.map.data.parent;


                var absPos = {
                    x: scene.Drag.parent.absolutePosition.x,
                    y: 0.,
                    z: scene.Drag.parent.absolutePosition.z
                };

                scene.Drag.parent.parent = scene.lastDetectedTarget.parent;

                if (scene.Drag.parent.map.data.parent == null)
                    scene.Drag.parent.map.data.parent = scene.lastDetectedTarget.parent.map.uuid;

                var parPos = { x: absPos.x - scene.lastDetectedTarget.parent.position.x,y: 0.,z: absPos.z - scene.lastDetectedTarget.parent.position.z };
                parPos = r_y(parPos,1.0 * scene.lastDetectedTarget.parent.rotation.y);

                scene.Drag.parent.position.x = parPos.x;
                scene.Drag.parent.position.z = parPos.z;

                scene.Drag.parent.map.data = scene.mapItemData(scene.Drag.parent);
                scene.Drag.parent.map.data.parent = scene.lastDetectedTarget.parent.map.uuid;

                var newmap = scene.lastDetectedTarget.parent.map;
                var deskId = scene.Drag.parent.map.reference_uuid;

                sysLog('item\'s info changed','info',0);

                new entity('mapitem',localDB.officeRef).id(scene.Drag.parent.map.uuid).set(scene.Drag.parent.map).then(function (d) {

                    console.log(20,oldParentId,newmap.uuid);

                    if (newmap.uuid &&
                        newmap.uuid != '' &&
                        scene.mapsId[newmap.uuid].data &&
                        scene.mapsId[newmap.uuid].data.genRoom &&
                        scene.mapsId[newmap.uuid].data.genRoom != '') {

                        /** add to new room */

                        new entity('room',localDB.officeRef).get(scene.mapsId[newmap.uuid].data.genRoom)
                            .then(function (dt) {

                                var deskList = [];

                                for (var i in dt.desks) {
                                    if (dt.desks[i].uuid != deskId)
                                        deskList.push(dt.desks[i].uuid);
                                }

                                deskList.push(deskId);

                                new entity('room',localDB.officeRef).id(dt.uuid).set({ desks: deskList })
                                    .then(function (dt) {
                                        sysLog(' parent room updated','info',100);
                                        console.log(23);
                                    });
                            });

                    }
                    else if (newmap.uuid &&
                        newmap.uuid != '' &&
                        scene.mapsId[newmap.uuid].data &&
                        scene.mapsId[newmap.uuid].data.genRoom &&
                        scene.mapsId[newmap.uuid].data.genRoom != '') {

                        //** shape or area */

                    }

                    if (oldParentId != newmap.uuid &&
                        oldParentId != '' &&
                        scene.mapsId[oldParentId] &&
                        scene.mapsId[oldParentId].data.genRoom &&
                        scene.mapsId[oldParentId].data.genRoom != '') {

                        /** remove from old room */

                        new entity('room',localDB.officeRef).get(scene.mapsId[oldParentId].data.genRoom)
                            .then(function (dt) {

                                var deskList = [];

                                for (var i in dt.desks) {
                                    if (dt.desks[i].uuid != deskId)
                                        deskList.push(dt.desks[i].uuid);
                                }

                                new entity('room',localDB.officeRef).id(dt.uuid).set({ desks: deskList })
                                    .then(function (dt) {
                                        sysLog(' old parent room updated','info',100);
                                        console.log(24);
                                    });
                            });

                    }




                    sysLog('item\'s info saved','info',100);
                });


                var old;



            } else {

                scene.Drag.parent.map.data = scene.mapItemData(scene.Drag.parent);
                scene.Drag.parent.map.data.parent = scene.floors[scene.selectedFloor].mesh.id;
                var deskId = scene.Drag.parent.map.reference_uuid;

                new entity('desk',localDB.officeRef).param({ mesh: scene.Drag.parent }).id(deskId)
                    .get(/*{ floor_uuid: scene.floors[scene.selectedFloor].mesh.id }*/).then(function (d,th) {
                        console.log(th);
                        if (th.params.mesh.map)
                            new entity('mapitem',localDB.officeRef).id(th.params.mesh.map.uuid).set(th.params.mesh.map).then(function (d) {
                                sysLog('item\'s info saved','info',100);
                                console.log(25);
                            });
                        else {
                            /** not find applyed map */
                            sysLog('warrning','error',100);
                        }
                    });

            }

        }
        else if (scene.Drag && scene.Drag.parent.isAsset && scene.Drag.parent.map) {


            scene.Drag.parent.map.data = scene.mapItemData(scene.Drag.parent);
            scene.Drag.parent.map.data.parent = scene.floors[scene.selectedFloor].mesh.id;


            console.log(scene.Drag.parent.map);



            if (scene.Drag.parent.map && scene.Drag.parent.map.uuid)
                new entity('mapitem',localDB.officeRef).id(scene.Drag.parent.map.uuid).set(scene.Drag.parent.map).then(function (d) {
                    sysLog('item\'s info saved','info',100);
                    console.log(25);
                });




        }
        else if (scene.Drag && (scene.Drag.parent.isRoom || scene.Drag.parent.isShape)) {

            var arrs = [];
            if (scene.Drag.parent.isRoom)
                arrs = [scene.Drag.parent.floor,scene.Drag.parent.border,scene.Drag.parent.wall];
            else {
                arrs = [scene.Drag.parent.floor];
            }

            canvas_scene.nextMapItem();

            scene.updateShapePos(scene.Drag.parent,arrs
                ,function (ms) {

                    if (ms.map && ms.map.type == "shape") {

                        scene.saveShapeMap(ms);

                    }
                    else if (ms.map) {

                        first('#avl-room-pop').classList.remove('hdn-i');

                        new entity('mapitem',localDB.officeRef).id(ms.map.uuid).get().then(function (d) {

                            ms.map = d.map_item;

                            ms.map.data = scene.mapItemData(ms,2);
                            ms.map.data.parent = ms.parent.id;

                            sysLog('item\'s info changed','info',0);

                            new entity('mapitem',localDB.officeRef).id(ms.map.uuid).set(ms.map).then(function (d) {
                                sysLog('item\'s info saved','info',100);
                            });
                        });
                    }
                });

        }

        else if (scene.Drag && scene.Drag.isUser && 1 == 0 /** diable use assign */) {


            var oldPar = scene.Drag.parent;


            if (scene.lastDetectedTarget.isDesk && scene.lastDetectedTarget.availible) {

                scene.lastDetectedTarget.userCount = 0;

                for (var i in scene.lastDetectedTarget._children) {
                    if (scene.lastDetectedTarget._children[i].isUser)
                        scene.lastDetectedTarget.userCount++;
                }

                if (scene.lastDetectedTarget.capacity != 0 && scene.lastDetectedTarget.capacity > scene.lastDetectedTarget.userCount) {



                    scene.Drag.parent = scene.lastDetectedTarget;

                    scene.Drag.position.x = 0;
                    scene.Drag.position.z = 0;

                    oldPar.userCount = 0;

                    for (var i in oldPar._children) {
                        if (oldPar._children[i].isUser)
                            oldPar.userCount++;
                    }



                    var ntt = new entity('desk',localDB.officeRef);
                    ntt.param = { id: scene.Drag.userId };
                    ntt.id(oldPar.id).get().then(function (deskd) {

                        var usrs = [];

                        for (var jk in deskd.desk.assigned_users) {
                            if (deskd.desk.assigned_users[jk].uuid != ntt.param.userId) {
                                usrs.push(deskd.desk.assigned_users[jk]);
                            }
                        }

                        deskd.desk.assigned_users = usrs;

                        new entity('desk',localDB.officeRef).id(deskd.desk.uuid).set(deskd.desk).then(function () {
                            console.log('user remove from old item ');
                        });

                    });

                    new entity('desk',localDB.officeRef).id(scene.lastDetectedTarget.id).set({
                        assigned_user_uuids: [scene.Drag.userId]
                    }).then(function (d) {

                    });

                    scene.Drag.parent.userCount = 0;

                    for (var i in scene.Drag.parent._children) {
                        if (scene.Drag.parent._children[i].isUser)
                            scene.Drag.parent.userCount++;
                    }

                    sysLog('change User Assignment</br>desk status : ' + scene.Drag.parent.userCount + ' of ' + max(scene.Drag.parent.capacity,1) + ' filled.','info',100);



                } else {

                    scene.Drag.parent = oldPar;

                    console.log(scene.Drag.position);

                    scene.Drag.position.x = scene.Drag.oldStatus.x;

                    scene.Drag.position.z = scene.Drag.oldStatus.z;

                    /* scene.Drag.rotation.y =  scene.Drag.oldStatus.r;*/

                    scene.Drag = null;

                    for (var msi in scene.meshes) {
                        msi = scene.meshes[msi];
                        if (msi.material && msi.material.flagDown) {
                            msi.material.flagDown(10);

                        }
                    }


                    sysLog('desk is capacity is full.','stop',100);



                }
            }

            if (scene.Drag && scene.Drag.map) {

                scene.Drag.map.data = scene.mapItemData(scene.Drag);
                scene.Drag.map.data.parent = scene.Drag.parent.id;



                sysLog('item\'s info changed','info',0);

                if (scene.Drag)


                    new entity('mapitem',localDB.officeRef).id(scene.Drag.map.uuid).set(scene.Drag.map).then(function (d) {
                        sysLog('item\'s info saved','info',100);
                    });
            }

        }



        var ups = { x: scene.pointerX,y: scene.pointerY,t: new Date().getTime() };

        if (evnt.button == 0) {


            if (scene.downStatus && abs(scene.downStatus.x - ups.x) < 3. && abs(scene.downStatus.y - ups.y) < 3 && ups.t - scene.downStatus.t < 250) {

                if (scene.viewMode == '3D') {

                    console.log(56,prma);

                    if (prma.hit && prma.pickedMesh && prma.pickedMesh.parent && prma.pickedMesh.material && prma.pickedMesh.material.flagUp) {

                        if (!prma.pickedMesh.animationPlay) {
                            prma.pickedMesh.animationPlay = 1;
                            scene.callAnimation(prma.pickedMesh,[6],[7],1,0);
                        } else {
                            prma.pickedMesh.animationPlay = 0;
                            scene.callAnimation(prma.pickedMesh,[7],[6],1,0);
                        }
                    }

                }

                scene.selectedMesh = null;
                for (var msi in scene.meshes) {
                    msi = scene.meshes[msi];
                    if (msi.material && msi.material.flagDown) {
                        msi.material.flagDown(11);
                    }
                }


                if (scene.mainGround && scene.viewMode == '2D' && scene.pickModeRef.className.indexOf('hdn-i') == -1) {

                    scene.pickPointModeClick(evnt,prma);

                }


                if (scene.mainGround && scene.viewMode == '2D' && scene.pickModeRef.className.indexOf('hdn-i') == -1) {

                    scene.pickPointModeClick(evnt,prma);

                }


                scene.linkToDom({
                    query: '#shape-pop',
                    pos: { x: -10000.,y: -10000. },
                    align: 'center center',css3d: ['iu'],
                    css2d: ['iu']
                });

                scene.linkToDom({
                    query: '#shapewall-pop',
                    pos: { x: -10000.,y: -10000. },
                    align: 'center center',css3d: ['iu'],
                    css2d: ['iu']
                });

                scene.linkToDom({
                    query: '#shaperoom-pop',
                    pos: { x: -10000.,y: -10000. },
                    align: 'center center',css3d: ['iu'],
                    css2d: ['iu']
                });



                scene.linkToDom({
                    query: '#avl-room-pop',
                    pos: { x: -10000.,y: -10000. },
                    align: 'center center',css3d: ['iu'],
                    css2d: ['iu']
                });

                scene.linkToDom({
                    query: '#dep-room-pop',
                    pos: { x: -10000.,y: -10000. },
                    align: 'center center',css3d: ['iu'],
                    css2d: ['iu']
                });

                scene.linkToDom({
                    query: '#avl-desk-pop',
                    pos: { x: -10000.,y: -10000. },
                    align: 'center center',css3d: ['iu'],
                    css2d: ['iu']
                });

                scene.linkToDom({
                    query: '#avl-asset-pop',
                    pos: { x: -10000.,y: -10000. },
                    align: 'center center',css3d: ['iu'],
                    css2d: ['iu']
                });

                for (var ms in scene.meshes) {

                    ms = scene.meshes[ms];

                    if ((ms.isRoom || ms.isShape) && (ms.editright || ms.editleft)) {
                        ms.editright.position.y = -60000;
                        ms.editleft.position.y = -60000;
                        ms.editright1.position.y = -60000;
                        ms.editleft1.position.y = -60000;

                    }

                    if ((ms.isRoom || ms.isShape) && (ms.floatPoint1)) {
                        ms.floatPoint1.position.y = -60000;
                    }

                    if ((ms.isRoom || ms.isShape) && (ms.floatPoint2)) {
                        ms.floatPoint2.position.y = -60000;
                    }
                    if ((ms.isRoom || ms.isShape) && (ms.floatPoint3)) {
                        ms.floatPoint3.position.y = -60000;
                    }

                    if (ms.floatPoints) {

                        for (var i in ms.floatPoints)
                            ms.floatPoints[i].position.y = -60000;
                    }


                }


                if (scene.Drag) scene.Drag.isPickable = true;

                var prm = scene.pick(scene.pointerX,scene.pointerY);

                if (prm.hit) {

                    scene.pickedMesh = prm.pickedMesh;

                    if (prm.pickedMesh.parent && prm.pickedMesh.parent.name == 'desk' && prm.pickedMesh.parent.isDesk) {

                        scene.selectedMesh = prm.pickedMesh.parent;

                        if (scene.selectedMesh && !scene.selectedMesh.map) scene.nextMapItem();

                        scene.linkToDom({
                            query: '#avl-desk-pop',
                            pos: {
                                x: prm.pickedMesh.parent.absolutePosition.z - 4.5,
                                y: prm.pickedMesh.parent.absolutePosition.x
                            },
                            align: 'center center',
                            css3d: ['iu'],
                            css2d: ['iu']
                        });

                    }
                    else if (prm.pickedMesh.parent && prm.pickedMesh.parent.name == 'asset' && prm.pickedMesh.parent.isAsset) {

                        scene.selectedMesh = prm.pickedMesh.parent;

                        if (scene.selectedMesh && !scene.selectedMesh.map) scene.nextMapItem();

                        scene.linkToDom({
                            query: '#avl-asset-pop',
                            pos: {
                                x: prm.pickedMesh.parent.absolutePosition.z - 4.5,
                                y: prm.pickedMesh.parent.absolutePosition.x
                            },
                            align: 'center center',
                            css3d: ['iu'],
                            css2d: ['iu']
                        });

                    }
                    else if (prm.pickedMesh && prm.pickedMesh.parent.isShape) {

                        console.log(1344,scene.wallSelected,scene.lastWallSelected);
                        if (scene.wallSelected && (!scene.lastWallSelected || scene.lastWallSelected.map.uuid != scene.wallSelected.map.uuid)) {
                            console.log(3344);
                            scene.lastWallSelected = scene.wallSelected;
                        }

                        scene.selectedMesh = prm.pickedMesh.parent;


                        if (scene.selectedMesh.editright || scene.selectedMesh.editleft) {
                            scene.selectedMesh.editright.position.y = 0.48;
                            scene.selectedMesh.editleft.position.y = 0.48;
                            scene.selectedMesh.editleft1.position.y = 0.48;
                            scene.selectedMesh.editright1.position.y = 0.48;
                        }

                        if (scene.selectedMesh.floatPoint1) {
                            scene.selectedMesh.floatPoint1.position.y = 0.48;
                        }

                        if (scene.selectedMesh.floatPoint2) {
                            scene.selectedMesh.floatPoint2.position.y = 0.48;
                        }
                        if (scene.selectedMesh.floatPoint3) {
                            scene.selectedMesh.floatPoint3.position.y = 0.48;
                        }

                        if (prm.pickedMesh.parent.floatPoints) {

                            for (var i in prm.pickedMesh.parent.floatPoints)
                                prm.pickedMesh.parent.floatPoints[i].position.y = 0.48;
                        }



                        if (scene.selectedMesh.isWallShape) {
                            /* scene.selectedMesh.floatPoint1.position.y = -60000.48; */
                            scene.selectedMesh.floatPoint3.position.y = -60000.48;

                            scene.linkToDom({
                                query: '#shapewall-pop',
                                pos: {
                                    x: prm.pickedMesh.parent.absolutePosition.z,
                                    y: prm.pickedMesh.parent.absolutePosition.x
                                },
                                align: 'center center',
                                css3d: ['iu'],
                                css2d: ['iu']
                            });
                        }
                        else if (scene.selectedMesh.conf1.room) {

                            scene.linkToDom({
                                query: '#shaperoom-pop',
                                pos: {
                                    x: prm.pickedMesh.parent.absolutePosition.z,
                                    y: prm.pickedMesh.parent.absolutePosition.x
                                },
                                align: 'center center',
                                css3d: ['iu'],
                                css2d: ['iu']
                            });
                        } else {



                            scene.linkToDom({
                                query: '#shape-pop',
                                pos: {
                                    x: prm.pickedMesh.parent.absolutePosition.z,
                                    y: prm.pickedMesh.parent.absolutePosition.x
                                },
                                align: 'center center',
                                css3d: ['iu'],
                                css2d: ['iu']
                            });
                        }
                    }
                }

            }
        }
        else if (evnt.button == 2) {
            //   

            if (scene.downStatus && abs(scene.downStatus.x - ups.x) < 3. && abs(scene.downStatus.y - ups.y) < 3 && ups.t - scene.downStatus.t < 250) {

                if (scene.viewMode == '2D') {

                    scene.rightPicekdMesh = null;

                    if (prma.hit) {

                        if (prma.pickedMesh.parent && prma.pickedMesh.parent.map) {
                            scene.rightPicekdMesh = prma.pickedMesh.parent;
                        } else if (prma.pickedMesh && prma.pickedMesh.map) {
                            scene.rightPicekdMesh = prma.pickedMesh;
                        }

                        scene.rightPicekdMesh.floor.material.flagUp(9);


                        first('.rightContent').classList.remove('hdn-i');

                        if (scene.rightPicekdMesh && scene.rightPicekdMesh.conf1
                            && scene.rightPicekdMesh.conf1.type == 'parkingSpot') {

                            first('.rightContent .cntList').innerHTML = '';
                            first('.rightContent').style.left = evnt.pageX + 'px';
                            first('.rightContent').style.top = evnt.pageY + 'px';
                            first('.rightContent').classList.remove('hdn-i');

                            new entity('parking-spot',localDB.officeRef).list((d) => {

                                for (var i in d.parking_spots) {

                                    i = d.parking_spots[i];
                                    var div = document.createElement('div');
                                    div.className = 'p-0005 rad-03 c-hwgray';
                                    div.innerHTML = i.name;
                                    div.identity = i.uuid;
                                    div.onclick = function () {

                                        scene.rightPicekdMesh.floor.material.flagDown(13); // hold select
                                        scene.rightPicekdMesh.map.reference_uuid = this.identity;

                                        new entity('mapitem',localDB.officeRef).id(scene.rightPicekdMesh.map.uuid)
                                            .set(scene.rightPicekdMesh.map).then(function (d) {

                                                sysLog('parkingSpot Linked','info',100);
                                                setTimeout(() => {
                                                    sysLogHide();
                                                },1300);

                                                scene.reCreateAsset(scene.rightPicekdMesh,{});


                                            });

                                        scene.reCreateAsset(scene.rightPicekdMesh,{});

                                        first('.rightContent').classList.add('hdn-i');

                                    };
                                    first('.rightContent .cntList').appendChild(div);
                                }

                            });

                        }
                    }

                }
                console.log('roty',prma);
                if (prma.hit && prma.pickedMesh.isDragable) {

                    prma.pickedMesh.rotation.y += 15 * deg;

                    if (prma.pickedMesh.parent.map) {

                        prma.pickedMesh.parent.map.data = def(prma.pickedMesh.parent.map.data,{});
                        prma.pickedMesh.parent.map.data.pos2 = def(prma.pickedMesh.parent.map.data.pos2,{});

                        prma.pickedMesh.parent.map.data.pos2.r = prma.pickedMesh.rotation.y;

                        new entity('mapitem',localDB.officeRef).id(prma.pickedMesh.parent.map.uuid).set(prma.pickedMesh.parent.map).then(function () {
                            sysLog('save text rotation','info',100);
                        });

                    }

                }
            }
        }

        if (scene.Drag && scene.Drag.isDragable) {

            console.log('1333',scene.Drag.mspos);

            scene.Drag.mspos = def(scene.Drag.mspos,{ x: 0,r: 0,z: 0 });
            scene.Drag.mspos.x += scene.Drag.mpos.x;
            scene.Drag.mspos.z += scene.Drag.mpos.z;
            scene.Drag.mpos = { x: 0,r: 0,z: 0 };

            if (scene.Drag.parent.map) {

                scene.Drag.parent.map.data = def(scene.Drag.parent.map.data,{});
                scene.Drag.parent.map.data.pos2 = def(scene.Drag.parent.map.data.pos2,{});

                scene.Drag.parent.map.data.pos2.x = scene.Drag.mspos.x;
                scene.Drag.parent.map.data.pos2.z = scene.Drag.mspos.z;

                new entity('mapitem',localDB.officeRef).id(scene.Drag.parent.map.uuid).set(scene.Drag.parent.map).then(function () {
                    sysLog('save text position','info',100);
                });

            }




        }

        scene.downStatus = { x: 0,y: 0,t: 0.,down: 0 };

        scene.Drag = null;

        for (var msi in scene.meshes) {
            msi = scene.meshes[msi];
            if (msi.material && msi.material.flagDown) {
                msi.material.flagDown(10);
            }
        }

        if (scene.Drag && !scene.Drag.isPickable)
            scene.Drag.isPickable = true;


        for (var im in scene.meshes) {
            im = scene.meshes[im];

            im.isPickable = true;

            if (im.ignorePick)
                im.isPickable = false;
        }

    };
    scene.Drag = null;
    scene.prepareMode = 1;

    scene.onPointerMove = function (event,prma) {



        var prm = scene.pick(scene.pointerX,scene.pointerY);

        canvas.style.cursor = 'default';

        if (prm.hit) {

            if (scene.Drag) {


                var prmp = prm.pickedPoint;

                scene.lastDetectedTarget = prm.pickedMesh;

                if (scene.Drag.parent.isDesk && !scene.Drag.isUser) {



                    var ix = prmp.x - scene.Drag.parent.parent.absolutePosition.x;
                    /* scene.Drag.position.y = prmp.y - scene.Drag.parent.absolutePosition.y; */
                    var iz = prmp.z - scene.Drag.parent.parent.absolutePosition.z;

                    var p = r_y({ x: ix,y: 0,z: iz },1. * scene.Drag.parent.parent.rotation.y,{ x: 0,y: 0,z: 0 });
                    scene.Drag.parent.position.x = p.x;
                    scene.Drag.parent.position.z = p.z;



                    scene.linkToDom({
                        query: '#avl-desk-pop',
                        pos: { x: -10000.,y: -10000. },
                        align: 'center center',css3d: ['iu'],
                        css2d: ['iu']
                    });



                }


                if (scene.Drag.parent.isAsset) {



                    var ix = prmp.x - scene.Drag.parent.parent.absolutePosition.x;
                    /* scene.Drag.position.y = prmp.y - scene.Drag.parent.absolutePosition.y; */
                    var iz = prmp.z - scene.Drag.parent.parent.absolutePosition.z;

                    var p = r_y({ x: ix,y: 0,z: iz },1. * scene.Drag.parent.parent.rotation.y,{ x: 0,y: 0,z: 0 });
                    scene.Drag.parent.position.x = p.x;
                    scene.Drag.parent.position.z = p.z;



                    scene.linkToDom({
                        query: '#avl-asset-pop',
                        pos: { x: -10000.,y: -10000. },
                        align: 'center center',css3d: ['iu'],
                        css2d: ['iu']
                    });



                }


                if (scene.Drag.isRoomSub) {

                    scene.Drag.parent.position.x = prmp.x + scene.Drag.parent.pos.x;
                    /* scene.Drag.position.y = prmp.y - scene.Drag.parent.absolutePosition.y; */
                    scene.Drag.parent.position.z = prmp.z + scene.Drag.parent.pos.z;

                }

                if (scene.Drag.floorSubItem) {

                    scene.Drag.parent.position.x = prmp.x + scene.Drag.parent.pos.x;
                    /* scene.Drag.position.y = prmp.y - scene.Drag.parent.absolutePosition.y; */
                    scene.Drag.parent.position.z = prmp.z + scene.Drag.parent.pos.z;

                    /*
                      for(var i in scene.shapes){
                         var i1 = scene.shapes[i];
                          i1.cm1.material.flagDown(2); 
                         
                     }*/


                }


                if (scene.Drag.isEditPoint) {

                    prm.pickedMesh.parent.pos = {
                        x: prm.pickedMesh.parent.absolutePosition.x - prm.pickedPoint.x,
                        z: prm.pickedMesh.parent.absolutePosition.z - prm.pickedPoint.z
                    };

                    var ix = prmp.x - scene.Drag.parent.absolutePosition.x;

                    /* scene.Drag.position.y = prmp.y - scene.Drag.parent.absolutePosition.y; */

                    var iz = prmp.z - scene.Drag.parent.absolutePosition.z;


                    var p = r_y({ x: ix,y: 0,z: iz },1. * scene.Drag.parent.rotation.y,{ x: 0,y: 0,z: 0 });


                    if (scene.Drag.parent.isRoom) {

                        if (scene.Drag.isLeft) {
                            scene.Drag.position.x = p.x;

                            scene.reCreateRoom(scene.Drag.parent,{ w: p.x });
                        }

                        else if (scene.Drag.isRight) {

                            scene.Drag.position.z = p.z;
                            scene.reCreateRoom(scene.Drag.parent,{ d: p.z });
                        }

                        else if (scene.Drag.isLeft1) {
                            scene.Drag.position.x = p.x;
                            scene.reCreateRoom(scene.Drag.parent,{ w1: p.x });
                        }

                        else if (scene.Drag.isRight1) {
                            scene.Drag.position.z = p.z;
                            scene.reCreateRoom(scene.Drag.parent,{ d1: p.z });
                        }
                    } else {
                        if (scene.Drag.parent.isShape) {

                            if (scene.Drag.isLeft) {
                                scene.Drag.position.x = p.x;

                                scene.reCreateShape(scene.Drag.parent,{ w: p.x },function (d) {
                                    d.cm1.floorSubItem = true;
                                });
                            }

                            else if (scene.Drag.isRight) {

                                scene.Drag.position.z = p.z;
                                scene.reCreateShape(scene.Drag.parent,{ d: p.z },function (d) {
                                    d.cm1.floorSubItem = true;
                                });
                            }

                            else if (scene.Drag.isLeft1) {
                                scene.Drag.position.x = p.x;
                                scene.reCreateShape(scene.Drag.parent,{ w1: p.x },function (d) {
                                    d.cm1.floorSubItem = true;
                                });
                            }

                            else if (scene.Drag.isRight1) {
                                scene.Drag.position.z = p.z;
                                scene.reCreateShape(scene.Drag.parent,{ d1: p.z },function (d) {
                                    d.cm1.floorSubItem = true;
                                });
                            } else {
                                scene.Drag.position.x = p.x;
                                scene.Drag.position.z = p.z;

                                if (scene.Drag.parent.floatPoints) scene.reCreateShape(scene.Drag.parent,{},function (d) {
                                    d.cm1.floorSubItem = true;
                                });

                                if (scene.Drag.isFloat1) scene.reCreateShape(scene.Drag.parent,{ p0: [p.x,p.z],prt: 1 },function (d) {
                                    d.cm1.floorSubItem = true;
                                });


                                if (scene.Drag.isFloat2) scene.reCreateShape(scene.Drag.parent,{ p1: [p.x,p.z] },function (d) {
                                    d.cm1.floorSubItem = true;
                                });
                                if (scene.Drag.isFloat3) scene.reCreateShape(scene.Drag.parent,{ p2: [p.x,p.z] },function (d) {
                                    d.cm1.floorSubItem = true;
                                });


                            }
                        }
                    }

                }


                if (scene.Drag.parent.isGLB) {

                    scene.Drag.parent.position.x = prmp.x;
                    /* scene.Drag.position.y = prmp.y - scene.Drag.parent.absolutePosition.y; */
                    scene.Drag.parent.position.z = prmp.z;

                }

                if (scene.Drag.isUser && scene.Drag.parent && 1 == 0 /** disable user detection */) {

                    var ix = prmp.x - scene.Drag.parent.absolutePosition.x;
                    /* scene.Drag.position.y = prmp.y - scene.Drag.parent.absolutePosition.y; */
                    var iz = prmp.z - scene.Drag.parent.absolutePosition.z;


                    var p = r_y({ x: ix,y: 0,z: iz },1. * scene.Drag.parent.rotation.y,{ x: 0,y: 0,z: 0 });
                    scene.Drag.position.x = p.x;
                    scene.Drag.position.z = p.z;

                }

                if (scene.Drag.isDragable && scene.Drag.parent) {



                    var ix = - (scene.Drag.startPickedPoint.x - prmp.x);
                    /* scene.Drag.position.y = prmp.y - scene.Drag.parent.absolutePosition.y; */
                    var iz = - (scene.Drag.startPickedPoint.z - prmp.z);


                    var p = r_y({ x: ix,y: 0,z: iz },1. * scene.Drag.parent.rotation.y,{ x: 0,y: 0,z: 0 });

                    console.log(floor(p.x),floor(p.z),floor(scene.Drag.mspos.x),floor(scene.Drag.mspos.z));

                    scene.Drag.mpos.x = p.x;
                    scene.Drag.mpos.z = p.z;

                }

            }


            if (dim(prm.pickedPoint,camera.position) < 400) {

                scene.hoverd = prm.pickedMesh.parent;
                try {
                    if (prm.pickedMesh && prm.pickedMesh.parent.isRoom) {
                        /** hover floor */
                        scene.hoverd.border.material.flagUp(2);
                        canvas.style.cursor = 'pointer';
                    }
                } catch (e) { }

            } else
                scene.hoverd = null;

        } else
            scene.hoverd = null;

    };

};