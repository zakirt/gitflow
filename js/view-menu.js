window.viewMenu = ((document, window, undefined) => {
    'use strict';

    const menu = {
        init
    };
    let menuElem;
    let menuLinks;

    return menu;

    function init() {
        menuElem = document.getElementById('view-menu');
        menuLinks = menuElem.querySelectorAll('.nav-link');
        menuElem.addEventListener('click', onClickMenu);
        loadInitialView();
    }

    function loadInitialView() {
        const firstView = menuLinks[0].dataset.view;
        loadView(firstView);
    }

    function onClickMenu(event) {
        event.preventDefault();
        const clickedElem = event.target;
        if (clickedElem.classList.contains('nav-link')) {
            const viewName = clickedElem.dataset.view;
            loadView(viewName);
            updateActiveLink(clickedElem);
        }
    }

    function loadView(viewName) {
        return loadFetchedView(viewName).then(() => initGitflow(viewName));
    }

    async function loadFetchedView(viewName) {
        const viewFilePath = getViewFilePath(viewName);
        const html = await getView(viewFilePath);
        updateView(html);
    }

    function initGitflow(viewName) {
        const flowCreatorName = viewName.split('-')[0];
        window.gitFlowFactory.createGitFlow(flowCreatorName);
    }

    function updateActiveLink(currentLink) {
        menuLinks.forEach(element => element.classList.remove('active'));
        currentLink.classList.add('active');
    }

    function getViewFilePath(viewName) {
        return `partials/${viewName}.html`;
    }

    async function getView(viewFilePath) {
        const response = await fetch(viewFilePath);
        const html = await response.text();
        return html;
    }

    function updateView(html) {
        const viewElem = document.getElementById('view');
        viewElem.innerHTML = html;
    }

})(document, window);