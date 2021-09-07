/**
 * Simple pagination library
 * I never found a pagination library which i liked, so I made it myself!
 * @author Berzok https://github.com/Berzok
 */


/**
 * @field {Number} currentPage
 */
class Pagination {

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
                    defaultPage = 0,
                    pageSize = 24
                }) {
        this.container = container;
        this.data = data;
        this.defaultPage = defaultPage;
        this.pageSize = pageSize;
        this.maximumPage = Math.ceil(this.data.length / this.pageSize) - 1;

        this.initDOM();
    }

    initDOM() {
        let parent = this.container;

        this.prepareContent();
        parent.append(this.content.container);

        parent.insertAdjacentHTML("beforeend", '<hr />');

        this.prepareNavigation();
        parent.append(this.navigation.container);

        this.showPage(this.defaultPage);
    }

    prepareContent() {
        this.content = new Content({
            data: this.data,
            pageSize: this.pageSize
        });
    }

    prepareNavigation() {
        this.navigation = new Navigation(Math.ceil(this.data.length / this.pageSize), this.defaultPage);
        this.navigation.createPages();
        this.navigation.prepare();

        this.navigation.previousButton.onclick = (event) => {
            if (this.currentPage === 0) {
                return false;
            }
            this.showPage(this.currentPage - 1);
        }
        this.navigation.nextButton.onclick = () => {
            if (this.currentPage === this.maximumPage) {
                return false;
            }
            this.showPage(this.currentPage + 1);
        }

        for (let b of this.navigation.pagesButton) {
            b.onclick = (e) => {
                this.showPage(e.target.dataset.pmPage);
            }
        }
    }

    refreshContent() {
        this.content.clear();
        this.content.createPage();
    }

    refreshNavigation() {
        this.navigation.setActivePage(this.currentPage);
        this.navigation.pagesButton[this.navigation.activePage].classList.toggle('active');
        this.navigation.pagesButton[this.currentPage].classList.toggle('active');

    }

    showPage(pageNumber) {
        if (typeof pageNumber === 'string') {
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