


scene.stablePosX = 0;
scene.stablePosZ = 0;

camera.customCameraController = function (part) {
  camera.detachControl(canvas);
  camera.disableControl = true;
  addControls(part.scene,part.camera,part.canvas);

};
//

scene.clearColor = new BABYLON.Color4(1.0,1.0,1.0,1);

scene.deskIdentity = 1;

for (var ms in scene.meshes) scene.disposeMesh(scene.meshes[ms]);

scene.roomPosY = 0.2;
scene.wallPosY = 0.;
scene.roomTitlePosY = 0.6;
scene.deskTitlePosY = 4.6;

scene.deskPosY = -4;
scene.parkPosY = 0;

/** color */

scene.floor_shape = { x: 201 / 255,y: 204 / 255,z: 210 / 255 };
scene.floor_wall = { x: 153 / 255,y: 156 / 255,z: 161 / 255 };
scene.floor_hover = { x: 0.0,y: 0.25,z: 0.45 };
scene.floor_select = { x: 249 / 255,y: 213 / 255,z: 7 / 255 };

scene.select_text_co = { x: 43 / 255,y: 46 / 255,z: 51 / 255 };
scene.defult_text_desk_co = '#ffffff'; // {x:255/255,y:255/255,z:255/255};  
scene.defult_text_room_co = '#2B2E33'; // {x:43/255,y:46/255,z:51/255};     

scene.floor_room = { x: 237 / 255,y: 238 / 255,z: 240 / 255 };
scene.floor_desk = { x: 14 / 255,y: 15 / 255,z: 17 / 255 };
scene.chair_color = { r: 34 / 255,g: 35 / 255,b: 37 / 255 };



scene.desk_font = "17px Arial";
scene.room_font = "bold 30px Arial";
scene.park_font = "bold 40px Arial";

scene.hexToRgb = function (hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1],16) / 255,
    g: parseInt(result[2],16) / 255,
    b: parseInt(result[3],16) / 255
  } : null;
};

/** ############################################ */
/** create end  */
/** ############################################ */

