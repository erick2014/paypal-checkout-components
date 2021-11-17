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
        <div class={ config.labelClass } data-animation-experiment={ config.experimentName }>
            <PPLogo logoColor={ logoColor } />
            <span>{config.labelText}</span>
            <style innerHTML={ `
                .${ CLASS.DOM_READY } .${ ANIMATION.CONTAINER } img.${ LOGO_CLASS.LOGO }-pp{
                    position: relative;
                    opacity:0;
                }
                .${ ANIMATION.CONTAINER } .${ ANIMATION.LABEL_CONTAINER } {
                    opacity: 0; 
                    color: #142C8E;
                    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                }
            ` } />
        </div>
    );
}

// Returns label container if the button sizes match
const getAnimationProps = function(document, configuration) : AnimationProps | null {
    let labelFontSize = 8;
    const { ANIMATION_CONTAINER, ANIMATION_LABEL_CONTAINER, PAYPAL_BUTTON_LABEL } = configuration.cssClasses;
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
    return {
        labelFontSize,
        paypalLabelContainerElement
    };
};

const createAnimation = function (animationProps, cssClasses) : void | null {
    const { ANIMATION_LABEL_CONTAINER, ANIMATION_CONTAINER, DOM_READY, PAYPAL_LOGO } = cssClasses;
    const { paypalLabelContainerElement, labelFontSize } = animationProps;
    const animations = `
        .${ DOM_READY } .${ ANIMATION_CONTAINER } img.${ PAYPAL_LOGO }-paypal{
            animation: 4s move-logo-to-left-side 0.5s infinite alternate;
            position:fixed;
            transform:translateX(-50%);
        }

        .${ ANIMATION_CONTAINER } .${ ANIMATION_LABEL_CONTAINER } {
            position: fixed;
            animation: 4s divide-logo-animation-right-side 0.5s infinite alternate;
            text-align: center;
            width: 100%;
            font-size: ${ labelFontSize }px;
            padding-top: 1px;
        }

        .${ DOM_READY } .${ ANIMATION.CONTAINER } img.${ LOGO_CLASS.LOGO }-pp{
            animation: 4s move-small-paypal 0.5s infinite alternate;
            padding-right: 4px;
        }

        @keyframes move-logo-to-left-side {
            0%,33% {
                transform: translateX(-50%);
                opacity:1;
            }
            50%,100% {
                position:fixed;
                transform: translateX(-94%);
                opacity:0;
            }
        }
        
        @keyframes move-small-paypal {
            0%,33%{
                opacity:0;
            }
            51%,100% {
                opacity:1;
            }
        }
        
        @keyframes divide-logo-animation-right-side {
            0%,33%{
                opacity: 0;
            }
            51%, 100% {
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
        if (animationProps) {
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
