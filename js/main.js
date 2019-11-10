
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
    // [207, 72],
    // [446, 305],
    // [318, 202],
    // [189, 297],
    // [454, 121],
    // [147, 78],
    // [307, 73],
    // [200, 188],
    // [297, 251],
    // [364, 310],
    // [407, 167]
];
var labels = [
    // -1, -1, -1, 1, 1, 1, -1, -1, -1, 1, 1
];
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
            // console.log("drawing");
            drawCircle(features[i][0], features[i][1], "blue");
        }else if(labels[i]==-1){
            // console.log("drawing");
            drawCircle(features[i][0], features[i][1], "red");
        }
    }
}
var dropdown = document.getElementById("kernelselection")
var kernel = "rbf"
dropdown.oninput = function(){
    kernel = dropdown.options[dropdown.selectedIndex].value;
    if(kernel == "linear" ){
        slider.style.display = "none";
        document.getElementById("demo1").style.display = "none";
    }else{
        slider.style.display = "block";
        document.getElementById("demo1").style.display = "block";
    }

}
function circledata(){
    this.features = []
    this.labels = []
    for(var i=0; i < 50; i++){
        var radius = Math.random()*60;
        var angle = Math.random()*Math.PI*2;
        var x = parseInt(Math.cos(angle)*radius);
        var y = parseInt(Math.sin(angle)*radius);
        x+=c.clientWidth/2;
        y+=c.clientHeight/2;
        features.push([x, y])
        labels.push(-1);
    }
    for(var i=0; i < 50; i++){
        var radius = Math.random()*30+85;
        var angle = Math.random()*Math.PI*2;
        var x = parseInt(Math.cos(angle)*radius);
        var y = parseInt(Math.sin(angle)*radius);
        x+=c.clientWidth/2;
        y+=c.clientHeight/2;
        features.push([x, y])
        labels.push(1);
    }
    for(var i=0; i < 50; i++){
        var radius = Math.random()*30+150;
        var angle = Math.random()*Math.PI*2;
        var x = parseInt(Math.cos(angle)*radius);
        var y = parseInt(Math.sin(angle)*radius);
        x+=c.clientWidth/2;
        y+=c.clientHeight/2;
        features.push([x, y])
        labels.push(-1);
    }
    update();
    document.getElementById("header").innerHTML = "Choose the SVM kernel type and press SVM to run visualization"
}
function linearlyseparate(){
    this.features = []
    this.labels = []
    for(var i =0; i < 77; i++){
        var x = parseInt(Math.random()*c.clientWidth)
        var y = parseInt(Math.random()*c.clientHeight)
        this.features.push([x,y])
    }
    for(var i=0; i < 77; i++){
        if((-5*this.features[i][0] + 300)>(-5*this.features[i][1])){
            this.labels.push(-1);
        }else{
            this.labels.push(1);
        }
    }
     update();
     document.getElementById("header").innerHTML = "Choose the SVM kernel type and press SVM to run visualization";
}
function clearcanvas(){
    console.log("clearing")
    stop = true;
    this.features = [];
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
        // circledata();
        update();
        // console.log(features);
        start1 = true;
        console.log("start: ", start1)
        button.innerText = "Stop";
        document.getElementById("header").innerHTML = "Choose the SVM kernel type and press SVM to run visualization"
        start2 = true;
    }else{
        stop = true;
        start1 = false;
        button.innerText = "Start";
        var str = "";
        for(var i=0; i<labels.length; i++){
            str+=labels[i]+", ";
        }
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
var stop = false;

function create(){
    stop = false;
    sm = createSVM(features);
    gameLoop();
    function gameLoop(){
        if(sm.x < sm.limit && stop==false){
            console.log(sm.x)
            document.getElementById("status").innerHTML = "Iteration: "+sm.x
            window.requestAnimationFrame(gameLoop);
            sm.drawsvm();
            sm.update();
        }else if(stop==false){
        ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
        var loz = [];
        document.getElementById("status").innerHTML = "Converged after: "+sm.limit + " iterations";    
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
slider.oninput = function(){
    output.innerHTML = "RBF Kernel Sigma: "+this.value;
}
slider.onmouseup = function() {
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
        document.getElementById("status").innerHTML = "Converged after: "+sm.limit + " iterations";    
}
function createSVM(features){
    var that = {};
    var svm = new SVM;
    svm.train(features, labels, {kernel: kernel, C:10, sigma: slider.value});
    var weights = svm.getallW();
    console.log(weights.length);
    // console.log(svm.predict(features))
    var updateforx = Math.floor(weights.length/10);
    if(weights.length <= 10){
        updateforx = 1;
    }
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
        if(that.x >= that.limit - 1 ){
            that.x+=updateforx;
        }else if(that.x + updateforx > that.limit - 1){
            that.x = that.limit-1;
        }
        else{
        that.x+=updateforx;
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