scene.assetMat = function (conf,type,map,part,size) {

  var rCo = Math.random() * 0.25 + 0.5;
  var gCo = Math.random() * 0.25 + 0.5;
  var bCo = Math.random() * 0.25 + 0.5;

  if (type == 'door') {

    var gCo = Math.random() * 0.25 + 0.15;
    var bCo = Math.random() * 0.25 + 0.05;

    var mat = new BABYLONX.ShaderBuilder()
      .Solid({ r: rCo,g: gCo,b: bCo })
      .Func(function (me) {
        me.Setting.FragmentWorld = true;
        return me;
      })
      .InLine(`
       vec3 wps = vec4(world*vec4(pos,1.)).xyz;
       vec3 wnr = mat3(world)*(nrm);`)
      .Reference(2)
      .Map({ path: window.baseImgURL + '/wood.jpg',uv: 'vec2(float(' + Math.random() + ')+pos.zy*0.05)' })
      .Reference(3)
      .SetUniform('timeSet','vec4')
      .InLine(` float dt = dot(nrm, normalize( wps.xyz - camera )); 
              result = vec4(result_2.xyz*0.92+0.1+0.08*dt,1.);  
              
              `)

      .Event(8,`
  
              vec3 nm = `+ BABYLONX.Normals.Flat + `; 
               
             result.xyz  = result.xyz;`)
      .Event(9,`
             float fog = min(1.,max(0.,length(camera-wps)/200. )); 
            result.xyz  =0.5-dt*0.2 +0.25* vec3(length(result_3.xyz)*0.8) *((1.-fog)*0.5+0.5);

            if(vuv.x > 0.5 && vuv.y > 0.5){
              result.xyz  = vec3(0.25)-pow(dt,3.)*0.5;
            }
            if(vuv.x < 0.5 && vuv.y > 0.5){
              result.xyz  = vec3(0.25)-pow(dt,3.)*0.5;
            } 
             if(vuv.x < 0.5 && vuv.y < 0.5){
              result.xyz  = vec3(0.25)-pow(dt,3.)*0.5;
            }             
            
            vec3 nm = `+ BABYLONX.Normals.Flat + `;
              result.xyz = (result.xyz*0.75+0.25) * vec3(0.05-0.25*abs(dt)+ pow(1.-dt,2.)*0.15+pow(dt,2.)*0.13 );
              result.xyz = (result.xyz*0.75+0.25);
            `)
      .VertexShader(BABYLONX.Helper().InLine(` 

            float ry1 = 0.;  float ry2 = 0.;

            if(uv.x > 0.5 && uv.y > 0.5){
               ry2=1.; ry1=1.;
            }
            if( uv.x < 0.5 &&  uv.y > 0.5){
              ry1=1.;
            }   
            if( uv.x > 0.5 &&  uv.y < 0.5){
              ry1=1.;
            }
            if( uv.x < 0.5 &&  uv.y < 0.5){
              
            }

            // w1 : 10 d1 21 p1 :1.5 y d1/2.+p2/4. x :w1/2.-p2/4.

            vec3 pos1 =  vec3(5.,0.,0.) ; 
            vec3 ce1 =  vec3(-5.0+0.375,10.5+0.375,0.)  ; 

            pos1 = r_y(pos, ry1*60.,vec3(5.,0.,0.));  
            
            
            `)

        .Event(6,` 

              if(timeSet.x > 0. ){

                float tm =  min(100.,time - timeSet.y)/100.; 

                if(tm <0.1) pos1 = r_z(pos1, -ry2*tm*10.*30.,ce1 ); 
          
                if(timeSet.z!=0.0)  pos1 = r_y(pos1, -ry1*80.+ry1*tm*80., vec3(5.,0.,0.) );
              }
      
         `)
        .Event(7,` 

               if(timeSet.x > 0. ){ 

                   float tm =  min(100.,time - timeSet.y )/100.;  

                   if(tm <0.1) pos1 = r_z(pos1, -ry2*tm*10.*30.,ce1 ); 
            
                   if(timeSet.z!=0.0) pos1 = r_y(pos1, -ry1*tm*80., vec3(5.,0.,0.) );
               }
         
            `)
        .Event(8,`
 
             pos1 = r_y(pos1, -ry1* 45., vec3(5.,0.,0.) );
        
            
            pos1.y = pos1.y > 2.5? 2.5:pos1.y;
            result = vec4(pos1,1.);
              
            `).Event(9,`

         
           
            
            result = vec4(pos1,1.);

             
              
            `).Build())

      .BuildMaterial(scene);

    mat.flagUp(8);
    mat.flagDown(9);
    mat.setVector4('timeSet',{ x: 0,y: 0,z: 0,w: 0 });

    return mat;

  }
  else if (type == 'parkingSpot') {

    var gCo = Math.random() * 0.25 + 0.25;
    var bCo = Math.random() * 0.25 + 0.15;
    var rCo = Math.random() * 0.25 + 0.05;

    if (!map || !map.reference_uuid) {

      gCo = 0.2;
      bCo = 0.2;
      rCo = 0.8;

    }


    var mat = new BABYLONX.ShaderBuilder()
      .Solid({ r: rCo,g: gCo,b: bCo })
      .Func(function (me) {
        me.Setting.FragmentWorld = true;
        return me;
      })
      .InLine(`
     vec3 wps = vec4(world*vec4(pos,1.)).xyz;
     vec3 wnr = mat3(world)*(nrm);`)
      .Reference(2)
      .Map({ path: window.baseImgURL + '/carview.png',alpha: 1,uv: 'min(vec2(1.),max(vec2(0.),vec2( 0.5+ pos.xz*0.0225) ))' })
      .Reference(3)
      .Transparency()
      .InLine(`

 
  
  float dt = dot(nrm, normalize( wps.xyz - camera )); 
            result = vec4(result_2.xyz*0.92+0.1+0.08*dt,1.);
             
  result.w = (1.-result_3.w)*0.1+0.5  ; 
  if(vuv.x < 0.5 && vuv.y < 0.5){
    result.w*=0.3;


  }
 
            `)

      .Event(8,` 
            vec3 nm = `+ BABYLONX.Normals.Flat + `;  
            result.xyz  = result.xyz;
            `)
      .Event(9,`
            float fog = min(1.,max(0.,length(camera-wps)/200. )); 
            result.xyz  =0.5-dt*0.2 +0.25* vec3(length(result_3.xyz)*0.8) *((1.-fog)*0.5+0.5);

            if(vuv.x < 0.5 && vuv.y < 0.5){
              result.w = result_3.w;

 
            }
          
            vec3 nm = ` + BABYLONX.Normals.Flat + `;
            result.xyz =result_2.xyz* vec3(0.05-0.25*abs(dt)+ pow(1.-dt,2.)*0.15+pow(dt,2.)*0.13 );
          `)

      .BuildMaterial(scene);

    mat.flagUp(8);
    mat.flagDown(9);

    return mat;
  }
  else if (type == 'tooltip') {
    var mat;

    if (part == 0) {
      mat = new BABYLONX.ShaderBuilder()
        .InLine(`
          vec2 nuv = vuv*1.1-0.05;
          nuv.x = min(1.,max(0.,nuv.x));
          nuv.y = min(1.,max(0.,nuv.y));
          
          `).Solid(scene.hexToRgb(def(conf.color,'#ffffff')))
        .Reference(2)
        .Solid(scene.hexToRgb(def(conf.fclr,'#000000'))).InLine('vec3 cor = result.xyz;')

        .Map({ path: def(conf.path,baseImgURL + '/add.png'),alpha: 1,uv: 'vec2(nuv.y,nuv.x)' })

        .InLine(` 
          
             if(nuv.x <0.001 || nuv.x > 0.999 || nuv.y <0.001 || nuv.y > 0.999  ) result.w = 0.; 
            `+ (conf.exac ? 'result = vec4( result.xyz   ,result.w);' : 'result = vec4(  cor ,result.w);')
        )
        .InLine(`
           if (nuv.x < 0.001 || nuv.x > 0.999 || nuv.y < 0.001 || nuv.y > 0.999) {
          result.w = 0.;

        }
        `)
        .Transparency()
        .BuildMaterial(scene);

    }
    else {
      mat = scene.dyRowText(def(conf.title,'unknown'),
        { /** canbe smaler size */
          w: size.w * 256,h: size.h * 256,fc: scene.hexToRgb(def(conf.fclr,'#000000'))
          ,cc: scene.hexToRgb(def(conf.color,'#ffffff')),color: '#000000'
        });
    }

    return mat;


    return mat;

  } else {

    var gCo = Math.random() * 0.25 + 0.25;
    var bCo = Math.random() * 0.25 + 0.15;
    var rCo = Math.random() * 0.25 + 0.05;


    var mat = new BABYLONX.ShaderBuilder()
      .Solid({ r: rCo,g: gCo,b: bCo })
      .Func(function (me) {
        me.Setting.FragmentWorld = true;
        return me;
      })
      .InLine(`
     vec3 wps = vec4(world * vec4(pos,1.)).xyz;
     vec3 wnr = mat3(world) * (nrm); `)
      .Reference(2)
      .Map({ path: window.baseImgURL + '/wood.jpg',uv: 'vec2(float(' + Math.random() + ')+pos.zx*0.05)' })
      .Reference(3)
      .InLine(` float dt = dot(nrm,normalize(wps.xyz - camera));
        result = vec4(result_2.xyz * 0.92 + 0.1 + 0.08 * dt,1.); `)

      .Event(8,` 
            vec3 nm = `+ BABYLONX.Normals.Flat + `;
        result.xyz = result.xyz; `)
      .Event(9,`
            float fog = min(1.,max(0.,length(camera - wps) / 200.));
        result.xyz = 0.5 - dt * 0.2 + 0.25 * vec3(length(result_3.xyz) * 0.8) * ((1. - fog) * 0.5 + 0.5);
          
            vec3 nm = ` + BABYLONX.Normals.Flat + `;
        result.xyz = result_2.xyz * vec3(0.05 - 0.25 * abs(dt) + pow(1. - dt,2.) * 0.15 + pow(dt,2.) * 0.13);
        `)

      .BuildMaterial(scene);

    mat.flagUp(8);
    mat.flagDown(9);

    return mat;
  }
};

