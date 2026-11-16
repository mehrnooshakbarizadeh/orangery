window.initMaterial = function (scene,camera) {



  scene.floorColor = { r: 0.74,g: 0.75,b: 0.8 };

  scene.shapeMat = function (co,map,wall) {


    var meetRoom = (map && map.data.meetRoom && map.data.meetRoom != "");
    var room = (map && map.data.genRoom && map.data.genRoom != "");

    var wallC = (map && map.data.m == 'wall2point');
    if (wallC) { meetRoom = false; room = false; }


    var mat = new BABYLONX.ShaderBuilder()
      .Solid(def(co,{ r: 1 }))
      .Reference(1)

      .Event(2,`result.xyz  = result.xyz*0.5+vec3(0.5,0.2,0.);`)
      .Event(3,`result.xyz  = result.xyz*0.5+vec3(0.5,0.5,0.);`)
      .Func(function (me) {
        me.Setting.FragmentWorld = true;
        return me;
      })
      .Solid({ r: 1.0,g: 1.0,b: 0.94 })
      .InLine(`
       vec3 wps = vec4(world*vec4(pos,1.)).xyz;
       vec3 wpos = wps;
       vec3 wnr = mat3(world)*(nrm);
       vec3 wnrm = mat3(world)*(nrm);

         float fog = min(1.,max(0.,length(camera-wps)/1000. ));

         result.xyz = mix(vec3(0.6,0.65,0.8),result.xyz,  pow(fog,2.));  
         result.xyz = vec3(length(result.xyz)/1.5)*vec3(0.93,0.92,0.95);
 
    ` )

      .Reference(2)
      /** dynamic mat */
      .SetUniform("dynamicSample","sampler2D")
      .SetUniform("dynamicSett","vec4")
      .SetUniform("dynamicSett2D","vec4")

      .InLine(`
        vec3 nrrm = vec3(pos.x*dynamicSett.x,0., pos.y*dynamicSett.x*dynamicSett.y );
        vec3 nm = `+ BABYLONX.Normals.Flat + `;
        if(abs(nm.x) > 0.25 && abs(nm.z) < 0.25 ) nrrm = vec3(pos.z*dynamicSett.x,0., pos.y*dynamicSett.x*dynamicSett.y); 
        else if(abs(nm.y) >  0.25 && abs(nm.z) < 0.25   )nrrm =vec3(pos.z*dynamicSett.x,0., pos.x*dynamicSett.x*dynamicSett.y); 

        `)
      .Map({ index: "dynamicSample",uv: 'r_y(vec3((nrrm.x ) *0.002 -0.5,0.,(nrrm.z )*0.002-0.5) ,dynamicSett.z,vec3(0.) ).xz' }).Reference(3)

      .InLine(` 
        float fs = 1.- dot(normalize(wnrm-vec3(0.2,1.,.3)*result_3.x*0.12),normalize(wpos-camera)) ;
        result = vec4(vec3( 0.7)*fog+fs*0.5,1.);

        if( dynamicSett.x >0.0){
            result_3.xyz = result_3.xyz-dynamicSett.w*0.3-dynamicSett.w*length(result_3.xyz)*0.13
        +dynamicSett.w*(1.-length(result_3.xyz))*0.13+(length(result_3.xyz)*0.3+0.2 )*dynamicSett.w*(pow(fs,3.)*0.15)
        +dynamicSett.w*2.*length(result_3.xyz/2.)*pow(fs/2.,330.)*0.350 ;  
        }  
        `)
      .InLine(` 
    result.xyz =  (`+ (meetRoom ? 'vec3(217.,217.,217.)' : (room ? 'vec3(234.,235.,238.)' : (wallC ? 'vec3(59.0,61.0,65.0)' : 'vec3(193.,197.,203.)'))) + `)/255.0; 
    
    result = vec4(result.xyz *(0.85+0.15*fog)+fs*0.15,1.);

    `)
      .Event(9,`
    if( dynamicSett.x >0.0){
     fog = min(1.,max(0.,length(camera-wps)/200. )); 
    result.xyz  = result_3.xyz *((1.-fog)*0.25+0.75);
    }
    `)
      .Event(10,`  result.xyz  =  result.xyz *0.85+vec3(0.,0.35,0.9)*0.1;
    `)
      .Event(11,`  result.xyz  =  result.xyz *0.75+vec3(0.,0.5,0.9)*0.25;
    `)
      .BuildMaterial(scene);


    var txt1 = new BABYLON.Texture((map && map.data.mat ? scene.mats[map.data.mat].path : baseImgURL + '/temp.png'),scene);
    mat.setTexture("dynamicSample",txt1);
    mat.setVector4("dynamicSett",(map && map.data.mat ? scene.mats[map.data.mat] : { x: 0,y: 0,z: 0,w: 0 }));
    mat.setVector4("dynamicSett2D",(map && map.data.mat && scene.mats[map.data.mat].color ?
      { x: scene.mats[map.data.mat].r,y: scene.mats[map.data.mat].g,z: scene.mats[map.data.mat].b,w: 1. } : { x: 0,y: 0,z: 0,w: 0 }));

    mat.flagUp(8);
    mat.flagDown(9);

    return mat;
  };



  scene.deskMat = function (co) {
    var mat = new BABYLONX.ShaderBuilder()
      .Solid({ r: 16. / 255.,g: 17. / 255.,b: 18. / 255. })
      .Func(function (me) {
        me.Setting.FragmentWorld = true;
        return me;
      })
      .InLine(`
       vec3 wps = vec4(world*vec4(pos,1.)).xyz;
       vec3 wnr = mat3(world)*(nrm);`)
      .Reference(2)
      .Map({ path: window.baseImgURL + '/wood.jpg',uv: 'vec2(float(' + Math.random() + ')+pos.zx*0.05)' })
      .Reference(3)
      .InLine(` float dt = dot(nrm, normalize( wps.xyz - camera )); 
              result = vec4(result_2.xyz*0.92+0.1+0.08*dt,1.); `)

      .Event(8,`

              vec3 nm = `+ BABYLONX.Normals.Flat + `;
  
              if(abs(nm.y) <  0.25   ) discard;
               
             result.xyz  = result.xyz;`)
      .Event(9,`
             float fog = min(1.,max(0.,length(camera-wps)/200. )); 
            result.xyz  =0.5-dt*0.2 +0.25* vec3(length(result_3.xyz)*0.8) *((1.-fog)*0.5+0.5);
            
            vec3 nm = `+ BABYLONX.Normals.Flat + `;
  
            if(pos.y  <  4.55) result.xyz = vec3(0.05-0.25*abs(dt)+ pow(1.-dt,2.)*0.15+pow(dt,2.)*0.13 );
            `)



      .BuildMaterial(scene);

    mat.flagUp(8);
    mat.flagDown(9);

    return mat;
  };

  scene.callAnimation = function (mesh,mode,modeUps,p1,p2) {

    if (mesh && mesh.material && mesh.material.flagUp) {

      for (var i in modeUps) mesh.material.flagUp(modeUps[i]);
      for (var i in mode) mesh.material.flagDown(mode[i]);

      mesh.material.setVector4('timeSet',{ x: 1.,y: scene.iTime,z: p1,w: p2 });
    }
  };

  scene.killAnimation = function (mesh,mode,modeUps) {
    if (mesh && mesh.material && mesh.material.flagUp) {
      for (var i in modeUps) mesh.material.flagUp(modeUps[i]);
      for (var i in mode) mesh.material.flagDown(mode[i]);

      mesh.material.setVector4('timeSet',{ x: 0.,y: 0,z: 0,w: 0 });
    }
  };

  scene.hexToRgb = function (hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1],16) / 255,
      g: parseInt(result[2],16) / 255,
      b: parseInt(result[3],16) / 255
    } : null;
  };


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
          {
            w: size.w * 256,h: size.h * 256,fc: scene.hexToRgb(def(conf.fclr,'#000000'))
            ,cc: scene.hexToRgb(def(conf.color,'#ffffff')),color: '#000000'
          });
      }

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

  scene.roomFMat = function (co) {
    var mat = new BABYLONX.ShaderBuilder()
      .Solid(def(co,{ r: 0.7,g: 0.7,b: 0.8 }))
      .Reference(2)
      .Func(function (me) {
        me.Setting.FragmentWorld = true;
        return me;
      })
      .InLine(`
   vec3 wps = vec4(world * vec4(pos,1.)).xyz;
   vec3 wnr = mat3(world) * (nrm); `)

      .Map({ path: window.baseImgURL + '/roomfloor.jpg',uv: 'vec2(wps.xz*0.085)' })
      .Reference(3)
      .InLine(`;
        result.xyz = result_2.xyz * 0.8;
        `)
      .Event(9,`
  float fog = min(1.,max(0.,length(camera - wps) / 200.));
        result.xyz = result_3.xyz * ((1. - fog) * 0.5 + 0.5);
        `)

      .BuildMaterial(scene);


    mat.flagUp(8);
    mat.flagDown(9);


    return mat;
  };


  scene.roomBMat = function (av) {
    var mat = new BABYLONX.ShaderBuilder()
      .Func(function (me) {
        me.Setting.FragmentWorld = true;
        return me;
      })
      .Solid({ r: 1.0,g: 1.0,b: 0.94 })
      .InLine(`
   vec3 wps = vec4(world * vec4(pos,1.)).xyz;
   vec3 wnr = mat3(world) * (nrm);

        result.xyz = vec3(0.0);

        result.w = max(0.,sin(time * 0.02 + wps.x * 2. + wps.z * 2.)) * 0.25; `)
      .Transparency()
      .Event(9,`;

        result.w = 0.15 + max(0.,sin(time * 0.02 + wps.x * 2. + wps.z * 2.)) * 0.35;
        `)

      .BuildMaterial(scene);

    mat.flagUp(8);
    mat.flagDown(9);

    return mat;
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



}; 