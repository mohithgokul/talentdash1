"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeBigInt = serializeBigInt;
/** Serialize BigInt fields to string for JSON responses */
function serializeBigInt(obj) {
    return JSON.parse(JSON.stringify(obj, (_key, value) => typeof value === 'bigint' ? value.toString() : value));
}
//# sourceMappingURL=serialize.js.map