scene.dyRowText = function (txt,set) {
  console.log('mmmmat');
  set = def(set,{});
  set.font = def(set.font,'bold 200px Arial');
  var mt = new BABYLONX.ShaderBuilder()


    .SetUniform('dySample','sampler2D')
    .SetUniform('sett','vec4')
    .Solid(set.cc)
    .Reference(2)
    .Solid(set.fc).InLine('vec3 cor = result.xyz;')

    .InLine(`
       vec2 nuv = vec2(min(1.,max(0.,vuv.x)),min(1.,max(0.,vuv.y)));
        `)
    .Map({ index: 'dySample',uv: 'vec2(nuv.y,nuv.x)',alpha: 1 })

    .InLine(` if (nuv.x < 0.001 || nuv.x > 0.999 || nuv.y < 0.001 || nuv.y > 0.999) result.w = 0.;

        result = vec4( mix(cor,result_2.xyz,1.-result.w),1.0);
        `)

    .BuildMaterial(scene);

  var canvasSize = [def(set.w,256),def(set.h,256) * 0.8];


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

  tmp.clear('#ffffff00');

  var ctx = mt.dyContext;

  var font = set.font.split(' ');
  var fontSize = '';
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


scene.createAsset = function (conf,fMap,par) {

  var cm1;

  cm1 = scene.createAssetModel(cm1,conf,fMap);


  scene.mapId[fMap.uuid].mesh = cm1;
  cm1.floor.hoverCheck = true;

  cm1.map = fMap;

  if (fMap.data.deskName) {

    scene.createTitle('parking spot',fMap.data.deskName,
      { alpha: 1,w: 256,h: 64,font: scene.park_font,color: scene.defult_text_desk_co }
      ,10.25,{ x: 0.,y: 5.50,z: 0. },cm1.floor);

  }



  cm1.position.x = fMap.data.pos.x;
  cm1.position.z = fMap.data.pos.z;
  cm1.position.y = scene.parkPosY;
  cm1.rotation.y = fMap.data.rot.y;

  cm1.floor.actionManager = new BABYLON.ActionManager(scene);
  cm1.floor.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPickTrigger,
      function (ev) {

        scene.selectItem(cm1.map.reference_uuid,true);

      }
    )
  );

  if (par) {
    cm1.parent = par;
  }


  if (scene.mapId[fMap.data.parent] && scene.mapId[fMap.data.parent].mesh) {
    cm1.parent = scene.mapId[fMap.data.parent].mesh;
  }



  return cm1;
};



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

    if (!scene.chairMat) scene.chairMat = new BABYLONX.ShaderBuilder().Solid(scene.chair_color)
      .Light({ direction: 'vec3(0.,100.,0.)',phonge: 0.28 }).BuildMaterial(scene);
    scene.cacheMesh[keyDesk].chairs = [];


    if ((confdesk.kind == 1 || confdesk.kind == 2) && confdesk.size == 2) {


      scene.cacheMesh[keyDesk].chairs.push(canvas_scene.modelCommand.createGeo('asset_chair',
        { md: 3,mode: 4,modeCount: 4,parts: [1,1,1,1],seg: 6,type: "chair" }).toMesh(canvas_scene));
      scene.cacheMesh[keyDesk].chairs.push(canvas_scene.modelCommand.createGeo('asset_chair',
        { md: 3,mode: 4,modeCount: 4,parts: [1,1,1,1],seg: 6,type: "chair" }).toMesh(canvas_scene));


      for (var i in scene.cacheMesh[keyDesk].chairs) {
        scene.cacheMesh[keyDesk].chairs[i].material = scene.chairMat;
        scene.cacheMesh[keyDesk].chairs[i].parent = scene.cacheMesh[keyDesk];
        scene.cacheMesh[keyDesk].chairs[i].scaling.y = 0.1;
        scene.cacheMesh[keyDesk].chairs[i].position.y = 4.0;
      }


      scene.cacheMesh[keyDesk].chairs[0].position.z = -4.25;
      scene.cacheMesh[keyDesk].chairs[1].position.z = 4.25;
      scene.cacheMesh[keyDesk].chairs[1].rotation.y = 180 * deg;




    }
    else if ((confdesk.kind == 1 || confdesk.kind == 2) && confdesk.size == 3) {


      scene.cacheMesh[keyDesk].chairs.push(canvas_scene.modelCommand.createGeo('asset_chair',
        { md: 3,mode: 4,modeCount: 4,parts: [1,1,1,1],seg: 6,type: "chair" }).toMesh(canvas_scene));
      scene.cacheMesh[keyDesk].chairs.push(canvas_scene.modelCommand.createGeo('asset_chair',
        { md: 3,mode: 4,modeCount: 4,parts: [1,1,1,1],seg: 6,type: "chair" }).toMesh(canvas_scene));
      scene.cacheMesh[keyDesk].chairs.push(canvas_scene.modelCommand.createGeo('asset_chair',
        { md: 3,mode: 4,modeCount: 4,parts: [1,1,1,1],seg: 6,type: "chair" }).toMesh(canvas_scene));
      scene.cacheMesh[keyDesk].chairs.push(canvas_scene.modelCommand.createGeo('asset_chair',
        { md: 3,mode: 4,modeCount: 4,parts: [1,1,1,1],seg: 6,type: "chair" }).toMesh(canvas_scene));


      for (var i in scene.cacheMesh[keyDesk].chairs) {
        scene.cacheMesh[keyDesk].chairs[i].material = scene.chairMat;
        scene.cacheMesh[keyDesk].chairs[i].parent = scene.cacheMesh[keyDesk];
        scene.cacheMesh[keyDesk].chairs[i].scaling.y = 0.1;
        scene.cacheMesh[keyDesk].chairs[i].position.y = 4.0;
      }


      scene.cacheMesh[keyDesk].chairs[0].position.z = -5.25;
      scene.cacheMesh[keyDesk].chairs[1].position.z = 5.25;
      scene.cacheMesh[keyDesk].chairs[1].rotation.y = 180 * deg;

      scene.cacheMesh[keyDesk].chairs[2].position.x = 5.25;
      scene.cacheMesh[keyDesk].chairs[2].rotation.y = -90 * deg;

      scene.cacheMesh[keyDesk].chairs[3].position.x = -5.25;
      scene.cacheMesh[keyDesk].chairs[3].rotation.y = 90 * deg;


    }
    else if ((confdesk.kind == 1 || confdesk.kind == 2) && confdesk.size == 4) {

      scene.cacheMesh[keyDesk].chairs.push(canvas_scene.modelCommand.createGeo('asset_chair',
        { md: 3,mode: 4,modeCount: 4,parts: [1,1,1,1],seg: 6,type: "chair" }).toMesh(canvas_scene));
      scene.cacheMesh[keyDesk].chairs.push(canvas_scene.modelCommand.createGeo('asset_chair',
        { md: 3,mode: 4,modeCount: 4,parts: [1,1,1,1],seg: 6,type: "chair" }).toMesh(canvas_scene));
      scene.cacheMesh[keyDesk].chairs.push(canvas_scene.modelCommand.createGeo('asset_chair',
        { md: 3,mode: 4,modeCount: 4,parts: [1,1,1,1],seg: 6,type: "chair" }).toMesh(canvas_scene));
      scene.cacheMesh[keyDesk].chairs.push(canvas_scene.modelCommand.createGeo('asset_chair',
        { md: 3,mode: 4,modeCount: 4,parts: [1,1,1,1],seg: 6,type: "chair" }).toMesh(canvas_scene));
      scene.cacheMesh[keyDesk].chairs.push(canvas_scene.modelCommand.createGeo('asset_chair',
        { md: 3,mode: 4,modeCount: 4,parts: [1,1,1,1],seg: 6,type: "chair" }).toMesh(canvas_scene));
      scene.cacheMesh[keyDesk].chairs.push(canvas_scene.modelCommand.createGeo('asset_chair',
        { md: 3,mode: 4,modeCount: 4,parts: [1,1,1,1],seg: 6,type: "chair" }).toMesh(canvas_scene));


      for (var i in scene.cacheMesh[keyDesk].chairs) {
        scene.cacheMesh[keyDesk].chairs[i].material = scene.chairMat;
        scene.cacheMesh[keyDesk].chairs[i].parent = scene.cacheMesh[keyDesk];
        scene.cacheMesh[keyDesk].chairs[i].scaling.y = 0.1;
        scene.cacheMesh[keyDesk].chairs[i].position.y = 4.0;
      }


      scene.cacheMesh[keyDesk].chairs[0].position.z = -5.25;
      scene.cacheMesh[keyDesk].chairs[0].position.x = -4.25;

      scene.cacheMesh[keyDesk].chairs[1].position.z = 5.25;
      scene.cacheMesh[keyDesk].chairs[1].position.x = -4.25;
      scene.cacheMesh[keyDesk].chairs[1].rotation.y = 180 * deg;

      scene.cacheMesh[keyDesk].chairs[4].position.z = -5.25;
      scene.cacheMesh[keyDesk].chairs[4].position.x = 4.25;

      scene.cacheMesh[keyDesk].chairs[5].position.z = 5.25;
      scene.cacheMesh[keyDesk].chairs[5].position.x = 4.25;
      scene.cacheMesh[keyDesk].chairs[5].rotation.y = 180 * deg;


      scene.cacheMesh[keyDesk].chairs[2].position.x = 9.25;
      scene.cacheMesh[keyDesk].chairs[2].rotation.y = -90 * deg;

      scene.cacheMesh[keyDesk].chairs[3].position.x = -9.25;
      scene.cacheMesh[keyDesk].chairs[3].rotation.y = 90 * deg;


    } else if ((confdesk.kind == 3 || confdesk.kind == 4) && confdesk.size == 5) {

      for (var i = 0; i < 4; i++)
        scene.cacheMesh[keyDesk].chairs.push(canvas_scene.modelCommand.createGeo('asset_chair',
          { md: 3,mode: 4,modeCount: 4,parts: [1,1,1,1],seg: 6,type: "chair" }).toMesh(canvas_scene));


      for (var i in scene.cacheMesh[keyDesk].chairs) {
        scene.cacheMesh[keyDesk].chairs[i].material = scene.chairMat;
        scene.cacheMesh[keyDesk].chairs[i].parent = scene.cacheMesh[keyDesk];
        scene.cacheMesh[keyDesk].chairs[i].scaling.y = 0.1;
        scene.cacheMesh[keyDesk].chairs[i].position.y = 4.0;

        var al = i * deg * 360. / 4.;

        scene.cacheMesh[keyDesk].chairs[i].position.z = sin(al) * 7.5;
        scene.cacheMesh[keyDesk].chairs[i].position.x = cos(al) * 7.5;
        scene.cacheMesh[keyDesk].chairs[i].rotation.y = -al - 90. * deg;

      }
    } else if ((confdesk.kind == 3 || confdesk.kind == 4) && confdesk.size == 1) {

      for (var i = 0; i < 8; i++)
        scene.cacheMesh[keyDesk].chairs.push(canvas_scene.modelCommand.createGeo('asset_chair',
          { md: 3,mode: 4,modeCount: 4,parts: [1,1,1,1],seg: 6,type: "chair" }).toMesh(canvas_scene));


      for (var i in scene.cacheMesh[keyDesk].chairs) {
        scene.cacheMesh[keyDesk].chairs[i].material = scene.chairMat;
        scene.cacheMesh[keyDesk].chairs[i].parent = scene.cacheMesh[keyDesk];
        scene.cacheMesh[keyDesk].chairs[i].scaling.y = 0.1;
        scene.cacheMesh[keyDesk].chairs[i].position.y = 4.0;

        var al = i * deg * 360. / 8.;

        scene.cacheMesh[keyDesk].chairs[i].position.z = sin(al) * 7.5;
        scene.cacheMesh[keyDesk].chairs[i].position.x = cos(al) * 14.5;
        scene.cacheMesh[keyDesk].chairs[i].rotation.y = -al - 90. * deg;

      }
    } else if ((confdesk.kind == 3 || confdesk.kind == 4) && confdesk.size == 2) {

      for (var i = 0; i < 12; i++)
        scene.cacheMesh[keyDesk].chairs.push(canvas_scene.modelCommand.createGeo('asset_chair',
          { md: 3,mode: 4,modeCount: 4,parts: [1,1,1,1],seg: 6,type: "chair" }).toMesh(canvas_scene));



      for (var i in scene.cacheMesh[keyDesk].chairs) {
        scene.cacheMesh[keyDesk].chairs[i].material = scene.chairMat;
        scene.cacheMesh[keyDesk].chairs[i].parent = scene.cacheMesh[keyDesk];
        scene.cacheMesh[keyDesk].chairs[i].scaling.y = 0.1;
        scene.cacheMesh[keyDesk].chairs[i].position.y = 4.0;

        var al = i * deg * 360. / 12.;

        scene.cacheMesh[keyDesk].chairs[i].position.z = sin(al) * 14.5;
        scene.cacheMesh[keyDesk].chairs[i].position.x = cos(al) * 14.5;
        scene.cacheMesh[keyDesk].chairs[i].rotation.y = -al - 90. * deg;

      }
    } else if ((confdesk.kind == 3 || confdesk.kind == 4) && confdesk.size == 3) {


      for (var i = 0; i < 16; i++)
        scene.cacheMesh[keyDesk].chairs.push(canvas_scene.modelCommand.createGeo('asset_chair',
          { md: 3,mode: 4,modeCount: 4,parts: [1,1,1,1],seg: 6,type: "chair" }).toMesh(canvas_scene));


      for (var i in scene.cacheMesh[keyDesk].chairs) {
        scene.cacheMesh[keyDesk].chairs[i].material = scene.chairMat;
        scene.cacheMesh[keyDesk].chairs[i].parent = scene.cacheMesh[keyDesk];
        scene.cacheMesh[keyDesk].chairs[i].scaling.y = 0.1;
        scene.cacheMesh[keyDesk].chairs[i].position.y = 4.0;

        var al = i * deg * 360. / 16.;

        scene.cacheMesh[keyDesk].chairs[i].position.z = sin(al) * 14.5;
        scene.cacheMesh[keyDesk].chairs[i].position.x = cos(al) * 22;
        scene.cacheMesh[keyDesk].chairs[i].rotation.y = -al - 90. * deg;

      }
    } else if ((confdesk.kind == 3 || confdesk.kind == 4) && confdesk.size == 4) {


      for (var i = 0; i < 20; i++)
        scene.cacheMesh[keyDesk].chairs.push(canvas_scene.modelCommand.createGeo('asset_chair',
          { md: 3,mode: 4,modeCount: 4,parts: [1,1,1,1],seg: 6,type: "chair" }).toMesh(canvas_scene));


      for (var i in scene.cacheMesh[keyDesk].chairs) {
        scene.cacheMesh[keyDesk].chairs[i].material = scene.chairMat;
        scene.cacheMesh[keyDesk].chairs[i].parent = scene.cacheMesh[keyDesk];
        scene.cacheMesh[keyDesk].chairs[i].scaling.y = 0.1;
        scene.cacheMesh[keyDesk].chairs[i].position.y = 4.0;

        var al = i * deg * 360. / 20.;

        scene.cacheMesh[keyDesk].chairs[i].position.z = sin(al) * 14.5;
        scene.cacheMesh[keyDesk].chairs[i].position.x = cos(al) * 29;
        scene.cacheMesh[keyDesk].chairs[i].rotation.y = -al - 90. * deg;

      }
    } else {


      scene.cacheMesh[keyDesk].chairs.push(canvas_scene.modelCommand.createGeo('asset_chair',
        { md: 3,mode: 4,modeCount: 4,parts: [1,1,1,1],seg: 6,type: "chair" }).toMesh(canvas_scene));



      for (var i in scene.cacheMesh[keyDesk].chairs) {
        scene.cacheMesh[keyDesk].chairs[i].material = scene.chairMat;
        scene.cacheMesh[keyDesk].chairs[i].parent = scene.cacheMesh[keyDesk];
        scene.cacheMesh[keyDesk].chairs[i].scaling.y = 0.1;
        scene.cacheMesh[keyDesk].chairs[i].position.y = 4.0;
      }


      scene.cacheMesh[keyDesk].chairs[0].position.z = -2.5;

    }




  }

  if (scene.cacheMesh[keyDesk]) {

    cm1.floor = scene.cacheMesh[keyDesk].clone();
    cm1.floor.parent = cm1;
    cm1.floor.position.y = 0;


    cm1.isDesk = 1;
    cm1.name = 'desk';
    cm1.id = id;
    cm1.parent = parent;

    cm1.floor.material = scene.getMat(scene.floor_desk,scene.floor_hover);

  }
  cm1.conf1 = confdesk;

  return cm1;

};

