import React, { ReactNode } from 'react';

export interface StepProps {
    title: string,
    currentStep: number,
    finalStep: number,
    children: ReactNode,
}
export const Step: React.FC<StepProps> = (props) =>
    <div className="step">
        <h3>Step {props.currentStep}/{props.finalStep}</h3>
        <div>
            {props.children}
        </div>
    </div>