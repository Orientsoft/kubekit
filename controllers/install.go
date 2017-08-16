package controllers

import (
	"encoding/json"
	"fmt"
	"kubekit/models"
	"kubekit/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

const (
	installCmd = "curl -L http://%s:8000/test.sh | bash -s %s %s --token=%s %s:6443>install.log 2>&1 &"
)

func (router *MainRouter) InstallNodeHandler(c *gin.Context) {
	params := struct {
		Ids []string `json:"ids"`
	}{}

	c.BindJSON(&params)
	fmt.Println("Params.Ids:", params.Ids)

	if len(params.Ids) > 0 {
		router.startInstall(params.Ids)
	}

	resp := models.Response{Success: true, Message: "OK!", Data: nil}
	c.JSON(http.StatusOK, resp)
}

func (router *MainRouter) startInstall(ids []string) {
	masterIP := utils.GetMasterIP()
	token := utils.GetToken()

	if masterIP != "" && token != "" {
		for _, id := range ids {
			go utils.ExecuteCmd(router.nodeMap[id], fmt.Sprintf(installCmd, masterIP, masterIP, id, token, masterIP))
		}
	}
}

func (router *MainRouter) NodeProgressHandler(c *gin.Context) {
	id := c.Param("id")
	step := c.Param("step")

	if id == "" || step == "" {
		return
	}

	//if node id doesn't exist, just return
	if _, ok := router.nodeMap[id]; !ok {
		return
	}

	var comment string
	var status int

	switch step {
	case "1":
		comment = "(1/5) 安装Docker Engine"
		status = 1
	case "2":
		comment = "(2/5) 载入Kubernetes镜像"
		status = 1
	case "3":
		comment = "(3/5) 安装Kubernetes组件"
		status = 1
	case "4":
		comment = "(4/5) 初始化并加入集群"
		status = 1
	case "5":
		comment = "节点初始化完成"
		status = 2
	}

	//Update node status
	router.nodeList.UpdateNodeStatus(id, comment, status)

	//Update node map in memory
	node := router.nodeMap[id]
	node.Comment = comment
	node.Status = status

	//Broadcast websocket message to all clients
	if data, err := json.Marshal(node); err == nil {
		sendMessage(data)
	}
}