scene.desks = [];

scene.createDesk = function (deskRef,confdesk) {

  var cm1;
  var id = null;

  if (deskRef) {
    id = deskRef.uuid;

    cm1 = scene.createDeskModel(cm1,confdesk);

    cm1.floor.hoverCheck = true;
    cm1.map = deskRef;

    scene.createTitle('desk',deskRef.data.deskName,
      { alpha: 1,w: 256,h: 64,font: scene.desk_font,color: scene.defult_text_desk_co }
      ,10.25,{ x: 0.,y: 5.50,z: 0. },cm1.floor);

    cm1.floor.actionManager = new BABYLON.ActionManager(scene);
    cm1.floor.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPickTrigger,
        function (ev) {

          scene.selectItem(cm1.map.reference_uuid,true);

        }
      )
    );


    scene.desks[deskRef.reference_uuid] = cm1;

    scene.mapId[deskRef.uuid].mesh = cm1;

    cm1.position.x = deskRef.data.pos.x;
    cm1.position.z = deskRef.data.pos.z;
    cm1.position.y = scene.deskPosY;
    cm1.rotation.y = deskRef.data.rot.y;


    if (scene.mapId[deskRef.data.parent] && scene.mapId[deskRef.data.parent].mesh) {
      cm1.parent = scene.mapId[deskRef.data.parent].mesh;

    }

    return cm1;
  }

};

