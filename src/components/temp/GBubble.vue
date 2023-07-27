<template>
    <div ref="GDom"></div>
</template>

<script lang="ts" setup>
import G6, { IG6GraphEvent, Item } from '@antv/g6';
import { onMounted, ref } from 'vue';
const props = defineProps({
    datas: {
        type: Object as () => {
            [x: string]: any;
            name: string;
            value: string;
        }[],
    }
})
const GDom = ref<HTMLElement>()
function _defineProperty(obj: { [x: string]: any; }, key: PropertyKey, value: any) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value,
            enumerable: true,
            configurable: true,
            writable: true,
        });
    } else {
        obj[key as string] = value;
    }
    return obj;
}

const colors = [
    '#5c7bd9',
    '#fac858',
    '#91cc75',
    '#ee6666',
    '#F6C3B7',
    '#B6E3F5',
    '#D3C6EA',
    '#FFD8B8',
    '#AAD8D8',
    '#FFD6E7',
];
const strokes = [
    '#5B8FF9',
    '#5AD8A6',
    '#5D7092',
    '#F6BD16',
    '#E8684A',
    '#6DC8EC',
    '#9270CA',
    '#FF9D4D',
    '#269A99',
    '#FF99C3',
];

interface INode {
    id: string;
    label: string;
    oriLabel?: string;
    value: number;
    cluster: string;
    description: string;
    subCluster?: string;
    size?: number;
    oriSize?: number;
    style?: {
        fill?: string;
        stroke?: string;
        [key: string]: any;
    };
    x?: number;
    y?: number;
    [key: string]: any;
}

interface IData {
    nodes: INode[];
    edges: {
        source: string;
        target: string;
    }[];
}

const data: IData = {
    nodes: [
        ...(props.datas ?? []).map((item): INode => {
            return {
                id: item.name,
                label: `${item.name}: ${item.value}`,
                value: +item.value,
                cluster: item.name,
                description: item.desc,
                labelCfg: {
                    style: {
                        fill: '#fff',
                        fontWeight: "bold",
                        fontSize: 18,
                        // y: -15,
                    },
                }
            };
        }),
    ],
    edges: [],
};
onMounted(() => {
    const container = GDom.value;
    const width = container!.scrollWidth;
    const height = (container!.scrollHeight || 500) - 20;

    const graph = new G6.Graph({
        container: GDom.value!,
        width,
        height,
        layout: {
            type: 'force',
            nodeStrength: 0,
            collideStrength: 1,
            alphaDecay: 0.01,
            preventOverlap: true,
        },
        modes: {
            default: ['drag-node'],
        },
        defaultNode: {
            // size: [100, 100],
        },
    });

    // mapping
    const nodes = data.nodes;
    const nodeMap = new Map();
    const clusterMap = new Map();
    let clusterId = 0;
    nodes.forEach((node) => {
        nodeMap.set(node.id, node);
        // cluster
        if (node.cluster && clusterMap.get(node.cluster) === undefined) {
            clusterMap.set(node.cluster, clusterId);
            clusterId++;
        }
        const cid = clusterMap.get(node.cluster);
        if (!node.style) node.style = {};
        node.style.fill = colors[cid % colors.length];
        node.style.stroke = strokes[cid % strokes.length];
        node.x = width / 2 + 200 * (Math.random() - 0.5);
        node.y = height / 2 + 200 * (Math.random() - 0.5);
    });

    // map the value to node size
    let maxNodeValue = -9999,
        minNodeValue = 9999;
    nodes.forEach(function (n) {
        if (maxNodeValue < n.value) maxNodeValue = n.value;
        if (minNodeValue > n.value) minNodeValue = n.value;
    });
    const nodeSizeRange = [40, 120];
    const nodeSizeDataRange = [minNodeValue, maxNodeValue];
    scaleNodeProp(nodes, 'size', 'value', nodeSizeDataRange, nodeSizeRange);

    nodes.forEach(function (node) {
        node.oriSize = node.size;
        node.oriLabel = node.label;
    });


    graph.on('node:dragstart', function (e) {
        graph.layout();
        refreshDragedNodePosition(e);
    });
    graph.on('node:drag', function (e) {
        refreshDragedNodePosition(e);
    });
    graph.on('node:dragend', function (e) {
        e.item!.get('model').fx = null;
        e.item!.get('model').fy = null;
    });
    graph.on('node:click', function (e) {
        const node = e.item;
        const states = node?.getStates();
        let clicked = false;
        const model = node?.getModel();
        let size = 200;
        let labelText = '规模类型: ' + model?.id + '\n' + model?.description;
        let fontSize = 20;
        states?.forEach(function (state) {
            if (state === 'click') {
                clicked = true;
                size = model?.oriSize as number;
                labelText = model?.oriLabel as string;
                fontSize = 18;
            }
        });
        graph.setItemState(node as Item, 'click', !clicked);
        graph.updateItem(node as Item, {
            size,
            label: labelText,
            labelCfg: {
                style: {
                    fontSize: fontSize
                },
            }
        });
        graph.layout();
    });

    graph.data(data);
    graph.render();

    if (typeof window !== 'undefined')
        window.onresize = () => {
            if (!graph || graph.get('destroyed')) return;
            if (!container || !container.scrollWidth || !container.scrollHeight) return;
            graph.changeSize(container.scrollWidth, container.scrollHeight - 20);
        };
})
function refreshDragedNodePosition(e: IG6GraphEvent) {
    const model = e.item?.get('model');
    model.fx = e.x;
    model.fy = e.y;
}
function scaleNodeProp(elements: INode[], propName: string, refPropName: string, dataRange: number[], outRange: number[]) {
    const outLength = outRange[1] - outRange[0];
    const dataLength = dataRange[1] - dataRange[0];
    elements.forEach(function (n) {
        if (propName.split('.')[0] === 'style') {
            if (n.style) {
                n.style[propName.split('.')[1]] = ((n[refPropName] - dataRange[0]) * outLength) / dataLength + outRange[0];

            } else {
                n.style = _defineProperty(
                    {},
                    propName.split('.')[1],
                    ((n[refPropName] - dataRange[0]) * outLength) / dataLength + outRange[0],
                );
            }
        } else {
            n[propName] = ((n[refPropName] - dataRange[0]) * outLength) / dataLength + outRange[0];
        }
    });
}
</script> 

<style lang="less" scoped></style>