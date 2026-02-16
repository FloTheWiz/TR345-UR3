// Libs and Useful funcs

const l = what => document.getElementById(what);
const el = what => document.createElement(what);
function choose(arr) {return arr[Math.floor(Math.random()*arr.length)];}
function randInt(min, max) {return Math.floor(Math.random() * (max - min + 1)) + min;}
function randFloat(min,max) {return Math.random() * (max - min) + min;}

function weightedRandom(choices) {
  // assuming choices has weight and item 
  const totalWeight = choices.reduce((total, choice) => total + choice.weight, 0);
  let rand = Math.random() * totalWeight;
  for (let c of choices) {
    if (rand < c.weight) {
      return c.item;
    }
    rand -= c.weight;
  }
  return choices[0].item;
}
// Math.seedrandom function, from https://davidbau.com/archives/2010/01/30/random_seeds_coded_hints_and_quintillions.html
!function(a,b,c,d,e,f,g,h,i){function j(a){var b,c=a.length,e=this,f=0,g=e.i=e.j=0,h=e.S=[];for(c||(a=[c++]);d>f;)h[f]=f++;for(f=0;d>f;f++)h[f]=h[g=s&g+a[f%c]+(b=h[f])],h[g]=b;(e.g=function(a){for(var b,c=0,f=e.i,g=e.j,h=e.S;a--;)b=h[f=s&f+1],c=c*d+h[s&(h[f]=h[g=s&g+b])+(h[g]=b)];return e.i=f,e.j=g,c})(d)}function k(a,b){var c,d=[],e=typeof a;if(b&&"object"==e)for(c in a)try{d.push(k(a[c],b-1))}catch(f){}return d.length?d:"string"==e?a:a+"\0"}function l(a,b){for(var c,d=a+"",e=0;e<d.length;)b[s&e]=s&(c^=19*b[s&e])+d.charCodeAt(e++);return n(b)}function m(c){try{return o?n(o.randomBytes(d)):(a.crypto.getRandomValues(c=new Uint8Array(d)),n(c))}catch(e){return[+new Date,a,(c=a.navigator)&&c.plugins,a.screen,n(b)]}}function n(a){return String.fromCharCode.apply(0,a)}var o,p=c.pow(d,e),q=c.pow(2,f),r=2*q,s=d-1,t=c["seed"+i]=function(a,f,g){var h=[];f=1==f?{entropy:!0}:f||{};var o=l(k(f.entropy?[a,n(b)]:null==a?m():a,3),h),s=new j(h);return l(n(s.S),b),(f.pass||g||function(a,b,d){return d?(c[i]=a,b):a})(function(){for(var a=s.g(e),b=p,c=0;q>a;)a=(a+c)*d,b*=d,c=s.g(1);for(;a>=r;)a/=2,b/=2,c>>>=1;return(a+c)/b},o,"global"in f?f.global:this==c)};if(l(c[i](),b),g&&g.exports){g.exports=t;try{o=require("crypto")}catch(u){}}else h&&h.amd&&h(function(){return t})}(this,[],Math,256,6,52,"object"==typeof module&&module,"function"==typeof define&&define,"random");
// literally just stolen from orteil's code
function makeSeed(length=5){
  var chars='abcdefghijklmnopqrstuvwxyz'.split('');
	var str='';
	for (var i=0;i<length;i++){str+=choose(chars);}
	return str;
}

// mix two colors
function mixColors(c1, c2) {
  const parse = (c) => {
    let hex = c.replace("#", "");
    if ([3, 4].includes(hex.length)) hex = hex.replace(/./g, "$&$&"); // expand shorthand
    const hasAlpha = hex.length === 8;
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const a = hasAlpha ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
    return { r, g, b, a, hasAlpha };
  };

  const p1 = parse(c1),
    p2 = parse(c2);
  const r = Math.round((p1.r + p2.r) / 2);
  const g = Math.round((p1.g + p2.g) / 2);
  const b = Math.round((p1.b + p2.b) / 2);

  let hasAlpha = p1.hasAlpha || p2.hasAlpha;
  let a;
  if (p1.hasAlpha && p2.hasAlpha) {
    a = (p1.a + p2.a) / 2;
  } else if (p1.hasAlpha) {
    a = p1.a;
  } else if (p2.hasAlpha) {
    a = p2.a;
  } // else both no alpha -> no alpha in output

  const toHex = (v) => v.toString(16).padStart(2, "0");
  if (hasAlpha) {
    return "#" + toHex(r) + toHex(g) + toHex(b) + toHex(Math.round(a * 255));
  } else {
    return "#" + toHex(r) + toHex(g) + toHex(b);
  }
}

