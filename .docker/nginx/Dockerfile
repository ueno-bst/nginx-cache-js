FROM almalinux:8

RUN curl -o /etc/yum.repos.d/nginx-mainline-module.repo -LO https://ueno-bst.github.io/nginx-mainline/nginx-mainline-module.repo

RUN yum update -y \
    && yum install -y epel-release libmaxminddb gd \
    && yum install -y --disablerepo=appstream \
      nginx \
      nginx-module-brotli \
      nginx-module-cache-purge \
      nginx-module-echo \
      nginx-module-geoip \
      nginx-module-geoip2 \
      nginx-module-headers-more \
      nginx-module-image-filter \
      nginx-module-ndk \
      nginx-module-njs \
      nginx-module-perl \
      nginx-module-lua \
      nginx-module-redis \
      nginx-module-redis2 \
      nginx-module-set-misc \
      nginx-module-srcache \
      nginx-module-vts \
      nginx-module-xslt \
    && yum clean all

RUN mkdir -p /var/log/nginx \
    && ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

EXPOSE 80

STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]
