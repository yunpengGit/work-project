FROM nginx:1.18.0

MAINTAINER dzt

RUN rm /etc/nginx/conf.d/default.conf

ADD nginx.default.conf /etc/nginx/conf.d/default.conf

COPY dist/ /usr/share/nginx/html/

RUN chmod -R 777 /usr/share/nginx