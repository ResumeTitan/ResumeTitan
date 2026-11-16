BINARY_NAME := server
MAIN_PACKAGE := ./cmd/server
BUILD_DIR := ./bin

# Build metadata
VERSION ?= $(shell git describe --tags --always --dirty 2>/dev/null || echo "dev")
LDFLAGS := -s -w -X main.version=$(VERSION)

# Default target
DEFAULT_GOAL := help

.PHONY: help build run test lint generate clean

## help: Show available Makefile targets
help:
	@echo "Usage: make [target]"
	@echo ""
	@grep -E '^## ' $(MAKEFILE_LIST) | sed 's/## /  /'

## build: Compile the binary for current architecture
build:
	@mkdir -p $(BUILD_DIR)
	go build -ldflags="$(LDFLAGS)" -o $(BUILD_DIR)/$(BINARY_NAME) $(MAIN_PACKAGE)

## run: Build and execute the application
run: build
	$(BUILD_DIR)/$(BINARY_NAME)

## test: Run all unit tests with race detection
test:
	go test -v -race ./...

## test-cover: Run tests and generate an HTML coverage report
test-cover:
	go test -race -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out -o coverage.html

## lint: Format code, run go vet, and check for vulnerabilities
lint:
	go fmt ./...
	go vet ./...
	golangci-lint run

## generate: Run code generation directives
generate:
	go generate ./...

## clean: Remove build artifacts and coverage reports
clean:
	rm -rf $(BUILD_DIR) coverage.out coverage.html