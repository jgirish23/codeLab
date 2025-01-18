# Use an official OpenJDK runtime as a parent image
FROM openjdk:21-jdk-slim

# Set the working directory to /app
WORKDIR /app

RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_11.x  | bash -
RUN apt-get -y install nodejs

# Copy the packaged JAR file into the container at /app
COPY target/codelab-*.jar app.jar

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Run the JAR file
CMD ["java", "-jar", "app.jar"]