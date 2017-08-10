package models

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
)

type NodeList struct {
	Nodes []Node `json:"nodes"`
}

type Node struct {
	Name      string `json:"name"`
	IP        string `json:"ip"`
	Port      int    `json:"port"`
	Password  string `json:"password"`
	CreatedAt string `json:"createdAt"`
	Status    int    `josn:"status"`
	Comment   string `json:"comment"`
}

func (n *NodeList) Serialize() error {
	bytes, err := json.Marshal(n)

	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	fmt.Println("Come here...")
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
