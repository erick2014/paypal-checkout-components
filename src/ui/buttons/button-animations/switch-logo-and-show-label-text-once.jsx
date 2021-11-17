/* @flow */
/** @jsx node */
import { node } from 'jsx-pragmatic/src';

import type { ButtonAnimationOutputParams } from './types';
import { AnimationComponent, createAnimation, animationConfig, getAnimationProps } from './switch-logo-and-show-label-text';

export function setupSwitchLogoAndShowLabelTextOnceAnimation (animationLabelText : String, logoColor : String) : ButtonAnimationOutputParams {
    animationConfig.runOnce = true;
    const componentAnimationProps = { animationLabelText, logoColor };
    const buttonAnimationScript = `
        const animationProps = ${ getAnimationProps.toString() }( document, ${ JSON.stringify(animationConfig) });
        if (animationProps) {
            const animation = ${ createAnimation.toString() }
            animation(animationProps, ${ JSON.stringify(animationConfig.cssClasses) })
        }
    `;
    return {
        buttonAnimationContainerClass: 'switch-logo-show-label-animation',
        buttonAnimationScript,
        buttonAnimationComponent:      (<AnimationComponent { ...componentAnimationProps } />)
    };
}
