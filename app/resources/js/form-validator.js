const formValidator = (function() {

  const initForm = function(id, callback) {
    const $form = $(id),
      ERROR_CLASS = "has-error",
      VALID_CLASS = "has-success";

    $form.validate().destroy();

    $form.each(function() {
      $(this).validate({
        errorClass: ERROR_CLASS,
        validClass: VALID_CLASS,
        errorPlacement: function(error, element) {
          error.addClass("control-label");
          if (element.parent().hasClass("input-group")) {
            error.insertAfter(element.parent());
          } else {
            error.insertAfter(element);
          }
        },
        unhighlight: function(element, errorClass, validClass) {
          $(element)
            .closest(".form-group")
            .removeClass(errorClass);
        },
        highlight: function(element, errorClass, validClass) {
          $(element)
            .closest(".form-group")
            .addClass(errorClass);

          $(element).addClass('error');
        },
        success: function(label, input) {
          $(input)
            .closest(".form-group")
            .removeClass(ERROR_CLASS);
          label.remove();
          $(input).removeClass('error');
        },
        submitHandler: function(form) {
          callback();
        }
      });
    });
  };

  return {
    initForm: initForm
  }
})();
