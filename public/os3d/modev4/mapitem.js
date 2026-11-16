scene.mapsId = [];

scene.mapsRef = [];
scene.mapsAsset = [];

scene.mapsPar = [];
scene.mapsMat = [];
scene.mapsSet = [];



scene.setAsMap = function (mesh,map) {

  if (map.data.notset) return;
  if (map.type != "shape") {
    mesh.position.x = map.data.pos.x;
    /* mesh.position.y = map.data.pos.y; */
    mesh.position.z = map.data.pos.z;
  }

  if (map.data && map.data.conf1)
    mesh.conf1 = JSON.parse(JSON.stringify(map.data.conf1));;
  if (map.data && map.data.conf2)
    mesh.conf2 = JSON.parse(JSON.stringify(map.data.conf2));;
  if (map.data && map.data.conf3)
    mesh.conf3 = JSON.parse(JSON.stringify(map.data.conf3));;
  if (map.data && map.data.center)
    mesh.center = JSON.parse(JSON.stringify(map.data.center));;

  mesh.rotation.y = map.data.rot.y;

  scene.mapsRef[map.reference_uuid].isUsed = true;
};

function uniqueid() {
  // always start with a letter (for DOM friendlyness)
  var idstr = String.fromCharCode(Math.floor((Math.random() * 25) + 65));
  do {
    // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
    var ascicode = Math.floor((Math.random() * 42) + 48);
    if (ascicode < 58 || ascicode > 64) {
      // exclude all chars between : (58) and @ (64)
      idstr += String.fromCharCode(ascicode);
    }
  } while (idstr.length < 32);

  return (idstr);
}

scene.mapedList = function (mpd,fun) {

  first('.mattemplist').innerHTML = '';

  for (var i in mpd) {
    scene.mapsId[mpd[i].uuid] = mpd[i];

    scene.hasData = true;

    if (mpd[i].type == "setting") {
      scene.mapsSet[mpd[i].data.parent] = mpd[i].data;
    }

    if (mpd[i].type == "asset") {
      scene.mapsAsset[mpd[i].uuid] = mpd[i];
    }


    if (mpd[i].type == "material") {
      scene.mapsMat[mpd[i].uuid] = mpd[i].data;

      scene.mats[mpd[i].uuid] = mpd[i].data;

      createTempElement('.save-mat-temp',{ src2: 'src',coc: scene.mats[mpd[i].uuid].color,iden: mpd[i].uuid,path: scene.mats[mpd[i].uuid].path,name: scene.mats[mpd[i].uuid].name },
        first('.mattemplist'));
    }

    if (mpd[i].reference_uuid)
      scene.mapsRef[mpd[i].reference_uuid] = mpd[i];

    if (mpd[i].data.parent) {
      if (!scene.mapsPar[mpd[i].data.parent]) scene.mapsPar[mpd[i].data.parent] = [];
      scene.mapsPar[mpd[i].data.parent].push(mpd[i]);
    }
  }

  if (fun) fun();

};

scene.mapItemData = function (mesh,nst) {

  if (nst != 2 && (nst || (mesh.isRoom && !mesh.edited))) {
    return { notset: 1 };
  }

  var mp = def(mesh.map.data,{});

  mp.notset = false;

  mp.pos = {
    x: mesh.position.x,
    y: mesh.position.y,
    z: mesh.position.z,
  };

  mp.rot = {
    x: mesh.rotation.x,
    y: mesh.rotation.y,
    z: mesh.rotation.z
  };

  mp.conf1 = mesh.conf1;
  mp.conf2 = mesh.conf2;
  mp.conf3 = mesh.conf3;
  mp.center = mesh.center;

  return mp;
};

scene.nextMapItem = function () {

  // auto save per list diabled

  return;

  var stat = 0;

  for (var fl in scene.floors) {
    fl = scene.floors[fl].mesh;
    if (!fl.map) {
      fl.map = {};

      if (scene.mapsRef[fl.id]) {
        fl.map = scene.mapsRef[fl.id];
        return 1;
      }

      scene.toMap(fl,null,fl.id,0,'mapFloor','floor',fl.position,scene.mapItemData(fl,true),
        function (ms,map) {

          ms.map = map;
        });

      return 1;
    }
  }


  for (var fl in scene.rooms) {

    fl = scene.rooms[fl].mesh;
    if (!fl.map) {
      fl.map = {};

      if (scene.mapsRef[fl.id]) {
        fl.map = scene.mapsRef[fl.id];
        return 1;
      }

      if (fl && fl.parent)
        scene.toMap(fl,null,fl.id,fl.parent.id,'mapRoom','room',fl.position,scene.mapItemData(fl),
          function (ms,map) {
            ms.map = map;
          });
      return 1;
    }
  }

  for (var rm in scene.desks) {

    var fl = scene.desks[rm];

    if (fl && !fl.map) {
      fl.map = {};

      if (scene.mapsRef[fl.id]) {
        fl.map = scene.mapsRef[fl.id];
        return 1;
      }

      if (fl && fl.parent)
        scene.toMap(fl,null,rm,fl.parent.id,'mapDesk','desk',fl.position,scene.mapItemData(fl),
          function (ms,map) {
            ms.map = map;
          });
      return 1;

    }


  }

  return stat;

};

