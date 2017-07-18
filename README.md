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

  d. 截图插件用了系统类库,有些 window 系统会因找不到系统类库导致截图插件无法正常用
  vc_redist.x86.exe 是 类库安装包.生成的安装包(desktop_setup.iss编译生成)包含了该文件.运行安装包时会检测vc_redist.x86.exe 是否安装,如果需要则安装

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
