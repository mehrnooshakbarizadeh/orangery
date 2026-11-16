 scene.disposeMesh = function(ms) {
     ms.position.y = -60000;
     ms.id = 'deleted';
     for (var msitem in ms._children) {
         try {
             if (ms._children[msitem])
                 ms._children[msitem].position.y = -60000; 

         } catch (e) { console.log(e); }
     }
 }