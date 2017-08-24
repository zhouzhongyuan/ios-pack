# ios项目自动打包

## 规格
- 预计用时: 6分钟
- 不能挂VPN

## 关键语句

进入文件,xcodebuild没法指定文件夹
```
cp /Users/bokeadmin/project/ios-pack/routes/pack/exportOptions.plist ./
xcodebuild -project  yesapp.xcodeproj -scheme yesapp -sdk iphoneos archive -archivePath $PWD/build/yesapp.xcarchive -configuration Release
xcodebuild -exportArchive -archivePath $PWD/build/yesapp.xcarchive -exportOptionsPlist exportOptions.plist -exportPath $PWD/build
```

## 导入p12文件
```
security import ./bundle.p12 -P secretPassword
```
import the bundle to the default keychain.

- -k  import to which keychain
- -A  Allow any application to access the imported key without warning (insecure, not recommended!) (解决我以前的一个痛点)
- -T  Specify an application which may access the imported key (multiple -T options are allowed)

[osx - install .p12 or .cer in console macos - Stack Overflow](https://stackoverflow.com/questions/7485806/install-p12-or-cer-in-console-macos)
