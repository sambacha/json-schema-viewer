FROM ubuntu:18.04

ARG JSV_SCHEMA_URI=https://sd2e.github.io/python-datacatalog/schemas/sample_set.json
ARG JSV_SCHEMA_VERSION=1.0.0
ARG GRUNT_MODE=dev

ENV JSV_SCHEMA_URI=$JSV_SCHEMA_URI
ENV JSV_SCHEMA_VERSION=$JSV_SCHEMA_VERSION

RUN apt update && \
    apt -y install \
        curl=7.58.0-2ubuntu3.5 \
        git=1:2.17.1-1ubuntu0.4 \
        nodejs=8.10.0~dfsg-2ubuntu0.4 \
        npm=3.5.2-0ubuntu4 && \
    apt-get -y clean

RUN echo '{ "allow_root": true }' > /root/.bowerrc

RUN npm config set prefix /usr/local && \
    npm install -g \
    grunt@1.0.3 \
    bower@1.8.4 \
    sass@1.15.1

COPY json-schema-viewer /json-schema-viewer

WORKDIR /json-schema-viewer

RUN bower install --allow-root && \
    npm install

# COPY docker/tv4.js /json-schema-viewer/bower_components/tv4/tv4.js

RUN grunt $GRUNT_MODE

ENTRYPOINT [ "/usr/local/bin/grunt", "connect:server:keepalive" ]
