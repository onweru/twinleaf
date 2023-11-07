const menuToggleBtn = elem('#nav_toggle');

elem('.main').addEventListener("click", function () {
  if (menuToggleBtn.checked) {
    menuToggleBtn.checked = false
  }
});

//close mobile menu on link click
elems('.nav_link').forEach(function(link){
  link.addEventListener('click', function(){
    menuToggleBtn.checked = false
  })
});

function toggleFaq(target) {
  let is_faq = matchTarget(target, '.faq');
  if(is_faq.valid) {
    let faq = is_faq.actual;
    toggleActiveNode([faq], false);
  }
}

function scrollToTop() {
  let scrollButton = document.querySelector('.footer_scroll');
  if (scrollButton) {
    scrollButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
    });
  }
}

function scrollSlides(target) {
  let is_left = matchTarget(target, '.left');
  let is_right = matchTarget(target, '.right');
  if(is_left.valid || is_right.valid) {
    let carousel = elem('.carousel', target.closest('section'))

    let offset = carousel.offsetWidth;

    offset = is_left.valid ? offset * -1 : offset;

    let scroll_object = {
      top: 0,
      left: offset,
      behavior: "smooth",
    }

    carousel.scrollBy(scroll_object);
  }
}

function togglePhoneFieldPlaceholder(target, focus = true) {
  is_phone_field = matchTarget(target, '.phone');
  if (is_phone_field.valid) {
    let field = is_phone_field.actual;
    field.placeholder = focus ? "111 222 3333" : "Phone Number";
  }
}

window.addEventListener('load', (e) => {
  let page = documentElement;
  page.addEventListener('click', event => {
    let target = event.target;
    toggleFaq(target);
    scrollSlides(target);
    toggleForm(target, event);
  });

  page.addEventListener("focusin", (event) => {
    togglePhoneFieldPlaceholder(event.target);
  });

  page.addEventListener("focusout", (event) => {
    togglePhoneFieldPlaceholder(event.target, false);
  });

  scrollToTop();
});