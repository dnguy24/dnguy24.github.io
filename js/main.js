
var positive = false;
// function onload(){
//     document.getElementById("header").innerHTML = "Press Start to begin drawing";
// }
function changedrawing(){
    if(start1==true){
        if(positive==false){ positive = true; print("Drawing Positive examples", "Blue")}
        else if(positive==true){ positive=false; print("Drawing Negative examples", "Red")};
    }
}
var c = document.getElementById("mycanvas");
var ctx = c.getContext("2d");
var rect = c.getBoundingClientRect();
var x = y = 0;
var lastmouseX = lastmouseY = 0;
var features = [
    [207, 72],
    [446, 305],
    [318, 202],
    [189, 297],
    [454, 121],
    [147, 78],
    [307, 73],
    [200, 188],
    [297, 251],
    [364, 310],
    [407, 167]
    // -1, -1, -1, 1, 1, 1
    // -1, -1, -1, 1, 1
];
var labels = [-1, -1, -1, 1, 1, 1, -1, -1, -1, 1, 1];
var start1 = false;
var start2 = false;
c.addEventListener("mousedown", function(e){
})
c.addEventListener("mouseup", function(e){
})
function update(){
    ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
    for(var i=0, len=features.length; i<len; i++){
        if(labels[i]==1){
            console.log("drawing");
            drawCircle(features[i][0], features[i][1], "blue");
        }else if(labels[i]==-1){
            console.log("drawing");
            drawCircle(features[i][0], features[i][1], "red");
        }
    }
}
function clearcanvas(){
    console.log("clearing")
    this.features = [];
    console.log(features);
    this.labels = [];
    update();
}
function start(button){
    if(start1==false){
        if(positive == false){
            print("Drawing Negative Examples", "Red");
        }else if(positive == true){
            print("Drawing Positive Examples", "Blue")
        }
        update();
        console.log(features);
        start1 = true;
        console.log("start: ", start1)
        button.innerText = "Stop";
        document.getElementById("header").innerHTML = "Change the kernel sigma and press Start"
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
                drawCircle(x, y,"blue");
                console.log("pos: ", x, y);
                // print(x+" "+y, "blue");
            }if(positive==false){
                labels.push(-1);
                drawCircle(x, y, "red");
                console.log("neg: ", x, y);
                // print(x+" "+y, "red");
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

function create(){
    sm = createSVM(features);
    gameLoop();
    function gameLoop(){
        if(sm.x < sm.limit){
            // console.log(sm.x)
            window.requestAnimationFrame(gameLoop);
            sm.drawsvm();
            sm.update();
        }else{
        ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
        var loz = [];    
        for(var i=0; i<c.clientWidth; i++){
            for(var j=0; j<c.clientHeight; j++){
                var z = sm.svm.predictOne([i, j]);
                if(z==-1){
                    ctx.fillStyle = "LightCoral";
                    ctx.fillRect(i, j, 1,1);
                }else if(z==1){
                    ctx.fillStyle = "LightBlue";
                    ctx.fillRect(i, j, 1,1);
                }            }
        }
        for(var i=0, len=features.length; i<len; i++){
            if(labels[i]==1){
                drawCircle(features[i][0], features[i][1], "blue");
            }else if(labels[i]==-1){
                drawCircle(features[i][0], features[i][1], "red");
            }
        }
        console.log("done");
        }
    }
}
var slider = document.getElementById("myRange");
var output = document.getElementById("demo1");
output.innerHTML = "RBF Kernel Sigma: "+slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    output.innerHTML = "RBF Kernel Sigma: "+this.value;
    if(start1==true){
        sm = createSVM(features);
        ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
            for(var i=0; i<c.clientWidth; i++){
                for(var j=0; j<c.clientHeight; j++){
                    var z = sm.svm.predictOne([i, j]);
                    if(z==-1){
                        ctx.fillStyle = "LightCoral";
                        ctx.fillRect(i, j, 1,1);
                    }else if(z==1){
                        ctx.fillStyle = "LightBlue";
                        ctx.fillRect(i, j, 1,1);
                    }            }
            }
            for(var i=0, len=features.length; i<len; i++){
                if(labels[i]==1){
                    drawCircle(features[i][0], features[i][1], "blue");
                }else if(labels[i]==-1){
                    drawCircle(features[i][0], features[i][1], "red");
                }
            }
        }
}
function createSVM(features){
    var that = {};
    var svm = new SVM;
    svm.train(features, labels, {kernel: "rbf", C:10, sigma: slider.value});
    var weights = svm.getallW();
    var updateforx = Math.floor(weights.length/20);
    if(weights.length <= 20){
        updateforx = 1;
    }
    var tickperframe = 1;
    var tickcount = 0;
    var x = 0;
    var weights = svm.getallW();
    var alphas = svm.getallAlpha();

    that.limit = weights.length;
    that.x = 0;
    that.svm = svm;
    that.drawsvm = function(){
        ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);    
        for(var i=0; i<c.clientWidth; i++){
            for(var j=0; j<c.clientHeight; j++){
                var z = svm.testpredictOne(weights[that.x], alphas[that.x], [i, j]);
                if(z==-1){
                    ctx.fillStyle = "LightCoral";
                    ctx.fillRect(i, j, 1,1);
                }else if(z==1){
                    ctx.fillStyle = "LightBlue";
                    ctx.fillRect(i, j, 1,1);
                }
            }
        }
        for(var i=0, len=features.length; i<len; i++){
            if(labels[i]==1){
                drawCircle(features[i][0], features[i][1], "blue");
            }else if(labels[i]==-1){
                drawCircle(features[i][0], features[i][1], "red");
            }
        }
    }

    that.update = function(){
        tickcount+=1;
        if(tickcount > tickperframe){
            tickcount = 0;
            if(that.x >= that.limit - 1 ){
                that.x+=updateforx;
            }else if(that.x + updateforx > that.limit - 1){
                that.x = that.limit-1;
            }
            else{
            that.x+=updateforx;
            }
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

