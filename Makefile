install:
	npm install

ci: 
	npm ci
	
lint:
	npx eslint .

test:
	npm run test

test-watch: 
	npm run test-watch

test-coverage: 
	npm run coverage