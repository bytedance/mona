export function formatPath(url) {
    return /^\//.test(url) ? url.toLowerCase() : "/" + url.toLowerCase();
}
//# sourceMappingURL=formatPath.js.map