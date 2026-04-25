
FROM maven:4.0.0-rc-5-amazoncorretto-25 as build
WORKDIR /build

COPY . .

RUN mvn clean package -DskipTests


FROM amazoncorretto:25
WORKDIR /app


COPY --from=build /build/target/*.jar automotivo.jar

EXPOSE 8080

# Comando de inicialização com flags de performance
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-Djava.security.egd=file:/dev/./urandom", "-jar", "automotivo.jar"]
