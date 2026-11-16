
var createScene = function (part) {

    part.scene = new BABYLON.Scene(part.engine);
    if (part.cameraInit) part.camera = part.cameraInit(part.camera, part.scene);
    if (part.clearColor) part.clearColor(part.camera, part.scene);
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), part.scene);
    light.intensity = 0.7; 
    BABYLONX.GeometryBuilder.InitializeEngine();
    BABYLONX.ShaderBuilder.InitializeEngine();
    var SB = BABYLONX.ShaderBuilder;

    var loading = new BABYLON.Mesh.CreateSphere("s", 30, 20, part.scene);

    var rdd = sin(new Date().getMilliseconds() + new Date().getDay());

    loading.material = new SB()
        .Solid()
        .VertexShader(` 
         float tim = pow(mod(time*0.02,4.) ,30.) ;
        float ds = pow(mod(time*0.01,4.)/2.,0.8)/3.;
        float y = max(0.,  pos.y/15.0);
        pos = pos*ds*0.8;
        result.xyz = pos;
        
        `)
        .InLine(`
        float tim = pow(mod(time*0.02,4.) ,30.) ;
        float ds = pow(mod(time*0.01,4.)/2.,3.);
        float y = max(0.,  pos.y/15.0);
         float y2 = pos.y/2.0;
           vec3 posr = r_y(pos,0.,vec3(0.));
       
        float ns = abs(noise(0.16*posr+float(`+ rdd+`)+floor(time*0.01/4.))); 
         result.xyz = vec3( y+ sin(ns*(posr.x+posr.y+posr.z))*sin(ns*(posr.y+posr.z))*cos(posr.z*ns) )  ;
        if(length(result.xyz)> ds ||   length(result.xyz)<  ds/4.  ) result.w = 0.;
        result = vec4(0.,0.7,1.,result.w);
        `)
        .Transparency()
        .Back('')
        .BuildMaterial(part.scene);

    var ms = loading.clone();
    ms.material = new SB()
        .Solid()
        .VertexShader(`
         float tim = pow(mod(time*0.02,4.) ,30.) ;
        float ds = pow(mod(time*0.01,4.)/2.,0.8)/3.;
        float y = max(0.,  pos.y/15.0);
        pos = pos*ds*0.8;
        result.xyz = pos;
        
        `)
        .InLine(`
        float tim = pow(mod(time*0.02,4.) ,30.) ;
        float ds = pow(mod(time*0.01,4.)/2.,3.);
        float y = max(0.,  pos.y/15.0);
         float y2 = pos.y/2.0;
           vec3 posr = r_y(pos,0.,vec3(0.));
       
        float ns = abs(noise(0.11*posr+float(`+ rdd +`)+floor(time*0.001/4.))); 
         result.xyz = vec3( y+ sin(ns*(posr.x+posr.y+posr.z))*sin(ns*(posr.y+posr.z))*cos(posr.z*ns) )  ;
        if(length(result.xyz)> ds ||   length(result.xyz)<  ds/4.  ) result.w = 0.;
        result = vec4(0.,0.5,1.,result.w/2.);
        `)
        .Transparency()
        .Back('')
        .BuildMaterial(part.scene);

    var ms2 = loading.clone();
    ms2.material = new SB()
        .Solid()
        .VertexShader(`
         float tim = pow(mod(time*0.02,4.) ,30.) ;
        float ds = pow(mod(time*0.01,4.)/2.,0.8)/3.;
        float y = max(0.,  pos.y/15.0);
       
             vec3 posr = r_y(pos,0.,vec3(0.));
       
        float ns = abs(noise(0.2*posr+float(`+ rdd +`)+floor(time*0.001/4.))); 
       pos = pos*ds*0.8+nrm*ns;
        result.xyz = pos;
        
        `)
        .InLine(`
        float tim = pow(mod(time*0.02,4.) ,30.) ;
        float ds = pow(mod(time*0.01,4.)/2.,3.);
        float y = max(0.,  pos.y/15.0);
         float y2 = pos.y/2.0;
           vec3 posr = r_y(pos,0.,vec3(0.));
       
        float ns = abs(noise(0.2*posr+float(`+ rdd +`)+floor(time*0.001/4.))); 
         result.xyz = vec3( y+ sin(ns*(posr.x+posr.y+posr.z))*sin(ns*(posr.y+posr.z))*cos(posr.z*ns) )  ;
        if(length(result.xyz)> ds ||   length(result.xyz)<  ds/4.  ) result.w = 0.;
        result = vec4(0.0,1.0,1.,result.w/4.);
        `)
        .Transparency()
        .Back('')
        .BuildMaterial(part.scene); 

    if (part.SBGB) part.SBGB(part.camera, part.scene, function () {
        
    });

     
    part.scene.loading = [loading, ms,ms2];

    part.scene.iTime = 0;

    part.scene.registerBeforeRender(function () {
        part.scene.iTime++;
        var cam = {
            position: part.camera.position,
            target: part.camera.target,
            mouse: { x: 0, y: 0 },
            screen: { width: 100, height: 100 },
            time: max(0, part.timer++)
        };

        if (part.scene.onFrame) cam = part.scene.onFrame(part.timer,cam);
         
        new BABYLONX.ShaderMaterialHelper().SetUniforms(
            part.scene.meshes,
             cam.position,
            cam.target,
            cam.mouse,
            cam.screen,
            part.scene.iTime);
    }); 

    var onPointerDown = function (evt) {
 
    }

    var onPointerUp = function () {
       
    }

    var onPointerMove = function (evt) {
         
    }

    var canvas = part.scene._engine.getRenderingCanvas();

    var oncontext = function (event) {

        event.preventDefault(0);
        return false;
    }

    canvas.addEventListener("pointerdown", onPointerDown, false);
    canvas.addEventListener("pointerup", onPointerUp, false);
    canvas.addEventListener("pointermove", onPointerMove, false);
    canvas.addEventListener("contextmenu", oncontext, false);

    part.scene.onDispose = function () {
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointerup", onPointerUp);
        canvas.removeEventListener("pointermove", onPointerMove);
    }

     
    
    setTimeout(function () {
         part.camera.attachControl(canvas, true); 
         if(part.camera.customCameraController){
            part.camera.customCameraController(part);
         }
    }, 500); 
    

    return part.scene;
};