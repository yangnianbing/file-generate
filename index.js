#!/usr/bin/env node

const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');

const template = require('art-template');
const fs = require('fs');
const path = require('path');

var command = program.command('create')
    .description('创建文件')
    .option('-s --source [source]', '模板文件路径')
    .option('-t --target [target]', '生成文件的存放路径')
    .action(option => {

        var promps = [];
        if(!option.source){
			promps.push({
				type : 'input',
				name : 'source',
				message : "请输入模板所在路径",
				validate : function(input){
					if(!input){
						return '不能为空'
					};
                    if(!fs.existsSync(input)){
                        return "原路径不存在";
                    }
					return true;
				}
			})
		}
        if(!option.target){
			promps.push({
				type : 'input',
				name : 'target',
				message : "请输入目标文件路径",
				validate : function(input){
					if(!input){
						return '不能为空'
					};
                    if(!fs.existsSync(input)){
                        return "目标径不存在";
                    }
					return true;
				}
			})
		}

        promps.push({
            type : 'input',
            name : 'params',
            message : "请输入变量，变量格式{key1 : value1, key2 : value2}",
            validate(input){
                if(input){
                    try{
                        JSON.parse(input);
                        return true;
                    }catch(e){
                        return "格式不正确";
                    }
                }
                return true;
            }
        })

        promps.push({
            type : 'input',
            name : 'openTag',
            default : '{{',
            message : "自定义arttemplate的openTag，默认"
        })
        promps.push({
            type : 'input',
            name : 'closeTag',
            default : '}}',
            message : "自定义arttemplate的closeTag，默认"
        })

        inquirer.prompt(promps).then(answers => {
            answers = Object.assign(answers, option);
           
            template.config('openTag', answers.openTag);
            template.config('closeTag', answers.closeTag);
            walkFile(answers.source, function(filePath){
                if(path.isAbsolute(filePath)){
                    filePath = path.relative(answers.source, filePath);
                }
                writeFile(answers.target, filePath, compile(readFile(filePath), {}));
            })
        });
    })

program.parse(process.argv);

function writeFile(root, filePath, content){
    var absolutePath = path.join(root, filePath);
    if(mkdirsSync(path.dirname(absolutePath))){
        fs.writeFileSync(absolutePath, content);
    }
}

function compile(content, param){
    return template.render(content, param)
}

function readFile(file){
    return fs.readFileSync(file, {'encoding':'utf8'});
}

function walkFile(file, callback){
    var stat = fs.statSync(file);
    if(stat.isFile()){
        callback(file);
    }else if(stat.isDirectory()){
        var files = fs.readdirSync(file);
        var $this = arguments.callee;
        files.forEach(function(filename){
            var newFile = path.join(file, filename);
            $this(newFile, callback);
        })
    }
}

function mkdirsSync(dirpath){
    if(!fs.existsSync(dirpath)){
        var pathtmp = '';
        dirpath.split(path.sep).forEach(function(dirname) {
            if (pathtmp) {
                pathtmp = path.join(pathtmp, dirname);
            }
            else {
                pathtmp = dirname;
            }
            if (!fs.existsSync(pathtmp)) {
                if (!fs.mkdirSync(pathtmp)) {
                    return false;
                }
            }
        });
    }
    return true;
}
