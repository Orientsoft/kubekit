# Binary name
BINARY=kubekit
# Builds the project
build:
		go build -o ${BINARY}
# Installs our project: copies binaries
install:
		go install
release:
		# Clean
		go clean
		rm -rf *.gz
		# Build for linux
		go clean
		CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build
		tar czvf ${BINARY}-linux64-${VERSION}.tar.gz ./${BINARY}
# Cleans our projects: deletes binaries
clean:
		go clean

.PHONY:  clean build
