
function getPosition(scene,camera,x,y,plane) {

  var prm = scene.pick(x,y);

  return prm;
}


var wind = function (op) {
  op = def(op,{});
  this.start = def(op.start,this.start);
  this.live = def(op.live,this.live);
  this.end = def(op.end,this.end);
  this.steps = def(op.steps,this.steps);
  this.fx = def(op.fx,this.fx);
  this.fun = def(op.fun,this.fun);
  this.interval = def(op.interval,this.interval);
  this.last = def(op.last,this.last);
};
wind.prototype = {
  start: 0,
  live: 0,
  end: 0,
  steps: 100,
  interval: 10,
  fx: function (x) {
    return x;
  },
  paused: true,
  last: function (v) { },
  fun: function (v) { },
  go: function (v) {

    var x = (this.end - this.start);
    var y = this.fx(this.live);
    this.start = this.start + x * y / this.steps;
    this.end = v;
    this.live = 0;
    if (this.paused) {

      this.request(this);
    }

  },
  request: function (th) {

    if (th.live + 1 > th.steps) {
      th.last(th.end);
      th.paused = true;
      th.live = 0;
      th.start = th.end;
    }
    else {
      th.paused = false;
      var x = (th.end - th.start);
      th.live++;
      var y = th.fx(th.live);
      y = x * y / th.steps;

      this.fun(th.start + y);

      setTimeout(function () { th.request(th); },th.interval);
    }
  }
};


function addControls(scene,camera,canvas) {


  var camBox = BABYLON.Mesh.CreateSphere('s',3,scene);
  camBox.material = new BABYLONX.ShaderBuilder().Solid({ r: 1.,a: 0.2 }).Transparency().BuildMaterial(scene);
  camBox.visibility = 0;
  var plan = BABYLON.Mesh.CreateGround('g',6000,6000,2,scene);
  plan.position.y = -2;
  plan.material = new BABYLONX.ShaderBuilder().Discard().BuildMaterial(scene);


  canvas.addEventListener('touchstart',function (event) {


    if (event.touches.length == 2) {
      scene.tchZoomDown = {
        dx: event.touches[0].clientX - event.touches[1].clientX,
        dy: event.touches[0].clientY - event.touches[1].clientY,

        d: pow(pow(event.touches[0].clientX - event.touches[1].clientX,2.) + pow(event.touches[0].clientY - event.touches[1].clientY,2.),0.5),
        radius: camera.radius,
        cx: camera._currentTarget.x,
        cz: camera._currentTarget.z,

        x: (event.touches[0].clientX + event.touches[1].clientX) / 2.0,
        y: (event.touches[0].clientY + event.touches[1].clientY) / 2.0
      };

      plan.position.x = camera._currentTarget.x;
      plan.position.z = camera._currentTarget.z;


      camBox.visibility = 1;

      var dis = getPosition(scene,camera,scene.tchZoomDown.x * 2.,scene.tchZoomDown.y * 2.,plan);
      if (dis && dis.hit) {
        var pos = dis.pickedPoint;

        camBox.position = dis.pickedPoint;

      }
    }

  });
  canvas.addEventListener('touchmove',function (event) {
    console.log(2,event);


    scene.touchCount = event.touches.length;

    if (event.touches.length == 2) {
      var tchMove = {
        dx: event.touches[0].clientX - event.touches[1].clientX,
        dy: event.touches[0].clientY - event.touches[1].clientY,
        d: pow(pow(event.touches[0].clientX - event.touches[1].clientX,2.) + pow(event.touches[0].clientY - event.touches[1].clientY,2.),0.5),

        x: (event.touches[0].clientX + event.touches[1].clientX) / 2.0,
        y: (event.touches[0].clientY + event.touches[1].clientY) / 2.0
      };



      camera.radius = max(30,scene.tchZoomDown.radius + (scene.tchZoomDown.d - tchMove.d));


      var z = min(1.,(scene.tchZoomDown.d - tchMove.d) / 150);

      camera._currentTarget.x = scene.tchZoomDown.cx + (scene.tchZoomDown.cx - camBox.position.x) * z;
      camera._currentTarget.z = scene.tchZoomDown.cz + (scene.tchZoomDown.cz - camBox.position.z) * z;






    }


  });
  canvas.addEventListener('touchend',function (event) {
    camBox.visibility = 0;
  });




}
