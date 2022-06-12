<template>

  <div class="content">
    <div class="app-stencil" ref="stencilContainer">
    </div>
    <div class="app-content" ref="container">
    </div>
  </div>
  <el-dialog v-model="dialogShow">
    <el-form>
      <el-form-item
          v-for="(item, index) in menuForm"
          :key="index"
          :label="item.label"
          v-model="item.value"
          :prop="item.label"
      >
        <el-input v-model="item.value" />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import {Graph, Shape, Addon} from '@antv/x6';
import {graphOptions, buildMyRect} from "@/config/graphConfig";
const {Stencil} = Addon

const {Circle} = Shape
export default {
  name: 'hello-world',
  data() {
    return {
      components: [
        {
          compName: 'Comp A',
          compDesc: 'Component A',
          params: "A`A`^\\d{1-3}$~B`B`^[a-z]{1-3}",
          ports: "1|2|-1"
        }
      ],
      menuForm: [],
      dialogShow: false
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const graph = new Graph({
        container: this.$refs.container,
        ...graphOptions
      })
      const vue = this
      // 边可以移动
      graph.on('edge:mouseenter', ({cell}) => {
        cell.addTools([
          'source-arrowhead',
          {
            name: 'target-arrowhead',
            args: {
              attrs: {
                fill: 'red',
              },
            },
          },
        ])
      })

      graph.on('edge:mouseleave', ({cell}) => {
        cell.removeTools()
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

      graph.on('node:delete', ({view, e}) => {
        e.stopPropagation()
        view.cell.remove()
      })

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
      const mouseEnter = ({cell}) => {
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
                  // 这里的this是当前NodeView
                  const { cell } = this
                  console.log(cell.store.data.inParams, vue)
                  vue.menuForm = cell.store.data.inParams
                  vue.dialogShow = true
                }
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
      graph.on('cell:mouseleave', ({cell}) => {
        console.log('鼠标移出', cell.shape)
        if (cell.shape === 'my-rect') {
          cell.removeTools()
        }
      })
      const comps = []
      this.components.forEach(c => {
        const outPorts = []
        c.ports.split('|').forEach(port => {
          outPorts.push({
            id: port,
            group: 'out',
            attrs: {
              text: {
                text: port
              }
            }
          })
        })
        const inParams = []
        c.params.split("~").forEach(p => {
          const [label, value, regex] = p.split("`");
          inParams.push({
            label,
            value,
            regex
          })
        })
        const comp = buildMyRect(graph, {
          label: c.compName,
          bgColor: '#31D0C6',
          outPorts,
          inParams,
          compName: c.compName,
          compDesc: c.compDesc
        })
        comps.push(comp);
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


      this.$refs.stencilContainer.appendChild(stencil.container);

      stencil.load(comps);
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

