package utils

import (
	"fmt"
	"io"
	"log"
	"os"
	"os/exec"
	"syscall"

	"github.com/fatih/color"
)

func RunSetup(script string, ch chan int, args ...string) {
	//cmd := exec.Command("bash", "-s", script)
	cmd := exec.Command("script", args...)
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

func SetupDocker() error {
	ch := make(chan int)

	go RunSetup("./docker.sh", ch)
	if <-ch == 1 {
		color.Red("%sFailed to install docker engine...", CrossSymbol)
		os.Exit(1)
	}

	color.Green("%sDocker engine installed...", CheckSymbol)

	return nil
}
