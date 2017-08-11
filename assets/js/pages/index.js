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
      ip: {
        validators: {
          notEmpty: {
            message: '内网IP地址不能为空'
          },
          regexp: {
            regexp: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            message: '请输入正确的内网IPV4地址'
          }
        }
      },
      password: {
        validators: {
          notEmpty: {
            message: 'SSH密码不能为空'
          }
        }
      },
      confirmPassword: {
        validators: {
          notEmpty: {
            message: 'SSH密码不能为空'
          },
          identical: {
            field: 'password',
            message: '密码两次输入不一致'
          }
        }
      },
      port: {
        validators: {
          notEmpty: {
            message: 'SSH端口号必填'
          },
          digits: {
            message: '端口号只能为数字'
          }
        }
      }
    }
  });

  //提交添加节点
  $('#add-node').on('click', function(e){
    // Send request to add new node
    axios.post('/node', {
        name: $('#name').val(),
        ip: $('#ip').val(),
        port: parseInt($('#port').val()),
        password: $('#password').val(),
      })
      .then(function (response) {
        if (response.data.success) {
          $("#close-modal").trigger("click");
          toastr.success('成功添加节点!');
        } else {
          toastr.error('请求发生错误, 无法成功添加节点! <br/>' + response.data.message);
        }
      })
      .catch(function (error) {
        console.log(error);
        toastr.error('请求发生错误, 无法成功添加节点!');
      });
  });

})