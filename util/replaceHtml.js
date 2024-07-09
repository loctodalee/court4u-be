"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replacePlaceholder = void 0;
const replacePlaceholder = (template, params) => {
    Object.keys(params).forEach((key) => {
        const placeholder = `{{${key}}}`;
        template = template.replace(new RegExp(placeholder, 'g'), params[key]);
    });
    return template;
};
exports.replacePlaceholder = replacePlaceholder;
