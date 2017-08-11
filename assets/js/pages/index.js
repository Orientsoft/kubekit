$(document).ready(function () {
  
  //节点提交验证
  $('#nodeForm').bootstrapValidator({
    message: 'This value is not valid',
    fields: {
      name: {
        message: '节点名称不合法',
        validators: {
          notEmpty: {
            message: '节点名称必填'
          },
          stringLength: {
            min: 4,
            max: 15,
            message: '节点名称长度在4-15个字符之间'
          },
          regexp: {
            regexp: /^[a-zA-Z0-9_]+$/,
            message: '节点名称应由字母，数字和下划线构成'
          }
        }
      },
      password: {
        validators: {
          notEmpty: {
            message: 'The password is required and can\'t be empty'
          },
          identical: {
            field: 'confirmPassword',
            message: 'The password and its confirm are not the same'
          },
          different: {
            field: 'username',
            message: 'The password can\'t be the same as username'
          }
        }
      },
      confirmPassword: {
        validators: {
          notEmpty: {
            message: 'The confirm password is required and can\'t be empty'
          },
          identical: {
            field: 'password',
            message: 'The password and its confirm are not the same'
          },
          different: {
            field: 'username',
            message: 'The password can\'t be the same as username'
          }
        }
      },
      phoneNumber: {
        validators: {
          digits: {
            message: 'The value can contain only digits'
          }
        }
      }
    }
  });

  //提交添加节点
  $('#add-node').on('click', function () {
    console.log("clicked...");
    e.preventDefault();

    //3. Send request & show account info panel.
    var form = $('#create-form');
    var url = form.attr("action");
    $.post(url, form.serialize(), function (resp) {
      if (resp.success) {

      } else {
        //toastr.warning(data.message);
        return false;
      }
    }, "json");
  });

})