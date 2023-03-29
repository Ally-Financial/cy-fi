/*
 * Copyright 2022 Ally Financial, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

var css_properties = {
    "align-content": {
        "initial": "stretch",
        "values": [
            "stretch",
            "center",
            "flex-start",
            "flex-end",
            "space-between",
            "space-around",
            "initial",
            "inherit"
        ]
    },
    "align-items": {
        "initial": "stretch",
        "values": [
            "stretch",
            "center",
            "flex-start",
            "flex-end",
            "baseline",
            "initial",
            "inherit"
        ]
    },
    "align-self": {
        "initial": "auto",
        "values": [
            "auto",
            "stretch",
            "center",
            "flex-start",
            "flex-end",
            "baseline",
            "initial",
            "inherit"
        ]
    },
    "all": {
        "initial": "none",
        "values": [
            "initial",
            "inherit",
            "unset"
        ]
    },
    "animation": {
        "initial": ""
    },
    "animation-delay": {
        "initial": "0s"
    },
    "animation-direction": {
        "initial": "normal",
        "values": [
            "normal",
            "reverse",
            "alternate",
            "alternate-reverse",
            "initial",
            "inherit"
        ]
    },
    "animation-duration": {
        "initial": "0"
    },
    "animation-fill-mode": {
        "initial": "none",
        "values": [
            "none",
            "forwards",
            "backwards",
            "both",
            "initial",
            "inherit"
        ]
    },
    "animation-iteration-count": {
        "initial": "1"
    },
    "animation-name": {
        "initial": "none"
    },
    "animation-play-state": {
        "initial": "running",
        "values": [
            "paused",
            "running",
            "initial",
            "inherit"
        ]
    },
    "animation-timing-function": {
        "initial": "ease",
        "values": [
            "linear",
            "ease",
            "ease-in",
            "ease-out",
            "ease-in-out",
            "step-start",
            "step-end",
            "cubic-bezier",
            "initial",
            "inherit"
        ]
    },
    "backface-visibility": {
        "initial": "visible",
        "values": [
            "visible",
            "hidden",
            "initial",
            "inherit"
        ]
    },
    "background": {
        "initial": ""
    },
    "background-attachment": {
        "initial": "scroll",
        "values": [
            "scroll",
            "fixed",
            "local",
            "initial",
            "inherit"
        ]
    },
    "background-blend-mode": {
        "initial": "normal",
        "values": [
            "normal",
            "multiply",
            "screen",
            "overlay",
            "darken",
            "lighten",
            "color-dodge",
            "saturation",
            "luminosity"
        ]
    },
    "background-clip": {
        "initial": "border-box",
        "values": [
            "border-box",
            "padding-box",
            "content-box",
            "initial",
            "inherit"
        ]
    },
    "background-color": {
        "initial": "transparent"
    },
    "background-image": {
        "initial": "none"
    },
    "background-origin": {
        "initial": "padding-box",
        "values": [
            "padding-box",
            "border-box",
            "content-box",
            "initial",
            "inherit"
        ]
    },
    "background-position": {
        "initial": "0% 0%"
    },
    "background-repeat": {
        "initial": "repeat",
        "values": [
            "repeat",
            "repeat-x",
            "repeat-y",
            "no-repeat",
            "space",
            "round",
            "initial",
            "inherit"
        ]
    },
    "background-size": {
        "initial": "auto"
    },
    "border": {
        "initial": "1px none #ffff"
    },
    "border-bottom": {
        "initial": "1px none #ffff"
    },
    "border-bottom-color": {
        "initial": ""
    },
    "border-bottom-left-radius": {
        "initial": "0"
    },
    "border-bottom-right-radius": {
        "initial": "0"
    },
    "border-bottom-style": {
        "initial": "none",
        "values": [
            "none",
            "hidden",
            "dotted",
            "dashed",
            "solid",
            "double",
            "groove",
            "ridge",
            "inset",
            "outset",
            "initial",
            "inherit"
        ]
    },
    "border-bottom-width": {
        "initial": "0"
    },
    "border-collapse": {
        "initial": "separate",
        "values": [
            "separate",
            "collapse",
            "initial",
            "inherit"
        ]
    },
    "border-color": {
        "initial": ""
    },
    "border-image": {
        "initial": ""
    },
    "border-image-outset": {
        "initial": "0"
    },
    "border-image-repeat": {
        "initial": "stretch",
        "values": [
            "stretch",
            "repeat",
            "round",
            "space",
            "initial",
            "inherit"
        ]
    },
    "border-image-slice": {
        "initial": "100%"
    },
    "border-image-source": {
        "initial": "none",
        "values": [
            "none",
            "image",
            "initial",
            "inherit"
        ]
    },
    "border-image-width": {
        "initial": "1"
    },
    "border-left": {
        "initial": "1px none #ffff"
    },
    "border-left-color": {
        "initial": ""
    },
    "border-left-style": {
        "initial": "none",
        "values": [
            "none",
            "hidden",
            "dotted",
            "dashed",
            "solid",
            "double",
            "groove",
            "ridge",
            "inset",
            "outset",
            "initial",
            "inherit"
        ]
    },
    "border-left-width": {
        "initial": "0"
    },
    "border-radius": {
        "initial": "0"
    },
    "border-right": {
        "initial": "1px none #ffff"
    },
    "border-right-color": {
        "initial": ""
    },
    "border-right-style": {
        "initial": "none",
        "values": [
            "none",
            "hidden",
            "dotted",
            "dashed",
            "solid",
            "double",
            "groove",
            "ridge",
            "inset",
            "outset",
            "initial",
            "inherit"
        ]
    },
    "border-right-width": {
        "initial": "0"
    },
    "border-spacing": {
        "initial": "0px"
    },
    "border-style": {
        "initial": "none",
        "values": [
            "none",
            "hidden",
            "dotted",
            "dashed",
            "solid",
            "double",
            "groove",
            "ridge",
            "inset",
            "outset",
            "initial",
            "inherit"
        ]
    },
    "border-top": {
        "initial": "1px none #ffff"
    },
    "border-top-color": {
        "initial": ""
    },
    "border-top-left-radius": {
        "initial": "0"
    },
    "border-top-right-radius": {
        "initial": "0"
    },
    "border-top-style": {
        "initial": "none",
        "values": [
            "none",
            "hidden",
            "dotted",
            "dashed",
            "solid",
            "double",
            "groove",
            "ridge",
            "inset",
            "outset",
            "initial",
            "inherit"
        ]
    },
    "border-top-width": {
        "initial": "0"
    },
    "border-width": {
        "initial": "0"
    },
    "bottom": {
        "initial": "0"
    },
    "box-decoration-break": {
        "initial": "slice",
        "values": [
            "slice",
            "clone",
            "initial",
            "inherit"
        ]
    },
    "box-shadow": {
        "initial": "none"
    },
    "box-sizing": {
        "initial": "content-box",
        "values": [
            "content-box",
            "border-box",
            "initial",
            "inherit"
        ]
    },
    "caption-side": {
        "initial": "top",
        "values": [
            "top",
            "bottom",
            "initial",
            "inherit"
        ]
    },
    "caret-color": {
        "initial": "auto"
    },
    "clear": {
        "initial": "none",
        "values": [
            "none",
            "left",
            "right",
            "both",
            "initial",
            "inherit"
        ]
    },
    "clip": {
        "initial": "auto",
        "values": [
            "auto",
            "shape",
            "initial",
            "inherit"
        ]
    },
    "color": {
        "initial": ""
    },
    "column-count": {
        "initial": "0"
    },
    "column-fill": {
        "initial": "balance",
        "values": [
            "balance",
            "auto",
            "initial",
            "inherit"
        ]
    },
    "column-gap": {
        "initial": "normal"
    },
    "column-rule": {
        "initial": "1px none #ffff"
    },
    "column-rule-color": {
        "initial": ""
    },
    "column-rule-style": {
        "initial": "none",
        "values": [
            "none",
            "hidden",
            "dotted",
            "dashed",
            "solid",
            "double",
            "groove",
            "ridge",
            "inset",
            "outset",
            "initial",
            "inherit"
        ]
    },
    "column-rule-width": {
        "initial": "medium"
    },
    "column-span": {
        "initial": "none",
        "values": [
            "none",
            "all",
            "initial",
            "inherit"
        ]
    },
    "column-width": {
        "initial": "auto"
    },
    "columns": {
        "initial": "auto auto"
    },
    "content": {
        "initial": "",
    },
    "counter-increment": {
        "initial": "none"
    },
    "counter-reset": {
        "initial": "none"
    },
    "cursor": {
        "initial": "auto",
        "values": [
            "alias",
            "all-scroll",
            "auto",
            "cell",
            "context-menu",
            "col-resize",
            "copy",
            "crosshair",
            "default",
            "e-resize",
            "ew-resize",
            "grab",
            "grabbing",
            "help",
            "move",
            "n-resize",
            "ne-resize",
            "nesw-resize",
            "ns-resize",
            "nw-resize",
            "nwse-resize",
            "no-drop",
            "none",
            "not-allowed",
            "pointer",
            "progress",
            "row-resize",
            "s-resize",
            "se-resize",
            "sw-resize",
            "text",
            "URL",
            "vertical-text",
            "w-resize",
            "wait",
            "zoom-in",
            "zoom-out",
            "initial",
            "inherit"
        ]
    },
    "direction": {
        "initial": "ltr",
        "values": [
            "ltr",
            "rtl",
            "initial",
            "inherit"
        ]
    },
    "display": {
        "initial": "",
        "values": [
            "inline",
            "block",
            "contents",
            "flex",
            "grid",
            "inline-block",
            "inline-flex",
            "inline-grid",
            "inline-table",
            "list-item",
            "run-in",
            "table",
            "table-caption",
            "table-column-group",
            "table-header-group",
            "table-footer-group",
            "table-row-group",
            "table-cell",
            "table-column",
            "table-row",
            "none",
            "initial",
            "inherit"
        ]
    },
    "empty-cells": {
        "initial": "show",
        "values": [
            "show",
            "hide",
            "initial",
            "inherit"
        ]
    },
    "filter": {
        "initial": "none"
    },
    "flex": {
        "initial": "0 1 auto"
    },
    "flex-basis": {
        "initial": "auto"
    },
    "flex-direction": {
        "initial": "row",
        "values": [
            "row",
            "row-reverse",
            "column",
            "column-reverse",
            "initial",
            "inherit"
        ]
    },
    "flex-flow": {
        "initial": "row nowrap",
        "values": [
            "flex-direction",
            "flex-wrap",
            "initial",
            "inherit"
        ]
    },
    "flex-grow": {
        "initial": "0"
    },
    "flex-shrink": {
        "initial": "1"
    },
    "flex-wrap": {
        "initial": "nowrap",
        "values": [
            "nowrap",
            "wrap",
            "wrap-reverse",
            "initial",
            "inherit"
        ]
    },
    "float": {
        "initial": "none",
        "values": [
            "none",
            "left",
            "right",
            "initial",
            "inherit"
        ]
    },
    "font": {
        "initial": ""
    },
    "font-family": {
        "initial": ""
    },
    "font-kerning": {
        "initial": "auto",
        "values": [
            "auto",
            "normal",
            "none"
        ]
    },
    "font-size": {
        "initial": "medium"
    },
    "font-size-adjust": {
        "initial": "none"
    },
    "font-stretch": {
        "initial": "normal",
        "values": [
            "ultra-condensed",
            "extra-condensed",
            "condensed",
            "semi-condensed",
            "normal",
            "semi-expanded",
            "expanded",
            "extra-expanded",
            "ultra-expanded",
            "initial",
            "inherit"
        ]
    },
    "font-style": {
        "initial": "normal",
        "values": [
            "normal",
            "italic",
            "oblique",
            "initial",
            "inherit"
        ]
    },
    "font-variant": {
        "initial": "normal",
        "values": [
            "normal",
            "small-caps",
            "initial",
            "inherit"
        ]
    },
    "font-weight": {
        "initial": "normal",
        "values": [
            "normal",
            "bold",
            "bolder",
            "lighter",
            "100",
            "200",
            "300",
            "400",
            "500",
            "600",
            "700",
            "800",
            "900",
            "initial",
            "inherit"
        ]
    },
    "grid": {
        "initial": "none none none auto auto row"
    },
    "grid-area": {
        "initial": "auto / auto / auto / auto"
    },
    "grid-auto-columns": {
        "initial": "auto"
    },
    "grid-auto-flow": {
        "initial": "row",
        "values": [
            "row",
            "column",
            "dense",
            "row dense",
            "column dense"
        ]
    },
    "grid-auto-rows": {
        "initial": "auto"
    },
    "grid-column": {
        "initial": "auto / auto"
    },
    "grid-column-end": {
        "initial": "auto"
    },
    "grid-column-gap": {
        "initial": "0"
    },
    "grid-column-start": {
        "initial": "auto"
    },
    "grid-gap": {
        "initial": "0 0"
    },
    "grid-row": {
        "initial": "auto / auto"
    },
    "grid-row-end": {
        "initial": "auto"
    },
    "grid-row-gap": {
        "initial": "0"
    },
    "grid-row-start": {
        "initial": "auto",
        "values": [
            "auto",
            "row-line"
        ]
    },
    "grid-template": {
        "initial": "none none none"
    },
    "grid-template-areas": {
        "initial": "none"
    },
    "grid-template-columns": {
        "initial": "none"
    },
    "grid-template-rows": {
        "initial": "none"
    },
    "hanging-punctuation": {
        "initial": "none",
        "values": [
            "none",
            "first",
            "last",
            "allow-end",
            "force-end",
            "initial",
            "inherit"
        ]
    },
    "height": {
        "initial": "auto"
    },
    "hyphens": {
        "initial": "manual",
        "values": [
            "none",
            "manual",
            "auto",
            "initial",
            "inherit"
        ]
    },
    "isolation": {
        "initial": "auto",
        "values": [
            "auto",
            "isolate",
            "initial",
            "inherit"
        ]
    },
    "justify-content": {
        "initial": "flex-start",
        "values": [
            "flex-start",
            "flex-end",
            "center",
            "space-between",
            "space-around",
            "initial",
            "inherit"
        ]
    },
    "left": {
        "initial": "auto"
    },
    "letter-spacing": {
        "initial": "normal"
    },
    "line-height": {
        "initial": "normal"
    },
    "list-style": {
        "initial": "disc outside none"
    },
    "list-style-image": {
        "initial": "none",
        "values": [
            "none",
            "url",
            "initial",
            "inherit"
        ]
    },
    "list-style-position": {
        "initial": "outside",
        "values": [
            "inside",
            "outside",
            "initial",
            "inherit"
        ]
    },
    "list-style-type": {
        "initial": "disc",
        "values": [
            "disc",
            "armenian",
            "circle",
            "cjk-ideographic",
            "decimal",
            "decimal-leading-zero",
            "georgian",
            "hebrew",
            "hiragana",
            "hiragana-iroha",
            "katakana",
            "katakana-iroha",
            "lower-alpha",
            "lower-greek",
            "lower-latin",
            "lower-roman",
            "none",
            "square",
            "upper-alpha",
            "upper-greek",
            "upper-latin",
            "upper-roman",
            "initial",
            "inherit"
        ]
    },
    "margin": {
        "initial": "0"
    },
    "margin-bottom": {
        "initial": "0"
    },
    "margin-left": {
        "initial": "0"
    },
    "margin-right": {
        "initial": "0"
    },
    "margin-top": {
        "initial": "0"
    },
    "max-height": {
        "initial": "none"
    },
    "max-width": {
        "initial": "none"
    },
    "min-height": {
        "initial": "0"
    },
    "min-width": {
        "initial": "0"
    },
    "mix-blend-mode": {
        "initial": "normal"
    },
    "object-fit": {
        "initial": "none",
        "values": [
            "fill",
            "contain",
            "cover",
            "none",
            "scale-down",
            "initial",
            "inherit"
        ]
    },
    "object-position": {
        "initial": "50% 50%"
    },
    "opacity": {
        "initial": "1"
    },
    "order": {
        "initial": "0"
    },
    "outline": {
        "initial": "medium invert color"
    },
    "outline-color": {
        "initial": "invert"
    },
    "outline-offset": {
        "initial": "0"
    },
    "outline-style": {
        "initial": "none",
        "values": [
            "none",
            "hidden",
            "dotted",
            "dashed",
            "solid",
            "double",
            "groove",
            "ridge",
            "inset",
            "outset",
            "initial",
            "inherit"
        ]
    },
    "outline-width": {
        "initial": "medium"
    },
    "overflow": {
        "initial": "visible",
        "values": [
            "visible",
            "hidden",
            "scroll",
            "auto",
            "initial",
            "inherit"
        ]
    },
    "overflow-x": {
        "initial": "visible",
        "values": [
            "visible",
            "hidden",
            "scroll",
            "auto",
            "initial",
            "inherit"
        ]
    },
    "overflow-y": {
        "initial": "visible",
        "values": [
            "visible",
            "hidden",
            "scroll",
            "auto",
            "initial",
            "inherit"
        ]
    },
    "padding": {
        "initial": "0"
    },
    "padding-bottom": {
        "initial": "0"
    },
    "padding-left": {
        "initial": "0"
    },
    "padding-right": {
        "initial": "0"
    },
    "padding-top": {
        "initial": "0"
    },
    "page-break-after": {
        "initial": "auto",
        "values": [
            "auto",
            "always",
            "avoid",
            "left",
            "right",
            "initial",
            "inherit"
        ]
    },
    "page-break-before": {
        "initial": "auto",
        "values": [
            "auto",
            "always",
            "avoid",
            "left",
            "right",
            "initial",
            "inherit"
        ]
    },
    "page-break-inside": {
        "initial": "auto",
        "values": [
            "auto",
            "avoid",
            "initial",
            "inherit"
        ]
    },
    "perspective": {
        "initial": "none",
        "values": [
            "[length]",
            "none",
            "initial",
            "inherit"
        ]
    },
    "perspective-origin": {
        "initial": "50% 50%"
    },
    "pointer-events": {
        "initial": "auto",
        "values": [
            "auto",
            "none",
            "initial",
            "inherit"
        ]
    },
    "position": {
        "initial": "static",
        "values": [
            "static",
            "absolute",
            "fixed",
            "relative",
            "sticky",
            "initial",
            "inherit"
        ]
    },
    "quotes": {
        "initial": ""
    },
    "resize": {
        "initial": "none",
        "values": [
            "none",
            "both",
            "horizontal",
            "vertical",
            "initial",
            "inherit"
        ]
    },
    "right": {
        "initial": "auto"
    },
    "scroll-behavior": {
        "initial": "auto",
        "values": [
            "auto",
            "smooth",
            "initial",
            "inherit"
        ]
    },
    "tab-size": {
        "initial": "8"
    },
    "table-layout": {
        "initial": "auto",
        "values": [
            "auto",
            "fixed",
            "initial",
            "inherit"
        ]
    },
    "text-align": {
        "initial": "left",
        "values": [
            "left",
            "right",
            "center",
            "justify",
            "initial",
            "inherit"
        ]
    },
    "text-align-last": {
        "initial": "auto",
        "values": [
            "auto",
            "left",
            "right",
            "center",
            "justify",
            "start",
            "end",
            "initial",
            "inherit"
        ]
    },
    "text-decoration": {
        "initial": ""
    },
    "text-decoration-color": {
        "initial": "currentColor"
    },
    "text-decoration-line": {
        "initial": "none",
        "values": [
            "none",
            "underline",
            "overline",
            "line-through",
            "initial",
            "inherit"
        ]
    },
    "text-decoration-style": {
        "initial": "solid",
        "values": [
            "solid",
            "double",
            "dotted",
            "dashed",
            "wavy",
            "initial",
            "inherit"
        ]
    },
    "text-indent": {
        "initial": "0"
    },
    "text-justify": {
        "initial": "auto",
        "values": [
            "auto",
            "inter-word",
            "inter-character",
            "none",
            "initial",
            "inherit"
        ]
    },
    "text-overflow": {
        "initial": "clip",
        "values": [
            "clip",
            "ellipsis",
            "string",
            "initial",
            "inherit"
        ]
    },
    "text-shadow": {
        "initial": "none"
    },
    "text-transform": {
        "initial": "none",
        "values": [
            "none",
            "capitalize",
            "uppercase",
            "lowercase",
            "initial",
            "inherit"
        ]
    },
    "top": {
        "initial": "auto"
    },
    "transform(2D)": {
        "initial": "none"
    },
    "transform-origin(two-value syntax)": {
        "initial": "50% 50% 0"
    },
    "transform-style": {
        "initial": "flat",
        "values": [
            "flat",
            "preserve-3d",
            "initial",
            "inherit"
        ]
    },
    "transition": {
        "initial": "all 0s ease 0s"
    },
    "transition-delay": {
        "initial": "0s"
    },
    "transition-duration": {
        "initial": "0s"
    },
    "transition-property": {
        "initial": "all",
        "values": [
            "none",
            "all",
            "property",
            "initial",
            "inherit"
        ]
    },
    "transition-timing-function": {
        "initial": "ease"
    },
    "unicode-bidi": {
        "initial": "normal",
        "values": [
            "normal",
            "embed",
            "bidi-override",
            "isolate",
            "isolate-override",
            "plaintext",
            "initial",
            "inherit"
        ]
    },
    "user-select": {
        "initial": "auto",
        "values": [
            "auto",
            "none",
            "text",
            "all"
        ]
    },
    "vertical-align": {
        "initial": "baseline"
    },
    "visibility": {
        "initial": "visible",
        "values": [
            "visible",
            "hidden",
            "collapse",
            "initial",
            "inherit"
        ]
    },
    "white-space": {
        "initial": "normal",
        "values": [
            "normal",
            "nowrap",
            "pre",
            "pre-line",
            "pre-wrap",
            "initial",
            "inherit"
        ]
    },
    "width": {
        "initial": "auto"
    },
    "word-break": {
        "initial": "normal",
        "values": [
            "normal",
            "break-all",
            "keep-all",
            "break-word",
            "initial",
            "inherit"
        ]
    },
    "word-spacing": {
        "initial": "normal"
    },
    "word-wrap": {
        "initial": "normal",
        "values": [
            "normal",
            "break-word",
            "initial",
            "inherit"
        ]
    },
    "writing-mode": {
        "initial": "horizontal-tb",
        "values": [
            "horizontal-tb",
            "vertical-rl",
            "vertical-lr"
        ]
    },
    "z-index": {
        "initial": "auto"
    }
}