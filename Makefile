# -----------------------------------------
# Makefile – Phaser (Vite + TypeScript) project builder
# -----------------------------------------

PROJECT = trickster-tiles

DIST_DIR   = dist
OUTPUT_ZIP = $(PROJECT)-$(VERSION).html.zip

VERSION_FILE = .version

all: build

node_modules: package.json package-lock.json
	npm ci

build: node_modules
	@echo "==> Type-checking + bundling (tsc + vite)"
	npm run build

web: build

serve: node_modules
	@echo "==> Serving production build on http://localhost:4173"
	npm run preview

dev: node_modules
	npm run dev

export: web
	@if [ -z "$(VERSION)" ]; then \
		echo "ERROR: VERSION not set!"; exit 1; \
	fi
	@echo "==> Packaging web build for $(VERSION)"
	cd $(DIST_DIR) && zip -r ../$(OUTPUT_ZIP) .
	@echo "==> Cleaning temporary files"
	rm -rf $(DIST_DIR)

watch:
	fswatch -o src | while read; do make build; done

clean:
	rm -rf $(DIST_DIR)

ci-version:
	@if [ -f metadata.json ]; then \
		VERSION=$$(jq -r '.version' metadata.json); \
	else \
		VERSION=$$(git rev-parse --short HEAD); \
	fi; \
	BRANCH=$$(git rev-parse --abbrev-ref HEAD); \
	if [ "$$BRANCH" != "main" ] && [ "$$BRANCH" != "master" ]; then \
		VERSION="dev-$$VERSION-$$BRANCH"; \
	fi; \
	echo $$VERSION > $(VERSION_FILE)

ci-export:
	@VERSION=$$(cat $(VERSION_FILE)); \
	$(MAKE) export VERSION=$$VERSION

ci-upload:
	@VERSION=$$(cat $(VERSION_FILE)); \
	FILE="$(PROJECT)-$$VERSION.html.zip"; \
	META_SRC="metadata.json"; \
	META_DST="$(PROJECT)-$$VERSION.metadata.json"; \
	cp $$META_SRC $$META_DST; \
	sshpass -p "$(DROPAREA_SSH_PASSWORD)" scp -o StrictHostKeyChecking=no -P $(DROPAREA_PORT) \
		$$FILE $$META_DST \
		$(DROPAREA_USER)@$(DROPAREA_HOST):$(DROPAREA_TARGET_PATH)/

ci-update:
	@VERSION=$$(cat $(VERSION_FILE)); \
	curl "$(UPDATE_SERVER)/update?secret=$(UPDATE_SECRET)&name=$(PROJECT)&platform=phaser&version=$$VERSION"

.PHONY: all build web serve dev export watch clean ci-version ci-export ci-upload ci-update
