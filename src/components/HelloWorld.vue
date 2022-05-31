<template>

  <div className="content">
    <div className="app-stencil" ref="stencilContainer">
    </div>
    <div className="app-content" ref="container">
    </div>
  </div>

</template>

<script>
import {Graph, Shape, Addon} from '@antv/x6';

const {Stencil} = Addon

const {Rect, Circle} = Shape

export default {
  name: 'hello-world',
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const graph = new Graph({
        container: this.$refs.container,
        grid: true,
        connecting: {
          snap: true, // 50px 自动吸附,
          allowBlank: false, // 不允许空链接
          allowEdge: false // 不允许连接到边
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
        },
      })

      // graph初始定义两个圆形，start&end
      const start = new Circle({
        id: 'start',
        x: 40,
        y: 40,
        width: 50,
        height: 50,
        label: 'Start',
        ports: [
          {
            id: 'start-port',
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            }
          }
        ]
      });

      const end = new Circle({
        id: 'end',
        x: 40,
        y: 300,
        width: 50,
        height: 50,
        label: 'End',
        ports: [
          {
            id: 'end-port',
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              }
            }
          }
        ]
      });

      graph.addNode(start)
      graph.addNode(end)

      graph.on('node:delete', ({ view, e }) => {
        e.stopPropagation()
        view.cell.remove()
      })

      // TODO 自定义连接桩布局bottom-inline
      // const bottomInline = (portsPositionArgs, elemBox) => {
      //   console.log(portsPositionArgs, elemBox)
      //   return {
      //     position: {
      //       x: 0,
      //       y: 0
      //     }
      //   }
      // }
      //
      // Graph.unregisterPortLabelLayout('bottom-inline')
      // Graph.registerPortLabelLayout('bottom-inline', bottomInline)

      Graph.unregisterNode('my-rect')
      // 定义并注册基类 MyRect
      Graph.registerNode('my-rect', {
        inherit: 'rect',
        width: 120,
        height: 100,
        attrs: {
          label: {
            fill: '#000',
            fontSize: 16
          }
        },
        ports: {
          groups: {
            in: {
              position: 'top',
              markup: {
                tagName: 'rect'
              },
              attrs: {
                rect: {
                  width: 10,
                  height: 10,
                  fill: '#e37650',
                  magnet: true,
                }
              }
            },
            out: {
              position: {
                name: 'bottom'
              },
              markup: {
                tagName: 'rect',
                selector: 'rect'
              },
              attrs: {
                rect: {
                  width: 10,
                  height: 10,
                  fill: '#0813ee',
                  magnet: true,
                }
              }
            }
          }
        }
      })

      // 给节点添加mouse-enter事件
      const mouseEnter = ({ cell }) => {
        if (cell.shape === 'my-rect') {
          console.log('tr')
          cell.addTools([
            {
              name: 'button',
              args: {
                markup: [
                  {
                    tagName: 'rect',
                    selector: 'button',
                    attrs: {
                      width: 20,
                      height: 10,
                      stroke: 'red',
                      strokeWidth: 2,
                      fill: '#ddd',
                      cursor: 'pointer',
                    },
                  },
                  {
                    tagName: 'text',
                    textContent: 'Edit',
                    selector: 'icon',
                    attrs: {
                      fill: '#ddd',
                      fontSize: 10,
                      textAnchor: 'middle',
                      pointerEvents: 'none'
                    },
                  },
                ],
                x: '90%',
                y: '80%',
                onClick() {
                  console.log('点点点')
                },
              }
            },
            {
              name: 'button-remove',
              args: {
                x: '100%',
                y: 0,
                offset: {
                  x: -10,
                  y: 10,
                }
              }
            }
          ])
        }
      }

      graph.on('cell:dblclick', () => {
        alert('双击打开dialog')
      })

      graph.on('cell:mouseenter', mouseEnter)
      graph.on('cell:mouseleave', ({ cell }) => {
        console.log('鼠标移出', cell.shape)
        if (cell.shape === 'my-rect') {
          cell.removeTools()
        }
      })

      const userStatus = graph.createNode({
        shape: 'my-rect',
        label: 'User Status',
        attrs: {
          rect: {
            fill: '#31D0C6'
          }
        },
        ports: [
          { id: 'i1', group: 'in' },
          { id: '0', group: 'out' },
          { id: '1', group: 'out' },
          { id: '2', group: 'out' },
        ]
      })

      const confirm = graph.createNode({
        shape: 'my-rect',
        label: 'Confirm',
        attrs: {
          rect: {
            fill: '#c68ade'
          }
        },
        ports: [
          { id: 'i1', group: 'in' },
          { id: '0', group: 'out' },
          { id: '1', group: 'out' },
          { id: '2', group: 'out' },
          { id: '3', group: 'out' }
        ]
      })

      const stencil = new Stencil({
        title: 'Components',
        target: graph,
        search: true,
        collapsable: true,
        stencilGraphWidth: 250,
        stencilGraphHeight: 800,
        layoutOptions: {
          columns: 1,
          resizeToFit: false,
          rowHeight: 150,
          center: true,
          marginX: 50
        }
      })


      this.$refs.stencilContainer.appendChild(stencil.container)


      stencil.on('node:mouseenter', (a,b,c) => {
        console.log('aaa', a,b,c)
      })

      const r = new Rect({
        width: 70,
        height: 40,
        attrs: {
          rect: {fill: '#31D0C6', stroke: '#4B4A67', strokeWidth: 1},
          text: {text: 'rect', fill: 'white'},
        },
        ports: [
          {
            id: 'port1',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                storke: '#31d0c6',
                strokeWidth: 2,
                fill: '#ffffff'
              },
              text: {
                text: 'out1'
              }
            }
          },
          {
            id: 'port2',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                storke: '#31d0c6',
                strokeWidth: 2,
                fill: '#ffffff'
              }
            }
          }
        ]
      })

      const c = new Circle({
        width: 60,
        height: 60,
        attrs: {
          circle: {fill: '#FE854F', strokeWidth: 1, stroke: '#4B4A67'},
          text: {text: 'ellipse', fill: 'white'},
        },
        ports: {
          groups: {
            in: {
              position: 'top',
              label: {
                position: 'inside'
              },
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: '#31d0c6',
                  strokeWidth: 2,
                  fill: '#fff',
                }
              }
            },
            // 输出链接桩群组定义
            out: {
              position: 'bottom',
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: '#31d0c6',
                  strokeWidth: 2,
                  fill: '#fff',
                }
              }
            }
          },
          items: [
            {
              id: 'port1',
              group: 'in',
              attrs: {
                text: {
                  text: 'in1'
                }
              }
            },
            { id: 'port2', group: 'out' },
          ]
        }
      })

      const c2 = new Circle({
        width: 60,
        height: 60,
        attrs: {
          circle: {fill: '#4B4A67', 'stroke-width': 1, stroke: '#FE854F'},
          text: {text: 'ellipse', fill: 'white'},
        },
      })

      const r2 = new Rect({
        width: 70,
        height: 40,
        attrs: {
          rect: {fill: '#4B4A67', stroke: '#31D0C6', strokeWidth: 1},
          text: {text: 'rect', fill: 'white'}
        },
        tools: [
          {
            name: 'button-remove',
            args: {
              x: '100%',
              y: '100%',
              offset: {
                x: -18,
                y: -18
              }
            }
          }
        ]
      })

      r2.attr({
        image: {
          event: 'node:delete',
          xlinkHref: '../../assets/logo.png',
          width: 20,
          height: 20
        }
      })

      stencil.load([userStatus, confirm, r, c, c2, r2.clone()])
    }

  }
}

</script>

<style scoped>

.content {
  font-family: sans-serif;
  display: flex;
}

.app-stencil {
  width: 250px;
  border: 1px solid #f0f0f0;
  position: relative;
}

.app-content {
  flex: 1;
  height: 520px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}

.x6-graph-scroller {
  border: 1px solid #f0f0f0;
  margin-left: -1px;
}
</style>

