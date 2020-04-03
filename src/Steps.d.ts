declare const Steps: any;
/**
 * Raw steps are used when user want to disable all animations.
 * @class RawStep
 */
declare class RawStep {
    stepCounter: any;
    helpText: any;
    text: any;
    total: any;
    constructor(total: number, counter: number, text: string, helpText: string);
    /**
     * Start step
     *
     * @method start
     * @chainable
     */
    start(): this;
    /**
     * Mark step as successful
     *
     * @method success
     * @param  {String} text
     * @return {void}
     */
    success(text: string): void;
    /**
     * Mark step as errored
     *
     * @method error
     * @param  {String} text
     * @return {void}
     */
    error(text: string): void;
}
/**
 * Raw steps is a collection of Raw step. The API has to be
 * compatible with `cli-step`.
 *
 * @class RawSteps
 */
declare class RawSteps {
    total: number;
    counter: number;
    constructor(total: number);
    /**
     * Move to next step. Also the icon param is swalled, since raw output
     * doesn't display emojis.
     *
     * @method advance
     *
     * @param  {String} text
     * @param  {String} icon
     * @param  {String} helpText
     *
     * @return {RawStep}
     */
    advance(text: string, helpText: string): RawStep;
}
export { RawSteps, Steps, RawStep };
