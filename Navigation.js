/**
 * Simple pagination library
 * I never found a pagination library which i liked, so I made it myself!
 * @author Berzok https://github.com/Berzok
 */


class Navigation {

    container;
    activePage;
    navLength;
    pagesButton = [];
    previousButton = this.createButton('&laquo;');
    nextButton = this.createButton('&raquo;');

    constructor(navLength, activePage = 0) {
        this.activePage = activePage;
        this.navLength = navLength;
    }

    prepare() {
        this.prepareContainer();
    }

    prepareContainer() {
        this.container = createNode('nav', '', 'pagi-nav');

        let ulNode = createNode('ul', '', 'pagination justify-content-center');

        ulNode.append(this.previousButton);
        for (let b of this.pagesButton) {
            ulNode.append(b);
        }
        ulNode.append(this.nextButton);

        this.container.append(ulNode);
    }

    nextPage() {

    }

    setActivePage(pageNumber) {
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

    createPages() {
        for (let i = 0; i < this.navLength; i++) {
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
