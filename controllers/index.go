package controllers

import (
	"kubekit/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func (router *MainRouter) IndexHandler(c *gin.Context) {
	c.HTML(http.StatusOK, "index.html", gin.H{"nodes": router.nodeList})
}

func (router *MainRouter) ListNodesHandler(c *gin.Context) {
	c.JSON(http.StatusOK, router.nodeList)
}

func (router *MainRouter) CreateNodesHandler(c *gin.Context) {
	node := models.Node{}

	if err := c.BindJSON(&node); err != nil {
		resp := models.Response{Success: false, Message: "请求格式错误!"}
		c.JSON(http.StatusOK, &resp)
		return
	}

	for _, n := range router.nodeList.Nodes {
		if n.Name == node.Name || n.IP == node.IP {
			resp := models.Response{Success: false, Message: "节点名称或IP重复!"}
			c.JSON(http.StatusOK, &resp)
			return
		}
	}

	node.CreatedAt = time.Now().Format("2006-01-02 15:04:05")
	router.nodeList.Nodes = append(router.nodeList.Nodes, node)

	//Serialize nodes
	if err := router.nodeList.Serialize(); err != nil {
		resp := models.Response{Success: false, Message: "持久化节点数据失败!"}
		c.JSON(http.StatusOK, &resp)
		return
	}

	resp := models.Response{Success: true}
	c.JSON(http.StatusOK, &resp)
}
