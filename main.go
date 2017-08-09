package main

import (
	"context"
	"fmt"
	"kubekit/utils"
	"os"

	"github.com/fatih/color"

	cli "gopkg.in/urfave/cli.v1"
)

func initialize() {
	//Remove the install log file
	os.Remove("install.log")
	utils.DisplayLogo()
}

func main() {
	initialize()

	app := cli.NewApp()
	app.Name = "KubeKit"
	app.Usage = "A kubernetes toolkit for offline deploying K8S & apps."
	app.Version = "0.1.0"
	app.Action = func(c *cli.Context) error {
		return nil
	}

	app.Commands = []cli.Command{
		{
			Name:      "init",
			Aliases:   []string{"i"},
			Usage:     "Initialize current server with Docker engine & Kubernetes master.",
			ArgsUsage: "[Kubernetes master IP]",
			Action: func(c *cli.Context) error {

				masterIP := c.Args().Get(0)

				if masterIP == "" {
					color.Red("Please run kubekit with master IP: kubekit i MASTER_IP")
					os.Exit(0)
				}

				color.Blue("Initialization process started, with kubernetes master IP: %s\r\n", masterIP)
				utils.SaveMasterIP(masterIP)

				srv := utils.StartServer()
				defer srv.Shutdown(context.Background())

				if !utils.SetupDocker() {
					color.Red("%sProgram terminated...")
					os.Exit(1)
				}

				if utils.SetupMaster() {
					// Launch toolkit server
					utils.StartToolkitServer()
				}

				return nil
			},
		},
		{
			Name:    "server",
			Aliases: []string{"s"},
			Usage:   "Start kubekit toolkit server.",
			Action: func(c *cli.Context) error {
				fmt.Println("Server is starting...")
				return nil
			},
		},
	}

	app.Run(os.Args)
}
