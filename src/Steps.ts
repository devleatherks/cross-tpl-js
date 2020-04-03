'use strict'
const Steps = require('cli-step');

/**
 * Raw steps are used when user want to disable all animations.
 * @class RawStep
 */
class RawStep {
    stepCounter: any
    helpText: any
    text: any
    total: any
    constructor(total: number, counter: number, text: string, helpText: string) {
        this.total = total
        this.stepCounter = counter
        this.text = text
        this.helpText = helpText || ''
    }

    /**
     * Start step
     * 
     * @method start
     * @chainable
     */
    public start() {
        console.log(`Step ${this.stepCounter}/${this.total}`)
        console.log(`  ├── ${this.text} (${this.helpText})`)
        return this
    }

    /**
     * Mark step as successful
     *
     * @method success
     * @param  {String} text
     * @return {void}
     */
    public success(text: string) {
        console.log(`  ├── SUCCESS: ${text || this.text} (${this.helpText})`)
    }

    /**
     * Mark step as errored
     *
     * @method error
     * @param  {String} text
     * @return {void}
     */
    public error(text: string) {
        console.log(`  ├── ERROR: ${text || this.text} (${this.helpText})`)
    }
}

/**
 * Raw steps is a collection of Raw step. The API has to be
 * compatible with `cli-step`.
 *
 * @class RawSteps
 */
class RawSteps {
    total: number
    counter: number = 0;
    constructor(total: number) {
        this.total = total;
    }

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
    public advance(text: string, helpText: string): RawStep {
        this.counter++
        return new RawStep(this.total, this.counter, text, helpText)
    }
}

export { RawSteps, Steps, RawStep }
