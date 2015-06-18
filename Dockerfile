FROM mikejihbe/nodejs-ssh:latest
EXPOSE 3000
WORKDIR /app
COPY . /app
RUN ["/app/bin/build"]
CMD /app/bin/run
