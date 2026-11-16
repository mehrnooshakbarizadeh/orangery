 

window.AiDetect = {
  dt:0,
  getBuffer : function(url,fun,w){

    AiDetect.dt = new Date().getTime();

    var img = document.createElement('img');
    img.src = url;
    img.onload = function(){

       var l = img.height / img.width;
   
         var canvas = document.getElementById('ai2img');

         canvas.width = w;
         canvas.height = w;
         
          
         var dx = canvas.getContext('2d');
         dx.fillStyle = "white"; 
         
         dx.fillRect(0, 0, w, w);

         dx.drawImage(img, 0, 0, w, l*w);
       
         fun(dx, canvas.getContext('2d').getImageData(0, 0, w, w).data,w );
   
    }
   },
  Lines: function(data){

    console.log(data);
    
  } 
};

AiDetect.getBuffer(baseImgURL+'/sample.jpg',function(dx,d,w ){ 

  return;

    window.pic = [];
    var row = 0;
    var col = 0;

    function getPix(d,r,c){
      var i = r*(w-1)*4+c*4;
      return  {co: {r:d[i],g:d[i+1],b:d[i+2],a:d[i+3]}, d:sqrt(pow(d[i])+pow(d[i+1])+pow(d[i+2])) , v: floor(d[i]/25)};
    }

   /* dx.fillStyle = "white";  
    dx.fillRect(0, 0, w, w);*/  
 
      for(var i =0;i< d.length;i+=4){ 

          var vd = floor(d[i]/25) ;   

          if(  vd < 7){  
                
                pic[col+'-'+row] = getPix(d,row,col);
              
                var splevel = 1;
                //samplar 1
                
                  var p = r_y({x:1.,y:0.,z:0.},j);
                  var v = getPix(d,row+floor(p.x),col+floor(p.z)); 

                  dx.fillStyle = "#ff0000ff";
                  dx.fillRect(col-2 , row-2 , 4, 4); 

          }

      }
   
      col ++;
      if(col >= w) {
        row ++;
        col =0;
      } 

    

},512);