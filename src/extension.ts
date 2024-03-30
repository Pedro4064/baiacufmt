// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { exit } from 'process';
import * as vscode from 'vscode';

const return_type_extract = (function_definition: string) => {

	const return_type_regex = /([\w\s*]+?)\s+\w+\s*\(.*\)/;
	const match = function_definition.match(return_type_regex);

	if (!match) {
		vscode.window.showInformationMessage('Return Type not found on function signature');
		exit(1);
	}
	else {
		const return_type = match[1];
		console.log(return_type); // Output: "void"
		return return_type;
	}

};

const function_name_extract = (function_definition: string) => {
	const function_name_regex = /^\s*[\w\s*]+\s+(\w+)\s*\(/;
	const match = function_definition.match(function_name_regex);

	if (!match) {
		vscode.window.showErrorMessage('Function Type not found on function signature');
		exit(1);
	}
	else {
		const function_name = match[1];
		console.log(function_name); // Output: "void"
		return function_name;
	}
}

const function_arguments_extract = (function_definition: string) => {
	const arguments_regex = /\((.*)\)/;
	const match = function_definition.match(arguments_regex);

	if (!match) {
		vscode.window.showErrorMessage('Function Type not found on function signature');
		exit(1);
	}
	else {
		const function_arguments = match[1];
		console.log(function_arguments); // Output: "void"
		return function_arguments;
	}
}

const get_variables_to_be_used = async (variables_str: string) => {
	const variables = variables_str.split(',');
	const selected_vars = await vscode.window.showQuickPick(variables, { canPickMany: true, placeHolder: 'Select variables' });

	if (!selected_vars) {
		vscode.window.showErrorMessage('No Variables were selected');
		exit(1);
	}

	let variables_information: [string, string][] = [];
	for (const raw_var_name of selected_vars) {
		console.log(raw_var_name);
		const formatted_var_name = (await vscode.window.showInputBox({ value: raw_var_name, prompt: 'Name of Variable to Show on Comment Block' })) ?? raw_var_name;
		const variable_description = (await vscode.window.showInputBox({ prompt: `Description for variable ${formatted_var_name}` })) ?? "NO DESCRIPTION";

		variables_information.push([formatted_var_name, variable_description]);
	}

	console.log(variables_information);
	return variables_information;

}

const full_justify_text = (text: string, offset: number) => {
	const words = text.split(' ');
	let formatted_text = '';
	let current_line = '';
	let line_length = 0;
	let max_length = 36;

	for (const word of words) {
		if ((current_line + word).length <= max_length) {
			current_line += word + ' ';
			line_length += word.length + 1; // Add word length and space
		} else {
			const number_of_spaces = 40 - line_length + current_line.trim().split(' ').length - 1;
			const words_in_line = current_line.trim().split(' ').length;
			const spaces_between_words = Math.floor(number_of_spaces / (words_in_line - 1));
			const extra_spaces = number_of_spaces % (words_in_line - 1);

			const words_array = current_line.trim().split(' ');
			let line = '';
			for (let i = 0; i < words_array.length - 1; i++) {
				const spaces = i < extra_spaces ? spaces_between_words + 1 : spaces_between_words;
				line += words_array[i] + ' '.repeat(spaces);
			}
			line += words_array[words_array.length - 1]; // Add last word without trailing space

			formatted_text += ' '.repeat(offset) + line + '\n';
			current_line = word + ' ';
			line_length = word.length + 1;
		}
	}

	// Add the last line
	const last_line = current_line.trim();
	formatted_text += ' '.repeat(offset) + last_line + ' '.repeat(max_length - last_line.length);

	return formatted_text;
}
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "baiacufmt" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('baiacufmt.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const editor = vscode.window.activeTextEditor;
		if (editor) {

			vscode.window.showInformationMessage('Editor Found');
			const position = editor.selection.active;
			const line = editor.document.lineAt(position.line + 1).text;

			console.log(line);
			const return_type = return_type_extract(line);
			const function_name = function_name_extract(line);

			const raw_function_arguments = function_arguments_extract(line);
			const variables_and_descriptions = get_variables_to_be_used(raw_function_arguments);

			// Format Final Comment Block
			const template_footer_and_header = '// ***************************************************** //';
			const template_method_name = '// Method name:        ';
			const template_method_description = '// Method description: '
			const template_input_params = '// Input params:       '
			const template_output_params = '// Output params:       '
		}


		vscode.window.showInformationMessage('No Active Editors Found');
	});



	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
