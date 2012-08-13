//require('core');
//向上y正方向
//向右x正方向
//屏幕外z正方向
var MyGame = {};
//scene cube control
/*
MyGame.Cube = function(){
    var material = new THREE.LineBasicMaterial({color:0xFF0000, linewidth:2});
    var geometry = new THREE.Geometry();
    var vec = 
    [[-0.5, -0.5, -0.5], [-0.5, -0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, 0.5, -0.5], [-0.5, -0.5, -0.5], [-0.5, 0.5, -0.5], [0.5, 0.5, -0.5], [0.5, -0.5, -0.5], [-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [0.5, -0.5, 0.5], [-0.5, -0.5, 0.5], [-0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [0.5, -0.5, 0.5], [0.5, -0.5, -0.5], [0.5, 0.5, -0.5], [0.5, 0.5, 0.5]];
    for(var i = 0; i < vec.length; i++)
    {
        geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(vec[i][0], vec[i][1], vec[i][2])));
    }


    THREE.Line.call(this, geometry, material);
};
MyGame.Cube.prototype = new THREE.Line();
MyGame.Cube.prototype.constructor = MyGame.Cube;
*/

MyGame.Controls = function(sc, ca){

    //THREE.EventTarget.call(this);


	STATE = { NONE : -1, ROTATE : 0, ZOOM : 1, PAN : 2 };
    var scene = sc;
    var camera = ca;
    this.domElment = document;
    var _state = STATE.NONE;
    var lastPoint = [];

    this.domElment.onmousedown = mousedown;
    this.domElment.onmousemove = mousemove;
    this.domElment.onmouseup = mouseup;
    function mousedown(event)
    {
        if(_state == STATE.NONE )
        {
            _state = STATE.ROTATE;
            event.preventDefault();
            event.stopPropagation();
            lastPoint = [event.clientX, event.clientY];
        }
    };
    var _accY = 0;
    var _accX = 0;
    this.update = function()
    {
        var sinD = Math.sin(_accY);
        var cosD = Math.cos(_accY);
        var x = camera.position.x;
        var y = camera.position.y;
        var z = camera.position.z;

        if(_accX != 0 || _accY != 0)
        {
            var mat = camera.projectionMatrix;
            var u = new THREE.Vector3(mat.n11, mat.n21, mat.n31);
            var v = new THREE.Vector3(mat.n12, mat.n22, mat.n32);

            u.multiplyScalar(-_accX);
            v.multiplyScalar(_accY);
            u.addSelf(v);
            var deg = u.length();
            camera.projectionMatrix.rotateByAxis(u, deg);
        }

        //camera.lookAt(scene.position);
        //camera.updateProjectionMatrix();
        
        _accY = 0;
        _accX = 0;
    };
    function mousemove(event)
    {

        if(_state == STATE.ROTATE)
        {

            var oldPos = lastPoint;
            lastPoint = [event.clientX, event.clientY];
            var difx = lastPoint[0]-oldPos[0];
            var dify = lastPoint[1]-oldPos[1];

            /*
            scene.matrix.rotateY(2);
            scene.matrix.rotateX(2);
            scene.matrixWorldNeedsUpdate = true;
            */

            _accY += Math.PI/400*difx;
            _accX += Math.PI/240*dify;

            //camera.position.x += 1;
            //camera.rotation.y += Math.PI/400*difx;
            //camera.rotation.x += Math.PI/240*dify;
            /*
            camera.position.x += difx;
            camera.position.y += dify;
            camera.position.normalize();
            camera.position.setLength(30);
            camera.lookAt(scene.position);
            camera.updateProjectionMatrix();
            */


            //scene.rotation.y += Math.PI/400*difx;
            //scene.rotation.x += Math.PI/240*dify;
            console.log("rotate", 360/800*difx, 360/480*dify);
        }

    };
    function mouseup(event)
    {
        _state = STATE.NONE;
    };

};

