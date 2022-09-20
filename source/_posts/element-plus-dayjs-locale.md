---
title: element-plus中日期组件的国际化问题
categories: 笔记
tags:
  - element-plus
  - dayjs
abbrlink: d3217a44
date: 2022-09-20 11:03:54
---

# 问题背景
element-plus的date-picker的日期选择，在之前的一次需求中所需要那个日期面板一周的第一天是从周一开始，翻查文档发现element-plus的时间采用的是day.js来处理，针对day.js要将一周的第一天改为周一，只需要设置其国际化为中文配置即可。element-plus中的day.js配置中文化只需要引入day.js的中文化配置，并且将其配置为使用中文化即可
```javascript
import ElementPlus from 'element-plus';

import locale from 'element-plus/lib/locale/lang/zh-cn';
import 'dayjs/locale/zh-cn';

vueApp.use(ElementPlus, {locale});
```
以上伪代码即可实现功能，并正常上线了，但是在一段时间之后，发现日期面板的周初始天又变为了星期天。

# 开始问题排查
翻查date-picker组件的源码，找到渲染日期面板的地方
```javascript
// element-plus/es/components/date-picker/src/date-picker-com/basic-date-table.mjs
...
// 找到这里所设定的一周的第一天
const firstDayOfWeek = props.date.$locale().weekStart || 7;
...
// 这里生成一周的标题数组如：['周一', '周二', ...]
const WEEKS = computed(() => {
  return WEEKS_CONSTANT.concat(WEEKS_CONSTANT).slice(firstDayOfWeek, firstDayOfWeek + 7);
});
...
createElementVNode("tr", null, [
  _ctx.showWeekNumber ? (openBlock(), createElementBlock("th", _hoisted_2, toDisplayString(unref(t)("el.datepicker.week")), 1)) : createCommentVNode("v-if", true),
  (openBlock(true), createElementBlock(Fragment, null, renderList(unref(WEEKS), (week, key) => {
    return openBlock(), createElementBlock("th", {
      key,
      scope: "col",
      "aria-label": unref(t)("el.datepicker.weeksFull." + week)
    }, toDisplayString(unref(t)("el.datepicker.weeks." + week)), 9, _hoisted_3);
  }), 128))
]),
...
```
可以看到一周的第一天依赖于`props.date.$locale()`这个所返回的数据，于是打印其值看看是什么
```javascript
console.log('props.date.$locale()', props.date.$locale());
```
![locale](props-date-locale.png)
可以看到当前locale对象还是英文的配置信息
找到传入date的地方
```javascript
// element-plus/es/components/date-picker/src/date-picker-com/panel-date-pick.mjs
...
// 所传入的day.js的locale配置信息
console.log('lang.value', lang.value);
const innerDate = ref(dayjs().locale(lang.value));
...
currentView.value === "date" ? (openBlock(), createBlock(DateTable, {
    key: 0,
    ref_key: "currentViewRef",
    ref: currentViewRef,
    "selection-mode": unref(selectionMode),
    date: innerDate.value,
    "parsed-value": _ctx.parsedValue,
    "disabled-date": unref(disabledDate),
    "cell-class-name": unref(cellClassName),
    onPick: handleDatePick
  }, null, 8, ["selection-mode", "date", "parsed-value", "disabled-date", "cell-class-name"])) : createCommentVNode("v-if", true),
...
```
这里我们打印这个`lang.value`发现其值就是`'zh-cn'`，这表明我们在引入element-plus的时候确实设置了使用中文，但是day.js的中文配置为什么没生效？
查看关于day.js的全局配置语言(https://dayjs.gitee.io/docs/zh-CN/i18n/changing-locale)
![dayjs-locale](dayjs-locale.png)
根据文档上所写，以及我们在main.js中配置发现没有任何问题，那么为什么配置还是为英文语言？

为了严格根据文档来，又在`panel-date-pick.mjs`文件中显示的引入了day.js的中文包
```javascript
// element-plus/es/components/date-picker/src/date-picker-com/panel-date-pick.mjs
import 'dayjs/locale/zh-cn';
```
这时候再去查看`firstDayOfWeek`的值已经变为1了，表明这时候的配置已经是一周的第一天为周一。

那么为什么还需要再`panel-date-pick.mjs`文件中再引入一次day.js的语言包才能生效？

## node_modules
在排查element-plus模块代码的时候，发现其模块库中存在node_modules/dayjs库？node的模块库不是会拍平都放到根目录下的node_modules目录下面吗？
在外层的node_modules目录下也发现了dayjs目录。
查看两个dayjs目录发现是不同版本的dayjs，原来在我们的项目的依赖中也存在依赖dayjs，查看yarn.lock文件确实存在两个版本的dayjs。我们项目所锁定的dayjs版本小于element-plus所锁定的dayjs版本，故会在element-plus的node_modules中也会安装一个dayjs。
我们在main.js中全局设置的dayjs的语言配置只针对根目录下node_modules下的dayjs，而element-plus所import的dayjs为其目录下node_modules下的dayjs，两者并不相通

# 结论
在对某个组件库设置全局配置的时候，需要先判断项目中是否只安装了一个版本的库，避免设置无效。