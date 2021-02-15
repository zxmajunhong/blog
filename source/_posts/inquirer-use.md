---
title: inquirer.js的用法
categories: 笔记
tags:
  - inquire
  - nodejs
  - 命令行交互
abbrlink: 8e3b15ee
date: 2021-02-01 18:07:27
---

# 是个啥
可以实现一个交互式命令行的用户界面。力求为node.js提供一个易于嵌入和漂亮的命令行界面。有以下特性：
* 错误反馈
* 提出问题
* 解析输入
* 验证回答
* 提示友好

当然他仅仅是提供一个友好交互的命令行界面，如果想要使用一个完整的nodejs命令行程序，可以参阅[commander](https://github.com/visionmedia/commander.js)、[vorpal](https://github.com/dthree/vorpal)、[args](https://github.com/leo/args);


# 可以做什么
可以实现一个友好交互的命令行界面。
想象这样一个场景，在使用webpack打包应用的时候，我们需要根据当前的打包环境来匹配不同的打包设置，一般我们在package.json中这样写
```json
"scripts": {
  "build:pre": "cross-env NODE_ENV=pre node build/build.js", // 预发布环境
  "build:prod": "cross-env NODE_ENV=prod node build/build.js", // 正式环境
}
```
然后想要打包pre环境的时候需要执行：
```shell
$ npm run build:pre
```
想要打包prod环境的时候需要执行：
```shell
$ npm run build:prod
```
使用inquire.js我们可以更好的去做按环境打包
```json
"scripts": {
  "build": "node build/build.js"
}
```
在build.js文件中使用inquire可以达到以下效果
![使用案例](use_for.png)

# 怎么用

## 安装
```shell
$ npm i inquirer -D
# 或者
$ yarn add inquirer -D
```

## 使用
```js
const inquirer = require('inquirer');
inquirer
  .prompt([
    /* 这里写上你需要显示的问题 */
  ])
  .then((answers) => {
    /* 这里处理用户的回答操作 */
  })
  .catch((error) => {
    /* 处理异常 */
  })
```

## 方法参数说明
```js
/**
 * 启动一个命令行交互界面
 *
 * @param {[question]} questions 传递一个question对象的数组
 */
inquirer.prompt(questions: [Question]):Promise

/**
 * 所要传递的问题对象
 */
interface Question {
  /**
   * 所要展示的交互类型
   * * input: 输入类型的交互
   * * number: 输入数字的交互
   * * confirm: 确认类型的交互
   * * list: 单选列表交互
   * * rawlist: 带序号的单选列表交互
   * * expand: 扩展显示的交互
   * * checkbox: 多选列表交互
   * * password: 输入类型，但是输入值不可见的交互
   * * editor: 编辑器交互
   */
  type: 'input' | 'number' | 'confirm' | 'list' | 'rawlist' | 'expand' | 'checkbox' | 'password' | 'editor';
  /** 定义在回答中获取数据的key值，如果这个值中包含.，那么他会已路径的形式展示 */
  name: string;
  /** 控制当前交互命令行启动时显示的问题信息。如果传入一个方法，方法的第一个参数为当前交互的回答数据。默认值为name的值 */
  message: string | Function;
  /** 控制问题的默认回答。如果传入一个方法，方法的第一个参数为当前交互的回答数据 */
  default: string | number | boolean | [any] | Function;
  /**
   * 可供选择的答案，可以是个数字数组、字符串数组、对象数组、方法
   * 如果是对象数组，对象有以下属性
   * - key:string 快捷按键，在type是expand的情况下需要提供该值，用于快速选择问题的答案
   * - name:string 显示的名称
   * - value:string | number | boolean 选择的值
   * - short:string 选择后在问题后面要显示的值，可选参数，如果没有赋值默认在选择后显示name值
   * - checked:boolean 设置true后默认选择当前选项，可选参数
   * 数组中也可以是一个separator对象，用来显示一个分割线，不可选择new inquirer.Separator()
   */
  choices: [number | string | {name: string, value: string | number | boolean, short?: string}] | Function;
  /** 对输入|选择的回答做自定义验证，如果验证通过返回true，不通过可以返回自定义验证不通过提示消息，如果返回false那么就会显示默认验证不通过提示消息。方法参数为当前输入|选择的值，第二个参数为当前交互的回答数据 */
  validate: Function;
  /** 对输入的值做自定义处理，返回的值会覆盖回答数据中相同KEY的value。参数同validate方法 */
  filter: Function;
  /** 根据用户的输入|选择做自定义显示的方法，不会影响最终的回答数据。 */
  transformer: Function;
  /** 接收当前用户的回答散列，应该返回true或false，取决于是否应该问这个问题。该值也可以是一个简单的布尔值 */
  when: Function | boolean;
  /** 更改使用list、rawList、expand或复选框时将呈现的行数 */
  pageSize: number;
  /** 更改默认的前缀显示默认是? */
  prefix: string;
  /** 更改默认的后缀显示 默认是空字符串 */
  suffix: string;
  /** 如果答案已经存在，则强制提出问题 */
  askAnswered: boolean;
  /** 列表选择时是否循环操作默认true */
  loop: boolean;
  /** 
   * 针对default、choices、validate、filter、when等传递是function的情况，并且在方法体内部如果有异步调用获取数据的情况，可以考虑使用this.async()或者返回一个promise可以在异步的情况下得到正确的值
   */
}

/** 最终的到的回答数据是一个kev/value对象 */
interface Answer {
  /** 
   * name: 是每个问题对象中的name属性
   * value: 取决于每个问题对象
   * - 如果是个confirm交互，最终值为boolean
   * - 如果是个input交互，最终值为string
   * - 如果是个number交互，最终值为number
   * - 如果是列表交互，最终只为所定义的选择项的值
  */
  [name: string]: any;
}
```

Separator

separator是个一个构造函数，能够构造出一个分隔符字符串，可以被添加到任何一个choices数组中
构造函数接受一个字符串参数用于控制最终分隔字符串的显示，如果不传递默认显示为`--------`

-----

可以使用[rxjs](https://github.com/ReactiveX/rxjs)扩展来动态的添加问题：
```js
const prompts = new Rx.Subject();
inquirer.prompt(prompts);

// 添加一个问题
prompts.next({
  /* question... */
});
prompts.next({
  /* question... */
});

// 当可以完成时
prompts.complete();
```

# 案例说明
```js
// example.js
const inquirer = require('inquirer');

/** 模拟一个网上订餐的过程 */
inquirer
  .prompt([
    {
      /** 多选类型的交互 */
      type: 'checkbox',
      name: 'goods',
      message: '请选择商品',
      choices: [
        new inquirer.Separator('==家常小炒=='), '酸辣土豆丝', '麻婆豆腐', '辣椒炒肉', '鱼香肉丝',
        new inquirer.Separator('==美味鲜汤=='), '番茄蛋汤', '紫菜蛋汤', '莲藕排骨汤',
        new inquirer.Separator('==主食=='), '米饭', '馒头', '面条',
        new inquirer.Separator('==饮料=='), '可乐', '雪碧', '橙汁',
      ],
      loop: false,
    },
    {
      /** 快捷扩展类型的交互 (请注意key为单个单词，不要使用h保留单词) */
      type: 'expand',
      name: 'taste',
      message: '请选择辣椒炒肉的口味',
      choices: [
        {
          key: 'l',
          name: '微辣',
          value: '微辣'
        },
        {
          key: 'm',
          name: '中辣',
          value: '中辣'
        },
        {
          key: 's',
          name: '重辣',
          value: '重辣'
        }
      ],
      /** 在选择了辣椒炒肉后才有口味的选择 */
      when: (answer) => {
        return /辣椒炒肉/.test(answer.goods.toString());
      }
    },
    {
      /** 确认类型的交互 */
      type: 'confirm',
      name: 'package',
      message: '是否打包?',
      default: false, // 默认不打包
    },
    {
      type: 'input',
      name: 'people',
      message: '请输入就餐人数',
      when: (answer) => {
        return answer.package;
      },
      validate: (value) => {
        /** 对数字类型的输入最好采用普通输入类型的交互，自带的number类型的数字验证存在验证失败后不能重新输入的bug */
        if (/^\d+/.test(value)) {
          return true;
        }
        return '请输入数字';
      }
    },
    {
      /** 输入类型的交互 */
      type: 'input',
      name: 'phone',
      message: '请输入手机号',
      /** 如果是要打包需要登记手机号 */
      when: (answer) => {
        return answer.package;
      },
      /** 验证手机号是否正确 */
      validate: (value) => {
        if (/^(?:(?:\+|00)86)?1\d{10}$/.test(value)) {
          return true;
        }
        return '请输入正确的手机号';
      }
    },
    {
      type: 'confirm',
      name: 'isRemark',
      message: '是否需要添加备注',
      when: (answer) => {
        return answer.package;
      },
      default: false,
    },
    {
      /** 编辑类型的交互 */
      type: 'editor',
      name: 'remark',
      message: '请输入备注',
      when: (answer) => {
        return answer.package && answer.isRemark;
      }
    },
    {
      type: 'input',
      name: 'comment',
      message: '好评有奖哦',
    },
    {
      type: 'rawlist',
      name: 'award',
      message: '请选择奖励',
      choices: [
        '返现1元',
        '代金券5元',
        {
          name: '8折打折券',
          value: '8折打折券',
          checked: true, // 默认选中
        }
      ],
      when: (answer) => {
        return answer.comment != '';
      }
    }
  ])
  .then((answer) => {
    console.log('最终结果', answer);
  });
```

![example](example.gif)