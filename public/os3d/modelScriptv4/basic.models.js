scene.modelCommand = {
    carrier: {},
    materials: [],
    import: function (cmd,geos,parent) {

        for (var im in geos) {
            var matName = im;
            var matNamePart1 = im.split('|')[0];


            var mesh = new BABYLONX.Geometry(
                GB.GeometryBase(null,null,geos[matNamePart1])
            ).toMesh(canvas_scene);

            mesh.parent = parent;
            mesh.isModel = 1;

            var mat = null;
            if (!cmd.liveMat && scene.modelCommand.materials[cmd.modelType + '|' + cmd.variant + matName + '|' + cmd.params.trans]) {
                mat = scene.modelCommand.materials[cmd.modelType + '|' + cmd.variant + matName + '|' + cmd.params.trans];
            } else {

                mat = scene.GeoModels[cmd.modelType].materials[matNamePart1](cmd.params)
                    .Event(2,'result.xyz= result.xyz*0.5+vec3(1.,0.7,0.)*0.5; ')
                    .BuildMaterial(canvas_scene);

                scene.modelCommand.materials[cmd.modelType + '|' + cmd.variant + matName + '|' + cmd.params.trans] = mat;
            }

            mat.setVector4("sett",def(cmd.params.sett,{ x: 0,y: 0,y: 0,w: 0 }));

            mesh.isPickable = false;
            mesh.checkCollisions = false;

            if (cmd.params.dy && cmd.params.dy[matName]) {

                try {
                    var dy = cmd.params.dy[matName];
                    mesh.dyTexture = scene.liveCanvas(dy.w,dy.h);
                    mesh.dyTexture.reset = function (mesh,mat,wait) {


                        var embed = mesh.dyTexture.toDataURL();

                        var img = document.createElement("img");
                        img.onload = function () {
                            var txt1 = new BABYLON.Texture(this.src,scene);

                            if (wait)
                                GUX.waitCond(
                                    function () {
                                        return txt1.isReady();
                                    },
                                    function () {
                                        mat.setTexture("dynamicSample",txt1);
                                    },
                                    0.05
                                );
                            else mat.setTexture("dynamicSample",txt1);
                        };
                        img.src = embed;
                    };

                    mat.setTexture("dynamicSample",new BABYLON.Texture("",scene));

                    mesh.dyContext = mesh.dyTexture.getContext("2d");

                } catch (e) { }

            }

            mesh.material = mat;
            window.callBack[cmd.id](scene.items[cmd.id],mesh,matName);
        }
    },
    createModel: function (cmd,geos,parent,fun) {
        sett = scene.GeoModels[cmd.type].variant[cmd.mode](cmd.param || {});

        for (var im in geos) {
            var matName = im;

            var mesh = new BABYLONX.Geometry(
                GB.GeometryBase(
                    sett[matName],
                    scene.GeoModels[cmd.type].builder,
                    geos[matName]
                )
            ).toMesh(scene);

            mesh.parent = parent;
            mesh.id = cmd.id + "|" + matName;
            mesh.item_type = matName;
            mesh.isPicable = cmd.pick;
            mesh.enablePointerMoveEvents = cmd.pick;

            mesh.isModel = 1;
            mesh.material = scene.GeoModels[cmd.type].materials[matName](cmd.param)
                .BuildMaterial(scene);
            mesh.material.setVector4("sett",{ x: 0.0,y: 0,z: 0,w: 0 });
            if (cmd.pick)
                mesh.material.setVector4(
                    "pickedPoint",
                    new BABYLON.Vector3(0,0,-99999999999)
                );

            mesh.sett = function (m,p) {
                m.material.setVector4("sett",p);
            };
            if (fun) fun(mesh);
        }
    },
    recreateInWorker: function (cmd) {
        var sett = scene.GeoModels[cmd.modelType].variant[cmd.variant.split('|')[0]](
            cmd.params || {}
        );

        var geos = [];
        for (var im in sett) {
            var matName = im.split('|')[0];
            im = sett[im];

            geos[matName] = new BABYLONX.Geometry(
                GB.GeometryBase(sett[matName],
                    scene.GeoModels[cmd.modelType].builder,
                    geos[matName])
            );

        }
        return geos;
    },
    createGeo: function (name,sett) {

        if (scene.GeoModels[name])

            return new BABYLONX.Geometry(
                GB.GeometryBase(sett,scene.GeoModels[name].builder)
            ); else {

            console.log(name + ': model is damaged');
            return new BABYLONX.Geometry();
        }

    }
};

scene.templates = {
    rims: {

        roomCorner: function (seg,w,h,d,rd,ts,cus) {
            return new GB.PointsPart()
                .add(1,GB.Rims.Move({ z: rd,ts: ts },cus))
                .add(seg,GB.Rims.ArcXZ({ x: -1. * rd,z: 0,s: 90,t: 90,r: rd,ts: ts },cus))
                .add(2,GB.Rims.LineX({ t: -w + 2. * rd,ts: ts },cus))
                .add(seg,GB.Rims.ArcXZ({ x: 0,z: rd,s: 180,t: 90,r: rd,ts: ts },cus))
                .add(2,GB.Rims.LineZ({ t: d - 2. * rd,ts: ts },cus))
                .add(seg,GB.Rims.ArcXZ({ x: rd,z: 0,s: 270,t: 90,r: rd,ts: ts },cus))

                .add(2,GB.Rims.LineX({ t: w - d - 2. * rd,ts: ts },cus))
                .add(seg,GB.Rims.ArcXZ({ x: 0,z: rd,s: 180,t: -90,r: rd,ts: ts },cus))

                .add(2,GB.Rims.LineZ({ t: h - 1. * d - 2. * rd,ts: ts },cus))
                .add(seg,GB.Rims.ArcXZ({ x: rd,z: 0.,s: 270,t: 90,r: rd,ts: ts },cus))
                .add(2,GB.Rims.LineX({ t: d - 2 * rd,ts: ts },cus))
                .add(seg,GB.Rims.ArcXZ({ x: 0,z: -rd,s: 0,t: 90,r: rd,ts: ts },cus))
                .add(2,GB.Rims.LineZ({ t: -h + 2 * rd,ts: ts },cus));
        },
        roomRect: function (seg,w,h,d,rd,ts,cus) {
            return new GB.PointsPart()
                .add(1,GB.Rims.Move({ z: rd,ts: ts },cus))
                .add(seg,GB.Rims.ArcXZ({ x: -1. * rd,z: 0,s: 90,t: 90,r: rd,ts: ts },cus))
                .add(2,GB.Rims.LineX({ t: -w + 2. * rd,ts: ts },cus))
                .add(seg,GB.Rims.ArcXZ({ x: 0,z: rd,s: 180,t: 90,r: rd,ts: ts },cus))
                .add(2,GB.Rims.LineZ({ t: d - 2. * rd,ts: ts },cus))
                .add(seg,GB.Rims.ArcXZ({ x: rd,z: 0,s: 270,t: 90,r: rd,ts: ts },cus))

                .add(2,GB.Rims.LineX({ t: w - 2. * rd,ts: ts },cus))
                .add(seg,GB.Rims.ArcXZ({ x: 0,z: -rd,s: 0,t: 90,r: rd,ts: ts },cus))
                .add(2,GB.Rims.LineZ({ t: -d + 2. * rd,ts: ts },cus));

        }
    }
};

