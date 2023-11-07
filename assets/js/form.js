function formValues(form) {
  const isValidElement = element => {
    return element.name && element.value;
  };

  const isValidValue = element => {
    return (!['checkbox', 'radio'].includes(element.type) || element.checked);
  };

  const isCheckbox = element => element.type === 'checkbox';
  const isMultiSelect = element => element.options && element.multiple;

  const getSelectValues = options => [].reduce.call(options, (values, option) => {
    return option.selected ? values.concat(option.value) : values;
  }, []);

  const formToJSON = elements => [].reduce.call(elements, (data, element) => {
    if (isValidElement(element) && isValidValue(element)) {
      if (isCheckbox(element)) {
        data[element.name] = (data[element.name] || []).concat(element.value);
      } else if (isMultiSelect(element)) {
        data[element.name] = getSelectValues(element);
      } else {
        data[element.name] = element.value;
      }
    }
    data.page = window.location.href;
    data.form = form.dataset.form;
    if(data.country_code) {
      const country = countries.filter(country => data.country_code == country.name)[0];
      let country_code = `+${country.code}`;
      data.code = country_code;
      data.country_id = country.ab;
    }
    return data;
  }, {});
  const data = formToJSON(form.elements);

  return {
    raw: data,
    data:   JSON.stringify(data, null, "  "),
  };
}

function formFeedBack(name = null, success = false) {
  const feedback = elem('.form_feedback');
  const feedback_wrap = elem('.overlay-feedback');
  const formSuccess = elem('.form_success');
  const formFail = elem('.form_fail');
  const formName = elem('.form-name');
  formName && name ? (formName.textContent = name) : false;
  pushClass(feedback, active);
  pushClass(feedback_wrap, active);
  success ?  pushClass(formSuccess, active) : pushClass(formFail, active);
  setTimeout((e) => clearFormFeedback(), 6000);
}

function clearFormFeedback() {
  const feedback = elem('.form_feedback');
  const feedback_wrap = elem('.overlay-feedback');
  deleteClass(feedback_wrap, active);
  deleteClass(feedback, active);

  Array.from(feedback.children).forEach(child => deleteClass(child, active));
}

function toggleForm(target, event) {
  let formButton = '.form-toggle';
  let formClose = '.form_close';
  let formClass = '.form';
  let modal = '.modal';
  let modalOverlay = '.modal_overlay';
  let feedbackClass = '.form_feedback';
  const matchCriteria = matchTarget(target, formButton);

  if(matchCriteria.valid) {
    event.preventDefault();
    const formID = matchCriteria.actual.dataset.id.trim(" ");
    let form = elem(`#${formID}`);
    modal = elem(modal);
    modalOverlay = elem(modalOverlay);
    if (form && modal && modalOverlay) {
      pushClass(modalOverlay, active);
      pushClass(form, active);
    }
  }

  const matchCriteria2 = matchTarget(target, formClose);

  if(matchCriteria2.valid) {
    modalOverlay = target.closest(modalOverlay);
    const formFeedbackWrapper = target.closest(feedbackClass);
    const form = target.closest(formClass);
    if(formFeedbackWrapper) {
      clearFormFeedback();
    } else {
      const form = target.closest(formClass)
      modalOverlay ? deleteClass(modalOverlay, active) : false ;
      deleteClass(form, active);
      clearFormFeedback();
    }
  }
}

function submitForm(form) {
  let dataObj = formValues(form);
  const parsed_data = JSON.parse(dataObj.data);
  let field = elem('.phone', form);

  let is_valid = field ? isAmericanPhoneNumber(parsed_data.phone).valid : true;

  if (is_valid) {
    let form_id = form.dataset.form;
    let formAction = basinHost + form_endpoints[form_id];

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: dataObj.data
    }

    fetch(formAction, options)
    .then(response => response.text())
    .then(() => {
      formFeedBack(dataObj.raw["Name"], true);
    })
    .catch(() => formFeedBack());

    setTimeout(() => {
      let submitButton = elem('.form_button', form);
      submitButton.disabled = true;
      form.reset();
    }, 150);

    deleteClass(field, error_class);

  } else {
    pushClass(field, error_class);
  }
}

(function handleForm() {
  // request options
  let formID = '.form';
  let forms = elems(formID);

  if (forms) {
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        event.preventDefault();
        submitForm(form);
        return false;
      });
    })
  }
})();