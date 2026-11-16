
scene.to2DView  = function(fun){ 

   

  first('#ic2d').classList.add('cblack'); first('#ic2d').classList.remove('c-t-iblack');
  first('#ic3d').classList.remove('cblack'); first('#ic3d').classList.add('c-t-iblack');

  canvas_scene.apply3dCameraMode('free')


  for(var sm in scene.meshes){
      sm = scene.meshes[sm]; 

      if(sm.isShape && sm.isWallShape ) {
          sm.floor.scaling.y = 0.05; 
          
          if(sm.title && !sm.title.isDragable)
            sm.title.rotation.x = 90.*deg;  
      }  

      if(sm.title &&  !sm.title.isDragable ){
         sm.title.rotation.z =  0.*deg;  
         sm.title.rotation.y =  0.*deg;  
         sm.title.rotation.z =  0.*deg;  
         sm.title.position.y = sm.title.posy+0.5
      }

       if(sm && sm.material && sm.material.flagUp)
      { 
          sm.material.flagDown(9);
          sm.material.flagUp(8);
      }

      scene.setPosY(sm);
  }

  canvas_scene.motions.mainCameraTarget = {
      x: 0,
      y: 0,
      z: 0,
      r: 120.,
      a: 0,
      b: 0,
      range_r: [sizeSet.height3d,min(1500,sizeSet.height2d*0.9)],
      range_b: [0., 0.],
      range_a: [0., 0.],
      cameraMode: '2d' 
  };

  canvas_scene.viewMode = '2D';

  canvas_scene.motions.mainCameraMove.play(function(v){ 
      if(canvas_scene.floors){
          
          for(var i in canvas_scene.floors){
              if(canvas_scene.floors[i] && canvas_scene.floors[i].mesh){ 

                  var pattern  = scene.mapsSet[scene.floors[i].mesh.id];
                  var i1 = i;
                  /* if(pattern && pattern.fNumber){ 
                      i1 = pattern.fNumber; 
                   } */

                  canvas_scene.floors[i].mesh.position.y = i1*(sizeSet.height3d*(1.-v)+(v)*sizeSet.height2d);
              }
          }
      } 

      if(v == 1){           

          if(scene.firstView){  
              scene.checkMapItem = 1; 

              if(!scene.mainGround)
              scene.createFoundation()
          }

          if(fun)fun();
      }
     
  }); 
  
} 


scene.to3DView  = function(fun){ 

  first('#ic3d').classList.add('cblack'); first('#ic3d').classList.remove('c-t-iblack'); 
  first('#ic3d').classList.add('c-twhite');
  first('#ic2d').classList.remove('cblack'); 
  first('#ic2d').classList.add('c-t-iblack'); 

  scene.posh = 0.;

  for(var sm in scene.meshes){

      sm = scene.meshes[sm];
      if(sm.isRoom && sm.wall )  sm.wall.isVisible = sm.wall.used; 
      if(sm.isShape && sm.isWallShape ) {
          sm.floor.scaling.y = 1;  
      } 

      if(sm.title  && !sm.title.isDragable)
      {
           sm.title.rotation.z = 90.*deg;  
           sm.title.rotation.y = 180.*deg; 
           sm.title.rotation.x = 180.*deg;  
           sm.title.position.y = sm.title.posy+3.0
      }
      

       if(sm && sm.material && sm.material.flagUp)
       { 
          sm.material.flagDown(8);
          sm.material.flagUp(9);
       }

      scene.setPosY(sm);  
  }

  if(fun){

    for(var i in canvas_scene.floors){ 
          
        if(canvas_scene.floors[i] && canvas_scene.floors[i].mesh){ 

            var pattern  = scene.mapsSet[scene.floors[i].mesh.id];
            var i1 = i;
             /*if(pattern && pattern.fNumber){ 
                i1 = pattern.fNumber; 
             } */

            canvas_scene.floors[i].mesh.position.y = i1*( sizeSet.height3d);
        }
    }

    canvas_scene.viewMode = '3D';

    fun();
  }
  else{

  canvas_scene.motions.mainCameraTarget = {
      x: 0,
      y: 0,
      z: 0,
      r: sizeSet.height2d*0.76,
      a: 0.58,
      b: 1.25,
      range_r: [sizeSet.height3d*0.2, sizeSet.height2d*2.],
      range_a: null,
      range_b: [0., 1.8141592],
      cameraMode: '3d' 
  };

  canvas_scene.viewMode = '3D';

  canvas_scene.motions.mainCameraMove.play(function(v){ 
      if(canvas_scene.floors){
          
          for(var i in canvas_scene.floors){ 
          
              if(canvas_scene.floors[i] && canvas_scene.floors[i].mesh){ 

                  var pattern  = scene.mapsSet[scene.floors[i].mesh.id];
                  var i1 = i;
                   /*if(pattern && pattern.fNumber){ 
                      i1 = pattern.fNumber; 
                   } */

                  canvas_scene.floors[i].mesh.position.y = i1*(sizeSet.height2d*(1.-v)+(v)*sizeSet.height3d);
              }
          }
      }

      if(v == 1){ 
      }        
  });
}
}