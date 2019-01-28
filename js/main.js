///// GLOBALS ***************************************************//
var W = window.innerWidth,
	H = window.innerHeight;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var c = ctx;
var dashedRain = false;
var rainIntensity = 0.5;
var maxRadius = 1;
var speed = 5;
var textMaxSpeed = -0.5;
var gravity = 0.3;
var airResistance = 1;
var particleTTL = 25;
var randomSpawnRate = 75;
var wind = 0;
var ticker = 0;
var circleArr;
var miniCircleArr;
var startDate = new Date();
var endDate = new Date();
var rainInc = true;
var windInc = true;
var gravityInc = true;
var timeControl = 0.7;
var clr = 34;
var timeDiff = 0;
var firstLight = true;
var background = "linear-gradient(#333, #111)";
var words = [];
var showThoughts = false;
var center = {
	x: window.innerWidth / 2,
	y: window.innerHeight
};
///// GLOBALS ***************************************************//

// Earth obj
var earthWidth = 120;
var planets = [{
	x: 20,
	y: 10
}];
var clouds = [{
	x: 20,
	y: 10
}];
var land = [{
	x: 20,
	y: 10
}];
var stars = [{
	x: 10,
	y: 10
}];

// Man click event
document.getElementById("man1").addEventListener("click", function () {
	showThoughts = !showThoughts;
});

// Responsiveness
window.addEventListener("resize", function () {
	W = window.innerWidth;
	H = window.innerHeight;
	canvas.width = W;
	canvas.height = H;
	document.getElementById("man1").style.top = H - (300 - 44) + "px";
	center = {
		x: W / 2,
		y: H
	};

	clouds = [{
		x: 20,
		y: 10
	}];
	land = [{
		x: 20,
		y: 10
	}];
	drawClouds(25);
	drawLand(15);

	//start(true);
});

// Lightning effect
function lightning() {
	clr = 125;
}

//function drawBuilding(h,n,color){
//  var y = H-h;
//  var w = W/n+1;
//  var gap = w/n+1;
//  var h = h;
//  var x =gap;
//
//  for(var v = 0;v<n;v++){
//	var grd = ctx.createLinearGradient(x+w/2,y, x+w/2, y+h);
//	grd.addColorStop(0, color);
//	grd.addColorStop(1, "#111");
//
//	ctx.rect(x,y,w,h);
//	ctx.fillStyle = grd;
//	ctx.fill();
//	x += w +gap;
//  }
//
//}

// util
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
// Responsiveness
canvas.addEventListener("resize", function () {
	W = window.innerWidth;
	H = window.innerHeight;

	start(true);
});


//words
var Word = function (string) {
	this.string = string.toUpperCase();
	this.speed = Math.random() * textMaxSpeed;
	this.size = getRandomInt(5, 20);
	this.x = Math.random() * W;
	this.y = getRandomInt(H / 3, H - H / 2.5);
}
Word.prototype.draw = function () {
	ctx.font = this.size + "px impact";
	ctx.fillStyle = "#444";
	ctx.fillText(this.string, this.x, this.y);
}
Word.prototype.update = function () {
	this.x += this.speed;
	if (this.x < -100) {
		this.x = W + 100;
	}
	this.draw();
}

// Circle Class
var Circle = function (x, y, r, dx, dy) {
	this.x = x;
	this.y = y;
	this.r = r;
	this.velocity = {
		x: dx,
		y: dy
	};
};
Circle.prototype.draw = function () {
	ctx.beginPath();
	if (dashedRain) {
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x + wind, this.y + getRandomInt(1, 10));
		ctx.lineWidth = "0.5";
		ctx.strokeStyle = "#aaa";
	} else {
		ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
		ctx.strokeStyle = "#fff";
	}
	ctx.closePath();

	ctx.fillStyle = "#fff";
	ctx.stroke();
	ctx.fill();
}
Circle.prototype.update = function () {
	// boundary
	// if(this.x-this.r<-W/2){
	//   this.velocity.x = -this.velocity.x;
	// }
	if (this.x + this.r > W * 3) {
		// this.velocity.x = -this.velocity.x;
	} else {
		this.velocity.x += wind / 10;
	}
	// if(this.y-this.r<0){this.velocity.y = -this.velocity.y;}

	//lower boundary + gravity
	if (this.y + this.r > H) {
		this.r -= this.r;
		this.velocity.y = -this.velocity.y * airResistance;
		this.shatter();
		// delete this;
	} else {
		this.velocity.y += gravity;
	}

	this.x += this.velocity.x;
	this.y += this.velocity.y;
	////
	this.draw();
}
Circle.prototype.shatter = function () {
	for (var v = 0; v < 8; v++) {
		miniCircleArr.push(new MiniCircle(this.x, this.y, 1));
	}
}

