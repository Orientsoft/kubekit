package controllers

import (
	"kubekit/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (router *MainRouter) IndexHandler(c *gin.Context) {
	c.HTML(http.StatusOK, "index.html", nil)
}

func (router *MainRouter) ListNodesHandler(c *gin.Context) {
	list := new(models.NodeList)
	if err := list.Deserialize(); err != nil {
		list.Nodes = []models.Node{}
	}

	c.JSON(http.StatusOK, list)
}
