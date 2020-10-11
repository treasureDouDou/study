# 处理步骤

Babel 的三个主要处理步骤分别是： **解析（parse）**，**转换（transform）**，**生成（generate）**.

### 解析

**解析**步骤接收代码并输出 AST。 这个步骤分为两个阶段：**词法分析（Lexical Analysis）** 和 **语法分析（Syntactic Analysis**

#### 词法分析

词法分析阶段把字符串形式的代码转换为 **令牌（tokens）** 流。.

你可以把令牌看作是一个扁平的语法片段数组：

```js
a + b;
```

```js
[
  { type: { ... }, value: "a", ... },
  { type: { ... }, value: "+", ... },
  { type: { ... }, value: "b", ...},
  ...
]
```
每一个 `type` 有一组属性来描述该令牌：

```js
{
  type: {
    label: 'name',
    keyword: undefined,
    beforeExpr: false,
    startsExpr: true,
    rightAssociative: false,
    isLoop: false,
    isAssign: false,
    prefix: false,
    postfix: false,
    binop: null,
    updateContext: null
  },
  ...
}

和 AST 节点一样它们也有 `start`，`end`，`loc` 属性

#### 语法分析

语法分析阶段会把一个令牌流转换成 AST 的形式。 这个阶段会使用令牌中的信息把它们转换成一个 AST 的表述结构，这样更易于后续的操作。

### 转换

转换步骤接收 AST 并对其进行遍历，在此过程中对节点进行添加、更新及移除等操作。 这是 Babel 或是其他编译器中最复杂的过程

### 生成

代码生成步骤把最终（经过一系列转换之后）的 AST 转换成字符串形式的代码
代码生成其实很简单：深度优先遍历整个 AST，然后构建可以表示转换后代码的字符串。

## 遍历

想要转换 AST 你需要进行递归的树形遍历

比方说我们有一个 `FunctionDeclaration` 类型。它有几个属性：`id`，`params`，和 `body`，每一个都有一些内嵌节点。

```js
{
  type: "FunctionDeclaration",
  id: {
    type: "Identifier",
    name: "add"
  },
  params: [{
    type: "Identifier",
    name: "a"
  },{
    type: "Identifier",
    name: "b"
  }],
  body: {
    type: "BlockStatement",
    body: [{
      type: "ReturnStatement",
      argument: {
        type: "BinaryExpression",
        left: {
          type: "Identifier",
          name: "a"
        },
        operator: "+",
        right: {
          type: "Identifier",
          name: "b"
        }
      }
    }]
  }
}
```

于是我们从 `FunctionDeclaration` 开始并且我们知道它的内部属性（即：`id`，`params`，`body`），所以我们依次访问每一个属性及它们的子节点。

接着我们来到 `id`，它是一个 `Identifier`。`Identifier` 没有任何子节点属性，所以我们继续。

之后是 `params`，由于它是一个数组节点所以我们访问其中的每一个，它们都是 `Identifier` 类型的单一节点，然后我们继续。

此时我们来到了 `body`，这是一个 `BlockStatement` 并且也有一个 `body`节点，而且也是一个数组节点，我们继续访问其中的每一个。

这里唯一的一个属性是 `ReturnStatement` 节点，它有一个 `argument`，我们访问 `argument` 就找到了 `BinaryExpression`。.

`BinaryExpression` 有一个 `operator`，一个 `left`，和一个 `right`。 Operator 不是一个节点，它只是一个值因此我们不用继续向内遍历，我们只需要访问 `left` 和 `right`。.

Babel 的转换步骤全都是这样的遍历过程。