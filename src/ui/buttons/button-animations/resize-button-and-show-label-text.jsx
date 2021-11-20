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
            <div class='blue-layer' />
            <div class={ config.labelClass } data-animation-experiment={ config.experimentName }>
                <span>{config.labelText}</span>
            </div>
            <style innerHTML={ `
                    .${ ANIMATION.CONTAINER } .blue-layer {
                        position: fixed;
                        opacity: 0;
                    }
                    .${ CLASS.DOM_READY } .${ ANIMATION.CONTAINER } img.${ LOGO_CLASS.LOGO }-pp{
                        position: fixed;
                        opacity:0;
                    }
                    .${ ANIMATION.CONTAINER } .${ ANIMATION.LABEL_CONTAINER } {
                        opacity: 0; 
                        color: white;
                        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                    }
                ` } />
        </Fragment>
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

    const buttonHeight = animationContainer.offsetHeight;
    // get the label container that animation will be applied to
    const paypalLabelContainer = animationContainer.querySelector(`.${ PAYPAL_BUTTON_LABEL }`) || null;
    const labelStylesObject = (paypalLabelContainer && (paypalLabelContainer.currentStyle || window.getComputedStyle(paypalLabelContainer))) || null;
    const marginLabelContainer = (labelStylesObject && labelStylesObject.marginRight) || null;
    return {
        labelFontSize,
        paypalLabelContainerElement: paypalLabelContainer,
        marginLabelContainer,
        buttonHeight
    };
};

const createAnimation = function (animationProps, cssClasses) : void | null {
    const { ANIMATION_LABEL_CONTAINER, ANIMATION_CONTAINER, DOM_READY, PAYPAL_LOGO } = cssClasses;
    const { buttonHeight, paypalLabelContainerElement, labelFontSize, marginLabelContainer } = animationProps;
    const blueLayerPosition = Math.round(parseFloat(marginLabelContainer));
    const animations = `
        .${ DOM_READY } .${ ANIMATION_CONTAINER } img.${ PAYPAL_LOGO }-paypal{
            animation: 4s move-logo-to-left-side 0.5s infinite alternate;
            position:fixed;
            transform:translateX(-50%);
        }

        .${ ANIMATION.CONTAINER } .blue-layer {
            width: 1%;
            height: ${ buttonHeight }px;
            background-color: rgb(43,114,235);
            position: fixed;
            transform: translateY(-25%);
            right: -${ blueLayerPosition }px;
            border-radius: 9px 3px 3px 9px;
            animation: 4s resize-blue-layer 0.5s infinite alternate;
        }

        .${ ANIMATION_CONTAINER } .${ ANIMATION_LABEL_CONTAINER } {
            position: fixed;
            animation: 4s show-text 0.5s infinite alternate;
            font-size: ${ labelFontSize }px;
            padding-top: 1px;
            padding-right: 3%;
            right: 0px;
        }

        .${ DOM_READY } .${ ANIMATION.CONTAINER } img.${ LOGO_CLASS.LOGO }-pp{
            animation: 4s move-small-paypal 0.5s infinite alternate;
            left:0px;
            opacity:0;
        }

        @keyframes resize-blue-layer {
            0%,33%{
                opacity:0;
                width:1%;
            }
            51%,100%{
                opacity:1;
                width: 90%
            }
        }

        @keyframes move-logo-to-left-side {
            0%,33% {
                transform: translateX(-50%);
                opacity:1;
            }
            50%,100% {
                position:fixed;
                transform: translateX(-100%);
                opacity:0;
            }
        }

        @keyframes show-text {
            0%,33%{
                opacity: 0;
            }
            51%, 100% {
                opacity: 1;                    
            }
        }

        @keyframes move-small-paypal {
            0%,33%{
                opacity:0;
            }
            51%,100% {
                left:0px;
                opacity:1;
            }
        }
    `;

    if (paypalLabelContainerElement) {
        const style = document.createElement('style');
        paypalLabelContainerElement.appendChild(style);
        style.appendChild(document.createTextNode(animations));
    }
};

export function setupResizeButtonAndShowLabelAnimation (animationLabelText : String, logoColor : String) : ButtonAnimationOutputParams {
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
