window.initClassicGitFlow = () => {
    'use strict';

    const graph = new GitGraph({
        template: 'blackarrow',
        reverseArrow: false,
        orientation: 'horizontal',
        mode: 'compact'
    });

    const master = graph.branch('master');
    master.commit({
        dotColor: 'gold',
        message: 'Release v1.0.0',
        tag: 'v1.0.0'
    });
    const develop = graph.branch('develop');    // New branch from HEAD
    let commitCount = 0;

    master.checkout();
    const feature1 = graph.branch('feature1');

    feature1.commit({
        dotColor: 'magenta',
        message: 'Custom feature that was merged into develop branch'
    });

    const feature2 = graph.branch('feature2');
    feature2.commit({
        dotColor: 'yellow',
        message: `Feature branch commit ${++commitCount}`
    }).commit({
        dotColor: 'yellow',
        message: `Feature branch commit ${++commitCount}`
    }).commit({
        dotColor: 'yellow',
        message: `Feature branch commit ${++commitCount}`
    });

    master.checkout();
    let clickMergeCount = 0;
    const featureBranches = [{
        branch: feature1,
        dotColor: 'magenta'
    }, {
        branch: feature2,
        dotColor: 'yellow'
    }];

    const mergeFeatureBtn = document.getElementById('merge-feature');
    const mergeDevelopBtn = document.getElementById('merge-develop');
    const createHotfixBtn = document.getElementById('create-hotfix');
    let isReadyForRelease = false;
    mergeDevelopBtn.setAttribute('disabled', true);

    mergeFeatureBtn.addEventListener('click', () => {
        if (clickMergeCount < featureBranches.length) {
            const feature = featureBranches[clickMergeCount++];
            feature.branch.merge(develop, {
                dotColor: feature.dotColor
            });
            if (mergeDevelopBtn.getAttribute('disabled')) {
                mergeDevelopBtn.removeAttribute('disabled');
                isReadyForRelease = true;
            }
        }
    });

    let releaseCount = 0;
    mergeDevelopBtn.addEventListener('click', () => {
        if (isReadyForRelease) {
            develop.merge(master, {
                dotColor: 'red'
            });
            releaseCount++;
            master.commit({
                dotColor: 'gold',
                message: `Release v1.0.${releaseCount}`,
                tag: `v1.0.${releaseCount}`
            });
            isReadyForRelease = false;
            mergeDevelopBtn.setAttribute('disabled', true);
        }
    });

    let isHotfixReleased = false;
    createHotfixBtn.addEventListener('click', () => {
        if (isHotfixReleased) {
            return;
        }

        const hotfix = graph.branch({
            parentBranch: master,
            name: `hotfix-v1.0.${releaseCount}`,
            column: 2             // which column index it should be displayed in
        });
        hotfix.commit({
            dotColor: 'orange',
            message: `Hotfix for prod bug found in release v1.0.${releaseCount}`
        });
        hotfix.merge(master, {
            dotColor: 'red'
        });

        releaseCount++;
        master.commit({
            dotColor: 'gold',
            message: `Release v1.0.${releaseCount}`,
            tag: `v1.0.${releaseCount}`
        });
        master.merge(develop, {
            dotColor: '#71FF33',
            message: `Merge master branch - release v1.0.${releaseCount}`
        });
        isHotfixReleased = true;
        createHotfixBtn.setAttribute('disabled', true);
    });
};