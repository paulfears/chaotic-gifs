images = []
let go = true

function generate(args = [2.24, 0.43, -.65, -2.43, 1, 0]){
  
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(0,0, canvas.width, canvas.height);
  
  let color = Number(args[5]).toString(16);

  let times = 6-color.length;
  for(let i = 0; i<times; i++){
    color = "0"+color;
  }
  color = "#"+color;
  ctx.fillStyle = color;
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

    let images = document.getElementsByClassName('frame-image');
    let gif = new GIF({workers:2, quality:2, width:600, height:600, bg_color:bg_color});
    for(let i = 1; i<images.length; i++){
      gif.addFrame(images[i], {delay: delay});
    }
    gif.on('finished', function(blob){
      resolve(URL.createObjectURL(blob));
    });
    gif.render();

  });
}

function display_progress(){
  let output = document.getElementsByClassName("image-output")[0];
  output.style.display = "block";
  let progress = document.getElementsByClassName('progress')[0];
  progress.style.display = "block";
}
function hide_progress(){
  let progress = document.getElementsByClassName('progress')[0];
  progress.style.display = "none";  
}
function open_viewer(gif){
  let viewer = document.getElementsByClassName("gif-viewer")[0];
  let output_image_element = document.getElementById("display-image");
  viewer.style.display = "block";
  output_image_element.src = gif;
}

function build_gif(){
  display_progress();
  create_gif().then(
  	function(new_gif){
      hide_progress();
      open_viewer(new_gif);
  }
  );
}

function exit_viewer(){
  let output = document.getElementsByClassName("image-output")[0];
  let viewer = document.getElementsByClassName("gif-viewer")[0];
  viewer.style.display = "none"; 
  output.style.display = "none";
}


build_button = document.getElementById("build_button")
build_button.addEventListener('click', add_frame);
exit_viewer_button = document.getElementById("exit_viewer");
exit_viewer_button.addEventListener('click', exit_viewer);
function get_computed_style(element, propery_name){
  return new Promise(function(resolve, reject){
    let propery = window.getComputedStyle(element, null).getPropertyValue(propery_name);
    window.setTimeout(()=>resolve(propery), 140);
  });
}

function add_frame(){
  let src = canvas.toDataURL('image/png');
  let frames_container = document.getElementById("frames");
  let scroller = document.getElementsByClassName("frames-holder")[0];
  let frame = document.getElementsByClassName("frame")[0];
  new_frame = frame.cloneNode(true);
  new_frame.style.display = "inline-block";
  new_frame.children[0].src = src;
  get_computed_style(frames_container, "height").then(function(width){
    new_frame.style.width = width;
    frames_container.appendChild(new_frame);
    scroller.scrollLeft = scroller.scrollWidth;
  });
}


let args = [2.24, 0.43, -0.65, -2.43, 1, 0]

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

function delete_frame(button_element){
  console.log("called");
  let top_div = button_element.parentNode.parentNode;
  top_div.removeChild(button_element.parentNode);
}

let sliders = document.getElementsByClassName("slider");
let arg_displays = document.getElementsByClassName("arg_disp");
let adders = document.getElementsByClassName("plus_button");
let subers = document.getElementsByClassName("minus_button");



function to_hex(number){
    let color = Number(number).toString(16);

  let times = 6-color.length;
  for(let i = 0; i<times; i++){
    color = "0"+color;
  }
  color = "#"+color;
  return color;

}

for(let i = 0; i<sliders.length; i++){

  sliders[i].addEventListener('change', ()=>update_args(i, sliders[i].value));
  if(i == 5){
    sliders[i].addEventListener('input', ()=>update_arg_disp(i, to_hex(sliders[i].value)));
    adders[i].addEventListener('click', ()=>{
      sliders[i].value+=1;
      update_arg_disp(i, to_hex(sliders[i].value));
      update_args(i, sliders[i].value);
    });
    subers[i].addEventListener('click', ()=>{
      sliders[i].value-=1;
      update_arg_disp(i, to_hex(sliders[i].value));
      update_args(i, sliders[i].value);
    });
  }
  else{
    sliders[i].addEventListener('input', ()=>update_arg_disp(i, sliders[i].value));
    adders[i].addEventListener('click', ()=>increment(i));
    subers[i].addEventListener('click', ()=>decrement(i));
  }

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
