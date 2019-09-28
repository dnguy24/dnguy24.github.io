var SVM = function(){
    this.dit = function(){
        console.log("test");
    }
    this.train = function(features, labels, options){
        if(features.length != labels.length){
            return null;
        }
        this.features = features;
        this.labels = labels;
        var options = options || {};
        var C = options.C || 0.1;
        var tol = options.tol || 1e-7;
        var max_passes = options.max_passes || 10;
        this.M = features.length;
        this.D = features[0].length;
        this.alpha = zeros(this.M);
        var passes = 0;
        this.b = 0.0;
        var allw = [];
        this.allw = allw;
        var allalpha = [];
        this.allalpha = allalpha;
        allalpha.push(this.alpha);
        allw.push(this.getWeights())
        var maxiter = 100;
        var iter = 0;
        while(passes < max_passes && iter <= maxiter){
            var num_changed_alphas = 0;
            for(var i = 0; i < this.M; i++){
                var Ei = this.MarginOne(this.features[i]) - this.labels[i];
                if((labels[i]*Ei < -tol && this.alpha[i] < C) ||
                (labels[i]*Ei > tol && this.alpha[i] > 0) ){
                    var j;
                    do{
                        j =Math.floor(Math.random() * this.M);
                    }while(j == i);
                    var Ej = this.MarginOne(this.features[j]) - this.labels[j];
                    var ai = this.alpha[i];
                    var aj = this.alpha[j];
                    var L = 0;
                    var H = 0;
                    if(labels[i]!=labels[j]){
                        L = Math.max(0, aj-ai);
                        H = Math.min(C, C + aj - ai);
                    }else{
                        L = Math.max(0, ai + aj - C);
                        H = Math.min(C, ai + aj);
                    }
                    if(Math.abs(L-H) < 1e-3){
                        continue;
                    }
                    var eta = 2*this.linear(this.features[i], this.features[j]) - this.linear(this.features[i], this.features[i]) - this.linear(this.features[j], this.features[j]);
                    if(eta >= 0) continue;
                    var newaj = aj - this.labels[j]*(Ei - Ej)/eta;
                    if(newaj > H) newaj = H;
                    if(newaj < L) newaj = L;
                    if(Math.abs(aj - newaj) < 1e-5) continue;
                    this.alpha[j] = newaj;
                    var newai = ai + this.labels[i]*this.labels[j]*(aj -newaj);
                    this.alpha[i] = newai;
                    var b1 = this.b - Ei - labels[i]*(newai - ai)*this.linear(this.features[i], this.features[i]) - labels[j]*(newaj - aj)*this.linear(this.features[i], this.features[j]);
                    var b2 = this.b - Ej - labels[j]*(newai - ai)*this.linear(this.features[i], this.features[j]) - labels[j]*(newaj - aj)*this.linear(this.features[j], this.features[j]);
                    if(newai > 0 && newai < C) this.b = b1;
                    else if(newaj > 0 && newaj < C) this.b = b2;
                    b = (b1+b2)/2;
                    num_changed_alphas++; 
                }
            }
            iter++;
            if(num_changed_alphas == 0){
                passes++;
            }else{ 
                passes = 0;
                allw.push(this.getWeights());
                allalpha.push(this.alpha);
            }
        }
    }
    this.testmarginOne = function(weight, alphas, inst){
        var f = weight.b;
        for(var i = 0; i < this.M; i++){
            f += alphas[i] * this.labels[i] * this.linear(inst, this.features[i]);
        }
        return f;
    }
    this.getalpha = function(){
        return this.alpha;
    }
    this.testpredictOne = function(weight, alphas, inst){
        return this.testmarginOne(weight, alphas, inst) > 0 ? 1 : -1;
    }
    this.MarginOne = function(inst){
        var f = this.b;
        for(var i = 0; i < this.M; i++){
            f+= this.alpha[i]*this.labels[i]*this.linear(inst, this.features[i]);
        }
        return f
    }
    this.getallW = function(){
        return this.allw;
    }
    this.getallAlpha= function(){
        return this.allalpha;
    }
    this.getWeights = function(){
        var w = new Array(this.D);
        for(var i = 0; i < this.D; i++){
            var sum = 0.0;
            for(var j = 0; j < this.M; j++){
                sum+= this.alpha[j]*this.labels[j]*this.features[j][i]; 
            }
            w[i] = sum;
        }
        return {w: w, b: this.b};
    }
    this.predictOne = function(inst){
        return this.MarginOne(inst) > 0 ? 1 : -1;
    }
    this.predict = function(features){
        var pred = new Array(features.length);
        for(var i = 0; i < features.length; i++){
            pred[i] = (this.predictOne(features[i]));
        }
        return pred;
    }
    this.linear = function(x1, x2){
        var sum = 0;
        for(var i = 0; i < x1.length; i++){
            sum+=x1[i]*x2[i];
        }
        return sum
    }
}
function zeros(N){
    var arr = new Array(N);
    for(var i = 0; i < N; i++){
        arr[i] = 0;
    }
    return arr;
}