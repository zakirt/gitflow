window.initModifiedGitFlow = () => {
    const graph = new GitGraph({
        template: 'blackarrow',
        reverseArrow: false,
        orientation: 'horizontal',
        mode: 'compact'
    });
    const master = graph.branch('master');
    master.commit().commit({
        dotColor:'gold',
        message: 'Release v1.0.0',
        tag: 'v1.0.0'
    }).commit({
        message: 'Add unit tests'
    }).commit({
        message: 'Update README'
    });

    const qa = graph.branch('qa');    // New branch from HEAD
    let commitCount = 0;
    const hotfix = graph.branch({
        parentBranch: qa,
        name: 'hotfix',
        column: 2             // which column index it should be displayed in
    });

    master.checkout();
    const feature1 = graph.branch('feature1');
    feature1.commit({
        dotColor: 'magenta',
        message: 'Custom feature that was merged into qa branch'
    });

    master.checkout();
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
    commitCount = 0;

    master.checkout();
    const feature3 = graph.branch('feature3');
    const feature3Options = {
        dotColor: '#33FF00',
        message: `Feature branch commit ${++commitCount}`
    };
    feature3.commit(feature3Options).commit({
        dotColor: '#33FF00',
        message: `Feature branch commit ${++commitCount}`
    });
    commitCount = 0;

    let isReadyForRelease = false;
    const mergeQaBtn = document.getElementById('merge-qa');
    let releaseCount = 0;
    mergeQaBtn.setAttribute('disabled', true);
    mergeQaBtn.addEventListener('click', () => {
        if (isReadyForRelease) {
            releaseCount++;
            qa.merge(master, {
                dotColor: 'red'
            }).delete();
            master.commit({
                dotColor:'gold',
                message: `Release v1.1.${releaseCount}`,
                tag: `v1.1.${releaseCount}`
            });

            feature1.delete();
            feature2.delete();
            feature3.delete();
            qa.delete();
            master.checkout();
            isReadyForRelease = false;
            isReadyForRelease = false;
            mergeQaBtn.setAttribute('disabled', true);
        }
    });

    const mergeFeatureBtn = document.getElementById('merge-feature');
    let clickMergeCount = 0;
    const featureBranches = [{
        branch: feature1,
        dotColor: 'magenta'
    }, {
        branch: feature2,
        dotColor: 'yellow'
    }, {
        branch: feature3,
        dotColor: '#33FF00'
    }];
    mergeFeatureBtn.addEventListener('click', () => {
        if (clickMergeCount < featureBranches.length) {
            const feature = featureBranches[clickMergeCount++];
            feature.branch.merge(qa, {
                dotColor: feature.dotColor
            });
            if (mergeQaBtn.getAttribute('disabled')) {
                mergeQaBtn.removeAttribute('disabled');
                isReadyForRelease = true;
            }
        }
    });
};