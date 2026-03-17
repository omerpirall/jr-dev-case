self.document = null;
let window = self;
let document = self.document;
try {
  importScripts(
	'./vendor/md5.js',
	'./vendor/uuid.min.js',
	'./scripts/background.build.min.js',
);
} catch (e) {
  console.error(e);
}