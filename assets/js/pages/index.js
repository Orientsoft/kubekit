$(document).ready(function () {
  selNodes = [];

  if (selNodes.length === 0) {
    $('#btn-deploy').attr('disabled', 'disabled');
  }

  $('td input').on('ifChecked', function (event) {
    selNodes.push(event.target.id);
    $('#btn-deploy').removeAttr('disabled');
    console.log(selNodes);
  });

  $('td input').on('ifUnchecked', function (event) {
    for (var i = selNodes.length - 1; i >= 0; i--) {
      if (selNodes[i] === event.target.id) {
        selNodes.splice(i, 1);
      }
    }

    if (selNodes.length === 0) {
      $('#btn-deploy').attr('disabled', 'disabled');
    }

    console.log(selNodes);
  });

  //节点提交验证
  $('#nodeForm').bootstrapValidator({
    message: 'This value is not valid',
    submitHandler: null,
    live: 'disabled',
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
  $('#add-node').click(function (e) {
    e.preventDefault();

    var bootstrapValidator = $('#nodeForm').data('bootstrapValidator');
    //手动触发验证
    bootstrapValidator.validate();
    if (bootstrapValidator.isValid()) {
      // Send request to add new node
      axios.post('/node', {
          name: $('#name').val(),
          ip: $('#ip').val(),
          port: parseInt($('#port').val()),
          password: $('#password').val(),
        })
        .then(function (response) {
          if (response.data.success) {
            toastr.success('成功添加节点!');
            $("#close-modal").trigger("click");
            //Refresh page
            setTimeout(function () {
              location.reload();
            }, 2000);
          } else {
            toastr.error('请求发生错误, 无法添加节点! <br/>' + response.data.message);
          }
        })
        .catch(function (error) {
          console.log(error);
          toastr.error('请求发生错误, 无法添加节点!');
        });
    }
  });
})

function refreshNode(nodeId) {
  console.log('Refresh node:' + nodeId);
}

function removeNode(nodeId) {

  console.log('Remove node:' + nodeId);
  axios.put("/node/remove/" + nodeId)
    .then((response) => {
      if (response.data.success) {
        toastr.success('成功移除节点!');
        //Refresh page
        setTimeout(function () {
          location.reload();
        }, 2000);
      } else {
        toastr.error('移除节点失败!');
      }
    })
    .catch((error) => {
      toastr.error('移除节点失败!');
    });
}

function batchInstall() {
  axios.post('/install', {
      ids: selNodes
    })
    .then(function (response) {
      if (response.data.success) {
        toastr.success('成功创建批量部署任务!');
        $("#close-modal").trigger("click");
        //Refresh page
        setTimeout(function () {
          location.reload();
        }, 2000);
      } else {
        toastr.error('请求发生错误, 无法创建批量部署任务! <br/>' + response.data.message);
      }
    })
    .catch(function (error) {
      console.log(error);
      toastr.error('请求发生错误, 无法创建批量部署任务!');
    });
}