import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React, { PropsWithChildren } from 'react';
import { FC } from 'react';

export interface IHelpTextPopoverProps {
    content?: string;
}

export const HelpTextPopover: FC<PropsWithChildren<IHelpTextPopoverProps>> = ({ content, children }) => {
    return content
        ? (
            <>
                {children}
                <Tooltip title={content}>
                    <QuestionCircleOutlined className="sha-help-icon" />
                </Tooltip>
            </>
        )
        : <>{children}</>;
};

export default HelpTextPopover;