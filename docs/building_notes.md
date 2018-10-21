记录构建过程中的问题和解决策略
==============================

构建
----
1. 启用`PostCSS`

    为了使用`cssnext`和将变量引入选择器命名而决定使用`PostCSS`。
    
    首先在`package.json`中的`browserslist`字段标记项目的目标浏览器集合，它也会被`Autoprefixer`用到。
    
    `Autoprefixer`是一个为CSS属性添加适当的浏览器厂商前缀的`PostCSS`插件。
    
    为了在`webpack`工作流中引入`PostCSS`需要安装`webpack`插件`postcss-loader`。
    
    使用`postcss-load-config`可以生成postcss-loader的配置，配置选项和插件。
    
    `postcss-loader`的配置写在`postcss.config.js`中，`.postcssrc`中或是`package.json`的`postcss`字段。
    
    当然也可以在`webpack.config.js`中post-loader插件处传入插件参数。
    
    `PostCSS`的本质是利用`JavaScript`去干预`CSS`，其他的`PostCSS`插件还有：
    
    * `Stylelint`是基于`PostCSS`的CSS语法检查插件。
    * `LostGrid`是用`calc()`实现Grid布局的`PostCSS`插件。
    * `cq-polyfill`则以一种新颖的方式实现盒子的尺寸查询。
    * `postcss-autoreset`会给你的样式属性里的所有出现的选择器加一大长串`initial`属性。
    * `postcss-initial`与`postcss-autoreset`类似，可以和`postcss-autoreset`一起使用。
    * `postcss-modules`会为选择器创建作用域。
    * `postcss-epub`为CSS 3的epub相关属性补齐`-epub-`前缀。
    * `postcss-short`提供常用样式的简写。
    * `postcss-preset-env`是`cssnext`的下一代，提供更全面的面向未来的CSS属性，于是`cssnext`就被果断放弃了。
    
    不过最后没有用`postcss-preset-env`，而是用了`PreCSS`这款PostCSS插件，它是基于`postcss-preset-env`构建的。
    
    当然`webpack`不能直接转译`PreCSS`，需要在`postcss.config.js`中为`postcss-loader`配置`PreCSS`插件。
    
    但是我所用的编辑器和`Stylelint`并不直接支持`PreCSS`语法，但好在`PreCSS`的语法与`Sass`的`SCSS`语法类似。
    
    `Sass`和`Less`、`Stylus`一样，都是CSS预处理语言，都有自己的文件格式，都需要转译。
    
    同时`SCSS`是`Sass`的两种语法版本之一，是对CSS的扩充，`SCSS`文件的后缀名为`scss`。
    
    于是在vue单文件组件中设置`<style scoped lang="scss">`即可使用`SCSS`的语法来检查`PreCSS`。
    
    为了让`stylelint`支持`SCSS`语法，需要安装`stylelint-scss`。
    
    最后用`stylelint-config-recommended-scss`导入`SCSS`的推荐配置。
    
    后记：`PreCSS`不能正常转换`hwb()`等函数，`postcss-preset-env`也不行，最后还是用了`cssnext`。
    
    即最后的工具链为`SCSS` + `PostCSS` + `postcss-cssnext` + `stylelint`。
    
1. `webpackChunkName`无效

    原因是`.babelrc`中设置`comment`选项为`false`，将标记webpackChunkName的注释字段移去了。
    设置`"comments": true`或使用缺省值`true`即可。

