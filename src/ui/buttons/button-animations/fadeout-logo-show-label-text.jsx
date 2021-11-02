/* @flow */
/** @jsx node */
import { LOGO_CLASS } from '@paypal/sdk-logos/src';
import { node, Fragment, type ChildType } from 'jsx-pragmatic/src';

import { CLASS } from '../../../constants';
import { BUTTON_SIZE_STYLE } from '../config';

import type { ButtonAnimationOutputParams, LabelOptions, DivideLogoAnimationProps } from './types';

export const ANIMATION_CLASSES = {
    LABEL_CONTAINER: ('fadeout-logo-show-label-animation-container' : 'fadeout-logo-show-label-animation-container'),
    CONTAINER:       ('fadeout-logo-show-label-animation' : 'fadeout-logo-show-label-animation')
};

export const animationConfig = (ANIMATION) => ({
    tiny:       { min: BUTTON_SIZE_STYLE.tiny.minWidth },
    medium:     { max: BUTTON_SIZE_STYLE.medium.maxWidth },
    cssClasses: {
        DOM_READY:                  CLASS.DOM_READY,
        ANIMATION_CONTAINER:        ANIMATION.CONTAINER,
        PAYPAL_LOGO:                LOGO_CLASS.LOGO,
        ANIMATION_LABEL_CONTAINER:  ANIMATION.LABEL_CONTAINER,
        PAYPAL_BUTTON_LABEL:        CLASS.BUTTON_LABEL
    }
});

export function AnimationComponent({ animationLabelText, cssClasses } : LabelOptions) : ChildType {
    // experimentName must match elmo experiment name
    const config = {
        labelText:      animationLabelText,
        labelClass:     cssClasses.LABEL_CONTAINER,
        experimentName: 'Varied_Button_Design'
    };
   
    return (
        <Fragment>
            <div class={ config.labelClass } data-animation-experiment={ config.experimentName }> <span>{config.labelText}</span></div>
            <style innerHTML={ `
                .${ CLASS.DOM_READY } .${ cssClasses.CONTAINER } img.${ LOGO_CLASS.LOGO }{
                    position: relative;
                }
                
                .${ cssClasses.CONTAINER } .${ cssClasses.LABEL_CONTAINER } {
                    position: fixed;
                    opacity: 0; 
                    color: #142C8E;
                    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                    font-size: 10px;
                }
            ` } />;
        </Fragment>
    );
}

// Returns label container if the button sizes match
export const getAnimationProps = function(document, configuration) : DivideLogoAnimationProps | null {
    const { ANIMATION_CONTAINER, ANIMATION_LABEL_CONTAINER, PAYPAL_BUTTON_LABEL, PAYPAL_LOGO } = configuration.cssClasses;
    const { tiny, medium } = configuration;
    // get the animation main container to force specificity( in css ) and make sure we are running the right animation
    const animationContainer = (document && document.querySelector(`.${ ANIMATION_CONTAINER }`)) || null;
    if (!animationContainer) {
        return null;
    }

    // return null if animation should not be played for the button size
    const animationContainerWidth = animationContainer.offsetWidth;
    if (animationContainerWidth < tiny.min || animationContainerWidth > medium.max) {
        // remove label element from dom
        animationContainer.querySelector(`.${ ANIMATION_LABEL_CONTAINER }`).remove();
        return null;
    }

    // get the label container that animation will be applied to
    const paypalLabelContainerElement = animationContainer.querySelector(`.${ PAYPAL_BUTTON_LABEL }`) || null;
    // get starting position for element so it doesn't jump when animation begins
    const paypalLogoElement = (paypalLabelContainerElement && paypalLabelContainerElement.querySelector(`.${ PAYPAL_LOGO }`)) || null;
    const paypalLogoStartingLeftPosition = paypalLogoElement
        ? `${ (paypalLogoElement.offsetLeft / paypalLabelContainerElement.offsetWidth) * 100 }`
        : '44.5';

    return {
        paypalLabelContainerElement,
        paypalLogoStartingLeftPosition
    };
};

const createAnimation = function (animationProps, cssClasses) : void | null {
    const { ANIMATION_LABEL_CONTAINER, ANIMATION_CONTAINER, DOM_READY, PAYPAL_LOGO } = cssClasses;
    const { paypalLabelContainerElement, paypalLogoStartingLeftPosition } = animationProps;
    const animations = `
        .${ DOM_READY } .${ ANIMATION_CONTAINER } img.${ PAYPAL_LOGO }{
            animation: 2s move-logo-to-left-side 2s infinite alternate;
            position:fixed;
            left: ${ paypalLogoStartingLeftPosition }%;
        }
        
        .${ ANIMATION_CONTAINER } .${ ANIMATION_LABEL_CONTAINER } {
            animation: 2s divide-logo-animation-right-side 2s infinite alternate;
            text-align: center;
            width: 100%;
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

export function setupFadeOutLogoAndShowLabelAnimation (animationLabelText : string) : ButtonAnimationOutputParams {
    const animationProps = { animationLabelText, cssClasses: ANIMATION_CLASSES  };
    const buttonAnimationScript = `
        const animationProps = ${ getAnimationProps.toString() }( document, ${ JSON.stringify(animationConfig(ANIMATION_CLASSES)) });
        if (animationProps && animationProps.paypalLabelContainerElement && animationProps.paypalLogoStartingLeftPosition) {
            const animation = ${ createAnimation.toString() }
            animation(animationProps, ${ JSON.stringify(animationConfig.cssClasses) })
        }
    `;
    return {
        buttonAnimationContainerClass: ANIMATION_CLASSES.CONTAINER,
        buttonAnimationScript,
        buttonAnimationComponent:      (<AnimationComponent { ...animationProps } />)
    };
}
