# 个人简历网页版

### Preview
[我的简历](https://joriscai.github.io/mypage/dist/)

### Tutorial
[中文](https://github.com/joriscai/mypage/blob/master/README.md)|
[English](https://github.com/joriscai/mypage/blob/master/README-en.md)

### 怎样打造成你们简历呢?
##### 1.获得项目代码
在命令行运行命令:
```shell
git clone https://github.com/joriscai/mypage.git
```
或者下载当前版本代码: https://github.com/joriscai/mypage/archive/v1.0.0.zip
##### 2.在项目根目录（package.json 所在文件夹）执行
```shell
npm install
```
##### 3.启动项目的调试模式
若没有安装gulp到全局环境下，请先执行命令
```shell
npm install -g gulp
```
** 建议切换到v1.0.0分支（此分支没有太多内容）**
```shell
git checkout v1.0.0
```
如果你安装gulp到全局环境下，请执行命令，会自动打开浏览器
```shell
gulp serve
```
##### 4.在调试模式下修改自己需要的内容
代码修改会自动刷新浏览器

##### 5.修改好后，生成部署代码
结束调试模式再执行
```shell
gulp build
```
将生成的dist文件夹内的代码上传到自己的服务器即可。
也可以用git pages的功能部署自己的简历，详情请查阅[git pages手册](https://pages.github.com/)或者自行百度!

### 未来
1. 加入cms系统管理或者通过json文件来生成简历
2. 优化代码、引入CI开发模式
3. 引入自动代上线功能，实现即改即上线
4. .....

---
#### * 欢迎大家fork和star，有新功能也可以加入，谢谢！*
