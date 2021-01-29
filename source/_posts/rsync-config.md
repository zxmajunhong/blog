---
title: rsync配置说明
categories: 笔记
tags:
  - rsync
  - Linux
abbrlink: 5e052a31
date: 2021-01-25 17:54:48
---

## 前言
在查找相关`rsync`资料的时候，发现网上查找的资料关于配置信息都写的不是那么清楚，故将有关`rsync`的配置信息整理下，方便后面查阅。

## 一些概念简单说明
`rsync` 是一个常用的 Linux 应用程序，用于文件同步。它可以在本地计算机与远程计算机之间，或者两个本地目录之间同步文件（但不支持两台远程计算机之间的同步）。它也可以当作文件复制工具，替代**cp**和**mv**命令。

## 服务器上安装rsync
```shell
$ sudo apt-get install rsync
# 或者
$ sudo sudo yum install rsync

# 安装完成后查看配置文件存放点
$ rpm -qc rsync
/etc/rsyncd.conf
```

## rsyncd.conf
该文件就是rsync服务启动的配置文件，文件内容由模块和参数组成，模块名由`[]`符号包裹，并且在遇到下一个模块名之前后面所有的参数值都属于对模块的参数配置，参数的格式为：``name=value``。参数值可以是字符串或者布尔类型值，对于字符串不需要加上引号并且大小写有区别

### 配置参数说明
```conf
motd file = /etc/rsyncd.motd    # 设置服务器信息提示文件，在该文件中编写提示信息
transfer logging = yes    # 开启rsync数据传输日志功能
log file = /var/log/rsyncd.log    # 设置日志文件名，可通过log format参数设置日志格式
pid file = /var/run/rsyncd.log    # 设置rsync进程号保存文件名称
lock file = /var/run/rsync.lock    # 设置锁文件名称
port = 873    # 设置服务器监听的端口号，默认是873
address = 127.0.0.1    # 设置本服务器所监听网卡接口的ip地址
uid = nobody    # 设置进行数据传输时所使用的帐户名或ID号，默认使用nobody，可以在局部模块中再配置
gid = nobody    # 设置进行数据传输时所使用的组名或GID号，默认使用nobody
use chroot = no # 若为yes, rsync会首先进行chroot设置，将根映射在下面的path参数路径下，对客户端而言，系统的根就是path参数指定的路径。但这样做需要root权限，并且在同步符号连接资料时只会同步名称，不会同步内容。
read only = yes    # 是否允许客户端上传数据，yes表示不允许
max connections =10    # 设置并发连接数，0表示无限制
[blog] # 自定义模块名，rsync通过模块定义同步的目录，可定义多个
comment = 博客同步模块 # 定义注释说明字符串
path = /path # 同步目录的真实路径
ignore errors    # 忽略一些IO错误
auth users = test # 设置允许连接服务器的账户，此账户可以是系统中不存在的用户
secrets file = /etc/rysncd.secrets    # 密码验证文件名，该文件权限要求为只读，建议为600，仅在设置auth users后有效
hosts allow = 192.168.0.0/255.255.255.0   # 设置哪些主机可以同步数据，多ip和网段之间使用空格分隔
hosts deny=*    # 除了hosts allow定义的主机外，拒绝其他所有
list = false    # 客户端请求显示模块列表时，本模块名称是否显示，默认为true
# 以上配置信息都是可选配置
# 请注意上面每行配置的注释信息不要跟配置同行
```

### rsync 命令说明
```shell
# 常规
rsync [OPTION...] SRC... [DEST]
# 通过shell访问远程
rsync [OPTION...] [USER@]HOST:SRC... [DEST] # 下载
rsync [OPTION...] SRC... [USER@]HOST:DEST # 上传
# 通过rsync守护进程
# 下载
rsync [OPTION...] [USER@]HOST::SRC... [DEST]
rsync [OPTION...] rsync://[USER@]HOST[:PORT]/SRC... [DEST]
# 上传
rsync [OPTION...] SRC... [USER@]HOST::DEST
rsync [OPTION...] SRC... rsync://[USER@]HOST[:PORT]/DEST
# SRC=源地址、DEST=目标地址
# 如果只有SRC参数没有DEST，那么仅仅是将源地址文件列出而不是复制
```
选项(常用)说明：
* v: 显示详细信息
* z: 传输过程中对数据进行压缩
* r: 递归
* t: 保留修改时间属性
* o: 保留文件所有者属性
* p: 保留文件权限属性
* g: 保留文件所属组属性
* a: 归档模式，主要保留文件属性，等同于-rlptgoD
* --progress: 显示数据传输的进度信息
* --passwrod-file=FILE: 指定密码文件，将密码写入文件，实现非交互式数据同步，这个文件名也需要修改权限为600
* --delete: 删除那些仅在目标路径中存在的文件

## 启动rsync的守护进程
```shell
$ rsync --daemon
# 会自动通过/etc/rsync.conf配置文件来启动rsync
```
设置开机启动rsync服务
```shell
$ echo "/usr/bin/rsync --daemon" >> /etc/rc.local
```
添加防火墙规则，允许873端口的数据访问
```shell
firewall-cmd --permanent --add-port=873/tcp
```

## 参考连接
[https://www.cnblogs.com/regit/p/8074221.html](https://www.cnblogs.com/regit/p/8074221.html)
[https://rsync.samba.org/documentation.html](https://rsync.samba.org/documentation.html)