scene.makeSubShape = function (modelItem,x,y,z,r,w,h,m,co,ref,isTemp,isAttach,roomMode,roomRef) {

  function apply(modelItem,x,y,z,r,w,h,m,co,map,temp,attach,rmmd,rmref) {

    var res = scene.createShape(map,(m != 'roomCorner' ? w : null),w,h,0,y,m,co,rmmd,rmref);

    var grp = res.cm;

    if (scene.mapId[map.uuid]) {
      scene.mapId[map.uuid].mesh = grp;
    }
    grp.parent = modelItem;

    grp.position.x = (map.data.pos ? map.data.pos.x : x);
    grp.position.z = (map.data.pos ? map.data.pos.z : z);
    grp.rotation.y = (map.data.pos ? map.data.pos.r : r);

    res.cm1.floorSubItem = true;
  }

  if (!ref && !isTemp) {

    //apply(modelItem,x,y,z ,r,w,h,m,co,map,null,null,roomMode,roomRef);  

  } else if (!isTemp) {

    apply(modelItem,ref.data.x,ref.data.y,ref.data.z,ref.data.r,ref.data.w,ref.data.h,ref.data.m,co == 'locked' ? co : ref.data.co,ref,null,null,roomMode);

  }
};

var canvasCount = 0;
scene.liveCanvas = function (w,h) {
  var can = document.createElement("canvas");
  can.id = "can" + canvasCount++;
  can.width = w;
  can.height = h;
  return can;
};