var mapItems = [];
scene.toMap = function (mesh,id,ref,parent,name,type,pos,data,fn) {
  data = def(data,{});


  data.parent = parent;

  mapItems.push({
    id: id,data: {
      name: name,
      type: type,
      reference_uuid: ref,
      position_x: pos.x,
      position_y: pos.y,
      position_z: pos.z,
      data: JSON.parse(JSON.stringify(data))
    },fn: fn,mesh: mesh
  });

};

scene.nextSaveMapItem = function () {


  var item = mapItems.pop();
  if (item) {

    if (item.id) {
      new entity('mapitem',localDB.officeRef).id(item.id)
        .set(item.data)
        .then(function (d) {

          if (item.fn) item.fn(item.mesh,d.map_item);
        });
    }
    else {
      new entity('mapitem',localDB.officeRef)
        .new(item.data)
        .then(function (d) {

          scene.mapsRef[d.map_item.reference_uuid] == d.map_item;
          scene.mapsId[d.map_item.uuid] == d.map_item;

          if (item.fn) item.fn(item.mesh,d.map_item);
        });
    }
  }

};


scene.deskRefresh = function () {

  for (var ms in scene.desks) {
    for (var id in scene.rooms) {
      if (scene.desks[ms].map && scene.desks[ms].map.data.parent == scene.rooms[id].mesh.id) {

        scene.desks[ms].parent = scene.rooms[id].mesh;
      }
    }
  }
};

scene.getFloorMode = function (id) {
  for (var i in scene.floors) {
    i = scene.floors[i];
    if (i.mesh.id == id) {
      return 'used';
    }
  }
  return 'def';
};

scene.getRoomMode = function (id) {

  for (var i in scene.rooms) {
    i = scene.rooms[i];
    if (i.map && i.map.data.genRoom == id) {

      if (i.map && i.map.data.locked)
        return 'locked';
      else return 'used';
    }
  }
  return 'def';
};


scene.getDeskMode = function (id,data) {
  if (scene.desksMap[id.toString()]) {

    if (data.active) {
      return 'used';

    } else {
      return 'disable';
    }

  }

  if (data.active) {
    return 'def';
  } else
    return 'disable';
};

scene.getAttach = function (mode,t) {
  if (t == 1 && mode == 'used') return '3D';
  if (t == 2 && mode == 'used') return 'top:-5px;left: -25px;';
  if (t == 3 && mode == 'used') return 'coyel2 rad-03 shadow1 p-0005 c-tblack bb l-00 t-n0025';
  if (t == 4 && mode == 'used') return 'hdn-i';

  if (t == 1 && mode == 'def') return ' ';
  if (t == 2 && mode == 'def') return ' ';
  if (t == 3 && mode == 'def') return 'hdn-i';
  if (t == 4 && mode == 'def') return ' ';

  if (t == 1 && mode == 'disable') return 'disabled';
  if (t == 2 && mode == 'disable') return 'top:13px;left:-18px;';
  if (t == 3 && mode == 'disable') return 'cgray';
  if (t == 4 && mode == 'disable') return 'hdn-i';

  if (t == 1 && mode == 'locked') return 'locked';
  if (t == 2 && mode == 'locked') return 'top:13px;left:-18px;';
  if (t == 3 && mode == 'locked') return 'cblack c-twgray';
  if (t == 4 && mode == 'locked') return 'hdn-i';

};

scene.getDeskColor = function (id,data,t) {

  if (scene.desks[id.toString()]) {

    if (data.active) {

      if (data.flex) {
        return t ? 'flex active desk' : 'co-dsk-flex  c-tblack ';
      } else {
        return t ? 'used desk' : 'co-dsk-used  c-tblack ';
      }
    } else {
      return t ? 'used but disable desk' : 'co-dsk-disable  c-tgray ';
    }

  }

  if (data.active) {
    return t ? 'not used desk' : 'co-dsk-disable  c-tgray ';
  } else
    return t ? 'disable desk' : 'co-dsk-disable  c-tgray ';
};

scene.roomsRef = [];

