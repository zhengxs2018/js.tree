import { defaultTo, isNil, get } from 'lodash';

/**
 * 根ID
 *
 * @public
 */
const ROOT_ID = '__root__';
/**
 * id 的属性名
 *
 * @public
 */
const ID_KEY = 'id';
/**
 * parentId 的属性名
 *
 * @public
 */
const PARENT_ID_KEY = 'parentId';
/**
 * 子级的属性名
 *
 * @public
 */
const CHILDREN_KEY = 'children';

/**
 * 类数组的 map 方法
 *
 * @public
 *
 * @param data         - 数结构数据
 * @param callback     - 处理回调，注意：如果返回的对象子级不存在将不进行递归操作
 * @param childrenKey  - 自定义子节点属性名称
 */
function map(data, callback, childrenKey = CHILDREN_KEY) {
    function iter(data, parents) {
        return data.map((node, index) => {
            const source = callback(Object.assign({}, node), index, parents);
            const children = iter(defaultTo(source[childrenKey], []), parents.concat(node));
            if (children.length > 0) {
                return Object.assign(Object.assign({}, source), { [childrenKey]: children });
            }
            // 递归并且浅拷贝
            return source;
        });
    }
    return iter(data, []);
}

/**
 * 遍历所有节点
 *
 * @public
 *
 * @param data         - 数结构数据
 * @param callback     - 处理回调，返回 true 将跳过子级的遍历操作
 * @param childrenKey  - 自定义子节点属性名称
 */
function each(data, callback, childrenKey = CHILDREN_KEY) {
    function iter(data, parents) {
        const items = [];
        data.forEach((node, index) => {
            if (callback(node, index, parents)) {
                return;
            }
            iter(defaultTo(node[childrenKey], []), parents.concat(node));
        });
        return items;
    }
    return iter(data, []);
}

/**
 * 类数组的 filter 方法
 *
 * @public
 *
 * @param data         - 数结构数据
 * @param callback     - 处理回调，注意：如果返回的对象子级不存在将不进行递归操作
 * @param childrenKey  - 自定义子节点属性名称
 */
function filter(data, callback, childrenKey = CHILDREN_KEY) {
    function iter(data, parents) {
        const items = [];
        data.forEach((node, index) => {
            if (callback(node, index, parents)) {
                items.push(Object.assign({}, node));
                return;
            }
            const children = iter(defaultTo(node[childrenKey], []), parents.concat(node));
            if (children.length > 0) {
                items.push(Object.assign(Object.assign({}, node), { [childrenKey]: children }));
            }
        });
        return items;
    }
    return iter(data, []);
}

/**
 * 排除某些数据
 *
 * @public
 *
 * @param data         - 数结构数据
 * @param callback     - 处理回调，返回 true 的数据将被过滤掉
 * @param childrenKey  - 自定义子节点属性名称
 */
function exclude(data, callback, childrenKey = CHILDREN_KEY) {
    function iter(data, parents) {
        const items = [];
        data.forEach((node, index) => {
            if (callback(node, index, parents)) {
                return;
            }
            // 判读是否存在子级
            const children = defaultTo(node[childrenKey], []);
            if (children.length === 0) {
                items.push(node);
                return;
            }
            const results = iter(children, parents.concat(node));
            if (results.length > 0) {
                items.push(Object.assign(Object.assign({}, node), { [childrenKey]: results }));
            }
        });
        return items;
    }
    return iter(data, []);
}

/**
 * 和 isNil 结果相反
 *
 * @param value - 需要检查的值
 */
function isNotNil(value) {
    return isNil(value) === false;
}
/**
 * 断言，模拟 node api
 *
 * @param value    - 断言结果
 * @param message  - 断言失败提示
 */
/* istanbul ignore next */
function assert(value, message) {
    if (value)
        return;
    if (message instanceof Error) {
        throw message;
    }
    throw new Error(message);
}
/**
 * 删除对象的 key，并返回它的值
 *
 * @param source       - 普通对象
 * @param key          - 属性名
 * @param defaultValue - 默认值
 */
function popKey(object, key, defaultValue) {
    const value = object[key];
    delete object[key];
    return defaultTo(value, defaultValue);
}
/**
 * 数据导出，允许外部自定义根节点
 *
 * @public
 *
 * @param nodes - 包含所有层级的数据
 * @param root  - 根节点，支持自定义函数
 */
function exporter(nodes, root) {
    if (typeof root === 'function') {
        return root(nodes) || [];
    }
    return nodes[defaultTo(root, ROOT_ID)] || [];
}

/**
 * 方便外部二次封装
 *
 * 如：封装一个类 jQuery 的 API 工具，方便查找节点
 *
 * @public
 *
 * @param data    - 行数据
 * @param options - 配置项
 */
function parse(data, options = {}) {
    const idKey = defaultTo(options.idKey, ID_KEY);
    const parentKey = defaultTo(options.parentKey, PARENT_ID_KEY);
    const childrenKey = defaultTo(options.childrenKey, CHILDREN_KEY);
    const transform = defaultTo(options.transform, (x) => x);
    const insert = defaultTo(options.insert, (siblings, node) => siblings.push(node));
    const nodes = {};
    const childNodes = {};
    data.forEach((row, i) => {
        // 获取节点ID
        const id = get(row, idKey);
        // id 必须存在
        assert(isNotNil(id), `id is required, in ${i}.`);
        // 数据结构转换
        const node = transform(row, i);
        // 支持过滤掉某些数据
        if (isNil(node))
            return;
        // 获取子级元素
        const children = childNodes[id];
        if (children) {
            // @ts-ignore
            node[childrenKey] = children;
        }
        else {
            childNodes[id] = node[childrenKey] = [];
        }
        // 获取上级节点ID
        //  注意: 不能使用 _.get 的 `defaultValue` 参数， 那个只有不存在 `key` 才会返回默认值
        const parentId = defaultTo(get(row, parentKey), ROOT_ID);
        // 获取同级元素
        const siblings = childNodes[parentId];
        if (siblings) {
            insert(siblings, node);
        }
        else {
            insert((childNodes[parentId] = []), node);
        }
        // 为了方便外部根据ID获取节点信息
        nodes[id] = node;
    });
    return {
        idKey,
        parentKey,
        childrenKey,
        nodes,
        childNodes,
    };
}

/**
 * 行转树
 *
 * @public
 *
 * @param data    - 行数据
 * @param options - 配置项
 */
function toTree(data, options = {}) {
    const { childNodes } = parse(data, options);
    return exporter(childNodes, defaultTo(options.root, ROOT_ID));
}

/**
 * 树转行
 *
 * @public
 *
 * @param data        - 树结构数据
 * @param childrenKey - children 属性名
 */
function toRows(data, childrenKey = CHILDREN_KEY) {
    const result = [];
    function callback(source) {
        const target = Object.assign({}, source);
        const children = popKey(target, childrenKey, []);
        result.push(target);
        children.forEach(callback);
    }
    data.forEach(callback);
    return result;
}

/**
 * 发布版本
 *
 * @public
 */
const version = '0.2.0';

export { CHILDREN_KEY, ID_KEY, PARENT_ID_KEY, ROOT_ID, each, exclude, exporter, filter, map, parse, toRows, toTree, version };
