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
          enabled: true,
          pageVisible: false,
          pageBreak: false,
          pannable: true,
        },
      })

      graph.on('node:delete', ({ view, e }) => {
        e.stopPropagation()
        view.cell.remove()
      })

      const stencil = new Stencil({
        title: 'Components',
        target: graph,
        search: true,
        collapsable: true,
        stencilGraphWidth: 200,
        stencilGraphHeight: 180,
        groups: [
          {
            name: 'group1',
            title: 'Group(Collapsable)',
          },
          {
            name: 'group2',
            title: 'Group',
            collapsable: false,
          },
        ],
      })


      this.$refs.stencilContainer.appendChild(stencil.container)

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

      const r3 = new Rect({
        width: 70,
        height: 40,
        attrs: {
          rect: {fill: '#31D0C6', stroke: '#4B4A67', strokeWidth: 1},
          text: {text: 'rect', fill: 'white'},
        },
      })

      const c3 = new Circle({
        width: 60,
        height: 60,
        attrs: {
          circle: {fill: '#FE854F', strokeWidth: 1, stroke: '#4B4A67'},
          text: {text: 'ellipse', fill: 'white'},
        },
      })

      stencil.load([r, c, c2, r2.clone()], 'group1')
      stencil.load([c2.clone(), r2, r3, c3], 'group2')
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

