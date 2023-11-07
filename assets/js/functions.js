function isObj(obj) {
  return (obj && typeof obj === 'object' && obj !== null) ? true : false;
}

function appendBefore(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode);
}

function appendAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function createEl(element = 'div') {
  return document.createElement(element);
}

function emptyEl(el) {
  while(el.firstChild)
  el.removeChild(el.firstChild);
}

function elem(selector, parent = document){
  let elem = isObj(parent) ? parent.querySelector(selector) : false;
  return elem ? elem : false;
}

function elems(selector, parent = document) {
  let elems = isObj(parent) ? parent.querySelectorAll(selector) : [];
  return elems.length ? elems : false;
}

function elSiblings(el) {
  const siblings = Array.prototype.filter.call(el.parentNode.children, function(child){
    return child !== el;
  });
  return siblings;
}

function pushClass(el, targetClass = active) {
  if (isObj(el)) {
    let elClass = el.classList;
    elClass.contains(targetClass) ? false : elClass.add(targetClass);
  }
}

function deleteClass(el, targetClass = active) {
  if (isObj(el)) {
    let elClass = el.classList;
    elClass.contains(targetClass) ? elClass.remove(targetClass) : false;
  }
}

function modifyClass(el, targetClass = active) {
  if (isObj(el)) {
    const elClass = el.classList;
    elClass.contains(targetClass) ? elClass.remove(targetClass) : elClass.add(targetClass);
  }
}

function containsClass(el, targetClass = active) {
  if (isObj(el) && el !== document ) {
    return el.classList.contains(targetClass) ? true : false;
  }
}

function isChild(node, parentClass) {
  let objectsAreValid = isObj(node) && parentClass && typeof parentClass == 'string';
  return (objectsAreValid && node.closest(parentClass)) ? true : false;
}

function elemAttribute(elem, attr, value = null) {
  if (value) {
    elem.setAttribute(attr, value);
  } else {
    value = elem.getAttribute(attr);
    return value ? value : false;
  }
}

function deleteChars(str, subs) {
  let newStr = str;
  if (Array.isArray(subs)) {
    for (let i = 0; i < subs.length; i++) {
      newStr = newStr.replace(subs[i], '');
    }
  } else {
    newStr = newStr.replace(subs, '');
  }
  return newStr;
}

function isBlank(str) {
  return (!str || str.trim().length === 0);
}

function isMatch(element, selector) {
  if(isObj(element)) {
    if(selector.isArray) {
      let matching = selector.map(function(attr){
        return element.matches(attr)
      })
      return matching.includes(true);
    }
    return element.matches(selector)
  }
}

function matchTarget(element, selector) {
  if(isObj(element)) {
    let matches = false;
    const isExactMatch = element.matches(selector);
    const exactTarget = element.closest(selector);
    matches = isExactMatch ? isExactMatch : exactTarget;
    return  {
      exact: isExactMatch, // is exact target
      valid: matches,
      actual: exactTarget
    };
  }
}

function closestInt(goal, collection) {
  return collection.reduce(function (prev, curr) {
    return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
  });
}

function hasClasses(el) {
  if(isObj(el)) {
    const classes = el.classList;
    return classes.length
  }
}

function wrapEl(el, wrapper) {
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
}

