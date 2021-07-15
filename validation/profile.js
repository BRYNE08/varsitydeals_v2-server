const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.gender = !isEmpty(data.gender) ? data.gender : '';
  data.student = !isEmpty(data.student) ? data.student : '';
  data.institution = !isEmpty(data.institution) ? data.institution : '';
  data.campus = !isEmpty(data.campus) ? data.campus : '';

  if (Validator.isEmpty(data.gender)) {
    errors.gender = 'Gender is required';
  }

  if (Validator.isEmpty(data.student)) {
    errors.student = 'Student field is required';
  }

  if (Validator.isEmpty(data.institution)) {
    errors.institution = 'Institution field is required';
  }

  if (Validator.isEmpty(data.campus)) {
    errors.campus = 'Campus field is required';
  }




  return {
    errors,
    isValid: isEmpty(errors)
  };
};
