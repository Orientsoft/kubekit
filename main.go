package main

import (
	"fmt"
	"io"
	"kubekit/utils"
	"log"
	"os"
	"os/exec"
	"syscall"

	cli "gopkg.in/urfave/cli.v1"

	"github.com/fatih/color"
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
				fmt.Println("Initializing...")
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

	ch := make(chan int)
	go setup(ch)

	if <-ch == 1 {
		color.Red("%sFailed to install docker engine...", utils.CrossSymbol)
		os.Exit(1)
	}

	color.Green("%sDocker engine installed...", utils.CheckSymbol)
}

func setup(ch chan int) {
	cmd := exec.Command("./install.sh")
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		log.Fatal(err)
	}

	defer stdout.Close()
	if err := cmd.Start(); err != nil {
		log.Fatal(err)
	}

	go saveLog(stdout)

	if err := cmd.Wait(); err != nil {
		if exiterr, ok := err.(*exec.ExitError); ok {
			// The program has exited with an exit code != 0
			if status, ok := exiterr.Sys().(syscall.WaitStatus); ok {
				log.Printf("Exit Status: %d", status.ExitStatus())
			}
		} else {
			log.Fatalf("cmd.Wait: %v", err)
		}
		ch <- 1
	} else {
		ch <- 0
	}
}

func saveLog(stdout io.ReadCloser) {
	buf := make([]byte, 1024)

	fd, _ := os.OpenFile("install.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0644)

	defer fd.Close()

	for {
		var n int
		n, err := stdout.Read(buf)

		if err != nil {
			fmt.Println("End of output...")
			break
		}

		fmt.Println(string(buf))
		fd.WriteString(string(buf[:n]))
	}
}
