#!/usr/bin/env node
const spawn = require('cross-spawn');
const inquirer = require('inquirer');
const path = require('path');

inquirer
  .prompt([
    {
      type: 'rawlist',
      message: '选择操作',
      name: 'operate',
      choices: [
        {
          name: '启动服务',
          value: 'server',
        },
        {
          name: '编译打包',
          value: 'build',
        },
        {
          name: '仅发布',
          value: 'publish',
        },
        {
          name: '打包部署',
          value: 'buildPublish',
        }
      ]
    },
  ])
  .then((answer) => {
    switch (answer.operate) {
      case 'server':
        spawn.sync('npm', ['run', 'server'], {cwd: __dirname, stdio: 'inherit'});
        break;
      case 'build':
        spawn('npm', ['run', 'build']);
      case 'publish':
        upload();
      case 'buildPublish':
        spawn.sync('npm', ['run', 'build']);
        upload();
      default:
        console.log('请选择操作');
        break;
    }
    console.log('answer', answer);
  });

function upload() {
  spawn.sync('rsync', ['-avzP', 'public/', 'mjh@www.wmm20.com::blog'], {stdio: 'inherit'});
}
