/* @flow */
/** @jsx node */
import { LOGO_CLASS, PPLogo } from '@paypal/sdk-logos/src';
import { node, Fragment, type ChildType } from 'jsx-pragmatic/src';

import { CLASS } from '../../../constants';
import { BUTTON_SIZE_STYLE } from '../config';

import type { ButtonAnimationOutputParams, LabelOptions, AnimationProps } from './types';

export const ANIMATION = {
    LABEL_CONTAINER: ('switch-logo-show-label-animation-container' : 'switch-logo-show-label-animation-container'),
    CONTAINER:       ('switch-logo-show-label-animation' : 'switch-logo-show-label-animation')
};

export function AnimationComponent({ animationLabelText, logoColor } : LabelOptions) : ChildType {
    // experimentName must match elmo experiment name
    const config = {
        labelText:      animationLabelText,
        labelClass:     ANIMATION.LABEL_CONTAINER,
        experimentName: 'Varied_Button_Design'
    };
    return (
        <Fragment>
            <PPLogo logoColor={ logoColor } />
            <div class={ config.labelClass } data-animation-experiment={ config.experimentName }> <span>{config.labelText}</span></div>
            <style innerHTML={ `
                .${ CLASS.DOM_READY } .${ ANIMATION.CONTAINER } img.${ LOGO_CLASS.LOGO }-paypal{
                    position: relative;
                }
                
                .${ CLASS.DOM_READY } .${ ANIMATION.CONTAINER } img.${ LOGO_CLASS.LOGO }-pp{
                    position: fixed;
                    opacity: 0;
                }
                
                .${ ANIMATION.CONTAINER } .${ ANIMATION.LABEL_CONTAINER } {
                    position: fixed;
                    opacity: 0; 
                    color: #142C8E;
                    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                    padding-top: 1px;
                }
            ` } />;
        </Fragment>
    );
}

// Returns label container if the button sizes match
const getAnimationProps = function(document, configuration) : AnimationProps | null {
    let labelFontSize = 8;
    const { ANIMATION_CONTAINER, ANIMATION_LABEL_CONTAINER, PAYPAL_BUTTON_LABEL, PAYPAL_LOGO } = configuration.cssClasses;
    const { tiny, small, medium } = configuration;
    // get the animation main container to force specificity( in css ) and make sure we are running the right animation
    const animationContainer = (document && document.querySelector(`.${ ANIMATION_CONTAINER }`)) || null;
    if (!animationContainer) {
        return null;
    }

    // return null if animation should not be played for the button size
    const animationContainerWidth = animationContainer.offsetWidth;
    if (animationContainerWidth < tiny.min || animationContainerWidth >= medium.max) {
        // remove label element from dom
        animationContainer.querySelector(`.${ ANIMATION_LABEL_CONTAINER }`).remove();
        return null;
    }

    if (animationContainerWidth >= small.max) {
        labelFontSize = 11;
    }

    // get the label container that animation will be applied to
    const paypalLabelContainerElement = animationContainer.querySelector(`.${ PAYPAL_BUTTON_LABEL }`) || null;
    // get starting position for element so it doesn't jump when animation begins
    const paypalLogoElement = (paypalLabelContainerElement && paypalLabelContainerElement.querySelector(`.${ PAYPAL_LOGO }`)) || null;
    const paypalLogoStartingLeftPosition = paypalLogoElement
        ? `${ (paypalLogoElement.offsetLeft / paypalLabelContainerElement.offsetWidth) * 100 }`
        : '44.5';

    return {
        labelFontSize,
        paypalLabelContainerElement,
        paypalLogoStartingLeftPosition
    };
};

const createAnimation = function (animationProps, cssClasses) : void | null {
    const { ANIMATION_LABEL_CONTAINER, ANIMATION_CONTAINER, DOM_READY, PAYPAL_LOGO } = cssClasses;
    const { paypalLabelContainerElement, paypalLogoStartingLeftPosition, labelFontSize } = animationProps;
    const animations = `
        .${ DOM_READY } .${ ANIMATION_CONTAINER } img.${ PAYPAL_LOGO }-paypal{
            animation: 3s move-logo-to-left-side 1s infinite alternate;
            position:fixed;
        }
        
        .${ ANIMATION_CONTAINER } .${ ANIMATION_LABEL_CONTAINER } {
            animation: 3s divide-logo-animation-right-side 1s infinite alternate;
            text-align: center;
            width: 100%;
            font-size: ${ labelFontSize }px;
        }

        .${ DOM_READY } .${ ANIMATION.CONTAINER } img.${ LOGO_CLASS.LOGO }-pp{
            animation: 3s move-small-paypal 1s infinite alternate;
            left:7%;
            opacity:0;
        }

        @keyframes move-logo-to-left-side {
            0%,33% {
                left: ${ paypalLogoStartingLeftPosition }%;
            }
            90%,100% {
                left: 0%;
                opacity:0;
            }
        }
        
        @keyframes move-small-paypal {
            0%,33%,66% {
                opacity:0;
            }
            90%,100% {
                left: 7%;
                opacity:1;
            }
        }
        
        @keyframes divide-logo-animation-right-side {
            0%,33%,66%{
                opacity: 0;
            }
            90%, 100% {
                opacity: 1;                    
            }
        }
    `;

    if (paypalLabelContainerElement) {
        const style = document.createElement('style');
        paypalLabelContainerElement.appendChild(style);
        style.appendChild(document.createTextNode(animations));
    }
};

export function setupSwitchLogoAndShowLabelTextAnimation (animationLabelText : String, logoColor : String) : ButtonAnimationOutputParams {
    const animationProps = { animationLabelText, logoColor };
    const animationConfig = {
        tiny:       { min: BUTTON_SIZE_STYLE.tiny.minWidth   },
        small:      { max: BUTTON_SIZE_STYLE.small.maxWidth   },
        medium:     { max: BUTTON_SIZE_STYLE.medium.maxWidth },
        cssClasses: {
            DOM_READY:                  CLASS.DOM_READY,
            ANIMATION_CONTAINER:        ANIMATION.CONTAINER,
            PAYPAL_LOGO:                LOGO_CLASS.LOGO,
            ANIMATION_LABEL_CONTAINER:  ANIMATION.LABEL_CONTAINER,
            PAYPAL_BUTTON_LABEL:        CLASS.BUTTON_LABEL
        }
    };
    const buttonAnimationScript = `
        const animationProps = ${ getAnimationProps.toString() }( document, ${ JSON.stringify(animationConfig) });
        if (animationProps && animationProps.paypalLabelContainerElement && animationProps.paypalLogoStartingLeftPosition) {
            const animation = ${ createAnimation.toString() }
            animation(animationProps, ${ JSON.stringify(animationConfig.cssClasses) })
        }
    `;
    return {
        buttonAnimationContainerClass: ANIMATION.CONTAINER,
        buttonAnimationScript,
        buttonAnimationComponent:      (<AnimationComponent { ...animationProps } />)
    };
}
