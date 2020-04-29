import inquirer from 'inquirer';
import fs from 'fs';
import _path from 'path';
import { getTemplates } from './templates/templates.js';

let PWD = process.cwd();

if (fs.readdirSync(PWD).length) {
	// eslint-disable-next-line no-console
	console.error('Current directory is not empty');
	process.exit(1);
}

let dirName = _path.basename(PWD);

let templates = getTemplates();
let templatesMap = new Map(templates.map((obj) => [obj.name, obj]));

const QUESTIONS = [
	{
		name: 'projectType',
		type: 'list',
		message: 'Project template type',
		choices: templates.map(({ name }) => name),
	},
	{
		name: 'projectName',
		type: 'input',
		message: 'Project name:',
		default: dirName,
		validate: function (input) {
			if (/^([A-Za-z\-_\d])+$/.test(input)) return true;
			else
				return 'Project name may only include letters, numbers, underscores and hashes.';
		},
	},
];

inquirer.prompt(QUESTIONS).then((answers) => {
	let template = templatesMap.get(answers.projectType);

	template.generate({
		...answers,
		path: PWD,
	});
});
