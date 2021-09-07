/**
 * Simple pagination library
 * I never found a pagination library which i liked, so I made it myself!
 * @author Berzok https://github.com/Berzok
 */


class Content {

    container = createNode('div', '', 'd-flex flex-wrap align-content-around');
    data;
    pageSize;

    constructor({data, nodeType = 'div', classes = 'thumbnail mb-4', pageSize}) {
        this.data = data;
        this.nodeType = nodeType;
        this.classes = classes;
        this.pageSize = pageSize;
    }

    clear() {
        this.container.innerHTML = '';
    }

    createPage() {
        for (let d of this.data) {
            let itemNode = this.createItem(d, this.nodeType, this.classes)

            this.container.append(itemNode);
        }
    }

    createItem(data, type, classes){
        let itemNode = createNode('div', '', '');
        if(this.pageSize%2 === 0){
            itemNode.style.width = (100 / this.pageSize)*2 + '%';
        } else {
            itemNode.style.width = (100 / this.pageSize) + '%';
        }
        let itemContent = createNode(this.nodeType, '', this.classes, data);

        itemNode.append(itemContent);

        return itemNode;
    }
}