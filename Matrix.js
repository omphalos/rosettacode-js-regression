// Since this code comes from rosettacode.com, it is under GNU Free Documentation License
// http://www.gnu.org/copyleft/fdl.html

// I added these lines to the rosetta code original to make this work:
var print = console.log;
Matrix.prototype.rows = function() { return this.height; }
Matrix.prototype.columns = function() { return this.width; }

function Matrix(ary) {
    this.mtx = ary
    this.height = ary.length;
    this.width = ary[0].length;
}

Matrix.prototype.toString = function() {
    var s = []
    for (var i = 0; i < this.mtx.length; i++) 
        s.push( this.mtx[i].join(",") );
    return s.join("\n");
}
 
// returns a new matrix
Matrix.prototype.transpose = function() {
    var transposed = [];
    for (var i = 0; i < this.width; i++) {
        transposed[i] = [];
        for (var j = 0; j < this.height; j++) {
            transposed[i][j] = this.mtx[j][i];
        }
    }
    return new Matrix(transposed);
}
 
var m = new Matrix([[1,1,1,1],[2,4,8,16],[3,9,27,81],[4,16,64,256],[5,25,125,625]]);
print(m);
print();
print(m.transpose());

// returns a new matrix
Matrix.prototype.mult = function(other) {
    if (this.width != other.height) {
        throw "error: incompatible sizes";
    }
 
    var result = [];
    for (var i = 0; i < this.height; i++) {
        result[i] = [];
        for (var j = 0; j < other.width; j++) {
            var sum = 0;
            for (var k = 0; k < this.width; k++) {
                sum += this.mtx[i][k] * other.mtx[k][j];
            }
            result[i][j] = sum;
        }
    }
    return new Matrix(result); 
}
 
var a = new Matrix([[1,2],[3,4]])
var b = new Matrix([[-3,-8,3],[-2,1,4]]);
print(a.mult(b));

// IdentityMatrix is a "subclass" of Matrix
function IdentityMatrix(n) {
    this.height = n;
    this.width = n;
    this.mtx = [];
    for (var i = 0; i < n; i++) {
        this.mtx[i] = [];
        for (var j = 0; j < n; j++) {
            this.mtx[i][j] = (i == j ? 1 : 0);
        }
    }
}
IdentityMatrix.prototype = Matrix.prototype;
 
// the Matrix exponentiation function
// returns a new matrix
Matrix.prototype.exp = function(n) {
    var result = new IdentityMatrix(this.height);
    for (var i = 1; i <= n; i++) {
        result = result.mult(this);
    }
    return result;
}

var m = new Matrix([[3, 2], [2, 1]]);
[0,1,2,3,4,10].forEach(function(e){print(m.exp(e)); print()})

// modifies the matrix in-place
Matrix.prototype.toReducedRowEchelonForm = function() {
    var lead = 0;
    for (var r = 0; r < this.rows(); r++) {
        if (this.columns() <= lead) {
            return;
        }
        var i = r;
        while (this.mtx[i][lead] == 0) {
            i++;
            if (this.rows() == i) {
                i = r;
                lead++;
                if (this.columns() == lead) {
                    return;
                }
            }
        }
 
        var tmp = this.mtx[i];
        this.mtx[i] = this.mtx[r];
        this.mtx[r] = tmp;
 
        var val = this.mtx[r][lead];
        for (var j = 0; j < this.columns(); j++) {
            this.mtx[r][j] /= val;
        }
 
        for (var i = 0; i < this.rows(); i++) {
            if (i == r) continue;
            val = this.mtx[i][lead];
            for (var j = 0; j < this.columns(); j++) {
                this.mtx[i][j] -= val * this.mtx[r][j];
            }
        }
        lead++;
    }
    return this;
}
 
var m = new Matrix([
  [ 1, 2, -1, -4],
  [ 2, 3, -1,-11],
  [-2, 0, -3, 22]
]);
print(m.toReducedRowEchelonForm());
print();
 
m = new Matrix([
  [ 1, 2, 3, 7],
  [-4, 7,-2, 7],
  [ 3, 3, 0, 7]
]);
print(m.toReducedRowEchelonForm());

// modifies the matrix "in place"
Matrix.prototype.inverse = function() {
    if (this.height != this.width) {
        throw "can't invert a non-square matrix";
    }   
 
    var I = new IdentityMatrix(this.height);
    for (var i = 0; i < this.height; i++) 
        this.mtx[i] = this.mtx[i].concat(I.mtx[i])
    this.width *= 2;
 
    this.toReducedRowEchelonForm();
 
    for (var i = 0; i < this.height; i++) 
        this.mtx[i].splice(0, this.height);
    this.width /= 2;
 
    return this;
}
 
function ColumnVector(ary) {
    return new Matrix(ary.map(function(v) {return [v]}))
}
ColumnVector.prototype = Matrix.prototype
 
Matrix.prototype.regression_coefficients = function(x) {
    var x_t = x.transpose();
    return x_t.mult(x).inverse().mult(x_t).mult(this);
}
 
// the Ruby example
var y = new ColumnVector([1,2,3,4,5]);
var x = new ColumnVector([2,1,3,4,5]);
print(y.regression_coefficients(x));
print();
 
// the Tcl example
y = new ColumnVector([
    52.21, 53.12, 54.48, 55.84, 57.20, 58.57, 59.93, 61.29, 
    63.11, 64.47, 66.28, 68.10, 69.92, 72.19, 74.46
]);
x = new Matrix(
    [1.47,1.50,1.52,1.55,1.57,1.60,1.63,1.65,1.68,1.70,1.73,1.75,1.78,1.80,1.83].map(
        function(v) {return [Math.pow(v,0), Math.pow(v,1), Math.pow(v,2)]}
    )
);
print(y.regression_coefficients(x));
