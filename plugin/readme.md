# 编写自定义plugin

### webpack中plugin是用于扩展Webpack功能，原理是在构建流程里注入钩子函数

Webpack在启动时会实例化插件对象，在初始化compiler对象之后会调用插件实例的apply方法，传入compiler对象，插件实例在apply方法中会注册感兴趣的钩子，Webpack在执行过程中会根据构建阶段回调相应的钩子。

### Compiler与Compilation

- Compiler 对象包含了当前运行Webpack的配置，包括entry、output、loaders等配置，这个对象在启动Webpack时被实例化，而且是全局唯一的。Plugin可以通过该对象获取到Webpack的配置信息进行处理。

- Compilation对象可以理解编译对象，包含了模块、依赖、文件等信息。在开发模式下运行Webpack时，每修改一次文件都会产生一个新的Compilation对象，Plugin可以访问到本次编译过程中的模块、依赖、文件内容等信息。

### 钩子

钩子|说明|参数|类型
--|:--:|--:|--:
afterPlugins|启动一次新的编译|compiler|同步
compile|创建compilation对象之前|compilationParams|同步
compilation|compilation对象创建完成|compilation|同步
emit|资源生成完成，输出之前|compilation|异步
afterEmit|资源输出到目录完成|compilation|异步
done|完成编译|stats|同步

### Tapable

Tapable是Webpack的一个核心工具，Webpack中许多对象扩展自Tapable类。Tapable类暴露了tap、tapAsync和tapPromise方法，可以根据钩子的同步/异步方式来选择一个函数注入逻辑。

- tap 同步钩子
- tapAsync 异步钩子，通过callback回调告诉Webpack异步执行完毕
- tapPromise 异步钩子，返回一个Promise告诉Webpack异步执行完毕

do it