function wrapText(text, context, wrapper = 'mark') {
  let open = `<${wrapper}>`;
  let close = `</${wrapper}>`;
  let escapedOpen = `%3C${wrapper}%3E`;
  let escapedClose = `%3C/${wrapper}%3E`;
  function wrap(context) {
    let c = context.innerHTML;
    let pattern = new RegExp(text, "gi");
    let matches = text.length ? c.match(pattern) : null;

    if(matches) {
      matches.forEach(function(matchStr){
        c = c.replaceAll(matchStr, `${open}${matchStr}${close}`);
        context.innerHTML = c;
      });

      const images = elems('img', context);

      if(images) {
        images.forEach(image => {
          image.src = image.src.replaceAll(open, '').replaceAll(close, '').replaceAll(escapedOpen, '').replaceAll(escapedClose, '');
        });
      }
    }
  }

  const contents = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "code", "td"];

  contents.forEach(function(c){
    const cs = elems(c, context);
    if(cs.length) {
      cs.forEach(function(cx, index){
        if(cx.children.length >= 1) {
          Array.from(cx.children).forEach(function(child){
            wrap(child);
          })
          wrap(cx);
        } else {
          wrap(cx);
        }
        // sanitize urls and ids
      });
    }
  });

  const hyperLinks = elems('a');
  if(hyperLinks) {
    hyperLinks.forEach(function(link){
      link.href = link.href.replaceAll(encodeURI(open), "").replaceAll(encodeURI(close), "");
    });
  }
}

function parseBoolean(string) {
  string = string.trim().toLowerCase();
  switch (string) {
    case 'true':
    return true;
    case 'false':
    return false;
    default:
    return undefined;
  }
}

function loadSvg(file, parent, path = 'icons/') {
  const link = new URL(`${path}${file}.svg`, rootURL).href;
  fetch(link)
  .then((response) => {
    return response.text();
  })
  .then((data) => {
    parent.innerHTML = data;
  });
}

function copyToClipboard(str) {
  let copy, selection, selected;
  copy = createEl('textarea');
  copy.value = str;
  copy.setAttribute('readonly', '');
  copy.style.position = 'absolute';
  copy.style.left = '-9999px';
  selection = document.getSelection();
  doc.appendChild(copy);
  // check if there is any selected content
  selected = selection.rangeCount > 0 ? selection.getRangeAt(0) : false;
  copy.select();
  document.execCommand('copy');
  doc.removeChild(copy);
  if (selected) { // if a selection existed before copying
    selection.removeAllRanges(); // unselect existing selection
    selection.addRange(selected); // restore the original selection
  }
}

function elementInViewport(el) {
  var top = el.offsetTop;
  var left = el.offsetLeft;
  var width = el.offsetWidth;
  var height = el.offsetHeight;

  while(el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }

  return (top < (window.pageYOffset + window.innerHeight) &&
  left < (window.pageXOffset + window.innerWidth) &&
  (top + height) > window.pageYOffset &&
  (left + width) > window.pageXOffset);
}

function insertBefore(newNode, existingNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode);
}

function formatPhoneNumber(code, phone) {
  if(phone) {
    phone = (phone[0] == "0") ? phone.substr(1) : phone;
    return code + phone;
  }
}

function fitsCriteria(name, list = simulateMailsList) {
  let criteria = false
  list.forEach(listItem => {
    if(name.toLowerCase().includes(listItem.toLowerCase())) {
      criteria = true;
    }
  });
  return criteria;
}

function formatMoney(amount, decimalCount = 0, decimal = ".", thousands = ",") {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    let j = (i.length > 3) ? i.length % 3 : 0;

    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
  } catch (e) {
    console.log(e)
  }
}

function toggleActiveNode(targets, cascade = false, activeClass = active) {
  const direct = targets[0];
  const indirect = targets[1];
  if(cascade) {
    if(indirect) {
      elSiblings(indirect).forEach(sibling => {
        deleteClass(sibling, activeClass)
      })
    }
    elSiblings(direct).forEach(sibling => {
      deleteClass(sibling, activeClass);
    })
    pushClass(direct, activeClass);
    indirect ? pushClass(indirect, activeClass) : false;
  } else {
    modifyClass(direct, activeClass);
    indirect ? modifyClass(indirect, activeClass) : false;
  }
}

function isAmericanPhoneNumber(num) {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

  let formattedPhoneNumber = ""
  let isPhoneNumber = false

  if (phoneRegex.test(num)) {
    formattedPhoneNumber =
    num.replace(phoneRegex, "($1) $2-$3");
    isPhoneNumber = true;
  }

  return {
    valid: isPhoneNumber,
    formatted: formattedPhoneNumber
  }
}