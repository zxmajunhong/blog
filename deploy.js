#!/usr/bin/env node
const spawn = require('cross-spawn');
const inquirer = require('inquirer');

let a = '';


inquirer
  .prompt([
  // {
  //   type: 'checkbox',
  //   message: '请选择需要打包的环境',
  //   name: 'env',
  //   choices: [
  //     { name: '预发布环境', value: 'pre' },
  //     { name: '正式环境', value: 'prod' },
  //     new inquirer.Separator(),
  //     { name: 'short选择', value: 'short', short: '选择后显示', checked: true }
  //   ]
  // },
  {
    type: 'input',
    name: 'number',
    message: '输入数字',
    validate: function(value) {
      if (/^\d+$/.test(value)) {
        return true;
      }
      return '请输入一个数字';
    },
    filter: (v) => {
      return v*2;
    },
    suffix: '^_^'
  },
  {
    type: 'number',
    name: 'sz',
    message: '请输入数字1或者2',
    validate: (v, d) => {
      a = d;
      if (v === 1 || v === 2) {
        return true;
      }
      return '请输入数字1或者2';
    }
  },
  {
    type: 'password',
    name: 'pwd',
    message: '请输入密码'
  }
  ])
  .then((answer) => {
    console.log('answer', answer);
    console.log('a', a);
  });
