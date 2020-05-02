run: build
	nodejs ./example/index.js
run-local: build
	nodejs ./example/locale.js
build: 
	tsc