1. `WARNING in chunk [mini-css-extract-plugin] Conflicting order between:...`

    原因是导入两个模块的顺序不同，需要手工调整import顺序。在本项目中暂未产生实质性影响，在多人合作中需要制定规则。
    
    本项目中的import顺序规定：
    
    在任何组件中，包含ScrollArea的组件（ArtistList、AlbumList和SongList等）和ScrollArea组件自身，
    必须在包含DiskCase的组件（AlbumListItem和PageHeader等）和DiskCase组件自身之前被import。
    
    后记：SongListItem在NormalButton之前，NormalButton在DialogBox之前。
    
    参考[这个链接](https://github.com/webpack-contrib/mini-css-extract-plugin/issues/250)。

1. 多了一些奇怪的chunk输出如`album~collection~search.js`

    这些是webpack 4的SplitChunksPlugin（默认开启）产生的公共代码，需要满足一定条件才会分割。与上一个WARNING无关。
    
    参考[这个链接](https://webpack.js.org/plugins/split-chunks-plugin/)。

1. 从Web App到Electron

    即使是开发模式，workbox-v3.6.2也会被输出在/dist目录下而不在内存中，而通过GenerateSW生成的sw依赖本地workbox。
    
    先把importWorkboxFrom: 'local'去掉，这样输出的文件全部以相对路径引入。
    
    产生的问题是在/artists页面引用的a.js会去/artists/a.js找，但是a.js是存放在全局的...于是publicPath必须是相对根目录的。
    
    于是设置publicPath为/dist/。此时在electron运行时会找不到入口资源，因为它的根目录是当前磁盘根目录。
    
    用Electron读取本地文件没有意义，想到用live-server来服务构建出来的文件。
    
    live-server，启动！
    
    嗯，可以读取。CWD是DDPlayer，入口是dist/index.html。
    
    接下来从electron中访问live-server提供的主页即可。
    
    后来发现完全可以用web-dev-server来代替，于是快乐地把live-server给remove了。
    
    虽然还不知道webpack提供的几个target选项的区别，但是发现electron.js本身可以用webpack来打包。
    
    这样就可以判断isProduction并且将node_modules打包进去了。
    
    由于electron-renderer部分为空，只需关注main部分。
    
    也许我会把webpack.config.js分为webpack.config.web.js和webpack.config.electron.main.js。

    target的作用似乎是允许webpack少打包一些运行环境本就会提供的东西，如node环境的fs，electron环境的electron。（待验证）
    
    后记：尝试用自定义protocol的方式加载资源文件却怎么也成功不了。

1. electron应用中是否还需要service worker？

    service worker能做到的事似乎electron都能做，并且electron有着更强大的原生交互能力。
    
    对我来说我只是用到了electron的跨平台一致性，无需为了充分发挥electron的能力而放弃service worker。
    
    https://youmightnotneedelectron.com/

脚本
----

1. `[Vue warn]: Failed to mount component: template or render function not defined.`

    发生在VueRouter和空组件共用时，原因未知，希望后期会自然解决。
    
    后记：原因是VueRouter中import组件写法的问题，与空组件无关：
    
    ```diff
    - const Discover = import('./views/discover.vue');
    + import Discover from './views/discover.vue';
    + // 动态引入
    + // const Discover = () => import('./views/discover.vue');
    ```

1. 绑定地址栏的锚点与UI状态

    我希望用右上角的专辑图片来控制单曲页的显示与隐藏，并且将单曲页的显示状态与地址栏的`#single`绑定。
    
    但是`Vue`似乎并不能监视`window.location和window.location.hash`。
    
    为了响应用户直接修改锚点，我不得不手动监听`hashchange`事件。
    
    要做的事有四件：

    1. 响应`hashchange`事件，不管是不是我主动修改的，拉取地址栏中的`hash`并更新`hash`和`showSingle`即可。
    1. 响应鼠标单击事件，修改状态`showSingle`，保存`hash`值并更新至地址栏。
    1. 将状态`showSingle`与UI用`v-show`绑定（暂不考虑过渡，直接显示/隐藏）。
    1. 在程序运行时初始化`hash`和`showSingle`，可以在`data`里直接做掉。
    
    由于我引入了`VueRouter`，可以监视`$route`变量来代替`hashchange`事件的监听。

1. 按钮在激活状态时改变内部的图标样式

    VueRouter会在激活的路由按钮上绑定一个事件，但是没有提供可以注入这个事件的钩子，我必须手动监视DOM的classList。
    
    数据驱动的思想将你和DOM隔离，很难直接监视classList（我尝试了无数watch参数都失败了），最后我选择了监视$route变量。
    
    然而Vue的Virtual DOM机制让你没法直接在$route变化之后拿到更新后的DOM。
    
    要么用setTimeout，要么用Vue提供的$nextTick方法，我选择了后者。

1. <slot>与作用域插槽

    以优雅的方式实现组件功能，应使用<slot>来从父元素向子组件嵌入动态内容。
    
    当父元素的动态内容依赖子组件的内部状态时，可以使用作用域插槽（已更名为slot-scope）以在父元素作用域中获得子组件参数。
    
    在子组件中使用v-bind来向父元素作用域传递参数。

1. ProgressBar 进度条组件 TODO more API props

    1. API pros：父组件传入最大值total、当前值value、进度条宽度width和指示是否渲染FloatBox的布尔值extra。
    
        当前值改变时将驱动样式变化，播放头及其下方浮动框的位置将改变。
        
        进度条宽度用于计算时间，也用于动态改变进度条样式宽度。
    
    1. API events：可能向父组件激发seek和commit事件。seek事件表示用户正在滑动进度条，commit表示用户结束滑动，值已固定。
    
    1. API slot：默认slot，将被传入FloatBox组件作为播放头下方浮动框的内容。
    
    1. Interaction Seek：提供进度条的跳转交互功能。
    
        1. 在进度条任意位置单击，播放头立即跳转到此处。
        
        1. 拖动播放头，播放头和浮动框跟随移动；释放播放头，立即跳转到该时间点并保持播放状态。
        
        编写自定义指令v-drag，这是一个复杂侦听器，为元素创建mousedown等一系列条件侦听器并智能移除。
        
        mousedown触发后，回调函数为document添加mousemove和mouseup侦听器，并在mouseup回调中移除mousemove和mouseup侦听器。
        
        在mousedown、mousemove和mouseup三个事件中，触发传入的对应的钩子函数，将原生事件event作为参数。
        
        1. 在mousedown的钩子函数中，在属性drag中设置isDragging、drag起始点的页面位置并保存光标相对命中元素的位置。
        
            计算光标相对命中元素的位置时，由于FireFox对offsetX支持不是很好，这里使用getBoundingClientRect()来代替。
        
            这个方法的性能不是很高，好在这里不是频繁调用。光标相对命中元素的位置保存为savedWidth。
            
        1. 在mousemove的钩子函数中，用事件触发的页面位置（即光标当前位置）与记录的起始位置作差。
        
            保存这个相对位置差为deltaX。最后计算跳转目标位置的值，放入seek事件向父组件激发事件。
        
        1. 在mouseup的钩子函数中同样计算一次deltaX，计算目标位置的值并激发commit事件。最后重置相关变量。
        
        1. 后记：无需使用startX和deltaX，直接根据鼠标位置去更新进度条宽度就可以了。
        
        1. 绑定的计算属性visualWidth会根据当前是否处于Drag状态（根据isDragging），来显示相应的进度条进度。
            
            非Drag状态下根据动态传入的value计算当前播放进度。
            
            Drag状态下使用savedWidth和deltaX计算将要跳转的目标位置的播放进度。
            
        1. visualWidth还被使用在浮动框的定位中，浮动框不应超过应用界面的边界，所以它的margin-left应设定阈值。
    
    1. Interaction Hover：提供进度条的悬停交互功能。
    
        1. 光标移入进度条范围，播放头显示，进度条变粗，浮动框显示。
        
        1. 光标移出进度条范围（扩大），播放头、进度条和浮动框恢复。
        
        1. 在Seek过程中即使光标不慎移出进度条范围，悬停状态也不会立即消失。
        
        选择使用JS来监听mouseenter和mouseleave事件，没有使用CSS的原因是这里有更加复杂的逻辑。
        
        理论上鼠标移入时设置isHovering为true，移出时设置为false，但是drag交互使得这里变得复杂。
        
        引入needUpdate，在在Seek过程中光标不慎移出进度条范围时设置为true，在drag结束事件mouseup中检查这个值。
        
        若needUpdate为true，需要将鼠标移出范围时没有更新的isHovering设置为false，同时将needUpdate自身复位。
        
        若needUpdate为false，则说明拖拽播放头过程中鼠标没有移出范围，isHovering将在mouseleave事件中更新。
    
1. 频谱图绘制

    利用了SVG的绘制方法和参数，详细的过程写在行间注释中了，参考star.vue。

1. slot中的事件传递

    slot不能接收事件。用provide和inject解决了。

1. 数据变化导致DOM样式变化，为了监听DOM属性，用updated钩子函数即可。

1. Vuex模块化之后并使用mapActions映射命名空间后导致WebStorm无法正确识别函数签名
    
    只能不用mapActions，手写命名空间了，还好量不算大。

1. Array.prototype.map(fn)的返回值

    Array.prototype.map(fn)的返回值是所有fn的返回值组成的数组。

1. CORS在开发环境中捣乱：Workbox缓存策略不建议在CacheFirst下缓存异域资源

    解决方法是设置cacheableResponse以强行存入缓存，生产环境中本就是同域，不受影响。

1. 在开发环境下webpack输出目录为/dist/，导致service worker注册位置不在顶级

    解决方法是在webpack的devServer选项中增加headers配置，为所有响应添加Service-Worker-Allowed头，就允许将sw设置在'/'。

1. 基于OAuth 2.0的OpenID

    response_mode只能为fragment或form_post，query和web_message不可用
    
    为什么可以一下子拿到code和id_token？
    因为这是Hybrid模式，id_token交给后端去安全地换取用户信息。授权码模式中只有code。
    
    state用于防范CSRF攻击？
    state在攻击者替换掉返回的认证信息以获得之后用户输入的私密信息的情况中做防范。实际中可以省略。
    通常在全站使用加密的state与后端通信以避免CSRF，意味着后端在redirect_uri会做state检查，
    这时这个state必须写入redirect_uri，如果没有state检查，则这个redirect_uri可能受到CSRF攻击，
    如被攻击者跨站提交自己的认证token。
    
    nonce是否可以省略？
    nonce会被加密进token，因而将session和token进行绑定。实际中却不允许省略

样式
----
1. 三栏布局，两栏固定的实现

    父元素定高，所有子元素高度100%，宽度方面有两种方案：
    
    1. 父元素无宽度并用`white-space: nowrap;`阻止子元素换行，数个固定宽度的子元素设置`display: inline-block;`。
        要注意的是子元素的`vertical-align`应设为`top`或`bottom`，改变缺省的`baseline`对齐方式。
    1. 父元素定宽，两个定宽的栏目设置`float: right;`和固定宽度，剩下一个元素用缺省宽度值`auto`和`margin-right`来定宽。
    
    选用的方案是1，因为1在调整动态宽度时需要修改的元素更少，并且2的实现中需要打乱栏目在文档流中的顺序，与层叠顺序不符。

1. rem单位

    rem单位是为了页面字号缩放考虑的，但是否使用rem单位是要看情况的，icon型的文本用固定值即可。

1. 颜色

    在Sass中创建了从PhotoShop中的hsb颜色到CSS 3支持的hsla颜色的转换函数，再由Sass将hsla转换至十六进制颜色。
    
    使用hsb是因为在hsb空间下能更好地看到颜色之间的关系。

1. 约束

    父组件中指定子组件的margin尺寸，子组件的border和padding在子组件中定义，外形尺寸视情况而定。

1. ProgressBar 进度条组件

    1. DOM结构为：根元素progress-bar，子元素为progress-bar-main和progress-bar-float-box，均为div元素。
    
    1. progress-bar
        
        进度条底色用progress-bar的background绘制，并用伪元素来扩大可选区域提高易用性。
        
        自身使用relative定位，创建一个BFC，使外界元素无法干扰内部的同时为绝对定位的伪元素提供定位空间。
        
        伪元素使用:before + absolute + width 100% + 定高 + top + transform的组合：
        
        1. :after会画在所有子元素下方，这样一来可选区域变得过大了。
        
        1. :before + display block会将子元素往下挤，所以用了absolute。
        
        1. 100% width使伪元素得到全幅的父元素宽度，模拟display block的流动性。
        
        1. 定高会因鼠标移入而增大，同样是为了提高易用性，让进度条没那么容易隐藏。
        
        1. top和transform组合使用，使伪元素位于父元素垂直正中的位置。
    
    1. progress-bar-main
        
        根据当前值与最大值形成的百分比和进度条总宽度得到前景色的宽度，用progress-bar-main的border-top绘制。
        
        progress-bar-main的content-box呈透明，用于创建与progress-bar-float-box的边距。
        
        播放头用progress-bar-main:after的border-radius绘制一个空心圆形，用background填充底色，其余全部用box-shadow实现。
        
        定位方面用absolute + right 0 + top + transform向左侧偏移半个身位，向上移动到自身中心与父元素中心对齐。
        
        其中水平方向absolute + right 0 + transform的部分，用relative + left 100% + transform也可以达到同样效果。
        
        默认状态下伪元素content为none，只要在hover状态下设置任意content字符串即可使它出现，无需使用display none。
        
        最后对伪元素设置cursor pointer提高易用性和一层透明边框来扩大点击区域（事实上整个进度条都是可交互的）。
    
    1. progress-bar-float-box
    
        使用了FloatBox组件，设置position absolute来覆盖在progress-bar:before之上，因为FloatBox不应参与进度条的交互。
        
        FloatBox的定位使用margin-left即可轻松解决，它的值是由JS动态计算的。

1. FloatBox 浮动盒组件

    提供五种方向选项：top，bottom，left，right，none。
    
    前四种使用position absolute，父元素应提供BFC（relative定位等）以供相对定位。none为无定位，以普通block和static呈现。
    
    以top方向选项为例
    
    1. FloatBox会与父元素BFC的水平中线对齐，这是使用position absolute + left + transform实现的。
    
    2. FloatBox移动到父元素下方并与父元素保持距离，这是通过position absolute + top + margin-top实现的。
    
    3. 如果开启drawTriangle，则在FloatBox的top边框处绘制一个小三角指向父元素，这是通过伪元素实现的。

1. 图标 + 字同行的实现

    有两种方案：
    
    1. 均设置display: inline-block即可。
    
    1. 图标元素设置float: left，并添加合适的margin即可。

1. 专辑封面

    使用伪元素实现，使用百分比作为尺寸单位之后可以自适应父元素尺寸

1. 控制区的布局实现

    参考[这个链接](https://www.zhangxinxu.com/wordpress/2016/04/css-writing-mode/)。

1. 不使用position: absolute实现右上角对齐

    目的是根据块级父元素的content-box的右上角对齐，则不能使用absolute（会按照padding-box对齐）。
    
    解决方法是height: 0 + text-align: right。

1. 适应容器高度的可滚动区域

    实现方法有4种：
    
    1. writing-mode配合float
    
    1. position: absolute和定位
    
    1. writing-mode配合display:flex（未验证）
    
    1. JS控制
    
    最终选用了4，因为它对现有代码的侵入性小，并且这几种方法的不优雅程度大同小异。利用store存储全局尺寸状态可使代码简洁。

1. 图标和文字并排内联时的样式

    是个棘手的问题，有很多SVG图标和文字共同出现的场景，每次都需要手动调整，灵活性不高，若有机会应该进行重构。