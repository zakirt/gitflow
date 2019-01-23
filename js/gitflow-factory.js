window.gitFlowFactory = ((window, undefined) => {
    const factory = {
        createGitFlow
    };
    const creators = {
        'classic': window.initClassicGitFlow,
        'modified': window.initModifiedGitFlow
    }

    return factory;

    function createGitFlow(creatorName) {
        throwIfInvalidCreator(creatorName);
        return creators[creatorName]();
    }

    function throwIfInvalidCreator(creatorName) {
        if (!creators.hasOwnProperty(creatorName)) {
            throw new Error('window.gitflowFactory invalid creator');
        }
    }
})(window);