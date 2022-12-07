FROM oracle/graalvm-ce:latest
WORKDIR /opt/graalvm
RUN gu install native-image
ENTRYPOINT ["native-image"]