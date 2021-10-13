FROM node:14-alpine
RUN apk add --no-cache git
RUN git clone https://github.com/sourcifyeth/h5ai.git
# RUN git clone https://github.com/sourcifyeth/h5ai.git
RUN cd h5ai && npm install && npm run build 
RUN ls /h5ai/build
FROM nginx:latest

ENV DEBIAN_FRONTEND=noninteractive

COPY --from=0 /h5ai/build/h5ai-0.30.0+002~bbf4842.zip /tmp/h5ai.zip

RUN apt update && \
	apt install -y --no-install-recommends php-fpm apache2-utils wget ca-certificates unzip zip && \
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