function drawFromSheet({ctx, image, index,w,h,c,x=0,y=0}) {
	const FRAME_W = w || 32;
	const FRAME_H = h || 32;
	const COLS = c || 6

	const col = index % COLS;
	const row = Math.floor(index / COLS);

	ctx.drawImage(
		image,
		col * FRAME_W,
		row * FRAME_H,
		FRAME_W,
		FRAME_H,
		x,
		y,
		FRAME_W,
		FRAME_H
	);
}


function fadeIn(element) {
  element.classList.add("fadeIn");
  setTimeout(() => {
    element.classList.remove("fadeIn");
  },1000);
}
//////////////////////////////////////////
//////////////////////////////////////////

// Preloading
const container = l("container");

const images = {
  planetX: "planetX.png",
  planetZ: "planetZ.png",
  player: "player.png",
  eyes: "eyes.png",
};
for (let i in images) {
  var img = new Image();
  img.src = "img/" + images[i];
  images[i] = img;
}

function drawCircle(ctx, x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
}
function drawTriangle(ctx, a,b,c, color) {
  // a b c should be vectors
  ctx.beginPath();
  ctx.moveTo(a[0],a[1]);
  ctx.lineTo(b[0],b[1]);
  ctx.lineTo(c[0],c[1]);
  ctx.fillStyle = color;
  ctx.fill();
}
//
const G = {
  assets: {
    base: images.player,
    eyes: images.eyes
  },
  
  activeChar: null,
  activeRun: null,
  firstTime: true,

  background: l('background'),
  foreground: l('foreground'),

  shipSettings: {
    hullCol: "#c1c1c1",
    glassCol: "#e1e1e1",
    floorCol: "#524331"
  },

  seed: null,
  tSeed: null,
  mode: "start",
  deseed: function(goToSeed) {
    this.tSeed = this.seed;
    Math.seedrandom(goToSeed);
  },
  reseed: function(){
    if (!this.tSeed) return;
    this.seed = this.tSeed;
    this.tSeed = null;
  },
  save: function () {
    const save = {
      activeChar: G.activeChar,
      activeRun: G.activeRun,
      firstTime: G.firstTime,
      shipSettings: G.shipSettings,
    };
    localStorage.setItem("save", JSON.stringify(save));
  },
  load: function () {
    const save = JSON.parse(localStorage.getItem("save"));
    if (save) {
      G.firstTime = true; // If they've got a save it's obviously not their first time
      G.activeChar = save.activeChar;
      G.activeRun = save.activeRun;
      G.shipSettings = save.shipSettings;
    }
  },
  onResize(){
    if (this.mode === "start") {
      this.drawSpace(this.seed);
      this.showShip();

    }
  },
  init: function(){
    // run other init things 
    G.seed = makeSeed(10);
  },
  launch: function () {
    // Launch Steps
    // Internationalisation basics / Pulling things
    G.load(); // Load
    // Patching Localisation and Mods
    G.init();
    G.showStartScreen();
  },
  showStartScreen: function() {
    
    if (G.firstTime) {
      container.innerHTML = `<button onclick="G.newCharacter();" class="pulsing" style="border: 1px solid red;"> Click To make New Runner </button><div id="charContainer"></div>`;
      document.title = "Welcome Home";
      G.setupBackground();
      G.drawSpace(this.seed);
      G.drawPlanet({image: images.planetX})
      G.showShip();
      
    }
  },
  character: {
    buffer: el('canvas'),
    view: el('canvas'),
    nativeSize:32,
    scale:4,
    data: {
      eyes: 3,
      mouth: 0,
      hair: 0,
      facialHair: 0,
      skinColor: null,
      clothesColor: null,
    }
  },
  characterCanvas: null,
  newCharacter() {
  this.setupCharacterCanvases();
	container.innerHTML = `
		<div id="outer">
			<div id="leftColumn" class="column"></div>
			<div id="middleColumn" class="column"></div>
			<div id="rightColumn" class="column"></div>
		</div>
	`;

	const middle = l("middleColumn");
  var view = G.buildCharacter(4)
  view.id = "charCanvas";
	middle.appendChild(view);
  fadeIn(l("charCanvas"));
  },
  setupCharacterCanvases() {
    const size = G.character.nativeSize;
    const scale = G.character.scale;

    // Logical buffer
    G.character.buffer.width = size;
    G.character.buffer.height = size;

    // Display canvas scaled
    G.character.view.width = size * scale;
    G.character.view.height = size * scale;

    const vctx = G.character.view.getContext("2d");
    vctx.imageSmoothingEnabled = false;
  },

composeCharacter() {
	const ctx = G.character.buffer.getContext("2d");
	const size = G.character.nativeSize;

	ctx.clearRect(0, 0, size, size);

	// Base
	ctx.drawImage(G.assets.base, 0, 0, size, size);

	// Eyes (spritesheet slicing example)
	drawFromSheet({ctx:ctx, image:this.assets.eyes, index:G.character.data.eyes,w:10,h:2,c:1,x:13,y:11});

	// Add more layers the same way
},

buildCharacter(scale) {
	this.composeCharacter();
	this.renderCharacter(scale);
	return G.character.view;
},
renderCharacter(scale = G.character.scale) {
	const size = G.character.nativeSize;

	const view = G.character.view;
	view.width = size * scale;
	view.height = size * scale;

	const vctx = view.getContext("2d");
	vctx.imageSmoothingEnabled = false;
	vctx.clearRect(0, 0, view.width, view.height);

	vctx.drawImage(
		G.character.buffer,
		0, 0, size, size,
		0, 0, size * scale, size * scale
	);
},


  showShip: function(){
    G.drawShipBackground();
  },
  setupBackground: function(){
    G.background.width = window.innerWidth;
    G.background.height = window.innerHeight; 
    G.foreground.width = window.innerWidth;
    G.foreground.height = window.innerHeight; 
  },
  // Draw Functions 
  drawPlanet(planet){
    var ctx = G.background.getContext("2d");
    var w = window.innerHeight;
    var h = window.innerHeight;

    var x = w / 2 - 64
    var y = w / 2 - 64

    ctx.context.drawImage(planet.image, 0, 0, 128, 128);
  },
  drawSpace(seed, starDensity){
    if (!starDensity) var starDensity = 200;
    if (G.seed) {G.deseed(seed);}
    var ctx = G.background.getContext("2d");
    var w = window.innerWidth;
    var h = window.innerHeight;
    // space
    // Create gradient
    ctx.clearRect(0,0,w,h);
    var grd = ctx.createLinearGradient(0, 0, w, h);
    grd.addColorStop(0, "#000");
    grd.addColorStop(0.2, "#222121");
    grd.addColorStop(0.7, "#150d15");
    grd.addColorStop(1, "#000")

    // Fill with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#fff";
    var cols = ["#fffffffe","#ffffffee","#d5c3c3f2","#d5c2c288","#c9c9e7aa","#f7afafbb","#f5ceb4ee","#f8f9e1fb","#f6e9c4fb","#fff"];
    for (var i = 0; i < starDensity; i++) {
      var col = choose(cols);
      drawCircle(ctx, Math.random() * w, Math.random() * h, Math.random()*3, col);
    }
    }
    G.reseed();
  },
  drawShipBackground: function() {
    var ctx = G.foreground.getContext("2d");
    var width = window.innerWidth;
    var height = window.innerHeight;
    // Draw Ship 
    var hullBaseCol = "#676767";
    var glassBaseCol = "#717171";
    var top_thickness = 59;
    var bottom_thickness = 100;
    var floor_height = 50;
    var side_thickness = 75;
    var diagonal = side_thickness * 3; // Width and Length of triangles that make up the borders
    // Draw bottom
    var hullCol = mixColors(G.shipSettings.hullCol, hullBaseCol);
    ctx.fillStyle = hullCol
    console.log(hullCol)
    ctx.fillRect(0, height-bottom_thickness, width, height);

    // Draw top
    ctx.fillRect(0,0,width,top_thickness);

    // Draw sides
    ctx.fillRect(0,0,side_thickness,height);
    ctx.fillRect(width-side_thickness,0,width,height);
    // Draw Triangles for borders
    const borderTris = [
      [[0,0],[diagonal, 0],[0, diagonal]], // top left
      [[width, 0],[width-diagonal,0],[width,diagonal]], // top right
      [[0, height],[0, height-diagonal],[diagonal,height]],
      [[width,height],[width,height-diagonal],[width-diagonal,height]]
    ]

    for (var t of borderTris) {
      drawTriangle(ctx, t[0],t[1],t[2],hullCol)
    }
    // Draw floor 
    ctx.fillStyle = G.shipSettings.floorCol;
    ctx.fillRect(0,height-floor_height,width,height);
    // Screws
    drawCircle(ctx,6,6,4,"#212121");
    drawCircle(ctx,width-6,6,4,"#212121");
  },

};

G.launch();
window.resize = () => {
  G.showShip();

}