/* @flow */
/** @jsx node */
import { node, Fragment, ChildType } from 'jsx-pragmatic/src';

import { getDivideLogoAnimationLabelStyles, resizePaypalButtonAnimatioStyles } from './index';

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
    const config = resizePaypalButtonAnimatioStyles(enableResizePaypalButtonAnimation);
    if (!config) {
        return;
    }

    return (
        <div class={ config.labelClass }>
            <div class="left" />
            <div class="center" />
            <div class="text">{config.labelText}</div>
            <div class="right" />
            <style innerHTML={ config.styles } />;
        </div>
    );
}
