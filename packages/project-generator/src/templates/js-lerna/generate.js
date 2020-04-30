import child_process from 'child_process';
import _path from 'path';
import fs from 'fs';
import { resolveCodePath } from '../../code-relative-path.js';

export { generate };

const TEMPLATE_PATH = resolveCodePath('../templates/js-lerna');

function generate(options) {
	let { path, projectName } = options;

	let directoryStructure = [
		['packages', projectName, 'src'],
		['dev-packages'],
	];

	directoryStructure.forEach((list) => {
		list.reduce((currentDir, dirName) => {
			let path = _path.join(currentDir, dirName);
			fs.mkdirSync(path);
			return path;
		}, path);
	});

	[
		'src/code-relative-path.js',
		'src/config.js',
		'src/context.js',
		'src/main.js',
	].forEach((sourcePath) => {
		fs.copyFileSync(
			_path.join(TEMPLATE_PATH, 'packages/project-name', sourcePath),
			_path.join(path, 'packages', projectName, sourcePath),
		);
	});

	let filesToCopy = [
		'dev-packages/.gitignore',
		'.eslintignore',
		'.eslintrc.js',
		'.gitignore',
		'.prettierrc.toml',
		'jsconfig.json',
		'lerna.json',
	];

	filesToCopy.forEach((fileName) => {
		let source = _path.join(TEMPLATE_PATH, fileName);
		let dest = _path.join(path, fileName);

		fs.copyFileSync(source, dest);
	});

	addPackageJson({
		packageJsonPath: _path.join(TEMPLATE_PATH, 'package.json'),
		path,
		projectName,
	});
	addPackageJson({
		packageJsonPath: _path.join(
			TEMPLATE_PATH,
			'packages/project-name/package.json',
		),
		path: _path.join(path, 'packages', projectName),
		projectName,
	});

	[
		['git', 'init'],
		['git', 'checkout', '-b', 'develop'],
		['git', 'commit', '--allow-empty', '-m', 'initial commit'],
		['git', 'add', '-A'],
		['git', 'commit', '-m', 'base structure'],
		['npm', 'install'],
	].forEach((command) => {
		child_process.spawnSync(command[0], command.slice(1), {
			cwd: path,
			stdio: 'inherit',
		});
	});
}

function addPackageJson({ packageJsonPath, path, projectName }) {
	let packageJson = JSON.parse(
		fs.readFileSync(packageJsonPath, {
			encoding: 'utf8',
		}),
	);

	packageJson.name = projectName;

	fs.writeFileSync(
		_path.join(path, 'package.json'),
		JSON.stringify(packageJson, null, '\t') + '\n',
	);
}
