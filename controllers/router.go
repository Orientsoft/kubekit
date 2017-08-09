package controllers

import (
	"github.com/fatih/color"
	"github.com/gin-gonic/gin"
)

type MainRouter struct {
	router *gin.Engine
}

func (self *MainRouter) Initialize(r *gin.Engine) {

	self.router = r
	self.router.GET("/", self.IndexHandler)

	color.Green("\r\n%sToolkit server is listening at: 0.0.0.0:9000")
	self.router.Run(":9000")
}
