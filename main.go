package main

import (
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
			Name:    "init",
			Aliases: []string{"i"},
			Usage:   "Initialize current server with Docker engine & Kubernetes master.",
			Action: func(c *cli.Context) error {
				if !utils.SetupDocker() {
					color.Red("%sProgram terminated...")
					os.Exit(1)
				}

				if utils.SetupMaster() {
					//TODO: Launch toolkit server
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
