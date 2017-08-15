package controllers

import (
	"kubekit/models"
	"kubekit/utils"

	"github.com/fatih/color"
	"github.com/gin-gonic/gin"
)

type MainRouter struct {
	router   *gin.Engine
	nodeList *models.NodeList
	nodeMap  map[string]*models.Node
}

func StartToolkitServer() {
	r := gin.Default()

	r.Static("/assets", "./assets")
	r.LoadHTMLGlob("templates/*")

	mainRouter := &MainRouter{}
	mainRouter.Initialize(r)
}

func (self *MainRouter) Initialize(r *gin.Engine) {

	//Initialize node list
	self.nodeList = new(models.NodeList)
	if err := self.nodeList.Deserialize(); err != nil {
		self.nodeList.Nodes = []models.Node{}
	}

	//Initialize node map
	self.nodeMap = map[string]*models.Node{}
	for i := 0; i < len(self.nodeList.Nodes); i++ {
		self.nodeMap[self.nodeList.Nodes[i].ID] = &self.nodeList.Nodes[i]
	}

	self.router = r
	self.router.GET("/", self.IndexHandler)

	//self.router.GET("/ws", )

	//Node operations
	self.router.GET("/node/list", self.ListNodesHandler)
	self.router.POST("/node", self.CreateNodeHandler)
	self.router.PUT("/node/remove/:id", self.RemoveNodeHandler)
	self.router.GET("/node/refresh/:id", self.RefreshNodeHandler)

	//Installation operations
	self.router.POST("/install", self.InstallNodeHandler)
	self.router.GET("/install/progress/:id/:step", self.NodeProgressHandler)

	color.Green("\r\n%sToolkit server is listening at: 0.0.0.0:9000", utils.CheckSymbol)
	self.router.Run(":9000")
}
