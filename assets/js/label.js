function isLabelable$labels(element) {
    return /BUTTON|METER|OUTPUT|PROGRESS|SELECT|TEXTAREA/.test(element.tagName) || element.tagName === 'INPUT' && element.getAttribute('type') !== 'hidden';
}

function getLabelContent$labels(element) {
    let textContent;

    if (element.tagName.toLowerCase() === 'label') {
        textContent = getTextContent(element);
    } else {
        textContent = element.value || element.textContent;
    }

    return textContent;
}

function getRealLabels$labels(element) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- types are not aware of older browsers that don't implement `labels`
    if (element.labels !== undefined) {
        var _labels;

        return (_labels = element.labels) != null ? _labels : [];
    }

    if (!isLabelable$labels(element)) return [];
    const labels = element.ownerDocument.querySelectorAll('label');
    return Array.from(labels).filter(label => label.control === element);
}

function getLabels$labels(container, element, {
    selector = '*'
} = {}) {
    const ariaLabelledBy = element.getAttribute('aria-labelledby');
    const labelsId = ariaLabelledBy ? ariaLabelledBy.split(' ') : [];
    return labelsId.length ? labelsId.map(labelId => {
        const labellingElement = container.querySelector(`[id="${labelId}"]`);
        return labellingElement ? {
            content: getLabelContent$labels(labellingElement),
            formControl: null
        } : {
            content: '',
            formControl: null
        };
    }) : Array.from(getRealLabels$labels(element)).map(label => {
        const textToMatch = getLabelContent$labels(label);
        const formControlSelector = 'button, input, meter, output, progress, select, textarea';
        const labelledFormControl = Array.from(label.querySelectorAll(formControlSelector)).filter(formControlElement => formControlElement.matches(selector))[0];
        return {
            content: textToMatch,
            formControl: labelledFormControl
        };
    });
}


function queryAllLabels$labels(container) {
    return Array.from(container.querySelectorAll('label,input')).map(node => {
        return {
            node,
            textToMatch: (0, getLabelContent$labels)(node)
        };
    }).filter(({
        textToMatch
    }) => textToMatch !== null);
}



const queryAllLabelsByText$labels = (container, text, { trim = false } = {}) => {

    const textToMatchByLabels = queryAllLabels$labels(container);
    return textToMatchByLabels.filter(({
        node,
        textToMatch
    }) => matchStrings(textToMatch, text, trim)).map(({
        node
    }) => node);
};

const queryAllByLabelText$labels = (container, text, {
    selector = '*',
    trim = false,
} = {}) => {

    const matchingLabelledElements = Array.from(container.querySelectorAll('*')).filter(element => {
        return (0, getRealLabels$labels)(element).length || element.hasAttribute('aria-labelledby');
    }).reduce((labelledElements, labelledElement) => {
        const labelList = (0, getLabels$labels)(container, labelledElement, {
            selector
        });
        labelList.filter(label => Boolean(label.formControl)).forEach(label => {
            if (matchStrings(label.content, text, trim) && label.formControl) labelledElements.push(label.formControl);
        });
        const labelsValue = labelList.filter(label => Boolean(label.content)).map(label => label.content);
        if (matchStrings(labelsValue.join(' '), text, trim)) labelledElements.push(labelledElement);

        if (labelsValue.length > 1) {
            labelsValue.forEach((labelValue, index) => {
                if (matchStrings(labelValue, text, trim)) labelledElements.push(labelledElement);
                const labelsFiltered = [...labelsValue];
                labelsFiltered.splice(index, 1);

                if (labelsFiltered.length > 1) {
                    if (matchStrings(labelsFiltered.join(' '), text, trim)) labelledElements.push(labelledElement);
                }
            });
        }

        return labelledElements;
    }, []).concat((0, queryAllByAttribute)(container, 'aria-label', text, trim
    ));
    return Array.from(new Set(matchingLabelledElements)).filter(element => element.matches(selector));
};

