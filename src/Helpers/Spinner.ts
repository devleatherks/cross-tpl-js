import * as Ora from 'ora';

export class Spinner {
    private prefix: string = new String().toString();
    private spinner: Ora.Ora;

    public constructor(prefix: string) {
        this.prefix = '[' + prefix + ']';
        this.spinner = Ora('Start ' + this.prefix).start();
    }

    public start(prefix: string) {
        this.prefix = '[' + prefix + ']';
        this.spinner = Ora('Start ' + this.prefix).start();
        return this;
    } 
    
    public text(text: string) {
        this.spinner.text = this.prefix + ' ' + text;
        return this;
    } 
    
    public succeed(text: string) {
        this.spinner.succeed(this.prefix + ' ' + text);
        return this;
    }
    
    public clear() {
        this.spinner.clear();
    }
    
    public stop() {
        this.spinner.stop();
        return this;
    }
}