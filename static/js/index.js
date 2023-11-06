const menuToggleBtn = document.querySelector('#nav_toggle');

document.querySelector('.main').addEventListener("click", function () {
  if (menuToggleBtn.checked) {
    menuToggleBtn.checked = false
  }
});

//close mobile menu on link click
document.querySelectorAll('.nav_link').forEach(function(link){
  link.addEventListener('click', function(){
    menuToggleBtn.checked = false
  })
})



//Reviews Section
const next = document.querySelector('.review_nextArrow');
const prev = document.querySelector('.review_prevArrow');
const track = document.querySelector('.review_cards');
const carousel_width = document.querySelector('.review_wrapper').offsetWidth;

//console.log(carousel_width)

let index = 0;
next.addEventListener('click', ()=> {
  index++
  track.style.transform = `translateX(-${(index*1) * carousel_width}px)`;

  // if(track.offsetWidth - (index * carousel_width) < carousel_width ){
  //   next.classList.add('hide')
  // }
})

prev.addEventListener('click', ()=> {
  index--
  if(index < 0){
    index = 0
  }
  next.classList.remove('hide')

  track.style.transform = `translateX(-${index * carousel_width}px)`;
})


// Project Slider
const slider = document.querySelector('.projects_slider');
const leftArrow = document.querySelector('.projects_leftarrow');
const rightArrow = document.querySelector('.projects_rightarrow');
const sliderChildren = slider.childElementCount

let sectionIndex = 0;

//console.log(typeof sliderChildren)

rightArrow.addEventListener('click', function(){
  sectionIndex = (sectionIndex < sliderChildren - 1 ) ? sectionIndex + 1 : sliderChildren - 1;
  slider.style.transform = 'translate(' + (sectionIndex) * (-100/sliderChildren) + '%)';
});

leftArrow.addEventListener('click', function(){
  sectionIndex = (sectionIndex > 0) ? sectionIndex - 1 : 0;
  slider.style.transform = 'translate(' + (sectionIndex) * (-100/sliderChildren) + '%)';
});
