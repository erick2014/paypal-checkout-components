/* @flow */

import { type Personalization } from '../props';

import { setupDivideLogoAnimation } from './divide-logo-animation';
import { setupFadeOutLogoAndShowLabelAnimation } from './fadeout-logo-show-label-text';
import { setupLabelTextNextToLogoAnimation } from './label-text-next-to-logo-animation';
import { setupSwitchLogoAndShowLabelTextAnimation } from './switch-logo-and-show-label-text';
import { setupResizeButtonAndShowLabelAnimation } from './resize-button-and-show-label-text';
import type { ButtonAnimationIds, ButtonAnimationOutputParams } from './types';

function setupAnimation(animationId : string, animationLabelText : string, logoColor: string) : ButtonAnimationOutputParams | null {
    const animationIds : ButtonAnimationIds = {
        'run-divide-logo-animation':                        setupDivideLogoAnimation,
        'alternate-slide-logo-animation':                   setupFadeOutLogoAndShowLabelAnimation,
        'run-add-label-text-next-to-logo-animation':        setupLabelTextNextToLogoAnimation,
        'run-switch-logo-and-show-label-text-animation':    setupSwitchLogoAndShowLabelTextAnimation,
        'run-resize-button-and-show-label-animation':       setupResizeButtonAndShowLabelAnimation
    };
    return (animationIds[animationId] && animationIds[animationId](animationLabelText, logoColor));
}

export function getButtonAnimation(personalization : ?Personalization) : ButtonAnimationOutputParams | Object {

    // check valid personalization
    if (
        __WEB__
        || !personalization
        || typeof personalization !== 'object'
        || !personalization.buttonAnimation
    )  {
        return {};
    }
    const {
        buttonAnimation: {
            id: animationId = '',
            text: animationLabelText = 'Safe and easy way to pay'
        } = {}
    } = personalization;

    const animation = setupAnimation(animationId, animationLabelText, logoColor);
    return animation || {};
}