/*
MyGame.Cube = function(){
    var geometry = new THREE.Geometry();
    var material = new THREE.MeshBasicMaterial();
    var vec = 
    [[-0.5, -0.5, -0.5], [-0.5, -0.5, 0.5], [-0.5, 0.5, -0.5], [-0.5, 0.5, 0.5], [0.5, -0.5, -0.5], [0.5, -0.5, 0.5], [0.5, 0.5, -0.5], [0.5, 0.5, 0.5]];
    
    for(var i = 0; i < vec.length; i++)
    {
        geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(vec[i][0], vec[i][1], vec[i][2])));
    }
    var faceIndex = 
    [[0, 1, 3, 2], [0, 2, 6, 4], [4, 6, 7, 5], [1, 5, 7, 3], [2, 3, 7, 6], [1, 0, 4, 5]];
    var normal = 
    [[-1, 0, 0], [0, 0, -1], [1, 0, 0], [0, 0, 1], [0, 1, 0], [0, -1, 0]];
    this.faces = [];


    for(var f = 0; f < faceIndex.length; f++)
    {
        var a = faceIndex[f][0];
        var b = faceIndex[f][1];
        var c = faceIndex[f][2];
        var d = faceIndex[f][3];
        var face = new THREE.Face4(a, b, c, d);
        var nor = new THREE.Vector3(normal[f][0], normal[f][1], normal[f][2]);
        face.normal.copy(nor);
        face.vertexNormals.push(nor.clone(), nor.clone(), nor.clone(), nor.clone());
        face.materialIndex = 0;
        geometry.faces.push(face);

        geometry.faceVertexUvs[ 0 ].push( [
                    new THREE.UV( 0, 0 ),
                    new THREE.UV( 1, 0 ),
                    new THREE.UV( 1, 1 ),
                    new THREE.UV( 0, 1 )
                ] );
        
        this.faces.push(face);
    }

	geometry.computeCentroids();
	geometry.mergeVertices();
    
};
MyGame.Cube.prototype = THREE.Object3D;
MyGame.Cube.update = function(){

};
*/

var renderer;
var camera;
var controls;
var scene;
var clock;
var line;
function calculateSide()
{
    var pos = camera.position;
    var x = pos.x;
    var y = pos.y;
    var z = pos.z;
    var side = {px:x<5, nx:x>-5, py:y<5, ny: y>-5, pz:z<5, nz:z>-5 };
    return side;
}
var keys = {};
function keydown(event)
{
    keys[event.keyCode] = true;
    var k = String.fromCharCode(event.keyCode);
    if(k === " ")
    {
        line.moveSphere();
    }
}
function keyup(event)
{
    keys[event.keyCode] = false;
}
MyGame.SmallCube = function(){
    THREE.Object3D.call(this);
    var vec = 
    [[-0.5, -0.5, -0.5], [-0.5, -0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, 0.5, -0.5], [-0.5, -0.5, -0.5], [-0.5, 0.5, -0.5], [0.5, 0.5, -0.5], [0.5, -0.5, -0.5], [-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [0.5, -0.5, 0.5], [-0.5, -0.5, 0.5], [-0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [0.5, -0.5, 0.5], [0.5, -0.5, -0.5], [0.5, 0.5, -0.5], [0.5, 0.5, 0.5]];
    var material = new THREE.LineBasicMaterial({color:0xFF1919, linewidth:2});
    var geometry = new THREE.Geometry();
    for(var i = 0; i < vec.length; i++)
    {
        geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(vec[i][0], vec[i][1], vec[i][2])));
    }
    this.line = new THREE.Line(geometry, material);
    this.cube = new THREE.Mesh(
        new THREE.CubeGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({color:0xFF1919, opacity:0.4})
    );
    this.add(this.line);
    this.add(this.cube);
    //this.cube.doubleSided = true;
    
    //button
    //this.blocks = [];

};
MyGame.SmallCube.prototype = new THREE.Object3D();

var level = {111:true,  524:true};
var sphPos = {521:true};
var cylPos = {123:true};

