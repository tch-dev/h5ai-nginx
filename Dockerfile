FROM nginx:latest
MAINTAINER Valentin DEVILLE <contact@valentin-deville.eu>

ENV DEBIAN_FRONTEND=noninteractive

COPY h5ai-0.29.2+042~d81d8a9.zip /tmp/h5ai.zip

RUN apt update && \
	apt install -y --no-install-recommends php-fpm apache2-utils wget ca-certificates unzip && \
	mkdir /repository && \
	unzip /tmp/h5ai.zip -d /h5ai && \
	chown -R www-data: /h5ai/ && \
	rm -f /etc/nginx/conf.d/* /tmp/* && \
	usermod -aG www-data nginx

# Fix data location
COPY class-setup.php /h5ai/_h5ai/private/php/core/class-setup.php

# Create nginx configuration
COPY h5ai-nginx.conf /etc/nginx/conf.d/h5ai-nginx.conf

# Copy entrypoint
COPY entrypoint.sh /root/entrypoint.sh
RUN chmod +x /root/entrypoint.sh

RUN apt install curl -y 

COPY options.json /h5ai/_h5ai/private/conf/options.json
COPY types.json /h5ai/_h5ai/private/conf/types.json 

VOLUME /h5ai

CMD ["bash", "/root/entrypoint.sh"] 
