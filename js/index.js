"use strict";

const canvas = document.querySelector(".game__display");
const timerElem = document.querySelector(".timer");
const scoreElem = document.querySelector(".score");
const ctx = canvas.getContext("2d");
const initialTime = performance.now();
let width = window.innerWidth;
let height = window.innerHeight;
let keys = [];
let enemies = [];
let speed = 5;
let score = 0;
let dead = false;

canvas.width = width;
canvas.height = height;

function keyPressed() {
	const args = arguments;
	return Array.from(args).map(key => {
		return keys.includes(key);
	}).includes(true);
}

function randomIntFromInterval(min, max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}

function die(s, t) {
	if (!dead) {
		dead = true;
		location.href = `dead.html?s=${s}&t=${t}`;
	}
}

function onKeyDown(e) {
	if (!e.repeat) {
		keys.push(e.code);
	}
}

function onKeyUp(e) {
	keys = keys.filter((value) => {
		return value !== e.code;
	});
}

document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);

class Player {
	constructor(x, y, w, h, c, minX) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.c = c;
		this.minX = minX;
		this.maxX = width/2-50;
		this.a = 0;
	}

	draw() {
		this.ch = height;
		this.maxY = this.ch-this.h;
		this.maxX = width/2-50;

		this.a++;
		this.y += this.a;

		if (this.y > this.maxY) {
			this.a = 0;
			this.y = this.maxY;
		}

		ctx.fillStyle = this.c;
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}

	jump() {
		if (this.y == this.ch-this.h) this.a = -20;
	}

	left() {
		if (this.x >= this.minX) this.x -= 5;
	}

	right() {
		if (this.x <= this.maxX) this.x += 5;
	}
}

class Enemy {
	constructor(x, y, w, h, c, minX, s) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.c = c;
		this.minX = minX;
		this.s = s;
	}

	draw() {
		this.x -= this.s;

		if (this.x < this.minX) {
			enemies.shift();
			score++;
		}

		if (this.y+this.h > player.y && this.y < player.y+player.h && this.x+this.w > player.x && this.x < player.x+player.w) {
			die(score, ((performance.now()-initialTime)/1e3).toFixed(2));
		}

		ctx.fillStyle = this.c;
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}
}

const player = new Player(100, height-50, 50, 50, "blue", 0);

const enemyGenInterval = setInterval(() => {
	var w = randomIntFromInterval(10, 100);
	var h = randomIntFromInterval(10, 100);
	var t = randomIntFromInterval(0, 100);
	enemies.push(new Enemy(width+w, height-t-h, w, h, "red", -w, speed));
}, 1.5e3);

function draw() {
	ctx.clearRect(0, 0, width, height);

	width = window.innerWidth;
	height = window.innerHeight;
	canvas.width = width;
	canvas.height = height;

	if (keyPressed("Space", "ArrowUp", "KeyW")) player.jump();
	if (keyPressed("ArrowLeft", "KeyA")) player.left();
	if (keyPressed("ArrowRight", "KeyD")) player.right();
	player.draw();
	speed *= 1.0005;
	enemies.forEach(value => {
		value.draw();
	});
	timerElem.innerHTML = ((performance.now()-initialTime)/1e3).toFixed(2);
	scoreElem.innerHTML = score;

	requestAnimationFrame(draw);
}
requestAnimationFrame(draw);