scene.dyMat = function (txt,set,co) {
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
    console.log('sss',tts.length,i,txt,floor((i.valueOf() * 1 + 1) * (100 / (tts.length + 1))));

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

scene.circle = scene.modelCommand.createGeo('circle',{}).toMesh(scene);
scene.circle.position.y = -60000;

scene.square = scene.modelCommand.createGeo('square',{}).toMesh(scene);
scene.square.position.y = -60000;
scene.titles = [];


scene.createTitle = function (ty,ttl,set,sc,pos,par,map) {

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


  title.isPickable = false;
  title.ignorePick = true;

  title.position.y = pos.y;
  title.posy = pos.y;

  title.position.x = pos.x;
  title.position.z = pos.z;

  title.material = scene.dyMat(ttl,set,set.color);

  par.title = title;
};

scene.createShape = function (map,w1,W,H,r,y,m,co,roomMode,rmref) {

  shapeCounter++;

  var cm = new BABYLON.Mesh('s',scene);

  cm.color = co;

  cm.rot = r;

  cm.isRoomMode = roomMode;

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

  var cm1 = null;

  cm1 = canvas_scene.modelCommand.createGeo((m == 'triangle' || m == 'shape_polygon' || m == 'circle_cus' || m == 'circle_full' || m == 'wall2point' ? m : 'room'),cm.conf1).toMesh(canvas_scene);
  scene.cacheMesh[key1] = cm1;
  cm1.name = 'shape';
  cm1.parent = cm;
  cm1.material = cm.conf1.md == 'wall2point' ? scene.getMat(scene.floor_wall,scene.floor_hover) :

    (cm.conf1.room ? scene.getMat(scene.floor_room,scene.floor_hover) : scene.getMat(scene.floor_shape,scene.floor_hover));
  cm.floor = cm1;

  if (cm.conf1.md == 'wall2point') cm.position.y = scene.wallPosY;
  if (cm.conf1.room) cm.position.y = scene.roomPosY;


  if (co == 'locked')
    cm.isLocked = true;

  cm.isShape = true;
  cm.isWallShape = m == 'wall2point';

  cm1.scaling.y = 0.01;

  //scene.shapes[shapeId] = {cm:cm,cm1:cm1}; 

  if (rmref && rmref.id) {

    map.data.genRoom = rmref.id;
    map.data.roomType = "General Room";
    map.data.type = "Room";
    map.data.conf1 = cm.conf1;



  } else if (map && map.data && map.data.conf1 && map.data.conf1.room) {

    if (map.data.roomType == "Meeting Room") {
      scene.createTitle('meetroom',map.name,
        { alpha: 1,w: 256,h: 64,backRadiusRect: 32,font: scene.room_font,color: scene.defult_text_room_co }
        ,7.25,{ x: 0.,y: 0.50,z: 0. },cm,map);

      cm.floor.hoverCheck = true;
      cm.map = map;
      cm.map.reference_uuid = cm.map.data.meetRoom;

      cm.floor.actionManager = new BABYLON.ActionManager(scene);
      cm.floor.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnPickTrigger,
          function (ev) {

            scene.selectItem(cm.map.reference_uuid,true);

          }
        )
      );
    }
    else {

      scene.createTitle('room',map.name,
        { alpha: 1,w: 256,h: 64,backRadiusRect: 32,font: scene.room_font,color: scene.defult_text_room_co }
        ,7.25,{ x: 0.,y: 0.50,z: 0. },cm,map);


    }

  }

  /** createDesks */


  return { cm: cm,cm1: cm1 };
};

/** ############################################ */
/** create end  */
/** ############################################ */


scene.floors = [];
scene.mapPar = [];
scene.mapRef = [];
scene.mapId = [];
scene.cacheMesh = [];
shapeCounter = 0;
br = 0.5;
scene.LoadingSphere = new BABYLON.Mesh.CreateSphere('s',6,1,scene);
scene.LoadingSphere.position.y = -50000;

scene.initMats = function () {

  if (!scene.liveMats)
    scene.liveMats = [];
  for (var i = 0; i < 100; i++) {
    scene.liveMats.push(new BABYLONX.ShaderBuilder()
      // .Map({path:'/os3d/3dimages/temp.png' })
      .Solid({ r: Math.random(),g: Math.random(),b: Math.random() })
      .SetUniform('color','vec3')
      .SetUniform('color2','vec3')
      .InLine(`
    
    if(length(color)!=0.0) result = vec4(color,1.); 

    `)
      .Event(1,` 
    
    if(length(result.xyz)>0.8) result.xyz *= 0.5;
    result.xyz += color2;`)
      .Event(2,` 
    
    if(length(result.xyz)>0.8) result.xyz *= 0.5;
    result.xyz  = vec3(float(`+ scene.floor_select.x + `),float(` + scene.floor_select.y + `),float(` + scene.floor_select.z + `));`)

      .BuildMaterial(scene));

    mat = n_1(scene.liveMats);

    var it = scene.LoadingSphere.clone();
    it.position.x = Math.random() * 30 - 15;
    it.position.y = Math.random() * 30 - 15;

    it.position.z = Math.random() * 30 - 15;
    it.material = mat;
    it.dispose();
  }
  return scene.liveMats.pop();
};

scene.getFloor = function (uuid) {



  for (var i in scene.mapId) {
    i = scene.mapId[i];

    if (i.reference_uuid == uuid) return i.o + '!' + i.floor;

  }

};

scene.moveCenter = function () {



};

scene.getFloorFromOffice = function (office) {

  for (var i in scene.floors) {
    i = scene.floors[i];
    if (i.o == office) return i.o + '!' + i.floor;
  }

};

scene.oDesks = [];
scene.oMeets = [];
scene.oParks = [];

scene.prepareData = function (uuid,o,fun) {
  if (!scene.oDesks[o]) {

    console.log(999);

    scene.oDesks[o] = [];
    scene.oMeets[o] = [];
    scene.oParks[o] = [];

    new entity('desk',localDB.officeRef).list().then(function (d) {

      for (var i in d.desks) {
        if (d.desks[i]) {
          canvas_scene.oDesks[o][d.desks[i].uuid] = d.desks[i];
          console.log(556);
        }
      }

      new entity('meeting-room',localDB.officeRef).list().then(function (d) {
        for (var j in d.meeting_rooms) {
          if (d.meeting_rooms[j])
            canvas_scene.oMeets[o][d.meeting_rooms[j].uuid] = d.meeting_rooms[j];
        }

        new entity('parking-spot',localDB.officeRef).list().then(function (d) {

          console.log(8989,d);

          for (var v in d.parking_spots) {
            if (d.parking_spots[v])
              canvas_scene.oParks[o][d.parking_spots[v].uuid] = d.parking_spots[v];
          }

          fun(uuid,o);

        });
      });
    });

  } else fun(uuid,o);
};



var desksUnMap = new BABYLON.Mesh(scene);

