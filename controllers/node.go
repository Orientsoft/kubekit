package controllers

import (
	"kubekit/models"
	"kubekit/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func (router *MainRouter) ListNodesHandler(c *gin.Context) {
	resp := models.Response{Success: true, Data: router.nodeList}
	c.JSON(http.StatusOK, resp)
}

func (router *MainRouter) RemoveNodeHandler(c *gin.Context) {
	nid := c.Param("id")

	if nid == "" || len(nid) < 16 {
		resp := models.Response{Success: false, Message: "节点ID参数不正确"}
		c.JSON(http.StatusOK, resp)
		return
	}

	for i := 0; i < len(router.nodeList.Nodes); i++ {
		if router.nodeList.Nodes[i].ID == nid {
			//Remove node from slice
			router.nodeList.Nodes = router.nodeList.Remove(i)

			//Serialize nodes
			if err := router.nodeList.Serialize(); err != nil {
				resp := models.Response{Success: false, Message: "持久化节点数据失败!"}
				c.JSON(http.StatusOK, &resp)
				return
			}
		}
	}

	resp := models.Response{Success: true, Message: "OK!", Data: nil}
	c.JSON(http.StatusOK, resp)
}

func (router *MainRouter) CreateNodeHandler(c *gin.Context) {
	node := models.Node{}

	if err := c.BindJSON(&node); err != nil {
		resp := models.Response{Success: false, Message: "请求格式错误!"}
		c.JSON(http.StatusOK, resp)
		return
	}

	if node.Name == "" || node.IP == "" {
		resp := models.Response{Success: false, Message: "节点名称或IP不能为空!"}
		c.JSON(http.StatusOK, resp)
		return
	}

	for _, n := range router.nodeList.Nodes {
		if n.Name == node.Name || n.IP == node.IP {
			resp := models.Response{Success: false, Message: "节点名称或IP重复!"}
			c.JSON(http.StatusOK, resp)
			return
		}
	}

	node.ID = utils.GenerateUUID(16)
	node.CreatedAt = time.Now().Format("2006-01-02 15:04:05")
	router.nodeList.Nodes = append(router.nodeList.Nodes, node)

	//Serialize nodes
	if err := router.nodeList.Serialize(); err != nil {
		resp := models.Response{Success: false, Message: "持久化节点数据失败!"}
		c.JSON(http.StatusOK, resp)
		return
	}

	resp := models.Response{Success: true, Message: "OK!", Data: nil}
	c.JSON(http.StatusOK, resp)
}
