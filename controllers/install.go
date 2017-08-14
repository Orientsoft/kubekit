package controllers

import (
	"fmt"
	"kubekit/models"
	"kubekit/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

const (
	installCmd = "curl -L http://%s:8000/test.sh | bash -s master>install.log 2>&1 &"
)

func (router *MainRouter) InstallNodeHandler(c *gin.Context) {
	params := struct {
		Ids []string `json:"ids"`
	}{}

	c.BindJSON(&params)

	if len(params.Ids) > 0 {
		router.startInstall(params.Ids)
	}

	resp := models.Response{Success: true, Message: "OK!", Data: nil}
	c.JSON(http.StatusOK, resp)
}

func (router *MainRouter) startInstall(ids []string) {
	masterIP := utils.GetMasterIP()

	if masterIP != "" {
		for _, id := range ids {
			go utils.ExecuteCmd(router.nodeMap[id], fmt.Sprintf(installCmd, masterIP))
		}
	}
}

func (router *MainRouter) NodeProgressHandler(c *gin.Context) {
	id := c.Param("id")
	step := c.Param("step")

	if id == "" || step == "" {
		return
	}

	var comment string
	switch step {
	case "1":
		comment = "(1/5) 安装Docker Engine"
	case "2":
		comment = "(2/5) 载入Kubernetes镜像"
	case "3":
		comment = "(3/5) 安装Kubernetes组件"
	case "4":
		comment = "(4/5) 初始化并加入集群"
	case "5":
		comment = "(5/5) 节点初始化完成"
	}

	//Update node status
	router.nodeList.UpdateNodeStatus(id, comment)
	//Update node map in memory
	node := router.nodeMap[id]
	node.Comment = comment
}
