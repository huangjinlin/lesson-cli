# 作用
批量化操作课程当中的视频文件,生成一个用于统计视频时长的index.html
# 意义
通过npm的全局安装包,批量化操作一些文件
# 说明
项目的路径
C:\Users\huangjinlin\AppData\Roaming\npm\node_modules\lesson
在C:\Users\huangjinlin\AppData\Roaming\npm,新增2个文件
一个文件`lesson`
```batch
#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

case `uname` in
    *CYGWIN*|*MINGW*|*MSYS*) basedir=`cygpath -w "$basedir"`;;
esac

if [ -x "$basedir/node" ]; then
  "$basedir/node"  "$basedir/node_modules/lesson/cli.js" "$@"
  ret=$?
else 
  node  "$basedir/node_modules/lesson/cli.js" "$@"
  ret=$?
fi
exit $ret
```
一个文件`lesson.cmd`
```batch
@ECHO off
SETLOCAL
CALL :find_dp0

IF EXIST "%dp0%\node.exe" (
  SET "_prog=%dp0%\node.exe"
) ELSE (
  SET "_prog=node"
  SET PATHEXT=%PATHEXT:;.JS;=;%
)

"%_prog%"  "%dp0%\node_modules\lesson\cli.js" %*
ENDLOCAL
EXIT /b %errorlevel%
:find_dp0
SET dp0=%~dp0
EXIT /b
```
# 参考
- nrm项目