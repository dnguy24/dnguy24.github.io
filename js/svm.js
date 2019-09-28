var SVM = function(){
    
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
        this.alpha = zeros(M);
        var passes = 0;
        this.b = 0.0;
        while(passes < max_passes){
            var num_changed_alphas = 0;
            for(var i = 0; i < this.M; i++){
                var Ei = this.MarginOne(this.features[i]) - this.labels[i];
                if((labels[i]*Ei < -tol && this.alpha[i] < C) ||
                (labels[i]*Ei > tol && this.alpha[i] > 0) ){
                    var j = 0;
                    while(j==i) j = Math.floor(Math.random() * M);
                    var Ej = MarginOne(this.features[j]) - this.labels[j];
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
                    var eta = 2*linear(this.features[i], this.features[j]) - linear(this.features[i], this.features[i]) - linear(this.features[j], this.features[j]);
                    if(eta >= 0) continue;
                    var newaj = aj - this.labels[j]*(Ei - Ej)/eta;
                    if(newaj > H) newaj = H;
                    if(newaj < L) newaj = L;
                    if(Math.abs(aj - newaj) < 1e-5) continue;
                    this.alpha[j] = newaj;
                    var newai = ai + this.labels[i]*this.labels[j]*(aj -newaj);
                    this.alpha[i] = newai;
                    var b1 = this.b - Ei - labels[i]*(newai - ai)*linear(this.features[i], this.features[i]) - labels[j]*(newaj - aj)*linear(this.features[i], this.features[j]);
                    var b2 = this.b - Ej - labels[j]*(newai - ai)*linear(this.features[i], this.features[j]) - labels[j]*(newaj - aj)*linear(this.features[j], this.features[j]);
                    if(newai > 0 && newai < C) this.b = b1;
                    else if(newaj > 0 && newaj < C) this.b = b2;
                    b = (b1+b2)/2;
                    num_changed_alphas++; 
                }
            }
            if(num_changed_alphas == 0){
                passes++;
            }else passes = 0;
        }
    }
    MarginOne = function(inst){
        var f = this.b;
        for(var i = 0; i < M; i++){
            f+= this.alpha[i]*this.labels[i]*linear(inst, this.features[i]);
        }
        return f
    }
    predictOne = function(inst){
        return MarginOne(inst)
    }
    linear = function(x1, x2){
        var sum = 0;
        for(var i = 0; i < x1.length; i++){
            sum+=x1[i]*x2[i];
        }
        return sum
    }
}
function zeros(N){
    var arr = Array[N];
    for(var i = 0; i < N; i++){
        arr[i] = 0;
    }
}