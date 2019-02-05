images = []
let go = true

function generate(args = [2.24, 0.43, -.65, -2.43, 1]){
  
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(0,0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  let xmin = -2
  let xmax = 2
  let ymin = -2
  let ymax = 2
  let pres = canvas.width;
  let iter1 = 900
  let iter2 = 700

  let xinc = pres/(xmax-xmin)
  let yinc = pres/(ymax-ymin)
  let e = 0
  let x = 0
  let y = 0
  let z = 0

  for(let j = 1; j<iter1; j++){
    for(let i = 1; i<iter2; i++){
      xx = Math.sin(args[0]*y)-z*Math.cos(args[1]*x)
      yy = z*Math.sin(args[2]*x)-Math.cos(args[3]*y)
      zz = args[4]*Math.sin(x)
      x = xx
      y = yy
      z = zz
      if(xx < xmax && xx > xmin && yy < ymax && yy > ymin){
        let xxx = (xx-xmax)*xinc
        let yyy = (yy-ymax)*yinc 
        ctx.fillRect(Math.abs(xxx), Math.abs(yyy), 1, 1)
      }
    }
  }

}



function create_gif(delay = 100, bg_color = "white"){
  return new Promise(function(resolve, reject){

    let frames = document.getElementsByClassName('frame');
    let gif = new GIF({workers:2, quality:2, width:600, height:600, bg_color:bg_color});
    for(let i = 1; i<frames.length; i++){
      gif.addFrame(frames[i], {delay: delay});
    }
    gif.on('finished', function(blob){
      resolve(URL.createObjectURL(blob));
    });
    gif.render();

  });
}

function build_gif(){
	let all_content = document.getElementsByClassName('main-content')[0];
	let progress = document.getElementsByClassName('progress')[0];
    all_content.style.display = "none";
    progress.style.display = "block";
  create_gif().then(
  	function(new_gif){
  	  progress.display = "none";
      let output = document.getElementsByClassName("image-output")[0];
      let output_image_element = document.getElementById("display-image");
      progress.style.display = "none";
      output.style.display = "block";
      output_image_element.src = new_gif;
  }
  );
}

function exit_viewer(){
  let output = document.getElementsByClassName("image-output")[0];
  let output_image_element = document.getElementById("display-image");
  let all_content = document.getElementsByClassName('main-content')[0];
  all_content.style.display = "grid";
  output.style.display = "none";
}


build_button = document.getElementById("build_button")
build_button.addEventListener('click', add_frame);
exit_viewer_button = document.getElementById("exit_viewer");
exit_viewer_button.addEventListener('click', exit_viewer);
function get_computed_style(element, propery_name){
  return new Promise(function(resolve, reject){
    let propery = window.getComputedStyle(element, null).getPropertyValue(propery_name);
    console.log("done")
    window.setTimeout(()=>resolve(propery), 140);
  });
}

function add_frame(){
  let src = canvas.toDataURL('image/png');
  let frames_container = document.getElementById("frames");
  let scroller = document.getElementsByClassName("frames-holder")[0];
  let img = document.getElementsByClassName("frame")[0];
  img = img.cloneNode(true);
  img.style.display = "inline-block";
  img.src = src;
  get_computed_style(frames_container, "height").then(function(width){
    img.style.width = width;
    frames_container.appendChild(img);
    scroller.scrollLeft = scroller.scrollWidth;
  });
}


let args = [2.24, 0.43, -0.65, -2.43, 1]

function update_args(arg_index, value){
  args[arg_index] = value;
  generate(args);
}

function update_arg_disp(disp_index, value){ //parameter
  arg_displays[disp_index].innerHTML = value;
}
function increment(button_index){
  sliders[button_index].value = Number(sliders[button_index].value)+0.01;
  update_arg_disp(button_index, sliders[button_index].value);
  update_args(button_index, sliders[button_index].value);
}
function decrement(button_index){
  sliders[button_index].value = Number(sliders[button_index].value)-0.01;
  update_arg_disp(button_index, sliders[button_index].value);
  update_args(button_index, sliders[button_index].value);
}

let sliders = document.getElementsByClassName("slider");
let arg_displays = document.getElementsByClassName("arg_disp");
let adders = document.getElementsByClassName("plus_button");
let subers = document.getElementsByClassName("minus_button");

for(let i = 0; i<sliders.length; i++){
  sliders[i].addEventListener('change', ()=>update_args(i, sliders[i].value));
  sliders[i].addEventListener('input', ()=>update_arg_disp(i, sliders[i].value));
  adders[i].addEventListener('click', ()=>increment(i));
  subers[i].addEventListener('click', ()=>decrement(i));
}

function resize(){
  let frames_container = document.getElementById('frames');
  let imgs = document.getElementsByClassName("frame");
  get_computed_style(frames_container, "height").then(function(height){
    for(let i =0; i<imgs.length; i++){
      imgs[i].style.width = height;
    }
  });
}
let gif_button = document.getElementById('make_gif');
gif_button.addEventListener('click', build_gif);
window.addEventListener('resize', resize);

let canvas = document.getElementById("canvas");
get_computed_style(canvas, "width").then(function(width){
  canvas.style.width = width;
  canvas.style.height = width;
}
);


generate()
