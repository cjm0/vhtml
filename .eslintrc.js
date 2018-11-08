/*
    规则对照
        https://cloud.tencent.com/developer/section/1135693

    eslint-plugin-vue
        vue rule https://blog.csdn.net/qq_30817073/article/details/78043553

    eslint js
        https://github.com/standard/standard/blob/master/docs/RULES-zhcn.md eslint规则
        https://eslint.org/docs/rules/handle-callback-err
*/


module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint'
    },
    env: {
        browser: true,
    },
    extends: [
        // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
        // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
        'plugin:vue/essential',
        // https://github.com/standard/standard/blob/master/docs/RULES-en.md
        'standard'
    ],
    plugins: [ // required to lint *.vue files
        'vue'
    ],
    rules: {
        // off warn error 0 1 2
        'vue/no-dupe-keys': 0, // 禁止重复的二级键名
        'vue/no-async-in-computed-properties': 0, // 计算属性禁止包含异步方法
        'vue/no-side-effects-in-computed-properties': 0, // 禁止在计算属性中对属性修改
        'vue/no-reserved-keys': 0, // 下划线属性

        'vue/require-prop-types': 0, // prop 必须有类型限制
        'vue/require-valid-default-prop': 2, // prop 的默认值必须匹配它的类型
        'vue/html-quotes': 2, // html 属性值必须用双引号括起来


        'generator-star-spacing': 0, // allow async-await
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0, // allow debugger during development
        'no-unused-vars': 2, // 不要定义未使用的变量
        'no-const-assign': 2, // 避免修改使用 const 声明的变量
        'no-ex-assign': 2, // catch 中不要对错误重新赋值
        'no-fallthrough': 2, // switch 一定要使用 break 来将条件分支正常中断
        'no-func-assign': 2, // 避免对声明过的函数重新赋值
        'no-global-assign': 2, // 不要对全局只读对象重新赋值
        'no-new-require': 2, // 禁止使用 new require
        'no-redeclare': 2, // 不要重复声明变量
        'no-self-assign': 2, // 避免将变量赋值给自己
        'no-return-assign': 2, // return报表中不使用赋值被认为是最佳做法
        'no-self-compare': 2, // 避免将变量与自己进行比较操作
        'no-template-curly-in-string': 2, // 正确使用 ES6 中的字符串模板
        'no-unreachable': 2, // return，throw，continue 和 break 后不要再跟代码
        'no-whitespace-before-property': 2, // 属性前面不要加空格
        'no-unreachable': 2, // 不能有无法执行的代码
        'no-unused-expressions': 2, // 禁止无用的表达式

        'indent': [0, 4], // 四个空格
        'quotes': [0, 'single'], // 使用单引号
        'no-alert': 1, // alert
        'no-console': 0, // 提示console
        'no-unneeded-ternary': 1,//禁止不必要的嵌套 var isYes = answer === 1 ? true : false;
        'no-multi-str': 2,//字符串不能用\换行
        'keyword-spacing': 1, // 关键字后面加空格
        'comma-spacing': 1, // 逗号后面加空格
        'brace-style': 1, // else 关键字要与花括号保持在同一行
        'curly': 1, // 多行 if 语句的的括号不能省
        'no-negated-in-lhs': 1, // 在in操作符左边的操作项不能用! 例如这样写不对的：if ( !a in b) { //dosomething }
        'no-obj-calls': 1, // 禁止把全局对象当函数调用，比如下面写法错误的：Math(), JSON()
        'operator-linebreak': 1, // 对于三元运算符 ? 和 : 与他们所负责的代码处于同一行
        'comma-style': 1, // 始终将逗号置于行末
        'func-call-spacing': 1, // 函数调用时标识符与括号间不留间隔
        'key-spacing': 1, // 键值对当中冒号与值之间要留空白
        'new-cap': 1, // 构造函数要以大写字母开头
        'new-parens': 1, // 无参的构造函数调用时要带上括号
        'one-var': 1, // 每个 var 关键字单独声明一个变量
        'no-array-constructor': 1, // 使用数组字面量而不是构造器
        'no-class-assign': 1, // 避免对类名重新赋值
        'no-delete-var': 1, // 不要对变量使用 delete 操作
        'no-dupe-args': 1, // 不要定义冗余的函数参数
        'no-dupe-class-members': 1, // 类中不要定义冗余的属性
        'no-dupe-keys': 1, // 对象字面量中不要定义重复的属性
        'no-duplicate-case': 1, // switch 语句中不要定义重复的 case 分支
        'no-duplicate-imports': 1, // 同一模块有多个导入时一次性写完
        'no-empty-pattern': 1, // 不要解构空值
        'no-eval': 1, // 不要使用 eval()
        'no-extra-boolean-cast': 1, // 避免不必要的布尔转换
        'no-floating-decimal': 1, // 不要省去小数点前面的0
        'no-invalid-regexp': 1, // 不要向 RegExp 构造器传入非法的正则表达式
        'no-irregular-whitespace': 1, // 不要使用非法的空白符
        'no-iterator': 1, // 禁止使用 __iterator__
        'no-label-var': 1, // 外部变量不要与对象属性重名
        'no-lone-blocks': 1, // 不要书写不必要的嵌套代码块
        'no-mixed-spaces-and-tabs': 1, // 不要混合使用空格与制表符作为缩进
        'no-multi-spaces': 1, // 除了缩进，不要使用多个空格
        'no-octal': 1, // 不要使用八进制字面量
        'no-path-concat': 1, // 使用 __dirname 和 __filename 时尽量避免使用字符串拼接
        'no-proto': 1, // 使用 getPrototypeOf 来替代 __proto__
        'no-regex-spaces': 1, // 正则中避免使用多个空格
        'no-this-before-super': 1, // 使用 this 前请确保 super() 已调用
        'no-throw-literal': 1, // 用 throw 抛错时，抛出 Error 对象而不是字符串
        'no-undef-init': 1, // 不要使用 undefined 来初始化变量
        'no-unmodified-loop-condition': 1, // 循环语句中注意更新循环变量
        'no-useless-rename': 1, // import, export 和解构操作中，禁止赋值到同名变量
        'no-useless-escape': 1, // 禁止不必要的转义
        'no-with': 1, // 禁止使用 with
        'space-unary-ops': 1, // 一元运算符后面跟一个空格
        'spaced-comment': 1, // 注释首尾留空格
        'rest-spread-spacing': 1, // 展开运算符与它的表达式间不要留空白
        'use-isnan': 1, // 检查 NaN 的正确姿势是使用 isNaN()
        'valid-typeof': 1, // 用合法的字符串跟 typeof 进行比较操作
        'semi-spacing': 1, // 遇到分号时空格要后留前不留
        'padded-blocks': 1, // 代码块中避免多余留白
        'object-property-newline': 1, // 对象属性换行时注意统一代码风格
        'camelcase': [1, {properties: 'never'}], // 对于变量和函数名统一使用驼峰命名法 对属性字段不做限制
        'no-unexpected-multiline': 1, // 不要使用 (, [, or ` 等作为一行的开始。在没有分号的情况下代码压缩后会导致报错，而坚持这一规范则可避免出错。

        'object-curly-spacing': 0,
        'eqeqeq': 0, // 始终使用 === 替代 ==  
        'no-extend-native': 0, // 不要扩展原生对象
        'space-infix-ops': 0, // 操作符左右必须有空格, const ret = 'hello' + 'world';
        'no-extra-semi': 0, // 多余的冒号
        'space-before-function-paren': 0, // 函数声明时括号与函数名间加空格
        'no-undef': 0, // 使用浏览器全局变量时加上 window. 前缀
        'block-spacing': 0, // 单行代码块两边加空格
        'no-cond-assign': 0, // 条件语句中赋值语句使用括号包起来
        'comma-dangle': 0, // 不允许有多余的行末逗号
        'dot-location': 0, // 点号操作符须与属性需在同一行
        'eol-last': 0, // 文件末尾留一空行
        'accessor-pairs': 0, // 对象中定义了存值器，一定要对应的定义取值器
        'constructor-super': 0, // 子类的构造器中一定要调用 super
        'no-caller': 0, // 避免使用 arguments.callee 和 arguments.caller
        'no-constant-condition': 0, // 避免使用常量作为条件表达式的条件（循环语句除外）
        'no-control-regex': 0, // 正则中不要使用控制符
        'no-debugger': 0, // 不要使用 debugger
        'no-empty-character-class': 0, // 正则中不要使用空字符
        'no-extra-bind': 0, // 避免多余的函数上下文绑定
        'no-extra-parens': 0, // 不要使用多余的括号包裹函数
        'no-inner-declarations': 0, // 嵌套的代码块中禁止再定义函数
        'no-multi-str': 0, // 不要使用多行字符串
        'no-new-object': 0, // 禁止使用 Object 构造器
        'no-sequences': 0, // 避免使用逗号操作符
        'no-trailing-spaces': 0, // 行末不留空格
        'no-unneeded-ternary': 0, // 如果有更好的实现，尽量不要使用三元表达式
        'no-unsafe-negation': 0, // 关系运算符的左值不要做取反操作
        'no-useless-call': 0, // 避免不必要的 .call() 和 .apply()
        'no-useless-computed-key': 0, // 避免使用不必要的计算值作对象属性
        'space-before-blocks': 0, // 代码块首尾留空格
        'space-in-parens': 0, // 圆括号间不留空格
        'template-curly-spacing': 0, // 模板字符串中变量前后不加空格
        'wrap-iife': 0, // 自调用匿名函数 (IIFEs) 使用括号包裹
        'yield-star-spacing': 0, // yield * 中的 * 前后都要有空格
        'yoda': 0, // 请书写优雅的条件语句（avoid Yoda conditions）
        'semi': 0, // 不要使用分号
        'no-multiple-empty-lines': 0, // 不允许有连续多行空行
        'vetur-validation-template': 0, // Elements in iteration expect to have 'v-bind:key' directives  
        'no-tabs': 0, // Unexpected tab character 
        'no-new': 0, // new 创建对象实例后需要赋值给变量 new Vue() 允许单独用
    }
}