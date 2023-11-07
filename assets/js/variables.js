const documentElement = document.documentElement;
const active = 'active';
const error_class = 'invalid';
const basinHost = 'https://usebasin.com/f/';
const form_endpoints = {
  contact: `{{ site.Params.forms_endpoints.contact }}`,
  phone: `{{ site.Params.forms_endpoints.phone }}`
};