MyGame.Cube = function(){
    THREE.Object3D.call(this);
    console.log("initCube");
    var material = new THREE.LineBasicMaterial({color:0xFF1919, linewidth:3});
    var geometry = new THREE.Geometry();
    
    var vec = 
    [[-0.49, -0.49, -0.49], [-0.49, -0.49, 0.49], [-0.49, 0.49, 0.49], [-0.49, 0.49, -0.49], [-0.49, -0.49, -0.49], [-0.49, 0.49, -0.49], [0.49, 0.49, -0.49], [0.49, -0.49, -0.49], [-0.49, -0.49, -0.49], [0.49, -0.49, -0.49], [0.49, -0.49, 0.49], [-0.49, -0.49, 0.49], [-0.49, 0.49, 0.49], [0.49, 0.49, 0.49], [0.49, -0.49, 0.49], [0.49, -0.49, -0.49], [0.49, 0.49, -0.49], [0.49, 0.49, 0.49]];

    for(var i = 0; i < vec.length; i++)
    {
        geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(vec[i][0], vec[i][1], vec[i][2])));
    }
    this.line = new THREE.Line(geometry, material);



    //var side = {px:pos.x<0, nx:pos.x>0, py:pos.y<0, ny:pos.y>0, pz:pos.z<0, nz:pos.z>0};
    var side = calculateSide();
    this.cube = new THREE.Mesh(
        new THREE.CubeGeometry(1, 1, 1, null, null, null, null, side),
        new THREE.MeshBasicMaterial({color:0x000000, opacity:1.0})
    );

    this.cube.doubleSided = true;
    
};
MyGame.Cube.prototype = new THREE.Object3D();
MyGame.Cube.prototype.constructor = MyGame.Cube;
MyGame.Cube.prototype.update = function(side){
    var pos = camera.position;

    //var side = {px:pos.x<0, nx:pos.x>0, py:pos.y<0, ny:pos.y>0, pz:pos.z<0, nz:pos.z>0};
    var side = calculateSide();
    //console.log("pos", pos.z, side.pz);
    //line.update(side);
    var oldSide = this.cube.geometry.sides;
    var update = false;
    for(var k in oldSide){
        if(oldSide[k] != side[k])
        {
            update = true;
        }
    }
    //console.log("upodate", update);
    if(update)
    {
        this.remove(this.cube);
        this.cube = new THREE.Mesh(
            new THREE.CubeGeometry(1, 1, 1, null, null, null, null, side),
            new THREE.MeshBasicMaterial({color:0x000000, opacity:0.5})
        );
        this.cube.doubleSided = true;
        this.add(line.cube);
    }
};
MyGame.Cube.prototype.moveSphere = function(){
    var pos = camera.position;
    var x = Math.abs(pos.x);
    var y = Math.abs(pos.y);
    var z = Math.abs(pos.z);

    var dir = 0;//x
    var max = x;
    if(max < y)
    {
        max = y;
        dir = 1;
    }
    if(max < z)
    {
        max = z;
        dir = 2;
    }
    var dx = 0;
    var dy = 0;
    var dz = 0;
    if(dir == 0)
        dx = -pos.x/x;
    else if(dir == 1)
        dy = -pos.y/y;
    else if(dir == 2)
        dz = -pos.z/z;
    attacker.beginAttack(dx, dy, dz);
};
MyGame.Attacker = function(){
    this.state = 0;
    this.dir = 0;
    for(var k in sphPos){
        var sph = new THREE.Mesh(
            new THREE.SphereGeometry(0.5),
            //new THREE.CylinderGeometry(0.5, 0.5, 1),
            new THREE.MeshBasicMaterial({color:0xF0F019, wireframe:true})
        )
        var x = Math.floor(k/100);
        var y = Math.floor((k%100)/10);
        var z = k%10;
        sph.position.set(x-5+0.5, y-5+0.5, z-5+0.5);
        scene.add(sph);
        //attacker = sph;
        this.obj = sph;
        this.cx = x;
        this.cy = y;
        this.cz = z;
    }
};
MyGame.Attacker.prototype = {
    update:function(delta){
        if(this.state == 1 && this.obj.parent !== undefined)
        {
            var pos = this.obj.position;
            //console.log("move sphere", this.dx, this.dy, this.dz, delta, pos.x, pos.y, pos.z);

            this.obj.position.x += delta*this.dx*2;//2 1ms
            this.obj.position.y += delta*this.dy*2;
            this.obj.position.z += delta*this.dz*2;

            var curX = Math.floor(pos.x-0.5+5);
            var curY = Math.floor(pos.y-0.5+5);
            var curZ = Math.floor(pos.z-0.5+5);
            var curPos = curX*100+curY*10+curZ;
            console.log("curPos", curPos);

            if(curPos === this.stopGrid)
            {
                this.obj.position.x = curX-5+0.5;
                this.obj.position.y = curY-5+0.5;
                this.obj.position.z = curZ-5+0.5;

                this.cx = curX;
                this.cy = curY;
                this.cz = curZ;
                console.log("getCurPos", curX, curY, curZ);
                if(this.findTar)
                {
                    this.state = 2;
                }
                else
                    this.state = 0;

            }

            if((pos.x > 5 || pos.x < -5) || (pos.y > 5 || pos.y < -5) || (pos.z > 5 || pos.z < -5))
            {
                this.state = 0;
                this.obj.parent.remove(this.obj);
            }
        }
    },
    beginAttack: function(dx, dy, dz){
        if(this.state == 0)
        {
            this.dx = dx;
            this.dy = dy;
            this.dz = dz;
            
            var tarPos = null;
            this.stopGrid = null;
            this.findTar = false;
            console.log("beginAttack", dx, dy, dz, this.cx, this.cy, this.cz);
            if(dx != 0)
            {
                for(var i = this.cx; i >0 && i < 10; i += dx)
                {
                    var key = i*100+this.cy*10+this.cz;
                    if(level[key] !== undefined)
                    {
                        tarPos = key;
                        break;
                    }
                    else if(cylPos[key] !== undefined)
                    {
                        tarPos = key;
                        this.findTar = true;
                        break;
                    }
                }
            }
            else if(dy != 0)
            {
                for(var i = this.cy; i < 10 && i > 0; i += dy)
                {
                    var key = this.cx*100+i*10+this.cz;
                    if(level[key] !== undefined)
                    {
                        tarPos = key;
                        break;
                    }
                    else if(cylPos[key] !== undefined)
                    {
                        tarPos = key;
                        this.findTar = true;
                        break;
                    }
                }
            }
            else if(dz != 0)
            {
                for(var i = this.cz; i < 10 && i > 0; i += dz)
                {
                    var key = this.cx*100+this.cy*10+i;
                    if(level[key] !== undefined)
                    {
                        tarPos = key;
                        break;
                    }
                    else if(cylPos[key] !== undefined)
                    {
                        tarPos = key;
                        this.findTar = true;
                        break;
                    }
                }
            }
            console.log("curPos", tarPos-100*dx-10*dy-dz, this.findTar);
            if(tarPos !== null)
            {
                this.stopGrid = tarPos-100*dx-10*dy-dz;
            }

            this.state = 1;
        }
    }
};

