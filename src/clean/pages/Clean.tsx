import React, { useState } from 'react';
import { Step } from '../../common/components/Step';

const NB_STEPS = 5
export const Clean: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1)
    const [url, setUrl] = useState('')

    const next = () => {
        setCurrentStep(currentStep+1)
    }
    const previous = () => {
        setCurrentStep(currentStep-1)
    }
    return <div className='Clean'>
        {{
          1: <Step key={1} currentStep={1} finalStep={NB_STEPS}>
                <p>A deleted message is not permanently deleted from the database. That's why we recommend you to use
                CleanMyMattermost to bulk edit your posts.</p>
                <p>What's your Mattermost URL ?</p>
                  <input id="url" className="form-control" type="text" name="mattermost-url" onChange={e => setUrl(e.target.value)}
                    value={url} placeholder="URL (ex: https://mattermost.monentreprise.com/api/v4/)" required/>
                  <div className="valid-feedback">Valid URL</div>
                  <div className="invalid-feedback">Invalid URL</div>
                  <div className="form-button mt-5">
                    <button onClick={next} type="submit" className="btn btn-primary next-step-button">Next step</button>
                    <div className="spinner-border invisible" role="status"></div>
                  </div>
            </Step>,
          2: <Step key={2} currentStep={2} finalStep={NB_STEPS}>
                <button onClick={previous}>Previous</button>
                <button onClick={next}>Next</button>
                coucou
            </Step>,
          3: <Step key={3} currentStep={3} finalStep={NB_STEPS}>
                <button onClick={previous}>Previous</button>
                <button onClick={next}>Next</button>
                coucou
            </Step>,
          4: <Step key={4} currentStep={4} finalStep={NB_STEPS}>
                <button onClick={previous}>Previous</button>
                <button onClick={next}>Next</button>
                coucou
            </Step>,
          5: <Step key={5} currentStep={5} finalStep={NB_STEPS}>
                <button onClick={previous}>Previous</button>
                <button onClick={next}>Next</button>
                coucou
            </Step>,
        }[currentStep] 
        }
    </div>
}
