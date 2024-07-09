"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMidnight = void 0;
const toMidnight = (date) => {
    const d = new Date(date);
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
};
exports.toMidnight = toMidnight;
