import React from 'react';
import css from './DataPickerHeader.scss';
import { ReactComponent as CloseIcon } from '@epam/assets/icons/common/navigation-close-24.svg';
import { Text } from '../typography';
import { IconButton } from '../buttons';
import { FlexRow } from '../layout';

interface DataPickerHeaderProps {
    title?: string;
    close?: () => void;
}

const DataPickerHeaderImpl: React.FC<DataPickerHeaderProps> = props => {
    const title = props.title ? props.title.charAt(0).toUpperCase() + props.title.slice(1) : '';
    
    return (
        <FlexRow alignItems='center' borderBottom size="48" cx={ css.header }>
            <Text font='semibold'>{ title }</Text>
            <IconButton
                icon={ CloseIcon }
                onClick={ () => props.close?.() }
                cx={ css.close }
            />
        </FlexRow>
    );
};

export const DataPickerHeader = React.memo(DataPickerHeaderImpl);