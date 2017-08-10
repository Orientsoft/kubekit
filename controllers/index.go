package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (router *MainRouter) IndexHandler(c *gin.Context) {
	fmt.Println("output:", router.nodeList.Nodes)
	c.HTML(http.StatusOK, "index.html", gin.H{
		"Nodes": router.nodeList.Nodes,
	})
}
