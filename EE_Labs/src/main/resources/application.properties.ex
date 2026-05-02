spring.application.name=EE_Labs

server.port=####

# PostgreSQL Connection
spring.datasource.url=url
spring.datasource.username=username
spring.datasource.password=password

# Hibernate Configuration
# 'validate' ensures Java matches your existing DB without destroying your tables
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.type.json_format_mapper=org.hibernate.type.format.jackson.JacksonJsonFormatMapper

gemini.api.key=api

# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=###
spring.mail.username=example@gmail.com

spring.mail.password=###############
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