desksUnMap.position.x = 5000;
desksUnMap.position.z = 5000;
desksUnMap.column = 12;
desksUnMap.w = 10;
desksUnMap.h = 17;
desksUnMap.r = 0 * deg;
desksUnMap.i = 0;

var roomsUnMap = new BABYLON.Mesh(scene);

roomsUnMap.position.x = -5000;
roomsUnMap.position.z = 5000;
roomsUnMap.column = 6;
roomsUnMap.w = 30;
roomsUnMap.h = 30;
roomsUnMap.r = 90 * deg;
roomsUnMap.i = 0;

var parksUnMap = new BABYLON.Mesh(scene);

parksUnMap.position.x = -5000;
parksUnMap.position.z = -5000;
parksUnMap.column = 10;
parksUnMap.w = 10;
parksUnMap.h = 25;
parksUnMap.r = 90 * deg;
parksUnMap.i = 0;

scene.addUnMap = function (uuid,office,type,par) {

  scene.stablePosZ = par.absolutePosition.x;
  scene.stablePosX = par.absolutePosition.z;


  var parEx = null;
  for (var i in par._children) {
    par._children[i].floor.material.flagDown(2);
    par._children[i].title.material.flagDown(2);

    if (par._children[i].uuid == uuid) {
      parEx = par._children[i];

    }
  }

  if (parEx) {
    setTimeout(function () {
      camera._currentTarget.x = parEx.absolutePosition.x + camera.radius * 0.5 / 3.;
      camera._currentTarget.z = parEx.absolutePosition.z;

      scene.lastSelectedPosX = camera._currentTarget.x * 1.0 + 0.0001;
      scene.lastSelectedPosZ = camera._currentTarget.z * 1.0 + 0.0001;


      parEx.floor.material.flagUp(2);
      parEx.title.material.flagUp(2);

    },100);
    return;
  }



  function loadAfterCheck(d) {

    console.log(d);
    var font = scene.desk_font;

    if (type == 'desk') { d = d.desk; }
    if (type == 'meeting-room') { d = d.meeting_room; font = scene.room_font; }
    if (type == 'parking-spot') { d = d.parking_spot; font = scene.park_font; }

    var mesh = new BABYLON.Mesh(scene);

    mesh.floor = new BABYLON.Mesh.CreateBox("s",1,scene);
    mesh.floor.scaling.x = par.h;
    mesh.floor.scaling.z = par.w;
    mesh.floor.scaling.y = 0.1;

    mesh.uuid = uuid;
    mesh.floor.material = scene.getMat(scene.floor_desk,scene.floor_hover);
    mesh.floor.parent = mesh;

    mesh.parent = par;
    mesh.position.x = (par.i % par.column) * (par.w + 1.2);
    mesh.position.z = floor(par.i / par.column) * (par.h + 1.2);
    mesh.rotation.y = -90. * deg + par.r;
    par.i++;

    scene.createTitle(type,d.name,
      { alpha: 1,w: 256,h: 64,font: font,color: scene.defult_text_desk_co }
      ,10.25,{ x: 0.,y: 5.50,z: 0. },mesh);


    scene.findedItem = mesh;
    setTimeout(function () {
      camera._currentTarget.x = scene.findedItem.absolutePosition.x + camera.radius * 0.5 / 3.;
      camera._currentTarget.z = scene.findedItem.absolutePosition.z;

      scene.lastSelectedPosX = camera._currentTarget.x * 1.0 + 0.0001;
      scene.lastSelectedPosZ = camera._currentTarget.z * 1.0 + 0.0001;


      scene.findedItem.floor.material.flagUp(2);
      scene.findedItem.title.material.flagUp(2);

    },100);

  }

  if (type == 'parking-spot')
    new entity(type).id(uuid).get().then(function (d) {

      loadAfterCheck(d);
    });
  else if (type == 'meeting-room')
    new entity(type).id(uuid).get().then(function (d) {

      loadAfterCheck(d);
    });
  else
    new entity(type,new entity('office').id(office)).id(uuid).get().then(function (d) {

      loadAfterCheck(d);
    });

};

scene.moveCenter = function () {

  camera._currentTarget.x = scene.lastSelectedPosX;
  camera._currentTarget.z = scene.lastSelectedPosZ;

};


scene.selectItem = function (uuid,sendMsg,office,type) {

  first('.wait2Loader').classList.remove('hdn-i');

  scene.stablePosZ = 0;
  scene.stablePosX = 0;


  if (sendMsg && uuids && uuids.indexOf(uuid) == -1) {

    first('.wait2Loader').classList.add('hdn-i');
    return;
  }

  console.log(1);

  if (sendMsg && window.ReactNativeWebView)
    window.ReactNativeWebView.postMessage(JSON.stringify({
      command: "select",
      uuid: uuid
    }),'*');

  for (var i in scene.meshes) {
    i = scene.meshes[i];
    if (i && i.hoverCheck) {
      i.material.flagDown(2);
      if (i.title)
        i.title.material.flagDown(2);
    }
  }

  var floor = scene.getFloor(uuid);

  console.log(21111,floor);

  if (!floor) {

    first('.wait2Loader').classList.add('hdn-i');

    if (type == 'desk')
      scene.addUnMap(uuid,office,type,desksUnMap);
    if (type == 'meeting-room')
      scene.addUnMap(uuid,office,type,roomsUnMap);
    if (type == 'parking-spot')
      scene.addUnMap(uuid,office,type,parksUnMap);

    // sysLog(uuid+'warning : Item Not Found In Map')

  } else {

    first('.status').classList.add('hdn-i');

    var o = canvas_scene.floors[floor].o;

    scene.seletedFloor = canvas_scene.floors[floor];

    console.log(3,scene.seletedFloor);

    scene.prepareData(uuid,o,function () {
      console.log(4,scene.seletedFloor);

      scene.initFloor(floor,function () {
        console.log(5,scene.seletedFloor);


        first('.wait2Loader').classList.add('hdn-i');
        scene._engine.resize();

        for (var i in scene.mapId) {
          i = scene.mapId[i];
          if (i.reference_uuid == uuid) {

            i.mesh.floor.material.flagUp(2);

            if (i.mesh.floor.title)
              i.mesh.floor.title.material.flagUp(2);

            camera._currentTarget.x = i.mesh.absolutePosition.x + camera.radius * 0.5 / 3.;
            camera._currentTarget.z = i.mesh.absolutePosition.z;

            scene.lastSelectedPosX = camera._currentTarget.x * 1.0 + 0.0001;
            scene.lastSelectedPosZ = camera._currentTarget.z * 1.0 + 0.0001;


          };
        }
      });
    });

  }
};

