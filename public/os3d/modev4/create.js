
window.initCreation = function (scene) {

    scene.desks = [];

    scene.newDeskCount = 1;
    scene.newAssetCount = 1;

    scene.createDeskModel = function (cm1,confdesk) {
        var keyDesk = 'desk' + JSON.stringify(confdesk);
        var parent,id;

        if (!cm1) {
            cm1 = new BABYLON.Mesh(scene);
        }
        if (cm1 && cm1.parent) {
            parent = cm1.parent;
            id = cm1.id;
        }

        if (cm1 && cm1.floor) {
            cm1.floor.dispose();
        }

        if (!scene.cacheMesh[keyDesk]) {

            scene.cacheMesh[keyDesk] = canvas_scene.modelCommand.createGeo('desk_simple',confdesk).toMesh(canvas_scene);
            scene.cacheMesh[keyDesk].position.y = -60000;
        }

        if (scene.cacheMesh[keyDesk]) {

            cm1.floor = scene.cacheMesh[keyDesk].clone();
            cm1.floor.parent = cm1;
            cm1.floor.position.y = 0;


            cm1.isDesk = 1;
            cm1.name = 'desk';
            cm1.id = id;
            cm1.parent = parent;

            cm1.floor.material = scene.deskMat({ r: 0,g: 0,b: 0 });

        }
        cm1.conf1 = confdesk;

        return cm1;

    };

    scene.reCreateDesk = function (mesh,type) {



        if (mesh.map && mesh.map.data) {
            mesh.map.data.conf1 = def(mesh.map.data.conf1,{});

            mesh.map.data.conf1 = mix(mesh.conf1,type,1);
            mesh.conf1 = mesh.map.data.conf1;

            if (mesh.map.data.parent == "" && mesh.parent) {
                mesh.map.data.parent = mesh.parent.id;

            }

            new entity('mapitem',localDB.officeRef).id(mesh.map.uuid).set(mesh.map).then(function (d) {



                sysLog('desk type saved','info',100);
                setTimeout(() => {
                    sysLogHide();
                },1300);
            });

            mesh = scene.createDeskModel(mesh,mesh.map.data.conf1);
        }
    };

    scene.createDesk = function (deskRef,ref,parent,confdesk,ps,fun) {


        var cm1;
        var id = null;

        if (deskRef)
            id = deskRef.uuid;

        if (!scene.desksExistRef) scene.desksExistRef = [];

        if (id != null && scene.desksExistRef[id]) return;
        else if (id != null) scene.desksExistRef[id] = deskRef;




        cm1 = scene.createDeskModel(cm1,confdesk);

        scene.newDeskCount++;

        cm1.parent = parent;

        if (!deskRef) {

            var ent = new entity('desk',localDB.officeRef);
            ent.prm = { par: cm1,ps: ps };

            /** back end part */
            var numb = 0;
            for (var i in scene.desksRef) {

                if (scene.desksRef[i] && scene.desksRef[i].name && scene.desksRef[i].name.split(' ').length == 2) {
                    numb = max(numb,scene.desksRef[i].name.split(' ')[1].valueOf() * 1.0);
                }
            }

            numb++;

            ent.new({ floor_uuid: ref,flex: true,active: true }).then(function (d) {
                ent.prm.par.deskId = d.desk.uuid;

                scene.desksExistRef[d.desk.uuid] = d.desk;

                if (!scene.desksRef) scene.desksRef = [];
                scene.desksRef.push(d.desk);

                if (fun) fun(d.desk,ent.prm.par,ent.prm.ps);

            });

        } else if (fun) fun(deskRef,cm1,ps);

        return cm1;
    };

    scene.updateDesk = function (deskRef,cm1,ps) {

        cm1.id = deskRef.uuid;

        if (scene.desks[cm1.id]) {

            ic1 = scene.desks[cm1.id];
            var us = [];
            for (var iu in ic1._children) {
                if (ic1.floor != ic1._children[iu])
                    us.push(ic1._children[iu]);
            };
            for (var iu in us) { us[iu].dispose(); };

        }

        // ignore duplicated desk scene.desks[deskRef.uuid] = cm1;

        // deskParentMesh

        if (!scene.deskParentMesh) scene.deskParentMesh = [];

        scene.deskParentMesh[deskRef.uuid] = cm1;
        //scene.desks[deskRef.uuid].material = 

        scene.createTitle(deskRef.name,
            { alpha: 1,font: 'bold 180px arial',color: (deskRef.active || deskRef.flex) ? '#ffffffFF' : '#ffffffFF' }
            ,3.5,{ x: -2.5,y: 5.00,z: 0. },cm1);

        cm1.capacity = deskRef.capacity;

        if (deskRef.active) {
            cm1.availible = 1;
        }

        cm1.userCount = deskRef.assigned_users.length;

        if (cm1.users) {
            for (var i in cm1.users) {
                cm1.users[i].dispose();
            }
        }

        if (deskRef.assigned_users.length > 0) {
            cm1.users = [];

            for (var i = 0; i < deskRef.assigned_users.length; i++) {

                var usr = scene.circle.clone();
                usr.parent = cm1;
                var s = deskRef.assigned_users[i].name.split(' ');

                cm1.users.push(usr);
                // s = s[0][0].toUpperCase()+ (s[1]? s[1][0].toUpperCase():s[0][1]); 

                s = s[0][0].toUpperCase() + s[0][1].toUpperCase();

                usr.userId = deskRef.assigned_users[i].uuid;

                console.log(deskRef.assigned_users[i]);

                if (deskRef.assigned_users[i].image) {

                    usr.material = new BABYLONX.ShaderBuilder()
                        .Map({ path: 'https://cdn.orangery.io/' + deskRef.assigned_users[i].image + '.jpg',uv: 'vec2(vec2(1.,-1.0)*pos.zx*1.2+0.5)' })
                        .InLine('result.xyz *=0.5;')
                        .BuildMaterial(scene);


                } else {
                    usr.material = scene.dyMat(s,{ tColor: '#ffffffff',color: '#ff000000' });

                }



                usr.position.y = 4.9 - i * 0.05;
                usr.position.x = 1.5 - i * 0.5;

                if (!deskRef.active || !deskRef.flex)
                    usr.isPickable = false;
                else
                    usr.isUser = true;

                usr.scaling.x = 1.5;
                usr.scaling.y = 1.5;
                usr.scaling.z = 1.5;
            }
        }

        if (ps) {
            var ps1 = { x: ps.x,y: ps.y,z: ps.z };
            ps1 = r_y(ps1,cm1.parent.rotation.y);

            cm1.position.x = ps1.x;
            cm1.position.z = ps1.z;
        }
        /*cm1.rotation.y = ( -def(ps.r,0.) )*deg;  */

        if (scene.mapsRef[deskRef.uuid]) {
            cm1.map = scene.mapsRef[deskRef.uuid];
            scene.setAsMap(cm1,scene.mapsRef[deskRef.uuid]);
        }

    };


    scene.addedDesks = [];

    scene.addDesk = function (ref,conf,px,pz,par,live,fun) {

        if (ref && ref.id) {

            new entity('desk',localDB.officeRef).get(ref.id).then(function (d) {
                if (d && d.desk) scene.addDesk(d.desk,conf,px,pz,par,live);
            });
            return;
        }

        if (ref && scene.addedDesks[ref.uuid]) return;

        if (ref && ref.uuid) scene.addedDesks.push(ref.uuid);



        var confdesk = {
            seg: 20,width: 10.5,length: 6.0,rad: 0.35,height: 4.85,
            depth: 0.2,depth2: 0.2,col: 3.5,colin: 0.35,parts: [1]
        };

        confdesk = def(conf,confdesk);

        canvas_scene.checkMapItem = 0;
        par = def(par,canvas_scene.floors[canvas_scene.selectedFloor].mesh);

        canvas_scene.createDesk(ref,par.id,par,confdesk,
            {
                x: def(px,camera._currentTarget.x),
                z: def(pz,camera._currentTarget.z),
                y: 0.,
            }
            ,function (deskRef,cm1,ps1) {

                scene.desksMap[deskRef.uuid] = cm1;

                if (par)
                    cm1.parent = par;

                if (fun) fun(cm1);

                if (!cm1.map && live) {

                    cm1.map = {
                        name: "mapDesk",
                        position_x: px,
                        position_y: 0,
                        position_z: pz,
                        reference_uuid: deskRef.uuid,
                        type: "desk"
                    };

                    cm1.map.data = scene.mapItemData(cm1);
                    cm1.map.data.pos = { x: px,y: 0.15,z: pz };

                    cm1.map.data.parent = par ? par.id : scene.floors[scene.selectedFloor].mesh.id;
                    var deskId = deskRef.uuid;

                    new entity('desk',localDB.officeRef).param({ mesh: cm1 }).id(deskId)
                        .set({ floor_uuid: scene.floors[scene.selectedFloor].mesh.id }).then(function (d,th) {
                            console.log(d);
                            th.params.mesh.map.uuid = d.uuid;
                            if (th.params.mesh.map)
                                new entity('mapitem',localDB.officeRef).new(th.params.mesh.map).then(function (d) {
                                    cm1.map = d.map_item;
                                    sysLog('desk added','info',100);
                                    console.log(21,d);
                                });
                            else {
                                /** not find applyed map */
                                sysLog('warrning','error',100);
                            }
                        });


                }

                if (deskRef && cm1.material && (!deskRef.active || !deskRef.flex)) {
                    cm1.material.flagUp(3);
                }

                console.log(882,cm1.map);

                if (!ref) {

                    cm1.position.x += 0.5;
                    cm1.position.y = 0.0;

                    setTimeout(function () { canvas_scene.updateDesk(deskRef,cm1,ps1); },1);


                } else {

                    console.log(334,ps1,ref,cm1.map);

                    setTimeout(function () { canvas_scene.updateDesk(deskRef,cm1,ps1); },1);
                    cm1.position.y = 0.0;

                }
            });

    };


    /** asset */

    scene.createAssetModel = function (cm1,conf,map) {

        var keyAsset = 'asset' + JSON.stringify(conf);
        var parent,id;

        if (!cm1) {
            cm1 = new BABYLON.Mesh(scene);
        }
        if (cm1 && cm1.parent) {
            parent = cm1.parent;
            id = cm1.id;
        }

        if (cm1 && cm1.floor) {
            cm1.floor.dispose();
        }


        if (cm1 && cm1.parts) {
            for (var i in cm1.parts)
                cm1.parts[i].dispose();
        }


        if (!scene.cacheMesh[keyAsset]) {
            if (conf.partCount) {
                scene.cacheMesh[keyAsset] = [];
                for (var i = 0; i < conf.partCount; i++) {
                    var conf1 = JSON.parse(JSON.stringify(conf));

                    if (!conf1.parts) conf1.parts = [];
                    conf1.parts[i] = 1;
                    scene.cacheMesh[keyAsset][i] = canvas_scene.modelCommand.createGeo('asset_' + conf.type,conf1).toMesh(canvas_scene);

                    if (scene.GeoModels['asset_' + conf.type] &&
                        scene.GeoModels['asset_' + conf.type].getSize) {
                        scene.cacheMesh[keyAsset][i].size = scene.GeoModels['asset_' + conf.type].getSize(conf1);

                    }
                    scene.cacheMesh[keyAsset][i].position.y = -60000;

                }

            }
            else {
                scene.cacheMesh[keyAsset] = canvas_scene.modelCommand.createGeo('asset_' + conf.type,conf).toMesh(canvas_scene);
                scene.cacheMesh[keyAsset].position.y = -60000;

            }

        }

        if (scene.cacheMesh[keyAsset]) {




            if (conf.partCount) {

                for (var i = 0; i < conf.partCount; i++) {

                    if (i == 0) {

                        cm1.floor = scene.cacheMesh[keyAsset][i].clone();
                        cm1.floor.parent = cm1;
                        cm1.floor.position.y = 0;
                        cm1.floor.material = scene.assetMat(conf,conf.type,map,i);

                    } else {
                        var part = scene.cacheMesh[keyAsset][i].clone();


                        part.parent = cm1;
                        part.position.y = 0;
                        part.material = scene.assetMat(conf,conf.type,map,i,scene.cacheMesh[keyAsset][i].size);
                        if (!cm1.parts) cm1.parts = [];
                        cm1.parts.push(part);

                    }

                }

                cm1.isAsset = 1;
                cm1.name = 'asset';
                cm1.id = id;
                cm1.parent = parent;



            }
            else {

                cm1.floor = scene.cacheMesh[keyAsset].clone();
                cm1.floor.parent = cm1;
                cm1.floor.position.y = 0;

                cm1.isAsset = 1;
                cm1.name = 'asset';
                cm1.id = id;
                cm1.parent = parent;

                cm1.floor.material = scene.assetMat({ r: 0,g: 0,b: 0 },conf.type,map);

            }

        }


        cm1.conf1 = conf;


        if (scene.rotation_y)
            cm1.rotation.y = scene.rotation_y;

        return cm1;

    };

    scene.reCreateAsset = function (mesh,type) {

        if (mesh.map && mesh.map.data) {

            mesh.map.data.conf1 = def(mesh.map.data.conf1,{});
            mesh.map.data.conf1 = mix(mesh.conf1,type,1);
            mesh.conf1 = mesh.map.data.conf1;

            new entity('mapitem',localDB.officeRef).id(mesh.map.uuid).set(mesh.map).then(function (d) {

                sysLog('asset type saved','info',100);
                setTimeout(() => {
                    sysLogHide();
                },1300);

            });

            mesh = scene.createAssetModel(mesh,mesh.map.data.conf1,mesh.map);
        }
    };

    scene.createAsset = function (parent,conf,ps,fun,fMap) {

        var cm1;

        cm1 = scene.createAssetModel(cm1,conf,fMap);

        scene.newAssetCount++;

        cm1.parent = parent;

        if (fun) fun(cm1,ps);

        return cm1;
    };

    scene.addAsset = function (conf,ref,pos,par) {

        pos = def(pos,{ x: null,y: null,z: null });

        var assetConfig = { rot: { x: 0,y: 0,z: 0 },pos: { x: 0,y: 0,z: 0 },conf1: mix(conf,{ seg: 10 },1) };

        canvas_scene.checkMapItem = 0;
        par = def(par,canvas_scene.floors[canvas_scene.selectedFloor].mesh);

        canvas_scene.createAsset(par,assetConfig.conf1,
            {
                x: def(pos.x,camera._currentTarget.x),
                z: def(pos.z,camera._currentTarget.z),
                y: def(pos.y,0.),
            },function (cm1,ps1) {

                if (ref) {

                    cm1.position.x = pos.x;
                    cm1.position.y = pos.y;
                    cm1.position.z = pos.z;

                    cm1.rotation.y = (ref.data.rot ? ref.data.rot.y : 0);

                    cm1.map = ref;

                    if (cm1.map && cm1.map.reference_uuid) {

                        if (cm1.conf1.type == 'parkingSpot' && scene.parkingSpotsRef[cm1.map.reference_uuid]) {

                            scene.createTitle(scene.parkingSpotsRef[cm1.map.reference_uuid].name,
                                { alpha: 1,font: '70px arial Black',color: '#555555FF',align: 'center center' }
                                ,13.5,{ x: 0.,y: .35,z: 0. },cm1);
                        }
                    }

                    if (par)
                        cm1.parent = par;


                } else {

                    cm1.position.x = ps1.x;
                    cm1.position.y = ps1.y;
                    cm1.position.z = ps1.z;

                    assetConfig.pos.x = cm1.position.x;
                    assetConfig.pos.y = cm1.position.y;
                    assetConfig.pos.z = cm1.position.z;

                    assetConfig.rot.y = cm1.rotation.y;
                    assetConfig.parent = par.id;

                    cm1.map = {
                        name: "asset " + conf.type,
                        position_x: 0,
                        position_y: 0,
                        data: assetConfig,
                        position_z: 0,
                        timestamp: 1666096080.640032,
                        type: "asset",
                        updated_by: "Server"
                    };


                    if (conf.type == 'parkingSopt') {

                        if (!scene.parkingCounter) scene.parkingCounter = 1;

                        new entity('parking-spot',localDB.officeRef).new({ name: 'P ' + (scene.parkingCounter++),description: '' }).then(function (d) {

                            cm1.map.reference_uuid = d.parking_spot.uuid;
                            scene.parkingSpotsRef[cm1.map.reference_uuid] = d.parking_spot;

                            new entity('mapitem',localDB.officeRef).new(cm1.map).then(function (d) {

                                cm1.map.uuid = d.map_item.uuid;


                                if (cm1.map && cm1.map.reference_uuid) {

                                    if (cm1.conf1.type == 'parkingSpot' && scene.parkingSpotsRef[cm1.map.reference_uuid]) {

                                        scene.createTitle(scene.parkingSpotsRef[cm1.map.reference_uuid].name,
                                            { alpha: 1,font: '70px arial Black',color: '#555555FF',align: 'center center' }
                                            ,13.5,{ x: 0.,y: .35,z: 0. },cm1);
                                    }
                                }

                                sysLog('parking added','info',100);
                                setTimeout(() => {
                                    sysLogHide();
                                },500);
                            });
                        });

                    } else {
                        new entity('mapitem',localDB.officeRef).new(cm1.map).then(function (d) {

                            cm1.map = d.map_item;
                            sysLog('asset added','info',100);
                            setTimeout(() => {
                                sysLogHide();
                            },500);
                        });
                    }


                }

            });


    };

};