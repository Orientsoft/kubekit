#!/bin/bash

# K8S master offline install script.
# Installed & verified by CentOS Linux release 7.4.1708 (Core)
# Docker version 1.12.6

set -x
set -e

HTTP_SERVER=""
KUBE_REPO_PREFIX=gcr.io/google_containers

root=$(id -u)
if [ "$root" -ne 0 ] ;then
    echo must run as root
    exit 1
fi

kube::load_images()
{
    mkdir -p /tmp/k8s
    
    master_images=(
        kube-apiserver-amd64_v1.8.2
        kube-controller-manager-amd64_v1.8.2
        kube-scheduler-amd64_v1.8.2
        kube-proxy-amd64_v1.8.2
        pause-amd64_3.0
        k8s-dns-dnsmasq-nanny-amd64_1.14.5
        k8s-dns-kube-dns-amd64_1.14.5
        k8s-dns-sidecar-amd64_1.14.5
        etcd-amd64_3.0.17
        flannel-amd64_v0.9.0
        kubernetes-dashboard-amd64_v1.7.1
    )

    node_images=(
        pause-amd64_3.0
        kube-proxy-amd64_v1.8.2
        flannel-amd64_v0.9.0
        kubernetes-dashboard-amd64_v1.7.1
    )

    if [ $1 == "master" ]; then
        # 判断镜像是否存在，不存在才会去load
        for i in "${!master_images[@]}"; do 
            ret=$(docker images | awk 'NR!=1{print $1"_"$2}'| grep $KUBE_REPO_PREFIX/${master_images[$i]} | wc -l)
            if [ $ret -lt 1 ];then
                curl -L http://$HTTP_SERVER/images/${master_images[$i]}.tar > /tmp/k8s/${master_images[$i]}.tar
                docker load < /tmp/k8s/${master_images[$i]}.tar
            fi
        done
    else
        for i in "${!node_images[@]}"; do 
            ret=$(docker images | awk 'NR!=1{print $1"_"$2}' | grep $KUBE_REPO_PREFIX/${node_images[$i]} |  wc -l)
            if [ $ret -lt 1 ];then
                curl -L http://$HTTP_SERVER/images/${node_images[$i]}.tar > /tmp/k8s/${node_images[$i]}.tar
                docker load < /tmp/k8s/${node_images[$i]}.tar
            fi
        done
    fi
    rm /tmp/k8s* -rf 
}

kube::install_bin()
{
    set +e
    which kubeadm > /dev/null 2>&1
    i=$?
    set -e
    if [ $i -ne 0 ]; then
        curl -L http://$HTTP_SERVER/rpms/k8s.tar.gz > /tmp/k8s.tar.gz
        tar zxf /tmp/k8s.tar.gz -C /tmp
        yum localinstall -y  /tmp/k8s/*.rpm
        rm -rf /tmp/k8s*

        # Disable swap checking for K8S 1.8
        sed -i '9iEnvironment="KUBELET_EXTRA_ARGS=--fail-swap-on=false"' /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
        # Enable and start kubelet service
        systemctl enable kubelet.service && systemctl start kubelet.service && rm -rf /etc/kubernetes
    fi
}

kube::config_firewalld()
{
    systemctl disable firewalld && systemctl stop firewalld
    # iptables -A IN_public_allow -p tcp -m tcp --dport 9898 -m conntrack --ctstate NEW -j ACCEPT
    # iptables -A IN_public_allow -p tcp -m tcp --dport 6443 -m conntrack --ctstate NEW -j ACCEPT
    # iptables -A IN_public_allow -p tcp -m tcp --dport 10250 -m conntrack --ctstate NEW -j ACCEPT
}

kube::master_up()
{
    echo "KUBEKIT_OUTPUT (1/6) Start to load images for Kubernetes master..."
    kube::load_images master

    echo "KUBEKIT_OUTPUT (2/6) Start to install components for Kubernetes master..."
    kube::install_bin

    echo "KUBEKIT_OUTPUT (3/6) Start to configure firewall..."
    kube::config_firewalld

    # kubeadm需要联网去找最新版本
    echo $HTTP_SERVER storage.googleapis.com >> /etc/hosts

    echo "KUBEKIT_OUTPUT (4/6) Start to initialize Kubernetes master..."
    # 这里一定要带上--pod-network-cidr参数，不然后面的flannel网络会出问题
    export KUBE_ETCD_IMAGE=gcr.io/google_containers/etcd-amd64:3.0.17
    kubeadm init --kubernetes-version=v1.8.1 --pod-network-cidr=10.96.0.0/12

    # 使能master，可以被调度到
    # kubectl taint nodes --all dedicated-

    export KUBECONFIG=/etc/kubernetes/admin.conf

    echo "KUBEKIT_OUTPUT (5/6) Start to config Kubernetes network..."
    # install flannel network
    kubectl apply -f http://$HTTP_SERVER/network/kube-flannel-rbac.yml
    kubectl apply -f http://$HTTP_SERVER/network/kube-flannel.yml --namespace=kube-system

    #install dashboard
    echo "KUBEKIT_OUTPUT (6/6) Start to install Kubernetes dashboard..."
    kubectl create -f http://$HTTP_SERVER/network/kubernetes-dashboard.yml

    # show pods
    kubectl get po --all-namespaces

    # show tokens
    kubeadm token list

    echo "export KUBECONFIG=/etc/kubernetes/admin.conf" >> ~/.bashrc
    echo "Please reload ~/.bashrc to use kubectl command!"
    echo "K8S master install finished!"
}

main()
{
    HTTP_SERVER=$1
    kube::master_up
}

main $@
