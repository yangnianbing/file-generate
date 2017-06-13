## 介绍
新建项目的过程中通常会遇到创建初始文件的情况，这些初始文件大部分内容相同，只有少数内容需要动态替换。通过开源的node命令行库`commander, inquirer, chalk`来接收用户的输入，`art-template`来编写模板文件,最终生成初始化文件。

- art-template的模板语法可以参照这里[click](http://www.jq22.com/jquery-info1097)

### 安装方法
1. 终端中执行`npm install file-generate -g`，全局安装file-generate
2. 在终端中 输入`file-generate create`根据交互提示输入模板路径以，目标文件路径，替换参数，即可根据替换参数替换执行模板路径中的模板，在目标文件路劲生成对应的文件。