scene.initFloor = function (uuid,fun) {

  scene.initOnly2D = true;

  if (scene && scene.floors[uuid]) {

    for (var j in scene.floors) {
      j = scene.floors[j];
      if (j && j.mesh) j.mesh.position.y = 5000;
    }

    if (!scene.floors[uuid].mesh) {

      scene.floors[uuid].mesh = new BABYLON.Mesh('floor_parent',scene);

    } else {

      scene.floors[uuid].mesh.position.y = 0;

      if (fun) fun();

      return;
    }

    for (var i in scene.floors[uuid].items) {

      var ni = scene.floors[uuid].items[i];

      if (ni.type == "shape") {
        scene.makeSubShape(scene.floors[uuid].mesh,ni.data.x,ni.data.y,ni.data.z,ni.data.r,ni.data.w,ni.data.h,ni.data.m,scene.floorColor,ni);
      }

    }


    for (var i in scene.floors[uuid].items) {

      var ni = scene.floors[uuid].items[i];

      if (ni.type == "desk") {

        console.log(77,ni.o,scene.oDesks);
        ni.data.deskName = scene.oDesks[ni.o][ni.reference_uuid].name;

        scene.createDesk(ni,ni.data.conf1);
      }

      if (ni.type == "asset" && ni.data.conf1.type == "parkingSpot" && ni.reference_uuid != "" && scene.oParks[ni.o][ni.reference_uuid]) {


        if (scene.oParks[ni.o][ni.reference_uuid]) {
          ni.data.deskName = scene.oParks[ni.o][ni.reference_uuid].name;
          scene.createAsset(ni.data.conf1,ni);
        }
      }

      if (ni.type == "asset" && ni.data.conf1.type == "tooltip") {


        scene.createAsset(ni.data.conf1,ni,scene.floors[uuid].mesh);

      }

    }
    if (fun) setTimeout(fun,500);
  }
};

scene.getMat = function (color,hover) {
  var mat;
  if (!scene.liveMats) mat = scene.initMats();
  var mat = scene.liveMats.pop();
  if (!mat) mat = scene.initMats();

  mat.setVector3('color',color);
  mat.setVector3('color2',hover);

  return mat;
};

scene.initFirst2D = function (fun,o) {




  new entity('floor',new entity('office').id(o)).list().then(function (df) {



    for (var f in df.floors) {

      f = df.floors[f];
      f.o = o;

      f.data = { parent: f.uuid };

      scene.floors[o + '!' + f.uuid] = f;
    }

    new entity('office').id(o).get().then(function () {

      localDB.officeRef = this;

      new entity('mapitem',localDB.officeRef).list(function (d) {





        for (var i in d.map_items) {
          i = d.map_items[i];

          console.log(i);

          scene.mapId[i.uuid] = i;

          if (i.data.meetRoom && i.data.meetRoom.length > 10) /** have valid uuid */
            scene.mapId[i.uuid].reference_uuid = i.data.meetRoom;

          scene.mapId[i.uuid].o = o;

          if (i.data && i.data.parent && !scene.mapPar[i.data.parent])
            scene.mapPar[i.data.parent] = [];
          if (i.data && i.data.parent && scene.mapPar[i.data.parent])
            scene.mapPar[i.data.parent].push(i);

          if (i.reference_uuid) scene.mapRef[i.reference_uuid] = i;

        }


        for (var j in scene.mapId) {
          var i = scene.mapId[j];

          // all shapes wall and first level parents
          if (i.data && i.data.parent &&
            scene.floors[i.o + '!' + i.data.parent]) {

            if (!scene.floors[i.o + '!' + i.data.parent].items)
              scene.floors[i.o + '!' + i.data.parent].items = [];

            scene.floors[i.o + '!' + i.data.parent].items[j] = i;
            scene.mapId[j].floor = i.data.parent;

          }

          // all second lever parent desk and assets
          if (i.data && i.data.parent &&
            scene.mapId[i.data.parent] && scene.mapId[i.data.parent].data.parent &&
            scene.floors[i.o + '!' + scene.mapId[i.data.parent].data.parent]) {

            if (!scene.floors[i.o + '!' + scene.mapId[i.data.parent].data.parent].items)
              scene.floors[i.o + '!' + scene.mapId[i.data.parent].data.parent].items = [];

            scene.floors[i.o + '!' + scene.mapId[i.data.parent].data.parent].items[j] = i;

            scene.mapId[j].floor = scene.mapId[i.data.parent].data.parent;
          }
        }

        if (fun) fun();

      });

    });

  });

};

scene.time = 0;
scene.onFrame = function (ti,c) {
  var t = scene.time++;

  camera.panningSensibility = 5. * max(0.5,3140 / camera.radius);
  scene.panning_Sensibility = max(0.5,3140 / camera.radius);

  camera.wheelPrecision = 314 / camera.radius;
  camera.pinchPrecision = 314 / camera.radius;

  camera.alpha = 0;
  camera.beta = 0;

  camera.radius = min(1000,max(30,camera.radius));

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

var dragStart = { x: 0,y: 0,t: 0 };

scene.onPointerDown = function (event,inf) {

  dragStart.t = new Date().getTime();
  dragStart.x = scene.pointerX;
  dragStart.y = scene.pointerY;
  dragStart.ox = camera._currentTarget.x * 1.0 + 0.0001;
  dragStart.oy = camera._currentTarget.z * 1.0 + 0.0001;

};

scene.onPointerUp = function (event,inf) {

  dragStart.t = 0;
};


scene.oldRadius = 0;

scene.onPointerMove = function (evt,inf,dd,bb) {

  if (scene.oldRadius == 0) { scene.oldRadius = camera.radius; };
  if (scene.oldRadius != camera.radius) { scene.oldRadius = camera.radius; return false; };


  var t = new Date().getTime() - dragStart.t;

  if (scene.touchCount == 1) {

    var px = scene.pointerX - dragStart.x;
    var py = scene.pointerY - dragStart.y;

    camera._currentTarget.z = dragStart.oy - 3. * (px) / scene.panning_Sensibility;
    camera._currentTarget.x = dragStart.ox - 3. * (py) / scene.panning_Sensibility;
  }
  else {

    for (var i in scene.meshes) {
      i = scene.meshes[i];
      if (i && i.hoverCheck) i.material.flagDown(1);
    }

    if (inf.hit) {
      inf.pickedMesh.material.flagUp(1);
    }
  }
}

