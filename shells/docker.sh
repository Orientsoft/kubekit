#!/bin/bash

# Docker offline install script.
# Installed & verified by CentOS Linux release 7.3.1611 (Core)
# Docker version 1.12.6

set -x
set -e

HTTP_SERVER=192.168.0.104:8000
KUBE_REPO_PREFIX=gcr.io/google_containers

root=$(id -u)
if [ "$root" -ne 0 ] ;then
    echo must run as root
    exit 1
fi

kube::install_docker()
{
    set +e
    which docker > /dev/null 2>&1
    i=$?
    set -e
    if [ $i -ne 0 ]; then
        cp ./rpms/docker.tar.gz /tmp/docker.tar.gz 
        tar zxf /tmp/docker.tar.gz -C /tmp
        yum localinstall -y /tmp/docker/*.rpm
        kube::config_docker
    fi
    systemctl enable docker.service && systemctl start docker.service
    echo docker has been installed!
    docker version
    rm -rf /tmp/docker /tmp/docker.tar.gz
}

kube::config_docker()
{
    setenforce 0
    sed -i -e 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config

    #sysctl -w net.bridge.bridge-nf-call-iptables=1
    #sysctl -w net.bridge.bridge-nf-call-ip6tables=1
    # /etc/sysctl.conf 
    # net.bridge.bridge-nf-call-ip6tables = 1
    # net.bridge.bridge-nf-call-iptables = 1
    systemctl disable firewalld
    systemctl stop firewalld

    echo DOCKER_STORAGE_OPTIONS=\" -s overlay --selinux-enabled=false\" > /etc/sysconfig/docker-storage
    systemctl daemon-reload && systemctl restart docker.service
}

main()
{
    kube::install_docker
}

main $@
