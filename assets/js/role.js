const elementRoleList = buildElementRoleList(ariaQuery.elementRoles);

function isSubtreeInaccessible(element) {
    if (element.hidden === true) {
        return true;
    }

    if (element.getAttribute('aria-hidden') === 'true') {
        return true;
    }

    const window = element.ownerDocument.defaultView;

    if (window.getComputedStyle(element).display === 'none') {
        return true;
    }

    return false;
}

function isInaccessible(element, options = {}) {
    const {
        isSubtreeInaccessible: isSubtreeInaccessibleImpl = isSubtreeInaccessible
    } = options;
    const window = element.ownerDocument.defaultView; // since visibility is inherited we can exit early

    if (window.getComputedStyle(element).visibility === 'hidden') {
        return true;
    }

    let currentElement = element;

    while (currentElement) {
        if (isSubtreeInaccessibleImpl(currentElement)) {
            return true;
        }

        currentElement = currentElement.parentElement;
    }

    return false;
}

function getImplicitAriaRoles(currentNode) {
    // eslint bug here:
    // eslint-disable-next-line no-unused-vars
    for (const {
        match,
        roles
    } of elementRoleList) {
        if (match(currentNode)) {
            return [...roles];
        }
    }

    return [];
}

function buildElementRoleList(elementRolesMap) {
    function makeElementSelector({
        name,
        attributes
    }) {
        return `${name}${attributes.map(({
            name: attributeName,
            value,
            constraints = []
        }) => {
            const shouldNotExist = constraints.indexOf('undefined') !== -1;

            if (shouldNotExist) {
                return `:not([${attributeName}])`;
            } else if (value) {
                return `[${attributeName}="${value}"]`;
            } else {
                return `[${attributeName}]`;
            }
        }).join('')}`;
    }

    function getSelectorSpecificity({
        attributes = []
    }) {
        return attributes.length;
    }

    function bySelectorSpecificity({
        specificity: leftSpecificity
    }, {
        specificity: rightSpecificity
    }) {
        return rightSpecificity - leftSpecificity;
    }

    function match(element) {
        let {
            attributes = []
        } = element;

        const typeTextIndex = attributes.findIndex(attribute => attribute.value && attribute.name === 'type' && attribute.value === 'text');

        if (typeTextIndex >= 0) {
            // not using splice to not mutate the attributes array
            attributes = [...attributes.slice(0, typeTextIndex), ...attributes.slice(typeTextIndex + 1)];
        }

        const selector = makeElementSelector({
            ...element,
            attributes
        });
        return node => {
            if (typeTextIndex >= 0 && node.type !== 'text') {
                return false;
            }

            return node.matches(selector);
        };
    }

    let result = []; // eslint bug here:
    // eslint-disable-next-line no-unused-vars

    for (const [element, roles] of elementRolesMap.entries()) {
        result = [...result, {
            match: match(element),
            roles: Array.from(roles),
            specificity: getSelectorSpecificity(element)
        }];
    }

    return result.sort(bySelectorSpecificity);
}

function getRoles(container, {
    hidden = false
} = {}) {
    function flattenDOM(node) {
        return [node, ...Array.from(node.children).reduce((acc, child) => [...acc, ...flattenDOM(child)], [])];
    }

    return flattenDOM(container).filter(element => {
        return hidden === false ? isInaccessible(element) === false : true;
    }).reduce((acc, node) => {
        let roles = []; // TODO: This violates html-aria which does not allow any role on every element

        if (node.hasAttribute('role')) {
            roles = node.getAttribute('role').split(' ').slice(0, 1);
        } else {
            roles = getImplicitAriaRoles(node);
        }

        return roles.reduce((rolesAcc, role) => Array.isArray(rolesAcc[role]) ? {
            ...rolesAcc,
            [role]: [...rolesAcc[role], node]
        } : {
            ...rolesAcc,
            [role]: [node]
        }, acc);
    }, {});
}

