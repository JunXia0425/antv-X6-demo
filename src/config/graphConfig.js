const magnetAvailabilityHighlighter = {
    name: 'stroke',
    args: {
        padding: 3,
        attrs: {
            strokeWidth: 3,
            stroke: '#52c41a',
        },
    },
}

export const graphOptions = {
    grid: true,
    highlighting: {
        magnetAvailable: magnetAvailabilityHighlighter,
    },
    connecting: {
        snap: true, // 50px 自动吸附,
        allowBlank: false, // 不允许空链接
        allowEdge: false, // 不允许连接到边
        router: {
            name: 'manhattan', // 曼哈顿路由，边自动避让路过的节点，且边为垂直和水平
        },
        connector: {
            // name: 'rounded', // 圆滑拐角
            name: 'jumpover', // 跳线
            args: {
                radius: 10
            }
        },
        highlight: true,
        validateMagnet({ magnet }) {
            return magnet.getAttribute('port-group') !== 'in'
        },
        validateConnection({ sourceMagnet, targetMagnet }) {
            // 只能从输出链接桩创建连接
            if (!sourceMagnet || sourceMagnet.getAttribute('port-group') === 'in') {
                return false
            }

            // 只能连接到输入链接桩
            if (!targetMagnet || targetMagnet.getAttribute('port-group') !== 'in') {
                return false
            }

            return true
        }
    },
    snapline: {
        enabled: true,
        sharp: true,
    },
    scroller: {
        enabled: false,
        pageVisible: false,
        pageBreak: false,
        pannable: true,
    }
}

export const buildMyRect = (context, options) => {
    const { label, outPorts, bgColor, inParams, compName, compDesc } = options
    return context.createNode({
        shape: 'my-rect',
        label,
        attrs: {
            rect: {
                fill: bgColor
            }
        },
        ports: [...outPorts],
        inParams: [...inParams],
        compName,
        compDesc
    })
}
