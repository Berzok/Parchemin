/**
 * Simple pagination library
 * I never found a pagination library which i liked, so I made it myself!
 * @author Berzok https://github.com/Berzok
 */


/**
 * @field {Number} currentPage
 */
class Pagination{

    content;
    currentPage = 0;
    navigation;
    maximumPage;

    /**
     *
     * @param {Object} options - Options pour la pagination
     * @param {HTMLElement} options.container - Page par défaut
     * @param {Object} options.data - Contenu complet (c'est-à-dire, pour toutes les pages)
     * @param {Number} [options.defaultPage=0] - Page par défaut
     * @param {Number} [options.pageSize=24] - Nombre d'éléments par page
     */
    constructor({
                    container,
                    data,
                    defaultPage=0,
                    pageSize=24
                }) {
        this.container = container;
        this.data = data;
        this.defaultPage = defaultPage;
        this.pageSize = pageSize;
        this.maximumPage = Math.ceil(this.data.length / this.pageSize) - 1;

        this.initDOM();
    }

    initDOM(){
        let parent = this.container;

        this.prepareContent();
        parent.append(this.content.container);

        parent.insertAdjacentHTML("beforeend", '<hr />');

        this.prepareNavigation();
        parent.append(this.navigation.container);

        this.showPage(this.defaultPage);
    }

    prepareContent(){
        this.content = new Content({
            data: {}
        });
    }
    prepareNavigation(){
        this.navigation = new Navigation(Math.ceil(this.data.length/this.pageSize), this.defaultPage);
        this.navigation.createPages();
        this.navigation.prepare();

        this.navigation.previousButton.onclick = (event) => {
            if(this.currentPage === 0){
                return false;
            }
            this.showPage(this.currentPage - 1);
        }
        this.navigation.nextButton.onclick = () => {
            if(this.currentPage === this.maximumPage){
                return false;
            }
            this.showPage(this.currentPage + 1);
        }

        for(let b of this.navigation.pagesButton){
            b.onclick = (e) => {
                this.showPage(e.target.dataset.pmPage);
            }
        }
    }

    refreshContent(){
        this.content.clear();
        this.content.createPage();
    }
    refreshNavigation(){
        this.navigation.setActivePage(this.currentPage);
        this.navigation.pagesButton[this.navigation.activePage].classList.toggle('active');
        this.navigation.pagesButton[this.currentPage].classList.toggle('active');

    }

    showPage(pageNumber){
        if(typeof pageNumber === 'string'){
            pageNumber = parseInt(pageNumber);
        }
        let start = this.pageSize * pageNumber;
        this.content.data = this.data.slice(start, start + this.pageSize);

        console.dir('Old: ' + this.currentPage);
        console.dir('New: ' + pageNumber);
        this.currentPage = pageNumber;

        toggleClass(this.navigation.nextButton, 'disabled', (this.currentPage === this.maximumPage));
        toggleClass(this.navigation.previousButton, 'disabled', (this.currentPage === 0));

        const url = new URL(window.location);

        //console.dir(url);
        url.searchParams.set('page', pageNumber);

        history.pushState({}, null, url.toString());

        this.refreshContent();
        this.refreshNavigation();
    }
}


class Content{

    container = createNode('div', '', 'flex-grow-1');
    data;
    pageSize;

    constructor({data, nodeType = 'span', classes = 'thumbnail mb-4'}){
        this.data = data;
        this.nodeType = nodeType;
        this.classes = classes;
    }

    clear(){
        this.container.innerHTML = '';
    }

    createPage(){
        for(let d of this.data){
            let itemNode = createNode(this.nodeType, '', this.classes);

            let aNode = createNode('a');
            aNode.href = '/image/' + d.id;

            let imgNode = createNode('img', '', 'img-thumbnail d-block m-auto mh-100 mw-100');
            imgNode.src = '/img/' + d.filename;
            imgNode.alt = 'Image';

            aNode.append(imgNode);
            itemNode.append(aNode);

            this.container.append(itemNode);
        }
    }
}



class Navigation{

    container;
    activePage;
    navLength;
    pagesButton = [];
    previousButton = this.createButton('&laquo;');
    nextButton = this.createButton('&raquo;');

    constructor(navLength, activePage=0){
        this.activePage = activePage;
        this.navLength = navLength;
    }

    prepare(){
        this.prepareContainer();
    }

    prepareContainer(){
        this.container = createNode('nav', '', 'pagi-nav align-self-center');

        let ulNode = createNode('ul', '', 'pagination');

        ulNode.append(this.previousButton);
        for(let b of this.pagesButton){
            ulNode.append(b);
        }
        ulNode.append(this.nextButton);

        this.container.append(ulNode);
    }

    nextPage(){

    }

    setActivePage(pageNumber){
        this.pagesButton[this.activePage].classList.toggle('active');
        this.activePage = pageNumber;
        this.pagesButton[this.activePage].classList.toggle('active');
    }

    createButton(innerHTML) {
        let liNode = createNode('li', '', 'page-item');
        let buttonNode = createNode('button', 'previousPage', 'page-link');
        let spanNode = createNode('span');
        spanNode.innerHTML = innerHTML;

        buttonNode.append(spanNode);
        liNode.append(buttonNode);

        return liNode;
    }

    createPages(){
        for(let i=0; i<this.navLength; i++) {
            let liNode = createNode('li', '', 'page-item');
            let buttonNode = createNode('button', '', 'page-link');
            buttonNode.dataset.pmPage = i.toString();
            buttonNode.textContent = i;
            buttonNode.value = i;

            liNode.append(buttonNode);
            this.pagesButton.push(liNode);
        }

        this.pagesButton[this.activePage].classList.toggle('active');
    }
}


function createNode(nodeType, id = null, classes = null, innerHTML = null) {
    let node = document.createElement(nodeType);
    if(id) {
        node.id = id;
    }
    if(classes) {
        node.className = classes;
    }
    return node;
}


/**
 *
 * @param {HTMLElement} node
 * @param {String} cl
 * @param {Boolean} condition
 * @returns {boolean}
 */
function toggleClass(node, cl, condition){
    //La condition est-elle remplie ?
    if(condition){

        //La classe est-elle présente ?
        if(node.classList.contains(cl)) {
            return false;
        } else{
            return node.classList.toggle(cl);
        }

    }else{
        //La classe est-elle présente ?
        if(node.classList.contains(cl)) {
            return node.classList.toggle(cl);
        } else{
            return false;
        }
    }
}