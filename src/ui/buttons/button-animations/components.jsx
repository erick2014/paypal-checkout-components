/* @flow */
/** @jsx node */
import { node, Fragment, ChildType } from 'jsx-pragmatic/src';

import { getDivideLogoAnimationLabelStyles, resizePaypalButtonAnimationConfig } from './index';

export type LabelOptions = {|
    enableDivideLogoAnimation : ?boolean,
    enableResizePaypalButtonAnimation : ?boolean
|};

export function LabelForDivideLogoAnimation({ enableDivideLogoAnimation } : LabelOptions) : ChildType {
    const config = getDivideLogoAnimationLabelStyles(enableDivideLogoAnimation);
    if (!config) {
        return;
    }

    return (
        <Fragment>
            <div class={ config.labelClass }> <span>{config.labelText}</span></div>
            <style innerHTML={ config.styles } />;
        </Fragment>
    );
}

export function LabelForResizePaypalButtonAnimation({ enableResizePaypalButtonAnimation } : LabelOptions) : ChildType {
    const config = resizePaypalButtonAnimationConfig(enableResizePaypalButtonAnimation);
    if (!config) {
        return;
    }

    return (
        <Fragment>
            <div class={ `${ config.labelClass } left` } />
            <div class={ `${ config.labelClass } text` }>{config.labelText}</div>
            <div class={ `${ config.labelClass } right` } />
        </Fragment>
    );
}
