#!/bin/bash

# Harbor offline install script.
# Installed & verified by CentOS Linux release 7.3.1611 (Core)
# Docker version 1.12.6

set -x
set -e

HTTP_SERVER=“”

root=$(id -u)
if [ "$root" -ne 0 ] ;then
    echo must run as root
    exit 1
fi

kube::install_harbor()
{
    echo "KUBEKIT_OUTPUT (1/2) Start to install harbor..."
    set +e

    curl -L http://$HTTP_SERVER/rpms/harbor-offline-installer-v1.1.2.tgz > /root/harbor-offline-installer-v1.1.2.tgz
    cd /root && tar zxvf harbor-offline-installer-v1.1.2.tgz

    echo "KUBEKIT_OUTPUT (2/2) Start to config harbor..."
    kube::config_harbor

    echo Harbor has been installed!
    rm -rf /root/harbor-offline-installer-v1.1.2.tgz
}

kube::config_harbor()
{
    ##Download certs
    mkdir -p /data/cert

    curl -L http://$HTTP_SERVER/certs/server.crt > /data/cert/server.crt
    curl -L http://$HTTP_SERVER/certs/server-pem.key > /data/cert/server.key

    setenforce 0
    sed -i -e 's/reg.mydomain.com/registry.orientsoft.cn/g' /root/harbor/harbor.cfg
    sed -i -e 's/ui_url_protocol = http/ui_url_protocol = https/g' /root/harbor/harbor.cfg
    sed -i -e 's/db_password = root123/db_password = welcome1/g' /root/harbor/harbor.cfg
    sed -i -e 's/harbor_admin_password = Harbor12345/harbor_admin_password = welcome1/g' /root/harbor/harbor.cfg
    echo 'crt_country = CN' >> /root/harbor/harbor.cfg
    echo 'crt_state = SiChuan' >> /root/harbor/harbor.cfg
    echo 'crt_location = ChengDu' >> /root/harbor/harbor.cfg
    echo 'crt_organization = Orient' >> /root/harbor/harbor.cfg
    echo 'crt_organizationalunit = Orient' >> /root/harbor/harbor.cfg
    echo 'crt_commonname = registry.orientsoft.cn' >> /root/harbor/harbor.cfg
    echo 'crt_email = info@orientsoft.cn' >> /root/harbor/harbor.cfg

    cd /root/harbor
    ./install.sh
}

main()
{
    HTTP_SERVER=$1
    kube::install_harbor
}

main $@
