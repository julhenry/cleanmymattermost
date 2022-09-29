import React, { ReactNode } from 'react';
import './Step.css'

export interface StepProps {
    currentStep: number,
    finalStep: number,
    children: ReactNode,
}
export const Step: React.FC<StepProps> = ({currentStep, finalStep, children}) =>
    <div className={'Step form-items'}>
        <h3 className='title'>Step {currentStep}/{finalStep}</h3>
        <div>
            {children}
        </div>
    </div>