scene.getItemList = function (fun) {

  first('.selFloor').innerText = '';

  first('.listWait').classList.remove('hdn-i');

  var selFloor = null;

  /*if(first('.selFloor').innerText != ''){
    selFloor =  max(0,first('.selFloor').innerText.replace('selected floor:','').valueOf()*1-1); 
    selFloor = scene.floors[selFloor].mesh.id;
  }*/

  first('.itls-floors').innerHTML = '';
  first('.itls-rooms').innerHTML = '';
  first('.itls-desks').innerHTML = '';
  first('.itls-inventories').innerHTML = '';
  first('.itls-users').innerHTML = '';
  first('.itls-visitors').innerHTML = '';

  first('.itls-floors').parentNode.style.height = floor(document.body.offsetHeight - 200) + 'px';





  new entity("room",localDB.officeRef).list().then(function (d) {
    var indx = 0;

    for (var i in d.rooms) {
      indx++;
      i = d.rooms[i];
      scene.roomsRef[i.uuid] = i;

      createTempElement('.itls-item-temp',{
        click: function () {
          //canvas_scene.addFloorPart(1,null,null,1)

        },
        attach3d: scene.getAttach(scene.getRoomMode(i.uuid,i),3),
        attachText: scene.getAttach(scene.getRoomMode(i.uuid,i),1),
        attach: scene.getAttach(scene.getRoomMode(i.uuid,i),2),
        add3d: scene.getAttach(scene.getRoomMode(i.uuid,i),4),
        show3d: scene.getAttach(scene.getRoomMode(i.uuid,i),3),

        name: i.name,
        index: indx,
        wd: '01',
        tag: 'room',
        uuid: i.uuid,
        color: 'cwgray',
        showscript: "canvas_scene.lockToRoom('" + i.uuid + "')",
        addscript: "canvas_scene.addFloorPart(1,null,null,1,{id:'" + i.uuid + "'})",
        icon: 'meeting_room',
        img: 'hdn-i',
        url: '3d/room/',
      },first('.itls-rooms'));

    }


    new entity("desk",localDB.officeRef).list().then(function (d) {
      var indx = 0;
      console.log(5959,d);
      first('.listWait').classList.add('hdn-i');
      scene.desksRef = d.desks;

      for (var i in d.desks) {
        indx++;
        i = d.desks[i];


        if (!selFloor || (i.assigned_floor && selFloor == i.assigned_floor.uuid)) {
          createTempElement('.itls-item-temp',{
            click: function () {

            },
            name: i.name,
            index: indx,
            wd: '005 fs-05',
            tag: 'desk',
            uuid: i.uuid,
            color: 'co-dsk',
            attach3d: scene.getAttach(scene.getDeskMode(i.uuid,i),3),
            attachText: scene.getAttach(scene.getDeskMode(i.uuid,i),1),
            attach: scene.getAttach(scene.getDeskMode(i.uuid,i),2),
            add3d: scene.getAttach(scene.getDeskMode(i.uuid,i),4),
            show3d: scene.getAttach(scene.getDeskMode(i.uuid,i),3),
            showscript: "canvas_scene.lockToDesk('" + i.uuid + "')",
            addscript: "canvas_scene.addDesk({id:'" + i.uuid + "'},null,null,null,null,1)",
            title: scene.getDeskColor(i.uuid,i,1),
            icon: 'radio_button_checked',
            img: 'hdn-i',
            url: '3d/desk/',
          },first('.itls-desks'));
        }

      }

      all('.searchItem',function (at) {
        at.classList.remove('hdn-i');
      });



    });
  });

};


scene.referencedFloor = function (th) {

  scene.floors[scene.selectedFloor].mesh.map.data.ref = th.value;
  new entity('mapitem',localDB.officeRef).id(scene.floors[scene.selectedFloor].mesh.map.uuid).set(scene.floors[scene.selectedFloor].mesh.map).then(
    function (d) {
      console.log(d);
    }
  );

};


scene.cloneFloor = function (th) {

  if (!confirm('are you sure wanna clone all content from floor ' + (th.value + 1) + ' to ' + (scene.selectedFloor + 1) + ' ?')) return;

  /*scene.floors[ scene.selectedFloor].mesh.map.data.ref = th.value; */
  var par = th.value.split('!');
  var waitItem = 1;
  var savedItem = 1;

  sysLog('clone start','info',0);

  for (var i in canvas_scene.floors[par[0]].mesh._children) {
    var subitem = canvas_scene.floors[par[0]].mesh._children[i];

    if (subitem && subitem.map && (!subitem.map.data.conf1 || !subitem.map.data.conf1.room)) {

      var mapClone = JSON.parse(JSON.stringify(subitem.map));
      var meshClone = subitem.clone();
      meshClone.map = mapClone;
      meshClone.floor = meshClone._children[0];
      meshClone.parent = scene.floors[scene.selectedFloor].mesh;

      waitItem++;

      mapClone.data.parent = scene.floors[scene.selectedFloor].mesh.id;
      mapClone.uuid = null;

      new entity('mapitem',localDB.officeRef).param({ mesh: meshClone }).new(mapClone).then(
        function (d) {

          console.log(d,this.params);

          this.params.mesh.map.uuid = d.uuid;

          savedItem++;

          sysLog('clone status :' + (savedItem - 1) + ' from ' + (waitItem - 1) + ' saved.','info',100. * savedItem / waitItem);

          if (savedItem == waitItem) sysLogHide();

        }
      );

      if (savedItem == waitItem) sysLogHide();

    }

  }

};
