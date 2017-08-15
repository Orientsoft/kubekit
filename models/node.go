package models

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"sync"
)

var (
	mux sync.Mutex
)

type NodeList struct {
	Nodes []Node `json:"nodes"`
}

type Node struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	IP        string `json:"ip"`
	Port      int    `json:"port"`
	Password  string `json:"password"`
	CreatedAt string `json:"createdAt"`
	Status    int    `json:"status"` // 0:待部署, 1:部署中, 2:已部署成功, 3:无法连接, 4:部署失败
	Comment   string `json:"comment"`
}

func (n *NodeList) Remove(index int) []Node {
	newNodes := []Node{}
	newNodes = append(n.Nodes[:index], n.Nodes[index+1:]...)

	return newNodes
}

func (n *NodeList) UpdateNodeStatus(id, comment string, status int) {
	mux.Lock()
	defer mux.Unlock()

	//Update node list
	for i := 0; i < len(n.Nodes); i++ {
		if n.Nodes[i].ID == id {
			n.Nodes[i].Comment = comment
			n.Nodes[i].Status = status
		}
	}

	//Serialize nodes
	n.Serialize()
}

func (n *NodeList) Serialize() error {
	bytes, err := json.Marshal(n)

	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	ioutil.WriteFile("./.nodes", bytes, os.FileMode(0644))
	return nil
}

func (nl *NodeList) Deserialize() error {
	raw, err := ioutil.ReadFile("./.nodes")

	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	json.Unmarshal(raw, nl)
	return nil
}
