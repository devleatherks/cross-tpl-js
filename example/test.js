const Steps = require('cli-step')
 
const totalNumberOfSteps = 4
const steps = new Steps(totalNumberOfSteps)
 
const step1 = steps.advance('Linting...', null, 'npm run lint')
 
step1.start() // start the animation
 
try {
 // perform task
 
 step1.success('Successfully linted', 'white_check_mark')
} catch (error) {
  step1.error('Unable to lint', 'x')
}