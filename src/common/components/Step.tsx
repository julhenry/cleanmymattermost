import React, { ReactNode } from 'react';
import './Step.css'

export interface StepProps {
    title: string,
    currentStep: number,
    finalStep: number,
    children: ReactNode,
}
export const Step: React.FC<StepProps> = (props) =>
    <div className="Step form-items">
        <h3 className='title'>Step {props.currentStep}/{props.finalStep}</h3>
        <div>
            {props.children}
        </div>
    </div>