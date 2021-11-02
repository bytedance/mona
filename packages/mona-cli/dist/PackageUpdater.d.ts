export default class PackageUpdater {
    private _incompatible;
    private _currentVersion;
    private _newestVersion;
    constructor();
    start(): void;
    check(): void;
    update(): void;
    render(): string;
    generateUpdateCmd(): string;
}
