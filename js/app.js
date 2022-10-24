(() => {
    "use strict";
    const modules_flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    function getHash() {
        if (location.hash) return location.hash.replace("#", "");
    }
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function menuClose() {
        bodyUnlock();
        document.documentElement.classList.remove("menu-open");
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    let gotoblock_gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
        const targetBlockElement = document.querySelector(targetBlock);
        if (targetBlockElement) {
            let headerItem = "";
            let headerItemHeight = 0;
            if (noHeader) {
                headerItem = "header.header";
                const headerElement = document.querySelector(headerItem);
                if (!headerElement.classList.contains("_header-scroll")) {
                    headerElement.style.cssText = `transition-duration: 0s;`;
                    headerElement.classList.add("_header-scroll");
                    headerItemHeight = headerElement.offsetHeight;
                    headerElement.classList.remove("_header-scroll");
                    setTimeout((() => {
                        headerElement.style.cssText = ``;
                    }), 0);
                } else headerItemHeight = headerElement.offsetHeight;
            }
            let options = {
                speedAsDuration: true,
                speed,
                header: headerItem,
                offset: offsetTop,
                easing: "easeOutQuad"
            };
            document.documentElement.classList.contains("menu-open") ? menuClose() : null;
            if ("undefined" !== typeof SmoothScroll) (new SmoothScroll).animateScroll(targetBlockElement, "", options); else {
                let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
                targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
                targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
                window.scrollTo({
                    top: targetBlockElementPosition,
                    behavior: "smooth"
                });
            }
            functions_FLS(`[gotoBlock]: Юхуу...едем к ${targetBlock}`);
        } else functions_FLS(`[gotoBlock]: Ой ой..Такого блока нет на странице: ${targetBlock}`);
    };
    function formFieldsInit(options = {
        viewPass: false,
        autoHeight: false
    }) {
        const formFields = document.querySelectorAll("input[placeholder],textarea[placeholder]");
        if (formFields.length) formFields.forEach((formField => {
            if (!formField.hasAttribute("data-placeholder-nohide")) formField.dataset.placeholder = formField.placeholder;
        }));
        document.body.addEventListener("focusin", (function(e) {
            const targetElement = e.target;
            if ("INPUT" === targetElement.tagName || "TEXTAREA" === targetElement.tagName) {
                if (targetElement.dataset.placeholder) targetElement.placeholder = "";
                if (!targetElement.hasAttribute("data-no-focus-classes")) {
                    targetElement.classList.add("_form-focus");
                    targetElement.parentElement.classList.add("_form-focus");
                }
                formValidate.removeError(targetElement);
            }
        }));
        document.body.addEventListener("focusout", (function(e) {
            const targetElement = e.target;
            if ("INPUT" === targetElement.tagName || "TEXTAREA" === targetElement.tagName) {
                if (targetElement.dataset.placeholder) targetElement.placeholder = targetElement.dataset.placeholder;
                if (!targetElement.hasAttribute("data-no-focus-classes")) {
                    targetElement.classList.remove("_form-focus");
                    targetElement.parentElement.classList.remove("_form-focus");
                }
                if (targetElement.hasAttribute("data-validate")) formValidate.validateInput(targetElement);
            }
        }));
        if (options.viewPass) document.addEventListener("click", (function(e) {
            let targetElement = e.target;
            if (targetElement.closest('[class*="__viewpass"]')) {
                let inputType = targetElement.classList.contains("_viewpass-active") ? "password" : "text";
                targetElement.parentElement.querySelector("input").setAttribute("type", inputType);
                targetElement.classList.toggle("_viewpass-active");
            }
        }));
        if (options.autoHeight) {
            const textareas = document.querySelectorAll("textarea[data-autoheight]");
            if (textareas.length) {
                textareas.forEach((textarea => {
                    const startHeight = textarea.hasAttribute("data-autoheight-min") ? Number(textarea.dataset.autoheightMin) : Number(textarea.offsetHeight);
                    const maxHeight = textarea.hasAttribute("data-autoheight-max") ? Number(textarea.dataset.autoheightMax) : 1 / 0;
                    setHeight(textarea, Math.min(startHeight, maxHeight));
                    textarea.addEventListener("input", (() => {
                        if (textarea.scrollHeight > startHeight) {
                            textarea.style.height = `auto`;
                            setHeight(textarea, Math.min(Math.max(textarea.scrollHeight, startHeight), maxHeight));
                        }
                    }));
                }));
                function setHeight(textarea, height) {
                    textarea.style.height = `${height}px`;
                }
            }
        }
    }
    let formValidate = {
        getErrors(form) {
            let error = 0;
            let formRequiredItems = form.querySelectorAll("*[data-required]");
            if (formRequiredItems.length) formRequiredItems.forEach((formRequiredItem => {
                if ((null !== formRequiredItem.offsetParent || "SELECT" === formRequiredItem.tagName) && !formRequiredItem.disabled) error += this.validateInput(formRequiredItem);
            }));
            return error;
        },
        validateInput(formRequiredItem) {
            let error = 0;
            if ("email" === formRequiredItem.dataset.required) {
                formRequiredItem.value = formRequiredItem.value.replace(" ", "");
                if (this.emailTest(formRequiredItem)) {
                    this.addError(formRequiredItem);
                    error++;
                } else this.removeError(formRequiredItem);
            } else if ("checkbox" === formRequiredItem.type && !formRequiredItem.checked) {
                this.addError(formRequiredItem);
                error++;
            } else if (!formRequiredItem.value.trim()) {
                this.addError(formRequiredItem);
                error++;
            } else this.removeError(formRequiredItem);
            return error;
        },
        addError(formRequiredItem) {
            formRequiredItem.classList.add("_form-error");
            formRequiredItem.parentElement.classList.add("_form-error");
            let inputError = formRequiredItem.parentElement.querySelector(".form__error");
            if (inputError) formRequiredItem.parentElement.removeChild(inputError);
            if (formRequiredItem.dataset.error) formRequiredItem.parentElement.insertAdjacentHTML("beforeend", `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
        },
        removeError(formRequiredItem) {
            formRequiredItem.classList.remove("_form-error");
            formRequiredItem.parentElement.classList.remove("_form-error");
            if (formRequiredItem.parentElement.querySelector(".form__error")) formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector(".form__error"));
        },
        formClean(form) {
            form.reset();
            setTimeout((() => {
                let inputs = form.querySelectorAll("input,textarea");
                for (let index = 0; index < inputs.length; index++) {
                    const el = inputs[index];
                    el.parentElement.classList.remove("_form-focus");
                    el.classList.remove("_form-focus");
                    formValidate.removeError(el);
                }
                let checkboxes = form.querySelectorAll(".checkbox__input");
                if (checkboxes.length > 0) for (let index = 0; index < checkboxes.length; index++) {
                    const checkbox = checkboxes[index];
                    checkbox.checked = false;
                }
                if (modules_flsModules.select) {
                    let selects = form.querySelectorAll(".select");
                    if (selects.length) for (let index = 0; index < selects.length; index++) {
                        const select = selects[index].querySelector("select");
                        modules_flsModules.select.selectBuild(select);
                    }
                }
            }), 0);
        },
        emailTest(formRequiredItem) {
            return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
        }
    };
    function formRating() {
        const ratings = document.querySelectorAll(".rating");
        if (ratings.length > 0) initRatings();
        function initRatings() {
            let ratingActive, ratingValue;
            for (let index = 0; index < ratings.length; index++) {
                const rating = ratings[index];
                initRating(rating);
            }
            function initRating(rating) {
                initRatingVars(rating);
                setRatingActiveWidth();
                if (rating.classList.contains("rating_set")) setRating(rating);
            }
            function initRatingVars(rating) {
                ratingActive = rating.querySelector(".rating__active");
                ratingValue = rating.querySelector(".rating__value");
            }
            function setRatingActiveWidth(index = ratingValue.innerHTML) {
                const ratingActiveWidth = index / .05;
                ratingActive.style.width = `${ratingActiveWidth}%`;
            }
            function setRating(rating) {
                const ratingItems = rating.querySelectorAll(".rating__item");
                for (let index = 0; index < ratingItems.length; index++) {
                    const ratingItem = ratingItems[index];
                    ratingItem.addEventListener("mouseenter", (function(e) {
                        initRatingVars(rating);
                        setRatingActiveWidth(ratingItem.value);
                    }));
                    ratingItem.addEventListener("mouseleave", (function(e) {
                        setRatingActiveWidth();
                    }));
                    ratingItem.addEventListener("click", (function(e) {
                        initRatingVars(rating);
                        if (rating.dataset.ajax) setRatingValue(ratingItem.value, rating); else {
                            ratingValue.innerHTML = index + 1;
                            setRatingActiveWidth();
                        }
                    }));
                }
            }
            async function setRatingValue(value, rating) {
                if (!rating.classList.contains("rating_sending")) {
                    rating.classList.add("rating_sending");
                    let response = await fetch("rating.json", {
                        method: "GET"
                    });
                    if (response.ok) {
                        const result = await response.json();
                        const newRating = result.newRating;
                        ratingValue.innerHTML = newRating;
                        setRatingActiveWidth();
                        rating.classList.remove("rating_sending");
                    } else {
                        alert("Ошибка");
                        rating.classList.remove("rating_sending");
                    }
                }
            }
        }
    }
    function getWindow_getWindow(node) {
        if (null == node) return window;
        if ("[object Window]" !== node.toString()) {
            var ownerDocument = node.ownerDocument;
            return ownerDocument ? ownerDocument.defaultView || window : window;
        }
        return node;
    }
    function isElement(node) {
        var OwnElement = getWindow_getWindow(node).Element;
        return node instanceof OwnElement || node instanceof Element;
    }
    function isHTMLElement(node) {
        var OwnElement = getWindow_getWindow(node).HTMLElement;
        return node instanceof OwnElement || node instanceof HTMLElement;
    }
    function isShadowRoot(node) {
        if ("undefined" === typeof ShadowRoot) return false;
        var OwnElement = getWindow_getWindow(node).ShadowRoot;
        return node instanceof OwnElement || node instanceof ShadowRoot;
    }
    var math_max = Math.max;
    var math_min = Math.min;
    var round = Math.round;
    function getUAString() {
        var uaData = navigator.userAgentData;
        if (null != uaData && uaData.brands) return uaData.brands.map((function(item) {
            return item.brand + "/" + item.version;
        })).join(" ");
        return navigator.userAgent;
    }
    function isLayoutViewport() {
        return !/^((?!chrome|android).)*safari/i.test(getUAString());
    }
    function getBoundingClientRect(element, includeScale, isFixedStrategy) {
        if (void 0 === includeScale) includeScale = false;
        if (void 0 === isFixedStrategy) isFixedStrategy = false;
        var clientRect = element.getBoundingClientRect();
        var scaleX = 1;
        var scaleY = 1;
        if (includeScale && isHTMLElement(element)) {
            scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
            scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
        }
        var _ref = isElement(element) ? getWindow_getWindow(element) : window, visualViewport = _ref.visualViewport;
        var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
        var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
        var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
        var width = clientRect.width / scaleX;
        var height = clientRect.height / scaleY;
        return {
            width,
            height,
            top: y,
            right: x + width,
            bottom: y + height,
            left: x,
            x,
            y
        };
    }
    function getWindowScroll(node) {
        var win = getWindow_getWindow(node);
        var scrollLeft = win.pageXOffset;
        var scrollTop = win.pageYOffset;
        return {
            scrollLeft,
            scrollTop
        };
    }
    function getHTMLElementScroll(element) {
        return {
            scrollLeft: element.scrollLeft,
            scrollTop: element.scrollTop
        };
    }
    function getNodeScroll(node) {
        if (node === getWindow_getWindow(node) || !isHTMLElement(node)) return getWindowScroll(node); else return getHTMLElementScroll(node);
    }
    function getNodeName(element) {
        return element ? (element.nodeName || "").toLowerCase() : null;
    }
    function getDocumentElement(element) {
        return ((isElement(element) ? element.ownerDocument : element.document) || window.document).documentElement;
    }
    function getWindowScrollBarX(element) {
        return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
    }
    function getComputedStyle_getComputedStyle(element) {
        return getWindow_getWindow(element).getComputedStyle(element);
    }
    function isScrollParent(element) {
        var _getComputedStyle = getComputedStyle_getComputedStyle(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
        return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
    }
    function isElementScaled(element) {
        var rect = element.getBoundingClientRect();
        var scaleX = round(rect.width) / element.offsetWidth || 1;
        var scaleY = round(rect.height) / element.offsetHeight || 1;
        return 1 !== scaleX || 1 !== scaleY;
    }
    function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
        if (void 0 === isFixed) isFixed = false;
        var isOffsetParentAnElement = isHTMLElement(offsetParent);
        var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
        var documentElement = getDocumentElement(offsetParent);
        var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
        var scroll = {
            scrollLeft: 0,
            scrollTop: 0
        };
        var offsets = {
            x: 0,
            y: 0
        };
        if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
            if ("body" !== getNodeName(offsetParent) || isScrollParent(documentElement)) scroll = getNodeScroll(offsetParent);
            if (isHTMLElement(offsetParent)) {
                offsets = getBoundingClientRect(offsetParent, true);
                offsets.x += offsetParent.clientLeft;
                offsets.y += offsetParent.clientTop;
            } else if (documentElement) offsets.x = getWindowScrollBarX(documentElement);
        }
        return {
            x: rect.left + scroll.scrollLeft - offsets.x,
            y: rect.top + scroll.scrollTop - offsets.y,
            width: rect.width,
            height: rect.height
        };
    }
    function getLayoutRect(element) {
        var clientRect = getBoundingClientRect(element);
        var width = element.offsetWidth;
        var height = element.offsetHeight;
        if (Math.abs(clientRect.width - width) <= 1) width = clientRect.width;
        if (Math.abs(clientRect.height - height) <= 1) height = clientRect.height;
        return {
            x: element.offsetLeft,
            y: element.offsetTop,
            width,
            height
        };
    }
    function getParentNode(element) {
        if ("html" === getNodeName(element)) return element;
        return element.assignedSlot || element.parentNode || (isShadowRoot(element) ? element.host : null) || getDocumentElement(element);
    }
    function getScrollParent(node) {
        if ([ "html", "body", "#document" ].indexOf(getNodeName(node)) >= 0) return node.ownerDocument.body;
        if (isHTMLElement(node) && isScrollParent(node)) return node;
        return getScrollParent(getParentNode(node));
    }
    function listScrollParents(element, list) {
        var _element$ownerDocumen;
        if (void 0 === list) list = [];
        var scrollParent = getScrollParent(element);
        var isBody = scrollParent === (null == (_element$ownerDocumen = element.ownerDocument) ? void 0 : _element$ownerDocumen.body);
        var win = getWindow_getWindow(scrollParent);
        var target = isBody ? [ win ].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
        var updatedList = list.concat(target);
        return isBody ? updatedList : updatedList.concat(listScrollParents(getParentNode(target)));
    }
    function isTableElement(element) {
        return [ "table", "td", "th" ].indexOf(getNodeName(element)) >= 0;
    }
    function getTrueOffsetParent(element) {
        if (!isHTMLElement(element) || "fixed" === getComputedStyle_getComputedStyle(element).position) return null;
        return element.offsetParent;
    }
    function getContainingBlock(element) {
        var isFirefox = /firefox/i.test(getUAString());
        var isIE = /Trident/i.test(getUAString());
        if (isIE && isHTMLElement(element)) {
            var elementCss = getComputedStyle_getComputedStyle(element);
            if ("fixed" === elementCss.position) return null;
        }
        var currentNode = getParentNode(element);
        if (isShadowRoot(currentNode)) currentNode = currentNode.host;
        while (isHTMLElement(currentNode) && [ "html", "body" ].indexOf(getNodeName(currentNode)) < 0) {
            var css = getComputedStyle_getComputedStyle(currentNode);
            if ("none" !== css.transform || "none" !== css.perspective || "paint" === css.contain || -1 !== [ "transform", "perspective" ].indexOf(css.willChange) || isFirefox && "filter" === css.willChange || isFirefox && css.filter && "none" !== css.filter) return currentNode; else currentNode = currentNode.parentNode;
        }
        return null;
    }
    function getOffsetParent(element) {
        var window = getWindow_getWindow(element);
        var offsetParent = getTrueOffsetParent(element);
        while (offsetParent && isTableElement(offsetParent) && "static" === getComputedStyle_getComputedStyle(offsetParent).position) offsetParent = getTrueOffsetParent(offsetParent);
        if (offsetParent && ("html" === getNodeName(offsetParent) || "body" === getNodeName(offsetParent) && "static" === getComputedStyle_getComputedStyle(offsetParent).position)) return window;
        return offsetParent || getContainingBlock(element) || window;
    }
    var enums_top = "top";
    var bottom = "bottom";
    var right = "right";
    var left = "left";
    var auto = "auto";
    var basePlacements = [ enums_top, bottom, right, left ];
    var start = "start";
    var end = "end";
    var clippingParents = "clippingParents";
    var viewport = "viewport";
    var popper = "popper";
    var reference = "reference";
    var variationPlacements = basePlacements.reduce((function(acc, placement) {
        return acc.concat([ placement + "-" + start, placement + "-" + end ]);
    }), []);
    var enums_placements = [].concat(basePlacements, [ auto ]).reduce((function(acc, placement) {
        return acc.concat([ placement, placement + "-" + start, placement + "-" + end ]);
    }), []);
    var beforeRead = "beforeRead";
    var read = "read";
    var afterRead = "afterRead";
    var beforeMain = "beforeMain";
    var main = "main";
    var afterMain = "afterMain";
    var beforeWrite = "beforeWrite";
    var write = "write";
    var afterWrite = "afterWrite";
    var modifierPhases = [ beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite ];
    function order(modifiers) {
        var map = new Map;
        var visited = new Set;
        var result = [];
        modifiers.forEach((function(modifier) {
            map.set(modifier.name, modifier);
        }));
        function sort(modifier) {
            visited.add(modifier.name);
            var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
            requires.forEach((function(dep) {
                if (!visited.has(dep)) {
                    var depModifier = map.get(dep);
                    if (depModifier) sort(depModifier);
                }
            }));
            result.push(modifier);
        }
        modifiers.forEach((function(modifier) {
            if (!visited.has(modifier.name)) sort(modifier);
        }));
        return result;
    }
    function orderModifiers(modifiers) {
        var orderedModifiers = order(modifiers);
        return modifierPhases.reduce((function(acc, phase) {
            return acc.concat(orderedModifiers.filter((function(modifier) {
                return modifier.phase === phase;
            })));
        }), []);
    }
    function debounce(fn) {
        var pending;
        return function() {
            if (!pending) pending = new Promise((function(resolve) {
                Promise.resolve().then((function() {
                    pending = void 0;
                    resolve(fn());
                }));
            }));
            return pending;
        };
    }
    function mergeByName(modifiers) {
        var merged = modifiers.reduce((function(merged, current) {
            var existing = merged[current.name];
            merged[current.name] = existing ? Object.assign({}, existing, current, {
                options: Object.assign({}, existing.options, current.options),
                data: Object.assign({}, existing.data, current.data)
            }) : current;
            return merged;
        }), {});
        return Object.keys(merged).map((function(key) {
            return merged[key];
        }));
    }
    var DEFAULT_OPTIONS = {
        placement: "bottom",
        modifiers: [],
        strategy: "absolute"
    };
    function areValidElements() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
        return !args.some((function(element) {
            return !(element && "function" === typeof element.getBoundingClientRect);
        }));
    }
    function popperGenerator(generatorOptions) {
        if (void 0 === generatorOptions) generatorOptions = {};
        var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers = void 0 === _generatorOptions$def ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = void 0 === _generatorOptions$def2 ? DEFAULT_OPTIONS : _generatorOptions$def2;
        return function createPopper(reference, popper, options) {
            if (void 0 === options) options = defaultOptions;
            var state = {
                placement: "bottom",
                orderedModifiers: [],
                options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
                modifiersData: {},
                elements: {
                    reference,
                    popper
                },
                attributes: {},
                styles: {}
            };
            var effectCleanupFns = [];
            var isDestroyed = false;
            var instance = {
                state,
                setOptions: function setOptions(setOptionsAction) {
                    var options = "function" === typeof setOptionsAction ? setOptionsAction(state.options) : setOptionsAction;
                    cleanupModifierEffects();
                    state.options = Object.assign({}, defaultOptions, state.options, options);
                    state.scrollParents = {
                        reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
                        popper: listScrollParents(popper)
                    };
                    var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers)));
                    state.orderedModifiers = orderedModifiers.filter((function(m) {
                        return m.enabled;
                    }));
                    if (false) ;
                    runModifierEffects();
                    return instance.update();
                },
                forceUpdate: function forceUpdate() {
                    if (isDestroyed) return;
                    var _state$elements = state.elements, reference = _state$elements.reference, popper = _state$elements.popper;
                    if (!areValidElements(reference, popper)) {
                        if (false) ;
                        return;
                    }
                    state.rects = {
                        reference: getCompositeRect(reference, getOffsetParent(popper), "fixed" === state.options.strategy),
                        popper: getLayoutRect(popper)
                    };
                    state.reset = false;
                    state.placement = state.options.placement;
                    state.orderedModifiers.forEach((function(modifier) {
                        return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
                    }));
                    for (var index = 0; index < state.orderedModifiers.length; index++) {
                        if (false) ;
                        if (true === state.reset) {
                            state.reset = false;
                            index = -1;
                            continue;
                        }
                        var _state$orderedModifie = state.orderedModifiers[index], fn = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = void 0 === _state$orderedModifie2 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
                        if ("function" === typeof fn) state = fn({
                            state,
                            options: _options,
                            name,
                            instance
                        }) || state;
                    }
                },
                update: debounce((function() {
                    return new Promise((function(resolve) {
                        instance.forceUpdate();
                        resolve(state);
                    }));
                })),
                destroy: function destroy() {
                    cleanupModifierEffects();
                    isDestroyed = true;
                }
            };
            if (!areValidElements(reference, popper)) {
                if (false) ;
                return instance;
            }
            instance.setOptions(options).then((function(state) {
                if (!isDestroyed && options.onFirstUpdate) options.onFirstUpdate(state);
            }));
            function runModifierEffects() {
                state.orderedModifiers.forEach((function(_ref3) {
                    var name = _ref3.name, _ref3$options = _ref3.options, options = void 0 === _ref3$options ? {} : _ref3$options, effect = _ref3.effect;
                    if ("function" === typeof effect) {
                        var cleanupFn = effect({
                            state,
                            name,
                            instance,
                            options
                        });
                        var noopFn = function noopFn() {};
                        effectCleanupFns.push(cleanupFn || noopFn);
                    }
                }));
            }
            function cleanupModifierEffects() {
                effectCleanupFns.forEach((function(fn) {
                    return fn();
                }));
                effectCleanupFns = [];
            }
            return instance;
        };
    }
    null && popperGenerator();
    var passive = {
        passive: true
    };
    function effect(_ref) {
        var state = _ref.state, instance = _ref.instance, options = _ref.options;
        var _options$scroll = options.scroll, scroll = void 0 === _options$scroll ? true : _options$scroll, _options$resize = options.resize, resize = void 0 === _options$resize ? true : _options$resize;
        var window = getWindow_getWindow(state.elements.popper);
        var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
        if (scroll) scrollParents.forEach((function(scrollParent) {
            scrollParent.addEventListener("scroll", instance.update, passive);
        }));
        if (resize) window.addEventListener("resize", instance.update, passive);
        return function() {
            if (scroll) scrollParents.forEach((function(scrollParent) {
                scrollParent.removeEventListener("scroll", instance.update, passive);
            }));
            if (resize) window.removeEventListener("resize", instance.update, passive);
        };
    }
    const eventListeners = {
        name: "eventListeners",
        enabled: true,
        phase: "write",
        fn: function fn() {},
        effect,
        data: {}
    };
    function getBasePlacement(placement) {
        return placement.split("-")[0];
    }
    function getVariation(placement) {
        return placement.split("-")[1];
    }
    function getMainAxisFromPlacement(placement) {
        return [ "top", "bottom" ].indexOf(placement) >= 0 ? "x" : "y";
    }
    function computeOffsets(_ref) {
        var reference = _ref.reference, element = _ref.element, placement = _ref.placement;
        var basePlacement = placement ? getBasePlacement(placement) : null;
        var variation = placement ? getVariation(placement) : null;
        var commonX = reference.x + reference.width / 2 - element.width / 2;
        var commonY = reference.y + reference.height / 2 - element.height / 2;
        var offsets;
        switch (basePlacement) {
          case enums_top:
            offsets = {
                x: commonX,
                y: reference.y - element.height
            };
            break;

          case bottom:
            offsets = {
                x: commonX,
                y: reference.y + reference.height
            };
            break;

          case right:
            offsets = {
                x: reference.x + reference.width,
                y: commonY
            };
            break;

          case left:
            offsets = {
                x: reference.x - element.width,
                y: commonY
            };
            break;

          default:
            offsets = {
                x: reference.x,
                y: reference.y
            };
        }
        var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
        if (null != mainAxis) {
            var len = "y" === mainAxis ? "height" : "width";
            switch (variation) {
              case start:
                offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
                break;

              case end:
                offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
                break;

              default:
            }
        }
        return offsets;
    }
    function popperOffsets(_ref) {
        var state = _ref.state, name = _ref.name;
        state.modifiersData[name] = computeOffsets({
            reference: state.rects.reference,
            element: state.rects.popper,
            strategy: "absolute",
            placement: state.placement
        });
    }
    const modifiers_popperOffsets = {
        name: "popperOffsets",
        enabled: true,
        phase: "read",
        fn: popperOffsets,
        data: {}
    };
    var unsetSides = {
        top: "auto",
        right: "auto",
        bottom: "auto",
        left: "auto"
    };
    function roundOffsetsByDPR(_ref) {
        var x = _ref.x, y = _ref.y;
        var win = window;
        var dpr = win.devicePixelRatio || 1;
        return {
            x: round(x * dpr) / dpr || 0,
            y: round(y * dpr) / dpr || 0
        };
    }
    function mapToStyles(_ref2) {
        var _Object$assign2;
        var popper = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
        var _offsets$x = offsets.x, x = void 0 === _offsets$x ? 0 : _offsets$x, _offsets$y = offsets.y, y = void 0 === _offsets$y ? 0 : _offsets$y;
        var _ref3 = "function" === typeof roundOffsets ? roundOffsets({
            x,
            y
        }) : {
            x,
            y
        };
        x = _ref3.x;
        y = _ref3.y;
        var hasX = offsets.hasOwnProperty("x");
        var hasY = offsets.hasOwnProperty("y");
        var sideX = left;
        var sideY = enums_top;
        var win = window;
        if (adaptive) {
            var offsetParent = getOffsetParent(popper);
            var heightProp = "clientHeight";
            var widthProp = "clientWidth";
            if (offsetParent === getWindow_getWindow(popper)) {
                offsetParent = getDocumentElement(popper);
                if ("static" !== getComputedStyle_getComputedStyle(offsetParent).position && "absolute" === position) {
                    heightProp = "scrollHeight";
                    widthProp = "scrollWidth";
                }
            }
            offsetParent;
            if (placement === enums_top || (placement === left || placement === right) && variation === end) {
                sideY = bottom;
                var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : offsetParent[heightProp];
                y -= offsetY - popperRect.height;
                y *= gpuAcceleration ? 1 : -1;
            }
            if (placement === left || (placement === enums_top || placement === bottom) && variation === end) {
                sideX = right;
                var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : offsetParent[widthProp];
                x -= offsetX - popperRect.width;
                x *= gpuAcceleration ? 1 : -1;
            }
        }
        var commonStyles = Object.assign({
            position
        }, adaptive && unsetSides);
        var _ref4 = true === roundOffsets ? roundOffsetsByDPR({
            x,
            y
        }) : {
            x,
            y
        };
        x = _ref4.x;
        y = _ref4.y;
        if (gpuAcceleration) {
            var _Object$assign;
            return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", 
            _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", 
            _Object$assign));
        }
        return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", 
        _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
    }
    function computeStyles(_ref5) {
        var state = _ref5.state, options = _ref5.options;
        var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = void 0 === _options$gpuAccelerat ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = void 0 === _options$adaptive ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = void 0 === _options$roundOffsets ? true : _options$roundOffsets;
        if (false) ;
        var commonStyles = {
            placement: getBasePlacement(state.placement),
            variation: getVariation(state.placement),
            popper: state.elements.popper,
            popperRect: state.rects.popper,
            gpuAcceleration,
            isFixed: "fixed" === state.options.strategy
        };
        if (null != state.modifiersData.popperOffsets) state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
            offsets: state.modifiersData.popperOffsets,
            position: state.options.strategy,
            adaptive,
            roundOffsets
        })));
        if (null != state.modifiersData.arrow) state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
            offsets: state.modifiersData.arrow,
            position: "absolute",
            adaptive: false,
            roundOffsets
        })));
        state.attributes.popper = Object.assign({}, state.attributes.popper, {
            "data-popper-placement": state.placement
        });
    }
    const modifiers_computeStyles = {
        name: "computeStyles",
        enabled: true,
        phase: "beforeWrite",
        fn: computeStyles,
        data: {}
    };
    function applyStyles(_ref) {
        var state = _ref.state;
        Object.keys(state.elements).forEach((function(name) {
            var style = state.styles[name] || {};
            var attributes = state.attributes[name] || {};
            var element = state.elements[name];
            if (!isHTMLElement(element) || !getNodeName(element)) return;
            Object.assign(element.style, style);
            Object.keys(attributes).forEach((function(name) {
                var value = attributes[name];
                if (false === value) element.removeAttribute(name); else element.setAttribute(name, true === value ? "" : value);
            }));
        }));
    }
    function applyStyles_effect(_ref2) {
        var state = _ref2.state;
        var initialStyles = {
            popper: {
                position: state.options.strategy,
                left: "0",
                top: "0",
                margin: "0"
            },
            arrow: {
                position: "absolute"
            },
            reference: {}
        };
        Object.assign(state.elements.popper.style, initialStyles.popper);
        state.styles = initialStyles;
        if (state.elements.arrow) Object.assign(state.elements.arrow.style, initialStyles.arrow);
        return function() {
            Object.keys(state.elements).forEach((function(name) {
                var element = state.elements[name];
                var attributes = state.attributes[name] || {};
                var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
                var style = styleProperties.reduce((function(style, property) {
                    style[property] = "";
                    return style;
                }), {});
                if (!isHTMLElement(element) || !getNodeName(element)) return;
                Object.assign(element.style, style);
                Object.keys(attributes).forEach((function(attribute) {
                    element.removeAttribute(attribute);
                }));
            }));
        };
    }
    const modifiers_applyStyles = {
        name: "applyStyles",
        enabled: true,
        phase: "write",
        fn: applyStyles,
        effect: applyStyles_effect,
        requires: [ "computeStyles" ]
    };
    function distanceAndSkiddingToXY(placement, rects, offset) {
        var basePlacement = getBasePlacement(placement);
        var invertDistance = [ left, enums_top ].indexOf(basePlacement) >= 0 ? -1 : 1;
        var _ref = "function" === typeof offset ? offset(Object.assign({}, rects, {
            placement
        })) : offset, skidding = _ref[0], distance = _ref[1];
        skidding = skidding || 0;
        distance = (distance || 0) * invertDistance;
        return [ left, right ].indexOf(basePlacement) >= 0 ? {
            x: distance,
            y: skidding
        } : {
            x: skidding,
            y: distance
        };
    }
    function offset(_ref2) {
        var state = _ref2.state, options = _ref2.options, name = _ref2.name;
        var _options$offset = options.offset, offset = void 0 === _options$offset ? [ 0, 0 ] : _options$offset;
        var data = enums_placements.reduce((function(acc, placement) {
            acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
            return acc;
        }), {});
        var _data$state$placement = data[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
        if (null != state.modifiersData.popperOffsets) {
            state.modifiersData.popperOffsets.x += x;
            state.modifiersData.popperOffsets.y += y;
        }
        state.modifiersData[name] = data;
    }
    const modifiers_offset = {
        name: "offset",
        enabled: true,
        phase: "main",
        requires: [ "popperOffsets" ],
        fn: offset
    };
    var hash = {
        left: "right",
        right: "left",
        bottom: "top",
        top: "bottom"
    };
    function getOppositePlacement(placement) {
        return placement.replace(/left|right|bottom|top/g, (function(matched) {
            return hash[matched];
        }));
    }
    var getOppositeVariationPlacement_hash = {
        start: "end",
        end: "start"
    };
    function getOppositeVariationPlacement(placement) {
        return placement.replace(/start|end/g, (function(matched) {
            return getOppositeVariationPlacement_hash[matched];
        }));
    }
    function getViewportRect(element, strategy) {
        var win = getWindow_getWindow(element);
        var html = getDocumentElement(element);
        var visualViewport = win.visualViewport;
        var width = html.clientWidth;
        var height = html.clientHeight;
        var x = 0;
        var y = 0;
        if (visualViewport) {
            width = visualViewport.width;
            height = visualViewport.height;
            var layoutViewport = isLayoutViewport();
            if (layoutViewport || !layoutViewport && "fixed" === strategy) {
                x = visualViewport.offsetLeft;
                y = visualViewport.offsetTop;
            }
        }
        return {
            width,
            height,
            x: x + getWindowScrollBarX(element),
            y
        };
    }
    function getDocumentRect(element) {
        var _element$ownerDocumen;
        var html = getDocumentElement(element);
        var winScroll = getWindowScroll(element);
        var body = null == (_element$ownerDocumen = element.ownerDocument) ? void 0 : _element$ownerDocumen.body;
        var width = math_max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
        var height = math_max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
        var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
        var y = -winScroll.scrollTop;
        if ("rtl" === getComputedStyle_getComputedStyle(body || html).direction) x += math_max(html.clientWidth, body ? body.clientWidth : 0) - width;
        return {
            width,
            height,
            x,
            y
        };
    }
    function contains(parent, child) {
        var rootNode = child.getRootNode && child.getRootNode();
        if (parent.contains(child)) return true; else if (rootNode && isShadowRoot(rootNode)) {
            var next = child;
            do {
                if (next && parent.isSameNode(next)) return true;
                next = next.parentNode || next.host;
            } while (next);
        }
        return false;
    }
    function rectToClientRect(rect) {
        return Object.assign({}, rect, {
            left: rect.x,
            top: rect.y,
            right: rect.x + rect.width,
            bottom: rect.y + rect.height
        });
    }
    function getInnerBoundingClientRect(element, strategy) {
        var rect = getBoundingClientRect(element, false, "fixed" === strategy);
        rect.top = rect.top + element.clientTop;
        rect.left = rect.left + element.clientLeft;
        rect.bottom = rect.top + element.clientHeight;
        rect.right = rect.left + element.clientWidth;
        rect.width = element.clientWidth;
        rect.height = element.clientHeight;
        rect.x = rect.left;
        rect.y = rect.top;
        return rect;
    }
    function getClientRectFromMixedType(element, clippingParent, strategy) {
        return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
    }
    function getClippingParents(element) {
        var clippingParents = listScrollParents(getParentNode(element));
        var canEscapeClipping = [ "absolute", "fixed" ].indexOf(getComputedStyle_getComputedStyle(element).position) >= 0;
        var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
        if (!isElement(clipperElement)) return [];
        return clippingParents.filter((function(clippingParent) {
            return isElement(clippingParent) && contains(clippingParent, clipperElement) && "body" !== getNodeName(clippingParent);
        }));
    }
    function getClippingRect(element, boundary, rootBoundary, strategy) {
        var mainClippingParents = "clippingParents" === boundary ? getClippingParents(element) : [].concat(boundary);
        var clippingParents = [].concat(mainClippingParents, [ rootBoundary ]);
        var firstClippingParent = clippingParents[0];
        var clippingRect = clippingParents.reduce((function(accRect, clippingParent) {
            var rect = getClientRectFromMixedType(element, clippingParent, strategy);
            accRect.top = math_max(rect.top, accRect.top);
            accRect.right = math_min(rect.right, accRect.right);
            accRect.bottom = math_min(rect.bottom, accRect.bottom);
            accRect.left = math_max(rect.left, accRect.left);
            return accRect;
        }), getClientRectFromMixedType(element, firstClippingParent, strategy));
        clippingRect.width = clippingRect.right - clippingRect.left;
        clippingRect.height = clippingRect.bottom - clippingRect.top;
        clippingRect.x = clippingRect.left;
        clippingRect.y = clippingRect.top;
        return clippingRect;
    }
    function getFreshSideObject() {
        return {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };
    }
    function mergePaddingObject(paddingObject) {
        return Object.assign({}, getFreshSideObject(), paddingObject);
    }
    function expandToHashMap(value, keys) {
        return keys.reduce((function(hashMap, key) {
            hashMap[key] = value;
            return hashMap;
        }), {});
    }
    function detectOverflow(state, options) {
        if (void 0 === options) options = {};
        var _options = options, _options$placement = _options.placement, placement = void 0 === _options$placement ? state.placement : _options$placement, _options$strategy = _options.strategy, strategy = void 0 === _options$strategy ? state.strategy : _options$strategy, _options$boundary = _options.boundary, boundary = void 0 === _options$boundary ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = void 0 === _options$rootBoundary ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = void 0 === _options$elementConte ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = void 0 === _options$altBoundary ? false : _options$altBoundary, _options$padding = _options.padding, padding = void 0 === _options$padding ? 0 : _options$padding;
        var paddingObject = mergePaddingObject("number" !== typeof padding ? padding : expandToHashMap(padding, basePlacements));
        var altContext = elementContext === popper ? reference : popper;
        var popperRect = state.rects.popper;
        var element = state.elements[altBoundary ? altContext : elementContext];
        var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
        var referenceClientRect = getBoundingClientRect(state.elements.reference);
        var popperOffsets = computeOffsets({
            reference: referenceClientRect,
            element: popperRect,
            strategy: "absolute",
            placement
        });
        var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
        var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
        var overflowOffsets = {
            top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
            bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
            left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
            right: elementClientRect.right - clippingClientRect.right + paddingObject.right
        };
        var offsetData = state.modifiersData.offset;
        if (elementContext === popper && offsetData) {
            var offset = offsetData[placement];
            Object.keys(overflowOffsets).forEach((function(key) {
                var multiply = [ right, bottom ].indexOf(key) >= 0 ? 1 : -1;
                var axis = [ enums_top, bottom ].indexOf(key) >= 0 ? "y" : "x";
                overflowOffsets[key] += offset[axis] * multiply;
            }));
        }
        return overflowOffsets;
    }
    function computeAutoPlacement(state, options) {
        if (void 0 === options) options = {};
        var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = void 0 === _options$allowedAutoP ? enums_placements : _options$allowedAutoP;
        var variation = getVariation(placement);
        var placements = variation ? flipVariations ? variationPlacements : variationPlacements.filter((function(placement) {
            return getVariation(placement) === variation;
        })) : basePlacements;
        var allowedPlacements = placements.filter((function(placement) {
            return allowedAutoPlacements.indexOf(placement) >= 0;
        }));
        if (0 === allowedPlacements.length) {
            allowedPlacements = placements;
            if (false) ;
        }
        var overflows = allowedPlacements.reduce((function(acc, placement) {
            acc[placement] = detectOverflow(state, {
                placement,
                boundary,
                rootBoundary,
                padding
            })[getBasePlacement(placement)];
            return acc;
        }), {});
        return Object.keys(overflows).sort((function(a, b) {
            return overflows[a] - overflows[b];
        }));
    }
    function getExpandedFallbackPlacements(placement) {
        if (getBasePlacement(placement) === auto) return [];
        var oppositePlacement = getOppositePlacement(placement);
        return [ getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement) ];
    }
    function flip(_ref) {
        var state = _ref.state, options = _ref.options, name = _ref.name;
        if (state.modifiersData[name]._skip) return;
        var _options$mainAxis = options.mainAxis, checkMainAxis = void 0 === _options$mainAxis ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = void 0 === _options$altAxis ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = void 0 === _options$flipVariatio ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
        var preferredPlacement = state.options.placement;
        var basePlacement = getBasePlacement(preferredPlacement);
        var isBasePlacement = basePlacement === preferredPlacement;
        var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [ getOppositePlacement(preferredPlacement) ] : getExpandedFallbackPlacements(preferredPlacement));
        var placements = [ preferredPlacement ].concat(fallbackPlacements).reduce((function(acc, placement) {
            return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
                placement,
                boundary,
                rootBoundary,
                padding,
                flipVariations,
                allowedAutoPlacements
            }) : placement);
        }), []);
        var referenceRect = state.rects.reference;
        var popperRect = state.rects.popper;
        var checksMap = new Map;
        var makeFallbackChecks = true;
        var firstFittingPlacement = placements[0];
        for (var i = 0; i < placements.length; i++) {
            var placement = placements[i];
            var _basePlacement = getBasePlacement(placement);
            var isStartVariation = getVariation(placement) === start;
            var isVertical = [ enums_top, bottom ].indexOf(_basePlacement) >= 0;
            var len = isVertical ? "width" : "height";
            var overflow = detectOverflow(state, {
                placement,
                boundary,
                rootBoundary,
                altBoundary,
                padding
            });
            var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : enums_top;
            if (referenceRect[len] > popperRect[len]) mainVariationSide = getOppositePlacement(mainVariationSide);
            var altVariationSide = getOppositePlacement(mainVariationSide);
            var checks = [];
            if (checkMainAxis) checks.push(overflow[_basePlacement] <= 0);
            if (checkAltAxis) checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
            if (checks.every((function(check) {
                return check;
            }))) {
                firstFittingPlacement = placement;
                makeFallbackChecks = false;
                break;
            }
            checksMap.set(placement, checks);
        }
        if (makeFallbackChecks) {
            var numberOfChecks = flipVariations ? 3 : 1;
            var _loop = function _loop(_i) {
                var fittingPlacement = placements.find((function(placement) {
                    var checks = checksMap.get(placement);
                    if (checks) return checks.slice(0, _i).every((function(check) {
                        return check;
                    }));
                }));
                if (fittingPlacement) {
                    firstFittingPlacement = fittingPlacement;
                    return "break";
                }
            };
            for (var _i = numberOfChecks; _i > 0; _i--) {
                var _ret = _loop(_i);
                if ("break" === _ret) break;
            }
        }
        if (state.placement !== firstFittingPlacement) {
            state.modifiersData[name]._skip = true;
            state.placement = firstFittingPlacement;
            state.reset = true;
        }
    }
    const modifiers_flip = {
        name: "flip",
        enabled: true,
        phase: "main",
        fn: flip,
        requiresIfExists: [ "offset" ],
        data: {
            _skip: false
        }
    };
    function getAltAxis(axis) {
        return "x" === axis ? "y" : "x";
    }
    function within(min, value, max) {
        return math_max(min, math_min(value, max));
    }
    function withinMaxClamp(min, value, max) {
        var v = within(min, value, max);
        return v > max ? max : v;
    }
    function preventOverflow(_ref) {
        var state = _ref.state, options = _ref.options, name = _ref.name;
        var _options$mainAxis = options.mainAxis, checkMainAxis = void 0 === _options$mainAxis ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = void 0 === _options$altAxis ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = void 0 === _options$tether ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = void 0 === _options$tetherOffset ? 0 : _options$tetherOffset;
        var overflow = detectOverflow(state, {
            boundary,
            rootBoundary,
            padding,
            altBoundary
        });
        var basePlacement = getBasePlacement(state.placement);
        var variation = getVariation(state.placement);
        var isBasePlacement = !variation;
        var mainAxis = getMainAxisFromPlacement(basePlacement);
        var altAxis = getAltAxis(mainAxis);
        var popperOffsets = state.modifiersData.popperOffsets;
        var referenceRect = state.rects.reference;
        var popperRect = state.rects.popper;
        var tetherOffsetValue = "function" === typeof tetherOffset ? tetherOffset(Object.assign({}, state.rects, {
            placement: state.placement
        })) : tetherOffset;
        var normalizedTetherOffsetValue = "number" === typeof tetherOffsetValue ? {
            mainAxis: tetherOffsetValue,
            altAxis: tetherOffsetValue
        } : Object.assign({
            mainAxis: 0,
            altAxis: 0
        }, tetherOffsetValue);
        var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
        var data = {
            x: 0,
            y: 0
        };
        if (!popperOffsets) return;
        if (checkMainAxis) {
            var _offsetModifierState$;
            var mainSide = "y" === mainAxis ? enums_top : left;
            var altSide = "y" === mainAxis ? bottom : right;
            var len = "y" === mainAxis ? "height" : "width";
            var offset = popperOffsets[mainAxis];
            var min = offset + overflow[mainSide];
            var max = offset - overflow[altSide];
            var additive = tether ? -popperRect[len] / 2 : 0;
            var minLen = variation === start ? referenceRect[len] : popperRect[len];
            var maxLen = variation === start ? -popperRect[len] : -referenceRect[len];
            var arrowElement = state.elements.arrow;
            var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
                width: 0,
                height: 0
            };
            var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
            var arrowPaddingMin = arrowPaddingObject[mainSide];
            var arrowPaddingMax = arrowPaddingObject[altSide];
            var arrowLen = within(0, referenceRect[len], arrowRect[len]);
            var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
            var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
            var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
            var clientOffset = arrowOffsetParent ? "y" === mainAxis ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
            var offsetModifierValue = null != (_offsetModifierState$ = null == offsetModifierState ? void 0 : offsetModifierState[mainAxis]) ? _offsetModifierState$ : 0;
            var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
            var tetherMax = offset + maxOffset - offsetModifierValue;
            var preventedOffset = within(tether ? math_min(min, tetherMin) : min, offset, tether ? math_max(max, tetherMax) : max);
            popperOffsets[mainAxis] = preventedOffset;
            data[mainAxis] = preventedOffset - offset;
        }
        if (checkAltAxis) {
            var _offsetModifierState$2;
            var _mainSide = "x" === mainAxis ? enums_top : left;
            var _altSide = "x" === mainAxis ? bottom : right;
            var _offset = popperOffsets[altAxis];
            var _len = "y" === altAxis ? "height" : "width";
            var _min = _offset + overflow[_mainSide];
            var _max = _offset - overflow[_altSide];
            var isOriginSide = -1 !== [ enums_top, left ].indexOf(basePlacement);
            var _offsetModifierValue = null != (_offsetModifierState$2 = null == offsetModifierState ? void 0 : offsetModifierState[altAxis]) ? _offsetModifierState$2 : 0;
            var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
            var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
            var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
            popperOffsets[altAxis] = _preventedOffset;
            data[altAxis] = _preventedOffset - _offset;
        }
        state.modifiersData[name] = data;
    }
    const modifiers_preventOverflow = {
        name: "preventOverflow",
        enabled: true,
        phase: "main",
        fn: preventOverflow,
        requiresIfExists: [ "offset" ]
    };
    var toPaddingObject = function toPaddingObject(padding, state) {
        padding = "function" === typeof padding ? padding(Object.assign({}, state.rects, {
            placement: state.placement
        })) : padding;
        return mergePaddingObject("number" !== typeof padding ? padding : expandToHashMap(padding, basePlacements));
    };
    function arrow(_ref) {
        var _state$modifiersData$;
        var state = _ref.state, name = _ref.name, options = _ref.options;
        var arrowElement = state.elements.arrow;
        var popperOffsets = state.modifiersData.popperOffsets;
        var basePlacement = getBasePlacement(state.placement);
        var axis = getMainAxisFromPlacement(basePlacement);
        var isVertical = [ left, right ].indexOf(basePlacement) >= 0;
        var len = isVertical ? "height" : "width";
        if (!arrowElement || !popperOffsets) return;
        var paddingObject = toPaddingObject(options.padding, state);
        var arrowRect = getLayoutRect(arrowElement);
        var minProp = "y" === axis ? enums_top : left;
        var maxProp = "y" === axis ? bottom : right;
        var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
        var startDiff = popperOffsets[axis] - state.rects.reference[axis];
        var arrowOffsetParent = getOffsetParent(arrowElement);
        var clientSize = arrowOffsetParent ? "y" === axis ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
        var centerToReference = endDiff / 2 - startDiff / 2;
        var min = paddingObject[minProp];
        var max = clientSize - arrowRect[len] - paddingObject[maxProp];
        var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
        var offset = within(min, center, max);
        var axisProp = axis;
        state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, 
        _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
    }
    function arrow_effect(_ref2) {
        var state = _ref2.state, options = _ref2.options;
        var _options$element = options.element, arrowElement = void 0 === _options$element ? "[data-popper-arrow]" : _options$element;
        if (null == arrowElement) return;
        if ("string" === typeof arrowElement) {
            arrowElement = state.elements.popper.querySelector(arrowElement);
            if (!arrowElement) return;
        }
        if (false) ;
        if (!contains(state.elements.popper, arrowElement)) {
            if (false) ;
            return;
        }
        state.elements.arrow = arrowElement;
    }
    const modifiers_arrow = {
        name: "arrow",
        enabled: true,
        phase: "main",
        fn: arrow,
        effect: arrow_effect,
        requires: [ "popperOffsets" ],
        requiresIfExists: [ "preventOverflow" ]
    };
    function getSideOffsets(overflow, rect, preventedOffsets) {
        if (void 0 === preventedOffsets) preventedOffsets = {
            x: 0,
            y: 0
        };
        return {
            top: overflow.top - rect.height - preventedOffsets.y,
            right: overflow.right - rect.width + preventedOffsets.x,
            bottom: overflow.bottom - rect.height + preventedOffsets.y,
            left: overflow.left - rect.width - preventedOffsets.x
        };
    }
    function isAnySideFullyClipped(overflow) {
        return [ enums_top, right, bottom, left ].some((function(side) {
            return overflow[side] >= 0;
        }));
    }
    function hide(_ref) {
        var state = _ref.state, name = _ref.name;
        var referenceRect = state.rects.reference;
        var popperRect = state.rects.popper;
        var preventedOffsets = state.modifiersData.preventOverflow;
        var referenceOverflow = detectOverflow(state, {
            elementContext: "reference"
        });
        var popperAltOverflow = detectOverflow(state, {
            altBoundary: true
        });
        var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
        var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
        var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
        var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
        state.modifiersData[name] = {
            referenceClippingOffsets,
            popperEscapeOffsets,
            isReferenceHidden,
            hasPopperEscaped
        };
        state.attributes.popper = Object.assign({}, state.attributes.popper, {
            "data-popper-reference-hidden": isReferenceHidden,
            "data-popper-escaped": hasPopperEscaped
        });
    }
    const modifiers_hide = {
        name: "hide",
        enabled: true,
        phase: "main",
        requiresIfExists: [ "preventOverflow" ],
        fn: hide
    };
    var defaultModifiers = [ eventListeners, modifiers_popperOffsets, modifiers_computeStyles, modifiers_applyStyles, modifiers_offset, modifiers_flip, modifiers_preventOverflow, modifiers_arrow, modifiers_hide ];
    var popper_createPopper = popperGenerator({
        defaultModifiers
    });
    var BOX_CLASS = "tippy-box";
    var CONTENT_CLASS = "tippy-content";
    var BACKDROP_CLASS = "tippy-backdrop";
    var ARROW_CLASS = "tippy-arrow";
    var SVG_ARROW_CLASS = "tippy-svg-arrow";
    var TOUCH_OPTIONS = {
        passive: true,
        capture: true
    };
    var TIPPY_DEFAULT_APPEND_TO = function TIPPY_DEFAULT_APPEND_TO() {
        return document.body;
    };
    function getValueAtIndexOrReturn(value, index, defaultValue) {
        if (Array.isArray(value)) {
            var v = value[index];
            return null == v ? Array.isArray(defaultValue) ? defaultValue[index] : defaultValue : v;
        }
        return value;
    }
    function isType(value, type) {
        var str = {}.toString.call(value);
        return 0 === str.indexOf("[object") && str.indexOf(type + "]") > -1;
    }
    function invokeWithArgsOrReturn(value, args) {
        return "function" === typeof value ? value.apply(void 0, args) : value;
    }
    function tippy_esm_debounce(fn, ms) {
        if (0 === ms) return fn;
        var timeout;
        return function(arg) {
            clearTimeout(timeout);
            timeout = setTimeout((function() {
                fn(arg);
            }), ms);
        };
    }
    function splitBySpaces(value) {
        return value.split(/\s+/).filter(Boolean);
    }
    function normalizeToArray(value) {
        return [].concat(value);
    }
    function pushIfUnique(arr, value) {
        if (-1 === arr.indexOf(value)) arr.push(value);
    }
    function unique(arr) {
        return arr.filter((function(item, index) {
            return arr.indexOf(item) === index;
        }));
    }
    function tippy_esm_getBasePlacement(placement) {
        return placement.split("-")[0];
    }
    function arrayFrom(value) {
        return [].slice.call(value);
    }
    function removeUndefinedProps(obj) {
        return Object.keys(obj).reduce((function(acc, key) {
            if (void 0 !== obj[key]) acc[key] = obj[key];
            return acc;
        }), {});
    }
    function div() {
        return document.createElement("div");
    }
    function tippy_esm_isElement(value) {
        return [ "Element", "Fragment" ].some((function(type) {
            return isType(value, type);
        }));
    }
    function isNodeList(value) {
        return isType(value, "NodeList");
    }
    function isMouseEvent(value) {
        return isType(value, "MouseEvent");
    }
    function isReferenceElement(value) {
        return !!(value && value._tippy && value._tippy.reference === value);
    }
    function getArrayOfElements(value) {
        if (tippy_esm_isElement(value)) return [ value ];
        if (isNodeList(value)) return arrayFrom(value);
        if (Array.isArray(value)) return value;
        return arrayFrom(document.querySelectorAll(value));
    }
    function setTransitionDuration(els, value) {
        els.forEach((function(el) {
            if (el) el.style.transitionDuration = value + "ms";
        }));
    }
    function setVisibilityState(els, state) {
        els.forEach((function(el) {
            if (el) el.setAttribute("data-state", state);
        }));
    }
    function getOwnerDocument(elementOrElements) {
        var _element$ownerDocumen;
        var _normalizeToArray = normalizeToArray(elementOrElements), element = _normalizeToArray[0];
        return null != element && null != (_element$ownerDocumen = element.ownerDocument) && _element$ownerDocumen.body ? element.ownerDocument : document;
    }
    function isCursorOutsideInteractiveBorder(popperTreeData, event) {
        var clientX = event.clientX, clientY = event.clientY;
        return popperTreeData.every((function(_ref) {
            var popperRect = _ref.popperRect, popperState = _ref.popperState, props = _ref.props;
            var interactiveBorder = props.interactiveBorder;
            var basePlacement = tippy_esm_getBasePlacement(popperState.placement);
            var offsetData = popperState.modifiersData.offset;
            if (!offsetData) return true;
            var topDistance = "bottom" === basePlacement ? offsetData.top.y : 0;
            var bottomDistance = "top" === basePlacement ? offsetData.bottom.y : 0;
            var leftDistance = "right" === basePlacement ? offsetData.left.x : 0;
            var rightDistance = "left" === basePlacement ? offsetData.right.x : 0;
            var exceedsTop = popperRect.top - clientY + topDistance > interactiveBorder;
            var exceedsBottom = clientY - popperRect.bottom - bottomDistance > interactiveBorder;
            var exceedsLeft = popperRect.left - clientX + leftDistance > interactiveBorder;
            var exceedsRight = clientX - popperRect.right - rightDistance > interactiveBorder;
            return exceedsTop || exceedsBottom || exceedsLeft || exceedsRight;
        }));
    }
    function updateTransitionEndListener(box, action, listener) {
        var method = action + "EventListener";
        [ "transitionend", "webkitTransitionEnd" ].forEach((function(event) {
            box[method](event, listener);
        }));
    }
    function actualContains(parent, child) {
        var target = child;
        while (target) {
            var _target$getRootNode;
            if (parent.contains(target)) return true;
            target = null == target.getRootNode ? void 0 : null == (_target$getRootNode = target.getRootNode()) ? void 0 : _target$getRootNode.host;
        }
        return false;
    }
    var currentInput = {
        isTouch: false
    };
    var lastMouseMoveTime = 0;
    function onDocumentTouchStart() {
        if (currentInput.isTouch) return;
        currentInput.isTouch = true;
        if (window.performance) document.addEventListener("mousemove", onDocumentMouseMove);
    }
    function onDocumentMouseMove() {
        var now = performance.now();
        if (now - lastMouseMoveTime < 20) {
            currentInput.isTouch = false;
            document.removeEventListener("mousemove", onDocumentMouseMove);
        }
        lastMouseMoveTime = now;
    }
    function onWindowBlur() {
        var activeElement = document.activeElement;
        if (isReferenceElement(activeElement)) {
            var instance = activeElement._tippy;
            if (activeElement.blur && !instance.state.isVisible) activeElement.blur();
        }
    }
    function bindGlobalEventListeners() {
        document.addEventListener("touchstart", onDocumentTouchStart, TOUCH_OPTIONS);
        window.addEventListener("blur", onWindowBlur);
    }
    var isBrowser = "undefined" !== typeof window && "undefined" !== typeof document;
    var isIE11 = isBrowser ? !!window.msCrypto : false;
    if (false) ;
    var pluginProps = {
        animateFill: false,
        followCursor: false,
        inlinePositioning: false,
        sticky: false
    };
    var renderProps = {
        allowHTML: false,
        animation: "fade",
        arrow: true,
        content: "",
        inertia: false,
        maxWidth: 350,
        role: "tooltip",
        theme: "",
        zIndex: 9999
    };
    var defaultProps = Object.assign({
        appendTo: TIPPY_DEFAULT_APPEND_TO,
        aria: {
            content: "auto",
            expanded: "auto"
        },
        delay: 0,
        duration: [ 300, 250 ],
        getReferenceClientRect: null,
        hideOnClick: true,
        ignoreAttributes: false,
        interactive: false,
        interactiveBorder: 2,
        interactiveDebounce: 0,
        moveTransition: "",
        offset: [ 0, 10 ],
        onAfterUpdate: function onAfterUpdate() {},
        onBeforeUpdate: function onBeforeUpdate() {},
        onCreate: function onCreate() {},
        onDestroy: function onDestroy() {},
        onHidden: function onHidden() {},
        onHide: function onHide() {},
        onMount: function onMount() {},
        onShow: function onShow() {},
        onShown: function onShown() {},
        onTrigger: function onTrigger() {},
        onUntrigger: function onUntrigger() {},
        onClickOutside: function onClickOutside() {},
        placement: "top",
        plugins: [],
        popperOptions: {},
        render: null,
        showOnCreate: false,
        touch: true,
        trigger: "mouseenter focus",
        triggerTarget: null
    }, pluginProps, renderProps);
    var defaultKeys = Object.keys(defaultProps);
    var setDefaultProps = function setDefaultProps(partialProps) {
        if (false) ;
        var keys = Object.keys(partialProps);
        keys.forEach((function(key) {
            defaultProps[key] = partialProps[key];
        }));
    };
    function getExtendedPassedProps(passedProps) {
        var plugins = passedProps.plugins || [];
        var pluginProps = plugins.reduce((function(acc, plugin) {
            var name = plugin.name, defaultValue = plugin.defaultValue;
            if (name) {
                var _name;
                acc[name] = void 0 !== passedProps[name] ? passedProps[name] : null != (_name = defaultProps[name]) ? _name : defaultValue;
            }
            return acc;
        }), {});
        return Object.assign({}, passedProps, pluginProps);
    }
    function getDataAttributeProps(reference, plugins) {
        var propKeys = plugins ? Object.keys(getExtendedPassedProps(Object.assign({}, defaultProps, {
            plugins
        }))) : defaultKeys;
        var props = propKeys.reduce((function(acc, key) {
            var valueAsString = (reference.getAttribute("data-tippy-" + key) || "").trim();
            if (!valueAsString) return acc;
            if ("content" === key) acc[key] = valueAsString; else try {
                acc[key] = JSON.parse(valueAsString);
            } catch (e) {
                acc[key] = valueAsString;
            }
            return acc;
        }), {});
        return props;
    }
    function evaluateProps(reference, props) {
        var out = Object.assign({}, props, {
            content: invokeWithArgsOrReturn(props.content, [ reference ])
        }, props.ignoreAttributes ? {} : getDataAttributeProps(reference, props.plugins));
        out.aria = Object.assign({}, defaultProps.aria, out.aria);
        out.aria = {
            expanded: "auto" === out.aria.expanded ? props.interactive : out.aria.expanded,
            content: "auto" === out.aria.content ? props.interactive ? null : "describedby" : out.aria.content
        };
        return out;
    }
    var innerHTML = function innerHTML() {
        return "innerHTML";
    };
    function dangerouslySetInnerHTML(element, html) {
        element[innerHTML()] = html;
    }
    function createArrowElement(value) {
        var arrow = div();
        if (true === value) arrow.className = ARROW_CLASS; else {
            arrow.className = SVG_ARROW_CLASS;
            if (tippy_esm_isElement(value)) arrow.appendChild(value); else dangerouslySetInnerHTML(arrow, value);
        }
        return arrow;
    }
    function setContent(content, props) {
        if (tippy_esm_isElement(props.content)) {
            dangerouslySetInnerHTML(content, "");
            content.appendChild(props.content);
        } else if ("function" !== typeof props.content) if (props.allowHTML) dangerouslySetInnerHTML(content, props.content); else content.textContent = props.content;
    }
    function getChildren(popper) {
        var box = popper.firstElementChild;
        var boxChildren = arrayFrom(box.children);
        return {
            box,
            content: boxChildren.find((function(node) {
                return node.classList.contains(CONTENT_CLASS);
            })),
            arrow: boxChildren.find((function(node) {
                return node.classList.contains(ARROW_CLASS) || node.classList.contains(SVG_ARROW_CLASS);
            })),
            backdrop: boxChildren.find((function(node) {
                return node.classList.contains(BACKDROP_CLASS);
            }))
        };
    }
    function render(instance) {
        var popper = div();
        var box = div();
        box.className = BOX_CLASS;
        box.setAttribute("data-state", "hidden");
        box.setAttribute("tabindex", "-1");
        var content = div();
        content.className = CONTENT_CLASS;
        content.setAttribute("data-state", "hidden");
        setContent(content, instance.props);
        popper.appendChild(box);
        box.appendChild(content);
        onUpdate(instance.props, instance.props);
        function onUpdate(prevProps, nextProps) {
            var _getChildren = getChildren(popper), box = _getChildren.box, content = _getChildren.content, arrow = _getChildren.arrow;
            if (nextProps.theme) box.setAttribute("data-theme", nextProps.theme); else box.removeAttribute("data-theme");
            if ("string" === typeof nextProps.animation) box.setAttribute("data-animation", nextProps.animation); else box.removeAttribute("data-animation");
            if (nextProps.inertia) box.setAttribute("data-inertia", ""); else box.removeAttribute("data-inertia");
            box.style.maxWidth = "number" === typeof nextProps.maxWidth ? nextProps.maxWidth + "px" : nextProps.maxWidth;
            if (nextProps.role) box.setAttribute("role", nextProps.role); else box.removeAttribute("role");
            if (prevProps.content !== nextProps.content || prevProps.allowHTML !== nextProps.allowHTML) setContent(content, instance.props);
            if (nextProps.arrow) {
                if (!arrow) box.appendChild(createArrowElement(nextProps.arrow)); else if (prevProps.arrow !== nextProps.arrow) {
                    box.removeChild(arrow);
                    box.appendChild(createArrowElement(nextProps.arrow));
                }
            } else if (arrow) box.removeChild(arrow);
        }
        return {
            popper,
            onUpdate
        };
    }
    render.$$tippy = true;
    var idCounter = 1;
    var mouseMoveListeners = [];
    var mountedInstances = [];
    function createTippy(reference, passedProps) {
        var props = evaluateProps(reference, Object.assign({}, defaultProps, getExtendedPassedProps(removeUndefinedProps(passedProps))));
        var showTimeout;
        var hideTimeout;
        var scheduleHideAnimationFrame;
        var isVisibleFromClick = false;
        var didHideDueToDocumentMouseDown = false;
        var didTouchMove = false;
        var ignoreOnFirstUpdate = false;
        var lastTriggerEvent;
        var currentTransitionEndListener;
        var onFirstUpdate;
        var listeners = [];
        var debouncedOnMouseMove = tippy_esm_debounce(onMouseMove, props.interactiveDebounce);
        var currentTarget;
        var id = idCounter++;
        var popperInstance = null;
        var plugins = unique(props.plugins);
        var state = {
            isEnabled: true,
            isVisible: false,
            isDestroyed: false,
            isMounted: false,
            isShown: false
        };
        var instance = {
            id,
            reference,
            popper: div(),
            popperInstance,
            props,
            state,
            plugins,
            clearDelayTimeouts,
            setProps,
            setContent,
            show,
            hide,
            hideWithInteractivity,
            enable,
            disable,
            unmount,
            destroy
        };
        if (!props.render) {
            if (false) ;
            return instance;
        }
        var _props$render = props.render(instance), popper = _props$render.popper, onUpdate = _props$render.onUpdate;
        popper.setAttribute("data-tippy-root", "");
        popper.id = "tippy-" + instance.id;
        instance.popper = popper;
        reference._tippy = instance;
        popper._tippy = instance;
        var pluginsHooks = plugins.map((function(plugin) {
            return plugin.fn(instance);
        }));
        var hasAriaExpanded = reference.hasAttribute("aria-expanded");
        addListeners();
        handleAriaExpandedAttribute();
        handleStyles();
        invokeHook("onCreate", [ instance ]);
        if (props.showOnCreate) scheduleShow();
        popper.addEventListener("mouseenter", (function() {
            if (instance.props.interactive && instance.state.isVisible) instance.clearDelayTimeouts();
        }));
        popper.addEventListener("mouseleave", (function() {
            if (instance.props.interactive && instance.props.trigger.indexOf("mouseenter") >= 0) getDocument().addEventListener("mousemove", debouncedOnMouseMove);
        }));
        return instance;
        function getNormalizedTouchSettings() {
            var touch = instance.props.touch;
            return Array.isArray(touch) ? touch : [ touch, 0 ];
        }
        function getIsCustomTouchBehavior() {
            return "hold" === getNormalizedTouchSettings()[0];
        }
        function getIsDefaultRenderFn() {
            var _instance$props$rende;
            return !!(null != (_instance$props$rende = instance.props.render) && _instance$props$rende.$$tippy);
        }
        function getCurrentTarget() {
            return currentTarget || reference;
        }
        function getDocument() {
            var parent = getCurrentTarget().parentNode;
            return parent ? getOwnerDocument(parent) : document;
        }
        function getDefaultTemplateChildren() {
            return getChildren(popper);
        }
        function getDelay(isShow) {
            if (instance.state.isMounted && !instance.state.isVisible || currentInput.isTouch || lastTriggerEvent && "focus" === lastTriggerEvent.type) return 0;
            return getValueAtIndexOrReturn(instance.props.delay, isShow ? 0 : 1, defaultProps.delay);
        }
        function handleStyles(fromHide) {
            if (void 0 === fromHide) fromHide = false;
            popper.style.pointerEvents = instance.props.interactive && !fromHide ? "" : "none";
            popper.style.zIndex = "" + instance.props.zIndex;
        }
        function invokeHook(hook, args, shouldInvokePropsHook) {
            if (void 0 === shouldInvokePropsHook) shouldInvokePropsHook = true;
            pluginsHooks.forEach((function(pluginHooks) {
                if (pluginHooks[hook]) pluginHooks[hook].apply(pluginHooks, args);
            }));
            if (shouldInvokePropsHook) {
                var _instance$props;
                (_instance$props = instance.props)[hook].apply(_instance$props, args);
            }
        }
        function handleAriaContentAttribute() {
            var aria = instance.props.aria;
            if (!aria.content) return;
            var attr = "aria-" + aria.content;
            var id = popper.id;
            var nodes = normalizeToArray(instance.props.triggerTarget || reference);
            nodes.forEach((function(node) {
                var currentValue = node.getAttribute(attr);
                if (instance.state.isVisible) node.setAttribute(attr, currentValue ? currentValue + " " + id : id); else {
                    var nextValue = currentValue && currentValue.replace(id, "").trim();
                    if (nextValue) node.setAttribute(attr, nextValue); else node.removeAttribute(attr);
                }
            }));
        }
        function handleAriaExpandedAttribute() {
            if (hasAriaExpanded || !instance.props.aria.expanded) return;
            var nodes = normalizeToArray(instance.props.triggerTarget || reference);
            nodes.forEach((function(node) {
                if (instance.props.interactive) node.setAttribute("aria-expanded", instance.state.isVisible && node === getCurrentTarget() ? "true" : "false"); else node.removeAttribute("aria-expanded");
            }));
        }
        function cleanupInteractiveMouseListeners() {
            getDocument().removeEventListener("mousemove", debouncedOnMouseMove);
            mouseMoveListeners = mouseMoveListeners.filter((function(listener) {
                return listener !== debouncedOnMouseMove;
            }));
        }
        function onDocumentPress(event) {
            if (currentInput.isTouch) if (didTouchMove || "mousedown" === event.type) return;
            var actualTarget = event.composedPath && event.composedPath()[0] || event.target;
            if (instance.props.interactive && actualContains(popper, actualTarget)) return;
            if (normalizeToArray(instance.props.triggerTarget || reference).some((function(el) {
                return actualContains(el, actualTarget);
            }))) {
                if (currentInput.isTouch) return;
                if (instance.state.isVisible && instance.props.trigger.indexOf("click") >= 0) return;
            } else invokeHook("onClickOutside", [ instance, event ]);
            if (true === instance.props.hideOnClick) {
                instance.clearDelayTimeouts();
                instance.hide();
                didHideDueToDocumentMouseDown = true;
                setTimeout((function() {
                    didHideDueToDocumentMouseDown = false;
                }));
                if (!instance.state.isMounted) removeDocumentPress();
            }
        }
        function onTouchMove() {
            didTouchMove = true;
        }
        function onTouchStart() {
            didTouchMove = false;
        }
        function addDocumentPress() {
            var doc = getDocument();
            doc.addEventListener("mousedown", onDocumentPress, true);
            doc.addEventListener("touchend", onDocumentPress, TOUCH_OPTIONS);
            doc.addEventListener("touchstart", onTouchStart, TOUCH_OPTIONS);
            doc.addEventListener("touchmove", onTouchMove, TOUCH_OPTIONS);
        }
        function removeDocumentPress() {
            var doc = getDocument();
            doc.removeEventListener("mousedown", onDocumentPress, true);
            doc.removeEventListener("touchend", onDocumentPress, TOUCH_OPTIONS);
            doc.removeEventListener("touchstart", onTouchStart, TOUCH_OPTIONS);
            doc.removeEventListener("touchmove", onTouchMove, TOUCH_OPTIONS);
        }
        function onTransitionedOut(duration, callback) {
            onTransitionEnd(duration, (function() {
                if (!instance.state.isVisible && popper.parentNode && popper.parentNode.contains(popper)) callback();
            }));
        }
        function onTransitionedIn(duration, callback) {
            onTransitionEnd(duration, callback);
        }
        function onTransitionEnd(duration, callback) {
            var box = getDefaultTemplateChildren().box;
            function listener(event) {
                if (event.target === box) {
                    updateTransitionEndListener(box, "remove", listener);
                    callback();
                }
            }
            if (0 === duration) return callback();
            updateTransitionEndListener(box, "remove", currentTransitionEndListener);
            updateTransitionEndListener(box, "add", listener);
            currentTransitionEndListener = listener;
        }
        function on(eventType, handler, options) {
            if (void 0 === options) options = false;
            var nodes = normalizeToArray(instance.props.triggerTarget || reference);
            nodes.forEach((function(node) {
                node.addEventListener(eventType, handler, options);
                listeners.push({
                    node,
                    eventType,
                    handler,
                    options
                });
            }));
        }
        function addListeners() {
            if (getIsCustomTouchBehavior()) {
                on("touchstart", onTrigger, {
                    passive: true
                });
                on("touchend", onMouseLeave, {
                    passive: true
                });
            }
            splitBySpaces(instance.props.trigger).forEach((function(eventType) {
                if ("manual" === eventType) return;
                on(eventType, onTrigger);
                switch (eventType) {
                  case "mouseenter":
                    on("mouseleave", onMouseLeave);
                    break;

                  case "focus":
                    on(isIE11 ? "focusout" : "blur", onBlurOrFocusOut);
                    break;

                  case "focusin":
                    on("focusout", onBlurOrFocusOut);
                    break;
                }
            }));
        }
        function removeListeners() {
            listeners.forEach((function(_ref) {
                var node = _ref.node, eventType = _ref.eventType, handler = _ref.handler, options = _ref.options;
                node.removeEventListener(eventType, handler, options);
            }));
            listeners = [];
        }
        function onTrigger(event) {
            var _lastTriggerEvent;
            var shouldScheduleClickHide = false;
            if (!instance.state.isEnabled || isEventListenerStopped(event) || didHideDueToDocumentMouseDown) return;
            var wasFocused = "focus" === (null == (_lastTriggerEvent = lastTriggerEvent) ? void 0 : _lastTriggerEvent.type);
            lastTriggerEvent = event;
            currentTarget = event.currentTarget;
            handleAriaExpandedAttribute();
            if (!instance.state.isVisible && isMouseEvent(event)) mouseMoveListeners.forEach((function(listener) {
                return listener(event);
            }));
            if ("click" === event.type && (instance.props.trigger.indexOf("mouseenter") < 0 || isVisibleFromClick) && false !== instance.props.hideOnClick && instance.state.isVisible) shouldScheduleClickHide = true; else scheduleShow(event);
            if ("click" === event.type) isVisibleFromClick = !shouldScheduleClickHide;
            if (shouldScheduleClickHide && !wasFocused) scheduleHide(event);
        }
        function onMouseMove(event) {
            var target = event.target;
            var isCursorOverReferenceOrPopper = getCurrentTarget().contains(target) || popper.contains(target);
            if ("mousemove" === event.type && isCursorOverReferenceOrPopper) return;
            var popperTreeData = getNestedPopperTree().concat(popper).map((function(popper) {
                var _instance$popperInsta;
                var instance = popper._tippy;
                var state = null == (_instance$popperInsta = instance.popperInstance) ? void 0 : _instance$popperInsta.state;
                if (state) return {
                    popperRect: popper.getBoundingClientRect(),
                    popperState: state,
                    props
                };
                return null;
            })).filter(Boolean);
            if (isCursorOutsideInteractiveBorder(popperTreeData, event)) {
                cleanupInteractiveMouseListeners();
                scheduleHide(event);
            }
        }
        function onMouseLeave(event) {
            var shouldBail = isEventListenerStopped(event) || instance.props.trigger.indexOf("click") >= 0 && isVisibleFromClick;
            if (shouldBail) return;
            if (instance.props.interactive) {
                instance.hideWithInteractivity(event);
                return;
            }
            scheduleHide(event);
        }
        function onBlurOrFocusOut(event) {
            if (instance.props.trigger.indexOf("focusin") < 0 && event.target !== getCurrentTarget()) return;
            if (instance.props.interactive && event.relatedTarget && popper.contains(event.relatedTarget)) return;
            scheduleHide(event);
        }
        function isEventListenerStopped(event) {
            return currentInput.isTouch ? getIsCustomTouchBehavior() !== event.type.indexOf("touch") >= 0 : false;
        }
        function createPopperInstance() {
            destroyPopperInstance();
            var _instance$props2 = instance.props, popperOptions = _instance$props2.popperOptions, placement = _instance$props2.placement, offset = _instance$props2.offset, getReferenceClientRect = _instance$props2.getReferenceClientRect, moveTransition = _instance$props2.moveTransition;
            var arrow = getIsDefaultRenderFn() ? getChildren(popper).arrow : null;
            var computedReference = getReferenceClientRect ? {
                getBoundingClientRect: getReferenceClientRect,
                contextElement: getReferenceClientRect.contextElement || getCurrentTarget()
            } : reference;
            var tippyModifier = {
                name: "$$tippy",
                enabled: true,
                phase: "beforeWrite",
                requires: [ "computeStyles" ],
                fn: function fn(_ref2) {
                    var state = _ref2.state;
                    if (getIsDefaultRenderFn()) {
                        var _getDefaultTemplateCh = getDefaultTemplateChildren(), box = _getDefaultTemplateCh.box;
                        [ "placement", "reference-hidden", "escaped" ].forEach((function(attr) {
                            if ("placement" === attr) box.setAttribute("data-placement", state.placement); else if (state.attributes.popper["data-popper-" + attr]) box.setAttribute("data-" + attr, ""); else box.removeAttribute("data-" + attr);
                        }));
                        state.attributes.popper = {};
                    }
                }
            };
            var modifiers = [ {
                name: "offset",
                options: {
                    offset
                }
            }, {
                name: "preventOverflow",
                options: {
                    padding: {
                        top: 2,
                        bottom: 2,
                        left: 5,
                        right: 5
                    }
                }
            }, {
                name: "flip",
                options: {
                    padding: 5
                }
            }, {
                name: "computeStyles",
                options: {
                    adaptive: !moveTransition
                }
            }, tippyModifier ];
            if (getIsDefaultRenderFn() && arrow) modifiers.push({
                name: "arrow",
                options: {
                    element: arrow,
                    padding: 3
                }
            });
            modifiers.push.apply(modifiers, (null == popperOptions ? void 0 : popperOptions.modifiers) || []);
            instance.popperInstance = popper_createPopper(computedReference, popper, Object.assign({}, popperOptions, {
                placement,
                onFirstUpdate,
                modifiers
            }));
        }
        function destroyPopperInstance() {
            if (instance.popperInstance) {
                instance.popperInstance.destroy();
                instance.popperInstance = null;
            }
        }
        function mount() {
            var appendTo = instance.props.appendTo;
            var parentNode;
            var node = getCurrentTarget();
            if (instance.props.interactive && appendTo === TIPPY_DEFAULT_APPEND_TO || "parent" === appendTo) parentNode = node.parentNode; else parentNode = invokeWithArgsOrReturn(appendTo, [ node ]);
            if (!parentNode.contains(popper)) parentNode.appendChild(popper);
            instance.state.isMounted = true;
            createPopperInstance();
            if (false) ;
        }
        function getNestedPopperTree() {
            return arrayFrom(popper.querySelectorAll("[data-tippy-root]"));
        }
        function scheduleShow(event) {
            instance.clearDelayTimeouts();
            if (event) invokeHook("onTrigger", [ instance, event ]);
            addDocumentPress();
            var delay = getDelay(true);
            var _getNormalizedTouchSe = getNormalizedTouchSettings(), touchValue = _getNormalizedTouchSe[0], touchDelay = _getNormalizedTouchSe[1];
            if (currentInput.isTouch && "hold" === touchValue && touchDelay) delay = touchDelay;
            if (delay) showTimeout = setTimeout((function() {
                instance.show();
            }), delay); else instance.show();
        }
        function scheduleHide(event) {
            instance.clearDelayTimeouts();
            invokeHook("onUntrigger", [ instance, event ]);
            if (!instance.state.isVisible) {
                removeDocumentPress();
                return;
            }
            if (instance.props.trigger.indexOf("mouseenter") >= 0 && instance.props.trigger.indexOf("click") >= 0 && [ "mouseleave", "mousemove" ].indexOf(event.type) >= 0 && isVisibleFromClick) return;
            var delay = getDelay(false);
            if (delay) hideTimeout = setTimeout((function() {
                if (instance.state.isVisible) instance.hide();
            }), delay); else scheduleHideAnimationFrame = requestAnimationFrame((function() {
                instance.hide();
            }));
        }
        function enable() {
            instance.state.isEnabled = true;
        }
        function disable() {
            instance.hide();
            instance.state.isEnabled = false;
        }
        function clearDelayTimeouts() {
            clearTimeout(showTimeout);
            clearTimeout(hideTimeout);
            cancelAnimationFrame(scheduleHideAnimationFrame);
        }
        function setProps(partialProps) {
            if (false) ;
            if (instance.state.isDestroyed) return;
            invokeHook("onBeforeUpdate", [ instance, partialProps ]);
            removeListeners();
            var prevProps = instance.props;
            var nextProps = evaluateProps(reference, Object.assign({}, prevProps, removeUndefinedProps(partialProps), {
                ignoreAttributes: true
            }));
            instance.props = nextProps;
            addListeners();
            if (prevProps.interactiveDebounce !== nextProps.interactiveDebounce) {
                cleanupInteractiveMouseListeners();
                debouncedOnMouseMove = tippy_esm_debounce(onMouseMove, nextProps.interactiveDebounce);
            }
            if (prevProps.triggerTarget && !nextProps.triggerTarget) normalizeToArray(prevProps.triggerTarget).forEach((function(node) {
                node.removeAttribute("aria-expanded");
            })); else if (nextProps.triggerTarget) reference.removeAttribute("aria-expanded");
            handleAriaExpandedAttribute();
            handleStyles();
            if (onUpdate) onUpdate(prevProps, nextProps);
            if (instance.popperInstance) {
                createPopperInstance();
                getNestedPopperTree().forEach((function(nestedPopper) {
                    requestAnimationFrame(nestedPopper._tippy.popperInstance.forceUpdate);
                }));
            }
            invokeHook("onAfterUpdate", [ instance, partialProps ]);
        }
        function setContent(content) {
            instance.setProps({
                content
            });
        }
        function show() {
            if (false) ;
            var isAlreadyVisible = instance.state.isVisible;
            var isDestroyed = instance.state.isDestroyed;
            var isDisabled = !instance.state.isEnabled;
            var isTouchAndTouchDisabled = currentInput.isTouch && !instance.props.touch;
            var duration = getValueAtIndexOrReturn(instance.props.duration, 0, defaultProps.duration);
            if (isAlreadyVisible || isDestroyed || isDisabled || isTouchAndTouchDisabled) return;
            if (getCurrentTarget().hasAttribute("disabled")) return;
            invokeHook("onShow", [ instance ], false);
            if (false === instance.props.onShow(instance)) return;
            instance.state.isVisible = true;
            if (getIsDefaultRenderFn()) popper.style.visibility = "visible";
            handleStyles();
            addDocumentPress();
            if (!instance.state.isMounted) popper.style.transition = "none";
            if (getIsDefaultRenderFn()) {
                var _getDefaultTemplateCh2 = getDefaultTemplateChildren(), box = _getDefaultTemplateCh2.box, content = _getDefaultTemplateCh2.content;
                setTransitionDuration([ box, content ], 0);
            }
            onFirstUpdate = function onFirstUpdate() {
                var _instance$popperInsta2;
                if (!instance.state.isVisible || ignoreOnFirstUpdate) return;
                ignoreOnFirstUpdate = true;
                void popper.offsetHeight;
                popper.style.transition = instance.props.moveTransition;
                if (getIsDefaultRenderFn() && instance.props.animation) {
                    var _getDefaultTemplateCh3 = getDefaultTemplateChildren(), _box = _getDefaultTemplateCh3.box, _content = _getDefaultTemplateCh3.content;
                    setTransitionDuration([ _box, _content ], duration);
                    setVisibilityState([ _box, _content ], "visible");
                }
                handleAriaContentAttribute();
                handleAriaExpandedAttribute();
                pushIfUnique(mountedInstances, instance);
                null == (_instance$popperInsta2 = instance.popperInstance) ? void 0 : _instance$popperInsta2.forceUpdate();
                invokeHook("onMount", [ instance ]);
                if (instance.props.animation && getIsDefaultRenderFn()) onTransitionedIn(duration, (function() {
                    instance.state.isShown = true;
                    invokeHook("onShown", [ instance ]);
                }));
            };
            mount();
        }
        function hide() {
            if (false) ;
            var isAlreadyHidden = !instance.state.isVisible;
            var isDestroyed = instance.state.isDestroyed;
            var isDisabled = !instance.state.isEnabled;
            var duration = getValueAtIndexOrReturn(instance.props.duration, 1, defaultProps.duration);
            if (isAlreadyHidden || isDestroyed || isDisabled) return;
            invokeHook("onHide", [ instance ], false);
            if (false === instance.props.onHide(instance)) return;
            instance.state.isVisible = false;
            instance.state.isShown = false;
            ignoreOnFirstUpdate = false;
            isVisibleFromClick = false;
            if (getIsDefaultRenderFn()) popper.style.visibility = "hidden";
            cleanupInteractiveMouseListeners();
            removeDocumentPress();
            handleStyles(true);
            if (getIsDefaultRenderFn()) {
                var _getDefaultTemplateCh4 = getDefaultTemplateChildren(), box = _getDefaultTemplateCh4.box, content = _getDefaultTemplateCh4.content;
                if (instance.props.animation) {
                    setTransitionDuration([ box, content ], duration);
                    setVisibilityState([ box, content ], "hidden");
                }
            }
            handleAriaContentAttribute();
            handleAriaExpandedAttribute();
            if (instance.props.animation) {
                if (getIsDefaultRenderFn()) onTransitionedOut(duration, instance.unmount);
            } else instance.unmount();
        }
        function hideWithInteractivity(event) {
            if (false) ;
            getDocument().addEventListener("mousemove", debouncedOnMouseMove);
            pushIfUnique(mouseMoveListeners, debouncedOnMouseMove);
            debouncedOnMouseMove(event);
        }
        function unmount() {
            if (false) ;
            if (instance.state.isVisible) instance.hide();
            if (!instance.state.isMounted) return;
            destroyPopperInstance();
            getNestedPopperTree().forEach((function(nestedPopper) {
                nestedPopper._tippy.unmount();
            }));
            if (popper.parentNode) popper.parentNode.removeChild(popper);
            mountedInstances = mountedInstances.filter((function(i) {
                return i !== instance;
            }));
            instance.state.isMounted = false;
            invokeHook("onHidden", [ instance ]);
        }
        function destroy() {
            if (false) ;
            if (instance.state.isDestroyed) return;
            instance.clearDelayTimeouts();
            instance.unmount();
            removeListeners();
            delete reference._tippy;
            instance.state.isDestroyed = true;
            invokeHook("onDestroy", [ instance ]);
        }
    }
    function tippy(targets, optionalProps) {
        if (void 0 === optionalProps) optionalProps = {};
        var plugins = defaultProps.plugins.concat(optionalProps.plugins || []);
        if (false) ;
        bindGlobalEventListeners();
        var passedProps = Object.assign({}, optionalProps, {
            plugins
        });
        var elements = getArrayOfElements(targets);
        if (false) ;
        var instances = elements.reduce((function(acc, reference) {
            var instance = reference && createTippy(reference, passedProps);
            if (instance) acc.push(instance);
            return acc;
        }), []);
        return tippy_esm_isElement(targets) ? instances[0] : instances;
    }
    tippy.defaultProps = defaultProps;
    tippy.setDefaultProps = setDefaultProps;
    tippy.currentInput = currentInput;
    Object.assign({}, modifiers_applyStyles, {
        effect: function effect(_ref) {
            var state = _ref.state;
            var initialStyles = {
                popper: {
                    position: state.options.strategy,
                    left: "0",
                    top: "0",
                    margin: "0"
                },
                arrow: {
                    position: "absolute"
                },
                reference: {}
            };
            Object.assign(state.elements.popper.style, initialStyles.popper);
            state.styles = initialStyles;
            if (state.elements.arrow) Object.assign(state.elements.arrow.style, initialStyles.arrow);
        }
    });
    tippy.setDefaultProps({
        render
    });
    const tippy_esm = tippy;
    modules_flsModules.tippy = tippy_esm("[data-tippy-content]", {});
    function ssr_window_esm_isObject(obj) {
        return null !== obj && "object" === typeof obj && "constructor" in obj && obj.constructor === Object;
    }
    function extend(target = {}, src = {}) {
        Object.keys(src).forEach((key => {
            if ("undefined" === typeof target[key]) target[key] = src[key]; else if (ssr_window_esm_isObject(src[key]) && ssr_window_esm_isObject(target[key]) && Object.keys(src[key]).length > 0) extend(target[key], src[key]);
        }));
    }
    const ssrDocument = {
        body: {},
        addEventListener() {},
        removeEventListener() {},
        activeElement: {
            blur() {},
            nodeName: ""
        },
        querySelector() {
            return null;
        },
        querySelectorAll() {
            return [];
        },
        getElementById() {
            return null;
        },
        createEvent() {
            return {
                initEvent() {}
            };
        },
        createElement() {
            return {
                children: [],
                childNodes: [],
                style: {},
                setAttribute() {},
                getElementsByTagName() {
                    return [];
                }
            };
        },
        createElementNS() {
            return {};
        },
        importNode() {
            return null;
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        }
    };
    function ssr_window_esm_getDocument() {
        const doc = "undefined" !== typeof document ? document : {};
        extend(doc, ssrDocument);
        return doc;
    }
    const ssrWindow = {
        document: ssrDocument,
        navigator: {
            userAgent: ""
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        },
        history: {
            replaceState() {},
            pushState() {},
            go() {},
            back() {}
        },
        CustomEvent: function CustomEvent() {
            return this;
        },
        addEventListener() {},
        removeEventListener() {},
        getComputedStyle() {
            return {
                getPropertyValue() {
                    return "";
                }
            };
        },
        Image() {},
        Date() {},
        screen: {},
        setTimeout() {},
        clearTimeout() {},
        matchMedia() {
            return {};
        },
        requestAnimationFrame(callback) {
            if ("undefined" === typeof setTimeout) {
                callback();
                return null;
            }
            return setTimeout(callback, 0);
        },
        cancelAnimationFrame(id) {
            if ("undefined" === typeof setTimeout) return;
            clearTimeout(id);
        }
    };
    function ssr_window_esm_getWindow() {
        const win = "undefined" !== typeof window ? window : {};
        extend(win, ssrWindow);
        return win;
    }
    function makeReactive(obj) {
        const proto = obj.__proto__;
        Object.defineProperty(obj, "__proto__", {
            get() {
                return proto;
            },
            set(value) {
                proto.__proto__ = value;
            }
        });
    }
    class Dom7 extends Array {
        constructor(items) {
            if ("number" === typeof items) super(items); else {
                super(...items || []);
                makeReactive(this);
            }
        }
    }
    function arrayFlat(arr = []) {
        const res = [];
        arr.forEach((el => {
            if (Array.isArray(el)) res.push(...arrayFlat(el)); else res.push(el);
        }));
        return res;
    }
    function arrayFilter(arr, callback) {
        return Array.prototype.filter.call(arr, callback);
    }
    function arrayUnique(arr) {
        const uniqueArray = [];
        for (let i = 0; i < arr.length; i += 1) if (-1 === uniqueArray.indexOf(arr[i])) uniqueArray.push(arr[i]);
        return uniqueArray;
    }
    function qsa(selector, context) {
        if ("string" !== typeof selector) return [ selector ];
        const a = [];
        const res = context.querySelectorAll(selector);
        for (let i = 0; i < res.length; i += 1) a.push(res[i]);
        return a;
    }
    function dom7_esm_$(selector, context) {
        const window = ssr_window_esm_getWindow();
        const document = ssr_window_esm_getDocument();
        let arr = [];
        if (!context && selector instanceof Dom7) return selector;
        if (!selector) return new Dom7(arr);
        if ("string" === typeof selector) {
            const html = selector.trim();
            if (html.indexOf("<") >= 0 && html.indexOf(">") >= 0) {
                let toCreate = "div";
                if (0 === html.indexOf("<li")) toCreate = "ul";
                if (0 === html.indexOf("<tr")) toCreate = "tbody";
                if (0 === html.indexOf("<td") || 0 === html.indexOf("<th")) toCreate = "tr";
                if (0 === html.indexOf("<tbody")) toCreate = "table";
                if (0 === html.indexOf("<option")) toCreate = "select";
                const tempParent = document.createElement(toCreate);
                tempParent.innerHTML = html;
                for (let i = 0; i < tempParent.childNodes.length; i += 1) arr.push(tempParent.childNodes[i]);
            } else arr = qsa(selector.trim(), context || document);
        } else if (selector.nodeType || selector === window || selector === document) arr.push(selector); else if (Array.isArray(selector)) {
            if (selector instanceof Dom7) return selector;
            arr = selector;
        }
        return new Dom7(arrayUnique(arr));
    }
    dom7_esm_$.fn = Dom7.prototype;
    function addClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        this.forEach((el => {
            el.classList.add(...classNames);
        }));
        return this;
    }
    function removeClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        this.forEach((el => {
            el.classList.remove(...classNames);
        }));
        return this;
    }
    function toggleClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        this.forEach((el => {
            classNames.forEach((className => {
                el.classList.toggle(className);
            }));
        }));
    }
    function hasClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        return arrayFilter(this, (el => classNames.filter((className => el.classList.contains(className))).length > 0)).length > 0;
    }
    function attr(attrs, value) {
        if (1 === arguments.length && "string" === typeof attrs) {
            if (this[0]) return this[0].getAttribute(attrs);
            return;
        }
        for (let i = 0; i < this.length; i += 1) if (2 === arguments.length) this[i].setAttribute(attrs, value); else for (const attrName in attrs) {
            this[i][attrName] = attrs[attrName];
            this[i].setAttribute(attrName, attrs[attrName]);
        }
        return this;
    }
    function removeAttr(attr) {
        for (let i = 0; i < this.length; i += 1) this[i].removeAttribute(attr);
        return this;
    }
    function transform(transform) {
        for (let i = 0; i < this.length; i += 1) this[i].style.transform = transform;
        return this;
    }
    function transition(duration) {
        for (let i = 0; i < this.length; i += 1) this[i].style.transitionDuration = "string" !== typeof duration ? `${duration}ms` : duration;
        return this;
    }
    function on(...args) {
        let [eventType, targetSelector, listener, capture] = args;
        if ("function" === typeof args[1]) {
            [eventType, listener, capture] = args;
            targetSelector = void 0;
        }
        if (!capture) capture = false;
        function handleLiveEvent(e) {
            const target = e.target;
            if (!target) return;
            const eventData = e.target.dom7EventData || [];
            if (eventData.indexOf(e) < 0) eventData.unshift(e);
            if (dom7_esm_$(target).is(targetSelector)) listener.apply(target, eventData); else {
                const parents = dom7_esm_$(target).parents();
                for (let k = 0; k < parents.length; k += 1) if (dom7_esm_$(parents[k]).is(targetSelector)) listener.apply(parents[k], eventData);
            }
        }
        function handleEvent(e) {
            const eventData = e && e.target ? e.target.dom7EventData || [] : [];
            if (eventData.indexOf(e) < 0) eventData.unshift(e);
            listener.apply(this, eventData);
        }
        const events = eventType.split(" ");
        let j;
        for (let i = 0; i < this.length; i += 1) {
            const el = this[i];
            if (!targetSelector) for (j = 0; j < events.length; j += 1) {
                const event = events[j];
                if (!el.dom7Listeners) el.dom7Listeners = {};
                if (!el.dom7Listeners[event]) el.dom7Listeners[event] = [];
                el.dom7Listeners[event].push({
                    listener,
                    proxyListener: handleEvent
                });
                el.addEventListener(event, handleEvent, capture);
            } else for (j = 0; j < events.length; j += 1) {
                const event = events[j];
                if (!el.dom7LiveListeners) el.dom7LiveListeners = {};
                if (!el.dom7LiveListeners[event]) el.dom7LiveListeners[event] = [];
                el.dom7LiveListeners[event].push({
                    listener,
                    proxyListener: handleLiveEvent
                });
                el.addEventListener(event, handleLiveEvent, capture);
            }
        }
        return this;
    }
    function off(...args) {
        let [eventType, targetSelector, listener, capture] = args;
        if ("function" === typeof args[1]) {
            [eventType, listener, capture] = args;
            targetSelector = void 0;
        }
        if (!capture) capture = false;
        const events = eventType.split(" ");
        for (let i = 0; i < events.length; i += 1) {
            const event = events[i];
            for (let j = 0; j < this.length; j += 1) {
                const el = this[j];
                let handlers;
                if (!targetSelector && el.dom7Listeners) handlers = el.dom7Listeners[event]; else if (targetSelector && el.dom7LiveListeners) handlers = el.dom7LiveListeners[event];
                if (handlers && handlers.length) for (let k = handlers.length - 1; k >= 0; k -= 1) {
                    const handler = handlers[k];
                    if (listener && handler.listener === listener) {
                        el.removeEventListener(event, handler.proxyListener, capture);
                        handlers.splice(k, 1);
                    } else if (listener && handler.listener && handler.listener.dom7proxy && handler.listener.dom7proxy === listener) {
                        el.removeEventListener(event, handler.proxyListener, capture);
                        handlers.splice(k, 1);
                    } else if (!listener) {
                        el.removeEventListener(event, handler.proxyListener, capture);
                        handlers.splice(k, 1);
                    }
                }
            }
        }
        return this;
    }
    function trigger(...args) {
        const window = ssr_window_esm_getWindow();
        const events = args[0].split(" ");
        const eventData = args[1];
        for (let i = 0; i < events.length; i += 1) {
            const event = events[i];
            for (let j = 0; j < this.length; j += 1) {
                const el = this[j];
                if (window.CustomEvent) {
                    const evt = new window.CustomEvent(event, {
                        detail: eventData,
                        bubbles: true,
                        cancelable: true
                    });
                    el.dom7EventData = args.filter(((data, dataIndex) => dataIndex > 0));
                    el.dispatchEvent(evt);
                    el.dom7EventData = [];
                    delete el.dom7EventData;
                }
            }
        }
        return this;
    }
    function transitionEnd(callback) {
        const dom = this;
        function fireCallBack(e) {
            if (e.target !== this) return;
            callback.call(this, e);
            dom.off("transitionend", fireCallBack);
        }
        if (callback) dom.on("transitionend", fireCallBack);
        return this;
    }
    function dom7_esm_outerWidth(includeMargins) {
        if (this.length > 0) {
            if (includeMargins) {
                const styles = this.styles();
                return this[0].offsetWidth + parseFloat(styles.getPropertyValue("margin-right")) + parseFloat(styles.getPropertyValue("margin-left"));
            }
            return this[0].offsetWidth;
        }
        return null;
    }
    function dom7_esm_outerHeight(includeMargins) {
        if (this.length > 0) {
            if (includeMargins) {
                const styles = this.styles();
                return this[0].offsetHeight + parseFloat(styles.getPropertyValue("margin-top")) + parseFloat(styles.getPropertyValue("margin-bottom"));
            }
            return this[0].offsetHeight;
        }
        return null;
    }
    function dom7_esm_offset() {
        if (this.length > 0) {
            const window = ssr_window_esm_getWindow();
            const document = ssr_window_esm_getDocument();
            const el = this[0];
            const box = el.getBoundingClientRect();
            const body = document.body;
            const clientTop = el.clientTop || body.clientTop || 0;
            const clientLeft = el.clientLeft || body.clientLeft || 0;
            const scrollTop = el === window ? window.scrollY : el.scrollTop;
            const scrollLeft = el === window ? window.scrollX : el.scrollLeft;
            return {
                top: box.top + scrollTop - clientTop,
                left: box.left + scrollLeft - clientLeft
            };
        }
        return null;
    }
    function styles() {
        const window = ssr_window_esm_getWindow();
        if (this[0]) return window.getComputedStyle(this[0], null);
        return {};
    }
    function css(props, value) {
        const window = ssr_window_esm_getWindow();
        let i;
        if (1 === arguments.length) if ("string" === typeof props) {
            if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(props);
        } else {
            for (i = 0; i < this.length; i += 1) for (const prop in props) this[i].style[prop] = props[prop];
            return this;
        }
        if (2 === arguments.length && "string" === typeof props) {
            for (i = 0; i < this.length; i += 1) this[i].style[props] = value;
            return this;
        }
        return this;
    }
    function each(callback) {
        if (!callback) return this;
        this.forEach(((el, index) => {
            callback.apply(el, [ el, index ]);
        }));
        return this;
    }
    function filter(callback) {
        const result = arrayFilter(this, callback);
        return dom7_esm_$(result);
    }
    function html(html) {
        if ("undefined" === typeof html) return this[0] ? this[0].innerHTML : null;
        for (let i = 0; i < this.length; i += 1) this[i].innerHTML = html;
        return this;
    }
    function dom7_esm_text(text) {
        if ("undefined" === typeof text) return this[0] ? this[0].textContent.trim() : null;
        for (let i = 0; i < this.length; i += 1) this[i].textContent = text;
        return this;
    }
    function is(selector) {
        const window = ssr_window_esm_getWindow();
        const document = ssr_window_esm_getDocument();
        const el = this[0];
        let compareWith;
        let i;
        if (!el || "undefined" === typeof selector) return false;
        if ("string" === typeof selector) {
            if (el.matches) return el.matches(selector);
            if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
            if (el.msMatchesSelector) return el.msMatchesSelector(selector);
            compareWith = dom7_esm_$(selector);
            for (i = 0; i < compareWith.length; i += 1) if (compareWith[i] === el) return true;
            return false;
        }
        if (selector === document) return el === document;
        if (selector === window) return el === window;
        if (selector.nodeType || selector instanceof Dom7) {
            compareWith = selector.nodeType ? [ selector ] : selector;
            for (i = 0; i < compareWith.length; i += 1) if (compareWith[i] === el) return true;
            return false;
        }
        return false;
    }
    function index() {
        let child = this[0];
        let i;
        if (child) {
            i = 0;
            while (null !== (child = child.previousSibling)) if (1 === child.nodeType) i += 1;
            return i;
        }
        return;
    }
    function eq(index) {
        if ("undefined" === typeof index) return this;
        const length = this.length;
        if (index > length - 1) return dom7_esm_$([]);
        if (index < 0) {
            const returnIndex = length + index;
            if (returnIndex < 0) return dom7_esm_$([]);
            return dom7_esm_$([ this[returnIndex] ]);
        }
        return dom7_esm_$([ this[index] ]);
    }
    function append(...els) {
        let newChild;
        const document = ssr_window_esm_getDocument();
        for (let k = 0; k < els.length; k += 1) {
            newChild = els[k];
            for (let i = 0; i < this.length; i += 1) if ("string" === typeof newChild) {
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = newChild;
                while (tempDiv.firstChild) this[i].appendChild(tempDiv.firstChild);
            } else if (newChild instanceof Dom7) for (let j = 0; j < newChild.length; j += 1) this[i].appendChild(newChild[j]); else this[i].appendChild(newChild);
        }
        return this;
    }
    function prepend(newChild) {
        const document = ssr_window_esm_getDocument();
        let i;
        let j;
        for (i = 0; i < this.length; i += 1) if ("string" === typeof newChild) {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = newChild;
            for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
        } else if (newChild instanceof Dom7) for (j = 0; j < newChild.length; j += 1) this[i].insertBefore(newChild[j], this[i].childNodes[0]); else this[i].insertBefore(newChild, this[i].childNodes[0]);
        return this;
    }
    function next(selector) {
        if (this.length > 0) {
            if (selector) {
                if (this[0].nextElementSibling && dom7_esm_$(this[0].nextElementSibling).is(selector)) return dom7_esm_$([ this[0].nextElementSibling ]);
                return dom7_esm_$([]);
            }
            if (this[0].nextElementSibling) return dom7_esm_$([ this[0].nextElementSibling ]);
            return dom7_esm_$([]);
        }
        return dom7_esm_$([]);
    }
    function nextAll(selector) {
        const nextEls = [];
        let el = this[0];
        if (!el) return dom7_esm_$([]);
        while (el.nextElementSibling) {
            const next = el.nextElementSibling;
            if (selector) {
                if (dom7_esm_$(next).is(selector)) nextEls.push(next);
            } else nextEls.push(next);
            el = next;
        }
        return dom7_esm_$(nextEls);
    }
    function prev(selector) {
        if (this.length > 0) {
            const el = this[0];
            if (selector) {
                if (el.previousElementSibling && dom7_esm_$(el.previousElementSibling).is(selector)) return dom7_esm_$([ el.previousElementSibling ]);
                return dom7_esm_$([]);
            }
            if (el.previousElementSibling) return dom7_esm_$([ el.previousElementSibling ]);
            return dom7_esm_$([]);
        }
        return dom7_esm_$([]);
    }
    function prevAll(selector) {
        const prevEls = [];
        let el = this[0];
        if (!el) return dom7_esm_$([]);
        while (el.previousElementSibling) {
            const prev = el.previousElementSibling;
            if (selector) {
                if (dom7_esm_$(prev).is(selector)) prevEls.push(prev);
            } else prevEls.push(prev);
            el = prev;
        }
        return dom7_esm_$(prevEls);
    }
    function dom7_esm_parent(selector) {
        const parents = [];
        for (let i = 0; i < this.length; i += 1) if (null !== this[i].parentNode) if (selector) {
            if (dom7_esm_$(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
        } else parents.push(this[i].parentNode);
        return dom7_esm_$(parents);
    }
    function parents(selector) {
        const parents = [];
        for (let i = 0; i < this.length; i += 1) {
            let parent = this[i].parentNode;
            while (parent) {
                if (selector) {
                    if (dom7_esm_$(parent).is(selector)) parents.push(parent);
                } else parents.push(parent);
                parent = parent.parentNode;
            }
        }
        return dom7_esm_$(parents);
    }
    function closest(selector) {
        let closest = this;
        if ("undefined" === typeof selector) return dom7_esm_$([]);
        if (!closest.is(selector)) closest = closest.parents(selector).eq(0);
        return closest;
    }
    function find(selector) {
        const foundElements = [];
        for (let i = 0; i < this.length; i += 1) {
            const found = this[i].querySelectorAll(selector);
            for (let j = 0; j < found.length; j += 1) foundElements.push(found[j]);
        }
        return dom7_esm_$(foundElements);
    }
    function children(selector) {
        const children = [];
        for (let i = 0; i < this.length; i += 1) {
            const childNodes = this[i].children;
            for (let j = 0; j < childNodes.length; j += 1) if (!selector || dom7_esm_$(childNodes[j]).is(selector)) children.push(childNodes[j]);
        }
        return dom7_esm_$(children);
    }
    function remove() {
        for (let i = 0; i < this.length; i += 1) if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
        return this;
    }
    const noTrigger = "resize scroll".split(" ");
    function shortcut(name) {
        function eventHandler(...args) {
            if ("undefined" === typeof args[0]) {
                for (let i = 0; i < this.length; i += 1) if (noTrigger.indexOf(name) < 0) if (name in this[i]) this[i][name](); else dom7_esm_$(this[i]).trigger(name);
                return this;
            }
            return this.on(name, ...args);
        }
        return eventHandler;
    }
    shortcut("click");
    shortcut("blur");
    shortcut("focus");
    shortcut("focusin");
    shortcut("focusout");
    shortcut("keyup");
    shortcut("keydown");
    shortcut("keypress");
    shortcut("submit");
    shortcut("change");
    shortcut("mousedown");
    shortcut("mousemove");
    shortcut("mouseup");
    shortcut("mouseenter");
    shortcut("mouseleave");
    shortcut("mouseout");
    shortcut("mouseover");
    shortcut("touchstart");
    shortcut("touchend");
    shortcut("touchmove");
    shortcut("resize");
    shortcut("scroll");
    const Methods = {
        addClass,
        removeClass,
        hasClass,
        toggleClass,
        attr,
        removeAttr,
        transform,
        transition,
        on,
        off,
        trigger,
        transitionEnd,
        outerWidth: dom7_esm_outerWidth,
        outerHeight: dom7_esm_outerHeight,
        styles,
        offset: dom7_esm_offset,
        css,
        each,
        html,
        text: dom7_esm_text,
        is,
        index,
        eq,
        append,
        prepend,
        next,
        nextAll,
        prev,
        prevAll,
        parent: dom7_esm_parent,
        parents,
        closest,
        find,
        children,
        filter,
        remove
    };
    Object.keys(Methods).forEach((methodName => {
        Object.defineProperty(dom7_esm_$.fn, methodName, {
            value: Methods[methodName],
            writable: true
        });
    }));
    const dom = dom7_esm_$;
    function deleteProps(obj) {
        const object = obj;
        Object.keys(object).forEach((key => {
            try {
                object[key] = null;
            } catch (e) {}
            try {
                delete object[key];
            } catch (e) {}
        }));
    }
    function utils_nextTick(callback, delay = 0) {
        return setTimeout(callback, delay);
    }
    function utils_now() {
        return Date.now();
    }
    function utils_getComputedStyle(el) {
        const window = ssr_window_esm_getWindow();
        let style;
        if (window.getComputedStyle) style = window.getComputedStyle(el, null);
        if (!style && el.currentStyle) style = el.currentStyle;
        if (!style) style = el.style;
        return style;
    }
    function utils_getTranslate(el, axis = "x") {
        const window = ssr_window_esm_getWindow();
        let matrix;
        let curTransform;
        let transformMatrix;
        const curStyle = utils_getComputedStyle(el, null);
        if (window.WebKitCSSMatrix) {
            curTransform = curStyle.transform || curStyle.webkitTransform;
            if (curTransform.split(",").length > 6) curTransform = curTransform.split(", ").map((a => a.replace(",", "."))).join(", ");
            transformMatrix = new window.WebKitCSSMatrix("none" === curTransform ? "" : curTransform);
        } else {
            transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
            matrix = transformMatrix.toString().split(",");
        }
        if ("x" === axis) if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41; else if (16 === matrix.length) curTransform = parseFloat(matrix[12]); else curTransform = parseFloat(matrix[4]);
        if ("y" === axis) if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42; else if (16 === matrix.length) curTransform = parseFloat(matrix[13]); else curTransform = parseFloat(matrix[5]);
        return curTransform || 0;
    }
    function utils_isObject(o) {
        return "object" === typeof o && null !== o && o.constructor && "Object" === Object.prototype.toString.call(o).slice(8, -1);
    }
    function isNode(node) {
        if ("undefined" !== typeof window && "undefined" !== typeof window.HTMLElement) return node instanceof HTMLElement;
        return node && (1 === node.nodeType || 11 === node.nodeType);
    }
    function utils_extend(...args) {
        const to = Object(args[0]);
        const noExtend = [ "__proto__", "constructor", "prototype" ];
        for (let i = 1; i < args.length; i += 1) {
            const nextSource = args[i];
            if (void 0 !== nextSource && null !== nextSource && !isNode(nextSource)) {
                const keysArray = Object.keys(Object(nextSource)).filter((key => noExtend.indexOf(key) < 0));
                for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
                    const nextKey = keysArray[nextIndex];
                    const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (void 0 !== desc && desc.enumerable) if (utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey]; else utils_extend(to[nextKey], nextSource[nextKey]); else if (!utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) {
                        to[nextKey] = {};
                        if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey]; else utils_extend(to[nextKey], nextSource[nextKey]);
                    } else to[nextKey] = nextSource[nextKey];
                }
            }
        }
        return to;
    }
    function utils_setCSSProperty(el, varName, varValue) {
        el.style.setProperty(varName, varValue);
    }
    function animateCSSModeScroll({swiper, targetPosition, side}) {
        const window = ssr_window_esm_getWindow();
        const startPosition = -swiper.translate;
        let startTime = null;
        let time;
        const duration = swiper.params.speed;
        swiper.wrapperEl.style.scrollSnapType = "none";
        window.cancelAnimationFrame(swiper.cssModeFrameID);
        const dir = targetPosition > startPosition ? "next" : "prev";
        const isOutOfBound = (current, target) => "next" === dir && current >= target || "prev" === dir && current <= target;
        const animate = () => {
            time = (new Date).getTime();
            if (null === startTime) startTime = time;
            const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
            const easeProgress = .5 - Math.cos(progress * Math.PI) / 2;
            let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
            if (isOutOfBound(currentPosition, targetPosition)) currentPosition = targetPosition;
            swiper.wrapperEl.scrollTo({
                [side]: currentPosition
            });
            if (isOutOfBound(currentPosition, targetPosition)) {
                swiper.wrapperEl.style.overflow = "hidden";
                swiper.wrapperEl.style.scrollSnapType = "";
                setTimeout((() => {
                    swiper.wrapperEl.style.overflow = "";
                    swiper.wrapperEl.scrollTo({
                        [side]: currentPosition
                    });
                }));
                window.cancelAnimationFrame(swiper.cssModeFrameID);
                return;
            }
            swiper.cssModeFrameID = window.requestAnimationFrame(animate);
        };
        animate();
    }
    let support;
    function calcSupport() {
        const window = ssr_window_esm_getWindow();
        const document = ssr_window_esm_getDocument();
        return {
            smoothScroll: document.documentElement && "scrollBehavior" in document.documentElement.style,
            touch: !!("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch),
            passiveListener: function checkPassiveListener() {
                let supportsPassive = false;
                try {
                    const opts = Object.defineProperty({}, "passive", {
                        get() {
                            supportsPassive = true;
                        }
                    });
                    window.addEventListener("testPassiveListener", null, opts);
                } catch (e) {}
                return supportsPassive;
            }(),
            gestures: function checkGestures() {
                return "ongesturestart" in window;
            }()
        };
    }
    function getSupport() {
        if (!support) support = calcSupport();
        return support;
    }
    let deviceCached;
    function calcDevice({userAgent} = {}) {
        const support = getSupport();
        const window = ssr_window_esm_getWindow();
        const platform = window.navigator.platform;
        const ua = userAgent || window.navigator.userAgent;
        const device = {
            ios: false,
            android: false
        };
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
        let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
        const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
        const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
        const windows = "Win32" === platform;
        let macos = "MacIntel" === platform;
        const iPadScreens = [ "1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810" ];
        if (!ipad && macos && support.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
            ipad = ua.match(/(Version)\/([\d.]+)/);
            if (!ipad) ipad = [ 0, 1, "13_0_0" ];
            macos = false;
        }
        if (android && !windows) {
            device.os = "android";
            device.android = true;
        }
        if (ipad || iphone || ipod) {
            device.os = "ios";
            device.ios = true;
        }
        return device;
    }
    function getDevice(overrides = {}) {
        if (!deviceCached) deviceCached = calcDevice(overrides);
        return deviceCached;
    }
    let browser;
    function calcBrowser() {
        const window = ssr_window_esm_getWindow();
        function isSafari() {
            const ua = window.navigator.userAgent.toLowerCase();
            return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0;
        }
        return {
            isSafari: isSafari(),
            isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent)
        };
    }
    function getBrowser() {
        if (!browser) browser = calcBrowser();
        return browser;
    }
    function Resize({swiper, on, emit}) {
        const window = ssr_window_esm_getWindow();
        let observer = null;
        let animationFrame = null;
        const resizeHandler = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            emit("beforeResize");
            emit("resize");
        };
        const createObserver = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            observer = new ResizeObserver((entries => {
                animationFrame = window.requestAnimationFrame((() => {
                    const {width, height} = swiper;
                    let newWidth = width;
                    let newHeight = height;
                    entries.forEach((({contentBoxSize, contentRect, target}) => {
                        if (target && target !== swiper.el) return;
                        newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
                        newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
                    }));
                    if (newWidth !== width || newHeight !== height) resizeHandler();
                }));
            }));
            observer.observe(swiper.el);
        };
        const removeObserver = () => {
            if (animationFrame) window.cancelAnimationFrame(animationFrame);
            if (observer && observer.unobserve && swiper.el) {
                observer.unobserve(swiper.el);
                observer = null;
            }
        };
        const orientationChangeHandler = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            emit("orientationchange");
        };
        on("init", (() => {
            if (swiper.params.resizeObserver && "undefined" !== typeof window.ResizeObserver) {
                createObserver();
                return;
            }
            window.addEventListener("resize", resizeHandler);
            window.addEventListener("orientationchange", orientationChangeHandler);
        }));
        on("destroy", (() => {
            removeObserver();
            window.removeEventListener("resize", resizeHandler);
            window.removeEventListener("orientationchange", orientationChangeHandler);
        }));
    }
    function Observer({swiper, extendParams, on, emit}) {
        const observers = [];
        const window = ssr_window_esm_getWindow();
        const attach = (target, options = {}) => {
            const ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
            const observer = new ObserverFunc((mutations => {
                if (1 === mutations.length) {
                    emit("observerUpdate", mutations[0]);
                    return;
                }
                const observerUpdate = function observerUpdate() {
                    emit("observerUpdate", mutations[0]);
                };
                if (window.requestAnimationFrame) window.requestAnimationFrame(observerUpdate); else window.setTimeout(observerUpdate, 0);
            }));
            observer.observe(target, {
                attributes: "undefined" === typeof options.attributes ? true : options.attributes,
                childList: "undefined" === typeof options.childList ? true : options.childList,
                characterData: "undefined" === typeof options.characterData ? true : options.characterData
            });
            observers.push(observer);
        };
        const init = () => {
            if (!swiper.params.observer) return;
            if (swiper.params.observeParents) {
                const containerParents = swiper.$el.parents();
                for (let i = 0; i < containerParents.length; i += 1) attach(containerParents[i]);
            }
            attach(swiper.$el[0], {
                childList: swiper.params.observeSlideChildren
            });
            attach(swiper.$wrapperEl[0], {
                attributes: false
            });
        };
        const destroy = () => {
            observers.forEach((observer => {
                observer.disconnect();
            }));
            observers.splice(0, observers.length);
        };
        extendParams({
            observer: false,
            observeParents: false,
            observeSlideChildren: false
        });
        on("init", init);
        on("destroy", destroy);
    }
    const events_emitter = {
        on(events, handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if ("function" !== typeof handler) return self;
            const method = priority ? "unshift" : "push";
            events.split(" ").forEach((event => {
                if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
                self.eventsListeners[event][method](handler);
            }));
            return self;
        },
        once(events, handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if ("function" !== typeof handler) return self;
            function onceHandler(...args) {
                self.off(events, onceHandler);
                if (onceHandler.__emitterProxy) delete onceHandler.__emitterProxy;
                handler.apply(self, args);
            }
            onceHandler.__emitterProxy = handler;
            return self.on(events, onceHandler, priority);
        },
        onAny(handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if ("function" !== typeof handler) return self;
            const method = priority ? "unshift" : "push";
            if (self.eventsAnyListeners.indexOf(handler) < 0) self.eventsAnyListeners[method](handler);
            return self;
        },
        offAny(handler) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsAnyListeners) return self;
            const index = self.eventsAnyListeners.indexOf(handler);
            if (index >= 0) self.eventsAnyListeners.splice(index, 1);
            return self;
        },
        off(events, handler) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsListeners) return self;
            events.split(" ").forEach((event => {
                if ("undefined" === typeof handler) self.eventsListeners[event] = []; else if (self.eventsListeners[event]) self.eventsListeners[event].forEach(((eventHandler, index) => {
                    if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) self.eventsListeners[event].splice(index, 1);
                }));
            }));
            return self;
        },
        emit(...args) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsListeners) return self;
            let events;
            let data;
            let context;
            if ("string" === typeof args[0] || Array.isArray(args[0])) {
                events = args[0];
                data = args.slice(1, args.length);
                context = self;
            } else {
                events = args[0].events;
                data = args[0].data;
                context = args[0].context || self;
            }
            data.unshift(context);
            const eventsArray = Array.isArray(events) ? events : events.split(" ");
            eventsArray.forEach((event => {
                if (self.eventsAnyListeners && self.eventsAnyListeners.length) self.eventsAnyListeners.forEach((eventHandler => {
                    eventHandler.apply(context, [ event, ...data ]);
                }));
                if (self.eventsListeners && self.eventsListeners[event]) self.eventsListeners[event].forEach((eventHandler => {
                    eventHandler.apply(context, data);
                }));
            }));
            return self;
        }
    };
    function updateSize() {
        const swiper = this;
        let width;
        let height;
        const $el = swiper.$el;
        if ("undefined" !== typeof swiper.params.width && null !== swiper.params.width) width = swiper.params.width; else width = $el[0].clientWidth;
        if ("undefined" !== typeof swiper.params.height && null !== swiper.params.height) height = swiper.params.height; else height = $el[0].clientHeight;
        if (0 === width && swiper.isHorizontal() || 0 === height && swiper.isVertical()) return;
        width = width - parseInt($el.css("padding-left") || 0, 10) - parseInt($el.css("padding-right") || 0, 10);
        height = height - parseInt($el.css("padding-top") || 0, 10) - parseInt($el.css("padding-bottom") || 0, 10);
        if (Number.isNaN(width)) width = 0;
        if (Number.isNaN(height)) height = 0;
        Object.assign(swiper, {
            width,
            height,
            size: swiper.isHorizontal() ? width : height
        });
    }
    function updateSlides() {
        const swiper = this;
        function getDirectionLabel(property) {
            if (swiper.isHorizontal()) return property;
            return {
                width: "height",
                "margin-top": "margin-left",
                "margin-bottom ": "margin-right",
                "margin-left": "margin-top",
                "margin-right": "margin-bottom",
                "padding-left": "padding-top",
                "padding-right": "padding-bottom",
                marginRight: "marginBottom"
            }[property];
        }
        function getDirectionPropertyValue(node, label) {
            return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
        }
        const params = swiper.params;
        const {$wrapperEl, size: swiperSize, rtlTranslate: rtl, wrongRTL} = swiper;
        const isVirtual = swiper.virtual && params.virtual.enabled;
        const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
        const slides = $wrapperEl.children(`.${swiper.params.slideClass}`);
        const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
        let snapGrid = [];
        const slidesGrid = [];
        const slidesSizesGrid = [];
        let offsetBefore = params.slidesOffsetBefore;
        if ("function" === typeof offsetBefore) offsetBefore = params.slidesOffsetBefore.call(swiper);
        let offsetAfter = params.slidesOffsetAfter;
        if ("function" === typeof offsetAfter) offsetAfter = params.slidesOffsetAfter.call(swiper);
        const previousSnapGridLength = swiper.snapGrid.length;
        const previousSlidesGridLength = swiper.slidesGrid.length;
        let spaceBetween = params.spaceBetween;
        let slidePosition = -offsetBefore;
        let prevSlideSize = 0;
        let index = 0;
        if ("undefined" === typeof swiperSize) return;
        if ("string" === typeof spaceBetween && spaceBetween.indexOf("%") >= 0) spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiperSize;
        swiper.virtualSize = -spaceBetween;
        if (rtl) slides.css({
            marginLeft: "",
            marginBottom: "",
            marginTop: ""
        }); else slides.css({
            marginRight: "",
            marginBottom: "",
            marginTop: ""
        });
        if (params.centeredSlides && params.cssMode) {
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-before", "");
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-after", "");
        }
        const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
        if (gridEnabled) swiper.grid.initSlides(slidesLength);
        let slideSize;
        const shouldResetSlideSize = "auto" === params.slidesPerView && params.breakpoints && Object.keys(params.breakpoints).filter((key => "undefined" !== typeof params.breakpoints[key].slidesPerView)).length > 0;
        for (let i = 0; i < slidesLength; i += 1) {
            slideSize = 0;
            const slide = slides.eq(i);
            if (gridEnabled) swiper.grid.updateSlide(i, slide, slidesLength, getDirectionLabel);
            if ("none" === slide.css("display")) continue;
            if ("auto" === params.slidesPerView) {
                if (shouldResetSlideSize) slides[i].style[getDirectionLabel("width")] = ``;
                const slideStyles = getComputedStyle(slide[0]);
                const currentTransform = slide[0].style.transform;
                const currentWebKitTransform = slide[0].style.webkitTransform;
                if (currentTransform) slide[0].style.transform = "none";
                if (currentWebKitTransform) slide[0].style.webkitTransform = "none";
                if (params.roundLengths) slideSize = swiper.isHorizontal() ? slide.outerWidth(true) : slide.outerHeight(true); else {
                    const width = getDirectionPropertyValue(slideStyles, "width");
                    const paddingLeft = getDirectionPropertyValue(slideStyles, "padding-left");
                    const paddingRight = getDirectionPropertyValue(slideStyles, "padding-right");
                    const marginLeft = getDirectionPropertyValue(slideStyles, "margin-left");
                    const marginRight = getDirectionPropertyValue(slideStyles, "margin-right");
                    const boxSizing = slideStyles.getPropertyValue("box-sizing");
                    if (boxSizing && "border-box" === boxSizing) slideSize = width + marginLeft + marginRight; else {
                        const {clientWidth, offsetWidth} = slide[0];
                        slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
                    }
                }
                if (currentTransform) slide[0].style.transform = currentTransform;
                if (currentWebKitTransform) slide[0].style.webkitTransform = currentWebKitTransform;
                if (params.roundLengths) slideSize = Math.floor(slideSize);
            } else {
                slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
                if (params.roundLengths) slideSize = Math.floor(slideSize);
                if (slides[i]) slides[i].style[getDirectionLabel("width")] = `${slideSize}px`;
            }
            if (slides[i]) slides[i].swiperSlideSize = slideSize;
            slidesSizesGrid.push(slideSize);
            if (params.centeredSlides) {
                slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
                if (0 === prevSlideSize && 0 !== i) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
                if (0 === i) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
                if (Math.abs(slidePosition) < 1 / 1e3) slidePosition = 0;
                if (params.roundLengths) slidePosition = Math.floor(slidePosition);
                if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
                slidesGrid.push(slidePosition);
            } else {
                if (params.roundLengths) slidePosition = Math.floor(slidePosition);
                if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
                slidesGrid.push(slidePosition);
                slidePosition = slidePosition + slideSize + spaceBetween;
            }
            swiper.virtualSize += slideSize + spaceBetween;
            prevSlideSize = slideSize;
            index += 1;
        }
        swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
        if (rtl && wrongRTL && ("slide" === params.effect || "coverflow" === params.effect)) $wrapperEl.css({
            width: `${swiper.virtualSize + params.spaceBetween}px`
        });
        if (params.setWrapperSize) $wrapperEl.css({
            [getDirectionLabel("width")]: `${swiper.virtualSize + params.spaceBetween}px`
        });
        if (gridEnabled) swiper.grid.updateWrapperSize(slideSize, snapGrid, getDirectionLabel);
        if (!params.centeredSlides) {
            const newSlidesGrid = [];
            for (let i = 0; i < snapGrid.length; i += 1) {
                let slidesGridItem = snapGrid[i];
                if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
                if (snapGrid[i] <= swiper.virtualSize - swiperSize) newSlidesGrid.push(slidesGridItem);
            }
            snapGrid = newSlidesGrid;
            if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) snapGrid.push(swiper.virtualSize - swiperSize);
        }
        if (0 === snapGrid.length) snapGrid = [ 0 ];
        if (0 !== params.spaceBetween) {
            const key = swiper.isHorizontal() && rtl ? "marginLeft" : getDirectionLabel("marginRight");
            slides.filter(((_, slideIndex) => {
                if (!params.cssMode) return true;
                if (slideIndex === slides.length - 1) return false;
                return true;
            })).css({
                [key]: `${spaceBetween}px`
            });
        }
        if (params.centeredSlides && params.centeredSlidesBounds) {
            let allSlidesSize = 0;
            slidesSizesGrid.forEach((slideSizeValue => {
                allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
            }));
            allSlidesSize -= params.spaceBetween;
            const maxSnap = allSlidesSize - swiperSize;
            snapGrid = snapGrid.map((snap => {
                if (snap < 0) return -offsetBefore;
                if (snap > maxSnap) return maxSnap + offsetAfter;
                return snap;
            }));
        }
        if (params.centerInsufficientSlides) {
            let allSlidesSize = 0;
            slidesSizesGrid.forEach((slideSizeValue => {
                allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
            }));
            allSlidesSize -= params.spaceBetween;
            if (allSlidesSize < swiperSize) {
                const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
                snapGrid.forEach(((snap, snapIndex) => {
                    snapGrid[snapIndex] = snap - allSlidesOffset;
                }));
                slidesGrid.forEach(((snap, snapIndex) => {
                    slidesGrid[snapIndex] = snap + allSlidesOffset;
                }));
            }
        }
        Object.assign(swiper, {
            slides,
            snapGrid,
            slidesGrid,
            slidesSizesGrid
        });
        if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-before", `${-snapGrid[0]}px`);
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-after", `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
            const addToSnapGrid = -swiper.snapGrid[0];
            const addToSlidesGrid = -swiper.slidesGrid[0];
            swiper.snapGrid = swiper.snapGrid.map((v => v + addToSnapGrid));
            swiper.slidesGrid = swiper.slidesGrid.map((v => v + addToSlidesGrid));
        }
        if (slidesLength !== previousSlidesLength) swiper.emit("slidesLengthChange");
        if (snapGrid.length !== previousSnapGridLength) {
            if (swiper.params.watchOverflow) swiper.checkOverflow();
            swiper.emit("snapGridLengthChange");
        }
        if (slidesGrid.length !== previousSlidesGridLength) swiper.emit("slidesGridLengthChange");
        if (params.watchSlidesProgress) swiper.updateSlidesOffset();
        if (!isVirtual && !params.cssMode && ("slide" === params.effect || "fade" === params.effect)) {
            const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
            const hasClassBackfaceClassAdded = swiper.$el.hasClass(backFaceHiddenClass);
            if (slidesLength <= params.maxBackfaceHiddenSlides) {
                if (!hasClassBackfaceClassAdded) swiper.$el.addClass(backFaceHiddenClass);
            } else if (hasClassBackfaceClassAdded) swiper.$el.removeClass(backFaceHiddenClass);
        }
    }
    function updateAutoHeight(speed) {
        const swiper = this;
        const activeSlides = [];
        const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        let newHeight = 0;
        let i;
        if ("number" === typeof speed) swiper.setTransition(speed); else if (true === speed) swiper.setTransition(swiper.params.speed);
        const getSlideByIndex = index => {
            if (isVirtual) return swiper.slides.filter((el => parseInt(el.getAttribute("data-swiper-slide-index"), 10) === index))[0];
            return swiper.slides.eq(index)[0];
        };
        if ("auto" !== swiper.params.slidesPerView && swiper.params.slidesPerView > 1) if (swiper.params.centeredSlides) (swiper.visibleSlides || dom([])).each((slide => {
            activeSlides.push(slide);
        })); else for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
            const index = swiper.activeIndex + i;
            if (index > swiper.slides.length && !isVirtual) break;
            activeSlides.push(getSlideByIndex(index));
        } else activeSlides.push(getSlideByIndex(swiper.activeIndex));
        for (i = 0; i < activeSlides.length; i += 1) if ("undefined" !== typeof activeSlides[i]) {
            const height = activeSlides[i].offsetHeight;
            newHeight = height > newHeight ? height : newHeight;
        }
        if (newHeight || 0 === newHeight) swiper.$wrapperEl.css("height", `${newHeight}px`);
    }
    function updateSlidesOffset() {
        const swiper = this;
        const slides = swiper.slides;
        for (let i = 0; i < slides.length; i += 1) slides[i].swiperSlideOffset = swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop;
    }
    function updateSlidesProgress(translate = this && this.translate || 0) {
        const swiper = this;
        const params = swiper.params;
        const {slides, rtlTranslate: rtl, snapGrid} = swiper;
        if (0 === slides.length) return;
        if ("undefined" === typeof slides[0].swiperSlideOffset) swiper.updateSlidesOffset();
        let offsetCenter = -translate;
        if (rtl) offsetCenter = translate;
        slides.removeClass(params.slideVisibleClass);
        swiper.visibleSlidesIndexes = [];
        swiper.visibleSlides = [];
        for (let i = 0; i < slides.length; i += 1) {
            const slide = slides[i];
            let slideOffset = slide.swiperSlideOffset;
            if (params.cssMode && params.centeredSlides) slideOffset -= slides[0].swiperSlideOffset;
            const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
            const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
            const slideBefore = -(offsetCenter - slideOffset);
            const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
            const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
            if (isVisible) {
                swiper.visibleSlides.push(slide);
                swiper.visibleSlidesIndexes.push(i);
                slides.eq(i).addClass(params.slideVisibleClass);
            }
            slide.progress = rtl ? -slideProgress : slideProgress;
            slide.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
        }
        swiper.visibleSlides = dom(swiper.visibleSlides);
    }
    function updateProgress(translate) {
        const swiper = this;
        if ("undefined" === typeof translate) {
            const multiplier = swiper.rtlTranslate ? -1 : 1;
            translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
        }
        const params = swiper.params;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        let {progress, isBeginning, isEnd} = swiper;
        const wasBeginning = isBeginning;
        const wasEnd = isEnd;
        if (0 === translatesDiff) {
            progress = 0;
            isBeginning = true;
            isEnd = true;
        } else {
            progress = (translate - swiper.minTranslate()) / translatesDiff;
            isBeginning = progress <= 0;
            isEnd = progress >= 1;
        }
        Object.assign(swiper, {
            progress,
            isBeginning,
            isEnd
        });
        if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate);
        if (isBeginning && !wasBeginning) swiper.emit("reachBeginning toEdge");
        if (isEnd && !wasEnd) swiper.emit("reachEnd toEdge");
        if (wasBeginning && !isBeginning || wasEnd && !isEnd) swiper.emit("fromEdge");
        swiper.emit("progress", progress);
    }
    function updateSlidesClasses() {
        const swiper = this;
        const {slides, params, $wrapperEl, activeIndex, realIndex} = swiper;
        const isVirtual = swiper.virtual && params.virtual.enabled;
        slides.removeClass(`${params.slideActiveClass} ${params.slideNextClass} ${params.slidePrevClass} ${params.slideDuplicateActiveClass} ${params.slideDuplicateNextClass} ${params.slideDuplicatePrevClass}`);
        let activeSlide;
        if (isVirtual) activeSlide = swiper.$wrapperEl.find(`.${params.slideClass}[data-swiper-slide-index="${activeIndex}"]`); else activeSlide = slides.eq(activeIndex);
        activeSlide.addClass(params.slideActiveClass);
        if (params.loop) if (activeSlide.hasClass(params.slideDuplicateClass)) $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass); else $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
        let nextSlide = activeSlide.nextAll(`.${params.slideClass}`).eq(0).addClass(params.slideNextClass);
        if (params.loop && 0 === nextSlide.length) {
            nextSlide = slides.eq(0);
            nextSlide.addClass(params.slideNextClass);
        }
        let prevSlide = activeSlide.prevAll(`.${params.slideClass}`).eq(0).addClass(params.slidePrevClass);
        if (params.loop && 0 === prevSlide.length) {
            prevSlide = slides.eq(-1);
            prevSlide.addClass(params.slidePrevClass);
        }
        if (params.loop) {
            if (nextSlide.hasClass(params.slideDuplicateClass)) $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${nextSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicateNextClass); else $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${nextSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicateNextClass);
            if (prevSlide.hasClass(params.slideDuplicateClass)) $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${prevSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicatePrevClass); else $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${prevSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicatePrevClass);
        }
        swiper.emitSlidesClasses();
    }
    function updateActiveIndex(newActiveIndex) {
        const swiper = this;
        const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
        const {slidesGrid, snapGrid, params, activeIndex: previousIndex, realIndex: previousRealIndex, snapIndex: previousSnapIndex} = swiper;
        let activeIndex = newActiveIndex;
        let snapIndex;
        if ("undefined" === typeof activeIndex) {
            for (let i = 0; i < slidesGrid.length; i += 1) if ("undefined" !== typeof slidesGrid[i + 1]) {
                if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) activeIndex = i; else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) activeIndex = i + 1;
            } else if (translate >= slidesGrid[i]) activeIndex = i;
            if (params.normalizeSlideIndex) if (activeIndex < 0 || "undefined" === typeof activeIndex) activeIndex = 0;
        }
        if (snapGrid.indexOf(translate) >= 0) snapIndex = snapGrid.indexOf(translate); else {
            const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
            snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
        }
        if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
        if (activeIndex === previousIndex) {
            if (snapIndex !== previousSnapIndex) {
                swiper.snapIndex = snapIndex;
                swiper.emit("snapIndexChange");
            }
            return;
        }
        const realIndex = parseInt(swiper.slides.eq(activeIndex).attr("data-swiper-slide-index") || activeIndex, 10);
        Object.assign(swiper, {
            snapIndex,
            realIndex,
            previousIndex,
            activeIndex
        });
        swiper.emit("activeIndexChange");
        swiper.emit("snapIndexChange");
        if (previousRealIndex !== realIndex) swiper.emit("realIndexChange");
        if (swiper.initialized || swiper.params.runCallbacksOnInit) swiper.emit("slideChange");
    }
    function updateClickedSlide(e) {
        const swiper = this;
        const params = swiper.params;
        const slide = dom(e).closest(`.${params.slideClass}`)[0];
        let slideFound = false;
        let slideIndex;
        if (slide) for (let i = 0; i < swiper.slides.length; i += 1) if (swiper.slides[i] === slide) {
            slideFound = true;
            slideIndex = i;
            break;
        }
        if (slide && slideFound) {
            swiper.clickedSlide = slide;
            if (swiper.virtual && swiper.params.virtual.enabled) swiper.clickedIndex = parseInt(dom(slide).attr("data-swiper-slide-index"), 10); else swiper.clickedIndex = slideIndex;
        } else {
            swiper.clickedSlide = void 0;
            swiper.clickedIndex = void 0;
            return;
        }
        if (params.slideToClickedSlide && void 0 !== swiper.clickedIndex && swiper.clickedIndex !== swiper.activeIndex) swiper.slideToClickedSlide();
    }
    const update = {
        updateSize,
        updateSlides,
        updateAutoHeight,
        updateSlidesOffset,
        updateSlidesProgress,
        updateProgress,
        updateSlidesClasses,
        updateActiveIndex,
        updateClickedSlide
    };
    function getSwiperTranslate(axis = (this.isHorizontal() ? "x" : "y")) {
        const swiper = this;
        const {params, rtlTranslate: rtl, translate, $wrapperEl} = swiper;
        if (params.virtualTranslate) return rtl ? -translate : translate;
        if (params.cssMode) return translate;
        let currentTranslate = utils_getTranslate($wrapperEl[0], axis);
        if (rtl) currentTranslate = -currentTranslate;
        return currentTranslate || 0;
    }
    function setTranslate(translate, byController) {
        const swiper = this;
        const {rtlTranslate: rtl, params, $wrapperEl, wrapperEl, progress} = swiper;
        let x = 0;
        let y = 0;
        const z = 0;
        if (swiper.isHorizontal()) x = rtl ? -translate : translate; else y = translate;
        if (params.roundLengths) {
            x = Math.floor(x);
            y = Math.floor(y);
        }
        if (params.cssMode) wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] = swiper.isHorizontal() ? -x : -y; else if (!params.virtualTranslate) $wrapperEl.transform(`translate3d(${x}px, ${y}px, ${z}px)`);
        swiper.previousTranslate = swiper.translate;
        swiper.translate = swiper.isHorizontal() ? x : y;
        let newProgress;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        if (0 === translatesDiff) newProgress = 0; else newProgress = (translate - swiper.minTranslate()) / translatesDiff;
        if (newProgress !== progress) swiper.updateProgress(translate);
        swiper.emit("setTranslate", swiper.translate, byController);
    }
    function minTranslate() {
        return -this.snapGrid[0];
    }
    function maxTranslate() {
        return -this.snapGrid[this.snapGrid.length - 1];
    }
    function translateTo(translate = 0, speed = this.params.speed, runCallbacks = true, translateBounds = true, internal) {
        const swiper = this;
        const {params, wrapperEl} = swiper;
        if (swiper.animating && params.preventInteractionOnTransition) return false;
        const minTranslate = swiper.minTranslate();
        const maxTranslate = swiper.maxTranslate();
        let newTranslate;
        if (translateBounds && translate > minTranslate) newTranslate = minTranslate; else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate; else newTranslate = translate;
        swiper.updateProgress(newTranslate);
        if (params.cssMode) {
            const isH = swiper.isHorizontal();
            if (0 === speed) wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate; else {
                if (!swiper.support.smoothScroll) {
                    animateCSSModeScroll({
                        swiper,
                        targetPosition: -newTranslate,
                        side: isH ? "left" : "top"
                    });
                    return true;
                }
                wrapperEl.scrollTo({
                    [isH ? "left" : "top"]: -newTranslate,
                    behavior: "smooth"
                });
            }
            return true;
        }
        if (0 === speed) {
            swiper.setTransition(0);
            swiper.setTranslate(newTranslate);
            if (runCallbacks) {
                swiper.emit("beforeTransitionStart", speed, internal);
                swiper.emit("transitionEnd");
            }
        } else {
            swiper.setTransition(speed);
            swiper.setTranslate(newTranslate);
            if (runCallbacks) {
                swiper.emit("beforeTransitionStart", speed, internal);
                swiper.emit("transitionStart");
            }
            if (!swiper.animating) {
                swiper.animating = true;
                if (!swiper.onTranslateToWrapperTransitionEnd) swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
                    if (!swiper || swiper.destroyed) return;
                    if (e.target !== this) return;
                    swiper.$wrapperEl[0].removeEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
                    swiper.$wrapperEl[0].removeEventListener("webkitTransitionEnd", swiper.onTranslateToWrapperTransitionEnd);
                    swiper.onTranslateToWrapperTransitionEnd = null;
                    delete swiper.onTranslateToWrapperTransitionEnd;
                    if (runCallbacks) swiper.emit("transitionEnd");
                };
                swiper.$wrapperEl[0].addEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
                swiper.$wrapperEl[0].addEventListener("webkitTransitionEnd", swiper.onTranslateToWrapperTransitionEnd);
            }
        }
        return true;
    }
    const translate = {
        getTranslate: getSwiperTranslate,
        setTranslate,
        minTranslate,
        maxTranslate,
        translateTo
    };
    function setTransition(duration, byController) {
        const swiper = this;
        if (!swiper.params.cssMode) swiper.$wrapperEl.transition(duration);
        swiper.emit("setTransition", duration, byController);
    }
    function transitionEmit({swiper, runCallbacks, direction, step}) {
        const {activeIndex, previousIndex} = swiper;
        let dir = direction;
        if (!dir) if (activeIndex > previousIndex) dir = "next"; else if (activeIndex < previousIndex) dir = "prev"; else dir = "reset";
        swiper.emit(`transition${step}`);
        if (runCallbacks && activeIndex !== previousIndex) {
            if ("reset" === dir) {
                swiper.emit(`slideResetTransition${step}`);
                return;
            }
            swiper.emit(`slideChangeTransition${step}`);
            if ("next" === dir) swiper.emit(`slideNextTransition${step}`); else swiper.emit(`slidePrevTransition${step}`);
        }
    }
    function transitionStart(runCallbacks = true, direction) {
        const swiper = this;
        const {params} = swiper;
        if (params.cssMode) return;
        if (params.autoHeight) swiper.updateAutoHeight();
        transitionEmit({
            swiper,
            runCallbacks,
            direction,
            step: "Start"
        });
    }
    function transitionEnd_transitionEnd(runCallbacks = true, direction) {
        const swiper = this;
        const {params} = swiper;
        swiper.animating = false;
        if (params.cssMode) return;
        swiper.setTransition(0);
        transitionEmit({
            swiper,
            runCallbacks,
            direction,
            step: "End"
        });
    }
    const core_transition = {
        setTransition,
        transitionStart,
        transitionEnd: transitionEnd_transitionEnd
    };
    function slideTo(index = 0, speed = this.params.speed, runCallbacks = true, internal, initial) {
        if ("number" !== typeof index && "string" !== typeof index) throw new Error(`The 'index' argument cannot have type other than 'number' or 'string'. [${typeof index}] given.`);
        if ("string" === typeof index) {
            const indexAsNumber = parseInt(index, 10);
            const isValidNumber = isFinite(indexAsNumber);
            if (!isValidNumber) throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.`);
            index = indexAsNumber;
        }
        const swiper = this;
        let slideIndex = index;
        if (slideIndex < 0) slideIndex = 0;
        const {params, snapGrid, slidesGrid, previousIndex, activeIndex, rtlTranslate: rtl, wrapperEl, enabled} = swiper;
        if (swiper.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial) return false;
        const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
        let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
        if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
        const translate = -snapGrid[snapIndex];
        if (params.normalizeSlideIndex) for (let i = 0; i < slidesGrid.length; i += 1) {
            const normalizedTranslate = -Math.floor(100 * translate);
            const normalizedGrid = Math.floor(100 * slidesGrid[i]);
            const normalizedGridNext = Math.floor(100 * slidesGrid[i + 1]);
            if ("undefined" !== typeof slidesGrid[i + 1]) {
                if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) slideIndex = i; else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) slideIndex = i + 1;
            } else if (normalizedTranslate >= normalizedGrid) slideIndex = i;
        }
        if (swiper.initialized && slideIndex !== activeIndex) {
            if (!swiper.allowSlideNext && translate < swiper.translate && translate < swiper.minTranslate()) return false;
            if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) if ((activeIndex || 0) !== slideIndex) return false;
        }
        if (slideIndex !== (previousIndex || 0) && runCallbacks) swiper.emit("beforeSlideChangeStart");
        swiper.updateProgress(translate);
        let direction;
        if (slideIndex > activeIndex) direction = "next"; else if (slideIndex < activeIndex) direction = "prev"; else direction = "reset";
        if (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate) {
            swiper.updateActiveIndex(slideIndex);
            if (params.autoHeight) swiper.updateAutoHeight();
            swiper.updateSlidesClasses();
            if ("slide" !== params.effect) swiper.setTranslate(translate);
            if ("reset" !== direction) {
                swiper.transitionStart(runCallbacks, direction);
                swiper.transitionEnd(runCallbacks, direction);
            }
            return false;
        }
        if (params.cssMode) {
            const isH = swiper.isHorizontal();
            const t = rtl ? translate : -translate;
            if (0 === speed) {
                const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
                if (isVirtual) {
                    swiper.wrapperEl.style.scrollSnapType = "none";
                    swiper._immediateVirtual = true;
                }
                wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
                if (isVirtual) requestAnimationFrame((() => {
                    swiper.wrapperEl.style.scrollSnapType = "";
                    swiper._swiperImmediateVirtual = false;
                }));
            } else {
                if (!swiper.support.smoothScroll) {
                    animateCSSModeScroll({
                        swiper,
                        targetPosition: t,
                        side: isH ? "left" : "top"
                    });
                    return true;
                }
                wrapperEl.scrollTo({
                    [isH ? "left" : "top"]: t,
                    behavior: "smooth"
                });
            }
            return true;
        }
        swiper.setTransition(speed);
        swiper.setTranslate(translate);
        swiper.updateActiveIndex(slideIndex);
        swiper.updateSlidesClasses();
        swiper.emit("beforeTransitionStart", speed, internal);
        swiper.transitionStart(runCallbacks, direction);
        if (0 === speed) swiper.transitionEnd(runCallbacks, direction); else if (!swiper.animating) {
            swiper.animating = true;
            if (!swiper.onSlideToWrapperTransitionEnd) swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
                if (!swiper || swiper.destroyed) return;
                if (e.target !== this) return;
                swiper.$wrapperEl[0].removeEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
                swiper.$wrapperEl[0].removeEventListener("webkitTransitionEnd", swiper.onSlideToWrapperTransitionEnd);
                swiper.onSlideToWrapperTransitionEnd = null;
                delete swiper.onSlideToWrapperTransitionEnd;
                swiper.transitionEnd(runCallbacks, direction);
            };
            swiper.$wrapperEl[0].addEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
            swiper.$wrapperEl[0].addEventListener("webkitTransitionEnd", swiper.onSlideToWrapperTransitionEnd);
        }
        return true;
    }
    function slideToLoop(index = 0, speed = this.params.speed, runCallbacks = true, internal) {
        if ("string" === typeof index) {
            const indexAsNumber = parseInt(index, 10);
            const isValidNumber = isFinite(indexAsNumber);
            if (!isValidNumber) throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.`);
            index = indexAsNumber;
        }
        const swiper = this;
        let newIndex = index;
        if (swiper.params.loop) newIndex += swiper.loopedSlides;
        return swiper.slideTo(newIndex, speed, runCallbacks, internal);
    }
    function slideNext(speed = this.params.speed, runCallbacks = true, internal) {
        const swiper = this;
        const {animating, enabled, params} = swiper;
        if (!enabled) return swiper;
        let perGroup = params.slidesPerGroup;
        if ("auto" === params.slidesPerView && 1 === params.slidesPerGroup && params.slidesPerGroupAuto) perGroup = Math.max(swiper.slidesPerViewDynamic("current", true), 1);
        const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
        if (params.loop) {
            if (animating && params.loopPreventsSlide) return false;
            swiper.loopFix();
            swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
        }
        if (params.rewind && swiper.isEnd) return swiper.slideTo(0, speed, runCallbacks, internal);
        return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
    }
    function slidePrev(speed = this.params.speed, runCallbacks = true, internal) {
        const swiper = this;
        const {params, animating, snapGrid, slidesGrid, rtlTranslate, enabled} = swiper;
        if (!enabled) return swiper;
        if (params.loop) {
            if (animating && params.loopPreventsSlide) return false;
            swiper.loopFix();
            swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
        }
        const translate = rtlTranslate ? swiper.translate : -swiper.translate;
        function normalize(val) {
            if (val < 0) return -Math.floor(Math.abs(val));
            return Math.floor(val);
        }
        const normalizedTranslate = normalize(translate);
        const normalizedSnapGrid = snapGrid.map((val => normalize(val)));
        let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
        if ("undefined" === typeof prevSnap && params.cssMode) {
            let prevSnapIndex;
            snapGrid.forEach(((snap, snapIndex) => {
                if (normalizedTranslate >= snap) prevSnapIndex = snapIndex;
            }));
            if ("undefined" !== typeof prevSnapIndex) prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
        }
        let prevIndex = 0;
        if ("undefined" !== typeof prevSnap) {
            prevIndex = slidesGrid.indexOf(prevSnap);
            if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
            if ("auto" === params.slidesPerView && 1 === params.slidesPerGroup && params.slidesPerGroupAuto) {
                prevIndex = prevIndex - swiper.slidesPerViewDynamic("previous", true) + 1;
                prevIndex = Math.max(prevIndex, 0);
            }
        }
        if (params.rewind && swiper.isBeginning) {
            const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
            return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
        }
        return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
    }
    function slideReset(speed = this.params.speed, runCallbacks = true, internal) {
        const swiper = this;
        return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
    }
    function slideToClosest(speed = this.params.speed, runCallbacks = true, internal, threshold = .5) {
        const swiper = this;
        let index = swiper.activeIndex;
        const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
        const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
        const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
        if (translate >= swiper.snapGrid[snapIndex]) {
            const currentSnap = swiper.snapGrid[snapIndex];
            const nextSnap = swiper.snapGrid[snapIndex + 1];
            if (translate - currentSnap > (nextSnap - currentSnap) * threshold) index += swiper.params.slidesPerGroup;
        } else {
            const prevSnap = swiper.snapGrid[snapIndex - 1];
            const currentSnap = swiper.snapGrid[snapIndex];
            if (translate - prevSnap <= (currentSnap - prevSnap) * threshold) index -= swiper.params.slidesPerGroup;
        }
        index = Math.max(index, 0);
        index = Math.min(index, swiper.slidesGrid.length - 1);
        return swiper.slideTo(index, speed, runCallbacks, internal);
    }
    function slideToClickedSlide() {
        const swiper = this;
        const {params, $wrapperEl} = swiper;
        const slidesPerView = "auto" === params.slidesPerView ? swiper.slidesPerViewDynamic() : params.slidesPerView;
        let slideToIndex = swiper.clickedIndex;
        let realIndex;
        if (params.loop) {
            if (swiper.animating) return;
            realIndex = parseInt(dom(swiper.clickedSlide).attr("data-swiper-slide-index"), 10);
            if (params.centeredSlides) if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
                swiper.loopFix();
                slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
                utils_nextTick((() => {
                    swiper.slideTo(slideToIndex);
                }));
            } else swiper.slideTo(slideToIndex); else if (slideToIndex > swiper.slides.length - slidesPerView) {
                swiper.loopFix();
                slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
                utils_nextTick((() => {
                    swiper.slideTo(slideToIndex);
                }));
            } else swiper.slideTo(slideToIndex);
        } else swiper.slideTo(slideToIndex);
    }
    const slide = {
        slideTo,
        slideToLoop,
        slideNext,
        slidePrev,
        slideReset,
        slideToClosest,
        slideToClickedSlide
    };
    function loopCreate() {
        const swiper = this;
        const document = ssr_window_esm_getDocument();
        const {params, $wrapperEl} = swiper;
        const $selector = $wrapperEl.children().length > 0 ? dom($wrapperEl.children()[0].parentNode) : $wrapperEl;
        $selector.children(`.${params.slideClass}.${params.slideDuplicateClass}`).remove();
        let slides = $selector.children(`.${params.slideClass}`);
        if (params.loopFillGroupWithBlank) {
            const blankSlidesNum = params.slidesPerGroup - slides.length % params.slidesPerGroup;
            if (blankSlidesNum !== params.slidesPerGroup) {
                for (let i = 0; i < blankSlidesNum; i += 1) {
                    const blankNode = dom(document.createElement("div")).addClass(`${params.slideClass} ${params.slideBlankClass}`);
                    $selector.append(blankNode);
                }
                slides = $selector.children(`.${params.slideClass}`);
            }
        }
        if ("auto" === params.slidesPerView && !params.loopedSlides) params.loopedSlides = slides.length;
        swiper.loopedSlides = Math.ceil(parseFloat(params.loopedSlides || params.slidesPerView, 10));
        swiper.loopedSlides += params.loopAdditionalSlides;
        if (swiper.loopedSlides > slides.length && swiper.params.loopedSlidesLimit) swiper.loopedSlides = slides.length;
        const prependSlides = [];
        const appendSlides = [];
        slides.each(((el, index) => {
            const slide = dom(el);
            slide.attr("data-swiper-slide-index", index);
        }));
        for (let i = 0; i < swiper.loopedSlides; i += 1) {
            const index = i - Math.floor(i / slides.length) * slides.length;
            appendSlides.push(slides.eq(index)[0]);
            prependSlides.unshift(slides.eq(slides.length - index - 1)[0]);
        }
        for (let i = 0; i < appendSlides.length; i += 1) $selector.append(dom(appendSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
        for (let i = prependSlides.length - 1; i >= 0; i -= 1) $selector.prepend(dom(prependSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
    }
    function loopFix() {
        const swiper = this;
        swiper.emit("beforeLoopFix");
        const {activeIndex, slides, loopedSlides, allowSlidePrev, allowSlideNext, snapGrid, rtlTranslate: rtl} = swiper;
        let newIndex;
        swiper.allowSlidePrev = true;
        swiper.allowSlideNext = true;
        const snapTranslate = -snapGrid[activeIndex];
        const diff = snapTranslate - swiper.getTranslate();
        if (activeIndex < loopedSlides) {
            newIndex = slides.length - 3 * loopedSlides + activeIndex;
            newIndex += loopedSlides;
            const slideChanged = swiper.slideTo(newIndex, 0, false, true);
            if (slideChanged && 0 !== diff) swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
        } else if (activeIndex >= slides.length - loopedSlides) {
            newIndex = -slides.length + activeIndex + loopedSlides;
            newIndex += loopedSlides;
            const slideChanged = swiper.slideTo(newIndex, 0, false, true);
            if (slideChanged && 0 !== diff) swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
        }
        swiper.allowSlidePrev = allowSlidePrev;
        swiper.allowSlideNext = allowSlideNext;
        swiper.emit("loopFix");
    }
    function loopDestroy() {
        const swiper = this;
        const {$wrapperEl, params, slides} = swiper;
        $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass},.${params.slideClass}.${params.slideBlankClass}`).remove();
        slides.removeAttr("data-swiper-slide-index");
    }
    const loop = {
        loopCreate,
        loopFix,
        loopDestroy
    };
    function setGrabCursor(moving) {
        const swiper = this;
        if (swiper.support.touch || !swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
        const el = "container" === swiper.params.touchEventsTarget ? swiper.el : swiper.wrapperEl;
        el.style.cursor = "move";
        el.style.cursor = moving ? "grabbing" : "grab";
    }
    function unsetGrabCursor() {
        const swiper = this;
        if (swiper.support.touch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
        swiper["container" === swiper.params.touchEventsTarget ? "el" : "wrapperEl"].style.cursor = "";
    }
    const grab_cursor = {
        setGrabCursor,
        unsetGrabCursor
    };
    function closestElement(selector, base = this) {
        function __closestFrom(el) {
            if (!el || el === ssr_window_esm_getDocument() || el === ssr_window_esm_getWindow()) return null;
            if (el.assignedSlot) el = el.assignedSlot;
            const found = el.closest(selector);
            if (!found && !el.getRootNode) return null;
            return found || __closestFrom(el.getRootNode().host);
        }
        return __closestFrom(base);
    }
    function onTouchStart(event) {
        const swiper = this;
        const document = ssr_window_esm_getDocument();
        const window = ssr_window_esm_getWindow();
        const data = swiper.touchEventsData;
        const {params, touches, enabled} = swiper;
        if (!enabled) return;
        if (swiper.animating && params.preventInteractionOnTransition) return;
        if (!swiper.animating && params.cssMode && params.loop) swiper.loopFix();
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        let $targetEl = dom(e.target);
        if ("wrapper" === params.touchEventsTarget) if (!$targetEl.closest(swiper.wrapperEl).length) return;
        data.isTouchEvent = "touchstart" === e.type;
        if (!data.isTouchEvent && "which" in e && 3 === e.which) return;
        if (!data.isTouchEvent && "button" in e && e.button > 0) return;
        if (data.isTouched && data.isMoved) return;
        const swipingClassHasValue = !!params.noSwipingClass && "" !== params.noSwipingClass;
        const eventPath = event.composedPath ? event.composedPath() : event.path;
        if (swipingClassHasValue && e.target && e.target.shadowRoot && eventPath) $targetEl = dom(eventPath[0]);
        const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
        const isTargetShadow = !!(e.target && e.target.shadowRoot);
        if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, $targetEl[0]) : $targetEl.closest(noSwipingSelector)[0])) {
            swiper.allowClick = true;
            return;
        }
        if (params.swipeHandler) if (!$targetEl.closest(params.swipeHandler)[0]) return;
        touches.currentX = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX;
        touches.currentY = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY;
        const startX = touches.currentX;
        const startY = touches.currentY;
        const edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
        const edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;
        if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) if ("prevent" === edgeSwipeDetection) event.preventDefault(); else return;
        Object.assign(data, {
            isTouched: true,
            isMoved: false,
            allowTouchCallbacks: true,
            isScrolling: void 0,
            startMoving: void 0
        });
        touches.startX = startX;
        touches.startY = startY;
        data.touchStartTime = utils_now();
        swiper.allowClick = true;
        swiper.updateSize();
        swiper.swipeDirection = void 0;
        if (params.threshold > 0) data.allowThresholdMove = false;
        if ("touchstart" !== e.type) {
            let preventDefault = true;
            if ($targetEl.is(data.focusableElements)) {
                preventDefault = false;
                if ("SELECT" === $targetEl[0].nodeName) data.isTouched = false;
            }
            if (document.activeElement && dom(document.activeElement).is(data.focusableElements) && document.activeElement !== $targetEl[0]) document.activeElement.blur();
            const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
            if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !$targetEl[0].isContentEditable) e.preventDefault();
        }
        if (swiper.params.freeMode && swiper.params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) swiper.freeMode.onTouchStart();
        swiper.emit("touchStart", e);
    }
    function onTouchMove(event) {
        const document = ssr_window_esm_getDocument();
        const swiper = this;
        const data = swiper.touchEventsData;
        const {params, touches, rtlTranslate: rtl, enabled} = swiper;
        if (!enabled) return;
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        if (!data.isTouched) {
            if (data.startMoving && data.isScrolling) swiper.emit("touchMoveOpposite", e);
            return;
        }
        if (data.isTouchEvent && "touchmove" !== e.type) return;
        const targetTouch = "touchmove" === e.type && e.targetTouches && (e.targetTouches[0] || e.changedTouches[0]);
        const pageX = "touchmove" === e.type ? targetTouch.pageX : e.pageX;
        const pageY = "touchmove" === e.type ? targetTouch.pageY : e.pageY;
        if (e.preventedByNestedSwiper) {
            touches.startX = pageX;
            touches.startY = pageY;
            return;
        }
        if (!swiper.allowTouchMove) {
            if (!dom(e.target).is(data.focusableElements)) swiper.allowClick = false;
            if (data.isTouched) {
                Object.assign(touches, {
                    startX: pageX,
                    startY: pageY,
                    currentX: pageX,
                    currentY: pageY
                });
                data.touchStartTime = utils_now();
            }
            return;
        }
        if (data.isTouchEvent && params.touchReleaseOnEdges && !params.loop) if (swiper.isVertical()) {
            if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
                data.isTouched = false;
                data.isMoved = false;
                return;
            }
        } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) return;
        if (data.isTouchEvent && document.activeElement) if (e.target === document.activeElement && dom(e.target).is(data.focusableElements)) {
            data.isMoved = true;
            swiper.allowClick = false;
            return;
        }
        if (data.allowTouchCallbacks) swiper.emit("touchMove", e);
        if (e.targetTouches && e.targetTouches.length > 1) return;
        touches.currentX = pageX;
        touches.currentY = pageY;
        const diffX = touches.currentX - touches.startX;
        const diffY = touches.currentY - touches.startY;
        if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;
        if ("undefined" === typeof data.isScrolling) {
            let touchAngle;
            if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) data.isScrolling = false; else if (diffX * diffX + diffY * diffY >= 25) {
                touchAngle = 180 * Math.atan2(Math.abs(diffY), Math.abs(diffX)) / Math.PI;
                data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
            }
        }
        if (data.isScrolling) swiper.emit("touchMoveOpposite", e);
        if ("undefined" === typeof data.startMoving) if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) data.startMoving = true;
        if (data.isScrolling) {
            data.isTouched = false;
            return;
        }
        if (!data.startMoving) return;
        swiper.allowClick = false;
        if (!params.cssMode && e.cancelable) e.preventDefault();
        if (params.touchMoveStopPropagation && !params.nested) e.stopPropagation();
        if (!data.isMoved) {
            if (params.loop && !params.cssMode) swiper.loopFix();
            data.startTranslate = swiper.getTranslate();
            swiper.setTransition(0);
            if (swiper.animating) swiper.$wrapperEl.trigger("webkitTransitionEnd transitionend");
            data.allowMomentumBounce = false;
            if (params.grabCursor && (true === swiper.allowSlideNext || true === swiper.allowSlidePrev)) swiper.setGrabCursor(true);
            swiper.emit("sliderFirstMove", e);
        }
        swiper.emit("sliderMove", e);
        data.isMoved = true;
        let diff = swiper.isHorizontal() ? diffX : diffY;
        touches.diff = diff;
        diff *= params.touchRatio;
        if (rtl) diff = -diff;
        swiper.swipeDirection = diff > 0 ? "prev" : "next";
        data.currentTranslate = diff + data.startTranslate;
        let disableParentSwiper = true;
        let resistanceRatio = params.resistanceRatio;
        if (params.touchReleaseOnEdges) resistanceRatio = 0;
        if (diff > 0 && data.currentTranslate > swiper.minTranslate()) {
            disableParentSwiper = false;
            if (params.resistance) data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
        } else if (diff < 0 && data.currentTranslate < swiper.maxTranslate()) {
            disableParentSwiper = false;
            if (params.resistance) data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
        }
        if (disableParentSwiper) e.preventedByNestedSwiper = true;
        if (!swiper.allowSlideNext && "next" === swiper.swipeDirection && data.currentTranslate < data.startTranslate) data.currentTranslate = data.startTranslate;
        if (!swiper.allowSlidePrev && "prev" === swiper.swipeDirection && data.currentTranslate > data.startTranslate) data.currentTranslate = data.startTranslate;
        if (!swiper.allowSlidePrev && !swiper.allowSlideNext) data.currentTranslate = data.startTranslate;
        if (params.threshold > 0) if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
            if (!data.allowThresholdMove) {
                data.allowThresholdMove = true;
                touches.startX = touches.currentX;
                touches.startY = touches.currentY;
                data.currentTranslate = data.startTranslate;
                touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
                return;
            }
        } else {
            data.currentTranslate = data.startTranslate;
            return;
        }
        if (!params.followFinger || params.cssMode) return;
        if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();
        }
        if (swiper.params.freeMode && params.freeMode.enabled && swiper.freeMode) swiper.freeMode.onTouchMove();
        swiper.updateProgress(data.currentTranslate);
        swiper.setTranslate(data.currentTranslate);
    }
    function onTouchEnd(event) {
        const swiper = this;
        const data = swiper.touchEventsData;
        const {params, touches, rtlTranslate: rtl, slidesGrid, enabled} = swiper;
        if (!enabled) return;
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        if (data.allowTouchCallbacks) swiper.emit("touchEnd", e);
        data.allowTouchCallbacks = false;
        if (!data.isTouched) {
            if (data.isMoved && params.grabCursor) swiper.setGrabCursor(false);
            data.isMoved = false;
            data.startMoving = false;
            return;
        }
        if (params.grabCursor && data.isMoved && data.isTouched && (true === swiper.allowSlideNext || true === swiper.allowSlidePrev)) swiper.setGrabCursor(false);
        const touchEndTime = utils_now();
        const timeDiff = touchEndTime - data.touchStartTime;
        if (swiper.allowClick) {
            const pathTree = e.path || e.composedPath && e.composedPath();
            swiper.updateClickedSlide(pathTree && pathTree[0] || e.target);
            swiper.emit("tap click", e);
            if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) swiper.emit("doubleTap doubleClick", e);
        }
        data.lastClickTime = utils_now();
        utils_nextTick((() => {
            if (!swiper.destroyed) swiper.allowClick = true;
        }));
        if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || 0 === touches.diff || data.currentTranslate === data.startTranslate) {
            data.isTouched = false;
            data.isMoved = false;
            data.startMoving = false;
            return;
        }
        data.isTouched = false;
        data.isMoved = false;
        data.startMoving = false;
        let currentPos;
        if (params.followFinger) currentPos = rtl ? swiper.translate : -swiper.translate; else currentPos = -data.currentTranslate;
        if (params.cssMode) return;
        if (swiper.params.freeMode && params.freeMode.enabled) {
            swiper.freeMode.onTouchEnd({
                currentPos
            });
            return;
        }
        let stopIndex = 0;
        let groupSize = swiper.slidesSizesGrid[0];
        for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
            const increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
            if ("undefined" !== typeof slidesGrid[i + increment]) {
                if (currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment]) {
                    stopIndex = i;
                    groupSize = slidesGrid[i + increment] - slidesGrid[i];
                }
            } else if (currentPos >= slidesGrid[i]) {
                stopIndex = i;
                groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
            }
        }
        let rewindFirstIndex = null;
        let rewindLastIndex = null;
        if (params.rewind) if (swiper.isBeginning) rewindLastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1; else if (swiper.isEnd) rewindFirstIndex = 0;
        const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
        const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
        if (timeDiff > params.longSwipesMs) {
            if (!params.longSwipes) {
                swiper.slideTo(swiper.activeIndex);
                return;
            }
            if ("next" === swiper.swipeDirection) if (ratio >= params.longSwipesRatio) swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment); else swiper.slideTo(stopIndex);
            if ("prev" === swiper.swipeDirection) if (ratio > 1 - params.longSwipesRatio) swiper.slideTo(stopIndex + increment); else if (null !== rewindLastIndex && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) swiper.slideTo(rewindLastIndex); else swiper.slideTo(stopIndex);
        } else {
            if (!params.shortSwipes) {
                swiper.slideTo(swiper.activeIndex);
                return;
            }
            const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);
            if (!isNavButtonTarget) {
                if ("next" === swiper.swipeDirection) swiper.slideTo(null !== rewindFirstIndex ? rewindFirstIndex : stopIndex + increment);
                if ("prev" === swiper.swipeDirection) swiper.slideTo(null !== rewindLastIndex ? rewindLastIndex : stopIndex);
            } else if (e.target === swiper.navigation.nextEl) swiper.slideTo(stopIndex + increment); else swiper.slideTo(stopIndex);
        }
    }
    function onResize() {
        const swiper = this;
        const {params, el} = swiper;
        if (el && 0 === el.offsetWidth) return;
        if (params.breakpoints) swiper.setBreakpoint();
        const {allowSlideNext, allowSlidePrev, snapGrid} = swiper;
        swiper.allowSlideNext = true;
        swiper.allowSlidePrev = true;
        swiper.updateSize();
        swiper.updateSlides();
        swiper.updateSlidesClasses();
        if (("auto" === params.slidesPerView || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides) swiper.slideTo(swiper.slides.length - 1, 0, false, true); else swiper.slideTo(swiper.activeIndex, 0, false, true);
        if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) swiper.autoplay.run();
        swiper.allowSlidePrev = allowSlidePrev;
        swiper.allowSlideNext = allowSlideNext;
        if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
    }
    function onClick(e) {
        const swiper = this;
        if (!swiper.enabled) return;
        if (!swiper.allowClick) {
            if (swiper.params.preventClicks) e.preventDefault();
            if (swiper.params.preventClicksPropagation && swiper.animating) {
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        }
    }
    function onScroll() {
        const swiper = this;
        const {wrapperEl, rtlTranslate, enabled} = swiper;
        if (!enabled) return;
        swiper.previousTranslate = swiper.translate;
        if (swiper.isHorizontal()) swiper.translate = -wrapperEl.scrollLeft; else swiper.translate = -wrapperEl.scrollTop;
        if (0 === swiper.translate) swiper.translate = 0;
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
        let newProgress;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        if (0 === translatesDiff) newProgress = 0; else newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
        if (newProgress !== swiper.progress) swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
        swiper.emit("setTranslate", swiper.translate, false);
    }
    let dummyEventAttached = false;
    function dummyEventListener() {}
    const events = (swiper, method) => {
        const document = ssr_window_esm_getDocument();
        const {params, touchEvents, el, wrapperEl, device, support} = swiper;
        const capture = !!params.nested;
        const domMethod = "on" === method ? "addEventListener" : "removeEventListener";
        const swiperMethod = method;
        if (!support.touch) {
            el[domMethod](touchEvents.start, swiper.onTouchStart, false);
            document[domMethod](touchEvents.move, swiper.onTouchMove, capture);
            document[domMethod](touchEvents.end, swiper.onTouchEnd, false);
        } else {
            const passiveListener = "touchstart" === touchEvents.start && support.passiveListener && params.passiveListeners ? {
                passive: true,
                capture: false
            } : false;
            el[domMethod](touchEvents.start, swiper.onTouchStart, passiveListener);
            el[domMethod](touchEvents.move, swiper.onTouchMove, support.passiveListener ? {
                passive: false,
                capture
            } : capture);
            el[domMethod](touchEvents.end, swiper.onTouchEnd, passiveListener);
            if (touchEvents.cancel) el[domMethod](touchEvents.cancel, swiper.onTouchEnd, passiveListener);
        }
        if (params.preventClicks || params.preventClicksPropagation) el[domMethod]("click", swiper.onClick, true);
        if (params.cssMode) wrapperEl[domMethod]("scroll", swiper.onScroll);
        if (params.updateOnWindowResize) swiper[swiperMethod](device.ios || device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize, true); else swiper[swiperMethod]("observerUpdate", onResize, true);
    };
    function attachEvents() {
        const swiper = this;
        const document = ssr_window_esm_getDocument();
        const {params, support} = swiper;
        swiper.onTouchStart = onTouchStart.bind(swiper);
        swiper.onTouchMove = onTouchMove.bind(swiper);
        swiper.onTouchEnd = onTouchEnd.bind(swiper);
        if (params.cssMode) swiper.onScroll = onScroll.bind(swiper);
        swiper.onClick = onClick.bind(swiper);
        if (support.touch && !dummyEventAttached) {
            document.addEventListener("touchstart", dummyEventListener);
            dummyEventAttached = true;
        }
        events(swiper, "on");
    }
    function detachEvents() {
        const swiper = this;
        events(swiper, "off");
    }
    const core_events = {
        attachEvents,
        detachEvents
    };
    const isGridEnabled = (swiper, params) => swiper.grid && params.grid && params.grid.rows > 1;
    function setBreakpoint() {
        const swiper = this;
        const {activeIndex, initialized, loopedSlides = 0, params, $el} = swiper;
        const breakpoints = params.breakpoints;
        if (!breakpoints || breakpoints && 0 === Object.keys(breakpoints).length) return;
        const breakpoint = swiper.getBreakpoint(breakpoints, swiper.params.breakpointsBase, swiper.el);
        if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
        const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : void 0;
        const breakpointParams = breakpointOnlyParams || swiper.originalParams;
        const wasMultiRow = isGridEnabled(swiper, params);
        const isMultiRow = isGridEnabled(swiper, breakpointParams);
        const wasEnabled = params.enabled;
        if (wasMultiRow && !isMultiRow) {
            $el.removeClass(`${params.containerModifierClass}grid ${params.containerModifierClass}grid-column`);
            swiper.emitContainerClasses();
        } else if (!wasMultiRow && isMultiRow) {
            $el.addClass(`${params.containerModifierClass}grid`);
            if (breakpointParams.grid.fill && "column" === breakpointParams.grid.fill || !breakpointParams.grid.fill && "column" === params.grid.fill) $el.addClass(`${params.containerModifierClass}grid-column`);
            swiper.emitContainerClasses();
        }
        [ "navigation", "pagination", "scrollbar" ].forEach((prop => {
            const wasModuleEnabled = params[prop] && params[prop].enabled;
            const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
            if (wasModuleEnabled && !isModuleEnabled) swiper[prop].disable();
            if (!wasModuleEnabled && isModuleEnabled) swiper[prop].enable();
        }));
        const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
        const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
        if (directionChanged && initialized) swiper.changeDirection();
        utils_extend(swiper.params, breakpointParams);
        const isEnabled = swiper.params.enabled;
        Object.assign(swiper, {
            allowTouchMove: swiper.params.allowTouchMove,
            allowSlideNext: swiper.params.allowSlideNext,
            allowSlidePrev: swiper.params.allowSlidePrev
        });
        if (wasEnabled && !isEnabled) swiper.disable(); else if (!wasEnabled && isEnabled) swiper.enable();
        swiper.currentBreakpoint = breakpoint;
        swiper.emit("_beforeBreakpoint", breakpointParams);
        if (needsReLoop && initialized) {
            swiper.loopDestroy();
            swiper.loopCreate();
            swiper.updateSlides();
            swiper.slideTo(activeIndex - loopedSlides + swiper.loopedSlides, 0, false);
        }
        swiper.emit("breakpoint", breakpointParams);
    }
    function getBreakpoint(breakpoints, base = "window", containerEl) {
        if (!breakpoints || "container" === base && !containerEl) return;
        let breakpoint = false;
        const window = ssr_window_esm_getWindow();
        const currentHeight = "window" === base ? window.innerHeight : containerEl.clientHeight;
        const points = Object.keys(breakpoints).map((point => {
            if ("string" === typeof point && 0 === point.indexOf("@")) {
                const minRatio = parseFloat(point.substr(1));
                const value = currentHeight * minRatio;
                return {
                    value,
                    point
                };
            }
            return {
                value: point,
                point
            };
        }));
        points.sort(((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10)));
        for (let i = 0; i < points.length; i += 1) {
            const {point, value} = points[i];
            if ("window" === base) {
                if (window.matchMedia(`(min-width: ${value}px)`).matches) breakpoint = point;
            } else if (value <= containerEl.clientWidth) breakpoint = point;
        }
        return breakpoint || "max";
    }
    const breakpoints = {
        setBreakpoint,
        getBreakpoint
    };
    function prepareClasses(entries, prefix) {
        const resultClasses = [];
        entries.forEach((item => {
            if ("object" === typeof item) Object.keys(item).forEach((classNames => {
                if (item[classNames]) resultClasses.push(prefix + classNames);
            })); else if ("string" === typeof item) resultClasses.push(prefix + item);
        }));
        return resultClasses;
    }
    function addClasses() {
        const swiper = this;
        const {classNames, params, rtl, $el, device, support} = swiper;
        const suffixes = prepareClasses([ "initialized", params.direction, {
            "pointer-events": !support.touch
        }, {
            "free-mode": swiper.params.freeMode && params.freeMode.enabled
        }, {
            autoheight: params.autoHeight
        }, {
            rtl
        }, {
            grid: params.grid && params.grid.rows > 1
        }, {
            "grid-column": params.grid && params.grid.rows > 1 && "column" === params.grid.fill
        }, {
            android: device.android
        }, {
            ios: device.ios
        }, {
            "css-mode": params.cssMode
        }, {
            centered: params.cssMode && params.centeredSlides
        }, {
            "watch-progress": params.watchSlidesProgress
        } ], params.containerModifierClass);
        classNames.push(...suffixes);
        $el.addClass([ ...classNames ].join(" "));
        swiper.emitContainerClasses();
    }
    function removeClasses_removeClasses() {
        const swiper = this;
        const {$el, classNames} = swiper;
        $el.removeClass(classNames.join(" "));
        swiper.emitContainerClasses();
    }
    const classes = {
        addClasses,
        removeClasses: removeClasses_removeClasses
    };
    function loadImage(imageEl, src, srcset, sizes, checkForComplete, callback) {
        const window = ssr_window_esm_getWindow();
        let image;
        function onReady() {
            if (callback) callback();
        }
        const isPicture = dom(imageEl).parent("picture")[0];
        if (!isPicture && (!imageEl.complete || !checkForComplete)) if (src) {
            image = new window.Image;
            image.onload = onReady;
            image.onerror = onReady;
            if (sizes) image.sizes = sizes;
            if (srcset) image.srcset = srcset;
            if (src) image.src = src;
        } else onReady(); else onReady();
    }
    function preloadImages() {
        const swiper = this;
        swiper.imagesToLoad = swiper.$el.find("img");
        function onReady() {
            if ("undefined" === typeof swiper || null === swiper || !swiper || swiper.destroyed) return;
            if (void 0 !== swiper.imagesLoaded) swiper.imagesLoaded += 1;
            if (swiper.imagesLoaded === swiper.imagesToLoad.length) {
                if (swiper.params.updateOnImagesReady) swiper.update();
                swiper.emit("imagesReady");
            }
        }
        for (let i = 0; i < swiper.imagesToLoad.length; i += 1) {
            const imageEl = swiper.imagesToLoad[i];
            swiper.loadImage(imageEl, imageEl.currentSrc || imageEl.getAttribute("src"), imageEl.srcset || imageEl.getAttribute("srcset"), imageEl.sizes || imageEl.getAttribute("sizes"), true, onReady);
        }
    }
    const core_images = {
        loadImage,
        preloadImages
    };
    function checkOverflow() {
        const swiper = this;
        const {isLocked: wasLocked, params} = swiper;
        const {slidesOffsetBefore} = params;
        if (slidesOffsetBefore) {
            const lastSlideIndex = swiper.slides.length - 1;
            const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + 2 * slidesOffsetBefore;
            swiper.isLocked = swiper.size > lastSlideRightEdge;
        } else swiper.isLocked = 1 === swiper.snapGrid.length;
        if (true === params.allowSlideNext) swiper.allowSlideNext = !swiper.isLocked;
        if (true === params.allowSlidePrev) swiper.allowSlidePrev = !swiper.isLocked;
        if (wasLocked && wasLocked !== swiper.isLocked) swiper.isEnd = false;
        if (wasLocked !== swiper.isLocked) swiper.emit(swiper.isLocked ? "lock" : "unlock");
    }
    const check_overflow = {
        checkOverflow
    };
    const defaults = {
        init: true,
        direction: "horizontal",
        touchEventsTarget: "wrapper",
        initialSlide: 0,
        speed: 300,
        cssMode: false,
        updateOnWindowResize: true,
        resizeObserver: true,
        nested: false,
        createElements: false,
        enabled: true,
        focusableElements: "input, select, option, textarea, button, video, label",
        width: null,
        height: null,
        preventInteractionOnTransition: false,
        userAgent: null,
        url: null,
        edgeSwipeDetection: false,
        edgeSwipeThreshold: 20,
        autoHeight: false,
        setWrapperSize: false,
        virtualTranslate: false,
        effect: "slide",
        breakpoints: void 0,
        breakpointsBase: "window",
        spaceBetween: 0,
        slidesPerView: 1,
        slidesPerGroup: 1,
        slidesPerGroupSkip: 0,
        slidesPerGroupAuto: false,
        centeredSlides: false,
        centeredSlidesBounds: false,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        normalizeSlideIndex: true,
        centerInsufficientSlides: false,
        watchOverflow: true,
        roundLengths: false,
        touchRatio: 1,
        touchAngle: 45,
        simulateTouch: true,
        shortSwipes: true,
        longSwipes: true,
        longSwipesRatio: .5,
        longSwipesMs: 300,
        followFinger: true,
        allowTouchMove: true,
        threshold: 0,
        touchMoveStopPropagation: false,
        touchStartPreventDefault: true,
        touchStartForcePreventDefault: false,
        touchReleaseOnEdges: false,
        uniqueNavElements: true,
        resistance: true,
        resistanceRatio: .85,
        watchSlidesProgress: false,
        grabCursor: false,
        preventClicks: true,
        preventClicksPropagation: true,
        slideToClickedSlide: false,
        preloadImages: true,
        updateOnImagesReady: true,
        loop: false,
        loopAdditionalSlides: 0,
        loopedSlides: null,
        loopedSlidesLimit: true,
        loopFillGroupWithBlank: false,
        loopPreventsSlide: true,
        rewind: false,
        allowSlidePrev: true,
        allowSlideNext: true,
        swipeHandler: null,
        noSwiping: true,
        noSwipingClass: "swiper-no-swiping",
        noSwipingSelector: null,
        passiveListeners: true,
        maxBackfaceHiddenSlides: 10,
        containerModifierClass: "swiper-",
        slideClass: "swiper-slide",
        slideBlankClass: "swiper-slide-invisible-blank",
        slideActiveClass: "swiper-slide-active",
        slideDuplicateActiveClass: "swiper-slide-duplicate-active",
        slideVisibleClass: "swiper-slide-visible",
        slideDuplicateClass: "swiper-slide-duplicate",
        slideNextClass: "swiper-slide-next",
        slideDuplicateNextClass: "swiper-slide-duplicate-next",
        slidePrevClass: "swiper-slide-prev",
        slideDuplicatePrevClass: "swiper-slide-duplicate-prev",
        wrapperClass: "swiper-wrapper",
        runCallbacksOnInit: true,
        _emitClasses: false
    };
    function moduleExtendParams(params, allModulesParams) {
        return function extendParams(obj = {}) {
            const moduleParamName = Object.keys(obj)[0];
            const moduleParams = obj[moduleParamName];
            if ("object" !== typeof moduleParams || null === moduleParams) {
                utils_extend(allModulesParams, obj);
                return;
            }
            if ([ "navigation", "pagination", "scrollbar" ].indexOf(moduleParamName) >= 0 && true === params[moduleParamName]) params[moduleParamName] = {
                auto: true
            };
            if (!(moduleParamName in params && "enabled" in moduleParams)) {
                utils_extend(allModulesParams, obj);
                return;
            }
            if (true === params[moduleParamName]) params[moduleParamName] = {
                enabled: true
            };
            if ("object" === typeof params[moduleParamName] && !("enabled" in params[moduleParamName])) params[moduleParamName].enabled = true;
            if (!params[moduleParamName]) params[moduleParamName] = {
                enabled: false
            };
            utils_extend(allModulesParams, obj);
        };
    }
    const prototypes = {
        eventsEmitter: events_emitter,
        update,
        translate,
        transition: core_transition,
        slide,
        loop,
        grabCursor: grab_cursor,
        events: core_events,
        breakpoints,
        checkOverflow: check_overflow,
        classes,
        images: core_images
    };
    const extendedDefaults = {};
    class core_Swiper {
        constructor(...args) {
            let el;
            let params;
            if (1 === args.length && args[0].constructor && "Object" === Object.prototype.toString.call(args[0]).slice(8, -1)) params = args[0]; else [el, params] = args;
            if (!params) params = {};
            params = utils_extend({}, params);
            if (el && !params.el) params.el = el;
            if (params.el && dom(params.el).length > 1) {
                const swipers = [];
                dom(params.el).each((containerEl => {
                    const newParams = utils_extend({}, params, {
                        el: containerEl
                    });
                    swipers.push(new core_Swiper(newParams));
                }));
                return swipers;
            }
            const swiper = this;
            swiper.__swiper__ = true;
            swiper.support = getSupport();
            swiper.device = getDevice({
                userAgent: params.userAgent
            });
            swiper.browser = getBrowser();
            swiper.eventsListeners = {};
            swiper.eventsAnyListeners = [];
            swiper.modules = [ ...swiper.__modules__ ];
            if (params.modules && Array.isArray(params.modules)) swiper.modules.push(...params.modules);
            const allModulesParams = {};
            swiper.modules.forEach((mod => {
                mod({
                    swiper,
                    extendParams: moduleExtendParams(params, allModulesParams),
                    on: swiper.on.bind(swiper),
                    once: swiper.once.bind(swiper),
                    off: swiper.off.bind(swiper),
                    emit: swiper.emit.bind(swiper)
                });
            }));
            const swiperParams = utils_extend({}, defaults, allModulesParams);
            swiper.params = utils_extend({}, swiperParams, extendedDefaults, params);
            swiper.originalParams = utils_extend({}, swiper.params);
            swiper.passedParams = utils_extend({}, params);
            if (swiper.params && swiper.params.on) Object.keys(swiper.params.on).forEach((eventName => {
                swiper.on(eventName, swiper.params.on[eventName]);
            }));
            if (swiper.params && swiper.params.onAny) swiper.onAny(swiper.params.onAny);
            swiper.$ = dom;
            Object.assign(swiper, {
                enabled: swiper.params.enabled,
                el,
                classNames: [],
                slides: dom(),
                slidesGrid: [],
                snapGrid: [],
                slidesSizesGrid: [],
                isHorizontal() {
                    return "horizontal" === swiper.params.direction;
                },
                isVertical() {
                    return "vertical" === swiper.params.direction;
                },
                activeIndex: 0,
                realIndex: 0,
                isBeginning: true,
                isEnd: false,
                translate: 0,
                previousTranslate: 0,
                progress: 0,
                velocity: 0,
                animating: false,
                allowSlideNext: swiper.params.allowSlideNext,
                allowSlidePrev: swiper.params.allowSlidePrev,
                touchEvents: function touchEvents() {
                    const touch = [ "touchstart", "touchmove", "touchend", "touchcancel" ];
                    const desktop = [ "pointerdown", "pointermove", "pointerup" ];
                    swiper.touchEventsTouch = {
                        start: touch[0],
                        move: touch[1],
                        end: touch[2],
                        cancel: touch[3]
                    };
                    swiper.touchEventsDesktop = {
                        start: desktop[0],
                        move: desktop[1],
                        end: desktop[2]
                    };
                    return swiper.support.touch || !swiper.params.simulateTouch ? swiper.touchEventsTouch : swiper.touchEventsDesktop;
                }(),
                touchEventsData: {
                    isTouched: void 0,
                    isMoved: void 0,
                    allowTouchCallbacks: void 0,
                    touchStartTime: void 0,
                    isScrolling: void 0,
                    currentTranslate: void 0,
                    startTranslate: void 0,
                    allowThresholdMove: void 0,
                    focusableElements: swiper.params.focusableElements,
                    lastClickTime: utils_now(),
                    clickTimeout: void 0,
                    velocities: [],
                    allowMomentumBounce: void 0,
                    isTouchEvent: void 0,
                    startMoving: void 0
                },
                allowClick: true,
                allowTouchMove: swiper.params.allowTouchMove,
                touches: {
                    startX: 0,
                    startY: 0,
                    currentX: 0,
                    currentY: 0,
                    diff: 0
                },
                imagesToLoad: [],
                imagesLoaded: 0
            });
            swiper.emit("_swiper");
            if (swiper.params.init) swiper.init();
            return swiper;
        }
        enable() {
            const swiper = this;
            if (swiper.enabled) return;
            swiper.enabled = true;
            if (swiper.params.grabCursor) swiper.setGrabCursor();
            swiper.emit("enable");
        }
        disable() {
            const swiper = this;
            if (!swiper.enabled) return;
            swiper.enabled = false;
            if (swiper.params.grabCursor) swiper.unsetGrabCursor();
            swiper.emit("disable");
        }
        setProgress(progress, speed) {
            const swiper = this;
            progress = Math.min(Math.max(progress, 0), 1);
            const min = swiper.minTranslate();
            const max = swiper.maxTranslate();
            const current = (max - min) * progress + min;
            swiper.translateTo(current, "undefined" === typeof speed ? 0 : speed);
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();
        }
        emitContainerClasses() {
            const swiper = this;
            if (!swiper.params._emitClasses || !swiper.el) return;
            const cls = swiper.el.className.split(" ").filter((className => 0 === className.indexOf("swiper") || 0 === className.indexOf(swiper.params.containerModifierClass)));
            swiper.emit("_containerClasses", cls.join(" "));
        }
        getSlideClasses(slideEl) {
            const swiper = this;
            if (swiper.destroyed) return "";
            return slideEl.className.split(" ").filter((className => 0 === className.indexOf("swiper-slide") || 0 === className.indexOf(swiper.params.slideClass))).join(" ");
        }
        emitSlidesClasses() {
            const swiper = this;
            if (!swiper.params._emitClasses || !swiper.el) return;
            const updates = [];
            swiper.slides.each((slideEl => {
                const classNames = swiper.getSlideClasses(slideEl);
                updates.push({
                    slideEl,
                    classNames
                });
                swiper.emit("_slideClass", slideEl, classNames);
            }));
            swiper.emit("_slideClasses", updates);
        }
        slidesPerViewDynamic(view = "current", exact = false) {
            const swiper = this;
            const {params, slides, slidesGrid, slidesSizesGrid, size: swiperSize, activeIndex} = swiper;
            let spv = 1;
            if (params.centeredSlides) {
                let slideSize = slides[activeIndex].swiperSlideSize;
                let breakLoop;
                for (let i = activeIndex + 1; i < slides.length; i += 1) if (slides[i] && !breakLoop) {
                    slideSize += slides[i].swiperSlideSize;
                    spv += 1;
                    if (slideSize > swiperSize) breakLoop = true;
                }
                for (let i = activeIndex - 1; i >= 0; i -= 1) if (slides[i] && !breakLoop) {
                    slideSize += slides[i].swiperSlideSize;
                    spv += 1;
                    if (slideSize > swiperSize) breakLoop = true;
                }
            } else if ("current" === view) for (let i = activeIndex + 1; i < slides.length; i += 1) {
                const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;
                if (slideInView) spv += 1;
            } else for (let i = activeIndex - 1; i >= 0; i -= 1) {
                const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;
                if (slideInView) spv += 1;
            }
            return spv;
        }
        update() {
            const swiper = this;
            if (!swiper || swiper.destroyed) return;
            const {snapGrid, params} = swiper;
            if (params.breakpoints) swiper.setBreakpoint();
            swiper.updateSize();
            swiper.updateSlides();
            swiper.updateProgress();
            swiper.updateSlidesClasses();
            function setTranslate() {
                const translateValue = swiper.rtlTranslate ? -1 * swiper.translate : swiper.translate;
                const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
                swiper.setTranslate(newTranslate);
                swiper.updateActiveIndex();
                swiper.updateSlidesClasses();
            }
            let translated;
            if (swiper.params.freeMode && swiper.params.freeMode.enabled) {
                setTranslate();
                if (swiper.params.autoHeight) swiper.updateAutoHeight();
            } else {
                if (("auto" === swiper.params.slidesPerView || swiper.params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) translated = swiper.slideTo(swiper.slides.length - 1, 0, false, true); else translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
                if (!translated) setTranslate();
            }
            if (params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
            swiper.emit("update");
        }
        changeDirection(newDirection, needUpdate = true) {
            const swiper = this;
            const currentDirection = swiper.params.direction;
            if (!newDirection) newDirection = "horizontal" === currentDirection ? "vertical" : "horizontal";
            if (newDirection === currentDirection || "horizontal" !== newDirection && "vertical" !== newDirection) return swiper;
            swiper.$el.removeClass(`${swiper.params.containerModifierClass}${currentDirection}`).addClass(`${swiper.params.containerModifierClass}${newDirection}`);
            swiper.emitContainerClasses();
            swiper.params.direction = newDirection;
            swiper.slides.each((slideEl => {
                if ("vertical" === newDirection) slideEl.style.width = ""; else slideEl.style.height = "";
            }));
            swiper.emit("changeDirection");
            if (needUpdate) swiper.update();
            return swiper;
        }
        changeLanguageDirection(direction) {
            const swiper = this;
            if (swiper.rtl && "rtl" === direction || !swiper.rtl && "ltr" === direction) return;
            swiper.rtl = "rtl" === direction;
            swiper.rtlTranslate = "horizontal" === swiper.params.direction && swiper.rtl;
            if (swiper.rtl) {
                swiper.$el.addClass(`${swiper.params.containerModifierClass}rtl`);
                swiper.el.dir = "rtl";
            } else {
                swiper.$el.removeClass(`${swiper.params.containerModifierClass}rtl`);
                swiper.el.dir = "ltr";
            }
            swiper.update();
        }
        mount(el) {
            const swiper = this;
            if (swiper.mounted) return true;
            const $el = dom(el || swiper.params.el);
            el = $el[0];
            if (!el) return false;
            el.swiper = swiper;
            const getWrapperSelector = () => `.${(swiper.params.wrapperClass || "").trim().split(" ").join(".")}`;
            const getWrapper = () => {
                if (el && el.shadowRoot && el.shadowRoot.querySelector) {
                    const res = dom(el.shadowRoot.querySelector(getWrapperSelector()));
                    res.children = options => $el.children(options);
                    return res;
                }
                if (!$el.children) return dom($el).children(getWrapperSelector());
                return $el.children(getWrapperSelector());
            };
            let $wrapperEl = getWrapper();
            if (0 === $wrapperEl.length && swiper.params.createElements) {
                const document = ssr_window_esm_getDocument();
                const wrapper = document.createElement("div");
                $wrapperEl = dom(wrapper);
                wrapper.className = swiper.params.wrapperClass;
                $el.append(wrapper);
                $el.children(`.${swiper.params.slideClass}`).each((slideEl => {
                    $wrapperEl.append(slideEl);
                }));
            }
            Object.assign(swiper, {
                $el,
                el,
                $wrapperEl,
                wrapperEl: $wrapperEl[0],
                mounted: true,
                rtl: "rtl" === el.dir.toLowerCase() || "rtl" === $el.css("direction"),
                rtlTranslate: "horizontal" === swiper.params.direction && ("rtl" === el.dir.toLowerCase() || "rtl" === $el.css("direction")),
                wrongRTL: "-webkit-box" === $wrapperEl.css("display")
            });
            return true;
        }
        init(el) {
            const swiper = this;
            if (swiper.initialized) return swiper;
            const mounted = swiper.mount(el);
            if (false === mounted) return swiper;
            swiper.emit("beforeInit");
            if (swiper.params.breakpoints) swiper.setBreakpoint();
            swiper.addClasses();
            if (swiper.params.loop) swiper.loopCreate();
            swiper.updateSize();
            swiper.updateSlides();
            if (swiper.params.watchOverflow) swiper.checkOverflow();
            if (swiper.params.grabCursor && swiper.enabled) swiper.setGrabCursor();
            if (swiper.params.preloadImages) swiper.preloadImages();
            if (swiper.params.loop) swiper.slideTo(swiper.params.initialSlide + swiper.loopedSlides, 0, swiper.params.runCallbacksOnInit, false, true); else swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
            swiper.attachEvents();
            swiper.initialized = true;
            swiper.emit("init");
            swiper.emit("afterInit");
            return swiper;
        }
        destroy(deleteInstance = true, cleanStyles = true) {
            const swiper = this;
            const {params, $el, $wrapperEl, slides} = swiper;
            if ("undefined" === typeof swiper.params || swiper.destroyed) return null;
            swiper.emit("beforeDestroy");
            swiper.initialized = false;
            swiper.detachEvents();
            if (params.loop) swiper.loopDestroy();
            if (cleanStyles) {
                swiper.removeClasses();
                $el.removeAttr("style");
                $wrapperEl.removeAttr("style");
                if (slides && slides.length) slides.removeClass([ params.slideVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass ].join(" ")).removeAttr("style").removeAttr("data-swiper-slide-index");
            }
            swiper.emit("destroy");
            Object.keys(swiper.eventsListeners).forEach((eventName => {
                swiper.off(eventName);
            }));
            if (false !== deleteInstance) {
                swiper.$el[0].swiper = null;
                deleteProps(swiper);
            }
            swiper.destroyed = true;
            return null;
        }
        static extendDefaults(newDefaults) {
            utils_extend(extendedDefaults, newDefaults);
        }
        static get extendedDefaults() {
            return extendedDefaults;
        }
        static get defaults() {
            return defaults;
        }
        static installModule(mod) {
            if (!core_Swiper.prototype.__modules__) core_Swiper.prototype.__modules__ = [];
            const modules = core_Swiper.prototype.__modules__;
            if ("function" === typeof mod && modules.indexOf(mod) < 0) modules.push(mod);
        }
        static use(module) {
            if (Array.isArray(module)) {
                module.forEach((m => core_Swiper.installModule(m)));
                return core_Swiper;
            }
            core_Swiper.installModule(module);
            return core_Swiper;
        }
    }
    Object.keys(prototypes).forEach((prototypeGroup => {
        Object.keys(prototypes[prototypeGroup]).forEach((protoMethod => {
            core_Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
        }));
    }));
    core_Swiper.use([ Resize, Observer ]);
    const core = core_Swiper;
    function create_element_if_not_defined_createElementIfNotDefined(swiper, originalParams, params, checkProps) {
        const document = ssr_window_esm_getDocument();
        if (swiper.params.createElements) Object.keys(checkProps).forEach((key => {
            if (!params[key] && true === params.auto) {
                let element = swiper.$el.children(`.${checkProps[key]}`)[0];
                if (!element) {
                    element = document.createElement("div");
                    element.className = checkProps[key];
                    swiper.$el.append(element);
                }
                params[key] = element;
                originalParams[key] = element;
            }
        }));
        return params;
    }
    function Navigation({swiper, extendParams, on, emit}) {
        extendParams({
            navigation: {
                nextEl: null,
                prevEl: null,
                hideOnClick: false,
                disabledClass: "swiper-button-disabled",
                hiddenClass: "swiper-button-hidden",
                lockClass: "swiper-button-lock",
                navigationDisabledClass: "swiper-navigation-disabled"
            }
        });
        swiper.navigation = {
            nextEl: null,
            $nextEl: null,
            prevEl: null,
            $prevEl: null
        };
        function getEl(el) {
            let $el;
            if (el) {
                $el = dom(el);
                if (swiper.params.uniqueNavElements && "string" === typeof el && $el.length > 1 && 1 === swiper.$el.find(el).length) $el = swiper.$el.find(el);
            }
            return $el;
        }
        function toggleEl($el, disabled) {
            const params = swiper.params.navigation;
            if ($el && $el.length > 0) {
                $el[disabled ? "addClass" : "removeClass"](params.disabledClass);
                if ($el[0] && "BUTTON" === $el[0].tagName) $el[0].disabled = disabled;
                if (swiper.params.watchOverflow && swiper.enabled) $el[swiper.isLocked ? "addClass" : "removeClass"](params.lockClass);
            }
        }
        function update() {
            if (swiper.params.loop) return;
            const {$nextEl, $prevEl} = swiper.navigation;
            toggleEl($prevEl, swiper.isBeginning && !swiper.params.rewind);
            toggleEl($nextEl, swiper.isEnd && !swiper.params.rewind);
        }
        function onPrevClick(e) {
            e.preventDefault();
            if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind) return;
            swiper.slidePrev();
            emit("navigationPrev");
        }
        function onNextClick(e) {
            e.preventDefault();
            if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind) return;
            swiper.slideNext();
            emit("navigationNext");
        }
        function init() {
            const params = swiper.params.navigation;
            swiper.params.navigation = create_element_if_not_defined_createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
                nextEl: "swiper-button-next",
                prevEl: "swiper-button-prev"
            });
            if (!(params.nextEl || params.prevEl)) return;
            const $nextEl = getEl(params.nextEl);
            const $prevEl = getEl(params.prevEl);
            if ($nextEl && $nextEl.length > 0) $nextEl.on("click", onNextClick);
            if ($prevEl && $prevEl.length > 0) $prevEl.on("click", onPrevClick);
            Object.assign(swiper.navigation, {
                $nextEl,
                nextEl: $nextEl && $nextEl[0],
                $prevEl,
                prevEl: $prevEl && $prevEl[0]
            });
            if (!swiper.enabled) {
                if ($nextEl) $nextEl.addClass(params.lockClass);
                if ($prevEl) $prevEl.addClass(params.lockClass);
            }
        }
        function destroy() {
            const {$nextEl, $prevEl} = swiper.navigation;
            if ($nextEl && $nextEl.length) {
                $nextEl.off("click", onNextClick);
                $nextEl.removeClass(swiper.params.navigation.disabledClass);
            }
            if ($prevEl && $prevEl.length) {
                $prevEl.off("click", onPrevClick);
                $prevEl.removeClass(swiper.params.navigation.disabledClass);
            }
        }
        on("init", (() => {
            if (false === swiper.params.navigation.enabled) disable(); else {
                init();
                update();
            }
        }));
        on("toEdge fromEdge lock unlock", (() => {
            update();
        }));
        on("destroy", (() => {
            destroy();
        }));
        on("enable disable", (() => {
            const {$nextEl, $prevEl} = swiper.navigation;
            if ($nextEl) $nextEl[swiper.enabled ? "removeClass" : "addClass"](swiper.params.navigation.lockClass);
            if ($prevEl) $prevEl[swiper.enabled ? "removeClass" : "addClass"](swiper.params.navigation.lockClass);
        }));
        on("click", ((_s, e) => {
            const {$nextEl, $prevEl} = swiper.navigation;
            const targetEl = e.target;
            if (swiper.params.navigation.hideOnClick && !dom(targetEl).is($prevEl) && !dom(targetEl).is($nextEl)) {
                if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
                let isHidden;
                if ($nextEl) isHidden = $nextEl.hasClass(swiper.params.navigation.hiddenClass); else if ($prevEl) isHidden = $prevEl.hasClass(swiper.params.navigation.hiddenClass);
                if (true === isHidden) emit("navigationShow"); else emit("navigationHide");
                if ($nextEl) $nextEl.toggleClass(swiper.params.navigation.hiddenClass);
                if ($prevEl) $prevEl.toggleClass(swiper.params.navigation.hiddenClass);
            }
        }));
        const enable = () => {
            swiper.$el.removeClass(swiper.params.navigation.navigationDisabledClass);
            init();
            update();
        };
        const disable = () => {
            swiper.$el.addClass(swiper.params.navigation.navigationDisabledClass);
            destroy();
        };
        Object.assign(swiper.navigation, {
            enable,
            disable,
            update,
            init,
            destroy
        });
    }
    function classes_to_selector_classesToSelector(classes = "") {
        return `.${classes.trim().replace(/([\.:!\/])/g, "\\$1").replace(/ /g, ".")}`;
    }
    function Pagination({swiper, extendParams, on, emit}) {
        const pfx = "swiper-pagination";
        extendParams({
            pagination: {
                el: null,
                bulletElement: "span",
                clickable: false,
                hideOnClick: false,
                renderBullet: null,
                renderProgressbar: null,
                renderFraction: null,
                renderCustom: null,
                progressbarOpposite: false,
                type: "bullets",
                dynamicBullets: false,
                dynamicMainBullets: 1,
                formatFractionCurrent: number => number,
                formatFractionTotal: number => number,
                bulletClass: `${pfx}-bullet`,
                bulletActiveClass: `${pfx}-bullet-active`,
                modifierClass: `${pfx}-`,
                currentClass: `${pfx}-current`,
                totalClass: `${pfx}-total`,
                hiddenClass: `${pfx}-hidden`,
                progressbarFillClass: `${pfx}-progressbar-fill`,
                progressbarOppositeClass: `${pfx}-progressbar-opposite`,
                clickableClass: `${pfx}-clickable`,
                lockClass: `${pfx}-lock`,
                horizontalClass: `${pfx}-horizontal`,
                verticalClass: `${pfx}-vertical`,
                paginationDisabledClass: `${pfx}-disabled`
            }
        });
        swiper.pagination = {
            el: null,
            $el: null,
            bullets: []
        };
        let bulletSize;
        let dynamicBulletIndex = 0;
        function isPaginationDisabled() {
            return !swiper.params.pagination.el || !swiper.pagination.el || !swiper.pagination.$el || 0 === swiper.pagination.$el.length;
        }
        function setSideBullets($bulletEl, position) {
            const {bulletActiveClass} = swiper.params.pagination;
            $bulletEl[position]().addClass(`${bulletActiveClass}-${position}`)[position]().addClass(`${bulletActiveClass}-${position}-${position}`);
        }
        function update() {
            const rtl = swiper.rtl;
            const params = swiper.params.pagination;
            if (isPaginationDisabled()) return;
            const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
            const $el = swiper.pagination.$el;
            let current;
            const total = swiper.params.loop ? Math.ceil((slidesLength - 2 * swiper.loopedSlides) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
            if (swiper.params.loop) {
                current = Math.ceil((swiper.activeIndex - swiper.loopedSlides) / swiper.params.slidesPerGroup);
                if (current > slidesLength - 1 - 2 * swiper.loopedSlides) current -= slidesLength - 2 * swiper.loopedSlides;
                if (current > total - 1) current -= total;
                if (current < 0 && "bullets" !== swiper.params.paginationType) current = total + current;
            } else if ("undefined" !== typeof swiper.snapIndex) current = swiper.snapIndex; else current = swiper.activeIndex || 0;
            if ("bullets" === params.type && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
                const bullets = swiper.pagination.bullets;
                let firstIndex;
                let lastIndex;
                let midIndex;
                if (params.dynamicBullets) {
                    bulletSize = bullets.eq(0)[swiper.isHorizontal() ? "outerWidth" : "outerHeight"](true);
                    $el.css(swiper.isHorizontal() ? "width" : "height", `${bulletSize * (params.dynamicMainBullets + 4)}px`);
                    if (params.dynamicMainBullets > 1 && void 0 !== swiper.previousIndex) {
                        dynamicBulletIndex += current - (swiper.previousIndex - swiper.loopedSlides || 0);
                        if (dynamicBulletIndex > params.dynamicMainBullets - 1) dynamicBulletIndex = params.dynamicMainBullets - 1; else if (dynamicBulletIndex < 0) dynamicBulletIndex = 0;
                    }
                    firstIndex = Math.max(current - dynamicBulletIndex, 0);
                    lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
                    midIndex = (lastIndex + firstIndex) / 2;
                }
                bullets.removeClass([ "", "-next", "-next-next", "-prev", "-prev-prev", "-main" ].map((suffix => `${params.bulletActiveClass}${suffix}`)).join(" "));
                if ($el.length > 1) bullets.each((bullet => {
                    const $bullet = dom(bullet);
                    const bulletIndex = $bullet.index();
                    if (bulletIndex === current) $bullet.addClass(params.bulletActiveClass);
                    if (params.dynamicBullets) {
                        if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) $bullet.addClass(`${params.bulletActiveClass}-main`);
                        if (bulletIndex === firstIndex) setSideBullets($bullet, "prev");
                        if (bulletIndex === lastIndex) setSideBullets($bullet, "next");
                    }
                })); else {
                    const $bullet = bullets.eq(current);
                    const bulletIndex = $bullet.index();
                    $bullet.addClass(params.bulletActiveClass);
                    if (params.dynamicBullets) {
                        const $firstDisplayedBullet = bullets.eq(firstIndex);
                        const $lastDisplayedBullet = bullets.eq(lastIndex);
                        for (let i = firstIndex; i <= lastIndex; i += 1) bullets.eq(i).addClass(`${params.bulletActiveClass}-main`);
                        if (swiper.params.loop) if (bulletIndex >= bullets.length) {
                            for (let i = params.dynamicMainBullets; i >= 0; i -= 1) bullets.eq(bullets.length - i).addClass(`${params.bulletActiveClass}-main`);
                            bullets.eq(bullets.length - params.dynamicMainBullets - 1).addClass(`${params.bulletActiveClass}-prev`);
                        } else {
                            setSideBullets($firstDisplayedBullet, "prev");
                            setSideBullets($lastDisplayedBullet, "next");
                        } else {
                            setSideBullets($firstDisplayedBullet, "prev");
                            setSideBullets($lastDisplayedBullet, "next");
                        }
                    }
                }
                if (params.dynamicBullets) {
                    const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
                    const bulletsOffset = (bulletSize * dynamicBulletsLength - bulletSize) / 2 - midIndex * bulletSize;
                    const offsetProp = rtl ? "right" : "left";
                    bullets.css(swiper.isHorizontal() ? offsetProp : "top", `${bulletsOffset}px`);
                }
            }
            if ("fraction" === params.type) {
                $el.find(classes_to_selector_classesToSelector(params.currentClass)).text(params.formatFractionCurrent(current + 1));
                $el.find(classes_to_selector_classesToSelector(params.totalClass)).text(params.formatFractionTotal(total));
            }
            if ("progressbar" === params.type) {
                let progressbarDirection;
                if (params.progressbarOpposite) progressbarDirection = swiper.isHorizontal() ? "vertical" : "horizontal"; else progressbarDirection = swiper.isHorizontal() ? "horizontal" : "vertical";
                const scale = (current + 1) / total;
                let scaleX = 1;
                let scaleY = 1;
                if ("horizontal" === progressbarDirection) scaleX = scale; else scaleY = scale;
                $el.find(classes_to_selector_classesToSelector(params.progressbarFillClass)).transform(`translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`).transition(swiper.params.speed);
            }
            if ("custom" === params.type && params.renderCustom) {
                $el.html(params.renderCustom(swiper, current + 1, total));
                emit("paginationRender", $el[0]);
            } else emit("paginationUpdate", $el[0]);
            if (swiper.params.watchOverflow && swiper.enabled) $el[swiper.isLocked ? "addClass" : "removeClass"](params.lockClass);
        }
        function render() {
            const params = swiper.params.pagination;
            if (isPaginationDisabled()) return;
            const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
            const $el = swiper.pagination.$el;
            let paginationHTML = "";
            if ("bullets" === params.type) {
                let numberOfBullets = swiper.params.loop ? Math.ceil((slidesLength - 2 * swiper.loopedSlides) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
                if (swiper.params.freeMode && swiper.params.freeMode.enabled && !swiper.params.loop && numberOfBullets > slidesLength) numberOfBullets = slidesLength;
                for (let i = 0; i < numberOfBullets; i += 1) if (params.renderBullet) paginationHTML += params.renderBullet.call(swiper, i, params.bulletClass); else paginationHTML += `<${params.bulletElement} class="${params.bulletClass}"></${params.bulletElement}>`;
                $el.html(paginationHTML);
                swiper.pagination.bullets = $el.find(classes_to_selector_classesToSelector(params.bulletClass));
            }
            if ("fraction" === params.type) {
                if (params.renderFraction) paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass); else paginationHTML = `<span class="${params.currentClass}"></span>` + " / " + `<span class="${params.totalClass}"></span>`;
                $el.html(paginationHTML);
            }
            if ("progressbar" === params.type) {
                if (params.renderProgressbar) paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass); else paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
                $el.html(paginationHTML);
            }
            if ("custom" !== params.type) emit("paginationRender", swiper.pagination.$el[0]);
        }
        function init() {
            swiper.params.pagination = create_element_if_not_defined_createElementIfNotDefined(swiper, swiper.originalParams.pagination, swiper.params.pagination, {
                el: "swiper-pagination"
            });
            const params = swiper.params.pagination;
            if (!params.el) return;
            let $el = dom(params.el);
            if (0 === $el.length) return;
            if (swiper.params.uniqueNavElements && "string" === typeof params.el && $el.length > 1) {
                $el = swiper.$el.find(params.el);
                if ($el.length > 1) $el = $el.filter((el => {
                    if (dom(el).parents(".swiper")[0] !== swiper.el) return false;
                    return true;
                }));
            }
            if ("bullets" === params.type && params.clickable) $el.addClass(params.clickableClass);
            $el.addClass(params.modifierClass + params.type);
            $el.addClass(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
            if ("bullets" === params.type && params.dynamicBullets) {
                $el.addClass(`${params.modifierClass}${params.type}-dynamic`);
                dynamicBulletIndex = 0;
                if (params.dynamicMainBullets < 1) params.dynamicMainBullets = 1;
            }
            if ("progressbar" === params.type && params.progressbarOpposite) $el.addClass(params.progressbarOppositeClass);
            if (params.clickable) $el.on("click", classes_to_selector_classesToSelector(params.bulletClass), (function onClick(e) {
                e.preventDefault();
                let index = dom(this).index() * swiper.params.slidesPerGroup;
                if (swiper.params.loop) index += swiper.loopedSlides;
                swiper.slideTo(index);
            }));
            Object.assign(swiper.pagination, {
                $el,
                el: $el[0]
            });
            if (!swiper.enabled) $el.addClass(params.lockClass);
        }
        function destroy() {
            const params = swiper.params.pagination;
            if (isPaginationDisabled()) return;
            const $el = swiper.pagination.$el;
            $el.removeClass(params.hiddenClass);
            $el.removeClass(params.modifierClass + params.type);
            $el.removeClass(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
            if (swiper.pagination.bullets && swiper.pagination.bullets.removeClass) swiper.pagination.bullets.removeClass(params.bulletActiveClass);
            if (params.clickable) $el.off("click", classes_to_selector_classesToSelector(params.bulletClass));
        }
        on("init", (() => {
            if (false === swiper.params.pagination.enabled) disable(); else {
                init();
                render();
                update();
            }
        }));
        on("activeIndexChange", (() => {
            if (swiper.params.loop) update(); else if ("undefined" === typeof swiper.snapIndex) update();
        }));
        on("snapIndexChange", (() => {
            if (!swiper.params.loop) update();
        }));
        on("slidesLengthChange", (() => {
            if (swiper.params.loop) {
                render();
                update();
            }
        }));
        on("snapGridLengthChange", (() => {
            if (!swiper.params.loop) {
                render();
                update();
            }
        }));
        on("destroy", (() => {
            destroy();
        }));
        on("enable disable", (() => {
            const {$el} = swiper.pagination;
            if ($el) $el[swiper.enabled ? "removeClass" : "addClass"](swiper.params.pagination.lockClass);
        }));
        on("lock unlock", (() => {
            update();
        }));
        on("click", ((_s, e) => {
            const targetEl = e.target;
            const {$el} = swiper.pagination;
            if (swiper.params.pagination.el && swiper.params.pagination.hideOnClick && $el && $el.length > 0 && !dom(targetEl).hasClass(swiper.params.pagination.bulletClass)) {
                if (swiper.navigation && (swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl)) return;
                const isHidden = $el.hasClass(swiper.params.pagination.hiddenClass);
                if (true === isHidden) emit("paginationShow"); else emit("paginationHide");
                $el.toggleClass(swiper.params.pagination.hiddenClass);
            }
        }));
        const enable = () => {
            swiper.$el.removeClass(swiper.params.pagination.paginationDisabledClass);
            if (swiper.pagination.$el) swiper.pagination.$el.removeClass(swiper.params.pagination.paginationDisabledClass);
            init();
            render();
            update();
        };
        const disable = () => {
            swiper.$el.addClass(swiper.params.pagination.paginationDisabledClass);
            if (swiper.pagination.$el) swiper.pagination.$el.addClass(swiper.params.pagination.paginationDisabledClass);
            destroy();
        };
        Object.assign(swiper.pagination, {
            enable,
            disable,
            render,
            update,
            init,
            destroy
        });
    }
    function Parallax({swiper, extendParams, on}) {
        extendParams({
            parallax: {
                enabled: false
            }
        });
        const setTransform = (el, progress) => {
            const {rtl} = swiper;
            const $el = dom(el);
            const rtlFactor = rtl ? -1 : 1;
            const p = $el.attr("data-swiper-parallax") || "0";
            let x = $el.attr("data-swiper-parallax-x");
            let y = $el.attr("data-swiper-parallax-y");
            const scale = $el.attr("data-swiper-parallax-scale");
            const opacity = $el.attr("data-swiper-parallax-opacity");
            if (x || y) {
                x = x || "0";
                y = y || "0";
            } else if (swiper.isHorizontal()) {
                x = p;
                y = "0";
            } else {
                y = p;
                x = "0";
            }
            if (x.indexOf("%") >= 0) x = `${parseInt(x, 10) * progress * rtlFactor}%`; else x = `${x * progress * rtlFactor}px`;
            if (y.indexOf("%") >= 0) y = `${parseInt(y, 10) * progress}%`; else y = `${y * progress}px`;
            if ("undefined" !== typeof opacity && null !== opacity) {
                const currentOpacity = opacity - (opacity - 1) * (1 - Math.abs(progress));
                $el[0].style.opacity = currentOpacity;
            }
            if ("undefined" === typeof scale || null === scale) $el.transform(`translate3d(${x}, ${y}, 0px)`); else {
                const currentScale = scale - (scale - 1) * (1 - Math.abs(progress));
                $el.transform(`translate3d(${x}, ${y}, 0px) scale(${currentScale})`);
            }
        };
        const setTranslate = () => {
            const {$el, slides, progress, snapGrid} = swiper;
            $el.children("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").each((el => {
                setTransform(el, progress);
            }));
            slides.each(((slideEl, slideIndex) => {
                let slideProgress = slideEl.progress;
                if (swiper.params.slidesPerGroup > 1 && "auto" !== swiper.params.slidesPerView) slideProgress += Math.ceil(slideIndex / 2) - progress * (snapGrid.length - 1);
                slideProgress = Math.min(Math.max(slideProgress, -1), 1);
                dom(slideEl).find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").each((el => {
                    setTransform(el, slideProgress);
                }));
            }));
        };
        const setTransition = (duration = swiper.params.speed) => {
            const {$el} = swiper;
            $el.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").each((parallaxEl => {
                const $parallaxEl = dom(parallaxEl);
                let parallaxDuration = parseInt($parallaxEl.attr("data-swiper-parallax-duration"), 10) || duration;
                if (0 === duration) parallaxDuration = 0;
                $parallaxEl.transition(parallaxDuration);
            }));
        };
        on("beforeInit", (() => {
            if (!swiper.params.parallax.enabled) return;
            swiper.params.watchSlidesProgress = true;
            swiper.originalParams.watchSlidesProgress = true;
        }));
        on("init", (() => {
            if (!swiper.params.parallax.enabled) return;
            setTranslate();
        }));
        on("setTranslate", (() => {
            if (!swiper.params.parallax.enabled) return;
            setTranslate();
        }));
        on("setTransition", ((_swiper, duration) => {
            if (!swiper.params.parallax.enabled) return;
            setTransition(duration);
        }));
    }
    function Autoplay({swiper, extendParams, on, emit}) {
        let timeout;
        swiper.autoplay = {
            running: false,
            paused: false
        };
        extendParams({
            autoplay: {
                enabled: false,
                delay: 3e3,
                waitForTransition: true,
                disableOnInteraction: true,
                stopOnLastSlide: false,
                reverseDirection: false,
                pauseOnMouseEnter: false
            }
        });
        function run() {
            if (!swiper.size) {
                swiper.autoplay.running = false;
                swiper.autoplay.paused = false;
                return;
            }
            const $activeSlideEl = swiper.slides.eq(swiper.activeIndex);
            let delay = swiper.params.autoplay.delay;
            if ($activeSlideEl.attr("data-swiper-autoplay")) delay = $activeSlideEl.attr("data-swiper-autoplay") || swiper.params.autoplay.delay;
            clearTimeout(timeout);
            timeout = utils_nextTick((() => {
                let autoplayResult;
                if (swiper.params.autoplay.reverseDirection) if (swiper.params.loop) {
                    swiper.loopFix();
                    autoplayResult = swiper.slidePrev(swiper.params.speed, true, true);
                    emit("autoplay");
                } else if (!swiper.isBeginning) {
                    autoplayResult = swiper.slidePrev(swiper.params.speed, true, true);
                    emit("autoplay");
                } else if (!swiper.params.autoplay.stopOnLastSlide) {
                    autoplayResult = swiper.slideTo(swiper.slides.length - 1, swiper.params.speed, true, true);
                    emit("autoplay");
                } else stop(); else if (swiper.params.loop) {
                    swiper.loopFix();
                    autoplayResult = swiper.slideNext(swiper.params.speed, true, true);
                    emit("autoplay");
                } else if (!swiper.isEnd) {
                    autoplayResult = swiper.slideNext(swiper.params.speed, true, true);
                    emit("autoplay");
                } else if (!swiper.params.autoplay.stopOnLastSlide) {
                    autoplayResult = swiper.slideTo(0, swiper.params.speed, true, true);
                    emit("autoplay");
                } else stop();
                if (swiper.params.cssMode && swiper.autoplay.running) run(); else if (false === autoplayResult) run();
            }), delay);
        }
        function start() {
            if ("undefined" !== typeof timeout) return false;
            if (swiper.autoplay.running) return false;
            swiper.autoplay.running = true;
            emit("autoplayStart");
            run();
            return true;
        }
        function stop() {
            if (!swiper.autoplay.running) return false;
            if ("undefined" === typeof timeout) return false;
            if (timeout) {
                clearTimeout(timeout);
                timeout = void 0;
            }
            swiper.autoplay.running = false;
            emit("autoplayStop");
            return true;
        }
        function pause(speed) {
            if (!swiper.autoplay.running) return;
            if (swiper.autoplay.paused) return;
            if (timeout) clearTimeout(timeout);
            swiper.autoplay.paused = true;
            if (0 === speed || !swiper.params.autoplay.waitForTransition) {
                swiper.autoplay.paused = false;
                run();
            } else [ "transitionend", "webkitTransitionEnd" ].forEach((event => {
                swiper.$wrapperEl[0].addEventListener(event, onTransitionEnd);
            }));
        }
        function onVisibilityChange() {
            const document = ssr_window_esm_getDocument();
            if ("hidden" === document.visibilityState && swiper.autoplay.running) pause();
            if ("visible" === document.visibilityState && swiper.autoplay.paused) {
                run();
                swiper.autoplay.paused = false;
            }
        }
        function onTransitionEnd(e) {
            if (!swiper || swiper.destroyed || !swiper.$wrapperEl) return;
            if (e.target !== swiper.$wrapperEl[0]) return;
            [ "transitionend", "webkitTransitionEnd" ].forEach((event => {
                swiper.$wrapperEl[0].removeEventListener(event, onTransitionEnd);
            }));
            swiper.autoplay.paused = false;
            if (!swiper.autoplay.running) stop(); else run();
        }
        function onMouseEnter() {
            if (swiper.params.autoplay.disableOnInteraction) stop(); else {
                emit("autoplayPause");
                pause();
            }
            [ "transitionend", "webkitTransitionEnd" ].forEach((event => {
                swiper.$wrapperEl[0].removeEventListener(event, onTransitionEnd);
            }));
        }
        function onMouseLeave() {
            if (swiper.params.autoplay.disableOnInteraction) return;
            swiper.autoplay.paused = false;
            emit("autoplayResume");
            run();
        }
        function attachMouseEvents() {
            if (swiper.params.autoplay.pauseOnMouseEnter) {
                swiper.$el.on("mouseenter", onMouseEnter);
                swiper.$el.on("mouseleave", onMouseLeave);
            }
        }
        function detachMouseEvents() {
            swiper.$el.off("mouseenter", onMouseEnter);
            swiper.$el.off("mouseleave", onMouseLeave);
        }
        on("init", (() => {
            if (swiper.params.autoplay.enabled) {
                start();
                const document = ssr_window_esm_getDocument();
                document.addEventListener("visibilitychange", onVisibilityChange);
                attachMouseEvents();
            }
        }));
        on("beforeTransitionStart", ((_s, speed, internal) => {
            if (swiper.autoplay.running) if (internal || !swiper.params.autoplay.disableOnInteraction) swiper.autoplay.pause(speed); else stop();
        }));
        on("sliderFirstMove", (() => {
            if (swiper.autoplay.running) if (swiper.params.autoplay.disableOnInteraction) stop(); else pause();
        }));
        on("touchEnd", (() => {
            if (swiper.params.cssMode && swiper.autoplay.paused && !swiper.params.autoplay.disableOnInteraction) run();
        }));
        on("destroy", (() => {
            detachMouseEvents();
            if (swiper.autoplay.running) stop();
            const document = ssr_window_esm_getDocument();
            document.removeEventListener("visibilitychange", onVisibilityChange);
        }));
        Object.assign(swiper.autoplay, {
            pause,
            run,
            start,
            stop
        });
    }
    function effect_init_effectInit(params) {
        const {effect, swiper, on, setTranslate, setTransition, overwriteParams, perspective, recreateShadows, getEffectParams} = params;
        on("beforeInit", (() => {
            if (swiper.params.effect !== effect) return;
            swiper.classNames.push(`${swiper.params.containerModifierClass}${effect}`);
            if (perspective && perspective()) swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
            const overwriteParamsResult = overwriteParams ? overwriteParams() : {};
            Object.assign(swiper.params, overwriteParamsResult);
            Object.assign(swiper.originalParams, overwriteParamsResult);
        }));
        on("setTranslate", (() => {
            if (swiper.params.effect !== effect) return;
            setTranslate();
        }));
        on("setTransition", ((_s, duration) => {
            if (swiper.params.effect !== effect) return;
            setTransition(duration);
        }));
        on("transitionEnd", (() => {
            if (swiper.params.effect !== effect) return;
            if (recreateShadows) {
                if (!getEffectParams || !getEffectParams().slideShadows) return;
                swiper.slides.each((slideEl => {
                    const $slideEl = swiper.$(slideEl);
                    $slideEl.find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").remove();
                }));
                recreateShadows();
            }
        }));
        let requireUpdateOnVirtual;
        on("virtualUpdate", (() => {
            if (swiper.params.effect !== effect) return;
            if (!swiper.slides.length) requireUpdateOnVirtual = true;
            requestAnimationFrame((() => {
                if (requireUpdateOnVirtual && swiper.slides && swiper.slides.length) {
                    setTranslate();
                    requireUpdateOnVirtual = false;
                }
            }));
        }));
    }
    function effect_target_effectTarget(effectParams, $slideEl) {
        if (effectParams.transformEl) return $slideEl.find(effectParams.transformEl).css({
            "backface-visibility": "hidden",
            "-webkit-backface-visibility": "hidden"
        });
        return $slideEl;
    }
    function effect_virtual_transition_end_effectVirtualTransitionEnd({swiper, duration, transformEl, allSlides}) {
        const {slides, activeIndex, $wrapperEl} = swiper;
        if (swiper.params.virtualTranslate && 0 !== duration) {
            let eventTriggered = false;
            let $transitionEndTarget;
            if (allSlides) $transitionEndTarget = transformEl ? slides.find(transformEl) : slides; else $transitionEndTarget = transformEl ? slides.eq(activeIndex).find(transformEl) : slides.eq(activeIndex);
            $transitionEndTarget.transitionEnd((() => {
                if (eventTriggered) return;
                if (!swiper || swiper.destroyed) return;
                eventTriggered = true;
                swiper.animating = false;
                const triggerEvents = [ "webkitTransitionEnd", "transitionend" ];
                for (let i = 0; i < triggerEvents.length; i += 1) $wrapperEl.trigger(triggerEvents[i]);
            }));
        }
    }
    function EffectFade({swiper, extendParams, on}) {
        extendParams({
            fadeEffect: {
                crossFade: false,
                transformEl: null
            }
        });
        const setTranslate = () => {
            const {slides} = swiper;
            const params = swiper.params.fadeEffect;
            for (let i = 0; i < slides.length; i += 1) {
                const $slideEl = swiper.slides.eq(i);
                const offset = $slideEl[0].swiperSlideOffset;
                let tx = -offset;
                if (!swiper.params.virtualTranslate) tx -= swiper.translate;
                let ty = 0;
                if (!swiper.isHorizontal()) {
                    ty = tx;
                    tx = 0;
                }
                const slideOpacity = swiper.params.fadeEffect.crossFade ? Math.max(1 - Math.abs($slideEl[0].progress), 0) : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
                const $targetEl = effect_target_effectTarget(params, $slideEl);
                $targetEl.css({
                    opacity: slideOpacity
                }).transform(`translate3d(${tx}px, ${ty}px, 0px)`);
            }
        };
        const setTransition = duration => {
            const {transformEl} = swiper.params.fadeEffect;
            const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
            $transitionElements.transition(duration);
            effect_virtual_transition_end_effectVirtualTransitionEnd({
                swiper,
                duration,
                transformEl,
                allSlides: true
            });
        };
        effect_init_effectInit({
            effect: "fade",
            swiper,
            on,
            setTranslate,
            setTransition,
            overwriteParams: () => ({
                slidesPerView: 1,
                slidesPerGroup: 1,
                watchSlidesProgress: true,
                spaceBetween: 0,
                virtualTranslate: !swiper.params.cssMode
            })
        });
    }
    function create_shadow_createShadow(params, $slideEl, side) {
        const shadowClass = `swiper-slide-shadow${side ? `-${side}` : ""}`;
        const $shadowContainer = params.transformEl ? $slideEl.find(params.transformEl) : $slideEl;
        let $shadowEl = $shadowContainer.children(`.${shadowClass}`);
        if (!$shadowEl.length) {
            $shadowEl = dom(`<div class="swiper-slide-shadow${side ? `-${side}` : ""}"></div>`);
            $shadowContainer.append($shadowEl);
        }
        return $shadowEl;
    }
    function EffectCoverflow({swiper, extendParams, on}) {
        extendParams({
            coverflowEffect: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                scale: 1,
                modifier: 1,
                slideShadows: true,
                transformEl: null
            }
        });
        const setTranslate = () => {
            const {width: swiperWidth, height: swiperHeight, slides, slidesSizesGrid} = swiper;
            const params = swiper.params.coverflowEffect;
            const isHorizontal = swiper.isHorizontal();
            const transform = swiper.translate;
            const center = isHorizontal ? -transform + swiperWidth / 2 : -transform + swiperHeight / 2;
            const rotate = isHorizontal ? params.rotate : -params.rotate;
            const translate = params.depth;
            for (let i = 0, length = slides.length; i < length; i += 1) {
                const $slideEl = slides.eq(i);
                const slideSize = slidesSizesGrid[i];
                const slideOffset = $slideEl[0].swiperSlideOffset;
                const centerOffset = (center - slideOffset - slideSize / 2) / slideSize;
                const offsetMultiplier = "function" === typeof params.modifier ? params.modifier(centerOffset) : centerOffset * params.modifier;
                let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
                let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier;
                let translateZ = -translate * Math.abs(offsetMultiplier);
                let stretch = params.stretch;
                if ("string" === typeof stretch && -1 !== stretch.indexOf("%")) stretch = parseFloat(params.stretch) / 100 * slideSize;
                let translateY = isHorizontal ? 0 : stretch * offsetMultiplier;
                let translateX = isHorizontal ? stretch * offsetMultiplier : 0;
                let scale = 1 - (1 - params.scale) * Math.abs(offsetMultiplier);
                if (Math.abs(translateX) < .001) translateX = 0;
                if (Math.abs(translateY) < .001) translateY = 0;
                if (Math.abs(translateZ) < .001) translateZ = 0;
                if (Math.abs(rotateY) < .001) rotateY = 0;
                if (Math.abs(rotateX) < .001) rotateX = 0;
                if (Math.abs(scale) < .001) scale = 0;
                const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
                const $targetEl = effect_target_effectTarget(params, $slideEl);
                $targetEl.transform(slideTransform);
                $slideEl[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
                if (params.slideShadows) {
                    let $shadowBeforeEl = isHorizontal ? $slideEl.find(".swiper-slide-shadow-left") : $slideEl.find(".swiper-slide-shadow-top");
                    let $shadowAfterEl = isHorizontal ? $slideEl.find(".swiper-slide-shadow-right") : $slideEl.find(".swiper-slide-shadow-bottom");
                    if (0 === $shadowBeforeEl.length) $shadowBeforeEl = create_shadow_createShadow(params, $slideEl, isHorizontal ? "left" : "top");
                    if (0 === $shadowAfterEl.length) $shadowAfterEl = create_shadow_createShadow(params, $slideEl, isHorizontal ? "right" : "bottom");
                    if ($shadowBeforeEl.length) $shadowBeforeEl[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
                    if ($shadowAfterEl.length) $shadowAfterEl[0].style.opacity = -offsetMultiplier > 0 ? -offsetMultiplier : 0;
                }
            }
        };
        const setTransition = duration => {
            const {transformEl} = swiper.params.coverflowEffect;
            const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
            $transitionElements.transition(duration).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(duration);
        };
        effect_init_effectInit({
            effect: "coverflow",
            swiper,
            on,
            setTranslate,
            setTransition,
            perspective: () => true,
            overwriteParams: () => ({
                watchSlidesProgress: true
            })
        });
    }
    function initSliders() {
        if (document.querySelector(".main-block__slider")) new core(".main-block__slider", {
            modules: [ Navigation, Pagination, Parallax, EffectFade, Autoplay ],
            observer: true,
            observeParents: true,
            slidesPerView: 1,
            spaceBetween: 0,
            grabCursor: true,
            speed: 1200,
            parallax: true,
            loop: true,
            effect: "fade",
            autoplay: {
                delay: 3e3,
                disableOnInteraction: false
            },
            pagination: {
                el: ".controls-slider-main__dotts",
                clickable: true
            },
            navigation: {
                prevEl: ".slider-arrow_prev",
                nextEl: ".slider-arrow_next"
            },
            on: {}
        });
        if (document.querySelector(".surf-block__slider")) new core(".surf-block__slider", {
            modules: [ Navigation, Pagination, Parallax, EffectCoverflow ],
            observer: true,
            observeParents: true,
            slidesPerView: 3.5,
            speed: 1e3,
            effect: "coverflow",
            grabCursor: true,
            coverflowEffect: {
                rotate: 10,
                stretch: 50
            },
            loop: true,
            navigation: {
                prevEl: ".slider-arrow_prev",
                nextEl: ".slider-arrow_next"
            },
            breakpoints: {
                320: {
                    slidesPerView: 1.1,
                    spaceBetween: 0
                },
                479: {
                    slidesPerView: 1.6,
                    spaceBetween: 0
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 0
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 0
                }
            },
            on: {}
        });
        if (document.querySelector(".travel-block__slider-content")) new core(".travel-block__slider-content", {
            modules: [ Navigation, EffectFade, Parallax ],
            observer: true,
            watchOverflow: true,
            observeParents: true,
            slidesPerView: 1,
            spaceBetween: 100,
            speed: 1e3,
            loop: true,
            parallax: true,
            grabCursor: true,
            navigation: {
                prevEl: ".slider-arrow_prev",
                nextEl: ".slider-arrow_next"
            },
            on: {}
        });
        if (document.querySelector(".sleep-block__body")) new core(".sleep-block__slider-content", {
            modules: [ Navigation, EffectFade, Parallax ],
            observer: true,
            watchOverflow: true,
            observeParents: true,
            slidesPerView: 1,
            spaceBetween: 100,
            speed: 1e3,
            loop: true,
            parallax: true,
            grabCursor: true,
            navigation: {
                prevEl: " .slider-arrows-sleep_prev",
                nextEl: " .slider-arrows-sleep_next"
            },
            on: {}
        });
        if (document.querySelector(".shop-block__body")) new core(".shop-block__slider-content", {
            modules: [ Navigation, Parallax ],
            observer: true,
            watchOverflow: true,
            observeParents: true,
            slidesPerView: 1,
            spaceBetween: 20,
            speed: 1e3,
            loop: true,
            parallax: true,
            grabCursor: true,
            navigation: {
                prevEl: ".slider-arrows-shop_prev",
                nextEl: ".slider-arrows-shop_next"
            },
            on: {}
        });
    }
    window.addEventListener("load", (function(e) {
        initSliders();
    }));
    class ScrollWatcher {
        constructor(props) {
            let defaultConfig = {
                logging: true
            };
            this.config = Object.assign(defaultConfig, props);
            this.observer;
            !document.documentElement.classList.contains("watcher") ? this.scrollWatcherRun() : null;
        }
        scrollWatcherUpdate() {
            this.scrollWatcherRun();
        }
        scrollWatcherRun() {
            document.documentElement.classList.add("watcher");
            this.scrollWatcherConstructor(document.querySelectorAll("[data-watch]"));
        }
        scrollWatcherConstructor(items) {
            if (items.length) {
                this.scrollWatcherLogging(`Проснулся, слежу за объектами (${items.length})...`);
                let uniqParams = uniqArray(Array.from(items).map((function(item) {
                    return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : "0px"}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
                })));
                uniqParams.forEach((uniqParam => {
                    let uniqParamArray = uniqParam.split("|");
                    let paramsWatch = {
                        root: uniqParamArray[0],
                        margin: uniqParamArray[1],
                        threshold: uniqParamArray[2]
                    };
                    let groupItems = Array.from(items).filter((function(item) {
                        let watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null;
                        let watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : "0px";
                        let watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : 0;
                        if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) return item;
                    }));
                    let configWatcher = this.getScrollWatcherConfig(paramsWatch);
                    this.scrollWatcherInit(groupItems, configWatcher);
                }));
            } else this.scrollWatcherLogging("Сплю, нет объектов для слежения. ZzzZZzz");
        }
        getScrollWatcherConfig(paramsWatch) {
            let configWatcher = {};
            if (document.querySelector(paramsWatch.root)) configWatcher.root = document.querySelector(paramsWatch.root); else if ("null" !== paramsWatch.root) this.scrollWatcherLogging(`Эмм... родительского объекта ${paramsWatch.root} нет на странице`);
            configWatcher.rootMargin = paramsWatch.margin;
            if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) {
                this.scrollWatcherLogging(`Ой ой, настройку data-watch-margin нужно задавать в PX или %`);
                return;
            }
            if ("prx" === paramsWatch.threshold) {
                paramsWatch.threshold = [];
                for (let i = 0; i <= 1; i += .005) paramsWatch.threshold.push(i);
            } else paramsWatch.threshold = paramsWatch.threshold.split(",");
            configWatcher.threshold = paramsWatch.threshold;
            return configWatcher;
        }
        scrollWatcherCreate(configWatcher) {
            this.observer = new IntersectionObserver(((entries, observer) => {
                entries.forEach((entry => {
                    this.scrollWatcherCallback(entry, observer);
                }));
            }), configWatcher);
        }
        scrollWatcherInit(items, configWatcher) {
            this.scrollWatcherCreate(configWatcher);
            items.forEach((item => this.observer.observe(item)));
        }
        scrollWatcherIntersecting(entry, targetElement) {
            if (entry.isIntersecting) {
                !targetElement.classList.contains("_watcher-view") ? targetElement.classList.add("_watcher-view") : null;
                this.scrollWatcherLogging(`Я вижу ${targetElement.classList}, добавил класс _watcher-view`);
            } else {
                targetElement.classList.contains("_watcher-view") ? targetElement.classList.remove("_watcher-view") : null;
                this.scrollWatcherLogging(`Я не вижу ${targetElement.classList}, убрал класс _watcher-view`);
            }
        }
        scrollWatcherOff(targetElement, observer) {
            observer.unobserve(targetElement);
            this.scrollWatcherLogging(`Я перестал следить за ${targetElement.classList}`);
        }
        scrollWatcherLogging(message) {
            this.config.logging ? functions_FLS(`[Наблюдатель]: ${message}`) : null;
        }
        scrollWatcherCallback(entry, observer) {
            const targetElement = entry.target;
            this.scrollWatcherIntersecting(entry, targetElement);
            targetElement.hasAttribute("data-watch-once") && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
            document.dispatchEvent(new CustomEvent("watcherCallback", {
                detail: {
                    entry
                }
            }));
        }
    }
    modules_flsModules.watcher = new ScrollWatcher({});
    let addWindowScrollEvent = false;
    function pageNavigation() {
        document.addEventListener("click", pageNavigationAction);
        document.addEventListener("watcherCallback", pageNavigationAction);
        function pageNavigationAction(e) {
            if ("click" === e.type) {
                const targetElement = e.target;
                if (targetElement.closest("[data-goto]")) {
                    const gotoLink = targetElement.closest("[data-goto]");
                    const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : "";
                    const noHeader = gotoLink.hasAttribute("data-goto-header") ? true : false;
                    const gotoSpeed = gotoLink.dataset.gotoSpeed ? gotoLink.dataset.gotoSpeed : 500;
                    const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;
                    gotoblock_gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
                    e.preventDefault();
                }
            } else if ("watcherCallback" === e.type && e.detail) {
                const entry = e.detail.entry;
                const targetElement = entry.target;
                if ("navigator" === targetElement.dataset.watch) {
                    document.querySelector(`[data-goto]._navigator-active`);
                    let navigatorCurrentItem;
                    if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`); else if (targetElement.classList.length) for (let index = 0; index < targetElement.classList.length; index++) {
                        const element = targetElement.classList[index];
                        if (document.querySelector(`[data-goto=".${element}"]`)) {
                            navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`);
                            break;
                        }
                    }
                    if (entry.isIntersecting) navigatorCurrentItem ? navigatorCurrentItem.classList.add("_navigator-active") : null; else navigatorCurrentItem ? navigatorCurrentItem.classList.remove("_navigator-active") : null;
                }
            }
        }
        if (getHash()) {
            let goToHash;
            if (document.querySelector(`#${getHash()}`)) goToHash = `#${getHash()}`; else if (document.querySelector(`.${getHash()}`)) goToHash = `.${getHash()}`;
            goToHash ? gotoblock_gotoBlock(goToHash, true, 500, 20) : null;
        }
    }
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    const btnSearch = document.querySelector(".search-form__icon");
    btnSearch.addEventListener("click", (() => {
        btnSearch.parentNode.classList.toggle("active");
    }));
    window["FLS"] = false;
    isWebp();
    menuInit();
    formFieldsInit({
        viewPass: false,
        autoHeight: false
    });
    formRating();
    pageNavigation();
})();