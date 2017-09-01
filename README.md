```text
 ___  __    ___  ___  ________  _______   ___  __    ___  _________   
|\  \|\  \ |\  \|\  \|\   __  \|\  ___ \ |\  \|\  \ |\  \|\___   ___\ 
\ \  \/  /|\ \  \\\  \ \  \|\ /\ \   __/|\ \  \/  /|\ \  \|___ \  \_| 
 \ \   ___  \ \  \\\  \ \   __  \ \  \_|/_\ \   ___  \ \  \   \ \  \  
  \ \  \\ \  \ \  \\\  \ \  \|\  \ \  \_|\ \ \  \\ \  \ \  \   \ \  \ 
   \ \__\\ \__\ \_______\ \_______\ \_______\ \__\\ \__\ \__\   \ \__\
    \|__| \|__|\|_______|\|_______|\|_______|\|__| \|__|\|__|    \|__|
```
A Kubernetes deployment toolkit for offline environment.
---

[![Go][1]][2] [![Kubernetes][3]][4] [![Release][5]][6]

[1]: https://img.shields.io/badge/go-v1.8.3-green.svg
[2]: https://golang.org
[3]: https://img.shields.io/badge/kubernetes-v1.7.2-brightgreen.svg
[4]: https://kubernetes.io/
[5]: https://img.shields.io/badge/release-v0.1-blue.svg
[6]: https://github.com/Orientsoft/kubekit/releases

- [About](#about)
- [Highlights](#highlights)
- [Supported OS](#supported-os)
- [Quick Start](#quick-start)
- [User Manual](#user-manual)
- [CLI Commands](#cli-commands)
- [Web UI Portal](#web-ui-portal)
- [License](#license)

# About

Kubekit is a deployment toolkit, it provides offline installation solution for kubernetes. You can use it for deploying Kubernetes to **OFFLINE** production environment.

The Kubekit will install
* Docker (1.12.6)
* Kubernetes V1.7.2 and all its components
* Kubernetes dashboard, with default node port:**31234**

# Highlights

* Easy to bring up Kubernetes master by only one CLI command
* Ease of use through Web UI portal
* Manage and initialize multiple nodes with "one-click"

# Supported OS

* CentOS release 7.3.1611 (**Already tested & verified**)
* Ubuntu 16.04 LTS (Planned to support)

# Quick Start

1. Download latest release of kubekit from [GitHub](https://github.com/Orientsoft/kubekit/releases) it, extract it to ```./kubekit/```

2. Download all the offline package from [百度网盘](https://pan.baidu.com/s/1kULhxzx) with password ```531v``` and with patience...

3. Extract all the offline packages to ```./kubekit/packages```

4. COPY ./kubekit to a node which is selected to be Kubernetes master.

5. Login to that node, initialize it with Kubernetes master by its IP:
    ```bash
    ./kubekit init 192.168.0.100
    ```
6. Take a cup of coffee and wait until master node is ready. And also, a Web UI portal will be available with default port: 9000.

7. Access the Web UI Portal with ```http://MASTER_IP:9000``` and initialize other Kubernetes worker nodes through it.

8. __Don't forget to reload bash settings before using kubectl: ```source ~/.bashrc```__

# User Manual

For detailed usage, please refer to [《Kubekit安装与使用手册》](https://github.com/Orientsoft/kubekit/wiki/Kubekit-%E5%AE%89%E8%A3%85%E4%B8%8E%E4%BD%BF%E7%94%A8%E6%89%8B%E5%86%8C)

# CLI Commands

## Basic Usage

```
→ ./kubekit h                                                                  

NAME:
   KubeKit - A toolkit for Kubernetes & apps offline deployment.

USAGE:
   kubekit [global options] command [command options] [arguments...]

VERSION:
   0.1.0

COMMANDS:
     init, i    Initialize current server with Docker engine & Kubernetes master.
     server, s  Start kubekit file server & toolkit server.
     help, h    Shows a list of commands or help for one command

GLOBAL OPTIONS:
   --help, -h     show help
   --version, -v  print the version
```

## Customized listening ports

By default, kubekit will use port ```8000``` for file server and port ```9000``` for toolkit server, if they are conflicted with any running program, you can start kubekit with specified port.

```bash
USAGE:
   kubekit server FILE_SERVER_PORT TOOLKIT_SERVER_PORT
```

Get more help via:

```bash
./kubekit server -h   
```

# Web UI Portal

With Web UI Portal, you can manage all the Kubernetes worker nodes and initialize them, join them to Kubernetes cluster with "one-click".

![](https://raw.githubusercontent.com/Orientsoft/kubekit/master/snapshots/1.png)

# License
[MIT License](https://github.com/Orientsoft/kubekit/blob/master/LICENSE)
