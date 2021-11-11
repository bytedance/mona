export declare class VirtualStats {
    [key: string]: any;
    /**
     * Create a new stats object.
     *
     * @param config Stats properties.
     */
    constructor(config: any);
    /**
     * Check if mode indicates property.
     */
    private _checkModeProperty;
    isDirectory(): boolean;
    isFile(): boolean;
    isBlockDevice(): boolean;
    isCharacterDevice(): boolean;
    isSymbolicLink(): boolean;
    isFIFO(): boolean;
    isSocket(): boolean;
}