scene.GeoModels = {
    triangle: {
        builder: function (setting,geo) {

            ind = 0;

            GB.MakeFace(geo,
                [
                    { x: setting.ps[0],y: setting.y,z: setting.ps[1] },
                    { x: setting.ps[2],y: setting.y,z: setting.ps[3] },
                    { x: setting.ps[4],y: setting.y,z: setting.ps[5] }
                ]
                ,{
                    flip: false,
                    Face3Point: true,
                    faceUVMap: "012",
                    uvStart: { v: i / setting.seg,u: 0. },
                    uvEnd: { v: (i + 1) / setting.seg,u: 1. }
                });





        }
    },
    circle_cus: {
        builder: function (setting,geo) {

            ind = 0;
            ps = setting.ps;

            var a = norm({ x: ps[2] - ps[0],y: 0,z: ps[3] - ps[1] });
            var b = norm({ x: ps[4] - ps[0],y: 0,z: ps[5] - ps[1] });

            var r0 = pow(pow(a.x - b.x) + pow(a.z - b.z),0.5);
            var r1 = pow(pow(ps[2] - ps[0]) + pow(ps[3] - ps[1]),0.5);
            var r2 = pow(pow(ps[4] - ps[0]) + pow(ps[5] - ps[1]),0.5);

            var aa = atan(Math.sign(a.z) * a.x / (abs(a.z) + 0.0001));
            if (a.z < 0.) aa = 180. * deg + ab;

            var ab = atan(Math.sign(b.z) * b.x / (abs(b.z) + 0.0001));

            if (b.z < 0.) ab = 180. * deg + ab;

            var rim1 = new GB.Rims();
            rim1.PushRim(geo,{
                count: 31,
                repeat: 2,
                point: function (p,i) {

                    p.x = sin(-aa + i * (-(ab - aa) / 30.)) * r1;
                    p.z = cos(-aa + i * (-(ab - aa) / 30.)) * r1;
                    p.y = setting.y;

                    return p;
                }
            })
                .PushRim(geo,{
                    count: 31,
                    repeat: 2,
                    point: function (p,i) {

                        p.x = sin(-aa + i * (-(ab - aa) / 30.)) * r2;
                        p.z = cos(-aa + i * (-(ab - aa) / 30.)) * r2;
                        p.y = setting.y;

                        return p;
                    }
                });

            rim1.Connect(geo,0,1,0,0,0);
            rim1.Connect(geo,0,1,1,1,1);
        }
    },
    circle_full: {
        builder: function (setting,geo) {


            ind = 0;
            ps = setting.ps;

            var a = norm({ x: ps[2] - ps[0],y: 0,z: ps[3] - ps[1] });
            var b = norm({ x: ps[4] - ps[0],y: 0,z: ps[5] - ps[1] });

            var r0 = pow(pow(a.x - b.x) + pow(a.z - b.z),0.5);
            var r1 = pow(pow(ps[2] - ps[0]) + pow(ps[3] - ps[1]),0.5);
            var r2 = pow(pow(ps[4] - ps[0]) + pow(ps[5] - ps[1]),0.5);

            var aa = atan(Math.sign(a.z) * a.x / (abs(a.z) + 0.0001));
            if (a.z < 0.) aa = 180. * deg + ab;

            var ab = atan(Math.sign(b.z) * b.x / (abs(b.z) + 0.0001));

            if (b.z < 0.) ab = 180. * deg + ab;

            var rim1 = new GB.Rims();
            rim1.PushRim(geo,{
                count: 1,
                repeat: 2,
                point: function (p,i) {

                    p.y = setting.y;

                    return p;
                }
            })
                .PushRim(geo,{
                    count: 61,
                    repeat: 2,
                    point: function (p,i) {

                        p.x = sin(i * (360 * deg / 60.)) * r2;
                        p.z = cos(i * (360 * deg / 60.)) * r2;
                        p.y = setting.y;

                        return p;
                    }
                });

            rim1.Connect(geo,0,1,0,0,0);
            rim1.Connect(geo,0,1,1,1,1);

        }
    },
    shape_polygon: {
        builder: function (setting,geo) {

            ind = 0;
            ps = setting.ps;
            var r1 = new GB.Rims();
            r1.PushRim(geo,{
                name: 'center',count: 1,repeat: ps.length,
                point: function (p,i) { p.x = ps[0]; p.z = ps[1]; p.y = setting.y; return p; }
            });

            for (var j = 4; j <= ps.length; j += 2) {

                r1.PushRim(geo,{
                    count: 2,repeat: 2,
                    point: function (p,i) {

                        if (i == 0) {
                            p.x = ps[j]; p.z = ps[j + 1];
                        }
                        else {
                            p.x = ps[j - 2]; p.z = ps[j - 1];
                        }
                        p.y = setting.y;

                        return p;
                    }
                });

                r1.Connect(geo,0,null,0,j - 2,0);
                r1.Connect(geo,0,null,1,j - 1,1);



            }


        }
    },
    wall2point: {
        /** {ps:[-20,0,20,0 ],y:0,d:0.5,  [window]st:2.5 , [0:wall,1:door,2:window]dw:2, [window-space between]ds:8,h:30,win:true } */
        builder: function (setting,geo) {

            ind = 0;

            var p1 = { x: setting.ps[0],y: setting.y,z: -setting.ps[1] };
            var p2 = { x: setting.ps[2],y: setting.y,z: -setting.ps[3] };

            GB.rightHand = 0;

            var dir = {
                x: p2.x - p1.x,
                y: p2.y - p1.y,
                z: p2.z - p1.z
            };


            var dir1 = norm(cln(dir));

            var alpha = -atan(dir1.x / dir1.z) - 90. * deg;

            if (dir.z < 0.) alpha += 180 * deg;

            var len = sqrt(pow(dir.x) + pow(dir.z));

            var rim = new GB.Rims();

            function cus(p,op) {

                p.x += 0.5 * len;


                p = r_y(p,alpha);

                p.x -= p1.x;
                p.z -= p1.z;

                return p;
            }

            function cus2(p,op) {

                p.x += setting.st / 2.;

                p = r_y(p,alpha);

                p.x -= p1.x;
                p.z -= p1.z;

                return p;
            }

            function cus3(p,op) {

                p.x += len - setting.st / 2.;

                p = r_y(p,alpha);

                p.x -= p1.x;
                p.z -= p1.z;

                return p;
            }

            function cus4(p,op) {

                p.x += op.ds;

                p = r_y(p,alpha);

                p.x -= p1.x;
                p.z -= p1.z;

                return p;
            }

            if (setting.dw == 0.) {

                rim
                    .PushSquare(geo,{ solid: 2,sf: 'xz',d: setting.d,w: len },cus)
                    .PushSquare(geo,{ solid: 2,sf: 'xz',d: setting.d,y: setting.h,w: len },cus)
                    .Connect(geo,null,null,1)

                    .PushSquare(geo,{ solid: 2,sf: 'xz',d: setting.d,y: setting.h,w: len },cus)
                    .PushSquare(geo,{ solid: 2,sf: 'xz',d: 0.,y: setting.h,w: 0 },cus)
                    .Connect(geo,null,null,1);
            } else if (setting.dw == 1.) {


                rim
                    .PushSquare(geo,{ solid: 2,sf: 'xz',d: 0.,y: setting.h * 2. / 3.,w: 0 },cus)
                    .PushSquare(geo,{ solid: 2,sf: 'xz',d: setting.d,y: setting.h * 2. / 3.,w: len },cus)
                    .Connect(geo,null,null,1)
                    .PushSquare(geo,{ solid: 2,sf: 'xz',d: setting.d,y: setting.h * 2. / 3.,w: len },cus)
                    .PushSquare(geo,{ solid: 2,sf: 'xz',d: setting.d,y: setting.h - setting.st / 2.,w: len },cus)
                    .Connect(geo,null,null,1)
                    .PushSquare(geo,{ solid: 2,sf: 'xz',d: setting.d,y: setting.h - setting.st / 2.,w: len },cus)
                    .PushSquare(geo,{ solid: 2,sf: 'xz',d: 0.,y: setting.h - setting.st / 2.,w: 0 },cus)
                    .Connect(geo,null,null,1);

                rim
                    .PushSquare(geo,{ solid: 2,sf: 'xz',d: setting.d + setting.st / 2.,y: 0,w: setting.st },cus2)
                    .PushSquare(geo,{ solid: 2,sf: 'xz',d: setting.d + setting.st / 2.,y: setting.h,w: setting.st },cus2)
                    .Connect(geo,null,null,1)
                    .PushSquare(geo,{ solid: 2,sf: 'xz',d: setting.d + setting.st / 2.,y: setting.h,w: setting.st },cus2)
                    .PushSquare(geo,{ solid: 2,sf: 'xz',d: 0,y: setting.h,w: 0 },cus2)
                    .Connect(geo,null,null,1);
                rim
                    .PushSquare(geo,{ solid: 2,sf: 'xz',d: setting.d + setting.st / 2.,y: 0,w: setting.st },cus3)
                    .PushSquare(geo,{ solid: 2,sf: 'xz',d: setting.d + setting.st / 2.,y: setting.h,w: setting.st },cus3)
                    .Connect(geo,null,null,1)
                    .PushSquare(geo,{ solid: 2,sf: 'xz',d: setting.d + setting.st / 2.,y: setting.h,w: setting.st },cus3)
                    .PushSquare(geo,{ solid: 2,sf: 'xz',d: 0,y: setting.h,w: 0 },cus3)
                    .Connect(geo,null,null,1);

            } else if (setting.dw == 2.) {

                if (setting.win) {
                    rim
                        .PushSquare(geo,{ solid: 2,sf: 'xz',d: setting.d,y: 0.015,w: len },cus)
                        .PushSquare(geo,{ solid: 2,sf: 'xz',d: setting.d,y: (setting.h) - 0.015,w: len },cus)
                        .Connect(geo,null,null,1);
                }
                else {

                    for (var j = 0; j <= 4.; j++) {
                        rim
                            .PushSquare(geo,{ solid: 2,sf: 'xz',d: 0,y: j / 4. * (setting.h) - 0.5,w: 0 },cus)
                            .PushSquare(geo,{ solid: 2,sf: 'xz',d: setting.d,y: j / 4. * (setting.h) - 0.5,w: len },cus)
                            .Connect(geo,null,null,1)
                            .PushSquare(geo,{ solid: 2,sf: 'xz',d: setting.d,y: j / 4. * (setting.h) - 0.5,w: len },cus)
                            .PushSquare(geo,{ solid: 2,sf: 'xz',d: setting.d,y: j / 4. * (setting.h) - 0.005,w: len },cus)
                            .Connect(geo,null,null,1)
                            .PushSquare(geo,{ solid: 2,sf: 'xz',d: setting.d,y: j / 4. * (setting.h) - 0.005,w: len },cus)
                            .PushSquare(geo,{ solid: 2,sf: 'xz',d: 0.,y: j / 4. * (setting.h) - 0.005,w: 0 },cus)
                            .Connect(geo,null,null,1);
                    }

                    var wil = floor(len / setting.ds);

                    for (var i = 0; i <= wil; i++) {

                        rim
                            .PushSquare(geo,{ solid: 2,sf: 'xz',d: setting.d + setting.st,y: 0,w: setting.st,ds: i * len / wil },cus4)
                            .PushSquare(geo,{ solid: 2,sf: 'xz',d: setting.d + setting.st,y: setting.h,w: setting.st,ds: i * len / wil },cus4)
                            .Connect(geo,null,null,1)
                            .PushSquare(geo,{ solid: 2,sf: 'xz',d: setting.d + setting.st,y: setting.h,w: setting.st,ds: i * len / wil },cus4)
                            .PushSquare(geo,{ solid: 2,sf: 'xz',d: 0,y: setting.h,w: 0,ds: i * len / wil },cus4)
                            .Connect(geo,null,null,1);
                    }
                }

            }

        }
    },
    content: {
        builder: function (setting,geo) {
            GB.MakeFace(
                geo,[
                { x: setting.width / 2,y: setting.height / 2,z: 0 },
                { x: -setting.width / 2,y: setting.height / 2,z: 0 },
                { x: setting.width / 2,y: -setting.height / 2,z: 0 },
                { x: -setting.width / 2,y: -setting.height / 2,z: 0 }
            ],{
                flip: true,
                faceUVMap: "0123",
                uvStart: { v: 0,u: 0 },
                uvEnd: { v: 1,u: 1 }
            }
            );
        },
        setting: {
            flat: { width: 5,height: 5 }
        },
        variant: {
            flat: function (pm) {
                return {
                    face: { width: pm.width,height: pm.height },
                    grid: { width: pm.width,height: pm.height },
                    icon: { width: pm.width,height: pm.height,path: pm.path },
                    tag: { width: pm.width,height: pm.height,path: pm.path },
                    discard: { width: pm.width,height: pm.height }
                };
            },
            tag: function (pm) {
                return {
                    tag: { width: pm.width,height: pm.height,path: pm.path },
                };
            }
        },
        materials: {
            face: function (pm) {
                return new BABYLONX.ShaderBuilder().Map({ path: pm.path });
            },
            grid: function (pm) {
                return new BABYLONX.ShaderBuilder()
                    .SetUniform("sett","vec4")
                    .SetUniform("pickedPoint","vec3")
                    .Func(function (me) {
                        if (pm.parent) me.Map({ path: pm.pattern });

                        return me;
                    })
                    .Transparency()
                    .Func(function (me) {
                        me.Setting.FragmentWorld = 1;
                        me.InLine(`
                        vec3 wpos = vec4(world*vec4(pos,1.)).xyz;
                        vec3 wnrm =  mat3(world)*nrm;
                        `);
                        return me;
                    }).InLine(`
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
                 result.w =  mix(result.w,1.,circle*0.1)*0.5;  
                
                `);
            },
            icon: function (pm) {
                return new BABYLONX.ShaderBuilder()
                    .Func(function (me) {
                        me.Setting.VertexWorld = true;
                        me.Setting.FragmentWorld = true;

                        return me;
                    })
                    .Map({ path: pm.path,alpha: 1,uv: " vec2( 1.-vuv.y, vuv.x)" })
                    .Transparency()
                    .VertexShader(
                        `  
        vec3 wpos = vec3(world*vec4(-0.012,0.001,0.0001,1.)).xyz;

        vec3 nrm_cps = normalize(camera*vec3(1.,0.,1.)-wpos*vec3(1.,0.,1.));
        float ang = atan( nrm_cps.x / (sign(nrm_cps.z) * abs(nrm_cps.z) + 0.0001));

        if(nrm_cps.z < 0. ) ang -=  3.14159265 ;

        pos = r_y(pos,   1.*ang*180.0/3.1415926  ,vec3(0.001)); 
        pos = r_z(pos,  90.0   ,vec3(0.001));    
         

        result = vec4(pos ,1.); 
`
                    )
                    .Back();
            },
            tag: function (pm) {
                return new BABYLONX.ShaderBuilder()
                    .Func(function (me) {
                        me.Setting.VertexWorld = true;
                        me.Setting.FragmentWorld = true;

                        return me;
                    })
                    .SetUniform("dynamicSample","sampler2D")
                    .Map({ index: "dynamicSample",bias: 0,alpha: 1,uv: " vec2( 1.-vuv.y, 1.-vuv.x)" })
                    .Transparency()
                    .Back();
            },
            discard: function (pm) {
                return new BABYLONX.ShaderBuilder().Discard();
            }
        }
    },
    circle: {
        builder: function (setting,geo) {
            ind = 0;
            var p = new GB.Rims();

            p.UV(function (p,i,s,n) { return { u: p.x + 0.5,v: p.z + 0.5 }; }).PushCircle(geo,{ s: 1,w: 0,d: 0,y: 0.125,sf: 'xz' });
            p.UV(function (p,i,s,n) { return { u: p.x + 0.5,v: p.z + 0.5 }; }).PushCircle(geo,{ s: 50.,w: 1,d: 1,y: 0.125,sf: 'xz' }).Connect(geo);


        }
    },
    square: {
        builder: function (setting,geo) {
            ind = 0;
            var p = new GB.Rims();

            p.UV(function (p,i,s,n) { return { u: p.x + 0.5,v: p.z + 0.5 }; }).PushSquare(geo,{ w: 0,d: 0,y: 0.125,sf: 'xz' });
            p.UV(function (p,i,s,n) { return { u: p.x + 0.5,v: p.z + 0.5 }; }).PushSquare(geo,{ w: 1,d: 1,y: 0.125,sf: 'xz' }).Connect(geo);

            p.UV(function (p,i,s,n) { return { u: p.x + 0.5,v: 1. - p.z + 0.5 }; }).PushSquare(geo,{ w: 1,d: 1,y: 0.125,sf: 'xz' });
            p.UV(function (p,i,s,n) { return { u: p.x + 0.5,v: 1. - p.z + 0.5 }; }).PushSquare(geo,{ w: 0,d: 0,y: 0.125,sf: 'xz' }).Connect(geo);


        }
    },
    wall: {
        builder: function (setting,geo) {
            ind = 0;
            var walls = setting.walls;

            var uvScale = 0.0;

            var block = new GB.Part()
                .Create(function (op,custom) {
                    op.w2 = def(op.w2,0);
                    op.h2 = def(op.h2,0);

                    var us = uvScale;

                    var rim = new GB.Rims();

                    rim
                        .PushSquare(
                            geo,{ solid: 2,s: op.s,w: op.w1,d: op.h1,z: op.d,ts: op.ts },
                            custom
                        )
                        .PushSquare(
                            geo,{
                            solid: 2,
                            s: op.s,
                            w: op.w2,
                            d: op.h2,
                            x: op.x,
                            y: op.y,
                            z: op.d,
                            ts: op.ts
                        },
                            custom
                        )
                        .Connect(geo);

                    if (op.w2 != 0 && op.h2 != 0)
                        rim
                            .PushSquare(
                                geo,{
                                solid: 2,
                                s: op.s,
                                w: op.w2,
                                d: op.h2,
                                x: op.x,
                                y: op.y,
                                z: op.d,
                                ts: op.ts
                            },
                                custom
                            )
                            .PushSquare(
                                geo,{
                                solid: 2,
                                s: op.s,
                                w: op.w2,
                                d: op.h2,
                                x: op.x,
                                y: op.y,
                                z: -op.d,
                                ts: op.ts
                            },
                                custom
                            )
                            .Connect(geo);

                    rim
                        .PushSquare(
                            geo,{
                            solid: 2,
                            s: op.s,
                            w: op.w2,
                            d: op.h2,
                            x: op.x,
                            y: op.y,
                            z: -op.d,
                            ts: op.ts
                        },
                            custom
                        )
                        .PushSquare(
                            geo,{ solid: 2,s: op.s,w: op.w1,d: op.h1,z: -op.d,ts: op.ts },
                            custom
                        )
                        .Connect(geo);

                    rim
                        .PushSquare(
                            geo,{ solid: 2,s: op.s,w: op.w1,d: op.h1,z: -op.d,ts: op.ts },
                            custom
                        )
                        .PushSquare(
                            geo,{ solid: 2,s: op.s,w: op.w1,d: op.h1,z: op.d,ts: op.ts },
                            custom
                        )
                        .Connect(geo);
                })
                .Custom(function (p,op) {
                    p = p_ts(p,def(op.ts,{}));

                    return p;
                });

            function wallMaker(p1,p2) {
                var len = dim(p1,p2);

                var nrm = norm(sub(cln(p1),cln(p2)));

                var wallAngle = atan(nrm.x / (Math.sign(nrm.z) * abs(nrm.z) + 0.0001));

                var angle = 90 * deg - wallAngle;

                var sett = {
                    d: setting.deep * 0.5,
                    w1: len,
                    h1: setting.height,

                    ts: {
                        ry: angle,
                        mz: (p1.z + p2.z) / 2,
                        my: setting.height / 2 + (p1.y + p2.y) / 2,
                        mx: (p1.x + p2.x) / 2
                    }
                };

                if (p2.door != null) {
                    sett.w2 = setting.doorWidth;
                    sett.h2 = setting.doorHeight;
                    sett.y = p1.y - 0.45 * (setting.height - setting.doorHeight);
                    sett.x =
                        p2.door * len * 0.5 -
                        1 * Math.sign(p2.door) * setting.doorWidth * 0.6;
                }

                block.New(sett);
            }

            for (var i = 0; i < walls.length; i++) {
                walls[i].x *= -1;
            }

            for (var i = 0; i < walls.length; i++) {
                if (walls[i + 1]) wallMaker(walls[i],walls[i + 1]);
            }
        },
        setting: {
            default: { points: [] }
        },
        variant: {
            default: function (pm) {
                return {
                    wallMesh: {
                        deep: 0.09,
                        height: 1.95,
                        doorWidth: 1.25,
                        doorHeight: 1.25,
                        walls: pm.points
                    }
                };
            }
        },
        materials: {
            wallMesh: function (pm) {
                return new BABYLONX.ShaderBuilder().Solid().Func(function (me) {
                    me.Setting.FragmentWorld = 1;
                    me.InLine(
                        `vec3 wpos = vec4(world*vec4(pos,1.)).xyz;vec3 wnrm =  mat3(world)*nrm;`
                    );
                    return me;
                }).InLine(`
                    float fs = pow(dot(wnrm,normalize( camera-wpos)),2.);
                    result = vec4(vec3(fs*0.1+0.9 ),1.);`);
            }
        }
    },
    building_rect: {
        /* width: 20,  depth: 20 ,  holeWidth:2.5 , holeDepth: 4,  holePosX: 1,   holePosZ: 1, h: 0.2, stages:  [0, 3.2] , parts: [1] */
        builder: function (setting,geo) {
            ind = 0;

            setting.holePosX = max(-setting.width / 2 + setting.holeWidth / 2,
                min(
                    setting.width / 2 - setting.holeWidth / 2,
                    def(setting.holePosX,0) - setting.width / 2
                )
            );

            setting.holePosZ = max(-setting.depth / 2 + setting.holeDepth / 2,
                min(
                    setting.depth / 2 - setting.holeDepth / 2,
                    def(setting.holePosZ,0) - setting.depth / 2
                )
            );

            var rim = new GB.Rims();

            if (setting.parts[0] == 1) {
                var yh = 0;

                for (var i = 0; i < setting.stages.length; i++) {
                    yh += setting.stages[i];

                    rim.PushSquare(geo,{
                        y: yh,
                        solid: 2,
                        x: setting.holePosX,
                        z: setting.holePosZ,
                        w: setting.holeWidth,
                        d: setting.holeDepth,
                        sf: "xz"
                    });
                    rim
                        .PushSquare(geo,{
                            y: yh,
                            solid: 2,
                            w: setting.width,
                            d: setting.depth,
                            sf: "xz"
                        })
                        .Connect(geo);
                    rim.PushSquare(geo,{
                        y: yh,
                        solid: 2,
                        w: setting.width,
                        d: setting.depth,
                        sf: "xz"
                    });
                    rim
                        .PushSquare(geo,{
                            solid: 2,
                            w: setting.width,
                            d: setting.depth,
                            sf: "xz",
                            y: yh - setting.h
                        })
                        .Connect(geo);
                    rim.PushSquare(geo,{
                        solid: 2,
                        w: setting.width,
                        d: setting.depth,
                        sf: "xz",
                        y: yh - setting.h
                    });
                    rim
                        .PushSquare(geo,{
                            solid: 2,
                            x: setting.holePosX,
                            z: setting.holePosZ,
                            w: setting.holeWidth,
                            d: setting.holeDepth,
                            sf: "xz",
                            y: yh - setting.h
                        })
                        .Connect(geo);
                    rim.PushSquare(geo,{
                        solid: 2,
                        x: setting.holePosX,
                        z: setting.holePosZ,
                        w: setting.holeWidth,
                        d: setting.holeDepth,
                        sf: "xz",
                        y: yh - setting.h
                    });
                    rim
                        .PushSquare(geo,{
                            y: yh,
                            solid: 2,
                            x: setting.holePosX,
                            z: setting.holePosZ,
                            w: setting.holeWidth,
                            d: setting.holeDepth,
                            sf: "xz"
                        })
                        .Connect(geo);
                }
            }

            if (setting.parts[1] == 1) {
                var yh = 0;

                for (var i = 0; i < setting.stages.length; i++) {
                    yh += setting.stages[i];
                }

                rim
                    .PushSquare(geo,{
                        y: yh,
                        solid: 2,
                        w: setting.width + setting.h * 0.2,
                        d: setting.depth + setting.h * 0.2,
                        sf: "xz"
                    })
                    .PushSquare(geo,{
                        y: 0,
                        solid: 2,
                        w: setting.width + setting.h,
                        d: setting.depth + setting.h,
                        sf: "xz"
                    })
                    .Connect(geo);

                rim
                    .PushSquare(geo,{
                        y: yh,
                        solid: 2,
                        w: setting.width + setting.h * 0.2,
                        d: setting.depth + setting.h * 0.2,
                        sf: "xz"
                    })
                    .PushSquare(geo,{
                        y: 0,
                        solid: 2,
                        w: setting.width + setting.h,
                        d: setting.depth + setting.h,
                        sf: "xz"
                    })
                    .Connect(geo,null,null,1);
            }

            if (setting.parts[2] == 1) {
                var yh = 0;

                for (var i = 0; i < setting.stages.length; i++) {
                    yh += setting.stages[i];
                }

                rim
                    .PushSquare(geo,{
                        y: yh + 2.5,
                        solid: 2,
                        x: setting.holePosX,
                        z: setting.holePosZ,
                        w: setting.holeWidth,
                        d: setting.holeDepth,
                        sf: "xz"
                    })
                    .PushSquare(geo,{
                        y: 0,
                        solid: 2,
                        x: setting.holePosX,
                        z: setting.holePosZ,
                        w: setting.holeWidth,
                        d: setting.holeDepth,
                        sf: "xz"
                    })
                    .Connect(geo);

                rim
                    .PushSquare(geo,{
                        y: yh + 2.5,
                        solid: 2,
                        x: setting.holePosX,
                        z: setting.holePosZ,
                        w: setting.holeWidth,
                        d: setting.holeDepth,
                        sf: "xz"
                    })
                    .PushSquare(geo,{
                        y: yh + 2.5,
                        solid: 2,
                        x: setting.holePosX,
                        z: setting.holePosZ,
                        w: 0,
                        d: 0,
                        sf: "xz"
                    })
                    .Connect(geo,null,null,1);
            }

            if (setting.parts[3] == 1) {
                var yh = 0;

                for (var i = 0; i < setting.stages.length; i++) {
                    yh += setting.stages[i];
                }

                rim
                    .PushSquare(geo,{
                        y: yh + setting.h * 0.2,
                        solid: 2,
                        w: 0,
                        d: 0,
                        sf: "xz"
                    })
                    .PushSquare(geo,{
                        y: yh + setting.h * 0.2,
                        solid: 2,
                        w: setting.width + setting.h * 0.2,
                        d: setting.depth + setting.h * 0.2,
                        sf: "xz"
                    })
                    .Connect(geo)
                    .PushSquare(geo,{
                        y: 0,
                        solid: 2,
                        w: setting.width + setting.h,
                        d: setting.depth + setting.h,
                        sf: "xz"
                    })
                    .Connect(geo);
            }
        },
        setting: {
            default: {
                width: 20,
                height: 20,
                exp_stair_width: 2.5,
                exp_stair_depth: 2.5,
                exp_stair_position_x: 1,
                exp_stair_position_z: 1,
                stages_height_s: [0],
                parts: [1,0]
            },
            glassOutWall: {
                width: 20,
                height: 20,
                exp_stair_width: 2.5,
                exp_stair_depth: 2.5,
                exp_stair_position_x: 1,
                exp_stair_position_z: 1,
                stages_height_s: [0],
                parts: [0,1]
            },
            asansor: {
                width: 20,
                height: 20,
                exp_stair_width: 2.5,
                exp_stair_depth: 2.5,
                exp_stair_position_x: 1,
                exp_stair_position_z: 1,
                stages_height_s: [0],
                parts: [0,0,1]
            },
            dragBox: {
                width: 20,
                height: 20,
                exp_stair_width: 2.5,
                exp_stair_depth: 2.5,
                exp_stair_position_x: 1,
                exp_stair_position_z: 1,
                stages_height_s: [0],
                parts: [0,0,0,1]
            }
        },
        variant: {
            default: function (pm) {
                return {
                    default: {
                        width: def(pm.width,20),
                        depth: def(pm.depth,20),
                        holeWidth: def(pm.exp_stair_width,2.5),
                        holeDepth: def(pm.exp_stair_depth,4),
                        holePosX: def(pm.exp_stair_position_x,1),
                        holePosZ: def(pm.exp_stair_position_z,1),
                        h: 0.2,
                        stages: def(pm.mul_stages_height_s,[0,3.2]),
                        parts: [1],
                        sys_pick: 1
                    },
                    glassOutWall: {
                        width: def(pm.width,20),
                        depth: def(pm.depth,20),
                        holeWidth: def(pm.exp_stair_width,2.5),
                        holeDepth: def(pm.exp_stair_depth,4),
                        holePosX: def(pm.exp_stair_position_x,1),
                        holePosZ: def(pm.exp_stair_position_z,1),
                        h: 0.2,
                        stages: def(pm.mul_stages_height_s,[0,3.2]),
                        parts: [0,1]
                    },
                    asansor: {
                        width: def(pm.width,20),
                        depth: def(pm.depth,20),
                        holeWidth: def(pm.exp_stair_width,2.5),
                        holeDepth: def(pm.exp_stair_depth,4),
                        holePosX: def(pm.exp_stair_position_x,1),
                        holePosZ: def(pm.exp_stair_position_z,1),
                        h: 0.2,
                        stages: def(pm.mul_stages_height_s,[0,3.2]),
                        parts: [0,0,1]
                    },
                    dragBox: {
                        width: def(pm.width,20),
                        depth: def(pm.depth,20),
                        holeWidth: def(pm.exp_stair_width,2.5),
                        holeDepth: def(pm.exp_stair_depth,4),
                        holePosX: def(pm.exp_stair_position_x,1),
                        holePosZ: def(pm.exp_stair_position_z,1),
                        h: 0.2,
                        stages: def(pm.mul_stages_height_s,[0,3.2]),
                        parts: [0,0,0,1]
                    }
                };
            }
        },
        materials: {
            default: function (pm) {
                return new BABYLONX.ShaderBuilder()
                    .Solid()
                    .Func(function (me) {
                        me.Setting.FragmentWorld = 1;
                        me.InLine(
                            ` vec3 wpos = vec4(world*vec4(pos,1.)).xyz;vec3 wnrm =  mat3(world)*nrm; `
                        );
                        return me;
                    })
                    .InLine(
                        `
                    float fs = pow(dot(wnrm,normalize( camera-wpos)),1.);
                    result = vec4(0.75*vec3(fs*0.2+0.6 -max(0.,min(1.,length(pos)/300.))*0.2 ),1.);

                    float far =  1.-max(0., min(1., length(camera-wpos)/50.));
                    
                    if(nrm.y > 0.5){

                    result.xyz = vec3(0.75)+fs*0.25
                    +0.125*far*(0.25-max(pow(abs(sin(pos.x*8.+0.01)),483.),pow(abs(sin(pos.z*8.+0.01)),483.))*0.25)
                    +0.25*far*(0.25-max(pow(abs(sin(pos.x*8.+0.01)),483.),pow(abs(sin(pos.z*8.+0.01)),483.))*0.25);

                    } else  if(nrm.y < -0.5){

                        result.xyz = vec3(0.75) +
                          ( 0.5*far)*max(1.,((sin(pos.x*1.)+sin(pos.z*1.)) * (sin(pos.x*20.)+sin(pos.z*20.))))*0.15;
    

                    }

                    `
                    )
                    .Func(me => {
                        if (pm.trans)
                            me.Transparency().InLine(`
            
            result.w = (pow(sin(pos.x+pos.z+time*0.05),3.)*0.1) +0.1;`);
                        return me;
                    });
            },
            glassOutWall: function (pm) {
                return new BABYLONX.ShaderBuilder()
                    .Solid()
                    .Transparency()
                    .Func(function (me) {
                        me.Setting.FragmentWorld = 1;
                        me.InLine(
                            `vec3 wpos = vec4(world*vec4(pos,1.)).xyz;vec3 wnrm =  mat3(world)*nrm;`
                        );
                        return me;
                    }).InLine(`

                    float w2  = max(0.,abs(sin(pos.x*3.33+3.14159265*0.5)*1000.)-998.);
                    w2  = max(w2,abs(sin(pos.z*3.33+3.14159265*0.5)*1000.)-998.);
                    w2  = max(w2,abs(sin(pos.y*3.33+3.14159265*0.5)*1000.)-998.);

                    w2 *= 1.-max(0., min(1., length(camera-wpos)/50.));
    
                    float fs = pow(dot(wnrm,normalize( camera-wpos)),1.);

                    
                    result = vec4(mix(vec3(0.5 ),vec3(0.,0.5,0.9 ),w2*0.2+pow(fs,2.)*2.),0.1+fs*0.1+w2*0.4);
                    result.xyz = vec3(0.75)+0.25*result.xyz;
                    
                    `).Func(me => {
                        if (pm.trans)
                            me.Transparency().InLine(`
            
            result.w = (pow(sin(pos.x+pos.z+time*0.05),3.)*0.1) +0.1;`);
                        return me;
                    });;
            },
            asansor: function (pm) {
                return new BABYLONX.ShaderBuilder().Discard();
            },
            dragBox: function (pm) {
                return new BABYLONX.ShaderBuilder().Discard();
            }
        }
    },
    building_poly: {
        builder: function (setting,geo) {
            ind = 0;
            setting.holePosX = max(-setting.width / 2 + setting.holeWidth / 2,
                min(
                    setting.width / 2 - setting.holeWidth / 2,
                    def(setting.holePosX,0) - setting.width / 2
                )
            );

            setting.holePosZ = max(-setting.depth / 2 + setting.holeDepth / 2,
                min(
                    setting.depth / 2 - setting.holeDepth / 2,
                    def(setting.holePosZ,0) - setting.depth / 2
                )
            );

            var rim = new GB.Rims();

            if (setting.parts[0] == 1) {
                var yh = 0;

                for (var i = 0; i < setting.stages.length; i++) {
                    yh += setting.stages[i];

                    rim.PushCircle(geo,{
                        s: setting.holeSeg,
                        y: yh,
                        solid: 2,
                        x: setting.holePosX,
                        z: setting.holePosZ,
                        w: setting.holeWidth,
                        d: setting.holeDepth,
                        sf: "xz"
                    });
                    rim
                        .PushCircle(geo,{
                            s: setting.seg,
                            y: yh,
                            solid: 2,
                            w: setting.width,
                            d: setting.depth,
                            sf: "xz"
                        })
                        .Connect(geo);
                    rim.PushCircle(geo,{
                        s: setting.seg,
                        y: yh,
                        solid: 2,
                        w: setting.width,
                        d: setting.depth,
                        sf: "xz"
                    });
                    rim
                        .PushCircle(geo,{
                            s: setting.seg,
                            solid: 2,
                            w: setting.width,
                            d: setting.depth,
                            sf: "xz",
                            y: yh - setting.h
                        })
                        .Connect(geo);
                    rim.PushCircle(geo,{
                        s: setting.seg,
                        solid: 2,
                        w: setting.width,
                        d: setting.depth,
                        sf: "xz",
                        y: yh - setting.h
                    });
                    rim
                        .PushCircle(geo,{
                            s: setting.holeSeg,
                            solid: 2,
                            x: setting.holePosX,
                            z: setting.holePosZ,
                            w: setting.holeWidth,
                            d: setting.holeDepth,
                            sf: "xz",
                            y: yh - setting.h
                        })
                        .Connect(geo);
                    rim.PushCircle(geo,{
                        s: setting.holeSeg,
                        solid: 2,
                        x: setting.holePosX,
                        z: setting.holePosZ,
                        w: setting.holeWidth,
                        d: setting.holeDepth,
                        sf: "xz",
                        y: yh - setting.h
                    });
                    rim
                        .PushCircle(geo,{
                            s: setting.holeSeg,
                            y: yh,
                            solid: 2,
                            x: setting.holePosX,
                            z: setting.holePosZ,
                            w: setting.holeWidth,
                            d: setting.holeDepth,
                            sf: "xz"
                        })
                        .Connect(geo);
                }
            }

            if (setting.parts[1] == 1) {
                var yh = 0;

                for (var i = 0; i < setting.stages.length; i++) {
                    yh += setting.stages[i];
                }

                rim
                    .PushCircle(geo,{
                        s: setting.seg,
                        y: yh,
                        solid: 2,
                        w: setting.width + setting.h * 0.2,
                        d: setting.depth + setting.h * 0.2,
                        sf: "xz"
                    })
                    .PushCircle(geo,{
                        s: setting.seg,
                        y: 0,
                        solid: 2,
                        w: setting.width + setting.h,
                        d: setting.depth + setting.h,
                        sf: "xz"
                    })
                    .Connect(geo,null,null,1);

                rim
                    .PushCircle(geo,{
                        s: setting.seg,
                        y: yh,
                        solid: 2,
                        w: setting.width + setting.h * 0.2,
                        d: setting.depth + setting.h * 0.2,
                        sf: "xz"
                    })
                    .PushCircle(geo,{
                        s: setting.seg,
                        y: 0,
                        solid: 2,
                        w: setting.width + setting.h,
                        d: setting.depth + setting.h,
                        sf: "xz"
                    })
                    .Connect(geo);
            }

            if (setting.parts[2] == 1) {
                var yh = 0;

                for (var i = 0; i < setting.stages.length; i++) {
                    yh += setting.stages[i];
                }

                rim
                    .PushCircle(geo,{
                        s: setting.holeSeg,
                        y: yh + 2.5,
                        solid: 2,
                        x: setting.holePosX,
                        z: setting.holePosZ,
                        w: setting.holeWidth,
                        d: setting.holeDepth,
                        sf: "xz"
                    })
                    .PushCircle(geo,{
                        s: setting.holeSeg,
                        y: 0,
                        solid: 2,
                        x: setting.holePosX,
                        z: setting.holePosZ,
                        w: setting.holeWidth,
                        d: setting.holeDepth,
                        sf: "xz"
                    })
                    .Connect(geo);

                rim
                    .PushCircle(geo,{
                        s: setting.holeSeg,
                        y: yh + 2.5,
                        solid: 2,
                        x: setting.holePosX,
                        z: setting.holePosZ,
                        w: setting.holeWidth,
                        d: setting.holeDepth,
                        sf: "xz"
                    })
                    .PushCircle(geo,{
                        s: setting.holeSeg,
                        y: yh + 2.5,
                        solid: 2,
                        x: setting.holePosX,
                        z: setting.holePosZ,
                        w: 0,
                        d: 0,
                        sf: "xz"
                    })
                    .Connect(geo,null,null,1);
            }

            if (setting.parts[3] == 1) {
                var yh = 0;

                for (var i = 0; i < setting.stages.length; i++) {
                    yh += setting.stages[i];
                }

                rim
                    .PushCircle(geo,{
                        s: setting.holeSeg,
                        y: yh + setting.h * 0.2,
                        solid: 2,
                        w: 0,
                        d: 0,
                        sf: "xz"
                    })
                    .PushCircle(geo,{
                        s: setting.seg,
                        y: yh + setting.h * 0.2,
                        solid: 2,
                        w: setting.width + setting.h * 0.2,
                        d: setting.depth + setting.h * 0.2,
                        sf: "xz"
                    })
                    .Connect(geo)
                    .PushCircle(geo,{
                        s: setting.seg,
                        y: 0,
                        solid: 2,
                        w: setting.width + setting.h,
                        d: setting.depth + setting.h,
                        sf: "xz"
                    })
                    .Connect(geo);
            }
        },
        setting: {
            default: {
                exp_segment: 30,
                width: 20,
                height: 20,
                exp_stair_seg: 20,
                exp_stair_width: 2.5,
                exp_stair_depth: 2.5,
                exp_stair_position_x: 1,
                exp_stair_position_z: 1,
                stages_height_s: [0],
                parts: [1,0]
            },
            glassOutWall: {
                exp_segment: 30,
                width: 20,
                height: 20,
                exp_stair_seg: 20,
                exp_stair_width: 2.5,
                exp_stair_depth: 2.5,
                exp_stair_position_x: 1,
                exp_stair_position_z: 1,
                stages_height_s: [0],
                parts: [0,1]
            },
            asansor: {
                exp_segment: 30,
                width: 20,
                height: 20,
                exp_stair_seg: 20,
                exp_stair_width: 2.5,
                exp_stair_depth: 2.5,
                exp_stair_position_x: 1,
                exp_stair_position_z: 1,
                stages_height_s: [0],
                parts: [0,0,1]
            },
            dragBox: {
                exp_segment: 30,
                width: 20,
                height: 20,
                exp_stair_seg: 20,
                exp_stair_width: 2.5,
                exp_stair_depth: 2.5,
                exp_stair_position_x: 1,
                exp_stair_position_z: 1,
                stages_height_s: [0],
                parts: [0,0,0,1]
            }
        },
        variant: {
            default: function (pm) {
                return {
                    default: {
                        seg: def(pm.exp_segment,20),
                        holeSeg: def(pm.exp_stair_seg,20),
                        width: def(pm.width,20),
                        depth: def(pm.depth,20),
                        holeWidth: def(pm.exp_stair_width,2.5),
                        holeDepth: def(pm.exp_stair_depth,4),
                        holePosX: def(pm.exp_stair_position_x,1),
                        holePosZ: def(pm.exp_stair_position_z,1),
                        h: 0.2,
                        stages: def(pm.mul_stages_height_s,[0,3.2]),
                        parts: [1]
                    },
                    glassOutWall: {
                        seg: def(pm.exp_segment,20),
                        holeSeg: def(pm.exp_stair_seg,20),

                        width: def(pm.width,20),
                        depth: def(pm.depth,20),
                        holeWidth: def(pm.exp_stair_width,2.5),
                        holeDepth: def(pm.exp_stair_depth,4),
                        holePosX: def(pm.exp_stair_position_x,1),
                        holePosZ: def(pm.exp_stair_position_z,1),
                        h: 0.2,
                        stages: def(pm.mul_stages_height_s,[0,3.2]),
                        parts: [0,1]
                    },
                    asansor: {
                        seg: def(pm.exp_segment,20),
                        holeSeg: def(pm.exp_stair_seg,20),

                        width: def(pm.width,20),
                        depth: def(pm.depth,20),
                        holeWidth: def(pm.exp_stair_width,2.5),
                        holeDepth: def(pm.exp_stair_depth,4),
                        holePosX: def(pm.exp_stair_position_x,1),
                        holePosZ: def(pm.exp_stair_position_z,1),
                        h: 0.2,
                        stages: def(pm.mul_stages_height_s,[0,3.2]),
                        parts: [0,0,1]
                    },
                    dragBox: {
                        seg: def(pm.exp_segment,20),
                        holeSeg: def(pm.exp_stair_seg,20),

                        width: def(pm.width,20),
                        depth: def(pm.depth,20),
                        holeWidth: def(pm.exp_stair_width,2.5),
                        holeDepth: def(pm.exp_stair_depth,4),
                        holePosX: def(pm.exp_stair_position_x,1),
                        holePosZ: def(pm.exp_stair_position_z,1),
                        h: 0.2,
                        stages: def(pm.mul_stages_height_s,[0,3.2]),
                        parts: [0,0,0,1],
                        sys_pick: 1
                    }
                };
            }
        },
        materials: {
            default: function (pm) {
                return new BABYLONX.ShaderBuilder().Solid().Func(function (me) {
                    me.Setting.FragmentWorld = 1;
                    me.InLine(
                        `vec3 wpos = vec4(world*vec4(pos,1.)).xyz;vec3 wnrm =  mat3(world)*nrm;`
                    );
                    return me;
                }).InLine(`
                    float fs = pow(dot(wnrm,normalize( camera-wpos)),1.);
                    result = vec4(vec3(fs*0.2+0.9 -max(0.,min(1.,length(pos)/300.))*0.2 ),1.);`);
            },
            glassOutWall: function (pm) {
                return new BABYLONX.ShaderBuilder()
                    .Solid()
                    .Transparency()
                    .Func(function (me) {
                        me.Setting.FragmentWorld = 1;
                        me.InLine(
                            `vec3 wpos = vec4(world*vec4(pos,1.)).xyz;vec3 wnrm =  mat3(world)*nrm;`
                        );
                        return me;
                    }).InLine(`

                    float w2  = max(0.,abs(sin(pos.x*3.33+3.14159265*0.5)*1000.)-998.);
                    w2  = max(w2,abs(sin(pos.z*3.33+3.14159265*0.5)*1000.)-998.);
                    w2  = max(w2,abs(sin(pos.y*3.33+3.14159265*0.5)*1000.)-998.);

                    w2 *= 1.-max(0., min(1., length(camera-wpos)/50.));
    
                    float fs = pow(dot(wnrm,normalize( camera-wpos)),1.);
                    result = vec4(mix(vec3(0.5 ),vec3(0.,0.5,0.9 ),w2*0.2+pow(fs,2.)*2.),0.1+fs*0.1+w2*0.4);`);
            },
            asansor: function (pm) {
                return new BABYLONX.ShaderBuilder().Discard();
            },
            dragBox: function (pm) {
                return new BABYLONX.ShaderBuilder().Discard();
            }
        }
    },
    desk_simple: {
        builder: function (setting,geo) {

            setting.type = def(setting.type,0.);
            setting.kind = setting.type + 1;

            if (setting.kind == 1) {

                switch (setting.size % 5) {
                    case 0: {
                        setting.width = 10.0;
                        setting.length = 6.0;
                        break;
                    }
                    case 1: {
                        setting.width = 12.0;
                        setting.length = 6.0;
                        break;
                    }
                    case 2: {
                        setting.width = 10.0;
                        setting.length = 10.0;
                        break;
                    }
                    case 3: {
                        setting.width = 10.0;
                        setting.length = 12.0;
                        break;
                    }
                    case 4: {
                        setting.width = 20.0;
                        setting.length = 12.0;
                        break;
                    }

                }
            } else if (setting.kind == 2) {

                switch (setting.size % 5) {
                    case 0: {
                        setting.width = 10.0;
                        setting.length = 6.0;
                        break;
                    }
                    case 1: {
                        setting.width = 12.0;
                        setting.length = 6.0;
                        break;
                    }
                    case 2: {
                        setting.width = 10.0;
                        setting.length = 10.0;
                        break;
                    }
                    case 3: {
                        setting.width = 10.0;
                        setting.length = 12.0;
                        break;
                    }
                    case 4: {
                        setting.width = 20.0;
                        setting.length = 12.0;
                        break;
                    }

                }
            }
            else if (setting.kind == 3) {

                switch (setting.size % 5) {
                    case 0: {
                        setting.width = 10.0;
                        setting.length = 10.0;
                        break;
                    }
                    case 1: {
                        setting.width = 20.0;
                        setting.length = 10.0;
                        break;
                    }
                    case 2: {
                        setting.width = 20.0;
                        setting.length = 20.0;
                        break;
                    }
                    case 3: {
                        setting.width = 30.0;
                        setting.length = 20.0;
                        break;
                    }
                    case 4: {
                        setting.width = 40.0;
                        setting.length = 20.0;
                        break;
                    }

                }
            }
            else if (setting.kind == 4) {

                switch (setting.size % 5) {
                    case 0: {
                        setting.width = 10.0;
                        setting.length = 10.0;
                        break;
                    }
                    case 1: {
                        setting.width = 20.0;
                        setting.length = 10.0;
                        break;
                    }
                    case 2: {
                        setting.width = 20.0;
                        setting.length = 20.0;
                        break;
                    }
                    case 3: {
                        setting.width = 30.0;
                        setting.length = 20.0;
                        break;
                    }
                    case 4: {
                        setting.width = 40.0;
                        setting.length = 20.0;
                        break;
                    }

                }
            }



            if (setting.kind == 2) {
                setting.rad = 0.01;
            } else setting.rad = 0.35;

            ind = 0;

            var col = setting.col;
            var colin = setting.colin;

            var cus = function (p,op) {
                p = p_ts(p,op.ts || {});
                return p;
            };

            var roundedRect = function (op) {
                return {
                    count: op.seg,
                    point: function (p,i1) {
                        var i = i1;

                        if (i1 == op.seg - 1) i = 0;

                        var seg = op.seg - 1;
                        p.x = sin(i * deg * 360 / seg) * op.r;
                        p.z = cos(i * deg * 360 / seg) * op.r;

                        if (p.x > 0) p.x += (op.w - op.r) / 2;
                        else if (p.x < 0) p.x -= (op.w - op.r) / 2;

                        if (p.z > 0) p.z += (op.d - op.r) / 2;
                        else if (p.z < 0) p.z -= (op.d - op.r) / 2;

                        return op.cus(p,op);
                    }
                };
            };

            var points = function (op,cus) {
                return {
                    count: op.length,
                    point: function (p,i) {
                        p.x = op[i].x;
                        p.z = op[i].z;
                        p.y = op[i].y;

                        return cus(p,op);
                    }
                };
            };


            if (setting.kind == 1 || setting.kind == 2) {
                var rim = new GB.Rims();


                rim.PushRim(
                    geo,
                    roundedRect({
                        w: setting.width,
                        d: setting.length,
                        r: setting.rad,
                        seg: setting.seg,
                        ts: { my: setting.height },
                        cus: cus
                    })
                );
                rim
                    .PushRim(
                        geo,
                        roundedRect({
                            w: setting.width,
                            d: setting.length,
                            r: setting.rad,
                            seg: setting.seg,
                            ts: { my: setting.height + setting.depth },
                            cus: cus
                        })
                    )
                    .Connect(geo,null,null,1);
                rim.PushRim(
                    geo,
                    roundedRect({
                        w: setting.width,
                        d: setting.length,
                        r: setting.rad,
                        seg: setting.seg,
                        ts: { my: setting.height + setting.depth },
                        cus: cus
                    })
                );
                rim
                    .PushRim(
                        geo,
                        points([{ x: 0,y: setting.height + setting.depth,z: 0 }],cus)
                    )
                    .Connect(geo,null,null,1);
                rim.PushRim(
                    geo,
                    roundedRect({
                        w: setting.width,
                        d: setting.length,
                        r: setting.rad,
                        seg: setting.seg,
                        ts: { my: setting.height },
                        cus: cus
                    })
                );
                rim
                    .PushRim(geo,points([{ x: 0,y: setting.height,z: 0 }],cus))
                    .Connect(geo,null,null,0);

                rim.PushRim(
                    geo,
                    roundedRect({
                        w: setting.width - setting.rad * 0.31,
                        d: setting.length - setting.rad * 0.31,
                        r: setting.rad,
                        seg: setting.seg,
                        ts: { my: setting.height },
                        cus: cus
                    })
                );
                rim
                    .PushRim(
                        geo,
                        roundedRect({
                            w: setting.width - setting.rad * 0.31,
                            d: setting.length - setting.rad * 0.31,
                            r: setting.rad,
                            seg: setting.seg,
                            ts: { my: setting.height - setting.depth2 },
                            cus: cus
                        })
                    )
                    .Connect(geo);

                rim.PushRim(
                    geo,
                    roundedRect({
                        w: setting.width - setting.rad * 0.31,
                        d: setting.length - setting.rad * 0.31,
                        r: setting.rad,
                        seg: setting.seg,
                        ts: { my: setting.height - setting.depth2 },
                        cus: cus
                    })
                );
                rim
                    .PushRim(
                        geo,
                        roundedRect({
                            w: setting.width - setting.rad * 0.51,
                            d: setting.length - setting.rad * 0.51,
                            r: setting.rad,
                            seg: setting.seg,
                            ts: { my: setting.height - setting.depth2 },
                            cus: cus
                        })
                    )
                    .Connect(geo);
                rim.PushRim(
                    geo,
                    roundedRect({
                        w: setting.width - setting.rad * 0.51,
                        d: setting.length - setting.rad * 0.51,
                        r: setting.rad,
                        seg: setting.seg,
                        ts: { my: setting.height - setting.depth2 },
                        cus: cus
                    })
                );
                rim
                    .PushRim(
                        geo,
                        roundedRect({
                            w: setting.width - setting.rad * 0.51,
                            d: setting.length - setting.rad * 0.51,
                            r: setting.rad,
                            seg: setting.seg,
                            ts: { my: setting.height },
                            cus: cus
                        })
                    )
                    .Connect(geo);


            }

            function column(x,z) {
                if (scene.initOnly2D) return false;
                var rim = new GB.Rims();
                rim.PushRim(
                    geo,
                    roundedRect({
                        w: setting.rad * 0.05 * col,
                        d: setting.rad * 0.05 * col,
                        r: setting.rad * col * 0.05,
                        seg: 12,
                        ts: {
                            mx: -x * colin + Math.sign(x) * 0.5 + x * setting.width * 0.5,
                            mz: -z * colin + Math.sign(z) * 0.5 + z * setting.length * 0.5,
                            my: 0.0
                        },
                        cus: cus
                    })
                );
                rim
                    .PushRim(
                        geo,
                        roundedRect({
                            w: col * setting.rad * 0.2,
                            d: col * setting.rad * 0.2,
                            r: col * setting.rad * 0.2,
                            seg: 12,
                            ts: {
                                mx:
                                    -x * colin + x * setting.width * 0.5 - x * setting.rad * 0.3,
                                mz:
                                    -z * colin + z * setting.length * 0.5 - z * setting.rad * 0.3,
                                my: setting.height
                            },
                            cus: cus
                        })
                    )
                    .Connect(geo,null,null,1);

                rim.PushRim(
                    geo,
                    roundedRect({
                        w: setting.rad * 0.05 * col,
                        d: setting.rad * 0.05 * col,
                        r: setting.rad * col * 0.05,
                        seg: 12,
                        ts: {
                            mx: -x * colin + Math.sign(x) * 0.5 + x * setting.width * 0.5,
                            mz: -z * colin + Math.sign(z) * 0.5 + z * setting.length * 0.5,
                            my: 0.0
                        },
                        cus: cus
                    })
                );
                rim
                    .PushRim(
                        geo,
                        points(
                            [{
                                x: -x * colin + Math.sign(x) * 0.5 + x * setting.width * 0.5,
                                z: -z * colin + Math.sign(z) * 0.5 + z * setting.length * 0.5,
                                y: 0.0
                            }],
                            cus
                        )
                    )
                    .Connect(geo);
            }

            if (setting.kind == 3 || setting.kind == 4) {


                var rim = new GB.Rims()
                    .PushCircle(geo,{
                        s: setting.seg * 2.,sf: 'xz',y: setting.height - 0.25,
                        w: setting.width * (setting.kind == 4 ? 0.75 : 0.),d: setting.length * (setting.kind == 4 ? 0.75 : 0.)
                    })
                    .PushCircle(geo,{
                        s: setting.seg * 2.,sf: 'xz',y: setting.height - 0.25,
                        w: setting.width * 1.52,d: setting.length * 1.52
                    })
                    .Connect(geo,null,null,1)
                    .PushCircle(geo,{
                        s: setting.seg * 2.,sf: 'xz',y: setting.height - 0.25,
                        w: setting.width * 1.52,d: setting.length * 1.52
                    })
                    .PushCircle(geo,{
                        s: setting.seg * 2.,sf: 'xz',y: setting.height,
                        w: setting.width * 1.52,d: setting.length * 1.52
                    })
                    .Connect(geo,null,null,1)
                    .PushCircle(geo,{
                        s: setting.seg * 2.,sf: 'xz',y: setting.height,
                        w: setting.width * 1.52,d: setting.length * 1.52
                    })
                    .PushCircle(geo,{
                        s: setting.seg * 2.,sf: 'xz',y: setting.height,
                        w: setting.width * (setting.kind == 4 ? 0.75 : 0.),d: setting.length * (setting.kind == 4 ? 0.75 : 0.)
                    })
                    .Connect(geo,null,null,1)
                    .PushCircle(geo,{
                        s: setting.seg * 2.,sf: 'xz',y: setting.height,
                        w: setting.width * (setting.kind == 4 ? 0.75 : 0.),d: setting.length * (setting.kind == 4 ? 0.75 : 0.)
                    })
                    .PushCircle(geo,{
                        s: setting.seg * 2.,sf: 'xz',y: setting.height - 0.25,
                        w: setting.width * (setting.kind == 4 ? 0.75 : 0.),d: setting.length * (setting.kind == 4 ? 0.75 : 0.)
                    })
                    .Connect(geo,null,null,1);;
            }


            if (setting.kind == 1 || setting.kind == 3) {
                column(1,1);
                column(-1,1);
                column(1,-1);
                column(-1,-1);
            } else if (setting.kind == 2 || setting.kind == 4) {
                var rim = new GB.Rims()
                    .PushSquare(geo,{
                        sf: 'zy',solid: 2,w: setting.length,d: setting.height - 0.25,
                        x: setting.width * 0.5,y: (setting.height - 0.125) * 0.5
                    })
                    .PushSquare(geo,{
                        sf: 'zy',solid: 2,w: setting.length,d: setting.height - 0.25,
                        x: setting.width * 0.5 - 0.25,y: (setting.height - 0.125) * 0.5
                    })
                    .Connect(geo)
                    .PushSquare(geo,{
                        sf: 'zy',solid: 2,w: setting.length,d: setting.height - 0.25,
                        x: setting.width * 0.5 - 0.25,y: (setting.height - 0.125) * 0.5
                    })
                    .PushSquare(geo,{
                        sf: 'zy',solid: 2,w: setting.length - 0.25,d: setting.height - 0.5,
                        x: setting.width * 0.5 - 0.25,y: (setting.height - 0.125) * 0.5
                    })
                    .Connect(geo)
                    .PushSquare(geo,{
                        sf: 'zy',solid: 2,w: setting.length - 0.25,d: setting.height - 0.5,
                        x: setting.width * 0.5 - 0.25,y: (setting.height - 0.125) * 0.5
                    })
                    .PushSquare(geo,{
                        sf: 'zy',solid: 2,w: setting.length - 0.5,d: setting.height - 0.75,
                        x: setting.width * 0.5,y: (setting.height - 0.125) * 0.5
                    })
                    .Connect(geo)
                    .PushSquare(geo,{
                        sf: 'zy',solid: 2,w: setting.length - 0.5,d: setting.height - 0.75,
                        x: setting.width * 0.5,y: (setting.height - 0.125) * 0.5
                    })
                    .PushSquare(geo,{
                        sf: 'zy',solid: 2,w: setting.length,d: setting.height - 0.25,
                        x: setting.width * 0.5,y: (setting.height - 0.125) * 0.5
                    })
                    .Connect(geo);

                rim.PushSquare(geo,{
                    sf: 'zy',solid: 2,w: setting.length,d: setting.height - 0.25,
                    x: -setting.width * 0.5,y: (setting.height - 0.125) * 0.5
                })
                    .PushSquare(geo,{
                        sf: 'zy',solid: 2,w: setting.length,d: setting.height - 0.25,
                        x: -setting.width * 0.5 + 0.25,y: (setting.height - 0.125) * 0.5
                    })
                    .Connect(geo,null,null,1)
                    .PushSquare(geo,{
                        sf: 'zy',solid: 2,w: setting.length,d: setting.height - 0.25,
                        x: -setting.width * 0.5 + 0.25,y: (setting.height - 0.125) * 0.5
                    })
                    .PushSquare(geo,{
                        sf: 'zy',solid: 2,w: setting.length - 0.25,d: setting.height - 0.5,
                        x: -setting.width * 0.5 + 0.25,y: (setting.height - 0.125) * 0.5
                    })
                    .Connect(geo,null,null,1)
                    .PushSquare(geo,{
                        sf: 'zy',solid: 2,w: setting.length - 0.25,d: setting.height - 0.5,
                        x: -setting.width * 0.5 + 0.25,y: (setting.height - 0.125) * 0.5
                    })
                    .PushSquare(geo,{
                        sf: 'zy',solid: 2,w: setting.length - 0.5,d: setting.height - 0.75,
                        x: -setting.width * 0.5,y: (setting.height - 0.125) * 0.5
                    })
                    .Connect(geo,null,null,1)
                    .PushSquare(geo,{
                        sf: 'zy',solid: 2,w: setting.length - 0.5,d: setting.height - 0.75,
                        x: -setting.width * 0.5,y: (setting.height - 0.125) * 0.5
                    })
                    .PushSquare(geo,{
                        sf: 'zy',solid: 2,w: setting.length,d: setting.height - 0.25,
                        x: -setting.width * 0.5,y: (setting.height - 0.125) * 0.5
                    })
                    .Connect(geo,null,null,1);
            }



        },
        setting: {
            default: {
                exp_seg: 32,
                width: 1.2,
                depth: 6.5,
                corner: 0.25,
                height: 0.74,
                exp_deep: 0.04,
                exp_down_deep: 0.02,
                exp_column_scale: 1.2,
                exp_column_in: 0.2,
                parts: [1,0]
            },
            column: {
                exp_seg: 32,
                width: 1.2,
                depth: 6.5,
                corner: 0.25,
                height: 0.74,
                exp_deep: 0.04,
                exp_down_deep: 0.02,
                exp_column_scale: 1.2,
                exp_column_in: 0.2,
                parts: [0,1]
            }
        },
        variant: {
            default: function (pm) {
                return {
                    default: {
                        seg: def(pm.exp_seg,32),
                        width: def(pm.width,1.2),
                        length: def(pm.depth,0.65),
                        rad: def(pm.corner,0.25),
                        height: def(pm.height,0.74),
                        depth: def(pm.exp_deep,0.04),
                        depth2: def(pm.exp_down_deep,0.02),
                        col: def(pm.exp_column_scale,1.2),
                        colin: def(pm.exp_column_in,0.2),
                        parts: [1]
                    }
                };
            }
        },
        materials: {
            default: function (pm) {
                return new BABYLONX.ShaderBuilder()
                    .Solid()
                    .Func(m => {
                        m.Setting.FragmentWorld = true;

                        return m;
                    })
                    .InLine(
                        `  vec3 wnm = mat3(world)*nrm;
                       vec3 wps = vec4(world*vec4(pos,1.)).xyz;
                       float fs =  dot(` +
                        BABYLONX.Normals.Flat +
                        `,normalize(camera-wps));
                        vec3 pos1 = r_z(pos,10.+float(` +
                        Math.random() +
                        `)*130.,vec3(0.))*4.;
                       float len = pow(length(wps)/10.+float(` +
                        Math.random() +
                        `)*100.,0.815);
                       float ns1 = noise(pos1*0.5*vec3(11.,12.,1.))*0.5+0.5;
                       float ns0 = noise(pos1*0.05*vec3(11.,12.,sin(pos.z)*100.))*0.5+0.5;                       
                       float pr = pow((sin(ns0*3.+sin(pos1.z*ns1*.2)*1.+pos1.x*.51+pos1.y*(5.*ns0+float(` +
                        Math.random() +
                        `)*10.)+ns1*3.)*0.5
                       +0.5),15.)*0.5;
                        float ns2 =   abs(pr* noise(3.5*pos1*vec3(1.,1.15 ,1.))*0.5+0.5) ;
                       
                        result= vec4(
                       fs*(0.12+0.25*pow((1.-pr)*0.25+0.25,2.)*ns1+ns2)*0.5+
                        mix(vec3(0.),
                       vec3(0.65,0.25,0.)-abs(pr*0.5+ ns2*0.5)*0.75+0.15*vec3(ns1 ,ns1*0.5,0.),
                       ns2),1. );   `
                    )
                    .Effect({ pr: "pr*0.9+0.1" })
                    .Func(me => {
                        if (pm.trans)
                            me.Transparency().InLine(` 
              result.w = (sin(pos.x+pos.z+time*0.05)*0.1)+0.3; `);
                        return me;
                    });
            }
        }
    },
    detail_content: {
        builder: function (setting,geo) {

            ind = 0;

            var detw = 3;
            var rim = new GB.Rims();
            if (setting.parts[0] == 1) {

                rim.PushSquare(geo,{
                    sf: 'xz',
                    w: 0.1,
                    d: setting.depth / 2. - detw,
                    z: setting.depth / 4. + detw / 2.,
                    x: 2. + setting.width / 2.
                })
                    .PushSquare(geo,{
                        sf: 'xz',
                        w: 0,
                        d: 0,
                        z: setting.depth / 4. + detw / 2.,
                        x: 2. + setting.width / 2.
                    })
                    .Connect(geo,null,null,1);

                rim.PushSquare(geo,{
                    sf: 'xz',
                    w: 0.1,
                    d: setting.depth / 2. - detw,
                    z: -setting.depth / 4. - detw / 2.,
                    x: 2. + setting.width / 2.
                })
                    .PushSquare(geo,{
                        sf: 'xz',
                        w: 0,
                        d: 0,
                        z: -setting.depth / 4. - detw / 2.,
                        x: 2. + setting.width / 2.
                    })
                    .Connect(geo,null,null,1);

                rim.PushSquare(geo,{
                    sf: 'xz',
                    w: 1.7 - 0.1,
                    d: 0.1,
                    z: -setting.depth / 2. + 0.05,
                    x: 1.15 + setting.width / 2.
                })
                    .PushSquare(geo,{
                        sf: 'xz',
                        w: 0,
                        d: 0,
                        z: -setting.depth / 2. + 0.05,
                        x: 1.15 + setting.width / 2.
                    })
                    .Connect(geo,null,null,1);

                rim.PushSquare(geo,{
                    sf: 'xz',
                    w: 1.7 - 0.1,
                    d: 0.1,
                    z: setting.depth / 2. - 0.05,
                    x: 1.15 + setting.width / 2.
                })
                    .PushSquare(geo,{
                        sf: 'xz',
                        w: 0,
                        d: 0,
                        z: setting.depth / 2. - 0.05,
                        x: 1.15 + setting.width / 2.
                    })
                    .Connect(geo,null,null,1);


                /*  */

                rim.PushSquare(geo,{
                    sf: 'xz',
                    d: 0.1,
                    w: setting.width / 2. - detw,
                    x: setting.width / 4. + detw / 2.,
                    z: 2. + setting.depth / 2.
                })
                    .PushSquare(geo,{
                        sf: 'xz',
                        w: 0,
                        d: 0,
                        x: setting.width / 4. + detw / 2.,
                        z: 2. + setting.depth / 2.
                    })
                    .Connect(geo,null,null,1);

                rim.PushSquare(geo,{
                    sf: 'xz',
                    d: 0.1,
                    w: setting.width / 2. - detw,
                    x: -setting.width / 4. - detw / 2.,
                    z: 2. + setting.depth / 2.
                })
                    .PushSquare(geo,{
                        sf: 'xz',
                        w: 0,
                        d: 0,
                        x: -setting.width / 4. - detw / 2.,
                        z: 2. + setting.depth / 2.
                    })
                    .Connect(geo,null,null,1);

                rim.PushSquare(geo,{
                    sf: 'xz',
                    d: 1.7 - 0.1,
                    w: 0.1,
                    x: -setting.width / 2. + 0.05,
                    z: 1.15 + setting.depth / 2.
                })
                    .PushSquare(geo,{
                        sf: 'xz',
                        w: 0,
                        d: 0,
                        x: -setting.width / 2. + 0.05,
                        z: 1.15 + setting.depth / 2.
                    })
                    .Connect(geo,null,null,1);

                rim.PushSquare(geo,{
                    sf: 'xz',
                    d: 1.7 - 0.1,
                    w: 0.1,
                    x: setting.width / 2. - 0.05,
                    z: 1.15 + setting.depth / 2.
                })
                    .PushSquare(geo,{
                        sf: 'xz',
                        w: 0,
                        d: 0,
                        x: setting.width / 2. - 0.05,
                        z: 1.15 + setting.depth / 2.
                    })
                    .Connect(geo,null,null,1);

            }

            if (setting.parts[1] == 1) {

                function cUV(n,u,v) {
                    geo.uvs[geo.uvs.length - n * 2 - 1] = u;
                    geo.uvs[geo.uvs.length - n * 2 - 2] = v;
                }

                function setBoxUV(x,y,u,v) {

                    cUV(5,0.5 * (x + u),0.5 * (y + v));
                    cUV(6,0.5 * (x + u),0.5 * (y + v));

                    cUV(0,x,y);
                    cUV(1,u,y);
                    cUV(2,u,v);
                    cUV(3,x,v);
                    cUV(4,x,y);
                }


                rim
                    .PushCircle(geo,{
                        s: 1,
                        sf: 'xz',
                        w: 0,
                        d: 0,
                        x: 2. + setting.width / 2.
                    })
                    .PushSquare(geo,{
                        sf: 'xz',
                        w: detw * 2.,
                        d: detw * 2.,
                        x: 2. + setting.width / 2.
                    })
                    .Connect(geo);

                setBoxUV(0,0.5,0.5,0.);


                rim.PushCircle(geo,{
                    s: 1,
                    sf: 'xz',
                    w: 0,
                    d: 0,
                    z: 2. + setting.depth / 2.
                })
                    .PushSquare(geo,{
                        sf: 'xz',
                        d: detw * 2.,
                        w: detw * 2.,
                        z: 2. + setting.depth / 2.
                    })
                    .Connect(geo);

                setBoxUV(1.0,0.,0.5,0.5);

                rim.PushCircle(geo,{
                    s: 1,
                    sf: 'xz',
                    w: 0,
                    d: 0,
                    z: -6. - setting.depth / 2.,
                    x: -9. + setting.width / 2.
                }).PushSquare(geo,{
                    sf: 'xz',
                    d: detw * 5.,
                    w: detw * 5.,
                    z: -6. - setting.depth / 2.,
                    x: -9. + setting.width / 2.
                })
                    .Connect(geo);

                setBoxUV(0.5,1.0,1.0,0.5);

                rim.PushCircle(geo,{
                    s: 1,
                    sf: 'xy',
                    w: 0,
                    d: 0,
                    z: 0.2 + setting.depth / 2.,
                    y: 1.5 * detw,
                    x: -2. * detw + setting.width / 2.
                }).PushSquare(geo,{
                    sf: 'xy',
                    d: detw * 2.,
                    w: detw * 2.,
                    z: 0.2 + setting.depth / 2.,
                    y: 1.5 * detw,
                    x: -2. * detw + setting.width / 2.
                })

                    .Connect(geo,null,null,1);

                setBoxUV(0.0,0.5,0.5,1.0);
            }


        },
        setting: {
            default: {
                width: 20,
                height: 20,
            },
        },
        variant: {
            default: function (pm) {
                return {
                    border: {
                        width: def(pm.width,30),
                        depth: def(pm.depth,20),
                        sett: { x: 0,y: 0,z: 0,w: 0. },
                        parts: [1,0]
                    },
                    content: {
                        width: def(pm.width,30),
                        depth: def(pm.depth,20),
                        sett: { x: 0,y: 0,z: 0,w: 0. },
                        parts: [0,1]
                    },
                };
            }
        },
        materials: {
            border: function (pm) {
                return new BABYLONX.ShaderBuilder().SetUniform("sett","vec4")
                    .Solid()
                    .Transparency().InLine('result.w *= sett.w;');
            },
            content: function (pm) {

                return new BABYLONX.ShaderBuilder().Func(function (me) {
                    me.Setting.VertexWorld = true;
                    me.Setting.FragmentWorld = true;

                    return me;
                })
                    .SetUniform("dynamicSample","sampler2D")
                    .SetUniform("sett","vec4")
                    .Map({ index: "dynamicSample",bias: 0,alpha: 1,uv: " vec2(  vuv.y, vuv.x)" })
                    .Transparency().InLine('result.w *= sett.w;');
            }
        }
    },
    rect2d: {
        builder: function (setting,geo) {

            ind = 0;

            var cus = function (p,op) {
                p = p_ts(p,op.ts || {});
                return p;
            };

            var points = function (op,cus) {
                return {
                    count: op.length,
                    point: function (p,i) {
                        p.x = op[i].x;
                        p.z = op[i].z;
                        p.y = op[i].y;

                        return cus(p,op);
                    }
                };
            };

            var roundedRect = function (op) {
                return {
                    count: op.seg,
                    point: function (p,i1) {
                        var i = i1;

                        if (i1 == op.seg - 1) i = 0;

                        var seg = op.seg - 1;
                        p.x = sin(i * deg * 360. / seg) * op.r;
                        p.z = cos(i * deg * 360. / seg) * op.r;

                        if (p.x > 0.) p.x += (op.w - op.r) / 2.;
                        else if (p.x < 0.) p.x -= (op.w - op.r) / 2.;

                        if (p.z > 0.) p.z += (op.d - op.r) / 2.;
                        else if (p.z < 0.) p.z -= (op.d - op.r) / 2.;


                        return op.cus(p,op);
                    }
                };
            };

            if (setting.parts[0] == 1) {
                var rim = new GB.Rims();

                /*rim.PushRim(geo, points([{ x: 0, y: setting.height, z: 0 }], cus));*/
                rim.PushRim(geo,roundedRect({
                    w: 0,
                    d: 0,
                    r: setting.rad,
                    seg: setting.seg,
                    ts: { my: setting.height },
                    cus: cus
                })).Connect(geo);
                rim.PushRim(geo,roundedRect({
                    w: setting.width,
                    d: setting.length,
                    r: setting.rad,
                    seg: setting.seg,
                    ts: { my: setting.height },
                    cus: cus
                })).Connect(geo);
                rim.PushRim(geo,roundedRect({
                    w: setting.width,
                    d: setting.length,
                    r: setting.rad,
                    seg: setting.seg,
                    ts: { my: setting.height },
                    cus: cus
                })).Connect(geo);
            }
            if (setting.parts[1] == 1) {

                var rim = new GB.Rims();

                rim.PushRim(geo,roundedRect({
                    w: setting.width + setting.border,
                    d: setting.length + setting.border,
                    r: setting.rad + setting.border,
                    seg: setting.seg,
                    ts: { my: setting.height + setting.border * 0.1 },
                    cus: cus
                }))
                    .PushRim(geo,roundedRect({
                        w: setting.width,
                        d: setting.length,
                        r: setting.rad,
                        seg: setting.seg,
                        ts: { my: setting.height + setting.border * 0.1 },
                        cus: cus
                    })).Connect(geo,null,null,1)
                    .PushRim(geo,roundedRect({
                        w: setting.width,
                        d: setting.length,
                        r: setting.rad,
                        seg: setting.seg,
                        ts: { my: setting.height + setting.border * 0.1 },
                        cus: cus
                    }))
                    .PushRim(geo,roundedRect({
                        w: setting.width,
                        d: setting.length,
                        r: setting.rad,
                        seg: setting.seg,
                        ts: { my: setting.height - setting.border * 0.1 },
                        cus: cus
                    })).Connect(geo,null,null,1)
                    .PushRim(geo,roundedRect({
                        w: setting.width,
                        d: setting.length,
                        r: setting.rad,
                        seg: setting.seg,
                        ts: { my: setting.height - setting.border * 0.1 },
                        cus: cus
                    }))
                    .PushRim(geo,roundedRect({
                        w: setting.width + setting.border,
                        d: setting.length + setting.border,
                        r: setting.rad + setting.border,
                        seg: setting.seg,
                        ts: { my: setting.height - setting.border * 0.1 },
                        cus: cus
                    })).Connect(geo,null,null,1)
                    .PushRim(geo,roundedRect({
                        w: setting.width + setting.border,
                        d: setting.length + setting.border,
                        r: setting.rad + setting.border,
                        seg: setting.seg,
                        ts: { my: setting.height - setting.border * 0.1 },
                        cus: cus
                    }))
                    .PushRim(geo,roundedRect({
                        w: setting.width + setting.border,
                        d: setting.length + setting.border,
                        r: setting.rad + setting.border,
                        seg: setting.seg,
                        ts: { my: setting.height + setting.border * 0.1 },
                        cus: cus
                    })).Connect(geo,null,null,1);
            }
        },
        setting: {
            default: {
                width: 1.2,
                length: 1.0,
                rad: 0.15,
                border: 0.25,
                height: 1.0,
                parts: [1,1]
            },
        },
        variant: {
            default: function (pm) {
                return {
                    border: {
                        width: def(pm.width,1),
                        length: def(pm.length,1),
                        height: def(pm.height,0),
                        rad: def(pm.rad,0.15),
                        border: def(pm.border,0.15),
                        seg: 32,
                        depth: 0.0,
                        parts: [0,1]
                    },
                    content: {
                        width: def(pm.width,1),
                        length: def(pm.length,1),
                        height: def(pm.height,0),
                        rad: def(pm.rad,0.15),
                        border: def(pm.border,0.15),
                        seg: 32,
                        depth: 0.0,
                        parts: [1,0]
                    },
                };
            },
            content: function (pm) {
                return {
                    content: {
                        width: 1,length: 1,height: 0,rad: 0.15,border: 0.15,seg: 64,depth: 0.0,parts: [0,0]
                    },
                };
            },
            border: function (pm) {
                return {
                    border: {
                        width: def(pm.width,1),
                        length: def(pm.length,1),
                        height: def(pm.height,0),
                        rad: def(pm.rad,0.15),
                        border: def(pm.border,0.15),
                        seg: 64,
                        depth: 0.0,
                        parts: [0,1]
                    }
                };
            },
            sample: function (pm) {
                return {

                    border: {
                        width: def(pm.width,1),
                        length: def(pm.length,1),
                        height: def(pm.height,0),
                        rad: def(pm.rad,0.15),
                        border: def(pm.border,0.15),
                        seg: 64,
                        depth: 0.0,
                        parts: [0,1]
                    },
                    shape: {
                        width: def(pm.width,1),
                        length: def(pm.length,1),
                        height: def(pm.height,0),
                        rad: def(pm.rad,0.15),
                        border: def(pm.border,0.15),
                        seg: 64,
                        depth: 0.0,
                        parts: [1,0]
                    },
                };
            },
        },
        materials: {
            border: function (pm) {

                pm.borderColor = def(pm.borderColor,{ r: 0.75,g: 0.5,b: 0.1 });

                return new BABYLONX.ShaderBuilder()
                    .Func(function (me) {
                        me.Setting.VertexWorld = true;
                        me.Setting.FragmentWorld = true;

                        if (pm.borderColor.a && pm.borderColor.a < 1.) {
                            me = me.Transparency();
                        }

                        return me;
                    })
                    .SetUniform("sett","vec4")
                    .Solid({ r: pm.borderColor.r,g: pm.borderColor.g,b: pm.borderColor.b,a: def(pm.borderColor.a,1.0) })
                    .InLine(`
                     vec3 wpos = (world*vec4(pos,1.)).xyz;
                     vec3 wnrm = mat3(world)*nrm ;
                     
                     float fs = dot(wnrm,normalize(wpos-camera));
                     `);
            },
            shape: function (pm) {
                pm.color = def(pm.color,{ r: 0.5,g: 0.25,b: 0.0 });

                return new BABYLONX.ShaderBuilder()
                    .Func(function (me) {
                        me.Setting.VertexWorld = true;
                        me.Setting.FragmentWorld = true;

                        if (pm.color.a && pm.color.a < 1.) {
                            me = me.Transparency();
                        }

                        return me;
                    })
                    .SetUniform("sett","vec4")
                    .Solid({ r: pm.color.r,g: pm.color.g,b: pm.color.b,a: def(pm.color.a,1.0) })

                    .InLine(`
                    vec3 wpos = (world*vec4(pos,1.)).xyz;
                    vec3 wnrm = mat3(world)*nrm ;
                    result.xyz = result.xyz*0.85 ; 
                    result.w = 1.0;
                    `);
            },
            content: function (pm) {

                return new BABYLONX.ShaderBuilder().Func(function (me) {
                    me.Setting.VertexWorld = true;
                    me.Setting.FragmentWorld = true;

                    return me;
                })
                    .SetUniform("dynamicSample","sampler2D")
                    .SetUniform("sett","vec4")

                    .Map({ index: "dynamicSample",bias: 0,alpha: 1,uv: " vec2(  vuv.y, vuv.x)" });
            }
        }
    },
    room: {
        builder: function (setting,geo) {

            setting.seg = def(setting.seg,5);

            ind = 0;

            var partRoom = new GB.Part().Create(function (op,cus) {

                var w = op.w;
                var l = op.l;
                var h = op.h * 0.5;
                var r = op.r;
                var d = op.d;
                var b = op.b;

                if (op.parts[0] == 1) {
                    new GB.Rims().PushRim(geo,op.roomShape(setting.seg,w - b,l - b,d - b,r).toRim(function (p) {
                        return cus(p_ts(p,{ mx: -b / 2.,mz: b / 2. }),op);
                    })).PushRim(geo,op.roomShape(setting.seg,w - b * 2,l - b * 2.,d - b * 2.,r).toRim(function (p) {
                        return cus(p_ts(p,{ mx: -b,mz: b }),op);
                    })).Connect(geo,null,null,1)
                        ;
                }

                if (op.parts[2] == 1) {
                    new GB.Rims().PushRim(geo,op.roomShape(setting.seg,w - b,l - b,d - b,r).toRim(function (p) {
                        return cus(p_ts(p,{ mx: -b / 2.,mz: b / 2. }),op);
                    }))
                        .PushRim(geo,op.roomShape(setting.seg,w - b,l - b,d - b,r).toRim(function (p) {
                            return cus(p_ts(p,{ mx: -b / 2.,my: h,mz: b / 2. }),op);
                        })).Connect(geo,null,null,1)
                        .PushRim(geo,op.roomShape(setting.seg,w - b,l - b,d - b,r).toRim(function (p) {
                            return cus(p_ts(p,{ mx: -b / 2.,my: h,mz: b / 2. }),op);
                        })).PushRim(geo,op.roomShape(setting.seg,w - b * 2,l - b * 2.,d - b * 2.,r).toRim(function (p) {
                            return cus(p_ts(p,{ mx: -b,my: h,mz: b }),op);
                        })).Connect(geo,null,null,1)
                        .PushRim(geo,op.roomShape(setting.seg,w - b * 2,l - b * 2.,d - b * 2.,r).toRim(function (p) {
                            return cus(p_ts(p,{ mx: -b,my: h,mz: b }),op);
                        })).PushRim(geo,op.roomShape(setting.seg,w - b,l - b,d - b,r).toRim(function (p) {
                            return cus(p_ts(p,{ mx: -b / 2.,my: 0,mz: b / 2. }),op);
                        })).Connect(geo,null,null,1)
                        ;
                }

                try {
                    if (op.parts[1] == 1) {

                        new GB.Rims().PushRim(geo,op.roomShape(setting.seg,w - b * 2.,l - b * 2.,d - b * 2.,r).toRim(function (p) {
                            return cus(p_ts(p,{ mx: -b,mz: b }),op);
                        })).PushRim(geo,{
                            count: 1,
                            point: function (p,i) {
                                return cus(p_ts(p,{ mx: -4 * b,mz: 4. * b }),op);
                            }
                        }).Connect(geo,null,null,1);
                    }
                } catch (e) { }

            }).Custom(function (p,op) {
                return p_ts(p,def(op,{}));
            });


            /* partRoom.New({seg:5,w:15.,l:8.,d:5.5,r:0.15,b:0.5,h:1.,parts:[0,1] ,
             mx:8+i*8.,  mz:8+j*8., 
             roomShape:roomRect});*/

            partRoom.New({
                seg: setting.seg,w: setting.w,l: setting.l,d: setting.d,
                r: setting.r,b: setting.b,h: setting.h,parts: setting.parts,
                my: 0.0,mx: 0.,mz: 0.,ry: setting.ry,roomShape: setting.md ? scene.templates.rims[setting.md] : scene.templates.rims.roomRect
            });

        },
        setting: {
            default: {
                width: 1.2,
                length: 1.0,
                deep: 0.5,
                radius: 0.15,
                border: 0.25,
                height: 1.0,
                parts: [1,1]
            },
        },
        variant: {
            floor: function (pm) {
                return {
                    floor: {
                        w: def(pm.w,4.),
                        l: def(pm.l,4.),
                        h: def(pm.h,2.8),
                        d: def(pm.d,2.8),
                        r: def(pm.r,0.15),
                        b: def(pm.b,0.05),
                        ry: def(pm.ry,0),
                        md: def(pm.md,'roomRect'),
                        parts: [0,1]
                    },
                };
            },
            wall: function (pm) {
                return {
                    w: def(pm.w,4.),
                    l: def(pm.l,4.),
                    h: def(pm.h,2.8),
                    d: def(pm.d,2.8),
                    r: def(pm.r,0.15),
                    b: def(pm.b,0.05),
                    ry: def(pm.ry,0),
                    wall: {
                        parts: [1,0]
                    },
                };
            }
        },
        materials: {
            floor: function (pm) {

                pm.color = def(pm.color,{ r: 0.75,g: 0.5,b: 0.1 });

                return new BABYLONX.ShaderBuilder()
                    .Func(function (me) {
                        me.Setting.VertexWorld = true;
                        me.Setting.FragmentWorld = true;

                        if (pm.color.a && pm.color.a < 1.) {
                            me = me.Transparency();
                        }

                        return me;
                    })
                    .SetUniform("sett","vec4")
                    .Solid({ r: pm.color.r,g: pm.color.g,b: pm.color.b,a: def(pm.color.a,1.0) })
                    .InLine(`
                    vec3 wpos = (world*vec4(pos,1.)).xyz;
                    vec3 wnrm = mat3(world)*nrm ;
                    
                    float fs = dot(wnrm,normalize(wpos-camera));
                    `);
            },
            wall: function (pm) {
                pm.wallColor = def(pm.wallColor,{ r: 0.5,g: 0.25,b: 0.0 });

                return new BABYLONX.ShaderBuilder()
                    .Func(function (me) {
                        me.Setting.VertexWorld = true;
                        me.Setting.FragmentWorld = true;

                        if (pm.wallColor.a && pm.wallColor.a < 1.) {
                            me = me.Transparency();
                        }

                        return me;
                    })
                    .SetUniform("sett","vec4")
                    .Solid({ r: pm.wallColor.r,g: pm.wallColor.g,b: pm.wallColor.b,a: def(pm.wallColor.a,1.0) })

                    .InLine(`
                   vec3 wpos = (world*vec4(pos,1.)).xyz;
                   vec3 wnrm = mat3(world)*nrm ;
                   float fs = dot(wnrm,normalize(wpos-camera));
                   `);
            }
        }
    },
    asset_chair: {
        builder: function (setting,geo) {
            ind = 0;



            var part1 = new GB.Part()
                .Create(function (st,cus) {
                    var cap1 = function (p,i,seg,rad,len,dp) {
                        var stp = floor(i / seg);
                        var i1 = (i % seg) / (seg);

                        if (stp == 0.0) {
                            p.x = (i1 - 0.5) * len;
                            p.z -= 0.5 * rad;
                        }
                        if (stp == 1.0) {
                            p.x = 0.5 * len + sin(i1 * 180 * deg) * rad * 0.5;
                            p.z = -cos(i1 * 180 * deg) * rad * 0.5;
                        }
                        if (stp == 2.0) {
                            p.x = (-i1 + 0.5) * len;
                            p.z = +0.5 * rad;
                        }
                        if (stp == 3.0) {
                            var i1 = (i % seg) / (seg - 1);
                            p.x = -0.5 * len - sin(i1 * 180 * deg) * rad * 0.5;
                            p.z = +cos(i1 * 180 * deg) * rad * 0.5;
                        }

                        if (p.z > 0.) p.z += def(dp,0.);
                        if (p.z < 0.) p.z -= def(dp,0.);


                        return p;
                    };

                    var rim = new GB.Rims();
                    for (var k = st.seg - 1; k > -st.seg; k--) {
                        var j = abs(k);
                        var seg = floor(st.seg);
                        rim.PushRim(geo,{
                            count: seg * 4,
                            point: function (p,i) {
                                var v = (j / (st.seg - 1));
                                var v1 = pow(v,2.5);
                                p = cap1(p,i,seg,st.rad - st.rad * v1,st.len,st.dp);
                                p.y = Math.sign(k) * -1 * pow(sin(v * 90. * deg),st.p) * st.d;

                                var vx = p.x / st.rad;

                                var vz = p.z / st.rad;
                                vz = pow(cos(vz),0.5) * 1.2;


                                if (abs(p.x) > (st.len / 2. - 0.5))
                                    p = r_z(p,Math.sign(p.x) * vx * vx * st.t,{ x: Math.sign(p.x) * (st.len / 2. - 0.5),y: 0.5,z: 0 });



                                return cus(p,st);
                            }

                        });
                        rim.Connect(geo);
                    }

                    var rim2 = new GB.Rims();

                    var lt0 = st.rad * 3 / 4 + def(st.mig0,0.);
                    var lt1 = st.rad / 2;
                    var lt2 = st.rad / 2.5 + def(st.mig2,0.);

                    var rt0 = st.rad * 3 / 4 + def(st.mig1,0.);
                    var rt1 = st.rad / 2;
                    var rt2 = st.rad / 2.5 + def(st.mig3,0.);

                    if (st.col == 1) {

                        if (setting.parts[1] == 1) {
                            rim2.PushCircle(geo,{ s: 12,z: lt0 - lt1,x: rt0 - rt1,d: 0.32,w: 0.32,sf: 'xz',y: 0.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: 12,z: lt0 - lt2,x: rt0 - rt2,d: 0.12,w: 0.12,sf: 'xz',y: -st.ht,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo);

                            rim2.PushCircle(geo,{ s: 12,z: -lt0 + lt1,x: rt0 - rt1,d: 0.32,w: 0.32,sf: 'xz',y: 0.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: 12,z: -lt0 + lt2,x: rt0 - rt2,d: 0.12,w: 0.12,sf: 'xz',y: -st.ht,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo);

                            rim2.PushCircle(geo,{ s: 12,z: lt0 - lt1,x: -rt0 + rt1,d: 0.32,w: 0.32,sf: 'xz',y: 0.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: 12,z: lt0 - lt2,x: -rt0 + rt2,d: 0.12,w: 0.12,sf: 'xz',y: -st.ht,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo);

                            rim2.PushCircle(geo,{ s: 12,z: -lt0 + lt1,x: -rt0 + rt1,d: 0.32,w: 0.32,sf: 'xz',y: 0.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: 12,z: -lt0 + lt2,x: -rt0 + rt2,d: 0.12,w: 0.12,sf: 'xz',y: -st.ht,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo);
                        }

                        /** connects */

                        if (setting.parts[3] == 1) {

                            rim2.PushCircle(geo,{ s: 5,z: lt0 - lt1,x: rt0 - rt1,d: 0.05,w: 0.05,sf: 'xy',y: 0.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: 5,z: -lt0 + lt1 * 0.5 + lt2 * 0.5,x: rt0 - rt1 * 0.5 - rt2 * 0.5,d: 0.05,w: 0.05,sf: 'xy',y: -st.ht * 0.5,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,1);

                            rim2.PushCircle(geo,{ s: 5,z: -lt0 + lt1,x: rt0 - rt1,d: 0.05,w: 0.05,sf: 'xy',y: 0.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: 5,z: lt0 - lt1 * 0.5 - lt2 * 0.5,x: rt0 - rt1 * 0.5 - rt2 * 0.5,d: 0.05,w: 0.05,sf: 'xy',y: -st.ht * 0.5,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,0);

                            rim2.PushCircle(geo,{ s: 5,z: lt0 - lt1,x: rt0 - rt1,d: 0.05,w: 0.05,sf: 'xy',y: 0.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: 5,z: lt0 - lt1 * 0.5 - lt2 * 0.5,x: -rt0 + rt1 * 0.5 + rt2 * 0.5,d: 0.05,w: 0.05,sf: 'xy',y: -st.ht * 0.5,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,0);

                            rim2.PushCircle(geo,{ s: 5,z: lt0 - lt1,x: -rt0 + rt1,d: 0.05,w: 0.05,sf: 'xy',y: 0.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: 5,z: lt0 - lt1 * 0.5 - lt2 * 0.5,x: rt0 - rt1 * 0.5 - rt2 * 0.5,d: 0.05,w: 0.05,sf: 'xy',y: -st.ht * 0.5,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,0);

                            rim2.PushCircle(geo,{ s: 5,z: -lt0 + lt1,x: -rt0 + rt1,d: 0.05,w: 0.05,sf: 'xy',y: 0.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: 5,z: lt0 - lt1 * 0.5 - lt2 * 0.5,x: -rt0 + rt1 * 0.5 + rt2 * 0.5,d: 0.05,w: 0.05,sf: 'xy',y: -st.ht * 0.5,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,0);

                            rim2.PushCircle(geo,{ s: 5,z: +lt0 - lt1,x: -rt0 + rt1,d: 0.05,w: 0.05,sf: 'xy',y: 0.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: 5,z: -lt0 + lt1 * 0.5 + lt2 * 0.5,x: -rt0 + rt1 * 0.5 + rt2 * 0.5,d: 0.05,w: 0.05,sf: 'xy',y: -st.ht * 0.5,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,1);

                            rim2.PushCircle(geo,{ s: 5,z: -lt0 + lt1,x: -rt0 + rt1,d: 0.05,w: 0.05,sf: 'xy',y: 0.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: 5,z: -lt0 + lt1 * 0.5 + lt2 * 0.5,x: rt0 - rt1 * 0.5 - rt2 * 0.5,d: 0.05,w: 0.05,sf: 'xy',y: -st.ht * 0.5,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,1);


                            rim2.PushCircle(geo,{ s: 5,z: -lt0 + lt1,x: rt0 - rt1,d: 0.05,w: 0.05,sf: 'xy',y: 0.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: 5,z: -lt0 + lt1 * 0.5 + lt2 * 0.5,x: -rt0 + rt1 * 0.5 + rt2 * 0.5,d: 0.05,w: 0.05,sf: 'xy',y: -st.ht * 0.5,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,1);

                        }

                    } else if (st.col == 2) {

                        if (setting.parts[1] == 1) {
                            rim2.PushCircle(geo,{ s: st.seg,sf: 'xz',w: st.rad,d: st.len + st.dp,y: 0.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 1.5,d: 1.5,y: -0.5,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,0)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 1.5,d: 1.5,y: -0.5,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 1.0,d: 1.0,y: -0.5,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,0)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 1.0,d: 1.0,y: -0.5,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 0.5,d: 0.5,y: -1.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,0)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 0.5,d: 0.5,y: -1.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 0.35,d: 0.35,y: -1.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,0)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 0.35,d: 0.35,y: -1.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 0.35,d: 0.35,y: -0.5,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,0);
                        }

                        if (setting.parts[2] == 1) {

                            rim2.PushCircle(geo,{ s: st.seg,sf: 'xz',w: 0.253,d: 0.253,y: -0.7,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 0.253,d: 0.253,y: -2.15,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,0);
                        }
                        if (setting.parts[1] == 1) {
                            rim2.PushCircle(geo,{ s: st.seg,sf: 'xz',w: 0.253,d: 0.253,y: -2.15,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 0.53,d: 0.53,y: -2.15,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,0)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 0.53,d: 0.53,y: -2.15,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 1.03,d: 1.03,y: -2.5,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,0)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 1.03,d: 1.03,y: -2.5,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 1.03,d: 1.03,y: -2.75,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,0)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 1.03,d: 1.03,y: -2.75,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 0.0,d: 0.0,y: -2.75,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,0);
                        }


                        var cus3 = function (p,opi) {
                            p = r_y(p,45. * deg);
                            return cus(p,opi);
                        };

                        if (setting.parts[3] == 1) {

                            rim2.PushCircle(geo,{ s: 075,d: 0.05,w: 0.05,sf: 'xy',y: -0.97,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus3)
                                .PushCircle(geo,{ s: 15,z: 0.5,d: 0.05,w: 0.05,sf: 'xy',y: -0.97,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus3)
                                .Connect(geo)
                                .PushCircle(geo,{ s: 15,z: 0.5,d: 0.05,w: 0.05,sf: 'xy',y: -0.97,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus3)
                                .PushCircle(geo,{ s: 15,z: 0.75,d: 0.095,w: 0.095,sf: 'xy',y: -0.97,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus3)
                                .Connect(geo)
                                .PushCircle(geo,{ s: 15,z: 0.75,d: 0.095,w: 0.095,sf: 'xy',y: -0.97,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus3)
                                .PushCircle(geo,{ s: 15,z: 1.15,d: 0.095,w: 0.095,sf: 'xy',y: -0.97,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus3)
                                .Connect(geo)
                                .PushCircle(geo,{ s: 15,z: 1.15,d: 0.095,w: 0.095,sf: 'xy',y: -0.97,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus3)
                                .PushCircle(geo,{ s: 15,z: 1.15,d: 0.0,w: 0.0,sf: 'xy',y: -0.97,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus3)
                                .Connect(geo);
                        }

                        if (setting.parts[2] == 1) {
                            for (var kv = 0; kv < 5; kv++) {

                                var cus2 = function (p,opi) {

                                    p = r_y(p,kv * 360. * deg / 5.);

                                    return cus(p,opi);
                                };

                                rim2.PushSquare(geo,{ solid: 2,d: 0.25,w: 0.45,sf: 'xy',y: -2.6,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                    .PushSquare(geo,{ solid: 2,z: 2,d: 0.115,w: 0.115,sf: 'xy',y: -2.8,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                    .Connect(geo,null,null,0)
                                    .PushSquare(geo,{ solid: 2,z: 2,d: 0.115,w: 0.115,sf: 'xy',y: -2.8,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                    .PushSquare(geo,{ solid: 2,z: 2.15,d: 0.1,w: 0.1,sf: 'xz',y: -2.94,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                    .Connect(geo,null,null,0)
                                    .PushCircle(geo,{ solid: 2,z: 2.15,d: 0.1,w: 0.1,sf: 'xz',y: -2.94,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                    .PushCircle(geo,{ solid: 2,z: 2.15,d: 0.085,w: 0.085,sf: 'xz',y: -3.1,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                    .Connect(geo,null,null,0);


                                if (setting.parts[3] == 1) {

                                    rim2
                                        .PushCircle(geo,{ x: -0.01,z: 2.15,d: 0.0,w: 0.0,sf: 'zy',y: -3.215,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                        .PushCircle(geo,{ x: -0.01,z: 2.15,d: 0.385,w: 0.385,sf: 'zy',y: -3.215,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                        .Connect(geo,null,null,0)
                                        .PushCircle(geo,{ x: -0.01,z: 2.15,d: 0.385,w: 0.385,sf: 'zy',y: -3.215,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                        .PushCircle(geo,{ x: -0.1,z: 2.15,d: 0.385,w: 0.385,sf: 'zy',y: -3.215,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                        .Connect(geo,null,null,0)
                                        .PushCircle(geo,{ x: -0.1,z: 2.15,d: 0.385,w: 0.385,sf: 'zy',y: -3.215,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                        .PushCircle(geo,{ x: -0.1,z: 2.15,d: 0.0,w: 0.0,sf: 'zy',y: -3.215,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                        .Connect(geo,null,null,0)


                                        .PushCircle(geo,{ x: 0.01,z: 2.15,d: 0.0,w: 0.0,sf: 'zy',y: -3.215,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                        .PushCircle(geo,{ x: 0.01,z: 2.15,d: 0.385,w: 0.385,sf: 'zy',y: -3.215,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                        .Connect(geo,null,null,1)
                                        .PushCircle(geo,{ x: 0.01,z: 2.15,d: 0.385,w: 0.385,sf: 'zy',y: -3.215,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                        .PushCircle(geo,{ x: 0.1,z: 2.15,d: 0.385,w: 0.385,sf: 'zy',y: -3.215,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                        .Connect(geo,null,null,1)
                                        .PushCircle(geo,{ x: 0.1,z: 2.15,d: 0.385,w: 0.385,sf: 'zy',y: -3.215,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                        .PushCircle(geo,{ x: 0.1,z: 2.15,d: 0.0,w: 0.0,sf: 'zy',y: -3.215,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                        .Connect(geo,null,null,1);
                                }
                            }

                        }



                    }

                }).Custom(function (p,op) {

                    if (op.ts && op.ts.fn)
                        p = op.ts.fn(p);

                    p = p_ts(p,def(op.ts,{}));

                    if (op.ts && op.ts.ns) {

                        for (var ns in op.ts.ns) {
                            ns = op.ts.ns[ns];
                            var ns1 = noise.simplex3(p.x * ns.l,p.y * ns.l,p.z * ns.l) * ns.s;

                            if (ns.m.indexOf('x') != -1)
                                p.x += ns1;
                            if (ns.m.indexOf('y') != -1)
                                p.y += ns1;
                            if (ns.m.indexOf('z') != -1)
                                p.z += ns1;
                        }
                    }

                    p.y += op.ht;

                    return p;
                });

            setting.parts = [1,1,1,1];

            setting.mode = setting.md + 1;

            if (setting.mode == 1) {
                if (setting.parts[1] == 1)
                    part1.New({
                        seg: setting.seg,rad: 3.,mig0: 0.35,mig1: 0.75,mig3: -0.25,mig2: -0.75,mig4: 0.12,col: 1,ht: 6,len: 2,p: 0.15,d: 0.05,t: 0.31,
                        ts: { mx: 0 }
                    });
                if (setting.parts[0] == 1) part1.New({
                    seg: setting.seg,rad: 3.,ht: 6,len: 1.8,p: 0.5,d: 0.25,t: 0.31,
                    ts: { mx: 0,my: 0.25 }
                });
            }

            if (setting.mode == 2) {
                if (setting.parts[1] == 1) part1.New({ seg: setting.seg,rad: 3.,col: 1,ht: 4,mig0: 0.25,mig1: 0.5,mig2: -0.5,mig3: -0.5,len: 2,p: 0.15,d: 0.05,t: 0.31,ts: {} });
                if (setting.parts[0] == 1) part1.New({
                    seg: setting.seg,rad: 3.,ht: 4,len: 1.8,p: 0.5,d: 0.25,t: 0.31,
                    ts: { my: 0.25 }
                });
            }

            if (setting.mode == 3) {
                if (setting.parts[1] == 1) part1.New({ seg: setting.seg,rad: 3.,col: 1,ht: 4,mig0: 0.25,mig1: 0.5,mig2: -0.5,mig3: -0.5,len: 2,p: 0.15,d: 0.05,t: 0.31,ts: {} });
                if (setting.parts[0] == 1) part1.New({
                    seg: setting.seg,rad: 3.,ht: 4,len: 1.8,p: 0.5,d: 0.25,t: 0.31,
                    ts: { my: 0.25 }
                });
                if (setting.parts[1] == 1) part1.New({
                    seg: setting.seg,rad: 3.5,ht: 4,len: 1,p: 0.15,d: 0.05,t: 0.91,
                    ts: { mz: -2.5,my: 2.,rx: 75 * deg }
                });
                if (setting.parts[0] == 1) part1.New({
                    seg: setting.seg,rad: 3.25,ht: 4,len: 1.4,p: 0.5,d: 0.25,t: 1.21,
                    ts: { mz: -2.25,my: 2.,rx: 75 * deg }
                });
            }


            if (setting.mode == 4) {
                if (setting.parts[1] == 1) part1.New({
                    seg: setting.seg,rad: 3.,dp: 0.5,col: 2,ht: 4,mig0: 0.25,mig1: 0.5,mig2: -0.5,mig3: -0.5,
                    len: 1,p: 0.15,d: 0.05,t: 0.31,
                    ts: { my: -0.5,mz: 0 }
                });
                if (setting.parts[0] == 1) part1.New({
                    seg: setting.seg,rad: 3.,dp: 0.5,ht: 4,len: 0.8,p: 0.5,d: 0.25,t: 0.31,
                    ts: { my: -0.25,mz: 0 }
                });
                if (setting.parts[1] == 1) part1.New({
                    seg: setting.seg,rad: 3.5,ht: 4,len: 0.7,p: 0.15,d: 0.05,t: 0.91,
                    ts: { mz: -2.75,my: 2.,rx: 75 * deg }
                });
                if (setting.parts[0] == 1) part1.New({
                    seg: setting.seg,rad: 3.25,ht: 4,len: 1.,p: 0.5,d: 0.25,t: 1.21,
                    ts: { mz: -2.45,my: 2.,rx: 75 * deg }
                });
                if (setting.parts[1] == 1) part1.New({
                    seg: setting.seg,rad: 1.5,ht: 4,len: 0.5,p: 0.15,d: 0.05,t: 0.41,
                    ts: { mz: -2.95,my: 4.5,rx: 105 * deg }
                });
                if (setting.parts[0] == 1) part1.New({
                    seg: setting.seg,rad: 1.25,ht: 4,len: 1.,p: 0.5,d: 0.25,t: 0.21,
                    ts: { mz: -2.65,my: 4.5,rx: 105 * deg }
                });
                if (setting.parts[1] == 1) part1.New({
                    seg: setting.seg,rad: 0.5,ht: 4,len: 0.25,p: 0.15,d: 0.05,t: 0.151,
                    ts: { mz: -3.24,my: 3.75,rz: 90 * deg,rx: 90. * deg,ry: 05 * deg }
                });
                if (setting.parts[1] == 1) part1.New({
                    seg: setting.seg,rad: 0.5,ht: 4,len: 0.65,p: 0.15,d: 0.05,t: 0.35,
                    ts: { mz: -2.28,my: 0.18,rz: 90 * deg,rx: 90. * deg,ry: -40 * deg }
                });
            }

        }
    },

    asset_tooltip: {
        /** {w:3,b:0.1,mode:1,parts:[1,1]} */
        builder: function (setting,geo) {

            ind = 0;

            var scale = 3.;
            var scn = 1 / scale;

            function cu(p) {

                p.y += 7.5;
                p.x *= scale;
                p.z *= scale;


                return p;
            }

            setting.mode = setting.md + 1;

            setting.w = def(setting.sz,3.) * 1.5 + 3.0;
            setting.b = def(setting.b,0.3);


            var rim1 = new GB.Rims();

            if (setting.mode == 1) {

                var sz = 1. + (setting.w - 3.0) * 0.5 / 4.0;

                if (setting.parts[0] == 1) {

                    rim1
                        .UV(function (p,i) { return { u: p.z * scn / sz + (setting.w * 0.5 / sz) + 0.5,v: p.x * scn / sz + 0.5 }; })
                        .PushCircle(geo,{ sf: 'xz',w: .0,d: 0.,y: 0.05,z: -setting.w / 2.0 },cu)
                        .PushCircle(geo,{ sf: 'xz',w: sz - setting.b,d: sz - setting.b,y: 0.05,z: -setting.w / 2.0 },cu)
                        .Connect(geo)
                        .PushCircle(geo,{ sf: 'xz',w: sz - setting.b,d: sz - setting.b,y: 0.05,z: -setting.w / 2.0 },cu)
                        .PushCircle(geo,{ sf: 'xz',w: sz - setting.b,d: sz - setting.b,y: 0.025,z: -setting.w / 2.0 },cu)
                        .Connect(geo)
                        ;
                }


                if (setting.parts[1] == 1) {
                    function cus(p) {
                        if (p.z > 0.) p.z += setting.w / 2.0;
                        else p.z -= setting.w / 2.0;
                        return cu(p);
                    }

                    rim1
                        .UV(function (p,i) { return { u: p.z * scn / (setting.w) - 0.5 / (setting.w) + 0.5,v: p.x * scn / sz + 0.5 }; })
                        .PushCircle(geo,{ sf: 'xz',w: .0,d: 0. },cu)
                        .PushCircle(geo,{ sf: 'xz',w: sz,d: sz },cus)
                        .Connect(geo)
                        .PushCircle(geo,{ sf: 'xz',w: sz,d: sz },cus)
                        .PushCircle(geo,{ sf: 'xz',w: sz,d: sz,y: -0.025 },cus)
                        .Connect(geo)
                        ;
                }
            }
            else if (setting.mode == 2) {

                if (setting.parts[0] == 1) {

                    rim1
                        .UV(function (p,i) { return { u: p.z * scn / (setting.w * 1.5) + 0.5,v: p.x * scn / (setting.w * 1.5) + 0.5 }; })
                        .PushCircle(geo,{ sf: 'xz',w: .0,d: 0.,y: 0.05,z: 0 },cu)
                        .PushCircle(geo,{ sf: 'xz',w: setting.w * 1.5,d: setting.w * 1.5,y: 0.05,z: 0 },cu)
                        .Connect(geo)
                        .PushCircle(geo,{ sf: 'xz',w: setting.w * 1.5,d: setting.w * 1.5,y: 0.05,z: 0 },cu)
                        .PushCircle(geo,{ sf: 'xz',w: setting.w * 1.5,d: setting.w * 1.5,y: 0.025,z: 0 },cu)
                        .Connect(geo)
                        ;
                }


                if (setting.parts[1] == 1) {
                    function cus(p) {
                        if (p.z > 0.) p.z += setting.w / 2.0;
                        else p.z -= setting.w / 2.0;
                        return cu(p);
                    }

                    rim1
                        .UV(function (p,i) { return { u: p.z * scn / (setting.w + 1) + 0.5,v: p.x * scn + setting.w + 0.5 }; })
                        .PushCircle(geo,{ sf: 'xz',x: -setting.w,w: .0,d: 0. },cu)
                        .PushCircle(geo,{ sf: 'xz',x: -setting.w },cus)
                        .Connect(geo)
                        .PushCircle(geo,{ sf: 'xz',x: -setting.w },cus)
                        .PushCircle(geo,{ sf: 'xz',x: -setting.w,y: -0.025 },cus)
                        .Connect(geo)
                        ;
                }
            }
            else if (setting.mode == 3) {

                if (setting.parts[0] == 1) {

                    rim1
                        .UV(function (p,i) { return { u: p.z * scn / (setting.w * 1.5) + 0.5,v: p.x * scn / (setting.w * 1.5) + 0.5 }; })
                        .PushCircle(geo,{ sf: 'xz',w: .0,d: 0.,y: 0.05,z: 0 },cu)
                        .PushCircle(geo,{ sf: 'xz',w: setting.w * 1.5,d: setting.w * 1.5,y: 0.05,z: 0 },cu)
                        .Connect(geo)
                        .PushCircle(geo,{ sf: 'xz',w: setting.w * 1.5,d: setting.w * 1.5,y: 0.05,z: 0 },cu)
                        .PushCircle(geo,{ sf: 'xz',w: setting.w * 1.5,d: setting.w * 1.5,y: 0.025,z: 0 },cu)
                        .Connect(geo)
                        ;
                }


            }
            else if (setting.mode == 4) {

                if (setting.parts[0] == 1) {

                    function cus(p) {
                        if (p.z > 0.) p.z += setting.w / 2.0;
                        else p.z -= setting.w / 2.0;
                        if (p.x > 0.) p.x += setting.w / 2.0;
                        else p.x -= setting.w / 2.0;
                        return cu(p);
                    }

                    rim1
                        .UV(function (p,i) { return { u: p.z * scn / (setting.w + setting.b * 5.) + 0.5,v: p.x * scn / (setting.w + setting.b * 5.) + 0.5 }; })
                        .PushCircle(geo,{ sf: 'xz',w: .0,d: 0.,y: 0.05,z: 0 },cu)
                        .PushCircle(geo,{ sf: 'xz',w: setting.b * 2.5,d: setting.b * 2.5,y: 0.05,z: 0 },cus)
                        .Connect(geo)
                        .PushCircle(geo,{ sf: 'xz',w: setting.b * 2.5,d: setting.b * 2.5,y: 0.05,z: 0 },cus)
                        .PushCircle(geo,{ sf: 'xz',w: setting.b * 2.5,d: setting.b * 2.5,y: 0.025,z: 0 },cus)
                        .Connect(geo)
                        ;
                }


            }
        },
        getSize: function (setting) {

            ind = 0;

            var scale = 3.;
            var scn = 1 / scale;

            function cu(p) {

                p.y += 7.5;
                p.x *= scale;
                p.z *= scale;


                return p;
            }

            setting.mode = setting.md + 1;

            setting.w = def(setting.sz,3.) + 3.0;
            setting.b = def(setting.b,0.1);

            if (setting.mode == 1) {

                var sz = 1. + (setting.w) * 0.5 / 4.0;

                return { w: setting.w,h: sz };
            }
            else if (setting.mode == 2) {

                return { w: setting.w,h: 1.0 };
            }
            else if (setting.mode == 3) {

                return { w: setting.w * 1.5,h: setting.w * 1.5 };

            }
            else if (setting.mode == 4) {

                return { w: setting.w + setting.b * 5.,h: setting.w + setting.b * 5. };


            }

        }
    },
    asset_table: {
        builder: function (setting,geo) {
            ind = 0;

            var part1 = new GB.Part()
                .Create(function (st,cus) {
                    var cap1 = function (p,i,seg,rad,len,dp) {
                        var stp = floor(i / seg);
                        var i1 = (i % seg) / (seg);

                        if (stp == 0.0) {
                            p.x = (i1 - 0.5) * len;
                            p.z -= 0.5 * rad;
                        }
                        if (stp == 1.0) {
                            p.x = 0.5 * len + sin(i1 * 180 * deg) * rad * 0.5;
                            p.z = -cos(i1 * 180 * deg) * rad * 0.5;
                        }
                        if (stp == 2.0) {
                            p.x = (-i1 + 0.5) * len;
                            p.z = +0.5 * rad;
                        }
                        if (stp == 3.0) {
                            var i1 = (i % seg) / (seg - 1);
                            p.x = -0.5 * len - sin(i1 * 180 * deg) * rad * 0.5;
                            p.z = +cos(i1 * 180 * deg) * rad * 0.5;
                        }

                        if (p.z > 0.) p.z += def(dp,0.);
                        if (p.z < 0.) p.z -= def(dp,0.);


                        return p;
                    };

                    var rim = new GB.Rims();
                    for (var k = st.seg - 1; k > -st.seg; k--) {
                        var j = abs(k);
                        var seg = floor(st.seg);
                        rim.PushRim(geo,{
                            count: seg * 4,
                            point: function (p,i) {
                                var v = (j / (st.seg - 1));
                                var v1 = pow(v,2.5);
                                p = cap1(p,i,seg,st.rad - st.rad * v1,st.len,st.dp);
                                p.y = Math.sign(k) * -1 * pow(sin(v * 90. * deg),st.p) * st.d;

                                var vx = p.x / st.rad;

                                var vz = p.z / st.rad;
                                vz = pow(cos(vz),0.5) * 1.2;


                                if (abs(p.x) > (st.len / 2. - 0.5))
                                    p = r_z(p,Math.sign(p.x) * vx * vx * st.t,{ x: Math.sign(p.x) * (st.len / 2. - 0.5),y: 0.5,z: 0 });



                                return cus(p,st);
                            }

                        });
                        rim.Connect(geo);
                    }

                    var rim2 = new GB.Rims();

                    var lt0 = st.rad * 3 / 4 + def(st.mig0,0.);
                    var lt1 = st.rad / 2;
                    var lt2 = st.rad / 2.5 + def(st.mig2,0.);

                    var rt0 = st.rad * 3 / 4 + def(st.mig1,0.);
                    var rt1 = st.rad / 2;
                    var rt2 = st.rad / 2.5 + def(st.mig3,0.);

                    if (st.col == 1) {

                        if (setting.parts[1] == 1) {
                            rim2.PushCircle(geo,{ s: 12,z: lt0 - lt1,x: rt0 - rt1,d: 0.32,w: 0.32,sf: 'xz',y: 0.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: 12,z: lt0 - lt2,x: rt0 - rt2,d: 0.12,w: 0.12,sf: 'xz',y: -st.ht,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo);

                            rim2.PushCircle(geo,{ s: 12,z: -lt0 + lt1,x: rt0 - rt1,d: 0.32,w: 0.32,sf: 'xz',y: 0.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: 12,z: -lt0 + lt2,x: rt0 - rt2,d: 0.12,w: 0.12,sf: 'xz',y: -st.ht,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo);

                            rim2.PushCircle(geo,{ s: 12,z: lt0 - lt1,x: -rt0 + rt1,d: 0.32,w: 0.32,sf: 'xz',y: 0.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: 12,z: lt0 - lt2,x: -rt0 + rt2,d: 0.12,w: 0.12,sf: 'xz',y: -st.ht,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo);

                            rim2.PushCircle(geo,{ s: 12,z: -lt0 + lt1,x: -rt0 + rt1,d: 0.32,w: 0.32,sf: 'xz',y: 0.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: 12,z: -lt0 + lt2,x: -rt0 + rt2,d: 0.12,w: 0.12,sf: 'xz',y: -st.ht,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo);
                        }

                        /** connects */

                        if (setting.parts[3] == 1) {

                            rim2.PushCircle(geo,{ s: 5,z: lt0 - lt1,x: rt0 - rt1,d: 0.05,w: 0.05,sf: 'xy',y: 0.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: 5,z: -lt0 + lt1 * 0.5 + lt2 * 0.5,x: rt0 - rt1 * 0.5 - rt2 * 0.5,d: 0.05,w: 0.05,sf: 'xy',y: -st.ht * 0.5,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,1);

                            rim2.PushCircle(geo,{ s: 5,z: -lt0 + lt1,x: rt0 - rt1,d: 0.05,w: 0.05,sf: 'xy',y: 0.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: 5,z: lt0 - lt1 * 0.5 - lt2 * 0.5,x: rt0 - rt1 * 0.5 - rt2 * 0.5,d: 0.05,w: 0.05,sf: 'xy',y: -st.ht * 0.5,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,0);

                            rim2.PushCircle(geo,{ s: 5,z: lt0 - lt1,x: rt0 - rt1,d: 0.05,w: 0.05,sf: 'xy',y: 0.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: 5,z: lt0 - lt1 * 0.5 - lt2 * 0.5,x: -rt0 + rt1 * 0.5 + rt2 * 0.5,d: 0.05,w: 0.05,sf: 'xy',y: -st.ht * 0.5,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,0);

                            rim2.PushCircle(geo,{ s: 5,z: lt0 - lt1,x: -rt0 + rt1,d: 0.05,w: 0.05,sf: 'xy',y: 0.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: 5,z: lt0 - lt1 * 0.5 - lt2 * 0.5,x: rt0 - rt1 * 0.5 - rt2 * 0.5,d: 0.05,w: 0.05,sf: 'xy',y: -st.ht * 0.5,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,0);

                            rim2.PushCircle(geo,{ s: 5,z: -lt0 + lt1,x: -rt0 + rt1,d: 0.05,w: 0.05,sf: 'xy',y: 0.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: 5,z: lt0 - lt1 * 0.5 - lt2 * 0.5,x: -rt0 + rt1 * 0.5 + rt2 * 0.5,d: 0.05,w: 0.05,sf: 'xy',y: -st.ht * 0.5,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,0);

                            rim2.PushCircle(geo,{ s: 5,z: +lt0 - lt1,x: -rt0 + rt1,d: 0.05,w: 0.05,sf: 'xy',y: 0.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: 5,z: -lt0 + lt1 * 0.5 + lt2 * 0.5,x: -rt0 + rt1 * 0.5 + rt2 * 0.5,d: 0.05,w: 0.05,sf: 'xy',y: -st.ht * 0.5,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,1);

                            rim2.PushCircle(geo,{ s: 5,z: -lt0 + lt1,x: -rt0 + rt1,d: 0.05,w: 0.05,sf: 'xy',y: 0.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: 5,z: -lt0 + lt1 * 0.5 + lt2 * 0.5,x: rt0 - rt1 * 0.5 - rt2 * 0.5,d: 0.05,w: 0.05,sf: 'xy',y: -st.ht * 0.5,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,1);


                            rim2.PushCircle(geo,{ s: 5,z: -lt0 + lt1,x: rt0 - rt1,d: 0.05,w: 0.05,sf: 'xy',y: 0.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: 5,z: -lt0 + lt1 * 0.5 + lt2 * 0.5,x: -rt0 + rt1 * 0.5 + rt2 * 0.5,d: 0.05,w: 0.05,sf: 'xy',y: -st.ht * 0.5,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,1);

                        }

                    } else if (st.col == 2) {

                        if (setting.parts[1] == 1) {
                            rim2.PushCircle(geo,{ s: st.seg,sf: 'xz',w: st.rad,d: st.len + st.dp,y: 0.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 1.5,d: 1.5,y: -0.5,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,0)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 1.5,d: 1.5,y: -0.5,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 1.0,d: 1.0,y: -0.5,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,0)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 1.0,d: 1.0,y: -0.5,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 0.5,d: 0.5,y: -1.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,0)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 0.5,d: 0.5,y: -1.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 0.35,d: 0.35,y: -1.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,0)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 0.35,d: 0.35,y: -1.,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 0.35,d: 0.35,y: -0.5,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,0);
                        }

                        if (setting.parts[2] == 1) {

                            rim2.PushCircle(geo,{ s: st.seg,sf: 'xz',w: 0.253,d: 0.253,y: -0.7,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 0.253,d: 0.253,y: -2.15,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,0);
                        }
                        if (setting.parts[1] == 1) {
                            rim2.PushCircle(geo,{ s: st.seg,sf: 'xz',w: 0.253,d: 0.253,y: -2.15,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 0.53,d: 0.53,y: -2.15,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,0)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 0.53,d: 0.53,y: -2.15,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 1.03,d: 1.03,y: -2.5,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,0)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 1.03,d: 1.03,y: -2.5,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 1.03,d: 1.03,y: -2.75,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,0)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 1.03,d: 1.03,y: -2.75,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .PushCircle(geo,{ s: st.seg,sf: 'xz',w: 0.0,d: 0.0,y: -2.75,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus)
                                .Connect(geo,null,null,0);
                        }


                        var cus3 = function (p,opi) {
                            p = r_y(p,45. * deg);
                            return cus(p,opi);
                        };

                        if (setting.parts[3] == 1) {

                            rim2.PushCircle(geo,{ s: 075,d: 0.05,w: 0.05,sf: 'xy',y: -0.97,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus3)
                                .PushCircle(geo,{ s: 15,z: 0.5,d: 0.05,w: 0.05,sf: 'xy',y: -0.97,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus3)
                                .Connect(geo)
                                .PushCircle(geo,{ s: 15,z: 0.5,d: 0.05,w: 0.05,sf: 'xy',y: -0.97,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus3)
                                .PushCircle(geo,{ s: 15,z: 0.75,d: 0.095,w: 0.095,sf: 'xy',y: -0.97,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus3)
                                .Connect(geo)
                                .PushCircle(geo,{ s: 15,z: 0.75,d: 0.095,w: 0.095,sf: 'xy',y: -0.97,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus3)
                                .PushCircle(geo,{ s: 15,z: 1.15,d: 0.095,w: 0.095,sf: 'xy',y: -0.97,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus3)
                                .Connect(geo)
                                .PushCircle(geo,{ s: 15,z: 1.15,d: 0.095,w: 0.095,sf: 'xy',y: -0.97,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus3)
                                .PushCircle(geo,{ s: 15,z: 1.15,d: 0.0,w: 0.0,sf: 'xy',y: -0.97,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus3)
                                .Connect(geo);
                        }

                        if (setting.parts[2] == 1) {
                            for (var kv = 0; kv < 5; kv++) {

                                var cus2 = function (p,opi) {

                                    p = r_y(p,kv * 360. * deg / 5.);

                                    return cus(p,opi);
                                };

                                rim2.PushSquare(geo,{ solid: 2,d: 0.25,w: 0.45,sf: 'xy',y: -2.6,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                    .PushSquare(geo,{ solid: 2,z: 2,d: 0.115,w: 0.115,sf: 'xy',y: -2.8,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                    .Connect(geo,null,null,0)
                                    .PushSquare(geo,{ solid: 2,z: 2,d: 0.115,w: 0.115,sf: 'xy',y: -2.8,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                    .PushSquare(geo,{ solid: 2,z: 2.15,d: 0.1,w: 0.1,sf: 'xz',y: -2.94,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                    .Connect(geo,null,null,0)
                                    .PushCircle(geo,{ solid: 2,z: 2.15,d: 0.1,w: 0.1,sf: 'xz',y: -2.94,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                    .PushCircle(geo,{ solid: 2,z: 2.15,d: 0.085,w: 0.085,sf: 'xz',y: -3.1,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                    .Connect(geo,null,null,0);


                                if (setting.parts[3] == 1) {

                                    rim2
                                        .PushCircle(geo,{ x: -0.01,z: 2.15,d: 0.0,w: 0.0,sf: 'zy',y: -3.215,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                        .PushCircle(geo,{ x: -0.01,z: 2.15,d: 0.385,w: 0.385,sf: 'zy',y: -3.215,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                        .Connect(geo,null,null,0)
                                        .PushCircle(geo,{ x: -0.01,z: 2.15,d: 0.385,w: 0.385,sf: 'zy',y: -3.215,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                        .PushCircle(geo,{ x: -0.1,z: 2.15,d: 0.385,w: 0.385,sf: 'zy',y: -3.215,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                        .Connect(geo,null,null,0)
                                        .PushCircle(geo,{ x: -0.1,z: 2.15,d: 0.385,w: 0.385,sf: 'zy',y: -3.215,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                        .PushCircle(geo,{ x: -0.1,z: 2.15,d: 0.0,w: 0.0,sf: 'zy',y: -3.215,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                        .Connect(geo,null,null,0)


                                        .PushCircle(geo,{ x: 0.01,z: 2.15,d: 0.0,w: 0.0,sf: 'zy',y: -3.215,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                        .PushCircle(geo,{ x: 0.01,z: 2.15,d: 0.385,w: 0.385,sf: 'zy',y: -3.215,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                        .Connect(geo,null,null,1)
                                        .PushCircle(geo,{ x: 0.01,z: 2.15,d: 0.385,w: 0.385,sf: 'zy',y: -3.215,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                        .PushCircle(geo,{ x: 0.1,z: 2.15,d: 0.385,w: 0.385,sf: 'zy',y: -3.215,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                        .Connect(geo,null,null,1)
                                        .PushCircle(geo,{ x: 0.1,z: 2.15,d: 0.385,w: 0.385,sf: 'zy',y: -3.215,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                        .PushCircle(geo,{ x: 0.1,z: 2.15,d: 0.0,w: 0.0,sf: 'zy',y: -3.215,ht: st.ht + def(st.mig4,0.),ts: st.ts },cus2)
                                        .Connect(geo,null,null,1);
                                }
                            }

                        }



                    }

                }).Custom(function (p,op) {

                    if (op.ts && op.ts.fn)
                        p = op.ts.fn(p);

                    p = p_ts(p,def(op.ts,{}));

                    if (op.ts && op.ts.ns) {

                        for (var ns in op.ts.ns) {
                            ns = op.ts.ns[ns];
                            var ns1 = noise.simplex3(p.x * ns.l,p.y * ns.l,p.z * ns.l) * ns.s;

                            if (ns.m.indexOf('x') != -1)
                                p.x += ns1;
                            if (ns.m.indexOf('y') != -1)
                                p.y += ns1;
                            if (ns.m.indexOf('z') != -1)
                                p.z += ns1;
                        }
                    }

                    p.y += op.ht;

                    return p;
                });

            setting.parts = [1,1,1,1];
            setting.mode = setting.md + 1;


            if (setting.mode == 1) {
                if (setting.parts[0] == 1) part1.New({
                    seg: setting.seg,col: 1,ht: 4,mig0: 0.15,mig1: 0.15,mig2: -0.15,mig3: -0.15,rad: 3.25,len: 0.14,p: 0.15,d: 0.25,t: 0.0,
                    ts: { mx: 0 }
                });
            }

            if (setting.mode == 2) {
                if (setting.parts[0] == 1) part1.New({
                    seg: setting.seg,col: 1,ht: 6,mig0: 0.15,mig1: 0.15,mig2: -0.15,mig3: -0.15,rad: 3.25,len: 0.14,p: 0.15,d: 0.25,t: 0.0,
                    ts: { mx: 0,mz: -0 }
                });
            }

            if (setting.mode == 3) {
                if (setting.parts[1] == 1) part1.New({
                    seg: setting.seg,col: 1,ht: 0.7,mig0: -0.15,mig1: -0.15,mig2: -0.05,mig3: -0.05,rad: 2.25,len: 0.14,p: 0.15,d: 0.05,t: 0.0,
                    ts: { mx: 0,mz: +0 }
                });
                if (setting.parts[0] == 1) part1.New({
                    seg: setting.seg,ht: 2.5,rad: 3.25,len: 0.04,p: 0.05,d: 1.75,t: 0.0,
                    ts: { mx: 0,mz: +0 }
                });
            }

            if (setting.mode == 4) {
                if (setting.parts[1] == 1) part1.New({
                    seg: setting.seg,rad: 3.25,col: 1,ht: 0.5,mig0: -0.15,mig1: -0.15,mig2: -0.05,mig3: -0.05,len: 0.14,p: 0.05,d: 0.05,t: 0.,
                    ts: { mx: 0 }
                });

                if (setting.parts[0] == 1) part1.New({
                    seg: setting.seg,rad: 5.25,ht: 1.25,len: 0.14,p: 0.05,d: 0.75,t: 0.,
                    ts: { mx: 0 }
                });
                if (setting.parts[2] == 1) part1.New({
                    seg: setting.seg,rad: 5.25,ht: 1.45,len: 0.14,p: 1,d: 0.25,t: 0.,
                    ts: { mx: 0,my: 0.6,ns: [{ l: 1.,s: 0.02,m: 'y' }] }
                });
            }

        }
    },
    asset_door: {
        builder: function (setting,geo) {

            ind = 0;
            var w1 = 10;
            var d1 = 21;
            var p1 = 0.75;
            var p2 = 1.5;

            var rm1 = new GB.Rims().UV(function () { return { u: 0.05,v: 0.05 }; })
                .PushSquare(geo,{ solid: 2,w: w1,d: d1,y: d1 / 2.,z: p1 })
                .PushSquare(geo,{ solid: 2,w: w1,d: d1,y: d1 / 2.,z: -p1 })
                .Connect(geo)
                .PushSquare(geo,{ solid: 2,w: w1,d: d1,y: d1 / 2.,z: -p1 })
                .PushSquare(geo,{ solid: 2,w: w1 + p1,d: d1 + p1,y: d1 / 2.,z: -p1 })
                .Connect(geo)
                .PushSquare(geo,{ solid: 2,w: w1 + p1,d: d1 + p1,y: d1 / 2.,z: -p1 })
                .PushSquare(geo,{ solid: 2,w: w1 + p1,d: d1 + p1,y: d1 / 2.,z: p1 })
                .Connect(geo)
                .PushSquare(geo,{ solid: 2,w: w1 + p1,d: d1 + p1,y: d1 / 2.,z: p1 })
                .PushSquare(geo,{ solid: 2,w: w1,d: d1,y: d1 / 2.,z: p1 })
                .Connect(geo)
                ;

            function cuss(p,op) {
                p = p_ts(p,def(op.ts1,{}));

                p = p_ts(p,def(op.ts,{}));
                return p;
            }

            var ts = { ry: 60 * deg,ce: { x: -w1 / 2.,y: 0,z: 0 } };

            var rm2 = new GB.Rims().UV(function () { return { u: 0.05,v: 0.55 }; })
                .PushSquare(geo,{ solid: 2,w: 0,d: 0,y: d1 - d1 / 4.,z: -p1 * 0.28,ts: ts },cuss)
                .PushSquare(geo,{ solid: 2,w: w1 * 0.58,d: 0.58 * d1 / 2.,y: d1 - d1 / 4.,z: -p1 * 0.28,ts: ts },cuss)
                .Connect(geo)
                .PushSquare(geo,{ solid: 2,w: w1 * 0.58,d: 0.58 * d1 / 2.,y: d1 - d1 / 4.,z: -p1 * 0.28,ts: ts },cuss)
                .PushSquare(geo,{ solid: 2,w: w1 * 0.61,d: 0.61 * d1 / 2.,y: d1 - d1 / 4.,z: -p1 * 0.32,ts: ts },cuss)
                .Connect(geo)
                .PushSquare(geo,{ solid: 2,w: w1 * 0.61,d: 0.61 * d1 / 2.,y: d1 - d1 / 4.,z: -p1 * 0.32,ts: ts },cuss)
                .PushSquare(geo,{ solid: 2,w: w1,d: d1 / 2.,y: d1 - d1 / 4.,z: -p1 * 0.32,ts: ts },cuss)
                .Connect(geo)
                .PushSquare(geo,{ solid: 2,w: w1,d: d1 / 2.,y: d1 - d1 / 4.,z: -p1 * 0.32,ts: ts },cuss)
                .PushSquare(geo,{ solid: 2,w: w1,d: d1 / 2.,y: d1 - d1 / 4.,z: -p1 * 0.32,ts: ts },cuss)
                .Connect(geo)
                .PushSquare(geo,{ solid: 2,w: w1,d: d1 / 2.,y: d1 - d1 / 4.,z: -p1 * 0.32,ts: ts },cuss)
                .PushSquare(geo,{ solid: 2,w: w1,d: d1 / 2.,y: d1 - d1 / 4.,z: p1 * 0.32,ts: ts },cuss)
                .Connect(geo)
                .PushSquare(geo,{ solid: 2,w: w1,d: d1 / 2.,y: d1 - d1 / 4.,z: p1 * 0.32,ts: ts },cuss)
                .PushSquare(geo,{ solid: 2,w: w1 * 0.61,d: 0.61 * d1 / 2.,y: d1 - d1 / 4.,z: p1 * 0.32,ts: ts },cuss)
                .Connect(geo)
                .PushSquare(geo,{ solid: 2,w: w1 * 0.61,d: 0.61 * d1 / 2.,y: d1 - d1 / 4.,z: p1 * 0.32,ts: ts },cuss)
                .PushSquare(geo,{ solid: 2,w: w1 * 0.58,d: 0.58 * d1 / 2.,y: d1 - d1 / 4.,z: p1 * 0.28,ts: ts },cuss)
                .Connect(geo)
                .PushSquare(geo,{ solid: 2,w: w1 * 0.58,d: 0.58 * d1 / 2.,y: d1 - d1 / 4.,z: p1 * 0.28,ts: ts },cuss)
                .PushSquare(geo,{ solid: 2,w: w1 * 0.,d: 0.0 * d1 / 2.,y: d1 - d1 / 4.,z: p1 * 0.28,ts: ts },cuss)
                .Connect(geo)


                .PushSquare(geo,{ solid: 2,w: 0,d: 0,y: d1 / 4.,z: -p1 * 0.28,ts: ts },cuss)
                .PushSquare(geo,{ solid: 2,w: w1 * 0.58,d: 0.58 * d1 / 2.,y: d1 / 4.,z: -p1 * 0.28,ts: ts },cuss)
                .Connect(geo)
                .PushSquare(geo,{ solid: 2,w: w1 * 0.58,d: 0.58 * d1 / 2.,y: d1 / 4.,z: -p1 * 0.28,ts: ts },cuss)
                .PushSquare(geo,{ solid: 2,w: w1 * 0.61,d: 0.61 * d1 / 2.,y: d1 / 4.,z: -p1 * 0.32,ts: ts },cuss)
                .Connect(geo)
                .PushSquare(geo,{ solid: 2,w: w1 * 0.61,d: 0.61 * d1 / 2.,y: d1 / 4.,z: -p1 * 0.32,ts: ts },cuss)
                .PushSquare(geo,{ solid: 2,w: w1,d: 1. * d1 / 2.,y: d1 / 4.,z: -p1 * 0.32,ts: ts },cuss)
                .Connect(geo)
                .PushSquare(geo,{ solid: 2,w: w1,d: 1. * d1 / 2.,y: d1 / 4.,z: -p1 * 0.32,ts: ts },cuss)
                .PushSquare(geo,{ solid: 2,w: w1,d: 1. * d1 / 2.,y: d1 / 4.,z: -p1 * 0.32,ts: ts },cuss)
                .Connect(geo)
                .PushSquare(geo,{ solid: 2,w: w1,d: 1. * d1 / 2.,y: d1 / 4.,z: -p1 * 0.32,ts: ts },cuss)
                .PushSquare(geo,{ solid: 2,w: w1,d: 1. * d1 / 2.,y: d1 / 4.,z: p1 * 0.32,ts: ts },cuss)
                .Connect(geo)
                .PushSquare(geo,{ solid: 2,w: w1,d: 1. * d1 / 2.,y: d1 / 4.,z: p1 * 0.32,ts: ts },cuss)
                .PushSquare(geo,{ solid: 2,w: w1 * 0.61,d: 0.61 * d1 / 2.,y: d1 / 4.,z: p1 * 0.32,ts: ts },cuss)
                .Connect(geo)
                .PushSquare(geo,{ solid: 2,w: w1 * 0.61,d: 0.61 * d1 / 2.,y: d1 / 4.,z: p1 * 0.32,ts: ts },cuss)
                .PushSquare(geo,{ solid: 2,w: w1 * 0.58,d: 0.58 * d1 / 2.,y: d1 / 4.,z: p1 * 0.28,ts: ts },cuss)
                .Connect(geo)
                .PushSquare(geo,{ solid: 2,w: w1 * 0.58,d: 0.58 * d1 / 2.,y: d1 / 4.,z: p1 * 0.28,ts: ts },cuss)
                .PushSquare(geo,{ solid: 2,w: w1 * 0.,d: 0.0 * d1 / 2.,y: d1 / 4.,z: p1 * 0.28,ts: ts },cuss)
                .Connect(geo)
                ;


            var rm2 = new GB.Rims().UV(function () { return { u: 0.55,v: 0.05 }; })
                .PushSquare(geo,{ solid: 2,w: 0,d: 0,y: d1 / 2.,x: w1 / 2. - p2 / 2. + 0.051,z: -p1 * 0.5,ts: ts },cuss)
                .PushSquare(geo,{ solid: 2,w: p2,d: 2. * p2,y: d1 / 2.,x: w1 / 2. - p2 / 2. + 0.051,z: -p1 * 0.5,ts: ts },cuss)
                .Connect(geo)
                .PushSquare(geo,{ solid: 2,w: p2,d: 2. * p2,y: d1 / 2.,x: w1 / 2. - p2 / 2. + 0.051,z: - p1 * 0.5,ts: ts },cuss)
                .PushSquare(geo,{ solid: 2,w: p2,d: 2. * p2,y: d1 / 2.,x: w1 / 2 - p2 / 2. + 0.051,z: p1 * 0.5,ts: ts },cuss)
                .Connect(geo)
                .PushSquare(geo,{ solid: 2,w: p2,d: 2. * p2,y: d1 / 2.,x: w1 / 2. - p2 / 2. + 0.051,z: p1 * 0.5,ts: ts },cuss)
                .PushSquare(geo,{ solid: 2,w: 0,d: 0,y: d1 / 2.,x: w1 / 2 - p2 / 2. + 0.051,z: p1 * 0.5,ts: ts },cuss)
                .Connect(geo)
                ;

            var rm2 = new GB.Rims().UV(function () { return { u: 0.55,v: 0.55 }; })
                .PushCircle(geo,{ w: p1 * 0.5,d: p1 * 0.5,y: d1 / 2. + p2 / 4.,x: w1 / 2. - p2 / 4.,z: 0.,ts: ts },cuss)
                .PushCircle(geo,{ w: p1 * 0.5,d: p1 * 0.5,y: d1 / 2. + p2 / 4.,x: w1 / 2. - p2 / 4.,z: p1 * 1.5,ts: ts },cuss)
                .Connect(geo)
                .PushCircle(geo,{
                    w: p1 * 0.5,d: p1 * 0.5,y: d1 / 2. + p2 / 4.,x: w1 / 2. - p2 / 4.,z: p1 * 1.5,ts: ts
                    ,ts1: { ry: 22.5 * deg,ce: { x: w1 / 2. - p2 / 4. - 0.25,y: 0.,z: p1 * 1.5 } }
                },cuss)
                .Connect(geo)
                .PushCircle(geo,{
                    w: p1 * 0.5,d: p1 * 0.5,y: d1 / 2. + p2 / 4.,x: w1 / 2. - p2 / 4.,z: p1 * 1.5,ts: ts
                    ,ts1: { ry: 45 * deg,ce: { x: w1 / 2. - p2 / 4. - 0.25,y: 0.,z: p1 * 1.5 } }
                },cuss)
                .Connect(geo)
                .PushCircle(geo,{
                    w: p1 * 0.5,d: p1 * 0.5,y: d1 / 2. + p2 / 4.,x: w1 / 2. - p2 / 4.,z: p1 * 1.5,ts: ts
                    ,ts1: { ry: 67.5 * deg,ce: { x: w1 / 2. - p2 / 4. - 0.25,y: 0.,z: p1 * 1.5 } }
                },cuss)
                .Connect(geo)
                .PushCircle(geo,{
                    w: p1 * 0.5,d: p1 * 0.5,y: d1 / 2. + p2 / 4.,x: w1 / 2. - p2 / 4.,z: p1 * 1.5,ts: ts
                    ,ts1: { ry: 90 * deg,ce: { x: w1 / 2. - p2 / 4. - 0.25,y: 0.,z: p1 * 1.5 } }
                },cuss)
                .Connect(geo)
                .PushCircle(geo,{
                    w: p1 * 0.5,d: p1 * 0.5,y: d1 / 2. + p2 / 4.,x: w1 / 2. - p2 / 4.,z: p1 * 3.5,ts: ts
                    ,ts1: { ry: 90 * deg,ce: { x: w1 / 2. - p2 / 4. - 0.25,y: 0.,z: p1 * 1.5 } }
                },cuss)
                .Connect(geo)
                .PushCircle(geo,{
                    w: p1 * 0.5,d: p1 * 0.5,y: d1 / 2. + p2 / 4.,x: w1 / 2. - p2 / 4.,z: p1 * 3.5,ts: ts
                    ,ts1: { ry: 90 * deg,ce: { x: w1 / 2. - p2 / 4. - 0.25,y: 0.,z: p1 * 1.5 } }
                },cuss)
                .PushCircle(geo,{
                    w: p1 * 0.,d: p1 * 0.,y: d1 / 2. + p2 / 4.,x: w1 / 2. - p2 / 4.,z: p1 * 3.5,ts: ts
                    ,ts1: { ry: 90 * deg,ce: { x: w1 / 2. - p2 / 4. - 0.25,y: 0.,z: p1 * 1.5 } }
                },cuss)
                .Connect(geo)

                ;


        }
    },
    asset_parkingSpot: {
        builder: function (setting,geo) {
            ind = 0;

            setting.md = def(setting.md,1.);
            setting.size = def(setting.sz,0.);

            console.log(3656,setting.md,setting.size);

            /* European Us .Compact */
            var w = 4.88;
            var h = 2.44;
            var edge = 0.1;

            /*  Us .standard */
            if (setting.size == 1) {
                w = 5.48;
                h = 2.59;
            }
            else if (setting.size == 2) {
                /*  Us .standard large */
                w = 6.10;
                h = 2.74;
            }


            function cus(p,op) {
                p = p_ts(p,def(op.ts,{}));

                p.x *= 10.;
                p.z *= 10.;

                p.y += 0.2;
                return p;
            }

            if (setting.md != 1) {
                var rim = new GB.Rims().UV(function () { return { u: 0.05,v: 0.05 }; })
                    .PushRim(geo,{
                        count: 9,
                        point: function (p,i) {

                            var i1 = floor(i / 2.);
                            i1 = (i1 % 4);
                            var i2 = (i % 2);
                            var i3 = ((floor((i1 + 1) / 2)) % 2) ? 1 : -1;
                            var i4 = ((floor(i1 / 2)) % 2) ? 1 : -1;

                            p.x += i3 * (w / 2 - edge * 3.);
                            p.z += i4 * (h / 2 - edge * 3.);

                            if (i1 == 0 || i1 == 2) {
                                p.x += (i2 ? -1. * edge : edge) * i3;
                                p.z += (i2 ? edge : -1.0 * edge) * i4;
                            }
                            else {
                                p.x += (i2 ? edge : -1.0 * edge) * i3;
                                p.z += (i2 ? -1.0 * edge : edge) * i4;
                            }
                            return cus(p,{});
                        }
                    })
                    .PushSquare(geo,{ sf: 'xz',w: 0.,d: 0.,y: 0.015 },cus)
                    .Connect(geo).UV(function () { return { u: 0.55,v: 0.55 }; })
                    .PushSquare(geo,{ sf: 'xz',w: w - edge * 8.,d: 0.1,y: 0.025,ts: { mz: h / 2. - 0.05 } },cus)
                    .PushSquare(geo,{ sf: 'xz',w: 0,d: 0.0,y: 0.025,ts: { mz: h / 2. - 0.05 } },cus)
                    .Connect(geo,null,null,1)
                    .PushSquare(geo,{ sf: 'xz',w: w - edge * 8.,d: 0.1,y: 0.025,ts: { mz: -h / 2. + 0.05 } },cus)
                    .PushSquare(geo,{ sf: 'xz',w: 0,d: 0.0,y: 0.025,ts: { mz: -h / 2. + 0.05 } },cus)
                    .Connect(geo,null,null,1)
                    .PushSquare(geo,{ sf: 'xz',w: 0.1,d: h / 4,y: 0.025,ts: { mx: w / 2. - 0.05 } },cus)
                    .PushSquare(geo,{ sf: 'xz',w: 0,d: 0.0,y: 0.025,ts: { mx: w / 2. - 0.05 } },cus)
                    .Connect(geo,null,null,1)
                    ;
            }
            else {
                var rim = new GB.Rims().UV(function () { return { u: 0.05,v: 0.05 }; })
                    .PushRim(geo,{
                        count: 9,
                        point: function (p,i) {

                            var i1 = floor(i / 2.);
                            i1 = (i1 % 4);
                            var i2 = (i % 2);
                            var i3 = ((floor((i1 + 1) / 2)) % 2) ? 1 : -1;
                            var i4 = ((floor(i1 / 2)) % 2) ? 1 : -1;

                            p.x += i3 * (w / 2 - edge * 3.);
                            p.z += i4 * (h / 2 - edge * 3.);

                            if (i1 == 0 || i1 == 2) {
                                p.x += (i2 ? -1. * edge : edge) * i3;
                                p.z += (i2 ? edge : -1.0 * edge) * i4;
                            }
                            else {
                                p.x += (i2 ? edge : -1.0 * edge) * i3;
                                p.z += (i2 ? -1.0 * edge : edge) * i4;
                            }
                            return cus(p,{});
                        }
                    }).PushSquare(geo,{ sf: 'xz',w: 0.,d: 0.,y: 0.015 },cus)
                    .Connect(geo).UV(function () { return { u: 0.55,v: 0.55 }; })
                    .PushSquare(geo,{ sf: 'xz',w: w / 4.,d: 0.1,y: 0.025,ts: { mz: -h / 2. + 0.05 } },cus)
                    .PushSquare(geo,{ sf: 'xz',w: 0,d: 0.0,y: 0.025,ts: { mz: -h / 2. + 0.05 } },cus)
                    .Connect(geo,null,null,1)
                    .PushSquare(geo,{ sf: 'xz',w: 0.1,d: h - edge * 8.,y: 0.025,ts: { mx: w / 2. - 0.05 } },cus)
                    .PushSquare(geo,{ sf: 'xz',w: 0,d: 0.0,y: 0.025,ts: { mx: w / 2. - 0.05 } },cus)
                    .Connect(geo,null,null,1)
                    .PushSquare(geo,{ sf: 'xz',w: 0.1,d: h - edge * 8.,y: 0.025,ts: { mx: -w / 2. + 0.05 } },cus)
                    .PushSquare(geo,{ sf: 'xz',w: 0,d: 0.0,y: 0.025,ts: { mx: -w / 2. + 0.05 } },cus)
                    .Connect(geo,null,null,1)
                    ;
            }

        }
    }
};