MyGame.Target = function(){
    for(var k in cylPos){
        var tar = new THREE.Mesh(
            //new THREE.SphereGeometry(0.5),
            new THREE.CylinderGeometry(0.5, 0.5, 1),
            new THREE.MeshBasicMaterial({color:0x19F019, wireframe:true})
        )
        var x = Math.floor(k/100);
        var y = Math.floor((k%100)/10);
        var z = k%10;
        tar.position.set(x-5+0.5, y-5+0.5, z-5+0.5);
        scene.add(tar);
        this.obj = tar;
    }
};
MyGame.Target.prototype = {
    update:function(delta){
    }
};
//var cube;
/*
function makeCube()
{
    //no transparent
    var material = new THREE.LineBasicMaterial({color:0xFF1919, linewidth:2});
    var geometry = new THREE.Geometry();
    
    var vec = 
    [[-0.5, -0.5, -0.5], [-0.5, -0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, 0.5, -0.5], [-0.5, -0.5, -0.5], [-0.5, 0.5, -0.5], [0.5, 0.5, -0.5], [0.5, -0.5, -0.5], [-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [0.5, -0.5, 0.5], [-0.5, -0.5, 0.5], [-0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [0.5, -0.5, 0.5], [0.5, -0.5, -0.5], [0.5, 0.5, -0.5], [0.5, 0.5, 0.5]];
    for(var i = 0; i < vec.length; i++)
    {
        geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(vec[i][0], vec[i][1], vec[i][2])));
    }
    var line = new THREE.Line(geometry, material);

    
    var cube = new THREE.Mesh(
        new THREE.CubeGeometry(1, 1, 1, null, null, null, null, {px:false, py:false, pz:false}),
        new THREE.MeshBasicMaterial({color:0xFF1919, opacity:1.0})
    );
    //cube = new MyGame.Cube();
    
    var obj = new THREE.Object3D();
    obj.add(line);
    obj.add(cube);

    return obj;
}
*/
function makeBackground()
{
    var sphere = new THREE.Mesh(
        new THREE.SphereGeometry(30),
        new THREE.LineBasicMaterial({color:0xF0F0F0,  linewidth:2})
    );
    return sphere;
}


