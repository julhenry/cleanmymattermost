import React from 'react';
import { Step } from '../../common/Step';

export const Clean: React.FC = () =>
    <div className='clean'>
        <div className="form-body">
            <div className="row">
                <Step currentStep={1} finalStep={5} title='URL'>
                    coucou
                </Step>
            </div>
        </div>
    </div>