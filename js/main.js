var positive = false;
function ditmemay(){
    if(start1==true){
        if(positive==false){ positive = true;}
        else if(positive==true){ positive=false};
    }
}
var c = document.getElementById("mycanvas");
var ctx = c.getContext("2d");
var rect = c.getBoundingClientRect();
var x = y = 0;
var lastmouseX = lastmouseY = 0;
var features = [
    [147, 78],
    [307, 73],
    [200, 188],
    [297, 251],
    [364, 310],
    [407, 167]
];
var labels = [-1, -1, -1, 1, 1, 1];
var start1 = false;
var start2 = false;
c.addEventListener("mousedown", function(e){
})
c.addEventListener("mouseup", function(e){
})
var tester = document.getElementById('canvas');
function start(button){
    if(start1==false){
        for(var i=0, len=features.length; i<len; i++){
            if(labels[i]==1){
                console.log("drawing");
                drawCircle(features[i][0], features[i][1], "green");
            }else if(labels[i]==-1){
                console.log("drawing");
                drawCircle(features[i][0], features[i][1], "red");
            }
        }
        console.log(features);
        start1 = true;
        console.log("start: ", start1)
        button.innerText = "Stop";
        start2 = true;
    }else{
        start1 = false;
        button.innerText = "Start";
        var str = "";
        for(var i=0; i<labels.length; i++){
            str+=labels[i]+", ";
        }
        console.log(str);
        console.log(features);
        if(start2 == true){
        }
    }
}
    c.addEventListener("click", function(e){
        if(start1==true){    
            x = parseInt(e.clientX-rect.left);
            y = parseInt(e.clientY-rect.top);
            features.push([x, y]);
            if(positive==true){
                labels.push(1);
                drawCircle(x, y,"green");
                console.log("pos: ", x, y);
                print(x+" "+y, "green");
            }if(positive==false){
                labels.push(-1);
                drawCircle(x, y, "red");
                console.log("neg: ", x, y);
                print(x+" "+y, "red");
            }
        }
    })


function print(string, color){
    document.getElementById("demo").innerHTML = string;
    document.getElementById("demo").style.color = color;
}
function getCol(matrix, col){
    var column = [];
    for(var i=0; i<matrix.length; i++){
        column.push(matrix[i][col]);
    }
    return column;
}

function cut(){
    sm = create(features);
    gameLoop();
    function gameLoop(){
        if(sm.x < sm.limit-1){
            console.log(sm.x)
            window.requestAnimationFrame(gameLoop);
            sm.drawsvm();
            sm.update();
        }else{
        console.log("drawing best");
        ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
        var loz = [];    
        for(var i=0; i<c.clientWidth; i++){
            for(var j=0; j<c.clientHeight; j++){
                loz.push([i,j]);
            }
        }
        var results = sm.svm.predict(loz);
        for(var i=0; i<loz.length; i++){
            var z = results[i];
            if(z==-1){
                ctx.fillStyle = "LightCoral";
                ctx.fillRect(loz[i][0], loz[i][1], 1,1);
            }else if(z==1){
                ctx.fillStyle = "LightGreen";
                ctx.fillRect(loz[i][0], loz[i][1], 1,1);
            }
        }
        for(var i=0, len=features.length; i<len; i++){
            if(labels[i]==1){
                drawCircle(features[i][0], features[i][1], "green");
            }else if(labels[i]==-1){
                drawCircle(features[i][0], features[i][1], "red");
            }
        }
        console.log("done");
        }
    }
}

function create(features){
    var that = {};
    var svm = new svmjs.SVM();
    svm.train(features, labels, {kernel: 'rbf', rbfsigma: 20, C:1});
    console.log(features);
    console.log(svm.getWeights());
    console.log(svm.predict(features));
    var weights = svm.getallW();
    console.log(weights.length);
    console.log(weights);
    var tickperframe = 1;
    var tickcount = 0;
    var x = 0;
    that.limit = weights.length;
    that.x = x;
    that.svm = svm;
    that.drawsvm = function(){

        ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);    
        var weights = svm.getallW();
        var alphas = svm.getallAlpha();
        for(var i=0; i<c.clientWidth; i++){
            for(var j=0; j<c.clientHeight; j++){
                var z = svm.fakepredictOne(weights[x], alphas[x], [i, j]);
                if(z==-1){
                    ctx.fillStyle = "LightCoral";
                    ctx.fillRect(i, j, 1,1);
                }else if(z==1){
                    ctx.fillStyle = "LightGreen";
                    ctx.fillRect(i, j, 1,1);
                }
            }
        }
        for(var i=0, len=features.length; i<len; i++){
            if(labels[i]==1){
                drawCircle(features[i][0], features[i][1], "green");
            }else if(labels[i]==-1){
                drawCircle(features[i][0], features[i][1], "red");
            }
        }
        console.log(weights[x]);
    }

    that.update = function(){
        that.x = x;
        tickcount+=1;
        if(tickcount > tickperframe && x < svm.getallW().length){
            tickcount = 0;
            x+=1;
        }
    }
    return that;
}
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }
function draw(val){
    ctx.fillStyle = val;
    ctx.fillRect(x, y, 10, 10);
}
function drawCircle(a, b, val){
    ctx.beginPath();
    ctx.arc(a, b, 5, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = val;
    ctx.fill();
}