// Mini Circles
var MiniCircle = function (x, y, r) {
	Circle.call(this, x, y, r);
	this.velocity = {
		x: getRandomInt(-5, 5),
		y: getRandomInt(-15, 15)
	};
	this.ttl = particleTTL;
	this.opacity = 1;
}
MiniCircle.prototype.draw = function () {
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
	ctx.closePath();
	// ctx.stroke();
	ctx.fillStyle = "rgba(255, 255, 255, " + this.opacity + ")";
	ctx.fill();
}
MiniCircle.prototype.update = function () {
	// boundary
	if (this.x - this.r < 0 || this.x + this.r > W) {
		this.velocity.x = -this.velocity.x;
	}
	if (this.y - this.r < 0) {
		this.velocity.y = -this.velocity.y;
	}

	//lower boundary + gravity
	if (this.y + this.r >= H) {
		this.velocity.y = -this.velocity.y * airResistance;
	} else {
		this.velocity.y += gravity;
	}

	this.x += this.velocity.x;
	this.y += this.velocity.y;
	this.ttl -= 1;
	this.opacity -= 1 / this.ttl;
	////
	this.draw();
}


///// Earth
function Circle2(x, y, radius, fillColor) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.fillColor = fillColor;

	c.beginPath();
	c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
	c.fillStyle = this.fillColor;
	c.fill();
}



function Cloud(x, y, dx, cloudWidth, cloudLength) {

	this.x = x;
	this.y = y;
	this.dx = dx;
	this.cloudWidth = cloudWidth;
	this.cloudLength = cloudLength;


	this.draw = function () {
		c.save();
		c.beginPath();
		c.arc(center.x, center.y, 120, 0, Math.PI * 2, false);
		c.clip();
		c.beginPath();
		c.moveTo(this.x, this.y);
		c.lineCap = 'round';
		c.lineWidth = this.cloudWidth;
		c.lineTo(this.x + this.cloudLength, this.y);
		c.strokeStyle = 'white';
		c.stroke();
		c.restore();
	}
	this.update = function () {
		if (this.x < (center.x - 240)) {
			this.x = center.x + 240;
		}
		this.x -= this.dx;
		this.draw();
	}

}

function ShootingStar(x, y, dx, dy, radius, color) {

	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = radius;
	this.color = color;


	this.draw = function () {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
		c.closePath();
		c.fillStyle = this.color;
		c.fill();
	}
	this.update = function () {
		this.x += this.dx;
		this.y += this.dy;
		this.draw();
	}
	this.reset = function () {
		this.x = Math.random() * canvas.width;
		this.y = Math.random() * canvas.height;
		this.dx = (Math.random() - 0.5) * 10;
		this.dy = (Math.random() - 0.5) * 10;
		this.radius = (Math.random() * 2) + 1;
	}

}

function Land(x, y, dx, landWidth, landLength) {

	this.x = x;
	this.y = y;
	this.dx = dx;
	this.landWidth = landWidth;
	this.landLength = landLength;


	this.draw = function () {
		c.save();
		c.beginPath();
		c.arc(center.x, center.y, 120, 0, Math.PI * 2, false);
		c.clip();
		c.beginPath();
		c.moveTo(this.x, this.y);
		c.lineCap = 'round';
		c.lineWidth = this.landWidth;
		c.lineTo(this.x + this.landLength, this.y);
		c.strokeStyle = '#85cc66';
		c.stroke();
		c.restore();
	}
	this.update = function () {
		if (this.x < (center.x - 240)) {
			this.x = center.x + 240;
		}
		this.x -= this.dx;
		this.draw();
	}

}

function SemiCircle(x, y, radius, fillColor) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.fillColor = fillColor;

	c.beginPath();
	c.arc(this.x, this.y, this.radius, Math.PI * 1.5, 1.5, false);
	c.fillStyle = this.fillColor;
	c.fill();
}



function Star(cx, cy, spikes, outerRadius, innerRadius) {
	this.rot = Math.PI / 2 * 3;
	this.x = cx;
	this.y = cy;
	this.spikes = spikes;
	this.outerRadius = outerRadius;
	this.innerRadius = innerRadius;

	this.step = Math.PI / this.spikes;

	c.strokeSyle = "#000";
	c.beginPath();
	c.moveTo(cx, cy - this.outerRadius)
	for (i = 0; i < this.spikes; i++) {
		this.x = cx;
		this.y = cy;
		x = cx + Math.cos(this.rot) * this.outerRadius;
		y = cy + Math.sin(this.rot) * this.outerRadius;
		c.lineTo(x, y)
		this.rot += this.step

		x = cx + Math.cos(this.rot) * this.innerRadius;
		y = cy + Math.sin(this.rot) * this.innerRadius;
		c.lineTo(x, y)
		this.rot += this.step
	}
	c.lineTo(cx, cy - this.outerRadius)
	c.closePath();
	c.lineWidth = 5;
	c.strokeStyle = 'rgb(32, 66, 136)';
	c.stroke();
	c.fillStyle = 'skyblue';
	c.fill();
}

