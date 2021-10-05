/* @flow */
import { LOGO_CLASS } from '@paypal/sdk-logos/src';

import { CLASS, DIVIDE_LOGO_ANIMATION, RESIZE_BUTTON_ANIMATION } from '../../../constants';
import { BUTTON_SIZE_STYLE } from '../config';

type ButtonSizeProperties = {|
    min : number,
    max : number
|};

type ButtonSizes = {|
    large : ButtonSizeProperties,
    huge : ButtonSizeProperties
|};

export type ButtonAnimation = {|
    params : ButtonSizes,
    fn : Function
|};


export const createDivideLogoAnimation = () : ButtonAnimation => {
    const animation = () : void => {
        const buttonContainer = document && document.querySelector('.paypal-logo-divide-logo-animation');
        const buttonElement = buttonContainer && buttonContainer.querySelector('.paypal-button-label-container');

        if (buttonContainer && buttonElement) {
            const style = document.createElement('style');
            buttonElement.appendChild(style);

            const logoElement = buttonElement.querySelector('.paypal-logo');
            const buttonLabelText = buttonElement.querySelector('.divide-logo-animation-experiment');
            const containerWidth = buttonElement ? buttonElement.offsetWidth : 0;
            const logoWidth = logoElement && logoElement.offsetWidth;
            const logoWidthSize = logoWidth ? (logoWidth / 2) : 0;
            const logoTranslateSize = (containerWidth / 2) - logoWidthSize;

            const placeholderTextWidth = buttonLabelText ? buttonLabelText.offsetWidth : 0;
            const defaultPlaceholderTranslateSize = placeholderTextWidth && (containerWidth / 2) - placeholderTextWidth;
            const placeholderTranslateSize =  containerWidth - placeholderTextWidth;

            const animations = `
                @keyframes divide-logo-animation-experiment-left-side {
                    100% {
                        transform: translateX(-${ logoTranslateSize }px);
                    }
                }
                
                @keyframes divide-logo-animation-experiment-right-side {
                    0%{
                        opacity: 0;
                        transform: translate(${ defaultPlaceholderTranslateSize }px,-22px);
                    }
                    100% {
                        opacity: 1;
                        transform: translate(${ placeholderTranslateSize }px,-22px);
                    }
                }
            `;
            style.type = 'text/css';
            style.appendChild(document.createTextNode(animations));
        }
    };
    
    return {
        'params': {
            large: { min: BUTTON_SIZE_STYLE.large.minWidth, max: BUTTON_SIZE_STYLE.large.maxWidth },
            huge:  { min: BUTTON_SIZE_STYLE.huge.minWidth, max: BUTTON_SIZE_STYLE.huge.maxWidth }
        },
        'fn': animation
    };
};

export const getDivideLogoAnimationLabelStyles = (enableDivideLogoAnimation) => {
    if (!enableDivideLogoAnimation) {
        return;
    }

    const styles = `
        .${ CLASS.DOM_READY } .${ DIVIDE_LOGO_ANIMATION.LOGO } img.${ LOGO_CLASS.LOGO }{
            animation: 1s divide-logo-animation-experiment-left-side 2s forwards;
            position: relative;
        }

        .${ DIVIDE_LOGO_ANIMATION.LABEL_TEXT } {
            display: block;
            position: absolute;
            opacity: 0; 
            animation: 1s divide-logo-animation-experiment-right-side 2s forwards;
        }

        .${ CLASS.BUTTON_LABEL } .${ DIVIDE_LOGO_ANIMATION.LABEL_TEXT } span {
            font-size: 16px;
            color: #142C8E;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        }

        @media only screen and (max-width: 315px){
            .${ CLASS.BUTTON_LABEL } .${ DIVIDE_LOGO_ANIMATION.LABEL_TEXT } span {
                font-size: 14px;
                padding-top: 3px;
            }
        }
    `;

    return {
        labelText:  'Earn rewards',
        labelClass:  DIVIDE_LOGO_ANIMATION.LABEL_TEXT,
        styles
    };
};

