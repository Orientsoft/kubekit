package utils

import (
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
	"regexp"
	"strings"
	"syscall"

	"github.com/fatih/color"
)

func RunSetup(script string, ch chan int, args ...string) {
	//cmd := exec.Command("bash", "-s", script)
	cmd := exec.Command(script, args...)
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		log.Fatal(err)
	}

	defer stdout.Close()
	if err := cmd.Start(); err != nil {
		log.Fatal(err)
	}

	if strings.Contains(script, "master") {
		go saveLog(stdout, true)
	} else {
		go saveLog(stdout, false)
	}

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

func matchToken(buf []byte) {
	if strings.Contains(string(buf), "kubeadm join --token") {

		os.Remove("./k8s.token")

		re := regexp.MustCompile("kubeadm join --token [0-9a-z.]*")
		result := re.Find(buf)

		//Get the token string
		token := strings.Split(string(result), " ")[3]

		ioutil.WriteFile("./k8s.token", []byte(token), os.ModeAppend)
		color.Green("%sMaster token %s saved into .k8s.token file.", CheckSymbol)
	}
}

func saveLog(stdout io.ReadCloser, saveToken bool) {
	buf := make([]byte, 1024)

	fd, _ := os.OpenFile("install.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0644)

	defer fd.Close()

	for {
		var n int
		n, err := stdout.Read(buf)

		if err != nil {
			log.Println("End of output...")
			break
		}

		if saveToken {
			matchToken(buf)
		}

		fmt.Println(string(buf))
		fd.WriteString(string(buf[:n]))
	}
}

func SetupDocker() bool {
	color.Blue("Start to install docker engine...\r\n\r\n")
	ch := make(chan int)

	go RunSetup("./docker.sh", ch)
	if <-ch == 1 {
		color.Red("%sFailed to install docker engine...\r\n\r\n", CrossSymbol)
		return false
	}

	color.Green("%sDocker engine installed...\r\n\r\n", CheckSymbol)
	return true
}

func SetupMaster() bool {
	color.Blue("Start to initialize Kubernetes master node...\r\n\r\n")
	ch := make(chan int)

	go RunSetup("./master.sh", ch, "master")
	if <-ch == 1 {
		color.Red("%sFailed to initialize Kubernetes master node...\r\n\r\n", CrossSymbol)
		return false
	}

	color.Green("%sKubernetes master node initialized...\r\n\r\n", CheckSymbol)
	return true
}
