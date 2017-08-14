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

	switch step {
	case "1":
	case "2":
	case "3":
	case "4":
	}
}