export const createResizeButtonAnimation = () => {
 
    const animation = (params) : void => {
        try {
            const { large, huge  } = params;
            const { ANIMATION_CONTAINER, BUTTON_LABEL, LOGO_CLASS_LOGO } = params.cssClasses;
    
            const animationContainerElement = document && document.querySelector(`.${ ANIMATION_CONTAINER }`);
            if (!animationContainerElement) {
                return;
            }
            
            const buttonWidth = animationContainerElement.offsetWidth;

            if (buttonWidth < large.min || buttonWidth > huge.max) {
                return;
            }

            const paypalLabelContainer = animationContainerElement && animationContainerElement.querySelector(`.${ BUTTON_LABEL }`);
            const logoElement = paypalLabelContainer.querySelector(`.${ LOGO_CLASS_LOGO }`);
            const leftElement = animationContainerElement.querySelector(`${ ANIMATION_CONTAINER }-left`);
            const leftStartPositionX =  leftElement ? parseInt(leftElement.getBoundingClientRect().left, 10) : 0;
            const rightElement = paypalLabelContainer.querySelector(`${ ANIMATION_CONTAINER }-right`);
            const rightStartPositionX = rightElement ? parseInt(rightElement.getBoundingClientRect().left, 10) : 0;
            const buttonHeight = animationContainerElement.offsetHeight;
            const mainContainerWidth = animationContainerElement.offsetWidth;
            const leftSiseWidth = mainContainerWidth;
            const logoContainerWidthSize = ((mainContainerWidth * 35) / 100);
            const logoSizeRemaining = (logoContainerWidthSize - logoElement.offsetWidth) / 2;
            const logoTranslateXSize = (buttonWidth / 2) - logoSizeRemaining;
            const paypalLabelContainerTopPosition = (paypalLabelContainer && paypalLabelContainer.getBoundingClientRect().top) || 0;
            
            const keyFrameAnimations = `
                .${ ANIMATION_CONTAINER } .${ ANIMATION_CONTAINER }-right,
                .${ ANIMATION_CONTAINER } .${ ANIMATION_CONTAINER }-left,
                .${ ANIMATION_CONTAINER } .${ ANIMATION_CONTAINER }-text,
                .${ ANIMATION_CONTAINER } .${ BUTTON_LABEL }  img.${ LOGO_CLASS_LOGO } {
                    position: absolute;
                }
    
                .${ ANIMATION_CONTAINER } .${ ANIMATION_CONTAINER }-right {
                    height: ${ buttonHeight }px;
                    width: ${ buttonWidth }px;
                    background: rgb(27,49,138);
                    transform: translate(-${ rightStartPositionX }px, -${ Math.round(paypalLabelContainerTopPosition)  }px);
                    z-index: 8;
                    border-radius: 8px 0 0px 8px;
                }
    
                .${ ANIMATION_CONTAINER } .${ ANIMATION_CONTAINER }-left {
                    height: ${ buttonHeight }px;
                    background: rgb(255, 196, 57);
                    width: ${ buttonWidth }px;
                    transform: translate(-${ leftStartPositionX }px, -${ Math.round(paypalLabelContainerTopPosition) }px);
                    z-index: 9;
                    animation: 1s left-animate 1s ease-in-out forwards;
                    border-radius: 3px;
                }
    
                .${ ANIMATION_CONTAINER } .${ ANIMATION_CONTAINER }-text {
                    opacity:0;
                    color:  rgb(255, 196, 57);
                    z-index: 9;
                    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                    font-size: 16px;
                    animation: 1s text-animate 1s ease-in-out forwards;
                    right: 0;
                    left: ${ logoContainerWidthSize }px;
                    text-align: center;
                }
    
                .${ ANIMATION_CONTAINER } .${ BUTTON_LABEL } img.${ LOGO_CLASS_LOGO } {
                    transform: translateX(-50%);
                    z-index: 10;
                    animation: 1s  move-logo-to-left-side 1s ease-in-out forwards;
                }
    
                @keyframes move-logo-to-left-side{
                    100%{
                        transform: translateX(-${ logoTranslateXSize }px);
                    }
                }
        
                @keyframes left-animate{
                    0%{
                        background: rgb(255, 196, 57);
                        width: ${ leftSiseWidth }px;
                        border-radius: 3px;
                    }
    
                    10%{
                        background: rgb(255, 196, 57);
                        width: ${ leftSiseWidth }px;
                        border-radius: 0 15px 15px 0;
                    }
                   
                    100%{
                        background-color:rgb(255, 196, 57);
                        width: ${ logoContainerWidthSize }px;
                        border-radius: 0 15px 15px 0;
                    }
                }
    
                @keyframes text-animate{
                    0%{
                        color: rgb(255, 196, 57);
                        opacity: 0;
                    }
                    50%{
                        color: rgb(255, 196, 57);
                        opacity: 0;
                    }
                    80%{
                        color:rgb(27,49,138);
                        opacity: 0;
                    }
                    100%{
                        opacity: 1;
                        color: white;
                    }
                }
            `;
            const style = document.createElement('style');
            paypalLabelContainer.appendChild(style);
            style.type = 'text/css';
            style.appendChild(document.createTextNode(keyFrameAnimations));
        // eslint-disable-next-line no-empty
        } catch (error) { }
    };

    const { CONTAINER, LABEL_CONTAINER } = RESIZE_BUTTON_ANIMATION;

    return {
        'params': {
            large:      {
                min: BUTTON_SIZE_STYLE.large.minWidth,
                max: BUTTON_SIZE_STYLE.large.maxWidth
            },
            huge:       {
                min: BUTTON_SIZE_STYLE.huge.minWidth,
                max: BUTTON_SIZE_STYLE.huge.maxWidth
            },
            cssClasses: {
                ANIMATION_CONTAINER:       CONTAINER,
                BUTTON_LABEL:              CLASS.BUTTON_LABEL,
                LOGO_CLASS_LOGO:                 LOGO_CLASS.LOGO
            }
        },
        'fn': animation
    };
};

export const resizePaypalButtonAnimationConfig = (enableResizeButtonAnimation : boolean) => {
    if (!enableResizeButtonAnimation) {
        return;
    }

    const { CONTAINER } = RESIZE_BUTTON_ANIMATION;

    return {
        labelText:  'Buy now Pay Later',
        labelClass:  CONTAINER
    };
};