function animate()
{
    requestAnimationFrame( animate );

    controls.update();
    line.update();
    attacker.update(clock.getDelta());
    target.update(clock.getDelta());
    render();
}
function render()
{
    //controls.update(clock.getDelta());
    renderer.render(scene, camera);
}
var attacker;
var target;
function init()
{

    var height = window.innerHeight;
    var width  = window.innerWidth;

    renderer = new THREE.WebGLRenderer({doubleSided:true});
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);
    renderer.setClearColorHex(0x000000, 1);
    renderer.setFaceCulling("back");

    clock = new THREE.Clock();


    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        35,
        width/height,
        .1,
        1000
    );
    camera.position.set(0, 0, 25);
    camera.lookAt(scene.position);

    
    controls = new THREE.TrackballControls(camera, renderer.domElment);
    controls.rotateSpeed = 2.0;
    controls.noZoom = true;
    controls.noPan = true;
    controls.staticMoving = true;
    controls.addEventListener('change', render);
    
    //controls = new MyGame.Controls(scene, camera);

    /*
    controls = new THREE.RollControls(camera);
    controls.movementSpeed = 100;
    controls.lookSpeed = 3;
    */
    //controls.

    scene.add(camera);

    /*
    var material = new THREE.LineBasicMaterial({color:0xFF0000, linewidth:5});
    var geometry = new THREE.Geometry();
    console.log(new THREE.Vector3(-10, 0, 0));
    geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(-5, 3, 0)));
    geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(5, 3, 0)));
    geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(0, 10, 0)));
    */
    //var line = new MyGame.Cube();
    //var line = makeCube();
    line = new MyGame.Cube();
    line.scale = new THREE.Vector3(10, 10, 10);
    //var sphere = makeBackground();

    //var line = new THREE.Line(geometry, material);


    var sphere = new THREE.Mesh(
        new THREE.SphereGeometry(30),
        new THREE.MeshBasicMaterial({color:0xF0F0F0, wireframe:true})
    );
    /*
    sphere.position.set(5, 0, 0);

    var cube = new THREE.Mesh(
        new THREE.CubeGeometry(3, 3, 3),
        new THREE.MeshLambertMaterial({color:0xFF0000,  vertexColors:THREE.FaceColors, wireframe:true, transparent:true, opacity:0.5})
    );
    cube.position.set(-5, 0, 0);
    */


    //正方向z
    //环境光 * 灯光
    /*
    var plane = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10, 5, 5),
        new THREE.MeshLambertMaterial({color:0x00FF00})
    );
    */
    //scene.add(sphere);
    //scene.add(cube);

    for(var k in level){
        var sm = new MyGame.SmallCube();
        var x = Math.floor(k/100);
        var y = Math.floor((k%100)/10);
        var z = k%10;
        console.log(x, y, z);
        sm.position.set(x-5+0.5, y-5+0.5, z-5+0.5);
        scene.add(sm);
    }

    /*
    for(var k in cylPos){
        var tar = new THREE.Mesh(
            //new THREE.SphereGeometry(0.5),
            new THREE.CylinderGeometry(0.5, 0.5, 1),
            new THREE.MeshBasicMaterial({color:0x19F019, wireframe:true})
        )
        var x = k/100;
        var y = (k%100)/10;
        var z = k%10;
        tar.position.set(x-5+0.5, y-5+0.5, z-5+0.5);
        scene.add(tar);
        target = tar;
    }
    for(var k in sphPos){
        var sph = new THREE.Mesh(
            new THREE.SphereGeometry(0.5),
            //new THREE.CylinderGeometry(0.5, 0.5, 1),
            new THREE.MeshBasicMaterial({color:0xF0F019, wireframe:true})
        )
        var x = k/100;
        var y = (k%100)/10;
        var z = k%10;
        sph.position.set(x-5+0.5, y-5+0.5, z-5+0.5);
        scene.add(sph);
        attacker = sph;
    }
    */
    attacker = new MyGame.Attacker();
    target = new MyGame.Target();

    scene.add(line);
    scene.add(sphere);
    line.add(line.line);
    line.add(line.cube);
    document.onkeydown = keydown;
    document.onkeyup = keyup;
}
function main()
{
    init();
    animate();
    render();
    //scene.add(plane);

    //var light = new THREE.PointLight(0xFFFF00);
    //light.position.set(10, 10, 10);
    //scene.add(light);


}
