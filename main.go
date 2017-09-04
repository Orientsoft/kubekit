package main

import (
	"context"
	"os"

	"github.com/Orientsoft/kubekit/utils"

	"github.com/Orientsoft/kubekit/controllers"

	"github.com/fatih/color"

	cli "gopkg.in/urfave/cli.v1"
)

const (
	FilePort = iota
	ToolkitPort
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
	app.Usage = "A toolkit for Kubernetes & apps offline deployment."
	app.Version = "0.1.0"
	app.Action = func(c *cli.Context) error {
		return nil
	}

	app.Commands = []cli.Command{
		{
			Name:      "init",
			Aliases:   []string{"i"},
			Usage:     "Initialize current server with Docker engine & Kubernetes master.",
			ArgsUsage: "K8S_MASTER_IP FILE_SERVER_PORT TOOLKIT_SERVER_PORT",
			Action: func(c *cli.Context) error {

				masterIP := c.Args().Get(0)

				if masterIP == "" {
					color.Red("Please run kubekit with master IP: kubekit i K8S_MASTER_IP")
					os.Exit(0)
				}

				color.Blue("Initialization process started, with kubernetes master IP: %s\r\n", masterIP)
				utils.SaveMasterIP(masterIP)

				filePort := getServerPort(c, FilePort, 1)
				toolkitPort := getServerPort(c, ToolkitPort, 2)

				masterAddr := masterIP + filePort

				srv := utils.StartServer(filePort)
				defer srv.Shutdown(context.Background())

				if !utils.SetupDocker(masterAddr) {
					color.Red("%sProgram terminated...", utils.CrossSymbol)
					os.Exit(1)
				}

				if utils.SetupMaster(masterAddr) {
					// Launch toolkit server
					controllers.StartToolkitServer(filePort, toolkitPort)
				}

				return nil
			},
		},
		{
			Name:      "server",
			Aliases:   []string{"s"},
			Usage:     "Start kubekit file server & toolkit server.",
			ArgsUsage: "FILE_SERVER_PORT TOOLKIT_SERVER_PORT",
			Action: func(c *cli.Context) error {
				filePort := getServerPort(c, FilePort, 0)
				toolkitPort := getServerPort(c, ToolkitPort, 1)

				srv := utils.StartServer(filePort)
				defer srv.Shutdown(context.Background())
				// Launch toolkit server only
				controllers.StartToolkitServer(filePort, toolkitPort)
				return nil
			},
		},
	}

	app.Run(os.Args)
}

// getServerPort parse and get server port by port type and argument position
// portType:  1.File server 2.Toolkit server
func getServerPort(c *cli.Context, portType, argPos int) string {
	var port string

	if len(c.Args().Get(argPos)) > 0 {
		if utils.IsValidPort(c.Args().Get(argPos)) {
			port = ":" + c.Args().Get(argPos)
		} else {
			if portType == FilePort {
				color.Red("%sPlease input a valid file server port!", utils.CrossSymbol)
			} else if portType == ToolkitPort {
				color.Red("%sPlease input a valid toolkit server port!", utils.CrossSymbol)
			}
			os.Exit(1)
		}
	} else {
		if portType == FilePort {
			port = ":8000"
		} else if portType == ToolkitPort {
			port = ":9000"
		}
	}

	return port
}
