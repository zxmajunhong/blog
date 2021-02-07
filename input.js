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
      ]
    },
    {
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
          key: 'll',
          name: '中辣',
          value: '中辣'
        },
        {
          key: 'lll',
          name: '重辣',
          value: '重辣'
        }
      ]
    },
    {
      /** 确认类型的交互 */
      type: 'confirm',
      name: 'package',
      message: '是否打包?',
      default: false, // 默认不打包
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
  ]);