#!/bin/bash

# K8S offline install script.
# Installed & verified by CentOS Linux release 7.3.1611 (Core)

# Step 1
# Start python simple http server first!!!
# python -m SimpleHTTPServer
# Serving HTTP on 0.0.0.0 port 8000 ...

# Step 2
# Run script with parameters

# Server side:
# curl -L http://192.168.0.104:8000/install.sh | bash -s master

# Client side:
# curl -L http://192.168.0.104:8000/install.sh |  bash -s join --token=6669b1.81f129bc847154f9 192.168.0.104:6443

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
        curl -L http://$HTTP_SERVER/rpms/docker.tar.gz > /tmp/docker.tar.gz 
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

kube::load_images()
{
    mkdir -p /tmp/k8s
    
    master_images=(
        kube-apiserver-amd64_v1.7.2
        kube-controller-manager-amd64_v1.7.2
        kube-scheduler-amd64_v1.7.2
        kube-proxy-amd64_v1.7.2
        pause-amd64_3.0
        k8s-dns-dnsmasq-nanny-amd64_1.14.4
        k8s-dns-kube-dns-amd64_1.14.4
        k8s-dns-sidecar-amd64_1.14.4
        etcd_v3.0.17
        flannel-amd64_v0.8.0
        kubernetes-dashboard-amd64_1.6.3
    )

    node_images=(
        pause-amd64_3.0
        kube-proxy-amd64_v1.7.2
        flannel-amd64_v0.8.0
        kubernetes-dashboard-amd64_1.6.3
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

        # Change cgroup-driver for kubelet
        sed -i -e 's/cgroup-driver=systemd/cgroup-driver=cgroupfs/g' /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
        #sed -i -e 's/$KUBELET_NETWORK_ARGS//g' /etc/systemd/system/kubelet.service.d/10-kubeadm.conf

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

kube::wati_manifests(){
    while [[ ! -f /etc/kubernetes/manifests/kube-scheduler.json ]]; do
        sleep 2
    done
}

kube::config_manifests()
{
    cd /etc/kubernetes/manifests
    for file in `ls`
    do
        sed -i '/image/a\        \"imagePullPolicy\": \"IfNotPresent\",' $file
    done
}

kube::wait_apiserver()
{
    ret=1
    while [[ $ret != 0 ]]; do
        sleep 2
        curl -k https://127.0.0.1:6443 2>&1>/dev/null
        ret=$?
    done
}

kube::master_up()
{
    kube::install_docker

    kube::load_images master

    kube::install_bin

    kube::config_firewalld

    # kubeadm需要联网去找最新版本
    echo $HTTP_SERVER storage.googleapis.com >> /etc/hosts

    # 这里一定要带上--pod-network-cidr参数，不然后面的flannel网络会出问题
    export KUBE_ETCD_IMAGE=gcr.io/google_containers/etcd-amd64:3.0.17
    kubeadm init --kubernetes-version=v1.7.2 --pod-network-cidr=10.96.0.0/12

    # 使能master，可以被调度到
    # kubectl taint nodes --all dedicated-

    export KUBECONFIG=/etc/kubernetes/admin.conf

    # install flannel network
    kubectl apply -f http://$HTTP_SERVER/network/kube-flannel-rbac.yml
    kubectl apply -f http://$HTTP_SERVER/network/kube-flannel.yml --namespace=kube-system

    #install dashboard
    kubectl create -f http://$HTTP_SERVER/network/kubernetes-dashboard.yml

    # show pods
    kubectl get po --all-namespaces

    # show tokens
    kubeadm token list

    echo "export KUBECONFIG=/etc/kubernetes/admin.conf" >> ~/.bashrc
    echo "Please reload ~/.bashrc to use kubectl command!"
    echo "K8S master install finished!"
}

kube::node_up()
{
    kube::install_docker

    kube::load_images minion

    kube::install_bin

    kube::config_firewalld

    kubeadm join --skip-preflight-checks $@
}

kube::tear_down()
{
    systemctl stop kubelet.service
    docker ps -aq|xargs -I '{}' docker stop {}
    docker ps -aq|xargs -I '{}' docker rm {}
    df |grep /var/lib/kubelet|awk '{ print $6 }'|xargs -I '{}' umount {}
    rm -rf /var/lib/kubelet && rm -rf /etc/kubernetes/ && rm -rf /var/lib/etcd
    yum remove -y kubectl kubeadm kubelet kubernetes-cni
    rm -rf /var/lib/cni
    ip link del cni0
}

main()
{
    case $1 in
    "m" | "master" )
        kube::master_up
        ;;
    "j" | "join" )
        shift
        kube::node_up $@
        ;;
    "d" | "down" )
        kube::tear_down
        ;;
    *)
        echo "usage: $0 m[master] | j[join] token | d[down] "
        echo "       $0 master to setup master "
        echo "       $0 join   to join master with token "
        echo "       $0 down   to tear all down ,inlude all data! so becarefull"
        echo "       unkown command $0 $@"
        ;;
    esac
}

main $@
