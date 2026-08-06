# -----------------------------------------
# Makefile – Phaser (Vite + TypeScript) project builder
# -----------------------------------------

PROJECT = trickster-tiles

DIST_DIR   = dist
OUTPUT_ZIP = $(PROJECT)-$(VERSION).html.zip

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

.PHONY: all build web serve dev export watch clean
