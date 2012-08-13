var fragShader;
var vertexShader;
var program;
var gl;
function initGL()
{
    var canvas = document.getElementById("canvas");
    gl = canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
}
function checkError(shader)
{
    var s = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(!s)
    {
        console.log(gl.getShaderInfoLog(shader));
    }
}
function initShader()
{
    vertexShader = document.getElementById("vertex");
    vertexShader = vertexShader.innerHTML;
    fragShader = document.getElementById("frag").innerHTML;
    program = gl.createProgram();
    var vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vertexShader);
    gl.compileShader(vs);

    checkError(vs);

    var fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fragShader);
    gl.compileShader(fs);
    
    checkError(fs);

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    console.log(gl);

    gl.useProgram(program);
    program.pos = gl.getAttribLocation(program, "pos");
    gl.enableVertexAttribArray(program.pos);

    program.mvMatrix = gl.getUniformLocation(program, "mvMatrix");
    program.proMatrix = gl.getUniformLocation(program, "proMatrix");

}
var tri;
var vertex = [];
function initBuffer()
{
    tri = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tri);
    /*
    var vertex = [-1, 0, 0,  1, 0, 0, 
                1, 0, 0, 0, 1, 0,
                0, 1, 0, -1, 0, 0];
    */
    //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);
    tri.itemSize = 3;
    tri.numItem = vertex.length/3;
}
function initScene()
{
    gl.clearColor(0, 0, 0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
}

var mvMatrix;
var proMatrix;
function initUniform()
{
    mvMatrix = mat4.create();
    proMatrix = mat4.create();
}
function deg2Rad(d)
{
    return d*Math.PI/180;
}
function setUniform()
{
    mat4.perspective(90, gl.viewportWidth/gl.viewportHeight, 0.1, 1000, proMatrix);
    mat4.identity(mvMatrix);

    mat4.translate(mvMatrix, vec3.create([-1, -1, -1]));
    mvMatrix[0] = 2;
    mvMatrix[5] = 2;


    //mvMatrix[3] += 0.5;
    /*
    mvMatrix[2] = Math.cos(deg2Rad(45));
    mvMatrix[10] = -Math.sin(deg2Rad(45));
    mvMatrix[0] = Math.sin(deg2Rad(45));
    mvMatrix[8] = Math.cos(deg2Rad(45));
    */
    //mat4.rotateY(mvMatrix, deg2Rad(45));

    //mat4.transpose(mvMatrix);

    gl.uniformMatrix4fv(program.proMatrix, false, proMatrix);
    gl.uniformMatrix4fv(program.mvMatrix, false, mvMatrix);
}
function draw()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    setUniform();
    gl.bindBuffer(gl.ARRAY_BUFFER, tri);
    gl.vertexAttribPointer(program.pos, tri.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINES, 0, tri.numItem);
}
var dir = 0;
var curPos = [0, 0];

function forward(len)
{
    var tarPos = [curPos[0]+len*Math.cos(deg2Rad(dir)), curPos[1]+len*Math.sin(deg2Rad(dir))];
    vertex.push(curPos[0]/gl.viewportWidth);
    vertex.push(curPos[1]/gl.viewportHeight);
    vertex.push(0);

    curPos = tarPos;

    vertex.push(curPos[0]/gl.viewportWidth);
    vertex.push(curPos[1]/gl.viewportHeight);
    vertex.push(0);
}
function left(deg)
{
    dir += deg;
    dir %= 360;
}
function right(deg)
{
    dir -= deg;
    dir %= 360;
}
function goto(x, y)
{
    //vertex.push(x/gl.width);
    //vertex.push(y/gl.height);
    //vertex.push(0);
    curPos = [x, y];
}
function frac(len, depth)
{
    if(depth == 0)
        forward(len);
    else
    {
        frac(len/3, depth-1);
        right(60);
        frac(len/3, depth-1);
        left(120);
        frac(len/3, depth-1);
        right(60);
        frac(len/3, depth-1);
    }
}
function snowflake(len, depth)
{
    for(var i = 0; i < 6; i++)
    {
        frac(len, depth);
        left(60);
    }
}
function explainCmd()
{
    goto(250, 180);
    snowflake(100, 3);
    /*
    goto(250, 180);
    forward(100);
    left(60);
    forward(100);
    right(60);
    forward(100);
    console.log(vertex);
    */
}
function setCommand()
{
    explainCmd();

    gl.bindBuffer(gl.ARRAY_BUFFER, tri);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);
    tri.numItem = vertex.length/tri.itemSize;
    draw();
}
function main()
{
    initGL();
    initShader();
    initBuffer();
    initScene();
    initUniform();
    //draw();
    setCommand();
}