function queryAllByRole(container, role, {
    hidden = false,
    name,
    description,
    selected,
    checked,
    pressed,
    current,
    level,
    expanded,
} = {}) {
    if (selected !== undefined) {
        var _allRoles$get;

        // guard against unknown roles
        if (((_allRoles$get = ariaQuery.roles.get(role)) == null ? void 0 : _allRoles$get.props['aria-selected']) === undefined) {
            throw new Error(`"aria-selected" is not supported on role "${role}".`);
        }
    }

    if (checked !== undefined) {
        var _allRoles$get2;

        // guard against unknown roles
        if (((_allRoles$get2 = ariaQuery.roles.get(role)) == null ? void 0 : _allRoles$get2.props['aria-checked']) === undefined) {
            throw new Error(`"aria-checked" is not supported on role "${role}".`);
        }
    }

    if (pressed !== undefined) {
        var _allRoles$get3;

        // guard against unknown roles
        if (((_allRoles$get3 = ariaQuery.roles.get(role)) == null ? void 0 : _allRoles$get3.props['aria-pressed']) === undefined) {
            throw new Error(`"aria-pressed" is not supported on role "${role}".`);
        }
    }

    if (current !== undefined) {
        var _allRoles$get4;

        /* istanbul ignore next */
        // guard against unknown roles
        // All currently released ARIA versions support `aria-current` on all roles.
        // Leaving this for symetry and forward compatibility
        if (((_allRoles$get4 = ariaQuery.roles.get(role)) == null ? void 0 : _allRoles$get4.props['aria-current']) === undefined) {
            throw new Error(`"aria-current" is not supported on role "${role}".`);
        }
    }

    if (level !== undefined) {
        // guard against using `level` option with any role other than `heading`
        if (role !== 'heading') {
            throw new Error(`Role "${role}" cannot have "level" property.`);
        }
    }

    if (expanded !== undefined) {
        var _allRoles$get5;

        // guard against unknown roles
        if (((_allRoles$get5 = ariaQuery.roles.get(role)) == null ? void 0 : _allRoles$get5.props['aria-expanded']) === undefined) {
            throw new Error(`"aria-expanded" is not supported on role "${role}".`);
        }
    }

    const subtreeIsInaccessibleCache = new WeakMap();

    function cachedIsSubtreeInaccessible(element) {
        if (!subtreeIsInaccessibleCache.has(element)) {
            subtreeIsInaccessibleCache.set(element, (0, isSubtreeInaccessible)(element));
        }
        return subtreeIsInaccessibleCache.get(element);
    }

    return Array.from(container.querySelectorAll( // Only query elements that can be matched by the following filters
        makeRoleSelector(role))).filter(node => {
            const isRoleSpecifiedExplicitly = node.hasAttribute('role');

            if (isRoleSpecifiedExplicitly) {
                const roleValue = node.getAttribute('role');

                const [firstWord] = roleValue.split(' ');
                return firstWord.trim() === role.trim();
            }

            const implicitRoles = (0, getImplicitAriaRoles)(node);
            return implicitRoles.some(implicitRole => implicitRole.trim() === role.trim());
        }).filter(element => {
            if (selected !== undefined) {
                return selected === (0, computeAriaSelected)(element);
            }

            if (checked !== undefined) {
                return checked === (0, computeAriaChecked)(element);
            }

            if (pressed !== undefined) {
                return pressed === (0, computeAriaPressed)(element);
            }

            if (current !== undefined) {
                return current === (0, computeAriaCurrent)(element);
            }

            if (expanded !== undefined) {
                return expanded === (0, computeAriaExpanded)(element);
            }

            if (level !== undefined) {
                return level === (0, computeHeadingLevel)(element);
            } // don't care if aria attributes are unspecified


            return true;
        }).filter(element => {
            if (name === undefined) {
                // Don't care
                return true;
            }

            return name === dom_accessibility_api.computeAccessibleName(element);
        }).filter(element => {
            if (description === undefined) {
                // Don't care
                return true;
            }
            return description === dom_accessibility_api.computeAccessibleDescription(element);
        }).filter(element => {
            return hidden === false ? (0, isInaccessible)(element, {
                isSubtreeInaccessible: cachedIsSubtreeInaccessible
            }) === false : true;
        });
}


function makeRoleSelector(role) {
    var _roleElements$get;

    if (typeof role !== 'string') {
        // For non-string role parameters we can not determine the implicitRoleSelectors.
        return '*';
    }

    const explicitRoleSelector = `*[role~="${role}"]`;
    const roleRelations = (_roleElements$get = ariaQuery.roleElements.get(role)) != null ? _roleElements$get : new Set();
    const implicitRoleSelectors = new Set(Array.from(roleRelations).map(({
        name
    }) => name)); // Current transpilation config sometimes assumes `...` is always applied to arrays.
    // `...` is equivalent to `Array.prototype.concat` for arrays.
    // If you replace this code with `[explicitRoleSelector, ...implicitRoleSelectors]`, make sure every transpilation target retains the `...` in favor of `Array.prototype.concat`.

    return [explicitRoleSelector].concat(Array.from(implicitRoleSelectors)).join(',');
}