//Initial object arrays
function drawStars(a) {
	for (var i = 0; i <= a; ++i) {
		var bestLocation = sample(stars);
		stars.push(new Star(bestLocation[0], bestLocation[1], 4, Math.floor(Math.random() * 4) + 2, 1));
	}
}

function drawPlanets(a) {
	for (var i = 0; i <= a; ++i) {
		var bestLocation = sample(planets);
		planets.push(new Circle2(bestLocation[0], bestLocation[1], Math.random() * 5, 'rgb(32, 66, 136)'));
	}
}

function drawClouds(a) {
	for (var i = 0; i <= a; ++i) {
		var bestLocation = earthMask(clouds);
		var cloudWidth = Math.floor(Math.random() * 20) + 5;
		var cloudLength = Math.floor(Math.random() * 30) + 18;
		var dx = (Math.random() + 0.2) * 1;
		clouds.push(new Cloud(bestLocation[0], bestLocation[1], dx, cloudWidth, cloudLength));
	}
}


function drawLand(a) {
	for (var i = 0; i <= a; ++i) {
		var bestLocation = earthMask(land);
		var landWidth = Math.floor(Math.random() * 25) + 10;;
		var landLength = Math.floor(Math.random() * 30) + 18;
		dx = 0.5;
		land.push(new Land(bestLocation[0], bestLocation[1], dx, landWidth, landLength));
	}
}

//Use best candidate algorithm to evenly distribute across the canvas
function sample(samples) {
	var bestCandidate, bestDistance = 0;
	for (var i = 0; i < 20; ++i) {
		var c = [Math.random() * window.innerWidth, Math.random() * window.innerHeight],
			d = distance(findClosest(samples, c), c);
		if (d > bestDistance) {
			bestDistance = d;
			bestCandidate = c;
		}
	}
	return bestCandidate;
}

//Use best candidate algorithm to evenly distribute across the earth mask
function earthMask(samples) {
	var bestCandidate, bestDistance = 0;
	//The higher the iteration the better the distribution
	//Performance takes a hit with higher iteration
	for (var i = 0; i < 20; ++i) {
		var c = [Math.floor(Math.random() * ((center.x + 240) - (center.x - 240) + 1)) + (center.x - 240), Math.floor(Math.random() * ((center.y + 120) - (center.y - 120) + 1)) + (center.y - 120)],
			d = distance(findClosest(samples, c), c);
		if (d > bestDistance) {
			bestDistance = d;
			bestCandidate = c;
		}
	}
	return bestCandidate;
}

function distance(a, b) {
	var dx = a.x - b[0],
		dy = a.y - b[1];
	return Math.sqrt(dx * dx + dy * dy);
}


function findClosest(points, b) {
	var distance = null;
	var closestPoint;
	for (var i = 0; i < points.length; ++i) {
		var dx = points[i].x - b[0];
		var dy = points[i].y - b[1];
		if (distance == null) {
			distance = Math.sqrt(dx * dx + dy * dy);
			closestPoint = points[i];
		} else if (distance > Math.sqrt(dx * dx + dy * dy)) {
			distance = Math.sqrt(dx * dx + dy * dy);
			closestPoint = points[i];
		}
	}
	return closestPoint;
}

//Generate how many elements you want
drawPlanets(50);
drawStars(20);
drawClouds(25);
drawLand(15);

//Sloppy code for two randomly generated shooting stars
var shootingStar = new ShootingStar(10, 10, 8, 8, 2, '#2c62c2');
var shootingStar2 = new ShootingStar(400, 300, -8, 8, 2, '#2c62c2');

window.setInterval(resetShootingStar, 3000);
window.setInterval(resetShootingStar2, 5000);

function resetShootingStar() {
	shootingStar.reset();
}

function resetShootingStar2() {
	shootingStar2.reset();
}



