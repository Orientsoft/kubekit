package utils

import (
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/exec"
	"regexp"
	"strconv"
	"strings"
	"syscall"

	"github.com/fatih/color"
)

var (
	srv *http.Server
)

func StartServer(filePort string) *http.Server {
	srv = &http.Server{Addr: filePort}
	http.Handle("/", http.FileServer(http.Dir("./package")))
	color.Green(fmt.Sprintf("\r\n%sHTTP file server listening at: 0.0.0.0%s\r\n\r\n", CheckSymbol, filePort))

	go func() {
		if err := srv.ListenAndServe(); err != nil {
			// cannot panic, because this probably is an intentional close
			log.Printf("Httpserver: ListenAndServe() error: %s", err)
		}
	}()

	return srv
}

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
		re := regexp.MustCompile("kubeadm join --token [0-9a-z.]*")
		result := re.Find(buf)

		//Get the token string
		token := strings.Split(string(result), " ")[3]
		ioutil.WriteFile("./.k8s-token", []byte(token), os.FileMode(0644))
		color.Green("%sMaster token %s saved into .k8s.token file.", CheckSymbol, token)
	}
}

func outputProgress(buf []byte) {
	re := regexp.MustCompile("KUBEKIT_OUTPUT.*.")
	results := re.FindAll(buf, -1)

	if results != nil {
		for _, r := range results {
			//Get the token string
			output := strings.Replace(string(r), "KUBEKIT_OUTPUT ", "", 1)
			color.Blue(output)
		}
	}
}

func SaveMasterIP(masterIP string) {
	ioutil.WriteFile("./.master-ip", []byte(masterIP), os.FileMode(0644))
}

func GetMasterIP() string {
	content, err := ioutil.ReadFile("./.master-ip")

	if err != nil {
		return ""
	}

	return strings.Replace(string(content), "\n", "", -1)
}

func GetToken() string {
	content, err := ioutil.ReadFile("./.k8s-token")

	if err != nil {
		return ""
	}

	return strings.Replace(string(content), "\n", "", -1)
}

func IsValidPort(port string) bool {
	_, err := strconv.Atoi(port)

	if err != nil {
		return false
	}

	return true
}

func saveLog(stdout io.ReadCloser, saveToken bool) {

	fd, _ := os.OpenFile("install.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0644)

	defer fd.Close()

	for {
		var n int
		buf := make([]byte, 1024)
		n, err := stdout.Read(buf)

		if err != nil {
			//End of output
			break
		}

		//Output the install progress
		if strings.Contains(string(buf), "KUBEKIT_OUTPUT") {
			outputProgress(buf)
		}

		if saveToken {
			matchToken(buf)
		}

		fd.WriteString(string(buf[:n]))
	}
}

func SetupDocker(masterAddr string) bool {
	color.Blue("Start to install docker engine...\r\n")
	ch := make(chan int)

	go RunSetup("./package/docker.sh", ch, masterAddr)
	if <-ch == 1 {
		color.Red("\r\n%sFailed to install docker engine...\r\n\r\n", CrossSymbol)
		return false
	}

	color.Green("\r\n%sDocker engine installed...\r\n\r\n", CheckSymbol)
	return true
}

func SetupHarbor(masterAddr string) bool {
	color.Blue("Start to install harbor...\r\n")
	ch := make(chan int)

	go RunSetup("./package/harbor.sh", ch, masterAddr)
	if <-ch == 1 {
		color.Red("\r\n%sFailed to install harbor...\r\n\r\n", CrossSymbol)
		return false
	}

	color.Green("\r\n%sHarbor installed...\r\n\r\n", CheckSymbol)
	return true
}

func SetupMaster(masterAddr string) bool {
	color.Blue("Start to initialize Kubernetes master node...\r\n\r\n")
	ch := make(chan int)

	go RunSetup("./package/master.sh", ch, masterAddr)
	if <-ch == 1 {
		color.Red("\r\n%sFailed to initialize Kubernetes master node...\r\n\r\n", CrossSymbol)
		return false
	}

	color.Green("\r\n%sKubernetes master node initialized...\r\n\r\n", CheckSymbol)
	color.Blue("Remember to reload shell with: source ~/.bashrc before using kubectl!\r\n")
	return true
}
