#!/bin/bash

# Docker offline install script.
# Installed & verified by CentOS Linux release 7.3.1611 (Core)
# Docker version 1.12.6

set -x
set -e

HTTP_SERVER=""
MASTER_IP=""

root=$(id -u)
if [ "$root" -ne 0 ] ;then
    echo must run as root
    exit 1
fi

kube::install_docker()
{
    echo "KUBEKIT_OUTPUT (1/2) Start to install docker..."
    set +e

    # Install docker-compose
    which docker-compose > /dev/null 2>&1
    i=$?
    set -e
    if [ $i -ne 0 ]; then
        curl -L http://$HTTP_SERVER/rpms/docker-compose.tar.gz > /tmp/docker-compose.tar.gz 
        cd /tmp && tar zxvf docker-compose.tar.gz
        chmod +x docker-compose
        mv docker-compose /usr/local/bin/docker-compose
    fi

    # Install docker engine
    set +e
    which docker > /dev/null 2>&1
    j=$?
    set -e
    if [ $j -ne 0 ]; then
        curl -L http://$HTTP_SERVER/rpms/docker.tar.gz > /tmp/docker.tar.gz 
        tar zxf /tmp/docker.tar.gz -C /tmp
        yum localinstall -y /tmp/docker/*.rpm
        echo "KUBEKIT_OUTPUT (2/2) Start to config docker..."
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

    # Import orient CA cert.
    curl -L http://$HTTP_SERVER/certs/ca.crt > /etc/pki/ca-trust/source/anchors/kubekit.crt
    update-ca-trust

    # Import hosts item.
    echo ${MASTER_IP}" registry.orientsoft.cn" >> /etc/hosts

    echo DOCKER_STORAGE_OPTIONS=\" -s overlay --selinux-enabled=false\" > /etc/sysconfig/docker-storage
}

main()
{
    HTTP_SERVER=$1
    MASTER_IP=$(echo $HTTP_SERVER | cut -d ":" -f1)

    kube::install_docker
}

main $@
