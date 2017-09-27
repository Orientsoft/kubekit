package utils

import (
	"fmt"
	"io/ioutil"
	"net"
	"os"
	"time"

	"github.com/Orientsoft/kubekit/models"

	"golang.org/x/crypto/ssh"
)

func GetInstallLog(node *models.Node) string {
	session, err := Connect("root", node.Password, node.IP, node.Port)

	if err != nil {
		fmt.Println("err:", err.Error())
		fmt.Println("Cannot connect node:", node.IP)
	}

	defer session.Close()
	pipe, err := session.StdoutPipe()

	if err != nil {
		return err.Error()
	}

	session.Run("cat /root/install.log")
	buff, err := ioutil.ReadAll(pipe)

	if err != nil {
		return err.Error()
	}

	return string(buff)
}

func ExecuteCmd(node *models.Node, cmd string) {
	session, err := Connect("root", node.Password, node.IP, node.Port)

	if err != nil {
		fmt.Println("err:", err.Error())
		fmt.Println("Cannot connect node:", node.IP)
	}

	defer session.Close()
	session.Stderr = os.Stderr
	session.Stdout = os.Stdout

	fmt.Println("GOROUTINE:", cmd)
	session.Run(cmd)
	//session.Run("curl -L http://192.168.0.80:8000/test.sh | bash -s master>install.log  2>&1 &")
}

func Connect(user, password, host string, port int) (*ssh.Session, error) {
	var (
		auth         []ssh.AuthMethod
		addr         string
		clientConfig *ssh.ClientConfig
		client       *ssh.Client
		session      *ssh.Session
		err          error
	)
	// get auth method
	auth = make([]ssh.AuthMethod, 0)
	auth = append(auth, ssh.Password(password))

	clientConfig = &ssh.ClientConfig{
		User:    user,
		Auth:    auth,
		Timeout: 30 * time.Second,
		HostKeyCallback: func(hostname string, remote net.Addr, key ssh.PublicKey) error {
			return nil
		},
	}

	// connet to ssh
	addr = fmt.Sprintf("%s:%d", host, port)

	if client, err = ssh.Dial("tcp", addr, clientConfig); err != nil {
		return nil, err
	}

	// create session
	if session, err = client.NewSession(); err != nil {
		return nil, err
	}

	return session, nil
}
