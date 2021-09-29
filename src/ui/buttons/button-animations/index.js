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
        const styles = params.cssClasses;
        const animationContainerElement = document && document.querySelector(`.${ styles.CONTAINER }`);
        const labelContainerElement = animationContainerElement && animationContainerElement.querySelector(`.${ styles.BUTTON_LABEL }`);
        const labelAnimationElement = labelContainerElement && labelContainerElement.querySelector(`.${ styles.ANIMATION_LABEL_CONTAINER }`);
        
        const style = document.createElement('style');
        labelAnimationElement.appendChild(style);

        const keyFrameAnimations = `
            @keyframes center-animate{
                0%{
                    background-color: rgb(246, 191, 66);
                }
    
                20%{
                    background-color:rgb(237,185,63);
                }
    
                40%{
                    background-color: rgb(228,178,67);
                }
    
                60%{
                    background-color: rgb(193, 157, 79);
                }
    
                80% {
                    background-color: rgb(123, 110, 105);
                }
                100%{
                    transform: scaleX(-218);
                    background-color:rgb(27,49,138);
                }
            }
    
            @keyframes move-logo-to-left-side{
                100%{
                    transform: translateX(-110px);
                }
            }
    
            @keyframes left-animate{
                100%{
                    background-color:rgb(255, 196, 57);
                    transform: translateX(-230px);
                }
            }
        
            @keyframes right-animate{
                0%{
                    background-color: rgb(246, 191, 66);
                }
    
                20%{
                    background-color:rgb(237,185,63);
                }
    
                40%{
                    background-color: rgb(228,178,67);
                }
    
                60%{
                    background-color: rgb(193, 157, 79);
                }
    
                80% {
                    background-color: rgb(123, 110, 105);
                }
                100%{
                    background-color:rgb(27,49,138);
                }
            }
    
            @keyframes text-animate{
                100%{
                    opacity: 1;
                    color:white;
                }
            }
        `;
        style.type = 'text/css';
        style.appendChild(document.createTextNode(keyFrameAnimations));
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
                CONTAINER,
                BUTTON_LABEL:              CLASS.BUTTON_LABEL,
                ANIMATION_LABEL_CONTAINER: LABEL_CONTAINER
            }
        },
        'fn': animation
    };
};

export const resizePaypalButtonAnimatioStyles = (enableResizeButtonAnimation : boolean) => {
    if (!enableResizeButtonAnimation) {
        return;
    }

    const { CONTAINER, LABEL_CONTAINER } = RESIZE_BUTTON_ANIMATION;

    const styles = `
        .${ CONTAINER } .${ LABEL_CONTAINER } {
            opacity: 1;
            position: relative;
            height: 55px;
            transform: translate(328px,-43.9px);
        }

        .${ CONTAINER } .${ LABEL_CONTAINER } .left,
        .${ CONTAINER } .${ LABEL_CONTAINER } .center, 
        .${ CONTAINER } .${ LABEL_CONTAINER } .right, 
        .${ CONTAINER } .${ LABEL_CONTAINER } .text,
        .${ CONTAINER } .${ LABEL_CONTAINER } .button-right-corner  {
            position: absolute;
            top:0;
            bottom: 0;
        }

        .${ CONTAINER } .${ LABEL_CONTAINER }  .center {
            background: rgb(255, 196, 57);
            width: 1px;
            transform-origin: left;
            animation: center-animate 0.5s ease-in forwards;
            z-index: 100;
        }

        .${ CONTAINER } .${ LABEL_CONTAINER }  .right {
            border-radius:  0 4px 4px 0;
            transform: translateX(-1px);
            width: 12px;
            animation: right-animate 0.5s ease-in forwards;
            left: 0px;
        }

        .${ CONTAINER } .${ LABEL_CONTAINER }  .text {
            opacity: 0;
            color: rgb(246, 191, 66);
            transform: translate(-150px,18px);
            animation: text-animate 0.5s ease-in  forwards;
            z-index: 1000;
            height: 24px;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            font-size: 16px;
        }

        .${ CONTAINER } .${ LABEL_CONTAINER }  .left {
            border-radius:  0 10px 10px 0;
            transform: translateX(-13px);
            width: 20px;
            animation: left-animate 0.5s ease-in forwards;
            left: 2px;
            z-index: 1000;
        }

        .${ CONTAINER } .${ CLASS.BUTTON_LABEL }  img.${ LOGO_CLASS.LOGO } {
            height: 100%;
            animation: move-logo-to-left-side 0.5s ease-in forwards;
        }
    `;

    return {
        labelText:  'Earn rewards',
        labelClass:  LABEL_CONTAINER,
        styles
    };
};


