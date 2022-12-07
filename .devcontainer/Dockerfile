FROM ghcr.io/graalvm/graalvm-ce:ol7-java17-22.3.0-b2
WORKDIR /opt/graalvm
RUN gu install native-image
ENTRYPOINT ["native-image"]
