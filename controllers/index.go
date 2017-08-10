package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (router *MainRouter) IndexHandler(c *gin.Context) {
	c.HTML(http.StatusOK, "index.html", nil)
}

func (router *MainRouter) ListNodesHandler(c *gin.Context) {
	c.JSON(http.StatusOK, router.nodeList)
}
