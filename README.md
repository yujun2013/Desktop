# DemoApp

## Support OS

We do support Windows, Mac OS X

## Supported Languages

+ 简体中文
+ ... keep adding :)

## Setup Environment

Because we use npm to maintain our third party libraries, you have to make sure before doing anything, these needed stuffs are all installed already.

```
  npm install
  npm start
```
- 特别说明

  a. 默认加载的是截图demo
  
  b. 打包图标和应用名称在 config.js 中配置

  c. Windows 下制作安装包前请修改安装包项目文件中的参数(desktop_setup.iss).项目文件中除了修改必要的参数,还需要修改 AppId(方法: 菜单中 Tools/Generate GUID).

- 打包命令，参考package.json

    OS X

    ```
    npm run package:mac
    ```
    Windows

    ```
    npm run package:win
    ```

- 制作安装包:

    OS X

    ```
    npm run installer:mac
    ```
    Windows

    ```
     打开项目文件 desktop_setup.iss, 选择菜单 Build/Compile
    ```
