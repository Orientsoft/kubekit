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
		rm -rf kubekit-release
		# Build for linux
		mkdir kubekit-release
		CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build
		mv kubekit ./kubekit-release
		cp -r ./assets ./kubekit-release
		cp -r ./templates ./kubekit-release
		cp ./server.sh ./kubekit-release
		cp README.md ./kubekit-release
		cp LICENSE ./kubekit-release
		tar czvf ${BINARY}-linux64-${VERSION}.tar.gz ./kubekit-release
# Cleans our projects: deletes binaries
clean:
		go clean
		rm -rf *.gz
		rm -rf kubekit-release

.PHONY:  clean build