///// START AND UPDATE ******************************************//
// start
function start(refresh = false) {
	// canvas.style.background = "#222";
	canvas.style.background = background;
	canvas.width = W;
	canvas.height = H;
	ctx.lineWidth = "1";
	ctx.strokeStyle = "#fff";
	ctx.fillStyle = "#444";
	document.getElementById("man1").style.top = H - (300 - 44) + "px";

	circleArr = [];
	miniCircleArr = [];

	setTimeout(lightning, 4000);
	setTimeout(lightning, 4200);

	words.push(new Word("Looser"));
	words.push(new Word("FAILURE"));
	words.push(new Word("WORTHLESS"));
	words.push(new Word("Lazy"));
	words.push(new Word("Dissapointment"));
	words.push(new Word("YOU"));
	words.push(new Word("Sleep"));
	words.push(new Word("Why?"));
	words.push(new Word("How?"));
	words.push(new Word("HAPPINESS"));
	words.push(new Word("Joy"));
	words.push(new Word("Love"));
	words.push(new Word("Dreams"));
	words.push(new Word("Sky"));
	words.push(new Word("Do not Stop."));
	words.push(new Word("Prove them wrong"));
	words.push(new Word("Be Ambitious"));
	words.push(new Word("I did not woke up to be mediocre"));
	words.push(new Word("Success"));


	if (!refresh) {
		//	// for(var v=0;v<250;v++){
		//	//   var r = Math.random() * maxRadius;
		//	//   var x = Math.random() * (W-r*2)+r;
		//	//   var y = Math.random() * (H-r*2)+r;
		//	//   var dx = (Math.random() - 0.5) * speed;
		//	//   var dy = (Math.random() - 0.5) * speed;
		//	//   circleArr.push(new Circle(x,y,r,dx,dy));
		//	// }
		//	////
		update();
	}
}

// Update every frame
function update() {
	requestAnimationFrame(update);
	ctx.clearRect(0, 0, W, H);
	////

	// draw words
	if (showThoughts) {
		for (var v = 0; v < words.length; v++) {
			words[v].update();
		}
	}


	for (var v = 0; v < circleArr.length; v++) {
		if (circleArr[v].r >= 0) {
			circleArr[v].update();
			if (circleArr[v].r == 0) {
				circleArr.splice(v, 1);
			}
		}
	}
	for (var v = 0; v < miniCircleArr.length; v++) {
		if (miniCircleArr[v] !== undefined) {
			miniCircleArr[v].update();
			if (miniCircleArr[v].ttl == 0) {
				miniCircleArr.splice(v, 1);
			}
		}
	}

	// if(ticker%randomSpawnRate == 0){
	for (var v = 0; v < rainIntensity; v++) {
		var r = Math.random() * maxRadius;
		var x = Math.random() * (W * 3) - 30;
		var y = 0;
		// var dx = (Math.random() - 0.5) * speed;
		var dx = wind;
		var dy = (Math.random() - 0.5) * speed;
		circleArr.push(new Circle(x, y, r, dx, dy));
	}
	// }

	// wind control

	endDate = new Date();
	timeDiff = (endDate - startDate) / 1000;
	if (timeDiff > timeControl) {
		if (wind >= -6 && windInc) {
			wind -= 0.5;

			if (wind <= -6) {
				windInc = false;
				setTimeout(lightning, getRandomInt(1000, 4000));
			}
		} else {
			wind += 0.5;
			if (wind > 0) {
				windInc = true;
				setTimeout(lightning, getRandomInt(1000, 4000));
			}
		}

		if (wind < -3) {
			timeControl = 0.5;
			rainIntensity = 1.5;
		} else if (wind >= -3 && wind < -1) {
			timeControl = 0.1;
			rainIntensity = 0.5;
		} else {
			timeControl = 4;
			rainIntensity = 3;
		}

		startDate = endDate;
	}

	//Lightning
	if (clr > 51) {
		console.log("lightning");
		canvas.style.background = "linear-gradient(rgb(" + clr + "," + clr + "," + clr + "),#111)";
		clr -= 2;
	} else {
		canvas.style.background = background;
	}

	//Earth
	ctx.fillStyle = 'rgba(11, 21, 56,0.3)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	shootingStar.update();
	shootingStar2.update();

	for (var i = 0; i < stars.length; i++) {
		Star(stars[i].x, stars[i].y, stars[i].spikes, stars[i].innerRadius, stars[i].outerRadius);
	}
	for (var i = 0; i < planets.length; i++) {
		Circle2(planets[i].x, planets[i].y, planets[i].radius, planets[i].fillColor);
	}
	var ring3 = new Circle2(center.x, center.y, 245, 'rgba(10, 23, 66, 0.5)');
	var ring2 = new Circle2(center.x, center.y, 215, 'rgba(9, 30, 75, 0.5)');
	var ring1 = new Circle2(center.x, center.y, 175, 'rgba(8, 34, 83, 0.5)');
	var earthBorder = new Circle2(center.x, center.y, 135, 'rgb(12, 20, 56)');
	var earth = new Circle2(center.x, center.y, earthWidth, 'rgb(25, 118, 181)');
	for (var i = 1; i < land.length; i++) {
		land[i].update();
	}
	for (var i = 1; i < clouds.length; i++) {
		clouds[i].update();
	}
	var semi = new SemiCircle(center.x, center.y, earthWidth, 'rgba(0, 0, 0, 0.4)');
}

///// MAIN ******************************************************//
start();
///// MAIN ******************************************************//
